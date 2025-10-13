# Mobile Hero Images Guide

## Overview
The hero carousel now supports mobile-specific images for better visual experience across devices.

## Current Behavior
- **Without mobile images**: Uses landscape image with `object-top` positioning (shows top portion on mobile)
- **With mobile images**: Shows portrait-optimized image on mobile, landscape on desktop

## How to Add Mobile Images

### 1. Create Mobile-Oriented Images
Create portrait versions of your hero images optimized for mobile devices:

**Recommended Dimensions:**
- **Mobile**: 640px × 1138px (9:16 portrait ratio, matches phone screens)
- **Desktop**: 1920px × 1080px (16:9 landscape ratio)

**Tips:**
- Focus the most important content in the center
- Ensure text/logos are readable at mobile sizes
- Use vertical composition for mobile versions

### 2. Update Your site.json

```json
{
  "hero": {
    "h1": "Professional Mobile Detailing",
    "subTitle": "Mobile detailing for cars, boats, & RVs.",
    "Images": [
      { 
        "url": "/mobile-detailing/images/hero/hero1.png",
        "mobileUrl": "/mobile-detailing/images/hero/hero1-mobile.png",
        "alt": "Professional mobile detailing service in action",
        "width": 1920,
        "height": 1080,
        "priority": true
      },
      { 
        "url": "/mobile-detailing/images/hero/hero2.png",
        "mobileUrl": "/mobile-detailing/images/hero/hero2-mobile.png",
        "alt": "High-quality car detailing and ceramic coating",
        "width": 1920,
        "height": 1080,
        "priority": true
      }
    ]
  }
}
```

### 3. Place Images in Your Public Folder

```
frontend/public/mobile-detailing/images/hero/
├── hero1.png          (landscape - 1920×1080)
├── hero1-mobile.png   (portrait - 640×1138)
├── hero2.png          (landscape - 1920×1080)
└── hero2-mobile.png   (portrait - 640×1138)
```

## How It Works

The component uses the HTML `<picture>` element with media queries:

```html
<picture>
  <!-- Mobile (up to 640px) -->
  <source media="(max-width: 640px)" srcSet="hero1-mobile.png" />
  
  <!-- Desktop (641px+) -->
  <img src="hero1.png" alt="..." />
</picture>
```

## Breakpoint
- **Mobile**: `max-width: 640px` (phones)
- **Desktop**: `641px+` (tablets, laptops, desktops)

## Optional: mobileUrl Field
The `mobileUrl` field is **completely optional**:
- If present: Uses `<picture>` with mobile-specific image
- If absent: Falls back to single `<img>` with responsive positioning

## Image Optimization Tools

### Free Tools:
1. **Squoosh** (https://squoosh.app) - Google's image optimizer
2. **ImageOptim** (Mac) or **FileOptimizer** (Windows)
3. **Photopea** (https://www.photopea.com) - Free online Photoshop alternative

### Creating Mobile Crops:
1. Open your desktop image in an editor
2. Canvas size: 640×1138px
3. Position/crop to show the most important elements
4. Export as PNG or WebP

## Performance Notes
- Mobile images are **only loaded on mobile devices** (saves bandwidth on desktop)
- Priority images use `loading="eager"` and `fetchPriority="high"` for LCP optimization
- Desktop images can be larger/higher quality since they're not loaded on mobile

## Example: Before & After

### Before (Single Image)
```json
{
  "url": "/images/hero1.png",  // Landscape only, gets cropped on mobile
  "alt": "Hero image"
}
```

### After (Responsive Images)
```json
{
  "url": "/images/hero1.png",          // Desktop landscape
  "mobileUrl": "/images/hero1-mobile.png",  // Mobile portrait
  "alt": "Hero image"
}
```

## Need Help?
If you want to use different breakpoints or aspect ratios, you can adjust the media query in:
`frontend/src/features/hero/components/ImageCarousel.tsx` (line ~103)

