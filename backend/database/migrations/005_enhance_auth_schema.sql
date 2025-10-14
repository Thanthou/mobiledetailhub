-- Migration: Enhance Auth Schema
-- Date: 2025-10-13
-- Description: Add Stripe integration column and helper functions for auth operations

BEGIN;

-- =====================================================
-- PART 1: Add Stripe Customer ID to Users
-- =====================================================

-- Add stripe_customer_id column
ALTER TABLE auth.users 
  ADD COLUMN IF NOT EXISTS stripe_customer_id VARCHAR(255) UNIQUE;

-- Create index for efficient Stripe lookups
CREATE INDEX IF NOT EXISTS idx_users_stripe_customer_id 
  ON auth.users(stripe_customer_id);

-- Add comment for documentation
COMMENT ON COLUMN auth.users.stripe_customer_id IS 
  'Stripe customer ID for payment processing and subscription management';

-- =====================================================
-- PART 2: Add Helper Functions
-- =====================================================

-- Function: Check if email is available
CREATE OR REPLACE FUNCTION auth.is_email_available(p_email VARCHAR)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN NOT EXISTS (SELECT 1 FROM auth.users WHERE email = p_email);
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION auth.is_email_available(VARCHAR) IS 
  'Check if an email address is available for registration';

-- Function: Record failed login attempt
CREATE OR REPLACE FUNCTION auth.record_failed_login(p_email VARCHAR)
RETURNS VOID AS $$
BEGIN
    -- Increment failed login attempts
    UPDATE auth.users 
    SET failed_login_attempts = failed_login_attempts + 1
    WHERE email = p_email;
    
    -- Lock account after 5 failed attempts for 30 minutes
    UPDATE auth.users
    SET locked_until = CURRENT_TIMESTAMP + INTERVAL '30 minutes'
    WHERE email = p_email 
      AND failed_login_attempts >= 5
      AND (locked_until IS NULL OR locked_until < CURRENT_TIMESTAMP);
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION auth.record_failed_login(VARCHAR) IS 
  'Record a failed login attempt and auto-lock account after 5 failures';

-- Function: Record successful login
CREATE OR REPLACE FUNCTION auth.record_successful_login(
    p_user_id INTEGER,
    p_ip_address INET
)
RETURNS VOID AS $$
BEGIN
    UPDATE auth.users 
    SET failed_login_attempts = 0,
        locked_until = NULL,
        last_login_at = CURRENT_TIMESTAMP,
        last_login_ip = p_ip_address
    WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION auth.record_successful_login(INTEGER, INET) IS 
  'Record successful login, reset failed attempts, and unlock account';

-- Function: Cleanup expired tokens and sessions
CREATE OR REPLACE FUNCTION auth.cleanup_expired_data()
RETURNS TABLE(
    expired_tokens INTEGER,
    expired_sessions INTEGER,
    old_login_attempts INTEGER
) AS $$
DECLARE
    token_count INTEGER;
    session_count INTEGER;
    login_count INTEGER;
BEGIN
    -- Delete expired refresh tokens (older than 90 days)
    DELETE FROM auth.refresh_tokens 
    WHERE expires_at < CURRENT_TIMESTAMP 
      AND (revoked_at IS NULL OR revoked_at < CURRENT_TIMESTAMP - INTERVAL '90 days');
    GET DIAGNOSTICS token_count = ROW_COUNT;
    
    -- Delete expired sessions (older than 30 days)
    DELETE FROM auth.user_sessions 
    WHERE expires_at < CURRENT_TIMESTAMP - INTERVAL '30 days';
    GET DIAGNOSTICS session_count = ROW_COUNT;
    
    -- Delete old login attempts (older than 90 days)
    DELETE FROM auth.login_attempts 
    WHERE attempted_at < CURRENT_TIMESTAMP - INTERVAL '90 days';
    GET DIAGNOSTICS login_count = ROW_COUNT;
    
    RETURN QUERY SELECT token_count, session_count, login_count;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION auth.cleanup_expired_data() IS 
  'Clean up expired tokens, sessions, and old login attempts';

-- Function: Revoke all tokens for a user (logout from all devices)
CREATE OR REPLACE FUNCTION auth.revoke_all_user_tokens(p_user_id INTEGER)
RETURNS INTEGER AS $$
DECLARE
    revoked_count INTEGER;
BEGIN
    -- Revoke all active refresh tokens
    UPDATE auth.refresh_tokens 
    SET is_revoked = true,
        revoked_at = CURRENT_TIMESTAMP,
        revoked_reason = 'admin_revoke'
    WHERE user_id = p_user_id 
      AND is_revoked = false;
    
    GET DIAGNOSTICS revoked_count = ROW_COUNT;
    
    -- Deactivate all sessions
    UPDATE auth.user_sessions 
    SET is_active = false
    WHERE user_id = p_user_id 
      AND is_active = true;
    
    RETURN revoked_count;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION auth.revoke_all_user_tokens(INTEGER) IS 
  'Revoke all tokens and deactivate all sessions for a user (logout from all devices)';

-- Function: Check if user account is locked
CREATE OR REPLACE FUNCTION auth.is_account_locked(p_user_id INTEGER)
RETURNS BOOLEAN AS $$
DECLARE
    locked_until_value TIMESTAMP WITH TIME ZONE;
BEGIN
    SELECT locked_until INTO locked_until_value
    FROM auth.users
    WHERE id = p_user_id;
    
    RETURN (locked_until_value IS NOT NULL AND locked_until_value > CURRENT_TIMESTAMP);
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION auth.is_account_locked(INTEGER) IS 
  'Check if a user account is currently locked';

-- Function: Get active sessions for a user
CREATE OR REPLACE FUNCTION auth.get_active_sessions(p_user_id INTEGER)
RETURNS TABLE(
    session_id INTEGER,
    session_token VARCHAR(255),
    ip_address INET,
    user_agent TEXT,
    device_id VARCHAR(255),
    last_activity_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        id,
        s.session_token,
        s.ip_address,
        s.user_agent,
        s.device_id,
        s.last_activity_at,
        s.created_at
    FROM auth.user_sessions s
    WHERE s.user_id = p_user_id
      AND s.is_active = true
      AND s.expires_at > CURRENT_TIMESTAMP
    ORDER BY s.last_activity_at DESC;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION auth.get_active_sessions(INTEGER) IS 
  'Get all active sessions for a user';

-- =====================================================
-- PART 3: Add Composite Indexes for Performance
-- =====================================================

-- Find active sessions for a user (common query)
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_active 
  ON auth.user_sessions(user_id, is_active) 
  WHERE is_active = true;

-- Find non-revoked tokens for a user (common query)
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user_active 
  ON auth.refresh_tokens(user_id, is_revoked, expires_at) 
  WHERE is_revoked = false;

-- Find recent failed login attempts by email (for rate limiting)
CREATE INDEX IF NOT EXISTS idx_login_attempts_email_recent 
  ON auth.login_attempts(email, attempted_at DESC) 
  WHERE success = false;

-- Find users by account status (for admin queries)
CREATE INDEX IF NOT EXISTS idx_users_status_created 
  ON auth.users(account_status, created_at DESC);

-- =====================================================
-- PART 4: Add user_id to login_attempts (optional FK)
-- =====================================================

-- Add user_id column (nullable to allow failed attempts for non-existent users)
ALTER TABLE auth.login_attempts 
  ADD COLUMN IF NOT EXISTS user_id INTEGER;

-- Create index
CREATE INDEX IF NOT EXISTS idx_login_attempts_user_id 
  ON auth.login_attempts(user_id);

-- Add optional foreign key (nullable)
ALTER TABLE auth.login_attempts 
  DROP CONSTRAINT IF EXISTS fk_login_attempts_user_id;

ALTER TABLE auth.login_attempts 
  ADD CONSTRAINT fk_login_attempts_user_id 
  FOREIGN KEY (user_id) 
  REFERENCES auth.users(id) 
  ON DELETE SET NULL;

COMMENT ON COLUMN auth.login_attempts.user_id IS 
  'Reference to user (NULL for failed attempts on non-existent emails)';

-- =====================================================
-- PART 5: Record Migration
-- =====================================================

INSERT INTO system.schema_migrations (version, description)
VALUES ('005', 'Enhance auth schema with Stripe integration and helper functions')
ON CONFLICT (version) DO NOTHING;

COMMIT;

