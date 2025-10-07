-- Migration: Add industry column to tenants.business table
-- Purpose: Support white-labeling by industry (mobile-detailing, pet-grooming, lawncare, maid-service)
-- Date: 2025-01-27

-- Add industry column with enum constraint
ALTER TABLE tenants.business 
ADD COLUMN industry VARCHAR(50) CHECK (industry IN ('mobile-detailing', 'pet-grooming', 'lawncare', 'maid-service'));

-- Add comment for documentation
COMMENT ON COLUMN tenants.business.industry IS 'Industry type for white-labeling configuration (mobile-detailing, pet-grooming, lawncare, maid-service)';

-- Set default industry for existing tenants based on business name analysis
-- Update existing tenants to 'mobile-detailing' as default (most are mobile detailing)
UPDATE tenants.business 
SET industry = 'mobile-detailing' 
WHERE industry IS NULL;

-- Make industry column NOT NULL after setting defaults
ALTER TABLE tenants.business 
ALTER COLUMN industry SET NOT NULL;

-- Add index for performance on industry queries
CREATE INDEX idx_business_industry ON tenants.business(industry);

-- Add unique constraint on slug+industry to prevent conflicts
-- (Optional: Uncomment if you want to allow same slug across different industries)
-- ALTER TABLE tenants.business ADD CONSTRAINT unique_slug_industry UNIQUE (slug, industry);
