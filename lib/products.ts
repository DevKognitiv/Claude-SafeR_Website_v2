export type ProductFamily = {
  id: string;
  safeRName: string;
  safeRReference: string;
  sourceEcosystem: string;
  sourceReference: string;
  category: string;
  promise: string;
  description: string;
  features: string[];
  context: string;
  video: string;
  poster: string;
  accent: string;
};

export const productFamilies: ProductFamily[] = [
  {
    id: 'guard-h2',
    safeRName: 'SafeR Guard H2·CI',
    safeRReference: 'SR-AJ-H2-4G-CI',
    sourceEcosystem: 'Ajax Systems',
    sourceReference: 'Hub 2 (4G) Jeweller',
    category: 'Centrale de sécurité',
    promise: 'Le cerveau résilient de votre protection.',
    description: 'Une centrale multi-canal pensée pour maintenir le lien entre capteurs, application et centre de veille, même lorsque la connexion principale devient instable.',
    features: ['Ethernet + double SIM selon configuration', 'Alertes et scénarios coordonnés', 'Supervision SafeR 24/7'],
    context: 'Villas, appartements et commerces · Abidjan',
    video: 'https://videos.pexels.com/video-files/5744424/5744424-hd_1280_720_30fps.mp4',
    poster: '/media/safer-abidjan-showroom-v1.png',
    accent: '#52c6ff',
  },
  {
    id: 'habitat-tsw',
    safeRName: 'SafeR Habitat TSW·CI',
    safeRReference: 'SR-SF-1875-CI',
    sourceEcosystem: 'Somfy',
    sourceReference: 'TaHoma switch · réf. 1870595',
    category: 'Hub domotique',
    promise: 'Votre maison s’adapte à votre rythme.',
    description: 'Centralisez portail, éclairage, ouvrants et scénarios de confort dans une expérience SafeR simple, évolutive et installée par un professionnel.',
    features: ['Scénarios départ, retour et nuit', 'Pilotage des ouvrants et accès', 'Automatisations confort et énergie'],
    context: 'Résidences urbaines · Cocody, Marcory, Bingerville',
    video: 'https://videos.pexels.com/video-files/25951436/11923397_3840_2160_25fps.mp4',
    poster: '/media/safer-abidjan-showroom-v1.png',
    accent: '#4556f5',
  },
  {
    id: 'vision-a4p',
    safeRName: 'SafeR Vision A4P·CI',
    safeRReference: 'SR-RL-A4P-CI',
    sourceEcosystem: 'Reolink',
    sourceReference: 'Argus 4 Pro',
    category: 'Caméra extérieure',
    promise: 'Une vue large, nette et utile.',
    description: 'Surveillez cour, façade et accès avec une couverture panoramique, des alertes ciblées et un accès vidéo sécurisé depuis votre espace SafeR.',
    features: ['Vision panoramique', 'Détection ciblée', 'Mode extérieur et alertes mobiles'],
    context: 'Cours, portails et périmètres tropicaux',
    video: 'https://videos.pexels.com/video-files/9795077/9795077-uhd_4096_2160_25fps.mp4',
    poster: '/media/safer-abidjan-showroom-v1.png',
    accent: '#52c6ff',
  },
  {
    id: 'door-d340',
    safeRName: 'SafeR Door D340·CI',
    safeRReference: 'SR-EF-T8214-CI',
    sourceEcosystem: 'eufy Security',
    sourceReference: 'Video Doorbell E340 · T8214111',
    category: 'Sonnette vidéo',
    promise: 'Savoir qui est là avant d’ouvrir.',
    description: 'Une expérience d’accueil vidéo pensée pour les livraisons, visiteurs et accès familiaux, avec visualisation depuis le téléphone et historique utile.',
    features: ['Double angle de vue', 'Vision nocturne couleur', 'Audio bidirectionnel'],
    context: 'Entrées de villas et appartements · Grand Abidjan',
    video: 'https://videos.pexels.com/video-files/9305514/9305514-uhd_2160_4096_30fps.mp4',
    poster: '/media/safer-abidjan-showroom-v1.png',
    accent: '#4556f5',
  },
  {
    id: 'link-gz3',
    safeRName: 'SafeR Link GZ3·CI',
    safeRReference: 'SR-TY-GWZ3-100-CI',
    sourceEcosystem: 'TuyaOS / Powered by Tuya',
    sourceReference: 'Wired & Wireless Smart Gateway PCBA · Zigbee 3.0',
    category: 'Passerelle multi-équipements',
    promise: 'Un seul lien pour une maison qui évolue.',
    description: 'Une passerelle d’intégration pour capteurs, éclairage, prises et automatismes compatibles. Le PID OEM définitif est conservé dans le dossier technique SafeR.',
    features: ['Zigbee 3.0, Wi-Fi et LAN selon version', 'Scènes locales et contrôle à distance', 'Traçabilité PID et firmware par lot'],
    context: 'Déploiements évolutifs · Maison, quartier, petit tertiaire',
    video: 'https://videos.pexels.com/video-files/7966944/7966944-uhd_3840_2160_25fps.mp4',
    poster: '/media/safer-abidjan-showroom-v1.png',
    accent: '#52c6ff',
  },
];
