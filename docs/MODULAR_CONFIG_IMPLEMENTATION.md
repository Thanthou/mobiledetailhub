# Modular Config Implementation - Mobile Detailing

## Problem

The DataContext was looking for `site.json` for mobile-detailing industry, but mobile-detailing uses a modular approach with separate config files (`assets.json`, `content-defaults.json`, `seo-defaults.json`, etc.). This caused `siteConfig` to be `null`, breaking components like `ImageCarousel` that depend on it.

## Solution

Implemented a config loader that assembles modular files into the expected `MainSiteConfig` structure, making the modular approach transparent to consuming components.

## Changes Made

### 1. Created Config Loader
**File**: `frontend/src/data/mobile-detailing/index.ts`

- New `loadMobileDetailingConfig()` function
- Imports modular JSON files (assets, content-defaults, seo-defaults)
- Assembles them into a complete `MainSiteConfig` object
- Transforms data structures (e.g., hero images from nested desktop/mobile to flat structure)

### 2. Updated DataContext
**File**: `frontend/src/shared/contexts/DataContext.tsx`

Updated `fetchSiteConfig()` to detect mobile-detailing and use the modular loader:
```typescript
if (industry === 'mobile-detailing') {
  const { loadMobileDetailingConfig } = await import('@/data/mobile-detailing');
  return await loadMobileDetailingConfig();
}
```

### 3. Updated Industry Config Hook
**File**: `frontend/src/shared/hooks/useIndustryConfig.ts`

Updated `fetchIndustryConfig()` with the same mobile-detailing detection logic for consistency.

### 4. Added Documentation
**File**: `frontend/src/data/mobile-detailing/README.md`

Comprehensive documentation explaining:
- Modular config structure
- How the loader works
- Benefits of the approach
- Usage examples
- Migration guide for other industries

## Architecture Benefits

### ✅ Separation of Concerns
- Assets (images, logos) in `assets.json`
- Text content in `content-defaults.json`
- SEO metadata in `seo-defaults.json`
- Detailed data in subdirectories (`faq/`, `services/`, `pricing/`)

### ✅ Backwards Compatibility
- Components don't need changes
- Works with existing hooks (`useData`, `useIndustryConfig`)
- Other industries continue using `site.json` without changes

### ✅ Scalability
- Easy to add new config files
- Clear pattern for organizing complex industry configs
- Reduces file size and complexity

### ✅ Team Collaboration
- Multiple developers can work on different config files
- Reduces merge conflicts
- Clearer code review boundaries

## Testing

To verify the fix:

1. **Start the dev server**: `npm run dev` (in frontend directory)
2. **Navigate to a mobile-detailing tenant**: `http://localhost:5173/jps`
3. **Check the console**:
   - ✅ Should NOT see: "No site.json found for industry: mobile-detailing"
   - ✅ Should see: Config loaded successfully
4. **Verify UI elements**:
   - Hero images should rotate properly
   - Service cards should display with thumbnails
   - All content should render correctly

## Type Safety Note

The implementation includes both `hero.images` (lowercase) and `hero.Images` (capital I) due to a legacy inconsistency in the codebase:
- Type definition: `MainSiteConfig` expects `images` (lowercase)
- Component: `ImageCarousel` looks for `Images` (capital I)

This dual approach maintains compatibility until the component is updated.

## Future Improvements

### Short Term
1. Update `ImageCarousel` to use lowercase `images` property
2. Remove dual property from the loader
3. Update type definitions if needed

### Long Term
1. Migrate other industries (pet-grooming, maid-service, lawncare) to modular approach
2. Create shared utilities for common config transformations
3. Add Zod schemas for runtime validation of modular configs
4. Create CLI tool to automatically split monolithic `site.json` files

## Related Files

- `frontend/src/data/mobile-detailing/assets.json` - Asset definitions
- `frontend/src/data/mobile-detailing/content-defaults.json` - Default text content
- `frontend/src/data/mobile-detailing/seo-defaults.json` - SEO metadata
- `frontend/src/features/hero/components/ImageCarousel.tsx` - Hero image component
- `frontend/src/shared/types/location.ts` - Type definitions

## Migration Path for Other Industries

To adopt the modular approach:

1. Create `frontend/src/data/{industry}/index.ts`
2. Split `site.json` into logical files (assets, content, seo)
3. Implement `load{Industry}Config()` function
4. Update `fetchSiteConfig()` in DataContext
5. Update `fetchIndustryConfig()` in useIndustryConfig
6. Test thoroughly
7. Remove old `site.json`
8. Update documentation

## Questions?

For questions or issues related to the modular config approach, see:
- `frontend/src/data/mobile-detailing/README.md` - Detailed usage guide
- `frontend/src/shared/hooks/CONFIG_ACCESS_GUIDE.md` - Hook usage patterns

