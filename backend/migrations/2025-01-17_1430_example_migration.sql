-- Example Migration: Add Instagram URL to business table
-- This demonstrates the migration file format and rollback structure

-- Add Instagram URL column to tenants.business table
ALTER TABLE tenants.business ADD COLUMN instagram_url TEXT;

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_business_instagram_url ON tenants.business(instagram_url) WHERE instagram_url IS NOT NULL;

-- ROLLBACK:
-- DROP INDEX IF EXISTS idx_business_instagram_url;
-- ALTER TABLE tenants.business DROP COLUMN instagram_url;
