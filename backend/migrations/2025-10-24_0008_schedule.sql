-- Schedule Schema Migration
-- Migration: 2025-10-24_0008_schedule
-- Purpose: Create schedule tables (schema created in 0001_create_schemas.sql)

-- Drop existing schedule tables if they exist (to ensure clean migration)
DROP TABLE IF EXISTS schedule.schedule_holidays CASCADE;
DROP TABLE IF EXISTS schedule.schedule_exceptions CASCADE;
DROP TABLE IF EXISTS schedule.schedule_blocks CASCADE;

-- Create schedule_blocks table
CREATE TABLE schedule.schedule_blocks (
    id SERIAL PRIMARY KEY,
    tenant_id INTEGER NOT NULL REFERENCES tenants.business(id) ON DELETE CASCADE,
    day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    max_bookings INTEGER DEFAULT 1,
    service_type VARCHAR(50),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create schedule_exceptions table
CREATE TABLE schedule.schedule_exceptions (
    id SERIAL PRIMARY KEY,
    tenant_id INTEGER NOT NULL REFERENCES tenants.business(id) ON DELETE CASCADE,
    exception_date DATE NOT NULL,
    start_time TIME,
    end_time TIME,
    is_available BOOLEAN DEFAULT FALSE,
    reason TEXT,
    is_recurring BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create schedule_holidays table
CREATE TABLE schedule.schedule_holidays (
    id SERIAL PRIMARY KEY,
    tenant_id INTEGER NOT NULL REFERENCES tenants.business(id) ON DELETE CASCADE,
    holiday_name VARCHAR(255) NOT NULL,
    holiday_date DATE NOT NULL,
    is_recurring BOOLEAN DEFAULT TRUE,
    is_available BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_schedule_blocks_tenant_id ON schedule.schedule_blocks(tenant_id);
CREATE INDEX IF NOT EXISTS idx_schedule_blocks_day_of_week ON schedule.schedule_blocks(day_of_week);
CREATE INDEX IF NOT EXISTS idx_schedule_exceptions_tenant_id ON schedule.schedule_exceptions(tenant_id);
CREATE INDEX IF NOT EXISTS idx_schedule_exceptions_date ON schedule.schedule_exceptions(exception_date);
CREATE INDEX IF NOT EXISTS idx_schedule_holidays_tenant_id ON schedule.schedule_holidays(tenant_id);
CREATE INDEX IF NOT EXISTS idx_schedule_holidays_date ON schedule.schedule_holidays(holiday_date);

-- ROLLBACK:
-- DROP SCHEMA IF EXISTS schedule CASCADE;

