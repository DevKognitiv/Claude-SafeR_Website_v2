import type { Metadata } from 'next';
import Link from '@/components/Link';
import Breadcrumbs from '@/components/Breadcrumbs';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import { getI18n, pageMetadata } from '@/lib/i18n/server';

export async function generateMetadata(): Promise<Metadata> {
  const { d, locale } = await getI18n();
  return pageMetadata(d, locale, { title: d.support.warranty.meta.title, description: d.support.warranty.meta.description, path: '/support/garantie' });
}

export default async function WarrantyPage() {
  const { d } = await getI18n();
  const w = d.support.warranty;
  return <main id="contenu" className="theme-page bg-[#f3f5fb] text-black">
    <section className="bg-black text-white"><SiteHeader /><div className="mx-auto max-w-7xl px-5 pb-20 pt-4 lg:px-8"><Breadcrumbs items={[{ label: d.nav.support, href: '/support' }, { label: w.eyebrow }]} /><p className="mt-10 text-xs font-bold uppercase tracking-[.16em] text-[#52c6ff]">{w.eyebrow}</p><h1 className="mt-5 max-w-4xl text-5xl font-light leading-[1] tracking-[-.05em] sm:text-6xl">{w.title}</h1><p className="mt-6 max-w-2xl text-lg leading-8 text-white/60">{w.intro}</p></div></section>
    <section className="px-5 py-16 lg:px-8 lg:py-24"><div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_1fr]"><div className="rounded-[30px] border border-black/8 bg-white p-7"><p className="eyebrow">{w.durationsTitle}</p><dl className="mt-6 divide-y divide-black/8">{w.durations.map(([label, value]) => <div key={label} className="flex items-center justify-between gap-6 py-4"><dt className="text-sm">{label}</dt><dd className="text-lg font-semibold">{value}</dd></div>)}</dl></div><div className="grid gap-4"><div className="rounded-[26px] bg-[#4556f5] p-6 text-white"><p className="text-xs font-bold uppercase tracking-[.14em] text-white/60">{w.coveredTitle}</p><ul className="mt-4 space-y-3 text-sm">{w.covered.map((c) => <li key={c} className="flex gap-3"><span>✓</span>{c}</li>)}</ul></div><div className="rounded-[26px] border border-black/8 bg-white p-6"><p className="text-xs font-bold uppercase tracking-[.14em] text-black/45">{w.excludedTitle}</p><ul className="mt-4 space-y-3 text-sm text-black/65">{w.excluded.map((c) => <li key={c} className="flex gap-3"><span>–</span>{c}</li>)}</ul></div></div></div></section>
    <section className="bg-white px-5 py-20 lg:px-8 lg:py-28"><div className="mx-auto max-w-7xl"><p className="eyebrow">{w.processTitle}</p><div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{w.process.map(([n, title, text]) => <article key={n} className="rounded-[26px] border border-black/8 bg-[#f3f5fb] p-6"><span className="text-sm font-semibold text-[#4556f5]">{n}</span><h3 className="mt-12 text-xl font-semibold">{title}</h3><p className="mt-3 text-sm leading-6 text-black/55">{text}</p></article>)}</div><div className="mt-10"><Link href="/support/contact?subject=warranty" className="rounded-full bg-black px-7 py-4 text-sm font-bold text-white">{w.cta}</Link></div></div></section>
    <SiteFooter />
  </main>;
}
