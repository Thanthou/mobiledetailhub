-- System Schema Migration
-- Creates system tables (schema already exists from 1400_create_schemas.sql)

-- Create schema_migrations table
CREATE TABLE IF NOT EXISTS system.schema_migrations (
    id SERIAL PRIMARY KEY,
    filename TEXT UNIQUE NOT NULL,
    applied_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    checksum TEXT,
    rollback_sql TEXT
);

-- Create system_config table
CREATE TABLE IF NOT EXISTS system.system_config (
    id SERIAL PRIMARY KEY,
    config_key VARCHAR(255) NOT NULL UNIQUE,
    config_value TEXT,
    config_type VARCHAR(50) DEFAULT 'string',
    description TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    is_encrypted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create health_monitoring table
CREATE TABLE IF NOT EXISTS system.health_monitoring (
    id SERIAL PRIMARY KEY,
    tenant_slug VARCHAR(255) NOT NULL,
    check_type VARCHAR(50) NOT NULL,
    url VARCHAR(500) NOT NULL,
    overall_score INTEGER,
    performance_score INTEGER,
    accessibility_score INTEGER,
    best_practices_score INTEGER,
    seo_score INTEGER,
    strategy VARCHAR(20),
    lcp_value NUMERIC,
    lcp_score NUMERIC,
    fid_value NUMERIC,
    fid_score NUMERIC,
    cls_value NUMERIC,
    cls_score NUMERIC,
    fcp_value NUMERIC,
    fcp_score NUMERIC,
    ttfb_value NUMERIC,
    ttfb_score NUMERIC,
    speed_index_value NUMERIC,
    speed_index_score NUMERIC,
    interactive_value NUMERIC,
    interactive_score NUMERIC,
    total_blocking_time_value NUMERIC,
    total_blocking_time_score NUMERIC,
    raw_data JSONB,
    opportunities JSONB,
    diagnostics JSONB,
    crux_data JSONB,
    status VARCHAR(20) DEFAULT 'healthy',
    error_message TEXT,
    checked_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    business_id INTEGER
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_schema_migrations_filename ON system.schema_migrations(filename);
CREATE INDEX IF NOT EXISTS idx_schema_migrations_applied_at ON system.schema_migrations(applied_at);
CREATE INDEX IF NOT EXISTS idx_system_config_key ON system.system_config(config_key);
CREATE INDEX IF NOT EXISTS idx_health_monitoring_tenant_slug ON system.health_monitoring(tenant_slug);
CREATE INDEX IF NOT EXISTS idx_health_monitoring_checked_at ON system.health_monitoring(checked_at);

-- ROLLBACK:
-- DROP SCHEMA IF EXISTS system CASCADE;
