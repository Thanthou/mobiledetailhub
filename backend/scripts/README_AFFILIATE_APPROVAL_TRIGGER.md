# Affiliate Approval Trigger System

## Overview
This system automatically populates the `affiliate_service_areas` table when affiliate applications are approved, ensuring the main site can immediately show approved cities as "served."

## Problem
Currently, when affiliate applications are approved, the `affiliate_service_areas` table is not populated, so the main site cannot find affiliates by location.

## Solution
A PostgreSQL trigger function that automatically runs when `application_status` changes to 'approved' and populates service areas based on the affiliate's `base_location` data.

## Files
1. **`create_affiliate_approval_trigger.sql`** - Creates the trigger function and trigger
2. **`backfill_affiliate_service_areas.sql`** - Backfills service areas for existing approved affiliates

## Implementation Steps

### Step 1: Create the Trigger Function
Run the first script to create the trigger:
```bash
psql -d your_database -f create_affiliate_approval_trigger.sql
```

### Step 2: Backfill Existing Data
Run the second script to populate service areas for any already-approved affiliates:
```bash
psql -d your_database -f backfill_affiliate_service_areas.sql
```

## How It Works

### Trigger Function
- **Triggers on**: `UPDATE` to `affiliates` table
- **Condition**: `application_status` changes to 'approved'
- **Action**: Extracts city/state/zip from `base_location` JSONB and inserts into `affiliate_service_areas`

### Service Area Coverage
- **City-wide coverage**: `zip = NULL` means the affiliate serves the entire city
- **Specific ZIP coverage**: If a ZIP is provided, it's also added as a separate record
- **Conflict handling**: Uses `ON CONFLICT DO NOTHING` to prevent duplicates

## Example
When an affiliate with `base_location: {"city": "Bullhead City", "state": "AZ", "zip": "86442"}` is approved:

1. **City coverage**: `(affiliate_id, "AZ", "Bullhead City", NULL)` - serves entire city
2. **ZIP coverage**: `(affiliate_id, "AZ", "Bullhead City", "86442")` - serves specific ZIP

## Benefits
- ✅ **Immediate visibility**: Approved cities appear as "served" instantly
- ✅ **Automatic**: No manual intervention required
- ✅ **Consistent**: All approved affiliates get proper service area coverage
- ✅ **Backward compatible**: Works with existing data

## Testing
After implementation, test by:
1. Approving a new affiliate application
2. Checking that `affiliate_service_areas` gets populated
3. Verifying the main site can find the affiliate by location

## Troubleshooting
- Check PostgreSQL logs for trigger function notices
- Verify trigger exists: `SELECT * FROM information_schema.triggers WHERE trigger_name = 'on_affiliate_approved_seed_area';`
- Check service areas: `SELECT * FROM affiliate_service_areas ORDER BY created_at DESC;`
