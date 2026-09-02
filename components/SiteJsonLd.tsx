import JsonLd from '@/components/JsonLd';
import type { Dictionary } from '@/lib/i18n/dictionaries';
import { CONTACT_EMAIL, CONTACT_PHONE_HREF, SITE_URL } from '@/lib/site';

/**
 * Site-wide structured data, rendered once in the root layout:
 * - Organization + LocalBusiness (Abidjan, Plateau) with opening hours and contact point,
 * - WebSite with a SearchAction bound to the store search (`/store?q=`).
 * Page-specific graphs (Product, BreadcrumbList, FAQPage, HowTo, ItemList) live in their pages.
 */
export default function SiteJsonLd({ d, htmlLang }: { d: Dictionary; htmlLang: string }) {
  const phone = CONTACT_PHONE_HREF.replace('tel:', '');
  const organization = {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'LocalBusiness'],
    '@id': `${SITE_URL}/#organization`,
    name: 'SafeR',
    alternateName: 'SafeR Smart Home Security',
    legalName: 'RADIANT ASSISTANCE SECURITY',
    description: d.meta.description,
    url: SITE_URL,
    logo: { '@type': 'ImageObject', url: `${SITE_URL}/brand/safer-logo.png` },
    image: `${SITE_URL}/og.png`,
    telephone: phone,
    email: CONTACT_EMAIL,
    priceRange: 'FCFA',
    currenciesAccepted: 'XOF',
    paymentAccepted: 'Orange Money, MTN MoMo, Wave, carte bancaire',
    address: { '@type': 'PostalAddress', streetAddress: 'Plateau', addressLocality: 'Abidjan', addressRegion: 'Abidjan', addressCountry: 'CI' },
    geo: { '@type': 'GeoCoordinates', latitude: 5.3243, longitude: -4.0197 },
    areaServed: [
      { '@type': 'City', name: 'Abidjan' },
      { '@type': 'Country', name: 'Côte d’Ivoire' },
    ],
    openingHoursSpecification: [
      { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '08:00', closes: '18:00' },
      { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Saturday', opens: '09:00', closes: '13:00' },
    ],
    contactPoint: [
      { '@type': 'ContactPoint', contactType: 'customer service', telephone: phone, email: CONTACT_EMAIL, availableLanguage: ['fr', 'en', 'es', 'ar', 'zh'], areaServed: 'CI', hoursAvailable: { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], opens: '00:00', closes: '23:59' } },
    ],
    knowsAbout: ['Home security', 'Video surveillance', 'Alarm systems', 'Access control', 'Smart home', 'Monitoring centre'],
    inLanguage: htmlLang,
  };

  const website = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    name: d.meta.siteName,
    alternateName: d.meta.defaultTitle,
    url: SITE_URL,
    description: d.meta.description,
    inLanguage: htmlLang,
    publisher: { '@id': `${SITE_URL}/#organization` },
    potentialAction: {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: `${SITE_URL}/store?q={search_term_string}` },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <>
      <JsonLd data={organization} />
      <JsonLd data={website} />
    </>
  );
}
