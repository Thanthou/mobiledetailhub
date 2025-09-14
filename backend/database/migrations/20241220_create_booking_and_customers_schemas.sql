-- Migration: Create booking and customers schemas
-- Version: v6.0
-- Description: Create dedicated booking and customers schemas with proper relationships

BEGIN;

-- ─────────────────────────────────────────────────────────────────────────────
-- Create new schemas
-- ─────────────────────────────────────────────────────────────────────────────

CREATE SCHEMA IF NOT EXISTS booking;
COMMENT ON SCHEMA booking IS 'Availability, quotes, and bookings';

CREATE SCHEMA IF NOT EXISTS customers;
COMMENT ON SCHEMA customers IS 'Customer profiles, preferences, and communication history';

-- ─────────────────────────────────────────────────────────────────────────────
-- Create customers schema tables
-- ─────────────────────────────────────────────────────────────────────────────

-- Create customers table
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
-- Create booking schema tables
-- ─────────────────────────────────────────────────────────────────────────────

-- Create availability table
CREATE TABLE IF NOT EXISTS booking.availability (
    id SERIAL PRIMARY KEY,
    affiliate_id INTEGER NOT NULL REFERENCES affiliates.business(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    capacity INTEGER NOT NULL DEFAULT 1,
    is_blocked BOOLEAN DEFAULT false,
    block_reason VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create quotes table
CREATE TABLE IF NOT EXISTS booking.quotes (
    id SERIAL PRIMARY KEY,
    affiliate_id INTEGER NOT NULL REFERENCES affiliates.business(id) ON DELETE CASCADE,
    customer_id INTEGER REFERENCES customers.customers(id) ON DELETE SET NULL,
    address_json JSONB NOT NULL DEFAULT '{}'::jsonb,
    requested_start TIMESTAMPTZ,
    status VARCHAR(20) NOT NULL DEFAULT 'new', -- new, contacted, priced, accepted, rejected, expired
    details_json JSONB NOT NULL DEFAULT '{}'::jsonb,
    estimated_total_cents INTEGER,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS booking.bookings (
    id SERIAL PRIMARY KEY,
    affiliate_id INTEGER NOT NULL REFERENCES affiliates.business(id) ON DELETE CASCADE,
    customer_id INTEGER REFERENCES customers.customers(id) ON DELETE SET NULL,
    service_id INTEGER REFERENCES affiliates.services(id) ON DELETE SET NULL,
    tier_id INTEGER REFERENCES affiliates.service_tiers(id) ON DELETE SET NULL,
    appointment_start TIMESTAMPTZ NOT NULL,
    appointment_end TIMESTAMPTZ NOT NULL,
    address_json JSONB NOT NULL DEFAULT '{}'::jsonb,
    status VARCHAR(20) NOT NULL DEFAULT 'pending', -- pending, confirmed, in_progress, completed, canceled, no_show
    total_cents INTEGER NOT NULL DEFAULT 0,
    stripe_payment_intent_id TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ─────────────────────────────────────────────────────────────────────────────
-- Migrate existing data (if exists in public schema)
-- ─────────────────────────────────────────────────────────────────────────────

-- Check if tables exist in public schema and migrate data
DO $$
BEGIN
    -- Migrate customers if they exist
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'customers') THEN
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
    
    -- Migrate quotes if they exist
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'quotes') THEN
        INSERT INTO booking.quotes (
            id, affiliate_id, customer_id, address_json, requested_start, 
            status, details_json, estimated_total_cents, created_at, updated_at
        )
        SELECT 
            id, affiliate_id, customer_id, address_json, requested_start,
            status, details_json, estimated_total_cents, created_at, updated_at
        FROM public.quotes
        ON CONFLICT (id) DO NOTHING;
        
        -- Update sequence
        SELECT setval('booking.quotes_id_seq', (SELECT MAX(id) FROM booking.quotes));
        
        -- Drop old table
        DROP TABLE public.quotes CASCADE;
    END IF;
    
    -- Migrate bookings if they exist
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'bookings') THEN
        INSERT INTO booking.bookings (
            id, affiliate_id, customer_id, service_id, tier_id, 
            appointment_start, appointment_end, address_json, status, 
            total_cents, stripe_payment_intent_id, created_at, updated_at
        )
        SELECT 
            id, affiliate_id, customer_id, service_id, tier_id,
            appointment_start, appointment_end, address_json, status,
            total_cents, stripe_payment_intent_id, created_at, updated_at
        FROM public.bookings
        ON CONFLICT (id) DO NOTHING;
        
        -- Update sequence
        SELECT setval('booking.bookings_id_seq', (SELECT MAX(id) FROM booking.bookings));
        
        -- Drop old table
        DROP TABLE public.bookings CASCADE;
    END IF;
    
    -- Migrate availability if it exists
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'availability') THEN
        INSERT INTO booking.availability (
            id, affiliate_id, date, start_time, end_time, capacity, created_at, updated_at
        )
        SELECT 
            id, affiliate_id, date, start_time, end_time, capacity, created_at, updated_at
        FROM public.availability
        ON CONFLICT (id) DO NOTHING;
        
        -- Update sequence
        SELECT setval('booking.availability_id_seq', (SELECT MAX(id) FROM booking.availability));
        
        -- Drop old table
        DROP TABLE public.availability CASCADE;
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

-- Booking table indexes
CREATE INDEX IF NOT EXISTS idx_availability_affiliate_date ON booking.availability(affiliate_id, date);
CREATE INDEX IF NOT EXISTS idx_availability_date ON booking.availability(date);
CREATE INDEX IF NOT EXISTS idx_quotes_customer_id ON booking.quotes(customer_id);
CREATE INDEX IF NOT EXISTS idx_quotes_affiliate_id ON booking.quotes(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_quotes_status ON booking.quotes(status);
CREATE INDEX IF NOT EXISTS idx_quotes_created_at ON booking.quotes(created_at);
CREATE INDEX IF NOT EXISTS idx_bookings_customer_id ON booking.bookings(customer_id);
CREATE INDEX IF NOT EXISTS idx_bookings_affiliate_id ON booking.bookings(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON booking.bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_appointment_start ON booking.bookings(appointment_start);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON booking.bookings(created_at);

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

-- Booking table triggers
CREATE OR REPLACE FUNCTION booking.update_booking_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_availability_updated_at
    BEFORE UPDATE ON booking.availability
    FOR EACH ROW
    EXECUTE FUNCTION booking.update_booking_updated_at();

CREATE TRIGGER trigger_quotes_updated_at
    BEFORE UPDATE ON booking.quotes
    FOR EACH ROW
    EXECUTE FUNCTION booking.update_booking_updated_at();

CREATE TRIGGER trigger_bookings_updated_at
    BEFORE UPDATE ON booking.bookings
    FOR EACH ROW
    EXECUTE FUNCTION booking.update_booking_updated_at();

-- ─────────────────────────────────────────────────────────────────────────────
-- Add table comments for documentation
-- ─────────────────────────────────────────────────────────────────────────────

COMMENT ON TABLE customers.customers IS 'Customer profiles and preferences';
COMMENT ON TABLE customers.customer_vehicles IS 'Customer vehicle information and service history';
COMMENT ON TABLE customers.customer_communications IS 'All customer communication history and tracking';
COMMENT ON TABLE booking.availability IS 'Affiliate availability windows';
COMMENT ON TABLE booking.quotes IS 'Customer quote requests';
COMMENT ON TABLE booking.bookings IS 'Confirmed appointments';

COMMIT;
