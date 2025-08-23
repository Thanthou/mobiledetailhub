-- Migration: Update affiliates table slug constraint
-- Run this script to make the slug field nullable for existing databases

-- Drop the existing unique constraint on slug
ALTER TABLE affiliates DROP CONSTRAINT IF EXISTS affiliates_slug_key;

-- Add the unique constraint back without NOT NULL
ALTER TABLE affiliates ADD CONSTRAINT affiliates_slug_key UNIQUE (slug);

-- Update any existing records with empty slugs to have NULL instead
UPDATE affiliates SET slug = NULL WHERE slug = '';

COMMENT ON COLUMN affiliates.slug IS 'URL-friendly identifier for the affiliate (set later by admin or affiliate)';
