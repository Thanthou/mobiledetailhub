# 🚀 Quick Start: Run Migrations

## ✅ Everything is Ready!

All schema files and migrations have been created. Here's how to deploy:

---

## 📋 What Was Created

```
backend/database/
├── schemas/tenants/
│   ├── business.sql ⭐ (updated with subscription fields)
│   ├── tenant_applications.sql ⭐ (NEW)
│   ├── subscriptions.sql ⭐ (NEW)
│   ├── services.sql
│   ├── service_tiers.sql
│   └── tenant_images.sql
│
├── migrations/
│   ├── 001_add_tenant_applications.sql ⭐
│   ├── 002_add_subscriptions.sql ⭐
│   └── 003_alter_business_add_subscription_fields.sql ⭐
│
└── scripts/
    └── run-tenant-migrations.js ⭐
```

---

## 🎯 Deploy Now (Choose One)

### **Option A: Automated (Fastest)** ⚡

```bash
cd backend
node database/scripts/run-tenant-migrations.js
```

✅ Runs all 3 migrations automatically  
✅ Shows progress and errors  
✅ Safe to re-run (idempotent)

---

### **Option B: pgAdmin (Safest)** 🛡️

1. Open pgAdmin
2. Connect to your database
3. Open Query Tool (Tools → Query Tool)
4. Copy/paste contents of each migration file:
   - `backend/database/migrations/001_add_tenant_applications.sql`
   - `backend/database/migrations/002_add_subscriptions.sql`
   - `backend/database/migrations/003_alter_business_add_subscription_fields.sql`
5. Click Execute (F5) for each one

---

### **Option C: Command Line** 💻

```bash
cd backend/database/migrations

# Run each migration
psql -U your_user -d your_db -f 001_add_tenant_applications.sql
psql -U your_user -d your_db -f 002_add_subscriptions.sql
psql -U your_user -d your_db -f 003_alter_business_add_subscription_fields.sql
```

---

## ✅ Verify Success

Run this in pgAdmin/psql:

```sql
-- Should return 2 new tables
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'tenants'
  AND table_name IN ('tenant_applications', 'subscriptions');
```

**Expected:** 2 rows ✅

---

## 🎯 What Changed

### ✨ NEW: `tenants.tenant_applications`
- Tracks onboarding applications
- Supports auto-save with `draft_data` field
- 30-day auto-expiration for drafts
- Stripe integration ready

### ✨ NEW: `tenants.subscriptions`
- Complete subscription history
- Supports plan changes
- MRR calculation built-in
- Cancellation tracking

### 🔧 UPDATED: `tenants.business`
- Added 11 subscription/billing fields
- New indexes for performance
- Backward compatible (existing data untouched)

---

## 📖 Full Documentation

- `DATABASE_MIGRATION_COMPLETE.md` - Complete deployment guide
- `backend/database/TENANT_ONBOARDING_SCHEMA.md` - Schema details
- Migration files - Include comments & rollback instructions

---

## 💡 Pro Tips

✅ **Safe to Re-run:** All migrations use `IF NOT EXISTS`  
✅ **No Downtime:** Additive changes only  
✅ **No Data Loss:** Existing tables/data preserved  
✅ **Rollback Ready:** Each migration includes undo instructions  

---

## 🎊 You're Ready!

After running migrations, your database will support:
- ✅ Tenant onboarding workflow
- ✅ $15/$25/$35 subscription plans
- ✅ Auto-save draft applications
- ✅ Subscription billing history
- ✅ MRR analytics

**Run migrations now and you're good to go!** 🚀

