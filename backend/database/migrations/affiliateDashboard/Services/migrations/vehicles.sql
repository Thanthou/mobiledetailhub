-- Migration: Create vehicles table
-- Date: 2025-08-29
-- Description: Master table for vehicle types

CREATE TABLE IF NOT EXISTS vehicles (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  type VARCHAR(50) NOT NULL,
  size_category VARCHAR(50),
  base_multiplier DECIMAL(5,2) DEFAULT 1.00,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes
CREATE INDEX idx_vehicles_type ON vehicles(type);
CREATE INDEX idx_vehicles_size_category ON vehicles(size_category);