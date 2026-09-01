import type { Metadata } from 'next';
import SiteHeader from '@/components/SiteHeader';
import DiagnosticWizard from '@/components/DiagnosticWizard';

export const metadata: Metadata = { title: 'Diagnostic sécurité gratuit | SafeR', description: 'Configurez votre protection SafeR en quelques minutes et recevez une recommandation personnalisée.' };

export default function DiagnosticPage() {
  return <main className="theme-page min-h-screen bg-[#eef2ee] text-[#0a1814]"><SiteHeader dark={false} /><div className="mx-auto max-w-6xl px-5 pb-20 pt-8 lg:px-8"><DiagnosticWizard /></div></main>;
}
