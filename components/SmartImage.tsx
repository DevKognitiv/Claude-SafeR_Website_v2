'use client';

import { useState, type ImgHTMLAttributes } from 'react';
import { pageImage, type AnyImageSlot } from '@/lib/images';

type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt' | 'onError'> & {
  /** Image slot (see lib/images.ts). Resolves to /media/pages/<slot>.jpg when present. */
  slot: AnyImageSlot;
  alt: string;
};

/**
 * Image bound to a page slot. Renders the local Côte d’Ivoire photo when it has
 * been provided, and degrades gracefully to the curated fallback if the file is
 * missing or fails to load — the page never shows a broken image.
 */
export default function SmartImage({ slot, alt, loading = 'lazy', decoding = 'async', ...rest }: Props) {
  const resolved = pageImage(slot);
  const [src, setSrc] = useState(resolved.src);
  return (
    <img
      src={src}
      alt={alt}
      loading={loading}
      decoding={decoding}
      onError={() => {
        if (src !== resolved.fallback) setSrc(resolved.fallback);
      }}
      {...rest}
    />
  );
}
