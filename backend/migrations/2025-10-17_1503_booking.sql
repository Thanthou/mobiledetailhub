-- Booking Schema Migration
-- Creates booking tables (schema already exists from 1400_create_schemas.sql)

-- Drop existing booking tables if they exist (to ensure clean migration)
DROP TABLE IF EXISTS booking.blackout_dates CASCADE;
DROP TABLE IF EXISTS booking.availability CASCADE;
DROP TABLE IF EXISTS booking.booking_services CASCADE;
DROP TABLE IF EXISTS booking.bookings CASCADE;

-- Create bookings table
CREATE TABLE booking.bookings (
    id SERIAL PRIMARY KEY,
    tenant_id INTEGER NOT NULL REFERENCES tenants.business(id),
    customer_id INTEGER,
    service_id INTEGER,
    booking_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    duration_minutes INTEGER NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    notes TEXT,
    special_requests TEXT,
    total_amount DECIMAL(10,2),
    deposit_amount DECIMAL(10,2),
    payment_status VARCHAR(20) DEFAULT 'pending',
    stripe_payment_intent_id VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    cancelled_at TIMESTAMPTZ,
    cancellation_reason TEXT,
    reminder_sent BOOLEAN DEFAULT FALSE,
    confirmation_sent BOOLEAN DEFAULT FALSE
);

-- Create booking_services table (many-to-many relationship)
CREATE TABLE booking.booking_services (
    id SERIAL PRIMARY KEY,
    booking_id INTEGER NOT NULL REFERENCES booking.bookings(id) ON DELETE CASCADE,
    service_id INTEGER NOT NULL,
    quantity INTEGER DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create booking_availability table
CREATE TABLE booking.availability (
    id SERIAL PRIMARY KEY,
    tenant_id INTEGER NOT NULL REFERENCES tenants.business(id),
    day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    max_bookings INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create booking_blackout_dates table
CREATE TABLE booking.blackout_dates (
    id SERIAL PRIMARY KEY,
    tenant_id INTEGER NOT NULL REFERENCES tenants.business(id),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    reason TEXT,
    is_recurring BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_bookings_tenant_id ON booking.bookings(tenant_id);
CREATE INDEX IF NOT EXISTS idx_bookings_customer_id ON booking.bookings(customer_id);
CREATE INDEX IF NOT EXISTS idx_bookings_booking_date ON booking.bookings(booking_date);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON booking.bookings(status);
CREATE INDEX IF NOT EXISTS idx_booking_services_booking_id ON booking.booking_services(booking_id);
CREATE INDEX IF NOT EXISTS idx_availability_tenant_id ON booking.availability(tenant_id);
CREATE INDEX IF NOT EXISTS idx_availability_day_of_week ON booking.availability(day_of_week);
CREATE INDEX IF NOT EXISTS idx_blackout_dates_tenant_id ON booking.blackout_dates(tenant_id);
CREATE INDEX IF NOT EXISTS idx_blackout_dates_dates ON booking.blackout_dates(start_date, end_date);

-- ROLLBACK:
-- DROP SCHEMA IF EXISTS booking CASCADE;
