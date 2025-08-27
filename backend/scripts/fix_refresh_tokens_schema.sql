-- Fix refresh_tokens table schema mismatch
-- Adds missing columns and renames 'ip' to 'ip_address' to match service code

BEGIN;

-- Check if the table exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'refresh_tokens') THEN
        RAISE EXCEPTION 'refresh_tokens table does not exist. Run the migration first.';
    END IF;
END $$;

-- Add is_revoked column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'refresh_tokens' AND column_name = 'is_revoked'
    ) THEN
        ALTER TABLE refresh_tokens ADD COLUMN is_revoked BOOLEAN DEFAULT FALSE;
        RAISE NOTICE 'Added is_revoked column to refresh_tokens table';
    ELSE
        RAISE NOTICE 'is_revoked column already exists in refresh_tokens table';
    END IF;
END $$;

-- Rename ip column to ip_address if needed
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'refresh_tokens' AND column_name = 'ip'
    ) AND NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'refresh_tokens' AND column_name = 'ip_address'
    ) THEN
        ALTER TABLE refresh_tokens RENAME COLUMN ip TO ip_address;
        RAISE NOTICE 'Renamed ip column to ip_address in refresh_tokens table';
    ELSE
        RAISE NOTICE 'ip_address column already exists or ip column does not exist';
    END IF;
END $$;

-- Update the index to use the correct column name for is_revoked
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_indexes 
        WHERE tablename = 'refresh_tokens' AND indexname = 'idx_refresh_tokens_active_revoked'
    ) THEN
        DROP INDEX IF EXISTS idx_refresh_tokens_active;
        CREATE INDEX idx_refresh_tokens_active ON refresh_tokens (user_id) WHERE is_revoked = FALSE;
        RAISE NOTICE 'Updated refresh_tokens active index to use is_revoked column';
    ELSE
        RAISE NOTICE 'Index idx_refresh_tokens_active_revoked already exists';
    END IF;
END $$;

COMMIT;

-- Verify the final structure
\echo 'Final refresh_tokens table structure:'
\d refresh_tokens
