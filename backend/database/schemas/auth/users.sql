-- Users table for authentication and user management
DROP TABLE IF EXISTS auth.users CASCADE;

CREATE TABLE auth.users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    email_verified BOOLEAN DEFAULT false,
    email_verification_token VARCHAR(255),
    email_verification_expires_at TIMESTAMP WITH TIME ZONE,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    phone_verified BOOLEAN DEFAULT false,
    password_hash VARCHAR(255) NOT NULL,
    password_reset_token VARCHAR(255),
    password_reset_expires_at TIMESTAMP WITH TIME ZONE,
    is_admin BOOLEAN DEFAULT false,
    account_status VARCHAR(20) DEFAULT 'active', -- active, suspended, disabled
    last_login_at TIMESTAMP WITH TIME ZONE,
    last_login_ip INET,
    failed_login_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMP WITH TIME ZONE,
    two_factor_enabled BOOLEAN DEFAULT false,
    two_factor_secret VARCHAR(255),
    two_factor_backup_codes JSONB DEFAULT '[]',
    profile_data JSONB DEFAULT '{}',
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON auth.users(email);
CREATE INDEX IF NOT EXISTS idx_users_email_verification_token ON auth.users(email_verification_token);
CREATE INDEX IF NOT EXISTS idx_users_password_reset_token ON auth.users(password_reset_token);
CREATE INDEX IF NOT EXISTS idx_users_phone ON auth.users(phone);
CREATE INDEX IF NOT EXISTS idx_users_is_admin ON auth.users(is_admin);
CREATE INDEX IF NOT EXISTS idx_users_account_status ON auth.users(account_status);
CREATE INDEX IF NOT EXISTS idx_users_last_login_at ON auth.users(last_login_at);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON auth.users(created_at);

-- Create trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION auth.update_users_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_users_updated_at
    BEFORE UPDATE ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION auth.update_users_updated_at();

-- Add constraints
ALTER TABLE auth.users ADD CONSTRAINT chk_account_status 
    CHECK (account_status IN ('active', 'suspended', 'disabled'));

ALTER TABLE auth.users ADD CONSTRAINT chk_failed_login_attempts 
    CHECK (failed_login_attempts >= 0);
