-- System Schema Migration
-- Creates system tables (schema already exists from 1400_create_schemas.sql)

-- Drop existing system tables if they exist (to ensure clean migration)
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

-- ROLLBACK:
-- DROP SCHEMA IF EXISTS system CASCADE;
