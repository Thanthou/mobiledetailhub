# Mobile Detailing Industry Data

Industry-specific configuration, defaults, and assets for mobile detailing tenants.

## Directory Structure

```
mobile-detailing/
├── index.ts                    ← Industry config loader (loadMobileDetailingConfig)
│
├── defaults/                   ← Tenant Provisioning Templates (ONE-TIME USE)
│   ├── content.json           ← Rich text content (hero, about, footer)
│   ├── metadata.json          ← Comprehensive SEO + structured data
│   ├── services.json          ← Service descriptions (no pricing)
│   └── faq.json              ← Default FAQ items
│
├── preview/                    ← Preview/Demo Data
│   ├── index.ts               ← Preview data loader
│   └── defaults.json          ← Mock business + preview content
│
├── assets.json                 ← Runtime Assets (ALWAYS LOADED)
│   ├── Logos, hero images, service thumbnails
│   └── Images with alt text, dimensions, aspect ratios
│
├── services/                   ← Service Detail Pages (self-contained)
│   ├── auto-detailing.json
│   ├── paint-correction.json
│   ├── ceramic-coating.json
│   ├── ppf.json
│   ├── marine-detailing.json
│   └── rv-detailing.json
│
├── faq/                        ← FAQ Categories (dynamic loading)
│   ├── general.json
│   ├── services.json
│   ├── pricing.json
│   ├── scheduling.json
│   ├── preparation.json
│   ├── aftercare.json
│   ├── payments.json
│   ├── warranty.json
│   └── locations.json
│
├── pricing/                    ← Dynamic Pricing (addon feature)
│   ├── cars/
│   ├── suvs/
│   ├── trucks/
│   ├── boats/
│   └── rvs/
│
├── gallery/                    ← Gallery Data
│   └── gallery.json
│
├── vehicle_data/               ← Vehicle Make/Model Lookups
│   ├── CarMakeModel.json
│   ├── BoatMakeModel.json
│   └── RvMakeModel.json
│
├── content-defaults.json       ← DEPRECATED (use defaults/content.json)
└── seo-defaults.json          ← DEPRECATED (use defaults/metadata.json)
```

---

## Three Distinct Use Cases

### 1. **Preview Mode** (`preview/`)
**Purpose:** Show prospects what their site could look like  
**When Used:** Marketing preview pages (`/mobile-detailing-preview`)  
**Loaded By:** `PreviewDataProvider`

```typescript
import { loadIndustryPreview } from '@/data/preview-loader';
const previewData = await loadIndustryPreview('mobile-detailing');
```

**Contains:**
- Mock business info (name, phone, city)
- Sample content (hero text, reviews)
- Preview-specific SEO (for ranking the preview page itself)

---

### 2. **Tenant Provisioning** (`defaults/`)
**Purpose:** Initial data when tenant signs up (ONE-TIME ONLY)  
**When Used:** Backend reads during signup, writes to database  
**Never Used:** At runtime (database is source of truth)

**Files:**
- `content.json` - Hero, about, footer (rich content with placeholders)
- `metadata.json` - SEO templates with `{businessName}`, `{serviceArea}` placeholders
- `services.json` - Service descriptions (educational, no pricing)
- `faq.json` - Default FAQ items organized by category

**Backend Flow:**
```
1. Tenant signs up
2. Backend loads defaults/content.json + metadata.json
3. Populates website.content table with defaults
4. Tenant can customize via dashboard
```

---

### 3. **Runtime Assets** (`assets.json`)
**Purpose:** Image catalog loaded at runtime  
**When Used:** EVERY page load (both preview and tenant sites)  
**Shared By:** All tenants in this industry

**Contains:**
- Logo variants (default, dark, light)
- Hero images (desktop + mobile, with dimensions)
- Service thumbnails with alt text (SEO)
- Structured metadata for each image

---

## Key Files

### `index.ts` - Industry Config Loader

The `loadMobileDetailingConfig()` function:
- Loads `preview/defaults.json` for content (hero, reviews, FAQ titles)
- Loads `assets.json` for images
- Loads `seo-defaults.json` for SEO (DEPRECATED: should use `defaults/metadata.json`)
- Assembles into `MainSiteConfig` structure
- Used by preview pages

**Note:** This currently uses `preview/defaults.json` for content. For tenant provisioning, the backend should use `defaults/` folder instead.

---

### `defaults/content.json` - Rich Content Provisioning

Expanded content with placeholders for tenant provisioning:

```json
{
  "hero": {
    "h1": "Professional Mobile Detailing",
    "subtitle": "Mobile detailing for cars, boats, & RVs...",
    "cta": { "primary": {...}, "secondary": {...} }
  },
  "about": {
    "title": "About Our Mobile Detailing Service",
    "content": "...",
    "highlights": [...]
  },
  "footer": {...},
  "contact": {...}
}
```

**Maps to `website.content` table during tenant signup.**

---

### `defaults/metadata.json` - Comprehensive SEO Templates

SEO templates with placeholders that get populated during provisioning:

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
    },
    "services": {...},
    "contact": {...}
  },
  "structuredData": {...}
}
```

**Placeholders replaced during signup:**
- `{businessName}` → Actual business name
- `{serviceArea}` → Service area (e.g., "Austin, TX")

---

### `defaults/services.json` - Service Descriptions

Educational content about each service (no pricing):

```json
{
  "services": [
    {
      "slug": "auto-detailing",
      "title": "Auto Detailing",
      "description": "...",
      "benefits": [...],
      "duration": "3-5 hours",
      "category": "detailing"
    }
  ]
}
```

**Used for:**
- Populating initial service catalog
- Providing default descriptions
- Educational content

---

### `defaults/faq.json` - Default FAQ Items

Comprehensive FAQ organized by category:

```json
{
  "categories": [
    {
      "slug": "general",
      "title": "General Questions",
      "items": [
        {
          "question": "What is mobile detailing?",
          "answer": "..."
        }
      ]
    }
  ]
}
```

**Categories:**
- General Questions
- Service Details
- Pricing & Packages
- Scheduling & Availability
- Preparation & Requirements
- Aftercare & Maintenance

---

## Migration Notes

### DEPRECATED Files

The following files are deprecated and will be removed after backend migration:

- ❌ `content-defaults.json` → Use `defaults/content.json`
- ❌ `seo-defaults.json` → Use `defaults/metadata.json`

### Backend Integration

The backend provisioning system should be updated to:

1. Load from `defaults/` folder instead of root files
2. Parse and replace placeholders (`{businessName}`, `{serviceArea}`)
3. Populate `website.content` table with expanded content
4. Store SEO metadata with tenant-specific values

---

## Preview vs Tenant Provisioning

| Aspect | Preview (`preview/`) | Tenant Provisioning (`defaults/`) |
|--------|---------------------|-----------------------------------|
| **Purpose** | Show prospects what site looks like | Initial data for new tenants |
| **When Used** | Marketing preview pages | Signup only (one-time) |
| **Data Type** | Mock/demo data | Template with placeholders |
| **SEO Goal** | Rank the preview page | Rank tenant's business |
| **Customizable** | No (static demo) | Yes (tenant can edit via dashboard) |
| **Storage** | JSON files | Database after provisioning |

---

## Adding New Content

### To add a new service:
1. Add to `defaults/services.json` (for provisioning)
2. Create detailed page in `services/{slug}.json` (for runtime)
3. Add thumbnail to `assets.json`

### To add a new FAQ category:
1. Add to `defaults/faq.json` (for provisioning)
2. Create category file in `faq/{category}.json` (for runtime)

### To update defaults:
1. Edit `defaults/content.json` or `defaults/metadata.json`
2. Changes only affect NEW tenants (existing tenants use database)

---

## Related Documentation

- [Data Structure Overview](../README.md)
- [FAQ Implementation Guide](../../../../docs/frontend/apps/FAQ_ITEMS_IMPLEMENTATION.md)
- [Preview Mode Documentation](../../../../docs/frontend/PREVIEW_INDUSTRY_AGNOSTIC_AUDIT.md)
