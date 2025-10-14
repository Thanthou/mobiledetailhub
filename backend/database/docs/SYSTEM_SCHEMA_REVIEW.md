# System Schema Review

**Generated:** 2025-10-13  
**Database:** ThatSmartSite  
**Schema:** `system`

---

## 📋 Table of Contents
1. [Overview](#overview)
2. [Tables Review](#tables-review)
3. [Issues & Recommendations](#issues--recommendations)
4. [Action Items](#action-items)

---

## Overview

The `system` schema contains **3 tables** for application infrastructure:

| Table | Purpose | Status |
|-------|---------|--------|
| `schema_migrations` | Database version tracking | ✅ Schema file matches DB |
| `system_config` | App settings & feature flags | ✅ Schema file matches DB |
| `health_monitoring` | Performance & SEO tracking | ✅ Schema file matches DB |

---

## Tables Review

### 1. `schema_migrations` ✅

**Purpose:** Track database migration history (version control for database).

**Schema File:** `backend/database/schemas/system/schema_migrations.sql`

**Key Features:**
- ✅ Simple, focused table
- ✅ Primary key on version (prevents duplicates)
- ✅ Timestamp tracking (applied_at)
- ✅ Description field for documentation
- ✅ Index on applied_at for chronological queries

**Columns:**
```sql
version (PK), applied_at, description
```

**Status:** **PERFECT** - Exactly what's needed for migration tracking

**Current Migrations:**
```
v5.0  - Initial schema design
001   - Add tenant_applications table
002   - Add subscriptions table
003   - Add subscription fields to business (superseded by 004)
004   - Separate subscription from business
005   - Enhance auth schema
```

---

### 2. `system_config` ✅

**Purpose:** Centralized application configuration and feature flags.

**Schema File:** `backend/database/schemas/system/system_config.sql`

**Key Features:**
- ✅ Key-value store with typed values
- ✅ Supports multiple data types (string, number, boolean, json)
- ✅ Public/private flag for frontend exposure
- ✅ Encryption flag for sensitive data
- ✅ Unique constraint on config_key
- ✅ Good indexing (key, type, is_public)
- ✅ Auto-update trigger for updated_at
- ✅ Check constraint on config_type
- ✅ Comprehensive default configuration

**Columns:**
```sql
id, config_key (unique), config_value, config_type, description,
is_public, is_encrypted, created_at, updated_at
```

**Default Config Values:**
```
app_name                      = 'Multi-Tenant Platform'
app_version                   = '1.0.0'
maintenance_mode              = 'false'
registration_enabled          = 'true'
email_verification_required   = 'true'
max_login_attempts            = '5'
session_timeout_minutes       = '60'
password_min_length           = '8'
feature_flags                 = '{}'
```

**Status:** **EXCELLENT** - Flexible, well-designed configuration system

**Use Cases:**
- Feature flags for gradual rollouts
- Application-wide settings
- Maintenance mode toggling
- Security parameters
- Frontend-accessible public configs

---

### 3. `health_monitoring` ✅

**Purpose:** Track website performance, SEO, and Core Web Vitals for tenant sites.

**Schema File:** `backend/database/schemas/system/health_monitoring.sql`

**Key Features:**
- ✅ Comprehensive PageSpeed Insights integration
- ✅ Core Web Vitals tracking (LCP, FID, CLS, FCP, TTFB)
- ✅ Lighthouse scores (Performance, Accessibility, Best Practices, SEO)
- ✅ Additional metrics (Speed Index, TTI, TBT)
- ✅ Raw data storage as JSONB
- ✅ Optimization opportunities and diagnostics
- ✅ Chrome UX Report (CrUX) data
- ✅ Status flags (healthy, warning, critical, error)
- ✅ Good indexing (tenant, check_type, timestamp, status)
- ✅ View for latest health status per tenant
- ✅ Check constraints on scores and types
- ✅ Comprehensive documentation comments

**Columns:**
```sql
id, tenant_slug, check_type, url,
overall_score, performance_score, accessibility_score, best_practices_score, seo_score,
strategy, lcp_value, lcp_score, fid_value, fid_score, cls_value, cls_score,
fcp_value, fcp_score, ttfb_value, ttfb_score, speed_index_value, speed_index_score,
interactive_value, interactive_score, total_blocking_time_value, total_blocking_time_score,
raw_data, opportunities, diagnostics, crux_data,
status, error_message, checked_at, created_at, updated_at
```

**Status:** **EXCELLENT** - Production-ready for health monitoring dashboard

**Use Cases:**
- Automated PageSpeed monitoring
- SEO performance tracking
- Core Web Vitals alerts
- Tenant performance reports
- Optimization recommendations
- Historical performance trends

**View:** `latest_health_status` - Returns most recent check per tenant/type

---

## Issues & Recommendations

### 🔴 Critical Issues

**None** - All tables are well-designed and functional.

---

### ⚠️ Medium Priority

#### 1. **`health_monitoring` Missing Foreign Key to Tenants**

**Issue:** `tenant_slug` is just a string, not a foreign key to `tenants.business`.

**Current:**
```sql
tenant_slug VARCHAR(255) NOT NULL  -- No FK constraint
```

**Recommendation:**
```sql
-- Add foreign key to ensure data integrity
ALTER TABLE system.health_monitoring
  ADD COLUMN business_id INTEGER;

-- Populate from tenant_slug
UPDATE system.health_monitoring h
SET business_id = b.id
FROM tenants.business b
WHERE h.tenant_slug = b.slug;

-- Add foreign key constraint
ALTER TABLE system.health_monitoring
  ADD CONSTRAINT fk_health_monitoring_business_id
  FOREIGN KEY (business_id)
  REFERENCES tenants.business(id)
  ON DELETE CASCADE;

-- Keep tenant_slug for backward compatibility (for now)
-- Eventually can remove tenant_slug and use business_id exclusively
```

**Why:** 
- Prevents orphaned monitoring records
- Automatic cleanup when tenant is deleted
- Better query performance with integer joins

---

#### 2. **Missing Data Retention Policy**

**Issue:** Health monitoring data grows infinitely (no automatic cleanup).

**Impact:** Table will grow large over time, slowing down queries.

**Recommendation:** Add cleanup function:

```sql
-- Cleanup old health monitoring data (keep last 90 days)
CREATE OR REPLACE FUNCTION system.cleanup_old_health_data()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM system.health_monitoring 
    WHERE checked_at < CURRENT_TIMESTAMP - INTERVAL '90 days';
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Schedule this to run weekly (if using pg_cron)
-- SELECT cron.schedule('cleanup-health-data', '0 2 * * 0', 'SELECT system.cleanup_old_health_data();');
```

---

#### 3. **System Config Should Have Default App Name**

**Issue:** Default config says "Multi-Tenant Platform" instead of "ThatSmartSite".

**Current:**
```sql
('app_name', 'Multi-Tenant Platform', 'string', 'Application name', true)
```

**Recommendation:**
```sql
UPDATE system.system_config 
SET config_value = 'ThatSmartSite' 
WHERE config_key = 'app_name';
```

---

### 💡 Optimization Opportunities

#### 1. **Add Helper Functions for System Config**

```sql
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
    DO UPDATE SET config_value = p_value, updated_at = CURRENT_TIMESTAMP;
END;
$$ LANGUAGE plpgsql;

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
    
    enabled := COALESCE((feature_flags->>p_feature_name)::BOOLEAN, false);
    RETURN enabled;
END;
$$ LANGUAGE plpgsql;
```

---

#### 2. **Add Composite Indexes for Common Queries**

```sql
-- Latest health check per tenant
CREATE INDEX IF NOT EXISTS idx_health_monitoring_tenant_checked 
  ON system.health_monitoring(tenant_slug, checked_at DESC);

-- Performance issues (low scores)
CREATE INDEX IF NOT EXISTS idx_health_monitoring_performance 
  ON system.health_monitoring(performance_score) 
  WHERE performance_score < 50;

-- SEO issues (low scores)
CREATE INDEX IF NOT EXISTS idx_health_monitoring_seo 
  ON system.health_monitoring(seo_score) 
  WHERE seo_score < 50;
```

---

#### 3. **Add View for Tenant Health Dashboard**

```sql
CREATE OR REPLACE VIEW system.tenant_health_summary AS
SELECT 
    h.tenant_slug,
    b.business_name,
    AVG(h.performance_score) as avg_performance,
    AVG(h.seo_score) as avg_seo,
    AVG(h.accessibility_score) as avg_accessibility,
    AVG(h.overall_score) as avg_overall,
    COUNT(*) as total_checks,
    MAX(h.checked_at) as last_checked,
    CASE 
        WHEN AVG(h.overall_score) >= 90 THEN 'excellent'
        WHEN AVG(h.overall_score) >= 70 THEN 'good'
        WHEN AVG(h.overall_score) >= 50 THEN 'needs_improvement'
        ELSE 'poor'
    END as health_rating
FROM system.health_monitoring h
LEFT JOIN tenants.business b ON h.tenant_slug = b.slug
WHERE h.checked_at > CURRENT_TIMESTAMP - INTERVAL '30 days'
GROUP BY h.tenant_slug, b.business_name
ORDER BY avg_overall DESC;
```

---

#### 4. **Add Migration Helpers**

```sql
-- Get list of applied migrations
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
```

---

## Action Items

### Priority 1 (Do Now)
- [ ] Update `app_name` config to "ThatSmartSite"
- [ ] Consider adding FK from `health_monitoring` to `tenants.business`

### Priority 2 (Do Soon)
- [ ] Add helper functions for system config operations
- [ ] Add data retention/cleanup function for health monitoring
- [ ] Add composite indexes for common queries

### Priority 3 (Nice to Have)
- [ ] Add views for health dashboard
- [ ] Setup scheduled cleanup job (pg_cron)
- [ ] Add migration helper functions
- [ ] Add encryption for sensitive config values

---

## Summary

**Overall Assessment:** ✅ **EXCELLENT**

The system schema is well-designed with:
- ✅ Clean migration tracking
- ✅ Flexible configuration system
- ✅ Comprehensive health monitoring
- ✅ Good indexing strategy
- ✅ JSONB for flexible data
- ✅ Useful views and constraints
- ✅ Comprehensive documentation

**Minor improvements:**
- ⚠️ Missing FK constraint on health_monitoring
- ⚠️ No data retention policy
- 💡 Could benefit from helper functions

**Use Cases Supported:**
- Database version control
- Feature flags & settings management
- Performance monitoring
- SEO tracking
- Core Web Vitals measurement
- Tenant health dashboards

---

**Next Steps:**
1. Update app_name in config
2. Consider adding helper functions
3. Move to next schema review (customers, reputation, etc.)

