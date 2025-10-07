-- Migration: Reorder industry column to position 2 (after id)
-- Purpose: Move industry column to be right after id for better readability
-- Date: 2025-01-27

-- Create a new table with the desired column order
CREATE TABLE tenants.business_new (
    id SERIAL PRIMARY KEY,
    industry VARCHAR(50) NOT NULL CHECK (industry IN ('mobile-detailing', 'pet-grooming', 'lawncare', 'maid-service')),
    slug VARCHAR(255) UNIQUE NOT NULL,
    business_name VARCHAR(255) NOT NULL,
    owner VARCHAR(255) GENERATED ALWAYS AS (
        CASE 
            WHEN first_name IS NOT NULL AND last_name IS NOT NULL THEN first_name || ' ' || last_name
            WHEN first_name IS NOT NULL THEN first_name
            WHEN last_name IS NOT NULL THEN last_name
            ELSE NULL
        END
    ) STORED,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    user_id INTEGER,
    application_status VARCHAR(50) DEFAULT 'pending',
    business_start_date DATE,
    business_phone VARCHAR(20),
    personal_phone VARCHAR(20),
    business_email VARCHAR(255),
    personal_email VARCHAR(255),
    twilio_phone VARCHAR(20),
    sms_phone VARCHAR(20) GENERATED ALWAYS AS (
        CASE 
            WHEN business_phone IS NOT NULL THEN '+1' || business_phone
            ELSE NULL
        END
    ) STORED,
    website TEXT GENERATED ALWAYS AS (
        CASE 
            WHEN slug IS NOT NULL THEN 'http://mobiledetailhub.com/' || slug
            ELSE NULL
        END
    ) STORED,
    gbp_url TEXT,
    facebook_url TEXT,
    instagram_url TEXT,
    youtube_url TEXT,
    tiktok_url TEXT,
    source VARCHAR(255),
    notes TEXT,
    service_areas JSONB,
    application_date TIMESTAMP WITH TIME ZONE,
    approved_date TIMESTAMP WITH TIME ZONE,
    last_activity TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Copy all data from the old table to the new table
INSERT INTO tenants.business_new (
    id, industry, slug, business_name, first_name, last_name, user_id,
    application_status, business_start_date, business_phone, personal_phone,
    business_email, personal_email, twilio_phone, gbp_url, facebook_url,
    instagram_url, youtube_url, tiktok_url, source, notes, service_areas,
    application_date, approved_date, last_activity, created_at, updated_at
)
SELECT 
    id, industry, slug, business_name, first_name, last_name, user_id,
    application_status, business_start_date, business_phone, personal_phone,
    business_email, personal_email, twilio_phone, gbp_url, facebook_url,
    instagram_url, youtube_url, tiktok_url, source, notes, service_areas,
    application_date, approved_date, last_activity, created_at, updated_at
FROM tenants.business;

-- Recreate all indexes on the new table
CREATE INDEX IF NOT EXISTS idx_business_slug ON tenants.business_new(slug);
CREATE INDEX IF NOT EXISTS idx_business_user_id ON tenants.business_new(user_id);
CREATE INDEX IF NOT EXISTS idx_business_application_status ON tenants.business_new(application_status);
CREATE INDEX IF NOT EXISTS idx_business_created_at ON tenants.business_new(created_at);
CREATE INDEX IF NOT EXISTS idx_business_industry ON tenants.business_new(industry);

-- Recreate the trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION tenants.update_business_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger on the new table
CREATE TRIGGER trigger_business_updated_at
    BEFORE UPDATE ON tenants.business_new
    FOR EACH ROW
    EXECUTE FUNCTION tenants.update_business_updated_at();

-- Drop the old table and rename the new one
DROP TABLE tenants.business CASCADE;
ALTER TABLE tenants.business_new RENAME TO business;

-- Add the comment back to the industry column
COMMENT ON COLUMN tenants.business.industry IS 'Industry type for white-labeling configuration (mobile-detailing, pet-grooming, lawncare, maid-service)';
