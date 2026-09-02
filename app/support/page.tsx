import type { Metadata } from 'next';
import Link from '@/components/Link';
import SiteHeader from '@/components/SiteHeader';
import HeroBackdrop from '@/components/HeroBackdrop';
import SmartImage from '@/components/SmartImage';
import SiteFooter from '@/components/SiteFooter';
import { getI18n, pageMetadata } from '@/lib/i18n/server';
import { CONTACT_PHONE_DISPLAY, CONTACT_PHONE_HREF } from '@/lib/site';

export async function generateMetadata(): Promise<Metadata> {
  const { d, locale } = await getI18n();
  return pageMetadata(d, locale, { title: d.support.meta.title, description: d.support.meta.description, path: '/support', slot: 'support' });
}

export default async function SupportPage() {
  const { d } = await getI18n();
  const s = d.support;
  const resources: [string, string, string][] = [[s.resources.faq.title, s.resources.faq.text, '/support/faq'], [s.resources.guides.title, s.resources.guides.text, '/support/guides'], [s.resources.warranty.title, s.resources.warranty.text, '/support/garantie'], [s.resources.contact.title, s.resources.contact.text, '/support/contact']];
  return <main id="contenu" className="theme-page bg-[#f3f5fb] text-black">
    <section className="relative overflow-hidden bg-black pb-24 text-white"><HeroBackdrop slot="support" alt={d.images.support} opacity="opacity-40" priority /><div className="brand-grid absolute inset-0 opacity-45" /><SiteHeader /><div className="relative mx-auto max-w-7xl px-5 pt-14 lg:px-8 lg:pt-20"><p className="text-xs font-bold uppercase tracking-[.16em] text-[#52c6ff]">{s.eyebrow}</p><h1 className="mt-6 max-w-5xl text-5xl font-light leading-[1] tracking-[-.05em] sm:text-6xl lg:text-7xl">{s.title}</h1><p className="mt-7 max-w-2xl text-lg leading-8 text-white/60">{s.intro}</p><a href={CONTACT_PHONE_HREF} className="mt-9 inline-flex rounded-full bg-[#4556f5] px-7 py-4 text-sm font-bold text-white">{CONTACT_PHONE_DISPLAY}</a></div></section>
    <section className="px-5 py-20 lg:px-8 lg:py-28"><div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-2">{s.help.map((item, index) => <article key={item.title} className={`rounded-[30px] p-7 sm:p-8 ${index === 0 ? 'bg-[#52c6ff]' : 'border border-black/8 bg-white'}`}><span className="text-sm font-semibold opacity-45">0{index + 1}</span><h2 className="mt-12 text-2xl font-semibold">{item.title}</h2><p className="mt-3 max-w-xl text-sm leading-6 opacity-60">{item.text}</p>{item.href.startsWith('tel:') ? <a href={item.href} className="mt-8 inline-flex rounded-full bg-black px-5 py-3 text-xs font-bold text-white">{item.cta}</a> : <Link href={item.href} className={`mt-8 inline-flex rounded-full px-5 py-3 text-xs font-bold ${index === 0 ? 'bg-black text-white' : 'bg-[#4556f5] text-white'}`}>{item.cta}</Link>}</article>)}</div></section>
    <section className="bg-white px-5 py-20 lg:px-8 lg:py-28"><div className="mx-auto max-w-7xl"><div className="max-w-3xl"><p className="eyebrow">{s.resources.eyebrow}</p><h2 className="section-title mt-5">{s.resources.title}</h2></div><div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{resources.map(([title, text, href]) => <Link key={href} href={href} className="group rounded-[26px] border border-black/8 bg-[#f3f5fb] p-6 transition hover:-translate-y-1"><div className="flex items-center justify-between"><h3 className="text-xl font-semibold">{title}</h3><span className="grid size-9 place-items-center rounded-full border border-black/10 transition group-hover:translate-x-1">→</span></div><p className="mt-4 text-sm leading-6 text-black/55">{text}</p></Link>)}</div></div></section>
    <section className="px-5 py-24 lg:px-8"><div className="mx-auto grid max-w-7xl gap-8 overflow-hidden rounded-[36px] bg-[#4556f5] p-8 text-white lg:grid-cols-[1fr_.8fr] lg:items-center lg:p-14"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-white/55">{s.maintenanceBlock.eyebrow}</p><h2 className="mt-5 text-4xl font-light leading-tight sm:text-5xl">{s.maintenanceBlock.title}</h2><p className="mt-5 max-w-2xl leading-7 text-white/65">{s.maintenanceBlock.text}</p><Link href="/support/maintenance" className="mt-8 inline-flex rounded-full bg-black px-6 py-3.5 text-sm font-bold text-white">{d.common.discover}</Link></div><div className="media-grade relative min-h-[360px] overflow-hidden rounded-[28px]"><SmartImage slot="maintenance" alt={d.images.maintenance} className="absolute inset-0 h-full w-full object-cover" /></div></div></section>
    <SiteFooter />
  </main>;
}
