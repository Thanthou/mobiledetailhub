-- Customers Schema Migration
-- Creates customers schema and all its tables

-- Create schema
CREATE SCHEMA IF NOT EXISTS customers;

-- Create customers table
CREATE TABLE IF NOT EXISTS customers.customers (
    id SERIAL PRIMARY KEY,
    user_id INTEGER,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    address VARCHAR(500),
    city VARCHAR(100),
    state VARCHAR(50),
    zip_code VARCHAR(20),
    country VARCHAR(50) DEFAULT 'US',
    status VARCHAR(20) DEFAULT 'anonymous',
    registration_source VARCHAR(50),
    converted_at TIMESTAMPTZ,
    contact_preferences JSONB DEFAULT '{"sms": true, "email": true, "phone": false}'::jsonb,
    service_preferences JSONB DEFAULT '{"service_notes": "", "preferred_time": "morning"}'::jsonb,
    notes TEXT,
    tags TEXT[],
    lifetime_value_cents INTEGER DEFAULT 0,
    total_bookings INTEGER DEFAULT 0,
    last_booking_at TIMESTAMPTZ,
    last_activity_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create customer_vehicles table
CREATE TABLE IF NOT EXISTS customers.customer_vehicles (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER NOT NULL REFERENCES customers.customers(id),
    make VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    year INTEGER,
    color VARCHAR(50),
    license_plate VARCHAR(20),
    vin VARCHAR(17),
    vehicle_type VARCHAR(20) NOT NULL,
    size_bucket VARCHAR(10),
    mileage INTEGER,
    service_notes TEXT,
    preferred_services TEXT[],
    last_service_date DATE,
    next_service_due DATE,
    is_primary BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create customer_communications table
CREATE TABLE IF NOT EXISTS customers.customer_communications (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER NOT NULL REFERENCES customers.customers(id),
    communication_type VARCHAR(50) NOT NULL,
    direction VARCHAR(10) NOT NULL,
    subject VARCHAR(255),
    content TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'sent',
    priority VARCHAR(10) DEFAULT 'normal',
    category VARCHAR(50),
    related_booking_id INTEGER,
    related_quote_id INTEGER,
    related_affiliate_id INTEGER,
    sent_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ,
    read_at TIMESTAMPTZ,
    failed_at TIMESTAMPTZ,
    failure_reason TEXT,
    response_required BOOLEAN DEFAULT FALSE,
    response_received_at TIMESTAMPTZ,
    response_content TEXT,
    external_id VARCHAR(255),
    external_status VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers.customers(email);
CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers.customers(phone);
CREATE INDEX IF NOT EXISTS idx_customers_user_id ON customers.customers(user_id);
CREATE INDEX IF NOT EXISTS idx_customer_vehicles_customer_id ON customers.customer_vehicles(customer_id);
CREATE INDEX IF NOT EXISTS idx_customer_vehicles_license_plate ON customers.customer_vehicles(license_plate);
CREATE INDEX IF NOT EXISTS idx_customer_communications_customer_id ON customers.customer_communications(customer_id);
CREATE INDEX IF NOT EXISTS idx_customer_communications_type ON customers.customer_communications(communication_type);

-- ROLLBACK:
-- DROP SCHEMA IF EXISTS customers CASCADE;
