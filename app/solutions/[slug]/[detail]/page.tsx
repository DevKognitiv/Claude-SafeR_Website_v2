import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import { getSolutionDetail, solutions } from '@/lib/solutions';

export const dynamicParams = false;

export function generateStaticParams() {
  return solutions.flatMap((solution) => solution.details.map((detail) => ({ slug: solution.slug, detail: detail.slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string; detail: string }> }): Promise<Metadata> {
  const { slug, detail: detailSlug } = await params;
  const record = getSolutionDetail(slug, detailSlug);
  if (!record) return {};
  const { solution, detail } = record;
  return {
    title: detail.title,
    description: detail.description,
    openGraph: { title: `${detail.title} — SafeR`, description: detail.description, images: [{ url: solution.image, alt: detail.title }] },
    twitter: { card: 'summary_large_image', title: `${detail.title} — SafeR`, description: detail.description, images: [solution.image] },
  };
}

export default async function SolutionDetailPage({ params }: { params: Promise<{ slug: string; detail: string }> }) {
  const { slug, detail: detailSlug } = await params;
  const record = getSolutionDetail(slug, detailSlug);
  if (!record) notFound();
  const { solution, detail } = record;

  return (
    <main className="theme-page bg-[#f3f5fb] text-black">
      <section className="bg-black text-white"><SiteHeader /><div className="mx-auto max-w-7xl px-5 pb-20 pt-10 lg:px-8"><nav aria-label="Fil d’Ariane" className="flex flex-wrap gap-2 text-xs text-white/45"><Link href="/">Accueil</Link><span>/</span><Link href="/solutions">Solutions</Link><span>/</span><Link href={`/solutions/${solution.slug}`}>{solution.title}</Link><span>/</span><span className="text-white">{detail.title}</span></nav><div className="mt-12 grid gap-10 lg:grid-cols-[.9fr_1.1fr] lg:items-center"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-[#52c6ff]">{detail.short} · {solution.title}</p><h1 className="mt-5 text-5xl font-light leading-[1] tracking-[-.05em] sm:text-6xl">{detail.title}</h1><p className="mt-6 max-w-xl text-lg leading-8 text-white/60">{detail.description}</p><div className="mt-8 flex flex-col gap-3 sm:flex-row"><Link href="/diagnostic" data-i18n="common.assessment" className="rounded-full bg-[#4556f5] px-7 py-4 text-center text-sm font-bold text-white">Faire mon diagnostic</Link><Link href="/offres" className="rounded-full border border-white/15 px-7 py-4 text-center text-sm font-bold">Voir les offres</Link></div></div><div className="media-grade relative min-h-[420px] overflow-hidden rounded-[34px]"><img src={solution.image} alt={detail.title} className="absolute inset-0 h-full w-full object-cover" /><span className="absolute bottom-6 right-6 z-10 rounded-full bg-black/70 px-4 py-2 text-xs font-semibold backdrop-blur">SafeR · {detail.short}</span></div></div></div></section>

      <section className="px-5 py-20 lg:px-8 lg:py-28"><div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[.8fr_1.2fr]"><div><p data-i18n="detail.included" className="eyebrow">Ce qui est inclus</p><h2 className="section-title mt-5">L’essentiel, clairement assemblé.</h2></div><div className="grid gap-4 sm:grid-cols-2">{detail.included.map((item, index) => <article key={item} className="rounded-[26px] border border-black/8 bg-white p-6"><span className="text-sm font-semibold text-[#4556f5]">0{index + 1}</span><p className="mt-12 text-xl font-semibold">{item}</p></article>)}</div></div></section>

      <section className="bg-black px-5 py-20 text-white lg:px-8 lg:py-28"><div className="mx-auto max-w-7xl"><p data-i18n="detail.operation" className="text-xs font-bold uppercase tracking-[.16em] text-[#52c6ff]">Comment cela fonctionne</p><div className="mt-10 grid gap-px overflow-hidden rounded-[30px] bg-white/12 md:grid-cols-3">{[['01','Détecter','Le dispositif capte un événement utile.'],['02','Qualifier','La plateforme et, selon le service, notre équipe vérifient la situation.'],['03','Agir','Vous êtes informé et le protocole prévu est déclenché.']].map(([n,title,text]) => <div key={n} className="bg-black p-7"><span className="text-sm text-[#52c6ff]">{n}</span><h3 className="mt-16 text-2xl font-semibold">{title}</h3><p className="mt-3 text-sm leading-6 text-white/50">{text}</p></div>)}</div></div></section>

      <section className="bg-[#52c6ff] px-5 py-20 text-black lg:px-8"><div className="mx-auto flex max-w-7xl flex-col gap-7 lg:flex-row lg:items-center lg:justify-between"><h2 data-i18n="detail.ready" className="max-w-3xl text-4xl font-light leading-tight sm:text-5xl">Prêt à mieux protéger votre espace ?</h2><Link href="/diagnostic" data-i18n="common.quote" className="rounded-full bg-black px-7 py-4 text-center text-sm font-bold text-white">Demander un devis</Link></div></section>
      <SiteFooter />
    </main>
  );
}
