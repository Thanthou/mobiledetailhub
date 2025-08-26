-- Mobile Detail Hub schema v1.0 (fresh rebuild)
-- Postgres 14+ recommended

BEGIN;

-- ─────────────────────────────────────────────────────────────────────────────
-- Extensions
-- ─────────────────────────────────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS btree_gist;  -- for exclusion constraints ( = on ints + ranges )
CREATE EXTENSION IF NOT EXISTS citext;      -- for case-insensitive emails

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

  -- Drop enums we’ll recreate
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
-- Timestamp trigger for updated_at
-- ─────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END$$;

-- ─────────────────────────────────────────────────────────────────────────────
-- Geo reference
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE states (
  state_code    CHAR(2) PRIMARY KEY,
  name          TEXT NOT NULL,
  country_code  CHAR(2) NOT NULL DEFAULT 'US'
);

CREATE TABLE cities (
  id        BIGSERIAL PRIMARY KEY,
  name      TEXT NOT NULL,
  city_slug TEXT NOT NULL,
  state_code CHAR(2) NOT NULL REFERENCES states(state_code),
  lat       DOUBLE PRECISION,
  lng       DOUBLE PRECISION,
  CONSTRAINT uq_cities_name_state UNIQUE (name, state_code)
);

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
  created_at    TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE TRIGGER trg_users_updated BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE addresses (
  id            SERIAL PRIMARY KEY,
  line1         TEXT NOT NULL,
  line2         TEXT,
  city          TEXT NOT NULL,
  state_code    CHAR(2) NOT NULL REFERENCES states(state_code),
  postal_code   TEXT,
  lat           DOUBLE PRECISION,
  lng           DOUBLE PRECISION,
  created_at    TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMP NOT NULL DEFAULT NOW()
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
  base_address_id      INT REFERENCES addresses(id),
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
  business_license     VARCHAR(100),
  insurance_provider   VARCHAR(255),
  insurance_expiry     DATE,
  service_radius_miles INT DEFAULT 25,
  operating_hours      JSONB,
  emergency_contact    JSONB,
  total_jobs           INT DEFAULT 0,
  rating               NUMERIC,
  review_count         INT DEFAULT 0,
  created_at           TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMP NOT NULL DEFAULT NOW(),
  application_date     TIMESTAMP NOT NULL DEFAULT NOW(),
  approved_date        TIMESTAMP,
  last_activity        TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE TRIGGER trg_affiliates_updated BEFORE UPDATE ON affiliates
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE affiliate_users (
  affiliate_id INT NOT NULL REFERENCES affiliates(id) ON DELETE CASCADE,
  user_id      INT NOT NULL REFERENCES users(id)      ON DELETE CASCADE,
  role         affiliate_user_role NOT NULL,
  created_at   TIMESTAMP NOT NULL DEFAULT NOW(),
  PRIMARY KEY (affiliate_id, user_id)
);

-- ─────────────────────────────────────────────────────────────────────────────
-- Customers & vehicles
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE customers (
  id                 SERIAL PRIMARY KEY,
  user_id            INT REFERENCES users(id) ON DELETE SET NULL,
  name               VARCHAR(255) NOT NULL,
  email              VARCHAR(255),
  phone              VARCHAR(50),
  default_address_id INT REFERENCES addresses(id) ON DELETE SET NULL,
  preferences        JSONB,
  created_at         TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at         TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE TRIGGER trg_customers_updated BEFORE UPDATE ON customers
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE vehicles (
  id            SERIAL PRIMARY KEY,
  customer_id   INT NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  type          vehicle_type NOT NULL,
  year          INT,
  make          TEXT,
  model         TEXT,
  trim          TEXT,
  color         TEXT,
  size_bucket   size_bucket,
  length_feet   NUMERIC,
  notes         TEXT,
  created_at    TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE TRIGGER trg_vehicles_updated BEFORE UPDATE ON vehicles
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

CREATE TABLE pricing_rules (
  id                SERIAL PRIMARY KEY,
  affiliate_id      INT NOT NULL REFERENCES affiliates(id) ON DELETE CASCADE,
  service_id        INT REFERENCES services(id) ON DELETE CASCADE,
  vehicle_type      vehicle_type,
  size_bucket       size_bucket,
  multiplier        NUMERIC,   -- e.g., 1.25
  delta_cents       INT,       -- e.g., +1500
  min_price_cents   INT,
  notes             TEXT
);

-- ─────────────────────────────────────────────────────────────────────────────
-- Availability (rules + exceptions + blocks)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE availability_rules (
  id          SERIAL PRIMARY KEY,
  affiliate_id INT NOT NULL REFERENCES affiliates(id) ON DELETE CASCADE,
  dow         SMALLINT NOT NULL CHECK (dow BETWEEN 0 AND 6), -- 0=Sun
  start_time  TIME NOT NULL,
  end_time    TIME NOT NULL,
  capacity    INT NOT NULL DEFAULT 1,
  timezone    TEXT NOT NULL
);

CREATE TABLE availability_exceptions (
  id                SERIAL PRIMARY KEY,
  affiliate_id      INT NOT NULL REFERENCES affiliates(id) ON DELETE CASCADE,
  date              DATE NOT NULL,
  start_time        TIME,
  end_time          TIME,
  is_closed         BOOLEAN NOT NULL DEFAULT FALSE,
  capacity_override INT,
  note              TEXT
);

CREATE TABLE calendar_blocks (
  id                SERIAL PRIMARY KEY,
  affiliate_id      INT NOT NULL REFERENCES affiliates(id) ON DELETE CASCADE,
  start_at          TIMESTAMPTZ NOT NULL,
  end_at            TIMESTAMPTZ NOT NULL,
  reason            TEXT,
  created_by_user_id INT REFERENCES users(id) ON DELETE SET NULL
);

-- ─────────────────────────────────────────────────────────────────────────────
-- Quotes & bookings
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE quotes (
  id                     SERIAL PRIMARY KEY,
  affiliate_id           INT NOT NULL REFERENCES affiliates(id) ON DELETE CASCADE,
  customer_id            INT REFERENCES customers(id) ON DELETE SET NULL,
  address_id             INT REFERENCES addresses(id) ON DELETE SET NULL,
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
  id                     SERIAL PRIMARY KEY,
  affiliate_id           INT NOT NULL REFERENCES affiliates(id) ON DELETE CASCADE,
  customer_id            INT REFERENCES customers(id) ON DELETE SET NULL,
  service_id             INT NOT NULL REFERENCES services(id) ON DELETE RESTRICT,
  tier_id                INT REFERENCES service_tiers(id) ON DELETE SET NULL,
  vehicle_id             INT REFERENCES vehicles(id) ON DELETE SET NULL,
  quote_id               INT REFERENCES quotes(id) ON DELETE SET NULL,
  address_id             INT REFERENCES addresses(id) ON DELETE SET NULL,
  appointment_start      TIMESTAMPTZ NOT NULL,
  appointment_end        TIMESTAMPTZ NOT NULL,
  status                 booking_status NOT NULL DEFAULT 'pending',
  total_cents            INT NOT NULL DEFAULT 0,
  stripe_payment_intent_id TEXT,
  created_at             TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at             TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  -- prevent overlapping active bookings per affiliate
  EXCLUDE USING gist (
    affiliate_id WITH =,
    tstzrange(appointment_start, appointment_end) WITH &&
  )
  WHERE (status IN ('pending','confirmed','in_progress'))
);
CREATE TRIGGER trg_bookings_updated BEFORE UPDATE ON bookings
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX idx_bookings_affiliate_start ON bookings (affiliate_id, appointment_start);
CREATE INDEX idx_quotes_affiliate_status   ON quotes (affiliate_id, status);

-- ─────────────────────────────────────────────────────────────────────────────
-- Service areas (single source of truth)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE affiliate_service_areas (
  affiliate_id INT NOT NULL REFERENCES affiliates(id) ON DELETE CASCADE,
  city_id      BIGINT NOT NULL REFERENCES cities(id) ON DELETE CASCADE,
  zip          TEXT, -- optional (null = whole city)
  priority     SMALLINT NOT NULL DEFAULT 0,
  created_at   TIMESTAMP NOT NULL DEFAULT NOW(),
  PRIMARY KEY (affiliate_id, city_id, zip)
);
CREATE INDEX idx_asa_affiliate ON affiliate_service_areas (affiliate_id);

-- ─────────────────────────────────────────────────────────────────────────────
-- Reviews / locations (unified)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE locations (
  location_id       BIGSERIAL PRIMARY KEY,
  affiliate_id      INT REFERENCES affiliates(id) ON DELETE CASCADE,
  source_platform   source_platform NOT NULL,
  source_account_id TEXT NOT NULL,
  source_location_id TEXT NOT NULL,
  display_name      TEXT,
  timezone          TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE reviews (
  id                 BIGSERIAL PRIMARY KEY,
  external_id        TEXT,
  affiliate_id       INT NOT NULL REFERENCES affiliates(id) ON DELETE CASCADE,
  location_id        BIGINT REFERENCES locations(location_id) ON DELETE SET NULL,
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

CREATE TABLE review_replies (
  id                BIGSERIAL PRIMARY KEY,
  review_id         BIGINT NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
  text              TEXT,
  reply_update_time TIMESTAMPTZ
);

CREATE TABLE review_sync_state (
  location_id      BIGINT PRIMARY KEY REFERENCES locations(location_id) ON DELETE CASCADE,
  last_seen_update TIMESTAMPTZ
);

-- ─────────────────────────────────────────────────────────────────────────────
-- Files (polymorphic attachments)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE files (
  id          BIGSERIAL PRIMARY KEY,
  owner_type  TEXT NOT NULL CHECK (owner_type IN ('affiliate','booking','quote','review')),
  owner_id    BIGINT NOT NULL,
  file_key    TEXT NOT NULL,   -- storage key/path
  mime        TEXT,
  size        INT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_files_owner ON files (owner_type, owner_id);

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
  services_description  TEXT DEFAULT 'auto,boat & RV detailing, paint correction, ceramic coating, and PPF',
  created_at            TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE TRIGGER trg_mdh_config_updated BEFORE UPDATE ON mdh_config
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ─────────────────────────────────────────────────────────────────────────────
-- Seed minimal reference + admin user (edit as needed)
-- ─────────────────────────────────────────────────────────────────────────────
-- States you actively use (expand later)
INSERT INTO states (state_code, name) VALUES
  ('AZ','Arizona'),
  ('NV','Nevada'),
  ('CA','California')
ON CONFLICT DO NOTHING;

-- Singleton config row
INSERT INTO mdh_config (id, email, phone, sms_phone, logo_url, favicon_url, facebook, instagram, tiktok, youtube, header_display, location, name)
VALUES (1, 'service@mobiledetailhub.com', '(888) 555-1234', '+17024206066', '/assets/logo.webp', '/assets/favicon.ico',
        'https://facebook.com/mobiledetailhub', 'https://instagram.com/mobiledetailhub', 'https://tiktok.com/@mobiledetailhub', 'https://youtube.com/mobiledetailhub',
        'Mobile Detail Hub', 'Anywhere, USA', 'Mobile Detail Hub')
ON CONFLICT (id) DO NOTHING;

-- Admin user (update email/hash if desired)
-- NOTE: This hash is from your example; replace if you rotate credentials.
INSERT INTO users (email, name, role, is_admin, password_hash, phone)
VALUES ('admin@mobiledetailhub.com', 'Brandan Coleman', 'admin', TRUE,
        '$2a$10$EAY3D9OdVXpYgby.ATOmheJwqrlTZ423Yg2a.qLzN1Ku1/oj2/LzS', '')
ON CONFLICT (email) DO NOTHING;

-- ─────────────────────────────────────────────────────────────────────────────
-- Views for common queries
-- ─────────────────────────────────────────────────────────────────────────────

-- View for affiliate base location information
CREATE OR REPLACE VIEW v_affiliate_base_location AS
SELECT
  f.id AS affiliate_id,
  f.slug,
  f.business_name,
  a.city,
  a.state_code,
  s.name AS state_name,
  a.postal_code AS zip,
  a.lat,
  a.lng
FROM affiliates f
LEFT JOIN addresses a ON a.id = f.base_address_id
LEFT JOIN states s ON s.state_code = a.state_code;

-- Function to seed affiliate service areas when approved
CREATE OR REPLACE FUNCTION seed_affiliate_service_areas()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
DECLARE
  city_id BIGINT;
  zip_value TEXT;
BEGIN
  -- Only proceed if status changed to 'approved'
  IF NEW.application_status = 'approved' AND (OLD.application_status != 'approved' OR OLD.application_status IS NULL) THEN
    
    -- Get base address information
    SELECT 
      c.id,
      a.postal_code
    INTO city_id, zip_value
    FROM affiliates f
    JOIN addresses a ON a.id = f.base_address_id
    LEFT JOIN cities c ON c.name = a.city AND c.state_code = a.state_code
    WHERE f.id = NEW.id;
    
    -- If we have a city, seed the service area
    IF city_id IS NOT NULL THEN
      -- Insert city-wide coverage
      INSERT INTO affiliate_service_areas (affiliate_id, city_id, zip, priority)
      VALUES (NEW.id, city_id, NULL, 0)
      ON CONFLICT (affiliate_id, city_id, zip) DO NOTHING;
      
      -- Insert zip-specific coverage if available
      IF zip_value IS NOT NULL AND zip_value != '' THEN
        INSERT INTO affiliate_service_areas (affiliate_id, city_id, zip, priority)
        VALUES (NEW.id, city_id, zip_value, 0)
        ON CONFLICT (affiliate_id, city_id, zip) DO NOTHING;
      END IF;
    END IF;
  END IF;
  
  RETURN NEW;
END$$;

-- Trigger to automatically seed service areas when affiliate is approved
CREATE TRIGGER trg_affiliate_approved
  AFTER UPDATE ON affiliates
  FOR EACH ROW
  EXECUTE FUNCTION seed_affiliate_service_areas();

COMMIT;
