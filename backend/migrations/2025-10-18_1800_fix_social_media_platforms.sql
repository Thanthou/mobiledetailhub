-- Migration: Fix social media platforms in tenants table
-- Date: 2025-10-18
-- Description: Corrects social media structure to use tiktok instead of linkedin

-- Update the social_media column to use the correct platforms
UPDATE tenants.business 
SET social_media = jsonb_set(
  jsonb_set(
    jsonb_set(
      jsonb_set(
        COALESCE(social_media, '{}'::jsonb),
        '{tiktok}', COALESCE(social_media->'linkedin', '{"url": "", "enabled": false}'::jsonb)
      ),
      '{youtube}', '{"url": "", "enabled": false}'::jsonb
    ),
    '{facebook}', COALESCE(social_media->'facebook', '{"url": "", "enabled": false}'::jsonb)
  ),
  '{instagram}', COALESCE(social_media->'instagram', '{"url": "", "enabled": false}'::jsonb)
)
WHERE social_media IS NOT NULL;

-- Remove linkedin and twitter if they exist, keep facebook, instagram, tiktok, youtube
UPDATE tenants.business 
SET social_media = social_media - 'linkedin' - 'twitter'
WHERE social_media ? 'linkedin' OR social_media ? 'twitter';

-- Ensure all tenants have the correct structure with enabled: true by default
UPDATE tenants.business 
SET social_media = '{
  "facebook": {"url": "", "enabled": true},
  "instagram": {"url": "", "enabled": true},
  "tiktok": {"url": "", "enabled": true},
  "youtube": {"url": "", "enabled": true}
}'::jsonb
WHERE social_media IS NULL;

-- ROLLBACK: Revert to linkedin/twitter structure
-- UPDATE tenants.business 
-- SET social_media = jsonb_set(
--   jsonb_set(
--     COALESCE(social_media, '{}'::jsonb),
--     '{linkedin}', COALESCE(social_media->'tiktok', '{"url": "", "enabled": false}'::jsonb)
--   ),
--   '{twitter}', '{"url": "", "enabled": false}'::jsonb
-- )
-- WHERE social_media IS NOT NULL;
-- UPDATE tenants.business 
-- SET social_media = social_media - 'tiktok' - 'youtube'
-- WHERE social_media ? 'tiktok' OR social_media ? 'youtube';
