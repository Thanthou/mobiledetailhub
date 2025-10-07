-- Appointments table for scheduling system
CREATE TABLE IF NOT EXISTS schedule.appointments (
    id SERIAL PRIMARY KEY,
    affiliate_id INTEGER NOT NULL REFERENCES tenants.business(id) ON DELETE CASCADE,
    customer_id INTEGER REFERENCES auth.users(id) ON DELETE SET NULL,
    
    -- Appointment details
    title VARCHAR(255) NOT NULL,
    description TEXT,
    service_type VARCHAR(100) NOT NULL,
    service_duration INTEGER NOT NULL, -- in minutes
    
    -- Scheduling
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    
    -- Customer information (denormalized for performance)
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    customer_email VARCHAR(255),
    
    -- Status and pricing
    status VARCHAR(20) NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show')),
    price DECIMAL(10,2),
    deposit DECIMAL(10,2) DEFAULT 0,
    
    -- Metadata
    notes TEXT,
    internal_notes TEXT, -- for affiliate use only
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES auth.users(id),
    updated_by INTEGER REFERENCES auth.users(id),
    
    -- Constraints
    CONSTRAINT valid_appointment_duration CHECK (service_duration > 0),
    CONSTRAINT valid_appointment_times CHECK (end_time > start_time),
    CONSTRAINT valid_price CHECK (price IS NULL OR price >= 0),
    CONSTRAINT valid_deposit CHECK (deposit >= 0 AND (price IS NULL OR deposit <= price))
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_appointments_affiliate_id ON schedule.appointments(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_appointments_customer_id ON schedule.appointments(customer_id);
CREATE INDEX IF NOT EXISTS idx_appointments_start_time ON schedule.appointments(start_time);
CREATE INDEX IF NOT EXISTS idx_appointments_end_time ON schedule.appointments(end_time);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON schedule.appointments(status);
CREATE INDEX IF NOT EXISTS idx_appointments_date_range ON schedule.appointments(affiliate_id, start_time, end_time);

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION schedule.update_appointments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_appointments_updated_at
    BEFORE UPDATE ON schedule.appointments
    FOR EACH ROW
    EXECUTE FUNCTION schedule.update_appointments_updated_at();
