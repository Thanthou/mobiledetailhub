-- Migration: Create affiliates table
-- Run this script to set up the affiliates table for affiliate applications

-- Drop the existing table if it exists
DROP TABLE IF EXISTS affiliates CASCADE;

-- Create the new affiliates table
CREATE TABLE affiliates (
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

-- Create indexes for better performance
CREATE INDEX idx_affiliates_slug ON affiliates(slug);
CREATE INDEX idx_affiliates_status ON affiliates(application_status);
CREATE INDEX idx_affiliates_location ON affiliates USING GIN(base_location);
CREATE INDEX idx_affiliates_services ON affiliates USING GIN(services);

-- Create a trigger to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_affiliates_updated_at 
    BEFORE UPDATE ON affiliates 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample data for testing (optional)
-- INSERT INTO affiliates (slug, business_name, owner, phone, email, base_location, services, application_status) 
-- VALUES ('sample-detail-shop', 'Sample Detail Shop', 'John Doe', '5551234567', 'john@sample.com', '{"city": "Sample City", "state": "CA", "zip": "12345"}', '{"auto": true, "boat": false, "rv": false, "ppf": false, "ceramic": true, "paint_correction": false}', 'active');

COMMENT ON TABLE affiliates IS 'Stores affiliate business applications and information';
COMMENT ON COLUMN affiliates.slug IS 'URL-friendly identifier for the affiliate';
COMMENT ON COLUMN affiliates.services IS 'JSONB object indicating which services the affiliate offers';
COMMENT ON COLUMN affiliates.base_location IS 'Primary service area location';
COMMENT ON COLUMN affiliates.application_status IS 'Current status of the affiliate application';
