import test from 'node:test';
import assert from 'node:assert/strict';
import { load } from 'cheerio';
import { extractGeneric, extractShopify, normaliseAvailability, parsePrice } from './extract.mjs';

test('parsePrice handles international formats', () => {
  assert.equal(parsePrice('169.99'), 169.99);
  assert.equal(parsePrice('€ 1.299,00'), 1299);
  assert.equal(parsePrice('$1,299.99'), 1299.99);
  assert.equal(parsePrice('129,99 €'), 129.99);
  assert.equal(parsePrice('1 299 €'), 1299);
  assert.equal(parsePrice(59), 59);
  assert.equal(parsePrice('Prix sur demande'), undefined);
});

test('JSON-LD Product is preferred', () => {
  const html = `<html><head><title>X</title><meta property="og:image" content="/img/og.png">
  <script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Argus 4 Pro","image":["https://cdn.example.com/a.jpg"],"offers":{"@type":"Offer","price":"169.99","priceCurrency":"USD","availability":"https://schema.org/InStock"}}</script></head><body></body></html>`;
  const result = extractGeneric(load(html), 'https://example.com/product/argus');
  assert.equal(result.title, 'Argus 4 Pro');
  assert.equal(result.price, 169.99);
  assert.equal(result.currency, 'USD');
  assert.equal(result.availability, 'in-stock');
  assert.equal(result.imageUrl, 'https://cdn.example.com/a.jpg');
});

test('Open Graph / microdata fallback', () => {
  const html = `<html><head><title>TaHoma switch | Somfy</title><meta property="og:image" content="//cdn.somfy.fr/tahoma.png"><meta property="product:price:amount" content="199,00"><meta property="product:price:currency" content="EUR"></head><body><span itemprop="availability" href="https://schema.org/OutOfStock"></span></body></html>`;
  const result = extractGeneric(load(html), 'https://www.somfy.fr/produits/1870595');
  assert.equal(result.title, 'TaHoma switch | Somfy');
  assert.equal(result.price, 199);
  assert.equal(result.currency, 'EUR');
  assert.equal(result.availability, 'out-of-stock');
  assert.equal(result.imageUrl, 'https://cdn.somfy.fr/tahoma.png');
});

test('CSS price fallback with currency detection', () => {
  const html = `<html><head><title>Hub 2</title></head><body><div class="product-price">€ 249,00</div></body></html>`;
  const result = extractGeneric(load(html), 'https://example.com/p');
  assert.equal(result.price, 249);
  assert.equal(result.currency, 'EUR');
});

test('Shopify .js endpoint parsing', async () => {
  const fakeFetch = async () => ({ ok: true, json: async () => ({ title: 'Video Doorbell E340', available: true, featured_image: '//cdn.shopify.com/e340.png', variants: [{ available: false, price: 17999 }, { available: true, price: 15999 }] }) });
  const result = await extractShopify('https://www.eufy.com/products/t8214111', fakeFetch);
  assert.equal(result.title, 'Video Doorbell E340');
  assert.equal(result.price, 159.99);
  assert.equal(result.availability, 'in-stock');
  assert.equal(result.imageUrl, 'https://cdn.shopify.com/e340.png');
});

test('availability wording is normalised', () => {
  assert.equal(normaliseAvailability('https://schema.org/PreOrder'), 'preorder');
  assert.equal(normaliseAvailability('Rupture de stock'), 'out-of-stock');
  assert.equal(normaliseAvailability('Discontinued'), 'discontinued');
  assert.equal(normaliseAvailability(''), undefined);
});
