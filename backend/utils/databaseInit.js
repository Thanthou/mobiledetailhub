const { pool } = require('../database/pool');
const bcrypt = require('bcryptjs');
const logger = require('./logger');

// Initialize database with sample data
async function initializeSampleData() {
  try {

    if (!pool) {
      logger.error('Cannot initialize sample data: no database connection available');
      return;
    }

    // Check if states table has data
    const result = await pool.query('SELECT COUNT(*) FROM states');
    if (parseInt(result.rows[0].count) === 0) {
      // Insert US states + DC + territories
      const statesData = [
        ['AL', 'Alabama', 'US'], ['AK', 'Alaska', 'US'], ['AZ', 'Arizona', 'US'], ['AR', 'Arkansas', 'US'],
        ['CA', 'California', 'US'], ['CO', 'Colorado', 'US'], ['CT', 'Connecticut', 'US'], ['DE', 'Delaware', 'US'],
        ['FL', 'Florida', 'US'], ['GA', 'Georgia', 'US'], ['HI', 'Hawaii', 'US'], ['ID', 'Idaho', 'US'],
        ['IL', 'Illinois', 'US'], ['IN', 'Indiana', 'US'], ['IA', 'Iowa', 'US'], ['KS', 'Kansas', 'US'],
        ['KY', 'Kentucky', 'US'], ['LA', 'Louisiana', 'US'], ['ME', 'Maine', 'US'], ['MD', 'Maryland', 'US'],
        ['MA', 'Massachusetts', 'US'], ['MI', 'Michigan', 'US'], ['MN', 'Minnesota', 'US'], ['MS', 'Mississippi', 'US'],
        ['MO', 'Missouri', 'US'], ['MT', 'Montana', 'US'], ['NE', 'Nebraska', 'US'], ['NV', 'Nevada', 'US'],
        ['NH', 'New Hampshire', 'US'], ['NJ', 'New Jersey', 'US'], ['NM', 'New Mexico', 'US'], ['NY', 'New York', 'US'],
        ['NC', 'North Carolina', 'US'], ['ND', 'North Dakota', 'US'], ['OH', 'Ohio', 'US'], ['OK', 'Oklahoma', 'US'],
        ['OR', 'Oregon', 'US'], ['PA', 'Pennsylvania', 'US'], ['RI', 'Rhode Island', 'US'], ['SC', 'South Carolina', 'US'],
        ['SD', 'South Dakota', 'US'], ['TN', 'Tennessee', 'US'], ['TX', 'Texas', 'US'], ['UT', 'Utah', 'US'],
        ['VT', 'Vermont', 'US'], ['VA', 'Virginia', 'US'], ['WA', 'Washington', 'US'], ['WV', 'West Virginia', 'US'],
        ['WI', 'Wisconsin', 'US'], ['WY', 'Wyoming', 'US'], ['DC', 'District of Columbia', 'US'],
        ['PR', 'Puerto Rico', 'US'], ['GU', 'Guam', 'US'], ['VI', 'U.S. Virgin Islands', 'US'],
        ['AS', 'American Samoa', 'US'], ['MP', 'Northern Mariana Islands', 'US']
      ];
      
      for (const [stateCode, name, countryCode] of statesData) {
        await pool.query(
          'INSERT INTO states (state_code, name, country_code) VALUES ($1, $2, $3) ON CONFLICT (state_code) DO NOTHING',
          [stateCode, name, countryCode]
        );
      }
      logger.info('States data initialized');
    }

    // Check if mdh_config table has data
    const configResult = await pool.query('SELECT COUNT(*) FROM mdh_config');
    if (parseInt(configResult.rows[0].count) === 0) {
      await pool.query(`
        INSERT INTO mdh_config (id, email, phone, sms_phone, logo_url, favicon_url, facebook, instagram, tiktok, youtube, header_display, location, name)
        VALUES (1, 'service@mobiledetailhub.com', '(888) 555-1234', '+17024206066', '/assets/logo.webp', '/assets/favicon.ico',
                'https://facebook.com/mobiledetailhub', 'https://instagram.com/mobiledetailhub', 'https://tiktok.com/@mobiledetailhub', 'https://youtube.com/mobiledetailhub',
                'Mobile Detail Hub', 'Anywhere, USA', 'Mobile Detail Hub')
        ON CONFLICT (id) DO NOTHING
      `);
      logger.info('MDH configuration initialized');
    }

    // Check if admin user exists
    const userResult = await pool.query('SELECT COUNT(*) FROM users WHERE email = $1', ['admin@mobiledetailhub.com']);
    if (parseInt(userResult.rows[0].count) === 0) {
      // Get admin password from environment variable or use default
      const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
      const passwordHash = await bcrypt.hash(adminPassword, 10);
      
      await pool.query(`
        INSERT INTO users (email, name, role, is_admin, password_hash, phone)
        VALUES ('admin@mobiledetailhub.com', 'Brandan Coleman', 'admin', TRUE,
                $1, '')
        ON CONFLICT (email) DO NOTHING
      `, [passwordHash]);
      logger.info('Admin user initialized');
    }

  } catch (err) {
    logger.error('Error initializing sample data:', { error: err.message });
  }
}

// Setup basic database tables
async function setupDatabase() {
  try {

    if (!pool) {
      logger.error('Cannot setup database: no database connection available');
      return;
    }

    const setupQuery = `
      -- Create extensions
      CREATE EXTENSION IF NOT EXISTS btree_gist;
      CREATE EXTENSION IF NOT EXISTS citext;
      CREATE EXTENSION IF NOT EXISTS unaccent;

      -- Create enums
      DO $$ BEGIN
        CREATE TYPE user_role AS ENUM ('admin','affiliate','customer','staff');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;

      DO $$ BEGIN
        CREATE TYPE affiliate_user_role AS ENUM ('owner','manager','tech','viewer');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;

      DO $$ BEGIN
        CREATE TYPE service_category AS ENUM ('auto','boat','rv','ppf','ceramic','paint_correction');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;

      DO $$ BEGIN
        CREATE TYPE pricing_unit AS ENUM ('flat','hour');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;

      DO $$ BEGIN
        CREATE TYPE vehicle_type AS ENUM ('auto','boat','rv');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;

      DO $$ BEGIN
        CREATE TYPE size_bucket AS ENUM ('xs','s','m','l','xl');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;

      DO $$ BEGIN
        CREATE TYPE booking_status AS ENUM ('pending','confirmed','in_progress','completed','canceled','no_show');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;

      DO $$ BEGIN
        CREATE TYPE quote_status AS ENUM ('new','contacted','priced','accepted','rejected','expired');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;

      DO $$ BEGIN
        CREATE TYPE source_platform AS ENUM ('gbp','facebook','yelp','instagram','manual');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;

      -- Utility function for updated_at trigger
      CREATE OR REPLACE FUNCTION set_updated_at()
      RETURNS TRIGGER LANGUAGE plpgsql AS $$
      BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
      END$$;

      -- Utility function for slugify
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

      -- Create states table
      CREATE TABLE IF NOT EXISTS states (
        state_code    CHAR(2) PRIMARY KEY,
        name          TEXT NOT NULL,
        country_code  CHAR(2) NOT NULL DEFAULT 'US'
      );

      -- Create cities table
      CREATE TABLE IF NOT EXISTS cities (
        id         BIGSERIAL PRIMARY KEY,
        name       TEXT NOT NULL,
        city_slug  TEXT NOT NULL,
        state_code CHAR(2) NOT NULL REFERENCES states(state_code),
        lat        DOUBLE PRECISION,
        lng        DOUBLE PRECISION,
        CONSTRAINT uq_cities_name_state UNIQUE (name, state_code),
        CONSTRAINT uq_cities_slug_state UNIQUE (city_slug, state_code)
      );

      -- Create users table
      CREATE TABLE IF NOT EXISTS users (
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

      -- Create customers table
      CREATE TABLE IF NOT EXISTS customers (
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

      -- Create addresses table for affiliate base locations
      CREATE TABLE IF NOT EXISTS addresses (
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

      -- Create affiliates table with proper base_address_id
      CREATE TABLE IF NOT EXISTS affiliates (
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
        user_id              INTEGER REFERENCES users(id) ON DELETE SET NULL,
        created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        application_date     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        approved_date        TIMESTAMPTZ,
        last_activity        TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      -- Create services table
      CREATE TABLE IF NOT EXISTS services (
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

      -- Create service_tiers table
      CREATE TABLE IF NOT EXISTS service_tiers (
        id                SERIAL PRIMARY KEY,
        service_id        INT NOT NULL REFERENCES services(id) ON DELETE CASCADE,
        name              VARCHAR(100) NOT NULL,
        price_delta_cents INT NOT NULL DEFAULT 0,
        description       TEXT,
        UNIQUE (service_id, name)
      );

      -- Create availability table
      CREATE TABLE IF NOT EXISTS availability (
        id           SERIAL PRIMARY KEY,
        affiliate_id INT NOT NULL REFERENCES affiliates(id) ON DELETE CASCADE,
        date         DATE NOT NULL,
        start_time   TIME NOT NULL,
        end_time     TIME NOT NULL,
        capacity     INT NOT NULL DEFAULT 1
      );

      -- Create quotes table
      CREATE TABLE IF NOT EXISTS quotes (
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

      -- Create bookings table
      CREATE TABLE IF NOT EXISTS bookings (
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

      -- Create affiliate_service_areas table
      CREATE TABLE IF NOT EXISTS affiliate_service_areas (
        id           SERIAL PRIMARY KEY,
        affiliate_id INT NOT NULL REFERENCES affiliates(id) ON DELETE CASCADE,
        city_id      INT NOT NULL REFERENCES cities(id) ON DELETE CASCADE,
        zip          VARCHAR(20),
        created_at   TIMESTAMPTZ DEFAULT NOW(),
        CONSTRAINT uq_aff_sa UNIQUE (affiliate_id, city_id, zip)
      );

      -- Create service_area_slugs table
      CREATE TABLE IF NOT EXISTS service_area_slugs (
        id         SERIAL PRIMARY KEY,
        slug       VARCHAR(255) NOT NULL UNIQUE,
        city_id    INT NOT NULL REFERENCES cities(id) ON DELETE CASCADE,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      -- Create location table
      CREATE TABLE IF NOT EXISTS location (
        location_id        BIGSERIAL PRIMARY KEY,
        affiliate_id       BIGINT REFERENCES affiliates(id) ON DELETE CASCADE,
        source_platform    source_platform NOT NULL,
        source_account_id  TEXT NOT NULL,
        source_location_id TEXT NOT NULL,
        display_name       TEXT,
        timezone           TEXT,
        created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      -- Create reviews table
      CREATE TABLE IF NOT EXISTS reviews (
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

      -- Create review_reply table
      CREATE TABLE IF NOT EXISTS review_reply (
        id                BIGSERIAL PRIMARY KEY,
        review_id         BIGINT NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
        text              TEXT,
        reply_update_time TIMESTAMPTZ
      );

      -- Create review_sync_state table
      CREATE TABLE IF NOT EXISTS review_sync_state (
        location_id      BIGINT PRIMARY KEY REFERENCES location(location_id) ON DELETE CASCADE,
        last_seen_update TIMESTAMPTZ
      );

      -- Create mdh_config table
      CREATE TABLE IF NOT EXISTS mdh_config (
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
    `;
    
    await pool.query(setupQuery);
    
    // Create trigger functions
    await createTriggerFunctions();
    
    // Add missing columns to existing tables
    await addMissingColumns();
    
    // Setup affiliates table indexes and triggers
    await setupAffiliatesTable();
    
    // Create views
    await createViews();
    
    // Insert basic data after ensuring table structure
    await insertBasicData();
    
    // Initialize sample data after tables are created
    await initializeSampleData();
    
  } catch (err) {
    logger.error('Error setting up database:', { error: err.message });
  }
}

// Create trigger functions
async function createTriggerFunctions() {
  try {

    if (!pool) {
      logger.error('Cannot create trigger functions: no database connection available');
      return;
    }

    // Function to update updated_at timestamp
    await pool.query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
          NEW.updated_at = CURRENT_TIMESTAMP;
          RETURN NEW;
      END;
      $$ language 'plpgsql';
    `);

    // Function to update application_date timestamp
    await pool.query(`
      CREATE OR REPLACE FUNCTION update_application_date_column()
      RETURNS TRIGGER AS $$
      BEGIN
          NEW.application_date = CURRENT_TIMESTAMP;
          RETURN NEW;
      END;
      $$ language 'plpgsql';
    `);

    // Function to update approved_date timestamp
    await pool.query(`
      CREATE OR REPLACE FUNCTION update_approved_date_column()
      RETURNS TRIGGER AS $$
      BEGIN
          NEW.approved_date = CURRENT_TIMESTAMP;
          RETURN NEW;
      END;
      $$ language 'plpgsql';
    `);

    // Function to update last_activity timestamp
    await pool.query(`
      CREATE OR REPLACE FUNCTION update_last_activity_column()
      RETURNS TRIGGER AS $$
      BEGIN
          NEW.last_activity = CURRENT_TIMESTAMP;
          RETURN NEW;
      END;
      $$ language 'plpgsql';
    `);

    // Create updated_at triggers for all tables
    const tables = ['users', 'customers', 'addresses', 'affiliates', 'quotes', 'bookings', 'mdh_config'];
    for (const table of tables) {
      await pool.query(`
        DROP TRIGGER IF EXISTS trg_${table}_updated ON ${table};
        CREATE TRIGGER trg_${table}_updated BEFORE UPDATE ON ${table}
        FOR EACH ROW EXECUTE FUNCTION set_updated_at();
      `);
    }

  } catch (err) {
    logger.error('Error creating trigger functions:', { error: err.message });
  }
}

// Add missing columns to existing tables safely
async function addMissingColumns() {
  try {

    if (!pool) {
      logger.error('Cannot add missing columns: no database connection available');
      return;
    }

    // Add tagline column if it doesn't exist
    await pool.query(`
      DO $$ 
      BEGIN 
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'mdh_config' AND column_name = 'tagline') THEN
          ALTER TABLE mdh_config ADD COLUMN tagline TEXT;
        END IF;
      END $$;
    `);
    
    // Add services_description column if it doesn't exist
    await pool.query(`
      DO $$ 
      BEGIN 
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'mdh_config' AND column_name = 'services_description') THEN
          ALTER TABLE mdh_config ADD COLUMN services_description TEXT DEFAULT 'auto detailing, boat & RV detailing, ceramic coating, and PPF';
        END IF;
      END $$;
    `);
    
    // Add user_id column to affiliates if it doesn't exist
    await pool.query(`
      DO $$ 
      BEGIN 
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'affiliates' AND column_name = 'user_id') THEN
          ALTER TABLE affiliates ADD COLUMN user_id INTEGER REFERENCES users(id) ON DELETE SET NULL;
        END IF;
      END $$;
    `);
    
    // Add any other missing columns here as needed
  } catch (err) {
    logger.error('Error adding missing columns:', { error: err.message });
  }
}

// Setup affiliates table indexes and triggers
async function setupAffiliatesTable() {
  try {

    if (!pool) {
      logger.error('Cannot setup affiliates table: no database connection available');
      return;
    }

    // Add slug_lower index if it doesn't exist
    await pool.query(`
      DO $$ 
      BEGIN 
        IF NOT EXISTS (SELECT 1 FROM pg_class WHERE relname = 'slug_lower_idx') THEN
          CREATE INDEX slug_lower_idx ON affiliates(LOWER(slug));
        END IF;
      END $$;
    `);

    // Add email_lower index if it doesn't exist
    await pool.query(`
      DO $$ 
      BEGIN 
        IF NOT EXISTS (SELECT 1 FROM pg_class WHERE relname = 'email_lower_idx') THEN
          CREATE INDEX email_lower_idx ON affiliates(LOWER(email));
        END IF;
      END $$;
    `);

    // Add phone_lower index if it doesn't exist
    await pool.query(`
      DO $$ 
      BEGIN 
        IF NOT EXISTS (SELECT 1 FROM pg_class WHERE relname = 'phone_lower_idx') THEN
          CREATE INDEX phone_lower_idx ON affiliates(LOWER(phone));
        END IF;
      END $$;
    `);

    // Add sms_phone_lower index if it doesn't exist
    await pool.query(`
      DO $$ 
      BEGIN 
        IF NOT EXISTS (SELECT 1 FROM pg_class WHERE relname = 'sms_phone_lower_idx') THEN
          CREATE INDEX sms_phone_lower_idx ON affiliates(LOWER(sms_phone));
        END IF;
      END $$;
    `);

    // Add application_status_idx if it doesn't exist
    await pool.query(`
      DO $$ 
      BEGIN 
        IF NOT EXISTS (SELECT 1 FROM pg_class WHERE relname = 'application_status_idx') THEN
          CREATE INDEX application_status_idx ON affiliates(application_status);
        END IF;
      END $$;
    `);

    // Add last_activity_idx if it doesn't exist
    await pool.query(`
      DO $$ 
      BEGIN 
        IF NOT EXISTS (SELECT 1 FROM pg_class WHERE relname = 'last_activity_idx') THEN
          CREATE INDEX last_activity_idx ON affiliates(last_activity);
        END IF;
      END $$;
    `);

    // Add application_date_idx if it doesn't exist
    await pool.query(`
      DO $$ 
      BEGIN 
        IF NOT EXISTS (SELECT 1 FROM pg_class WHERE relname = 'application_date_idx') THEN
          CREATE INDEX application_date_idx ON affiliates(application_date);
        END IF;
      END $$;
    `);

    // Add approved_date_idx if it doesn't exist
    await pool.query(`
      DO $$ 
      BEGIN 
        IF NOT EXISTS (SELECT 1 FROM pg_class WHERE relname = 'approved_date_idx') THEN
          CREATE INDEX approved_date_idx ON affiliates(approved_date);
        END IF;
      END $$;
    `);

    // Add updated_at_trigger if it doesn't exist
    await pool.query(`
      DO $$ 
      BEGIN 
        IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_affiliates_updated_at') THEN
          CREATE TRIGGER update_affiliates_updated_at
          BEFORE UPDATE ON affiliates
          FOR EACH ROW
          EXECUTE FUNCTION update_updated_at_column();
        END IF;
      END $$;
    `);

    // Add application_date_trigger if it doesn't exist
    await pool.query(`
      DO $$ 
      BEGIN 
        IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_affiliates_application_date') THEN
          CREATE TRIGGER update_affiliates_application_date
          BEFORE UPDATE ON affiliates
          FOR EACH ROW
          EXECUTE FUNCTION update_application_date_column();
        END IF;
      END $$;
    `);

    // Add approved_date_trigger if it doesn't exist
    await pool.query(`
      DO $$ 
      BEGIN 
        IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_affiliates_approved_date') THEN
          CREATE TRIGGER update_affiliates_approved_date
          BEFORE UPDATE ON affiliates
          FOR EACH ROW
          EXECUTE FUNCTION update_approved_date_column();
        END IF;
      END $$;
    `);

    // Add last_activity_trigger if it doesn't exist
    await pool.query(`
      DO $$ 
      BEGIN 
        IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_affiliates_last_activity') THEN
          CREATE TRIGGER update_affiliates_last_activity
          BEFORE UPDATE ON affiliates
          FOR EACH ROW
          EXECUTE FUNCTION update_last_activity_column();
        END IF;
      END $$;
    `);

  } catch (err) {
    logger.error('Error setting up affiliates table:', { error: err.message });
  }
}

// Create views for common queries
async function createViews() {
  try {

    if (!pool) {
      logger.error('Cannot create views: no database connection available');
      return;
    }

    // View for affiliate base location information (joins base address)
    await pool.query(`
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
    `);

    // States with at least one affiliate coverage row
    await pool.query(`
      CREATE OR REPLACE VIEW v_served_states AS
      SELECT DISTINCT s.state_code, s.name
      FROM states s
      JOIN affiliate_service_areas a ON a.state_code = s.state_code
      ORDER BY s.name;
    `);

    // Cities per state with affiliate counts
    await pool.query(`
      CREATE OR REPLACE VIEW v_served_cities AS
      SELECT a.state_code, a.city, COUNT(DISTINCT a.affiliate_id) AS affiliates
      FROM affiliate_service_areas a
      GROUP BY a.state_code, a.city
      ORDER BY a.state_code, a.city;
    `);

  } catch (err) {
    logger.error('Error creating views:', { error: err.message });
  }
}

// Insert basic data safely
async function insertBasicData() {
  try {

    if (!pool) {
      logger.error('Cannot insert basic data: no database connection available');
      return;
    }

    // Check if mdh_config table has data
    const result = await pool.query('SELECT COUNT(*) FROM mdh_config');
    if (parseInt(result.rows[0].count) === 0) {
      await pool.query(`
        INSERT INTO mdh_config (id, email, phone, sms_phone, logo_url, favicon_url, facebook, instagram, tiktok, youtube, header_display, location, name) 
        VALUES (1, 'service@mobiledetailhub.com', '(888) 555-1234', '+17024206066', '/assets/logo.webp', '/assets/favicon.ico',
                'https://facebook.com/mobiledetailhub', 'https://instagram.com/mobiledetailhub', 'https://tiktok.com/@mobiledetailhub', 'https://youtube.com/mobiledetailhub',
                'Mobile Detail Hub', 'Anywhere, USA', 'Mobile Detail Hub')
        ON CONFLICT (id) DO NOTHING
      `);
    }
  } catch (err) {
    logger.error('Error inserting basic data:', { error: err.message });
  }
}

module.exports = {
  initializeSampleData,
  setupDatabase
};
