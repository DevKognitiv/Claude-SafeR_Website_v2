import { readFile, rename, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const catalogPath = path.join(root, 'data', 'store-catalog.json');
const temporaryPath = `${catalogPath}.tmp`;
const userAgent = 'SafeRCatalogBot/1.0 (+catalogue technique; contact: support SafeR)';
const robotsCache = new Map();

function extractProductJsonLd(html) {
  const scripts = [...html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  for (const match of scripts) {
    try {
      const value = JSON.parse(match[1]);
      const nodes = Array.isArray(value) ? value : value['@graph'] || [value];
      const product = nodes.find((node) => node && (node['@type'] === 'Product' || node['@type']?.includes?.('Product')));
      if (product) return product;
    } catch { /* Invalid structured data is ignored without altering catalog content. */ }
  }
  return null;
}

function robotsAllows(text, pathname) {
  const lines = text.split(/\r?\n/).map((line) => line.replace(/#.*/, '').trim()).filter(Boolean);
  let applies = false;
  const disallowed = [];
  for (const line of lines) {
    const [rawKey, ...rest] = line.split(':');
    const key = rawKey.toLowerCase();
    const value = rest.join(':').trim();
    if (key === 'user-agent') applies = value === '*' || value.toLowerCase() === 'safercatalogbot';
    if (applies && key === 'disallow' && value) disallowed.push(value);
  }
  return !disallowed.some((rule) => pathname.startsWith(rule));
}

async function mayCrawl(url) {
  const parsed = new URL(url);
  if (!robotsCache.has(parsed.origin)) {
    try {
      const response = await fetch(`${parsed.origin}/robots.txt`, { headers: { 'user-agent': userAgent }, signal: AbortSignal.timeout(10000) });
      robotsCache.set(parsed.origin, response.ok ? await response.text() : '');
    } catch {
      robotsCache.set(parsed.origin, 'User-agent: *\nDisallow: /');
    }
  }
  return robotsAllows(robotsCache.get(parsed.origin), parsed.pathname);
}

function availabilityLabel(raw) {
  if (!raw) return 'À confirmer';
  const value = String(raw).toLowerCase();
  if (value.includes('instock')) return 'Disponible à la source';
  if (value.includes('outofstock') || value.includes('soldout')) return 'Indisponible à la source';
  if (value.includes('preorder')) return 'Précommande à la source';
  return 'À confirmer';
}

const catalog = JSON.parse(await readFile(catalogPath, 'utf8'));
const checkedAt = new Date().toISOString();

for (const product of catalog.products) {
  const crawl = { ...product.crawl, lastChecked: checkedAt };
  try {
    if (!(await mayCrawl(product.sourceUrl))) {
      product.crawl = { ...crawl, status: 'robots-blocked' };
      continue;
    }
    const response = await fetch(product.sourceUrl, { headers: { accept: 'text/html,application/xhtml+xml', 'user-agent': userAgent }, redirect: 'follow', signal: AbortSignal.timeout(15000) });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const html = await response.text();
    const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.replace(/\s+/g, ' ').trim().slice(0, 180);
    const structured = extractProductJsonLd(html);
    const offers = Array.isArray(structured?.offers) ? structured.offers[0] : structured?.offers;
    product.crawl = {
      ...crawl,
      status: 'ok',
      sourceTitle: title || product.sourceModel,
      sourceAvailability: availabilityLabel(offers?.availability),
      sourcePrice: offers?.price ? String(offers.price).slice(0, 32) : undefined,
      sourceCurrency: offers?.priceCurrency ? String(offers.priceCurrency).slice(0, 8) : undefined
    };
  } catch (error) {
    product.crawl = { ...crawl, status: 'unreachable', note: error instanceof Error ? error.message.slice(0, 100) : 'Erreur inconnue' };
  }
  await new Promise((resolve) => setTimeout(resolve, 750));
}

catalog.lastCatalogSync = checkedAt;
await writeFile(temporaryPath, `${JSON.stringify(catalog, null, 2)}\n`, 'utf8');
await rename(temporaryPath, catalogPath);
console.log(`Catalogue SafeR contrôlé: ${catalog.products.length} références à ${checkedAt}`);
