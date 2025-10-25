# Database Audit Report

**Generated:** 2025-10-25T22:21:44.401Z
**Duration:** 192ms
**Score:** 97/100

---

## Summary

- ✅ **Passed:** 11
- ⚠️  **Warnings:** 1
- ❌ **Errors:** 0

## Description

Validates database structure, connectivity, and integrity.

## Issues Found

### 🟡 Warnings

1. **No schema snapshot found - using minimal validation**
   - Details: Run: npm run db:snapshot to generate snapshot

---

## Detailed Log


## Database Connection

✅ Database connected successfully

## Database Schemas

✅ Found 10 schemas
✅ All expected schemas present

## Database Tables

✅ Found 46 tables across 10 schemas
⚠️ **WARNING**: No schema snapshot found - using minimal validation
✅ tenants schema has all expected tables
✅ auth schema has all expected tables
✅ system schema has all expected tables
✅ All expected tables present

## Database Migrations

✅ Found 5 recent migrations

## Database Constraints

✅ Found 97 constraints

## Database Indexes

✅ Found 246 indexes

---

## Recommendations

1. Run migrations before deployment
2. Ensure all expected schemas and tables exist
3. Add indexes on frequently queried columns for performance
4. Review and fix any constraint violations
5. Keep schema snapshot updated: npm run db:snapshot
