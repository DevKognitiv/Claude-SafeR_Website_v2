'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

/** Adds `.is-visible` to `[data-reveal]` elements as they enter the viewport (immediate with reduced motion). Re-runs on navigation. */
export default function RevealObserver() {
  const pathname = usePathname();
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const elements = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]:not(.is-visible)'));
    if (reduce || !('IntersectionObserver' in window)) { elements.forEach((el) => el.classList.add('is-visible')); return; }
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.1 });
    elements.forEach((el) => observer.observe(el));
    // Safety net: anything still hidden after 1.5s (e.g. already in view but not intersected) becomes visible.
    const timer = window.setTimeout(() => elements.forEach((el) => el.classList.add('is-visible')), 1500);
    return () => { observer.disconnect(); window.clearTimeout(timer); };
  }, [pathname]);
  return null;
}
