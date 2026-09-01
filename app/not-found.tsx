import Link from '@/components/Link';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import { getI18n } from '@/lib/i18n/server';

export default async function NotFound() {
  const { d } = await getI18n();
  const n = d.notFound;
  return <main id="contenu" className="theme-page bg-[#f3f5fb] text-black">
    <section className="relative min-h-[70vh] overflow-hidden bg-black text-white"><div className="brand-grid absolute inset-0 opacity-35" /><SiteHeader /><div className="relative mx-auto flex min-h-[calc(70vh-96px)] max-w-7xl flex-col justify-center px-5 pb-20 lg:px-8"><p className="eyebrow">{n.eyebrow}</p><h1 className="mt-6 max-w-3xl text-5xl font-light leading-[1] tracking-[-.05em] sm:text-6xl">{n.title}</h1><p className="mt-6 max-w-xl text-lg leading-8 text-white/60">{n.text}</p><div className="mt-9 flex flex-col gap-3 sm:flex-row"><Link href="/" className="rounded-full bg-[#4556f5] px-7 py-4 text-center text-sm font-bold text-white">{n.home}</Link><Link href="/store" className="rounded-full border border-white/15 px-7 py-4 text-center text-sm font-bold">{n.store}</Link></div></div></section>
    <SiteFooter />
  </main>;
}
