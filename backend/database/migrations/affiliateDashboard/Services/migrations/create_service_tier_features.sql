-- Migration: Create service_tier_features table for individual features
-- This allows each feature to be stored as a separate record instead of comma-separated text

BEGIN;

-- Create the service_tier_features table
CREATE TABLE IF NOT EXISTS service_tier_features (
  id               INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  service_tier_id  INT NOT NULL REFERENCES service_tiers(id) ON DELETE CASCADE,
  feature_text     TEXT NOT NULL,
  display_order    INT NOT NULL DEFAULT 0,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_service_tier_features_tier_id ON service_tier_features(service_tier_id);
CREATE INDEX IF NOT EXISTS idx_service_tier_features_order ON service_tier_features(service_tier_id, display_order);

-- Add trigger for updated_at
CREATE TRIGGER trigger_service_tier_features_updated_at
  BEFORE UPDATE ON service_tier_features
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

COMMIT;
