-- Add health monitoring table to system schema
-- Migration: add_health_monitoring_table.sql

-- Create health monitoring table
CREATE TABLE IF NOT EXISTS system.health_monitoring (
    id SERIAL PRIMARY KEY,
    tenant_slug VARCHAR(255) NOT NULL,
    check_type VARCHAR(50) NOT NULL CHECK (check_type IN ('performance', 'seo', 'security', 'uptime', 'overall')),
    url VARCHAR(500) NOT NULL,
    
    -- Overall scores (0-100)
    overall_score INTEGER CHECK (overall_score >= 0 AND overall_score <= 100),
    performance_score INTEGER CHECK (performance_score >= 0 AND performance_score <= 100),
    accessibility_score INTEGER CHECK (accessibility_score >= 0 AND accessibility_score <= 100),
    best_practices_score INTEGER CHECK (best_practices_score >= 0 AND best_practices_score <= 100),
    seo_score INTEGER CHECK (seo_score >= 0 AND seo_score <= 100),
    
    -- Strategy (mobile/desktop)
    strategy VARCHAR(20) CHECK (strategy IN ('mobile', 'desktop')),
    
    -- Core Web Vitals
    lcp_value DECIMAL(10,2),
    lcp_score DECIMAL(3,2),
    fid_value DECIMAL(10,2),
    fid_score DECIMAL(3,2),
    cls_value DECIMAL(10,2),
    cls_score DECIMAL(3,2),
    fcp_value DECIMAL(10,2),
    fcp_score DECIMAL(3,2),
    ttfb_value DECIMAL(10,2),
    ttfb_score DECIMAL(3,2),
    
    -- Additional metrics
    speed_index_value DECIMAL(10,2),
    speed_index_score DECIMAL(3,2),
    interactive_value DECIMAL(10,2),
    interactive_score DECIMAL(3,2),
    total_blocking_time_value DECIMAL(10,2),
    total_blocking_time_score DECIMAL(3,2),
    
    -- Raw data and details
    raw_data JSONB,
    opportunities JSONB,
    diagnostics JSONB,
    crux_data JSONB,
    
    -- Status and metadata
    status VARCHAR(20) NOT NULL DEFAULT 'healthy' CHECK (status IN ('healthy', 'warning', 'critical', 'error')),
    error_message TEXT,
    
    -- Timestamps
    checked_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_health_monitoring_tenant_slug ON system.health_monitoring(tenant_slug);
CREATE INDEX IF NOT EXISTS idx_health_monitoring_check_type ON system.health_monitoring(check_type);
CREATE INDEX IF NOT EXISTS idx_health_monitoring_checked_at ON system.health_monitoring(checked_at);
CREATE INDEX IF NOT EXISTS idx_health_monitoring_status ON system.health_monitoring(status);
CREATE INDEX IF NOT EXISTS idx_health_monitoring_tenant_type ON system.health_monitoring(tenant_slug, check_type);

-- Create a view for the latest health status per tenant
CREATE OR REPLACE VIEW system.latest_health_status AS
SELECT DISTINCT ON (tenant_slug, check_type)
    tenant_slug,
    check_type,
    url,
    overall_score,
    performance_score,
    accessibility_score,
    best_practices_score,
    seo_score,
    strategy,
    lcp_value,
    lcp_score,
    fid_value,
    fid_score,
    cls_value,
    cls_score,
    fcp_value,
    fcp_score,
    ttfb_value,
    ttfb_score,
    speed_index_value,
    speed_index_score,
    interactive_value,
    interactive_score,
    total_blocking_time_value,
    total_blocking_time_score,
    status,
    error_message,
    checked_at,
    raw_data,
    opportunities,
    diagnostics,
    crux_data
FROM system.health_monitoring
ORDER BY tenant_slug, check_type, checked_at DESC;

-- Add comments to document the purpose of key columns
COMMENT ON TABLE system.health_monitoring IS 'Stores health monitoring data for tenant websites including performance, SEO, and Core Web Vitals';
COMMENT ON COLUMN system.health_monitoring.tenant_slug IS 'The tenant identifier (business slug)';
COMMENT ON COLUMN system.health_monitoring.check_type IS 'Type of health check: performance, seo, security, uptime, overall';
COMMENT ON COLUMN system.health_monitoring.overall_score IS 'Overall health score (0-100) calculated from various metrics';
COMMENT ON COLUMN system.health_monitoring.raw_data IS 'Complete raw data from PageSpeed Insights API';
COMMENT ON COLUMN system.health_monitoring.opportunities IS 'Optimization opportunities from Lighthouse audits';
COMMENT ON COLUMN system.health_monitoring.diagnostics IS 'Diagnostic information from Lighthouse audits';
COMMENT ON COLUMN system.health_monitoring.crux_data IS 'Chrome User Experience Report data';
COMMENT ON COLUMN system.health_monitoring.status IS 'Health status: healthy, warning, critical, error';
