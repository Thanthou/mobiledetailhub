-- Example Migration: Add example column to business table
-- This demonstrates the migration file format and rollback structure

-- Add example column to tenants.business table (only if it doesn't exist)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'tenants' 
        AND table_name = 'business' 
        AND column_name = 'example_field'
    ) THEN
        ALTER TABLE tenants.business ADD COLUMN example_field TEXT;
    END IF;
END $$;

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_business_example_field ON tenants.business(example_field) WHERE example_field IS NOT NULL;

-- ROLLBACK:
-- DROP INDEX IF EXISTS idx_business_example_field;
-- ALTER TABLE tenants.business DROP COLUMN IF EXISTS example_field;
