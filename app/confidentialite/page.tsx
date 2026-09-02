import type { Metadata } from 'next';
import LegalPage from '@/components/LegalPage';
import { getI18n, pageMetadata } from '@/lib/i18n/server';

export async function generateMetadata(): Promise<Metadata> {
  const { d, locale } = await getI18n();
  return pageMetadata(d, locale, { title: d.legal.privacy.meta.title, description: d.legal.privacy.meta.description, path: '/confidentialite', slot: 'legal' });
}

export default async function Page() {
  const { d } = await getI18n();
  return <LegalPage title={d.legal.privacy.title} sections={d.legal.privacy.sections} />;
}
