// Brand adapters: each returns a partial extraction; the generic extractor fills the gaps.
import { extractGeneric, extractShopify, parsePrice, detectCurrency, normaliseAvailability } from '../extract.mjs';

/** Brands whose product pages need JavaScript rendering — handled by Playwright when CRAWL_BROWSER=1, otherwise marked "browser-required". */
export const browserOnlyBrands = new Set(['safer', 'hikvision', 'dahua']);

/** Default currency by brand (used when the page does not state one). */
export const defaultCurrency = { safer: 'USD', ajax: 'EUR', hikvision: 'USD', ezviz: 'EUR', dahua: 'USD', reolink: 'USD', eufy: 'USD', aqara: 'USD', sonoff: 'USD', somfy: 'EUR', yale: 'EUR', teltonika: 'EUR', ecoflow: 'USD' };

const adapters = {
  async reolink({ $, url }) { return (await safeShopify(url)) ?? extractGeneric($, url); },
  async eufy({ $, url }) { return (await safeShopify(url)) ?? extractGeneric($, url); },
  async sonoff({ $, url }) { return (await safeShopify(url)) ?? extractGeneric($, url); },
  async ecoflow({ $, url }) { return (await safeShopify(url)) ?? extractGeneric($, url); },
  async somfy({ $, url }) {
    const generic = extractGeneric($, url);
    if (generic.price == null) {
      const text = $('.price, .product-price, [class*="price"]').first().text();
      generic.price = parsePrice(text);
      generic.currency ??= detectCurrency(text, 'EUR');
    }
    return generic;
  },
  async ajax({ $, url }) {
    // ajax.systems product pages carry no public price; we only refresh title, image and availability wording.
    const generic = extractGeneric($, url);
    generic.availability ??= normaliseAvailability($('body').text().match(/(in stock|out of stock|discontinued)/i)?.[0]);
    return generic;
  },
  async aqara({ $, url }) { return (await safeShopify(url)) ?? extractGeneric($, url); },
  async yale({ $, url }) { return extractGeneric($, url); },
  async ezviz({ $, url }) { return extractGeneric($, url); },
  async teltonika({ $, url }) { return extractGeneric($, url); },
  async hikvision({ $, url }) { return extractGeneric($, url); },
  async dahua({ $, url }) { return extractGeneric($, url); },
  async safer({ $, url }) { return extractGeneric($, url); },
};

async function safeShopify(url) {
  try { return await extractShopify(url); } catch { return null; }
}

export async function extractFor(brand, context) {
  const adapter = adapters[brand];
  const result = adapter ? await adapter(context) : extractGeneric(context.$, context.url);
  result.currency = result.currency || detectCurrency(result.currency, defaultCurrency[brand]);
  return result;
}
