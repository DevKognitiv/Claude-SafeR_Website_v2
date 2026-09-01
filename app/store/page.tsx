import type { Metadata } from 'next';
import Link from '@/components/Link';
import SiteFooter from '@/components/SiteFooter';
import SiteHeader from '@/components/SiteHeader';
import StoreCatalog from '@/components/store/StoreCatalog';
import TrustStrip from '@/components/TrustStrip';
import Icon, { type IconName } from '@/components/Icon';
import { catalog, categoryIds, productsInCategory } from '@/lib/catalog';
import { brandNames, storeItems } from '@/lib/catalog/server';
import { fmt } from '@/lib/i18n/config';
import { formatDate, getI18n, pageMetadata } from '@/lib/i18n/server';

export async function generateMetadata(): Promise<Metadata> {
  const { d, locale } = await getI18n();
  return pageMetadata(d, locale, { title: d.store.meta.title, description: d.store.meta.description, path: '/store' });
}

export default async function StorePage() {
  const { d, locale } = await getI18n();
  const s = d.store;
  const synced = formatDate(catalog.lastCatalogSync, locale);
  const brandCount = Object.values(catalog.brands).filter((b) => b.count > 0).length;
  const categoryIcons: Record<string, IconName> = { video: 'camera', alarme: 'shield', acces: 'key', domotique: 'home', energie: 'zap' };

  return <main id="contenu" className="theme-page bg-[#f3f5fb] text-black">
    <section className="relative overflow-hidden bg-black text-white"><div className="brand-grid absolute inset-0 opacity-35" /><SiteHeader /><div className="relative mx-auto grid max-w-7xl gap-10 px-5 pb-20 pt-12 lg:grid-cols-[1fr_.75fr] lg:items-end lg:px-8 lg:pb-28 lg:pt-20"><div><p className="eyebrow">{s.hero.eyebrow}</p><h1 className="mt-6 max-w-4xl text-5xl font-light leading-[.98] tracking-[-.055em] sm:text-6xl lg:text-7xl">{s.hero.title1}<br /><span className="font-semibold text-[#52c6ff]">{s.hero.title2}</span></h1><p className="mt-7 max-w-2xl text-lg leading-8 text-white/65">{s.hero.intro}</p><div className="mt-8 flex flex-wrap gap-3 text-xs font-bold uppercase tracking-[.14em] text-white/55"><span className="rounded-full border border-white/15 px-4 py-2">{fmt(s.hero.productsCount, { count: catalog.products.length })}</span><span className="rounded-full border border-white/15 px-4 py-2">{fmt(s.hero.brandsCount, { count: brandCount })}</span></div></div><div className="rounded-[28px] border border-white/12 bg-white/7 p-6 backdrop-blur"><p className="text-xs font-bold uppercase tracking-[.14em] text-[#b8ff3d]">{s.hero.controlEyebrow}</p><p className="mt-4 text-2xl font-semibold">{s.hero.controlTitle}</p><p className="mt-3 text-sm leading-6 text-white/55">{fmt(s.hero.controlText, { date: synced })}</p><div className="mt-5 flex flex-wrap gap-4"><Link href="/produits" className="inline-flex text-sm font-bold text-[#52c6ff]">{s.hero.showroom}</Link><Link href="/store/catalogue" className="inline-flex text-sm font-bold text-[#52c6ff]">{s.catalogue.open} →</Link></div></div></div></section>
    <TrustStrip compact />

    <section className="px-5 pt-20 lg:px-8 lg:pt-28"><div className="mx-auto max-w-7xl"><div className="grid gap-6 lg:grid-cols-[1fr_.8fr] lg:items-end"><div><p className="eyebrow">{s.categoriesEyebrow}</p><h2 className="section-title mt-5">{s.categoriesTitle}</h2></div></div>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">{categoryIds.map((id, index) => { const cat = s.categories[id]; const count = productsInCategory(id).length; return <Link key={id} href={`/store/${id}`} data-reveal="" data-reveal-delay={String(index)} className={`group card-lift flex min-h-[220px] flex-col rounded-[26px] border p-6 ${index === 0 ? 'border-transparent bg-[#4556f5] text-white' : 'border-black/8 bg-white'}`}><div className="flex items-center justify-between"><span className={`text-xs font-bold uppercase tracking-[.14em] ${index === 0 ? 'text-white/70' : 'text-black/40'}`}>{fmt(s.productsIn, { count })}</span><span className="grid size-10 place-items-center rounded-full border border-current/15"><Icon name={categoryIcons[id]} size={20} /></span></div><h3 className="mt-auto text-2xl font-semibold tracking-tight">{cat.title}</h3><p className={`mt-2 text-sm leading-6 ${index === 0 ? 'text-white/70' : 'text-black/55'}`}>{cat.description}</p></Link>; })}</div>
    </div></section>

    <section className="px-5 py-20 lg:px-8 lg:py-28"><div className="mx-auto max-w-7xl"><div className="mb-12 grid gap-6 lg:grid-cols-[1fr_.8fr] lg:items-end"><div><p className="eyebrow">{s.catalog.eyebrow}</p><h2 className="section-title mt-5">{s.catalog.title1}<br />{s.catalog.title2}</h2></div><p className="max-w-xl leading-7 text-black/55 lg:ml-auto">{s.catalog.intro}</p></div><StoreCatalog items={storeItems(locale)} brands={brandNames()} showCategoryFacet /></div></section>

    <section className="px-5 pb-24 lg:px-8"><div className="mx-auto grid max-w-7xl gap-5 rounded-[34px] bg-[#4556f5] p-8 text-white lg:grid-cols-[1fr_auto] lg:items-center lg:p-12"><div><p className="text-xs font-bold uppercase tracking-[.15em] text-white/90">{s.expert.eyebrow}</p><h2 className="mt-4 max-w-3xl text-3xl font-semibold tracking-tight sm:text-4xl">{s.expert.title}</h2></div><Link href="/diagnostic" className="rounded-full bg-white px-7 py-4 text-center text-sm font-bold text-black">{s.expert.cta}</Link></div></section>
    <SiteFooter />
  </main>;
}
