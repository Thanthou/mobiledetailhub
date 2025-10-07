-- Time blocks table for blocking out unavailable time slots
CREATE TABLE IF NOT EXISTS schedule.time_blocks (
    id SERIAL PRIMARY KEY,
    affiliate_id INTEGER NOT NULL REFERENCES tenants.business(id) ON DELETE CASCADE,
    
    -- Block details
    title VARCHAR(255) NOT NULL,
    description TEXT,
    block_type VARCHAR(50) NOT NULL DEFAULT 'unavailable' CHECK (block_type IN ('unavailable', 'break', 'maintenance', 'personal', 'other')),
    
    -- Time range
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    
    -- Recurrence (optional)
    is_recurring BOOLEAN DEFAULT FALSE,
    recurrence_pattern VARCHAR(20) CHECK (recurrence_pattern IN ('daily', 'weekly', 'monthly')),
    recurrence_end_date TIMESTAMP WITH TIME ZONE,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES auth.users(id),
    
    -- Constraints
    CONSTRAINT valid_time_block_duration CHECK (end_time > start_time),
    CONSTRAINT valid_recurrence_end CHECK (
        (is_recurring = FALSE) OR 
        (is_recurring = TRUE AND recurrence_end_date IS NOT NULL AND recurrence_end_date > start_time)
    )
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_time_blocks_affiliate_id ON schedule.time_blocks(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_time_blocks_start_time ON schedule.time_blocks(start_time);
CREATE INDEX IF NOT EXISTS idx_time_blocks_end_time ON schedule.time_blocks(end_time);
CREATE INDEX IF NOT EXISTS idx_time_blocks_type ON schedule.time_blocks(block_type);
CREATE INDEX IF NOT EXISTS idx_time_blocks_recurring ON schedule.time_blocks(is_recurring);

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION schedule.update_time_blocks_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_time_blocks_updated_at
    BEFORE UPDATE ON schedule.time_blocks
    FOR EACH ROW
    EXECUTE FUNCTION schedule.update_time_blocks_updated_at();
