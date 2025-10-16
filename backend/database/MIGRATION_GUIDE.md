# Database Migration Guide

This guide explains how to manage database migrations in the ThatSmartSite backend.

## Migration Naming Convention

All migration files follow this naming pattern:
```
YYYYMMDD_HHMMSS_descriptive_name.sql
```

**Examples:**
- `20241220_143022_add_user_authentication.sql`
- `20241220_143045_create_tenant_subscriptions.sql`
- `20241220_143102_add_review_ratings.sql`

## Migration Commands

### Check Migration Status
```bash
npm run migrate:status
# or
node database/scripts/migrate.js status
```

### Run Pending Migrations
```bash
npm run migrate:up
# or
node database/scripts/migrate.js up
```

### Rollback Last Migration
```bash
npm run migrate:down
# or
node database/scripts/migrate.js down
```

### Create New Migration
```bash
npm run migrate:create "add user authentication"
# or
node database/scripts/migrate.js create "add user authentication"
```

### Reset All Migrations (Development Only)
```bash
npm run migrate:reset
# or
node database/scripts/migrate.js reset
```

## Migration File Structure

Each migration file should include:

1. **Header Comment** - Description and creation date
2. **Migration SQL** - The actual schema changes
3. **Rollback Instructions** - Comments explaining how to undo changes

**Example:**
```sql
-- Migration: Add user authentication
-- Created: 2024-12-20T14:30:22.000Z

-- Create users table
CREATE TABLE auth.users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_users_email ON auth.users(email);
CREATE INDEX idx_users_created_at ON auth.users(created_at);

-- ROLLBACK:
-- DROP TABLE IF EXISTS auth.users;
```

## Migration Best Practices

### 1. Always Include Rollback Instructions
Every migration should include comments explaining how to undo the changes.

### 2. Use Transactions When Possible
Wrap complex migrations in transactions:
```sql
BEGIN;

-- Your migration SQL here
CREATE TABLE example_table (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL
);

COMMIT;
```

### 3. Test Migrations
- Always test migrations on a copy of production data
- Verify rollback procedures work correctly
- Test with both empty and populated databases

### 4. Avoid Breaking Changes
- Add new columns as nullable first, then populate, then make required
- Use ALTER TABLE to modify existing columns carefully
- Consider data migration for complex changes

### 5. Use Descriptive Names
Migration names should clearly describe what they do:
- ✅ `add_user_authentication`
- ✅ `create_tenant_subscriptions`
- ❌ `fix_stuff`
- ❌ `update_table`

## Migration Tracking

The system automatically tracks migrations in the `schema_migrations` table:

```sql
CREATE TABLE schema_migrations (
  id SERIAL PRIMARY KEY,
  version VARCHAR(50) NOT NULL UNIQUE,
  description TEXT,
  applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  checksum VARCHAR(64),
  execution_time INTEGER,
  filename VARCHAR(255) NOT NULL UNIQUE
);
```

## Common Migration Patterns

### Adding a New Table
```sql
-- Migration: Create customer reviews table
-- Created: 2024-12-20T14:30:22.000Z

CREATE TABLE reputation.reviews (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL REFERENCES tenants.business(id),
  customer_name VARCHAR(255) NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_reviews_tenant_id ON reputation.reviews(tenant_id);
CREATE INDEX idx_reviews_rating ON reputation.reviews(rating);

-- ROLLBACK:
-- DROP TABLE IF EXISTS reputation.reviews;
```

### Adding a Column
```sql
-- Migration: Add phone number to users table
-- Created: 2024-12-20T14:30:22.000Z

ALTER TABLE auth.users 
ADD COLUMN phone VARCHAR(20);

-- Add index for phone lookups
CREATE INDEX idx_users_phone ON auth.users(phone);

-- ROLLBACK:
-- DROP INDEX IF EXISTS idx_users_phone;
-- ALTER TABLE auth.users DROP COLUMN IF EXISTS phone;
```

### Modifying a Column
```sql
-- Migration: Increase email field length
-- Created: 2024-12-20T14:30:22.000Z

-- First, add the new column
ALTER TABLE auth.users 
ADD COLUMN email_new VARCHAR(500);

-- Copy data
UPDATE auth.users SET email_new = email;

-- Drop old column and rename new one
ALTER TABLE auth.users DROP COLUMN email;
ALTER TABLE auth.users RENAME COLUMN email_new TO email;

-- ROLLBACK:
-- ALTER TABLE auth.users ALTER COLUMN email TYPE VARCHAR(255);
```

## Troubleshooting

### Migration Fails
1. Check the error message for specific issues
2. Verify database connection and permissions
3. Check if the migration has already been partially applied
4. Manually fix the database state if needed
5. Update the migration file and try again

### Duplicate Migration Numbers
If you see duplicate migration numbers:
1. Check the migration files in `database/migrations/`
2. Rename files to follow the timestamp convention
3. Update the migration tracking table if needed

### Rollback Issues
1. Check the rollback instructions in the migration file
2. Manually execute the rollback SQL
3. Update the migration tracking table to remove the failed migration

## Development Workflow

1. **Create Migration**: `npm run migrate:create "description"`
2. **Edit Migration**: Add your SQL to the generated file
3. **Test Migration**: `npm run migrate:up`
4. **Test Rollback**: `npm run migrate:down`
5. **Commit Changes**: Include both migration file and any related code changes

## Production Deployment

1. **Backup Database**: Always backup before running migrations
2. **Test on Staging**: Run migrations on staging environment first
3. **Monitor Performance**: Watch for long-running migrations
4. **Rollback Plan**: Have a rollback plan ready
5. **Deploy Code**: Deploy application code after successful migration

## Migration Checklist

Before creating a migration:
- [ ] Is this change backwards compatible?
- [ ] Have I tested this on a copy of production data?
- [ ] Do I have a rollback plan?
- [ ] Are there any data migration requirements?
- [ ] Will this migration take a long time to run?

Before deploying a migration:
- [ ] Database backup completed
- [ ] Migration tested on staging
- [ ] Rollback procedure verified
- [ ] Team notified of deployment
- [ ] Monitoring in place for migration execution
