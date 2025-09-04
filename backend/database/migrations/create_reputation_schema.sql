-- Migration: Create reputation schema for reviews system
-- Version: v6.0
-- Description: Add comprehensive reviews system with affiliate and MDH site reviews

BEGIN;

-- Create reputation schema
CREATE SCHEMA IF NOT EXISTS reputation;
COMMENT ON SCHEMA reputation IS 'Reviews, ratings, and reputation management for affiliates and MDH site';

-- Apply the reputation schema files
\i schemas/reputation/reviews.sql
\i schemas/reputation/review_replies.sql
\i schemas/reputation/review_votes.sql

-- Update migration tracking
INSERT INTO system.schema_migrations(version, description) VALUES
('v6.0', 'Created reputation schema with reviews, replies, and voting system');

COMMIT;
