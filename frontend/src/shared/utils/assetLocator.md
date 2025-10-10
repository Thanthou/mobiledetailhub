# Tenant Asset Locator

**Purpose:** Centralized helper for constructing tenant asset URLs with intelligent fallbacks. Eliminates brittle string concatenation throughout the codebase.

## The Problem

Before this utility, asset paths were constructed manually everywhere:

```tsx
// ❌ Brittle, inconsistent, hard to maintain
const logoUrl = `/${industry}/icons/logo.webp`;
const heroUrl = `/mobile-detailing/images/hero/hero1.png`;
const avatarUrl = `/uploads/avatars/${filename}`;
const ogImage = affiliate.logo_url || `/${vertical}/icons/logo.png`;
```

**Issues:**
- String concatenation is error-prone
- No consistent fallback strategy
- Hard to change asset location strategy later
- Different patterns across features
- No type safety

## The Solution

```tsx
import { getTenantAssetUrl } from '@/shared/utils';

// ✅ Clean, consistent, maintainable
const logoUrl = getTenantAssetUrl({ 
  vertical: 'mobile-detailing', 
  type: 'logo' 
});

const heroUrl = getTenantAssetUrl({ 
  vertical: 'mobile-detailing', 
  type: 'hero-1' 
});

const avatarUrl = getTenantAssetUrl({ 
  vertical: 'mobile-detailing', 
  type: 'avatar',
  filename: 'user-123.jpg'
});
```

## API Reference

### `getTenantAssetUrl(options)`

Generate a single asset URL with intelligent fallback logic.

**Priority:**
1. Custom URL (if provided via database/config)
2. Tenant-specific uploads (if `tenantId` provided)
3. Vertical default assets (fallback)

**Options:**

```typescript
interface AssetLocatorOptions {
  tenantId?: string;              // Tenant ID - enables tenant uploads
  vertical: Vertical;             // Industry vertical (required)
  type: AssetType;                // Asset type (required)
  filename?: string;              // Custom filename
  extension?: AssetExtension;     // File extension (auto-detected)
  useTenantUploads?: boolean;     // Use tenant uploads dir (default: true)
  forceVerticalDefault?: boolean; // Skip tenant check (default: false)
}
```

**Asset Types:**

- `'logo'` - Primary brand logo
- `'logo-dark'` - Dark mode variant
- `'logo-light'` - Light mode variant
- `'favicon'` - Browser favicon
- `'hero'`, `'hero-1'`, `'hero-2'`, `'hero-3'` - Hero images
- `'og-image'` - Open Graph social share image
- `'twitter-image'` - Twitter Card image
- `'avatar'` - User/review avatar
- `'gallery'` - Gallery/portfolio images

### Examples

#### Basic logo (vertical default)
```tsx
getTenantAssetUrl({ 
  vertical: 'mobile-detailing', 
  type: 'logo' 
})
// => '/mobile-detailing/icons/logo.webp'
```

#### Tenant-specific logo
```tsx
getTenantAssetUrl({ 
  tenantId: 'jps',
  vertical: 'mobile-detailing', 
  type: 'logo' 
})
// => '/uploads/jps/icons/logo.webp'
```

#### Specific hero image
```tsx
getTenantAssetUrl({ 
  vertical: 'mobile-detailing', 
  type: 'hero-2' 
})
// => '/mobile-detailing/hero/hero2.webp'
```

#### Avatar with custom filename
```tsx
getTenantAssetUrl({ 
  vertical: 'mobile-detailing', 
  type: 'avatar',
  filename: 'user-123.jpg'
})
// => '/uploads/avatars/user-123.jpg'
```

#### Custom extension
```tsx
getTenantAssetUrl({ 
  vertical: 'mobile-detailing', 
  type: 'logo',
  extension: 'svg'
})
// => '/mobile-detailing/icons/logo.svg'
```

#### Force vertical default
```tsx
getTenantAssetUrl({ 
  tenantId: 'jps',
  vertical: 'mobile-detailing', 
  type: 'logo',
  forceVerticalDefault: true 
})
// => '/mobile-detailing/icons/logo.webp' (skips tenant check)
```

### `getTenantAssetUrls(options)`

Get multiple asset URLs at once.

```tsx
getTenantAssetUrls({ 
  vertical: 'mobile-detailing', 
  types: ['hero-1', 'hero-2', 'hero-3'] 
})
// => [
//   '/mobile-detailing/hero/hero1.webp',
//   '/mobile-detailing/hero/hero2.webp',
//   '/mobile-detailing/hero/hero3.webp'
// ]
```

### `getTenantLogoUrls(options)`

Get all logo variants (default, dark, light) at once.

```tsx
getTenantLogoUrls({ 
  vertical: 'mobile-detailing' 
})
// => {
//   default: '/mobile-detailing/icons/logo.webp',
//   dark: '/mobile-detailing/icons/logo-dark.webp',
//   light: '/mobile-detailing/icons/logo-light.webp'
// }
```

### Helper Functions

#### `hasFileExtension(filename)`
```tsx
hasFileExtension('photo.jpg')  // => true
hasFileExtension('logo')       // => false
```

#### `normalizeAssetUrl(url)`
```tsx
normalizeAssetUrl('images/logo.png')              // => '/images/logo.png'
normalizeAssetUrl('/images/logo.png')             // => '/images/logo.png'
normalizeAssetUrl('https://cdn.com/logo.png')     // => 'https://cdn.com/logo.png'
```

## URL Patterns

### Tenant-Specific Uploads
```
/uploads/{tenantId}/{subdirectory}/{filename}
/uploads/jps/icons/logo.webp
/uploads/jps/hero/hero1.webp
```

**Exception:** Avatars use flat structure:
```
/uploads/avatars/{filename}
/uploads/avatars/user-123.jpg
```

### Vertical Defaults
```
/{vertical}/{subdirectory}/{filename}
/mobile-detailing/icons/logo.webp
/mobile-detailing/hero/hero1.webp
/mobile-detailing/social/og-image.webp
```

### Subdirectory Mapping

| Asset Type | Subdirectory |
|------------|--------------|
| `logo`, `logo-dark`, `logo-light`, `favicon` | `icons` |
| `hero`, `hero-1`, `hero-2`, `hero-3` | `hero` |
| `og-image`, `twitter-image` | `social` |
| `avatar` | `avatars` |
| `gallery` | `gallery` |

## Migration Guide

### Before
```tsx
// Scattered throughout codebase
const logoUrl = affiliate.logo_url || `/${industry}/icons/logo.webp`;
const heroImage = `/mobile-detailing/images/hero/hero1.png`;
const avatar = dbReview.avatar_filename 
  ? `/uploads/avatars/${dbReview.avatar_filename}` 
  : undefined;
```

### After
```tsx
import { getTenantAssetUrl } from '@/shared/utils';

const logoUrl = affiliate.logo_url || getTenantAssetUrl({
  tenantId: affiliate.id?.toString(),
  vertical: industry,
  type: 'logo',
});

const heroImage = getTenantAssetUrl({
  vertical: 'mobile-detailing',
  type: 'hero-1',
});

const avatar = dbReview.avatar_filename 
  ? getTenantAssetUrl({
      vertical: 'mobile-detailing',
      type: 'avatar',
      filename: dbReview.avatar_filename,
    })
  : undefined;
```

## Benefits

1. **DRY** - No repeated string concatenation
2. **Type-safe** - Full TypeScript support
3. **Consistent** - Same pattern everywhere
4. **Maintainable** - Change location strategy in one place
5. **Fallback logic** - Built-in tenant → vertical fallback
6. **Future-proof** - Easy to add CDN support later

## Testing

Full unit test coverage in `__tests__/assetLocator.test.ts`:
- ✅ Vertical defaults
- ✅ Tenant-specific uploads
- ✅ Force vertical default
- ✅ Hero images
- ✅ Avatars with custom filenames
- ✅ Custom extensions
- ✅ Logo variants
- ✅ Social media images
- ✅ Multiple URLs at once
- ✅ URL normalization

## Future Enhancements

- CDN support (prepend CDN URL)
- Responsive image srcsets
- Image optimization hints
- WebP/AVIF fallbacks
- Lazy loading attributes

