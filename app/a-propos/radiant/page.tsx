import type { Metadata } from 'next';
import Breadcrumbs from '@/components/Breadcrumbs';
import CtaBand from '@/components/CtaBand';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import { getI18n, pageMetadata } from '@/lib/i18n/server';

export async function generateMetadata(): Promise<Metadata> {
  const { d, locale } = await getI18n();
  return pageMetadata(d, locale, { title: d.about.radiant.meta.title, description: d.about.radiant.meta.description, path: '/a-propos/radiant', slot: 'about' });
}

export default async function RadiantPage() {
  const { d } = await getI18n();
  const r = d.about.radiant;
  return <main id="contenu" className="theme-page bg-[#f3f5fb] text-black">
    <section className="bg-black text-white"><SiteHeader /><div className="mx-auto max-w-7xl px-5 pb-20 pt-4 lg:px-8"><Breadcrumbs items={[{ label: d.nav.about, href: '/a-propos' }, { label: r.title }]} /><div className="mt-12 max-w-3xl"><p className="eyebrow">{r.eyebrow}</p><h1 className="mt-5 text-5xl font-light leading-[1] tracking-[-.05em] sm:text-6xl">{r.title}</h1><p className="mt-6 text-lg leading-8 text-white/60">{r.intro}</p></div></div></section>
    <section className="px-5 py-20 lg:px-8 lg:py-28"><div className="mx-auto max-w-7xl"><p className="eyebrow">{r.brandsTitle}</p><div className="mt-8 grid gap-4 md:grid-cols-2">{r.brands.map(([name, text], i) => <article key={name} className={`rounded-[28px] p-7 ${name === 'SafeR' ? 'bg-[#4556f5] text-white' : 'border border-black/8 bg-white'}`}><span className={`text-sm font-semibold ${name === 'SafeR' ? 'text-white/60' : 'text-black/40'}`}>0{i + 1}</span><h2 className="mt-10 text-2xl font-semibold">{name}</h2><p className={`mt-3 text-sm leading-6 ${name === 'SafeR' ? 'text-white/75' : 'text-black/55'}`}>{text}</p></article>)}</div></div></section>
    <section className="bg-white px-5 py-20 lg:px-8 lg:py-28"><div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[.7fr_1.3fr]"><h2 className="text-3xl font-semibold tracking-tight">{r.synergyTitle}</h2><ul className="space-y-4">{r.synergy.map((s) => <li key={s} className="flex gap-3 text-lg leading-8"><span className="text-[#4556f5]">✓</span>{s}</li>)}</ul></div></section>
    <CtaBand title={d.about.cta} cta={d.common.assessment} href="/diagnostic" tone="blue" />
    <SiteFooter />
  </main>;
}
