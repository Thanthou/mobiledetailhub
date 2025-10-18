
-- Migration: Add individual social media enabled columns
-- Date: 2025-10-18
-- Description: Adds individual enabled columns for social media platforms

-- Add individual social media enabled columns
ALTER TABLE tenants.business 
ADD COLUMN facebook_enabled BOOLEAN DEFAULT true,
ADD COLUMN instagram_enabled BOOLEAN DEFAULT true,
ADD COLUMN tiktok_enabled BOOLEAN DEFAULT true,
ADD COLUMN youtube_enabled BOOLEAN DEFAULT true;

-- Drop the social_media JSONB column
ALTER TABLE tenants.business 
DROP COLUMN IF EXISTS social_media;

-- ROLLBACK: Re-add social_media JSONB column and drop individual columns
-- ALTER TABLE tenants.business 
-- ADD COLUMN social_media JSONB DEFAULT '{
--   "facebook": {"url": "", "enabled": true},
--   "instagram": {"url": "", "enabled": true},
--   "tiktok": {"url": "", "enabled": true},
--   "youtube": {"url": "", "enabled": true}
-- }'::jsonb;
-- ALTER TABLE tenants.business 
-- DROP COLUMN IF EXISTS facebook_url,
-- DROP COLUMN IF EXISTS facebook_enabled,
-- DROP COLUMN IF EXISTS instagram_url,
-- DROP COLUMN IF EXISTS instagram_enabled,
-- DROP COLUMN IF EXISTS tiktok_url,
-- DROP COLUMN IF EXISTS tiktok_enabled,
-- DROP COLUMN IF EXISTS youtube_url,
-- DROP COLUMN IF EXISTS youtube_enabled;
