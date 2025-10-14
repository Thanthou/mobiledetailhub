-- auth.login_attempts table definition

CREATE TABLE IF NOT EXISTS auth.login_attempts (
  id INTEGER(32) NOT NULL DEFAULT nextval('auth.login_attempts_id_seq'::regclass),
  email VARCHAR(255) NOT NULL,
  ip_address INET NOT NULL,
  user_agent TEXT,
  success BOOLEAN NOT NULL,
  failure_reason VARCHAR(100),
  attempted_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  location_data JSONB DEFAULT '{}'::jsonb,
  user_id INTEGER(32),
  PRIMARY KEY (id)
);

-- Foreign Keys
ALTER TABLE auth.login_attempts
  ADD CONSTRAINT fk_login_attempts_user_id
  FOREIGN KEY (user_id)
  REFERENCES auth.users(id);

-- Indexes
CREATE INDEX idx_login_attempts_attempted_at ON auth.login_attempts USING btree (attempted_at);
CREATE INDEX idx_login_attempts_email ON auth.login_attempts USING btree (email);
CREATE INDEX idx_login_attempts_email_recent ON auth.login_attempts USING btree (email, attempted_at DESC) WHERE (success = false);
CREATE INDEX idx_login_attempts_ip_address ON auth.login_attempts USING btree (ip_address);
CREATE INDEX idx_login_attempts_success ON auth.login_attempts USING btree (success);
CREATE INDEX idx_login_attempts_user_id ON auth.login_attempts USING btree (user_id);

-- Table created: 2025-10-13T19:26:01.097Z
-- Extracted from database
