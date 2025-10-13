# Tenant Onboarding Database Schema

## 📋 Overview

This document describes the database schema changes for the Tenant Onboarding system, which supports the $15/$25/$35 subscription-based model for ThatSmartSite.

**Date Created:** October 10, 2025  
**Version:** 1.0  
**Author:** ThatSmartSite Team

---

## 🏗️ Architecture

The tenant onboarding system uses a **3-table approach** within the `tenants` schema:

1. **`tenants.tenant_applications`** - Tracks applications before they become tenants
2. **`tenants.subscriptions`** - Historical record of all subscriptions
3. **`tenants.business`** - Extended with subscription fields for active tenants

---

## 📊 Table Descriptions

### 1. `tenants.tenant_applications`

**Purpose:** Tracks onboarding applications and drafts before approval

**Key Features:**
- Auto-save support with `draft_data` JSONB field
- 4-step workflow tracking (`current_step`: 0=plan, 1=personal, 2=business, 3=payment)
- Stripe integration fields (customer_id, payment_intent_id, subscription_id)
- Auto-expiration after 30 days for drafts
- UTM tracking for marketing attribution

**Status Flow:**
```
draft → submitted → approved → tenant created
                 ↘ rejected → archived
                 ↘ expired → purged
```

**Columns:**
- `id` - Primary key
- `first_name`, `last_name`, `personal_email`, `personal_phone` - Applicant info
- `business_name`, `business_email`, `business_phone` - Business info
- `business_address`, `business_city`, `business_state`, `business_zip` - Business location
- `billing_address`, `billing_city`, `billing_state`, `billing_zip` - Billing address
- `use_same_address` - Boolean flag for address matching
- `selected_plan` - Plan choice: 'starter', 'pro', 'enterprise'
- `plan_price_cents` - Price in cents (1500, 2500, 3500)
- `current_step` - Current onboarding step (0-3)
- `status` - Application status
- `draft_data` - Full form state (JSONB)
- `stripe_*` fields - Payment integration
- `utm_*` fields - Marketing attribution
- `expires_at` - Auto-expiration timestamp
- `last_saved_at` - Last auto-save timestamp

**Indexes:**
- `idx_applications_email` - Fast lookup by email
- `idx_applications_status` - Filter by status
- `idx_applications_created_at` - Time-based queries
- `idx_applications_expires_at` - Cleanup queries
- `idx_applications_submitted_at` - Approval workflow
- `idx_applications_stripe_customer` - Payment lookups

---

### 2. `tenants.subscriptions`

**Purpose:** Complete history of all subscriptions (past and present)

**Key Features:**
- Historical record (never deleted, only marked as ended)
- Supports plan changes and upgrades
- Tracks billing failures and retries
- MRR calculation support
- Cancellation tracking with reason codes

**Status Values:**
- `trial` - In trial period
- `active` - Active paid subscription
- `past_due` - Payment failed, retry pending
- `cancelled` - Customer cancelled
- `paused` - Temporarily paused
- `expired` - Trial or subscription ended

**Columns:**
- `id` - Primary key
- `business_id` - Foreign key to `tenants.business`
- `plan_type` - Plan tier at subscription time
- `plan_price_cents` - Price at subscription time
- `billing_cycle` - 'monthly' or 'yearly'
- `starts_at` - Subscription start date
- `ends_at` - NULL for active, populated when ended
- `cancelled_at` - When cancellation occurred
- `status` - Current subscription state
- `stripe_subscription_id` - Stripe subscription ID
- `stripe_customer_id` - Stripe customer ID
- `stripe_price_id` - Stripe price ID
- `is_trial` - Boolean trial flag
- `trial_ends_at` - Trial expiration
- `last_billing_attempt_at` - Last billing attempt
- `last_successful_payment_at` - Last successful payment
- `failed_payment_attempts` - Failed attempt counter
- `next_billing_date` - Next scheduled billing
- `cancel_reason` - Cancellation reason
- `cancelled_by` - Who cancelled: 'customer', 'admin', 'system', 'payment_failure'
- `previous_plan` - Plan before change
- `metadata` - Additional data (JSONB)

**Indexes:**
- `idx_subscriptions_business_id` - Business lookups
- `idx_subscriptions_status` - Status filtering
- `idx_subscriptions_stripe_subscription` - Stripe webhooks
- `idx_subscriptions_stripe_customer` - Customer lookups
- `idx_subscriptions_next_billing` - Billing queue
- `idx_subscriptions_active` - Active subscriptions (composite + WHERE clause)

**Helper Functions:**
- `get_active_subscription(business_id)` - Returns current active subscription
- `calculate_mrr()` - Calculates Monthly Recurring Revenue by plan

---

### 3. `tenants.business` (Extended)

**Purpose:** Core tenant table with added subscription fields

**New Fields Added:**
- `selected_plan` VARCHAR(20) - Current plan ('starter', 'pro', 'enterprise')
- `plan_price_cents` INTEGER - Current price in cents
- `billing_cycle` VARCHAR(20) - 'monthly' or 'yearly'
- `subscription_status` VARCHAR(20) - Current billing status
- `trial_ends_at` TIMESTAMPTZ - Trial expiration
- `subscription_started_at` TIMESTAMPTZ - When paid subscription began
- `billing_address` VARCHAR(500) - Billing street address
- `billing_city` VARCHAR(100) - Billing city
- `billing_state` VARCHAR(50) - Billing state
- `billing_zip` VARCHAR(20) - Billing ZIP code
- `billing_country` VARCHAR(50) - Billing country (default: 'US')

**New Indexes:**
- `idx_business_selected_plan` - Plan filtering
- `idx_business_subscription_status` - Billing status queries
- `idx_business_trial_ends` - Trial expiration queries

**Existing Fields** (unchanged):
- `id`, `industry`, `slug`, `business_name`, `owner`, `first_name`, `last_name`
- `user_id`, `application_status`, `business_start_date`
- `business_phone`, `personal_phone`, `business_email`, `personal_email`
- `twilio_phone`, `sms_phone`, `website`, `gbp_url`, `facebook_url`, etc.
- `service_areas`, `source`, `notes`
- `application_date`, `approved_date`, `last_activity`, `created_at`, `updated_at`

---

## 🔄 Data Flow

### Onboarding Flow:
```
1. User starts onboarding
   ↓
2. Create row in tenant_applications (status='draft')
   ↓
3. Auto-save updates draft_data every 2 seconds
   ↓
4. User completes payment (Stripe)
   ↓
5. Mark application as 'submitted'
   ↓
6. Admin/System approves
   ↓
7. Create row in tenants.business (copy data from application)
   ↓
8. Create row in tenants.subscriptions (trial or active)
   ↓
9. Update application status to 'approved'
   ↓
10. Send welcome email
```

### Subscription Lifecycle:
```
Trial → Active → Renewal → Active (ongoing)
                ↘ Failed → Past Due → Retry → Active
                                    ↘ Cancel → Cancelled
                ↘ Manual Cancel → Cancelled
```

---

## 📝 Migration Files

### Location: `backend/database/migrations/`

**001_add_tenant_applications.sql**
- Creates `tenants.tenant_applications` table
- Adds indexes and triggers
- Safe to run on existing database

**002_add_subscriptions.sql**
- Creates `tenants.subscriptions` table
- Adds indexes, triggers, and helper functions
- Safe to run on existing database

**003_alter_business_add_subscription_fields.sql**
- Adds subscription fields to existing `tenants.business` table
- Uses `ADD COLUMN IF NOT EXISTS` for safety
- Safe to run on existing database

### Running Migrations:

```bash
# From backend directory
psql -U your_user -d your_database -f database/migrations/001_add_tenant_applications.sql
psql -U your_user -d your_database -f database/migrations/002_add_subscriptions.sql
psql -U your_user -d your_database -f database/migrations/003_alter_business_add_subscription_fields.sql
```

Or use your migration tool:
```javascript
// Using Node.js script
const { pool } = require('./database/pool');
const fs = require('fs');

async function runMigrations() {
  const migrations = [
    '001_add_tenant_applications.sql',
    '002_add_subscriptions.sql',
    '003_alter_business_add_subscription_fields.sql'
  ];
  
  for (const migration of migrations) {
    const sql = fs.readFileSync(`./database/migrations/${migration}`, 'utf8');
    await pool.query(sql);
    console.log(`✅ Migration ${migration} completed`);
  }
}

runMigrations();
```

---

## 🔧 Schema Files

### Location: `backend/database/schemas/tenants/`

**business.sql**
- Complete schema for tenants.business table
- Includes all subscription fields
- Use for fresh database initialization

**tenant_applications.sql**
- Complete schema for tenant_applications table
- Use for fresh database initialization

**subscriptions.sql**
- Complete schema for subscriptions table
- Includes helper functions
- Use for fresh database initialization

**services.sql**
- Schema for tenant services

**service_tiers.sql**
- Schema for service pricing tiers

**tenant_images.sql**
- Schema for tenant media/gallery

---

## 🎯 Pricing Plans

### Starter - $15/month
- Plan ID: `starter`
- Price: 1500 cents
- Features: Single location, 5 pages, mobile responsive, basic SEO

### Pro - $25/month (Most Popular)
- Plan ID: `pro`
- Price: 2500 cents
- Features: Multi-location, unlimited pages, advanced SEO, booking system

### Enterprise - $35/month
- Plan ID: `enterprise`
- Price: 3500 cents
- Features: Everything in Pro + custom development, API, dedicated support

---

## 📊 Querying Examples

### Get all active subscriptions:
```sql
SELECT 
    b.business_name,
    s.plan_type,
    s.plan_price_cents / 100.0 AS price_dollars,
    s.status,
    s.next_billing_date
FROM tenants.subscriptions s
JOIN tenants.business b ON b.id = s.business_id
WHERE s.status = 'active'
  AND (s.ends_at IS NULL OR s.ends_at > CURRENT_TIMESTAMP)
ORDER BY s.next_billing_date;
```

### Get draft applications (for cleanup):
```sql
SELECT 
    id,
    personal_email,
    business_name,
    created_at,
    expires_at,
    expires_at < CURRENT_TIMESTAMP AS is_expired
FROM tenants.tenant_applications
WHERE status = 'draft'
  AND expires_at < CURRENT_TIMESTAMP
ORDER BY expires_at;
```

### Calculate Monthly Recurring Revenue:
```sql
SELECT * FROM tenants.calculate_mrr();
```

### Get business with subscription details:
```sql
SELECT 
    b.business_name,
    b.selected_plan,
    b.subscription_status,
    b.trial_ends_at,
    s.next_billing_date,
    s.failed_payment_attempts
FROM tenants.business b
LEFT JOIN tenants.subscriptions s ON s.business_id = b.id AND s.status = 'active'
WHERE b.id = 123;
```

---

## 🔒 Security Considerations

1. **PII Protection:**
   - Personal emails, phones, addresses contain sensitive data
   - Implement encryption at rest
   - Limit access with role-based permissions

2. **Payment Data:**
   - Never store credit card numbers
   - Only store Stripe IDs (customer_id, subscription_id)
   - Use Stripe webhooks for payment confirmations

3. **Data Retention:**
   - Auto-expire draft applications after 30 days
   - Purge expired drafts regularly
   - Keep subscription history indefinitely (for accounting)

---

## 🧹 Maintenance Tasks

### Daily:
- Clean up expired draft applications (status='draft', expires_at < NOW())
- Process failed payment retries

### Weekly:
- Review pending applications (status='submitted')
- Check for stale trials (trial_ends_at < NOW(), subscription_status='trial')

### Monthly:
- Generate MRR reports
- Analyze churn by plan type
- Review cancellation reasons

### Cleanup Query:
```sql
-- Delete expired drafts older than 30 days
DELETE FROM tenants.tenant_applications
WHERE status = 'draft'
  AND expires_at < CURRENT_TIMESTAMP - INTERVAL '30 days';
```

---

## 📈 Analytics Queries

### Conversion Rate:
```sql
SELECT 
    COUNT(*) FILTER (WHERE status = 'submitted') AS submitted,
    COUNT(*) FILTER (WHERE status = 'approved') AS approved,
    ROUND(100.0 * COUNT(*) FILTER (WHERE status = 'approved') / 
          NULLIF(COUNT(*) FILTER (WHERE status = 'submitted'), 0), 2) AS conversion_rate
FROM tenants.tenant_applications
WHERE created_at > CURRENT_TIMESTAMP - INTERVAL '30 days';
```

### Churn Rate:
```sql
SELECT 
    COUNT(*) FILTER (WHERE cancelled_at IS NOT NULL) AS cancelled,
    COUNT(*) AS total,
    ROUND(100.0 * COUNT(*) FILTER (WHERE cancelled_at IS NOT NULL) / COUNT(*), 2) AS churn_rate
FROM tenants.subscriptions
WHERE starts_at > CURRENT_TIMESTAMP - INTERVAL '30 days';
```

---

## 🚀 Next Steps

1. ✅ Run migrations on your database
2. ⏳ Update backend API to use new tables
3. ⏳ Integrate Stripe webhooks
4. ⏳ Implement auto-expiration job
5. ⏳ Add admin dashboard for application management
6. ⏳ Set up analytics tracking

---

## 📞 Support

For questions or issues with the schema:
- Review this document
- Check migration rollback instructions
- Contact: dev@thatsmartsite.com

---

**Last Updated:** October 10, 2025  
**Schema Version:** 1.0

