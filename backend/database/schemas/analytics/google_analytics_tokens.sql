-- analytics.google_analytics_tokens table definition

CREATE TABLE IF NOT EXISTS analytics.google_analytics_tokens (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  property_id VARCHAR(255) NOT NULL,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Foreign key constraint
ALTER TABLE analytics.google_analytics_tokens 
ADD CONSTRAINT fk_ga_tokens_tenant_id 
FOREIGN KEY (tenant_id) 
REFERENCES tenants.business(id) 
ON DELETE CASCADE;

-- Indexes
CREATE UNIQUE INDEX IF NOT EXISTS idx_ga_tokens_tenant_unique ON analytics.google_analytics_tokens(tenant_id);
CREATE INDEX IF NOT EXISTS idx_ga_tokens_tenant_id ON analytics.google_analytics_tokens(tenant_id);
CREATE INDEX IF NOT EXISTS idx_ga_tokens_expires_at ON analytics.google_analytics_tokens(expires_at);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION analytics.update_ga_tokens_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_ga_tokens_updated_at
    BEFORE UPDATE ON analytics.google_analytics_tokens
    FOR EACH ROW
    EXECUTE FUNCTION analytics.update_ga_tokens_updated_at();

-- Table created: 2025-01-XX
-- Extracted from database
