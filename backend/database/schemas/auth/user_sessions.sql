-- User sessions table for active session management
DROP TABLE IF EXISTS auth.user_sessions CASCADE;

CREATE TABLE auth.user_sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    refresh_token_id INTEGER,
    ip_address INET,
    user_agent TEXT,
    device_id VARCHAR(255),
    device_fingerprint VARCHAR(255),
    location_data JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON auth.user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_session_token ON auth.user_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_user_sessions_refresh_token_id ON auth.user_sessions(refresh_token_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_device_id ON auth.user_sessions(device_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_is_active ON auth.user_sessions(is_active);
CREATE INDEX IF NOT EXISTS idx_user_sessions_expires_at ON auth.user_sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_user_sessions_last_activity_at ON auth.user_sessions(last_activity_at);

-- Create trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION auth.update_user_sessions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_user_sessions_updated_at
    BEFORE UPDATE ON auth.user_sessions
    FOR EACH ROW
    EXECUTE FUNCTION auth.update_user_sessions_updated_at();

-- Add foreign key constraints
ALTER TABLE auth.user_sessions 
ADD CONSTRAINT fk_user_sessions_user_id 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE auth.user_sessions 
ADD CONSTRAINT fk_user_sessions_refresh_token_id 
FOREIGN KEY (refresh_token_id) REFERENCES auth.refresh_tokens(id) ON DELETE SET NULL;
