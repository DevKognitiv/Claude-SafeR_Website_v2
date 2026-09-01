export const maintenancePlans = ['a-la-demande', 'annuelle', 'premium'] as const;
export type MaintenancePlan = (typeof maintenancePlans)[number];
export const faqThemes = ['installation', 'application', 'alertes', 'paiement', 'confidentialite', 'equipements'] as const;
export type FaqTheme = (typeof faqThemes)[number];
export const guideIds = ['premiere-connexion', 'armer-desarmer', 'ajouter-utilisateur', 'gerer-alerte', 'entretien-camera', 'coupure-electricite'] as const;
export type GuideId = (typeof guideIds)[number];

export const isMaintenancePlan = (v: string): v is MaintenancePlan => (maintenancePlans as readonly string[]).includes(v);
export const isFaqTheme = (v: string): v is FaqTheme => (faqThemes as readonly string[]).includes(v);
export const isGuideId = (v: string): v is GuideId => (guideIds as readonly string[]).includes(v);
