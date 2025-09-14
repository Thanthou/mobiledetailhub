-- Customer vehicles table for storing customer vehicle information
DROP TABLE IF EXISTS customers.customer_vehicles CASCADE;

CREATE TABLE customers.customer_vehicles (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER NOT NULL REFERENCES customers.customers(id) ON DELETE CASCADE,
    
    -- Vehicle identification
    make VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    year INTEGER,
    color VARCHAR(50),
    license_plate VARCHAR(20),
    vin VARCHAR(17), -- Vehicle Identification Number
    
    -- Vehicle details
    vehicle_type VARCHAR(20) NOT NULL, -- auto, boat, rv, motorcycle
    size_bucket VARCHAR(10), -- xs, s, m, l, xl
    mileage INTEGER,
    
    -- Service history and preferences
    service_notes TEXT,
    preferred_services TEXT[], -- array of service names
    last_service_date DATE,
    next_service_due DATE,
    
    -- Vehicle status
    is_primary BOOLEAN DEFAULT false, -- customer's primary vehicle
    is_active BOOLEAN DEFAULT true,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_customer_vehicles_customer_id ON customers.customer_vehicles(customer_id);
CREATE INDEX IF NOT EXISTS idx_customer_vehicles_vehicle_type ON customers.customer_vehicles(vehicle_type);
CREATE INDEX IF NOT EXISTS idx_customer_vehicles_is_primary ON customers.customer_vehicles(is_primary);
CREATE INDEX IF NOT EXISTS idx_customer_vehicles_is_active ON customers.customer_vehicles(is_active);
CREATE INDEX IF NOT EXISTS idx_customer_vehicles_license_plate ON customers.customer_vehicles(license_plate);

-- Create trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION customers.update_customer_vehicles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_customer_vehicles_updated_at
    BEFORE UPDATE ON customers.customer_vehicles
    FOR EACH ROW
    EXECUTE FUNCTION customers.update_customer_vehicles_updated_at();

-- Ensure only one primary vehicle per customer
CREATE OR REPLACE FUNCTION customers.ensure_single_primary_vehicle()
RETURNS TRIGGER AS $$
BEGIN
    -- If setting this vehicle as primary, unset all others for this customer
    IF NEW.is_primary = true THEN
        UPDATE customers.customer_vehicles 
        SET is_primary = false 
        WHERE customer_id = NEW.customer_id 
        AND id != NEW.id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_ensure_single_primary_vehicle
    BEFORE INSERT OR UPDATE ON customers.customer_vehicles
    FOR EACH ROW
    EXECUTE FUNCTION customers.ensure_single_primary_vehicle();

-- Add comments for documentation
COMMENT ON TABLE customers.customer_vehicles IS 'Customer vehicle information and service history';
COMMENT ON COLUMN customers.customer_vehicles.is_primary IS 'Whether this is the customer''s primary vehicle';
COMMENT ON COLUMN customers.customer_vehicles.size_bucket IS 'Vehicle size category for pricing';
COMMENT ON COLUMN customers.customer_vehicles.preferred_services IS 'Services typically requested for this vehicle';
