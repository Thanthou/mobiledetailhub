-- Mobile Detail Hub schema v2.1 (normalized states + service areas)
-- Postgres 14+ recommended

BEGIN;

-- ─────────────────────────────────────────────────────────────────────────────
-- Extensions
-- ─────────────────────────────────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS btree_gist;   -- exclusion constraints
CREATE EXTENSION IF NOT EXISTS citext;       -- case-insensitive emails
CREATE EXTENSION IF NOT EXISTS unaccent;     -- for nicer slugging (optional)

-- ─────────────────────────────────────────────────────────────────────────────
-- Drop existing tables & types (careful: destroys data)
-- ─────────────────────────────────────────────────────────────────────────────
DO $$
DECLARE r RECORD;
BEGIN
  -- Drop all tables in public schema (order-agnostic)
  FOR r IN (
    SELECT tablename FROM pg_tables WHERE schemaname='public'
  ) LOOP
    EXECUTE format('DROP TABLE IF EXISTS %I CASCADE;', r.tablename);
  END LOOP;

  -- Drop enums we'll recreate
  FOR r IN (
    SELECT t.typname
    FROM pg_type t
    JOIN pg_namespace n ON n.oid = t.typnamespace
    WHERE n.nspname='public' AND t.typtype='e'
  ) LOOP
    EXECUTE format('DROP TYPE IF EXISTS %I CASCADE;', r.typname);
  END LOOP;
END$$;

-- ─────────────────────────────────────────────────────────────────────────────
-- Enums
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TYPE user_role                 AS ENUM ('admin','affiliate','customer','staff');
CREATE TYPE affiliate_user_role       AS ENUM ('owner','manager','tech','viewer');
CREATE TYPE service_category          AS ENUM ('auto','boat','rv','ppf','ceramic','paint_correction');
CREATE TYPE pricing_unit              AS ENUM ('flat','hour');
CREATE TYPE vehicle_type              AS ENUM ('auto','boat','rv');
CREATE TYPE size_bucket               AS ENUM ('xs','s','m','l','xl');
CREATE TYPE booking_status            AS ENUM ('pending','confirmed','in_progress','completed','canceled','no_show');
CREATE TYPE quote_status              AS ENUM ('new','contacted','priced','accepted','rejected','expired');
CREATE TYPE source_platform           AS ENUM ('gbp','facebook','yelp','instagram','manual');

-- ─────────────────────────────────────────────────────────────────────────────
-- Utility: timestamp trigger for updated_at
-- ─────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END$$;

-- ─────────────────────────────────────────────────────────────────────────────
-- Utility: safe slugify for city slugs (optional usage)
-- ─────────────────────────────────────────────────────────────────────────────
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

-- ─────────────────────────────────────────────────────────────────────────────
-- Geo reference
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE states (
  state_code    CHAR(2) PRIMARY KEY,
  name          TEXT NOT NULL,
  country_code  CHAR(2) NOT NULL DEFAULT 'US'
);

CREATE TABLE cities (
  id         BIGSERIAL PRIMARY KEY,
  name       TEXT NOT NULL,
  city_slug  TEXT NOT NULL,
  state_code CHAR(2) NOT NULL REFERENCES states(state_code),
  lat        DOUBLE PRECISION,
  lng        DOUBLE PRECISION,
  CONSTRAINT uq_cities_name_state UNIQUE (name, state_code),
  CONSTRAINT uq_cities_slug_state UNIQUE (city_slug, state_code)
);

-- Optional helper trigger to auto-populate/normalize city_slug
CREATE OR REPLACE FUNCTION ensure_city_slug()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.city_slug IS NULL OR NEW.city_slug = '' THEN
    NEW.city_slug := slugify(NEW.name);
  ELSE
    NEW.city_slug := slugify(NEW.city_slug);
  END IF;
  RETURN NEW;
END$$;

CREATE TRIGGER trg_cities_slug
BEFORE INSERT OR UPDATE ON cities
FOR EACH ROW EXECUTE FUNCTION ensure_city_slug();

-- ─────────────────────────────────────────────────────────────────────────────
-- Core identities
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE users (
  id            SERIAL PRIMARY KEY,
  email         CITEXT NOT NULL UNIQUE,
  name          VARCHAR(255),
  role          user_role NOT NULL,
  is_admin      BOOLEAN DEFAULT FALSE,
  password_hash VARCHAR(255),
  phone         VARCHAR(50),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TRIGGER trg_users_updated BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE customers (
  id                 SERIAL PRIMARY KEY,
  user_id            INT REFERENCES users(id) ON DELETE SET NULL,
  name               VARCHAR(255) NOT NULL,
  email              VARCHAR(255),
  phone              VARCHAR(50),
  address            VARCHAR(255),
  preferences        JSONB,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TRIGGER trg_customers_updated BEFORE UPDATE ON customers
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Addresses table for affiliate base locations
CREATE TABLE addresses (
  id           SERIAL PRIMARY KEY,
  line1        VARCHAR(255),
  city         VARCHAR(100) NOT NULL,
  state_code   CHAR(2) NOT NULL REFERENCES states(state_code),
  postal_code  VARCHAR(20),
  lat          DOUBLE PRECISION,
  lng          DOUBLE PRECISION,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TRIGGER trg_addresses_updated BEFORE UPDATE ON addresses
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE affiliates (
  id                   SERIAL PRIMARY KEY,
  slug                 VARCHAR(100) NOT NULL UNIQUE,
  business_name        VARCHAR(255) NOT NULL,
  owner                VARCHAR(255) NOT NULL,
  phone                VARCHAR(20) NOT NULL,
  sms_phone            VARCHAR(20),
  email                VARCHAR(255) NOT NULL,
  base_address_id      INT REFERENCES addresses(id) ON DELETE SET NULL,
  services             JSONB NOT NULL DEFAULT '{"rv": false, "ppf": false, "auto": false, "boat": false, "ceramic": false, "paint_correction": false}'::jsonb,
  website_url          VARCHAR(500),
  gbp_url              VARCHAR(500),
  facebook_url         VARCHAR(500),
  instagram_url        VARCHAR(500),
  youtube_url          VARCHAR(500),
  tiktok_url           VARCHAR(500),
  application_status   VARCHAR(20) NOT NULL DEFAULT 'pending',
  has_insurance        BOOLEAN DEFAULT FALSE,
  source               VARCHAR(100),
  notes                TEXT,
  uploads              TEXT[],
  business_license     VARCHAR(100),
  insurance_provider   VARCHAR(255),
  insurance_expiry     DATE,
  service_radius_miles INT DEFAULT 25,
  operating_hours      JSONB,
  emergency_contact    JSONB,
  total_jobs           INT DEFAULT 0,
  rating               NUMERIC,
  review_count         INT DEFAULT 0,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  application_date     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  approved_date        TIMESTAMPTZ,
  last_activity        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TRIGGER trg_affiliates_updated BEFORE UPDATE ON affiliates
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ─────────────────────────────────────────────────────────────────────────────
-- Services, tiers, pricing rules
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE services (
  id               SERIAL PRIMARY KEY,
  affiliate_id     INT REFERENCES affiliates(id) ON DELETE CASCADE,
  category         service_category NOT NULL,
  name             VARCHAR(200) NOT NULL,
  description      TEXT,
  base_price_cents INT NOT NULL DEFAULT 0,
  pricing_unit     pricing_unit NOT NULL DEFAULT 'flat',
  min_duration_min INT NOT NULL DEFAULT 60,
  active           BOOLEAN NOT NULL DEFAULT TRUE,
  UNIQUE (affiliate_id, name)
);

CREATE TABLE service_tiers (
  id                SERIAL PRIMARY KEY,
  service_id        INT NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  name              VARCHAR(100) NOT NULL,
  price_delta_cents INT NOT NULL DEFAULT 0,
  description       TEXT,
  UNIQUE (service_id, name)
);

-- ─────────────────────────────────────────────────────────────────────────────
-- Availability (simplified structure)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE availability (
  id           SERIAL PRIMARY KEY,
  affiliate_id INT NOT NULL REFERENCES affiliates(id) ON DELETE CASCADE,
  date         DATE NOT NULL,
  start_time   TIME NOT NULL,
  end_time     TIME NOT NULL,
  capacity     INT NOT NULL DEFAULT 1
);

-- ─────────────────────────────────────────────────────────────────────────────
-- Quotes & bookings
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE quotes (
  id                     SERIAL PRIMARY KEY,
  affiliate_id           INT NOT NULL REFERENCES affiliates(id) ON DELETE CASCADE,
  customer_id            INT REFERENCES customers(id) ON DELETE SET NULL,
  address_json           JSONB NOT NULL DEFAULT '{}'::jsonb,
  requested_start        TIMESTAMPTZ,
  status                 quote_status NOT NULL DEFAULT 'new',
  details_json           JSONB NOT NULL DEFAULT '{}'::jsonb,
  estimated_total_cents  INT,
  created_at             TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at             TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TRIGGER trg_quotes_updated BEFORE UPDATE ON quotes
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE bookings (
  id                       SERIAL PRIMARY KEY,
  affiliate_id             INT NOT NULL REFERENCES affiliates(id) ON DELETE CASCADE,
  customer_id              INT REFERENCES customers(id) ON DELETE SET NULL,
  service_id               INT REFERENCES services(id) ON DELETE SET NULL,
  tier_id                  INT REFERENCES service_tiers(id) ON DELETE SET NULL,
  appointment_start        TIMESTAMPTZ NOT NULL,
  appointment_end          TIMESTAMPTZ NOT NULL,
  address_json             JSONB NOT NULL DEFAULT '{}'::jsonb,
  status                   booking_status NOT NULL DEFAULT 'pending',
  total_cents              INT NOT NULL DEFAULT 0,
  stripe_payment_intent_id TEXT,
  created_at               TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at               TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TRIGGER trg_bookings_updated BEFORE UPDATE ON bookings
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX idx_bookings_affiliate_start ON bookings (affiliate_id, appointment_start);
CREATE INDEX idx_quotes_affiliate_status   ON quotes (affiliate_id, status);

-- ─────────────────────────────────────────────────────────────────────────────
-- Service areas (canonical structure)
-- ─────────────────────────────────────────────────────────────────────────────
-- One row per city/zip that an affiliate serves
CREATE TABLE affiliate_service_areas (
  id           SERIAL PRIMARY KEY,
  affiliate_id INT NOT NULL REFERENCES affiliates(id) ON DELETE CASCADE,
  city         VARCHAR(100) NOT NULL,
  state_code   CHAR(2) NOT NULL REFERENCES states(state_code),
  zip          VARCHAR(20),
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT uq_aff_sa UNIQUE (affiliate_id, city, state_code, zip)
);

-- Optional: sitewide marketing slugs for landing pages
CREATE TABLE service_area_slugs (
  id         SERIAL PRIMARY KEY,
  slug       VARCHAR(255) NOT NULL UNIQUE,
  city       VARCHAR(100) NOT NULL,
  state_code CHAR(2) NOT NULL REFERENCES states(state_code),
  zip        VARCHAR(20),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Helpful indexes for common lookups
CREATE INDEX idx_aff_sa_state_city    ON affiliate_service_areas (state_code, city);
CREATE INDEX idx_aff_sa_affiliate     ON affiliate_service_areas (affiliate_id);

-- ─────────────────────────────────────────────────────────────────────────────
-- Reviews / locations
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE location (
  location_id        BIGSERIAL PRIMARY KEY,
  affiliate_id       BIGINT REFERENCES affiliates(id) ON DELETE CASCADE,
  source_platform    source_platform NOT NULL,
  source_account_id  TEXT NOT NULL,
  source_location_id TEXT NOT NULL,
  display_name       TEXT,
  timezone           TEXT,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE reviews (
  id                 BIGSERIAL PRIMARY KEY,
  external_id        TEXT,
  affiliate_id       INT NOT NULL REFERENCES affiliates(id) ON DELETE CASCADE,
  location_id        BIGINT REFERENCES location(location_id) ON DELETE SET NULL,
  rating             SMALLINT,
  text               TEXT,
  author_name        TEXT,
  author_profile_url TEXT,
  create_time        TIMESTAMPTZ,
  update_time        TIMESTAMPTZ,
  is_deleted         BOOLEAN NOT NULL DEFAULT FALSE,
  source_platform    source_platform NOT NULL,
  raw                JSONB,
  CONSTRAINT uq_reviews_ext UNIQUE (external_id, source_platform)
);
CREATE INDEX idx_reviews_affiliate_time ON reviews (affiliate_id, create_time);

CREATE TABLE review_reply (
  id                BIGSERIAL PRIMARY KEY,
  review_id         BIGINT NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
  text              TEXT,
  reply_update_time TIMESTAMPTZ
);

CREATE TABLE review_sync_state (
  location_id      BIGINT PRIMARY KEY REFERENCES location(location_id) ON DELETE CASCADE,
  last_seen_update TIMESTAMPTZ
);

-- ─────────────────────────────────────────────────────────────────────────────
-- Site config (singleton row)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE mdh_config (
  id                    SERIAL PRIMARY KEY,
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
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TRIGGER trg_mdh_config_updated BEFORE UPDATE ON mdh_config
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ─────────────────────────────────────────────────────────────────────────────
-- Initial data
-- ─────────────────────────────────────────────────────────────────────────────

-- Insert US states + DC + territories
INSERT INTO states (state_code, name, country_code) VALUES
('AL', 'Alabama', 'US'),
('AK', 'Alaska', 'US'),
('AZ', 'Arizona', 'US'),
('AR', 'Arkansas', 'US'),
('CA', 'California', 'US'),
('CO', 'Colorado', 'US'),
('CT', 'Connecticut', 'US'),
('DE', 'Delaware', 'US'),
('FL', 'Florida', 'US'),
('GA', 'Georgia', 'US'),
('HI', 'Hawaii', 'US'),
('ID', 'Idaho', 'US'),
('IL', 'Illinois', 'US'),
('IN', 'Indiana', 'US'),
('IA', 'Iowa', 'US'),
('KS', 'Kansas', 'US'),
('KY', 'Kentucky', 'US'),
('LA', 'Louisiana', 'US'),
('ME', 'Maine', 'US'),
('MD', 'Maryland', 'US'),
('MA', 'Massachusetts', 'US'),
('MI', 'Michigan', 'US'),
('MN', 'Minnesota', 'US'),
('MS', 'Mississippi', 'US'),
('MO', 'Missouri', 'US'),
('MT', 'Montana', 'US'),
('NE', 'Nebraska', 'US'),
('NV', 'Nevada', 'US'),
('NH', 'New Hampshire', 'US'),
('NJ', 'New Jersey', 'US'),
('NM', 'New Mexico', 'US'),
('NY', 'New York', 'US'),
('NC', 'North Carolina', 'US'),
('ND', 'North Dakota', 'US'),
('OH', 'Ohio', 'US'),
('OK', 'Oklahoma', 'US'),
('OR', 'Oregon', 'US'),
('PA', 'Pennsylvania', 'US'),
('RI', 'Rhode Island', 'US'),
('SC', 'South Carolina', 'US'),
('SD', 'South Dakota', 'US'),
('TN', 'Tennessee', 'US'),
('TX', 'Texas', 'US'),
('UT', 'Utah', 'US'),
('VT', 'Vermont', 'US'),
('VA', 'Virginia', 'US'),
('WA', 'Washington', 'US'),
('WV', 'West Virginia', 'US'),
('WI', 'Wisconsin', 'US'),
('WY', 'Wyoming', 'US'),
('DC', 'District of Columbia', 'US'),
('PR', 'Puerto Rico', 'US'),
('GU', 'Guam', 'US'),
('VI', 'U.S. Virgin Islands', 'US'),
('AS', 'American Samoa', 'US'),
('MP', 'Northern Mariana Islands', 'US')
ON CONFLICT (state_code) DO NOTHING;

-- Singleton config row
INSERT INTO mdh_config (id, email, phone, sms_phone, logo_url, favicon_url, facebook, instagram, tiktok, youtube, header_display, location, name)
VALUES (1, 'service@mobiledetailhub.com', '(888) 555-1234', '+17024206066', '/assets/logo.webp', '/assets/favicon.ico',
        'https://facebook.com/mobiledetailhub', 'https://instagram.com/mobiledetailhub', 'https://tiktok.com/@mobiledetailhub', 'https://youtube.com/mobiledetailhub',
        'Mobile Detail Hub', 'Anywhere, USA', 'Mobile Detail Hub')
ON CONFLICT (id) DO NOTHING;

-- Admin user (update email/hash if desired)
INSERT INTO users (email, name, role, is_admin, password_hash, phone)
VALUES ('admin@mobiledetailhub.com', 'Brandan Coleman', 'admin', TRUE,
        '$2a$10$EAY3D9OdVXpYgby.ATOmheJwqrlTZ423Yg2a.qLzN1Ku1/oj2/LzS', '')
ON CONFLICT (email) DO NOTHING;

-- ─────────────────────────────────────────────────────────────────────────────
-- Views for common queries & site menus
-- ─────────────────────────────────────────────────────────────────────────────

-- View for affiliate base location information (joins base address)
CREATE OR REPLACE VIEW v_affiliate_base_location AS
SELECT
  f.id AS affiliate_id,
  f.slug,
  f.business_name,
  addr.city,
  addr.state_code,
  addr.postal_code AS zip
FROM affiliates f
LEFT JOIN addresses addr ON addr.id = f.base_address_id;

-- States with at least one affiliate coverage row
CREATE OR REPLACE VIEW v_served_states AS
SELECT DISTINCT s.state_code, s.name
FROM states s
JOIN affiliate_service_areas a ON a.state_code = s.state_code
ORDER BY s.name;

-- Cities per state with affiliate counts
CREATE OR REPLACE VIEW v_served_cities AS
SELECT a.state_code, a.city, COUNT(DISTINCT a.affiliate_id) AS affiliates
FROM affiliate_service_areas a
GROUP BY a.state_code, a.city
ORDER BY a.state_code, a.city;

COMMIT;
