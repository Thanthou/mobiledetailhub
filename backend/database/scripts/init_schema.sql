-- Mobile Detail Hub schema v3.1 (normalized cities + service areas + brand affiliate + tightened indexes)
-- Postgres 14+ recommended

BEGIN;

-- ─────────────────────────────────────────────────────────────────────────────
-- Extensions
-- ─────────────────────────────────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS btree_gist;   -- exclusion constraints
CREATE EXTENSION IF NOT EXISTS citext;       -- case-insensitive emails
CREATE EXTENSION IF NOT EXISTS unaccent;     -- for nicer slugging
CREATE EXTENSION IF NOT EXISTS pgcrypto;     -- token hashing helpers

-- ─────────────────────────────────────────────────────────────────────────────
-- Drop existing tables, views, types & functions (order-agnostic)
-- ─────────────────────────────────────────────────────────────────────────────
DO $$
DECLARE r RECORD;
BEGIN
  -- Drop views first
  FOR r IN (SELECT viewname FROM pg_views WHERE schemaname='public') LOOP
    EXECUTE format('DROP VIEW IF EXISTS %I CASCADE;', r.viewname);
  END LOOP;

  -- Drop tables
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

CREATE OR REPLACE FUNCTION validate_booking_tier()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.tier_id IS NOT NULL AND NEW.service_id IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM service_tiers WHERE id = NEW.tier_id AND service_id = NEW.service_id) THEN
      RAISE EXCEPTION 'tier_id % does not belong to service_id %', NEW.tier_id, NEW.service_id;
    END IF;
  END IF;
  RETURN NEW;
END$$;

-- ─────────────────────────────────────────────────────────────────────────────
-- Reference geography
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE states (
  state_code    CHAR(2) PRIMARY KEY,
  name          TEXT NOT NULL,
  country_code  CHAR(2) NOT NULL DEFAULT 'US'
);

CREATE TABLE cities (
  id         BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name       TEXT NOT NULL,
  city_slug  TEXT NOT NULL,
  state_code CHAR(2) NOT NULL REFERENCES states(state_code),
  lat        DOUBLE PRECISION,
  lng        DOUBLE PRECISION,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_cities_name_state UNIQUE (name, state_code),
  CONSTRAINT uq_cities_slug_state UNIQUE (city_slug, state_code)
);

CREATE TRIGGER trg_cities_slug   BEFORE INSERT OR UPDATE ON cities FOR EACH ROW EXECUTE FUNCTION ensure_city_slug();
CREATE TRIGGER trg_cities_updated BEFORE UPDATE ON cities FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ─────────────────────────────────────────────────────────────────────────────
-- Identities & users
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
-- Addresses (normalized with city_id)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE addresses (
  id           INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  line1        VARCHAR(255),
  city_id      INT REFERENCES cities(id) ON DELETE SET NULL,
  city         VARCHAR(100), -- DEPRECATED: transition only; drop later
  state_code   CHAR(2) NOT NULL REFERENCES states(state_code),
  postal_code  VARCHAR(20),
  lat          DOUBLE PRECISION,
  lng          DOUBLE PRECISION,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TRIGGER trg_addresses_updated BEFORE UPDATE ON addresses FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX idx_addresses_location ON addresses (state_code, city, postal_code);
CREATE UNIQUE INDEX uq_addresses_normalized ON addresses (lower(line1), city_id, postal_code) WHERE line1 IS NOT NULL;

COMMENT ON COLUMN addresses.city IS 'DEPRECATED: Use city_id for normalized city reference. This field will be dropped in a future schema version.';

-- ─────────────────────────────────────────────────────────────────────────────
-- Affiliates & membership
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE affiliates (
  id                   INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  slug                 VARCHAR(100) NOT NULL UNIQUE CHECK (slug = slugify(slug)),
  business_name        VARCHAR(255) NOT NULL,
  owner                VARCHAR(255) NOT NULL,
  phone                VARCHAR(20) NOT NULL CHECK (phone ~ '^[0-9+\-\s\(\)]{7,20}$'),
  sms_phone            VARCHAR(20),
  email                CITEXT NOT NULL,
  base_address_id      INT REFERENCES addresses(id) ON DELETE SET NULL,
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
  service_radius_miles INT DEFAULT 25,
  operating_hours      JSONB,
  emergency_contact    JSONB,
  total_jobs           INT DEFAULT 0,
  rating               NUMERIC CHECK (rating IS NULL OR (rating >= 0 AND rating <= 5)),
  review_count         INT DEFAULT 0 CHECK (review_count >= 0),
  is_brand             BOOLEAN NOT NULL DEFAULT FALSE,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  application_date     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  approved_date        TIMESTAMPTZ,
  last_activity        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TRIGGER trg_affiliates_updated BEFORE UPDATE ON affiliates FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Enforce a single brand affiliate row
CREATE UNIQUE INDEX uq_affiliates_brand_one ON affiliates (is_brand) WHERE is_brand;

CREATE TABLE affiliate_users (
  id           INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  affiliate_id INT NOT NULL REFERENCES affiliates(id) ON DELETE CASCADE,
  user_id      INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role         affiliate_user_role NOT NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_affiliate_users UNIQUE (affiliate_id, user_id)
);
CREATE TRIGGER trg_affiliate_users_updated BEFORE UPDATE ON affiliate_users FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX idx_affiliate_users_user_id ON affiliate_users (user_id);

-- ─────────────────────────────────────────────────────────────────────────────
-- Services & tiers
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE services (
  id               INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  affiliate_id     INT NOT NULL REFERENCES affiliates(id) ON DELETE CASCADE,
  category         service_category NOT NULL,
  name             VARCHAR(200) NOT NULL,
  description      TEXT,
  base_price_cents INT NOT NULL DEFAULT 0 CHECK (base_price_cents >= 0),
  pricing_unit     pricing_unit NOT NULL DEFAULT 'flat',
  min_duration_min INT NOT NULL DEFAULT 60 CHECK (min_duration_min > 0),
  active           BOOLEAN NOT NULL DEFAULT TRUE,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_services_affiliate_name UNIQUE (affiliate_id, name)
);
CREATE TRIGGER trg_services_updated BEFORE UPDATE ON services FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE service_tiers (
  id                INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  service_id        INT NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  name              VARCHAR(100) NOT NULL,
  price_delta_cents INT NOT NULL DEFAULT 0,
  description       TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_service_tiers_service_name UNIQUE (service_id, name)
);
CREATE TRIGGER trg_service_tiers_updated BEFORE UPDATE ON service_tiers FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX idx_services_affiliate_category ON services (affiliate_id, category);
CREATE INDEX idx_service_tiers_service_id   ON service_tiers (service_id);

-- ─────────────────────────────────────────────────────────────────────────────
-- Availability (time ranges with exclusion constraints)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE availability (
  id           INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  affiliate_id INT NOT NULL REFERENCES affiliates(id) ON DELETE CASCADE,
  time_window  TSTZRANGE NOT NULL,
  capacity     INT NOT NULL DEFAULT 1 CHECK (capacity > 0),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  EXCLUDE USING gist (affiliate_id WITH =, time_window WITH &&)
);
CREATE TRIGGER trg_availability_updated BEFORE UPDATE ON availability FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE INDEX idx_availability_window ON availability USING gist (time_window);

-- ─────────────────────────────────────────────────────────────────────────────
-- Quotes & bookings (data integrity)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE quotes (
  id                    INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  affiliate_id          INT NOT NULL REFERENCES affiliates(id) ON DELETE CASCADE,
  customer_id           INT REFERENCES customers(id) ON DELETE SET NULL,
  address_json          JSONB NOT NULL DEFAULT '{}'::jsonb,
  requested_start       TIMESTAMPTZ,
  status                quote_status NOT NULL DEFAULT 'new',
  details_json          JSONB NOT NULL DEFAULT '{}'::jsonb,
  estimated_total_cents INT CHECK (estimated_total_cents IS NULL OR estimated_total_cents >= 0),
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TRIGGER trg_quotes_updated BEFORE UPDATE ON quotes FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE bookings (
  id                       INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  affiliate_id             INT NOT NULL REFERENCES affiliates(id) ON DELETE CASCADE,
  customer_id              INT REFERENCES customers(id) ON DELETE SET NULL,
  service_id               INT REFERENCES services(id) ON DELETE SET NULL,
  tier_id                  INT REFERENCES service_tiers(id) ON DELETE SET NULL,
  appointment_start        TIMESTAMPTZ NOT NULL,
  appointment_end          TIMESTAMPTZ NOT NULL,
  address_json             JSONB NOT NULL DEFAULT '{}'::jsonb,
  status                   booking_status NOT NULL DEFAULT 'pending',
  total_cents              INT NOT NULL DEFAULT 0 CHECK (total_cents >= 0),
  stripe_payment_intent_id TEXT UNIQUE,
  created_at               TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at               TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (appointment_end > appointment_start),
  EXCLUDE USING gist (affiliate_id WITH =, tstzrange(appointment_start, appointment_end, '[)') WITH &&)
);
CREATE TRIGGER trg_bookings_updated           BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_bookings_tier_validation   BEFORE INSERT OR UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION validate_booking_tier();

CREATE INDEX idx_bookings_affiliate_start ON bookings (affiliate_id, appointment_start);
CREATE INDEX idx_quotes_affiliate_status  ON quotes (affiliate_id, status);
CREATE INDEX idx_quotes_created_at        ON quotes (created_at DESC);

-- ─────────────────────────────────────────────────────────────────────────────
-- Service areas (normalized with city_id)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE affiliate_service_areas (
  id           INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  affiliate_id INT NOT NULL REFERENCES affiliates(id) ON DELETE CASCADE,
  city_id      INT NOT NULL REFERENCES cities(id) ON DELETE CASCADE,
  zip          VARCHAR(20),
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);
CREATE TRIGGER trg_affiliate_service_areas_updated BEFORE UPDATE ON affiliate_service_areas FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE service_area_slugs (
  id         INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  slug       VARCHAR(255) NOT NULL UNIQUE CHECK (slug = slugify(slug)),
  city_id    INT NOT NULL REFERENCES cities(id) ON DELETE CASCADE,
  zip        VARCHAR(20),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TRIGGER trg_service_area_slugs_updated BEFORE UPDATE ON service_area_slugs FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX idx_aff_sa_city_id       ON affiliate_service_areas (city_id);
CREATE INDEX idx_aff_sa_affiliate     ON affiliate_service_areas (affiliate_id);
CREATE INDEX idx_service_area_slugs_city ON service_area_slugs (city_id);

-- Partial unique indexes to handle optional zip values
CREATE UNIQUE INDEX uq_aff_sa_no_zip    ON affiliate_service_areas (affiliate_id, city_id) WHERE zip IS NULL;
CREATE UNIQUE INDEX uq_aff_sa_with_zip  ON affiliate_service_areas (affiliate_id, city_id, zip) WHERE zip IS NOT NULL;

-- ─────────────────────────────────────────────────────────────────────────────
-- Reviews & locations
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE location (
  location_id        BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  affiliate_id       INT REFERENCES affiliates(id) ON DELETE CASCADE,
  source_platform    source_platform NOT NULL,
  source_account_id  TEXT NOT NULL,
  source_location_id TEXT NOT NULL,
  display_name       TEXT,
  timezone           TEXT,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_location_external UNIQUE (source_platform, source_location_id)
);
CREATE TRIGGER trg_location_updated BEFORE UPDATE ON location FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE reviews (
  id                 BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  external_id        TEXT,
  affiliate_id       INT NOT NULL REFERENCES affiliates(id) ON DELETE CASCADE,
  location_id        BIGINT REFERENCES location(location_id) ON DELETE SET NULL,
  rating             SMALLINT CHECK (rating IS NULL OR rating BETWEEN 1 AND 5),
  text               TEXT,
  author_name        TEXT,
  author_profile_url TEXT,
  create_time        TIMESTAMPTZ,
  update_time        TIMESTAMPTZ,
  is_deleted         BOOLEAN NOT NULL DEFAULT FALSE,
  source_platform    source_platform NOT NULL,
  raw                JSONB,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_reviews_ext UNIQUE (external_id, source_platform)
);
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
  location_id      BIGINT PRIMARY KEY REFERENCES location(location_id) ON DELETE CASCADE,
  last_seen_update TIMESTAMPTZ,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TRIGGER trg_review_sync_state_updated BEFORE UPDATE ON review_sync_state FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX idx_location_affiliate     ON location (affiliate_id);
CREATE INDEX idx_reviews_affiliate_time ON reviews (affiliate_id, create_time);
CREATE INDEX idx_reviews_location_time  ON reviews (location_id, create_time);
CREATE INDEX idx_reviews_active_time    ON reviews (affiliate_id, create_time) WHERE is_deleted = false;

-- ─────────────────────────────────────────────────────────────────────────────
-- Site config (singleton)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE mdh_config (
  id                    INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
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

-- ─────────────────────────────────────────────────────────────────────────────
-- Auth/storage helpers
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE refresh_tokens (
  id          INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id     INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash  TEXT NOT NULL UNIQUE,
  user_agent  TEXT,
  ip_address  INET,              -- unified name
  device_id   TEXT,
  expires_at  TIMESTAMPTZ,
  revoked_at  TIMESTAMPTZ,       -- canonical source of truth
  is_revoked  BOOLEAN GENERATED ALWAYS AS (revoked_at IS NOT NULL) STORED,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_refresh_tokens_updated
BEFORE UPDATE ON refresh_tokens
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX idx_refresh_tokens_user_id ON refresh_tokens (user_id);
CREATE INDEX idx_refresh_tokens_active  ON refresh_tokens (user_id) WHERE revoked_at IS NULL;



-- ─────────────────────────────────────────────────────────────────────────────
-- Schema versioning
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE schema_migrations (
  version     TEXT PRIMARY KEY,
  applied_at  TIMESTAMPTZ DEFAULT NOW(),
  description TEXT
);

-- ─────────────────────────────────────────────────────────────────────────────
-- Initial data
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO states (state_code, name, country_code) VALUES
('AL','Alabama','US'),('AK','Alaska','US'),('AZ','Arizona','US'),('AR','Arkansas','US'),
('CA','California','US'),('CO','Colorado','US'),('CT','Connecticut','US'),('DE','Delaware','US'),
('FL','Florida','US'),('GA','Georgia','US'),('HI','Hawaii','US'),('ID','Idaho','US'),
('IL','Illinois','US'),('IN','Indiana','US'),('IA','Iowa','US'),('KS','Kansas','US'),
('KY','Kentucky','US'),('LA','Louisiana','US'),('ME','Maine','US'),('MD','Maryland','US'),
('MA','Massachusetts','US'),('MI','Michigan','US'),('MN','Minnesota','US'),('MS','Mississippi','US'),
('MO','Missouri','US'),('MT','Montana','US'),('NE','Nebraska','US'),('NV','Nevada','US'),
('NH','New Hampshire','US'),('NJ','New Jersey','US'),('NM','New Mexico','US'),('NY','New York','US'),
('NC','North Carolina','US'),('ND','North Dakota','US'),('OH','Ohio','US'),('OK','Oklahoma','US'),
('OR','Oregon','US'),('PA','Pennsylvania','US'),('RI','Rhode Island','US'),('SC','South Carolina','US'),
('SD','South Dakota','US'),('TN','Tennessee','US'),('TX','Texas','US'),('UT','Utah','US'),
('VT','Vermont','US'),('VA','Virginia','US'),('WA','Washington','US'),('WV','West Virginia','US'),
('WI','Wisconsin','US'),('WY','Wyoming','US'),('DC','District of Columbia','US'),
('PR','Puerto Rico','US'),('GU','Guam','US'),('VI','U.S. Virgin Islands','US'),
('AS','American Samoa','US'),('MP','Northern Mariana Islands','US')
ON CONFLICT (state_code) DO NOTHING;

-- Singleton config row
INSERT INTO mdh_config (email, phone, sms_phone, logo_url, favicon_url, facebook, instagram, tiktok, youtube, header_display, location, name)
VALUES ('service@mobiledetailhub.com', '(888) 555-1234', '+17024206066', '/assets/logo.webp', '/assets/favicon.ico',
        'https://facebook.com/mobiledetailhub', 'https://instagram.com/mobiledetailhub', 'https://tiktok.com/@mobiledetailhub', 'https://youtube.com/mobiledetailhub',
        'Mobile Detail Hub', 'Anywhere, USA', 'Mobile Detail Hub')
ON CONFLICT (id) DO NOTHING;

-- Admin user (update email/hash if desired)
INSERT INTO users (email, name, role, is_admin, password_hash, phone)
VALUES ('admin@mobiledetailhub.com', 'Brandan Coleman', 'admin', TRUE,
        '$2a$10$EAY3D9OdVXpYgby.ATOmheJwqrlTZ423Yg2a.qLzN1Ku1/oj2/LzS', NULL)
ON CONFLICT (email) DO NOTHING;

-- Seed single brand affiliate for MDH-wide reviews
INSERT INTO affiliates
  (slug, business_name, owner, phone, email, application_status, is_brand, approved_date)
VALUES
  ('mdh', 'Mobile Detail Hub', 'Mobile Detail Hub', '(888) 555-1234', 'service@mobiledetailhub.com', 'approved', TRUE, NOW())
ON CONFLICT (slug) DO NOTHING;

-- Schema version record
INSERT INTO schema_migrations (version, description)
VALUES ('v3.1', 'Normalized schema + brand affiliate + tightened indexes')
ON CONFLICT (version) DO NOTHING;

-- ─────────────────────────────────────────────────────────────────────────────
-- Views for common queries & site menus
-- ─────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE VIEW v_affiliate_base_location AS
SELECT
  f.id AS affiliate_id,
  f.slug,
  f.business_name,
  COALESCE(c.name, addr.city) AS city, -- prefer normalized city
  addr.state_code,
  addr.postal_code AS zip,
  c.name AS city_name,
  c.city_slug,
  addr.city AS legacy_city
FROM affiliates f
LEFT JOIN addresses addr ON addr.id = f.base_address_id
LEFT JOIN cities c ON c.id = addr.city_id;

CREATE OR REPLACE VIEW v_served_states AS
SELECT DISTINCT s.state_code, s.name
FROM states s
JOIN cities c ON c.state_code = s.state_code
JOIN affiliate_service_areas a ON a.city_id = c.id
ORDER BY s.name;

CREATE OR REPLACE VIEW v_served_cities AS
SELECT 
  c.state_code, 
  c.name AS city_name,
  c.city_slug,
  COUNT(DISTINCT a.affiliate_id) AS affiliates
FROM cities c
JOIN affiliate_service_areas a ON a.city_id = c.id
GROUP BY c.state_code, c.name, c.city_slug
ORDER BY c.state_code, c.name;

COMMIT;
