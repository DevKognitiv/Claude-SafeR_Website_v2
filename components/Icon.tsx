import type { SVGProps } from 'react';

/** Inline SVG icon set (Lucide-style, 24px grid, 1.75 stroke) — replaces glyph/emoji icons for a consistent visual language. */
export type IconName =
  | 'camera' | 'shield' | 'lock' | 'home' | 'zap' | 'arrow-right' | 'arrow-up-right' | 'check' | 'sparkles' | 'flame' | 'bell' | 'radio' | 'key' | 'door' | 'plug' | 'sun' | 'wifi' | 'battery' | 'siren' | 'droplets' | 'thermometer' | 'router' | 'gate' | 'users' | 'building' | 'map' | 'phone' | 'message' | 'search' | 'filter' | 'x' | 'menu' | 'compare' | 'cart' | 'star' | 'clock' | 'truck' | 'badge-check' | 'wallet' | 'headset' | 'eye' | 'play' | 'pause' | 'chevron-down' | 'globe' | 'moon' | 'sun-medium' | 'file' | 'wrench' | 'hub' | 'blinds' | 'ac' | 'keypad';

const paths: Record<IconName, string> = {
  camera: 'M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3Z M12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z',
  shield: 'M12 2 4 5v6c0 5.25 3.4 9.9 8 11 4.6-1.1 8-5.75 8-11V5l-8-3Z M9 12l2 2 4-4',
  lock: 'M5 11h14a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1Z M8 11V7a4 4 0 0 1 8 0v4 M12 15v2',
  home: 'M3 11 12 3l9 8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-9Z',
  zap: 'M13 2 4 14h7l-1 8 9-12h-7l1-8Z',
  'arrow-right': 'M5 12h14 M13 6l6 6-6 6',
  'arrow-up-right': 'M7 17 17 7 M8 7h9v9',
  check: 'M5 12l5 5L20 7',
  sparkles: 'M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z M19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8L19 16Z',
  flame: 'M12 22c4.4 0 7-3 7-7 0-4-3-6.5-4-9-1.5 2-2.5 3-3 5-1-1.5-1.5-3-1.5-4.5C7 9 5 11.5 5 15c0 4 2.6 7 7 7Z M12 22c-2 0-3-1.5-3-3.5 0-1.7 1.2-3 3-4.5 1.8 1.5 3 2.8 3 4.5 0 2-1 3.5-3 3.5Z',
  bell: 'M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9Z M10.3 21a1.9 1.9 0 0 0 3.4 0',
  radio: 'M12 12h.01 M8.5 8.5a5 5 0 0 0 0 7 M15.5 8.5a5 5 0 0 1 0 7 M5.6 5.6a9 9 0 0 0 0 12.8 M18.4 5.6a9 9 0 0 1 0 12.8',
  key: 'M15.5 3a5.5 5.5 0 1 0-4.6 8.4L3 19.3V21h1.7l1.4-1.4h1.7v-1.7h1.7L12.6 15A5.5 5.5 0 1 0 15.5 3Z M16 8h.01',
  door: 'M4 21V5a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v16 M2 21h20 M13 12h.01',
  plug: 'M9 2v6 M15 2v6 M6 8h12v3a6 6 0 0 1-12 0V8Z M12 17v5',
  sun: 'M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z M12 2v2 M12 20v2 M4.9 4.9l1.4 1.4 M17.7 17.7l1.4 1.4 M2 12h2 M20 12h2 M4.9 19.1l1.4-1.4 M17.7 6.3l1.4-1.4',
  'sun-medium': 'M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z M12 3v1 M12 20v1 M3 12h1 M20 12h1 M5.6 5.6l.7.7 M17.7 17.7l.7.7 M5.6 18.4l.7-.7 M17.7 6.3l.7-.7',
  moon: 'M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z',
  wifi: 'M5 12.5a10 10 0 0 1 14 0 M8.5 16a5 5 0 0 1 7 0 M2 9a14.5 14.5 0 0 1 20 0 M12 20h.01',
  battery: 'M3 8h14a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H3a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z M22 11v2 M6 11v2 M10 11v2',
  siren: 'M7 18v-6a5 5 0 0 1 10 0v6 M5 18h14a1 1 0 0 1 1 1v2H4v-2a1 1 0 0 1 1-1Z M12 3v2 M4.5 6.5l1.5 1 M19.5 6.5l-1.5 1',
  droplets: 'M12 3s5 5.5 5 9.5a5 5 0 0 1-10 0C7 8.5 12 3 12 3Z M12 15a2 2 0 0 0 2-2',
  thermometer: 'M14 14.8V4a2 2 0 0 0-4 0v10.8a4 4 0 1 0 4 0Z M12 17h.01',
  router: 'M3 14h18a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1Z M6 17h.01 M9 17h.01 M16 14V8 M12.5 6.5a5 5 0 0 1 7 0 M10 4a8.5 8.5 0 0 1 12 0',
  gate: 'M3 21V9 M21 21V9 M3 9a9 9 0 0 1 18 0 M7 21v-9 M11 21V9 M15 21V9 M19 21v-9 M3 15h18',
  users: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z M22 21v-2a4 4 0 0 0-3-3.9 M16 3.1a4 4 0 0 1 0 7.8',
  building: 'M4 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16 M16 9h2a2 2 0 0 1 2 2v10 M2 21h20 M8 7h2 M8 11h2 M8 15h2 M12 7h1 M12 11h1 M12 15h1',
  map: 'M9 18l-6 3V6l6-3 6 3 6-3v15l-6 3-6-3Z M9 3v15 M15 6v15',
  phone: 'M22 16.9v3a2 2 0 0 1-2.2 2A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6.1 6.1l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z',
  message: 'M21 12a8 8 0 0 1-8 8H6l-3 3V12a8 8 0 0 1 8-8h2a8 8 0 0 1 8 8Z',
  search: 'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z M21 21l-4.3-4.3',
  filter: 'M3 5h18 M6 12h12 M10 19h4',
  x: 'M18 6 6 18 M6 6l12 12',
  menu: 'M4 7h16 M4 12h16 M4 17h16',
  compare: 'M9 3v18 M15 3v18 M3 9h18 M3 15h18',
  cart: 'M3 3h2l2.6 12.4a2 2 0 0 0 2 1.6h8.9a2 2 0 0 0 2-1.6L22 7H6 M9 21h.01 M18 21h.01',
  star: 'M12 2l3 6.6 7 .8-5.2 4.8L18.2 21 12 17.5 5.8 21 7.2 14.2 2 9.4l7-.8L12 2Z',
  clock: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z M12 6v6l4 2',
  truck: 'M3 6h11v11H3V6Z M14 9h4l3 3v5h-7V9Z M7 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z M17 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z',
  'badge-check': 'M12 2l2.4 1.7 2.9-.3 1.1 2.7 2.6 1.3-.5 2.9 1.5 2.5-1.9 2.2.1 3-2.8.9-1.4 2.6-2.9-.7L12 22l-2.1-1.9-2.9.7-1.4-2.6-2.8-.9.1-3L1 12.1l1.5-2.5L2 6.7l2.6-1.3L5.7 2.7l2.9.3L12 2Z M8.5 12l2.5 2.5 5-5',
  wallet: 'M20 7H5a2 2 0 0 1 0-4h13v4 M3 5v13a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1 M16 13h.01',
  headset: 'M3 14v-2a9 9 0 0 1 18 0v2 M3 14h3v5H4a1 1 0 0 1-1-1v-4Z M21 14h-3v5h2a1 1 0 0 0 1-1v-4Z M18 19a3 3 0 0 1-3 3h-3',
  eye: 'M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z',
  play: 'M7 4l13 8-13 8V4Z',
  pause: 'M7 4h3v16H7V4Z M14 4h3v16h-3V4Z',
  'chevron-down': 'M6 9l6 6 6-6',
  globe: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z M2 12h20 M12 2a15 15 0 0 1 0 20 M12 2a15 15 0 0 0 0 20',
  file: 'M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z M14 3v5h5 M9 13h6 M9 17h6',
  wrench: 'M14.7 6.3a4 4 0 0 0 4.9 4.9L21 9.8a6 6 0 1 1-6.8 6.8l-8.6 8.6a2 2 0 0 1-2.8-2.8l8.6-8.6A6 6 0 0 1 14.2 3l-1.9 1.9 2.4 1.4Z',
  hub: 'M12 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z M5 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z M19 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z M12 8v4 M12 12l-5 3 M12 12l5 3',
  blinds: 'M3 3h18 M4 3v18 M20 3v18 M4 8h16 M4 13h16 M4 18h16 M16 13v8',
  ac: 'M3 6h18a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1Z M6 11h12 M8 17c0 2-1 3-2 3 M12 17c0 2-1 3-2 3 M16 17c0 2-1 3-2 3',
  keypad: 'M6 3h12a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z M9 8h.01 M12 8h.01 M15 8h.01 M9 12h.01 M12 12h.01 M15 12h.01 M9 16h.01 M12 16h.01 M15 16h.01',
};

/** Maps the legacy glyph icons used in the ChatGPT prototype to the SVG set. */
export const glyphToIcon: Record<string, IconName> = { '◉': 'camera', '⌁': 'zap', '↗': 'arrow-up-right', '✦': 'sparkles', '▣': 'bell', '♨': 'flame', '◎': 'users', '◈': 'shield', '▦': 'building', '▤': 'home', '⌂': 'home', '⚡': 'zap', '☼': 'sun', '⊕': 'plug', '✚': 'check', '⌇': 'wifi', '✓': 'check', '→': 'arrow-right', '☎': 'phone' };

/** Category / subcategory → icon, used for product visuals when no image is available. */
export const subcategoryIcon: Record<string, IconName> = {
  'cameras-interieures': 'camera', 'cameras-exterieures': 'camera', 'cameras-ptz': 'eye', 'sonnettes-video': 'bell', 'enregistreurs-kits': 'file',
  centrales: 'shield', 'detecteurs-mouvement': 'radio', 'detecteurs-ouverture': 'door', 'detecteurs-fumee-gaz': 'flame', 'detecteurs-fuite': 'droplets', sirenes: 'siren', 'claviers-telecommandes': 'keypad', 'boutons-sos': 'bell',
  'serrures-connectees': 'lock', 'portails-motorisation': 'gate', interphones: 'phone', 'lecteurs-claviers': 'keypad',
  'passerelles-hubs': 'hub', 'prises-interrupteurs': 'plug', eclairage: 'sun', 'capteurs-climat': 'thermometer', 'volets-rideaux': 'blinds', 'controle-climatisation': 'ac',
  'routeurs-4g': 'router', 'alimentation-secours': 'battery', solaire: 'sun-medium',
};

export default function Icon({ name, size = 20, strokeWidth = 1.75, className = '', ...rest }: { name: IconName; size?: number; strokeWidth?: number } & SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false" className={`shrink-0 ${className}`} {...rest}>
      <path d={paths[name]} />
    </svg>
  );
}

export function GlyphIcon({ glyph, size = 20, className = '' }: { glyph: string; size?: number; className?: string }) {
  const name = glyphToIcon[glyph];
  return name ? <Icon name={name} size={size} className={className} /> : <span aria-hidden="true" className={className}>{glyph}</span>;
}
