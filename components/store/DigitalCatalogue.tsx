'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Icon from '@/components/Icon';
import { useI18n } from '@/lib/i18n/client';
import { fmt } from '@/lib/i18n/config';

const PAGE_ROOT = '/media/catalogue-safer-radiant/pages';
const src = (page: number) => `${PAGE_ROOT}/page-${String(page).padStart(3, '0')}.jpg`;

/** Accessible two-page flipbook for the SafeR × RADIANT catalogue (single page on small screens). */
export default function DigitalCatalogue({ total }: { total: number }) {
  const { d, meta } = useI18n();
  const t = d.store.catalogue;
  const [page, setPage] = useState(1);
  const [spread, setSpread] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStart = useRef<number | null>(null);
  const rtl = meta.dir === 'rtl';

  useEffect(() => {
    const media = window.matchMedia('(min-width: 900px)');
    const sync = () => setSpread(media.matches);
    sync();
    media.addEventListener('change', sync);
    return () => media.removeEventListener('change', sync);
  }, []);

  const step = spread ? 2 : 1;
  const clamp = useCallback((value: number) => Math.min(Math.max(1, value), total), [total]);
  const go = useCallback((delta: number) => setPage((current) => clamp(spread ? (current <= 1 && delta > 0 ? 2 : current + delta * 2) : current + delta)), [clamp, spread]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') go(rtl ? -1 : 1);
      if (event.key === 'ArrowLeft') go(rtl ? 1 : -1);
      if (event.key === 'Home') setPage(1);
      if (event.key === 'End') setPage(total);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [go, rtl, total]);

  useEffect(() => {
    const onChange = () => setFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);

  // Preload neighbouring pages for instant turns.
  useEffect(() => {
    for (const n of [page + 1, page + 2, page - 1]) if (n >= 1 && n <= total) { const img = new Image(); img.src = src(n); }
  }, [page, total]);

  const toggleFullscreen = async () => {
    if (!containerRef.current) return;
    if (document.fullscreenElement) await document.exitFullscreen(); else await containerRef.current.requestFullscreen().catch(() => undefined);
  };

  // Spread: cover alone, then pairs (2-3, 4-5 …).
  const left = spread ? (page === 1 ? null : page % 2 === 0 ? page : page - 1) : page;
  const right = spread ? (page === 1 ? 1 : (left ?? 0) + 1) : null;
  const visible = [left, right].filter((n): n is number => n != null && n <= total);
  void step;

  return (
    <div ref={containerRef} className={`digital-catalogue rounded-[30px] bg-black p-3 text-white sm:p-5 ${fullscreen ? 'flex h-full flex-col justify-center' : ''}`}
      onTouchStart={(e) => { touchStart.current = e.touches[0].clientX; }}
      onTouchEnd={(e) => { if (touchStart.current == null) return; const dx = e.changedTouches[0].clientX - touchStart.current; if (Math.abs(dx) > 50) go((dx < 0) !== rtl ? 1 : -1); touchStart.current = null; }}>
      <div className="flex flex-wrap items-center justify-between gap-3 px-2 pb-3">
        <p className="text-xs font-bold uppercase tracking-[.14em] text-[#52c6ff]" aria-live="polite">{fmt(t.page, { page: visible.length === 2 ? `${visible[0]}–${visible[1]}` : String(visible[0] ?? page), total })}</p>
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 text-xs text-white/60"><span className="hidden sm:inline">{t.goTo}</span><input type="number" min={1} max={total} value={page} onChange={(e) => setPage(clamp(Number(e.target.value) || 1))} className="w-16 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-center text-xs font-bold text-white outline-none focus:border-[#52c6ff]" aria-label={t.goTo} /></label>
          <button type="button" onClick={toggleFullscreen} className="grid size-10 place-items-center rounded-full border border-white/15 hover:border-[#52c6ff]" aria-label={fullscreen ? t.exitFullscreen : t.fullscreen}><Icon name={fullscreen ? 'x' : 'eye'} size={18} /></button>
        </div>
      </div>
      <div className="relative">
        <div className={`grid gap-2 ${visible.length === 2 ? 'grid-cols-2' : 'grid-cols-1 mx-auto max-w-[620px]'}`}>
          {visible.map((n) => <figure key={n} className="catalogue-page overflow-hidden rounded-2xl bg-white shadow-2xl"><img src={src(n)} alt={fmt(t.pageAlt, { page: n })} width={1240} height={1754} loading={n <= 2 ? 'eager' : 'lazy'} decoding="async" className="block h-auto w-full" /></figure>)}
        </div>
        <button type="button" onClick={() => go(-1)} disabled={page <= 1} className="absolute left-1 top-1/2 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-black/70 text-white backdrop-blur transition hover:bg-[#4556f5] disabled:opacity-30 sm:-left-3" aria-label={t.previous}><Icon name="arrow-right" size={20} className={rtl ? '' : 'rotate-180'} /></button>
        <button type="button" onClick={() => go(1)} disabled={page >= total} className="absolute right-1 top-1/2 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-black/70 text-white backdrop-blur transition hover:bg-[#4556f5] disabled:opacity-30 sm:-right-3" aria-label={t.next}><Icon name="arrow-right" size={20} className={rtl ? 'rotate-180' : ''} /></button>
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 px-2">
        <div className="flex gap-2"><button type="button" onClick={() => setPage(1)} className="rounded-full border border-white/15 px-4 py-2 text-xs font-bold hover:border-[#52c6ff]">{t.first}</button><button type="button" onClick={() => setPage(total)} className="rounded-full border border-white/15 px-4 py-2 text-xs font-bold hover:border-[#52c6ff]">{t.last}</button></div>
        <p className="text-xs text-white/45">{t.hint}</p>
      </div>
      <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-[#52c6ff] transition-all" style={{ width: `${Math.round((page / total) * 100)}%` }} /></div>
    </div>
  );
}
