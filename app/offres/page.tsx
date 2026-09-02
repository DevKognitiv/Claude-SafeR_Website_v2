import type { Metadata } from 'next';
import Link from '@/components/Link';
import SiteHeader from '@/components/SiteHeader';
import HeroBackdrop from '@/components/HeroBackdrop';
import SiteFooter from '@/components/SiteFooter';
import TrustStrip from '@/components/TrustStrip';
import { GlyphIcon } from '@/components/Icon';
import { fmt } from '@/lib/i18n/config';
import { getI18n, pageMetadata } from '@/lib/i18n/server';
import { optionOrder, packOrder } from '@/lib/packs';

export async function generateMetadata(): Promise<Metadata> {
  const { d, locale } = await getI18n();
  return pageMetadata(d, locale, { title: d.offers.meta.title, description: d.offers.meta.description, path: '/offres', slot: 'offers' });
}

export default async function OffersPage() {
  const { d } = await getI18n();
  const o = d.offers;
  const packs = packOrder.map((id) => ({ id, ...o.packs[id] }));
  const cell = (value: string) => value === 'yes' ? <span className="grid size-6 place-items-center rounded-full bg-[#b8ff3d] text-xs">✓</span> : value;

  return <main id="contenu" className="theme-page offers-page bg-[#f1f4f1] text-[#0a1814]">
    <section className="relative overflow-hidden bg-[#07120f] pb-24 text-white"><HeroBackdrop slot="offers" alt={d.images.offers} opacity="opacity-35" tone="green" align="center" priority /><SiteHeader /><div className="relative mx-auto max-w-7xl px-5 pt-14 text-center lg:px-8 lg:pt-20"><p className="text-xs font-bold uppercase tracking-[.16em] text-[#b8ff3d]">{o.hero.eyebrow}</p><h1 className="mx-auto mt-6 max-w-4xl text-5xl font-semibold leading-[1] tracking-[-.05em] sm:text-6xl lg:text-7xl">{o.hero.title1}<br />{o.hero.title2}</h1><p className="mx-auto mt-6 max-w-xl leading-7 text-white/55">{o.hero.intro}</p></div></section>
    <section className="px-5 py-20 lg:px-8 lg:py-28"><div className="mx-auto max-w-7xl"><div className="grid gap-5 lg:grid-cols-3">
      {packs.map((pack, i) => <article key={pack.id} data-reveal="" data-reveal-delay={String(i + 1)} className={`card-lift rounded-[30px] p-7 ${i === 1 ? 'bg-[#b8ff3d] shadow-xl' : 'bg-white border border-black/8'}`}><p className="text-xs font-bold uppercase tracking-[.12em] text-black/40">{pack.tag}</p><h2 className="mt-6 text-3xl font-semibold">{pack.name}</h2><p className="mt-3 min-h-12 text-sm leading-6 text-black/50">{pack.pitch}</p><div className="my-7 border-y border-black/10 py-6"><span className="price text-3xl font-semibold">{pack.price}</span>{pack.id !== 'signature' && <span className="ml-2 text-sm">{o.perMonth}</span>}</div><ul className="space-y-2 text-sm text-black/65">{pack.items.map((item) => <li key={item} className="flex gap-3"><span className="text-[#4556f5]">✓</span>{item}</li>)}</ul><div className="mt-8 grid gap-2"><Link href={`/diagnostic?pack=${pack.id}`} className="block rounded-full bg-[#0b1d17] px-6 py-4 text-center text-sm font-bold text-white">{fmt(o.choose, { name: pack.shortName })}</Link><Link href={`/offres/${pack.id}`} className="block text-center text-xs font-semibold underline underline-offset-4">{o.seeDetails}</Link></div></article>)}
    </div><p className="mt-6 text-center text-xs text-black/40">{o.disclaimer}</p></div></section>
    <TrustStrip compact />
    <section className="bg-white px-5 py-20 lg:px-8 lg:py-28"><div className="mx-auto max-w-7xl"><div className="max-w-3xl"><p className="text-xs font-bold uppercase tracking-[.16em] text-[#669516]">{o.comparison.eyebrow}</p><h2 className="mt-5 text-4xl font-semibold tracking-[-.04em] sm:text-5xl">{o.comparison.title}</h2></div><div className="mt-12 overflow-x-auto rounded-[28px] border border-black/8"><table className="w-full min-w-[760px] border-collapse text-left"><thead><tr className="bg-[#eef2ee]"><th className="p-5 text-sm">{o.comparison.features}</th>{packs.map((pack, i) => <th key={pack.id} className={`p-5 text-sm ${i === 1 ? 'bg-[#b8ff3d]/40' : ''}`}><Link href={`/offres/${pack.id}`} className="hover:underline">{pack.shortName}</Link></th>)}</tr></thead><tbody>{o.comparison.rows.map(([label, ...values]) => <tr key={label} className="border-t border-black/8"><td className="p-5 text-sm font-medium">{label}</td>{values.map((value, i) => <td key={i} className={`p-5 text-sm ${i === 1 ? 'bg-[#b8ff3d]/10' : ''}`}>{cell(value)}</td>)}</tr>)}</tbody></table></div></div></section>
    <section className="px-5 py-20 lg:px-8 lg:py-28"><div className="mx-auto max-w-7xl"><div className="grid gap-8 lg:grid-cols-2 lg:items-end"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-[#669516]">{o.alacarte.eyebrow}</p><h2 className="mt-5 text-4xl font-semibold tracking-[-.04em] sm:text-5xl">{o.alacarte.title1}<br />{o.alacarte.title2}</h2></div><p className="max-w-lg leading-7 text-black/50 lg:ml-auto">{o.alacarte.intro}</p></div><div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{optionOrder.map((id) => { const opt = o.options[id]; return <Link key={id} href={`/offres/options/${id}`} className="group rounded-[26px] border border-black/8 bg-white p-6 transition hover:-translate-y-1"><span className="grid size-12 place-items-center rounded-full bg-[#b8ff3d]"><GlyphIcon glyph={opt.icon} size={22} /></span><h3 className="mt-8 text-xl font-semibold">{opt.title}</h3><p className="mt-2 text-sm leading-6 text-black/45">{opt.text}</p><span className="mt-5 inline-flex text-xs font-bold text-[#4556f5]">{o.alacarte.viewOption} →</span></Link>; })}</div></div></section>
    <section className="bg-[#b8ff3d] px-5 py-20 lg:px-8"><div className="mx-auto flex max-w-7xl flex-col gap-8 lg:flex-row lg:items-center lg:justify-between"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-black/45">{o.hesitate.eyebrow}</p><h2 className="mt-4 text-4xl font-semibold tracking-[-.04em]">{o.hesitate.title}</h2></div><Link href="/diagnostic" className="rounded-full bg-[#07120f] px-7 py-4 text-center text-sm font-bold text-white">{d.common.freeAssessment}</Link></div></section>
    <SiteFooter />
  </main>;
}
