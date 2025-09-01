-- Add minimum and multiplier columns to affiliates table
-- These columns are used for pricing calculations in the primary service area

ALTER TABLE affiliates 
ADD COLUMN IF NOT EXISTS minimum DECIMAL(10,2) DEFAULT 0.00,
ADD COLUMN IF NOT EXISTS multiplier DECIMAL(5,2) DEFAULT 1.00;

-- Add comments for documentation
COMMENT ON COLUMN affiliates.minimum IS 'Minimum pricing amount for services in primary area';
COMMENT ON COLUMN affiliates.multiplier IS 'Pricing multiplier for services in primary area';
