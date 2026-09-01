import Link from '@/components/Link';
import { getI18n } from '@/lib/i18n/server';
import JsonLd from '@/components/JsonLd';
import { SITE_URL } from '@/lib/site';

export type Crumb = { label: string; href?: string };

export default async function Breadcrumbs({ items, tone = 'dark', className = '' }: { items: Crumb[]; tone?: 'dark' | 'light'; className?: string }) {
  const { d } = await getI18n();
  const all: Crumb[] = [{ label: d.common.home, href: '/' }, ...items];
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: all.map((crumb, index) => ({ '@type': 'ListItem', position: index + 1, name: crumb.label, ...(crumb.href ? { item: `${SITE_URL}${crumb.href}` } : {}) })),
  };
  const muted = tone === 'dark' ? 'text-white/45' : 'text-black/45';
  const current = tone === 'dark' ? 'text-white' : 'text-black';
  return (
    <nav aria-label={d.common.breadcrumb} className={`flex flex-wrap items-center gap-2 text-xs ${muted} ${className}`}>
      <JsonLd data={jsonLd} />
      {all.map((crumb, index) => {
        const last = index === all.length - 1;
        return (
          <span key={`${crumb.label}-${index}`} className="flex items-center gap-2">
            {crumb.href && !last ? <Link href={crumb.href} className="hover:underline">{crumb.label}</Link> : <span className={last ? current : ''} aria-current={last ? 'page' : undefined}>{crumb.label}</span>}
            {!last && <span aria-hidden="true">/</span>}
          </span>
        );
      })}
    </nav>
  );
}
