import Breadcrumbs from '@/components/Breadcrumbs';
import SiteHeader from '@/components/SiteHeader';
import HeroBackdrop from '@/components/HeroBackdrop';
import SiteFooter from '@/components/SiteFooter';
import { getI18n } from '@/lib/i18n/server';

export default async function LegalPage({ title, sections }: { title: string; sections: string[][] }) {
  const { d } = await getI18n();
  return <main id="contenu" className="theme-page bg-[#f3f5fb] text-black">
    <section className="relative overflow-hidden bg-black text-white"><HeroBackdrop slot="legal" alt={d.images.legal} opacity="opacity-30" priority /><SiteHeader /><div className="relative mx-auto max-w-7xl px-5 pb-16 pt-4 lg:px-8"><Breadcrumbs items={[{ label: title }]} /><h1 className="mt-10 max-w-4xl text-5xl font-light leading-[1] tracking-[-.05em] sm:text-6xl">{title}</h1><p className="mt-5 text-sm text-white/50">{d.legal.lastUpdated}</p></div></section>
    <section className="px-5 py-16 lg:px-8 lg:py-24"><div className="mx-auto max-w-4xl space-y-10">{sections.map(([heading, text]) => <article key={heading}><h2 className="text-2xl font-semibold tracking-tight">{heading}</h2><p className="mt-4 leading-8 text-black/70">{text}</p></article>)}</div></section>
    <SiteFooter />
  </main>;
}
