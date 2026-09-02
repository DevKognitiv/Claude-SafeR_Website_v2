'use client';

import Link from '@/components/Link';
import { useI18n } from '@/lib/i18n/client';
import { fmt } from '@/lib/i18n/config';
import { formatXof } from '@/lib/catalog/format';
import type { useSelection } from '@/lib/catalog/selection';
import type { StoreItem } from '@/lib/catalog/view';

type Selection = ReturnType<typeof useSelection>;

/** Sticky cart summary and compare tray, shared by the Store pages. */
export default function SelectionBars({ items, selection }: { items: StoreItem[]; selection: Selection }) {
  const { d, locale } = useI18n();
  const s = d.store;
  const byId = new Map(items.map((item) => [item.id, item]));
  const lines = Object.entries(selection.cart).map(([id, quantity]) => ({ item: byId.get(id), quantity })).filter((line) => line.item) as { item: StoreItem; quantity: number }[];
  const total = lines.reduce((sum, line) => sum + (line.item.priceXof ?? 0) * line.quantity, 0);
  const count = lines.reduce((sum, line) => sum + line.quantity, 0);
  const selectionQuery = encodeURIComponent(lines.map(({ item, quantity }) => `${quantity}× ${item.name} (${item.sku})`).join(', '));
  const compareItems = selection.compare.filter((id) => byId.has(id));

  if (!selection.ready || (lines.length === 0 && compareItems.length === 0)) return null;

  return (
    <div className="sticky bottom-4 z-40 mx-auto mt-8 flex max-w-4xl flex-col gap-3">
      {compareItems.length > 0 && (
        <aside className="flex flex-col gap-3 rounded-[22px] border border-black/10 bg-white/95 p-4 text-black shadow-2xl backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs font-bold uppercase tracking-[.14em] text-[#4556f5]">{fmt(s.cart.compareBar, { count: compareItems.length })}</p>
          <div className="flex gap-2">
            <button type="button" onClick={selection.clearCompare} className="rounded-full border border-black/15 px-4 py-2.5 text-xs font-bold">{s.cart.compareClear}</button>
            <Link href={`/store/comparer?ids=${compareItems.join(',')}`} className="rounded-full bg-black px-5 py-2.5 text-xs font-bold text-white">{s.cart.compareGo}</Link>
          </div>
        </aside>
      )}
      {lines.length > 0 && (
        <aside className="flex flex-col gap-4 rounded-[24px] border border-white/15 bg-black/95 p-4 text-white shadow-2xl backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between" aria-label={s.cart.aria}>
          <div>
            <p className="text-xs font-bold uppercase tracking-[.14em] text-[#52c6ff]">{fmt(s.cart.selection, { count })}</p>
            <p className="mt-1 text-lg font-semibold">{fmt(s.cart.from, { total: formatXof(total, locale) })}</p>
            <p className="text-[10px] text-white/55">{s.cart.note}</p>
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={selection.clearCart} className="rounded-full border border-white/15 px-4 py-3 text-xs font-bold">{s.cart.clear}</button>
            <Link href={`/diagnostic?selection=${selectionQuery}`} className="rounded-full bg-[#4556f5] px-5 py-3 text-center text-xs font-bold">{s.cart.checkout}</Link>
          </div>
        </aside>
      )}
    </div>
  );
}
