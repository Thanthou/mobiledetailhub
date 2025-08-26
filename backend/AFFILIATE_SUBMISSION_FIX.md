# Affiliate Submission Fix

## Issue
The affiliate application page was spinning indefinitely after submission due to a database error.

## Root Cause
The SQL INSERT query was missing the required `services` column, causing a database constraint violation.

### Before (Broken)
```sql
INSERT INTO affiliates (
  slug, business_name, owner, phone, sms_phone, email, 
  base_address_id, website_url, gbp_url, 
  facebook_url, instagram_url, youtube_url, tiktok_url,
  has_insurance, source, notes, application_status
) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
```

### After (Fixed)
```sql
INSERT INTO affiliates (
  slug, business_name, owner, phone, sms_phone, email, 
  base_address_id, services, website_url, gbp_url, 
  facebook_url, instagram_url, youtube_url, tiktok_url,
  has_insurance, source, notes, application_status
) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
```

## Changes Made

### 1. Backend Route Fix (`backend/routes/affiliates.js`)
- Added missing `services` column to INSERT query
- Added logic to convert `categories` array to services JSONB format
- Added better logging for debugging
- Fixed parameter count mismatch (17 → 18)

### 2. Frontend API Improvements (`frontend/src/pages/affiliateOnboarding/api.ts`)
- Added comprehensive logging for debugging
- Added 30-second timeout to prevent infinite spinning
- Better error handling for timeout and network errors

### 3. Test Script (`backend/test-affiliate-endpoint.js`)
- Created test script to verify endpoint functionality
- Added `node-fetch` dependency for testing

## Testing
1. Start the backend server: `npm run dev`
2. Run the test script: `node test-affiliate-endpoint.js`
3. Check console logs for any errors

## Troubleshooting
If the issue persists:

1. **Check Backend Server**: Ensure backend is running on port 3001
2. **Check Database**: Verify PostgreSQL connection and table structure
3. **Check Console**: Look for error messages in browser console and backend logs
4. **Test Endpoint**: Use the test script to isolate backend issues

## Database Schema
The `affiliates` table requires:
- `services` JSONB column (NOT NULL)
- Default value: `{"rv": false, "ppf": false, "auto": false, "boat": false, "ceramic": false, "paint_correction": false}`

## Categories to Services Mapping
The frontend `categories` array is converted to the backend `services` JSONB format:
```javascript
const servicesJson = {
  rv: categories.includes('rv'),
  ppf: categories.includes('ppf'),
  auto: categories.includes('auto'),
  boat: categories.includes('boat'),
  ceramic: categories.includes('ceramic'),
  paint_correction: categories.includes('paint_correction')
};
```
