import type { Dictionary } from '@/lib/i18n/dictionaries';

export type VerificationStatus = 'unverified' | 'verified' | 'certified';
export const verificationOrder: VerificationStatus[] = ['unverified', 'verified', 'certified'];
export const verificationColors: Record<VerificationStatus, string> = { unverified: '#a8b0c1', verified: '#52c6ff', certified: '#b8ff3d' };

export function isVerificationStatus(value: string): value is VerificationStatus {
  return (verificationOrder as string[]).includes(value);
}

export function verificationLevels(d: Dictionary) {
  return verificationOrder.map((status) => ({ status, color: verificationColors[status], ...d.partners.levels.items[status] }));
}

/** Canonical skill / zone identifiers (French labels are the stored values; translations come from d.partners.apply). */
export const partnerSkills = ['Alarme intrusion', 'Vidéo-surveillance', 'Contrôle d’accès', 'Domotique', 'Réseau & Wi-Fi', 'Électricité basse tension', 'Incendie'];
export const interventionZones = ['Abidjan Nord', 'Abidjan Sud', 'Abidjan Centre', 'Grand Abidjan', 'Bassam', 'Bingerville', 'Intérieur du pays'];

export function scorePartnerMatch(input: { requiredSkills: string[]; partnerSkills: string[]; zoneMatch: boolean; available: boolean; rating: number; status: VerificationStatus }) {
  const covered = input.requiredSkills.filter((skill) => input.partnerSkills.includes(skill)).length;
  const skillScore = input.requiredSkills.length ? (covered / input.requiredSkills.length) * 40 : 40;
  const statusScore = input.status === 'certified' ? 10 : input.status === 'verified' ? 6 : 0;
  return Math.round(skillScore + (input.zoneMatch ? 25 : 0) + (input.available ? 15 : 0) + Math.min(input.rating / 5, 1) * 10 + statusScore);
}
