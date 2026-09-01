import { partnerSchemaStatements } from '@/db/schema';

type Bindings = { DB?: D1Database; KYC_FILES?: R2Bucket };
let bindingsPromise: Promise<Bindings> | null = null;

/** Cloudflare bindings (D1, R2) — resolved lazily so the module also loads on a plain Node server. */
async function bindings(): Promise<Bindings> {
  if (!bindingsPromise) {
    const specifier = 'cloudflare:workers';
    bindingsPromise = import(/* @vite-ignore */ specifier).then((mod: { env?: Bindings }) => mod.env ?? {}).catch(() => ({}));
  }
  return bindingsPromise;
}

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

export async function getPartnerDatabase(): Promise<D1Database> {
  const { DB } = await bindings();
  if (!DB) throw new Error('La base partenaires SafeR n’est pas disponible.');
  return DB;
}

export async function getKycBucket(): Promise<R2Bucket> {
  const { KYC_FILES } = await bindings();
  if (!KYC_FILES) throw new Error('Le stockage KYC SafeR n’est pas disponible.');
  return KYC_FILES;
}

export async function ensurePartnerSchema() {
  if (!schemaPromise) {
    const database = await getPartnerDatabase();
    schemaPromise = database.batch(partnerSchemaStatements.map((statement) => database.prepare(statement))).then(() => undefined).catch((error) => {
      schemaPromise = null;
      throw error;
    });
  }
  await schemaPromise;
}

export async function getPartnerByUserId(userId: string) {
  await ensurePartnerSchema();
  return (await getPartnerDatabase()).prepare('SELECT * FROM partners WHERE user_id = ? LIMIT 1').bind(userId).first<PartnerRecord>();
}

export async function countPartnerDocuments(partnerId: string) {
  await ensurePartnerSchema();
  const row = await (await getPartnerDatabase()).prepare('SELECT COUNT(*) AS count FROM kyc_documents WHERE partner_id = ?').bind(partnerId).first<{ count: number }>();
  return Number(row?.count || 0);
}
