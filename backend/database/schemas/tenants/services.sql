-- Tenant Services Table - Services offered by each tenant/business

DROP TABLE IF EXISTS tenants.services CASCADE;

CREATE TABLE tenants.services (
    -- Primary Key
    id SERIAL PRIMARY KEY,
    
    -- Business Reference
    business_id INTEGER NOT NULL REFERENCES tenants.business(id) ON DELETE CASCADE,
    
    -- Service Information
    service_name VARCHAR(255) NOT NULL,
    service_description TEXT,
    service_category VARCHAR(100),
    service_type VARCHAR(100),
    
    -- Vehicle Types Supported
    vehicle_types JSONB DEFAULT '["auto", "boat", "rv", "truck", "motorcycle", "off-road", "other"]',
    
    -- Service Status
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    sort_order INTEGER DEFAULT 0,
    
    -- Metadata
    metadata JSONB DEFAULT '{}',
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_services_business_id ON tenants.services(business_id);
CREATE INDEX IF NOT EXISTS idx_services_active ON tenants.services(is_active);
CREATE INDEX IF NOT EXISTS idx_services_featured ON tenants.services(is_featured);
CREATE INDEX IF NOT EXISTS idx_services_category ON tenants.services(service_category);
CREATE INDEX IF NOT EXISTS idx_services_sort ON tenants.services(business_id, sort_order);

-- Create trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION tenants.update_services_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_services_updated_at
    BEFORE UPDATE ON tenants.services
    FOR EACH ROW
    EXECUTE FUNCTION tenants.update_services_updated_at();

-- Add comments for documentation
COMMENT ON TABLE tenants.services IS 'Services offered by tenant businesses';
COMMENT ON COLUMN tenants.services.vehicle_types IS 'JSON array of supported vehicle types';
COMMENT ON COLUMN tenants.services.is_featured IS 'Whether service should be prominently displayed';
COMMENT ON COLUMN tenants.services.sort_order IS 'Display order (lower numbers appear first)';

