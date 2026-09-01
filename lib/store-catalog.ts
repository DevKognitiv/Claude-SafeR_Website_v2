import catalogData from '@/data/store-catalog.json';

export type StoreProduct = (typeof catalogData.products)[number];
export const storeCatalog = catalogData;

export function formatXof(value: number) {
  return new Intl.NumberFormat('fr-FR').format(value).replace(/\u202f/g, ' ');
}
