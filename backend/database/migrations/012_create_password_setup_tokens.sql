-- Create password setup tokens table
-- This table stores tokens for new users to set their initial password

CREATE TABLE IF NOT EXISTS auth.password_setup_tokens (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    used_at TIMESTAMP WITH TIME ZONE NULL,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_password_setup_tokens_user_id ON auth.password_setup_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_password_setup_tokens_token_hash ON auth.password_setup_tokens(token_hash);
CREATE INDEX IF NOT EXISTS idx_password_setup_tokens_expires_at ON auth.password_setup_tokens(expires_at);
CREATE INDEX IF NOT EXISTS idx_password_setup_tokens_used_at ON auth.password_setup_tokens(used_at);

-- Add comments
COMMENT ON TABLE auth.password_setup_tokens IS 'Stores secure tokens for new users to set their initial password';
COMMENT ON COLUMN auth.password_setup_tokens.token_hash IS 'SHA-256 hash of the setup token';
COMMENT ON COLUMN auth.password_setup_tokens.expires_at IS 'Token expiration timestamp (24 hours from creation)';
COMMENT ON COLUMN auth.password_setup_tokens.used_at IS 'Timestamp when token was used to set password';
COMMENT ON COLUMN auth.password_setup_tokens.ip_address IS 'IP address of the request that created the token';
COMMENT ON COLUMN auth.password_setup_tokens.user_agent IS 'User agent of the request that created the token';
