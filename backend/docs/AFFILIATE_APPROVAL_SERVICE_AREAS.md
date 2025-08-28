# Affiliate Approval with Service Areas

## Overview

When an admin approves an affiliate and assigns them a slug, the system automatically updates the `affiliate_service_areas` table and creates corresponding `service_area_slugs` entries. This implements a clean, transaction-safe pattern for managing affiliate service coverage.

## Database Schema

### Updated Tables

#### `affiliate_service_areas` (Normalized)
```sql
CREATE TABLE affiliate_service_areas (
  id           SERIAL PRIMARY KEY,
  affiliate_id INT NOT NULL REFERENCES affiliates(id) ON DELETE CASCADE,
  city_id      INT NOT NULL REFERENCES cities(id) ON DELETE CASCADE,
  zip          VARCHAR(20),
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT uq_aff_sa UNIQUE (affiliate_id, city_id, zip)
);
```

#### `service_area_slugs` (Normalized)
```sql
CREATE TABLE service_area_slugs (
  id         SERIAL PRIMARY KEY,
  slug       VARCHAR(255) NOT NULL UNIQUE,
  city_id    INT NOT NULL REFERENCES cities(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Key Changes from Previous Schema
- ✅ **Normalized relationships**: Uses `city_id` FK instead of denormalized `city`/`state_code`
- ✅ **Proper constraints**: Unique constraint on `(affiliate_id, city_id, zip)`
- ✅ **SEO slugs**: Dedicated table for city page URLs like `/az/phoenix`

## Transaction-Safe Approval Flow

### 1. Approve the Affiliate
```sql
BEGIN;

UPDATE affiliates
SET application_status = 'approved',
    approved_date = NOW()
WHERE id = $1;  -- :affiliate_id
```

### 2. Link Affiliate to Service Areas
```sql
-- Insert one row per city they'll cover
INSERT INTO affiliate_service_areas (affiliate_id, city_id, zip)
SELECT $1, unnest($2::int[])   -- $2 is int[] of city_ids
ON CONFLICT DO NOTHING;
```

### 3. Create Service Area Slugs
```sql
-- Ensure city directory slugs exist for public pages
INSERT INTO service_area_slugs (slug, city_id)
SELECT lower(c.state_code) || '/' || c.city_slug, c.id
FROM cities c
WHERE c.id = ANY($2::int[])
ON CONFLICT DO NOTHING;

COMMIT;
```

## Implementation Details

### Service Area Processor
The `processAffiliateServiceAreas()` function handles:
- ✅ **City lookup**: Finds city IDs from name/state combinations
- ✅ **Service area mapping**: Creates `affiliate_service_areas` entries
- ✅ **SEO slug creation**: Generates public URLs like `/az/phoenix`
- ✅ **Transaction safety**: All operations in single transaction
- ✅ **Conflict handling**: Uses `ON CONFLICT DO NOTHING` for idempotency

### Admin Approval Endpoint
The `/admin/approve-application/:id` endpoint:
- ✅ **Validates input**: Slug format, admin notes, service areas
- ✅ **Updates affiliate**: Sets status, slug, approved_date
- ✅ **Creates user account**: Generates temporary password
- ✅ **Processes service areas**: Calls service area processor
- ✅ **Audit logging**: Records all changes for compliance

## Usage Examples

### Frontend Service Areas Data
```typescript
const serviceAreas = [
  { city: 'Phoenix', state: 'AZ', zip: '85001' },
  { city: 'Tempe', state: 'AZ', zip: '85281' },
  { city: 'Mesa', state: 'AZ', zip: '85201' }
];
```

### Backend Processing
```javascript
// Service areas are automatically processed during approval
const result = await processAffiliateServiceAreas(affiliateId, serviceAreas);
// Returns: { processed: 3, errors: [], cityIds: 3 }
```

## Migration

### Running the Migration
```bash
cd backend
node scripts/migrateServiceAreas.js
```

### What the Migration Does
1. **Creates new tables** with normalized schema
2. **Migrates existing data** from old denormalized format
3. **Verifies integrity** of migrated data
4. **Replaces old tables** with new normalized ones
5. **Recreates indexes** for optimal performance

## Testing

### Run Test Script
```bash
cd backend
node scripts/testAffiliateApproval.js
```

### Test Coverage
- ✅ **Affiliate creation** and approval
- ✅ **Service area processing** with multiple cities
- ✅ **Transaction safety** and rollback scenarios
- ✅ **Data verification** and cleanup
- ✅ **Error handling** and edge cases

## Benefits

### Data Integrity
- ✅ **Normalized relationships**: No duplicate city/state data
- ✅ **Referential integrity**: Proper foreign key constraints
- ✅ **Transaction safety**: All-or-nothing operations

### Performance
- ✅ **Efficient queries**: Direct city_id lookups
- ✅ **Proper indexing**: Optimized for common access patterns
- ✅ **Reduced storage**: No denormalized data duplication

### SEO & Public Pages
- ✅ **Clean URLs**: `/az/phoenix` instead of complex parameters
- ✅ **City directories**: Public pages showing all affiliates in area
- ✅ **Slug management**: Automatic slug generation and conflict resolution

## Troubleshooting

### Common Issues
1. **City not found**: Ensure cities exist in `cities` table
2. **Duplicate slugs**: Check for existing slug conflicts
3. **Transaction failures**: Verify database connectivity and constraints

### Debug Queries
```sql
-- Check affiliate service areas
SELECT 
  a.business_name,
  c.name as city,
  c.state_code,
  asa.zip
FROM affiliate_service_areas asa
JOIN affiliates a ON a.id = asa.affiliate_id
JOIN cities c ON c.id = asa.city_id
WHERE a.id = :affiliate_id;

-- Check service area slugs
SELECT 
  sas.slug,
  c.name as city,
  c.state_code
FROM service_area_slugs sas
JOIN cities c ON c.id = sas.city_id
ORDER BY c.name;
```

## Future Enhancements

### Potential Improvements
- **Bulk operations**: Process multiple affiliates simultaneously
- **Service area templates**: Predefined coverage patterns
- **Geographic validation**: Ensure service areas make logical sense
- **Performance monitoring**: Track approval processing times
