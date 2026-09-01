import type { Metadata } from 'next';
import Link from '@/components/Link';
import { notFound } from 'next/navigation';
import Breadcrumbs from '@/components/Breadcrumbs';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import { getI18n, pageMetadata } from '@/lib/i18n/server';
import { isPackId, packOrder } from '@/lib/packs';

type Params = Promise<{ pack: string }>;
export const dynamicParams = false;
export function generateStaticParams() { return packOrder.map((pack) => ({ pack })); }

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { pack } = await params;
  if (!isPackId(pack)) return {};
  const { d, locale } = await getI18n();
  const p = d.offers.packs[pack];
  return pageMetadata(d, locale, { title: `${d.offers.packPage.metaPrefix} ${p.name}`, description: `${p.pitch} ${p.forWho}`, path: `/offres/${pack}` });
}

export default async function PackPage({ params }: { params: Params }) {
  const { pack } = await params;
  if (!isPackId(pack)) notFound();
  const { d } = await getI18n();
  const o = d.offers;
  const p = o.packs[pack];
  const pp = o.packPage;
  const others = packOrder.filter((id) => id !== pack);

  return <main id="contenu" className="theme-page offers-page bg-[#f1f4f1] text-[#0a1814]">
    <section className="bg-[#07120f] text-white"><SiteHeader /><div className="mx-auto max-w-7xl px-5 pb-20 pt-4 lg:px-8"><Breadcrumbs items={[{ label: d.nav.offers, href: '/offres' }, { label: p.name }]} /><div className="mt-12 grid gap-10 lg:grid-cols-[1.1fr_.9fr] lg:items-end"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-[#b8ff3d]">{p.tag}</p><h1 className="mt-5 text-5xl font-semibold leading-[1] tracking-[-.05em] sm:text-6xl lg:text-7xl">{p.name}</h1><p className="mt-6 max-w-xl text-lg leading-8 text-white/60">{p.pitch}</p></div><div className="rounded-[28px] border border-white/12 bg-white/7 p-6 backdrop-blur"><p className="text-4xl font-semibold">{p.price}{pack !== 'signature' && <span className="ml-2 text-base font-normal text-white/60">{o.perMonth}</span>}</p><p className="mt-3 text-xs leading-5 text-white/50">{pp.priceNote}</p><div className="mt-6 flex flex-col gap-2 sm:flex-row"><Link href={`/diagnostic?pack=${pack}`} className="rounded-full bg-[#b8ff3d] px-6 py-3.5 text-center text-sm font-bold text-[#07120f]">{pp.choose}</Link><Link href="/offres" className="rounded-full border border-white/20 px-6 py-3.5 text-center text-sm font-bold">{pp.compare}</Link></div></div></div></div></section>
    <section className="px-5 py-20 lg:px-8 lg:py-28"><div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[.8fr_1.2fr]"><div><p className="eyebrow">{pp.forWho}</p><p className="mt-5 text-2xl font-semibold leading-snug">{p.forWho}</p></div><div><p className="eyebrow">{pp.includedEyebrow}</p><h2 className="mt-5 text-3xl font-semibold tracking-tight">{pp.includedTitle}</h2><div className="mt-8 grid gap-4 sm:grid-cols-2">{p.included.map(([title, text], i) => <article key={title} className="rounded-[26px] border border-black/8 bg-white p-6"><span className="text-sm font-semibold text-[#4556f5]">0{i + 1}</span><h3 className="mt-8 text-lg font-semibold">{title}</h3><p className="mt-2 text-sm leading-6 text-black/55">{text}</p></article>)}</div></div></div></section>
    <section className="bg-white px-5 py-20 lg:px-8 lg:py-28"><div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2"><div><p className="eyebrow">{pp.installationEyebrow}</p><h2 className="mt-5 text-3xl font-semibold tracking-tight">{pp.installationTitle}</h2><p className="mt-6 leading-7 text-black/60">{p.installation}</p></div><div><p className="eyebrow">{pp.upgradesEyebrow}</p><h2 className="mt-5 text-3xl font-semibold tracking-tight">{pp.upgradesTitle}</h2><ul className="mt-6 flex flex-wrap gap-2">{p.upgrades.map((u) => <li key={u} className="rounded-full border border-black/10 px-4 py-2.5 text-xs font-bold">{u}</li>)}</ul></div></div></section>
    <section className="px-5 py-20 lg:px-8"><div className="mx-auto max-w-7xl"><p className="eyebrow">{pp.otherPacks}</p><div className="mt-6 grid gap-4 sm:grid-cols-2">{others.map((id) => { const other = o.packs[id]; return <Link key={id} href={`/offres/${id}`} className="group rounded-[26px] border border-black/8 bg-white p-6 transition hover:-translate-y-1"><p className="text-xs font-bold uppercase tracking-[.12em] text-black/40">{other.tag}</p><h3 className="mt-4 text-2xl font-semibold">{other.name}</h3><p className="mt-2 text-sm text-black/55">{other.pitch}</p><p className="mt-4 text-lg font-semibold">{other.price}{id !== 'signature' && <span className="ml-1 text-xs font-normal">{o.perMonth}</span>}</p></Link>; })}</div></div></section>
    <SiteFooter />
  </main>;
}
