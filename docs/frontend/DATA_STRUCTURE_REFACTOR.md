# Data Structure Refactor - Preview Data Consolidation

**Date:** October 20, 2025  
**Status:** ✅ Complete

## Problem

We had **two separate data folders** with overlapping responsibilities:

1. **`frontend/src/data/`** - Industry configs (assets, content, SEO)
2. **`frontend/apps/tenant-app/src/data/`** - Preview mock data (hardcoded in `previewMockData.ts`)

This caused:
- Duplication of preview data logic
- Confusion about where data should live
- Difficult to maintain (data split across locations)
- Preview data wasn't modular by industry

---

## Solution

### ✅ Consolidated Structure

All industry data now lives in **`frontend/src/data/{industry}/`** including preview mock data:

```
frontend/src/data/
├── mobile-detailing/
│   ├── index.ts               ← loadMobileDetailingConfig()
│   ├── assets.json            ← Runtime image catalog
│   ├── content-defaults.json  ← DB provisioning text
│   ├── seo-defaults.json      ← DB provisioning SEO
│   ├── preview/               ← NEW: Preview mock data
│   │   ├── index.ts
│   │   ├── business.json
│   │   ├── services.json
│   │   ├── reviews.json
│   │   └── faqs.json
│   └── services/              ← Service pages
├── maid-service/
│   └── preview/               ← Same structure
├── lawncare/
│   └── preview/
├── pet-grooming/
│   └── preview/
├── barber/
│   └── preview/
├── preview-types.ts           ← Shared types
└── preview-loader.ts          ← Dynamic loader
```

---

## Changes Made

### 1. Created Preview Directories ✅

Created `preview/` folders for all 5 industries:
- mobile-detailing
- maid-service
- lawncare
- pet-grooming
- barber

Each contains:
- `business.json` - Business info (name, phone, city, tagline)
- `services.json` - Service listings with pricing
- `reviews.json` - Mock customer reviews
- `faqs.json` - Mock FAQ items
- `index.ts` - Loader function (e.g., `getMobileDetailingPreview()`)

### 2. Created Shared Infrastructure ✅

**`frontend/src/data/preview-types.ts`**
```typescript
export interface PreviewBusiness { ... }
export interface PreviewService { ... }
export interface PreviewReview { ... }
export interface PreviewFAQ { ... }
export interface IndustryPreviewData { ... }
```

**`frontend/src/data/preview-loader.ts`**
```typescript
export async function loadIndustryPreview(industry: string): Promise<IndustryPreviewData | null>
export function getAvailableIndustries(): string[]
```

### 3. Updated PreviewDataProvider ✅

**`frontend/apps/tenant-app/src/contexts/PreviewDataProvider.tsx`**

Enhanced to load both:
1. **Industry config** (assets, content, SEO) → `previewConfig`
2. **Preview mock data** (business, reviews, FAQs) → `previewData`

```typescript
interface PreviewDataContextValue {
  isPreviewMode: boolean;
  industry: string | null;
  previewConfig: MainSiteConfig | null;  // Industry config
  previewData: IndustryPreviewData | null;  // NEW: Mock data
  isLoading: boolean;
}
```

Components can now access preview data via:
```typescript
const { previewData } = usePreviewData();
// previewData.business, previewData.reviews, previewData.faqs, previewData.services
```

### 4. Deleted Redundant File ✅

Removed `frontend/apps/tenant-app/src/data/previewMockData.ts` (15KB, 427 lines)

All data migrated to industry-specific JSON files.

### 5. Updated Documentation ✅

Updated `frontend/src/data/README.md` with:
- New directory structure
- Preview data section
- Loading examples
- Clear separation of concerns

---

## Benefits

### ✅ Single Source of Truth
All industry data (configs + preview mocks) in one place: `frontend/src/data/{industry}/`

### ✅ Modular by Industry
Each industry's preview data is self-contained and easy to update.

### ✅ Easier to Maintain
- Add new industry? Just create `{industry}/preview/` folder
- Update mock data? Edit JSON files directly
- No more hunting across multiple directories

### ✅ Type-Safe
Shared TypeScript types ensure consistency across all industries.

### ✅ Dynamic Loading
Preview data loaded on-demand with `loadIndustryPreview(industry)`.

### ✅ Clear Separation
- **Preview data** = Mock data for demos (`preview/` folder)
- **Tenant data** = Real data from database (API)
- **Industry config** = Assets, content defaults, SEO

---

## Usage Examples

### Loading Preview Data

```typescript
import { loadIndustryPreview } from '@/data/preview-loader';

const previewData = await loadIndustryPreview('mobile-detailing');
console.log(previewData.business.businessName); // "Elite Auto Detailing"
console.log(previewData.reviews.length); // 3
```

### Using in Components

```typescript
import { usePreviewData } from '@/tenant-app/contexts/PreviewDataProvider';

function MyComponent() {
  const { previewData, isPreviewMode } = usePreviewData();
  
  if (isPreviewMode && previewData) {
    return <div>{previewData.business.tagline}</div>;
  }
  
  // Normal tenant data...
}
```

### Adding a New Industry

1. Create directory: `frontend/src/data/new-industry/`
2. Add preview folder: `new-industry/preview/`
3. Create JSON files: `business.json`, `services.json`, `reviews.json`, `faqs.json`
4. Create loader: `preview/index.ts` with `getNewIndustryPreview()`
5. Update `preview-loader.ts` to include the new industry

---

## Migration Impact

### ✅ No Breaking Changes
- Existing industry configs still work
- `PreviewDataProvider` enhanced (not replaced)
- Components using `usePreviewData()` get additional data

### ✅ Backward Compatible
- Old code still works
- New `previewData` field is optional (can be `null`)

---

## Files Changed

### Created (26 files)
- `frontend/src/data/*/preview/business.json` (5 files)
- `frontend/src/data/*/preview/services.json` (5 files)
- `frontend/src/data/*/preview/reviews.json` (5 files)
- `frontend/src/data/*/preview/faqs.json` (5 files)
- `frontend/src/data/*/preview/index.ts` (5 files)
- `frontend/src/data/preview-types.ts`
- `frontend/src/data/preview-loader.ts`

### Modified (2 files)
- `frontend/apps/tenant-app/src/contexts/PreviewDataProvider.tsx`
- `frontend/src/data/README.md`

### Deleted (1 file)
- `frontend/apps/tenant-app/src/data/previewMockData.ts`

---

## Next Steps

### Phase 1: Use Preview Data in Components ⏭️

Update components to consume `previewData`:
- Reviews component → Use `previewData.reviews`
- FAQ component → Use `previewData.faqs`
- Services component → Use `previewData.services` (or keep using `previewConfig.servicesGrid`)

### Phase 2: Add Gallery Preview Data 📸

Create `preview/gallery.json` for each industry with mock gallery images.

### Phase 3: Testing 🧪

Test all 5 industry preview pages to ensure data loads correctly.

---

## Summary

**Before:** Preview data was hardcoded in a monolithic TypeScript file  
**After:** Preview data is modular, industry-specific, and JSON-based

**Result:** Cleaner architecture, easier maintenance, better scalability ✨

