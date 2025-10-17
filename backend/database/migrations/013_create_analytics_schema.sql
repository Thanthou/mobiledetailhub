-- Create analytics schema for Google Analytics and other analytics integrations
-- Migration: 013_create_analytics_schema.sql

-- Create the analytics schema
CREATE SCHEMA IF NOT EXISTS analytics;

-- Create Google Analytics tokens table
CREATE TABLE IF NOT EXISTS analytics.google_analytics_tokens (
    id SERIAL PRIMARY KEY,
    tenant_id INTEGER NOT NULL,
    access_token TEXT NOT NULL,
    refresh_token TEXT,
    property_id VARCHAR(255) NOT NULL,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign key constraint
    CONSTRAINT fk_ga_tokens_tenant_id 
        FOREIGN KEY (tenant_id) 
        REFERENCES tenants.business(id) 
        ON DELETE CASCADE
);

-- Create unique constraint to ensure one token set per tenant
CREATE UNIQUE INDEX IF NOT EXISTS idx_ga_tokens_tenant_unique 
    ON analytics.google_analytics_tokens(tenant_id);

-- Create index for performance on tenant_id lookups
CREATE INDEX IF NOT EXISTS idx_ga_tokens_tenant_id 
    ON analytics.google_analytics_tokens(tenant_id);

-- Create index for expired token cleanup
CREATE INDEX IF NOT EXISTS idx_ga_tokens_expires_at 
    ON analytics.google_analytics_tokens(expires_at);

-- Create trigger to automatically update updated_at timestamp
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

-- Add comments for documentation
COMMENT ON SCHEMA analytics IS 'Analytics integrations including Google Analytics, Facebook Analytics, etc.';
COMMENT ON TABLE analytics.google_analytics_tokens IS 'OAuth tokens for Google Analytics integration per tenant';
COMMENT ON COLUMN analytics.google_analytics_tokens.tenant_id IS 'Reference to the tenant business record';
COMMENT ON COLUMN analytics.google_analytics_tokens.access_token IS 'Google Analytics API access token';
COMMENT ON COLUMN analytics.google_analytics_tokens.refresh_token IS 'Google Analytics API refresh token for token renewal';
COMMENT ON COLUMN analytics.google_analytics_tokens.property_id IS 'Google Analytics property ID (e.g., accounts/123456789)';
COMMENT ON COLUMN analytics.google_analytics_tokens.expires_at IS 'When the access token expires';
