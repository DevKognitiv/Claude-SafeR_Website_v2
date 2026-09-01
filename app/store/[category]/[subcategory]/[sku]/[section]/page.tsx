import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ProductPage, { isProductSection, productSections } from '@/components/store/ProductPage';
import { getCopy, getProductBySku, products, skuSlug } from '@/lib/catalog';
import { fmt } from '@/lib/i18n/config';
import { getI18n, pageMetadata } from '@/lib/i18n/server';

type Params = Promise<{ category: string; subcategory: string; sku: string; section: string }>;

export function generateStaticParams() {
  return products.flatMap((product) => productSections.map((section) => ({ category: product.category, subcategory: product.subcategory, sku: skuSlug(product.sku), section })));
}

async function resolve(params: Params) {
  const { category, subcategory, sku, section } = await params;
  const product = getProductBySku(decodeURIComponent(sku));
  if (!product || product.category !== category || product.subcategory !== subcategory || !isProductSection(section)) return null;
  return { product, section };
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const resolved = await resolve(params);
  if (!resolved) return {};
  const { product, section } = resolved;
  const { d, locale } = await getI18n();
  const copy = getCopy(product, locale);
  return pageMetadata(d, locale, { title: `${d.store.product.sections[section]} · ${fmt(d.store.product.metaTitle, { name: copy.name, brand: product.brandName })}`, description: `${d.store.product.sectionsIntro[section]} ${copy.tagline}`, path: `/store/${product.category}/${product.subcategory}/${skuSlug(product.sku)}/${section}`, image: product.imageUrl ?? product.crawl?.imageUrl, imageAlt: copy.name });
}

export default async function StoreProductSectionPage({ params }: { params: Params }) {
  const resolved = await resolve(params);
  if (!resolved) notFound();
  const { d, locale } = await getI18n();
  return <ProductPage product={resolved.product} d={d} locale={locale} section={resolved.section} />;
}
