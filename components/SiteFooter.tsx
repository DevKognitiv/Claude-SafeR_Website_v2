import Link from 'next/link';

export default function SiteFooter() {
  return (
    <footer className="relative overflow-hidden bg-black px-5 pb-8 pt-16 text-white lg:px-8">
      <div className="brand-grid pointer-events-none absolute inset-0 opacity-35" />
      <div className="brand-cut absolute -right-32 top-0 h-2 w-[62%] bg-[#4556f5]" />
      <div className="relative mx-auto grid max-w-7xl gap-12 border-b border-white/10 pb-14 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div>
          <Link href="/" className="inline-flex min-w-[160px] py-3"><img src="/brand/safer-logo-dark-bg.png" alt="SafeR" width="184" height="62" className="h-auto w-[184px] object-contain" /></Link>
          <p data-i18n="footer.brand" className="mt-5 max-w-xs text-sm leading-6 text-white/50">Une marque de RADIANT ASSISTANCE SECURITY. La technologie ivoirienne au service d’une tranquillité sans compromis.</p>
          <a href="tel:+2250150202020" className="mt-5 block text-sm font-semibold text-[#52c6ff]">Assistance 24/7 · +225 01 50 20 20 20</a>
        </div>
        <div><p data-i18n="nav.solutions" className="mb-4 text-xs font-bold uppercase tracking-[.15em] text-white/35">Solutions</p><div className="space-y-3 text-sm text-white/65"><Link className="block hover:text-white" href="/solutions/video-intelligente">Vidéo intelligente</Link><Link className="block hover:text-white" href="/solutions/alarmes-connectees">Alarmes connectées</Link><Link className="block hover:text-white" href="/solutions/controle-acces">Contrôle d’accès</Link><Link className="block hover:text-white" href="/solutions/domotique">Maison intelligente</Link></div></div>
        <div><p className="mb-4 text-xs font-bold uppercase tracking-[.15em] text-white/35">SafeR Collective</p><div className="space-y-3 text-sm text-white/65"><Link className="block hover:text-white" href="/quartiers">Quartier intelligent</Link><Link className="block hover:text-white" href="/quartiers#smart-city">Smart city</Link><Link className="block hover:text-white" href="/support">Support 24/7</Link><Link className="block hover:text-white" href="/support/maintenance">Maintenance</Link></div></div>
        <div><p className="mb-4 text-xs font-bold uppercase tracking-[.15em] text-white/50">SafeR</p><div className="space-y-3 text-sm text-white/70"><Link className="block hover:text-white" href="/a-propos">À propos</Link><Link className="block hover:text-white" href="/store">Store</Link><Link className="block hover:text-white" href="/produits">Showroom</Link><Link className="block hover:text-white" href="/partenaires">Devenir partenaire</Link><Link className="block hover:text-white" href="/espace-client">Espace client</Link></div></div>
      </div>
      <div className="relative mx-auto flex max-w-7xl flex-col gap-3 pt-7 text-xs text-white/35 sm:flex-row sm:items-center sm:justify-between"><p>© 2026 SafeR · RADIANT ASSISTANCE SECURITY</p><p>Plateau, Abidjan · Paiement sécurisé Mobile Money & carte</p></div>
    </footer>
  );
}
