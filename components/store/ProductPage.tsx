import Link from '@/components/Link';
import Breadcrumbs from '@/components/Breadcrumbs';
import JsonLd from '@/components/JsonLd';
import SiteFooter from '@/components/SiteFooter';
import SiteHeader from '@/components/SiteHeader';
import ProductActions from '@/components/store/ProductActions';
import ProductCard, { ProductVisual } from '@/components/store/ProductCard';
import StickyProductBar from '@/components/store/StickyProductBar';
import TrustStrip from '@/components/TrustStrip';
import Icon from '@/components/Icon';
import { formatXof, getCopy, productPath, relatedProducts, specValue, type Product } from '@/lib/catalog';
import { toStoreItem } from '@/lib/catalog/view';
import { fmt, type Locale } from '@/lib/i18n/config';
import type { Dictionary } from '@/lib/i18n/dictionaries';
import { formatDate } from '@/lib/i18n/server';
import { SITE_URL } from '@/lib/site';

export const productSections = ['caracteristiques', 'installation', 'compatibilite', 'garantie'] as const;
export type ProductSection = (typeof productSections)[number];
export function isProductSection(value: string): value is ProductSection {
  return (productSections as readonly string[]).includes(value);
}

type Props = { product: Product; d: Dictionary; locale: Locale; section?: ProductSection };

export default function ProductPage({ product, d, locale, section }: Props) {
  const s = d.store;
  const p = s.product;
  const copy = getCopy(product, locale);
  const item = toStoreItem(product, locale);
  const path = productPath(product);
  const cat = s.categories[product.category];
  const subcategory = (s.subcategories as Record<string, string>)[product.subcategory] ?? product.subcategory;
  const attr = s.attributes as Record<string, Record<string, string>>;
  const specKeys = s.specKeys as Record<string, string>;
  const availability = attr.availability[product.availability] ?? product.availability;
  const related = relatedProducts(product).map((r) => toStoreItem(r, locale));
  const isTuya = product.brand === 'safer';
  const active: ProductSection = section ?? 'caracteristiques';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: copy.name,
    description: copy.description,
    sku: product.sku,
    mpn: product.sourceSku ?? product.model,
    brand: { '@type': 'Brand', name: product.brandName },
    category: `${cat.title} > ${subcategory}`,
    url: `${SITE_URL}${path}`,
    ...(item.imageUrl ? { image: item.imageUrl } : {}),
    ...(product.priceXof != null ? { offers: { '@type': 'Offer', priceCurrency: 'XOF', price: product.priceXof, availability: product.availability === 'en-stock' ? 'https://schema.org/InStock' : product.availability === 'precommande' ? 'https://schema.org/PreOrder' : 'https://schema.org/BackOrder', url: `${SITE_URL}${path}`, seller: { '@type': 'Organization', name: 'SafeR' } } } : {}),
  };

  const crumbs = [
    { label: p.breadcrumbStore, href: '/store' },
    { label: cat.title, href: `/store/${product.category}` },
    { label: subcategory, href: `/store/${product.category}/${product.subcategory}` },
    ...(section ? [{ label: copy.name, href: path }, { label: p.sections[section] }] : [{ label: copy.name }]),
  ];

  const tabs = productSections.map((id) => ({ id, label: p.sections[id], href: id === 'caracteristiques' && !section ? path : `${path}/${id}` }));

  const sectionBody = (which: ProductSection) => {
    switch (which) {
      case 'caracteristiques':
        return (
          <div className="grid gap-10 lg:grid-cols-[.9fr_1.1fr]">
            <div>
              <p className="eyebrow">{p.highlights}</p>
              <ul className="mt-6 space-y-4">{copy.highlights.map((h) => <li key={h} className="flex gap-3 text-base leading-7"><span className="mt-1.5 grid size-5 shrink-0 place-items-center rounded-full bg-[#4556f5]/10 text-[#4556f5]"><Icon name="check" size={12} strokeWidth={3} /></span><span>{h}</span></li>)}</ul>
              {copy.inTheBox?.length ? <><p className="eyebrow mt-12">{p.inTheBox}</p><ul className="mt-5 flex flex-wrap gap-2">{copy.inTheBox.map((b) => <li key={b} className="rounded-full border border-black/10 bg-white px-3.5 py-2 text-xs font-semibold">{b}</li>)}</ul></> : null}
            </div>
            <div className="rounded-[30px] border border-black/8 bg-white p-6 sm:p-8">
              <p className="eyebrow">{p.specs}</p>
              <dl className="mt-6 divide-y divide-black/8">
                {product.specs.map((spec, i) => <div key={`${spec.key}-${i}`} className="grid gap-1 py-3.5 sm:grid-cols-[.9fr_1.1fr] sm:gap-6"><dt className="text-sm text-black/50">{specKeys[spec.key] ?? spec.key}</dt><dd className="text-sm font-semibold">{specValue(spec.value, locale)}</dd></div>)}
                <div className="grid gap-1 py-3.5 sm:grid-cols-[.9fr_1.1fr] sm:gap-6"><dt className="text-sm text-black/50">{p.sku}</dt><dd className="text-sm font-semibold">{product.sku}{product.sourceSku && product.sourceSku !== product.sku ? <span className="ml-2 text-xs font-normal text-black/45">({product.sourceSku})</span> : null}</dd></div>
                <div className="grid gap-1 py-3.5 sm:grid-cols-[.9fr_1.1fr] sm:gap-6"><dt className="text-sm text-black/50">{p.source}</dt><dd className="text-sm font-semibold">{product.sourceBrand} · {product.model}</dd></div>
              </dl>
            </div>
          </div>
        );
      case 'installation':
        return (
          <div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr]">
            <div className="rounded-[30px] bg-black p-7 text-white sm:p-9">
              <p className="text-xs font-bold uppercase tracking-[.14em] text-[#52c6ff]">{p.installLevel}</p>
              <p className="mt-3 text-2xl font-semibold">{p.installLevels[product.install.level]}</p>
              <dl className="mt-8 space-y-5 text-sm">
                <div><dt className="text-white/50">{p.installDuration}</dt><dd className="mt-1 text-lg font-semibold">{product.install.duration}</dd></div>
                <div><dt className="text-white/50">{p.installPrereq}</dt><dd className="mt-1 leading-6 text-white/85">{product.install.prerequisites?.[locale] ?? product.install.prerequisites?.fr}</dd></div>
              </dl>
              <Link href="/partenaires" className="mt-8 inline-flex rounded-full bg-[#4556f5] px-6 py-3.5 text-sm font-bold text-white">{d.nav.partners}</Link>
            </div>
            <div>
              <p className="eyebrow">{p.installTitle}</p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">{p.installSteps.map(([title, text], index) => <article key={title} className="rounded-[26px] border border-black/8 bg-white p-6"><span className="text-sm font-semibold text-[#4556f5]">0{index + 1}</span><h3 className="mt-10 text-xl font-semibold">{title}</h3><p className="mt-2 text-sm leading-6 text-black/55">{text}</p></article>)}</div>
            </div>
          </div>
        );
      case 'compatibilite':
        return (
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <p className="eyebrow">{p.compatTitle}</p>
              <dl className="mt-6 space-y-6">
                <div><dt className="text-xs font-bold uppercase tracking-[.14em] text-black/45">{s.filters.protocol}</dt><dd className="mt-3 flex flex-wrap gap-2">{product.attributes.protocol.map((v) => <span key={v} className="rounded-full bg-white px-3.5 py-2 text-xs font-semibold shadow-sm">{attr.protocol[v] ?? v}</span>)}</dd></div>
                <div><dt className="text-xs font-bold uppercase tracking-[.14em] text-black/45">{p.compatWorksWith}</dt><dd className="mt-3 flex flex-wrap gap-2">{product.attributes.compat.map((v) => <span key={v} className="rounded-full bg-white px-3.5 py-2 text-xs font-semibold shadow-sm">{attr.compat[v] ?? v}</span>)}</dd></div>
                <div><dt className="text-xs font-bold uppercase tracking-[.14em] text-black/45">{s.filters.placement} · {s.filters.power}</dt><dd className="mt-3 flex flex-wrap gap-2"><span className="rounded-full bg-white px-3.5 py-2 text-xs font-semibold shadow-sm">{attr.placement[product.attributes.placement]}</span>{product.attributes.power.map((v) => <span key={v} className="rounded-full bg-white px-3.5 py-2 text-xs font-semibold shadow-sm">{attr.power[v] ?? v}</span>)}</dd></div>
              </dl>
            </div>
            <div className="rounded-[30px] bg-[#4556f5] p-7 text-white sm:p-9">
              <p className="text-xs font-bold uppercase tracking-[.14em] text-white/70">{p.compatSafer}</p>
              <p className="mt-4 text-2xl font-semibold leading-tight">{p.compatSaferText}</p>
              {product.solutions?.length ? <div className="mt-8 flex flex-wrap gap-2">{product.solutions.map((sol) => { const [slug, detail] = sol.split('/'); const entry = (d.solutions.items as Record<string, { details: Record<string, { title: string }> }>)[slug]?.details[detail]; return entry ? <Link key={sol} href={`/solutions/${sol}`} className="rounded-full border border-white/30 px-4 py-2 text-xs font-bold hover:bg-white hover:text-black">{entry.title}</Link> : null; })}</div> : null}
            </div>
          </div>
        );
      case 'garantie':
        return (
          <div className="grid gap-10 lg:grid-cols-[1fr_.9fr]">
            <div>
              <p className="eyebrow">{p.warrantyTitle}</p>
              <p className="mt-6 text-4xl font-light">{fmt(p.warrantyShort, { months: product.warrantyMonths })}</p>
              <p className="mt-5 max-w-xl leading-7 text-black/60">{p.warrantyText}</p>
              <div className="mt-8 grid gap-3 sm:grid-cols-2">{d.support.warranty.process.map(([n, title, text]) => <div key={n} className="rounded-[22px] border border-black/8 bg-white p-5"><span className="text-xs font-semibold text-[#4556f5]">{n}</span><p className="mt-4 font-semibold">{title}</p><p className="mt-1 text-xs leading-5 text-black/55">{text}</p></div>)}</div>
              <Link href="/support/garantie" className="mt-8 inline-flex text-sm font-semibold underline underline-offset-4">{p.warrantyMore}</Link>
            </div>
            <div className="rounded-[30px] bg-black p-7 text-white sm:p-9">
              <p className="text-xs font-bold uppercase tracking-[.14em] text-[#52c6ff]">{d.support.warranty.coveredTitle}</p>
              <ul className="mt-5 space-y-3 text-sm text-white/80">{d.support.warranty.covered.map((c) => <li key={c} className="flex gap-3"><span className="text-[#52c6ff]">✓</span>{c}</li>)}</ul>
              <p className="mt-8 text-xs font-bold uppercase tracking-[.14em] text-white/45">{d.support.warranty.excludedTitle}</p>
              <ul className="mt-5 space-y-3 text-sm text-white/60">{d.support.warranty.excluded.map((c) => <li key={c} className="flex gap-3"><span>–</span>{c}</li>)}</ul>
            </div>
          </div>
        );
    }
  };

  return (
    <main id="contenu" className="theme-page bg-[#f3f5fb] pb-24 text-black lg:pb-0">
      <JsonLd data={jsonLd} />
      <section className="relative overflow-hidden bg-black text-white"><div className="brand-grid absolute inset-0 opacity-35" /><SiteHeader /><div className="relative mx-auto max-w-7xl px-5 pb-16 pt-6 lg:px-8 lg:pb-20">
        <Breadcrumbs items={crumbs} />
        <div className="mt-10 grid gap-10 lg:grid-cols-[1.05fr_.95fr] lg:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.16em] text-[#52c6ff]">{product.brandName} · {subcategory}</p>
            <h1 className="mt-5 text-4xl font-light leading-[1] tracking-[-.05em] sm:text-5xl lg:text-6xl">{copy.name}</h1>
            <p className="mt-5 max-w-xl text-xl font-semibold leading-tight">{copy.tagline}</p>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/65">{copy.description}</p>
            <div className="mt-8 flex flex-wrap items-end gap-8">
              <div>{product.priceXof != null ? <><p className="text-xs text-white/50">{p.priceFrom}</p><p className="price text-4xl font-semibold">{formatXof(product.priceXof, locale)} <span className="text-base">{d.common.fcfa}</span></p></> : <p className="text-3xl font-semibold">{d.common.onQuote}</p>}{product.monthlyXof != null && <p className="mt-1 text-xs text-white/50">{fmt(p.service, { price: formatXof(product.monthlyXof, locale) })}</p>}</div>
              <div className="text-xs text-white/55"><p><span className="text-white/40">{p.availability} :</span> {availability}</p><p className="mt-1"><span className="text-white/40">{p.sku} :</span> {product.sku}</p><p className="mt-1">{fmt(p.warrantyShort, { months: product.warrantyMonths })}</p></div>
            </div>
            <div className="mt-8"><ProductActions id={product.id} sku={product.sku} name={copy.name} /></div>
            <p className="mt-5 max-w-xl text-[11px] leading-5 text-white/45">{p.priceNote}{product.crawl?.lastChecked ? ` ${fmt(p.lastChecked, { date: formatDate(product.crawl.lastChecked, locale) })}.` : ''}</p>
          </div>
          <div className="relative overflow-hidden rounded-[34px] border border-white/10"><ProductVisual item={item} className="min-h-[380px] lg:min-h-[460px]" /><span className="absolute bottom-5 right-5 rounded-full bg-black/70 px-4 py-2 text-xs font-semibold backdrop-blur">{product.brandName} · {product.model}</span></div>
        </div>
        {isTuya && <p className="mt-10 max-w-3xl rounded-2xl border border-[#52c6ff]/30 bg-[#4556f5]/15 p-4 text-xs leading-5 text-[#bcecff]">{p.tuyaNotice}</p>}
      </div></section>
      <TrustStrip compact />
      <StickyProductBar id={product.id} sku={product.sku} name={copy.name} priceXof={product.priceXof} />

      <section className="px-5 pt-12 lg:px-8"><div className="mx-auto max-w-7xl">
        <nav aria-label={p.sections.caracteristiques} className="flex flex-wrap gap-2 border-b border-black/10 pb-4">{tabs.map((tab) => <Link key={tab.id} href={tab.href} aria-current={tab.id === active ? 'page' : undefined} className={`rounded-full px-5 py-2.5 text-xs font-bold transition ${tab.id === active ? 'bg-black text-white' : 'border border-black/10 bg-white hover:border-[#4556f5]'}`}>{tab.label}</Link>)}</nav>
        <div className="py-14"><h2 className="text-3xl font-semibold tracking-tight">{p.sections[active]}</h2><p className="mt-2 max-w-xl text-sm text-black/55">{p.sectionsIntro[active]}</p><div className="mt-10">{sectionBody(active)}</div></div>
        {section && <Link href={path} className="inline-flex text-sm font-semibold underline underline-offset-4">← {p.backToProduct}</Link>}
      </div></section>

      {related.length > 0 && <section className="px-5 py-20 lg:px-8 lg:py-24"><div className="mx-auto max-w-7xl"><p className="eyebrow">{p.relatedTitle}</p><h2 className="section-title mt-4 text-3xl">{p.otherInCategory}</h2><div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">{related.map((r, i) => <div key={r.id} data-reveal="" data-reveal-delay={String(i)}><ProductCard item={r} /></div>)}</div></div></section>}
      <SiteFooter />
    </main>
  );
}
