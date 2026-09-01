import type { Metadata } from 'next';
import Link from '@/components/Link';
import { notFound } from 'next/navigation';
import Breadcrumbs from '@/components/Breadcrumbs';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import StoreCatalog from '@/components/store/StoreCatalog';
import { catalog, products } from '@/lib/catalog';
import { brandNames, storeItems } from '@/lib/catalog/server';
import { fmt } from '@/lib/i18n/config';
import { getI18n, pageMetadata } from '@/lib/i18n/server';
import { getDetailCopy, isSolutionSlug, solutionStructures } from '@/lib/solutions';

type Params = Promise<{ slug: string; detail: string }>;
export const dynamicParams = false;

export function generateStaticParams() {
  return solutionStructures.flatMap((solution) => solution.details.map((detail) => ({ slug: solution.slug, detail })));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug, detail: detailSlug } = await params;
  if (!isSolutionSlug(slug)) return {};
  const { d, locale } = await getI18n();
  const detail = getDetailCopy(d, slug, detailSlug);
  if (!detail) return {};
  return pageMetadata(d, locale, { title: `${d.solutions.equipmentPage.metaSuffix} · ${detail.title}`, description: d.solutions.equipmentPage.intro, path: `/solutions/${slug}/${detailSlug}/equipements` });
}

export default async function SolutionEquipmentPage({ params }: { params: Params }) {
  const { slug, detail: detailSlug } = await params;
  if (!isSolutionSlug(slug)) notFound();
  const { d, locale } = await getI18n();
  const solution = d.solutions.items[slug];
  const detail = getDetailCopy(d, slug, detailSlug);
  if (!detail) notFound();
  const e = d.solutions.equipmentPage;
  const path = `${slug}/${detailSlug}`;
  const subcategories = catalog.taxonomy.solutionSubcategories[path] ?? [];
  const list = products.filter((p) => p.solutions?.includes(path) || subcategories.includes(p.subcategory));

  return (
    <main id="contenu" className="theme-page bg-[#f3f5fb] text-black">
      <section className="bg-black text-white"><SiteHeader /><div className="mx-auto max-w-7xl px-5 pb-16 pt-4 lg:px-8 lg:pb-20"><Breadcrumbs items={[{ label: d.nav.solutions, href: '/solutions' }, { label: solution.title, href: `/solutions/${slug}` }, { label: detail.title, href: `/solutions/${slug}/${detailSlug}` }, { label: e.eyebrow }]} /><p className="mt-10 text-xs font-bold uppercase tracking-[.16em] text-[#52c6ff]">{e.eyebrow}</p><h1 className="mt-5 max-w-4xl text-5xl font-light leading-[1] tracking-[-.05em] sm:text-6xl">{fmt(e.title, { detail: detail.title })}</h1><p className="mt-6 max-w-2xl text-lg leading-8 text-white/60">{e.intro}</p><Link href={`/solutions/${slug}/${detailSlug}`} className="mt-7 inline-flex text-sm font-bold text-[#52c6ff]">← {e.backDetail}</Link></div></section>
      <section className="px-5 py-16 lg:px-8 lg:py-24"><div className="mx-auto max-w-7xl">{list.length ? <StoreCatalog items={storeItems(locale, list)} brands={brandNames()} showCategoryFacet /> : <div className="rounded-[30px] border border-dashed border-black/15 bg-white p-10 text-center"><p className="max-w-xl mx-auto text-lg leading-7">{e.empty}</p><Link href="/diagnostic" className="mt-6 inline-flex rounded-full bg-black px-6 py-3.5 text-sm font-bold text-white">{d.common.assessment}</Link></div>}</div></section>
      <SiteFooter />
    </main>
  );
}
