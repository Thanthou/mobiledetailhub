# Tenants Schema Review

**Generated:** 2025-10-13  
**Database:** ThatSmartSite  
**Schema:** `tenants`

---

## 📋 Table of Contents
1. [Overview](#overview)
2. [Tables Review](#tables-review)
3. [Issues & Recommendations](#issues--recommendations)
4. [Action Items](#action-items)

---

## Overview

The `tenants` schema contains **6 tables** that manage business/tenant data:

| Table | Purpose | Rows | Status |
|-------|---------|------|--------|
| `tenant_applications` | Onboarding applications (drafts & submissions) | 0 | ✅ Schema file matches DB |
| `subscriptions` | Subscription history & billing tracking | 0 | ✅ Schema file matches DB |
| `business` | Core tenant/business information | ? | ✅ Schema file matches DB |
| `services` | Services offered by each business | ? | ✅ Schema file matches DB |
| `service_tiers` | Pricing tiers for services | ? | ✅ Schema file matches DB |
| `tenant_images` | Gallery & media storage | ? | ⚠️ Minor discrepancy |

---

## Tables Review

### 1. `tenant_applications` ✅

**Purpose:** Tracks tenant onboarding applications before they become active businesses.

**Schema File:** `backend/database/schemas/tenants/tenant_applications.sql`

**Key Features:**
- ✅ Auto-save support via `draft_data` JSONB column
- ✅ Multi-step progress tracking (`current_step`)
- ✅ Stripe integration fields (customer_id, payment_intent_id, subscription_id)
- ✅ UTM tracking for marketing attribution
- ✅ Auto-expire drafts after 30 days
- ✅ Comprehensive indexing (email, status, dates, Stripe IDs)
- ✅ Auto-update trigger for `updated_at` and `last_saved_at`
- ✅ Well-documented with table/column comments

**Status:** **EXCELLENT** - Ready for production use

---

### 2. `subscriptions` ✅

**Purpose:** Tracks subscription history, billing, and plan changes over time.

**Schema File:** `backend/database/schemas/tenants/subscriptions.sql`

**Key Features:**
- ✅ Foreign key to `business(id)` with CASCADE delete
- ✅ Supports trials, plan changes, cancellations
- ✅ Stripe integration (subscription_id, customer_id, price_id)
- ✅ Billing attempt tracking and failed payment counter
- ✅ Cancellation reason tracking (who cancelled, why)
- ✅ Plan change history (previous_plan, change_reason)
- ✅ Helper function: `get_active_subscription(business_id)`
- ✅ Helper function: `calculate_mrr()` for revenue reporting
- ✅ Partial index on `(business_id, status) WHERE status = 'active'` for performance
- ✅ Comprehensive table/column comments

**Status:** **EXCELLENT** - Production-ready with business intelligence features

---

### 3. `business` ✅

**Purpose:** Core tenant/business information (main tenant table).

**Schema File:** `backend/database/schemas/tenants/business.sql`

**Key Features:**
- ✅ Unique `slug` for URL-friendly identifiers
- ✅ Foreign key to `auth.users(id)` with SET NULL
- ✅ Industry categorization
- ✅ Contact info (business + personal)
- ✅ Social media URLs (GBP, Facebook, Instagram, YouTube, TikTok)
- ✅ Subscription info directly on business (starter/pro/enterprise)
- ✅ Billing address fields
- ✅ Service areas as JSONB
- ✅ Application lifecycle tracking (pending → approved → active → suspended → cancelled)
- ✅ Trial period tracking
- ✅ Comprehensive indexing (slug, user_id, industry, status, subscription_status)
- ✅ Auto-update trigger for `updated_at`

**Potential Issue:**
⚠️ **Subscription data duplicated** - `business` table has subscription fields (`selected_plan`, `plan_price_cents`, etc.) AND there's a separate `subscriptions` table. This could lead to data inconsistency.

**Recommendation:**
- **Option A:** Keep current subscription info in `business` table for easy access, use `subscriptions` table for history only
- **Option B:** Remove subscription fields from `business` table, always query `subscriptions` table for current plan
- **Option C:** Create a view that joins the two (best of both worlds)

---

### 4. `services` ✅

**Purpose:** Services offered by each tenant business.

**Schema File:** `backend/database/schemas/tenants/services.sql`

**Key Features:**
- ✅ Foreign key to `business(id)` with CASCADE delete
- ✅ Service categorization (name, description, category, type)
- ✅ Vehicle types support as JSONB array
- ✅ Active/featured flags
- ✅ Sort order for display control
- ✅ Metadata JSONB for extensibility
- ✅ Good indexing (business_id, active, featured, category, sort_order)
- ✅ Auto-update trigger

**Status:** **GOOD** - Well-structured for multi-tenant service management

---

### 5. `service_tiers` ✅

**Purpose:** Pricing tiers for each service (e.g., Basic, Premium, Deluxe).

**Schema File:** `backend/database/schemas/tenants/service_tiers.sql`

**Key Features:**
- ✅ Foreign key to `services(id)` with CASCADE delete
- ✅ Price in cents (prevents floating-point errors)
- ✅ Duration tracking (e.g., 60 minutes)
- ✅ Included services/features as JSONB array
- ✅ Active/featured flags
- ✅ Sort order for display
- ✅ Good indexing (service_id, active, sort_order)
- ✅ Auto-update trigger

**Status:** **GOOD** - Clean pricing tier model

---

### 6. `tenant_images` ⚠️

**Purpose:** Gallery and media storage for tenant businesses.

**Schema File:** `backend/database/schemas/tenants/tenant_images.sql`

**Key Features:**
- ✅ References tenant by `slug` (not `business_id`)
- ✅ File metadata (filename, path, size, mime_type)
- ✅ Image categorization (gallery, hero, logo, before, after)
- ✅ Stock image flag
- ✅ Active status flag
- ✅ Good indexing (slug, category, active, stock)

**Minor Issue:**
⚠️ **No foreign key constraint** - Uses `tenant_slug VARCHAR(255)` instead of `business_id INTEGER REFERENCES business(id)`. This means:
- Can't enforce referential integrity
- Can have orphaned images if slug changes
- Less efficient joins

**Actual DB Schema:**
```sql
-- From db-overview.js output:
uploaded_at: timestamp without time zone NULL = now()
```

**Schema File:**
```sql
uploaded_at TIMESTAMPTZ DEFAULT NOW(),
created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
```

**Discrepancy:** DB has `uploaded_at` as `TIMESTAMP` (without timezone), schema file defines it as `TIMESTAMPTZ` (with timezone). Also, DB is missing `created_at` and `updated_at` columns entirely.

---

## Issues & Recommendations

### 🔴 Critical Issues

**None** - All tables are functional and well-designed.

---

### ⚠️ Medium Priority

#### 1. **Subscription Data Duplication** (`business` + `subscriptions` tables)

**Issue:** Current subscription info exists in both tables, risking data inconsistency.

**Options:**
- **A)** Keep `business` fields for current subscription, use `subscriptions` for history (EASIEST)
- **B)** Remove subscription fields from `business`, always query `subscriptions` (CLEANEST)
- **C)** Create a database view that joins them (BEST UX)

**Recommendation:** Go with **Option C** - Create a view:

```sql
CREATE OR REPLACE VIEW tenants.business_with_subscription AS
SELECT 
    b.*,
    s.plan_type as current_plan_type,
    s.plan_price_cents as current_plan_price,
    s.billing_cycle as current_billing_cycle,
    s.status as current_subscription_status,
    s.stripe_subscription_id,
    s.next_billing_date
FROM tenants.business b
LEFT JOIN tenants.subscriptions s ON s.business_id = b.id 
    AND s.status = 'active' 
    AND (s.ends_at IS NULL OR s.ends_at > CURRENT_TIMESTAMP);
```

Then update `business` table to remove duplicate fields in a future migration.

---

#### 2. **`tenant_images` Missing Foreign Key**

**Issue:** References `tenant_slug` instead of `business_id`, can't enforce integrity.

**Recommendation:** Add migration to:
1. Add `business_id INTEGER REFERENCES business(id) ON DELETE CASCADE`
2. Populate from `tenant_slug` → `business.slug` JOIN
3. Keep `tenant_slug` for backward compatibility (for now)
4. Update code to use `business_id` going forward

---

#### 3. **`tenant_images` Timestamp Inconsistency**

**Issue:** DB has `uploaded_at TIMESTAMP`, schema file has `uploaded_at TIMESTAMPTZ + created_at + updated_at`.

**Cause:** Schema file is newer/better than what was actually created in DB.

**Recommendation:** Run migration to:
```sql
ALTER TABLE tenants.tenant_images 
  ALTER COLUMN uploaded_at TYPE TIMESTAMPTZ USING uploaded_at AT TIME ZONE 'UTC';

ALTER TABLE tenants.tenant_images 
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE tenants.tenant_images 
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP;
```

---

### 💡 Optimization Opportunities

#### 1. **Add Composite Indexes for Common Queries**

```sql
-- For finding draft applications by email
CREATE INDEX idx_applications_email_status 
  ON tenants.tenant_applications(personal_email, status);

-- For finding active businesses by industry
CREATE INDEX idx_business_industry_status 
  ON tenants.business(industry, application_status) 
  WHERE application_status IN ('active', 'approved');

-- For loading business services
CREATE INDEX idx_services_business_active 
  ON tenants.services(business_id, is_active, sort_order) 
  WHERE is_active = true;
```

---

#### 2. **Add Helper Functions**

Consider adding these useful functions:

```sql
-- Check if a slug is available
CREATE FUNCTION tenants.is_slug_available(p_slug VARCHAR) 
RETURNS BOOLEAN AS $$
BEGIN
    RETURN NOT EXISTS (SELECT 1 FROM tenants.business WHERE slug = p_slug);
END;
$$ LANGUAGE plpgsql;

-- Get business by slug (common query)
CREATE FUNCTION tenants.get_business_by_slug(p_slug VARCHAR) 
RETURNS tenants.business AS $$
DECLARE
    business_record tenants.business;
BEGIN
    SELECT * INTO business_record FROM tenants.business WHERE slug = p_slug LIMIT 1;
    RETURN business_record;
END;
$$ LANGUAGE plpgsql;
```

---

## Action Items

### Priority 1 (Do Now)
- [ ] Fix `tenant_images` timestamp columns (add migration)
- [ ] Review and decide on subscription data approach (business vs subscriptions table)

### Priority 2 (Do Soon)
- [ ] Add `business_id` foreign key to `tenant_images`
- [ ] Add composite indexes for common queries
- [ ] Create `business_with_subscription` view

### Priority 3 (Nice to Have)
- [ ] Add helper functions for common operations
- [ ] Add database constraints for enum-like fields (e.g., `selected_plan`, `status`)
- [ ] Consider partitioning `subscriptions` table by year (if high volume expected)

---

## Summary

**Overall Assessment:** ✅ **EXCELLENT**

The tenants schema is well-designed with:
- ✅ Proper foreign keys and cascading deletes
- ✅ Good indexing strategy
- ✅ Auto-update triggers on all tables
- ✅ Helper functions for business logic
- ✅ Comprehensive comments for documentation
- ✅ JSONB fields for flexibility
- ✅ Proper timezone handling (mostly)

**Minor issues exist but are easily fixable with migrations.**

The schema is **production-ready** for the tenant onboarding flow.

---

**Next Steps:**
1. Fix `tenant_images` timestamps
2. Decide on subscription data architecture
3. Move to review next schema (auth, system, etc.)

