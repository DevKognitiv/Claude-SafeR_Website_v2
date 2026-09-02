import type { Metadata } from 'next';
import catalogueData from '@/data/catalogue.json';
import Link from '@/components/Link';
import Breadcrumbs from '@/components/Breadcrumbs';
import SiteFooter from '@/components/SiteFooter';
import SiteHeader from '@/components/SiteHeader';
import HeroBackdrop from '@/components/HeroBackdrop';
import DigitalCatalogue from '@/components/store/DigitalCatalogue';
import { getI18n, pageMetadata } from '@/lib/i18n/server';

export async function generateMetadata(): Promise<Metadata> {
  const { d, locale } = await getI18n();
  return pageMetadata(d, locale, { title: d.store.catalogue.meta.title, description: d.store.catalogue.meta.description, path: '/store/catalogue', image: '/media/catalogue-safer-radiant/pages/page-001.jpg' });
}

export default async function CataloguePage() {
  const { d } = await getI18n();
  const c = d.store.catalogue;
  const total = catalogueData.pages;
  return <main id="contenu" className="theme-page bg-[#f3f5fb] text-black">
    <section className="relative overflow-hidden bg-black text-white"><HeroBackdrop slot="catalogue" alt={d.images.catalogue} opacity="opacity-30" priority /><div className="brand-grid absolute inset-0 opacity-35" /><SiteHeader /><div className="relative mx-auto max-w-7xl px-5 pb-14 pt-6 lg:px-8"><Breadcrumbs items={[{ label: d.store.product.breadcrumbStore, href: '/store' }, { label: c.eyebrow }]} /><p className="eyebrow mt-10">{c.eyebrow}</p><h1 className="mt-5 max-w-4xl text-5xl font-light leading-[.98] tracking-[-.055em] sm:text-6xl">{c.title}</h1><p className="mt-6 max-w-2xl text-lg leading-8 text-white/65">{c.intro}</p></div></section>
    <section className="bg-black px-3 pb-16 sm:px-5 lg:px-8"><div className="mx-auto max-w-6xl"><DigitalCatalogue total={total} /></div></section>
    <section className="px-5 py-16 lg:px-8"><div className="mx-auto flex max-w-7xl flex-col gap-6 rounded-[30px] bg-[#4556f5] p-8 text-white sm:flex-row sm:items-center sm:justify-between"><h2 className="text-2xl font-semibold sm:text-3xl">{c.storeCta}</h2><Link href="/store" className="rounded-full bg-white px-7 py-4 text-center text-sm font-bold text-black">{d.nav.store} →</Link></div></section>
    <SiteFooter />
  </main>;
}
