import type { Metadata } from 'next';
import Link from '@/components/Link';
import { notFound } from 'next/navigation';
import Breadcrumbs from '@/components/Breadcrumbs';
import LeadForm from '@/components/LeadForm';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import { getI18n, pageMetadata } from '@/lib/i18n/server';
import { isMaintenancePlan, maintenancePlans } from '@/lib/support';

type Params = Promise<{ plan: string }>;
export const dynamicParams = false;
export function generateStaticParams() { return maintenancePlans.map((plan) => ({ plan })); }

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { plan } = await params;
  if (!isMaintenancePlan(plan)) return {};
  const { d, locale } = await getI18n();
  const p = d.support.maintenance.plans[plan];
  return pageMetadata(d, locale, { title: `${d.support.maintenance.planEyebrow} ${p.title}`, description: p.description, path: `/support/maintenance/${plan}`, slot: 'maintenance' });
}

export default async function MaintenancePlanPage({ params }: { params: Params }) {
  const { plan } = await params;
  if (!isMaintenancePlan(plan)) notFound();
  const { d } = await getI18n();
  const m = d.support.maintenance;
  const p = m.plans[plan];
  const c = d.support.contact.form;
  return <main id="contenu" className="theme-page bg-[#f3f5fb] text-black">
    <section className="bg-black text-white"><SiteHeader /><div className="mx-auto max-w-7xl px-5 pb-20 pt-4 lg:px-8"><Breadcrumbs items={[{ label: d.nav.support, href: '/support' }, { label: m.breadcrumb, href: '/support/maintenance' }, { label: p.title }]} /><div className="mt-12 max-w-3xl"><p className="text-xs font-bold uppercase tracking-[.16em] text-[#52c6ff]">{m.planEyebrow}</p><h1 className="mt-5 text-5xl font-light leading-[1] tracking-[-.05em] sm:text-6xl">{p.title}</h1><p className="mt-6 text-lg leading-8 text-white/60">{p.description}</p></div></div></section>
    <section className="px-5 py-20 lg:px-8 lg:py-28"><div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_.9fr]"><div><p className="eyebrow">{m.planPage.includes}</p><ul className="mt-6 space-y-4">{p.includes.map((i) => <li key={i} className="flex gap-3 text-base leading-7"><span className="text-[#4556f5]">✓</span>{i}</li>)}</ul><dl className="mt-10 grid gap-4 sm:grid-cols-2"><div className="rounded-[22px] border border-black/8 bg-white p-5"><dt className="text-xs font-bold uppercase tracking-[.12em] text-black/45">{m.planPage.frequency}</dt><dd className="mt-2 text-lg font-semibold">{p.frequency}</dd></div><div className="rounded-[22px] border border-black/8 bg-white p-5"><dt className="text-xs font-bold uppercase tracking-[.12em] text-black/45">{m.planPage.forPack}</dt><dd className="mt-2 text-lg font-semibold">{p.forPack}</dd></div></dl></div><div className="rounded-[30px] bg-white p-6 sm:p-8"><p className="eyebrow">{m.planPage.cta}</p><LeadForm type="maintenance" className="mt-6" submitLabel={m.planPage.cta} consentLabel={c.consent} source={`/support/maintenance/${plan}`} fields={[{ name: 'name', label: c.name, required: true }, { name: 'phone', label: c.phone, required: true }, { name: 'email', label: c.email, span: true }, { name: 'message', label: c.message, placeholder: c.messagePlaceholder }]} /></div></div></section>
    <section className="px-5 pb-24 lg:px-8"><div className="mx-auto max-w-7xl"><p className="eyebrow">{m.planPage.otherPlans}</p><div className="mt-5 flex flex-wrap gap-2">{maintenancePlans.filter((id) => id !== plan).map((id) => <Link key={id} href={`/support/maintenance/${id}`} className="rounded-full border border-black/10 bg-white px-4 py-2.5 text-xs font-bold hover:border-[#4556f5]">{m.plans[id].title}</Link>)}</div></div></section>
    <SiteFooter />
  </main>;
}
