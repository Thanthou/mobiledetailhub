-- Migration: Enable all social media platforms by default for existing tenants
-- Date: 2025-10-18
-- Description: Updates existing tenants to have all social media platforms enabled by default

-- Update existing tenants to enable all social media platforms by default
UPDATE tenants.business 
SET social_media = jsonb_set(
  jsonb_set(
    jsonb_set(
      jsonb_set(
        COALESCE(social_media, '{}'::jsonb),
        '{facebook,enabled}', 'true'::jsonb
      ),
      '{instagram,enabled}', 'true'::jsonb
    ),
    '{tiktok,enabled}', 'true'::jsonb
  ),
  '{youtube,enabled}', 'true'::jsonb
)
WHERE social_media IS NOT NULL;

-- ROLLBACK: Disable all social media platforms
-- UPDATE tenants.business 
-- SET social_media = jsonb_set(
--   jsonb_set(
--     jsonb_set(
--       jsonb_set(
--         COALESCE(social_media, '{}'::jsonb),
--         '{facebook,enabled}', 'false'::jsonb
--       ),
--       '{instagram,enabled}', 'false'::jsonb
--     ),
--     '{tiktok,enabled}', 'false'::jsonb
--   ),
--   '{youtube,enabled}', 'false'::jsonb
-- )
-- WHERE social_media IS NOT NULL;
