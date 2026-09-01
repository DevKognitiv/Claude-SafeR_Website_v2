import type { Metadata } from 'next';
import Link from '@/components/Link';
import { notFound } from 'next/navigation';
import Breadcrumbs from '@/components/Breadcrumbs';
import SiteFooter from '@/components/SiteFooter';
import SiteHeader from '@/components/SiteHeader';
import { getI18n, pageMetadata } from '@/lib/i18n/server';
import { isVerificationStatus, verificationColors, verificationOrder } from '@/lib/partner-verification';

type Params = Promise<{ status: string }>;
export const dynamicParams = false;
export function generateStaticParams() { return verificationOrder.map((status) => ({ status })); }

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { status } = await params;
  if (!isVerificationStatus(status)) return {};
  const { d, locale } = await getI18n();
  const level = d.partners.levels.items[status];
  return pageMetadata(d, locale, { title: `${d.partners.levelPage.metaPrefix} · ${level.label}`, description: level.description, path: `/partenaires/niveaux/${status}` });
}

export default async function PartnerLevelPage({ params }: { params: Params }) {
  const { status } = await params;
  if (!isVerificationStatus(status)) notFound();
  const { d } = await getI18n();
  const level = d.partners.levels.items[status];
  const lp = d.partners.levelPage;
  const color = verificationColors[status];
  return <main id="contenu" className="theme-page bg-[#f3f5fb] text-black">
    <section className="bg-black text-white"><SiteHeader /><div className="mx-auto max-w-7xl px-5 pb-20 pt-4 lg:px-8"><Breadcrumbs items={[{ label: d.nav.partners, href: '/partenaires' }, { label: d.partners.levels.eyebrow, href: '/partenaires#niveaux' }, { label: level.label }]} /><div className="mt-12 max-w-3xl"><span className="verification-badge rounded-full px-4 py-2 text-xs font-bold text-black" style={{ backgroundColor: color }}>{level.label}</span><h1 className="mt-8 text-5xl font-light leading-[1] tracking-[-.05em] sm:text-6xl">{level.summary}</h1><p className="mt-6 text-lg leading-8 text-white/60">{level.description}</p></div></div></section>
    <section className="px-5 py-20 lg:px-8 lg:py-28"><div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2"><div><p className="eyebrow">{lp.criteriaTitle}</p><ul className="mt-6 space-y-4">{level.criteria.map((c) => <li key={c} className="flex gap-3 text-base leading-7"><span style={{ color }}>✓</span>{c}</li>)}</ul></div><div className="grid gap-4"><article className="rounded-[26px] border border-black/8 bg-white p-6"><p className="eyebrow">{lp.nextTitle}</p><p className="mt-4 leading-7 text-black/70">{level.next}</p></article><article className="rounded-[26px] bg-black p-6 text-white"><p className="text-xs font-bold uppercase tracking-[.14em] text-[#52c6ff]">{lp.durationTitle}</p><p className="mt-4 leading-7 text-white/80">{level.duration}</p></article></div></div></section>
    <section className="px-5 pb-24 lg:px-8"><div className="mx-auto flex max-w-7xl flex-col gap-6 rounded-[30px] bg-[#52c6ff] p-8 text-black sm:flex-row sm:items-center sm:justify-between"><div><p className="text-xs font-bold uppercase tracking-[.14em] text-black/50">{lp.otherLevels}</p><div className="mt-3 flex flex-wrap gap-2">{verificationOrder.filter((s) => s !== status).map((s) => <Link key={s} href={`/partenaires/niveaux/${s}`} className="rounded-full bg-black/10 px-4 py-2 text-xs font-bold hover:bg-black hover:text-white">{d.partners.levels.items[s].label}</Link>)}</div></div><Link href="/partenaires/inscription" className="rounded-full bg-black px-7 py-4 text-center text-sm font-bold text-white">{lp.apply}</Link></div></section>
    <SiteFooter />
  </main>;
}
