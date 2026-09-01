'use client';

import Link from 'next/link';
import { useState } from 'react';

const needOptions = [
  ['intrusion', 'Alarme anti-intrusion', 'Portes, fenêtres et mouvements'],
  ['video', 'Vidéosurveillance', 'Voir et vérifier à distance'],
  ['access', 'Contrôle d’accès', 'Portail, serrure et visiteurs'],
  ['fire', 'Incendie & risques', 'Fumée, chaleur et fuite d’eau'],
  ['comfort', 'Maison intelligente', 'Éclairage, climat et scénarios'],
  ['patrol', 'Intervention', 'Assistance et patrouille prioritaire'],
];

export default function DiagnosticWizard() {
  const [step, setStep] = useState(1);
  const [type, setType] = useState('Villa');
  const [needs, setNeeds] = useState<string[]>(['intrusion', 'video']);
  const [submitted, setSubmitted] = useState(false);

  const toggle = (id: string) => setNeeds((value) => value.includes(id) ? value.filter((item) => item !== id) : [...value, id]);
  const progress = submitted ? 100 : step * 25;

  if (submitted) {
    return (
      <div className="grid gap-6 lg:grid-cols-[1.1fr_.9fr]">
        <section className="rounded-[30px] bg-white p-6 shadow-sm sm:p-9">
          <span className="grid size-14 place-items-center rounded-full bg-[#b8ff3d] text-2xl">✓</span>
          <p className="mt-7 text-xs font-bold uppercase tracking-[.14em] text-[#669516]">Votre recommandation est prête</p>
          <h1 className="mt-3 text-4xl font-semibold leading-tight tracking-[-.04em]">SafeR Sérénité<br />correspond à votre besoin.</h1>
          <p className="mt-5 max-w-xl text-sm leading-6 text-black/50">Pour votre {type.toLowerCase()} et les {needs.length} priorités sélectionnées, ce pack offre le meilleur équilibre entre protection, vidéo et intervention.</p>
          <div className="mt-8 rounded-2xl bg-[#f1f4f1] p-5"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm text-black/45">À partir de</p><p className="mt-1 text-3xl font-semibold">34 900 <span className="text-sm">FCFA/mois</span></p></div><p className="text-xs text-black/40">Installation estimative après visite technique</p></div></div>
          <div className="mt-7 grid gap-3 sm:grid-cols-2"><button className="rounded-full bg-[#0b1d17] px-6 py-4 text-sm font-bold text-white">Recevoir mon devis</button><Link href="/offres" className="rounded-full border border-black/10 px-6 py-4 text-center text-sm font-bold">Comparer les packs</Link></div>
        </section>
        <aside className="rounded-[30px] bg-[#0b1d17] p-6 text-white sm:p-8">
          <p className="text-xs font-bold uppercase tracking-[.14em] text-[#b8ff3d]">Prochaine étape</p><h2 className="mt-4 text-2xl font-semibold">Planifier la visite technique</h2><p className="mt-3 text-sm leading-6 text-white/50">Choisissez un créneau indicatif. Un conseiller confirmera les détails avec vous.</p>
          <div className="mt-7 grid gap-3">{['Mardi · 10h–12h', 'Mercredi · 14h–16h', 'Samedi · 09h–11h'].map((date, i) => <button key={date} className={`flex items-center justify-between rounded-2xl border p-4 text-left text-sm ${i === 0 ? 'border-[#b8ff3d] bg-[#b8ff3d]/10' : 'border-white/10'}`}><span>{date}</span><span className={`size-4 rounded-full border ${i === 0 ? 'border-4 border-[#b8ff3d]' : 'border-white/30'}`} /></button>)}</div>
          <button className="mt-6 w-full rounded-full bg-[#b8ff3d] px-6 py-4 text-sm font-bold text-[#07120f]">Confirmer ce créneau</button>
          <p className="mt-5 text-center text-xs text-white/35">Paiement Mobile Money ou carte après validation du devis.</p>
        </aside>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_310px]">
      <section className="rounded-[30px] bg-white p-6 shadow-sm sm:p-9">
        <div className="mb-9"><div className="flex items-center justify-between text-xs font-semibold"><span>Étape {step} sur 4</span><span className="text-black/35">Environ 2 minutes</span></div><div className="mt-3 h-1 overflow-hidden rounded-full bg-black/8"><div className="h-full rounded-full bg-[#77a81d] transition-all" style={{ width: `${progress}%` }} /></div></div>
        {step === 1 && <div><p className="text-xs font-bold uppercase tracking-[.14em] text-[#669516]">Votre espace</p><h1 className="mt-3 text-3xl font-semibold tracking-[-.035em] sm:text-4xl">Que souhaitez-vous protéger ?</h1><p className="mt-3 text-sm text-black/45">Cela nous aide à dimensionner le système.</p><div className="mt-8 grid gap-3 sm:grid-cols-2">{['Appartement', 'Villa', 'Commerce / bureau', 'Résidence / quartier'].map((item) => <button key={item} onClick={() => setType(item)} className={`rounded-2xl border p-5 text-left transition ${type === item ? 'border-[#78a91e] bg-[#b8ff3d]/15' : 'border-black/10 hover:border-black/25'}`}><span className="text-2xl">{item === 'Appartement' ? '▤' : item === 'Villa' ? '⌂' : item === 'Commerce / bureau' ? '▦' : '◇'}</span><p className="mt-5 font-semibold">{item}</p></button>)}</div><label className="mt-6 block text-sm font-semibold">Commune ou quartier<input className="mt-2 w-full rounded-2xl border border-black/10 bg-[#f7f9f7] px-4 py-3.5 font-normal outline-none focus:border-[#78a91e]" placeholder="Ex. Cocody, Marcory, Bingerville…" /></label></div>}
        {step === 2 && <div><p className="text-xs font-bold uppercase tracking-[.14em] text-[#669516]">Vos priorités</p><h1 className="mt-3 text-3xl font-semibold tracking-[-.035em] sm:text-4xl">Qu’est-ce qui compte le plus ?</h1><p className="mt-3 text-sm text-black/45">Sélectionnez une ou plusieurs réponses.</p><div className="mt-8 grid gap-3 sm:grid-cols-2">{needOptions.map(([id, title, desc]) => { const active = needs.includes(id); return <button key={id} onClick={() => toggle(id)} className={`flex items-start gap-4 rounded-2xl border p-4 text-left transition ${active ? 'border-[#78a91e] bg-[#b8ff3d]/15' : 'border-black/10 hover:border-black/25'}`}><span className={`mt-0.5 grid size-6 shrink-0 place-items-center rounded-full border text-xs ${active ? 'border-[#78a91e] bg-[#b8ff3d]' : 'border-black/15'}`}>{active ? '✓' : ''}</span><span><strong className="text-sm">{title}</strong><span className="mt-1 block text-xs leading-5 text-black/40">{desc}</span></span></button>})}</div></div>}
        {step === 3 && <div><p className="text-xs font-bold uppercase tracking-[.14em] text-[#669516]">Votre situation</p><h1 className="mt-3 text-3xl font-semibold tracking-[-.035em] sm:text-4xl">Quelques détails utiles.</h1><div className="mt-8 grid gap-5 sm:grid-cols-2"><label className="text-sm font-semibold">Nombre d’accès<select className="mt-2 w-full rounded-2xl border border-black/10 bg-[#f7f9f7] px-4 py-3.5 font-normal outline-none"><option>1 à 2 accès</option><option>3 à 5 accès</option><option>Plus de 5 accès</option></select></label><label className="text-sm font-semibold">Surface approximative<select className="mt-2 w-full rounded-2xl border border-black/10 bg-[#f7f9f7] px-4 py-3.5 font-normal outline-none"><option>Moins de 100 m²</option><option>100 à 250 m²</option><option>Plus de 250 m²</option></select></label><label className="text-sm font-semibold">Occupation<select className="mt-2 w-full rounded-2xl border border-black/10 bg-[#f7f9f7] px-4 py-3.5 font-normal outline-none"><option>Résidence principale</option><option>Résidence secondaire</option><option>Location</option><option>Professionnel</option></select></label><label className="text-sm font-semibold">Système existant<select className="mt-2 w-full rounded-2xl border border-black/10 bg-[#f7f9f7] px-4 py-3.5 font-normal outline-none"><option>Aucun</option><option>Caméras uniquement</option><option>Alarme existante</option><option>Je ne sais pas</option></select></label></div></div>}
        {step === 4 && <div><p className="text-xs font-bold uppercase tracking-[.14em] text-[#669516]">Vos coordonnées</p><h1 className="mt-3 text-3xl font-semibold tracking-[-.035em] sm:text-4xl">Où envoyer votre recommandation ?</h1><p className="mt-3 text-sm text-black/45">Vos informations servent uniquement à préparer votre projet SafeR.</p><div className="mt-8 grid gap-5 sm:grid-cols-2"><label className="text-sm font-semibold">Prénom et nom<input required className="mt-2 w-full rounded-2xl border border-black/10 bg-[#f7f9f7] px-4 py-3.5 font-normal outline-none focus:border-[#78a91e]" placeholder="Votre nom" /></label><label className="text-sm font-semibold">Téléphone<input required className="mt-2 w-full rounded-2xl border border-black/10 bg-[#f7f9f7] px-4 py-3.5 font-normal outline-none focus:border-[#78a91e]" placeholder="+225 00 00 00 00 00" /></label><label className="text-sm font-semibold sm:col-span-2">E-mail<input required type="email" className="mt-2 w-full rounded-2xl border border-black/10 bg-[#f7f9f7] px-4 py-3.5 font-normal outline-none focus:border-[#78a91e]" placeholder="vous@exemple.ci" /></label></div><label className="mt-6 flex items-start gap-3 text-xs leading-5 text-black/45"><input type="checkbox" defaultChecked className="mt-1 accent-[#78a91e]" />J’accepte d’être contacté(e) au sujet de mon projet et de recevoir mon diagnostic personnalisé.</label></div>}
        <div className="mt-10 flex items-center justify-between border-t border-black/8 pt-6"><button onClick={() => setStep(Math.max(1, step - 1))} className={`text-sm font-semibold ${step === 1 ? 'invisible' : ''}`}>← Retour</button><button onClick={() => step < 4 ? setStep(step + 1) : setSubmitted(true)} className="rounded-full bg-[#0b1d17] px-7 py-3.5 text-sm font-bold text-white">{step === 4 ? 'Voir ma recommandation' : 'Continuer →'}</button></div>
      </section>
      <aside className="h-fit rounded-[28px] bg-[#0b1d17] p-6 text-white lg:sticky lg:top-6"><p className="text-xs font-bold uppercase tracking-[.14em] text-[#b8ff3d]">Diagnostic SafeR</p><h2 className="mt-4 text-xl font-semibold">Gratuit, rapide et sans engagement.</h2><ul className="mt-6 space-y-4 text-sm text-white/60"><li className="flex gap-3"><span className="text-[#b8ff3d]">✓</span>Recommandation adaptée</li><li className="flex gap-3"><span className="text-[#b8ff3d]">✓</span>Budget estimatif clair</li><li className="flex gap-3"><span className="text-[#b8ff3d]">✓</span>Créneau de visite en ligne</li><li className="flex gap-3"><span className="text-[#b8ff3d]">✓</span>Conseiller basé en Côte d’Ivoire</li></ul><div className="mt-8 border-t border-white/10 pt-6"><p className="text-xs text-white/35">Besoin d’aide ?</p><p className="mt-1 text-sm font-semibold">+225 00 00 00 00 00</p></div></aside>
    </div>
  );
}
