-- Backfill affiliate_service_areas for existing approved affiliates
-- This script should be run after creating the trigger function

-- First, let's see what approved affiliates we have
SELECT 
  id, 
  business_name, 
  application_status, 
  base_location,
  created_at
FROM affiliates 
WHERE application_status = 'approved'
ORDER BY created_at;

-- Now backfill service areas for approved affiliates
INSERT INTO affiliate_service_areas (affiliate_id, state, city, zip, created_at)
SELECT 
  id as affiliate_id,
  base_location->>'state' as state,
  base_location->>'city' as city,
  NULL as zip,  -- NULL means entire city coverage
  NOW() as created_at
FROM affiliates 
WHERE application_status = 'approved'
  AND base_location->>'city' IS NOT NULL 
  AND base_location->>'city' != ''
  AND base_location->>'state' IS NOT NULL 
  AND base_location->>'state' != ''
ON CONFLICT (affiliate_id, state, city, zip) DO NOTHING;

-- Also add specific ZIP codes if they exist
INSERT INTO affiliate_service_areas (affiliate_id, state, city, zip, created_at)
SELECT 
  id as affiliate_id,
  base_location->>'state' as state,
  base_location->>'city' as city,
  base_location->>'zip' as zip,
  NOW() as created_at
FROM affiliates 
WHERE application_status = 'approved'
  AND base_location->>'city' IS NOT NULL 
  AND base_location->>'city' != ''
  AND base_location->>'state' IS NOT NULL 
  AND base_location->>'state' != ''
  AND base_location->>'zip' IS NOT NULL 
  AND base_location->>'zip' != ''
ON CONFLICT (affiliate_id, state, city, zip) DO NOTHING;

-- Verify the backfill worked
SELECT 
  'Service Areas After Backfill' as status,
  COUNT(*) as total_service_areas
FROM affiliate_service_areas;

-- Show what was added
SELECT 
  asa.affiliate_id,
  a.business_name,
  asa.state,
  asa.city,
  asa.zip,
  asa.created_at
FROM affiliate_service_areas asa
JOIN affiliates a ON a.id = asa.affiliate_id
ORDER BY asa.created_at DESC;
