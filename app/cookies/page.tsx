import type { Metadata } from 'next';
import LegalPage from '@/components/LegalPage';
import { getI18n, pageMetadata } from '@/lib/i18n/server';

export async function generateMetadata(): Promise<Metadata> {
  const { d, locale } = await getI18n();
  return pageMetadata(d, locale, { title: d.legal.cookies.meta.title, description: d.legal.cookies.meta.description, path: '/cookies', slot: 'legal' });
}

export default async function Page() {
  const { d } = await getI18n();
  return <LegalPage title={d.legal.cookies.title} sections={d.legal.cookies.sections} />;
}
