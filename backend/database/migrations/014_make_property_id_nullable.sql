-- Make property_id nullable in google_analytics_tokens table
-- Migration: 014_make_property_id_nullable.sql

-- Alter the column to allow NULL values
ALTER TABLE analytics.google_analytics_tokens 
ALTER COLUMN property_id DROP NOT NULL;

-- Add comment explaining the change
COMMENT ON COLUMN analytics.google_analytics_tokens.property_id IS 'Google Analytics property ID (e.g., accounts/123456789). Can be NULL if properties cannot be fetched during OAuth.';
