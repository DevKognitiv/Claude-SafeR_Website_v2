import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { applyTuyaRule, buildCatalog, computePriceXof, loadSources, outputPath, priceRange } from './catalog-lib.mjs';

const pricing = { rates: { USD: 600, EUR: 655.957, XOF: 1 }, coefficient: 1.8, brandCoefficients: { safer: 2.2 }, roundTo: 500, minimumXof: 4500 };

test('Tuya products are rebranded SafeR with an sf- prefixed reference', () => {
  const product = applyTuyaRule({
    id: 'x', sku: 'TY-GW-01', brand: 'safer', sourceBrand: 'Tuya', model: 'Tuya Zigbee Gateway',
    i18n: { fr: { name: 'Passerelle Tuya Zigbee', tagline: 'Tuya Smart chez vous', description: 'Compatible Tuya Smart et TuyaOS.', highlights: ['Application Tuya'] } },
    specs: [{ key: 'app', value: 'Tuya Smart / Smart Life' }],
  });
  assert.equal(product.brand, 'safer');
  assert.equal(product.sku, 'sf-TY-GW-01');
  assert.equal(product.sourceSku, 'TY-GW-01');
  assert.equal(product.i18n.fr.name, 'Passerelle SafeR Zigbee');
  assert.equal(product.i18n.fr.tagline, 'SafeR chez vous');
  assert.equal(product.i18n.fr.description, 'Compatible SafeR et SafeR.');
  assert.deepEqual(product.i18n.fr.highlights, ['Application SafeR']);
  assert.equal(product.specs[0].value, 'SafeR / Smart Life');
  assert.ok(!JSON.stringify(product.i18n).match(/tuya/i), 'no Tuya mention remains in copy');
});

test('the sf- prefix is not doubled on re-runs', () => {
  const once = applyTuyaRule({ id: 'x', sku: 'TY-1', brand: 'safer', sourceBrand: 'Tuya', i18n: {} });
  const twice = applyTuyaRule(once);
  assert.equal(twice.sku, 'sf-TY-1');
  assert.equal(twice.sourceSku, 'TY-1');
});

test('non-Tuya products are untouched', () => {
  const input = { id: 'r', sku: 'RL-1', brand: 'reolink', sourceBrand: 'Reolink', i18n: { fr: { name: 'Argus', tagline: 't', description: 'd', highlights: [] } } };
  assert.deepEqual(applyTuyaRule(input), input);
});

test('price = source × rate × coefficient, rounded', () => {
  assert.equal(computePriceXof({ brand: 'reolink', pricing: { sourcePrice: 169.99, sourceCurrency: 'USD' } }, pricing), 183500);
  assert.equal(computePriceXof({ brand: 'safer', pricing: { sourcePrice: 20, sourceCurrency: 'USD' } }, pricing), 26500);
  assert.equal(computePriceXof({ brand: 'reolink', pricing: { manualXof: 149000 } }, pricing), 149000);
  assert.equal(computePriceXof({ brand: 'reolink', pricing: { sourcePrice: 1, sourceCurrency: 'USD' } }, pricing), 4500);
  assert.equal(computePriceXof({ brand: 'reolink', pricing: {} }, pricing), null);
});

test('price ranges map to filter buckets', () => {
  assert.equal(priceRange(null), 'sur-devis');
  assert.equal(priceRange(20000), 'moins-50k');
  assert.equal(priceRange(90000), '50k-150k');
  assert.equal(priceRange(200000), '150k-300k');
  assert.equal(priceRange(400000), 'plus-300k');
});

test('the source catalogue builds without validation errors', async () => {
  const sources = await loadSources();
  const catalog = buildCatalog(sources);
  assert.ok(catalog.products.length >= 60, `expected an exhaustive catalogue, got ${catalog.products.length}`);
  const tuya = catalog.products.filter((p) => p.sourceBrand === 'Tuya');
  assert.ok(tuya.length > 0, 'the SafeR (Tuya) range is present');
  for (const product of tuya) {
    assert.equal(product.brand, 'safer');
    assert.match(product.sku, /^sf-/);
    for (const copy of Object.values(product.i18n)) assert.ok(!/tuya/i.test(JSON.stringify(copy)), `${product.id}: Tuya still mentioned`);
  }
  for (const product of catalog.products) assert.ok(product.priceXof === null || product.priceXof >= 4500, `${product.id}: price`);
});

test('the generated catalogue is up to date with the sources', async () => {
  const generated = JSON.parse(await readFile(outputPath, 'utf8'));
  const sources = await loadSources();
  const fresh = buildCatalog(sources, generated);
  assert.deepEqual(generated.products.map((p) => [p.id, p.sku, p.priceXof]), fresh.products.map((p) => [p.id, p.sku, p.priceXof]), 'run `npm run catalog:build`');
});
