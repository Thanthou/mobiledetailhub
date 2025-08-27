-- Migration: Normalize affiliate_service_areas table
-- Replace free-text city/state with city_id FK and add unique constraints
-- This prevents data drift and ensures referential integrity

BEGIN;

-- Step 1: Add city_id column to affiliate_service_areas
ALTER TABLE affiliate_service_areas 
ADD COLUMN city_id BIGINT;

-- Step 2: Populate cities table with existing unique city/state combinations
-- This ensures we have all the cities referenced in service areas
INSERT INTO cities (name, city_slug, state_code)
SELECT DISTINCT 
  asa.city,
  slugify(asa.city) as city_slug,
  asa.state_code
FROM affiliate_service_areas asa
WHERE NOT EXISTS (
  SELECT 1 FROM cities c 
  WHERE c.name = asa.city AND c.state_code = asa.state_code
);

-- Step 3: Update affiliate_service_areas to set city_id based on city name and state
UPDATE affiliate_service_areas 
SET city_id = c.id
FROM cities c
WHERE affiliate_service_areas.city = c.name 
  AND affiliate_service_areas.state_code = c.state_code;

-- Step 4: Verify all city_ids are populated
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM affiliate_service_areas 
    WHERE city_id IS NULL
  ) THEN
    RAISE EXCEPTION 'Some city_ids are still NULL after update. Check data consistency.';
  END IF;
END $$;

-- Step 5: Make city_id NOT NULL and add foreign key constraint
ALTER TABLE affiliate_service_areas 
ALTER COLUMN city_id SET NOT NULL;

ALTER TABLE affiliate_service_areas 
ADD CONSTRAINT fk_affiliate_service_areas_city_id 
FOREIGN KEY (city_id) REFERENCES cities(id) ON DELETE CASCADE;

-- Step 6: Drop the old city and state_code columns
ALTER TABLE affiliate_service_areas 
DROP COLUMN city,
DROP COLUMN state_code;

-- Step 7: Add unique constraint on (affiliate_id, city_id)
-- This prevents duplicate service areas for the same affiliate/city combination
ALTER TABLE affiliate_service_areas 
ADD CONSTRAINT uq_affiliate_service_areas_affiliate_city 
UNIQUE (affiliate_id, city_id);

-- Step 8: Update indexes for the new structure
DROP INDEX IF EXISTS idx_aff_sa_state_city;
CREATE INDEX idx_aff_sa_city_id ON affiliate_service_areas (city_id);
CREATE INDEX idx_aff_sa_affiliate_city ON affiliate_service_areas (affiliate_id, city_id);

-- Step 9: Add helpful view for backward compatibility during transition
CREATE OR REPLACE VIEW affiliate_service_areas_view AS
SELECT 
  asa.id,
  asa.affiliate_id,
  c.name as city,
  c.state_code,
  asa.zip,
  asa.created_at
FROM affiliate_service_areas asa
JOIN cities c ON asa.city_id = c.id;

-- Step 10: Add helpful function to add service areas with city name lookup
CREATE OR REPLACE FUNCTION add_affiliate_service_area(
  p_affiliate_id INT,
  p_city_name TEXT,
  p_state_code CHAR(2),
  p_zip VARCHAR(20) DEFAULT NULL
)
RETURNS INT
LANGUAGE plpgsql
AS $$
DECLARE
  v_city_id BIGINT;
  v_service_area_id INT;
BEGIN
  -- Find or create city
  SELECT id INTO v_city_id
  FROM cities 
  WHERE name = p_city_name AND state_code = p_state_code;
  
  IF v_city_id IS NULL THEN
    -- Create new city if it doesn't exist
    INSERT INTO cities (name, city_slug, state_code)
    VALUES (p_city_name, slugify(p_city_name), p_state_code)
    RETURNING id INTO v_city_id;
  END IF;
  
  -- Add service area
  INSERT INTO affiliate_service_areas (affiliate_id, city_id, zip)
  VALUES (p_affiliate_id, v_city_id, p_zip)
  ON CONFLICT (affiliate_id, city_id) DO NOTHING
  RETURNING id INTO v_service_area_id;
  
  RETURN v_service_area_id;
END;
$$;

-- Step 11: Add function to remove service areas by city name
CREATE OR REPLACE FUNCTION remove_affiliate_service_area(
  p_affiliate_id INT,
  p_city_name TEXT,
  p_state_code CHAR(2)
)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
DECLARE
  v_city_id BIGINT;
  v_deleted_count INT;
BEGIN
  -- Find city
  SELECT id INTO v_city_id
  FROM cities 
  WHERE name = p_city_name AND state_code = p_state_code;
  
  IF v_city_id IS NULL THEN
    RETURN FALSE;
  END IF;
  
  -- Remove service area
  DELETE FROM affiliate_service_areas 
  WHERE affiliate_id = p_affiliate_id AND city_id = v_city_id;
  
  GET DIAGNOSTICS v_deleted_count = ROW_COUNT;
  RETURN v_deleted_count > 0;
END;
$$;

-- Step 12: Add function to get service areas with city details
CREATE OR REPLACE FUNCTION get_affiliate_service_areas(p_affiliate_id INT)
RETURNS TABLE(
  city_name TEXT,
  state_code CHAR(2),
  zip VARCHAR(20),
  created_at TIMESTAMPTZ
)
LANGUAGE sql
AS $$
  SELECT 
    c.name as city_name,
    c.state_code,
    asa.zip,
    asa.created_at
  FROM affiliate_service_areas asa
  JOIN cities c ON asa.city_id = c.id
  WHERE asa.affiliate_id = p_affiliate_id
  ORDER BY c.name, c.state_code;
$$;

COMMIT;

-- Verification queries to run after migration:
-- SELECT 'Migration completed successfully' as status;
-- SELECT COUNT(*) as total_service_areas FROM affiliate_service_areas;
-- SELECT COUNT(*) as total_cities FROM cities;
-- SELECT * FROM affiliate_service_areas_view LIMIT 5;
