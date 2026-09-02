import type { Dictionary } from '@/lib/i18n/dictionaries';
import type { ImageSlot } from '@/lib/images';

export type SolutionSlug = 'video-intelligente' | 'alarmes-connectees' | 'controle-acces' | 'domotique';

export type SolutionStructure = {
  slug: SolutionSlug;
  image: ImageSlot;
  accent: string;
  details: string[];
};

/** Structural data only — every text lives in the dictionaries (d.solutions.items[slug]). */
export const solutionStructures: SolutionStructure[] = [
  { slug: 'video-intelligente', image: 'solution-video', accent: '#52C6FF', details: ['cameras-exterieures', 'sonnette-video', 'verification-video'] },
  { slug: 'alarmes-connectees', image: 'solution-alarme', accent: '#4556F5', details: ['detection-intrusion', 'detection-incendie', 'bouton-sos'] },
  { slug: 'controle-acces', image: 'solution-acces', accent: '#52C6FF', details: ['portails-connectes', 'serrures-intelligentes', 'gestion-visiteurs'] },
  { slug: 'domotique', image: 'solution-domotique', accent: '#4556F5', details: ['scenarios-intelligents', 'pilotage-energie', 'detection-fuites'] },
];

export type SolutionCopy = Dictionary['solutions']['items'][SolutionSlug];
export type SolutionDetailCopy = { title: string; short: string; description: string; included: string[]; useCases: string[][]; faq: string[][] };

export function isSolutionSlug(value: string): value is SolutionSlug {
  return solutionStructures.some((s) => s.slug === value);
}

export function getSolutionStructure(slug: string): SolutionStructure | undefined {
  return solutionStructures.find((s) => s.slug === slug);
}

export function getSolutionCopy(d: Dictionary, slug: SolutionSlug): SolutionCopy {
  return d.solutions.items[slug];
}

export function getDetailCopy(d: Dictionary, slug: SolutionSlug, detail: string): SolutionDetailCopy | undefined {
  const details = d.solutions.items[slug].details as Record<string, SolutionDetailCopy>;
  return details[detail];
}
