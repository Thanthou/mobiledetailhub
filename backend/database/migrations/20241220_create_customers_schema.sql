-- Migration: Create customers schema and move customers table
-- Version: v6.0
-- Description: Create dedicated customers schema and migrate existing customers table

BEGIN;

-- ─────────────────────────────────────────────────────────────────────────────
-- Create customers schema
-- ─────────────────────────────────────────────────────────────────────────────

CREATE SCHEMA IF NOT EXISTS customers;
COMMENT ON SCHEMA customers IS 'Customer profiles, preferences, and communication history';

-- ─────────────────────────────────────────────────────────────────────────────
-- Create customers schema tables
-- ─────────────────────────────────────────────────────────────────────────────

-- Create customers table (if it doesn't exist in public schema)
CREATE TABLE IF NOT EXISTS customers.customers (
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

-- Create customer vehicles table
CREATE TABLE IF NOT EXISTS customers.customer_vehicles (
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

-- Create customer communications table
CREATE TABLE IF NOT EXISTS customers.customer_communications (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER NOT NULL REFERENCES customers.customers(id) ON DELETE CASCADE,
    
    -- Communication details
    communication_type VARCHAR(50) NOT NULL, -- email, sms, phone, in_app, mail
    direction VARCHAR(10) NOT NULL, -- inbound, outbound
    subject VARCHAR(255),
    content TEXT NOT NULL,
    
    -- Communication metadata
    status VARCHAR(20) DEFAULT 'sent', -- sent, delivered, read, failed, bounced
    priority VARCHAR(10) DEFAULT 'normal', -- low, normal, high, urgent
    category VARCHAR(50), -- booking_confirmation, quote_request, marketing, support, etc.
    
    -- Related entities
    related_booking_id INTEGER, -- if related to a booking
    related_quote_id INTEGER, -- if related to a quote
    related_affiliate_id INTEGER, -- if from/to specific affiliate
    
    -- Delivery tracking
    sent_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ,
    read_at TIMESTAMPTZ,
    failed_at TIMESTAMPTZ,
    failure_reason TEXT,
    
    -- Response tracking
    response_required BOOLEAN DEFAULT false,
    response_received_at TIMESTAMPTZ,
    response_content TEXT,
    
    -- External system tracking
    external_id VARCHAR(255), -- ID from email/SMS service
    external_status VARCHAR(50), -- status from external service
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ─────────────────────────────────────────────────────────────────────────────
-- Migrate existing customers data (if exists in public schema)
-- ─────────────────────────────────────────────────────────────────────────────

-- Check if customers table exists in public schema and migrate data
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'customers') THEN
        -- Migrate existing customers data
        INSERT INTO customers.customers (
            id, user_id, name, email, phone, address, preferences, 
            created_at, updated_at
        )
        SELECT 
            id, 
            user_id, 
            name, 
            email, 
            phone, 
            address, 
            COALESCE(preferences, '{}'::jsonb) as preferences,
            created_at, 
            updated_at
        FROM public.customers
        ON CONFLICT (id) DO NOTHING;
        
        -- Update sequence to avoid conflicts
        SELECT setval('customers.customers_id_seq', (SELECT MAX(id) FROM customers.customers));
        
        -- Drop old table
        DROP TABLE public.customers CASCADE;
    END IF;
END $$;

-- ─────────────────────────────────────────────────────────────────────────────
-- Create indexes for better performance
-- ─────────────────────────────────────────────────────────────────────────────

-- Customers table indexes
CREATE INDEX IF NOT EXISTS idx_customers_user_id ON customers.customers(user_id);
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers.customers(email);
CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers.customers(phone);
CREATE INDEX IF NOT EXISTS idx_customers_status ON customers.customers(status);
CREATE INDEX IF NOT EXISTS idx_customers_last_activity ON customers.customers(last_activity_at);
CREATE INDEX IF NOT EXISTS idx_customers_created_at ON customers.customers(created_at);
CREATE INDEX IF NOT EXISTS idx_customers_lifetime_value ON customers.customers(lifetime_value_cents);

-- Customer vehicles table indexes
CREATE INDEX IF NOT EXISTS idx_customer_vehicles_customer_id ON customers.customer_vehicles(customer_id);
CREATE INDEX IF NOT EXISTS idx_customer_vehicles_vehicle_type ON customers.customer_vehicles(vehicle_type);
CREATE INDEX IF NOT EXISTS idx_customer_vehicles_is_primary ON customers.customer_vehicles(is_primary);
CREATE INDEX IF NOT EXISTS idx_customer_vehicles_is_active ON customers.customer_vehicles(is_active);
CREATE INDEX IF NOT EXISTS idx_customer_vehicles_license_plate ON customers.customer_vehicles(license_plate);

-- Customer communications table indexes
CREATE INDEX IF NOT EXISTS idx_customer_communications_customer_id ON customers.customer_communications(customer_id);
CREATE INDEX IF NOT EXISTS idx_customer_communications_type ON customers.customer_communications(communication_type);
CREATE INDEX IF NOT EXISTS idx_customer_communications_direction ON customers.customer_communications(direction);
CREATE INDEX IF NOT EXISTS idx_customer_communications_status ON customers.customer_communications(status);
CREATE INDEX IF NOT EXISTS idx_customer_communications_created_at ON customers.customer_communications(created_at);
CREATE INDEX IF NOT EXISTS idx_customer_communications_booking_id ON customers.customer_communications(related_booking_id);
CREATE INDEX IF NOT EXISTS idx_customer_communications_quote_id ON customers.customer_communications(related_quote_id);

-- ─────────────────────────────────────────────────────────────────────────────
-- Create triggers
-- ─────────────────────────────────────────────────────────────────────────────

-- Customers table triggers
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

-- Customer vehicles table triggers
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

-- Customer communications table triggers
CREATE OR REPLACE FUNCTION customers.update_customer_communications_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_customer_communications_updated_at
    BEFORE UPDATE ON customers.customer_communications
    FOR EACH ROW
    EXECUTE FUNCTION customers.update_customer_communications_updated_at();

-- ─────────────────────────────────────────────────────────────────────────────
-- Update foreign key references in other tables
-- ─────────────────────────────────────────────────────────────────────────────

-- Update quotes table to reference customers.customers
ALTER TABLE booking.quotes DROP CONSTRAINT IF EXISTS quotes_customer_id_fkey;
ALTER TABLE booking.quotes ADD CONSTRAINT quotes_customer_id_fkey 
    FOREIGN KEY (customer_id) REFERENCES customers.customers(id) ON DELETE SET NULL;

-- Update bookings table to reference customers.customers
ALTER TABLE booking.bookings DROP CONSTRAINT IF EXISTS bookings_customer_id_fkey;
ALTER TABLE booking.bookings ADD CONSTRAINT bookings_customer_id_fkey 
    FOREIGN KEY (customer_id) REFERENCES customers.customers(id) ON DELETE SET NULL;

-- ─────────────────────────────────────────────────────────────────────────────
-- Add table comments for documentation
-- ─────────────────────────────────────────────────────────────────────────────

COMMENT ON TABLE customers.customers IS 'Customer profiles and preferences';
COMMENT ON TABLE customers.customer_vehicles IS 'Customer vehicle information and service history';
COMMENT ON TABLE customers.customer_communications IS 'All customer communication history and tracking';

COMMIT;
