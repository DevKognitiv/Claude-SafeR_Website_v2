import { products, catalog, categoryIds, subcategoriesOf, productPath } from '@/lib/catalog';
import { productSections } from '@/components/store/ProductPage';
import { segmentOrder } from '@/lib/collective';
import { optionOrder, packOrder } from '@/lib/packs';
import { verificationOrder } from '@/lib/partner-verification';
import { solutionStructures } from '@/lib/solutions';
import { faqThemes, guideIds, maintenancePlans } from '@/lib/support';

export type RouteGroup = 'main' | 'solutions' | 'store' | 'offers' | 'collective' | 'partners' | 'support' | 'company';
export type SiteRoute = { path: string; group: RouteGroup; level: number; priority: number; changeFrequency: 'daily' | 'weekly' | 'monthly' | 'yearly'; indexable: boolean };

function route(path: string, group: RouteGroup, priority: number, changeFrequency: SiteRoute['changeFrequency'] = 'monthly', indexable = true): SiteRoute {
  return { path, group, level: Math.max(1, path.split('/').filter(Boolean).length), priority, changeFrequency, indexable };
}

/** Every public route of the site (used by sitemap.xml, the site map page and the audit). */
export function allRoutes(): SiteRoute[] {
  const routes: SiteRoute[] = [
    route('/', 'main', 1, 'weekly'),
    route('/diagnostic', 'main', 0.9, 'monthly'),
    route('/produits', 'main', 0.7, 'weekly'),
    route('/espace-client', 'main', 0.4, 'monthly', false),
    route('/solutions', 'solutions', 0.9, 'monthly'),
    route('/store', 'store', 0.9, 'daily'),
    route('/store/marques', 'store', 0.6, 'weekly'),
    route('/store/catalogue', 'store', 0.6, 'monthly'),
    route('/store/comparer', 'store', 0.3, 'monthly', false),
    route('/offres', 'offers', 0.9, 'monthly'),
    route('/quartiers', 'collective', 0.8, 'monthly'),
    route('/partenaires', 'partners', 0.7, 'monthly'),
    route('/partenaires/code-de-conduite', 'partners', 0.4, 'yearly'),
    route('/partenaires/inscription', 'partners', 0.3, 'yearly', false),
    route('/partenaires/tableau-de-bord', 'partners', 0.2, 'yearly', false),
    route('/support', 'support', 0.8, 'monthly'),
    route('/support/maintenance', 'support', 0.6, 'monthly'),
    route('/support/faq', 'support', 0.7, 'monthly'),
    route('/support/guides', 'support', 0.6, 'monthly'),
    route('/support/garantie', 'support', 0.5, 'yearly'),
    route('/support/contact', 'support', 0.6, 'yearly'),
    route('/a-propos', 'company', 0.6, 'yearly'),
    route('/a-propos/radiant', 'company', 0.4, 'yearly'),
    route('/a-propos/engagements', 'company', 0.4, 'yearly'),
    route('/a-propos/carrieres', 'company', 0.4, 'monthly'),
    route('/mentions-legales', 'company', 0.2, 'yearly'),
    route('/confidentialite', 'company', 0.2, 'yearly'),
    route('/cgv', 'company', 0.2, 'yearly'),
    route('/cookies', 'company', 0.1, 'yearly'),
    route('/plan-du-site', 'company', 0.2, 'monthly'),
  ];
  for (const solution of solutionStructures) {
    routes.push(route(`/solutions/${solution.slug}`, 'solutions', 0.8));
    for (const detail of solution.details) {
      routes.push(route(`/solutions/${solution.slug}/${detail}`, 'solutions', 0.7));
      routes.push(route(`/solutions/${solution.slug}/${detail}/equipements`, 'solutions', 0.5, 'weekly'));
    }
  }
  for (const category of categoryIds) {
    routes.push(route(`/store/${category}`, 'store', 0.8, 'daily'));
    for (const sub of subcategoriesOf(category)) if (products.some((p) => p.category === category && p.subcategory === sub)) routes.push(route(`/store/${category}/${sub}`, 'store', 0.7, 'daily'));
  }
  for (const product of products) {
    const path = productPath(product);
    routes.push(route(path, 'store', 0.6, 'daily'));
    for (const section of productSections) routes.push(route(`${path}/${section}`, 'store', 0.3, 'weekly'));
  }
  for (const brand of Object.values(catalog.brands)) if (brand.count > 0) routes.push(route(`/store/marques/${brand.id}`, 'store', 0.5, 'weekly'));
  for (const pack of packOrder) routes.push(route(`/offres/${pack}`, 'offers', 0.7));
  for (const option of optionOrder) routes.push(route(`/offres/options/${option}`, 'offers', 0.5));
  for (const segment of segmentOrder) routes.push(route(`/quartiers/${segment}`, 'collective', 0.6));
  for (const status of verificationOrder) routes.push(route(`/partenaires/niveaux/${status}`, 'partners', 0.4, 'yearly'));
  for (const plan of maintenancePlans) routes.push(route(`/support/maintenance/${plan}`, 'support', 0.5));
  for (const theme of faqThemes) routes.push(route(`/support/faq/${theme}`, 'support', 0.5));
  for (const guide of guideIds) routes.push(route(`/support/guides/${guide}`, 'support', 0.5));
  return routes;
}
