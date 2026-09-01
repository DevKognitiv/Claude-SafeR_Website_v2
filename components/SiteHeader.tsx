'use client';

import Link from 'next/link';
import { useState } from 'react';
import SitePreferences from '@/components/SitePreferences';

const links = [
  ['nav.solutions', 'Solutions', '/solutions'],
  ['nav.store', 'Store', '/store'],
  ['nav.offers', 'Offres', '/offres'],
  ['nav.collective', 'Quartiers & villes', '/quartiers'],
  ['nav.partners', 'Partenaires', '/partenaires'],
  ['nav.support', 'Support', '/support'],
];

export default function SiteHeader({ dark = true }: { dark?: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <header data-surface={dark ? 'dark' : 'light'} className={`site-header relative z-50 ${dark ? 'text-white' : 'text-black'}`}>
      <nav className="mx-auto flex h-24 max-w-7xl items-center justify-between px-5 lg:px-8" aria-label="Navigation principale">
        <Link href="/" className="inline-flex min-w-[150px] items-center py-3" aria-label="SafeR, accueil">
          {dark ? <img src="/brand/safer-logo-dark-bg.png" alt="SafeR" width="178" height="60" className="h-auto w-[150px] object-contain sm:w-[178px]" /> : <>
            <img src="/brand/safer-logo.png" alt="SafeR" width="178" height="60" className="site-logo-on-light h-auto w-[150px] object-contain sm:w-[178px]" />
            <img src="/brand/safer-logo-dark-bg.png" alt="SafeR" width="178" height="60" className="site-logo-on-dark hidden h-auto w-[150px] object-contain sm:w-[178px]" />
          </>}
        </Link>
        <div className={`hidden items-center gap-3 text-[11px] xl:flex 2xl:gap-4 2xl:text-xs ${dark ? 'text-white/75' : 'text-[#0a1814]/70'}`}>
          {links.map(([key, label, href]) => <Link key={key} href={href} data-i18n={key} className="transition hover:text-[#52c6ff]">{label}</Link>)}
        </div>
        <div className="hidden items-center gap-2 lg:flex">
          <SitePreferences />
          <Link href="/espace-client" data-i18n="nav.client" className={`px-3 py-2 text-sm font-semibold ${dark ? 'text-white/75 hover:text-white' : 'text-[#0a1814]/65 hover:text-[#0a1814]'}`}>Espace client</Link>
          <Link href="/diagnostic" data-i18n="nav.diagnostic" className={`rounded-full px-5 py-2.5 text-sm font-bold transition ${dark ? 'bg-[#4556f5] text-white hover:bg-[#52c6ff] hover:text-black' : 'bg-[#4556f5] text-white hover:bg-black'}`}>Diagnostic gratuit</Link>
        </div>
        <button onClick={() => setOpen(!open)} className={`grid size-11 place-items-center rounded-full border lg:hidden ${dark ? 'border-white/15 bg-white/8' : 'border-black/10 bg-black/5'}`} aria-expanded={open} aria-label="Ouvrir le menu">
          <span className="text-xl">{open ? '×' : '≡'}</span>
        </button>
      </nav>
      {open && (
        <div className={`absolute left-4 right-4 top-[88px] rounded-3xl border p-5 shadow-2xl lg:hidden ${dark ? 'border-white/12 bg-black' : 'border-black/8 bg-white'}`}>
          <div className="flex flex-col gap-1">
            {links.map(([key, label, href]) => <Link key={key} href={href} data-i18n={key} onClick={() => setOpen(false)} className="rounded-xl px-4 py-3 text-base">{label}</Link>)}
            <Link href="/espace-client" data-i18n="nav.client" className="rounded-xl px-4 py-3 text-base">Espace client</Link>
            <div className="my-3 border-t border-current/10 pt-4"><SitePreferences compact /></div>
            <Link href="/diagnostic" data-i18n="nav.diagnostic" className="mt-2 rounded-full bg-[#4556f5] px-5 py-3 text-center font-bold text-white">Diagnostic gratuit</Link>
          </div>
        </div>
      )}
    </header>
  );
}
