export type VerificationStatus = 'unverified' | 'verified' | 'certified';

export const verificationLevels = [
  {
    status: 'unverified' as const,
    label: 'Non vérifié',
    color: '#a8b0c1',
    summary: 'Profil créé, identité et compétences encore en cours de contrôle.',
    criteria: ['Compte identifié et coordonnées confirmées', 'Code de conduite et consentement KYC acceptés', 'Dossier documentaire déposé dans l’espace sécurisé']
  },
  {
    status: 'verified' as const,
    label: 'Vérifié',
    color: '#52c6ff',
    summary: 'Identité, activité et socle technique validés par SafeR.',
    criteria: ['Pièce d’identité authentifiée et correspondance avec le candidat', 'Téléphone, adresse et activité professionnelle contrôlés', 'Références vérifiables et test technique ≥ 75 %', 'Contrôle humain sans indicateur de risque critique ouvert']
  },
  {
    status: 'certified' as const,
    label: 'Certifié SafeR',
    color: '#b8ff3d',
    summary: 'Partenaire expérimenté, audité et formé aux standards d’installation SafeR.',
    criteria: ['Statut Vérifié depuis au moins 90 jours', 'Au moins 10 missions terminées et 5 évaluations', 'Note moyenne ≥ 4,6/5 sans incident critique non résolu', 'Formation sécurité et parcours SafeR Academy valides', 'Audit qualité réussi et recertification annuelle']
  }
];

export const partnerSkills = ['Alarme intrusion', 'Vidéo-surveillance', 'Contrôle d’accès', 'Domotique', 'Réseau & Wi-Fi', 'Électricité basse tension', 'Incendie'];
export const interventionZones = ['Abidjan Nord', 'Abidjan Sud', 'Abidjan Centre', 'Grand Abidjan', 'Bassam', 'Bingerville', 'Intérieur du pays'];

export function scorePartnerMatch(input: { requiredSkills: string[]; partnerSkills: string[]; zoneMatch: boolean; available: boolean; rating: number; status: VerificationStatus }) {
  const covered = input.requiredSkills.filter((skill) => input.partnerSkills.includes(skill)).length;
  const skillScore = input.requiredSkills.length ? (covered / input.requiredSkills.length) * 40 : 40;
  const statusScore = input.status === 'certified' ? 10 : input.status === 'verified' ? 6 : 0;
  return Math.round(skillScore + (input.zoneMatch ? 25 : 0) + (input.available ? 15 : 0) + Math.min(input.rating / 5, 1) * 10 + statusScore);
}
