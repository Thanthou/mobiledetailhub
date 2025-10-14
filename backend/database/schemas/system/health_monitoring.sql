-- system.health_monitoring table definition

CREATE TABLE IF NOT EXISTS system.health_monitoring (
  id INTEGER(32) NOT NULL DEFAULT nextval('system.health_monitoring_id_seq'::regclass),
  tenant_slug VARCHAR(255) NOT NULL,
  check_type VARCHAR(50) NOT NULL,
  url VARCHAR(500) NOT NULL,
  overall_score INTEGER(32),
  performance_score INTEGER(32),
  accessibility_score INTEGER(32),
  best_practices_score INTEGER(32),
  seo_score INTEGER(32),
  strategy VARCHAR(20),
  lcp_value NUMERIC(10,2),
  lcp_score NUMERIC(3,2),
  fid_value NUMERIC(10,2),
  fid_score NUMERIC(3,2),
  cls_value NUMERIC(10,2),
  cls_score NUMERIC(3,2),
  fcp_value NUMERIC(10,2),
  fcp_score NUMERIC(3,2),
  ttfb_value NUMERIC(10,2),
  ttfb_score NUMERIC(3,2),
  speed_index_value NUMERIC(10,2),
  speed_index_score NUMERIC(3,2),
  interactive_value NUMERIC(10,2),
  interactive_score NUMERIC(3,2),
  total_blocking_time_value NUMERIC(10,2),
  total_blocking_time_score NUMERIC(3,2),
  raw_data JSONB,
  opportunities JSONB,
  diagnostics JSONB,
  crux_data JSONB,
  status VARCHAR(20) NOT NULL DEFAULT 'healthy'::character varying,
  error_message TEXT,
  checked_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  business_id INTEGER(32),
  PRIMARY KEY (id)
);
-- Indexes
CREATE INDEX idx_health_monitoring_business_id ON system.health_monitoring USING btree (business_id);
CREATE INDEX idx_health_monitoring_check_type ON system.health_monitoring USING btree (check_type);
CREATE INDEX idx_health_monitoring_checked_at ON system.health_monitoring USING btree (checked_at);
CREATE INDEX idx_health_monitoring_low_performance ON system.health_monitoring USING btree (performance_score) WHERE (performance_score < 50);
CREATE INDEX idx_health_monitoring_low_seo ON system.health_monitoring USING btree (seo_score) WHERE (seo_score < 50);
CREATE INDEX idx_health_monitoring_status ON system.health_monitoring USING btree (status);
CREATE INDEX idx_health_monitoring_tenant_checked ON system.health_monitoring USING btree (tenant_slug, checked_at DESC);
CREATE INDEX idx_health_monitoring_tenant_slug ON system.health_monitoring USING btree (tenant_slug);
CREATE INDEX idx_health_monitoring_tenant_type ON system.health_monitoring USING btree (tenant_slug, check_type);
CREATE INDEX idx_health_monitoring_unhealthy ON system.health_monitoring USING btree (status) WHERE ((status)::text = ANY ((ARRAY['warning'::character varying, 'critical'::character varying, 'error'::character varying])::text[]));

-- Table created: 2025-10-13T19:26:01.108Z
-- Extracted from database
