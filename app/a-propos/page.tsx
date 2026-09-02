import type { Metadata } from 'next';
import Link from '@/components/Link';
import SiteHeader from '@/components/SiteHeader';
import SmartImage from '@/components/SmartImage';
import SiteFooter from '@/components/SiteFooter';
import { getI18n, pageMetadata } from '@/lib/i18n/server';

export async function generateMetadata(): Promise<Metadata> {
  const { d, locale } = await getI18n();
  return pageMetadata(d, locale, { title: d.about.meta.title, description: d.about.meta.description, path: '/a-propos', slot: 'about' });
}

export default async function AboutPage() {
  const { d } = await getI18n();
  const a = d.about;
  const more: [string, string][] = [[a.radiantLink, '/a-propos/radiant'], [a.engagementsLink, '/a-propos/engagements'], [a.careersLink, '/a-propos/carrieres']];
  return <main id="contenu" className="theme-page bg-[#f3f5fb] text-black">
    <section className="relative min-h-[82vh] overflow-hidden bg-black text-white"><SmartImage slot="about" alt={d.images.about} loading="eager" className="absolute inset-0 h-full w-full object-cover opacity-35" /><div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-[#4556f5]/20" /><SiteHeader /><div className="relative mx-auto flex min-h-[calc(82vh-96px)] max-w-7xl items-end px-5 pb-20 lg:px-8"><div className="max-w-5xl"><p className="text-xs font-bold uppercase tracking-[.16em] text-[#52c6ff]">{a.eyebrow}</p><h1 className="mt-6 text-5xl font-light leading-[.98] tracking-[-.05em] sm:text-6xl lg:text-7xl">{a.title}</h1><p className="mt-7 max-w-2xl text-lg leading-8 text-white/60">{a.intro}</p></div></div></section>
    <section className="px-5 py-20 lg:px-8 lg:py-28"><div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[.8fr_1.2fr]"><div><p className="eyebrow">{a.ambitionEyebrow}</p><h2 className="section-title mt-5">{a.ambitionTitle}</h2></div><div className="grid gap-4 sm:grid-cols-2">{a.figures.map(([value, label], index) => <article key={label} className={`rounded-[28px] p-7 ${index === 0 ? 'bg-[#4556f5] text-white' : 'border border-black/8 bg-white'}`}><p className="text-4xl font-light">{value}</p><p className={`mt-10 text-sm ${index === 0 ? 'text-white/60' : 'text-black/50'}`}>{label}</p></article>)}</div></div></section>
    <section className="bg-black px-5 py-20 text-white lg:px-8 lg:py-28"><div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-3"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-[#52c6ff]">{a.principlesEyebrow}</p><h2 className="mt-5 text-4xl font-light">{a.principlesTitle}</h2></div>{a.principles.map(([title, text]) => <article key={title} className="border-l border-white/15 pl-7"><h3 className="text-2xl font-semibold">{title}</h3><p className="mt-4 max-w-sm text-sm leading-6 text-white/50">{text}</p></article>)}</div></section>
    <section className="px-5 py-20 lg:px-8 lg:py-28"><div className="mx-auto max-w-7xl"><p className="eyebrow">{a.more}</p><div className="mt-6 grid gap-4 sm:grid-cols-3">{more.map(([label, href]) => <Link key={href} href={href} className="group flex items-center justify-between rounded-[26px] border border-black/8 bg-white p-6 text-xl font-semibold transition hover:-translate-y-1">{label}<span className="grid size-10 place-items-center rounded-full border border-black/10 transition group-hover:translate-x-1">→</span></Link>)}</div></div></section>
    <section className="bg-[#4556f5] px-5 py-20 text-white lg:px-8"><div className="mx-auto flex max-w-7xl flex-col gap-7 lg:flex-row lg:items-center lg:justify-between"><h2 className="max-w-3xl text-4xl font-light">{a.cta}</h2><Link href="/diagnostic" className="rounded-full bg-black px-7 py-4 text-center text-sm font-bold text-white">{d.common.assessment}</Link></div></section>
    <SiteFooter />
  </main>;
}
