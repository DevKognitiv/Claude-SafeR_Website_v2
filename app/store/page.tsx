import type { Metadata } from 'next';
import Link from 'next/link';
import SiteFooter from '@/components/SiteFooter';
import SiteHeader from '@/components/SiteHeader';
import StoreCatalog from '@/components/StoreCatalog';
import { storeCatalog } from '@/lib/store-catalog';

export const metadata: Metadata = {
  title: 'Store sécurité & maison intelligente',
  description: 'Configurez vos équipements SafeR pour la sécurité, la vidéo, les accès et la maison intelligente en Côte d’Ivoire.',
};

export default function StorePage() {
  const synced = new Intl.DateTimeFormat('fr-FR', { dateStyle: 'long', timeZone: 'Africa/Abidjan' }).format(new Date(storeCatalog.lastCatalogSync));
  return <main className="theme-page bg-[#f3f5fb] text-black">
    <section className="relative overflow-hidden bg-black text-white"><div className="brand-grid absolute inset-0 opacity-35" /><SiteHeader /><div className="relative mx-auto grid max-w-7xl gap-10 px-5 pb-20 pt-12 lg:grid-cols-[1fr_.75fr] lg:items-end lg:px-8 lg:pb-28 lg:pt-20"><div><p className="eyebrow">SafeR Store · Abidjan</p><h1 className="mt-6 max-w-4xl text-5xl font-light leading-[.98] tracking-[-.055em] sm:text-6xl lg:text-7xl">La bonne technologie.<br /><span className="font-semibold text-[#52c6ff]">Configurée pour vous.</span></h1><p className="mt-7 max-w-2xl text-lg leading-8 text-white/65">Comparez, sélectionnez et composez votre système. SafeR valide ensuite la compatibilité, l’installation et le niveau de service adapté à votre site.</p></div><div className="rounded-[28px] border border-white/12 bg-white/7 p-6 backdrop-blur"><p className="text-xs font-bold uppercase tracking-[.14em] text-[#b8ff3d]">Catalogue sous contrôle</p><p className="mt-4 text-2xl font-semibold">Sources officielles vérifiées chaque nuit.</p><p className="mt-3 text-sm leading-6 text-white/55">Dernière synchronisation : {synced}. Les prix SafeR restent indicatifs jusqu’au diagnostic et ne sont jamais remplacés automatiquement par un prix étranger.</p><Link href="/produits" className="mt-5 inline-flex text-sm font-bold text-[#52c6ff]">Voir le showroom vidéo →</Link></div></div></section>
    <section className="px-5 py-20 lg:px-8 lg:py-28"><div className="mx-auto max-w-7xl"><div className="mb-12 grid gap-6 lg:grid-cols-[1fr_.8fr] lg:items-end"><div><p className="eyebrow">Équipements & services</p><h2 className="section-title mt-5">Composez votre sécurité,<br />sans mauvaise surprise.</h2></div><p className="max-w-xl leading-7 text-black/55 lg:ml-auto">Chaque référence commerciale SafeR conserve sa base technologique et sa référence de maintenance. Disponibilité, compatibilité, garantie et certification locale sont confirmées avant commande.</p></div><StoreCatalog products={storeCatalog.products} /></div></section>
    <section className="px-5 pb-24 lg:px-8"><div className="mx-auto grid max-w-7xl gap-5 rounded-[34px] bg-[#4556f5] p-8 text-white lg:grid-cols-[1fr_auto] lg:items-center lg:p-12"><div><p className="text-xs font-bold uppercase tracking-[.15em] text-white/90">Besoin d’un système complet ?</p><h2 className="mt-4 max-w-3xl text-3xl font-semibold tracking-tight sm:text-4xl">Un expert SafeR transforme votre panier en architecture installable.</h2></div><Link href="/diagnostic" className="rounded-full bg-white px-7 py-4 text-center text-sm font-bold text-black">Faire le diagnostic</Link></div></section>
    <SiteFooter />
  </main>;
}
