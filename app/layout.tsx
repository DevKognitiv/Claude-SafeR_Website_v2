import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://safer-smart-security-ci.kognitiv-tec-4721.chatgpt.site'),
  title: {
    default: 'SafeR — Smart Home Security',
    template: '%s · SafeR',
  },
  description: 'La sécurité intelligente et connectée pour votre maison, votre quartier et votre ville en Côte d’Ivoire.',
  openGraph: {
    title: 'SafeR — Votre monde. Sous haute intelligence.',
    description: 'La sécurité intelligente pour votre maison, votre quartier et votre ville en Côte d’Ivoire.',
    locale: 'fr_CI',
    type: 'website',
    url: '/',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'SafeR — Votre monde. Sous haute intelligence.' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SafeR — Votre monde. Sous haute intelligence.',
    description: 'Smart Home Security · Côte d’Ivoire',
    images: ['/og.png'],
  },
  icons: {
    icon: [
      { url: '/brand/favicon-16.png', sizes: '16x16', type: 'image/png' },
      { url: '/brand/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/brand/favicon-64.png', sizes: '64x64', type: 'image/png' },
    ],
  },
  alternates: { canonical: '/' },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" data-theme="light" suppressHydrationWarning>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
