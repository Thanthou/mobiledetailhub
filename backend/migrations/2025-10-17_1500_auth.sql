-- Auth Schema Migration
-- Creates auth schema and all its tables

-- Create schema
CREATE SCHEMA IF NOT EXISTS auth;

-- Create users table
CREATE TABLE IF NOT EXISTS auth.users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    email_verified BOOLEAN DEFAULT FALSE,
    email_verification_token VARCHAR(255),
    email_verification_expires_at TIMESTAMPTZ,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    phone_verified BOOLEAN DEFAULT FALSE,
    password_hash VARCHAR(255),
    password_reset_token VARCHAR(255),
    password_reset_expires_at TIMESTAMPTZ,
    is_admin BOOLEAN DEFAULT FALSE,
    account_status VARCHAR(20) DEFAULT 'active',
    last_login_at TIMESTAMPTZ,
    last_login_ip INET,
    failed_login_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMPTZ,
    two_factor_enabled BOOLEAN DEFAULT FALSE,
    two_factor_secret VARCHAR(255),
    two_factor_backup_codes JSONB DEFAULT '[]'::jsonb,
    profile_data JSONB DEFAULT '{}'::jsonb,
    preferences JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    stripe_customer_id VARCHAR(255)
);

-- Create login_attempts table
CREATE TABLE IF NOT EXISTS auth.login_attempts (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    ip_address INET NOT NULL,
    user_agent TEXT,
    success BOOLEAN NOT NULL,
    failure_reason VARCHAR(100),
    attempted_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    location_data JSONB DEFAULT '{}'::jsonb,
    user_id INTEGER REFERENCES auth.users(id)
);

-- Create password_setup_tokens table
CREATE TABLE IF NOT EXISTS auth.password_setup_tokens (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES auth.users(id),
    token_hash VARCHAR(255) NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    used_at TIMESTAMPTZ,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create refresh_tokens table
CREATE TABLE IF NOT EXISTS auth.refresh_tokens (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES auth.users(id),
    token_hash VARCHAR(255) NOT NULL,
    token_family VARCHAR(255) NOT NULL,
    token_type VARCHAR(20) DEFAULT 'refresh',
    user_agent TEXT,
    ip_address INET,
    device_id VARCHAR(255),
    device_fingerprint VARCHAR(255),
    location_data JSONB DEFAULT '{}'::jsonb,
    expires_at TIMESTAMPTZ NOT NULL,
    revoked_at TIMESTAMPTZ,
    revoked_reason VARCHAR(100),
    is_revoked BOOLEAN DEFAULT FALSE,
    is_rotated BOOLEAN DEFAULT FALSE,
    parent_token_id INTEGER REFERENCES auth.refresh_tokens(id),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create user_sessions table
CREATE TABLE IF NOT EXISTS auth.user_sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES auth.users(id),
    session_token VARCHAR(255) NOT NULL UNIQUE,
    refresh_token_id INTEGER REFERENCES auth.refresh_tokens(id),
    ip_address INET,
    user_agent TEXT,
    device_id VARCHAR(255),
    device_fingerprint VARCHAR(255),
    location_data JSONB DEFAULT '{}'::jsonb,
    is_active BOOLEAN DEFAULT TRUE,
    last_activity_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON auth.users(email);
CREATE INDEX IF NOT EXISTS idx_users_stripe_customer_id ON auth.users(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_login_attempts_email ON auth.login_attempts(email);
CREATE INDEX IF NOT EXISTS idx_login_attempts_ip ON auth.login_attempts(ip_address);
CREATE INDEX IF NOT EXISTS idx_password_tokens_user_id ON auth.password_setup_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_password_tokens_expires_at ON auth.password_setup_tokens(expires_at);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user_id ON auth.refresh_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_family ON auth.refresh_tokens(token_family);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON auth.user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON auth.user_sessions(session_token);

-- ROLLBACK:
-- DROP SCHEMA IF EXISTS auth CASCADE;
