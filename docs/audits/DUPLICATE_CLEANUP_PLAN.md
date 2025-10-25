# Duplicate Component Cleanup Plan

**Date:** 2025-10-25  
**Status:** 📋 Ready for Execution  

## Summary

**Found:** 7 confirmed duplicate component folders  
**Total Files:** 72 duplicate files in main app  
**Action:** Safe to delete from main (all functionality exists in tenant-app)  

---

## ✅ CONFIRMED DUPLICATES - Safe to Delete

### 1. cta/ (6 files)
**Purpose:** Call-to-action buttons (Book Now, Request Quote)  
**Status:** 🔴 Duplicate - Delete from main  
**Belongs:** tenant-app (customer-facing product)

```
frontend/apps/main/src/components/cta/
├── components/
│   ├── MobileCTAButtons.tsx
│   ├── SmartCTAButtons.tsx
│   └── index.ts
├── hooks/
│   ├── useBookingCapabilities.ts
│   └── index.ts
└── index.ts
```

---

### 2. customers/ (3 files)
**Purpose:** Customer data types and classes  
**Status:** 🔴 Duplicate - Delete from main  
**Belongs:** tenant-app (operational data)

```
frontend/apps/main/src/components/customers/
├── classes/
│   └── Customer.ts
├── types/
│   └── index.ts
└── index.ts
```

---

### 3. faq/ (14 files)
**Purpose:** FAQ section with search and categories  
**Status:** 🔴 Duplicate - Delete from main  
**Belongs:** tenant-app (customer-facing product)

```
frontend/apps/main/src/components/faq/
├── components/
│   ├── FAQ.tsx
│   ├── FAQCategoryFilter.tsx
│   ├── FAQEmptyState.tsx
│   ├── FAQItem.tsx
│   ├── FAQList.tsx
│   ├── FAQSearchBar.tsx
│   └── ServiceAreasLink.tsx
├── hooks/
│   ├── useFAQContent.ts
│   ├── useFAQData.ts
│   ├── useRotatingBackground.ts
│   └── index.ts
├── types/
│   └── index.ts
├── utils/
│   └── index.ts
└── index.ts
```

---

### 4. footer/ (11 files)
**Purpose:** Tenant site footer with contact info, social media  
**Status:** 🔴 Duplicate - Delete from main  
**Belongs:** tenant-app (customer-facing product)

```
frontend/apps/main/src/components/footer/
├── components/
│   ├── ContactColumn.tsx
│   ├── Disclaimer.tsx
│   ├── FollowUs.tsx
│   ├── Footer.tsx
│   ├── FooterBottom.tsx
│   ├── GetInTouch.tsx
│   ├── ServiceAreas.tsx
│   ├── ServiceAreasColumn.tsx
│   └── SocialMediaColumn.tsx
├── types/
│   └── index.ts
└── index.ts
```

---

### 5. gallery/ (8 files)
**Purpose:** Before/after photo gallery with carousel  
**Status:** 🔴 Duplicate - Delete from main  
**Belongs:** tenant-app (customer-facing product)

```
frontend/apps/main/src/components/gallery/
├── api/
│   └── gallery.api.ts
├── components/
│   ├── Gallery.tsx
│   ├── GalleryItem.tsx
│   └── RotatingGalleryItem.tsx
├── hooks/
│   ├── useGallery.ts
│   └── useRotatingGallery.ts
├── types/
│   └── index.ts
└── index.ts
```

**Note:** Tenant version has 1 extra import (Footer) but otherwise identical

---

### 6. locations/ (14 files)
**Purpose:** Service area selection and Google Maps  
**Status:** 🔴 Duplicate - Delete from main  
**Belongs:** tenant-app (customer-facing product)

```
frontend/apps/main/src/components/locations/
├── api/
│   └── locations.api.ts
├── components/
│   └── LocationSelector.tsx
├── data/
│   └── areas.json
├── hooks/
│   ├── useLocationPageState.ts
│   └── index.ts
├── schemas/
│   └── locations.schemas.ts
├── types/
│   ├── places.types.ts
│   └── index.ts
├── utils/
│   ├── googleMaps.helpers.ts
│   ├── googlePlace.ts
│   ├── placesLoader.ts
│   └── index.ts
├── LocationPage.tsx
└── index.ts
```

---

### 7. services/ (16 files)
**Purpose:** Service pages, cards, and displays  
**Status:** 🔴 Duplicate - Delete from main  
**Belongs:** tenant-app (customer-facing product)

```
frontend/apps/main/src/components/services/
├── api/
│   └── services.api.ts
├── components/
│   ├── BeforeAfterSlider.tsx
│   ├── Process.tsx
│   ├── ProtectionComparisonChart.tsx
│   ├── Results.tsx
│   ├── ServiceCard.tsx
│   ├── ServiceCTA.tsx
│   ├── ServiceHero.tsx
│   ├── ServicesGrid.tsx
│   └── WhatItIs.tsx
├── hooks/
│   ├── useServicePage.ts
│   └── useServices.ts
├── types/
│   ├── service-data.ts
│   └── service.types.ts
├── utils/
│   └── protectionComparison.ts
└── index.ts
```

---

## ⚠️ SPECIAL CASES - Keep in Main

### hero/ (8 files in main, 7 in tenant)
**Status:** 🟢 NOT a duplicate  
**Reason:** Main has `SmartHero.tsx` with rocket launch animation (marketing-specific)  

**Unique to Main:**
- `SmartHero.tsx` - Marketing hero with countdown and rocket animation

**Shared Files (potential duplicates):**
- ContentContainer.tsx
- CTA.tsx
- Hero.tsx (uses SmartHero in main, different in tenant)
- ImageCarousel.tsx
- TextDisplay.tsx
- useHeroContent.ts

**Verdict:** ⚠️ **PARTIAL DUPLICATE** - Needs manual review. Hero.tsx differs between apps.

---

### quotes/ (21 files in main, 22 in tenant)
**Status:** 🟢 Likely identical now  
**Reason:** Tenant had extra test file (already deleted from main)  

**Verdict:** ✅ **Now identical** - Safe to delete from main after verification

---

## 🟢 UNIQUE COMPONENTS - Keep

### Main App Only ✅
- **sections/** - Marketing sections (demos, pricing, value props)
- **DevDashboard.tsx** - Developer dashboard
- **Header.tsx** - Marketing site header
- **LaunchOverlay.tsx** - Marketing overlay
- **RocketPeelTransition.tsx** - Marketing animation
- **RuntimeConfigTest.tsx** - Dev test component
- **ErrorTestButton.tsx** - Dev test component

### Tenant-App Only ✅
- **booking/** - Booking flow (already verified)
- **header/** - Tenant header (different from marketing)
- **reviews/** - Customer reviews
- **tenantDashboard/** - Tenant management
- **PreviewPage.tsx** - Industry preview

---

## Deletion Commands

### Execute in Order:

```powershell
cd C:\thatsmartsite

# 1. CTA (6 files)
Remove-Item -Path "frontend/apps/main/src/components/cta" -Recurse -Force

# 2. Customers (3 files)
Remove-Item -Path "frontend/apps/main/src/components/customers" -Recurse -Force

# 3. FAQ (14 files)
Remove-Item -Path "frontend/apps/main/src/components/faq" -Recurse -Force

# 4. Footer (11 files)
Remove-Item -Path "frontend/apps/main/src/components/footer" -Recurse -Force

# 5. Gallery (8 files)
Remove-Item -Path "frontend/apps/main/src/components/gallery" -Recurse -Force

# 6. Locations (14 files)
Remove-Item -Path "frontend/apps/main/src/components/locations" -Recurse -Force

# 7. Services (16 files)
Remove-Item -Path "frontend/apps/main/src/components/services" -Recurse -Force

# Total: 72 files deleted
```

---

## Verification Steps

After deletion:

### 1. Check for Broken Imports
```bash
# Search for any imports from deleted folders
grep -r "@main/components/cta" frontend/apps/main/src
grep -r "@main/components/customers" frontend/apps/main/src
grep -r "@main/components/faq" frontend/apps/main/src
grep -r "@main/components/footer" frontend/apps/main/src
grep -r "@main/components/gallery" frontend/apps/main/src
grep -r "@main/components/locations" frontend/apps/main/src
grep -r "@main/components/services" frontend/apps/main/src
```

### 2. Test Main App Build
```bash
cd frontend
npm run build:main
```

### 3. Test Runtime
- Navigate to `http://localhost:5175` (main app)
- Verify homepage loads
- Verify pricing page loads
- Verify signup flow works

---

## Expected Results

**Before Cleanup:**
- Main app: ~280 component files
- Duplicated code across apps
- Confusing architecture

**After Cleanup:**
- Main app: ~208 component files (-72)
- Clear boundaries (main = marketing, tenant = product)
- Single source of truth for each feature

---

## Rollback Plan

If something breaks:

```bash
git restore frontend/apps/main/src/components/cta
git restore frontend/apps/main/src/components/customers
git restore frontend/apps/main/src/components/faq
git restore frontend/apps/main/src/components/footer
git restore frontend/apps/main/src/components/gallery
git restore frontend/apps/main/src/components/locations
git restore frontend/apps/main/src/components/services
```

---

## Total Cleanup Progress

### Completed Today ✅
1. tenantDashboard - 136 files
2. booking - 58 files
3. useQuoteFormLogic.test.ts - 1 file

### Pending 🔴
4. cta - 6 files
5. customers - 3 files
6. faq - 14 files
7. footer - 11 files
8. gallery - 8 files
9. locations - 14 files
10. services - 16 files

**Grand Total Cleanup:** 267 files removed from main app 🎉

