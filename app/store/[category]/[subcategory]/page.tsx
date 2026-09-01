import type { Metadata } from 'next';
import Link from '@/components/Link';
import { notFound } from 'next/navigation';
import Breadcrumbs from '@/components/Breadcrumbs';
import SiteFooter from '@/components/SiteFooter';
import SiteHeader from '@/components/SiteHeader';
import StoreCatalog from '@/components/store/StoreCatalog';
import { catalog, categoryIds, isCategoryId, productsInSubcategory, subcategoriesOf } from '@/lib/catalog';
import { brandNames, storeItems } from '@/lib/catalog/server';
import { fmt } from '@/lib/i18n/config';
import { getI18n, pageMetadata } from '@/lib/i18n/server';

type Params = Promise<{ category: string; subcategory: string }>;

export function generateStaticParams() {
  return categoryIds.flatMap((category) => subcategoriesOf(category).map((subcategory) => ({ category, subcategory })));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { category, subcategory } = await params;
  if (!isCategoryId(category) || !subcategoriesOf(category).includes(subcategory)) return {};
  const { d, locale } = await getI18n();
  const title = (d.store.subcategories as Record<string, string>)[subcategory];
  return pageMetadata(d, locale, { title: `${title} · ${d.store.categories[category].title}`, description: d.store.categories[category].description, path: `/store/${category}/${subcategory}` });
}

export default async function StoreSubcategoryPage({ params }: { params: Params }) {
  const { category, subcategory } = await params;
  if (!isCategoryId(category) || !subcategoriesOf(category).includes(subcategory)) notFound();
  const { d, locale } = await getI18n();
  const s = d.store;
  const cat = s.categories[category];
  const title = (s.subcategories as Record<string, string>)[subcategory];
  const list = productsInSubcategory(category, subcategory);
  const solutions = Object.entries(catalog.taxonomy.solutionSubcategories).filter(([, subs]) => subs.includes(subcategory)).map(([path]) => path);
  const siblings = subcategoriesOf(category).filter((sub) => sub !== subcategory && productsInSubcategory(category, sub).length > 0);

  return <main id="contenu" className="theme-page bg-[#f3f5fb] text-black">
    <section className="relative overflow-hidden bg-black text-white"><div className="brand-grid absolute inset-0 opacity-35" /><SiteHeader /><div className="relative mx-auto max-w-7xl px-5 pb-16 pt-6 lg:px-8 lg:pb-24">
      <Breadcrumbs items={[{ label: s.product.breadcrumbStore, href: '/store' }, { label: cat.title, href: `/store/${category}` }, { label: title }]} />
      <p className="eyebrow mt-10">{cat.title} · {fmt(s.productsIn, { count: list.length })}</p>
      <h1 className="mt-5 max-w-4xl text-5xl font-light leading-[.98] tracking-[-.055em] sm:text-6xl lg:text-7xl">{title}</h1>
      {solutions.length > 0 && <div className="mt-7 flex flex-wrap gap-2">{solutions.map((path) => { const [slug, detail] = path.split('/'); const item = (d.solutions.items as Record<string, { details: Record<string, { title: string }> }>)[slug]?.details[detail]; return item ? <Link key={path} href={`/solutions/${path}`} className="rounded-full border border-white/15 px-4 py-2 text-xs font-bold text-white/80 hover:border-[#52c6ff] hover:text-[#52c6ff]">{item.title}</Link> : null; })}</div>}
    </div></section>

    <section className="px-5 py-16 lg:px-8 lg:py-20"><div className="mx-auto max-w-7xl"><StoreCatalog items={storeItems(locale, list)} brands={brandNames()} lock={{ category, subcategory }} /></div></section>

    {siblings.length > 0 && <section className="px-5 pb-24 lg:px-8"><div className="mx-auto max-w-7xl"><p className="eyebrow">{s.category.subcategoriesTitle}</p><div className="mt-5 flex flex-wrap gap-2">{siblings.map((sub) => <Link key={sub} href={`/store/${category}/${sub}`} className="rounded-full border border-black/10 bg-white px-4 py-2.5 text-xs font-bold hover:border-[#4556f5]">{(s.subcategories as Record<string, string>)[sub]}</Link>)}</div></div></section>}
    <SiteFooter />
  </main>;
}
