# Industry Data & Defaults

This directory contains industry-specific data for the multi-tenant platform.

## Structure

```
data/
├── mobile-detailing/
│   ├── index.ts               ← Industry config loader (loadMobileDetailingConfig)
│   ├── assets.json            ← Images and their metadata (logos, hero, thumbnails)
│   ├── defaults/              ← Tenant provisioning templates (ONE-TIME USE)
│   │   ├── content.json       ← Rich text content (hero, about, footer)
│   │   ├── metadata.json      ← Comprehensive SEO + structured data
│   │   ├── services.json      ← Service descriptions (no pricing)
│   │   └── faq.json          ← Default FAQ items
│   ├── preview/               ← Preview mode mock data (demo sites)
│   │   ├── index.ts           ← Preview data loader
│   │   └── defaults.json      ← Single file with all preview data
│   ├── services/              ← Service detail pages (self-contained JSON files)
│   ├── faq/                   ← FAQ categories (loaded dynamically)
│   ├── pricing/               ← Pricing data (addon feature)
│   ├── gallery/               ← Gallery data
│   └── vehicle_data/          ← Vehicle make/model lookups
├── lawncare/
├── maid-service/
├── pet-grooming/
├── barber/
├── preview-types.ts           ← Shared TypeScript types for preview data
└── preview-loader.ts          ← Universal preview data loader
```

---

## Core Files

### `assets.json` - Industry Image Catalog

Contains **shared images** that all tenants start with:

- Logo variants (default, dark, light)
- Hero background images (desktop + mobile)
- Service grid thumbnails

**Used at:** Runtime - Frontend loads these assets for display

**Example:**
```json
{
  "logo": { "default": {...}, "dark": {...} },
  "hero": [{ "desktop": {...}, "mobile": {...}, "alt": "..." }],
  "services": { "auto-detailing": { "url": "...", "alt": "..." } }
}
```

---

### `defaults/` - Tenant Provisioning Templates

Contains **comprehensive defaults** for populating the database during signup.

**Structure:**
```
defaults/
├── content.json     ← Rich text content (hero, about, footer, contact)
├── metadata.json    ← SEO templates with {businessName}, {serviceArea} placeholders
├── services.json    ← Service descriptions (educational, no pricing)
└── faq.json        ← Default FAQ items organized by category
```

#### `defaults/content.json`

Rich content with placeholders:

```json
{
  "hero": {
    "h1": "Professional Mobile Detailing",
    "subtitle": "Mobile detailing for cars, boats, & RVs...",
    "cta": { "primary": {...}, "secondary": {...} }
  },
  "about": {
    "title": "About Our Service",
    "content": "...",
    "highlights": [...]
  },
  "footer": {...},
  "contact": {...}
}
```

**Maps to `website.content` table:**
- `hero.h1` → `hero_title`
- `hero.subtitle` → `hero_subtitle`
- `about.title` → `about_title`
- `about.content` → `about_content`

#### `defaults/metadata.json`

SEO templates with dynamic placeholders:

```json
{
  "seo": {
    "titleTemplate": "{businessName} | Professional Mobile Detailing",
    "description": "...",
    "keywords": [...]
  },
  "pages": {
    "home": {
      "title": "{businessName} | Mobile Detailing in {serviceArea}",
      "description": "..."
    }
  },
  "structuredData": {...}
}
```

**Placeholders replaced during signup:**
- `{businessName}` → Tenant's business name
- `{serviceArea}` → Service area (e.g., "Austin, TX")

**Used at:** Signup only (one-time) - Backend reads and populates DB

---

### `preview/` - Preview Mode Mock Data

Contains **mock business data** for industry preview/demo pages:

**Structure:**
```
preview/
├── index.ts         ← Exports getMobileDetailingPreview() function
└── defaults.json    ← Single file with all preview data
    ├── businessName, phone, email, city, state
    ├── h1, subTitle (hero content)
    ├── reviews_title, reviews_subtitle
    ├── faq_title, faq_subtitle
    └── reviews[] (array of customer testimonials)
```

**Purpose:**
- Powers industry preview pages (e.g., `/mobile-detailing-preview`)
- Shows prospects what their site could look like
- Separates mock data from real tenant data

**Used at:** Preview mode only - Loaded by `PreviewDataProvider`

**Loading:**
```typescript
import { loadIndustryPreview } from '@/data/preview-loader';

const previewData = await loadIndustryPreview('mobile-detailing');
// Returns: { business, services, reviews, faqs }
```

**Location:** `frontend/src/data/{industry}/preview/`

**Why separate from tenant data?**
- Preview data = Mock/demo data for showing prospects
- Tenant data = Real business data from database
- Clear separation prevents confusion

---

## Architecture: Database-First

### ✅ The Clean Way (Current)

**During Onboarding (ONE-TIME):**
```
1. Tenant signs up
2. Backend loads content-defaults.json + seo-defaults.json
3. Populates website.content table with defaults
4. DB now contains: hero_title, hero_subtitle, reviews_title, etc.
```

**At Runtime (EVERY VISIT):**
```
1. Fetch tenant data from database
2. Load shared assets.json (images)
3. Render site
```

**Result:**
- ✅ Single source of truth (database)
- ✅ Same behavior whether customized or not
- ✅ Faster (one DB query)
- ✅ Simpler (no merging logic)

---

### ❌ What We DON'T Do

~~Load JSON defaults at runtime~~  
~~Merge DB + JSON~~  
~~Fallback to JSON if DB empty~~

**JSON files = Provisioning templates, NOT runtime fallbacks**

---

## Service Pages

Service pages are **self-contained** JSON files:

```
services/
├── auto-detailing.json      ← Everything: content, images, SEO, schema
├── ceramic-coating.json
└── paint-correction.json
```

Each file contains:
- Text content (title, description, benefits, process)
- Images (hero, process steps, before/after)
- SEO metadata
- JSON-LD schema

**Why self-contained?**
- Less tenant customization expected (educational content)
- Simpler to manage (one file per service)
- Can split later if needed

## Tenant Provisioning Flow

```
┌─────────────────┐
│ Tenant Signs Up │
└────────┬────────┘
         │
         ▼
┌─────────────────────────┐
│ Load Defaults (Backend) │
│ - content-defaults.json │
│ - seo-defaults.json     │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│ Populate DB             │
│ website.content table   │
│ - hero_title            │
│ - hero_subtitle         │
│ - reviews_title         │
│ - faq_title             │
│ - seo_title             │
│ - seo_description       │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│ Tenant Site Ready!      │
│ DB = Single Source      │
└─────────────────────────┘
```

---

## Adding a New Industry

1. **Create directory:** `data/{industry-slug}/`
2. **Create files:**
   - `assets.json` - Industry images (logos, hero, thumbnails)
   - `content-defaults.json` - Text defaults for DB
   - `seo-defaults.json` - SEO defaults for DB
3. **Add services:** Create `services/*.json` files
4. **Update types:** Add to `IndustrySlug` in `@/shared/utils/loadDefaults.ts`
5. **Add assets:** Upload to `/public/{industry-slug}/`

---

## FAQ Content

FAQ items are **industry-specific** and stored in JSON files:

```
data/{industry}/faq/
  ├── general.json
  ├── services.json
  ├── pricing.json
  ├── scheduling.json
  ├── locations.json
  ├── preparation.json
  ├── payments.json
  ├── warranty.json
  └── aftercare.json
```

**Loading:**
- FAQs are loaded dynamically via `loadIndustryFAQs(industry)`
- Each category is a separate file for easy editing
- Categories are combined automatically at runtime
- Can be overridden per tenant via `website.content.faq_items` (JSONB)

**Section headers** (title/subtitle) come from `content-defaults.json`.

