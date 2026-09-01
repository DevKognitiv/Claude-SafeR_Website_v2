import { leadTypes, saveLead, type LeadType } from '@/lib/leads';

export const dynamic = 'force-dynamic';

const phonePattern = /^\+?[0-9 .()-]{8,20}$/;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function clean(value: unknown, max: number): string {
  return typeof value === 'string' ? value.trim().replace(/\s+/g, ' ').slice(0, max) : '';
}

export async function POST(request: Request) {
  const origin = request.headers.get('origin');
  if (origin && origin !== new URL(request.url).origin) return Response.json({ error: 'forbidden' }, { status: 403 });
  if (!request.headers.get('content-type')?.includes('application/json')) return Response.json({ error: 'unsupported' }, { status: 415 });

  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return Response.json({ error: 'invalid' }, { status: 400 }); }

  // Honeypot: bots fill every field.
  if (clean(body.website, 200)) return Response.json({ ok: true, id: 'ignored' });

  const type = clean(body.type, 24) as LeadType;
  const name = clean(body.name, 120);
  const phone = clean(body.phone, 32);
  const email = clean(body.email, 160);
  const consent = body.consent === true;

  if (!leadTypes.includes(type)) return Response.json({ error: 'type' }, { status: 400 });
  if (!name || !phone || !phonePattern.test(phone)) return Response.json({ error: 'phone' }, { status: 400 });
  if (email && !emailPattern.test(email)) return Response.json({ error: 'email' }, { status: 400 });
  if (!consent) return Response.json({ error: 'consent' }, { status: 400 });

  const payload = typeof body.payload === 'object' && body.payload ? (body.payload as Record<string, unknown>) : {};
  try {
    const id = await saveLead({
      type, name, phone,
      email: email || undefined,
      organization: clean(body.organization, 160) || undefined,
      subject: clean(body.subject, 160) || undefined,
      message: clean(body.message, 2000) || undefined,
      locale: clean(body.locale, 8) || undefined,
      source: clean(body.source, 200) || undefined,
      payload: JSON.parse(JSON.stringify(payload).slice(0, 8000)),
    });
    return Response.json({ ok: true, id }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('lead save failed', error);
    return Response.json({ error: 'unavailable' }, { status: 503 });
  }
}
