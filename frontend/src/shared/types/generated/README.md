# Auto-Generated Database Types

⚠️ **DO NOT EDIT FILES IN THIS DIRECTORY MANUALLY**

This directory contains TypeScript types automatically generated from the PostgreSQL database schema.

## How It Works

```
SQL Migration → Database → Schema Snapshot → TypeScript Types
     ↓              ↓             ↓                ↓
  (manual)     (npm run      (JSON file)      (This folder)
               migrate)
```

## Generation Pipeline

1. You write SQL migration: `backend/migrations/2025-10-25_add_column.sql`
2. Run: `npm run migrate`
3. Migration script runs your SQL
4. Schema snapshot generator reads database structure → `backend/schemas/current-schema.json`
5. **Type generator reads snapshot → `frontend/src/shared/types/generated/db.types.ts`** ← THIS FOLDER

## Files

### `db.types.ts`
Auto-generated TypeScript interfaces for every database table.

**Example:**
```typescript
export interface Business {
  id: number;
  slug: string;
  business_name: string;
  created_at?: string;
  // ... all columns from tenants.business table
}
```

## Usage

Import generated types in your code:

```typescript
// In any frontend app (main, tenant-app, admin-app)
import type { Business, Review, Appointment } from '@/shared/types/generated/db.types';

// Use in components
interface Props {
  business: Business;
  reviews: Review[];
}

// Use in API calls
async function fetchBusiness(slug: string): Promise<Business> {
  const response = await fetch(`/api/tenants/${slug}`);
  return response.json();
}
```

## When Types Update

Types automatically regenerate when you:
- Run `npm run migrate` (after SQL migrations)
- Run `npm run db:snapshot` (manual schema refresh)
- Run `npm run db:setup` (database initialization)

## Type Mapping

| PostgreSQL Type | TypeScript Type |
|----------------|-----------------|
| `INTEGER`, `SERIAL`, `BIGINT` | `number` |
| `VARCHAR`, `TEXT` | `string` |
| `BOOLEAN` | `boolean` |
| `TIMESTAMPTZ`, `DATE` | `string` (ISO 8601) |
| `JSONB`, `JSON` | `Record<string, unknown>` |
| `UUID` | `string` |

## Nullable Columns

Nullable database columns become optional TypeScript properties:

```sql
-- SQL
business_email VARCHAR(255) NULL
```
↓
```typescript
// TypeScript
business_email?: string;
```

## Source of Truth

**Database = Single Source of Truth**

```
❌ OLD: Hand-write types (can drift from database)
✅ NEW: Generate types from database (always in sync)
```

## FAQ

**Q: Can I edit these files?**  
A: No. Any manual edits will be overwritten on the next `npm run migrate`.

**Q: What if I need custom types?**  
A: Create them in `frontend/src/shared/types/` (not in `generated/`).

**Q: Should I commit these files to git?**  
A: Yes (recommended). This lets you see type changes in PRs and keeps the team in sync.

**Q: What about API validation schemas?**  
A: Those stay in `backend/schemas/apiSchemas.js`. Generated types are for TypeScript; Zod schemas are for runtime validation.

## Related Files

- `backend/migrations/*.sql` - SQL migration files (manual)
- `backend/schemas/current-schema.json` - Database structure snapshot
- `backend/schemas/apiSchemas.js` - Zod validation schemas (manual)
- `scripts/devtools/generate-db-types.js` - Type generator script

