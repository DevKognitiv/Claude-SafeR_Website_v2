// Shared catalogue logic (pure functions) used by the build script, the tests and the crawler.
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const catalogDir = path.join(root, 'data', 'catalog');
export const productsDir = path.join(catalogDir, 'products');
export const outputPath = path.join(root, 'data', 'store-catalog.json');
export const LOCALES = ['fr', 'en', 'es', 'ar', 'zh'];
export const TEXT_FIELDS = ['name', 'tagline', 'description'];
export const LIST_FIELDS = ['highlights', 'inTheBox'];

export async function readJson(file) {
  return JSON.parse(await readFile(file, 'utf8'));
}

export async function loadSources() {
  const taxonomy = await readJson(path.join(catalogDir, 'taxonomy.json'));
  const pricing = await readJson(path.join(catalogDir, 'pricing.json'));
  const files = (await readdir(productsDir)).filter((name) => name.endsWith('.json')).sort();
  const products = [];
  for (const file of files) {
    const list = await readJson(path.join(productsDir, file));
    if (!Array.isArray(list)) throw new Error(`${file}: expected an array of products`);
    for (const product of list) products.push({ ...product, _file: file });
  }
  return { taxonomy, pricing, products };
}

/** Rebrands a Tuya product as SafeR: brand, sku prefix and every text occurrence. */
export function applyTuyaRule(product) {
  const isTuya = /tuya/i.test(product.sourceBrand || '') || product.brand === 'safer';
  if (!isTuya) return product;
  const rebrand = (value) => (typeof value === 'string' ? value.replace(/\bTuya(?:\s*(?:Smart|OS|Expo))?\b/gi, 'SafeR').replace(/\bPowered by SafeR\b/gi, 'SafeR') : value);
  const i18n = {};
  for (const [locale, copy] of Object.entries(product.i18n || {})) {
    const next = { ...copy };
    for (const field of TEXT_FIELDS) if (field in next) next[field] = rebrand(next[field]);
    for (const field of LIST_FIELDS) if (Array.isArray(next[field])) next[field] = next[field].map(rebrand);
    i18n[locale] = next;
  }
  const sourceSku = product.sourceSku || product.sku;
  const sku = /^sf-/i.test(product.sku) ? product.sku : `sf-${sourceSku}`;
  return {
    ...product,
    brand: 'safer',
    sourceBrand: 'Tuya',
    sourceSku,
    sku,
    i18n,
    specs: (product.specs || []).map((spec) => ({ ...spec, value: typeof spec.value === 'string' ? rebrand(spec.value) : Object.fromEntries(Object.entries(spec.value || {}).map(([k, v]) => [k, rebrand(v)])) })),
    install: product.install ? { ...product.install, prerequisites: Object.fromEntries(Object.entries(product.install.prerequisites || {}).map(([k, v]) => [k, rebrand(v)])) } : product.install,
  };
}

export function computePriceXof(product, pricing) {
  const p = product.pricing || {};
  if (typeof p.manualXof === 'number') return Math.max(pricing.minimumXof, Math.round(p.manualXof));
  if (typeof p.sourcePrice !== 'number') return null;
  const rate = pricing.rates[p.sourceCurrency || 'USD'];
  if (!rate) throw new Error(`${product.id}: unknown currency ${p.sourceCurrency}`);
  const coefficient = pricing.brandCoefficients?.[product.brand] ?? pricing.coefficient;
  const raw = p.sourcePrice * rate * coefficient;
  const rounded = Math.round(raw / pricing.roundTo) * pricing.roundTo;
  return Math.max(pricing.minimumXof, rounded);
}

export function computeMonthlyXof(product, pricing) {
  if (typeof product.monthlyXof === 'number') return product.monthlyXof;
  return pricing.serviceMonthlyBySubcategory?.[product.subcategory] ?? pricing.serviceMonthlyXof?.[product.category] ?? null;
}

export function computeWarranty(product, pricing) {
  return product.warrantyMonths ?? pricing.warrantyMonths?.[product.subcategory] ?? pricing.warrantyMonths.default;
}

export function priceRange(priceXof) {
  if (priceXof == null) return 'sur-devis';
  if (priceXof < 50000) return 'moins-50k';
  if (priceXof < 150000) return '50k-150k';
  if (priceXof < 300000) return '150k-300k';
  return 'plus-300k';
}

export function validateProduct(product, taxonomy, seen) {
  const errors = [];
  const where = `${product._file || ''} › ${product.id || '(sans id)'}`;
  const require = (condition, message) => { if (!condition) errors.push(`${where}: ${message}`); };
  require(typeof product.id === 'string' && /^[a-z0-9-]+$/.test(product.id), 'id invalide (slug minuscules)');
  require(!seen.ids.has(product.id), 'id dupliqué');
  require(typeof product.sku === 'string' && product.sku.length > 1, 'sku manquant');
  require(!seen.skus.has(product.sku), `sku dupliqué ${product.sku}`);
  require(taxonomy.brands[product.brand], `marque inconnue ${product.brand}`);
  require(taxonomy.categories[product.category], `catégorie inconnue ${product.category}`);
  require(taxonomy.categories[product.category]?.includes(product.subcategory), `type ${product.subcategory} non autorisé pour ${product.category}`);
  for (const locale of LOCALES) {
    const copy = product.i18n?.[locale];
    require(copy && TEXT_FIELDS.every((f) => typeof copy[f] === 'string' && copy[f].trim()), `i18n.${locale} incomplet`);
    require(Array.isArray(copy?.highlights) && copy.highlights.length >= 2, `i18n.${locale}.highlights (≥ 2)`);
  }
  const a = product.attributes || {};
  require(Array.isArray(a.protocol) && a.protocol.length && a.protocol.every((v) => taxonomy.attributes.protocol.includes(v)), 'attributes.protocol invalide');
  require(taxonomy.attributes.placement.includes(a.placement), 'attributes.placement invalide');
  require(Array.isArray(a.power) && a.power.length && a.power.every((v) => taxonomy.attributes.power.includes(v)), 'attributes.power invalide');
  require(Array.isArray(a.compat) && a.compat.every((v) => taxonomy.attributes.compat.includes(v)), 'attributes.compat invalide');
  if (a.resolution) require(taxonomy.attributes.resolution.includes(a.resolution), 'attributes.resolution invalide');
  require(taxonomy.attributes.availability.includes(product.availability), `availability invalide ${product.availability}`);
  require(product.pricing && (typeof product.pricing.manualXof === 'number' || typeof product.pricing.sourcePrice === 'number'), 'pricing manquant');
  require(typeof product.sourceUrl === 'string' && /^https?:\/\//.test(product.sourceUrl), 'sourceUrl manquante');
  require(Array.isArray(product.specs) && product.specs.length >= 3, 'specs (≥ 3)');
  for (const spec of product.specs || []) {
    const localized = spec.value && typeof spec.value === 'object';
    require(typeof spec.value === 'string' || (localized && LOCALES.every((l) => typeof spec.value[l] === 'string' && spec.value[l].trim())), `spec ${spec.key}: valeur texte ou objet {fr,en,es,ar,zh}`);
  }
  require(['simple', 'standard', 'expert'].includes(product.install?.level), 'install.level invalide');
  for (const solution of product.solutions || []) require(taxonomy.solutionSubcategories[solution], `solution inconnue ${solution}`);
  seen.ids.add(product.id);
  seen.skus.add(product.sku);
  return errors;
}

export function buildCatalog({ taxonomy, pricing, products }, previous = null) {
  const seen = { ids: new Set(), skus: new Set() };
  const errors = [];
  const previousById = new Map((previous?.products || []).map((p) => [p.id, p]));
  const built = [];
  for (const source of products) {
    const product = applyTuyaRule(source);
    errors.push(...validateProduct(product, taxonomy, seen));
    const priceXof = computePriceXof(product, pricing);
    const prev = previousById.get(product.id);
    const { _file, ...rest } = product;
    built.push({
      ...rest,
      priceXof,
      priceRange: priceRange(priceXof),
      monthlyXof: computeMonthlyXof(product, pricing),
      warrantyMonths: computeWarranty(product, pricing),
      brandName: taxonomy.brands[product.brand]?.name ?? product.brand,
      accent: product.accent || taxonomy.brands[product.brand]?.accent || '#52c6ff',
      symbol: product.symbol || '◉',
      sourceFile: _file,
      crawl: source.crawl || prev?.crawl || { status: 'never' },
    });
  }
  if (errors.length) {
    const error = new Error(`Catalogue invalide :\n - ${errors.join('\n - ')}`);
    error.details = errors;
    throw error;
  }
  const order = { featured: 0 };
  built.sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)) || a.brandName.localeCompare(b.brandName) || a.id.localeCompare(b.id));
  void order;
  const brands = Object.fromEntries(Object.entries(taxonomy.brands).map(([id, brand]) => [id, { id, ...brand, count: built.filter((p) => p.brand === id).length }]));
  return {
    generatedAt: new Date().toISOString(),
    lastCatalogSync: previous?.lastCatalogSync ?? new Date().toISOString(),
    schedule: '00:00 UTC',
    pricing: { coefficient: pricing.coefficient, rates: pricing.rates, roundTo: pricing.roundTo },
    taxonomy: { categories: taxonomy.categories, attributes: taxonomy.attributes, solutionSubcategories: taxonomy.solutionSubcategories },
    brands,
    products: built,
  };
}
