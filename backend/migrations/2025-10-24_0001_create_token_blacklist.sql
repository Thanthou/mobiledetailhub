-- Migration: Create token blacklist table
-- Created: 2025-10-24
-- Purpose: Store revoked/blacklisted JWT tokens for logout and security

-- Create token_blacklist table in auth schema
CREATE TABLE IF NOT EXISTS auth.token_blacklist (
    id SERIAL PRIMARY KEY,
    token_jti VARCHAR(255) NOT NULL UNIQUE,
    user_id INTEGER REFERENCES auth.users(id) ON DELETE CASCADE,
    reason VARCHAR(100), -- 'logout', 'security', 'password_change', etc.
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Index for fast lookups by jti
CREATE INDEX IF NOT EXISTS idx_token_blacklist_jti ON auth.token_blacklist(token_jti);

-- Index for cleanup of expired tokens
CREATE INDEX IF NOT EXISTS idx_token_blacklist_expires ON auth.token_blacklist(expires_at);

-- Add comment
COMMENT ON TABLE auth.token_blacklist IS 'Stores revoked JWT tokens until they expire naturally';

