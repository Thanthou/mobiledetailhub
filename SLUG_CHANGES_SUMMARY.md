# Slug Generation Changes Summary

## Overview
Removed automatic slug generation during affiliate onboarding. Slugs will now be set later by admins or affiliates themselves.

## Changes Made

### 1. Database Schema Updates
- **File**: `backend/scripts/create_affiliates_table.sql`
- **Change**: Made `slug` field nullable by removing `NOT NULL` constraint
- **File**: `backend/utils/databaseInit.js`
- **Change**: Updated database initialization to make slug nullable

### 2. Backend API Updates
- **File**: `backend/routes/affiliates.js`
- **Changes**:
  - Removed automatic slug generation from business name
  - Set slug to `null` during application submission
  - Removed duplicate slug error handling (no longer needed)
  - Updated INSERT query to handle null slug values

### 3. Admin Management Routes
- **File**: `backend/routes/admin.js`
- **New Routes**:
  - `GET /admin/affiliates/pending-slugs` - View affiliates without slugs
  - `PUT /admin/affiliates/:id/slug` - Set slug for specific affiliate
- **Features**:
  - Slug validation (alphanumeric + hyphens only)
  - Duplicate slug checking
  - Admin dashboard button for pending slugs

### 4. Migration Script
- **File**: `backend/scripts/update_slug_constraint.sql`
- **Purpose**: Update existing databases to remove NOT NULL constraint

## How It Works Now

### During Onboarding
1. Affiliate submits application without slug
2. Application stored with `slug = null`
3. Admin reviews application

### After Approval
1. Admin sets appropriate slug via admin panel
2. Slug follows format: lowercase letters, numbers, hyphens only
3. Affiliate becomes accessible via `/{slug}` route

## Benefits
- More control over affiliate URLs
- Prevents automatic slug conflicts
- Allows for better branding decisions
- Maintains existing routing functionality

## Frontend Impact
- No changes needed to existing affiliate routing
- Dev mode dropdown will show affiliates without slugs as "undefined"
- All existing slug-based functionality preserved

## Next Steps
1. Run migration script on existing databases
2. Admins can now manage affiliate slugs via admin panel
3. Consider adding affiliate self-service slug management in future
