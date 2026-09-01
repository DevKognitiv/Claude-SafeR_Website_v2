'use client';

import { useEffect, useState } from 'react';
import { useI18n } from '@/lib/i18n/client';
import { localeMeta, locales, type Locale } from '@/lib/i18n/config';

type Theme = 'light' | 'dark';

function readTheme(): Theme {
  try {
    const saved = localStorage.getItem('safer-theme');
    if (saved === 'dark' || saved === 'light') return saved;
  } catch { /* storage unavailable */ }
  const current = document.documentElement.dataset.theme;
  if (current === 'dark' || current === 'light') return current;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export default function SitePreferences({ compact = false }: { compact?: boolean }) {
  const { locale, d, setLocale, pending } = useI18n();
  const [theme, setTheme] = useState<Theme>('light');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const initial = readTheme();
    queueMicrotask(() => {
      setTheme(initial);
      setReady(true);
    });
  }, []);

  useEffect(() => {
    if (!ready) return;
    document.documentElement.dataset.theme = theme;
    try { localStorage.setItem('safer-theme', theme); } catch { /* storage unavailable */ }
    document.cookie = `safer-theme=${theme}; path=/; max-age=31536000; samesite=lax`;
  }, [ready, theme]);

  const themeLabel = theme === 'dark' ? d.prefs.light : d.prefs.dark;

  return (
    <div className={`preference-controls flex items-center ${compact ? 'w-full gap-2' : 'gap-2'}`}>
      <label className={`language-control relative ${compact ? 'min-w-0 flex-1' : ''}`}>
        <span className="sr-only">{d.prefs.language}</span>
        <select
          aria-label={d.prefs.language}
          value={locale}
          disabled={pending}
          onChange={(event) => setLocale(event.target.value as Locale)}
          className={`h-10 appearance-none rounded-full border border-current/15 bg-transparent pl-3 pr-8 text-xs font-bold outline-none transition hover:border-[#52c6ff] focus-visible:ring-2 focus-visible:ring-[#52c6ff] disabled:opacity-60 ${compact ? 'w-full' : 'w-[78px]'}`}
        >
          {locales.map((code) => <option key={code} value={code}>{compact ? localeMeta[code].label : localeMeta[code].short}</option>)}
        </select>
        <span aria-hidden="true" className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[9px]">▾</span>
      </label>
      <button
        type="button"
        onClick={() => setTheme((value) => (value === 'dark' ? 'light' : 'dark'))}
        aria-label={themeLabel}
        title={themeLabel}
        className="grid size-10 shrink-0 place-items-center rounded-full border border-current/15 bg-transparent text-sm transition hover:border-[#52c6ff] hover:text-[#52c6ff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#52c6ff]"
      >
        <span aria-hidden="true">{theme === 'dark' ? '☀' : '◐'}</span>
      </button>
    </div>
  );
}
