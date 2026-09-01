import { env } from 'cloudflare:workers';
import { partnerSchemaStatements } from '@/db/schema';

export type PartnerRecord = {
  id: string;
  user_id: string;
  email: string;
  full_name: string;
  legal_name: string;
  trade_name: string | null;
  phone: string;
  commune: string;
  professional_type: string;
  company_registration: string | null;
  experience_years: number;
  skills_json: string;
  zones_json: string;
  verification_status: 'unverified' | 'verified' | 'certified';
  application_stage: string;
  technical_score: number;
  completed_missions: number;
  average_rating: number;
  created_at: string;
  updated_at: string;
};

let schemaPromise: Promise<void> | null = null;

export function getPartnerDatabase() {
  if (!env.DB) throw new Error('La base partenaires SafeR n’est pas disponible.');
  return env.DB;
}

export function getKycBucket() {
  if (!env.KYC_FILES) throw new Error('Le stockage KYC SafeR n’est pas disponible.');
  return env.KYC_FILES;
}

export async function ensurePartnerSchema() {
  if (!schemaPromise) {
    const database = getPartnerDatabase();
    schemaPromise = database.batch(partnerSchemaStatements.map((statement) => database.prepare(statement))).then(() => undefined).catch((error) => {
      schemaPromise = null;
      throw error;
    });
  }
  await schemaPromise;
}

export async function getPartnerByUserId(userId: string) {
  await ensurePartnerSchema();
  return getPartnerDatabase().prepare('SELECT * FROM partners WHERE user_id = ? LIMIT 1').bind(userId).first<PartnerRecord>();
}

export async function countPartnerDocuments(partnerId: string) {
  await ensurePartnerSchema();
  const row = await getPartnerDatabase().prepare('SELECT COUNT(*) AS count FROM kyc_documents WHERE partner_id = ?').bind(partnerId).first<{ count: number }>();
  return Number(row?.count || 0);
}
