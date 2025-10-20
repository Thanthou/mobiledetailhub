# FAQ Items Database Population Implementation

## Overview

Implemented automatic population of the `faq_items` JSONB column in the `website.content` table during tenant onboarding. The system now loads industry-specific FAQ data from JSON files and stores it in the database as the default, which tenants can later customize.

## Changes Made

### 1. Frontend - Load Defaults Utility (`frontend/src/shared/utils/loadDefaults.ts`)

**Changes:**
- Added `FAQItem` interface with `category`, `question`, and `answer` fields
- Updated `IndustryDefaults` interface to include `faqItems: FAQItem[]`
- Created `loadFAQItems()` function to load all FAQ categories for an industry
- Updated `loadDefaults()` to include FAQ items in the returned defaults

**How it works:**
```typescript
// Loads all FAQ category files (general, services, pricing, etc.)
// and combines them into a single array
const faqItems = await loadFAQItems('mobile-detailing');

// Returns structure:
{
  content: { hero: {...}, reviews: {...}, faq: {...} },
  seo: { title: '...', description: '...', ... },
  faqItems: [
    { category: 'General', question: '...', answer: '...' },
    { category: 'Services', question: '...', answer: '...' },
    // ... more FAQs
  ]
}
```

### 2. Backend - Tenant Signup Route (`backend/routes/tenants.js`)

**Changes:**
- Extract `faqItems` from the `defaults` object sent by frontend
- Added `faq_items` column to the INSERT statement
- Store FAQ items as JSONB: `JSON.stringify(faqItems)`

**SQL Insert:**
```sql
INSERT INTO website.content (
  business_id, hero_title, hero_subtitle,
  reviews_title, reviews_subtitle,
  faq_title, faq_subtitle, faq_items,  -- ← Added
  seo_title, seo_description, ...
)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, ...)
```

### 3. Backend - Website Content API (`backend/routes/websiteContent.js`)

**Changes:**
- Renamed `faq_content` → `faq_items` throughout the file
- Updated INSERT/UPDATE queries to use `faq_items`
- Updated GET response to return `faq_items` instead of `faq_content`

### 4. Frontend - Type Definitions (`frontend/src/shared/api/websiteContent.api.ts`)

**Changes:**
- Updated `WebsiteContentData` interface: `faq_content` → `faq_items`

### 5. Frontend - FAQ Content Hook (`frontend/src/features/faq/hooks/useFAQContent.ts`)

**Changes:**
- Updated to read from `websiteContent?.faq_items` instead of `faq_content`
- FAQ priority system remains:
  1. **Database FAQs** (if tenant has customized)
  2. **Industry-specific FAQs** (fallback from JSON files)
  3. **Location FAQs** (appended if available)

## Data Flow

### During Tenant Onboarding:

```
1. User submits signup form
   ↓
2. Frontend loads industry defaults (including FAQ items)
   await loadDefaults('mobile-detailing')
   ↓
3. Frontend sends defaults to backend in signup request
   POST /api/tenants/signup { ..., defaults: { content, seo, faqItems } }
   ↓
4. Backend inserts FAQ items into database
   INSERT INTO website.content (..., faq_items)
   VALUES (..., '[ {...}, {...}, ... ]')
   ↓
5. Tenant site created with default FAQs in database
```

### At Runtime (Displaying FAQs):

```
1. Page loads → useFAQContent() hook
   ↓
2. WebsiteContentContext fetches website.content from DB
   ↓
3. Hook checks for faq_items in database
   ↓
4a. If faq_items exist → Use database FAQs
   ↓
4b. If faq_items empty/null → Fallback to industry JSON files
   ↓
5. Render FAQ component with selected data
```

## Database Schema

The `faq_items` column in `website.content`:

```sql
faq_items JSONB DEFAULT '[]'::jsonb
```

**Structure:**
```json
[
  {
    "category": "General",
    "question": "What is mobile detailing?",
    "answer": "Mobile detailing brings..."
  },
  {
    "category": "Services",
    "question": "What services do you offer?",
    "answer": "We provide complete..."
  }
]
```

## FAQ Categories Loaded

The system loads FAQs from these category files (per industry):

1. `general.json` - General information
2. `services.json` - Service-related questions
3. `pricing.json` - Pricing and cost questions
4. `scheduling.json` - Booking and scheduling
5. `locations.json` - Service area questions
6. `preparation.json` - Pre-service preparation
7. `payments.json` - Payment methods and policies
8. `warranty.json` - Warranties and guarantees
9. `aftercare.json` - Post-service care

**Note:** If a category file doesn't exist for an industry, it's silently skipped.

## Example: Mobile Detailing FAQs

When a mobile detailing tenant signs up, they get **69 FAQ items** across 9 categories by default:

- General: 6 items
- Services: 13 items
- Pricing: 6 items
- Scheduling: 6 items
- Locations: 6 items
- Preparation: 6 items
- Payments: 6 items
- Warranty: 6 items
- Aftercare: 5 items

## Customization

Tenants can customize their FAQs in two ways:

1. **Dashboard Editor** - Edit `faq_items` through the website content management interface
2. **Database Direct** - Update the `faq_items` JSONB column directly

Once customized, the database version takes precedence over the industry JSON files.

## Benefits

✅ **Single Source of Truth** - FAQ data lives in database after onboarding
✅ **Tenant Customization** - Each tenant can modify their FAQs independently
✅ **Industry Defaults** - New tenants start with relevant, industry-specific FAQs
✅ **Fallback Support** - Still loads from JSON files if database is empty
✅ **No Runtime Overhead** - No need to load multiple JSON files per request

## Migration Notes

**Existing Tenants:** Current tenants have `faq_items = []` in the database. They will continue to see industry-specific FAQs loaded from JSON files until they customize their FAQs through the dashboard.

**New Tenants:** Will automatically receive default FAQ items populated in the database during signup.

## Testing

To test the implementation:

1. **Create New Tenant:**
   ```bash
   # Sign up a new tenant through /tenant-onboarding
   # Check database: SELECT faq_items FROM website.content WHERE business_id = X;
   # Should see array of FAQ objects
   ```

2. **Verify FAQ Display:**
   ```bash
   # Visit tenant site FAQ section
   # Should display all default FAQs from database
   ```

3. **Test Customization:**
   ```bash
   # Edit FAQs in tenant dashboard
   # Verify changes persist and display on site
   ```

## Files Modified

### Frontend:
- `frontend/src/shared/utils/loadDefaults.ts` - Load FAQ items during provisioning
- `frontend/src/shared/api/websiteContent.api.ts` - Type definitions updated
- `frontend/src/features/faq/hooks/useFAQContent.ts` - Use database faq_items

### Backend:
- `backend/routes/tenants.js` - Populate faq_items during signup
- `backend/routes/websiteContent.js` - Handle faq_items in API

### Database:
- `website.content.faq_items` column (already existed, now being populated)

## Future Enhancements

Potential improvements:

1. **FAQ Dashboard Editor** - Visual editor for adding/removing/reordering FAQs
2. **FAQ Analytics** - Track which FAQs are most viewed/helpful
3. **FAQ Search** - Allow customers to search FAQs
4. **FAQ A/B Testing** - Test different FAQ wording for conversions
5. **FAQ Categories UI** - Allow tenants to add custom categories

---

**Implementation Date:** October 15, 2025
**Status:** ✅ Complete

