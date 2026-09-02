import type { PosterSlot } from '@/lib/images';
export type ProductFamilyId = 'guard-h2' | 'habitat-tsw' | 'vision-a4p' | 'door-d340' | 'link-gz3';

export type ProductFamily = {
  id: ProductFamilyId;
  safeRName: string;
  storeSku: string;
  video: string;
  poster: PosterSlot;
  accent: string;
};

/** Showroom families — structural data; texts live in d.solutions.showcase.families[id]. */
export const productFamilies: ProductFamily[] = [
  { id: 'guard-h2', safeRName: 'SafeR Guard', storeSku: 'AJ-HUB2-4G', video: 'https://videos.pexels.com/video-files/5744424/5744424-hd_1280_720_30fps.mp4', poster: 'showroom-guard', accent: '#52c6ff' },
  { id: 'habitat-tsw', safeRName: 'SafeR Habitat', storeSku: 'SF-TAHOMA-SW', video: 'https://videos.pexels.com/video-files/25951436/11923397_3840_2160_25fps.mp4', poster: 'showroom-habitat', accent: '#4556f5' },
  { id: 'vision-a4p', safeRName: 'SafeR Vision', storeSku: 'RL-ARGUS4PRO', video: 'https://videos.pexels.com/video-files/9795077/9795077-uhd_4096_2160_25fps.mp4', poster: 'showroom-vision', accent: '#52c6ff' },
  { id: 'door-d340', safeRName: 'SafeR Door', storeSku: 'EF-T8214', video: 'https://videos.pexels.com/video-files/9305514/9305514-uhd_2160_4096_30fps.mp4', poster: 'showroom-door', accent: '#4556f5' },
  { id: 'link-gz3', safeRName: 'SafeR Link', storeSku: 'sf-ZB3-GW01', video: 'https://videos.pexels.com/video-files/7966944/7966944-uhd_3840_2160_25fps.mp4', poster: 'showroom-link', accent: '#52c6ff' },
];
