-- Comprehensive Database Setup Script for Mobile Detail Hub
-- Run this in pgAdmin to create all required tables

-- 1. Users table (for authentication)
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

-- 2. MDH Config table (for site configuration)
CREATE TABLE IF NOT EXISTS mdh_config (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255),
  phone VARCHAR(50),
  sms_phone VARCHAR(50),
  logo_url TEXT,
  favicon_url TEXT,
  header_display VARCHAR(255) DEFAULT 'Mobile Detail Hub',
  tagline TEXT,
  facebook VARCHAR(255),
  instagram VARCHAR(255),
  tiktok VARCHAR(255),
  youtube VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 3. Service Areas table (for general service locations)
CREATE TABLE IF NOT EXISTS service_areas (
  id SERIAL PRIMARY KEY,
  state VARCHAR(50),
  city VARCHAR(100),
  zip VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW()
);

-- 4. Businesses table (for business profiles)
CREATE TABLE IF NOT EXISTS businesses (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(100) UNIQUE,
  name VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(50),
  sms_phone VARCHAR(50),
  address TEXT,
  domain VARCHAR(255),
  service_locations TEXT,
  state_cities TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 5. Business Area table (for business service locations)
CREATE TABLE IF NOT EXISTS business_area (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(100) NOT NULL,
  city VARCHAR(100),
  state VARCHAR(50),
  zip VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (slug) REFERENCES businesses(slug) ON DELETE CASCADE
);

-- 6. Clients table (for customer management)
CREATE TABLE IF NOT EXISTS clients (
  id SERIAL PRIMARY KEY,
  user_id INTEGER,
  address TEXT,
  preferences JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- 7. Affiliates table (for affiliate management)
CREATE TABLE IF NOT EXISTS affiliates (
  id SERIAL PRIMARY KEY,
  user_id INTEGER,
  business_id INTEGER,
  service_areas JSONB,
  onboarding_status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE SET NULL
);

-- Insert initial MDH config data
INSERT INTO mdh_config (header_display, tagline, phone, email) 
VALUES ('Mobile Detail Hub', 'Find Mobile Detailing Near You', '+1-555-123-4567', 'info@mobiledetailhub.com')
ON CONFLICT DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_businesses_slug ON businesses(slug);
CREATE INDEX IF NOT EXISTS idx_business_area_slug ON business_area(slug);
CREATE INDEX IF NOT EXISTS idx_business_area_location ON business_area(city, state);

-- Add any missing columns to existing tables (safe migration)
DO $$
BEGIN
  -- Add missing columns to users table if they don't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'is_admin') THEN
    ALTER TABLE users ADD COLUMN is_admin BOOLEAN DEFAULT FALSE;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'role') THEN
    ALTER TABLE users ADD COLUMN role VARCHAR(50) DEFAULT 'user';
  END IF;
  
  -- Add missing columns to businesses table if they don't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'businesses' AND column_name = 'sms_phone') THEN
    ALTER TABLE businesses ADD COLUMN sms_phone VARCHAR(50);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'businesses' AND column_name = 'domain') THEN
    ALTER TABLE businesses ADD COLUMN domain VARCHAR(255);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'businesses' AND column_name = 'service_locations') THEN
    ALTER TABLE businesses ADD COLUMN service_locations TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'businesses' AND column_name = 'state_cities') THEN
    ALTER TABLE businesses ADD COLUMN state_cities TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'businesses' AND column_name = 'updated_at') THEN
    ALTER TABLE businesses ADD COLUMN updated_at TIMESTAMP DEFAULT NOW();
  END IF;
END $$;

-- Verify table creation
SELECT 
  table_name,
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public' 
  AND table_name IN ('users', 'mdh_config', 'service_areas', 'businesses', 'business_area', 'clients', 'affiliates')
ORDER BY table_name;
