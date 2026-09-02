import { cookies, headers } from 'next/headers';
import type { Metadata } from 'next';
import { LOCALE_COOKIE, defaultLocale, isLocale, localeMeta, negotiateLocale, type Locale } from './config';
import { loadDictionary, type Dictionary } from './dictionaries';
import { pageImage, type ImageSlot } from '@/lib/images';

/** Resolves the active locale from the preference cookie, then Accept-Language. */
export async function getLocale(): Promise<Locale> {
  const store = await cookies();
  const cookieValue = store.get(LOCALE_COOKIE)?.value;
  if (isLocale(cookieValue)) return cookieValue;
  try {
    const requestHeaders = await headers();
    return negotiateLocale(requestHeaders.get('accept-language'));
  } catch {
    return defaultLocale;
  }
}

export async function getDictionary(locale?: Locale): Promise<Dictionary> {
  return loadDictionary(locale ?? (await getLocale()));
}

/** Locale + dictionary in one call for server components and metadata. */
export async function getI18n(): Promise<{ locale: Locale; d: Dictionary; meta: (typeof localeMeta)[Locale] }> {
  const locale = await getLocale();
  const d = await loadDictionary(locale);
  return { locale, d, meta: localeMeta[locale] };
}

export function formatDate(date: Date | string | number, locale: Locale, options: Intl.DateTimeFormatOptions = { dateStyle: 'long' }): string {
  return new Intl.DateTimeFormat(localeMeta[locale].intl, { timeZone: 'Africa/Abidjan', ...options }).format(new Date(date));
}

/** Builds page metadata with a localized title/description and canonical path. */
export function pageMetadata(d: Dictionary, locale: Locale, input: { title: string; description: string; path: string; image?: string; imageAlt?: string; slot?: ImageSlot }): Metadata {
  const image = input.image ?? (input.slot ? pageImage(input.slot).src : '/og.png');
  const imageAlt = input.imageAlt ?? (input.slot ? d.images[input.slot] : input.title);
  return {
    title: input.title,
    description: input.description,
    alternates: { canonical: input.path },
    openGraph: {
      title: `${input.title} — ${d.meta.siteName}`,
      description: input.description,
      url: input.path,
      locale: localeMeta[locale].ogLocale,
      type: 'website',
      images: [{ url: image, alt: imageAlt }],
    },
    twitter: { card: 'summary_large_image', title: `${input.title} — ${d.meta.siteName}`, description: input.description, images: [image] },
  };
}
