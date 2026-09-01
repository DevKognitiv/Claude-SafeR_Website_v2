// Generic product-page extraction shared by all brand adapters.
// Returns { title, price, currency, availability, imageUrl } with undefined for anything not found.

const currencySymbols = { '€': 'EUR', '$': 'USD', 'US$': 'USD', '£': 'GBP', '¥': 'CNY', '￥': 'CNY', 'CHF': 'CHF', 'XOF': 'XOF', 'FCFA': 'XOF' };

export function parsePrice(raw) {
  if (raw == null) return undefined;
  if (typeof raw === 'number') return Number.isFinite(raw) ? raw : undefined;
  const text = String(raw).replace(/\s| | /g, '');
  const match = text.match(/(\d{1,3}(?:[.,]\d{3})+(?:[.,]\d{1,2})?|\d+(?:[.,]\d{1,2})?)/);
  if (!match) return undefined;
  let value = match[1];
  // Normalise thousand/decimal separators: "1.299,00" → 1299.00 ; "1,299.99" → 1299.99 ; "129,99" → 129.99
  if (/[.,]\d{3}(?:[.,]|$)/.test(value) && /[.,]\d{1,2}$/.test(value)) {
    const decimal = value.slice(-3, -2);
    value = value.replace(decimal === ',' ? /\./g : /,/g, '').replace(',', '.');
  } else if (/[.,]\d{3}$/.test(value) && value.replace(/[.,]/g, '').length > 3) {
    value = value.replace(/[.,]/g, '');
  } else {
    value = value.replace(',', '.');
  }
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? number : undefined;
}

export function detectCurrency(raw, fallback) {
  if (!raw) return fallback;
  const text = String(raw).toUpperCase();
  for (const [symbol, code] of Object.entries(currencySymbols)) if (text.includes(symbol.toUpperCase())) return code;
  const iso = text.match(/\b(EUR|USD|GBP|CNY|XOF|CHF)\b/);
  return iso ? iso[1] : fallback;
}

export function normaliseAvailability(raw) {
  if (!raw) return undefined;
  const value = String(raw).toLowerCase();
  if (/instock|in_stock|in stock|available|en stock|disponible/.test(value)) return 'in-stock';
  if (/outofstock|out_of_stock|out of stock|soldout|sold out|rupture|épuisé|indisponible/.test(value)) return 'out-of-stock';
  if (/preorder|pre-order|précommande/.test(value)) return 'preorder';
  if (/discontinued/.test(value)) return 'discontinued';
  return undefined;
}

function readJsonLd($) {
  const nodes = [];
  $('script[type="application/ld+json"]').each((_, el) => {
    try {
      const value = JSON.parse($(el).contents().text());
      const list = Array.isArray(value) ? value : value['@graph'] ? value['@graph'] : [value];
      nodes.push(...list);
    } catch { /* ignore invalid structured data */ }
  });
  return nodes;
}

export function extractGeneric($, url) {
  const result = {};
  const nodes = readJsonLd($);
  const product = nodes.find((node) => node && (node['@type'] === 'Product' || (Array.isArray(node['@type']) && node['@type'].includes('Product'))));
  if (product) {
    result.title = typeof product.name === 'string' ? product.name.trim() : undefined;
    const image = Array.isArray(product.image) ? product.image[0] : product.image;
    result.imageUrl = typeof image === 'string' ? image : image?.url;
    const offers = Array.isArray(product.offers) ? product.offers[0] : product.offers;
    if (offers) {
      const spec = offers.priceSpecification ? (Array.isArray(offers.priceSpecification) ? offers.priceSpecification[0] : offers.priceSpecification) : null;
      result.price = parsePrice(offers.price ?? offers.lowPrice ?? spec?.price);
      result.currency = offers.priceCurrency ?? spec?.priceCurrency;
      result.availability = normaliseAvailability(offers.availability);
    }
  }
  const meta = (selector) => $(selector).first().attr('content')?.trim();
  result.title ??= meta('meta[property="og:title"]') ?? ($('title').first().text().trim() || undefined);
  result.imageUrl ??= meta('meta[property="og:image"]') ?? meta('meta[name="twitter:image"]');
  if (result.price == null) {
    const amount = meta('meta[property="product:price:amount"]') ?? meta('meta[property="og:price:amount"]') ?? $('[itemprop="price"]').first().attr('content') ?? $('[itemprop="price"]').first().text();
    result.price = parsePrice(amount);
    result.currency ??= meta('meta[property="product:price:currency"]') ?? meta('meta[property="og:price:currency"]') ?? $('[itemprop="priceCurrency"]').first().attr('content');
  }
  if (result.price == null) {
    const candidates = ['.price', '.product-price', '[data-price]', '.price__current', '.money', '.ProductMeta__Price', '.product__price', '.a-price .a-offscreen'];
    for (const selector of candidates) {
      const text = $(selector).first().text().trim() || $(selector).first().attr('data-price');
      const price = parsePrice(text);
      if (price) { result.price = price; result.currency ??= detectCurrency(text); break; }
    }
  }
  if (!result.availability) {
    const availabilityMeta = meta('meta[property="product:availability"]') ?? meta('meta[property="og:availability"]') ?? $('[itemprop="availability"]').first().attr('href');
    result.availability = normaliseAvailability(availabilityMeta);
  }
  if (result.imageUrl && result.imageUrl.startsWith('//')) result.imageUrl = `https:${result.imageUrl}`;
  if (result.imageUrl && result.imageUrl.startsWith('/')) result.imageUrl = new URL(result.imageUrl, url).href;
  return result;
}

/** Shopify stores expose a public JSON endpoint per product handle; several brands (Reolink, eufy) run on Shopify. */
export async function extractShopify(url, fetchImpl = fetch) {
  const match = url.match(/\/products\/([^/?#]+)/);
  if (!match) return null;
  const endpoint = `${new URL(url).origin}/products/${match[1]}.js`;
  const response = await fetchImpl(endpoint, { headers: { accept: 'application/json', 'user-agent': 'SafeRCatalogBot/2.0 (+https://safer.ci; catalogue technique)' }, signal: AbortSignal.timeout(15000) });
  if (!response.ok) return null;
  const data = await response.json();
  const variant = (data.variants || []).find((v) => v.available) || (data.variants || [])[0];
  return {
    title: data.title,
    price: variant?.price != null ? variant.price / 100 : undefined,
    currency: undefined,
    availability: data.available ? 'in-stock' : 'out-of-stock',
    imageUrl: data.featured_image ? (data.featured_image.startsWith('//') ? `https:${data.featured_image}` : data.featured_image) : undefined,
  };
}
