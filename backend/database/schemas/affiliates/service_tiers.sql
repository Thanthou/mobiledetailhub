-- Service tiers table for affiliate service pricing tiers
DROP TABLE IF EXISTS affiliates.service_tiers CASCADE;

CREATE TABLE affiliates.service_tiers (
    id SERIAL PRIMARY KEY,
    service_id INTEGER NOT NULL,
    tier_name VARCHAR(255) NOT NULL,
    price_cents INTEGER NOT NULL DEFAULT 0,
    included_services JSONB NOT NULL DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    duration_minutes INTEGER DEFAULT 60,
    metadata JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    sort_order INTEGER DEFAULT 0
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_service_tiers_service_id ON affiliates.service_tiers(service_id);
CREATE INDEX IF NOT EXISTS idx_service_tiers_is_active ON affiliates.service_tiers(is_active);
CREATE INDEX IF NOT EXISTS idx_service_tiers_is_featured ON affiliates.service_tiers(is_featured);
CREATE INDEX IF NOT EXISTS idx_service_tiers_sort_order ON affiliates.service_tiers(sort_order);

-- Create trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION affiliates.update_service_tiers_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_service_tiers_updated_at
    BEFORE UPDATE ON affiliates.service_tiers
    FOR EACH ROW
    EXECUTE FUNCTION affiliates.update_service_tiers_updated_at();

-- Add foreign key constraint to services table
ALTER TABLE affiliates.service_tiers 
ADD CONSTRAINT fk_service_tiers_service_id 
FOREIGN KEY (service_id) REFERENCES affiliates.services(id) ON DELETE CASCADE;
