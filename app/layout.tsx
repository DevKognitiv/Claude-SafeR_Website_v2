import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import './globals.css';
import { LocaleProvider } from '@/lib/i18n/client';
import RevealObserver from '@/components/RevealObserver';
import { getI18n } from '@/lib/i18n/server';
import { localeMeta, locales } from '@/lib/i18n/config';

import { SITE_URL } from '@/lib/site';

export async function generateMetadata(): Promise<Metadata> {
  const { d, meta } = await getI18n();
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: d.meta.defaultTitle, template: d.meta.titleTemplate },
    description: d.meta.description,
    applicationName: d.meta.siteName,
    openGraph: {
      title: d.meta.ogTitle,
      description: d.meta.ogDescription,
      locale: meta.ogLocale,
      alternateLocale: locales.filter((l) => l !== meta.code).map((l) => localeMeta[l].ogLocale),
      type: 'website',
      url: '/',
      siteName: d.meta.siteName,
      images: [{ url: '/og.png', width: 1200, height: 630, alt: d.meta.ogImageAlt }],
    },
    twitter: { card: 'summary_large_image', title: d.meta.ogTitle, description: d.meta.twitterDescription, images: ['/og.png'] },
    icons: {
      icon: [
        { url: '/brand/favicon-16.png', sizes: '16x16', type: 'image/png' },
        { url: '/brand/favicon-32.png', sizes: '32x32', type: 'image/png' },
        { url: '/brand/favicon-64.png', sizes: '64x64', type: 'image/png' },
      ],
    },
    alternates: { canonical: '/' },
  };
}

const themeScript = `(function(){try{var t=localStorage.getItem('safer-theme');if(t!=='dark'&&t!=='light'){var m=document.cookie.match(/(?:^|; )safer-theme=(dark|light)/);t=m?m[1]:(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');}document.documentElement.dataset.theme=t;}catch(e){}})();`;

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const { locale, d, meta } = await getI18n();
  const cookieStore = await cookies();
  const themeCookie = cookieStore.get('safer-theme')?.value;
  const theme = themeCookie === 'dark' ? 'dark' : 'light';

  return (
    <html lang={meta.htmlLang} dir={meta.dir} data-locale={locale} data-theme={theme} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="antialiased">
        <a href="#contenu" className="skip-link">{d.common.skipToContent}</a>
        <LocaleProvider locale={locale} dictionary={d}>
          {children}
          <RevealObserver />
        </LocaleProvider>
      </body>
    </html>
  );
}
