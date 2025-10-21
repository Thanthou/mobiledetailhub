# Database Audit Report

**Generated:** 2025-10-21T12:30:04.681Z
**Duration:** 196ms
**Score:** 100/100

---

## Summary

- ✅ **Passed:** 18
- ⚠️  **Warnings:** 0
- ❌ **Errors:** 0

## Description

Validates database structure, connectivity, and integrity.

## ✅ All Checks Passed!

No issues found during this audit.

---

## Detailed Log


## Database Connection

✅ Database connected successfully

## Database Schemas

✅ Found 10 schemas
✅ All expected schemas present

## Database Tables

✅ Found 46 tables across 10 schemas
✅ analytics schema has all expected tables
✅ auth schema has all expected tables
✅ booking schema has all expected tables
✅ customers schema has all expected tables
✅ public schema has all expected tables
✅ reputation schema has all expected tables
✅ schedule schema has all expected tables
✅ system schema has all expected tables
✅ tenants schema has all expected tables
✅ website schema has all expected tables
✅ All expected tables present

## Database Migrations

✅ Found 5 recent migrations

## Database Constraints

✅ Found 94 constraints

## Database Indexes

✅ Found 242 indexes

---

## Recommendations

1. Run migrations before deployment
2. Ensure all expected schemas and tables exist
3. Add indexes on frequently queried columns for performance
4. Review and fix any constraint violations
5. Keep schema snapshot updated: npm run db:snapshot
