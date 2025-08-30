-- Migration: Create vehicle service pricing table
-- Date: 2025-08-29
-- Description: Junction table for affiliate service offerings

CREATE TABLE IF NOT EXISTS vehicle_service_pricing (
  id SERIAL PRIMARY KEY,
  affiliate_id INTEGER REFERENCES affiliates(id),
  vehicle_id INTEGER REFERENCES vehicles(id),
  service_category_id INTEGER REFERENCES service_categories(id),
  base_price_cents INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(affiliate_id, vehicle_id, service_category_id)
);

-- Add indexes for performance
CREATE INDEX idx_vehicle_service_pricing_affiliate ON vehicle_service_pricing(affiliate_id);
CREATE INDEX idx_vehicle_service_pricing_vehicle ON vehicle_service_pricing(vehicle_id);
CREATE INDEX idx_vehicle_service_pricing_category ON vehicle_service_pricing(service_category_id);