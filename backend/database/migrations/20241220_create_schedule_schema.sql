-- Create schedule schema and tables
-- Migration: 20241220_create_schedule_schema.sql

-- Create the schedule schema
CREATE SCHEMA IF NOT EXISTS schedule;

-- Set search path to include schedule schema
SET search_path TO schedule, public;

-- Create appointments table
\i ../schemas/schedule/appointments.sql

-- Create time_blocks table  
\i ../schemas/schedule/time_blocks.sql

-- Create schedule_settings table
\i ../schemas/schedule/schedule_settings.sql

-- Create blocked_days table
\i ../schemas/schedule/blocked_days.sql

-- Insert default schedule settings for existing affiliates
INSERT INTO schedule.schedule_settings (affiliate_id)
SELECT id FROM tenants.business
WHERE id NOT IN (SELECT affiliate_id FROM schedule.schedule_settings)
ON CONFLICT (affiliate_id) DO NOTHING;

-- Reset search path
SET search_path TO public;
