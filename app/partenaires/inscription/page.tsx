import type { Metadata } from 'next';
import Link from '@/components/Link';
import { requireChatGPTUser } from '@/app/chatgpt-auth';
import PartnerApplicationForm from '@/components/PartnerApplicationForm';
import SiteFooter from '@/components/SiteFooter';
import SiteHeader from '@/components/SiteHeader';
import { getI18n, pageMetadata } from '@/lib/i18n/server';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const { d, locale } = await getI18n();
  return pageMetadata(d, locale, { title: d.partners.apply.meta.title, description: d.partners.apply.meta.description, path: '/partenaires/inscription', slot: 'partners' });
}

export default async function PartnerApplicationPage() {
  const user = await requireChatGPTUser('/partenaires/inscription');
  const { d } = await getI18n();
  const a = d.partners.apply;
  return <main id="contenu" className="theme-page bg-[#f3f5fb] text-black">
    <section className="bg-black text-white"><SiteHeader /><div className="mx-auto max-w-7xl px-5 pb-16 pt-10 lg:px-8 lg:pb-20"><p className="eyebrow">{a.eyebrow}</p><h1 className="mt-5 max-w-4xl text-5xl font-light tracking-[-.05em] sm:text-6xl">{a.title}</h1><p className="mt-5 max-w-2xl leading-7 text-white/65">{a.intro}</p></div></section>
    <section className="px-5 py-16 lg:px-8 lg:py-24"><div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[.65fr_1.35fr]"><aside className="h-fit rounded-[28px] bg-[#0b1d17] p-7 text-white"><p className="text-xs font-bold uppercase tracking-[.14em] text-[#b8ff3d]">{a.before}</p><ol className="mt-7 space-y-5 text-sm leading-6 text-white/70">{a.steps.map(([title, text]) => <li key={title}><strong className="block text-white">{title}</strong>{text}</li>)}</ol><Link href="/partenaires" className="mt-8 inline-flex text-sm font-bold text-[#52c6ff]">{a.criteria}</Link><Link href="/partenaires/code-de-conduite" className="mt-3 block text-sm text-white/60 underline underline-offset-4">{d.partners.codeLink}</Link></aside><PartnerApplicationForm defaultName={user.name} defaultEmail={user.email} /></div></section>
    <SiteFooter />
  </main>;
}
