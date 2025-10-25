# Zod Schema Sync Audit Report

**Generated:** 2025-10-25T20:51:48.168Z
**Duration:** 4ms
**Score:** 100/100

---

## Summary

- ✅ **Passed:** 1
- ⚠️  **Warnings:** 0
- ❌ **Errors:** 0

## Description

This audit verifies that Zod validation schemas align with the database structure.

**What it checks:**
- Fields in Zod schemas that don't exist in database (dead validation code)
- Required database fields without validation (potential security gaps)
- Schema-to-table mappings are correct

**What it ignores:**
- Auto-generated fields (id, created_at, updated_at)
- External API schemas (Stripe, Google, etc.)
- Optional database fields (nullable or with defaults)

**Note:** This is an informational audit. Some mismatches are intentional:
- Zod schemas might validate computed fields not stored in DB
- API input schemas differ from database structure
- Some fields are validated elsewhere (middleware, business logic)

## ✅ All Checks Passed!

No issues found during this audit.

---

## Detailed Log


## Database Schema

✅ Loaded database schema (10 schemas)

## Schema: auth.schemas.js


## Schema: tenants.schemas.js


## Schema: schedule.schemas.js


## Schema: reputation.schemas.js


## Schema: services.schemas.js


## Schema: website.schemas.js


## Schema: domains.schemas.js


## Schema: payments.schemas.js


## Schema: analytics.schemas.js


## Schema: admin.schemas.js


---

## Recommendations

1. Review fields in Zod but not in DB - might be outdated after schema changes
2. Add validation for required DB fields to enforce business rules
3. Update SCHEMA_TABLE_MAP in audit script if you rename schemas
4. Run this audit after database migrations to catch drift
5. Consider adding type checking (string vs number) in future enhancement
