import type { Metadata } from 'next';
import Link from '@/components/Link';
import { notFound } from 'next/navigation';
import Breadcrumbs from '@/components/Breadcrumbs';
import SiteFooter from '@/components/SiteFooter';
import SiteHeader from '@/components/SiteHeader';
import StoreCatalog from '@/components/store/StoreCatalog';
import { categoryIds, isCategoryId, productsInCategory, productsInSubcategory, subcategoriesOf } from '@/lib/catalog';
import { brandNames, storeItems } from '@/lib/catalog/server';
import { fmt } from '@/lib/i18n/config';
import { getI18n, pageMetadata } from '@/lib/i18n/server';

type Params = Promise<{ category: string }>;

export function generateStaticParams() {
  return categoryIds.map((category) => ({ category }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { category } = await params;
  if (!isCategoryId(category)) return {};
  const { d, locale } = await getI18n();
  const cat = d.store.categories[category];
  return pageMetadata(d, locale, { title: `${cat.title} · ${d.store.category.metaSuffix}`, description: cat.description, path: `/store/${category}` });
}

export default async function StoreCategoryPage({ params }: { params: Params }) {
  const { category } = await params;
  if (!isCategoryId(category)) notFound();
  const { d, locale } = await getI18n();
  const s = d.store;
  const cat = s.categories[category];
  const list = productsInCategory(category);
  const subcategories = subcategoriesOf(category).filter((sub) => productsInSubcategory(category, sub).length > 0);

  return <main id="contenu" className="theme-page bg-[#f3f5fb] text-black">
    <section className="relative overflow-hidden bg-black text-white"><div className="brand-grid absolute inset-0 opacity-35" /><SiteHeader /><div className="relative mx-auto max-w-7xl px-5 pb-16 pt-6 lg:px-8 lg:pb-24">
      <Breadcrumbs items={[{ label: s.product.breadcrumbStore, href: '/store' }, { label: cat.title }]} />
      <p className="eyebrow mt-10">{fmt(s.productsIn, { count: list.length })}</p>
      <h1 className="mt-5 max-w-4xl text-5xl font-light leading-[.98] tracking-[-.055em] sm:text-6xl lg:text-7xl">{cat.title}</h1>
      <p className="mt-6 max-w-2xl text-lg leading-8 text-white/65">{cat.description}</p>
      <Link href={`/solutions/${cat.solution}`} className="mt-7 inline-flex text-sm font-bold text-[#52c6ff]">{s.category.relatedSolution} →</Link>
    </div></section>

    <section className="px-5 pt-16 lg:px-8 lg:pt-20"><div className="mx-auto max-w-7xl"><p className="eyebrow">{s.category.subcategoriesTitle}</p>
      <div className="mt-6 flex flex-wrap gap-2">{subcategories.map((sub) => <Link key={sub} href={`/store/${category}/${sub}`} className="rounded-full border border-black/10 bg-white px-4 py-2.5 text-xs font-bold transition hover:border-[#4556f5] hover:text-[#4556f5]">{(s.subcategories as Record<string, string>)[sub]} <span className="text-black/40">{productsInSubcategory(category, sub).length}</span></Link>)}</div>
    </div></section>

    <section className="px-5 py-16 lg:px-8 lg:py-20"><div className="mx-auto max-w-7xl"><h2 className="text-3xl font-semibold tracking-tight">{s.category.allProducts}</h2><div className="mt-8"><StoreCatalog items={storeItems(locale, list)} brands={brandNames()} lock={{ category }} /></div></div></section>

    <section className="px-5 pb-24 lg:px-8"><div className="mx-auto max-w-7xl"><p className="eyebrow">{s.category.otherCategories}</p><div className="mt-5 flex flex-wrap gap-2">{categoryIds.filter((id) => id !== category).map((id) => <Link key={id} href={`/store/${id}`} className="rounded-full border border-black/10 bg-white px-4 py-2.5 text-xs font-bold hover:border-[#4556f5]">{s.categories[id].title}</Link>)}</div></div></section>
    <SiteFooter />
  </main>;
}
