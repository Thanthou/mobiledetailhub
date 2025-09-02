-- Migration: Add slug column to service_tiers table
-- Version: v5.2
-- Description: Add slug column to service_tiers for direct lookup by affiliate slug

BEGIN;

-- ─────────────────────────────────────────────────────────────────────────────
-- Add slug column to service_tiers table
-- ─────────────────────────────────────────────────────────────────────────────

-- Add slug column
ALTER TABLE service_tiers ADD COLUMN slug VARCHAR(100);

-- Create index on slug for fast lookups
CREATE INDEX idx_service_tiers_slug ON service_tiers(slug);

-- ─────────────────────────────────────────────────────────────────────────────
-- Populate slug column with affiliate slugs
-- ─────────────────────────────────────────────────────────────────────────────

-- Update service_tiers with affiliate slugs
UPDATE service_tiers 
SET slug = a.slug
FROM services s
JOIN affiliates a ON s.affiliate_id = a.id
WHERE service_tiers.service_id = s.id;

-- ─────────────────────────────────────────────────────────────────────────────
-- Add NOT NULL constraint after populating data
-- ─────────────────────────────────────────────────────────────────────────────

-- Make slug column NOT NULL after populating
ALTER TABLE service_tiers ALTER COLUMN slug SET NOT NULL;

-- Add unique constraint to ensure one slug per service_tier
ALTER TABLE service_tiers ADD CONSTRAINT uq_service_tiers_slug UNIQUE (slug);

-- ─────────────────────────────────────────────────────────────────────────────
-- Update migration tracking
-- ─────────────────────────────────────────────────────────────────────────────

INSERT INTO system.schema_migrations(version, description) VALUES
('v5.2', 'Added slug column to service_tiers table for direct affiliate lookup');

COMMIT;

-- ─────────────────────────────────────────────────────────────────────────────
-- Verification queries
-- ─────────────────────────────────────────────────────────────────────────────

-- Verify slug column was added and populated
SELECT 
    st.id,
    st.slug,
    st.name,
    s.name as service_name,
    a.slug as affiliate_slug
FROM service_tiers st
JOIN services s ON st.service_id = s.id
JOIN affiliates a ON s.affiliate_id = a.id
ORDER BY st.slug, st.name;

-- Show all unique slugs in service_tiers
SELECT DISTINCT slug, COUNT(*) as tier_count
FROM service_tiers
GROUP BY slug
ORDER BY slug;
