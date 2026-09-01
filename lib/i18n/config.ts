export const locales = ['fr', 'en', 'es', 'ar', 'zh'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'fr';
export const LOCALE_COOKIE = 'safer-locale';
export const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export type LocaleMeta = {
  code: Locale;
  short: string;
  label: string;
  htmlLang: string;
  dir: 'ltr' | 'rtl';
  intl: string;
  ogLocale: string;
};

export const localeMeta: Record<Locale, LocaleMeta> = {
  fr: { code: 'fr', short: 'FR', label: 'Français', htmlLang: 'fr', dir: 'ltr', intl: 'fr-FR', ogLocale: 'fr_CI' },
  en: { code: 'en', short: 'EN', label: 'English', htmlLang: 'en', dir: 'ltr', intl: 'en-GB', ogLocale: 'en_GB' },
  es: { code: 'es', short: 'ES', label: 'Español', htmlLang: 'es', dir: 'ltr', intl: 'es-ES', ogLocale: 'es_ES' },
  ar: { code: 'ar', short: 'AR', label: 'العربية', htmlLang: 'ar', dir: 'rtl', intl: 'ar-MA', ogLocale: 'ar_AR' },
  zh: { code: 'zh', short: '中文', label: '中文（简体）', htmlLang: 'zh-Hans', dir: 'ltr', intl: 'zh-CN', ogLocale: 'zh_CN' },
};

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (locales as readonly string[]).includes(value);
}

/** Picks the best locale from an Accept-Language header value. */
export function negotiateLocale(acceptLanguage: string | null | undefined): Locale {
  if (!acceptLanguage) return defaultLocale;
  const ranked = acceptLanguage
    .split(',')
    .map((part, index) => {
      const [tag, ...params] = part.trim().split(';');
      const q = params.find((p) => p.trim().startsWith('q='));
      return { tag: tag.toLowerCase(), q: q ? Number(q.split('=')[1]) || 0 : 1, index };
    })
    .sort((a, b) => b.q - a.q || a.index - b.index);
  for (const { tag } of ranked) {
    const base = tag.split('-')[0];
    if (isLocale(base)) return base;
  }
  return defaultLocale;
}

/** Replaces `{name}` placeholders in a translated string. */
export function fmt(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => (key in vars ? String(vars[key]) : match));
}

export type LocalizedText = Record<Locale, string>;

/** Resolves a localized record, falling back to French then to the first available value. */
export function pick(text: Partial<LocalizedText> | string | undefined, locale: Locale): string {
  if (typeof text === 'string') return text;
  if (!text) return '';
  return text[locale] ?? text[defaultLocale] ?? Object.values(text).find(Boolean) ?? '';
}
