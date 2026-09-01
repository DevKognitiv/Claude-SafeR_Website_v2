#!/usr/bin/env node
// SafeR nightly catalogue crawler — Crawlee (CheerioCrawler, optional PlaywrightCrawler).
// Usage: node crawl.mjs [--dry-run] [--brand reolink,eufy] [--limit 20]
import { mkdir, readFile, readdir, rename, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { CheerioCrawler, Configuration, log } from 'crawlee';
import { browserOnlyBrands, extractFor } from './adapters/index.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const productsDir = path.join(root, 'data', 'catalog', 'products');
const reportsDir = path.join(here, 'reports');
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const brandFilter = (args[args.indexOf('--brand') + 1] || '').split(',').filter(Boolean);
const limit = Number(args[args.indexOf('--limit') + 1]) || Infinity;
const useBrowser = process.env.CRAWL_BROWSER === '1';
const USER_AGENT = 'SafeRCatalogBot/2.0 (+https://safer.ci; catalogue technique; contact: support@safer.ci)';
const checkedAt = new Date().toISOString();

Configuration.getGlobalConfig().set('persistStorage', false);
log.setLevel(log.LEVELS.WARNING);

// ---------- load sources
const files = (await readdir(productsDir)).filter((f) => f.endsWith('.json')).sort();
const sources = new Map(); // file → array
const targets = []; // { file, index, product }
for (const file of files) {
  const list = JSON.parse(await readFile(path.join(productsDir, file), 'utf8'));
  sources.set(file, list);
  list.forEach((product, index) => {
    if (brandFilter.length && !brandFilter.includes(product.brand)) return;
    targets.push({ file, index, product });
  });
}
// --limit spreads the sample across brands (round-robin) instead of taking the first file only.
if (Number.isFinite(limit) && targets.length > limit) {
  const byBrand = new Map();
  for (const t of targets) (byBrand.get(t.product.brand) ?? byBrand.set(t.product.brand, []).get(t.product.brand)).push(t);
  const picked = [];
  while (picked.length < limit && byBrand.size) for (const [brand, list] of [...byBrand]) { if (picked.length >= limit) break; picked.push(list.shift()); if (!list.length) byBrand.delete(brand); }
  targets.splice(0, targets.length, ...picked);
}
console.log(`SafeR crawler · ${targets.length} produits · ${useBrowser ? 'HTML + navigateur' : 'HTML uniquement'}${dryRun ? ' · DRY RUN' : ''}`);

// ---------- results
const results = new Map(); // product.id → { status, ...extraction, note }
const setResult = (product, value) => results.set(product.id, { ...results.get(product.id), ...value });

function acceptPrice(product, price, currency) {
  if (price == null || !Number.isFinite(price)) return { ok: false, reason: 'no-price' };
  const previous = product.pricing?.sourcePrice;
  const previousCurrency = product.pricing?.sourceCurrency;
  if (previous && previousCurrency && currency && currency !== previousCurrency) return { ok: false, reason: `currency-changed ${previousCurrency}→${currency}` };
  if (previous && (price < previous * 0.3 || price > previous * 3)) return { ok: false, reason: `out-of-range ${previous}→${price}` };
  if (price < 1 || price > 20000) return { ok: false, reason: `implausible ${price}` };
  return { ok: true };
}

const byUrl = new Map(targets.map((t) => [t.product.sourceUrl, t.product]));
const htmlTargets = targets.filter((t) => !browserOnlyBrands.has(t.product.brand) || useBrowser === false);

const crawler = new CheerioCrawler({
  maxConcurrency: 2,
  maxRequestsPerMinute: 30,
  maxRequestRetries: 2,
  requestHandlerTimeoutSecs: 45,
  respectRobotsTxtFile: true,
  additionalMimeTypes: ['application/json'],
  preNavigationHooks: [async (_ctx, gotOptions) => { gotOptions.headers = { ...gotOptions.headers, 'user-agent': USER_AGENT, 'accept-language': 'en,fr;q=0.8' }; }],
  async requestHandler({ request, $, response }) {
    const product = byUrl.get(request.url) ?? byUrl.get(request.loadedUrl);
    if (!product) return;
    if (response.statusCode >= 400) { setResult(product, { status: 'unreachable', note: `HTTP ${response.statusCode}` }); return; }
    const extraction = await extractFor(product.brand, { $, url: request.loadedUrl ?? request.url, product });
    const looksBlocked = !extraction.title || /access denied|captcha|just a moment|attention required/i.test($('title').text());
    if (looksBlocked && browserOnlyBrands.has(product.brand)) { setResult(product, { status: 'browser-required', sourceTitle: extraction.title }); return; }
    const status = extraction.price != null ? 'ok' : 'ok-no-price';
    setResult(product, { status, sourceTitle: extraction.title, sourcePrice: extraction.price, sourceCurrency: extraction.currency, sourceAvailability: extraction.availability, imageUrl: extraction.imageUrl });
  },
  async failedRequestHandler({ request }, error) {
    const product = byUrl.get(request.url);
    if (!product) return;
    const message = String(error?.message || error).slice(0, 120);
    setResult(product, { status: /robots/i.test(message) ? 'robots-blocked' : 'unreachable', note: message });
  },
});

await crawler.run(htmlTargets.map((t) => ({ url: t.product.sourceUrl, uniqueKey: t.product.id })));

// Optional browser pass for JS-rendered brands.
if (useBrowser) {
  const browserTargets = targets.filter((t) => browserOnlyBrands.has(t.product.brand) || ['browser-required', 'unreachable'].includes(results.get(t.product.id)?.status));
  if (browserTargets.length) {
    try {
      const { PlaywrightCrawler } = await import('crawlee');
      const { load } = await import('cheerio');
      const browserCrawler = new PlaywrightCrawler({
        maxConcurrency: 1,
        maxRequestsPerMinute: 12,
        maxRequestRetries: 1,
        requestHandlerTimeoutSecs: 90,
        respectRobotsTxtFile: true,
        launchContext: { launchOptions: { headless: true } },
        async requestHandler({ request, page }) {
          const product = byUrl.get(request.url);
          if (!product) return;
          await page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => undefined);
          const html = await page.content();
          const extraction = await extractFor(product.brand, { $: load(html), url: page.url(), product });
          setResult(product, { status: extraction.price != null ? 'ok' : 'ok-no-price', sourceTitle: extraction.title, sourcePrice: extraction.price, sourceCurrency: extraction.currency, sourceAvailability: extraction.availability, imageUrl: extraction.imageUrl, note: 'browser' });
        },
        async failedRequestHandler({ request }, error) {
          const product = byUrl.get(request.url);
          if (product) setResult(product, { status: 'unreachable', note: String(error?.message || error).slice(0, 120) });
        },
      });
      await browserCrawler.run(browserTargets.map((t) => ({ url: t.product.sourceUrl, uniqueKey: `b-${t.product.id}` })));
    } catch (error) {
      console.warn(`Navigateur indisponible (${String(error.message).slice(0, 80)}) — installez Playwright : npx playwright install chromium`);
    }
  }
}

// ---------- apply results to sources
const report = { checkedAt, dryRun, browser: useBrowser, totals: { products: targets.length, ok: 0, okNoPrice: 0, priceUpdated: 0, priceRejected: 0, imageAdded: 0, browserRequired: 0, robotsBlocked: 0, unreachable: 0 }, brands: {}, items: [] };
for (const { file, index, product } of targets) {
  const r = results.get(product.id) ?? { status: 'unreachable', note: 'no result' };
  const brand = (report.brands[product.brand] ??= { products: 0, ok: 0, priceUpdated: 0, browserRequired: 0, blocked: 0, failed: 0 });
  brand.products += 1;
  const entry = { id: product.id, brand: product.brand, url: product.sourceUrl, status: r.status, sourcePrice: r.sourcePrice, sourceCurrency: r.sourceCurrency, note: r.note };
  const next = { ...product, crawl: { status: r.status, lastChecked: checkedAt, sourceTitle: r.sourceTitle, sourceAvailability: r.sourceAvailability, sourcePrice: r.sourcePrice != null ? String(r.sourcePrice) : undefined, sourceCurrency: r.sourceCurrency, imageUrl: r.imageUrl, note: r.note } };
  if (r.status === 'ok' || r.status === 'ok-no-price') {
    r.status === 'ok' ? (report.totals.ok += 1, brand.ok += 1) : (report.totals.okNoPrice += 1, brand.ok += 1);
    if (r.sourcePrice != null) {
      const verdict = acceptPrice(product, r.sourcePrice, r.sourceCurrency);
      if (verdict.ok && typeof product.pricing?.manualXof !== 'number') {
        next.pricing = { ...product.pricing, sourcePrice: Math.round(r.sourcePrice * 100) / 100, sourceCurrency: r.sourceCurrency ?? product.pricing?.sourceCurrency ?? 'USD' };
        if (next.pricing.sourcePrice !== product.pricing?.sourcePrice) { report.totals.priceUpdated += 1; brand.priceUpdated += 1; entry.priceUpdated = `${product.pricing?.sourcePrice} → ${next.pricing.sourcePrice}`; }
      } else if (!verdict.ok) { report.totals.priceRejected += 1; entry.priceRejected = verdict.reason; next.crawl.note = verdict.reason; }
    }
    if (r.imageUrl && !product.imageUrl) { next.imageUrl = r.imageUrl; report.totals.imageAdded += 1; entry.imageAdded = true; }
    if (r.sourceAvailability === 'discontinued') { entry.flag = 'discontinued-at-source'; }
  } else if (r.status === 'browser-required') { report.totals.browserRequired += 1; brand.browserRequired += 1; }
  else if (r.status === 'robots-blocked') { report.totals.robotsBlocked += 1; brand.blocked += 1; }
  else { report.totals.unreachable += 1; brand.failed += 1; }
  report.items.push(entry);
  sources.get(file)[index] = next;
}

if (!dryRun) {
  for (const [file, list] of sources) {
    const target = path.join(productsDir, file);
    const temporary = `${target}.tmp`;
    await writeFile(temporary, `${JSON.stringify(list, null, 2)}\n`, 'utf8');
    await rename(temporary, target);
  }
}
await mkdir(reportsDir, { recursive: true });
const reportPath = path.join(reportsDir, `${checkedAt.slice(0, 10)}.json`);
await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
await writeFile(path.join(reportsDir, 'latest.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8');

// ---------- console summary
console.log('\nRésumé par marque');
for (const [brand, b] of Object.entries(report.brands)) console.log(`  ${brand.padEnd(10)} produits ${String(b.products).padStart(3)} · ok ${String(b.ok).padStart(3)} · prix maj ${String(b.priceUpdated).padStart(3)} · navigateur requis ${String(b.browserRequired).padStart(3)} · robots ${String(b.blocked).padStart(3)} · échec ${String(b.failed).padStart(3)}`);
const t = report.totals;
console.log(`\nTotal ${t.products} · ok ${t.ok} (+${t.okNoPrice} sans prix) · prix mis à jour ${t.priceUpdated} · prix refusés ${t.priceRejected} · images ajoutées ${t.imageAdded} · navigateur requis ${t.browserRequired} · robots ${t.robotsBlocked} · injoignables ${t.unreachable}`);
console.log(`Rapport : ${path.relative(root, reportPath)}${dryRun ? ' (aucune source modifiée)' : ''}`);
