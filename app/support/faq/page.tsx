import type { Metadata } from 'next';
import Link from '@/components/Link';
import Breadcrumbs from '@/components/Breadcrumbs';
import JsonLd from '@/components/JsonLd';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import { getI18n, pageMetadata } from '@/lib/i18n/server';
import { faqThemes } from '@/lib/support';

export async function generateMetadata(): Promise<Metadata> {
  const { d, locale } = await getI18n();
  return pageMetadata(d, locale, { title: d.support.faq.meta.title, description: d.support.faq.meta.description, path: '/support/faq', slot: 'support' });
}

export default async function FaqPage() {
  const { d } = await getI18n();
  const f = d.support.faq;
  const all = faqThemes.flatMap((theme) => f.themes[theme].items.map(([q, a]) => ({ theme, q, a })));
  const jsonLd = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: all.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) };
  return <main id="contenu" className="theme-page bg-[#f3f5fb] text-black">
    <JsonLd data={jsonLd} />
    <section className="bg-black text-white"><SiteHeader /><div className="mx-auto max-w-7xl px-5 pb-20 pt-4 lg:px-8"><Breadcrumbs items={[{ label: d.nav.support, href: '/support' }, { label: f.eyebrow }]} /><p className="mt-10 text-xs font-bold uppercase tracking-[.16em] text-[#52c6ff]">{f.eyebrow}</p><h1 className="mt-5 max-w-4xl text-5xl font-light leading-[1] tracking-[-.05em] sm:text-6xl">{f.title}</h1><p className="mt-6 max-w-2xl text-lg leading-8 text-white/60">{f.intro}</p></div></section>
    <section className="px-5 py-16 lg:px-8 lg:py-20"><div className="mx-auto max-w-7xl"><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{faqThemes.map((theme) => <Link key={theme} href={`/support/faq/${theme}`} className="group rounded-[26px] border border-black/8 bg-white p-6 transition hover:-translate-y-1"><div className="flex items-center justify-between"><h2 className="text-xl font-semibold">{f.themes[theme].title}</h2><span className="grid size-9 place-items-center rounded-full border border-black/10 transition group-hover:translate-x-1">→</span></div><p className="mt-3 text-sm text-black/55">{f.themes[theme].summary}</p><p className="mt-4 text-xs font-semibold text-black/40">{f.themes[theme].items.length} · {f.eyebrow}</p></Link>)}</div></div></section>
    <section className="px-5 pb-20 lg:px-8 lg:pb-28"><div className="mx-auto max-w-7xl"><h2 className="text-3xl font-semibold tracking-tight">{f.allThemes}</h2><div className="mt-8 divide-y divide-black/10 border-t border-black/10">{all.map(({ theme, q, a }) => <details key={q} className="group py-6"><summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-semibold"><span><span className="mr-3 rounded-full bg-black/5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-black/50">{f.themes[theme].title}</span>{q}</span><span className="grid size-8 shrink-0 place-items-center rounded-full border border-black/10 group-open:rotate-45">+</span></summary><p className="max-w-3xl pr-10 pt-4 text-sm leading-6 text-black/55">{a}</p></details>)}</div></div></section>
    <section className="bg-[#52c6ff] px-5 py-20 text-black lg:px-8"><div className="mx-auto flex max-w-7xl flex-col gap-7 lg:flex-row lg:items-center lg:justify-between"><h2 className="max-w-3xl text-4xl font-light">{f.notFound}</h2><Link href="/support/contact" className="rounded-full bg-black px-7 py-4 text-center text-sm font-bold text-white">{d.common.contactUs}</Link></div></section>
    <SiteFooter />
  </main>;
}
