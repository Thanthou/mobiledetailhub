# Mobile Detailing - Modular Config Approach

## Overview

Mobile detailing uses a **modular config approach** instead of the legacy `site.json` monolithic file. This provides better organization, easier maintenance, and clearer separation of concerns.

## File Structure

```
mobile-detailing/
├── index.ts                    # Config loader/assembler
├── assets.json                 # Logo, hero images, service thumbnails
├── content-defaults.json       # Default text content (hero, reviews, FAQ)
├── seo-defaults.json           # SEO metadata (title, description, keywords)
├── faq/                        # FAQ categories (general, pricing, scheduling, etc.)
├── services/                   # Service definitions (auto-detailing, ceramic-coating, etc.)
├── pricing/                    # Pricing by vehicle type (cars, trucks, SUVs, RVs, boats)
└── gallery/                    # Gallery images
```

## How It Works

### 1. Config Loader (`index.ts`)

The `loadMobileDetailingConfig()` function:
- Imports the modular JSON files
- Assembles them into a `MainSiteConfig` object
- Transforms data structures to match the expected format
- Returns a complete config compatible with legacy `site.json` format

### 2. DataContext Integration

The `DataContext` automatically detects mobile-detailing and uses the modular loader:

```typescript
if (industry === 'mobile-detailing') {
  const { loadMobileDetailingConfig } = await import('@/data/mobile-detailing');
  return await loadMobileDetailingConfig();
}
```

### 3. Hook Support

Both `useIndustryConfig` and `useIndustrySiteData` hooks support the modular approach transparently.

## Benefits

### ✅ Better Organization
- Separate files for different concerns (assets, content, SEO)
- Easier to find and update specific data
- Clear file naming conventions

### ✅ Reduced Merge Conflicts
- Multiple developers can work on different config files simultaneously
- Changes to assets don't conflict with content changes

### ✅ Improved Maintainability
- Smaller, focused files are easier to understand
- Clear structure makes it obvious where to add new data

### ✅ Type Safety
- Each JSON file can have its own schema
- Easier to validate individual pieces

## Usage

Components don't need to change - they continue to use `useData()` or `useIndustryConfig()` as before:

```tsx
const { siteConfig } = useData();
const heroTitle = siteConfig?.hero.h1; // Works automatically!
```

## Adding New Data

### To add a new hero image:
Edit `assets.json` → `hero` array

### To update default content:
Edit `content-defaults.json`

### To modify SEO metadata:
Edit `seo-defaults.json`

### To add a new service:
Create a new file in `services/` directory

## Migration from site.json

Other industries (pet-grooming, maid-service, lawncare) still use `site.json`. To migrate them:

1. Create an `index.ts` loader (copy from mobile-detailing)
2. Split `site.json` into modular files:
   - `assets.json` - logo, images, thumbnails
   - `content-defaults.json` - text content
   - `seo-defaults.json` - SEO metadata
3. Update the loader to import and assemble your files
4. Test thoroughly
5. Delete old `site.json`

## Type Compatibility Note

Due to a legacy inconsistency, the config includes both `hero.images` (lowercase, type-compliant) and `hero.Images` (capital I, for component compatibility). This will be resolved when we update the `ImageCarousel` component to use the correct property name.

