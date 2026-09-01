import type { Metadata } from 'next';
import LegalPage from '@/components/LegalPage';
import { getI18n, pageMetadata } from '@/lib/i18n/server';

export async function generateMetadata(): Promise<Metadata> {
  const { d, locale } = await getI18n();
  return pageMetadata(d, locale, { title: d.legal.terms.meta.title, description: d.legal.terms.meta.description, path: '/cgv' });
}

export default async function Page() {
  const { d } = await getI18n();
  return <LegalPage title={d.legal.terms.title} sections={d.legal.terms.sections} />;
}
