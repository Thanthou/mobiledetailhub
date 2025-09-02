-- Refresh tokens table for secure token management
DROP TABLE IF EXISTS auth.refresh_tokens CASCADE;

CREATE TABLE auth.refresh_tokens (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    token_hash VARCHAR(255) NOT NULL,
    token_family VARCHAR(255) NOT NULL, -- For token rotation security
    token_type VARCHAR(20) DEFAULT 'refresh', -- refresh, access, etc.
    user_agent TEXT,
    ip_address INET,
    device_id VARCHAR(255),
    device_fingerprint VARCHAR(255), -- Browser/device fingerprint
    location_data JSONB DEFAULT '{}', -- Country, city, etc.
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    revoked_at TIMESTAMP WITH TIME ZONE,
    revoked_reason VARCHAR(100), -- expired, logout, security, rotation
    is_revoked BOOLEAN DEFAULT false,
    is_rotated BOOLEAN DEFAULT false, -- Track if this token was rotated
    parent_token_id INTEGER, -- Reference to token that was rotated
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user_id ON auth.refresh_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_token_hash ON auth.refresh_tokens(token_hash);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_token_family ON auth.refresh_tokens(token_family);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_device_id ON auth.refresh_tokens(device_id);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_expires_at ON auth.refresh_tokens(expires_at);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_is_revoked ON auth.refresh_tokens(is_revoked);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_created_at ON auth.refresh_tokens(created_at);

-- Create trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION auth.update_refresh_tokens_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_refresh_tokens_updated_at
    BEFORE UPDATE ON auth.refresh_tokens
    FOR EACH ROW
    EXECUTE FUNCTION auth.update_refresh_tokens_updated_at();

-- Add foreign key constraint to users table
ALTER TABLE auth.refresh_tokens 
ADD CONSTRAINT fk_refresh_tokens_user_id 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Add self-referencing foreign key for token rotation
ALTER TABLE auth.refresh_tokens 
ADD CONSTRAINT fk_refresh_tokens_parent_token_id 
FOREIGN KEY (parent_token_id) REFERENCES auth.refresh_tokens(id) ON DELETE SET NULL;

-- Add constraints
ALTER TABLE auth.refresh_tokens ADD CONSTRAINT chk_token_type 
    CHECK (token_type IN ('refresh', 'access', 'password_reset', 'email_verification'));

ALTER TABLE auth.refresh_tokens ADD CONSTRAINT chk_revoked_reason 
    CHECK (revoked_reason IN ('expired', 'logout', 'security', 'rotation', 'admin_revoke'));
