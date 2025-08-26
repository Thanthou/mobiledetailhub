-- Migration script to convert base_location JSONB to base_address_id foreign key
-- This script handles the transition from the old structure to the new normalized structure

BEGIN;

-- Step 1: Create addresses table if it doesn't exist
CREATE TABLE IF NOT EXISTS addresses (
  id           SERIAL PRIMARY KEY,
  line1        VARCHAR(255),
  city         VARCHAR(100) NOT NULL,
  state_code   CHAR(2) NOT NULL,
  postal_code  VARCHAR(20),
  lat          DOUBLE PRECISION,
  lng          DOUBLE PRECISION,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Step 2: Add base_address_id column to affiliates if it doesn't exist
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'affiliates' AND column_name = 'base_address_id') THEN
    ALTER TABLE affiliates ADD COLUMN base_address_id INTEGER REFERENCES addresses(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Step 3: Migrate existing base_location data to addresses table
-- Extract data from base_location JSONB and create address records
INSERT INTO addresses (city, state_code, postal_code, created_at, updated_at)
SELECT DISTINCT
  COALESCE(base_location->>'city', '') as city,
  COALESCE(base_location->>'state', '') as state_code,
  COALESCE(base_location->>'zip', '') as postal_code,
  NOW() as created_at,
  NOW() as updated_at
FROM affiliates 
WHERE base_location IS NOT NULL 
  AND base_location != '{"city": "", "state": "", "zip": ""}'::jsonb
  AND (base_location->>'city' IS NOT NULL OR base_location->>'state' IS NOT NULL OR base_location->>'zip' IS NOT NULL);

-- Step 4: Update affiliates table to link to the newly created addresses
UPDATE affiliates 
SET base_address_id = addr.id
FROM addresses addr
WHERE affiliates.base_location IS NOT NULL 
  AND affiliates.base_location != '{"city": "", "state": "", "zip": ""}'::jsonb
  AND COALESCE(affiliates.base_location->>'city', '') = addr.city
  AND COALESCE(affiliates.base_location->>'state', '') = addr.state_code
  AND COALESCE(affiliates.base_location->>'zip', '') = addr.postal_code
  AND affiliates.base_address_id IS NULL;

-- Step 5: Create a backup of the old base_location data before dropping
CREATE TABLE IF NOT EXISTS affiliates_backup_base_location AS
SELECT id, base_location, base_address_id
FROM affiliates
WHERE base_location IS NOT NULL;

-- Step 6: Drop the old base_location column (uncomment when ready to remove)
-- ALTER TABLE affiliates DROP COLUMN IF EXISTS base_location;

-- Step 7: Add foreign key constraint to states table if it doesn't exist
DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'addresses_state_code_fkey' 
    AND table_name = 'addresses'
  ) THEN
    ALTER TABLE addresses ADD CONSTRAINT addresses_state_code_fkey 
    FOREIGN KEY (state_code) REFERENCES states(state_code);
  END IF;
END $$;

COMMIT;
