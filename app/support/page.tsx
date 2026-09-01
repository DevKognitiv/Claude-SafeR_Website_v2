import type { Metadata } from 'next';
import Link from 'next/link';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';

export const metadata: Metadata = { title: 'Support & assistance', description: 'Assistance SafeR 24/7, maintenance, suivi d’installation et accompagnement client en Côte d’Ivoire.' };

const help = [
  ['Urgence ou alerte', 'Notre centre de veille suit le protocole défini pour votre site. En cas de danger immédiat, contactez aussi les services d’urgence compétents.', 'Appeler SafeR', 'tel:+2250150202020'],
  ['Assistance technique', 'Un équipement ne répond plus ? Consultez son état dans votre espace ou ouvrez une demande de support.', 'Ouvrir le support', '/espace-client#support'],
  ['Installation en cours', 'Retrouvez le créneau, les étapes, les documents et le suivi du technicien depuis votre tableau de bord.', 'Suivre l’installation', '/espace-client#installation'],
  ['Factures & paiements', 'Consultez vos échéances, justificatifs et moyens de paiement au même endroit.', 'Gérer mes paiements', '/espace-client#payments'],
];

export default function SupportPage() {
  return <main className="theme-page bg-[#f3f5fb] text-black">
    <section className="relative overflow-hidden bg-black pb-24 text-white"><div className="brand-grid absolute inset-0 opacity-45" /><SiteHeader /><div className="relative mx-auto max-w-7xl px-5 pt-14 lg:px-8 lg:pt-20"><p data-i18n="support.eyebrow" className="text-xs font-bold uppercase tracking-[.16em] text-[#52c6ff]">Assistance SafeR</p><h1 data-i18n="support.title" className="mt-6 max-w-5xl text-5xl font-light leading-[1] tracking-[-.05em] sm:text-6xl lg:text-7xl">Une équipe présente, avant et après l’alerte.</h1><p data-i18n="support.intro" className="mt-7 max-w-2xl text-lg leading-8 text-white/60">Obtenez la bonne aide rapidement, suivez vos demandes et gardez votre système au meilleur niveau de disponibilité.</p><a href="tel:+2250150202020" className="mt-9 inline-flex rounded-full bg-[#4556f5] px-7 py-4 text-sm font-bold text-white">+225 01 50 20 20 20</a></div></section>
    <section className="px-5 py-20 lg:px-8 lg:py-28"><div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-2">{help.map(([title,text,cta,href], index) => <article key={title} className={`rounded-[30px] p-7 sm:p-8 ${index===0?'bg-[#52c6ff]':'border border-black/8 bg-white'}`}><span className="text-sm font-semibold opacity-45">0{index+1}</span><h2 className="mt-12 text-2xl font-semibold">{title}</h2><p className="mt-3 max-w-xl text-sm leading-6 opacity-60">{text}</p><Link href={href} className={`mt-8 inline-flex rounded-full px-5 py-3 text-xs font-bold ${index===0?'bg-black text-white':'bg-[#4556f5] text-white'}`}>{cta}</Link></article>)}</div></section>
    <section className="px-5 pb-24 lg:px-8"><div className="mx-auto grid max-w-7xl gap-8 overflow-hidden rounded-[36px] bg-[#4556f5] p-8 text-white lg:grid-cols-[1fr_.8fr] lg:items-center lg:p-14"><div><p data-i18n="support.maintenance" className="text-xs font-bold uppercase tracking-[.16em] text-white/55">Maintenance & entretien</p><h2 className="mt-5 text-4xl font-light leading-tight sm:text-5xl">Prévenir vaut mieux que découvrir une panne au mauvais moment.</h2><p className="mt-5 max-w-2xl leading-7 text-white/65">Contrôles périodiques, nettoyage, tests d’autonomie, mises à jour et remplacement planifié : SafeR garde votre protection prête.</p><Link href="/support/maintenance" data-i18n="common.discover" className="mt-8 inline-flex rounded-full bg-black px-6 py-3.5 text-sm font-bold text-white">Découvrir</Link></div><div className="media-grade relative min-h-[360px] overflow-hidden rounded-[28px]"><img src="https://images.pexels.com/photos/4481326/pexels-photo-4481326.jpeg?auto=compress&dpr=1&h=900&w=1200" alt="Technicien préparant une intervention" className="absolute inset-0 h-full w-full object-cover" /></div></div></section>
    <SiteFooter />
  </main>;
}
