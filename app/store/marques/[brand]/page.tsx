import type { Metadata } from 'next';
import Link from '@/components/Link';
import { notFound } from 'next/navigation';
import Breadcrumbs from '@/components/Breadcrumbs';
import SiteFooter from '@/components/SiteFooter';
import SiteHeader from '@/components/SiteHeader';
import StoreCatalog from '@/components/store/StoreCatalog';
import { catalog, getBrand, products } from '@/lib/catalog';
import { brandNames, storeItems } from '@/lib/catalog/server';
import { fmt } from '@/lib/i18n/config';
import { getI18n, pageMetadata } from '@/lib/i18n/server';

type Params = Promise<{ brand: string }>;

export function generateStaticParams() {
  return Object.values(catalog.brands).filter((b) => b.count > 0).map((b) => ({ brand: b.id }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { brand: id } = await params;
  const brand = getBrand(id);
  if (!brand) return {};
  const { d, locale } = await getI18n();
  return pageMetadata(d, locale, { title: `${brand.name} · ${d.store.brands.brandPage.metaSuffix}`, description: `${fmt(d.store.brands.productsCount, { count: brand.count })} · ${d.store.brands.intro}`, path: `/store/marques/${id}` });
}

export default async function BrandPage({ params }: { params: Params }) {
  const { brand: id } = await params;
  const brand = getBrand(id);
  if (!brand || brand.count === 0) notFound();
  const { d, locale } = await getI18n();
  const b = d.store.brands;
  const list = products.filter((p) => p.brand === id);
  const categories = Array.from(new Set(list.map((p) => p.category)));
  const others = Object.values(catalog.brands).filter((x) => x.id !== id && x.count > 0);

  return <main id="contenu" className="theme-page bg-[#f3f5fb] text-black">
    <section className="relative overflow-hidden bg-black text-white"><div className="brand-grid absolute inset-0 opacity-35" /><SiteHeader /><div className="relative mx-auto grid max-w-7xl gap-10 px-5 pb-16 pt-6 lg:grid-cols-[1.1fr_.9fr] lg:items-end lg:px-8 lg:pb-24">
      <div><Breadcrumbs items={[{ label: d.store.product.breadcrumbStore, href: '/store' }, { label: b.eyebrow, href: '/store/marques' }, { label: brand.name }]} /><p className="eyebrow mt-10">{fmt(b.productsCount, { count: brand.count })}</p><h1 className="mt-5 text-5xl font-light leading-[.98] tracking-[-.055em] sm:text-6xl lg:text-7xl">{brand.name}</h1>{id === 'safer' && <p className="mt-6 max-w-2xl text-lg leading-8 text-white/65">{b.saferNote}</p>}</div>
      <dl className="grid gap-4 rounded-[28px] border border-white/12 bg-white/7 p-6 text-sm backdrop-blur sm:grid-cols-2"><div><dt className="text-white/45">{b.brandPage.origin}</dt><dd className="mt-1 font-semibold">{brand.origin}</dd></div><div><dt className="text-white/45">{b.brandPage.specialty}</dt><dd className="mt-1 font-semibold">{categories.map((c) => d.store.categories[c].short).join(' · ')}</dd></div><div><dt className="text-white/45">{b.brandPage.integration}</dt><dd className="mt-1 font-semibold">{(d.store.attributes.compat as Record<string, string>)['safer-platform']}</dd></div><div><dt className="text-white/45">{b.brandPage.website}</dt><dd className="mt-1 font-semibold"><a href={brand.website} rel="noopener noreferrer" target="_blank" className="text-[#52c6ff] hover:underline">{new URL(brand.website).hostname}</a></dd></div></dl>
    </div></section>
    <section className="px-5 py-16 lg:px-8 lg:py-20"><div className="mx-auto max-w-7xl"><h2 className="text-3xl font-semibold tracking-tight">{fmt(b.brandPage.products, { brand: brand.name })}</h2><div className="mt-8"><StoreCatalog items={storeItems(locale, list)} brands={brandNames()} showCategoryFacet /></div></div></section>
    <section className="px-5 pb-24 lg:px-8"><div className="mx-auto max-w-7xl"><p className="eyebrow">{b.brandPage.otherBrands}</p><div className="mt-5 flex flex-wrap gap-2">{others.map((x) => <Link key={x.id} href={`/store/marques/${x.id}`} className="rounded-full border border-black/10 bg-white px-4 py-2.5 text-xs font-bold hover:border-[#4556f5]">{x.name}</Link>)}</div></div></section>
    <SiteFooter />
  </main>;
}
