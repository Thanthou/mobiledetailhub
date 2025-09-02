-- Mobile Detail Hub schema v4.1 (simplified service areas with JSONB)
-- Postgres 14+ recommended

BEGIN;

-- ─────────────────────────────────────────────────────────────────────────────
-- Extensions
-- ─────────────────────────────────────────────────────────────────────────────
-- CREATE EXTENSION IF NOT EXISTS btree_gist;   -- exclusion constraints (removed for compatibility)
CREATE EXTENSION IF NOT EXISTS citext;       -- case-insensitive emails
CREATE EXTENSION IF NOT EXISTS unaccent;     -- for slugify
CREATE EXTENSION IF NOT EXISTS pgcrypto;     -- token hashing

-- ─────────────────────────────────────────────────────────────────────────────
-- Drop existing objects (order-agnostic)
-- ─────────────────────────────────────────────────────────────────────────────
DO $$
DECLARE r RECORD;
BEGIN
  FOR r IN (SELECT viewname FROM pg_views WHERE schemaname='public') LOOP
    EXECUTE format('DROP VIEW IF EXISTS %I CASCADE;', r.viewname);
  END LOOP;

  FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname='public') LOOP
    EXECUTE format('DROP TABLE IF EXISTS %I CASCADE;', r.tablename);
  END LOOP;

  -- Drop enums
  FOR r IN (
    SELECT t.typname
    FROM pg_type t JOIN pg_namespace n ON n.oid = t.typnamespace
    WHERE n.nspname='public' AND t.typtype='e'
  ) LOOP
    EXECUTE format('DROP TYPE IF EXISTS %I CASCADE;', r.typname);
  END LOOP;

  -- Drop functions
  DROP FUNCTION IF EXISTS set_updated_at() CASCADE;
  DROP FUNCTION IF EXISTS slugify(text) CASCADE;
  DROP FUNCTION IF EXISTS ensure_city_slug() CASCADE;
  DROP FUNCTION IF EXISTS validate_booking_tier() CASCADE;
END$$;

-- ─────────────────────────────────────────────────────────────────────────────
-- Enums
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TYPE user_role           AS ENUM ('admin','affiliate','customer','staff');
CREATE TYPE affiliate_user_role AS ENUM ('owner','manager','tech','viewer');
CREATE TYPE service_category    AS ENUM ('auto','boat','rv','ppf','ceramic','paint_correction');
CREATE TYPE pricing_unit        AS ENUM ('flat','hour');
CREATE TYPE vehicle_type        AS ENUM ('auto','boat','rv');
CREATE TYPE size_bucket         AS ENUM ('xs','s','m','l','xl');
CREATE TYPE booking_status      AS ENUM ('pending','confirmed','in_progress','completed','canceled','no_show');
CREATE TYPE quote_status        AS ENUM ('new','contacted','priced','accepted','rejected','expired');
CREATE TYPE source_platform     AS ENUM ('gbp','facebook','yelp','instagram','manual');
CREATE TYPE affiliate_status    AS ENUM ('pending','approved','rejected','suspended');

-- ─────────────────────────────────────────────────────────────────────────────
-- Utility functions & triggers
-- ─────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END$$;

CREATE OR REPLACE FUNCTION slugify(input TEXT)
RETURNS TEXT LANGUAGE sql IMMUTABLE AS $$
  SELECT regexp_replace(
           regexp_replace(
             lower(unaccent(coalesce(input,''))),
             '[^a-z0-9]+', '-', 'g'
           ),
           '(^-|-$)', '', 'g'
         );
$$;

CREATE OR REPLACE FUNCTION validate_booking_tier()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.tier_id IS NOT NULL AND NEW.service_id IS NOT NULL THEN
    IF NOT EXISTS (
      SELECT 1 FROM service_tiers
      WHERE id = NEW.tier_id AND service_id = NEW.service_id
    ) THEN
      RAISE EXCEPTION 'tier_id % does not belong to service_id %', NEW.tier_id, NEW.service_id;
    END IF;
  END IF;
  RETURN NEW;
END$$;

-- ─────────────────────────────────────────────────────────────────────────────
-- Users & customers
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE users (
  id            INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email         CITEXT NOT NULL UNIQUE,
  name          VARCHAR(255),
  role          user_role NOT NULL,
  is_admin      BOOLEAN DEFAULT FALSE,
  password_hash VARCHAR(255),
  phone         VARCHAR(50) CHECK (phone IS NULL OR phone ~ '^[0-9+\-\s\(\)]{7,20}$'),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TRIGGER trg_users_updated BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE customers (
  id          INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id     INT REFERENCES users(id) ON DELETE SET NULL,
  name        VARCHAR(255) NOT NULL,
  email       CITEXT,
  phone       VARCHAR(50),
  address     VARCHAR(255),
  preferences JSONB,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TRIGGER trg_customers_updated BEFORE UPDATE ON customers FOR EACH ROW EXECUTE FUNCTION set_updated_at();



-- ─────────────────────────────────────────────────────────────────────────────
-- Affiliates (operators only; NO brand rows here)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE affiliates (
  id                   INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  slug                 VARCHAR(100) NOT NULL UNIQUE CHECK (slug = slugify(slug)),
  business_name        VARCHAR(255) NOT NULL,
  owner                VARCHAR(255) NOT NULL,
  phone                VARCHAR(20)  NOT NULL CHECK (phone ~ '^[0-9+\-\s\(\)]{7,20}$'),
  sms_phone            VARCHAR(20),
  email                CITEXT NOT NULL,

  website_url          VARCHAR(500),
  gbp_url              VARCHAR(500),
  facebook_url         VARCHAR(500),
  instagram_url        VARCHAR(500),
  youtube_url          VARCHAR(500),
  tiktok_url           VARCHAR(500),
  application_status   affiliate_status NOT NULL DEFAULT 'pending',
  has_insurance        BOOLEAN DEFAULT FALSE,
  source               VARCHAR(100),
  notes                TEXT,
  uploads              TEXT[],
  business_license     VARCHAR(100),
  insurance_provider   VARCHAR(255),
  insurance_expiry     DATE,
  city                VARCHAR(100),
  state               VARCHAR(2),
  zip                 VARCHAR(10),
  service_radius_miles INT DEFAULT 25,
  operating_hours      JSONB,
  emergency_contact    JSONB,
  total_jobs           INT DEFAULT 0,
  rating               NUMERIC CHECK (rating IS NULL OR (rating >= 0 AND rating <= 5)),
  review_count         INT DEFAULT 0,
  service_areas        JSONB DEFAULT '[]'::jsonb, -- Simple array of {city, state, zip}
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  application_date     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  approved_date        TIMESTAMPTZ,
  last_activity        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TRIGGER trg_affiliates_updated BEFORE UPDATE ON affiliates FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Create GIN index on service_areas for efficient JSONB queries
CREATE INDEX idx_affiliates_service_areas ON affiliates USING GIN (service_areas);

-- NOTE: intentionally NO is_brand column and NO mdh seed row.

-- Affiliate users (composite unique)
CREATE TABLE affiliate_users (
  id           INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  affiliate_id INT NOT NULL REFERENCES affiliates(id) ON DELETE CASCADE,
  user_id      INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role         affiliate_user_role NOT NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_affiliate_users UNIQUE (affiliate_id, user_id)
);
CREATE INDEX idx_affiliate_users_user_id ON affiliate_users(user_id);
CREATE TRIGGER trg_affiliate_users_updated BEFORE UPDATE ON affiliate_users FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ─────────────────────────────────────────────────────────────────────────────
-- Services & tiers (composite uniques)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE services (
  id                INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  affiliate_id      INT NOT NULL REFERENCES affiliates(id) ON DELETE CASCADE,
  category          service_category NOT NULL,
  name              VARCHAR(200) NOT NULL,
  description       TEXT,
  base_price_cents  INT NOT NULL DEFAULT 0 CHECK (base_price_cents >= 0),
  pricing_unit      pricing_unit NOT NULL DEFAULT 'flat',
  min_duration_min  INT NOT NULL DEFAULT 60 CHECK (min_duration_min >= 0),
  active            BOOLEAN NOT NULL DEFAULT TRUE,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_services_affiliate_name UNIQUE (affiliate_id, name)
);
CREATE INDEX idx_services_affiliate_category ON services(affiliate_id, category);
CREATE TRIGGER trg_services_updated BEFORE UPDATE ON services FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE service_tiers (
  id               INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  service_id       INT NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  name             VARCHAR(100) NOT NULL,
  price_delta_cents INT NOT NULL DEFAULT 0,
  description      TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_service_tiers_service_name UNIQUE (service_id, name)
);
CREATE INDEX idx_service_tiers_service_id ON service_tiers(service_id);
CREATE TRIGGER trg_service_tiers_updated BEFORE UPDATE ON service_tiers FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ─────────────────────────────────────────────────────────────────────────────
-- Availability, quotes, bookings
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE availability (
  id           INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  affiliate_id INT NOT NULL REFERENCES affiliates(id) ON DELETE CASCADE,
  time_window  TSTZRANGE NOT NULL,
  capacity     INT NOT NULL DEFAULT 1 CHECK (capacity > 0),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
-- Prevent overlapping windows per affiliate (simplified for compatibility)
CREATE INDEX idx_availability_affiliate_window ON availability(affiliate_id, time_window);
CREATE INDEX idx_availability_window ON availability(time_window);
CREATE TRIGGER trg_availability_updated BEFORE UPDATE ON availability FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE quotes (
  id                     INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  affiliate_id           INT NOT NULL REFERENCES affiliates(id) ON DELETE CASCADE,
  customer_id            INT REFERENCES customers(id) ON DELETE SET NULL,
  address_json           JSONB NOT NULL DEFAULT '{}'::jsonb,
  requested_start        TIMESTAMPTZ,
  status                 quote_status NOT NULL DEFAULT 'new',
  details_json           JSONB NOT NULL DEFAULT '{}'::jsonb,
  estimated_total_cents  INT CHECK (estimated_total_cents IS NULL OR estimated_total_cents >= 0),
  created_at             TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at             TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_quotes_affiliate_status ON quotes(affiliate_id, status);
CREATE INDEX idx_quotes_created_at ON quotes(created_at);
CREATE TRIGGER trg_quotes_updated BEFORE UPDATE ON quotes FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE bookings (
  id                         INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  affiliate_id               INT NOT NULL REFERENCES affiliates(id) ON DELETE CASCADE,
  customer_id                INT REFERENCES customers(id) ON DELETE SET NULL,
  service_id                 INT REFERENCES services(id) ON DELETE SET NULL,
  tier_id                    INT REFERENCES service_tiers(id) ON DELETE SET NULL,
  appointment_start          TIMESTAMPTZ NOT NULL,
  appointment_end            TIMESTAMPTZ NOT NULL,
  address_json               JSONB NOT NULL DEFAULT '{}'::jsonb,
  status                     booking_status NOT NULL DEFAULT 'pending',
  total_cents                INT NOT NULL DEFAULT 0 CHECK (total_cents >= 0),
  stripe_payment_intent_id   TEXT UNIQUE,
  created_at                 TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at                 TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_booking_time CHECK (appointment_end > appointment_start)
);
-- Prevent overlapping bookings per affiliate (simplified for compatibility)
CREATE INDEX idx_bookings_affiliate_range ON bookings(affiliate_id, appointment_start, appointment_end);
CREATE INDEX idx_bookings_affiliate_start ON bookings(affiliate_id, appointment_start);
CREATE TRIGGER trg_bookings_updated BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_bookings_validate_tier BEFORE INSERT OR UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION validate_booking_tier();

-- ─────────────────────────────────────────────────────────────────────────────
-- Reviews & locations
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE location (
  location_id      BIGINT PRIMARY KEY,
  affiliate_id     INT REFERENCES affiliates(id) ON DELETE SET NULL,
  source_platform  source_platform NOT NULL,
  source_account_id TEXT NOT NULL,
  source_location_id TEXT NOT NULL,
  display_name     TEXT,
  timezone         TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_location_external UNIQUE (source_platform, source_location_id)
);
CREATE INDEX idx_location_affiliate ON location(affiliate_id);
CREATE TRIGGER trg_location_updated BEFORE UPDATE ON location FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE reviews (
  id               BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  external_id      TEXT,
  affiliate_id     INT NOT NULL REFERENCES affiliates(id) ON DELETE CASCADE,
  location_id      BIGINT REFERENCES location(location_id) ON DELETE SET NULL,
  rating           SMALLINT CHECK (rating BETWEEN 1 AND 5),
  text             TEXT,
  author_name      TEXT,
  author_profile_url TEXT,
  create_time      TIMESTAMPTZ,
  update_time      TIMESTAMPTZ,
  is_deleted       BOOLEAN NOT NULL DEFAULT FALSE,
  source_platform  source_platform NOT NULL,
  raw              JSONB,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_reviews_ext UNIQUE (external_id, source_platform)
);
CREATE INDEX idx_reviews_affiliate_time ON reviews(affiliate_id, create_time);
CREATE INDEX idx_reviews_location_time  ON reviews(location_id, create_time);
CREATE TRIGGER trg_reviews_updated BEFORE UPDATE ON reviews FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE review_reply (
  id                BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  review_id         BIGINT NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
  text              TEXT,
  reply_update_time TIMESTAMPTZ,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TRIGGER trg_review_reply_updated BEFORE UPDATE ON review_reply FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE review_sync_state (
  location_id       BIGINT PRIMARY KEY REFERENCES location(location_id) ON DELETE CASCADE,
  last_seen_update  TIMESTAMPTZ,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TRIGGER trg_review_sync_state_updated BEFORE UPDATE ON review_sync_state FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ─────────────────────────────────────────────────────────────────────────────
-- Brand singleton (MDH only; NOT an affiliate)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE mdh_config (
  id                    INT PRIMARY KEY,
  email                 VARCHAR(255),
  phone                 VARCHAR(50),
  sms_phone             VARCHAR(50),
  logo_url              VARCHAR(255),
  favicon_url           VARCHAR(255),
  facebook              VARCHAR(255),
  instagram             VARCHAR(255),
  tiktok                VARCHAR(255),
  youtube               VARCHAR(255),
  header_display        VARCHAR(255),
  location              VARCHAR(255),
  name                  VARCHAR(255),
  tagline               TEXT,
  services_description  TEXT DEFAULT 'Auto, boat & RV detailing, paint correction, ceramic coating, and PPF',
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_singleton CHECK (id = 1)
);
CREATE TRIGGER trg_mdh_config_updated BEFORE UPDATE ON mdh_config FOR EACH ROW EXECUTE FUNCTION set_updated_at();

INSERT INTO mdh_config (id, email, phone, sms_phone, logo_url, favicon_url, facebook, instagram, tiktok, youtube, header_display, location, name)
VALUES (1,
  'service@mobiledetailhub.com',
  '(888) 555-1234',
  '+17024206066',
  '/assets/logo.webp',
  '/assets/favicon.ico',
  'https://facebook.com/mobiledetailhub',
  'https://instagram.com/mobiledetailhub',
  'https://tiktok.com/@mobiledetailhub',
  'https://youtube.com/mobiledetailhub',
  'Mobile Detail Hub',
  'Anywhere, USA',
  'Mobile Detail Hub'
);

-- ─────────────────────────────────────────────────────────────────────────────
-- Seed: Admin user
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO users (email, name, role, is_admin, password_hash, phone)
VALUES ('admin@mobiledetailhub.com', 'Brandan Coleman', 'admin', TRUE,
        '$2a$10$EAY3D9OdVXpYgby.ATOmheJwqrlTZ423Yg2a.qLzN1Ku1/oj2/LzS', NULL)
ON CONFLICT (email) DO NOTHING;

-- ─────────────────────────────────────────────────────────────────────────────
-- Auth tokens & migrations
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE refresh_tokens (
  id          INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id     INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash  TEXT NOT NULL UNIQUE,
  user_agent  TEXT,
  ip_address  INET,
  device_id   TEXT,
  expires_at  TIMESTAMPTZ,
  revoked_at  TIMESTAMPTZ,
  is_revoked  BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_refresh_tokens_user_id ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_active  ON refresh_tokens(user_id) WHERE is_revoked = FALSE;
CREATE TRIGGER trg_refresh_tokens_updated BEFORE UPDATE ON refresh_tokens FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE schema_migrations (
  version     TEXT PRIMARY KEY,
  applied_at  TIMESTAMPTZ DEFAULT NOW(),
  description TEXT
);

INSERT INTO schema_migrations(version, description) VALUES
('v4.1', 'Simplified service areas with JSONB; removed complex geography tables');

COMMIT;
