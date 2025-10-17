# Database Migration System

## 🎯 Overview

Your codebase now has a **production-ready migration system** that follows industry best practices. This system provides:

- ✅ **Automatic migration detection** and application
- ✅ **Safety checks** to prevent data corruption
- ✅ **Rollback capabilities** with user confirmation
- ✅ **Migration tracking** with checksums
- ✅ **Cursor integration** for seamless development

## 🚀 Quick Start

### Apply Migrations
```bash
# Apply all pending migrations
npm run migrate

# Check migration status
npm run migrate:list
```

### Rollback Migrations
```bash
# Rollback last migration (with confirmation)
npm run rollback

# List recent migrations and rollback availability
npm run rollback:list
```

### Database Documentation
```bash
# Update DATABASE.md with current schema
npm run db:snapshot
```

## 📁 File Structure

```
backend/
├── migrations/                    # Migration files
│   ├── README.md                 # Migration guidelines
│   └── 2025-01-17_1430_example_migration.sql
├── scripts/
│   ├── migrate.js               # Main migration runner
│   └── rollback.js              # Rollback script
└── package.json                 # Updated with migration scripts
```

## 🔧 Migration File Format

### Naming Convention
```
YYYY-MM-DD_HHMM_description.sql
```

Examples:
- `2025-01-17_1430_add_instagram_url.sql`
- `2025-01-20_0915_add_appointments_index.sql`

### File Structure
```sql
-- Description of what this migration does
ALTER TABLE tenants.business ADD COLUMN instagram_url TEXT;

-- ROLLBACK:
-- ALTER TABLE tenants.business DROP COLUMN instagram_url;
```

## 🛡️ Safety Features

### Migration Tracking
- All applied migrations stored in `system.schema_migrations`
- MD5 checksums prevent content changes
- Timestamp tracking for audit trails

### Rollback Safety
- Requires explicit user confirmation
- Uses stored rollback SQL from migration files
- Transaction-wrapped for atomicity

### Content Validation
- Prevents double-application of migrations
- Warns if migration content has changed
- Skips already-applied migrations safely

## 🎨 Cursor Integration

The system is fully integrated with Cursor's AI assistance:

- **Auto-suggestions** for migration files when you mention schema changes
- **Automatic commands** to run migrations after file creation
- **Pattern recognition** for migration file structure
- **Safety reminders** about testing and rollback procedures

## 📋 Development Workflow

### 1. Create Migration
```bash
# Cursor will suggest creating a migration file
# File: backend/migrations/2025-01-17_1430_add_column.sql
```

### 2. Apply Migration
```bash
npm run migrate
```

### 3. Update Documentation
```bash
npm run db:snapshot
```

### 4. Commit Changes
```bash
git add backend/migrations/
git commit -m "Add Instagram URL column to business table"
```

## 🔄 Production Deployment

### CI/CD Integration
Add to your deployment pipeline:
```bash
npm run migrate && npm run db:snapshot
```

### Manual Production
```bash
# Always backup first!
pg_dump your_database > backup_$(date +%Y%m%d_%H%M%S).sql

# Apply migrations
npm run migrate

# Verify with status check
npm run migrate:list
```

## ⚠️ Important Notes

### Never Modify Applied Migrations
- Once committed, migration files are immutable
- Changes require new migration files
- System tracks checksums to prevent corruption

### Always Test First
- Test migrations on staging environment
- Verify rollback procedures work
- Check data integrity after application

### Backup Before Major Changes
- Always backup production data
- Test rollback procedures
- Have recovery plan ready

## 🎯 Best Practices

1. **One change per migration** - Keep migrations focused
2. **Include rollback SQL** - Always provide rollback instructions
3. **Test thoroughly** - Verify both forward and rollback
4. **Document changes** - Clear comments in migration files
5. **Backup first** - Especially for production deployments

## 🚨 Emergency Procedures

### If Migration Fails
1. Check error message in console
2. Fix the SQL in migration file
3. Re-run `npm run migrate`
4. System will skip already-applied parts

### If Rollback Needed
1. Run `npm run rollback:list` to see options
2. Run `npm run rollback` for last migration
3. Confirm when prompted
4. Verify data integrity

### If System Corrupted
1. Restore from backup
2. Check `system.schema_migrations` table
3. Manually fix migration tracking if needed
4. Re-run migrations from clean state

## 📊 Monitoring

### Check Migration Status
```bash
npm run migrate:list
```

### View Applied Migrations
```sql
SELECT * FROM system.schema_migrations ORDER BY applied_at DESC;
```

### Verify Schema Changes
```bash
npm run db:snapshot
```

---

## 🎉 You're All Set!

Your migration system is now ready for production use. The combination of safety features, Cursor integration, and clear workflows will make database changes smooth and reliable.

**Next Steps:**
1. Test the system with the example migration
2. Create your first real migration
3. Set up CI/CD integration
4. Train your team on the workflow

Happy migrating! 🚀
