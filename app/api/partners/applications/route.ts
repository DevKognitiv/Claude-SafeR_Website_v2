import { getChatGPTUser } from '@/app/chatgpt-auth';
import { ensurePartnerSchema, getPartnerDatabase } from '@/lib/partner-db';
import { interventionZones, partnerSkills } from '@/lib/partner-verification';

export const dynamic = 'force-dynamic';

const professionalTypes = new Set(['independent', 'company', 'employee']);
const allowedSkills = new Set(partnerSkills);
const allowedZones = new Set(interventionZones);

function clean(value: unknown, max: number) {
  return typeof value === 'string' ? value.trim().replace(/\s+/g, ' ').slice(0, max) : '';
}

function sameOrigin(request: Request) {
  const origin = request.headers.get('origin');
  return !origin || origin === new URL(request.url).origin;
}

export async function POST(request: Request) {
  const user = await getChatGPTUser();
  if (!user) return Response.json({ error: 'Authentification requise.' }, { status: 401 });
  if (!sameOrigin(request)) return Response.json({ error: 'Origine de requête refusée.' }, { status: 403 });
  if (!request.headers.get('content-type')?.includes('application/json')) return Response.json({ error: 'Format de requête invalide.' }, { status: 415 });

  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return Response.json({ error: 'Données invalides.' }, { status: 400 }); }

  const legalName = clean(body.legalName, 120);
  const tradeName = clean(body.tradeName, 120);
  const phone = clean(body.phone, 32);
  const commune = clean(body.commune, 80);
  const companyRegistration = clean(body.companyRegistration, 80);
  const professionalType = clean(body.professionalType, 24);
  const experienceYears = Math.max(0, Math.min(50, Number(body.experienceYears) || 0));
  const skills = Array.isArray(body.skills) ? body.skills.filter((item): item is string => typeof item === 'string' && allowedSkills.has(item)).slice(0, 12) : [];
  const zones = Array.isArray(body.zones) ? body.zones.filter((item): item is string => typeof item === 'string' && allowedZones.has(item)).slice(0, 10) : [];
  const acceptedCode = body.acceptedCode === true;
  const consent = body.consent === true;

  if (!legalName || !phone || !commune || !professionalTypes.has(professionalType) || skills.length === 0 || zones.length === 0 || !acceptedCode || !consent) {
    return Response.json({ error: 'Complétez les champs obligatoires et acceptez les engagements.' }, { status: 400 });
  }
  if (professionalType === 'company' && !companyRegistration) return Response.json({ error: 'Le numéro RCCM ou l’identifiant d’entreprise est requis.' }, { status: 400 });

  await ensurePartnerSchema();
  const database = await getPartnerDatabase();
  const existing = await database.prepare('SELECT id FROM partners WHERE user_id = ? LIMIT 1').bind(user.id).first<{ id: string }>();
  const id = existing?.id || crypto.randomUUID();
  const now = new Date().toISOString();
  await database.prepare(`INSERT INTO partners (
    id, user_id, email, full_name, legal_name, trade_name, phone, commune, professional_type,
    company_registration, experience_years, skills_json, zones_json, verification_status,
    application_stage, accepted_code, consent_version, created_at, updated_at
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'unverified', 'kyc_pending', 1, '2026-08-31', ?, ?)
  ON CONFLICT(user_id) DO UPDATE SET
    email=excluded.email, full_name=excluded.full_name, legal_name=excluded.legal_name,
    trade_name=excluded.trade_name, phone=excluded.phone, commune=excluded.commune,
    professional_type=excluded.professional_type, company_registration=excluded.company_registration,
    experience_years=excluded.experience_years, skills_json=excluded.skills_json,
    zones_json=excluded.zones_json, accepted_code=1, consent_version=excluded.consent_version,
    updated_at=excluded.updated_at`).bind(
      id, user.id, user.email, user.name, legalName, tradeName || null, phone, commune, professionalType,
      companyRegistration || null, experienceYears, JSON.stringify(skills), JSON.stringify(zones), now, now
    ).run();

  return Response.json({ ok: true, partnerId: id, status: 'unverified', next: 'kyc_document' }, { headers: { 'Cache-Control': 'no-store' } });
}
