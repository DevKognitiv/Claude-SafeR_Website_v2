'use client';

import Link from '@/components/Link';
import { useEffect, useState } from 'react';
import { useI18n } from '@/lib/i18n/client';
import { formatXof } from '@/lib/catalog';
import { useSelection } from '@/lib/catalog/selection';

/** Mobile sticky purchase bar: price + add + quote, shown once the hero scrolls out of view. */
export default function StickyProductBar({ id, sku, name, priceXof }: { id: string; sku: string; name: string; priceXof: number | null }) {
  const { d, locale } = useI18n();
  const selection = useSelection();
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 520);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  const inCart = selection.cart[id] ?? 0;
  return (
    <div aria-hidden={!visible} className={`sticky-cta fixed inset-x-0 bottom-0 z-40 border-t border-black/10 bg-white/95 px-4 pt-3 shadow-[0_-10px_40px_rgba(0,0,0,.12)] backdrop-blur-xl transition-transform duration-300 lg:hidden ${visible ? 'translate-y-0' : 'translate-y-full'}`}>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
        <div className="min-w-0"><p className="truncate text-xs font-semibold text-black/60">{name}</p><p className="price text-lg font-semibold">{priceXof != null ? `${formatXof(priceXof, locale)} ${d.common.fcfa}` : d.common.onQuote}</p></div>
        <div className="flex shrink-0 gap-2">
          <Link href={`/diagnostic?selection=${encodeURIComponent(`1× ${name} (${sku})`)}`} className="rounded-full border border-black/15 px-4 py-3 text-xs font-bold">{d.trust.stickyQuote}</Link>
          <button type="button" onClick={() => selection.addToCart(id)} className={`rounded-full px-5 py-3 text-xs font-bold text-white ${inCart ? 'bg-[#52c6ff] text-black' : 'bg-[#4556f5]'}`}>{inCart ? `${d.store.card.added}${inCart > 1 ? ` ×${inCart}` : ''}` : d.trust.stickyCta}</button>
        </div>
      </div>
    </div>
  );
}
