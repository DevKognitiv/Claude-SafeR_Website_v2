export const leadTypes = ['diagnostic', 'project', 'contact', 'quote', 'callback', 'maintenance', 'warranty'] as const;
export type LeadType = (typeof leadTypes)[number];

export type LeadInput = {
  type: LeadType;
  name: string;
  phone: string;
  email?: string;
  organization?: string;
  subject?: string;
  message?: string;
  locale?: string;
  source?: string;
  payload?: Record<string, unknown>;
};

export const leadSchemaStatements = [
  `CREATE TABLE IF NOT EXISTS leads (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    organization TEXT,
    subject TEXT,
    message TEXT,
    locale TEXT,
    source TEXT,
    payload_json TEXT NOT NULL DEFAULT '{}',
    status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new','contacted','qualified','closed')),
    created_at TEXT NOT NULL
  )`,
  `CREATE INDEX IF NOT EXISTS idx_leads_status_created ON leads(status, created_at)`,
  `CREATE INDEX IF NOT EXISTS idx_leads_type ON leads(type)`,
] as const;

let schemaPromise: Promise<void> | null = null;

/** Resolves the D1 binding when running on Cloudflare (OpenAI Sites / Workers); null on a plain Node server. */
async function database(): Promise<D1Database | null> {
  try {
    const specifier = 'cloudflare:workers';
    const mod = (await import(/* @vite-ignore */ specifier)) as { env?: { DB?: D1Database } };
    return mod.env?.DB ?? null;
  } catch {
    return null;
  }
}

async function ensureSchema(db: D1Database) {
  if (!schemaPromise) {
    schemaPromise = db.batch(leadSchemaStatements.map((statement) => db.prepare(statement))).then(() => undefined).catch((error) => { schemaPromise = null; throw error; });
  }
  await schemaPromise;
}

/** Local fallback (Node runtime without D1): append-only JSON lines under .data/ so nothing is lost during local runs. */
async function saveLeadToFile(record: Record<string, unknown>) {
  const { appendFile, mkdir } = await import('node:fs/promises');
  await mkdir('.data', { recursive: true });
  await appendFile('.data/leads.jsonl', `${JSON.stringify(record)}\n`, 'utf8');
}

export async function saveLead(input: LeadInput): Promise<string> {
  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();
  const db = await database();
  if (!db) {
    await saveLeadToFile({ id, ...input, created_at: createdAt, storage: 'file' });
    return id;
  }
  await ensureSchema(db);
  await db.prepare(`INSERT INTO leads (id, type, name, phone, email, organization, subject, message, locale, source, payload_json, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
    .bind(id, input.type, input.name, input.phone, input.email ?? null, input.organization ?? null, input.subject ?? null, input.message ?? null, input.locale ?? null, input.source ?? null, JSON.stringify(input.payload ?? {}), createdAt)
    .run();
  return id;
}
