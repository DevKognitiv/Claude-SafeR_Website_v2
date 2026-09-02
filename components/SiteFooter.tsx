import Link from '@/components/Link';
import { fmt } from '@/lib/i18n/config';
import { getI18n } from '@/lib/i18n/server';
import { CONTACT_PHONE_DISPLAY, CONTACT_PHONE_HREF } from '@/lib/site';

export default async function SiteFooter() {
  const { d } = await getI18n();
  const s = d.solutions.items;
  const year = new Date().getFullYear();

  const columns: { title: string; links: [string, string][] }[] = [
    { title: d.footer.solutionsTitle, links: [[s['video-intelligente'].title, '/solutions/video-intelligente'], [s['alarmes-connectees'].title, '/solutions/alarmes-connectees'], [s['controle-acces'].title, '/solutions/controle-acces'], [s.domotique.title, '/solutions/domotique']] },
    { title: d.footer.storeTitle, links: [[d.footer.allProducts, '/store'], [d.footer.brands, '/store/marques'], [d.footer.catalogue, '/store/catalogue'], [d.footer.compare, '/store/comparer'], [d.footer.showroom, '/produits'], [d.nav.offers, '/offres']] },
    { title: d.footer.collectiveTitle, links: [[d.footer.smartDistrict, '/quartiers'], [d.footer.smartCity, '/quartiers/collectivites'], [d.footer.support247, '/support'], [d.footer.maintenance, '/support/maintenance'], [d.footer.faq, '/support/faq']] },
    { title: d.footer.companyTitle, links: [[d.footer.about, '/a-propos'], [d.footer.becomePartner, '/partenaires'], [d.footer.client, '/espace-client'], [d.footer.careers, '/a-propos/carrieres'], [d.nav.contact, '/support/contact']] },
  ];

  const legalLinks: [string, string][] = [[d.footer.legal, '/mentions-legales'], [d.footer.privacy, '/confidentialite'], [d.footer.terms, '/cgv'], [d.footer.cookies, '/cookies'], [d.footer.sitemap, '/plan-du-site']];

  return (
    <footer className="relative overflow-hidden bg-black px-5 pb-8 pt-16 text-white lg:px-8">
      <div className="brand-grid pointer-events-none absolute inset-0 opacity-35" />
      <div className="brand-cut absolute -right-32 top-0 h-2 w-[62%] bg-[#4556f5]" />
      <div className="relative mx-auto grid max-w-7xl gap-12 border-b border-white/10 pb-14 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr_1fr]">
        <div>
          <Link href="/" className="inline-flex min-w-[160px] py-3"><img src="/brand/safer-logo-dark-bg.png" alt="SafeR" width="184" height="62" className="h-auto w-[184px] object-contain" /></Link>
          <p className="mt-5 max-w-xs text-sm leading-6 text-white/50">{d.footer.brand}</p>
          <a href={CONTACT_PHONE_HREF} className="mt-5 block text-sm font-semibold text-[#52c6ff]">{d.footer.assistance} · {CONTACT_PHONE_DISPLAY}</a>
        </div>
        {columns.map((column) => (
          <div key={column.title}>
            <p className="mb-4 text-xs font-bold uppercase tracking-[.15em] text-white/35">{column.title}</p>
            <div className="space-y-3 text-sm text-white/65">
              {column.links.map(([label, href]) => <Link key={href} className="block hover:text-white" href={href}>{label}</Link>)}
            </div>
          </div>
        ))}
      </div>
      <div className="relative mx-auto flex max-w-7xl flex-col gap-4 pt-7 text-xs text-white/35 lg:flex-row lg:items-center lg:justify-between">
        <p>{fmt(d.footer.copyright, { year })}</p>
        <nav aria-label={d.nav.legal} className="flex flex-wrap gap-x-5 gap-y-2">
          {legalLinks.map(([label, href]) => <Link key={href} href={href} className="hover:text-white">{label}</Link>)}
          <a href={d.footer.poweredByHref} target="_blank" rel="noopener noreferrer" className="font-semibold text-white/60 hover:text-[#52c6ff]">{d.footer.poweredBy}</a>
        </nav>
        <p>{d.footer.payments}</p>
      </div>
    </footer>
  );
}
