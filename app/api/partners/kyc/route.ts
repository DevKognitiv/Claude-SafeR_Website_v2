import { getChatGPTUser } from '@/app/chatgpt-auth';
import { ensurePartnerSchema, getKycBucket, getPartnerDatabase } from '@/lib/partner-db';

export const dynamic = 'force-dynamic';

const allowedTypes = new Set(['application/pdf', 'image/jpeg', 'image/png']);
const maxBytes = 5 * 1024 * 1024;

export async function POST(request: Request) {
  const user = await getChatGPTUser();
  if (!user) return Response.json({ error: 'Authentification requise.' }, { status: 401 });
  const origin = request.headers.get('origin');
  if (origin && origin !== new URL(request.url).origin) return Response.json({ error: 'Origine de requête refusée.' }, { status: 403 });

  let form: FormData;
  try { form = await request.formData(); } catch { return Response.json({ error: 'Document illisible.' }, { status: 400 }); }
  const file = form.get('document');
  if (!(file instanceof File)) return Response.json({ error: 'Sélectionnez un document.' }, { status: 400 });
  if (!allowedTypes.has(file.type) || file.size === 0 || file.size > maxBytes) return Response.json({ error: 'Formats acceptés : PDF, JPG ou PNG, 5 Mo maximum.' }, { status: 400 });

  await ensurePartnerSchema();
  const database = await getPartnerDatabase();
  const partner = await database.prepare('SELECT id FROM partners WHERE user_id = ? LIMIT 1').bind(user.id).first<{ id: string }>();
  if (!partner) return Response.json({ error: 'Créez d’abord votre profil partenaire.' }, { status: 409 });

  const extension = file.type === 'application/pdf' ? 'pdf' : file.type === 'image/png' ? 'png' : 'jpg';
  const documentId = crypto.randomUUID();
  const objectKey = `partners/${partner.id}/${documentId}.${extension}`;
  await (await getKycBucket()).put(objectKey, file.stream(), {
    httpMetadata: { contentType: file.type },
    customMetadata: { partnerId: partner.id, documentType: 'identity', uploadedAt: new Date().toISOString() }
  });

  const now = new Date().toISOString();
  await database.batch([
    database.prepare(`INSERT INTO kyc_documents (id, partner_id, object_key, document_type, original_name, content_type, size_bytes, review_status, created_at)
      VALUES (?, ?, ?, 'identity', ?, ?, ?, 'pending', ?)`).bind(documentId, partner.id, objectKey, file.name.slice(0, 160), file.type, file.size, now),
    database.prepare(`UPDATE partners SET application_stage = 'review_pending', updated_at = ? WHERE id = ?`).bind(now, partner.id)
  ]);

  return Response.json({ ok: true, reviewStatus: 'pending' }, { headers: { 'Cache-Control': 'no-store' } });
}
