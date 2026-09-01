import type { Locale } from '@/lib/i18n/config';
import { getCopy, productPath, type Product } from './index';

/** Lightweight, locale-resolved product used by client components (no 5-language payload). */
export type StoreItem = {
  id: string;
  sku: string;
  path: string;
  name: string;
  tagline: string;
  description: string;
  highlights: string[];
  brand: string;
  brandName: string;
  sourceBrand: string;
  model: string;
  category: Product['category'];
  subcategory: string;
  attributes: Product['attributes'];
  priceXof: number | null;
  priceRange: string;
  monthlyXof: number | null;
  availability: string;
  warrantyMonths: number;
  featured: boolean;
  isNew: boolean;
  accent: string;
  symbol: string;
  imageUrl?: string;
};

export function toStoreItem(product: Product, locale: Locale): StoreItem {
  const copy = getCopy(product, locale);
  return {
    id: product.id,
    sku: product.sku,
    path: productPath(product),
    name: copy.name,
    tagline: copy.tagline,
    description: copy.description,
    highlights: copy.highlights.slice(0, 3),
    brand: product.brand,
    brandName: product.brandName,
    sourceBrand: product.sourceBrand,
    model: product.model,
    category: product.category,
    subcategory: product.subcategory,
    attributes: product.attributes,
    priceXof: product.priceXof,
    priceRange: product.priceRange,
    monthlyXof: product.monthlyXof,
    availability: product.availability,
    warrantyMonths: product.warrantyMonths,
    featured: Boolean(product.featured),
    isNew: Boolean(product.new),
    accent: product.accent,
    symbol: product.symbol,
    imageUrl: product.imageUrl ?? product.crawl?.imageUrl,
  };
}
