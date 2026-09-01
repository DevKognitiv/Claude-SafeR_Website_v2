import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/api/', '/espace-client', '/partenaires/tableau-de-bord', '/partenaires/inscription', '/store/comparer'] }],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
