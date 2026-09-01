import type { Metadata } from 'next';
import Link from '@/components/Link';
import ProductShowcase from '@/components/ProductShowcase';
import SiteFooter from '@/components/SiteFooter';
import SiteHeader from '@/components/SiteHeader';
import { getI18n, pageMetadata } from '@/lib/i18n/server';
import { productFamilies } from '@/lib/products';

export async function generateMetadata(): Promise<Metadata> {
  const { d, locale } = await getI18n();
  return pageMetadata(d, locale, { title: d.solutions.showcase.meta.title, description: d.solutions.showcase.meta.description, path: '/produits' });
}

export default async function ProductsPage() {
  const { d } = await getI18n();
  const sc = d.solutions.showcase;
  return <main id="contenu" className="theme-page bg-[#f3f5fb] text-black">
    <section className="bg-black text-white"><SiteHeader /><div className="px-4 pb-5 sm:px-5 lg:px-8"><div className="mx-auto max-w-[1500px]"><ProductShowcase compact /></div></div></section>
    <section className="px-5 py-20 lg:px-8 lg:py-28"><div className="mx-auto max-w-7xl">
      <div className="grid gap-8 lg:grid-cols-[.9fr_1.1fr] lg:items-end"><div><p className="eyebrow">{sc.catalogEyebrow}</p><h2 className="section-title mt-5">{sc.catalogTitle}</h2></div><p className="max-w-xl leading-7 text-black/58 lg:ml-auto">{sc.catalogIntro}</p></div>
      <div className="mt-14 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {productFamilies.map((product, index) => { const copy = sc.families[product.id]; return <article key={product.id} className={`flex min-h-[360px] flex-col rounded-[30px] border p-7 ${index === 0 ? 'border-transparent bg-[#4556f5] text-white' : 'border-black/8 bg-white'}`}>
          <div className="flex items-center justify-between gap-4"><span className={`text-[11px] font-bold uppercase tracking-[.14em] ${index === 0 ? 'text-white/90' : 'text-black/45'}`}>{copy.category}</span><span className={`rounded-full px-3 py-1.5 text-[10px] font-bold ${index === 0 ? 'bg-white/12 text-white' : 'catalog-badge bg-[#e7f7ff] text-[#183e68]'}`}>{sc.selection}</span></div>
          <h2 className="mt-10 text-3xl font-semibold tracking-tight">{product.safeRName}</h2>
          <p className={`mt-3 text-sm leading-6 ${index === 0 ? 'text-white/90' : 'text-black/58'}`}>{copy.description}</p>
          <div className="mt-auto pt-8"><p className={`text-[10px] uppercase tracking-[.12em] ${index === 0 ? 'text-white/90' : 'text-black/42'}`}>{sc.traceability}</p><p className="mt-1 text-xs font-semibold">{product.safeRReference}</p><p className={`mt-1 text-xs ${index === 0 ? 'text-white/90' : 'text-black/52'}`}>{product.sourceEcosystem} · {product.sourceReference}</p><Link href={`/store?q=${encodeURIComponent(product.storeSku)}`} className={`mt-4 inline-flex text-xs font-bold underline underline-offset-4 ${index === 0 ? 'text-white' : 'text-[#4556f5]'}`}>{d.solutions.detail.viewInStore} →</Link></div>
        </article>; })}
      </div>
    </div></section>
    <section className="px-5 pb-24 lg:px-8"><div className="mx-auto grid max-w-7xl gap-8 rounded-[34px] border border-black/8 bg-white p-8 lg:grid-cols-[1fr_auto] lg:items-center lg:p-12"><div><p className="eyebrow">{sc.complianceEyebrow}</p><h2 className="mt-4 max-w-3xl text-3xl font-semibold tracking-tight">{sc.complianceTitle}</h2><p className="mt-4 max-w-3xl text-sm leading-6 text-black/58">{sc.complianceText}</p></div><Link href="/diagnostic" className="rounded-full bg-black px-7 py-4 text-center text-sm font-bold text-white">{sc.validate}</Link></div></section>
    <SiteFooter />
  </main>;
}
