-- Migration: Drop redundant location columns from affiliates table
-- Version: v5.1
-- Description: Remove city, state, zip columns since location data is now in service_areas JSONB

BEGIN;

-- ─────────────────────────────────────────────────────────────────────────────
-- Drop redundant location columns from affiliates table
-- ─────────────────────────────────────────────────────────────────────────────

-- Check if columns exist before dropping them
DO $$
BEGIN
    -- Drop city column if it exists
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_schema = 'affiliates' 
               AND table_name = 'affiliates' 
               AND column_name = 'city') THEN
        ALTER TABLE affiliates.affiliates DROP COLUMN city;
        RAISE NOTICE 'Dropped city column';
    ELSE
        RAISE NOTICE 'city column does not exist';
    END IF;

    -- Drop state column if it exists
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_schema = 'affiliates' 
               AND table_name = 'affiliates' 
               AND column_name = 'state') THEN
        ALTER TABLE affiliates.affiliates DROP COLUMN state;
        RAISE NOTICE 'Dropped state column';
    ELSE
        RAISE NOTICE 'state column does not exist';
    END IF;

    -- Drop zip column if it exists
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_schema = 'affiliates' 
               AND table_name = 'affiliates' 
               AND column_name = 'zip') THEN
        ALTER TABLE affiliates.affiliates DROP COLUMN zip;
        RAISE NOTICE 'Dropped zip column';
    ELSE
        RAISE NOTICE 'zip column does not exist';
    END IF;
END $$;

-- ─────────────────────────────────────────────────────────────────────────────
-- Update migration tracking
-- ─────────────────────────────────────────────────────────────────────────────

INSERT INTO system.schema_migrations(version, description) VALUES
('v5.1', 'Dropped redundant location columns (city, state, zip) from affiliates table');

COMMIT;

-- ─────────────────────────────────────────────────────────────────────────────
-- Verification queries
-- ─────────────────────────────────────────────────────────────────────────────

-- Verify columns were dropped
SELECT 
    column_name,
    data_type
FROM information_schema.columns 
WHERE table_schema = 'affiliates' 
  AND table_name = 'affiliates'
  AND column_name IN ('city', 'state', 'zip')
ORDER BY column_name;

-- Show remaining columns in affiliates table
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_schema = 'affiliates' 
  AND table_name = 'affiliates'
ORDER BY ordinal_position;
