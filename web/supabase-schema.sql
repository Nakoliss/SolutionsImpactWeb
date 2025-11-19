-- Supabase Schema for Admin Ops Dashboard
-- Region: Canada Central
-- 
-- Run this SQL in your Supabase SQL Editor to create the required tables
-- Make sure RLS (Row Level Security) is configured appropriately:
-- - Service role can insert/select (used by API routes)
-- - Public anon access should be restricted

-- Leads captured from forms, chatbot, ads, organic
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  name TEXT,
  email TEXT,
  phone TEXT,
  locale TEXT,                  -- fr/en
  source TEXT,                  -- ga4/meta/organic/chatbot/email/outbound
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  notes TEXT,
  consent_analytics BOOLEAN DEFAULT FALSE,
  consent_ads BOOLEAN DEFAULT FALSE,
  consent_chatbot BOOLEAN DEFAULT FALSE
);

-- Bookings from Cal.com
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  cal_event_id TEXT UNIQUE,
  name TEXT,
  email TEXT,
  starts_at TIMESTAMPTZ,
  locale TEXT,
  source TEXT                   -- ex: "cal.com|contact"
);

-- Payments from Stripe
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  stripe_session_id TEXT UNIQUE,
  amount_cents INTEGER,
  currency TEXT,
  status TEXT,                  -- paid/complete
  bundle TEXT,                  -- essentials/growth/pro
  modality TEXT,                -- ot/m
  customer_email TEXT
);

-- Consent history (Loi 25 compliance - logs ≥ 1 year)
CREATE TABLE IF NOT EXISTS consents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  category TEXT,                -- analytics/ads/chatbot/email
  granted BOOLEAN,
  actor TEXT,                   -- cookieId/ip/email
  meta JSONB
);

-- Ops tasks (maintenance/seo/gbp/socials/compliance)
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  title TEXT,
  assignee TEXT,                -- ex: "Daniel"
  client TEXT DEFAULT 'Solutions Impact Web',
  category TEXT,                -- maintenance/seo/gbp/socials/compliance
  due_date DATE,
  status TEXT DEFAULT 'todo',   -- todo/doing/done
  notes TEXT
);

-- Indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_source ON leads(source);

CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON bookings(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_bookings_starts_at ON bookings(starts_at DESC);

CREATE INDEX IF NOT EXISTS idx_payments_created_at ON payments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);

CREATE INDEX IF NOT EXISTS idx_consents_created_at ON consents(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_consents_category ON consents(category);
CREATE INDEX IF NOT EXISTS idx_consents_actor ON consents(actor);

CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date ASC);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_category ON tasks(category);

-- RLS Policies (adjust as needed)
-- For now, we'll rely on service role key for API routes
-- Public access should be denied by default

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Service role can do everything (used by API routes)
-- These policies allow service role to bypass RLS
-- In production, ensure service role key is kept secret

