import type { Metadata } from 'next';
import Link from '@/components/Link';
import Breadcrumbs from '@/components/Breadcrumbs';
import SiteFooter from '@/components/SiteFooter';
import SiteHeader from '@/components/SiteHeader';
import { catalog } from '@/lib/catalog';
import { fmt } from '@/lib/i18n/config';
import { getI18n, pageMetadata } from '@/lib/i18n/server';

export async function generateMetadata(): Promise<Metadata> {
  const { d, locale } = await getI18n();
  return pageMetadata(d, locale, { title: d.store.brands.meta.title, description: d.store.brands.meta.description, path: '/store/marques' });
}

export default async function BrandsPage() {
  const { d } = await getI18n();
  const b = d.store.brands;
  const brands = Object.values(catalog.brands).filter((brand) => brand.count > 0).sort((x, y) => (x.id === 'safer' ? -1 : y.id === 'safer' ? 1 : y.count - x.count));

  return <main id="contenu" className="theme-page bg-[#f3f5fb] text-black">
    <section className="relative overflow-hidden bg-black text-white"><div className="brand-grid absolute inset-0 opacity-35" /><SiteHeader /><div className="relative mx-auto max-w-7xl px-5 pb-16 pt-6 lg:px-8 lg:pb-24"><Breadcrumbs items={[{ label: d.store.product.breadcrumbStore, href: '/store' }, { label: b.eyebrow }]} /><p className="eyebrow mt-10">{b.eyebrow}</p><h1 className="mt-5 max-w-4xl text-5xl font-light leading-[.98] tracking-[-.055em] sm:text-6xl lg:text-7xl">{b.title}</h1><p className="mt-6 max-w-2xl text-lg leading-8 text-white/65">{b.intro}</p></div></section>
    <section className="px-5 py-20 lg:px-8 lg:py-28"><div className="mx-auto max-w-7xl"><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{brands.map((brand) => <Link key={brand.id} href={`/store/marques/${brand.id}`} className={`group flex min-h-[220px] flex-col rounded-[28px] border p-7 transition hover:-translate-y-1 ${brand.id === 'safer' ? 'border-transparent bg-[#4556f5] text-white sm:col-span-2 lg:col-span-1' : 'border-black/8 bg-white'}`}><div className="flex items-center justify-between"><span className={`text-xs font-bold uppercase tracking-[.14em] ${brand.id === 'safer' ? 'text-white/70' : 'text-black/40'}`}>{fmt(b.productsCount, { count: brand.count })}</span><span className="grid size-10 place-items-center rounded-full border border-current/15 transition group-hover:translate-x-1">→</span></div><h2 className="mt-auto text-3xl font-semibold tracking-tight">{brand.name}</h2><p className={`mt-2 text-sm ${brand.id === 'safer' ? 'text-white/70' : 'text-black/50'}`}>{brand.origin}</p></Link>)}</div>
      <p className="mt-10 max-w-3xl text-sm leading-6 text-black/55">{b.saferNote}</p></div></section>
    <SiteFooter />
  </main>;
}
