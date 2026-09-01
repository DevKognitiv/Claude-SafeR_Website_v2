'use client';

import Link from '@/components/Link';
import { useState } from 'react';
import SitePreferences from '@/components/SitePreferences';
import { useDictionary } from '@/lib/i18n/client';

export default function SiteHeader({ dark = true }: { dark?: boolean }) {
  const d = useDictionary();
  const [open, setOpen] = useState(false);
  const links: [string, string][] = [
    [d.nav.solutions, '/solutions'],
    [d.nav.store, '/store'],
    [d.nav.offers, '/offres'],
    [d.nav.collective, '/quartiers'],
    [d.nav.partners, '/partenaires'],
    [d.nav.support, '/support'],
  ];

  return (
    <header data-surface={dark ? 'dark' : 'light'} className={`site-header relative z-50 ${dark ? 'text-white' : 'text-black'}`}>
      <nav className="mx-auto flex h-24 max-w-7xl items-center justify-between px-5 lg:px-8" aria-label={d.nav.mainNav}>
        <Link href="/" className="inline-flex min-w-[150px] items-center py-3" aria-label={d.nav.logoHome}>
          {dark ? <img src="/brand/safer-logo-dark-bg.png" alt="SafeR" width="178" height="60" className="h-auto w-[150px] object-contain sm:w-[178px]" /> : <>
            <img src="/brand/safer-logo.png" alt="SafeR" width="178" height="60" className="site-logo-on-light h-auto w-[150px] object-contain sm:w-[178px]" />
            <img src="/brand/safer-logo-dark-bg.png" alt="SafeR" width="178" height="60" className="site-logo-on-dark hidden h-auto w-[150px] object-contain sm:w-[178px]" />
          </>}
        </Link>
        <div className={`hidden items-center gap-3 text-[11px] xl:flex 2xl:gap-4 2xl:text-xs ${dark ? 'text-white/75' : 'text-[#0a1814]/70'}`}>
          {links.map(([label, href]) => <Link key={href} href={href} className="transition hover:text-[#52c6ff]">{label}</Link>)}
        </div>
        <div className="hidden items-center gap-2 lg:flex">
          <SitePreferences />
          <Link href="/espace-client" className={`px-3 py-2 text-sm font-semibold ${dark ? 'text-white/75 hover:text-white' : 'text-[#0a1814]/65 hover:text-[#0a1814]'}`}>{d.nav.client}</Link>
          <Link href="/diagnostic" className={`rounded-full px-5 py-2.5 text-sm font-bold transition ${dark ? 'bg-[#4556f5] text-white hover:bg-[#52c6ff] hover:text-black' : 'bg-[#4556f5] text-white hover:bg-black'}`}>{d.nav.diagnostic}</Link>
        </div>
        <button type="button" onClick={() => setOpen(!open)} className={`grid size-11 place-items-center rounded-full border lg:hidden ${dark ? 'border-white/15 bg-white/8' : 'border-black/10 bg-black/5'}`} aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? d.nav.closeMenu : d.nav.openMenu}>
          <span className="text-xl" aria-hidden="true">{open ? '×' : '≡'}</span>
        </button>
      </nav>
      {open && (
        <div id="mobile-menu" className={`absolute left-4 right-4 top-[88px] rounded-3xl border p-5 shadow-2xl lg:hidden ${dark ? 'border-white/12 bg-black' : 'border-black/8 bg-white'}`}>
          <div className="flex flex-col gap-1">
            {links.map(([label, href]) => <Link key={href} href={href} onClick={() => setOpen(false)} className="rounded-xl px-4 py-3 text-base">{label}</Link>)}
            <Link href="/espace-client" onClick={() => setOpen(false)} className="rounded-xl px-4 py-3 text-base">{d.nav.client}</Link>
            <div className="my-3 border-t border-current/10 pt-4"><SitePreferences compact /></div>
            <Link href="/diagnostic" onClick={() => setOpen(false)} className="mt-2 rounded-full bg-[#4556f5] px-5 py-3 text-center font-bold text-white">{d.nav.diagnostic}</Link>
          </div>
        </div>
      )}
    </header>
  );
}
