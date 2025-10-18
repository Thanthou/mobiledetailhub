-- Migration: Remove default values from social media enabled columns
-- Date: 2025-10-18
-- Description: Removes DEFAULT true from social media enabled columns to prevent them from being reset

-- Remove default values from social media enabled columns
ALTER TABLE tenants.business 
ALTER COLUMN facebook_enabled DROP DEFAULT,
ALTER COLUMN instagram_enabled DROP DEFAULT,
ALTER COLUMN tiktok_enabled DROP DEFAULT,
ALTER COLUMN youtube_enabled DROP DEFAULT;

-- ROLLBACK: Re-add default values
-- ALTER TABLE tenants.business 
-- ALTER COLUMN facebook_enabled SET DEFAULT true,
-- ALTER COLUMN instagram_enabled SET DEFAULT true,
-- ALTER COLUMN tiktok_enabled SET DEFAULT true,
-- ALTER COLUMN youtube_enabled SET DEFAULT true;
