import type { Metadata } from 'next';
import Breadcrumbs from '@/components/Breadcrumbs';
import CtaBand from '@/components/CtaBand';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import { getI18n, pageMetadata } from '@/lib/i18n/server';

export async function generateMetadata(): Promise<Metadata> {
  const { d, locale } = await getI18n();
  return pageMetadata(d, locale, { title: d.about.engagements.meta.title, description: d.about.engagements.meta.description, path: '/a-propos/engagements' });
}

export default async function EngagementsPage() {
  const { d } = await getI18n();
  const e = d.about.engagements;
  return <main id="contenu" className="theme-page bg-[#f3f5fb] text-black">
    <section className="bg-black text-white"><SiteHeader /><div className="mx-auto max-w-7xl px-5 pb-20 pt-4 lg:px-8"><Breadcrumbs items={[{ label: d.nav.about, href: '/a-propos' }, { label: e.eyebrow }]} /><div className="mt-12 max-w-3xl"><p className="eyebrow">{e.eyebrow}</p><h1 className="mt-5 text-5xl font-light leading-[1] tracking-[-.05em] sm:text-6xl">{e.title}</h1></div></div></section>
    <section className="px-5 py-20 lg:px-8 lg:py-28"><div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-2 lg:grid-cols-3">{e.items.map(([title, text], i) => <article key={title} className={`rounded-[28px] p-7 ${i === 0 ? 'bg-[#4556f5] text-white' : 'border border-black/8 bg-white'}`}><span className={`text-sm font-semibold ${i === 0 ? 'text-white/60' : 'text-black/40'}`}>0{i + 1}</span><h2 className="mt-10 text-2xl font-semibold">{title}</h2><p className={`mt-3 text-sm leading-6 ${i === 0 ? 'text-white/75' : 'text-black/55'}`}>{text}</p></article>)}</div></section>
    <CtaBand title={d.about.cta} cta={d.common.assessment} href="/diagnostic" tone="sky" />
    <SiteFooter />
  </main>;
}
