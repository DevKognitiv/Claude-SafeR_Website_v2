import manifest from '@/data/page-images.json';

/**
 * Page image slots.
 *
 * Every hero / visual on the site is bound to a slot. A slot resolves to
 * `/media/pages/<slot>.jpg` when such a file exists (registered at build time in
 * data/page-images.json by scripts/build-image-manifest.mjs), otherwise to a
 * curated stock fallback. The photographic brief for each slot lives in
 * docs/BRIEF-IMAGES.md; alt texts live in the dictionaries (`d.images.<slot>`).
 */
export const IMAGE_SLOTS = [
  'home',
  'showroom',
  'solutions',
  'solution-video',
  'solution-alarme',
  'solution-acces',
  'solution-domotique',
  'store',
  'offers',
  'collective',
  'partners',
  'support',
  'maintenance',
  'about',
  'contact',
  'catalogue',
  'diagnostic',
  'legal',
] as const;

/** Slots with an alt text in the dictionaries (`d.images.<slot>`). */
export type ImageSlot = (typeof IMAGE_SLOTS)[number];

/** Video poster slots of the showroom (alt text comes from the showcase copy). */
export const POSTER_SLOTS = ['showroom-guard', 'showroom-habitat', 'showroom-vision', 'showroom-door', 'showroom-link'] as const;
export type PosterSlot = (typeof POSTER_SLOTS)[number];
export type AnyImageSlot = ImageSlot | PosterSlot;

const pexels = (id: string, w = 1800, h = 1100) => `https://images.pexels.com/photos/${id}.jpeg?auto=compress&dpr=1&h=${h}&w=${w}`;

const SHOWROOM = '/media/safer-abidjan-showroom-v1.png';
const CAMERA = pexels('35551115/pexels-photo-35551115/free-photo-of-minimalistic-security-camera-on-modern-building');
const KEYPAD = pexels('430208/pexels-photo-430208');
const GATE = pexels('279810/pexels-photo-279810');
const BEDROOM = 'https://images.pexels.com/videos/25951436/adjust-automation-bedroom-button-25951436.jpeg?auto=compress&dpr=1&h=1100&w=1800';
const CONTROL_ROOM = pexels('30692441/pexels-photo-30692441/free-photo-of-security-officer-in-dark-control-room-with-monitors');
const TECHNICIAN = pexels('4481326/pexels-photo-4481326', 1400, 1000);
// Abidjan, Plateau waterfront skyline (Jean Marc Bonnel, Pexels licence)
const PLATEAU_SKYLINE = pexels('18435332/pexels-photo-18435332');
const PLATEAU_MOODY = pexels('16941456/pexels-photo-16941456');

/** Curated fallbacks used until the Côte d’Ivoire photo set is dropped in public/media/pages/. */
export const IMAGE_FALLBACKS: Record<AnyImageSlot, string> = {
  home: SHOWROOM,
  showroom: SHOWROOM,
  solutions: CAMERA,
  'solution-video': CAMERA,
  'solution-alarme': KEYPAD,
  'solution-acces': GATE,
  'solution-domotique': BEDROOM,
  store: SHOWROOM,
  offers: BEDROOM,
  collective: GATE,
  partners: TECHNICIAN,
  support: CONTROL_ROOM,
  maintenance: TECHNICIAN,
  about: PLATEAU_SKYLINE,
  contact: CONTROL_ROOM,
  catalogue: SHOWROOM,
  diagnostic: BEDROOM,
  legal: PLATEAU_MOODY,
  'showroom-guard': KEYPAD,
  'showroom-habitat': BEDROOM,
  'showroom-vision': CAMERA,
  'showroom-door': GATE,
  'showroom-link': SHOWROOM,
};

const localImages = manifest as Partial<Record<string, string>>;

export type ResolvedImage = { src: string; fallback: string; local: boolean };

/** Resolve a slot to its best available source plus a fallback for `onError`. */
export function pageImage(slot: AnyImageSlot): ResolvedImage {
  const local = localImages[slot];
  const fallback = IMAGE_FALLBACKS[slot];
  return local ? { src: local, fallback, local: true } : { src: fallback, fallback, local: false };
}

/** Slot used by the four solution families. */
export function solutionImageSlot(slug: string): ImageSlot {
  switch (slug) {
    case 'video-intelligente':
      return 'solution-video';
    case 'alarmes-connectees':
      return 'solution-alarme';
    case 'controle-acces':
      return 'solution-acces';
    case 'domotique':
      return 'solution-domotique';
    default:
      return 'solutions';
  }
}
