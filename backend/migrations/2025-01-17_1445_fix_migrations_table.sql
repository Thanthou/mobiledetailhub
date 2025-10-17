-- Fix migrations table structure for new migration system
-- This migration properly updates the existing table to work with the new system

-- Drop the old table and recreate with new structure
DROP TABLE IF EXISTS system.schema_migrations CASCADE;

-- Create new table with proper structure
CREATE TABLE system.schema_migrations (
  id SERIAL PRIMARY KEY,
  filename TEXT UNIQUE NOT NULL,
  applied_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  checksum TEXT,
  rollback_sql TEXT
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_schema_migrations_filename ON system.schema_migrations(filename);
CREATE INDEX IF NOT EXISTS idx_schema_migrations_applied_at ON system.schema_migrations(applied_at);

-- ROLLBACK:
-- DROP TABLE IF EXISTS system.schema_migrations CASCADE;
-- CREATE TABLE system.schema_migrations (
--   version VARCHAR(50) PRIMARY KEY,
--   applied_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
--   description TEXT NOT NULL
-- );
