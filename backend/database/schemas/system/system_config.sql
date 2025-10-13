-- System configuration table for application settings and feature flags
DROP TABLE IF EXISTS system.system_config CASCADE;

CREATE TABLE system.system_config (
    id SERIAL PRIMARY KEY,
    config_key VARCHAR(255) UNIQUE NOT NULL,
    config_value TEXT,
    config_type VARCHAR(50) DEFAULT 'string', -- string, number, boolean, json
    description TEXT,
    is_public BOOLEAN DEFAULT false, -- Can be exposed to frontend
    is_encrypted BOOLEAN DEFAULT false, -- Sensitive data encryption
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_system_config_key ON system.system_config(config_key);
CREATE INDEX IF NOT EXISTS idx_system_config_type ON system.system_config(config_type);
CREATE INDEX IF NOT EXISTS idx_system_config_is_public ON system.system_config(is_public);

-- Create trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION system.update_system_config_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_system_config_updated_at
    BEFORE UPDATE ON system.system_config
    FOR EACH ROW
    EXECUTE FUNCTION system.update_system_config_updated_at();

-- Add constraints
ALTER TABLE system.system_config ADD CONSTRAINT chk_config_type 
    CHECK (config_type IN ('string', 'number', 'boolean', 'json'));

-- Insert default system configuration
INSERT INTO system.system_config (config_key, config_value, config_type, description, is_public) VALUES
('app_name', 'Multi-Tenant Platform', 'string', 'Application name', true),
('app_version', '1.0.0', 'string', 'Current application version', true),
('maintenance_mode', 'false', 'boolean', 'Enable maintenance mode', false),
('registration_enabled', 'true', 'boolean', 'Allow new user registration', true),
('email_verification_required', 'true', 'boolean', 'Require email verification for new users', false),
('max_login_attempts', '5', 'number', 'Maximum failed login attempts before lockout', false),
('session_timeout_minutes', '60', 'number', 'Session timeout in minutes', false),
('password_min_length', '8', 'number', 'Minimum password length', false),
('feature_flags', '{}', 'json', 'Feature flags for enabling/disabling features', false)
ON CONFLICT (config_key) DO NOTHING;
