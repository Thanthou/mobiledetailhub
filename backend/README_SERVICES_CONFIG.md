# Configurable Services Description

## Overview
The FAQ component now uses a configurable services description instead of hardcoded text. This allows administrators to customize the service description displayed in the FAQ header without code changes.

## Database Changes
A new `services_description` column has been added to the `mdh_config` table.

### Migration
Run the migration script to add the column to existing databases:
```sql
-- Run the script: backend/scripts/add_services_description.sql
```

### Default Value
The default value is: `'auto detailing, boat & RV detailing, ceramic coating, and PPF'`

## Configuration
The services description can be updated through:

1. **Database Update**: Direct SQL update to the `mdh_config` table
2. **Admin Dashboard**: Future enhancement to allow admin updates
3. **API Endpoint**: Use the existing `/api/mdh-config` endpoint

### Example SQL Update
```sql
UPDATE mdh_config 
SET services_description = 'Your custom service description here'
WHERE id = 1;
```

## Frontend Usage
The FAQ component automatically uses the configured value from `mdhConfig.services_description` with a fallback to the default description if not configured.

## Benefits
- **No Code Changes**: Update service descriptions without deploying code
- **Consistent**: Uses the same configuration system as other MDH settings
- **Fallback Safe**: Always has a default value if configuration is missing
- **Admin Friendly**: Can be managed through database or future admin tools
