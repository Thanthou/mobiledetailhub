-- Add refresh tokens table for JWT security improvements
-- This table stores refresh tokens with proper security measures

-- Create refresh_tokens table
CREATE TABLE IF NOT EXISTS refresh_tokens (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    token_hash VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    is_revoked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    revoked_at TIMESTAMP WITH TIME ZONE,
    ip_address INET,
    user_agent TEXT,
    device_id VARCHAR(255),
    
    -- Foreign key constraint
    CONSTRAINT fk_refresh_tokens_user_id 
        FOREIGN KEY (user_id) 
        REFERENCES users(id) 
        ON DELETE CASCADE,
    
    -- Indexes for performance
    CONSTRAINT idx_refresh_tokens_user_id 
        UNIQUE (user_id, device_id),
    CONSTRAINT idx_refresh_tokens_token_hash 
        UNIQUE (token_hash)
);

-- Add comment to table
COMMENT ON TABLE refresh_tokens IS 'Stores refresh tokens for JWT authentication with security tracking';

-- Add comments to columns
COMMENT ON COLUMN refresh_tokens.id IS 'Primary key';
COMMENT ON COLUMN refresh_tokens.user_id IS 'Reference to users table';
COMMENT ON COLUMN refresh_tokens.token_hash IS 'SHA256 hash of the refresh token (not stored in plain text)';
COMMENT ON COLUMN refresh_tokens.expires_at IS 'When the refresh token expires';
COMMENT ON COLUMN refresh_tokens.is_revoked IS 'Whether the token has been manually revoked';
COMMENT ON COLUMN refresh_tokens.created_at IS 'When the token was created';
COMMENT ON COLUMN refresh_tokens.revoked_at IS 'When the token was revoked (if applicable)';
COMMENT ON COLUMN refresh_tokens.ip_address IS 'IP address where token was created';
COMMENT ON COLUMN refresh_tokens.user_agent IS 'User agent string when token was created';
COMMENT ON COLUMN refresh_tokens.device_id IS 'Unique device identifier for multi-device support';

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user_id_expires 
    ON refresh_tokens(user_id, expires_at);

CREATE INDEX IF NOT EXISTS idx_refresh_tokens_revoked_expires 
    ON refresh_tokens(is_revoked, expires_at);

-- Create function to clean up expired tokens
CREATE OR REPLACE FUNCTION cleanup_expired_refresh_tokens()
RETURNS INTEGER AS $func$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM refresh_tokens 
    WHERE expires_at < NOW() OR is_revoked = TRUE;
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$func$ LANGUAGE plpgsql;

-- Create a scheduled job to clean up expired tokens (if using pg_cron)
-- This would need to be set up separately in production
-- SELECT cron.schedule('cleanup-expired-tokens', '0 2 * * *', 'SELECT cleanup_expired_refresh_tokens();');

-- Grant permissions (adjust as needed for your setup)
-- GRANT SELECT, INSERT, UPDATE, DELETE ON refresh_tokens TO your_app_user;
-- GRANT USAGE, SELECT ON SEQUENCE refresh_tokens_id_seq TO your_app_user;

-- Insert sample data for testing (remove in production)
-- INSERT INTO refresh_tokens (user_id, token_hash, expires_at, ip_address, user_agent, device_id) 
-- VALUES (1, 'sample_hash_123', NOW() + INTERVAL '7 days', '127.0.0.1', 'Test User Agent', 'test-device-1');
