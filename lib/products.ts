export type ProductFamilyId = 'guard-h2' | 'habitat-tsw' | 'vision-a4p' | 'door-d340' | 'link-gz3';

export type ProductFamily = {
  id: ProductFamilyId;
  safeRName: string;
  safeRReference: string;
  sourceEcosystem: string;
  sourceReference: string;
  storeSku: string;
  video: string;
  poster: string;
  accent: string;
};

/** Showroom families — structural data; texts live in d.solutions.showcase.families[id]. */
export const productFamilies: ProductFamily[] = [
  { id: 'guard-h2', safeRName: 'SafeR Guard H2·CI', safeRReference: 'SR-AJ-H2-4G-CI', sourceEcosystem: 'Ajax Systems', sourceReference: 'Hub 2 (4G) Jeweller', storeSku: 'AJ-HUB2-4G', video: 'https://videos.pexels.com/video-files/5744424/5744424-hd_1280_720_30fps.mp4', poster: '/media/safer-abidjan-showroom-v1.png', accent: '#52c6ff' },
  { id: 'habitat-tsw', safeRName: 'SafeR Habitat TSW·CI', safeRReference: 'SR-SF-1875-CI', sourceEcosystem: 'Somfy', sourceReference: 'TaHoma switch · réf. 1870595', storeSku: 'SF-TAHOMA-SW', video: 'https://videos.pexels.com/video-files/25951436/11923397_3840_2160_25fps.mp4', poster: '/media/safer-abidjan-showroom-v1.png', accent: '#4556f5' },
  { id: 'vision-a4p', safeRName: 'SafeR Vision A4P·CI', safeRReference: 'SR-RL-A4P-CI', sourceEcosystem: 'Reolink', sourceReference: 'Argus 4 Pro', storeSku: 'RL-ARGUS4PRO', video: 'https://videos.pexels.com/video-files/9795077/9795077-uhd_4096_2160_25fps.mp4', poster: '/media/safer-abidjan-showroom-v1.png', accent: '#52c6ff' },
  { id: 'door-d340', safeRName: 'SafeR Door D340·CI', safeRReference: 'SR-EF-T8214-CI', sourceEcosystem: 'eufy Security', sourceReference: 'Video Doorbell E340 · T8214111', storeSku: 'EF-T8214', video: 'https://videos.pexels.com/video-files/9305514/9305514-uhd_2160_4096_30fps.mp4', poster: '/media/safer-abidjan-showroom-v1.png', accent: '#4556f5' },
  { id: 'link-gz3', safeRName: 'SafeR Link GZ3·CI', safeRReference: 'SR-TY-GWZ3-100-CI', sourceEcosystem: 'SafeR (écosystème Tuya)', sourceReference: 'Zigbee 3.0 gateway · sf-ZB3-GW01', storeSku: 'sf-ZB3-GW01', video: 'https://videos.pexels.com/video-files/7966944/7966944-uhd_3840_2160_25fps.mp4', poster: '/media/safer-abidjan-showroom-v1.png', accent: '#52c6ff' },
];
