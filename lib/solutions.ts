export type SolutionDetail = {
  slug: string;
  title: string;
  short: string;
  description: string;
  included: string[];
};

export type Solution = {
  slug: string;
  eyebrow: string;
  title: string;
  summary: string;
  description: string;
  image: string;
  accent: string;
  benefits: string[];
  details: SolutionDetail[];
};

export const solutions: Solution[] = [
  {
    slug: 'video-intelligente',
    eyebrow: 'Vision & analyse',
    title: 'Vidéo intelligente',
    summary: 'Voyez ce qui compte. Ignorez le bruit.',
    description: 'Une chaîne vidéo pensée pour vérifier rapidement, réduire les fausses alertes et garder un œil sur votre maison, même à distance.',
    image: 'https://images.pexels.com/photos/35551115/pexels-photo-35551115/free-photo-of-minimalistic-security-camera-on-modern-building.jpeg?auto=compress&dpr=1&h=1100&w=1800',
    accent: '#52C6FF',
    benefits: ['Vision nocturne haute définition', 'Zones de détection personnalisables', 'Alertes vidéo qualifiées', 'Accès sécurisé depuis mobile et web'],
    details: [
      { slug: 'cameras-exterieures', title: 'Caméras extérieures IA', short: 'Périmètre', description: 'Surveillez accès, cour et façade avec une image nette, une détection ciblée et une conception adaptée à l’extérieur.', included: ['Caméra HD résistante aux intempéries', 'Vision nocturne', 'Détection de zones', 'Historique sécurisé'] },
      { slug: 'sonnette-video', title: 'Sonnette vidéo', short: 'Accueil', description: 'Voyez, échangez et décidez avant d’ouvrir, depuis l’application SafeR.', included: ['Audio bidirectionnel', 'Vue grand-angle', 'Alertes visiteurs', 'Ouverture connectée en option'] },
      { slug: 'verification-video', title: 'Vérification vidéo 24/7', short: 'Monitoring', description: 'Donnez à notre centre de veille les éléments utiles pour qualifier une situation et engager le bon protocole.', included: ['Séquences liées aux alertes', 'Qualification humaine', 'Journal d’événements', 'Escalade selon consignes'] },
    ],
  },
  {
    slug: 'alarmes-connectees',
    eyebrow: 'Détection & alerte',
    title: 'Alarmes connectées',
    summary: 'Détecter tôt. Réagir juste.',
    description: 'Intrusion, fumée, chaleur ou appel d’urgence : chaque signal rejoint une plateforme commune et un protocole clair.',
    image: 'https://images.pexels.com/photos/430208/pexels-photo-430208.jpeg?auto=compress&dpr=1&h=1100&w=1800',
    accent: '#4556F5',
    benefits: ['Autonomie de secours selon configuration', 'Double connectivité disponible', 'Sirène et notifications immédiates', 'Centre de veille SafeR 24/7'],
    details: [
      { slug: 'detection-intrusion', title: 'Détection intrusion', short: 'Accès', description: 'Une protection coordonnée des portes, fenêtres et zones de passage, adaptée à votre manière de vivre.', included: ['Contacts d’ouverture', 'Détecteurs de mouvement', 'Sirène intérieure', 'Modes présence et absence'] },
      { slug: 'detection-incendie', title: 'Détection incendie', short: 'Risques', description: 'Repérez fumée et hausse anormale de température, même lorsque personne n’est sur place.', included: ['Détecteur de fumée', 'Alerte mobile', 'Signal au centre de veille', 'Contrôle périodique'] },
      { slug: 'bouton-sos', title: 'Bouton SOS', short: 'Urgence', description: 'Déclenchez un protocole d’assistance en un geste depuis un point fixe ou l’application.', included: ['Déclenchement discret', 'Contacts prioritaires', 'Localisation du site', 'Journal de prise en charge'] },
    ],
  },
  {
    slug: 'controle-acces',
    eyebrow: 'Entrées & identités',
    title: 'Contrôle d’accès',
    summary: 'La bonne personne. Au bon endroit. Au bon moment.',
    description: 'Simplifiez l’entrée des proches, employés, visiteurs et prestataires sans perdre la maîtrise des autorisations.',
    image: 'https://images.pexels.com/photos/279810/pexels-photo-279810.jpeg?auto=compress&dpr=1&h=1100&w=1800',
    accent: '#52C6FF',
    benefits: ['Droits temporaires ou permanents', 'Historique des passages', 'Ouverture à distance', 'Révocation immédiate des accès'],
    details: [
      { slug: 'portails-connectes', title: 'Portails connectés', short: 'Véhicules', description: 'Ouvrez, fermez et vérifiez l’état de votre portail depuis une interface simple.', included: ['Module de commande', 'État ouvert ou fermé', 'Accès temporaires', 'Journal des actions'] },
      { slug: 'serrures-intelligentes', title: 'Serrures intelligentes', short: 'Portes', description: 'Gérez les accès sans multiplier les clés physiques et gardez une trace utile des entrées.', included: ['Codes individuels', 'Plages horaires', 'Verrouillage à distance', 'Alerte porte ouverte'] },
      { slug: 'gestion-visiteurs', title: 'Gestion des visiteurs', short: 'Accueil', description: 'Préautorisez une visite et fluidifiez le passage au poste de garde ou à l’accueil.', included: ['Invitation numérique', 'QR code temporaire', 'Validation par le résident', 'Traçabilité du passage'] },
    ],
  },
  {
    slug: 'domotique',
    eyebrow: 'Confort & maîtrise',
    title: 'Maison intelligente',
    summary: 'Votre sécurité devient un réflexe de la maison.',
    description: 'Reliez éclairage, climatisation, accès et capteurs pour créer des scénarios utiles, économes et rassurants.',
    image: 'https://images.pexels.com/videos/25951436/adjust-automation-bedroom-button-25951436.jpeg?auto=compress&dpr=1&h=1100&w=1800',
    accent: '#4556F5',
    benefits: ['Scénarios présence et absence', 'Pilotage à distance', 'Automatisations horaires', 'Extension progressive du système'],
    details: [
      { slug: 'scenarios-intelligents', title: 'Scénarios intelligents', short: 'Automatisation', description: 'Déclenchez plusieurs actions en un geste : départ, retour, nuit ou vacances.', included: ['Scène départ', 'Scène retour', 'Mode nuit', 'Personnalisation dans l’application'] },
      { slug: 'pilotage-energie', title: 'Pilotage de l’énergie', short: 'Efficacité', description: 'Maîtrisez éclairage et climat en fonction des horaires, de la présence et de vos priorités.', included: ['Programmations horaires', 'Commandes distantes', 'Routines par zone', 'Suivi d’usage indicatif'] },
      { slug: 'detection-fuites', title: 'Détection des fuites', short: 'Prévention', description: 'Recevez une alerte dès qu’une présence d’eau inhabituelle est détectée dans une zone sensible.', included: ['Capteurs de fuite', 'Alerte instantanée', 'Historique', 'Électrovanne connectée en option'] },
    ],
  },
];

export function getSolution(slug: string) {
  return solutions.find((solution) => solution.slug === slug);
}

export function getSolutionDetail(category: string, slug: string) {
  const solution = getSolution(category);
  const detail = solution?.details.find((item) => item.slug === slug);
  return solution && detail ? { solution, detail } : undefined;
}
