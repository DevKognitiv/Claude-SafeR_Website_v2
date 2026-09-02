import type { Metadata } from 'next';
import Link from '@/components/Link';
import { notFound } from 'next/navigation';
import Breadcrumbs from '@/components/Breadcrumbs';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import ProductCard from '@/components/store/ProductCard';
import { GlyphIcon } from '@/components/Icon';
import { productsForSolution } from '@/lib/catalog';
import { toStoreItem } from '@/lib/catalog/view';
import { getI18n, pageMetadata } from '@/lib/i18n/server';
import { isOptionId, optionOrder } from '@/lib/packs';
import { getDetailCopy, isSolutionSlug } from '@/lib/solutions';

type Params = Promise<{ option: string }>;
export const dynamicParams = false;
export function generateStaticParams() { return optionOrder.map((option) => ({ option })); }

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { option } = await params;
  if (!isOptionId(option)) return {};
  const { d, locale } = await getI18n();
  const o = d.offers.options[option];
  return pageMetadata(d, locale, { title: `${o.title} · ${d.offers.optionPage.eyebrow}`, description: o.description, path: `/offres/options/${option}`, slot: 'offers' });
}

export default async function OptionPage({ params }: { params: Params }) {
  const { option } = await params;
  if (!isOptionId(option)) notFound();
  const { d, locale } = await getI18n();
  const o = d.offers.options[option];
  const op = d.offers.optionPage;
  const [slug, detail] = o.solution.split('/');
  const related = isSolutionSlug(slug) ? getDetailCopy(d, slug, detail) : undefined;
  const equipment = productsForSolution(o.solution, 3).map((p) => toStoreItem(p, locale));

  return <main id="contenu" className="theme-page offers-page bg-[#f1f4f1] text-[#0a1814]">
    <section className="bg-[#07120f] text-white"><SiteHeader /><div className="mx-auto max-w-7xl px-5 pb-20 pt-4 lg:px-8"><Breadcrumbs items={[{ label: d.nav.offers, href: '/offres' }, { label: d.offers.alacarte.eyebrow, href: '/offres#options' }, { label: o.title }]} /><div className="mt-12 max-w-3xl"><span className="grid size-14 place-items-center rounded-full bg-[#b8ff3d] text-black"><GlyphIcon glyph={o.icon} size={26} /></span><p className="mt-8 text-xs font-bold uppercase tracking-[.16em] text-[#b8ff3d]">{op.eyebrow}</p><h1 className="mt-5 text-5xl font-semibold leading-[1] tracking-[-.05em] sm:text-6xl">{o.title}</h1><p className="mt-6 text-lg leading-8 text-white/60">{o.description}</p><p className="mt-4 text-sm text-white/45">{op.availableWith}</p><Link href={`/diagnostic?option=${option}`} className="mt-8 inline-flex rounded-full bg-[#b8ff3d] px-7 py-4 text-sm font-bold text-[#07120f]">{op.addToSystem}</Link></div></div></section>
    <section className="px-5 py-20 lg:px-8 lg:py-28"><div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2"><div><p className="eyebrow">{op.benefits}</p><ul className="mt-6 space-y-4">{o.benefits.map((b) => <li key={b} className="flex gap-3 text-lg"><span className="text-[#4556f5]">✓</span>{b}</li>)}</ul></div>{related && <Link href={`/solutions/${o.solution}`} className="group rounded-[30px] bg-[#4556f5] p-8 text-white transition hover:-translate-y-1"><p className="text-xs font-bold uppercase tracking-[.14em] text-white/60">{op.related}</p><h2 className="mt-6 text-3xl font-semibold">{related.title}</h2><p className="mt-3 leading-7 text-white/70">{related.description}</p><span className="mt-6 inline-flex text-sm font-bold">{d.common.discover} →</span></Link>}</div></section>
    {equipment.length > 0 && <section className="bg-white px-5 py-20 lg:px-8 lg:py-28"><div className="mx-auto max-w-7xl"><p className="eyebrow">{d.solutions.detail.equipmentEyebrow}</p><h2 className="mt-5 text-3xl font-semibold tracking-tight">{d.solutions.detail.equipmentTitle}</h2><div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">{equipment.map((item) => <ProductCard key={item.id} item={item} />)}</div></div></section>}
    <section className="px-5 py-20 lg:px-8"><div className="mx-auto max-w-7xl"><p className="eyebrow">{op.otherOptions}</p><div className="mt-5 flex flex-wrap gap-2">{optionOrder.filter((id) => id !== option).map((id) => <Link key={id} href={`/offres/options/${id}`} className="rounded-full border border-black/10 bg-white px-4 py-2.5 text-xs font-bold hover:border-[#4556f5]"><GlyphIcon glyph={d.offers.options[id].icon} size={14} className="mr-1 inline" />{d.offers.options[id].title}</Link>)}</div></div></section>
    <SiteFooter />
  </main>;
}
