-- Add Enhanced SEO Audit Tracking to health_monitoring
-- Migration: 2025-10-19_add_seo_audit_tracking
-- Purpose: Track detailed SEO audit results from audit-seo.js

-- Add new columns for detailed SEO tracking
DO $$ 
BEGIN
    -- Check if columns don't already exist before adding them
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'system' 
                   AND table_name = 'health_monitoring' 
                   AND column_name = 'lighthouse_main_score') THEN
        
        ALTER TABLE system.health_monitoring
        ADD COLUMN lighthouse_main_score INTEGER CHECK (lighthouse_main_score >= 0 AND lighthouse_main_score <= 100),
        ADD COLUMN lighthouse_tenant_score INTEGER CHECK (lighthouse_tenant_score >= 0 AND lighthouse_tenant_score <= 100),
        ADD COLUMN lighthouse_admin_score INTEGER CHECK (lighthouse_admin_score >= 0 AND lighthouse_admin_score <= 100),
        ADD COLUMN lighthouse_avg_score INTEGER CHECK (lighthouse_avg_score >= 0 AND lighthouse_avg_score <= 100),
        ADD COLUMN schema_validation_score INTEGER CHECK (schema_validation_score >= 0 AND schema_validation_score <= 100),
        ADD COLUMN schema_total_count INTEGER DEFAULT 0,
        ADD COLUMN schema_valid_count INTEGER DEFAULT 0,
        ADD COLUMN schema_error_count INTEGER DEFAULT 0,
        ADD COLUMN schema_warning_count INTEGER DEFAULT 0,
        ADD COLUMN schema_types_covered TEXT[],
        ADD COLUMN meta_tags_complete BOOLEAN DEFAULT FALSE,
        ADD COLUMN analytics_detected BOOLEAN DEFAULT FALSE,
        ADD COLUMN sitemap_found BOOLEAN DEFAULT FALSE,
        ADD COLUMN robots_txt_found BOOLEAN DEFAULT FALSE,
        ADD COLUMN audit_source VARCHAR(50) DEFAULT 'manual',
        ADD COLUMN audit_metadata JSONB DEFAULT '{}'::jsonb;
        
        -- Add comment to explain new columns
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
        
        -- Create index for SEO audit queries
        CREATE INDEX IF NOT EXISTS idx_health_monitoring_audit_source 
        ON system.health_monitoring(audit_source);
        
        CREATE INDEX IF NOT EXISTS idx_health_monitoring_lighthouse_avg 
        ON system.health_monitoring(lighthouse_avg_score DESC NULLS LAST);
        
        RAISE NOTICE 'Added SEO audit tracking columns to health_monitoring table';
    ELSE
        RAISE NOTICE 'SEO audit columns already exist in health_monitoring table';
    END IF;
END $$;

-- Create a view for latest SEO audit results
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

