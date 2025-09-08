-- Token blacklist table for persistent token revocation
-- This ensures tokens remain blacklisted even after server restarts

DROP TABLE IF EXISTS auth.token_blacklist CASCADE;

CREATE TABLE auth.token_blacklist (
    id SERIAL PRIMARY KEY,
    token_jti VARCHAR(255) NOT NULL, -- JWT ID for efficient lookups
    token_hash VARCHAR(255) NOT NULL, -- Full token hash for exact matches
    user_id INTEGER NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    blacklisted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    reason VARCHAR(100) DEFAULT 'logout', -- logout, security, rotation, etc.
    ip_address INET,
    user_agent TEXT,
    
    CONSTRAINT fk_token_blacklist_user_id 
        FOREIGN KEY (user_id) 
        REFERENCES auth.users(id) 
        ON DELETE CASCADE
);

-- Create indexes for efficient lookups
CREATE INDEX IF NOT EXISTS idx_token_blacklist_jti ON auth.token_blacklist(token_jti);
CREATE INDEX IF NOT EXISTS idx_token_blacklist_hash ON auth.token_blacklist(token_hash);
CREATE INDEX IF NOT EXISTS idx_token_blacklist_user_id ON auth.token_blacklist(user_id);
CREATE INDEX IF NOT EXISTS idx_token_blacklist_expires_at ON auth.token_blacklist(expires_at);
CREATE INDEX IF NOT EXISTS idx_token_blacklist_blacklisted_at ON auth.token_blacklist(blacklisted_at);

-- Create unique constraint to prevent duplicate blacklist entries
CREATE UNIQUE INDEX IF NOT EXISTS idx_token_blacklist_unique_jti ON auth.token_blacklist(token_jti);
CREATE UNIQUE INDEX IF NOT EXISTS idx_token_blacklist_unique_hash ON auth.token_blacklist(token_hash);

-- Function to clean up expired blacklisted tokens
CREATE OR REPLACE FUNCTION auth.cleanup_expired_blacklisted_tokens()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM auth.token_blacklist 
    WHERE expires_at < CURRENT_TIMESTAMP;
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Create a scheduled job to clean up expired tokens (if pg_cron is available)
-- This would be run periodically to clean up expired blacklisted tokens
-- SELECT cron.schedule('cleanup-blacklist', '0 */6 * * *', 'SELECT auth.cleanup_expired_blacklisted_tokens();');

-- Grant permissions (adjust role name as needed for your setup)
-- GRANT SELECT, INSERT, DELETE ON auth.token_blacklist TO mdh_app;
-- GRANT USAGE, SELECT ON SEQUENCE auth.token_blacklist_id_seq TO mdh_app;
