'use client';

import Link from '@/components/Link';
import { useI18n } from '@/lib/i18n/client';
import { COMPARE_MAX, useSelection } from '@/lib/catalog/selection';

export default function ProductActions({ id, sku, name }: { id: string; sku: string; name: string }) {
  const { d } = useI18n();
  const s = d.store.product;
  const selection = useSelection();
  const inCart = selection.cart[id] ?? 0;
  const comparing = selection.compare.includes(id);
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
      <button type="button" onClick={() => selection.addToCart(id)} className={`rounded-full px-7 py-4 text-sm font-bold transition ${inCart ? 'bg-[#52c6ff] text-black' : 'bg-[#4556f5] text-white hover:bg-[#52c6ff] hover:text-black'}`}>{inCart ? `${d.store.card.added}${inCart > 1 ? ` ×${inCart}` : ''}` : s.add}</button>
      <Link href={`/diagnostic?selection=${encodeURIComponent(`1× ${name} (${sku})`)}`} className="rounded-full border border-white/20 px-7 py-4 text-center text-sm font-bold text-white">{s.quote}</Link>
      <button type="button" onClick={() => selection.toggleCompare(id)} disabled={!comparing && selection.compare.length >= COMPARE_MAX} aria-pressed={comparing} className="rounded-full border border-white/20 px-7 py-4 text-sm font-bold text-white/80 disabled:opacity-40">{comparing ? d.store.card.comparing : s.compare}</button>
    </div>
  );
}
