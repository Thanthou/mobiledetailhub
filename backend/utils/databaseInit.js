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
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255),
        phone VARCHAR(50),
        sms_phone VARCHAR(50),
        address TEXT,
        logo_url TEXT,
        website VARCHAR(255),
        description TEXT,
        service_areas TEXT[],
        state_cities JSONB,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
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
    
    // Add missing columns to existing tables
    await addMissingColumns();
    
    // Insert basic data after ensuring table structure
    await insertBasicData();
    
    // Initialize sample data after tables are created
    await initializeSampleData();
    
  } catch (err) {
    console.error('Error setting up database:', err);
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
