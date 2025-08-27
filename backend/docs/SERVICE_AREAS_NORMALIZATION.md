# Service Areas Normalization Migration

## Overview

This migration normalizes the `affiliate_service_areas` table by replacing free-text `city` and `state_code` columns with a proper foreign key relationship to the `cities` table. This prevents data drift and ensures referential integrity.

## Problem

The previous structure had several issues:
- **Data Drift**: Free-text city names could have typos, variations, or inconsistencies
- **No Referential Integrity**: No guarantee that cities exist in the cities table
- **Duplicate Data**: Same city/state combinations stored multiple times
- **Maintenance Issues**: Hard to update city names across all service areas

## Solution

Replace the free-text approach with a normalized structure:
- `affiliate_service_areas.city_id` → Foreign key to `cities.id`
- `cities` table becomes the single source of truth for city names
- Unique constraint on `(affiliate_id, city_id)` prevents duplicates

## Migration Files

### 1. `normalize_service_areas.sql`
The main migration script that:
- Adds `city_id` column
- Populates cities table with existing data
- Updates service areas to use city_id
- Drops old columns
- Adds constraints and indexes
- Creates helper functions and views

### 2. `run_service_areas_normalization.js`
Node.js script to run the migration with:
- Pre-flight checks
- Error handling
- Verification
- Rollback capability

## How to Run

### Option 1: Using Node.js Script (Recommended)
```bash
cd backend/scripts
node run_service_areas_normalization.js
```

### Option 2: Direct SQL Execution
```bash
psql -d your_database -f normalize_service_areas.sql
```

## What the Migration Does

### Step 1: Add city_id Column
```sql
ALTER TABLE affiliate_service_areas ADD COLUMN city_id BIGINT;
```

### Step 2: Populate Cities Table
```sql
INSERT INTO cities (name, city_slug, state_code)
SELECT DISTINCT asa.city, slugify(asa.city), asa.state_code
FROM affiliate_service_areas asa
WHERE NOT EXISTS (
  SELECT 1 FROM cities c 
  WHERE c.name = asa.city AND c.state_code = asa.state_code
);
```

### Step 3: Update Service Areas
```sql
UPDATE affiliate_service_areas 
SET city_id = c.id
FROM cities c
WHERE affiliate_service_areas.city = c.name 
  AND affiliate_service_areas.state_code = c.state_code;
```

### Step 4: Add Constraints
```sql
ALTER TABLE affiliate_service_areas 
ADD CONSTRAINT fk_affiliate_service_areas_city_id 
FOREIGN KEY (city_id) REFERENCES cities(id) ON DELETE CASCADE;

ALTER TABLE affiliate_service_areas 
ADD CONSTRAINT uq_affiliate_service_areas_affiliate_city 
UNIQUE (affiliate_id, city_id);
```

### Step 5: Clean Up
```sql
ALTER TABLE affiliate_service_areas 
DROP COLUMN city,
DROP COLUMN state_code;
```

## New Structure

### Before (Old Structure)
```sql
CREATE TABLE affiliate_service_areas (
  id           SERIAL PRIMARY KEY,
  affiliate_id INT NOT NULL REFERENCES affiliates(id),
  city         VARCHAR(100) NOT NULL,        -- Free text
  state_code   CHAR(2) NOT NULL,            -- Free text
  zip          VARCHAR(20),
  created_at   TIMESTAMPTZ DEFAULT NOW()
);
```

### After (New Structure)
```sql
CREATE TABLE affiliate_service_areas (
  id           SERIAL PRIMARY KEY,
  affiliate_id INT NOT NULL REFERENCES affiliates(id),
  city_id      BIGINT NOT NULL REFERENCES cities(id),
  zip          VARCHAR(20),
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT uq_affiliate_service_areas_affiliate_city 
    UNIQUE (affiliate_id, city_id)
);
```

## Helper Functions

### `add_affiliate_service_area(affiliate_id, city_name, state_code, zip)`
Automatically finds or creates a city and adds the service area.

### `remove_affiliate_service_area(affiliate_id, city_name, state_code)`
Removes a service area by city name lookup.

### `get_affiliate_service_areas(affiliate_id)`
Returns service areas with city details for an affiliate.

## Backward Compatibility

### View: `affiliate_service_areas_view`
```sql
CREATE VIEW affiliate_service_areas_view AS
SELECT 
  asa.id,
  asa.affiliate_id,
  c.name as city,
  c.state_code,
  asa.zip,
  asa.created_at
FROM affiliate_service_areas asa
JOIN cities c ON asa.city_id = c.id;
```

This view provides the same interface as the old table structure.

## Updated Routes

### Affiliates Route
- Creates cities automatically when adding service areas
- Uses `city_id` for inserts
- Handles conflicts gracefully

### Service Areas Route
- Joins with cities table for lookups
- Returns city names from normalized data
- Maintains same API interface

## Benefits

✅ **Data Consistency**: No more typos or variations in city names  
✅ **Referential Integrity**: All cities must exist in cities table  
✅ **Performance**: Better indexing on integer city_id  
✅ **Maintenance**: Update city name once, affects all service areas  
✅ **Scalability**: Efficient joins and lookups  
✅ **Data Quality**: Automatic city slug generation and validation  

## Verification

After migration, verify:
```sql
-- Check table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'affiliate_service_areas';

-- Check data integrity
SELECT COUNT(*) FROM affiliate_service_areas;
SELECT COUNT(*) FROM cities;

-- Test view
SELECT * FROM affiliate_service_areas_view LIMIT 5;

-- Test functions
SELECT add_affiliate_service_area(1, 'New York', 'NY', '10001');
```

## Rollback

If issues occur, the migration can be rolled back:
```sql
-- Restore old structure (if needed)
ALTER TABLE affiliate_service_areas 
ADD COLUMN city VARCHAR(100),
ADD COLUMN state_code CHAR(2);

-- Update with data from view
UPDATE affiliate_service_areas 
SET city = v.city, state_code = v.state_code
FROM affiliate_service_areas_view v
WHERE affiliate_service_areas.id = v.id;
```

## Notes

- **Backup**: Always backup your database before running migrations
- **Testing**: Test on staging environment first
- **Downtime**: Minimal downtime, but plan for brief maintenance window
- **Dependencies**: Requires `cities` table and `slugify` function from schema_init.sql
