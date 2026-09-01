import type { Metadata } from 'next';
import Link from 'next/link';
import ProductShowcase from '@/components/ProductShowcase';
import SiteFooter from '@/components/SiteFooter';
import SiteHeader from '@/components/SiteHeader';
import { productFamilies } from '@/lib/products';

export const metadata: Metadata = {
  title: 'Équipements intelligents',
  description: 'Découvrez les références SafeR sélectionnées pour la sécurité et la maison intelligente en Côte d’Ivoire.',
};

export default function ProductsPage() {
  return <main className="theme-page bg-[#f3f5fb] text-black">
    <section className="bg-black text-white"><SiteHeader /><div className="px-4 pb-5 sm:px-5 lg:px-8"><div className="mx-auto max-w-[1500px]"><ProductShowcase compact /></div></div></section>
    <section className="px-5 py-20 lg:px-8 lg:py-28"><div className="mx-auto max-w-7xl">
      <div className="grid gap-8 lg:grid-cols-[.9fr_1.1fr] lg:items-end"><div><p className="eyebrow">Catalogue d’intégration</p><h2 className="section-title mt-5">Des équipements sélectionnés. Une expérience unifiée.</h2></div><p className="max-w-xl leading-7 text-black/58 lg:ml-auto">SafeR qualifie les équipements selon le site, la connectivité disponible, l’exposition aux intempéries et le protocole de sécurité attendu. Les références commerciales SafeR restent reliées à leur base technologique pour la maintenance et le suivi de lot.</p></div>
      <div className="mt-14 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {productFamilies.map((product, index) => <article key={product.id} className={`flex min-h-[360px] flex-col rounded-[30px] border p-7 ${index === 0 ? 'border-transparent bg-[#4556f5] text-white' : 'border-black/8 bg-white'}`}>
          <div className="flex items-center justify-between gap-4"><span className={`text-[11px] font-bold uppercase tracking-[.14em] ${index === 0 ? 'text-white/90' : 'text-black/45'}`}>{product.category}</span><span className={`rounded-full px-3 py-1.5 text-[10px] font-bold ${index === 0 ? 'bg-white/12 text-white' : 'catalog-badge bg-[#e7f7ff] text-[#183e68]'}`}>SÉLECTION SAFER</span></div>
          <h2 className="mt-10 text-3xl font-semibold tracking-tight">{product.safeRName}</h2>
          <p className={`mt-3 text-sm leading-6 ${index === 0 ? 'text-white/90' : 'text-black/58'}`}>{product.description}</p>
          <div className="mt-auto pt-8"><p className={`text-[10px] uppercase tracking-[.12em] ${index === 0 ? 'text-white/90' : 'text-black/42'}`}>Traçabilité technique</p><p className="mt-1 text-xs font-semibold">{product.safeRReference}</p><p className={`mt-1 text-xs ${index === 0 ? 'text-white/90' : 'text-black/52'}`}>{product.sourceEcosystem} · {product.sourceReference}</p></div>
        </article>)}
      </div>
    </div></section>
    <section className="px-5 pb-24 lg:px-8"><div className="mx-auto grid max-w-7xl gap-8 rounded-[34px] border border-black/8 bg-white p-8 lg:grid-cols-[1fr_auto] lg:items-center lg:p-12"><div><p className="eyebrow">Transparence & conformité</p><h2 className="mt-4 max-w-3xl text-3xl font-semibold tracking-tight">La marque SafeR désigne le service d’intégration, pas une origine masquée.</h2><p className="mt-4 max-w-3xl text-sm leading-6 text-black/58">Les appellations et références SafeR sont une nomenclature commerciale de projet. Les marques et modèles cités restent la propriété de leurs titulaires. Compatibilité, disponibilité, certifications, PID OEM et conditions de garantie sont confirmés avant commande et consignés dans le dossier technique client.</p></div><Link href="/diagnostic" className="rounded-full bg-black px-7 py-4 text-center text-sm font-bold text-white">Valider ma configuration</Link></div></section>
    <SiteFooter />
  </main>;
}
