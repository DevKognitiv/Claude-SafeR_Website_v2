import type { Metadata } from 'next';
import Link from 'next/link';
import { requireChatGPTUser } from '@/app/chatgpt-auth';
import PartnerApplicationForm from '@/components/PartnerApplicationForm';
import SiteFooter from '@/components/SiteFooter';
import SiteHeader from '@/components/SiteHeader';

export const metadata: Metadata = { title: 'Candidature partenaire', description: 'Déposez votre candidature au réseau d’installateurs SafeR.' };
export const dynamic = 'force-dynamic';

export default async function PartnerApplicationPage() {
  const user = await requireChatGPTUser('/partenaires/inscription');
  return <main className="theme-page bg-[#f3f5fb] text-black">
    <section className="bg-black text-white"><SiteHeader /><div className="mx-auto max-w-7xl px-5 pb-16 pt-10 lg:px-8 lg:pb-20"><p className="eyebrow">Candidature sécurisée</p><h1 className="mt-5 max-w-4xl text-5xl font-light tracking-[-.05em] sm:text-6xl">Rejoindre le réseau SafeR.</h1><p className="mt-5 max-w-2xl leading-7 text-white/65">Votre compte identifie l’auteur du dossier. Après dépôt, le niveau reste « Non vérifié » jusqu’à la revue KYC et technique.</p></div></section>
    <section className="px-5 py-16 lg:px-8 lg:py-24"><div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[.65fr_1.35fr]"><aside className="h-fit rounded-[28px] bg-[#0b1d17] p-7 text-white"><p className="text-xs font-bold uppercase tracking-[.14em] text-[#b8ff3d]">Avant de commencer</p><ol className="mt-7 space-y-5 text-sm leading-6 text-white/70"><li><strong className="block text-white">01 · Profil professionnel</strong>Identité, statut, coordonnées, compétences et zones.</li><li><strong className="block text-white">02 · KYC minimal</strong>Une preuve d’identité ou d’activité, sans numéro sensible saisi en clair.</li><li><strong className="block text-white">03 · Revue humaine</strong>Validation des preuves, références et test technique.</li></ol><Link href="/partenaires" className="mt-8 inline-flex text-sm font-bold text-[#52c6ff]">Voir tous les critères →</Link></aside><PartnerApplicationForm defaultName={user.name} defaultEmail={user.email} /></div></section>
    <SiteFooter />
  </main>;
}
