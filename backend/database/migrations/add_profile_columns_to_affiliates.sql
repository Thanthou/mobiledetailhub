-- Migration: Add profile columns to affiliates table
-- Version: v5.2
-- Description: Add personal and business profile fields to affiliates table

BEGIN;

-- Add profile columns to affiliates table
ALTER TABLE affiliates.affiliates 
ADD COLUMN IF NOT EXISTS first_name VARCHAR(100),
ADD COLUMN IF NOT EXISTS last_name VARCHAR(100),
ADD COLUMN IF NOT EXISTS personal_phone VARCHAR(20),
ADD COLUMN IF NOT EXISTS personal_email VARCHAR(255),
ADD COLUMN IF NOT EXISTS business_email VARCHAR(255),
ADD COLUMN IF NOT EXISTS business_phone VARCHAR(20),
ADD COLUMN IF NOT EXISTS business_start_date DATE;

-- Add comments for documentation
COMMENT ON COLUMN affiliates.affiliates.first_name IS 'Affiliate first name';
COMMENT ON COLUMN affiliates.affiliates.last_name IS 'Affiliate last name';
COMMENT ON COLUMN affiliates.affiliates.personal_phone IS 'Personal phone number';
COMMENT ON COLUMN affiliates.affiliates.personal_email IS 'Personal email address';
COMMENT ON COLUMN affiliates.tenants.business_email IS 'Business email address';
COMMENT ON COLUMN affiliates.tenants.business_phone IS 'Business phone number';
COMMENT ON COLUMN affiliates.tenants.business_start_date IS 'Date when business started';

-- Add constraints for data integrity
ALTER TABLE affiliates.affiliates 
ADD CONSTRAINT IF NOT EXISTS check_personal_email_format 
CHECK (personal_email IS NULL OR personal_email ~ '^[^\s@]+@[^\s@]+\.[^\s@]+$');

ALTER TABLE affiliates.affiliates 
ADD CONSTRAINT IF NOT EXISTS check_business_email_format 
CHECK (business_email IS NULL OR business_email ~ '^[^\s@]+@[^\s@]+\.[^\s@]+$');

ALTER TABLE affiliates.affiliates 
ADD CONSTRAINT IF NOT EXISTS check_personal_phone_format 
CHECK (personal_phone IS NULL OR personal_phone ~ '^[\d\s\-\+\(\)]{10,20}$');

ALTER TABLE affiliates.affiliates 
ADD CONSTRAINT IF NOT EXISTS check_business_phone_format 
CHECK (business_phone IS NULL OR business_phone ~ '^[\d\s\-\+\(\)]{10,20}$');

-- Update migration tracking
INSERT INTO system.schema_migrations(version, description) VALUES
('v5.2', 'Added profile columns (first_name, last_name, personal_phone, personal_email, business_email, business_phone, business_start_date) to affiliates table');

COMMIT;

-- ─────────────────────────────────────────────────────────────────────────────
-- Verification queries
-- ─────────────────────────────────────────────────────────────────────────────

-- Verify columns were added
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_schema = 'affiliates' 
AND table_name = 'affiliates' 
AND column_name IN ('first_name', 'last_name', 'personal_phone', 'personal_email', 'business_email', 'business_phone', 'business_start_date')
ORDER BY column_name;
