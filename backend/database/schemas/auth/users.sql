-- auth.users table definition

CREATE TABLE IF NOT EXISTS auth.users (
  id INTEGER(32) NOT NULL DEFAULT nextval('auth.users_id_seq'::regclass),
  email VARCHAR(255) NOT NULL,
  email_verified BOOLEAN DEFAULT false,
  email_verification_token VARCHAR(255),
  email_verification_expires_at TIMESTAMPTZ,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  phone_verified BOOLEAN DEFAULT false,
  password_hash VARCHAR(255) NOT NULL,
  password_reset_token VARCHAR(255),
  password_reset_expires_at TIMESTAMPTZ,
  is_admin BOOLEAN DEFAULT false,
  account_status VARCHAR(20) DEFAULT 'active'::character varying,
  last_login_at TIMESTAMPTZ,
  last_login_ip INET,
  failed_login_attempts INTEGER(32) DEFAULT 0,
  locked_until TIMESTAMPTZ,
  two_factor_enabled BOOLEAN DEFAULT false,
  two_factor_secret VARCHAR(255),
  two_factor_backup_codes JSONB DEFAULT '[]'::jsonb,
  profile_data JSONB DEFAULT '{}'::jsonb,
  preferences JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  stripe_customer_id VARCHAR(255),
  PRIMARY KEY (id)
);
-- Indexes
CREATE INDEX idx_users_account_status ON auth.users USING btree (account_status);
CREATE INDEX idx_users_created_at ON auth.users USING btree (created_at);
CREATE INDEX idx_users_email ON auth.users USING btree (email);
CREATE INDEX idx_users_email_verification_token ON auth.users USING btree (email_verification_token);
CREATE INDEX idx_users_is_admin ON auth.users USING btree (is_admin);
CREATE INDEX idx_users_last_login_at ON auth.users USING btree (last_login_at);
CREATE INDEX idx_users_password_reset_token ON auth.users USING btree (password_reset_token);
CREATE INDEX idx_users_phone ON auth.users USING btree (phone);
CREATE INDEX idx_users_status_created ON auth.users USING btree (account_status, created_at DESC);
CREATE INDEX idx_users_stripe_customer_id ON auth.users USING btree (stripe_customer_id);
CREATE UNIQUE INDEX users_email_key ON auth.users USING btree (email);
CREATE UNIQUE INDEX users_stripe_customer_id_key ON auth.users USING btree (stripe_customer_id);

-- Table created: 2025-10-13T19:26:01.086Z
-- Extracted from database
