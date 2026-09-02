import type { Metadata } from 'next';
import Link from '@/components/Link';
import Breadcrumbs from '@/components/Breadcrumbs';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import { getI18n, pageMetadata } from '@/lib/i18n/server';
import { guideIds } from '@/lib/support';

export async function generateMetadata(): Promise<Metadata> {
  const { d, locale } = await getI18n();
  return pageMetadata(d, locale, { title: d.support.guides.meta.title, description: d.support.guides.meta.description, path: '/support/guides', slot: 'support' });
}

export default async function GuidesPage() {
  const { d } = await getI18n();
  const g = d.support.guides;
  return <main id="contenu" className="theme-page bg-[#f3f5fb] text-black">
    <section className="bg-black text-white"><SiteHeader /><div className="mx-auto max-w-7xl px-5 pb-20 pt-4 lg:px-8"><Breadcrumbs items={[{ label: d.nav.support, href: '/support' }, { label: g.eyebrow }]} /><p className="mt-10 text-xs font-bold uppercase tracking-[.16em] text-[#52c6ff]">{g.eyebrow}</p><h1 className="mt-5 max-w-4xl text-5xl font-light leading-[1] tracking-[-.05em] sm:text-6xl">{g.title}</h1><p className="mt-6 max-w-2xl text-lg leading-8 text-white/60">{g.intro}</p></div></section>
    <section className="px-5 py-16 lg:px-8 lg:py-24"><div className="mx-auto grid max-w-7xl gap-4 sm:grid-cols-2 lg:grid-cols-3">{guideIds.map((id, i) => { const guide = g.items[id]; return <Link key={id} href={`/support/guides/${id}`} className={`group flex min-h-[240px] flex-col rounded-[26px] p-6 transition hover:-translate-y-1 ${i === 0 ? 'bg-[#4556f5] text-white' : 'border border-black/8 bg-white'}`}><div className="flex items-center justify-between"><span className={`text-xs font-bold uppercase tracking-[.12em] ${i === 0 ? 'text-white/60' : 'text-black/40'}`}>{g.duration} · {guide.duration}</span><span className="grid size-9 place-items-center rounded-full border border-current/15 transition group-hover:translate-x-1">→</span></div><h2 className="mt-auto text-xl font-semibold">{guide.title}</h2><p className={`mt-2 text-sm leading-6 ${i === 0 ? 'text-white/70' : 'text-black/55'}`}>{guide.summary}</p></Link>; })}</div></section>
    <SiteFooter />
  </main>;
}
