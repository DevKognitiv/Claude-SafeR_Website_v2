import type { Metadata } from 'next';
import Link from '@/components/Link';
import Breadcrumbs from '@/components/Breadcrumbs';
import SiteFooter from '@/components/SiteFooter';
import SiteHeader from '@/components/SiteHeader';
import { getI18n, pageMetadata } from '@/lib/i18n/server';

export async function generateMetadata(): Promise<Metadata> {
  const { d, locale } = await getI18n();
  return pageMetadata(d, locale, { title: d.partners.code.meta.title, description: d.partners.code.meta.description, path: '/partenaires/code-de-conduite', slot: 'partners' });
}

export default async function CodeOfConductPage() {
  const { d } = await getI18n();
  const c = d.partners.code;
  return <main id="contenu" className="theme-page bg-[#f3f5fb] text-black">
    <section className="bg-black text-white"><SiteHeader /><div className="mx-auto max-w-7xl px-5 pb-20 pt-4 lg:px-8"><Breadcrumbs items={[{ label: d.nav.partners, href: '/partenaires' }, { label: c.eyebrow }]} /><div className="mt-12 max-w-3xl"><p className="eyebrow">{c.eyebrow}</p><h1 className="mt-5 text-5xl font-light leading-[1] tracking-[-.05em] sm:text-6xl">{c.title}</h1><p className="mt-6 text-lg leading-8 text-white/60">{c.intro}</p></div></div></section>
    <section className="px-5 py-20 lg:px-8 lg:py-28"><div className="mx-auto max-w-7xl"><ol className="grid gap-4 md:grid-cols-2">{c.sections.map(([title, text], i) => <li key={title} className="rounded-[26px] border border-black/8 bg-white p-7"><span className="text-sm font-semibold text-[#4556f5]">0{i + 1}</span><h2 className="mt-8 text-2xl font-semibold">{title}</h2><p className="mt-3 leading-7 text-black/60">{text}</p></li>)}</ol><div className="mt-12 text-center"><Link href="/partenaires/inscription" className="rounded-full bg-[#4556f5] px-7 py-4 text-sm font-bold text-white">{c.accept}</Link></div></div></section>
    <SiteFooter />
  </main>;
}
