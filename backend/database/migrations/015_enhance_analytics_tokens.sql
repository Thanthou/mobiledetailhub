-- Enhance analytics tokens table to support multiple Google services
-- Migration: 015_enhance_analytics_tokens.sql

-- Add columns for different service types
ALTER TABLE analytics.google_analytics_tokens 
ADD COLUMN IF NOT EXISTS service_type VARCHAR(50) DEFAULT 'analytics',
ADD COLUMN IF NOT EXISTS scopes TEXT[],
ADD COLUMN IF NOT EXISTS business_profile_id VARCHAR(255);

-- Add index for service type lookups
CREATE INDEX IF NOT EXISTS idx_ga_tokens_service_type 
ON analytics.google_analytics_tokens(tenant_id, service_type);

-- Update the table comment
COMMENT ON TABLE analytics.google_analytics_tokens IS 'OAuth tokens for Google services integration per tenant (Analytics, Business Profile, etc.)';
COMMENT ON COLUMN analytics.google_analytics_tokens.service_type IS 'Type of Google service (analytics, business_profile, etc.)';
COMMENT ON COLUMN analytics.google_analytics_tokens.scopes IS 'Array of OAuth scopes granted';
COMMENT ON COLUMN analytics.google_analytics_tokens.business_profile_id IS 'Google Business Profile ID if applicable';
