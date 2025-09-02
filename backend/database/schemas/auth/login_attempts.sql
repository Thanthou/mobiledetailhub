-- Login attempts table for security monitoring
DROP TABLE IF EXISTS auth.login_attempts CASCADE;

CREATE TABLE auth.login_attempts (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    ip_address INET NOT NULL,
    user_agent TEXT,
    success BOOLEAN NOT NULL,
    failure_reason VARCHAR(100), -- wrong_password, user_not_found, account_locked, etc.
    attempted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    location_data JSONB DEFAULT '{}' -- Country, city, etc.
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_login_attempts_email ON auth.login_attempts(email);
CREATE INDEX IF NOT EXISTS idx_login_attempts_ip_address ON auth.login_attempts(ip_address);
CREATE INDEX IF NOT EXISTS idx_login_attempts_success ON auth.login_attempts(success);
CREATE INDEX IF NOT EXISTS idx_login_attempts_attempted_at ON auth.login_attempts(attempted_at);

-- Add constraints
ALTER TABLE auth.login_attempts ADD CONSTRAINT chk_failure_reason 
    CHECK (failure_reason IN ('wrong_password', 'user_not_found', 'account_locked', 'email_not_verified', 'account_disabled', 'rate_limited'));
