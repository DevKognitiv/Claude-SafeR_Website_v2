import type { Metadata } from 'next';
import Link from '@/components/Link';
import Breadcrumbs from '@/components/Breadcrumbs';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import { getI18n, pageMetadata } from '@/lib/i18n/server';
import { CONTACT_EMAIL } from '@/lib/site';

export async function generateMetadata(): Promise<Metadata> {
  const { d, locale } = await getI18n();
  return pageMetadata(d, locale, { title: d.about.careers.meta.title, description: d.about.careers.meta.description, path: '/a-propos/carrieres', slot: 'about' });
}

export default async function CareersPage() {
  const { d } = await getI18n();
  const c = d.about.careers;
  return <main id="contenu" className="theme-page bg-[#f3f5fb] text-black">
    <section className="bg-black text-white"><SiteHeader /><div className="mx-auto max-w-7xl px-5 pb-20 pt-4 lg:px-8"><Breadcrumbs items={[{ label: d.nav.about, href: '/a-propos' }, { label: c.eyebrow }]} /><div className="mt-12 max-w-3xl"><p className="eyebrow">{c.eyebrow}</p><h1 className="mt-5 text-5xl font-light leading-[1] tracking-[-.05em] sm:text-6xl">{c.title}</h1><p className="mt-6 text-lg leading-8 text-white/60">{c.intro}</p></div></div></section>
    <section className="px-5 py-20 lg:px-8 lg:py-28"><div className="mx-auto max-w-7xl"><p className="eyebrow">{c.rolesTitle}</p><div className="mt-8 grid gap-4 md:grid-cols-2">{c.roles.map(([title, text]) => <article key={title} className="rounded-[26px] border border-black/8 bg-white p-7"><h2 className="text-2xl font-semibold">{title}</h2><p className="mt-3 text-sm leading-6 text-black/55">{text}</p></article>)}</div><div className="mt-12 flex flex-col gap-4 rounded-[30px] bg-[#4556f5] p-8 text-white sm:flex-row sm:items-center sm:justify-between"><div><p className="text-sm text-white/70">{c.apply}</p><a href={`mailto:${CONTACT_EMAIL}`} className="mt-1 block text-2xl font-semibold">{CONTACT_EMAIL}</a></div><div className="text-sm"><p className="text-white/70">{c.partnerNote}</p><Link href="/partenaires" className="mt-2 inline-flex rounded-full bg-black px-5 py-3 text-xs font-bold">{d.nav.partners} →</Link></div></div></div></section>
    <SiteFooter />
  </main>;
}
