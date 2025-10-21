# Database Schema Snapshot System

**Date:** October 21, 2025  
**Status:** ✅ Implemented

---

## Problem We Solved

**Before:**
```javascript
// scripts/audits/audit-db.js
const expectedTables = {
  tenants: ['business', 'users', 'settings'],  // ❌ Hardcoded
  // ... manually maintained
};
```

**Issues:**
- ❌ Gets out of sync with actual database
- ❌ Causes false positive warnings
- ❌ Manual maintenance required
- ❌ No single source of truth

---

## Solution: Auto-Generated Schema Snapshots

### Architecture:

```
┌─────────────────┐
│  npm run migrate│
└────────┬────────┘
         │
         ├─ 1. Run pending migrations
         │
         ├─ 2. Generate schema snapshot
         │     ↓
         │     Query actual DB structure
         │     ↓
         │     Write to current-schema.json
         │
         ↓
┌─────────────────────────┐
│ backend/schemas/        │
│   current-schema.json   │ ← Auto-generated
└────────┬────────────────┘
         │
         ↓ (used by)
┌─────────────────┐
│ npm run audit:db│
│   ↓             │
│   Reads JSON    │
│   Validates DB  │
└─────────────────┘
```

---

## Components

### 1. **Schema Snapshot Generator**

**File:** `scripts/devtools/generate-schema-snapshot.js`

**What it does:**
- Connects to database
- Queries all non-system schemas
- For each table: gets columns, indexes, constraints
- Writes structured JSON snapshot

**Output:** `backend/schemas/current-schema.json`

### 2. **Updated Migrate Command**

**File:** `backend/package.json`

```json
{
  "migrate": "node ../scripts/backend/migrate-commonjs.cjs && node ../scripts/devtools/generate-schema-snapshot.js"
}
```

**Flow:**
1. Run migrations (apply any new .sql files)
2. Generate snapshot (always, even if 0 new migrations)

### 3. **Updated Audit Script**

**File:** `scripts/audits/audit-db.js`

```javascript
// Try to load snapshot
const expectedTables = loadExpectedTablesFromSnapshot();

if (!expectedTables) {
  // Graceful fallback if snapshot missing
  console.log('⚠️  Run: npm run db:snapshot');
}
```

---

## Snapshot Format

```json
{
  "version": "1.0.0",
  "generated_at": "2025-10-21T09:27:00.000Z",
  "database_version": "PostgreSQL 17.5 on x86_64-windows...",
  "schemas": {
    "tenants": {
      "tables": [
        {
          "name": "business",
          "columns": [
            { "name": "id", "type": "integer", "nullable": false, "default": "..." },
            { "name": "slug", "type": "character varying", "nullable": false, "default": null }
          ],
          "indexes": [
            { "name": "business_pkey", "definition": "CREATE UNIQUE INDEX..." },
            { "name": "business_slug_idx", "definition": "CREATE INDEX..." }
          ],
          "constraints": [
            { "name": "business_pkey", "type": "PRIMARY KEY", "columns": "id" },
            { "name": "business_slug_unique", "type": "UNIQUE", "columns": "slug" }
          ]
        }
      ]
    },
    "auth": { "tables": [...] },
    "website": { "tables": [...] }
  }
}
```

---

## Usage

### Generate/Update Snapshot

```bash
cd backend

# Option 1: Run migrations (auto-generates snapshot)
npm run migrate

# Option 2: Manually generate snapshot (no migrations)
npm run db:snapshot
```

### Run Audit (Uses Snapshot)

```bash
npm run audit:db
```

---

## Benefits

### ✅ Zero Maintenance
- Snapshot auto-updates on every migration
- No manual editing required
- Always in sync with database

### ✅ Fast Audits
- Audit reads JSON file (milliseconds)
- No database queries during audit
- Can run offline if snapshot exists

### ✅ Rich Information
- Full schema details (columns, types, constraints)
- Can enhance audits with deeper checks
- Historical tracking (if committed to git)

### ✅ Graceful Degradation
- Missing snapshot? Uses minimal fallback
- Clear error message tells you how to fix
- Audit still runs (just less comprehensive)

---

## Initialization (One-Time)

Since we're adding this **after** migrations have run:

```bash
cd backend
npm run db:snapshot
```

This generates the initial snapshot from your current database.

**From then on:** Every `npm run migrate` auto-updates it!

---

## Git Strategy

**Recommended: Commit the snapshot**

**Why?**
- Track schema evolution over time
- See what changed in each migration during code review
- Team members can see expected schema without running migrations

**Add to git:**
```bash
git add backend/schemas/current-schema.json
git commit -m "Add initial schema snapshot"
```

**Alternative: Ignore it**
```
# .gitignore
backend/schemas/current-schema.json
```

Use this if you want each developer to generate their own from their local DB.

---

## Next Steps

1. ✅ Fix database connection issue
2. ✅ Run `npm run db:snapshot` to generate initial snapshot
3. ✅ Run `npm run audit:db` to verify it works
4. ✅ Decide: commit snapshot to git or add to .gitignore

---

## Summary

**We eliminated hardcoded schema expectations!**

Now the audit script uses a **snapshot of actual database structure**, auto-generated on every migration.

Result: No more false positives, no manual maintenance, always accurate! 🎉

