import type { Metadata } from 'next';
import Breadcrumbs from '@/components/Breadcrumbs';
import LeadForm from '@/components/LeadForm';
import SiteHeader from '@/components/SiteHeader';
import HeroBackdrop from '@/components/HeroBackdrop';
import SiteFooter from '@/components/SiteFooter';
import { getI18n, pageMetadata } from '@/lib/i18n/server';
import { CONTACT_EMAIL, CONTACT_PHONE_DISPLAY, CONTACT_PHONE_HREF } from '@/lib/site';

export async function generateMetadata(): Promise<Metadata> {
  const { d, locale } = await getI18n();
  return pageMetadata(d, locale, { title: d.support.contact.meta.title, description: d.support.contact.meta.description, path: '/support/contact', slot: 'contact' });
}

export default async function ContactPage() {
  const { d } = await getI18n();
  const c = d.support.contact;
  return <main id="contenu" className="theme-page bg-[#f3f5fb] text-black">
    <section className="relative overflow-hidden bg-black text-white"><HeroBackdrop slot="contact" alt={d.images.contact} opacity="opacity-35" priority /><SiteHeader /><div className="relative mx-auto max-w-7xl px-5 pb-20 pt-4 lg:px-8"><Breadcrumbs items={[{ label: d.nav.support, href: '/support' }, { label: c.eyebrow }]} /><p className="mt-10 text-xs font-bold uppercase tracking-[.16em] text-[#52c6ff]">{c.eyebrow}</p><h1 className="mt-5 max-w-4xl text-5xl font-light leading-[1] tracking-[-.05em] sm:text-6xl">{c.title}</h1><p className="mt-6 max-w-2xl text-lg leading-8 text-white/60">{c.intro}</p></div></section>
    <section className="px-5 py-16 lg:px-8 lg:py-24"><div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[.7fr_1.3fr]"><aside className="grid h-fit gap-4"><div className="rounded-[26px] bg-black p-6 text-white"><p className="text-xs font-bold uppercase tracking-[.14em] text-[#52c6ff]">{c.phoneTitle}</p><a href={CONTACT_PHONE_HREF} className="mt-3 block text-2xl font-semibold">{CONTACT_PHONE_DISPLAY}</a><p className="mt-2 text-sm text-white/60">{c.phoneText}</p></div><div className="rounded-[26px] border border-black/8 bg-white p-6"><p className="text-xs font-bold uppercase tracking-[.14em] text-black/45">{c.emailTitle}</p><a href={`mailto:${CONTACT_EMAIL}`} className="mt-3 block text-lg font-semibold">{CONTACT_EMAIL}</a></div><div className="rounded-[26px] border border-black/8 bg-white p-6"><p className="text-xs font-bold uppercase tracking-[.14em] text-black/45">{c.addressTitle}</p><p className="mt-3 text-lg font-semibold">{d.common.address}</p></div><div className="rounded-[26px] border border-black/8 bg-white p-6"><p className="text-xs font-bold uppercase tracking-[.14em] text-black/45">{c.hoursTitle}</p><p className="mt-3 text-sm leading-6">{c.hours}</p></div></aside><div className="rounded-[30px] bg-white p-6 sm:p-8"><LeadForm type="contact" submitLabel={c.form.submit} consentLabel={c.form.consent} fields={[{ name: 'name', label: c.form.name, required: true }, { name: 'phone', label: c.form.phone, required: true }, { name: 'email', label: c.form.email }, { name: 'subject', label: c.form.subject, options: c.form.subjects }, { name: 'message', label: c.form.message, placeholder: c.form.messagePlaceholder, required: true }]} /></div></div></section>
    <SiteFooter />
  </main>;
}
