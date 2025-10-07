-- Blocked days table for disabling specific dates
CREATE TABLE IF NOT EXISTS schedule.blocked_days (
    id SERIAL PRIMARY KEY,
    affiliate_id INTEGER NOT NULL REFERENCES tenants.business(id) ON DELETE CASCADE,
    blocked_date DATE NOT NULL,
    reason VARCHAR(255), -- Optional reason for blocking (e.g., "Holiday", "Maintenance", "Personal")
    is_recurring BOOLEAN DEFAULT FALSE, -- For recurring blocked days (e.g., every Sunday)
    recurrence_pattern VARCHAR(20) CHECK (recurrence_pattern IN ('yearly', 'monthly', 'weekly')),
    recurrence_end_date DATE, -- When to stop recurring
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES auth.users(id),
    
    -- Constraints
    CONSTRAINT unique_affiliate_date UNIQUE (affiliate_id, blocked_date),
    CONSTRAINT valid_recurrence_end CHECK (
        (is_recurring = FALSE) OR 
        (is_recurring = TRUE AND recurrence_end_date IS NOT NULL AND recurrence_end_date > blocked_date)
    )
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_blocked_days_affiliate_id ON schedule.blocked_days(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_blocked_days_date ON schedule.blocked_days(blocked_date);
CREATE INDEX IF NOT EXISTS idx_blocked_days_recurring ON schedule.blocked_days(is_recurring);
CREATE INDEX IF NOT EXISTS idx_blocked_days_affiliate_date_range ON schedule.blocked_days(affiliate_id, blocked_date);

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION schedule.update_blocked_days_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_blocked_days_updated_at
    BEFORE UPDATE ON schedule.blocked_days
    FOR EACH ROW
    EXECUTE FUNCTION schedule.update_blocked_days_updated_at();
