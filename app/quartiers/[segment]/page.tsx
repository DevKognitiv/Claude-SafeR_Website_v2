import type { Metadata } from 'next';
import Link from '@/components/Link';
import { notFound } from 'next/navigation';
import Breadcrumbs from '@/components/Breadcrumbs';
import LeadForm from '@/components/LeadForm';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import { GlyphIcon } from '@/components/Icon';
import { isSegmentId, segmentIcons, segmentOrder } from '@/lib/collective';
import { getI18n, pageMetadata } from '@/lib/i18n/server';

type Params = Promise<{ segment: string }>;
export const dynamicParams = false;
export function generateStaticParams() { return segmentOrder.map((segment) => ({ segment })); }

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { segment } = await params;
  if (!isSegmentId(segment)) return {};
  const { d, locale } = await getI18n();
  const seg = d.collective.segments[segment];
  return pageMetadata(d, locale, { title: `${seg.title} · ${d.collective.hero.eyebrow}`, description: seg.description, path: `/quartiers/${segment}` });
}

export default async function SegmentPage({ params }: { params: Params }) {
  const { segment } = await params;
  if (!isSegmentId(segment)) notFound();
  const { d } = await getI18n();
  const c = d.collective;
  const seg = c.segments[segment];
  const sp = c.segmentPage;
  return <main id="contenu" className="theme-page districts-page bg-[#eff3f0] text-[#0a1814]">
    <section className="relative overflow-hidden bg-[#07120f] text-white"><SiteHeader /><div className="relative mx-auto max-w-7xl px-5 pb-20 pt-4 lg:px-8"><Breadcrumbs items={[{ label: d.nav.collective, href: '/quartiers' }, { label: seg.short }]} /><div className="mt-12 grid gap-10 lg:grid-cols-[1.1fr_.9fr] lg:items-end"><div><span className="grid size-14 place-items-center rounded-full bg-[#b8ff3d] text-black"><GlyphIcon glyph={segmentIcons[segment]} size={28} /></span><p className="mt-6 text-xs font-bold uppercase tracking-[.16em] text-[#b8ff3d]">{c.hero.eyebrow}</p><h1 className="mt-5 text-5xl font-semibold leading-[.98] tracking-[-.05em] sm:text-6xl lg:text-7xl">{seg.title}</h1><p className="mt-6 max-w-2xl text-lg leading-8 text-white/60">{seg.description}</p></div><div className="grid grid-cols-3 gap-3">{seg.figures.map(([value, label]) => <div key={label} className="rounded-2xl border border-white/10 bg-white/6 p-4"><p className="text-2xl font-semibold">{value}</p><p className="mt-1 text-xs text-white/45">{label}</p></div>)}</div></div></div></section>
    <section className="px-5 py-20 lg:px-8 lg:py-28"><div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[.8fr_1.2fr]"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-[#659413]">{sp.benefitsEyebrow}</p><ul className="mt-6 space-y-4">{seg.benefits.map((b) => <li key={b} className="flex gap-3 text-lg"><span className="text-[#659413]">✓</span>{b}</li>)}</ul></div><div><p className="text-xs font-bold uppercase tracking-[.16em] text-[#659413]">{sp.stepsEyebrow}</p><h2 className="mt-5 text-3xl font-semibold tracking-tight">{sp.stepsTitle}</h2><div className="mt-8 grid gap-4 sm:grid-cols-2">{seg.steps.map(([title, text], i) => <article key={title} className={`rounded-[26px] p-6 ${i === 0 ? 'bg-[#b8ff3d]' : 'border border-black/8 bg-white'}`}><span className="text-sm font-semibold text-black/40">0{i + 1}</span><h3 className="mt-8 text-xl font-semibold">{title}</h3><p className="mt-2 text-sm leading-6 text-black/55">{text}</p></article>)}</div></div></div></section>
    <section className="bg-[#0b1d17] px-5 py-20 text-white lg:px-8 lg:py-28"><div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[.85fr_1.15fr]"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-[#b8ff3d]">{c.project.eyebrow}</p><h2 className="mt-5 text-4xl font-semibold leading-[1.03] tracking-[-.045em]">{c.project.title}</h2><p className="mt-5 max-w-md text-sm leading-6 text-white/55">{c.project.intro}</p></div><LeadForm type="project" tone="dark" className="rounded-[30px] border border-white/10 bg-white/5 p-6 sm:p-8" submitLabel={c.project.submit} consentLabel={c.project.consent} source={`/quartiers/${segment}`} fields={[{ name: 'name', label: c.project.name, placeholder: c.project.namePlaceholder, required: true }, { name: 'organization', label: c.project.organization, placeholder: c.project.organizationPlaceholder }, { name: 'phone', label: c.project.phone, placeholder: c.project.phonePlaceholder, required: true }, { name: 'email', label: c.project.email, placeholder: c.project.emailPlaceholder }, { name: 'message', label: c.project.need, placeholder: c.project.needPlaceholder }]} /></div></section>
    <section className="px-5 py-16 lg:px-8"><div className="mx-auto max-w-7xl"><p className="text-xs font-bold uppercase tracking-[.16em] text-[#659413]">{sp.otherSegments}</p><div className="mt-5 flex flex-wrap gap-2">{segmentOrder.filter((id) => id !== segment).map((id) => <Link key={id} href={`/quartiers/${id}`} className="rounded-full border border-black/10 bg-white px-4 py-2.5 text-xs font-bold hover:border-[#4556f5]"><GlyphIcon glyph={segmentIcons[id]} size={14} className="mr-1 inline" />{c.segments[id].short}</Link>)}</div></div></section>
    <SiteFooter />
  </main>;
}
