# Database Schema Consistency Fixes

## Overview

This document outlines the fixes applied to resolve database schema inconsistencies between `backend/utils/databaseInit.js` and the actual database schema export.

## Issues Identified

### 1. **base_location vs base_address_id Inconsistency**

**Problem**: 
- `databaseInit.js` created `base_location` as JSONB in affiliates table
- Schema export showed `base_address_id` as integer foreign key to addresses table

**Root Cause**: 
The `databaseInit.js` file was using a simplified schema that didn't match the comprehensive schema defined in `backend/scripts/schema_init.sql`.

### 2. **Missing Tables**

**Problem**: 
Schema export showed 21 tables but `databaseInit.js` only created basic tables.

**Missing Tables**:
- `addresses` - For affiliate base locations
- `availability` - For scheduling
- `bookings` - For appointments
- `quotes` - For service estimates
- `services` - For service offerings
- `service_tiers` - For pricing tiers
- `location` - For platform integrations
- `reviews` - For customer reviews
- `review_reply` - For review responses
- `review_sync_state` - For review synchronization
- `cities` - For geographic data
- `service_area_slugs` - For marketing URLs

## Fixes Applied

### 1. **Updated databaseInit.js**

**Changes Made**:
- ✅ Replaced simplified schema with comprehensive schema matching `schema_init.sql`
- ✅ Added proper `base_address_id` foreign key to addresses table
- ✅ Added all missing tables with correct structure
- ✅ Added proper enum types (user_role, service_category, etc.)
- ✅ Added proper triggers and indexes
- ✅ Added utility functions (set_updated_at, slugify)
- ✅ Added database views for common queries
- ✅ Added proper foreign key constraints

**Key Improvements**:
- **Normalized Address Structure**: Uses proper `addresses` table with foreign key relationships
- **Complete Table Set**: All 21 tables from schema export are now created
- **Proper Data Types**: Uses TIMESTAMPTZ, CITEXT, and proper constraints
- **Enum Support**: All custom enum types are properly defined
- **View Support**: Common query views are automatically created

### 2. **Migration Script**

**Created**: `backend/scripts/migrate_base_location_to_addresses.sql`

**Purpose**: Safely migrate existing data from old `base_location` JSONB to new `base_address_id` foreign key structure.

**Migration Steps**:
1. Create `addresses` table if it doesn't exist
2. Add `base_address_id` column to affiliates table
3. Extract data from `base_location` JSONB and create address records
4. Update affiliates to link to newly created addresses
5. Create backup of old data before dropping column
6. Add proper foreign key constraints

### 3. **Migration Runner**

**Created**: `backend/scripts/runBaseLocationMigration.js`

**Features**:
- Safe execution with error handling
- Verification of migration results
- Detailed reporting of migration status
- Warning for any data that needs manual attention

## Schema Structure

### Core Tables
```
users → customers
users → affiliates
affiliates → addresses (via base_address_id)
affiliates → services
affiliates → bookings
affiliates → quotes
affiliates → availability
affiliates → location
```

### Service Structure
```
services → service_tiers
affiliates → affiliate_service_areas
```

### Review Structure
```
location → reviews → review_reply
location → review_sync_state
```

## Usage

### For New Installations
```javascript
const { setupDatabase } = require('./utils/databaseInit');
await setupDatabase();
```

### For Existing Installations (Migration)
```bash
cd backend/scripts
node runBaseLocationMigration.js
```

## Verification

After running the migration, verify the schema consistency:

```sql
-- Check that addresses table exists and has data
SELECT COUNT(*) FROM addresses;

-- Check that affiliates have base_address_id populated
SELECT COUNT(*) FROM affiliates WHERE base_address_id IS NOT NULL;

-- Verify foreign key relationships
SELECT 
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS foreign_table_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_name = 'affiliates';
```

## Benefits

1. **Data Integrity**: Proper foreign key relationships ensure data consistency
2. **Normalization**: Address data is properly normalized and reusable
3. **Scalability**: Schema supports all planned features (bookings, reviews, etc.)
4. **Maintainability**: Consistent schema across all environments
5. **Performance**: Proper indexes and constraints optimize queries

## Next Steps

1. **Application Code Updates**: Update any code that references `base_location` to use the new `base_address_id` structure
2. **Testing**: Verify all functionality works with the new schema
3. **Data Cleanup**: Once confirmed working, run the final migration step to drop the old `base_location` column
4. **Documentation**: Update API documentation to reflect the new data structure

## Rollback Plan

If issues arise, the migration script creates a backup table `affiliates_backup_base_location` containing the original `base_location` data. To rollback:

```sql
-- Restore base_location data if needed
UPDATE affiliates 
SET base_location = backup.base_location
FROM affiliates_backup_base_location backup
WHERE affiliates.id = backup.id;
```
