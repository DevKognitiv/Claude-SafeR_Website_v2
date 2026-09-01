import type { Metadata } from 'next';
import Link from 'next/link';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';

export const metadata: Metadata = { title: 'Packs et offres | SafeR', description: 'Comparez les packs SafeR Essentiel, Sérénité et Signature pour votre maison en Côte d’Ivoire.' };

const rows = [
  ['Centrale connectée avec secours', true, true, true],
  ['Détecteurs intrusion', '3', '6', 'Sur mesure'],
  ['Caméras intelligentes', 'En option', '2 incluses', 'Sur mesure'],
  ['Détection fumée', 'En option', true, true],
  ['Bouton SOS', 'En option', true, true],
  ['Contrôle d’accès', 'En option', 'En option', true],
  ['Domotique & scénarios', 'En option', '3 scénarios', 'Sur mesure'],
  ['Veille humaine 24/7', true, true, true],
  ['Intervention', 'Standard', 'Prioritaire', 'Premium'],
  ['Maintenance', 'À la demande', 'Annuelle', 'Premium'],
];

const options = [
  ['◉', 'Caméra extérieure IA', 'Détecte les mouvements utiles, même la nuit.'],
  ['▣', 'Sonnette vidéo', 'Voyez, parlez et ouvrez à distance.'],
  ['↗', 'Portail connecté', 'Gérez famille, visiteurs et prestataires.'],
  ['♨', 'Détection incendie', 'Fumée et chaleur surveillées en continu.'],
  ['⌁', 'Pilotage énergie', 'Climat et éclairage selon vos habitudes.'],
  ['✦', 'Bouton d’urgence', 'Une aide immédiate, à portée de main.'],
];

export default function OffersPage() {
  return <main className="theme-page offers-page bg-[#f1f4f1] text-[#0a1814]">
    <section className="bg-[#07120f] pb-24 text-white"><SiteHeader /><div className="mx-auto max-w-7xl px-5 pt-14 text-center lg:px-8 lg:pt-20"><p className="text-xs font-bold uppercase tracking-[.16em] text-[#b8ff3d]">Des offres qui évoluent avec vous</p><h1 className="mx-auto mt-6 max-w-4xl text-5xl font-semibold leading-[1] tracking-[-.05em] sm:text-6xl lg:text-7xl">Une sécurité claire.<br />Sans surprise.</h1><p className="mx-auto mt-6 max-w-xl leading-7 text-white/55">Commencez avec l’essentiel, ajoutez ce qui compte et gardez le contrôle de votre budget.</p></div></section>
    <section className="px-5 py-20 lg:px-8 lg:py-28"><div className="mx-auto max-w-7xl"><div className="grid gap-5 lg:grid-cols-3">
      {[['Essentiel','19 900','Appartement ou petite maison','Une base fiable pour détecter, alerter et piloter.'],['Sérénité','34 900','Le choix des familles','Vidéo, risques domestiques et intervention prioritaire.'],['Signature','Sur mesure','Résidences & besoins avancés','Une architecture complète, conçue autour de votre quotidien.']].map(([name,price,tag,desc], i) => <article key={name} className={`rounded-[30px] p-7 ${i===1?'bg-[#b8ff3d] shadow-xl':'bg-white border border-black/8'}`}><p className="text-xs font-bold uppercase tracking-[.12em] text-black/40">{tag}</p><h2 className="mt-6 text-3xl font-semibold">SafeR {name}</h2><p className="mt-3 min-h-12 text-sm leading-6 text-black/50">{desc}</p><div className="my-7 border-y border-black/10 py-6"><span className="text-3xl font-semibold">{price}</span>{price!=='Sur mesure'&&<span className="ml-2 text-sm">FCFA / mois</span>}</div><Link href={`/diagnostic?pack=SafeR%20${name}`} className="block rounded-full bg-[#0b1d17] px-6 py-4 text-center text-sm font-bold text-white">Choisir {name}</Link></article>)}
    </div><p className="mt-6 text-center text-xs text-black/40">Tarifs indicatifs hors installation et équipements additionnels. Devis personnalisé après diagnostic.</p></div></section>
    <section className="bg-white px-5 py-20 lg:px-8 lg:py-28"><div className="mx-auto max-w-7xl"><div className="max-w-3xl"><p className="text-xs font-bold uppercase tracking-[.16em] text-[#669516]">Comparatif détaillé</p><h2 className="mt-5 text-4xl font-semibold tracking-[-.04em] sm:text-5xl">Comparez en un coup d’œil.</h2></div><div className="mt-12 overflow-x-auto rounded-[28px] border border-black/8"><table className="w-full min-w-[760px] border-collapse text-left"><thead><tr className="bg-[#eef2ee]"><th className="p-5 text-sm">Fonctionnalités</th><th className="p-5 text-sm">Essentiel</th><th className="bg-[#b8ff3d]/40 p-5 text-sm">Sérénité</th><th className="p-5 text-sm">Signature</th></tr></thead><tbody>{rows.map(([label,...values])=><tr key={String(label)} className="border-t border-black/8"><td className="p-5 text-sm font-medium">{label}</td>{values.map((value,i)=><td key={i} className={`p-5 text-sm ${i===1?'bg-[#b8ff3d]/10':''}`}>{value===true?<span className="grid size-6 place-items-center rounded-full bg-[#b8ff3d] text-xs">✓</span>:value}</td>)}</tr>)}</tbody></table></div></div></section>
    <section className="px-5 py-20 lg:px-8 lg:py-28"><div className="mx-auto max-w-7xl"><div className="grid gap-8 lg:grid-cols-2 lg:items-end"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-[#669516]">À la carte</p><h2 className="mt-5 text-4xl font-semibold tracking-[-.04em] sm:text-5xl">Ajoutez seulement<br />ce qui vous est utile.</h2></div><p className="max-w-lg leading-7 text-black/50 lg:ml-auto">Votre système peut évoluer après l’installation. Ajoutez un accès, une caméra ou un scénario directement depuis votre espace client.</p></div><div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{options.map(([icon,title,text])=><article key={title} className="rounded-[26px] border border-black/8 bg-white p-6"><span className="grid size-12 place-items-center rounded-full bg-[#b8ff3d] text-xl">{icon}</span><h3 className="mt-8 text-xl font-semibold">{title}</h3><p className="mt-2 text-sm leading-6 text-black/45">{text}</p></article>)}</div></div></section>
    <section className="bg-[#b8ff3d] px-5 py-20 lg:px-8"><div className="mx-auto flex max-w-7xl flex-col gap-8 lg:flex-row lg:items-center lg:justify-between"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-black/45">Vous hésitez ?</p><h2 className="mt-4 text-4xl font-semibold tracking-[-.04em]">Laissez SafeR vous guider.</h2></div><Link href="/diagnostic" className="rounded-full bg-[#07120f] px-7 py-4 text-center text-sm font-bold text-white">Faire mon diagnostic gratuit</Link></div></section>
    <SiteFooter />
  </main>;
}
