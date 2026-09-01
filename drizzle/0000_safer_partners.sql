CREATE TABLE IF NOT EXISTS partners (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  legal_name TEXT NOT NULL,
  trade_name TEXT,
  phone TEXT NOT NULL,
  commune TEXT NOT NULL,
  professional_type TEXT NOT NULL,
  company_registration TEXT,
  experience_years INTEGER NOT NULL DEFAULT 0,
  skills_json TEXT NOT NULL,
  zones_json TEXT NOT NULL,
  verification_status TEXT NOT NULL DEFAULT 'unverified' CHECK (verification_status IN ('unverified','verified','certified')),
  application_stage TEXT NOT NULL DEFAULT 'kyc_pending',
  technical_score INTEGER NOT NULL DEFAULT 0,
  completed_missions INTEGER NOT NULL DEFAULT 0,
  average_rating REAL NOT NULL DEFAULT 0,
  accepted_code INTEGER NOT NULL DEFAULT 0,
  consent_version TEXT NOT NULL,
  verified_at TEXT,
  certified_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_partners_user_id ON partners(user_id);
CREATE INDEX IF NOT EXISTS idx_partners_status_zone ON partners(verification_status, commune);
CREATE TABLE IF NOT EXISTS kyc_documents (
  id TEXT PRIMARY KEY,
  partner_id TEXT NOT NULL,
  object_key TEXT NOT NULL UNIQUE,
  document_type TEXT NOT NULL,
  original_name TEXT NOT NULL,
  content_type TEXT NOT NULL,
  size_bytes INTEGER NOT NULL,
  review_status TEXT NOT NULL DEFAULT 'pending' CHECK (review_status IN ('pending','accepted','rejected')),
  created_at TEXT NOT NULL,
  reviewed_at TEXT,
  FOREIGN KEY(partner_id) REFERENCES partners(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_kyc_documents_partner ON kyc_documents(partner_id, review_status);
CREATE TABLE IF NOT EXISTS installation_missions (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  commune TEXT NOT NULL,
  required_skills_json TEXT NOT NULL,
  scheduled_for TEXT,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open','matched','accepted','in_progress','completed','cancelled')),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_missions_status_commune ON installation_missions(status, commune);
CREATE TABLE IF NOT EXISTS mission_matches (
  id TEXT PRIMARY KEY,
  mission_id TEXT NOT NULL,
  partner_id TEXT NOT NULL,
  match_score INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'proposed' CHECK (status IN ('proposed','accepted','declined','expired')),
  created_at TEXT NOT NULL,
  UNIQUE(mission_id, partner_id),
  FOREIGN KEY(mission_id) REFERENCES installation_missions(id) ON DELETE CASCADE,
  FOREIGN KEY(partner_id) REFERENCES partners(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_matches_partner_status ON mission_matches(partner_id, status);
CREATE TABLE IF NOT EXISTS partner_reviews (
  id TEXT PRIMARY KEY,
  partner_id TEXT NOT NULL,
  mission_id TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  quality_flags_json TEXT NOT NULL DEFAULT '[]',
  created_at TEXT NOT NULL,
  UNIQUE(partner_id, mission_id),
  FOREIGN KEY(partner_id) REFERENCES partners(id) ON DELETE CASCADE,
  FOREIGN KEY(mission_id) REFERENCES installation_missions(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_reviews_partner ON partner_reviews(partner_id, created_at);
PRAGMA optimize;
