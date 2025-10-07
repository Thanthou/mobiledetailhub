-- Add google_maps_url column to tenants.business table
-- This will store the direct Google Maps URL for scraping

ALTER TABLE tenants.business 
ADD COLUMN IF NOT EXISTS google_maps_url TEXT;

-- Add comment to clarify the purpose
COMMENT ON COLUMN tenants.business.google_maps_url IS 'Direct Google Maps URL for business profile scraping (e.g., https://maps.google.com/maps/place/...)';
