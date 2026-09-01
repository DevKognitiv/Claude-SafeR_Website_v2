import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import { getSolution, solutions } from '@/lib/solutions';

export const dynamicParams = false;

export function generateStaticParams() {
  return solutions.map((solution) => ({ slug: solution.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const solution = getSolution(slug);
  if (!solution) return {};
  return {
    title: solution.title,
    description: solution.description,
    openGraph: { title: `${solution.title} — SafeR`, description: solution.description, images: [{ url: solution.image, alt: solution.title }] },
    twitter: { card: 'summary_large_image', title: `${solution.title} — SafeR`, description: solution.description, images: [solution.image] },
  };
}

export default async function SolutionCategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const solution = getSolution(slug);
  if (!solution) notFound();

  return (
    <main className="theme-page bg-[#f3f5fb] text-black">
      <section className="relative min-h-[78vh] overflow-hidden bg-black text-white">
        <img src={solution.image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-45" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-[#4556f5]/25" />
        <SiteHeader />
        <div className="relative mx-auto flex min-h-[calc(78vh-96px)] max-w-7xl items-end px-5 pb-20 lg:px-8">
          <div className="max-w-4xl"><Link href="/solutions" data-i18n="common.backSolutions" className="text-xs font-bold uppercase tracking-[.16em] text-[#52c6ff]">Toutes les solutions</Link><p className="mt-8 text-sm text-white/45">{solution.eyebrow}</p><h1 data-i18n={`solution.${solution.slug}.title`} className="mt-3 text-5xl font-light leading-[.98] tracking-[-.05em] sm:text-6xl lg:text-7xl">{solution.title}</h1><p data-i18n={`solution.${solution.slug}.description`} className="mt-7 max-w-2xl text-lg leading-8 text-white/65">{solution.description}</p></div>
        </div>
      </section>

      <section className="px-5 py-20 lg:px-8 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[.72fr_1.28fr]">
          <div><p className="eyebrow">Pourquoi SafeR</p><h2 className="section-title mt-5">Une protection pensée comme un ensemble.</h2><ul className="mt-8 space-y-3">{solution.benefits.map((benefit) => <li key={benefit} className="flex gap-3 text-sm"><span className="text-[#4556f5]">✓</span>{benefit}</li>)}</ul></div>
          <div className="grid gap-4 sm:grid-cols-2">
            {solution.details.map((detail, index) => <Link key={detail.slug} href={`/solutions/${solution.slug}/${detail.slug}`} className={`group rounded-[30px] p-7 ${index === 0 ? 'bg-[#4556f5] text-white sm:col-span-2' : 'border border-black/8 bg-white'}`}><div className="flex items-center justify-between"><span className={`text-xs font-bold uppercase tracking-[.14em] ${index === 0 ? 'text-white/55' : 'text-black/40'}`}>{detail.short}</span><span className="grid size-10 place-items-center rounded-full border border-current/15 transition group-hover:translate-x-1">→</span></div><h3 className="mt-16 text-2xl font-semibold">{detail.title}</h3><p className={`mt-3 max-w-xl text-sm leading-6 ${index === 0 ? 'text-white/65' : 'text-black/50'}`}>{detail.description}</p></Link>)}
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
