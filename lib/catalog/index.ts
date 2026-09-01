import catalogData from '@/data/store-catalog.json';
import type { Locale } from '@/lib/i18n/config';
import { defaultLocale } from '@/lib/i18n/config';

export type CategoryId = 'video' | 'alarme' | 'acces' | 'domotique' | 'energie';
export type InstallLevel = 'simple' | 'standard' | 'expert';
export type SortKey = 'featured' | 'priceAsc' | 'priceDesc' | 'newest' | 'name';

export type ProductCopy = { name: string; tagline: string; description: string; highlights: string[]; inTheBox?: string[] };

export type Product = {
  id: string;
  sku: string;
  sourceSku?: string;
  brand: string;
  brandName: string;
  sourceBrand: string;
  model: string;
  category: CategoryId;
  subcategory: string;
  i18n: Record<string, ProductCopy>;
  attributes: { protocol: string[]; placement: string; power: string[]; compat: string[]; resolution?: string };
  specs: { key: string; value: string | Record<string, string> }[];
  pricing: { sourcePrice?: number; sourceCurrency?: string; manualXof?: number };
  priceXof: number | null;
  priceRange: string;
  monthlyXof: number | null;
  availability: string;
  warrantyMonths: number;
  install: { level: InstallLevel; duration: string; prerequisites?: Record<string, string> };
  sourceUrl: string;
  imageUrl?: string;
  accent: string;
  symbol: string;
  featured?: boolean;
  new?: boolean;
  needsVerification?: boolean;
  solutions?: string[];
  related?: string[];
  crawl?: { status: string; lastChecked?: string; sourcePrice?: string; sourceCurrency?: string; sourceAvailability?: string; sourceTitle?: string; imageUrl?: string; note?: string };
};

export type Brand = { id: string; name: string; sourceBrand?: string; origin: string; website: string; accent: string; count: number };

export type Catalog = {
  generatedAt: string;
  lastCatalogSync: string;
  schedule: string;
  pricing: { coefficient: number; rates: Record<string, number>; roundTo: number };
  taxonomy: { categories: Record<CategoryId, string[]>; attributes: Record<string, string[]>; solutionSubcategories: Record<string, string[]> };
  brands: Record<string, Brand>;
  products: Product[];
};

export const catalog = catalogData as unknown as Catalog;
export const products = catalog.products;
export const categoryIds = Object.keys(catalog.taxonomy.categories) as CategoryId[];
export const facetKeys = ['brand', 'protocol', 'placement', 'power', 'compat', 'resolution', 'availability', 'price'] as const;
export type FacetKey = (typeof facetKeys)[number];

export function isCategoryId(value: string): value is CategoryId {
  return (categoryIds as string[]).includes(value);
}

/** Spec values are either language-neutral strings or per-locale objects. */
export function specValue(value: string | Record<string, string>, locale: Locale): string {
  if (typeof value === 'string') return value;
  return value[locale] ?? value[defaultLocale] ?? Object.values(value)[0] ?? '';
}

export function getCopy(product: Product, locale: Locale): ProductCopy {
  return product.i18n[locale] ?? product.i18n[defaultLocale] ?? Object.values(product.i18n)[0];
}

export function getProduct(id: string): Product | undefined {
  return products.find((product) => product.id === id);
}

/** URL-safe product segment derived from the SKU (e.g. "DS-7104NI-Q1/4P" → "ds-7104ni-q1-4p"). */
export function skuSlug(sku: string): string {
  return sku.toLowerCase().replace(/[^a-z0-9.]+/g, '-').replace(/^-+|-+$/g, '');
}

export function getProductBySku(sku: string): Product | undefined {
  const needle = skuSlug(sku);
  return products.find((product) => skuSlug(product.sku) === needle || product.id === needle);
}

export function getBrand(id: string): Brand | undefined {
  return catalog.brands[id];
}

export function productPath(product: Product): string {
  return `/store/${product.category}/${product.subcategory}/${skuSlug(product.sku)}`;
}

export function subcategoriesOf(category: CategoryId): string[] {
  return catalog.taxonomy.categories[category] ?? [];
}

export function productsInCategory(category: CategoryId): Product[] {
  return products.filter((product) => product.category === category);
}

export function productsInSubcategory(category: CategoryId, subcategory: string): Product[] {
  return products.filter((product) => product.category === category && product.subcategory === subcategory);
}

export function productsForSolution(solutionPath: string, limit = 6): Product[] {
  const direct = products.filter((product) => product.solutions?.includes(solutionPath));
  if (direct.length >= limit) return direct.slice(0, limit);
  const subcategories = catalog.taxonomy.solutionSubcategories[solutionPath] ?? [];
  const extra = products.filter((product) => !direct.includes(product) && subcategories.includes(product.subcategory));
  return [...direct, ...extra].slice(0, limit);
}

export function relatedProducts(product: Product, limit = 4): Product[] {
  const explicit = (product.related ?? []).map((id) => getProduct(id)).filter((p): p is Product => Boolean(p) && p!.id !== product.id);
  const sameSub = products.filter((p) => p.id !== product.id && p.subcategory === product.subcategory && !explicit.includes(p));
  const sameCat = products.filter((p) => p.id !== product.id && p.category === product.category && !explicit.includes(p) && !sameSub.includes(p));
  return [...explicit, ...sameSub, ...sameCat].slice(0, limit);
}

export function formatXof(value: number | null | undefined, locale: Locale = 'fr'): string {
  if (value == null) return '—';
  const intl = locale === 'ar' ? 'ar-MA-u-nu-latn' : locale === 'zh' ? 'zh-CN' : locale === 'en' ? 'en-GB' : locale === 'es' ? 'es-ES' : 'fr-FR';
  return new Intl.NumberFormat(intl, { maximumFractionDigits: 0 }).format(value).replace(/[\u202f\u00a0]/g, ' ');
}

export type FilterState = {
  q?: string;
  category?: CategoryId;
  subcategory?: string;
  brand?: string[];
  protocol?: string[];
  placement?: string[];
  power?: string[];
  compat?: string[];
  resolution?: string[];
  availability?: string[];
  price?: string[];
  sort?: SortKey;
};

const multiKeys: (keyof FilterState)[] = ['brand', 'protocol', 'placement', 'power', 'compat', 'resolution', 'availability', 'price'];

export function parseFilters(params: URLSearchParams | Record<string, string | string[] | undefined>): FilterState {
  const get = (key: string): string[] => {
    if (params instanceof URLSearchParams) return params.getAll(key).flatMap((v) => v.split(',')).filter(Boolean);
    const value = params[key];
    if (!value) return [];
    return (Array.isArray(value) ? value : [value]).flatMap((v) => v.split(',')).filter(Boolean);
  };
  const state: FilterState = {};
  const q = get('q')[0];
  if (q) state.q = q.slice(0, 80);
  const category = get('category')[0];
  if (category && isCategoryId(category)) state.category = category;
  const subcategory = get('subcategory')[0];
  if (subcategory) state.subcategory = subcategory;
  for (const key of multiKeys) {
    const values = get(key);
    if (values.length) (state as Record<string, unknown>)[key] = Array.from(new Set(values));
  }
  const sort = get('sort')[0];
  if (sort && ['featured', 'priceAsc', 'priceDesc', 'newest', 'name'].includes(sort)) state.sort = sort as SortKey;
  return state;
}

export function serializeFilters(state: FilterState): string {
  const params = new URLSearchParams();
  if (state.q) params.set('q', state.q);
  if (state.category) params.set('category', state.category);
  if (state.subcategory) params.set('subcategory', state.subcategory);
  for (const key of multiKeys) {
    const values = state[key] as string[] | undefined;
    if (values?.length) params.set(key, values.join(','));
  }
  if (state.sort && state.sort !== 'featured') params.set('sort', state.sort);
  const query = params.toString();
  return query ? `?${query}` : '';
}

function matchesText(product: Product, locale: Locale, q: string): boolean {
  const copy = getCopy(product, locale);
  const haystack = [copy.name, copy.tagline, copy.description, product.sku, product.sourceSku, product.model, product.brandName, product.sourceBrand, ...copy.highlights].filter(Boolean).join(' ').toLowerCase();
  return q.toLowerCase().split(/\s+/).filter(Boolean).every((term) => haystack.includes(term));
}

export function applyFilters(list: Product[], state: FilterState, locale: Locale): Product[] {
  let result = list;
  if (state.category) result = result.filter((p) => p.category === state.category);
  if (state.subcategory) result = result.filter((p) => p.subcategory === state.subcategory);
  if (state.brand?.length) result = result.filter((p) => state.brand!.includes(p.brand));
  if (state.protocol?.length) result = result.filter((p) => p.attributes.protocol.some((v) => state.protocol!.includes(v)));
  if (state.placement?.length) result = result.filter((p) => state.placement!.includes(p.attributes.placement) || (state.placement!.includes('interieur') && p.attributes.placement === 'interieur-exterieur') || (state.placement!.includes('exterieur') && p.attributes.placement === 'interieur-exterieur'));
  if (state.power?.length) result = result.filter((p) => p.attributes.power.some((v) => state.power!.includes(v)));
  if (state.compat?.length) result = result.filter((p) => state.compat!.every((v) => p.attributes.compat.includes(v)));
  if (state.resolution?.length) result = result.filter((p) => p.attributes.resolution && state.resolution!.includes(p.attributes.resolution));
  if (state.availability?.length) result = result.filter((p) => state.availability!.includes(p.availability));
  if (state.price?.length) result = result.filter((p) => state.price!.includes(p.priceRange));
  if (state.q) result = result.filter((p) => matchesText(p, locale, state.q!));
  return sortProducts(result, state.sort ?? 'featured', locale);
}

export function sortProducts(list: Product[], sort: SortKey, locale: Locale): Product[] {
  const copy = [...list];
  const price = (p: Product) => p.priceXof ?? Number.MAX_SAFE_INTEGER;
  switch (sort) {
    case 'priceAsc': return copy.sort((a, b) => price(a) - price(b));
    case 'priceDesc': return copy.sort((a, b) => (b.priceXof ?? -1) - (a.priceXof ?? -1));
    case 'newest': return copy.sort((a, b) => Number(Boolean(b.new)) - Number(Boolean(a.new)) || Number(Boolean(b.featured)) - Number(Boolean(a.featured)));
    case 'name': return copy.sort((a, b) => getCopy(a, locale).name.localeCompare(getCopy(b, locale).name));
    default: return copy.sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)) || Number(Boolean(b.new)) - Number(Boolean(a.new)) || a.brandName.localeCompare(b.brandName));
  }
}

/** Counts how many products would match each facet value, given the other active filters. */
export function facetCounts(list: Product[], state: FilterState, locale: Locale): Record<FacetKey, Record<string, number>> {
  const counts = { brand: {}, protocol: {}, placement: {}, power: {}, compat: {}, resolution: {}, availability: {}, price: {} } as Record<FacetKey, Record<string, number>>;
  for (const key of facetKeys) {
    const without = { ...state, [key]: undefined } as FilterState;
    const base = applyFilters(list, without, locale);
    for (const product of base) {
      const values: string[] = key === 'brand' ? [product.brand] : key === 'availability' ? [product.availability] : key === 'price' ? [product.priceRange] : key === 'placement' ? [product.attributes.placement] : key === 'resolution' ? (product.attributes.resolution ? [product.attributes.resolution] : []) : (product.attributes[key] as string[]);
      for (const value of values) counts[key][value] = (counts[key][value] ?? 0) + 1;
    }
  }
  return counts;
}
