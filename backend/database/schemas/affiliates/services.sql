-- Services table for affiliate service offerings
DROP TABLE IF EXISTS affiliates.services CASCADE;

CREATE TABLE affiliates.services (
    id SERIAL PRIMARY KEY,
    business_id INTEGER NOT NULL,
    service_name VARCHAR(255) NOT NULL,
    service_description TEXT,
    service_category VARCHAR(100),
    service_type VARCHAR(100),
    vehicle_types JSONB DEFAULT '["auto", "boat", "rv", "truck", "motorcycle", "off-road", "other"]',
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    metadata JSONB DEFAULT '{}'
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_services_business_id ON affiliates.services(business_id);
CREATE INDEX IF NOT EXISTS idx_services_service_category ON affiliates.services(service_category);
CREATE INDEX IF NOT EXISTS idx_services_service_type ON affiliates.services(service_type);
CREATE INDEX IF NOT EXISTS idx_services_vehicle_types ON affiliates.services USING GIN(vehicle_types);
CREATE INDEX IF NOT EXISTS idx_services_is_active ON affiliates.services(is_active);
CREATE INDEX IF NOT EXISTS idx_services_is_featured ON affiliates.services(is_featured);
CREATE INDEX IF NOT EXISTS idx_services_sort_order ON affiliates.services(sort_order);

-- Create trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION affiliates.update_services_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_services_updated_at
    BEFORE UPDATE ON affiliates.services
    FOR EACH ROW
    EXECUTE FUNCTION affiliates.update_services_updated_at();

-- Add foreign key constraint to business table
ALTER TABLE affiliates.services 
ADD CONSTRAINT fk_services_business_id 
FOREIGN KEY (business_id) REFERENCES affiliates.business(id) ON DELETE CASCADE;
