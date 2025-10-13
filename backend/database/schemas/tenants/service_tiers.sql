-- Service Tiers Table - Pricing tiers for each service

DROP TABLE IF EXISTS tenants.service_tiers CASCADE;

CREATE TABLE tenants.service_tiers (
    -- Primary Key
    id SERIAL PRIMARY KEY,
    
    -- Service Reference
    service_id INTEGER NOT NULL REFERENCES tenants.services(id) ON DELETE CASCADE,
    
    -- Tier Information
    tier_name VARCHAR(255) NOT NULL,
    price_cents INTEGER NOT NULL DEFAULT 0,
    duration_minutes INTEGER DEFAULT 60,
    
    -- Tier Details
    included_services JSONB NOT NULL DEFAULT '[]',
    metadata JSONB DEFAULT '{}',
    
    -- Tier Status
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    sort_order INTEGER DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_service_tiers_service_id ON tenants.service_tiers(service_id);
CREATE INDEX IF NOT EXISTS idx_service_tiers_active ON tenants.service_tiers(is_active);
CREATE INDEX IF NOT EXISTS idx_service_tiers_sort ON tenants.service_tiers(service_id, sort_order);

-- Create trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION tenants.update_service_tiers_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_service_tiers_updated_at
    BEFORE UPDATE ON tenants.service_tiers
    FOR EACH ROW
    EXECUTE FUNCTION tenants.update_service_tiers_updated_at();

-- Add comments for documentation
COMMENT ON TABLE tenants.service_tiers IS 'Pricing tiers for tenant services (e.g., Basic, Premium, Deluxe)';
COMMENT ON COLUMN tenants.service_tiers.price_cents IS 'Price in cents (e.g., 9900 for $99.00)';
COMMENT ON COLUMN tenants.service_tiers.included_services IS 'JSON array of included services/features';
COMMENT ON COLUMN tenants.service_tiers.sort_order IS 'Display order (lower numbers appear first)';

