import type { Metadata } from 'next';
import Link from '@/components/Link';
import { notFound } from 'next/navigation';
import Breadcrumbs from '@/components/Breadcrumbs';
import SiteHeader from '@/components/SiteHeader';
import SmartImage from '@/components/SmartImage';
import { pageImage } from '@/lib/images';
import SiteFooter from '@/components/SiteFooter';
import ProductCard from '@/components/store/ProductCard';
import JsonLd from '@/components/JsonLd';
import { productsForSolution } from '@/lib/catalog';
import { toStoreItem } from '@/lib/catalog/view';
import { getI18n, pageMetadata } from '@/lib/i18n/server';
import { getDetailCopy, getSolutionStructure, isSolutionSlug, solutionStructures } from '@/lib/solutions';

type Params = Promise<{ slug: string; detail: string }>;
export const dynamicParams = false;

export function generateStaticParams() {
  return solutionStructures.flatMap((solution) => solution.details.map((detail) => ({ slug: solution.slug, detail })));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug, detail: detailSlug } = await params;
  if (!isSolutionSlug(slug)) return {};
  const { d, locale } = await getI18n();
  const detail = getDetailCopy(d, slug, detailSlug);
  if (!detail) return {};
  return pageMetadata(d, locale, { title: detail.title, description: detail.description, path: `/solutions/${slug}/${detailSlug}`, image: pageImage(getSolutionStructure(slug)!.image).src, imageAlt: d.images[getSolutionStructure(slug)!.image] });
}

export default async function SolutionDetailPage({ params }: { params: Params }) {
  const { slug, detail: detailSlug } = await params;
  if (!isSolutionSlug(slug)) notFound();
  const { d, locale } = await getI18n();
  const structure = getSolutionStructure(slug)!;
  const solution = d.solutions.items[slug];
  const detail = getDetailCopy(d, slug, detailSlug);
  if (!detail || !structure.details.includes(detailSlug)) notFound();
  const s = d.solutions.detail;
  const equipment = productsForSolution(`${slug}/${detailSlug}`, 3).map((p) => toStoreItem(p, locale));
  const faqJsonLd = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: detail.faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) };

  return (
    <main id="contenu" className="theme-page bg-[#f3f5fb] text-black">
      <JsonLd data={faqJsonLd} />
      <section className="bg-black text-white"><SiteHeader /><div className="mx-auto max-w-7xl px-5 pb-20 pt-4 lg:px-8"><Breadcrumbs items={[{ label: d.nav.solutions, href: '/solutions' }, { label: solution.title, href: `/solutions/${slug}` }, { label: detail.title }]} /><div className="mt-12 grid gap-10 lg:grid-cols-[.9fr_1.1fr] lg:items-center"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-[#52c6ff]">{detail.short} · {solution.title}</p><h1 className="mt-5 text-5xl font-light leading-[1] tracking-[-.05em] sm:text-6xl">{detail.title}</h1><p className="mt-6 max-w-xl text-lg leading-8 text-white/60">{detail.description}</p><div className="mt-8 flex flex-col gap-3 sm:flex-row"><Link href="/diagnostic" className="rounded-full bg-[#4556f5] px-7 py-4 text-center text-sm font-bold text-white">{d.common.assessment}</Link><Link href={`/solutions/${slug}/${detailSlug}/equipements`} className="rounded-full border border-white/15 px-7 py-4 text-center text-sm font-bold">{s.viewEquipment}</Link></div></div><div className="media-grade relative min-h-[420px] overflow-hidden rounded-[34px]"><SmartImage slot={structure.image} alt={d.images[structure.image]} loading="eager" className="absolute inset-0 h-full w-full object-cover" /><span className="absolute bottom-6 right-6 z-10 rounded-full bg-black/70 px-4 py-2 text-xs font-semibold backdrop-blur">SafeR · {detail.short}</span></div></div></div></section>

      <section className="px-5 py-20 lg:px-8 lg:py-28"><div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[.8fr_1.2fr]"><div><p className="eyebrow">{s.includedEyebrow}</p><h2 className="section-title mt-5">{s.includedTitle}</h2></div><div className="grid gap-4 sm:grid-cols-2">{detail.included.map((item, index) => <article key={item} className="rounded-[26px] border border-black/8 bg-white p-6"><span className="text-sm font-semibold text-[#4556f5]">0{index + 1}</span><p className="mt-12 text-xl font-semibold">{item}</p></article>)}</div></div></section>

      <section className="bg-black px-5 py-20 text-white lg:px-8 lg:py-28"><div className="mx-auto max-w-7xl"><p className="text-xs font-bold uppercase tracking-[.16em] text-[#52c6ff]">{s.operation}</p><div className="mt-10 grid gap-px overflow-hidden rounded-[30px] bg-white/12 md:grid-cols-3">{s.steps.map(([n, title, text]) => <div key={n} className="bg-black p-7"><span className="text-sm text-[#52c6ff]">{n}</span><h3 className="mt-16 text-2xl font-semibold">{title}</h3><p className="mt-3 text-sm leading-6 text-white/50">{text}</p></div>)}</div></div></section>

      <section className="px-5 py-20 lg:px-8 lg:py-28"><div className="mx-auto max-w-7xl"><div className="grid gap-8 lg:grid-cols-[.8fr_1.2fr]"><div><p className="eyebrow">{s.useCasesEyebrow}</p><h2 className="section-title mt-5">{s.useCasesTitle}</h2></div><div className="grid gap-4">{detail.useCases.map(([title, text]) => <article key={title} className="rounded-[24px] border border-black/8 bg-white p-6 sm:flex sm:gap-8"><h3 className="text-lg font-semibold sm:w-56 sm:shrink-0">{title}</h3><p className="mt-2 text-sm leading-6 text-black/55 sm:mt-0">{text}</p></article>)}</div></div></div></section>

      {equipment.length > 0 && <section className="bg-white px-5 py-20 lg:px-8 lg:py-28"><div className="mx-auto max-w-7xl"><div className="grid gap-8 lg:grid-cols-2 lg:items-end"><div><p className="eyebrow">{s.equipmentEyebrow}</p><h2 className="section-title mt-5">{s.equipmentTitle}</h2></div><p className="max-w-lg leading-7 text-black/55 lg:ml-auto">{s.equipmentIntro}</p></div><div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">{equipment.map((item) => <ProductCard key={item.id} item={item} />)}</div><div className="mt-10 text-center"><Link href={`/solutions/${slug}/${detailSlug}/equipements`} className="rounded-full bg-black px-7 py-4 text-sm font-bold text-white">{s.viewEquipment}</Link></div></div></section>}

      <section className="px-5 py-20 lg:px-8 lg:py-28"><div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[.8fr_1.2fr]"><div><p className="eyebrow">{s.faqEyebrow}</p><h2 className="section-title mt-5">{detail.title}</h2></div><div className="divide-y divide-black/10 border-t border-black/10">{detail.faq.map(([q, a]) => <details key={q} className="group py-6"><summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-semibold"><span>{q}</span><span className="grid size-8 shrink-0 place-items-center rounded-full border border-black/10 group-open:rotate-45">+</span></summary><p className="max-w-2xl pr-10 pt-4 text-sm leading-6 text-black/50">{a}</p></details>)}</div></div></section>

      <section className="bg-[#52c6ff] px-5 py-20 text-black lg:px-8"><div className="mx-auto flex max-w-7xl flex-col gap-7 lg:flex-row lg:items-center lg:justify-between"><h2 className="max-w-3xl text-4xl font-light leading-tight sm:text-5xl">{s.ready}</h2><Link href="/diagnostic" className="rounded-full bg-black px-7 py-4 text-center text-sm font-bold text-white">{d.common.quote}</Link></div></section>
      <SiteFooter />
    </main>
  );
}
