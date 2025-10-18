-- Migration: Add social media configuration to tenants table
-- Date: 2025-10-18
-- Description: Adds JSONB column for social media URLs and enable/disable settings

-- Add social_media column to business table
ALTER TABLE tenants.business 
ADD COLUMN social_media JSONB DEFAULT '{
  "facebook": {"url": "", "enabled": true},
  "instagram": {"url": "", "enabled": true}, 
  "tiktok": {"url": "", "enabled": true},
  "youtube": {"url": "", "enabled": true}
}'::jsonb;

-- Add comment for documentation
COMMENT ON COLUMN tenants.business.social_media IS 'Social media configuration with URL and enabled status for each platform';

-- Create index for JSONB queries (optional, for performance)
CREATE INDEX idx_business_social_media ON tenants.business USING GIN (social_media);

-- Update existing tenants to have the default social media structure
UPDATE tenants.business 
SET social_media = '{
  "facebook": {"url": "", "enabled": true},
  "instagram": {"url": "", "enabled": true},
  "tiktok": {"url": "", "enabled": true},
  "youtube": {"url": "", "enabled": true}
}'::jsonb
WHERE social_media IS NULL;

-- ROLLBACK: Remove social_media column and index
-- DROP INDEX IF EXISTS idx_business_social_media;
-- ALTER TABLE tenants.business DROP COLUMN IF EXISTS social_media;
