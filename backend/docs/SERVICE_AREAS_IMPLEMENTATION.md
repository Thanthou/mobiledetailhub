# Service Areas Implementation

## Overview

This system creates the two key relationships needed for affiliate service areas:

1. **Affiliate ↔ City** (`affiliate_service_areas`) - Who serves where
2. **City ↔ SEO Slug** (`service_area_slugs`) - Clean URLs for directory pages

## Database Tables

### `affiliate_service_areas`
- **Purpose**: Maps affiliates to cities they serve
- **Structure**: `(affiliate_id, city_id, zip)` 
- **Unique**: `(affiliate_id, city_id)` - one affiliate can serve one city once
- **ZIP**: Optional, for granular coverage

### `service_area_slugs`
- **Purpose**: SEO-friendly URLs for city directory pages
- **Structure**: `(slug, city_id)`
- **Unique**: `slug` - one slug per city
- **Format**: `{state}/{city-slug}` (e.g., `az/bullhead-city`)

## How It Works

### 1. Admin Approval Process

When an admin approves an affiliate, they can specify service areas:

```javascript
POST /api/admin/approve-application/:id
{
  "approved_slug": "bullhead-mobile-detail",
  "admin_notes": "Great coverage area",
  "service_areas": [
    { "city": "Bullhead City", "state": "AZ", "zip": "86442" },
    { "city": "Kingman", "state": "AZ", "zip": "86401" },
    { "city": "Laughlin", "state": "NV" }
  ]
}
```

### 2. Automatic Processing

The system automatically:
1. **Finds existing cities** (cities table is pre-populated)
2. **Creates affiliate service area mappings**
3. **Generates SEO slugs** for directory pages

### 3. SQL Operations

```sql
-- 1) Approve the affiliate
UPDATE affiliates
SET application_status = 'approved', approved_date = NOW()
WHERE id = $1;

-- 2) Create affiliate service area mapping
INSERT INTO affiliate_service_areas (affiliate_id, city_id, zip)
VALUES ($1, $2, $3)
ON CONFLICT (affiliate_id, city_id) DO NOTHING;

-- 3) Create SEO slug for the service area
INSERT INTO service_area_slugs (slug, city_id)
VALUES ($1, $2)
ON CONFLICT (slug) DO NOTHING;
```

## API Endpoints

### Admin Endpoints

#### Approve Affiliate with Service Areas
```http
POST /api/admin/approve-application/:id
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "approved_slug": "business-name",
  "admin_notes": "Optional notes",
  "service_areas": [
    { "city": "City Name", "state": "ST", "zip": "12345" }
  ]
}
```

#### Get MDH Service Areas
```http
GET /api/admin/mdh-service-areas
Authorization: Bearer <admin-token>
```

### Public Endpoints

#### Get All MDH Coverage
```http
GET /api/service-areas/mdh/coverage
```

**Response:**
```json
{
  "success": true,
  "service_areas": [
    {
      "state_code": "AZ",
      "state_name": "Arizona",
      "city_id": 123,
      "city_name": "Bullhead City",
      "city_slug": "bullhead-city"
    }
  ],
  "count": 1
}
```

#### Get Affiliates for a City
```http
GET /api/service-areas/city/:slug
```

**Example:** `GET /api/service-areas/city/az/bullhead-city`

**Response:**
```json
{
  "success": true,
  "slug": "az/bullhead-city",
  "affiliates": [
    {
      "affiliate_slug": "bullhead-mobile-detail",
      "business_name": "Bullhead Mobile Detail",
      "city": "Bullhead City",
      "state_code": "AZ",
      "city_slug": "bullhead-city"
    }
  ],
  "count": 1
}
```

## Directory Page Routing

### URL Structure
- **City Directory**: `/{state}/{city-slug}` (e.g., `/az/bullhead-city`)
- **Affiliate Landing**: `/a/{affiliate-slug}/{state}/{city-slug}` (e.g., `/a/jps/az/bullhead-city`)

### Query for City Directory
```sql
SELECT a.slug AS affiliate_slug,
       a.business_name,
       c.name AS city,
       c.state_code
FROM service_area_slugs sas
JOIN cities c ON c.id = sas.city_id
JOIN affiliate_service_areas asa ON asa.city_id = c.id
JOIN affiliates a ON a.id = asa.affiliate_id
WHERE sas.slug = 'az/bullhead-city'
  AND a.application_status = 'approved'
ORDER BY a.business_name;
```

## Testing

Run the test script to verify functionality:

```bash
cd backend
node scripts/testServiceAreas.js
```

## Benefits

1. **Automatic Coverage Updates** - No manual city management needed
2. **SEO Ready** - Clean URLs generated automatically  
3. **Data Consistency** - All operations in single transaction
4. **Scalable** - Handles multiple cities per affiliate
5. **Error Resilient** - Service area failures don't prevent approval

## Error Handling

- Service area processing failures don't prevent affiliate approval
- All database operations use transactions for consistency
- Conflicts are handled gracefully with `ON CONFLICT DO NOTHING`
- Detailed logging for debugging

## Future Enhancements

- Bulk affiliate approval with service areas
- Service area templates for common regions
- Geographic clustering for better search
- Coverage analytics and reporting
