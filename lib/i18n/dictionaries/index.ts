import type { Locale } from '../config';
import { fr, type Dictionary } from './fr';

export type { Dictionary };

const loaders: Record<Locale, () => Promise<Dictionary>> = {
  fr: async () => fr,
  en: async () => (await import('./en')).en,
  es: async () => (await import('./es')).es,
  ar: async () => (await import('./ar')).ar,
  zh: async () => (await import('./zh')).zh,
};

const cache = new Map<Locale, Dictionary>();

export async function loadDictionary(locale: Locale): Promise<Dictionary> {
  const cached = cache.get(locale);
  if (cached) return cached;
  const dictionary = await loaders[locale]();
  cache.set(locale, dictionary);
  return dictionary;
}

export { fr };
