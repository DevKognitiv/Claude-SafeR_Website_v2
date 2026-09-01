'use client';

import Link from '@/components/Link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import ProductCard from '@/components/store/ProductCard';
import SelectionBars from '@/components/store/SelectionBars';
import { useI18n } from '@/lib/i18n/client';
import { fmt } from '@/lib/i18n/config';
import { parseFilters, serializeFilters, type FacetKey, type FilterState, type SortKey } from '@/lib/catalog';
import { COMPARE_MAX, useSelection } from '@/lib/catalog/selection';
import type { StoreItem } from '@/lib/catalog/view';

type Props = {
  items: StoreItem[];
  brands: Record<string, string>;
  /** Facets fixed by the page (category / subcategory pages) and therefore hidden from the sidebar. */
  lock?: { category?: string; subcategory?: string };
  showCategoryFacet?: boolean;
};

const facetOrder: FacetKey[] = ['brand', 'protocol', 'placement', 'power', 'compat', 'resolution', 'availability', 'price'];
const priceOrder = ['moins-50k', '50k-150k', '150k-300k', 'plus-300k', 'sur-devis'];

function valuesOf(item: StoreItem, key: FacetKey): string[] {
  switch (key) {
    case 'brand': return [item.brand];
    case 'availability': return [item.availability];
    case 'price': return [item.priceRange];
    case 'placement': return [item.attributes.placement];
    case 'resolution': return item.attributes.resolution ? [item.attributes.resolution] : [];
    default: return item.attributes[key];
  }
}

function matches(item: StoreItem, state: FilterState, key?: FacetKey): boolean {
  if (state.category && item.category !== state.category) return false;
  if (state.subcategory && item.subcategory !== state.subcategory) return false;
  for (const facet of facetOrder) {
    if (facet === key) continue;
    const selected = state[facet];
    if (!selected?.length) continue;
    const values = valuesOf(item, facet);
    if (facet === 'compat') { if (!selected.every((v) => values.includes(v))) return false; continue; }
    if (facet === 'placement') { if (!selected.some((v) => values.includes(v) || item.attributes.placement === 'interieur-exterieur')) return false; continue; }
    if (!selected.some((v) => values.includes(v))) return false;
  }
  if (state.q) {
    const haystack = [item.name, item.tagline, item.description, item.sku, item.model, item.brandName, item.sourceBrand, ...item.highlights].join(' ').toLowerCase();
    if (!state.q.toLowerCase().split(/\s+/).filter(Boolean).every((term) => haystack.includes(term))) return false;
  }
  return true;
}

function sortItems(list: StoreItem[], sort: SortKey): StoreItem[] {
  const copy = [...list];
  const price = (p: StoreItem) => p.priceXof ?? Number.MAX_SAFE_INTEGER;
  switch (sort) {
    case 'priceAsc': return copy.sort((a, b) => price(a) - price(b));
    case 'priceDesc': return copy.sort((a, b) => (b.priceXof ?? -1) - (a.priceXof ?? -1));
    case 'newest': return copy.sort((a, b) => Number(b.isNew) - Number(a.isNew) || Number(b.featured) - Number(a.featured));
    case 'name': return copy.sort((a, b) => a.name.localeCompare(b.name));
    default: return copy.sort((a, b) => Number(b.featured) - Number(a.featured) || Number(b.isNew) - Number(a.isNew) || a.brandName.localeCompare(b.brandName));
  }
}

function Catalog({ items, brands, lock, showCategoryFacet = false }: Props) {
  const { d } = useI18n();
  const s = d.store;
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [drawer, setDrawer] = useState(false);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const selection = useSelection();

  const lockCategory = lock?.category as FilterState['category'] | undefined;
  const lockSubcategory = lock?.subcategory;
  const state = useMemo<FilterState>(() => ({
    ...parseFilters(new URLSearchParams(searchParams.toString())),
    ...(lockCategory ? { category: lockCategory } : {}),
    ...(lockSubcategory ? { subcategory: lockSubcategory } : {}),
  }), [lockCategory, lockSubcategory, searchParams]);

  const [query, setQuery] = useState(state.q ?? '');
  const [syncedQuery, setSyncedQuery] = useState(state.q);
  if (syncedQuery !== state.q) {
    // The URL changed from outside (back/forward, reset): realign the input without an effect.
    setSyncedQuery(state.q);
    setQuery(state.q ?? '');
  }

  const update = useCallback((patch: Partial<FilterState>) => {
    const next: FilterState = { ...state, ...patch };
    if (lockCategory) delete next.category;
    if (lockSubcategory) delete next.subcategory;
    router.replace(`${pathname}${serializeFilters(next)}`, { scroll: false });
  }, [lockCategory, lockSubcategory, pathname, router, state]);

  useEffect(() => {
    const timer = window.setTimeout(() => { if ((query || undefined) !== state.q) update({ q: query || undefined }); }, 250);
    return () => window.clearTimeout(timer);
  }, [query, state.q, update]);

  const toggle = (key: FacetKey, value: string) => {
    const current = state[key] ?? [];
    const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
    update({ [key]: next.length ? next : undefined } as Partial<FilterState>);
  };

  const visible = useMemo(() => sortItems(items.filter((item) => matches(item, state)), state.sort ?? 'featured'), [items, state]);

  const counts = useMemo(() => {
    const result = {} as Record<FacetKey, Record<string, number>>;
    for (const key of facetOrder) {
      result[key] = {};
      for (const item of items) if (matches(item, state, key)) for (const value of valuesOf(item, key)) result[key][value] = (result[key][value] ?? 0) + 1;
    }
    return result;
  }, [items, state]);

  const labelFor = (key: FacetKey, value: string): string => {
    if (key === 'brand') return brands[value] ?? value;
    if (key === 'price') return (s.filters.priceRanges as Record<string, string>)[value] ?? (s.attributes.availability as Record<string, string>)['sur-devis'];
    return ((s.attributes as Record<string, Record<string, string>>)[key] ?? {})[value] ?? value;
  };

  const facetValues = (key: FacetKey): string[] => {
    const all = Object.keys(counts[key]);
    if (key === 'price') return priceOrder.filter((v) => all.includes(v));
    return all.sort((a, b) => (counts[key][b] - counts[key][a]) || labelFor(key, a).localeCompare(labelFor(key, b)));
  };

  const activeChips = facetOrder.flatMap((key) => (state[key] ?? []).map((value) => ({ key, value, label: labelFor(key, value) })));
  const hasFilters = activeChips.length > 0 || Boolean(state.q) || (!lock?.category && state.category) || (!lock?.subcategory && state.subcategory);

  const reset = () => { setQuery(''); router.replace(pathname, { scroll: false }); };

  const sidebar = (
    <div className="space-y-7">
      {showCategoryFacet && !lock?.category && (
        <fieldset>
          <legend className="text-xs font-bold uppercase tracking-[.14em] text-black/45">{s.filters.category}</legend>
          <div className="mt-3 space-y-2">
            {Object.entries(s.categories).map(([id, cat]) => (
              <label key={id} className="flex cursor-pointer items-center gap-3 text-sm">
                <input type="radio" name="category" checked={state.category === id} onChange={() => update({ category: id as FilterState['category'], subcategory: undefined })} className="size-4 accent-[#4556f5]" />
                <span className="flex-1">{cat.short}</span>
                <span className="text-xs text-black/40">{items.filter((i) => i.category === id).length}</span>
              </label>
            ))}
            {state.category && <button type="button" onClick={() => update({ category: undefined, subcategory: undefined })} className="text-xs font-semibold underline underline-offset-4">{d.common.all}</button>}
          </div>
        </fieldset>
      )}
      {state.category && !lock?.subcategory && (
        <fieldset>
          <legend className="text-xs font-bold uppercase tracking-[.14em] text-black/45">{s.filters.subcategory}</legend>
          <div className="mt-3 space-y-2">
            {Array.from(new Set(items.filter((i) => i.category === state.category).map((i) => i.subcategory))).map((sub) => (
              <label key={sub} className="flex cursor-pointer items-center gap-3 text-sm">
                <input type="radio" name="subcategory" checked={state.subcategory === sub} onChange={() => update({ subcategory: state.subcategory === sub ? undefined : sub })} className="size-4 accent-[#4556f5]" />
                <span className="flex-1">{(s.subcategories as Record<string, string>)[sub] ?? sub}</span>
                <span className="text-xs text-black/40">{items.filter((i) => i.subcategory === sub && matches(i, { ...state, subcategory: undefined })).length}</span>
              </label>
            ))}
          </div>
        </fieldset>
      )}
      {facetOrder.map((key) => {
        const values = facetValues(key);
        if (values.length < 2 && !(state[key]?.length)) return null;
        const limit = expanded[key] ? values.length : 6;
        return (
          <fieldset key={key}>
            <legend className="text-xs font-bold uppercase tracking-[.14em] text-black/45">{(s.filters as Record<string, unknown>)[key] as string}</legend>
            <div className="mt-3 space-y-2">
              {values.slice(0, limit).map((value) => {
                const checked = state[key]?.includes(value) ?? false;
                const count = counts[key][value] ?? 0;
                return (
                  <label key={value} className={`flex cursor-pointer items-center gap-3 text-sm ${!count && !checked ? 'opacity-40' : ''}`}>
                    <input type="checkbox" checked={checked} onChange={() => toggle(key, value)} className="size-4 accent-[#4556f5]" />
                    <span className="flex-1">{labelFor(key, value)}</span>
                    <span className="text-xs text-black/40">{count}</span>
                  </label>
                );
              })}
              {values.length > 6 && <button type="button" onClick={() => setExpanded((e) => ({ ...e, [key]: !e[key] }))} className="text-xs font-semibold underline underline-offset-4">{expanded[key] ? s.filters.showLess : s.filters.showMore}</button>}
            </div>
          </fieldset>
        );
      })}
    </div>
  );

  return (
    <div>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <label className="relative flex-1">
          <span className="sr-only">{s.filters.searchLabel}</span>
          <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={s.filters.search} className="w-full rounded-full border border-black/10 bg-white px-5 py-3.5 text-sm outline-none focus:border-[#4556f5]" />
        </label>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => setDrawer(true)} className="rounded-full border border-black/10 bg-white px-4 py-3 text-xs font-bold lg:hidden" aria-expanded={drawer} aria-controls="store-filters">{s.filters.open}{activeChips.length ? ` (${activeChips.length})` : ''}</button>
          <label className="flex items-center gap-2 text-xs font-semibold">
            <span className="hidden sm:inline text-black/50">{s.filters.sort}</span>
            <select value={state.sort ?? 'featured'} onChange={(e) => update({ sort: e.target.value as SortKey })} className="rounded-full border border-black/10 bg-white px-4 py-3 text-xs font-bold outline-none">
              {Object.entries(s.filters.sortOptions).map(([k, label]) => <option key={k} value={k}>{label}</option>)}
            </select>
          </label>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <p className="text-xs font-semibold text-black/55" role="status">{visible.length === 1 ? s.filters.resultsOne : fmt(s.filters.results, { count: visible.length })}</p>
        {activeChips.map((chip) => (
          <button key={`${chip.key}-${chip.value}`} type="button" onClick={() => toggle(chip.key, chip.value)} className="inline-flex items-center gap-1 rounded-full bg-[#4556f5] px-3 py-1.5 text-[11px] font-bold text-white" aria-label={fmt(s.filters.removeFilter, { label: chip.label })}>{chip.label} <span aria-hidden="true">×</span></button>
        ))}
        {hasFilters && <button type="button" onClick={reset} className="text-xs font-semibold underline underline-offset-4">{s.filters.reset}</button>}
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[250px_1fr]">
        <aside className="hidden lg:block" aria-label={s.filters.title}><div className="sticky top-6 rounded-[26px] border border-black/8 bg-white p-6">{sidebar}</div></aside>
        {drawer && (
          <div id="store-filters" role="dialog" aria-modal="true" aria-label={s.filters.title} className="fixed inset-0 z-[60] flex lg:hidden">
            <button type="button" aria-label={s.filters.close} onClick={() => setDrawer(false)} className="flex-1 bg-black/50" />
            <div className="h-full w-[85%] max-w-sm overflow-y-auto bg-white p-6 text-black">
              <div className="mb-6 flex items-center justify-between"><p className="text-lg font-semibold">{s.filters.title}</p><button type="button" onClick={() => setDrawer(false)} className="grid size-10 place-items-center rounded-full border border-black/10" aria-label={s.filters.close}>×</button></div>
              {sidebar}
              <button type="button" onClick={() => setDrawer(false)} className="mt-8 w-full rounded-full bg-black px-5 py-3.5 text-sm font-bold text-white">{fmt(s.filters.results, { count: visible.length })}</button>
            </div>
          </div>
        )}
        <div>
          {visible.length === 0 ? (
            <div className="rounded-[30px] border border-dashed border-black/15 bg-white p-10 text-center">
              <p className="text-2xl font-semibold">{s.filters.emptyTitle}</p>
              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-black/55">{s.filters.emptyText}</p>
              <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
                <button type="button" onClick={reset} className="rounded-full bg-black px-6 py-3.5 text-sm font-bold text-white">{s.filters.emptyReset}</button>
                <Link href="/diagnostic" className="rounded-full border border-black/10 px-6 py-3.5 text-sm font-bold">{s.filters.emptyDiagnostic}</Link>
              </div>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 2xl:grid-cols-3">
              {visible.map((item) => (
                <ProductCard key={item.id} item={item} inCart={selection.cart[item.id] ?? 0} comparing={selection.compare.includes(item.id)} compareDisabled={selection.compare.length >= COMPARE_MAX} onAdd={selection.addToCart} onCompare={selection.toggleCompare} />
              ))}
            </div>
          )}
        </div>
      </div>

      <SelectionBars items={items} selection={selection} />
    </div>
  );
}

export default function StoreCatalog(props: Props) {
  return <Suspense fallback={<div className="min-h-[400px]" aria-busy="true" />}><Catalog {...props} /></Suspense>;
}
