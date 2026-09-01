import type { Metadata } from 'next';
import Link from '@/components/Link';
import { notFound } from 'next/navigation';
import Breadcrumbs from '@/components/Breadcrumbs';
import JsonLd from '@/components/JsonLd';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import { getI18n, pageMetadata } from '@/lib/i18n/server';
import { faqThemes, isFaqTheme } from '@/lib/support';

type Params = Promise<{ theme: string }>;
export const dynamicParams = false;
export function generateStaticParams() { return faqThemes.map((theme) => ({ theme })); }

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { theme } = await params;
  if (!isFaqTheme(theme)) return {};
  const { d, locale } = await getI18n();
  const t = d.support.faq.themes[theme];
  return pageMetadata(d, locale, { title: `${t.title} · ${d.support.faq.eyebrow}`, description: t.summary, path: `/support/faq/${theme}` });
}

export default async function FaqThemePage({ params }: { params: Params }) {
  const { theme } = await params;
  if (!isFaqTheme(theme)) notFound();
  const { d } = await getI18n();
  const f = d.support.faq;
  const t = f.themes[theme];
  const jsonLd = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: t.items.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) };
  return <main id="contenu" className="theme-page bg-[#f3f5fb] text-black">
    <JsonLd data={jsonLd} />
    <section className="bg-black text-white"><SiteHeader /><div className="mx-auto max-w-7xl px-5 pb-20 pt-4 lg:px-8"><Breadcrumbs items={[{ label: d.nav.support, href: '/support' }, { label: f.eyebrow, href: '/support/faq' }, { label: t.title }]} /><p className="mt-10 text-xs font-bold uppercase tracking-[.16em] text-[#52c6ff]">{f.eyebrow}</p><h1 className="mt-5 max-w-4xl text-5xl font-light leading-[1] tracking-[-.05em] sm:text-6xl">{t.title}</h1><p className="mt-6 max-w-2xl text-lg leading-8 text-white/60">{t.summary}</p></div></section>
    <section className="px-5 py-16 lg:px-8 lg:py-24"><div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[.7fr_1.3fr]"><div><p className="eyebrow">{f.otherThemes}</p><div className="mt-5 flex flex-wrap gap-2 lg:flex-col lg:items-start">{faqThemes.filter((x) => x !== theme).map((x) => <Link key={x} href={`/support/faq/${x}`} className="rounded-full border border-black/10 bg-white px-4 py-2.5 text-xs font-bold hover:border-[#4556f5]">{f.themes[x].title}</Link>)}</div></div><div className="divide-y divide-black/10 border-t border-black/10">{t.items.map(([q, a]) => <details key={q} className="group py-6" open><summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg font-semibold"><span>{q}</span><span className="grid size-8 shrink-0 place-items-center rounded-full border border-black/10 group-open:rotate-45">+</span></summary><p className="max-w-3xl pr-10 pt-4 leading-7 text-black/60">{a}</p></details>)}</div></div></section>
    <section className="bg-[#52c6ff] px-5 py-20 text-black lg:px-8"><div className="mx-auto flex max-w-7xl flex-col gap-7 lg:flex-row lg:items-center lg:justify-between"><h2 className="max-w-3xl text-4xl font-light">{f.notFound}</h2><Link href="/support/contact" className="rounded-full bg-black px-7 py-4 text-center text-sm font-bold text-white">{d.common.contactUs}</Link></div></section>
    <SiteFooter />
  </main>;
}
