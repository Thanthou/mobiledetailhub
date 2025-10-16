-- Update website column to use new domain format
-- This migration updates the generated column to use thatsmartsite.com instead of mobiledetailhub.com

-- First, we need to recreate the generated column with the new domain format
-- Since we can't drop a generated column that has dependencies, we'll use a different approach

-- Create a new column with the correct format
ALTER TABLE tenants.business ADD COLUMN website_new TEXT GENERATED ALWAYS AS (
  CASE 
    WHEN slug IS NOT NULL THEN 'http://' || slug || '.thatsmartsite.com'
    ELSE NULL 
  END
) STORED;

-- Drop the old column (this will work once we have the new one)
ALTER TABLE tenants.business DROP COLUMN website;

-- Rename the new column to the original name
ALTER TABLE tenants.business RENAME COLUMN website_new TO website;

-- Add a comment to document the change
COMMENT ON COLUMN tenants.business.website IS 'Generated column that creates website URL using subdomain format: http://{slug}.thatsmartsite.com';
