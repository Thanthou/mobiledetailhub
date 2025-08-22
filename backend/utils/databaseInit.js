const pool = require('../database/connection');

// Initialize database with sample data
async function initializeSampleData() {
  try {
    // Check if service_areas table has data
    const result = await pool.query('SELECT COUNT(*) FROM service_areas');
    if (parseInt(result.rows[0].count) === 0) {
      const sampleData = [
        ['California', 'Los Angeles', '90210'],
        ['California', 'San Francisco', '94102'],
        ['Texas', 'Austin', '73301'],
        ['Texas', 'Dallas', '75201'],
        ['Florida', 'Miami', '33101'],
        ['Florida', 'Orlando', '32801'],
        ['New York', 'New York', '10001'],
        ['New York', 'Buffalo', '14201']
      ];
      
      for (const [state, city, zip] of sampleData) {
        await pool.query(
          'INSERT INTO service_areas (state, city, zip) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING',
          [state, city, zip]
        );
      }
    }
  } catch (err) {
    console.error('Error initializing sample data:', err);
  }
}

// Setup basic database tables
async function setupDatabase() {
  try {
    const setupQuery = `
      -- Create users table
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        is_admin BOOLEAN DEFAULT FALSE,
        role VARCHAR(50) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );

      -- Create mdh_config table
      CREATE TABLE IF NOT EXISTS mdh_config (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255),
        phone VARCHAR(50),
        sms_phone VARCHAR(50),
        logo_url TEXT,
        favicon_url TEXT,
        header_display VARCHAR(255) DEFAULT 'Mobile Detail Hub',
        facebook VARCHAR(255),
        instagram VARCHAR(255),
        tiktok VARCHAR(255),
        youtube VARCHAR(255),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );

      -- Create basic service_areas table
      CREATE TABLE IF NOT EXISTS service_areas (
        id SERIAL PRIMARY KEY,
        state VARCHAR(50),
        city VARCHAR(100),
        zip VARCHAR(20),
        created_at TIMESTAMP DEFAULT NOW()
      );

      -- Create basic affiliates table
      CREATE TABLE IF NOT EXISTS affiliates (
        id SERIAL PRIMARY KEY,
        slug VARCHAR(100) UNIQUE NOT NULL,
        business_name VARCHAR(255) NOT NULL,
        owner VARCHAR(255) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        sms_phone VARCHAR(20),
        email VARCHAR(255) NOT NULL,
        base_location JSONB NOT NULL DEFAULT '{"city": "", "state": "", "zip": ""}',
        services JSONB NOT NULL DEFAULT '{"auto": false, "boat": false, "rv": false, "ppf": false, "ceramic": false, "paint_correction": false}',
        website_url VARCHAR(500),
        gbp_url VARCHAR(500),
        facebook_url VARCHAR(500),
        instagram_url VARCHAR(500),
        youtube_url VARCHAR(500),
        tiktok_url VARCHAR(500),
        application_status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (application_status IN ('pending', 'active', 'rejected', 'inactive')),
        
        -- Additional valuable columns:
        has_insurance BOOLEAN DEFAULT false,
        source VARCHAR(100), -- How they found you
        notes TEXT,
        uploads TEXT[], -- Store file references as text array instead of JSONB
        
        -- Business verification & compliance:
        business_license VARCHAR(100),
        insurance_provider VARCHAR(255),
        insurance_expiry DATE,
        
        -- Operational details:
        service_radius_miles INTEGER DEFAULT 25,
        operating_hours JSONB,
        emergency_contact JSONB,
        
        -- Performance metrics:
        total_jobs INTEGER DEFAULT 0,
        rating DECIMAL(3,2),
        review_count INTEGER DEFAULT 0,
        
        -- Timestamps:
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        application_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        approved_date TIMESTAMP,
        last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Create affiliate_service_areas table
      CREATE TABLE IF NOT EXISTS affiliate_service_areas (
        id SERIAL PRIMARY KEY,
        affiliate_id INTEGER REFERENCES affiliates(id) ON DELETE CASCADE,
        state VARCHAR(50) NOT NULL,
        city VARCHAR(100) NOT NULL,
        zip VARCHAR(20),
        created_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(affiliate_id, state, city)
      );

      -- Create clients table
      CREATE TABLE IF NOT EXISTS clients (
        id SERIAL PRIMARY KEY,
        user_id INTEGER,
        address TEXT,
        preferences JSONB,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
      );
    `;
    
    await pool.query(setupQuery);
    
    // Create trigger functions
    await createTriggerFunctions();
    
    // Add missing columns to existing tables
    await addMissingColumns();
    
    // Setup affiliates table indexes and triggers
    await setupAffiliatesTable();
    
    // Insert basic data after ensuring table structure
    await insertBasicData();
    
    // Initialize sample data after tables are created
    await initializeSampleData();
    
  } catch (err) {
    console.error('Error setting up database:', err);
  }
}

// Create trigger functions
async function createTriggerFunctions() {
  try {
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

  } catch (err) {
    console.error('Error creating trigger functions:', err);
  }
}

// Add missing columns to existing tables safely
async function addMissingColumns() {
  try {
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
    
    // Add any other missing columns here as needed
  } catch (err) {
    console.error('Error adding missing columns:', err);
  }
}

// Setup affiliates table indexes and triggers
async function setupAffiliatesTable() {
  try {
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
    console.error('Error setting up affiliates table:', err);
  }
}

// Insert basic data safely
async function insertBasicData() {
  try {
    // Check if mdh_config table has data
    const result = await pool.query('SELECT COUNT(*) FROM mdh_config');
    if (parseInt(result.rows[0].count) === 0) {
      await pool.query(`
        INSERT INTO mdh_config (header_display, phone, email) 
        VALUES ('Mobile Detail Hub', '+1-555-123-4567', 'info@mobiledetailhub.com')
      `);
    }
  } catch (err) {
    console.error('Error inserting basic data:', err);
  }
}

module.exports = {
  initializeSampleData,
  setupDatabase
};
