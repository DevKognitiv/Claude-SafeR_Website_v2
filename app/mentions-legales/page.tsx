import type { Metadata } from 'next';
import LegalPage from '@/components/LegalPage';
import { getI18n, pageMetadata } from '@/lib/i18n/server';

export async function generateMetadata(): Promise<Metadata> {
  const { d, locale } = await getI18n();
  return pageMetadata(d, locale, { title: d.legal.mentions.meta.title, description: d.legal.mentions.meta.description, path: '/mentions-legales', slot: 'legal' });
}

export default async function Page() {
  const { d } = await getI18n();
  return <LegalPage title={d.legal.mentions.title} sections={d.legal.mentions.sections} />;
}
