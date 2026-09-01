import type { Metadata } from 'next';
import SiteHeader from '@/components/SiteHeader';
import DiagnosticWizard from '@/components/DiagnosticWizard';
import { getI18n, pageMetadata } from '@/lib/i18n/server';

export async function generateMetadata(): Promise<Metadata> {
  const { d, locale } = await getI18n();
  return pageMetadata(d, locale, { title: d.diagnostic.meta.title, description: d.diagnostic.meta.description, path: '/diagnostic' });
}

export default function DiagnosticPage() {
  return <main id="contenu" className="theme-page min-h-screen bg-[#eef2ee] text-[#0a1814]"><SiteHeader dark={false} /><div className="mx-auto max-w-6xl px-5 pb-20 pt-8 lg:px-8"><DiagnosticWizard /></div></main>;
}
