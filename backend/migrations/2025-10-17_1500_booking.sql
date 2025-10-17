-- Booking Schema Migration
-- Creates booking tables (schema already exists from 1400_create_schemas.sql)

-- Create availability table
CREATE TABLE IF NOT EXISTS booking.availability (
    id SERIAL PRIMARY KEY,
    affiliate_id INTEGER NOT NULL,
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    capacity INTEGER DEFAULT 1,
    is_blocked BOOLEAN DEFAULT FALSE,
    block_reason VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS booking.bookings (
    id SERIAL PRIMARY KEY,
    affiliate_id INTEGER NOT NULL,
    customer_id INTEGER,
    service_id INTEGER,
    tier_id INTEGER,
    appointment_start TIMESTAMPTZ NOT NULL,
    appointment_end TIMESTAMPTZ NOT NULL,
    address_json JSONB DEFAULT '{}'::jsonb,
    status VARCHAR(20) DEFAULT 'pending',
    total_cents INTEGER DEFAULT 0,
    stripe_payment_intent_id TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create quotes table
CREATE TABLE IF NOT EXISTS booking.quotes (
    id SERIAL PRIMARY KEY,
    affiliate_id INTEGER NOT NULL,
    customer_id INTEGER,
    address_json JSONB DEFAULT '{}'::jsonb,
    requested_start TIMESTAMPTZ,
    status VARCHAR(20) DEFAULT 'new',
    details_json JSONB DEFAULT '{}'::jsonb,
    estimated_total_cents INTEGER,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_availability_affiliate_date ON booking.availability(affiliate_id, date);
CREATE INDEX IF NOT EXISTS idx_availability_date ON booking.availability(date);
CREATE INDEX IF NOT EXISTS idx_bookings_affiliate_id ON booking.bookings(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_bookings_customer_id ON booking.bookings(customer_id);
CREATE INDEX IF NOT EXISTS idx_bookings_appointment_start ON booking.bookings(appointment_start);
CREATE INDEX IF NOT EXISTS idx_quotes_affiliate_id ON booking.quotes(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_quotes_customer_id ON booking.quotes(customer_id);

-- ROLLBACK:
-- DROP SCHEMA IF EXISTS booking CASCADE;
