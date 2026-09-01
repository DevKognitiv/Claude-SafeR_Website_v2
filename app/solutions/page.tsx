import type { Metadata } from 'next';
import Link from 'next/link';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import { solutions } from '@/lib/solutions';

export const metadata: Metadata = {
  title: 'Solutions de sécurité intelligente',
  description: 'Explorez les solutions SafeR de vidéosurveillance, alarme, contrôle d’accès et domotique en Côte d’Ivoire.',
};

export default function SolutionsPage() {
  return (
    <main className="theme-page bg-[#f3f5fb] text-black">
      <section className="relative overflow-hidden bg-black pb-24 text-white">
        <div className="brand-grid absolute inset-0 opacity-45" />
        <div className="brand-cut absolute -right-32 bottom-0 h-40 w-[62%] bg-[#4556f5]" />
        <SiteHeader />
        <div className="relative mx-auto max-w-7xl px-5 pt-14 lg:px-8 lg:pt-20">
          <p data-i18n="solutions.eyebrow" className="text-xs font-bold uppercase tracking-[.16em] text-[#52c6ff]">Protection connectée</p>
          <h1 data-i18n="solutions.title" className="mt-6 max-w-5xl text-5xl font-light leading-[1] tracking-[-.05em] sm:text-6xl lg:text-7xl">Une solution SafeR pour chaque risque.</h1>
          <p data-i18n="solutions.intro" className="mt-7 max-w-2xl text-lg leading-8 text-white/60">Explorez nos univers de protection, puis entrez dans le détail des équipements et services adaptés à votre espace.</p>
        </div>
      </section>

      <section className="px-5 py-20 lg:px-8 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-2">
          {solutions.map((solution, index) => (
            <Link key={solution.slug} href={`/solutions/${solution.slug}`} className="group relative min-h-[470px] overflow-hidden rounded-[34px] bg-black text-white">
              <img src={solution.image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-55 transition duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-7 sm:p-9">
                <div className="mb-8 flex items-center justify-between"><span className="text-xs font-bold uppercase tracking-[.16em] text-[#bcecff]">{solution.eyebrow}</span><span className="grid size-11 place-items-center rounded-full border border-white/20 bg-white/10 transition group-hover:bg-[#52c6ff] group-hover:text-black">↗</span></div>
                <p className="text-sm text-white/45">0{index + 1}</p>
                <h2 data-i18n={`solution.${solution.slug}.title`} className="mt-3 text-3xl font-semibold tracking-[-.03em] sm:text-4xl">{solution.title}</h2>
                <p data-i18n={`solution.${solution.slug}.summary`} className="mt-3 max-w-xl leading-7 text-white/60">{solution.summary}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-[#4556f5] px-5 py-20 text-white lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div><p className="text-xs font-bold uppercase tracking-[.16em] text-white/55">Un système, plusieurs couches</p><h2 className="mt-4 max-w-3xl text-4xl font-light leading-tight sm:text-5xl">Composez votre protection autour de votre quotidien.</h2></div>
          <Link href="/diagnostic" data-i18n="common.assessment" className="rounded-full bg-black px-7 py-4 text-center text-sm font-bold text-white">Faire mon diagnostic</Link>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
