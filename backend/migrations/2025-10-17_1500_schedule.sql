-- Schedule Schema Migration
-- Creates schedule tables (schema already exists from 1400_create_schemas.sql)

-- Create appointments table
CREATE TABLE IF NOT EXISTS schedule.appointments (
    id SERIAL PRIMARY KEY,
    affiliate_id INTEGER NOT NULL,
    customer_id INTEGER,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    service_type VARCHAR(100) NOT NULL,
    service_duration INTEGER NOT NULL,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    customer_email VARCHAR(255),
    status VARCHAR(20) DEFAULT 'scheduled',
    price NUMERIC,
    deposit NUMERIC DEFAULT 0,
    notes TEXT,
    internal_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER,
    updated_by INTEGER
);

-- Create blocked_days table
CREATE TABLE IF NOT EXISTS schedule.blocked_days (
    id SERIAL PRIMARY KEY,
    affiliate_id INTEGER NOT NULL,
    blocked_date DATE NOT NULL,
    reason VARCHAR(255),
    is_recurring BOOLEAN DEFAULT FALSE,
    recurrence_pattern VARCHAR(20),
    recurrence_end_date DATE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER
);

-- Create schedule_settings table
CREATE TABLE IF NOT EXISTS schedule.schedule_settings (
    id SERIAL PRIMARY KEY,
    affiliate_id INTEGER NOT NULL,
    business_hours JSONB DEFAULT '{"friday": {"end": "17:00", "start": "09:00"}, "monday": {"end": "17:00", "start": "09:00"}, "saturday": {"end": "15:00", "start": "09:00"}, "sunday": {"end": "15:00", "start": "10:00"}, "thursday": {"end": "17:00", "start": "09:00"}, "tuesday": {"end": "17:00", "start": "09:00"}, "wednesday": {"end": "17:00", "start": "09:00"}}'::jsonb,
    default_appointment_duration INTEGER DEFAULT 60,
    buffer_time INTEGER DEFAULT 15,
    max_appointments_per_day INTEGER DEFAULT 20,
    advance_booking_days INTEGER DEFAULT 30,
    same_day_booking_allowed BOOLEAN DEFAULT TRUE,
    time_slot_interval INTEGER DEFAULT 15,
    earliest_appointment_time TIME DEFAULT '08:00:00',
    latest_appointment_time TIME DEFAULT '18:00:00',
    send_reminders BOOLEAN DEFAULT TRUE,
    reminder_hours_before INTEGER DEFAULT 24,
    send_confirmation_emails BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_by INTEGER
);

-- Create time_blocks table
CREATE TABLE IF NOT EXISTS schedule.time_blocks (
    id SERIAL PRIMARY KEY,
    affiliate_id INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    block_type VARCHAR(50) DEFAULT 'unavailable',
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    is_recurring BOOLEAN DEFAULT FALSE,
    recurrence_pattern VARCHAR(20),
    recurrence_end_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_appointments_affiliate_id ON schedule.appointments(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_appointments_customer_id ON schedule.appointments(customer_id);
CREATE INDEX IF NOT EXISTS idx_appointments_start_time ON schedule.appointments(start_time);
CREATE INDEX IF NOT EXISTS idx_blocked_days_affiliate_id ON schedule.blocked_days(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_blocked_days_date ON schedule.blocked_days(blocked_date);
CREATE INDEX IF NOT EXISTS idx_schedule_settings_affiliate_id ON schedule.schedule_settings(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_time_blocks_affiliate_id ON schedule.time_blocks(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_time_blocks_start_time ON schedule.time_blocks(start_time);

-- ROLLBACK:
-- DROP SCHEMA IF EXISTS schedule CASCADE;
