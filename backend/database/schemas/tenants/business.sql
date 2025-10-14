-- tenants.business table definition

CREATE TABLE IF NOT EXISTS tenants.business (
  id INTEGER(32) NOT NULL DEFAULT nextval('tenants.business_new_id_seq1'::regclass),
  industry VARCHAR(50) NOT NULL,
  slug VARCHAR(255) NOT NULL,
  business_name VARCHAR(255) NOT NULL,
  owner VARCHAR(255),
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  user_id INTEGER(32),
  application_status VARCHAR(50) DEFAULT 'pending'::character varying,
  business_start_date DATE,
  business_phone VARCHAR(20),
  personal_phone VARCHAR(20),
  business_email VARCHAR(255),
  personal_email VARCHAR(255),
  twilio_phone VARCHAR(20),
  sms_phone VARCHAR(20),
  website TEXT,
  gbp_url TEXT,
  facebook_url TEXT,
  instagram_url TEXT,
  youtube_url TEXT,
  tiktok_url TEXT,
  source VARCHAR(255),
  notes TEXT,
  service_areas JSONB,
  application_date TIMESTAMPTZ,
  approved_date TIMESTAMPTZ,
  last_activity TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);
-- Indexes
CREATE UNIQUE INDEX business_new_pkey1 ON tenants.business USING btree (id);
CREATE UNIQUE INDEX business_new_slug_key1 ON tenants.business USING btree (slug);
CREATE INDEX idx_business_application_status ON tenants.business USING btree (application_status);
CREATE INDEX idx_business_created_at ON tenants.business USING btree (created_at);
CREATE INDEX idx_business_industry ON tenants.business USING btree (industry);
CREATE INDEX idx_business_slug ON tenants.business USING btree (slug);
CREATE INDEX idx_business_user_id ON tenants.business USING btree (user_id);

-- Table created: 2025-10-13T19:26:01.117Z
-- Extracted from database
