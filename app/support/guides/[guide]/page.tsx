import type { Metadata } from 'next';
import Link from '@/components/Link';
import { notFound } from 'next/navigation';
import Breadcrumbs from '@/components/Breadcrumbs';
import JsonLd from '@/components/JsonLd';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import { getI18n, pageMetadata } from '@/lib/i18n/server';
import { guideIds, isGuideId } from '@/lib/support';

type Params = Promise<{ guide: string }>;
export const dynamicParams = false;
export function generateStaticParams() { return guideIds.map((guide) => ({ guide })); }

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { guide } = await params;
  if (!isGuideId(guide)) return {};
  const { d, locale } = await getI18n();
  const item = d.support.guides.items[guide];
  return pageMetadata(d, locale, { title: `${item.title} · ${d.support.guides.eyebrow}`, description: item.summary, path: `/support/guides/${guide}`, slot: 'support' });
}

export default async function GuidePage({ params }: { params: Params }) {
  const { guide } = await params;
  if (!isGuideId(guide)) notFound();
  const { d } = await getI18n();
  const g = d.support.guides;
  const item = g.items[guide];
  const jsonLd = { '@context': 'https://schema.org', '@type': 'HowTo', name: item.title, description: item.summary, totalTime: undefined, step: item.steps.map((text, i) => ({ '@type': 'HowToStep', position: i + 1, text })) };
  return <main id="contenu" className="theme-page bg-[#f3f5fb] text-black">
    <JsonLd data={jsonLd} />
    <section className="bg-black text-white"><SiteHeader /><div className="mx-auto max-w-7xl px-5 pb-20 pt-4 lg:px-8"><Breadcrumbs items={[{ label: d.nav.support, href: '/support' }, { label: g.eyebrow, href: '/support/guides' }, { label: item.title }]} /><p className="mt-10 text-xs font-bold uppercase tracking-[.16em] text-[#52c6ff]">{g.eyebrow} · {g.duration} {item.duration}</p><h1 className="mt-5 max-w-4xl text-5xl font-light leading-[1] tracking-[-.05em] sm:text-6xl">{item.title}</h1><p className="mt-6 max-w-2xl text-lg leading-8 text-white/60">{item.summary}</p></div></section>
    <section className="px-5 py-16 lg:px-8 lg:py-24"><div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.2fr_.8fr]"><div><p className="eyebrow">{g.stepsTitle}</p><ol className="mt-6 space-y-4">{item.steps.map((step, i) => <li key={step} className="flex gap-5 rounded-[22px] border border-black/8 bg-white p-5"><span className="grid size-9 shrink-0 place-items-center rounded-full bg-[#4556f5] text-sm font-bold text-white">{i + 1}</span><p className="leading-7">{step}</p></li>)}</ol></div><aside className="h-fit rounded-[28px] bg-black p-7 text-white"><p className="text-xs font-bold uppercase tracking-[.14em] text-[#52c6ff]">{g.tipsTitle}</p><ul className="mt-5 space-y-4 text-sm leading-6 text-white/80">{item.tips.map((tip) => <li key={tip} className="flex gap-3"><span className="text-[#52c6ff]">✦</span>{tip}</li>)}</ul><p className="mt-8 text-xs font-bold uppercase tracking-[.14em] text-white/45">{g.otherGuides}</p><div className="mt-3 flex flex-col gap-2">{guideIds.filter((x) => x !== guide).map((x) => <Link key={x} href={`/support/guides/${x}`} className="text-sm text-white/70 underline-offset-4 hover:underline">{g.items[x].title}</Link>)}</div></aside></div></section>
    <SiteFooter />
  </main>;
}
