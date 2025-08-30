-- Migration: Create service tiers table
-- Date: 2025-08-29
-- Description: Pricing tiers for each service offering

CREATE TABLE IF NOT EXISTS tiers (
  id SERIAL PRIMARY KEY,
  vehicle_service_pricing_id INTEGER REFERENCES vehicle_service_pricing(id),
  tier_name VARCHAR(50) NOT NULL,           -- "Basic", "Standard", "Premium"
  price_cents INTEGER NOT NULL,             -- Full price for this tier (not delta)
  duration_min INTEGER NOT NULL,            -- Timeframe in minutes
  description_features JSONB,               -- List of features/descriptions as JSON array
  enabled BOOLEAN DEFAULT true,             -- Enable/disable this tier
  popular BOOLEAN DEFAULT false,            -- Mark as popular/recommended tier
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes
CREATE INDEX idx_tiers_service_pricing ON tiers(vehicle_service_pricing_id);
CREATE INDEX idx_tiers_enabled ON tiers(enabled);
CREATE INDEX idx_tiers_popular ON tiers(popular);