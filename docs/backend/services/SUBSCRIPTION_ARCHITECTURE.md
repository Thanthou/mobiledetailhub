# Subscription Architecture

**Updated:** 2025-10-13  
**Database:** ThatSmartSite

---

## 🎯 Architecture Decision

**Subscriptions are now in a separate table**, not embedded in the `business` table.

### **Why This Is Better:**

1. ✅ **Single Source of Truth** - All billing data in one place
2. ✅ **Add-ons Support** - Can track extras (SMS credits, extra locations, etc.)
3. ✅ **Complete History** - Track every plan change, upgrade, downgrade
4. ✅ **Cleaner Business Model** - Business info separated from billing
5. ✅ **Easier Analytics** - Calculate MRR, churn, LTV
6. ✅ **Better Stripe Integration** - Match Stripe's subscription model

---

## 📊 Table Structure

### **`tenants.business`** (Core Business Info)
```sql
id, slug, business_name, industry, user_id,
business_email, business_phone, social_urls,
application_status, service_areas,
created_at, updated_at
```

**Purpose:** Core tenant/business information only

---

### **`tenants.subscriptions`** (Billing & Features)
```sql
id, business_id, plan_type, plan_price_cents,
billing_cycle, status, stripe_subscription_id,
is_trial, trial_ends_at, next_billing_date,
metadata (for add-ons), starts_at, ends_at
```

**Purpose:** All subscription/billing data

---

## 🔧 How to Use

### **1. Get Business with Current Subscription**

**Easy way (using view):**
```sql
SELECT * FROM tenants.businesses_with_subscription 
WHERE slug = 'jps-mobile-detailing';
```

**Returns:**
```json
{
  "id": 42,
  "slug": "jps-mobile-detailing",
  "business_name": "JP's Mobile Detail",
  "industry": "mobile-detailing",
  "plan_type": "pro",              // ← From subscriptions
  "plan_price_cents": 2500,        // ← From subscriptions
  "subscription_status": "active",  // ← From subscriptions
  "next_billing_date": "2025-11-13"
}
```

---

### **2. Check Feature Access**

**Using helper function:**
```sql
-- Check if business has Pro plan or higher
SELECT tenants.has_plan_access(42, 'pro');
-- Returns: true or false
```

**In application code:**
```javascript
// Check if tenant can access a feature
const canUseBooking = await db.query(`
  SELECT tenants.has_plan_access($1, 'pro') as has_access
`, [businessId]);

if (!canUseBooking.has_access) {
  return res.status(403).json({
    error: 'Upgrade required',
    message: 'Booking feature requires Pro plan or higher',
    currentPlan: tenant.plan_type
  });
}
```

---

### **3. Handle Subscription Changes**

**When a tenant upgrades:**
```javascript
// Example: Upgrade from Starter to Pro

// 1. End current subscription
await db.query(`
  UPDATE tenants.subscriptions 
  SET ends_at = NOW(), status = 'cancelled'
  WHERE business_id = $1 AND status = 'active'
`, [businessId]);

// 2. Create new subscription
await db.query(`
  INSERT INTO tenants.subscriptions (
    business_id, plan_type, plan_price_cents, 
    billing_cycle, status, starts_at
  ) VALUES ($1, 'pro', 2500, 'monthly', 'active', NOW())
`, [businessId]);
```

---

### **4. Add-ons Example**

**Tenant adds SMS credits:**
```javascript
await db.query(`
  INSERT INTO tenants.subscriptions (
    business_id, 
    plan_type, 
    plan_price_cents,
    metadata,
    status
  ) VALUES (
    $1,
    'pro',
    4000,  // $25 base + $15 add-ons
    $2,    // JSON with add-on details
    'active'
  )
`, [
  businessId,
  JSON.stringify({
    base_plan: 'pro',
    base_price_cents: 2500,
    addons: [
      { 
        id: 'sms_1000', 
        name: '1000 SMS Credits/month', 
        price_cents: 1000 
      },
      { 
        id: 'extra_location', 
        name: 'Additional Service Area', 
        price_cents: 500 
      }
    ],
    total_addons_price: 1500,
    features_enabled: ['booking', 'sms', 'multi_location']
  })
]);
```

---

## 📈 Analytics & Reporting

### **Calculate MRR (Monthly Recurring Revenue):**
```sql
SELECT * FROM tenants.calculate_mrr();
```

**Returns:**
```
plan_type    | subscriber_count | monthly_revenue_cents
-------------|------------------|----------------------
starter      | 45               | 67500  ($675)
pro          | 23               | 57500  ($575)
enterprise   | 8                | 28000  ($280)
```

---

### **Get Subscription History for a Business:**
```sql
SELECT * FROM tenants.subscriptions 
WHERE business_id = 42 
ORDER BY starts_at DESC;
```

**Returns:**
```
id | plan_type  | status    | starts_at           | ends_at
---|------------|-----------|---------------------|----------
3  | pro        | active    | 2025-03-01 10:00:00 | NULL
2  | starter    | cancelled | 2025-01-15 09:00:00 | 2025-03-01 10:00:00
1  | starter    | cancelled | 2025-01-01 08:00:00 | 2025-01-15 09:00:00
```

---

## 🔌 Stripe Integration

### **Webhook Handler (Subscription Updated):**
```javascript
// When Stripe sends subscription.updated webhook
async function handleSubscriptionUpdate(stripeEvent) {
  const { 
    customer, 
    id: subscriptionId, 
    items, 
    status, 
    trial_end 
  } = stripeEvent.data.object;
  
  // Get business_id from Stripe customer_id
  const business = await db.query(`
    SELECT id FROM tenants.business 
    WHERE user_id = (
      SELECT id FROM auth.users 
      WHERE stripe_customer_id = $1
    )
  `, [customer]);
  
  // End old subscription
  await db.query(`
    UPDATE tenants.subscriptions 
    SET ends_at = NOW(), status = 'cancelled'
    WHERE business_id = $1 AND status IN ('active', 'trial')
  `, [business.id]);
  
  // Create new subscription record
  await db.query(`
    INSERT INTO tenants.subscriptions (
      business_id,
      plan_type,
      plan_price_cents,
      billing_cycle,
      status,
      stripe_subscription_id,
      stripe_customer_id,
      is_trial,
      trial_ends_at,
      starts_at
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
  `, [
    business.id,
    items.data[0].price.metadata.plan_type,
    items.data[0].price.unit_amount,
    items.data[0].price.recurring.interval,
    status,
    subscriptionId,
    customer,
    status === 'trialing',
    trial_end ? new Date(trial_end * 1000) : null
  ]);
}
```

---

## 🗂️ Helper Functions

### **`has_active_subscription(business_id)`**
Check if business has any active subscription
```sql
SELECT tenants.has_active_subscription(42);
-- Returns: true or false
```

### **`has_plan_access(business_id, required_plan)`**
Check if business has a specific plan level or higher
```sql
SELECT tenants.has_plan_access(42, 'pro');
-- Returns: true if business has Pro or Enterprise
```

### **`get_active_subscription(business_id)`**
Get the current active subscription record
```sql
SELECT * FROM tenants.get_active_subscription(42);
-- Returns: full subscription record
```

### **`calculate_mrr()`**
Calculate Monthly Recurring Revenue by plan
```sql
SELECT * FROM tenants.calculate_mrr();
-- Returns: table with plan_type, subscriber_count, monthly_revenue_cents
```

---

## 📝 Migration Applied

**File:** `backend/database/migrations/004_separate_subscription_from_business.sql`

**What it does:**
1. ✅ Migrates existing subscription data from `business` to `subscriptions` table
2. ✅ Removes subscription fields from `business` table
3. ✅ Creates `businesses_with_subscription` view
4. ✅ Creates helper functions for feature access checks

**To apply:**
```bash
cd backend
node database/scripts/run-migration.js 004
```

---

## 🎯 Best Practices

### **DO:**
- ✅ Always use `businesses_with_subscription` view for queries
- ✅ Use helper functions for feature access checks
- ✅ Store add-ons in `metadata` JSON field
- ✅ Track every subscription change (don't UPDATE, INSERT new row)
- ✅ Set `ends_at` when subscription changes/cancels

### **DON'T:**
- ❌ Store subscription data in `business` table
- ❌ Update existing subscription records (create new ones instead)
- ❌ Delete subscription records (history is valuable!)
- ❌ Hardcode feature access checks (use `has_plan_access()`)

---

## 🚀 Next Steps

1. Update frontend onboarding to write to `subscriptions` table
2. Implement Stripe webhook handlers
3. Create admin dashboard for subscription management
4. Add subscription analytics/reporting
5. Implement add-ons UI (extra locations, SMS credits, etc.)

---

**Questions?** See `TENANTS_SCHEMA_REVIEW.md` for full schema documentation.

