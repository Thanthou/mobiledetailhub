# SEO Structure Documentation

## 📁 **File Organization**

This document outlines the SEO module structure that anchors Cursor's understanding of SEO architecture.

### Frontend SEO Module (`frontend/src/shared/seo/`)

| File | Purpose | Cursor Integration |
|------|---------|-------------------|
| `index.ts` | Barrel exports - anchors Cursor's imports | ✅ Primary import point |
| `SeoHead.tsx` | Central meta + canonical + noindex logic | ✅ Head management component |
| `jsonld.ts` | JSON-LD schema generators | ✅ Structured data utilities |
| `sitemapBuilder.ts` | Builds per-tenant sitemap XML | ✅ Sitemap generation |
| `robotsHandler.ts` | Returns robots.txt for tenants | ✅ Robots.txt generation |
| `seoDefaults/` | Industry-specific defaults | ✅ SEO fallback data |

### Backend SEO Routes (`backend/routes/seo/`)

| File | Purpose | Cursor Integration |
|------|---------|-------------------|
| `index.ts` | Barrel exports | ✅ Route organization |
| `robotsRoute.ts` | Express route: /robots.txt | ✅ Robots endpoint |
| `sitemapRoute.ts` | Express route: /sitemap.xml | ✅ Sitemap endpoint |

### Database Schema

| File | Purpose | Cursor Integration |
|------|---------|-------------------|
| `website/seo_config.sql` | Tenant-specific SEO configuration | ✅ Data source for SEO |

### Analytics Hook

| File | Purpose | Cursor Integration |
|------|---------|-------------------|
| `useAnalytics.ts` | Simple GA4 integration placeholder | ✅ Analytics foundation |

---

## 🔧 **How Cursor Uses This Structure**

### 1. **Import Recognition**
```tsx
// Cursor will suggest this import pattern
import { SeoHead, getLocalBusinessSchema } from '@/shared/seo';
```

### 2. **Component Usage**
```tsx
// Cursor will use SeoHead instead of inline meta tags
<SeoHead 
  title="Page Title" 
  description="Description" 
  noindex={isPreview} 
/>
```

### 3. **Structured Data**
```tsx
// Cursor will use utility functions instead of inline JSON-LD
const schema = getLocalBusinessSchema({ name: business.name });
```

### 4. **Backend Routes**
```ts
// Cursor will extend existing SEO routes
// In backend/routes/seo/sitemapRoute.ts
```

---

## 📊 **SEO Signals Detection**

The project overview script now detects these SEO signals:

- ✅ **robots.txt** - Static files or route handlers
- ✅ **sitemap generator** - Sitemap generation logic
- ✅ **seo shared folder** - `/shared/seo/` module
- ✅ **seo feature folder** - `/features/seo/` (if needed)
- ✅ **ld-json helpers** - JSON-LD utilities
- ✅ **SeoHead component** - Centralized head management
- ✅ **backend SEO routes** - `/routes/seo/` structure
- ✅ **SEO defaults (industry)** - Industry-specific fallbacks
- ✅ **preview route** - Preview page detection
- ✅ **head manager** - Helmet/NextHead usage

---

## 🚀 **Integration Workflow**

### 1. **Regenerate Overview**
```bash
npm run overview
```
This updates `SEO.md` with the new structure detected.

### 2. **Provision SEO Config**
```bash
node scripts/seo/provision-config.js --all
```
This seeds the database with SEO configuration for existing tenants.

### 3. **Test Anchoring**
```bash
node scripts/test-seo-anchors.js
```
This verifies the SEO structure is properly anchored.

---

## 🎯 **Expected Cursor Behavior**

After this structure is in place, Cursor should:

1. **Import consistently** from `@/shared/seo`
2. **Use SeoHead component** instead of inline meta tags
3. **Generate structured data** through utility functions
4. **Extend SEO routes** rather than creating new ones
5. **Reference industry defaults** from JSON files

---

## 🔍 **Monitoring Cursor Integration**

### ✅ **Good Signs**
- Cursor suggests imports from `@/shared/seo`
- New pages use `<SeoHead />` component
- JSON-LD generated through utility functions
- SEO routes extended, not duplicated

### ❌ **Red Flags**
- Inline `<meta>` tags in components
- Duplicate SEO route creation
- Hardcoded SEO defaults in pages
- Scattered JSON-LD across components

---

## 📝 **Maintenance**

### Adding New SEO Features
1. Add to appropriate module in `/shared/seo/`
2. Export from `index.ts`
3. Update this documentation
4. Regenerate overview: `npm run overview`

### Adding New Industries
1. Create JSON file in `seoDefaults/`
2. Run provisioning script for existing tenants
3. Update detection logic if needed

This structure ensures Cursor maintains consistent SEO implementation across your multi-tenant platform.
