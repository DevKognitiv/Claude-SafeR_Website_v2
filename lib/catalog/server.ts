import type { Locale } from '@/lib/i18n/config';
import { catalog, products, type Product } from './index';
import { toStoreItem, type StoreItem } from './view';

export function storeItems(locale: Locale, list: Product[] = products): StoreItem[] {
  return list.map((product) => toStoreItem(product, locale));
}

export function brandNames(): Record<string, string> {
  return Object.fromEntries(Object.values(catalog.brands).map((brand) => [brand.id, brand.name]));
}
