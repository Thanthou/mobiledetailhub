-- Migration to update service categories from generic 'auto' to proper category names
-- This updates existing services to use the new category naming convention

-- Update services based on their original_category metadata
UPDATE affiliates.services 
SET service_category = 'interior'
WHERE service_category = 'auto' 
  AND metadata->>'original_category' = 'interior';

UPDATE affiliates.services 
SET service_category = 'exterior'
WHERE service_category = 'auto' 
  AND metadata->>'original_category' = 'exterior';

UPDATE affiliates.services 
SET service_category = 'service-packages'
WHERE service_category = 'auto' 
  AND metadata->>'original_category' = 'service-packages';

UPDATE affiliates.services 
SET service_category = 'addons'
WHERE service_category = 'auto' 
  AND metadata->>'original_category' = 'addons';

UPDATE affiliates.services 
SET service_category = 'paint-correction'
WHERE service_category = 'auto' 
  AND metadata->>'original_category' = 'paint-correction';

UPDATE affiliates.services 
SET service_category = 'paint-protection-film'
WHERE service_category = 'auto' 
  AND metadata->>'original_category' = 'paint-protection-film';

-- Update ceramic services (these were already using 'ceramic' but should be 'ceramic-coating')
UPDATE affiliates.services 
SET service_category = 'ceramic-coating'
WHERE service_category = 'ceramic';

-- For any remaining 'auto' services without original_category metadata, default to 'service-packages'
UPDATE affiliates.services 
SET service_category = 'service-packages'
WHERE service_category = 'auto' 
  AND (metadata->>'original_category' IS NULL OR metadata->>'original_category' = '');

-- Show the results
SELECT 
  service_category,
  COUNT(*) as count
FROM affiliates.services 
GROUP BY service_category 
ORDER BY service_category;
