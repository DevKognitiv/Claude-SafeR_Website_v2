'use client';

import Link from '@/components/Link';
import { useEffect, useRef, useState } from 'react';
import { productFamilies } from '@/lib/products';
import { pageImage } from '@/lib/images';
import SmartImage from '@/components/SmartImage';
import { useDictionary } from '@/lib/i18n/client';

type NetworkInformation = { saveData?: boolean; effectiveType?: string };

export default function ProductShowcase({ compact = false }: { compact?: boolean }) {
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [lowBandwidth, setLowBandwidth] = useState(false);
  const [mediaFailed, setMediaFailed] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const d = useDictionary();
  const sc = d.solutions.showcase;
  const slide = { ...productFamilies[active], ...sc.families[productFamilies[active].id] };
  const Heading = compact ? 'h1' : 'h2';

  useEffect(() => {
    const connection = (navigator as Navigator & { connection?: NetworkInformation }).connection;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const constrained = Boolean(connection?.saveData || connection?.effectiveType === '2g' || connection?.effectiveType === 'slow-2g');
    queueMicrotask(() => {
      setLowBandwidth(constrained);
      if (reduceMotion || constrained) setPlaying(false);
    });
  }, []);

  useEffect(() => {
    if (!playing || lowBandwidth) return;
    const timer = window.setInterval(() => {
      setActive((index) => (index + 1) % productFamilies.length);
      setMediaFailed(false);
    }, 9000);
    return () => window.clearInterval(timer);
  }, [lowBandwidth, playing]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (playing && !lowBandwidth && !mediaFailed) void video.play().catch(() => setPlaying(false));
    else video.pause();
  }, [active, lowBandwidth, mediaFailed, playing]);

  const selectSlide = (index: number) => {
    setActive(index);
    setMediaFailed(false);
  };

  return (
    <section aria-label={sc.aria} className={`product-showcase relative overflow-hidden bg-black text-white ${compact ? 'rounded-[34px]' : ''}`}>
      <div className={`relative ${compact ? 'min-h-[680px]' : 'min-h-[760px] lg:min-h-[820px]'}`}>
        <SmartImage slot={slide.poster} alt={sc.posterAlt} className="absolute inset-0 h-full w-full object-cover object-center" />
        {!lowBandwidth && !mediaFailed && (
          <video
            ref={videoRef}
            key={slide.id}
            className="absolute inset-0 h-full w-full object-cover"
            muted
            loop
            playsInline
            preload="metadata"
            poster={pageImage(slide.poster).src}
            onError={() => setMediaFailed(true)}
            aria-hidden="true"
          >
            <source src={slide.video} type="video/mp4" />
          </video>
        )}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,.97)_0%,rgba(0,0,0,.88)_40%,rgba(0,0,0,.38)_72%,rgba(0,0,0,.62)_100%)]" />
        <div className="brand-grid absolute inset-0 opacity-25" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black to-transparent" />

        <div className={`relative mx-auto flex max-w-7xl flex-col px-5 ${compact ? 'min-h-[680px] py-10' : 'min-h-[760px] py-16 lg:min-h-[820px] lg:px-8 lg:py-20'}`}>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/18 bg-black/35 px-4 py-2 text-[11px] font-bold uppercase tracking-[.16em] text-[#bcecff] backdrop-blur-md">
              <span className="size-1.5 rounded-full bg-[#52c6ff]" /> {sc.label}
            </div>
            <button
              type="button"
              onClick={() => setPlaying((value) => !value)}
              aria-label={playing ? sc.pause : sc.play}
              className="grid size-11 place-items-center rounded-full border border-white/20 bg-black/35 text-sm backdrop-blur-md transition hover:border-[#52c6ff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#52c6ff]"
            >
              <span aria-hidden="true">{playing ? 'Ⅱ' : '▶'}</span>
            </button>
          </div>

          <div className="my-auto max-w-3xl py-12">
            <p className="text-xs font-bold uppercase tracking-[.16em] text-[#52c6ff]">{slide.category} · {String(active + 1).padStart(2, '0')}</p>
            <Heading className="mt-5 text-5xl font-light leading-[.98] tracking-[-.05em] sm:text-6xl lg:text-7xl">{slide.safeRName}</Heading>
            <p className="mt-5 max-w-2xl text-2xl font-semibold leading-tight text-white">{slide.promise}</p>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/75 sm:text-lg">{slide.description}</p>
            <div className="mt-7 flex flex-wrap gap-2">
              {slide.features.map((feature) => <span key={feature} className="rounded-full border border-white/16 bg-black/32 px-3.5 py-2 text-xs text-white/82 backdrop-blur-md">{feature}</span>)}
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href={`/store?q=${encodeURIComponent(slide.storeSku)}`} className="rounded-full bg-[#4556f5] px-6 py-3.5 text-center text-sm font-bold text-white transition hover:bg-[#52c6ff] hover:text-black">{sc.configure}</Link>
              {!compact && <Link href="/produits" className="rounded-full border border-white/18 px-6 py-3.5 text-center text-sm font-bold text-white transition hover:bg-white/10">{sc.explore}</Link>}
            </div>
          </div>

          <div>
            <p className="mb-4 text-xs text-white/55">{slide.context}{lowBandwidth ? sc.lowBandwidth : ''}</p>
            <div className="grid gap-2 sm:grid-cols-5" role="tablist" aria-label={sc.tablist}>
              {productFamilies.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={index === active}
                  onClick={() => selectSlide(index)}
                  className={`min-w-0 rounded-2xl border px-4 py-3 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#52c6ff] ${index === active ? 'border-[#52c6ff] bg-[#52c6ff] text-black' : 'border-white/14 bg-black/40 text-white hover:border-white/35'}`}
                >
                  <span className={`block text-[10px] uppercase tracking-[.12em] ${index === active ? 'text-black/55' : 'text-white/45'}`}>{sc.families[item.id].category}</span>
                  <span className="mt-1 block truncate text-xs font-bold">{item.safeRName}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
