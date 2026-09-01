'use client';

import { createContext, useCallback, useContext, useMemo, useState, useTransition, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { LOCALE_COOKIE, LOCALE_COOKIE_MAX_AGE, localeMeta, type Locale, type LocaleMeta } from './config';
import type { Dictionary } from './dictionaries';

type I18nContextValue = {
  locale: Locale;
  d: Dictionary;
  meta: LocaleMeta;
  pending: boolean;
  setLocale: (locale: Locale) => void;
};

const I18nContext = createContext<I18nContextValue | null>(null);

export function LocaleProvider({ locale, dictionary, children }: { locale: Locale; dictionary: Dictionary; children: ReactNode }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [current, setCurrent] = useState(locale);

  const setLocale = useCallback((next: Locale) => {
    if (next === current) return;
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=${LOCALE_COOKIE_MAX_AGE}; samesite=lax${location.protocol === 'https:' ? '; secure' : ''}`;
    try { localStorage.setItem(LOCALE_COOKIE, next); } catch { /* storage unavailable */ }
    const html = document.documentElement;
    html.lang = localeMeta[next].htmlLang;
    html.dir = localeMeta[next].dir;
    html.dataset.locale = next;
    setCurrent(next);
    startTransition(() => router.refresh());
  }, [current, router]);

  const value = useMemo<I18nContextValue>(() => ({ locale, d: dictionary, meta: localeMeta[locale], pending, setLocale }), [dictionary, locale, pending, setLocale]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const context = useContext(I18nContext);
  if (!context) throw new Error('useI18n must be used inside <LocaleProvider>.');
  return context;
}

export function useDictionary(): Dictionary {
  return useI18n().d;
}

export function useLocale(): Locale {
  return useI18n().locale;
}
