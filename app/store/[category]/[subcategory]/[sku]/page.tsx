import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ProductPage from '@/components/store/ProductPage';
import { getCopy, getProductBySku, products, skuSlug } from '@/lib/catalog';
import { fmt } from '@/lib/i18n/config';
import { getI18n, pageMetadata } from '@/lib/i18n/server';

type Params = Promise<{ category: string; subcategory: string; sku: string }>;

export function generateStaticParams() {
  return products.map((product) => ({ category: product.category, subcategory: product.subcategory, sku: skuSlug(product.sku) }));
}

async function resolve(params: Params) {
  const { category, subcategory, sku } = await params;
  const product = getProductBySku(decodeURIComponent(sku));
  if (!product || product.category !== category || product.subcategory !== subcategory) return null;
  return product;
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const product = await resolve(params);
  if (!product) return {};
  const { d, locale } = await getI18n();
  const copy = getCopy(product, locale);
  return pageMetadata(d, locale, { title: fmt(d.store.product.metaTitle, { name: copy.name, brand: product.brandName }), description: copy.tagline + ' ' + copy.description, path: `/store/${product.category}/${product.subcategory}/${skuSlug(product.sku)}`, image: product.imageUrl ?? product.crawl?.imageUrl, imageAlt: copy.name });
}

export default async function StoreProductPage({ params }: { params: Params }) {
  const product = await resolve(params);
  if (!product) notFound();
  const { d, locale } = await getI18n();
  return <ProductPage product={product} d={d} locale={locale} />;
}
