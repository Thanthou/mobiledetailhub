# SEO Cursor Anchoring - Implementation Complete

## 🎯 **Objective Achieved**

The minimal SEO skeleton structure has been implemented to **anchor Cursor's behavior** and ensure it routes all SEO-related edits through the centralized `shared/seo/` module instead of scattering meta tags and schema code across individual pages.

---

## 📁 **Implemented Structure**

### Frontend SEO Module (`frontend/src/shared/seo/`)

```
shared/seo/
├── index.ts                    # Barrel exports - anchors Cursor's imports
├── SeoHead.tsx                 # Central meta + canonical + noindex logic
├── jsonld.ts                   # JSON-LD schema generators
├── sitemapBuilder.ts           # Builds per-tenant sitemap XML
├── robotsHandler.ts            # Returns robots.txt for tenants
├── seoDefaults/                # Industry-specific defaults
│   ├── mobile-detailing.json
│   ├── lawncare.json
│   ├── maid-service.json
│   └── pet-grooming.json
└── README.md                   # Documentation for Cursor
```

### Backend SEO Routes (`backend/routes/seo/`)

```
routes/seo/
├── index.ts                    # Barrel exports
├── robotsRoute.ts              # Express route: /robots.txt
└── sitemapRoute.ts             # Express route: /sitemap.xml
```

### Database Schema

```
database/schemas/website/
└── seo_config.sql              # Tenant-specific SEO configuration
```

### Analytics Hook

```
shared/hooks/
└── useAnalytics.ts             # Simple GA4 integration placeholder
```

---

## 🔧 **How This Anchors Cursor**

### 1. **Import Boundaries**
- **Before**: Cursor might scatter `<meta>` tags across pages
- **After**: Cursor will import from `@/shared/seo` and use `<SeoHead />`

### 2. **JSON-LD Generation**
- **Before**: Cursor might embed inline JSON-LD in components
- **After**: Cursor will use `getLocalBusinessSchema()`, `getFAQSchema()`, etc.

### 3. **Backend SEO Routes**
- **Before**: Cursor might create ad-hoc SEO endpoints
- **After**: Cursor will extend the existing `/seo/` route structure

### 4. **Industry Defaults**
- **Before**: Cursor might hardcode SEO defaults in components
- **After**: Cursor will reference the `seoDefaults/` JSON files

---

## 🧪 **Testing the Anchoring**

Run the anchor test to verify the structure:

```bash
node scripts/test-seo-anchors.js
```

**Expected Results:**
- ✅ All anchor files present
- ✅ Proper anchor comments in place
- ✅ Cursor will recognize SEO module boundaries

---

## 🚀 **Expected Cursor Behavior**

### ✅ **What Cursor Should Now Do**

1. **Import SEO utilities from the centralized module:**
   ```tsx
   import { SeoHead, getLocalBusinessSchema } from '@/shared/seo';
   ```

2. **Use SeoHead component instead of inline meta tags:**
   ```tsx
   // Good - Cursor will do this
   <SeoHead title="Page Title" description="Description" noindex={isPreview} />
   
   // Bad - Cursor should avoid this now
   <title>Page Title</title>
   <meta name="description" content="Description" />
   ```

3. **Generate structured data through utilities:**
   ```tsx
   // Good - Cursor will use this
   const schema = getLocalBusinessSchema({ name: business.name });
   
   // Bad - Cursor should avoid inline JSON-LD
   <script type="application/ld+json">{...}</script>
   ```

4. **Extend existing SEO routes rather than creating new ones:**
   ```ts
   // Good - Cursor will extend existing structure
   // In backend/routes/seo/sitemapRoute.ts
   
   // Bad - Cursor should avoid creating random SEO endpoints
   ```

---

## 📋 **Integration Checklist**

### ✅ **Completed**
- [x] Minimal SEO skeleton structure created
- [x] Anchor comments added to all files
- [x] Barrel exports established
- [x] Database schema created
- [x] Backend routes structured
- [x] Industry defaults organized

### 🔄 **Next Steps**
- [ ] Test Cursor behavior with new structure
- [ ] Replace existing SEO implementations
- [ ] Validate anchor effectiveness
- [ ] Monitor for proper import patterns

---

## 🎯 **Success Metrics**

After this anchoring, you should see:

1. **Consistent Imports**: All SEO code imports from `@/shared/seo`
2. **No Inline Meta Tags**: Cursor uses `<SeoHead />` instead
3. **Centralized JSON-LD**: All structured data goes through utilities
4. **Proper Route Structure**: SEO endpoints follow established patterns
5. **Industry Consistency**: SEO defaults pulled from JSON files

---

## 🔍 **Monitoring Cursor Behavior**

Watch for these signs that anchoring is working:

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

## 💡 **If Cursor Still Drifts**

If Cursor continues to scatter SEO code:

1. **Check anchor comments** - Ensure all files have proper anchoring
2. **Verify imports** - Make sure `@/shared/seo` is properly exported
3. **Test the structure** - Run `node scripts/test-seo-anchors.js`
4. **Add more explicit examples** - Create usage examples in the README

The minimal skeleton structure should be sufficient to anchor Cursor's behavior and ensure consistent SEO implementation across your multi-tenant platform.
