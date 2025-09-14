-- Customers table for customer profiles and preferences
DROP TABLE IF EXISTS customers.customers CASCADE;

CREATE TABLE customers.customers (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES auth.users(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    address VARCHAR(500),
    city VARCHAR(100),
    state VARCHAR(50),
    zip_code VARCHAR(20),
    country VARCHAR(50) DEFAULT 'US',
    
    -- Customer status and lifecycle
    status VARCHAR(20) DEFAULT 'anonymous', -- anonymous, registered, verified, inactive
    registration_source VARCHAR(50), -- website, phone, walk_in, referral, etc.
    converted_at TIMESTAMPTZ, -- when they converted from anonymous to registered
    
    -- Contact preferences
    contact_preferences JSONB DEFAULT '{
        "email": true,
        "sms": true,
        "phone": true,
        "marketing_emails": false,
        "promotional_offers": false
    }'::jsonb,
    
    -- Service preferences
    service_preferences JSONB DEFAULT '{
        "preferred_services": [],
        "preferred_affiliates": [],
        "vehicle_preferences": {},
        "service_notes": ""
    }'::jsonb,
    
    -- Customer metadata
    notes TEXT,
    tags TEXT[], -- for categorization: "vip", "frequent", "new", etc.
    lifetime_value_cents INTEGER DEFAULT 0,
    total_bookings INTEGER DEFAULT 0,
    last_booking_at TIMESTAMPTZ,
    last_activity_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_customers_user_id ON customers.customers(user_id);
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers.customers(email);
CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers.customers(phone);
CREATE INDEX IF NOT EXISTS idx_customers_status ON customers.customers(status);
CREATE INDEX IF NOT EXISTS idx_customers_last_activity ON customers.customers(last_activity_at);
CREATE INDEX IF NOT EXISTS idx_customers_created_at ON customers.customers(created_at);
CREATE INDEX IF NOT EXISTS idx_customers_lifetime_value ON customers.customers(lifetime_value_cents);

-- Create trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION customers.update_customers_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_customers_updated_at
    BEFORE UPDATE ON customers.customers
    FOR EACH ROW
    EXECUTE FUNCTION customers.update_customers_updated_at();

-- Create trigger to update last_activity_at on any change
CREATE OR REPLACE FUNCTION customers.update_customers_last_activity()
RETURNS TRIGGER AS $$
BEGIN
    NEW.last_activity_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_customers_last_activity
    BEFORE UPDATE ON customers.customers
    FOR EACH ROW
    EXECUTE FUNCTION customers.update_customers_last_activity();

-- Add comments for documentation
COMMENT ON TABLE customers.customers IS 'Customer profiles and preferences';
COMMENT ON COLUMN customers.customers.status IS 'Customer lifecycle status: anonymous, registered, verified, inactive';
COMMENT ON COLUMN customers.customers.registration_source IS 'How the customer was acquired';
COMMENT ON COLUMN customers.customers.converted_at IS 'When customer converted from anonymous to registered';
COMMENT ON COLUMN customers.customers.contact_preferences IS 'Customer communication preferences';
COMMENT ON COLUMN customers.customers.service_preferences IS 'Customer service and vehicle preferences';
COMMENT ON COLUMN customers.customers.lifetime_value_cents IS 'Total revenue from this customer in cents';
COMMENT ON COLUMN customers.customers.tags IS 'Customer categorization tags';
