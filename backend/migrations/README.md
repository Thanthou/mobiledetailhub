# Database Migrations

This directory contains database migration files that are applied in chronological order.

## File Naming Convention

Use the format: `YYYY-MM-DD_HHMM_description.sql`

Examples:
- `2025-10-17_1430_add_instagram_url.sql`
- `2025-10-20_0915_add_appointments_index.sql`

## Migration File Structure

Each migration file should contain:

1. **Forward migration SQL** - The changes to apply
2. **Optional rollback SQL** - Commented out rollback instructions

Example:
```sql
-- Add Instagram URL column to business table
ALTER TABLE tenants.business ADD COLUMN instagram_url TEXT;

-- ROLLBACK:
-- ALTER TABLE tenants.business DROP COLUMN instagram_url;
```

## Running Migrations

```bash
# Apply all pending migrations
npm run migrate

# List migration status
npm run migrate list

# Apply specific migration (manual)
node scripts/backend/migrate.js
```

## Safety Notes

- ✅ Never modify existing migration files once committed
- ✅ Always test migrations on staging first
- ✅ Include rollback instructions when possible
- ✅ Use transactions for complex migrations
- ✅ Backup production data before major changes

## Migration Tracking

Applied migrations are tracked in `system.schema_migrations` table:
- `filename` - Name of the migration file
- `applied_at` - When it was applied
- `checksum` - MD5 hash of the file content
- `rollback_sql` - Extracted rollback SQL (if provided)
