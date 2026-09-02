'use client';

import Link from '@/components/Link';
import { useState, type CSSProperties } from 'react';
import { useI18n } from '@/lib/i18n/client';
import { fmt } from '@/lib/i18n/config';
import { formatXof } from '@/lib/catalog/format';
import type { StoreItem } from '@/lib/catalog/view';
import Icon, { subcategoryIcon } from '@/components/Icon';

type Props = {
  item: StoreItem;
  inCart?: number;
  comparing?: boolean;
  compareDisabled?: boolean;
  onAdd?: (id: string) => void;
  onCompare?: (id: string) => void;
};

export function ProductVisual({ item, className = '' }: { item: StoreItem; className?: string }) {
  const { d } = useI18n();
  const [failed, setFailed] = useState(false);
  const showImage = Boolean(item.imageUrl) && !failed;
  return (
    <div className={`store-product-visual relative overflow-hidden ${className}`} style={{ '--product-accent': item.accent } as CSSProperties}>
      {showImage ? (
        <img src={item.imageUrl} alt={fmt(d.store.card.imageAlt, { name: item.name, brand: item.brandName })} loading="lazy" onError={() => setFailed(true)} className="absolute inset-0 h-full w-full object-contain p-6 mix-blend-multiply" />
      ) : (
        <>
          <div aria-hidden="true" className="absolute -right-10 -top-12 size-48 rounded-full border border-black/10" />
          <div aria-hidden="true" className="absolute bottom-6 right-7 grid size-24 place-items-center rounded-[28px] border border-black/10 bg-black/90 text-white shadow-2xl transition duration-500 group-hover:-translate-y-2 group-hover:rotate-3"><Icon name={subcategoryIcon[item.subcategory] ?? 'shield'} size={40} strokeWidth={1.5} /></div>
        </>
      )}
    </div>
  );
}

export default function ProductCard({ item, inCart = 0, comparing = false, compareDisabled = false, onAdd, onCompare }: Props) {
  const { d, locale } = useI18n();
  const s = d.store;
  const availability = (s.attributes.availability as Record<string, string>)[item.availability] ?? item.availability;
  const subcategory = (s.subcategories as Record<string, string>)[item.subcategory] ?? item.subcategory;

  return (
    <article className="store-product-card group flex min-h-[520px] flex-col overflow-hidden rounded-[30px] border border-black/8 bg-white">
      <div className="relative">
        <Link href={item.path} className="block" aria-label={item.name}><ProductVisual item={item} className="min-h-56" /></Link>
        <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-6">
          <span className="rounded-full border border-black/10 bg-white/80 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.14em] text-black backdrop-blur">{subcategory}</span>
          <div className="flex gap-2">
            {item.isNew && <span className="rounded-full bg-black px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white">{s.card.new}</span>}
            {item.featured && <span className="rounded-full bg-[#4556f5] px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white">{s.card.featured}</span>}
          </div>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[.12em] text-black/45">{item.brandName}</p>
            <h3 className="mt-1 text-xl font-semibold leading-tight tracking-tight"><Link href={item.path} className="hover:underline">{item.name}</Link></h3>
            <p className="mt-1 text-[11px] font-semibold text-black/45">{s.card.ref} {item.sku}</p>
          </div>
          
        </div>
        <p className="mt-4 text-sm leading-6 text-black/58">{item.tagline}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {item.attributes.protocol.slice(0, 2).map((p) => <span key={p} className="rounded-full border border-black/8 px-2.5 py-1 text-[10px] font-semibold text-black/55">{(s.attributes.protocol as Record<string, string>)[p] ?? p}</span>)}
          <span className="rounded-full border border-black/8 px-2.5 py-1 text-[10px] font-semibold text-black/55">{(s.attributes.placement as Record<string, string>)[item.attributes.placement]}</span>
          {item.attributes.resolution && <span className="rounded-full border border-black/8 px-2.5 py-1 text-[10px] font-semibold text-black/55">{(s.attributes.resolution as Record<string, string>)[item.attributes.resolution]}</span>}
        </div>
        <div className="mt-auto pt-6">
          <div className="border-t border-black/8 pt-5">
            <div className="flex items-end justify-between gap-4">
              <div>
                {item.priceXof != null ? <><p className="text-[11px] text-black/45">{s.card.from}</p><p className="price text-2xl font-semibold">{formatXof(item.priceXof, locale)} <span className="text-xs">{d.common.fcfa}</span></p></> : <p className="text-xl font-semibold">{d.common.onQuote}</p>}
                {item.monthlyXof != null && <p className="mt-1 text-[11px] text-black/45">{fmt(s.card.service, { price: formatXof(item.monthlyXof, locale) })}</p>}
              </div>
              <div className="flex flex-col items-end gap-2">
                {onAdd && <button type="button" onClick={() => onAdd(item.id)} className={`rounded-full px-5 py-3 text-xs font-bold transition ${inCart ? 'bg-[#4556f5] text-white' : 'bg-black text-white hover:bg-[#4556f5]'}`} aria-label={fmt(s.card.addAria, { name: item.name })}>{inCart ? `${s.card.added} ${inCart > 1 ? `×${inCart}` : ''}` : s.card.add}</button>}
                {onCompare && <button type="button" onClick={() => onCompare(item.id)} disabled={compareDisabled && !comparing} aria-pressed={comparing} className={`text-[11px] font-semibold underline underline-offset-4 disabled:opacity-40 ${comparing ? 'text-[#4556f5]' : 'text-black/55'}`} aria-label={fmt(s.card.compareAria, { name: item.name })}>{comparing ? s.card.comparing : s.card.compare}</button>}
              </div>
            </div>
            <p className="mt-4 flex flex-wrap items-center gap-x-2 text-[10px] leading-4 text-black/42"><span className="inline-flex items-center gap-1.5 font-semibold text-black/60"><span aria-hidden="true" className={`size-1.5 rounded-full ${item.availability === 'en-stock' ? 'bg-[#1f8a4c]' : item.availability === 'indisponible' ? 'bg-[#b42318]' : 'bg-[#b26a00]'}`} />{availability}</span></p>
          </div>
        </div>
      </div>
    </article>
  );
}
