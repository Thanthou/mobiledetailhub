-- Migration script to add services_description column to mdh_config table
-- Run this script on existing databases to add the new configurable field

-- Add services_description column if it doesn't exist
DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'mdh_config' AND column_name = 'services_description'
  ) THEN
    ALTER TABLE mdh_config ADD COLUMN services_description TEXT DEFAULT 'auto detailing, boat & RV detailing, ceramic coating, and PPF';
  END IF;
END $$;

-- Update existing records to have a default value if they don't have one
UPDATE mdh_config 
SET services_description = 'auto detailing, boat & RV detailing, ceramic coating, and PPF' 
WHERE services_description IS NULL;

-- Verify the column was added
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'mdh_config' AND column_name = 'services_description';
