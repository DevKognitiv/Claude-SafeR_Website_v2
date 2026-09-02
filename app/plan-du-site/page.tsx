import type { Metadata } from 'next';
import Link from '@/components/Link';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import { getCopy, getProductBySku } from '@/lib/catalog';
import { getI18n, pageMetadata } from '@/lib/i18n/server';
import { allRoutes, type RouteGroup } from '@/lib/routes';

export async function generateMetadata(): Promise<Metadata> {
  const { d, locale } = await getI18n();
  return pageMetadata(d, locale, { title: d.sitemapPage.title, description: d.sitemapPage.description, path: '/plan-du-site', slot: 'legal' });
}

export default async function SiteMapPage() {
  const { d, locale } = await getI18n();
  const s = d.sitemapPage;
  const groups: RouteGroup[] = ['main', 'solutions', 'store', 'offers', 'collective', 'partners', 'support', 'company'];
  const routes = allRoutes().filter((r) => r.indexable && !(r.group === 'store' && r.level >= 5));
  const labelFor = (path: string): string => {
    const parts = path.split('/').filter(Boolean);
    if (path === '/') return d.common.home;
    if (parts[0] === 'store' && parts.length === 4) { const p = getProductBySku(parts[3]); return p ? getCopy(p, locale).name : parts[3]; }
    if (parts[0] === 'store' && parts.length === 3 && parts[1] !== 'marques') return (d.store.subcategories as Record<string, string>)[parts[2]] ?? parts[2];
    if (parts[0] === 'store' && parts.length === 2) return (d.store.categories as Record<string, { title: string }>)[parts[1]]?.title ?? (parts[1] === 'marques' ? d.footer.brands : parts[1]);
    if (parts[0] === 'store' && parts[1] === 'marques' && parts.length === 3) return parts[2];
    if (parts[0] === 'solutions' && parts.length >= 2) { const sol = (d.solutions.items as Record<string, { title: string; details: Record<string, { title: string }> }>)[parts[1]]; if (parts.length === 2) return sol?.title ?? parts[1]; const det = sol?.details[parts[2]]?.title ?? parts[2]; return parts.length === 4 ? `${det} — ${d.solutions.equipmentPage.eyebrow}` : det; }
    if (parts[0] === 'offres' && parts.length === 2) return (d.offers.packs as Record<string, { name: string }>)[parts[1]]?.name ?? parts[1];
    if (parts[0] === 'offres' && parts.length === 3) return (d.offers.options as Record<string, { title: string }>)[parts[2]]?.title ?? parts[2];
    if (parts[0] === 'quartiers' && parts.length === 2) return (d.collective.segments as Record<string, { title: string }>)[parts[1]]?.title ?? parts[1];
    if (parts[0] === 'partenaires' && parts[1] === 'niveaux') return (d.partners.levels.items as Record<string, { label: string }>)[parts[2]]?.label ?? parts[2];
    if (parts[0] === 'support' && parts[1] === 'maintenance' && parts.length === 3) return (d.support.maintenance.plans as Record<string, { title: string }>)[parts[2]]?.title ?? parts[2];
    if (parts[0] === 'support' && parts[1] === 'faq' && parts.length === 3) return (d.support.faq.themes as Record<string, { title: string }>)[parts[2]]?.title ?? parts[2];
    if (parts[0] === 'support' && parts[1] === 'guides' && parts.length === 3) return (d.support.guides.items as Record<string, { title: string }>)[parts[2]]?.title ?? parts[2];
    const fixed: Record<string, string> = { '/diagnostic': d.nav.diagnostic, '/produits': d.nav.products, '/solutions': d.nav.solutions, '/store': d.nav.store, '/offres': d.nav.offers, '/quartiers': d.nav.collective, '/partenaires': d.nav.partners, '/partenaires/code-de-conduite': d.partners.code.eyebrow, '/support': d.nav.support, '/support/maintenance': d.support.maintenance.breadcrumb, '/support/faq': d.nav.faq, '/support/guides': d.support.guides.eyebrow, '/support/garantie': d.support.warranty.eyebrow, '/support/contact': d.nav.contact, '/a-propos': d.nav.about, '/a-propos/radiant': d.about.radiantLink, '/a-propos/engagements': d.about.engagementsLink, '/a-propos/carrieres': d.about.careersLink, '/mentions-legales': d.nav.legal, '/confidentialite': d.nav.privacy, '/cgv': d.nav.terms, '/cookies': d.nav.cookies, '/plan-du-site': d.nav.sitemap, '/store/marques': d.footer.brands, '/store/catalogue': d.footer.catalogue };
    return fixed[path] ?? path;
  };
  return <main id="contenu" className="theme-page bg-[#f3f5fb] text-black">
    <section className="bg-black text-white"><SiteHeader /><div className="mx-auto max-w-7xl px-5 pb-16 pt-10 lg:px-8"><p className="eyebrow">{s.title}</p><h1 className="mt-5 max-w-4xl text-5xl font-light leading-[1] tracking-[-.05em] sm:text-6xl">{s.title}</h1><p className="mt-6 max-w-2xl text-lg leading-8 text-white/60">{s.intro}</p></div></section>
    <section className="px-5 py-16 lg:px-8 lg:py-24"><div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-2 lg:grid-cols-4">{groups.map((group) => <div key={group} className="rounded-[26px] border border-black/8 bg-white p-6"><h2 className="text-xs font-bold uppercase tracking-[.14em] text-black/45">{s.sections[group]}</h2><ul className="mt-4 space-y-2 text-sm">{routes.filter((r) => r.group === group).map((r) => <li key={r.path} style={{ paddingLeft: `${(r.level - 1) * 10}px` }}><Link href={r.path} className="hover:underline">{labelFor(r.path)}</Link></li>)}</ul></div>)}</div></section>
    <SiteFooter />
  </main>;
}
