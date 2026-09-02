import type { Locale } from '@/lib/i18n/config';
import { defaultLocale } from '@/lib/i18n/config';

/** Client-safe helpers (no catalogue data import — keeps supplier data out of the browser bundle). */
export function formatXof(value: number | null | undefined, locale: Locale = 'fr'): string {
  if (value == null) return '—';
  const intl = locale === 'ar' ? 'ar-MA-u-nu-latn' : locale === 'zh' ? 'zh-CN' : locale === 'en' ? 'en-GB' : locale === 'es' ? 'es-ES' : 'fr-FR';
  return new Intl.NumberFormat(intl, { maximumFractionDigits: 0 }).format(value).replace(/[\u202f\u00a0]/g, ' ');
}

/** Spec values are either language-neutral strings or per-locale objects. */
export function specValue(value: string | Record<string, string>, locale: Locale): string {
  if (typeof value === 'string') return value;
  return value[locale] ?? value[defaultLocale] ?? Object.values(value)[0] ?? '';
}
