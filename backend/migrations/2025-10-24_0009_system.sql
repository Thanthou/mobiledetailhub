-- System Schema Migration
-- Migration: 2025-10-24_0009_system
-- Purpose: Create system tables (schema created in 0001_create_schemas.sql)

-- Drop existing system tables if they exist (to ensure clean migration)
DROP TABLE IF EXISTS system.error_logs CASCADE;
DROP TABLE IF EXISTS system.health_monitoring CASCADE;
DROP TABLE IF EXISTS system.audit_logs CASCADE;
DROP TABLE IF EXISTS system.logs CASCADE;
DROP TABLE IF EXISTS system.settings CASCADE;

-- Create system_settings table
CREATE TABLE system.settings (
    id SERIAL PRIMARY KEY,
    tenant_id INTEGER,
    setting_key VARCHAR(255) NOT NULL,
    setting_value TEXT,
    setting_type VARCHAR(50) DEFAULT 'string',
    is_encrypted BOOLEAN DEFAULT FALSE,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(tenant_id, setting_key)
);

-- Create system_logs table
CREATE TABLE system.logs (
    id SERIAL PRIMARY KEY,
    tenant_id INTEGER,
    level VARCHAR(20) NOT NULL,
    message TEXT NOT NULL,
    context JSONB DEFAULT '{}'::jsonb,
    user_id INTEGER,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create system_audit_logs table
CREATE TABLE system.audit_logs (
    id SERIAL PRIMARY KEY,
    tenant_id INTEGER,
    user_id INTEGER,
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50) NOT NULL,
    resource_id INTEGER,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create error_logs table for unified error tracking
CREATE TABLE system.error_logs (
    id SERIAL PRIMARY KEY,
    error_code VARCHAR(100) NOT NULL,
    error_message TEXT NOT NULL,
    error_category VARCHAR(50) NOT NULL CHECK (error_category IN (
        'authentication', 'authorization', 'validation', 'database', 
        'network', 'business_logic', 'system', 'security', 'performance', 'user_input'
    )),
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    tenant_id VARCHAR(50),
    user_id VARCHAR(50),
    correlation_id VARCHAR(100),
    request_id VARCHAR(100),
    metadata JSONB,
    stack_trace TEXT,
    user_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create health_monitoring table with SEO audit tracking
CREATE TABLE system.health_monitoring (
    id SERIAL PRIMARY KEY,
    tenant_slug VARCHAR(255),
    check_type VARCHAR(50) NOT NULL,
    url TEXT,
    status VARCHAR(20) NOT NULL,
    response_time_ms INTEGER,
    status_code INTEGER,
    seo_score INTEGER CHECK (seo_score >= 0 AND seo_score <= 100),
    error_message TEXT,
    checked_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    -- SEO-specific fields
    lighthouse_main_score INTEGER CHECK (lighthouse_main_score >= 0 AND lighthouse_main_score <= 100),
    lighthouse_tenant_score INTEGER CHECK (lighthouse_tenant_score >= 0 AND lighthouse_tenant_score <= 100),
    lighthouse_admin_score INTEGER CHECK (lighthouse_admin_score >= 0 AND lighthouse_admin_score <= 100),
    lighthouse_avg_score INTEGER CHECK (lighthouse_avg_score >= 0 AND lighthouse_avg_score <= 100),
    schema_validation_score INTEGER CHECK (schema_validation_score >= 0 AND schema_validation_score <= 100),
    schema_total_count INTEGER DEFAULT 0,
    schema_valid_count INTEGER DEFAULT 0,
    schema_error_count INTEGER DEFAULT 0,
    schema_warning_count INTEGER DEFAULT 0,
    schema_types_covered TEXT[],
    meta_tags_complete BOOLEAN DEFAULT FALSE,
    analytics_detected BOOLEAN DEFAULT FALSE,
    sitemap_found BOOLEAN DEFAULT FALSE,
    robots_txt_found BOOLEAN DEFAULT FALSE,
    audit_source VARCHAR(50) DEFAULT 'manual',
    audit_metadata JSONB DEFAULT '{}'::jsonb
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_settings_tenant_id ON system.settings(tenant_id);
CREATE INDEX IF NOT EXISTS idx_settings_key ON system.settings(setting_key);
CREATE INDEX IF NOT EXISTS idx_logs_tenant_id ON system.logs(tenant_id);
CREATE INDEX IF NOT EXISTS idx_logs_level ON system.logs(level);
CREATE INDEX IF NOT EXISTS idx_logs_created_at ON system.logs(created_at);
CREATE INDEX IF NOT EXISTS idx_audit_logs_tenant_id ON system.audit_logs(tenant_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON system.audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON system.audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON system.audit_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_error_logs_created_at ON system.error_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_error_logs_tenant_id ON system.error_logs(tenant_id);
CREATE INDEX IF NOT EXISTS idx_error_logs_user_id ON system.error_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_error_logs_correlation_id ON system.error_logs(correlation_id);
CREATE INDEX IF NOT EXISTS idx_error_logs_error_code ON system.error_logs(error_code);
CREATE INDEX IF NOT EXISTS idx_error_logs_category ON system.error_logs(error_category);
CREATE INDEX IF NOT EXISTS idx_error_logs_severity ON system.error_logs(severity);
CREATE INDEX IF NOT EXISTS idx_error_logs_tenant_created ON system.error_logs(tenant_id, created_at);
CREATE INDEX IF NOT EXISTS idx_error_logs_category_severity ON system.error_logs(error_category, severity);
CREATE INDEX IF NOT EXISTS idx_health_monitoring_audit_source ON system.health_monitoring(audit_source);
CREATE INDEX IF NOT EXISTS idx_health_monitoring_lighthouse_avg ON system.health_monitoring(lighthouse_avg_score DESC NULLS LAST);

-- Add comments
COMMENT ON TABLE system.error_logs IS 'Stores structured error information for monitoring and analysis';
COMMENT ON COLUMN system.error_logs.error_code IS 'Unique error code identifier';
COMMENT ON COLUMN system.error_logs.error_message IS 'Technical error message';
COMMENT ON COLUMN system.error_logs.error_category IS 'Category of error (authentication, validation, etc.)';
COMMENT ON COLUMN system.error_logs.severity IS 'Error severity level (low, medium, high, critical)';
COMMENT ON COLUMN system.error_logs.tenant_id IS 'Tenant ID if error is tenant-specific';
COMMENT ON COLUMN system.error_logs.user_id IS 'User ID if error is user-specific';
COMMENT ON COLUMN system.error_logs.correlation_id IS 'Request correlation ID for tracing';
COMMENT ON COLUMN system.error_logs.request_id IS 'Request ID for tracing';
COMMENT ON COLUMN system.error_logs.metadata IS 'Additional error metadata as JSON';
COMMENT ON COLUMN system.error_logs.stack_trace IS 'Error stack trace';
COMMENT ON COLUMN system.error_logs.user_message IS 'User-friendly error message';
COMMENT ON COLUMN system.health_monitoring.lighthouse_main_score IS 'Lighthouse SEO score for main-site app (0-100)';
COMMENT ON COLUMN system.health_monitoring.lighthouse_tenant_score IS 'Lighthouse SEO score for tenant-app (0-100)';
COMMENT ON COLUMN system.health_monitoring.lighthouse_admin_score IS 'Lighthouse SEO score for admin-app (0-100)';
COMMENT ON COLUMN system.health_monitoring.lighthouse_avg_score IS 'Average Lighthouse score across all apps (0-100)';
COMMENT ON COLUMN system.health_monitoring.schema_validation_score IS 'JSON-LD schema validation quality score (0-100)';
COMMENT ON COLUMN system.health_monitoring.schema_total_count IS 'Total number of JSON-LD schemas found';
COMMENT ON COLUMN system.health_monitoring.schema_valid_count IS 'Number of valid JSON-LD schemas';
COMMENT ON COLUMN system.health_monitoring.schema_error_count IS 'Number of critical schema errors';
COMMENT ON COLUMN system.health_monitoring.schema_warning_count IS 'Number of schema warnings (missing recommended fields)';
COMMENT ON COLUMN system.health_monitoring.schema_types_covered IS 'Array of schema types found (LocalBusiness, Organization, etc.)';
COMMENT ON COLUMN system.health_monitoring.meta_tags_complete IS 'Whether all pages have title and description tags';
COMMENT ON COLUMN system.health_monitoring.analytics_detected IS 'Whether Google Analytics/GTM was found';
COMMENT ON COLUMN system.health_monitoring.sitemap_found IS 'Whether sitemap.xml exists';
COMMENT ON COLUMN system.health_monitoring.robots_txt_found IS 'Whether robots.txt exists';
COMMENT ON COLUMN system.health_monitoring.audit_source IS 'Source of audit (automated, manual, ci/cd)';
COMMENT ON COLUMN system.health_monitoring.audit_metadata IS 'Additional audit context and metadata (JSONB)';

-- Create view for latest SEO audit results
CREATE OR REPLACE VIEW system.latest_seo_audits AS
SELECT DISTINCT ON (tenant_slug, check_type)
    id,
    tenant_slug,
    check_type,
    url,
    seo_score,
    lighthouse_main_score,
    lighthouse_tenant_score,
    lighthouse_admin_score,
    lighthouse_avg_score,
    schema_validation_score,
    schema_total_count,
    schema_valid_count,
    schema_error_count,
    schema_warning_count,
    schema_types_covered,
    meta_tags_complete,
    analytics_detected,
    sitemap_found,
    robots_txt_found,
    audit_source,
    checked_at,
    created_at
FROM system.health_monitoring
WHERE check_type = 'seo'
ORDER BY tenant_slug, check_type, checked_at DESC;

COMMENT ON VIEW system.latest_seo_audits IS 'Latest SEO audit results per tenant (excludes historical data for cleaner queries)';

-- ROLLBACK:
-- DROP SCHEMA IF EXISTS system CASCADE;

