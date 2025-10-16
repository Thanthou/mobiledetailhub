-- Password Reset Tokens Table
-- Stores secure password reset tokens with rate limiting and cleanup

CREATE TABLE IF NOT EXISTS auth.password_reset_tokens (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  token_hash VARCHAR(64) NOT NULL, -- SHA-256 hash of the reset token
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used_at TIMESTAMP WITH TIME ZONE NULL, -- When token was used (NULL = unused)
  ip_address INET NULL, -- IP address of the request
  user_agent TEXT NULL, -- User agent of the request
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure token hash is unique
  UNIQUE(token_hash),
  
  -- Index for cleanup queries
  INDEX idx_password_reset_tokens_expires_at (expires_at),
  INDEX idx_password_reset_tokens_user_id (user_id),
  INDEX idx_password_reset_tokens_created_at (created_at)
);

-- Add comments
COMMENT ON TABLE auth.password_reset_tokens IS 'Secure password reset tokens with rate limiting';
COMMENT ON COLUMN auth.password_reset_tokens.token_hash IS 'SHA-256 hash of the reset token for security';
COMMENT ON COLUMN auth.password_reset_tokens.expires_at IS 'Token expiration time (typically 15 minutes)';
COMMENT ON COLUMN auth.password_reset_tokens.used_at IS 'When token was used to reset password (NULL = unused)';
COMMENT ON COLUMN auth.password_reset_tokens.ip_address IS 'IP address of the reset request for security tracking';
COMMENT ON COLUMN auth.password_reset_tokens.user_agent IS 'User agent of the reset request for security tracking';
