import type { Metadata } from 'next';
import Breadcrumbs from '@/components/Breadcrumbs';
import SiteFooter from '@/components/SiteFooter';
import SiteHeader from '@/components/SiteHeader';
import CompareTable from '@/components/store/CompareTable';
import { storeItems } from '@/lib/catalog/server';
import { getI18n, pageMetadata } from '@/lib/i18n/server';

export async function generateMetadata(): Promise<Metadata> {
  const { d, locale } = await getI18n();
  return pageMetadata(d, locale, { title: d.store.compare.meta.title, description: d.store.compare.meta.description, path: '/store/comparer', slot: 'store' });
}

export default async function ComparePage() {
  const { d, locale } = await getI18n();
  const c = d.store.compare;
  return <main id="contenu" className="theme-page bg-[#f3f5fb] text-black">
    <section className="relative overflow-hidden bg-black text-white"><div className="brand-grid absolute inset-0 opacity-35" /><SiteHeader /><div className="relative mx-auto max-w-7xl px-5 pb-16 pt-6 lg:px-8 lg:pb-20"><Breadcrumbs items={[{ label: d.store.product.breadcrumbStore, href: '/store' }, { label: c.eyebrow }]} /><p className="eyebrow mt-10">{c.eyebrow}</p><h1 className="mt-5 max-w-4xl text-5xl font-light leading-[.98] tracking-[-.055em] sm:text-6xl">{c.title}</h1><p className="mt-6 max-w-2xl text-lg leading-8 text-white/65">{c.intro}</p></div></section>
    <section className="px-5 py-16 lg:px-8 lg:py-24"><div className="mx-auto max-w-7xl"><CompareTable items={storeItems(locale)} /><p className="mt-4 text-xs text-black/45">{c.max}</p></div></section>
    <SiteFooter />
  </main>;
}
