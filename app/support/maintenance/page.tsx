import type { Metadata } from 'next';
import Link from '@/components/Link';
import Breadcrumbs from '@/components/Breadcrumbs';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import { getI18n, pageMetadata } from '@/lib/i18n/server';
import { maintenancePlans } from '@/lib/support';

export async function generateMetadata(): Promise<Metadata> {
  const { d, locale } = await getI18n();
  return pageMetadata(d, locale, { title: d.support.maintenance.meta.title, description: d.support.maintenance.meta.description, path: '/support/maintenance' });
}

export default async function MaintenancePage() {
  const { d } = await getI18n();
  const m = d.support.maintenance;
  return <main id="contenu" className="theme-page bg-[#f3f5fb] text-black">
    <section className="bg-black text-white"><SiteHeader /><div className="mx-auto grid max-w-7xl gap-12 px-5 pb-20 pt-4 lg:grid-cols-[.9fr_1.1fr] lg:items-center lg:px-8"><div><Breadcrumbs items={[{ label: d.nav.support, href: '/support' }, { label: m.breadcrumb }]} /><p className="mt-10 text-xs font-bold uppercase tracking-[.16em] text-[#52c6ff]">{m.eyebrow}</p><h1 className="mt-5 text-5xl font-light leading-[1] tracking-[-.05em] sm:text-6xl">{m.title}</h1><p className="mt-6 max-w-xl text-lg leading-8 text-white/60">{m.intro}</p></div><div className="media-grade relative min-h-[460px] overflow-hidden rounded-[34px]"><img src="https://images.pexels.com/photos/4481326/pexels-photo-4481326.jpeg?auto=compress&dpr=1&h=1000&w=1400" alt={m.imageAlt} className="absolute inset-0 h-full w-full object-cover" /></div></div></section>
    <section className="px-5 py-20 lg:px-8 lg:py-28"><div className="mx-auto max-w-7xl"><div className="grid gap-7 lg:grid-cols-2 lg:items-end"><div><p className="eyebrow">{m.programEyebrow}</p><h2 className="section-title mt-5">{m.programTitle}</h2></div><p className="max-w-xl leading-7 text-black/50 lg:ml-auto">{m.programIntro}</p></div><div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{m.steps.map(([n, title, text]) => <article key={n} className="rounded-[26px] border border-black/8 bg-white p-6"><span className="text-sm font-semibold text-[#4556f5]">{n}</span><h3 className="mt-14 text-xl font-semibold">{title}</h3><p className="mt-3 text-sm leading-6 text-black/50">{text}</p></article>)}</div></div></section>
    <section className="bg-white px-5 py-20 lg:px-8 lg:py-28"><div className="mx-auto max-w-7xl"><p className="eyebrow">{m.plansEyebrow}</p><h2 className="section-title mt-5">{m.plansTitle}</h2><div className="mt-12 grid gap-5 lg:grid-cols-3">{maintenancePlans.map((id, i) => { const plan = m.plans[id]; return <Link key={id} href={`/support/maintenance/${id}`} className={`group flex min-h-[320px] flex-col rounded-[30px] p-7 transition hover:-translate-y-1 ${i === 1 ? 'bg-[#4556f5] text-white' : 'border border-black/8 bg-[#f3f5fb]'}`}><p className={`text-xs font-bold uppercase tracking-[.14em] ${i === 1 ? 'text-white/60' : 'text-black/40'}`}>{plan.forPack}</p><h3 className="mt-8 text-3xl font-semibold">{plan.title}</h3><p className={`mt-3 text-sm leading-6 ${i === 1 ? 'text-white/70' : 'text-black/55'}`}>{plan.summary}</p><span className="mt-auto pt-8 text-sm font-bold">{m.viewPlan} →</span></Link>; })}</div></div></section>
    <section className="bg-[#52c6ff] px-5 py-20 text-black lg:px-8"><div className="mx-auto flex max-w-7xl flex-col gap-7 lg:flex-row lg:items-center lg:justify-between"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-black/45">{m.scheduleEyebrow}</p><h2 className="mt-4 text-4xl font-light">{m.scheduleTitle}</h2></div><Link href="/espace-client#support" className="rounded-full bg-black px-7 py-4 text-center text-sm font-bold text-white">{m.schedule}</Link></div></section>
    <SiteFooter />
  </main>;
}
