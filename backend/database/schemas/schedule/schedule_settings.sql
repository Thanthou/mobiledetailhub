-- Schedule settings table for affiliate-specific scheduling configuration
CREATE TABLE IF NOT EXISTS schedule.schedule_settings (
    id SERIAL PRIMARY KEY,
    affiliate_id INTEGER NOT NULL UNIQUE REFERENCES tenants.business(id) ON DELETE CASCADE,
    
    -- Business hours (stored as JSON for flexibility)
    business_hours JSONB NOT NULL DEFAULT '{
        "monday": {"start": "09:00", "end": "17:00", "enabled": true},
        "tuesday": {"start": "09:00", "end": "17:00", "enabled": true},
        "wednesday": {"start": "09:00", "end": "17:00", "enabled": true},
        "thursday": {"start": "09:00", "end": "17:00", "enabled": true},
        "friday": {"start": "09:00", "end": "17:00", "enabled": true},
        "saturday": {"start": "10:00", "end": "15:00", "enabled": true},
        "sunday": {"start": "10:00", "end": "15:00", "enabled": false}
    }',
    
    -- Scheduling constraints
    default_appointment_duration INTEGER DEFAULT 60, -- in minutes
    buffer_time INTEGER DEFAULT 15, -- buffer between appointments in minutes
    max_appointments_per_day INTEGER DEFAULT 20,
    advance_booking_days INTEGER DEFAULT 30, -- how far in advance customers can book
    same_day_booking_allowed BOOLEAN DEFAULT TRUE,
    
    -- Time slot configuration
    time_slot_interval INTEGER DEFAULT 15, -- interval between available time slots
    earliest_appointment_time TIME DEFAULT '08:00',
    latest_appointment_time TIME DEFAULT '18:00',
    
    -- Notifications
    send_reminders BOOLEAN DEFAULT TRUE,
    reminder_hours_before INTEGER DEFAULT 24,
    send_confirmation_emails BOOLEAN DEFAULT TRUE,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_by INTEGER REFERENCES auth.users(id),
    
    -- Constraints
    CONSTRAINT valid_default_duration CHECK (default_appointment_duration > 0),
    CONSTRAINT valid_buffer_time CHECK (buffer_time >= 0),
    CONSTRAINT valid_max_appointments CHECK (max_appointments_per_day > 0),
    CONSTRAINT valid_advance_booking CHECK (advance_booking_days > 0),
    CONSTRAINT valid_time_slot_interval CHECK (time_slot_interval > 0),
    CONSTRAINT valid_reminder_hours CHECK (reminder_hours_before > 0)
);

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_schedule_settings_affiliate_id ON schedule.schedule_settings(affiliate_id);

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION schedule.update_schedule_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_schedule_settings_updated_at
    BEFORE UPDATE ON schedule.schedule_settings
    FOR EACH ROW
    EXECUTE FUNCTION schedule.update_schedule_settings_updated_at();
