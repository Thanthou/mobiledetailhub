-- Migration: Improve System Schema
-- Date: 2025-10-13
-- Description: Fix app name, add FK to health_monitoring, add data retention functions

BEGIN;

-- =====================================================
-- PART 1: Fix App Name
-- =====================================================

UPDATE system.system_config 
SET config_value = 'ThatSmartSite',
    description = 'Application name - ThatSmartSite multi-tenant platform'
WHERE config_key = 'app_name';

-- =====================================================
-- PART 2: Add Foreign Key to Health Monitoring
-- =====================================================

-- Add business_id column
ALTER TABLE system.health_monitoring 
  ADD COLUMN IF NOT EXISTS business_id INTEGER;

-- Populate business_id from tenant_slug (for existing records)
UPDATE system.health_monitoring h
SET business_id = b.id
FROM tenants.business b
WHERE h.tenant_slug = b.slug
  AND h.business_id IS NULL;

-- Create index before adding FK (better performance)
CREATE INDEX IF NOT EXISTS idx_health_monitoring_business_id 
  ON system.health_monitoring(business_id);

-- Add foreign key constraint
ALTER TABLE system.health_monitoring
  DROP CONSTRAINT IF EXISTS fk_health_monitoring_business_id;

ALTER TABLE system.health_monitoring
  ADD CONSTRAINT fk_health_monitoring_business_id
  FOREIGN KEY (business_id)
  REFERENCES tenants.business(id)
  ON DELETE CASCADE;

-- Add comment
COMMENT ON COLUMN system.health_monitoring.business_id IS 
  'Foreign key to tenants.business - ensures referential integrity';

-- Note: Keep tenant_slug for now for backward compatibility
-- Can be removed in future migration once all code is updated to use business_id

-- =====================================================
-- PART 3: Add Data Retention Functions
-- =====================================================

-- Cleanup old health monitoring data (keep last 90 days)
CREATE OR REPLACE FUNCTION system.cleanup_old_health_data(
    p_retention_days INTEGER DEFAULT 90
)
RETURNS TABLE(
    deleted_count INTEGER,
    oldest_remaining TIMESTAMP WITH TIME ZONE
) AS $$
DECLARE
    rows_deleted INTEGER;
    oldest_record TIMESTAMP WITH TIME ZONE;
BEGIN
    -- Delete old records
    DELETE FROM system.health_monitoring 
    WHERE checked_at < CURRENT_TIMESTAMP - (p_retention_days || ' days')::INTERVAL;
    
    GET DIAGNOSTICS rows_deleted = ROW_COUNT;
    
    -- Get oldest remaining record
    SELECT MIN(checked_at) INTO oldest_record
    FROM system.health_monitoring;
    
    RETURN QUERY SELECT rows_deleted, oldest_record;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION system.cleanup_old_health_data(INTEGER) IS 
  'Clean up health monitoring records older than specified days (default 90)';

-- =====================================================
-- PART 4: Add System Config Helper Functions
-- =====================================================

-- Get config value by key
CREATE OR REPLACE FUNCTION system.get_config(p_key VARCHAR)
RETURNS TEXT AS $$
DECLARE
    config_value TEXT;
BEGIN
    SELECT c.config_value INTO config_value
    FROM system.system_config c
    WHERE c.config_key = p_key;
    
    RETURN config_value;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION system.get_config(VARCHAR) IS 
  'Get configuration value by key';

-- Set config value
CREATE OR REPLACE FUNCTION system.set_config(
    p_key VARCHAR, 
    p_value TEXT,
    p_type VARCHAR DEFAULT 'string'
)
RETURNS VOID AS $$
BEGIN
    INSERT INTO system.system_config (config_key, config_value, config_type)
    VALUES (p_key, p_value, p_type)
    ON CONFLICT (config_key) 
    DO UPDATE SET 
        config_value = p_value, 
        updated_at = CURRENT_TIMESTAMP;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION system.set_config(VARCHAR, TEXT, VARCHAR) IS 
  'Set configuration value (upsert)';

-- Get public configs (for frontend)
CREATE OR REPLACE FUNCTION system.get_public_configs()
RETURNS TABLE(
    config_key VARCHAR(255),
    config_value TEXT,
    config_type VARCHAR(50)
) AS $$
BEGIN
    RETURN QUERY
    SELECT c.config_key, c.config_value, c.config_type
    FROM system.system_config c
    WHERE c.is_public = true
    ORDER BY c.config_key;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION system.get_public_configs() IS 
  'Get all public configuration values (safe for frontend)';

-- Check if feature is enabled
CREATE OR REPLACE FUNCTION system.is_feature_enabled(p_feature_name VARCHAR)
RETURNS BOOLEAN AS $$
DECLARE
    feature_flags JSONB;
    enabled BOOLEAN;
BEGIN
    SELECT config_value::JSONB INTO feature_flags
    FROM system.system_config
    WHERE config_key = 'feature_flags';
    
    -- Return false if feature_flags not found or feature not defined
    enabled := COALESCE((feature_flags->>p_feature_name)::BOOLEAN, false);
    RETURN enabled;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION system.is_feature_enabled(VARCHAR) IS 
  'Check if a feature flag is enabled';

-- =====================================================
-- PART 5: Add Migration Helper Functions
-- =====================================================

-- Get migration history
CREATE OR REPLACE FUNCTION system.get_migration_history()
RETURNS TABLE(
    version VARCHAR(50),
    description TEXT,
    applied_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT m.version, m.description, m.applied_at
    FROM system.schema_migrations m
    ORDER BY m.applied_at DESC;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION system.get_migration_history() IS 
  'Get list of all applied migrations in chronological order';

-- Check if migration has been applied
CREATE OR REPLACE FUNCTION system.is_migration_applied(p_version VARCHAR)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM system.schema_migrations 
        WHERE version = p_version
    );
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION system.is_migration_applied(VARCHAR) IS 
  'Check if a specific migration version has been applied';

-- =====================================================
-- PART 6: Add Performance Indexes
-- =====================================================

-- Latest health check per tenant
CREATE INDEX IF NOT EXISTS idx_health_monitoring_tenant_checked 
  ON system.health_monitoring(tenant_slug, checked_at DESC);

-- Performance issues (low scores)
CREATE INDEX IF NOT EXISTS idx_health_monitoring_low_performance 
  ON system.health_monitoring(performance_score) 
  WHERE performance_score < 50;

-- SEO issues (low scores)
CREATE INDEX IF NOT EXISTS idx_health_monitoring_low_seo 
  ON system.health_monitoring(seo_score) 
  WHERE seo_score < 50;

-- Overall health issues
CREATE INDEX IF NOT EXISTS idx_health_monitoring_unhealthy 
  ON system.health_monitoring(status) 
  WHERE status IN ('warning', 'critical', 'error');

-- =====================================================
-- PART 7: Add Useful View for Health Summary
-- =====================================================

-- Drop view if exists (to recreate with new schema)
DROP VIEW IF EXISTS system.tenant_health_summary CASCADE;

-- Create tenant health summary view
CREATE OR REPLACE VIEW system.tenant_health_summary AS
SELECT 
    h.tenant_slug,
    h.business_id,
    b.business_name,
    AVG(h.performance_score)::INTEGER as avg_performance,
    AVG(h.seo_score)::INTEGER as avg_seo,
    AVG(h.accessibility_score)::INTEGER as avg_accessibility,
    AVG(h.overall_score)::INTEGER as avg_overall,
    COUNT(*) as total_checks,
    MAX(h.checked_at) as last_checked,
    CASE 
        WHEN AVG(h.overall_score) >= 90 THEN 'excellent'
        WHEN AVG(h.overall_score) >= 70 THEN 'good'
        WHEN AVG(h.overall_score) >= 50 THEN 'needs_improvement'
        ELSE 'poor'
    END as health_rating
FROM system.health_monitoring h
LEFT JOIN tenants.business b ON h.business_id = b.id
WHERE h.checked_at > CURRENT_TIMESTAMP - INTERVAL '30 days'
GROUP BY h.tenant_slug, h.business_id, b.business_name
ORDER BY avg_overall DESC;

COMMENT ON VIEW system.tenant_health_summary IS 
  'Summary of tenant health metrics over the last 30 days';

-- =====================================================
-- PART 8: Record Migration
-- =====================================================

INSERT INTO system.schema_migrations (version, description)
VALUES ('006', 'Improve system schema: fix app name, add FK, add retention functions')
ON CONFLICT (version) DO NOTHING;

COMMIT;

