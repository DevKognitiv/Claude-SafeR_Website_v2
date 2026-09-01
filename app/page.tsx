import Link from 'next/link';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import ProductShowcase from '@/components/ProductShowcase';

const solutions = [
  { n: '01', icon: '◉', title: 'Vidéo intelligente', text: 'Caméras HD, vision nocturne et analyse assistée pour distinguer l’essentiel du bruit.', tag: 'Voir avant d’agir', href: '/solutions/video-intelligente' },
  { n: '02', icon: '⌁', title: 'Alarme connectée', text: 'Détection intrusion, fumée et fuite d’eau, reliée à notre centre de veille 24/7.', tag: 'Alerte en temps réel', href: '/solutions/alarmes-connectees' },
  { n: '03', icon: '↗', title: 'Contrôle d’accès', text: 'Portails, serrures et accès visiteurs pilotés simplement depuis votre téléphone.', tag: 'Entrées maîtrisées', href: '/solutions/controle-acces' },
  { n: '04', icon: '✦', title: 'Maison intelligente', text: 'Éclairage, climatisation et scénarios automatisés pour plus de confort et de maîtrise.', tag: 'Confort automatisé', href: '/solutions/domotique' },
];

const journey = [
  ['01', 'Diagnostic', '6 questions, 2 minutes. Votre besoin est qualifié en ligne.'],
  ['02', 'Configuration', 'Votre pack et vos options s’ajustent à votre espace.'],
  ['03', 'Devis & paiement', 'Validez votre devis et réglez en ligne, en toute sécurité.'],
  ['04', 'Installation', 'Choisissez un créneau et suivez votre technicien en direct.'],
  ['05', 'Protection 24/7', 'Pilotez vos équipements et recevez les alertes utiles.'],
  ['06', 'Évolution', 'Maintenance, renouvellement et options depuis votre espace.'],
];

const packs = [
  { name: 'SafeR Essentiel', price: '19 900', desc: 'La base solide pour appartement ou petite maison.', items: ['Centrale SafeR', '2 détecteurs d’ouverture', '1 détecteur de mouvement', 'Application mobile', 'Veille 24/7'], featured: false },
  { name: 'SafeR Sérénité', price: '34 900', desc: 'La protection complète, pensée pour les familles.', items: ['Tout Essentiel', '2 caméras intelligentes', 'Détecteur fumée', 'Bouton SOS', 'Intervention prioritaire'], featured: true },
  { name: 'SafeR Signature', price: 'Sur mesure', desc: 'Sécurité, accès et domotique sans compromis.', items: ['Tout Sérénité', 'Vidéosurveillance étendue', 'Contrôle d’accès', 'Scénarios domotiques', 'Maintenance premium'], featured: false },
];

export default function Home() {
  return (
    <main className="theme-page overflow-hidden bg-[#f1f4f1] text-[#0a1814]">
      <section className="relative min-h-screen overflow-hidden bg-black text-white">
        <video
          className="absolute inset-0 h-full w-full object-cover opacity-55"
          autoPlay
          muted
          loop
          playsInline
          poster="/media/safer-abidjan-showroom-v1.png"
          aria-hidden="true"
        >
          <source src="https://videos.pexels.com/video-files/5744424/5744424-hd_1280_720_30fps.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#000_0%,rgba(0,0,0,.88)_38%,rgba(0,0,0,.18)_100%)]" />
        <div className="brand-grid absolute inset-0 opacity-30" />
        <div className="brand-cut absolute -bottom-16 -right-20 h-48 w-[70%] bg-[#4556f5]/85" />
        <SiteHeader />
        <div className="relative mx-auto grid min-h-[calc(100vh-96px)] max-w-7xl items-center gap-12 px-5 pb-24 pt-10 lg:grid-cols-[1.04fr_.96fr] lg:px-8 lg:pb-28">
          <div className="absolute -left-52 top-8 size-[520px] rounded-full bg-[#4556f5]/30 blur-[110px]" />
          <div className="relative z-10 max-w-3xl">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#52c6ff]/30 bg-[#4556f5]/20 px-3.5 py-2 text-xs font-semibold uppercase tracking-[.16em] text-[#bcecff] backdrop-blur-md">
              <span className="size-1.5 animate-pulse rounded-full bg-[#52c6ff]" /><span data-i18n="home.badge">Centre de veille 24h/24 · Abidjan</span>
            </div>
            <h1 className="max-w-3xl text-5xl font-light leading-[.98] tracking-[-.05em] sm:text-6xl lg:text-[78px]"><span data-i18n="home.title1">Votre monde.</span><br /><span data-i18n="home.title2" className="font-semibold text-[#52c6ff]">Sous haute intelligence.</span></h1>
            <p data-i18n="home.description" className="mt-7 max-w-xl text-lg leading-8 text-white/62">Protégez, pilotez et simplifiez votre maison depuis une seule plateforme. SafeR veille, anticipe et intervient — même quand vous n’êtes pas là.</p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/diagnostic" data-i18n="home.configure" className="rounded-full bg-[#4556f5] px-7 py-4 text-center text-sm font-bold text-white shadow-[0_18px_50px_rgba(69,86,245,.35)] transition hover:-translate-y-0.5 hover:bg-[#52c6ff] hover:text-black">Configurer ma sécurité</Link>
              <a href="#parcours" data-i18n="home.how" className="rounded-full border border-white/15 px-7 py-4 text-center text-sm font-semibold text-white transition hover:bg-white/8">Voir comment ça marche</a>
            </div>
            <div className="mt-11 grid max-w-xl grid-cols-3 gap-4 border-t border-white/10 pt-6">
              <div><p className="text-xl font-semibold">&lt; 60 sec</p><p className="mt-1 text-xs text-white/45">Alerte vérifiée</p></div>
              <div><p className="text-xl font-semibold">24/7</p><p className="mt-1 text-xs text-white/45">Veille humaine</p></div>
              <div><p className="text-xl font-semibold">100%</p><p className="mt-1 text-xs text-white/45">Parcours digital</p></div>
            </div>
          </div>
          <div className="relative z-10 mx-auto w-full max-w-[570px] lg:ml-auto">
            <div className="absolute inset-10 rounded-full bg-[#b8ff3d]/15 blur-[85px]" />
            <div className="relative rotate-[1.5deg] rounded-[34px] border border-white/15 bg-[#10221d]/80 p-3 shadow-[0_45px_120px_rgba(0,0,0,.5)] backdrop-blur-xl">
              <div className="rounded-[27px] border border-white/8 bg-[#eaf0ec] p-4 text-[#0c1915] sm:p-6">
                <div className="mb-6 flex items-center justify-between"><div><p className="text-xs text-black/45">Bonsoir, Aïcha</p><p className="mt-1 font-semibold">Tout est sous contrôle.</p></div><span className="grid size-10 place-items-center rounded-full bg-white text-sm shadow-sm">AK</span></div>
                <div className="relative overflow-hidden rounded-[24px] bg-[#0b1d17] p-5 text-white sm:p-6">
                  <div className="absolute -right-12 -top-12 size-40 rounded-full bg-[#b8ff3d]/20 blur-2xl" />
                  <div className="relative flex items-start justify-between"><div><p className="text-xs text-white/50">Domicile · Cocody</p><p className="mt-2 text-xl font-semibold">Maison protégée</p></div><span className="grid size-12 place-items-center rounded-full bg-[#b8ff3d] text-xl text-[#07120f]">✓</span></div>
                  <div className="relative mt-8 grid grid-cols-3 gap-2"><div className="rounded-2xl bg-white/8 p-3"><p className="text-lg">04</p><p className="text-[10px] text-white/45">Accès fermés</p></div><div className="rounded-2xl bg-white/8 p-3"><p className="text-lg">07</p><p className="text-[10px] text-white/45">Caméras actives</p></div><div className="rounded-2xl bg-white/8 p-3"><p className="text-lg">22°</p><p className="text-[10px] text-white/45">Climat idéal</p></div></div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3"><div className="rounded-2xl bg-white p-4 shadow-sm"><p className="text-2xl">◉</p><p className="mt-4 text-xs text-black/45">Entrée principale</p><p className="mt-1 text-sm font-semibold">Flux en direct</p></div><div className="rounded-2xl bg-[#b8ff3d] p-4"><p className="text-2xl">⌁</p><p className="mt-4 text-xs text-black/45">Scène maison</p><p className="mt-1 text-sm font-semibold">Mode soirée</p></div></div>
              </div>
            </div>
            <div className="absolute -bottom-6 -left-4 rounded-2xl border border-white/12 bg-[#132a23]/90 p-4 shadow-2xl backdrop-blur-xl sm:-left-10"><div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-full bg-[#b8ff3d] text-[#07120f]">✓</span><div><p className="text-xs text-white/45">Patrouille SafeR</p><p className="text-sm font-semibold">Disponible à proximité</p></div></div></div>
          </div>
        </div>
      </section>

      <section className="border-b border-black/8 bg-white px-5 py-5 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-10 gap-y-3 text-xs font-semibold uppercase tracking-[.14em] text-black/35 sm:justify-between"><span>Intrusion</span><span>Vidéo IA</span><span>Incendie</span><span>Contrôle d’accès</span><span>Domotique</span><span>Intervention 24/7</span></div>
      </section>

      <section className="bg-black px-5 py-20 text-white lg:px-8 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[1.12fr_.88fr]">
          <div className="media-grade relative min-h-[520px] overflow-hidden rounded-[36px]">
            <img src="/media/safer-abidjan-showroom-v1.png" alt="Une famille ivoirienne réunie dans une maison intelligente SafeR à Abidjan" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-x-0 bottom-0 z-10 p-7 sm:p-10">
              <p className="text-xs font-bold uppercase tracking-[.16em] text-[#bcecff]">La technologie qui s’efface</p>
              <h2 className="mt-4 max-w-2xl text-4xl font-light leading-[1.02] tracking-[-.04em] sm:text-5xl">Plus de présence.<br /><span className="font-semibold">Moins d’inquiétude.</span></h2>
            </div>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
            <div className="relative min-h-[248px] overflow-hidden rounded-[30px] bg-[#4556f5] p-7">
              <img src="https://images.pexels.com/videos/25951436/adjust-automation-bedroom-button-25951436.jpeg?auto=compress&dpr=1&h=750&w=1260" alt="Pilotage d’une maison intelligente" className="absolute inset-0 h-full w-full object-cover opacity-45 mix-blend-multiply" />
              <div className="relative z-10 flex h-full flex-col justify-between"><span className="text-xs font-bold uppercase tracking-[.16em] text-white/65">Smart home</span><p className="max-w-sm text-2xl font-semibold">Un geste suffit pour adapter votre maison.</p></div>
            </div>
            <div className="relative min-h-[248px] overflow-hidden rounded-[30px] bg-[#52c6ff] p-7 text-black">
              <div aria-hidden="true" className="brand-grid absolute inset-0 opacity-45" /><div aria-hidden="true" className="absolute -right-16 -top-16 size-64 rounded-full border-[34px] border-black/10" />
              <div className="relative z-10 flex h-full flex-col justify-between"><span className="text-xs font-bold uppercase tracking-[.16em] text-black/50">Signal actif 24/7</span><div><p className="text-4xl font-light">&lt; 60 sec</p><p className="mt-2 max-w-xs text-sm leading-6 text-black/60">pour qualifier une alerte et déclencher le bon protocole.</p></div></div>
            </div>
          </div>
        </div>
      </section>

      <ProductShowcase />

      <section id="solutions" className="px-5 py-24 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-end"><div><p className="eyebrow">Un écosystème. Zéro angle mort.</p><h2 className="section-title mt-5">Tout ce qui compte,<br />connecté et protégé.</h2></div><p className="max-w-lg text-base leading-7 text-black/55 lg:ml-auto">Des équipements choisis pour le contexte ivoirien, une plateforme claire et une équipe qui veille vraiment. SafeR transforme des dispositifs isolés en une protection cohérente.</p></div>
          <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {solutions.map((item, i) => <Link href={item.href} key={item.title} className={`group flex min-h-[330px] flex-col rounded-[28px] border p-6 transition duration-300 hover:-translate-y-1 ${i === 1 ? 'border-transparent bg-[#b8ff3d]' : 'border-black/8 bg-white hover:border-black/15'}`}><div className="flex items-center justify-between text-sm text-black/35"><span>{item.n}</span><span className="grid size-11 place-items-center rounded-full border border-black/10 text-xl transition group-hover:translate-x-1">{item.icon}</span></div><div className="mt-auto"><p className="mb-5 text-xs font-bold uppercase tracking-[.12em] text-black/35">{item.tag}</p><h3 className="text-2xl font-semibold tracking-tight">{item.title}</h3><p className="mt-3 text-sm leading-6 text-black/55">{item.text}</p></div></Link>)}
          </div>
        </div>
      </section>

      <section className="px-5 pb-24 lg:px-8 lg:pb-32">
        <div className="mx-auto overflow-hidden rounded-[34px] bg-[#b8ff3d] px-6 py-14 sm:px-12 lg:px-16 lg:py-20">
          <div className="grid max-w-7xl gap-10 lg:grid-cols-[1.15fr_.85fr] lg:items-center">
            <div><p className="text-xs font-bold uppercase tracking-[.16em] text-black/45">Notre promesse</p><h2 className="mt-6 max-w-4xl text-4xl font-semibold leading-[1.03] tracking-[-.045em] sm:text-5xl lg:text-6xl">La technologie détecte.<br />L’humain décide. SafeR agit.</h2></div>
            <div className="rounded-[26px] bg-[#07120f] p-6 text-white lg:p-8"><div className="mb-8 flex items-center gap-3"><span className="relative grid size-12 place-items-center rounded-full bg-[#b8ff3d] text-xl text-[#07120f]">✓</span><div><p className="font-semibold">Centre de veille SafeR</p><p className="text-xs text-white/45">Opérationnel 24h/24 et 7j/7</p></div></div><div className="space-y-4 text-sm"><div className="flex justify-between border-b border-white/10 pb-4"><span className="text-white/50">Détection</span><span>Instantanée</span></div><div className="flex justify-between border-b border-white/10 pb-4"><span className="text-white/50">Vérification</span><span>Humaine + vidéo</span></div><div className="flex justify-between"><span className="text-white/50">Escalade</span><span>Contact & intervention</span></div></div></div>
          </div>
        </div>
      </section>

      <section id="parcours" className="bg-white px-5 py-24 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl"><p className="eyebrow">Du premier clic à votre tranquillité</p><h2 className="section-title mt-5">Un parcours fluide.<br />De bout en bout.</h2><p className="mt-6 max-w-xl leading-7 text-black/55">Découvrez, choisissez, payez, planifiez et pilotez votre sécurité sans papier ni attente inutile.</p></div>
          <div className="mt-16 grid border-l border-t border-black/10 sm:grid-cols-2 lg:grid-cols-3">
            {journey.map(([n, title, text]) => <div key={n} className="group min-h-[230px] border-b border-r border-black/10 p-6 lg:p-8"><span className="text-sm font-semibold text-[#659413]">{n}</span><h3 className="mt-12 text-2xl font-semibold tracking-tight">{title}</h3><p className="mt-3 max-w-sm text-sm leading-6 text-black/50">{text}</p></div>)}
          </div>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><p className="text-sm text-black/45">Votre diagnostic est gratuit et sans engagement.</p><Link href="/diagnostic" className="rounded-full bg-[#0b1d17] px-7 py-4 text-center text-sm font-bold text-white transition hover:bg-[#17352b]">Commencer maintenant →</Link></div>
        </div>
      </section>

      <section className="bg-[#0b1d17] px-5 py-24 text-white lg:px-8 lg:py-32">
        <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
          <div><p className="eyebrow text-[#b8ff3d]">L’application SafeR</p><h2 className="section-title mt-5">Votre sécurité.<br />Dans votre poche.</h2><p className="mt-6 max-w-lg leading-7 text-white/55">Armez votre système, ouvrez un portail, vérifiez une caméra ou demandez de l’aide. Un seul écran, où que vous soyez.</p><div className="mt-8 grid max-w-md grid-cols-2 gap-3 text-sm"><div className="rounded-2xl border border-white/10 p-4"><span className="text-[#b8ff3d]">●</span><p className="mt-3 font-semibold">Alertes utiles</p><p className="mt-1 text-xs text-white/40">Qualifiées en temps réel</p></div><div className="rounded-2xl border border-white/10 p-4"><span className="text-[#b8ff3d]">↗</span><p className="mt-3 font-semibold">Actions distantes</p><p className="mt-1 text-xs text-white/40">Accès et scénarios</p></div></div><Link href="/espace-client" className="mt-8 inline-flex rounded-full bg-[#b8ff3d] px-6 py-3.5 text-sm font-bold text-[#07120f]">Explorer l’espace client</Link></div>
          <div className="relative mx-auto w-full max-w-xl rounded-[34px] border border-white/12 bg-white/6 p-4 shadow-[0_40px_100px_rgba(0,0,0,.35)]"><div className="rounded-[27px] bg-[#e9efe9] p-5 text-[#0b1d17]"><div className="flex items-center justify-between"><div><p className="text-xs text-black/40">Tableau de bord</p><p className="font-semibold">Résidence Riviera 3</p></div><span className="rounded-full bg-[#b8ff3d] px-3 py-1.5 text-xs font-bold">PROTÉGÉE</span></div><div className="mt-5 grid gap-3 sm:grid-cols-2"><div className="min-h-52 rounded-3xl bg-[#07120f] p-5 text-white"><div className="flex justify-between"><span className="text-xs text-white/45">Caméra entrée</span><span className="size-2 rounded-full bg-[#b8ff3d]" /></div><div className="grid h-28 place-items-center text-4xl text-white/25">◉</div><p className="text-sm font-semibold">Aucun mouvement inhabituel</p></div><div className="grid gap-3"><div className="rounded-2xl bg-white p-4"><p className="text-xs text-black/40">Portail</p><div className="mt-5 flex items-end justify-between"><p className="font-semibold">Fermé</p><span className="grid size-9 place-items-center rounded-full bg-[#b8ff3d]">✓</span></div></div><div className="rounded-2xl bg-[#b8ff3d] p-4"><p className="text-xs text-black/40">Scène active</p><p className="mt-5 font-semibold">Absence sereine</p></div></div></div></div></div>
        </div>
      </section>

      <section id="packs" className="px-5 py-24 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-7xl"><div className="text-center"><p className="eyebrow">Des offres lisibles, évolutives</p><h2 className="section-title mt-5">La bonne protection.<br />Au bon niveau.</h2><p className="mx-auto mt-6 max-w-xl text-sm leading-6 text-black/50">Prix indicatifs à personnaliser après diagnostic. Installation et équipements selon configuration.</p></div>
          <div className="mt-14 grid gap-5 lg:grid-cols-3">{packs.map(pack => <article key={pack.name} className={`relative rounded-[30px] p-7 ${pack.featured ? 'bg-[#0b1d17] text-white shadow-2xl lg:-translate-y-4' : 'border border-black/8 bg-white'}`}>{pack.featured && <span className="absolute right-6 top-6 rounded-full bg-[#b8ff3d] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#07120f]">Le plus choisi</span>}<p className={`text-xs font-bold uppercase tracking-[.12em] ${pack.featured ? 'text-[#b8ff3d]' : 'text-black/35'}`}>Maison & appartement</p><h3 className="mt-5 text-2xl font-semibold">{pack.name}</h3><p className={`mt-2 min-h-12 text-sm leading-6 ${pack.featured ? 'text-white/50' : 'text-black/50'}`}>{pack.desc}</p><div className="my-7 border-y border-current/10 py-6"><span className="text-3xl font-semibold">{pack.price}</span>{pack.price !== 'Sur mesure' && <><span className="ml-1 text-sm">FCFA</span><p className={`mt-1 text-xs ${pack.featured ? 'text-white/40' : 'text-black/40'}`}>/ mois, hors installation</p></>}</div><ul className="space-y-3 text-sm">{pack.items.map(item => <li key={item} className="flex gap-3"><span className="text-[#75a919]">✓</span><span className={pack.featured ? 'text-white/70' : 'text-black/65'}>{item}</span></li>)}</ul><Link href={`/diagnostic?pack=${encodeURIComponent(pack.name)}`} className={`mt-8 block rounded-full px-6 py-3.5 text-center text-sm font-bold ${pack.featured ? 'bg-[#b8ff3d] text-[#07120f]' : 'bg-[#0b1d17] text-white'}`}>Choisir ce pack</Link></article>)}</div>
          <div className="mt-8 text-center"><Link href="/offres" className="text-sm font-semibold underline decoration-[#79aa21] decoration-2 underline-offset-4">Voir le comparatif complet et toutes les options</Link></div>
        </div>
      </section>

      <section className="px-5 pb-24 lg:px-8 lg:pb-32">
        <div className="mx-auto overflow-hidden rounded-[36px] bg-[#cfe7df] p-7 sm:p-10 lg:p-16"><div className="grid gap-12 lg:grid-cols-[.9fr_1.1fr] lg:items-center"><div><p className="eyebrow">Au-delà de votre portail</p><h2 className="section-title mt-5">Un quartier plus sûr.<br />Une ville plus fluide.</h2><p className="mt-6 max-w-lg leading-7 text-black/55">SafeR relie postes de garde, accès visiteurs, caméras, alertes communautaires et supervision urbaine dans une architecture évolutive.</p><Link href="/quartiers" className="mt-8 inline-flex rounded-full bg-[#0b1d17] px-6 py-3.5 text-sm font-bold text-white">Découvrir SafeR Collective</Link></div><div className="relative min-h-[380px] overflow-hidden rounded-[30px] bg-[#0b1d17] p-6 text-white"><div className="absolute inset-0 opacity-35 [background-image:linear-gradient(rgba(184,255,61,.12)_1px,transparent_1px),linear-gradient(90deg,rgba(184,255,61,.12)_1px,transparent_1px)] [background-size:38px_38px]" /><div className="relative"><div className="flex justify-between"><div><p className="text-xs text-white/40">Zone connectée</p><p className="mt-1 text-lg font-semibold">Résidence Les Palmiers</p></div><span className="rounded-full bg-[#b8ff3d] px-3 py-1.5 text-xs font-bold text-[#07120f]">NIVEAU OPTIMAL</span></div><div className="mt-16 grid grid-cols-2 gap-3 sm:grid-cols-3"><div className="rounded-2xl border border-white/10 bg-white/7 p-4"><p className="text-2xl font-semibold">12</p><p className="mt-1 text-xs text-white/40">Accès connectés</p></div><div className="rounded-2xl border border-white/10 bg-white/7 p-4"><p className="text-2xl font-semibold">28</p><p className="mt-1 text-xs text-white/40">Caméras actives</p></div><div className="rounded-2xl border border-white/10 bg-white/7 p-4"><p className="text-2xl font-semibold">02</p><p className="mt-1 text-xs text-white/40">Patrouilles</p></div></div><div className="mt-4 rounded-2xl bg-[#b8ff3d] p-4 text-[#07120f]"><div className="flex items-center justify-between"><div><p className="text-xs text-black/45">Dernier événement</p><p className="mt-1 text-sm font-semibold">Visiteur autorisé · Portail Est</p></div><span className="text-xl">→</span></div></div></div></div></div></div>
      </section>

      <section className="bg-white px-5 py-24 lg:px-8 lg:py-32"><div className="mx-auto max-w-7xl"><div className="grid gap-12 lg:grid-cols-[.75fr_1.25fr]"><div><p className="eyebrow">Ils vivent plus sereinement</p><h2 className="section-title mt-5">La tranquillité se raconte.</h2><p className="mt-5 text-sm leading-6 text-black/45">Témoignages de démonstration à remplacer par des avis clients vérifiés avant lancement.</p></div><div className="grid gap-4 sm:grid-cols-2"><blockquote className="rounded-[28px] bg-[#f1f4f1] p-7"><p className="text-2xl leading-9 tracking-tight">“Je vois qui arrive, je contrôle le portail et je sais que quelqu’un veille en cas de besoin.”</p><footer className="mt-8 text-sm"><strong>Famille K.</strong><span className="ml-2 text-black/40">Cocody · placeholder</span></footer></blockquote><blockquote className="rounded-[28px] bg-[#b8ff3d] p-7"><p className="text-2xl leading-9 tracking-tight">“Le suivi d’installation et les alertes sont simples. Tout se fait depuis le téléphone.”</p><footer className="mt-8 text-sm"><strong>M. Yao A.</strong><span className="ml-2 text-black/40">Marcory · placeholder</span></footer></blockquote></div></div></div></section>

      <section className="px-5 py-24 lg:px-8 lg:py-32"><div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[.8fr_1.2fr]"><div><p className="eyebrow">Questions fréquentes</p><h2 className="section-title mt-5">Clair avant<br />de commencer.</h2></div><div className="divide-y divide-black/10 border-t border-black/10">{[
        ['SafeR fonctionne-t-il pendant une coupure d’électricité ?', 'Oui. Selon la configuration, une alimentation de secours et une connectivité redondante maintiennent les fonctions essentielles. Le diagnostic confirme l’autonomie recommandée.'],
        ['Dois-je changer tous mes équipements existants ?', 'Pas forcément. Nos techniciens évaluent les équipements compatibles et proposent une migration progressive lorsque c’est pertinent.'],
        ['Comment se passe une intervention ?', 'Une alerte est d’abord qualifiée. Selon votre protocole, SafeR contacte les personnes désignées et déclenche l’intervention adaptée.'],
        ['Puis-je payer avec Mobile Money ?', 'Oui. Le parcours prévoit Mobile Money, carte bancaire et, selon votre dossier, des modalités échelonnées.'],
        ['Les prix affichés sont-ils définitifs ?', 'Ce sont des bases indicatives. Votre devis final dépend de la surface, des accès, du niveau de couverture et des options retenues.'],
      ].map(([q,a]) => <details key={q} className="group py-6"><summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-semibold"><span>{q}</span><span className="grid size-8 shrink-0 place-items-center rounded-full border border-black/10 group-open:rotate-45">+</span></summary><p className="max-w-2xl pr-10 pt-4 text-sm leading-6 text-black/50">{a}</p></details>)}</div></div></section>

      <section className="relative overflow-hidden bg-[#4556f5] px-5 py-20 text-white lg:px-8 lg:py-24"><div className="brand-grid absolute inset-0 opacity-25" /><div className="brand-cut absolute -bottom-20 right-[-10%] h-40 w-[55%] bg-[#52c6ff]" /><div className="relative mx-auto flex max-w-7xl flex-col gap-8 lg:flex-row lg:items-end lg:justify-between"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-white/55">Votre sérénité commence ici</p><h2 className="mt-5 max-w-4xl text-5xl font-light leading-[1] tracking-[-.05em] sm:text-6xl">Dites-nous ce que<br /><span className="font-semibold">vous voulez protéger.</span></h2></div><div className="flex flex-col gap-3 sm:flex-row"><Link href="/diagnostic" className="rounded-full bg-black px-7 py-4 text-center text-sm font-bold text-white">Faire mon diagnostic</Link><a href="tel:+2250150202020" className="rounded-full border border-white/30 px-7 py-4 text-center text-sm font-bold">Parler à un conseiller</a></div></div></section>
      <SiteFooter />
    </main>
  );
}
