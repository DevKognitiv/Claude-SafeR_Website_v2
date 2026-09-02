import type { Metadata } from 'next';
import Link from '@/components/Link';
import { notFound } from 'next/navigation';
import Breadcrumbs from '@/components/Breadcrumbs';
import SiteHeader from '@/components/SiteHeader';
import SmartImage from '@/components/SmartImage';
import { pageImage } from '@/lib/images';
import SiteFooter from '@/components/SiteFooter';
import { getI18n, pageMetadata } from '@/lib/i18n/server';
import { getDetailCopy, getSolutionStructure, isSolutionSlug, solutionStructures } from '@/lib/solutions';

type Params = Promise<{ slug: string }>;
export const dynamicParams = false;

export function generateStaticParams() {
  return solutionStructures.map((solution) => ({ slug: solution.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  if (!isSolutionSlug(slug)) return {};
  const { d, locale } = await getI18n();
  const copy = d.solutions.items[slug];
  return pageMetadata(d, locale, { title: copy.title, description: copy.description, path: `/solutions/${slug}`, image: pageImage(getSolutionStructure(slug)!.image).src, imageAlt: d.images[getSolutionStructure(slug)!.image] });
}

export default async function SolutionCategoryPage({ params }: { params: Params }) {
  const { slug } = await params;
  if (!isSolutionSlug(slug)) notFound();
  const { d } = await getI18n();
  const structure = getSolutionStructure(slug)!;
  const copy = d.solutions.items[slug];
  const s = d.solutions;

  return (
    <main id="contenu" className="theme-page bg-[#f3f5fb] text-black">
      <section className="relative min-h-[78vh] overflow-hidden bg-black text-white">
        <SmartImage slot={structure.image} alt={d.images[structure.image]} loading="eager" className="absolute inset-0 h-full w-full object-cover opacity-45" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-[#4556f5]/25" />
        <SiteHeader />
        <div className="relative mx-auto flex min-h-[calc(78vh-96px)] max-w-7xl flex-col justify-between px-5 pb-20 pt-4 lg:px-8">
          <Breadcrumbs items={[{ label: d.nav.solutions, href: '/solutions' }, { label: copy.title }]} />
          <div className="max-w-4xl"><p className="mt-8 text-sm text-white/45">{copy.eyebrow}</p><h1 className="mt-3 text-5xl font-light leading-[.98] tracking-[-.05em] sm:text-6xl lg:text-7xl">{copy.title}</h1><p className="mt-7 max-w-2xl text-lg leading-8 text-white/65">{copy.description}</p></div>
        </div>
      </section>
      <section className="px-5 py-20 lg:px-8 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[.72fr_1.28fr]">
          <div><p className="eyebrow">{s.whyEyebrow}</p><h2 className="section-title mt-5">{s.whyTitle}</h2><ul className="mt-8 space-y-3">{copy.benefits.map((benefit) => <li key={benefit} className="flex gap-3 text-sm"><span className="text-[#4556f5]">✓</span>{benefit}</li>)}</ul><Link href={`/store/${slug === 'video-intelligente' ? 'video' : slug === 'alarmes-connectees' ? 'alarme' : slug === 'controle-acces' ? 'acces' : 'domotique'}`} className="mt-8 inline-flex text-sm font-semibold underline underline-offset-4">{s.detail.viewInStore} →</Link></div>
          <div className="grid gap-4 sm:grid-cols-2">
            {structure.details.map((detailSlug, index) => { const detail = getDetailCopy(d, slug, detailSlug)!; return <Link key={detailSlug} href={`/solutions/${slug}/${detailSlug}`} className={`group rounded-[30px] p-7 ${index === 0 ? 'bg-[#4556f5] text-white sm:col-span-2' : 'border border-black/8 bg-white'}`}><div className="flex items-center justify-between"><span className={`text-xs font-bold uppercase tracking-[.14em] ${index === 0 ? 'text-white/55' : 'text-black/40'}`}>{detail.short}</span><span className="grid size-10 place-items-center rounded-full border border-current/15 transition group-hover:translate-x-1">→</span></div><h3 className="mt-16 text-2xl font-semibold">{detail.title}</h3><p className={`mt-3 max-w-xl text-sm leading-6 ${index === 0 ? 'text-white/65' : 'text-black/50'}`}>{detail.description}</p></Link>; })}
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
