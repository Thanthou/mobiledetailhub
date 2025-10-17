-- Analytics Schema Migration
-- Creates analytics tables (schema already exists from 1400_create_schemas.sql)

-- Create google_analytics_tokens table
CREATE TABLE IF NOT EXISTS analytics.google_analytics_tokens (
    id SERIAL PRIMARY KEY,
    tenant_id INTEGER NOT NULL,
    access_token TEXT NOT NULL,
    refresh_token TEXT,
    property_id VARCHAR(255),
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_analytics_tokens_tenant_id ON analytics.google_analytics_tokens(tenant_id);
CREATE INDEX IF NOT EXISTS idx_analytics_tokens_expires_at ON analytics.google_analytics_tokens(expires_at);

-- ROLLBACK:
-- DROP SCHEMA IF EXISTS analytics CASCADE;
