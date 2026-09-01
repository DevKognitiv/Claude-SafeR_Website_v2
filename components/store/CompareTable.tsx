'use client';

import Link from '@/components/Link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useMemo } from 'react';
import { useI18n } from '@/lib/i18n/client';
import { fmt } from '@/lib/i18n/config';
import { formatXof } from '@/lib/catalog';
import { useSelection } from '@/lib/catalog/selection';
import type { StoreItem } from '@/lib/catalog/view';
import { ProductVisual } from '@/components/store/ProductCard';

function Table({ items }: { items: StoreItem[] }) {
  const { d, locale } = useI18n();
  const c = d.store.compare;
  const attr = d.store.attributes as Record<string, Record<string, string>>;
  const params = useSearchParams();
  const selection = useSelection();
  const byId = useMemo(() => new Map(items.map((i) => [i.id, i])), [items]);

  const fromUrl = (params.get('ids') ?? '').split(',').filter((id) => byId.has(id)).slice(0, 4);
  const ids = fromUrl.length ? fromUrl : selection.compare.filter((id) => byId.has(id));
  useEffect(() => {
    if (fromUrl.length && selection.ready && fromUrl.join(',') !== selection.compare.join(',')) {
      selection.clearCompare();
      fromUrl.forEach((id) => selection.toggleCompare(id));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selection.ready]);

  const list = ids.map((id) => byId.get(id)!);
  if (!selection.ready) return <div className="min-h-[200px]" aria-busy="true" />;
  if (list.length === 0) return <div className="rounded-[30px] border border-dashed border-black/15 bg-white p-10 text-center"><p className="text-2xl font-semibold">{c.empty}</p><Link href="/store" className="mt-6 inline-flex rounded-full bg-black px-6 py-3.5 text-sm font-bold text-white">{c.emptyCta}</Link></div>;

  const rows: [string, (item: StoreItem) => string][] = [
    [c.rows.price, (i) => (i.priceXof != null ? `${formatXof(i.priceXof, locale)} ${d.common.fcfa}` : d.common.onQuote)],
    [c.rows.brand, (i) => i.brandName],
    [c.rows.category, (i) => (d.store.subcategories as Record<string, string>)[i.subcategory] ?? i.subcategory],
    [c.rows.protocol, (i) => i.attributes.protocol.map((v) => attr.protocol[v] ?? v).join(', ')],
    [c.rows.placement, (i) => attr.placement[i.attributes.placement] ?? i.attributes.placement],
    [c.rows.power, (i) => i.attributes.power.map((v) => attr.power[v] ?? v).join(', ')],
    [c.rows.resolution, (i) => (i.attributes.resolution ? attr.resolution[i.attributes.resolution] : '—')],
    [c.rows.compat, (i) => i.attributes.compat.map((v) => attr.compat[v] ?? v).join(', ')],
    [c.rows.warranty, (i) => fmt(d.store.product.warrantyShort, { months: i.warrantyMonths })],
    [c.rows.availability, (i) => attr.availability[i.availability] ?? i.availability],
  ];

  return (
    <div className="overflow-x-auto rounded-[28px] border border-black/8 bg-white">
      <table className="w-full min-w-[720px] border-collapse text-left text-sm">
        <thead>
          <tr className="align-top">
            <th className="w-44 p-5" scope="col"><span className="sr-only">{c.eyebrow}</span></th>
            {list.map((item) => <th key={item.id} scope="col" className="p-5 font-normal"><ProductVisual item={item} className="min-h-32 rounded-2xl" /><p className="mt-3 text-[11px] font-semibold uppercase tracking-[.12em] text-black/45">{item.brandName}</p><Link href={item.path} className="mt-1 block text-lg font-semibold leading-tight hover:underline">{item.name}</Link><button type="button" onClick={() => selection.toggleCompare(item.id)} className="mt-3 text-xs font-semibold underline underline-offset-4 text-black/55">{c.remove}</button></th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map(([label, get]) => <tr key={label} className="border-t border-black/8"><th scope="row" className="p-5 text-xs font-bold uppercase tracking-[.12em] text-black/45">{label}</th>{list.map((item) => <td key={item.id} className="p-5">{get(item)}</td>)}</tr>)}
        </tbody>
      </table>
    </div>
  );
}

export default function CompareTable({ items }: { items: StoreItem[] }) {
  return <Suspense fallback={<div className="min-h-[200px]" aria-busy="true" />}><Table items={items} /></Suspense>;
}
