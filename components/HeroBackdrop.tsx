import SmartImage from '@/components/SmartImage';
import type { ImageSlot } from '@/lib/images';

type Props = {
  slot: ImageSlot;
  alt: string;
  /** Tailwind opacity class for the photo, e.g. "opacity-40". */
  opacity?: string;
  /** Gradient overlay keeping the copy legible. */
  tone?: 'black' | 'green' | 'none';
  /** Where the copy sits — the darkest part of the gradient goes there. */
  align?: 'left' | 'center' | 'right';
  /** Eager loading for above-the-fold heroes. */
  priority?: boolean;
  className?: string;
};

const gradients = {
  black: {
    left: 'bg-[linear-gradient(90deg,#000_0%,rgba(0,0,0,.9)_36%,rgba(0,0,0,.35)_100%)]',
    center: 'bg-[linear-gradient(180deg,rgba(0,0,0,.55)_0%,rgba(0,0,0,.82)_55%,#000_100%)]',
    right: 'bg-[linear-gradient(270deg,#000_0%,rgba(0,0,0,.9)_36%,rgba(0,0,0,.35)_100%)]',
  },
  green: {
    left: 'bg-[linear-gradient(90deg,#07120f_0%,rgba(7,18,15,.9)_38%,rgba(7,18,15,.35)_100%)]',
    center: 'bg-[linear-gradient(180deg,rgba(7,18,15,.55)_0%,rgba(7,18,15,.85)_55%,#07120f_100%)]',
    right: 'bg-[linear-gradient(270deg,#07120f_0%,rgba(7,18,15,.9)_38%,rgba(7,18,15,.35)_100%)]',
  },
  none: { left: '', center: '', right: '' },
};

/**
 * Full-bleed contextual photograph behind a hero section. The parent section
 * must be `relative overflow-hidden`; place the copy in a `relative` wrapper.
 */
export default function HeroBackdrop({ slot, alt, opacity = 'opacity-40', tone = 'black', align = 'left', priority = false, className = '' }: Props) {
  return (
    <div aria-hidden={alt ? undefined : true} className={`pointer-events-none absolute inset-0 ${className}`}>
      <SmartImage slot={slot} alt={alt} loading={priority ? 'eager' : 'lazy'} fetchPriority={priority ? 'high' : undefined} className={`h-full w-full object-cover ${opacity}`} />
      {tone !== 'none' && <div className={`absolute inset-0 ${gradients[tone][align]}`} />}
    </div>
  );
}
