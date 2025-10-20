# Database Migration Overview

**Complete guide to database schema management** for That Smart Site.

---

## 📋 Quick Start

```bash
# Run all pending migrations
cd backend
npm run migrate

# Check migration status
npm run migrate:status

# List all migrations
npm run migrate:list
```

---

## 🏗️ Migration System Architecture

### Directory Structure

```
backend/
├── migrations/              # SQL migration files (timestamped)
│   ├── 2025-10-17_0001_create_error_logs_table.sql
│   ├── 2025-10-20_0001_add_seo_audit_tracking.sql
│   └── ...
│
├── database/
│   └── schemas/             # Schema definitions (reference)
│       ├── system/          # System-level tables
│       ├── tenants/         # Tenant-specific tables
│       └── health/          # Health monitoring tables
│
└── scripts/
    └── backend/
        └── migrate-commonjs.cjs   # Migration runner
```

---

## 📝 Migration File Naming Convention

### Format
```
YYYY-MM-DD_####_description.sql
```

### Examples
```
2025-10-17_0001_create_error_logs_table.sql
2025-10-20_0001_add_seo_audit_tracking.sql
2025-10-21_0001_add_subscription_fields.sql
```

### Rules
1. **Date**: YYYY-MM-DD format (sortable)
2. **Sequence**: 4-digit number (0001, 0002, etc.)
3. **Description**: snake_case, descriptive
4. **Extension**: `.sql` only

---

## 🔄 Migration Workflow

### 1. Create Migration

```bash
# Create new migration file
cd backend/migrations
touch 2025-10-20_0002_add_new_feature.sql
```

### 2. Write Migration SQL

```sql
-- Migration: Add new feature
-- Created: 2025-10-20
-- Description: Adds support for X feature

BEGIN;

-- Create new table
CREATE TABLE IF NOT EXISTS schema_name.table_name (
  id SERIAL PRIMARY KEY,
  column1 VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Add indexes
CREATE INDEX idx_table_column ON schema_name.table_name(column1);

COMMIT;
```

### 3. Run Migration

```bash
cd backend
npm run migrate
```

### 4. Verify

```bash
# Check migration was applied
npm run migrate:status

# Verify in database
psql $DATABASE_URL -c "\dt schema_name.*"
```

---

## 🗂️ Schema Organization

### Multi-Schema Structure

That Smart Site uses PostgreSQL schemas for logical separation:

#### `system` Schema
Core platform tables (auth, configuration, logging)

```sql
system.users
system.sessions
system.error_logs
system.schema_migrations
```

#### `tenants` Schema
Business and customer data

```sql
tenants.business
tenants.customers
tenants.services
tenants.subscriptions
tenants.tenant_applications
```

#### `health_monitoring` Schema
Health checks, SEO audits, performance tracking

```sql
health_monitoring.scores
health_monitoring.latest_seo_audits (view)
```

---

## 🎯 Common Migration Patterns

### Adding a New Table

```sql
CREATE TABLE IF NOT EXISTS schema_name.new_table (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Add indexes
CREATE INDEX idx_new_table_name ON schema_name.new_table(name);

-- Add constraints
ALTER TABLE schema_name.new_table
  ADD CONSTRAINT check_name_not_empty
  CHECK (length(name) > 0);
```

### Adding Columns

```sql
ALTER TABLE schema_name.existing_table
  ADD COLUMN IF NOT EXISTS new_column VARCHAR(255);

-- Add default value
ALTER TABLE schema_name.existing_table
  ALTER COLUMN new_column SET DEFAULT 'default_value';

-- Add constraint
ALTER TABLE schema_name.existing_table
  ADD CONSTRAINT check_new_column
  CHECK (new_column IN ('value1', 'value2'));
```

### Adding Indexes

```sql
-- Standard index
CREATE INDEX IF NOT EXISTS idx_table_column
  ON schema_name.table_name(column_name);

-- Unique index
CREATE UNIQUE INDEX IF NOT EXISTS idx_table_unique
  ON schema_name.table_name(column_name);

-- Composite index
CREATE INDEX IF NOT EXISTS idx_table_multi
  ON schema_name.table_name(column1, column2);
```

### Creating Views

```sql
CREATE OR REPLACE VIEW schema_name.view_name AS
SELECT
  t1.id,
  t1.name,
  t2.related_data
FROM schema_name.table1 t1
LEFT JOIN schema_name.table2 t2 ON t1.id = t2.table1_id;
```

---

## 🚀 Migration Runner

### How It Works

The migration system (`scripts/backend/migrate-commonjs.cjs`):

1. **Reads** all `*.sql` files from `backend/migrations/`
2. **Sorts** by filename (chronological order)
3. **Checks** `system.schema_migrations` table for applied migrations
4. **Runs** pending migrations in transaction
5. **Records** successful migrations in tracking table

### Migration Tracking Table

```sql
system.schema_migrations
├── id (SERIAL PRIMARY KEY)
├── filename (TEXT UNIQUE)
├── applied_at (TIMESTAMP DEFAULT NOW())
└── description (TEXT)
```

### Commands

```bash
# Run all pending migrations
npm run migrate

# Check which migrations have been applied
npm run migrate:status

# List all migration files
npm run migrate:list

# Initialize database (first time setup)
npm run db:setup
```

---

## ⚠️ Migration Best Practices

### DO ✅

- **Use transactions**: Wrap DDL in `BEGIN`/`COMMIT`
- **Check existence**: Use `IF NOT EXISTS` / `IF EXISTS`
- **Add indexes**: For foreign keys and frequent queries
- **Document**: Add comments explaining purpose
- **Test locally**: Always test before production
- **Keep atomic**: One logical change per migration

### DON'T ❌

- **Don't delete migrations**: Once applied, migrations are permanent
- **Don't modify applied migrations**: Create new migration instead
- **Don't hardcode data**: Use seed scripts for data
- **Don't skip transactions**: Always wrap in `BEGIN`/`COMMIT`
- **Don't assume order**: Migrations run alphabetically by filename

---

## 🐛 Troubleshooting

### Migration Failed Mid-Transaction

**Symptom**: Migration error, partial changes applied

**Solution**:
```bash
# 1. Check what was applied
psql $DATABASE_URL -c "SELECT * FROM system.schema_migrations ORDER BY applied_at DESC LIMIT 5"

# 2. If migration is marked as applied but incomplete:
psql $DATABASE_URL -c "DELETE FROM system.schema_migrations WHERE filename = 'problematic_migration.sql'"

# 3. Fix the migration SQL
# 4. Run again
npm run migrate
```

### Migration Conflicts

**Symptom**: "relation already exists" or "column already exists"

**Solution**:
Add conditional checks:
```sql
-- Instead of:
CREATE TABLE schema_name.table_name (...);

-- Use:
CREATE TABLE IF NOT EXISTS schema_name.table_name (...);
```

### Wrong Migration Order

**Symptom**: Migrations ran out of order

**Solution**:
Filename determines order. If needed:
1. Rename files to correct order
2. Update `system.schema_migrations` table
3. Or create new "fix" migration

---

## 🧪 Testing Migrations

### Local Testing

```bash
# 1. Backup database
pg_dump $DATABASE_URL > backup.sql

# 2. Run migration
npm run migrate

# 3. Verify changes
psql $DATABASE_URL -c "\dt schema_name.*"

# 4. If issues, restore
psql $DATABASE_URL < backup.sql
```

### CI/CD Testing

```yaml
# Example GitHub Actions workflow
- name: Run Migrations
  run: |
    cd backend
    npm run migrate
  env:
    DATABASE_URL: ${{ secrets.TEST_DATABASE_URL }}
```

---

## 📚 Related Documentation

- **Schema Reviews**: `docs/backend/schemas/`
- **Database Setup**: `docs/deployment/ENV_SETUP_GUIDE.md`
- **Backend Services**: `docs/backend/services/`

---

## 🔗 Quick Reference

### Essential Commands

```bash
# Run migrations
npm run migrate

# Check status
npm run migrate:status

# Database shell
psql $DATABASE_URL

# List schemas
\dn

# List tables in schema
\dt schema_name.*

# Describe table
\d schema_name.table_name
```

### Migration Template

```sql
-- Migration: [Description]
-- Created: YYYY-MM-DD
-- Purpose: [Why this migration exists]

BEGIN;

-- Your SQL here
CREATE TABLE IF NOT EXISTS schema_name.table_name (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP DEFAULT NOW()
);

COMMIT;
```

---

**Last Updated**: October 19, 2025  
**Maintained By**: Development Team

