# Mobile Optimization Guide

## Overview
This document describes the mobile/desktop responsive implementation and development tools.

---

## 🛠️ Dev-Only Viewport Switcher

### What It Does
A floating viewport switcher appears **only in development mode** (`import.meta.env.DEV`), allowing you to quickly test different screen sizes without resizing your browser or using DevTools.

### How to Use

1. **Start the dev server:**
   ```bash
   npm run dev
   ```

2. **Look for the floating control** in the bottom-right corner of your browser.

3. **Select a viewport:**
   - **Full Width** - Normal browser width (default)
   - **💻 Desktop (1280)** - Typical laptop screen
   - **📱 Tablet (768)** - iPad-sized
   - **📱 Mobile (390)** - iPhone 14 Pro-sized

4. **Your selection persists** in `localStorage` across page reloads.

5. **Deep-link support:** Add `?viewport=mobile` to any URL to set initial viewport.

### Architecture

```
src/features/devPreview/
├── state/
│   └── viewportStore.ts       # Zustand store for viewport state
├── components/
│   ├── ViewportFrame.tsx      # Constrains app width based on viewport
│   └── ViewportSwitcher.tsx   # Floating UI control
└── index.ts                   # Exports
```

### Implementation Details

- **Viewport Store:** Uses Zustand to manage viewport state and persist to `localStorage`.
- **ViewportFrame:** Wraps the entire app and constrains width with visual borders when a viewport is selected.
- **ViewportSwitcher:** Floating pill UI positioned at `bottom: 12px, right: 12px` with high z-index.
- **Conditional Rendering:** Only renders in development (`import.meta.env.DEV`).

---

## 📱 Responsive Design Implementation

### Breakpoints (Tailwind defaults)
- **sm:** 640px
- **md:** 768px
- **lg:** 1024px
- **xl:** 1280px
- **2xl:** 1536px

### Key Components Optimized

#### 1. Header (`frontend/src/features/header`)

**Mobile Improvements:**
- ✅ Hamburger menu at `< md` with smooth slide-down
- ✅ Mobile menu auto-closes after navigation
- ✅ Touch targets ≥44px (px-4 py-3 = 48px height)
- ✅ Business name scales: `text-lg → text-3xl`
- ✅ Phone number is clickable link on mobile
- ✅ Responsive layout: vertical on mobile, horizontal on tablet+

**Breakpoints Used:**
```tsx
// BusinessInfo.tsx
text-lg sm:text-xl md:text-2xl lg:text-3xl  // Business name
text-sm sm:text-base md:text-lg             // Phone number
```

#### 2. Hero (`frontend/src/features/hero`)

**Mobile Improvements:**
- ✅ Text scales smoothly: `text-3xl → text-7xl`
- ✅ Reduced padding on mobile: `pt-20 sm:pt-24`
- ✅ Button sizing: `h-12 → h-16` with responsive padding
- ✅ Reviews summary scales: `text-base → text-xl`
- ✅ Responsive images with `srcset` and `sizes`

**Breakpoints Used:**
```tsx
// TextDisplay.tsx
text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl  // H1 title
text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl     // Subtitle
```

#### 3. CTA Buttons (`frontend/src/shared/ui/buttons`)

**Mobile Improvements:**
- ✅ Responsive sizing: smaller on mobile, larger on desktop
- ✅ Maintains minimum 44px touch target
- ✅ Horizontal layout on desktop, vertical on mobile
- ✅ Full width on mobile (`w-full sm:w-auto`)

**Breakpoints Used:**
```tsx
// GetQuote.tsx & BookNow.tsx
px-6 py-4 text-base h-12      // Mobile (44px+ touch target)
sm:px-8 sm:py-4 sm:text-lg sm:h-14
md:px-12 md:py-5 md:text-xl md:h-16
```

#### 4. Responsive Images

**New Utilities:** `frontend/src/shared/utils/imageUtils.ts`

```typescript
// Auto-generates srcset from image URLs with size suffixes
generateSrcSet('/images/hero-1280.jpg')
// → "/images/hero-640.jpg 640w, /images/hero-1280.jpg 1280w, ..."

// Get proper sizes attribute for different contexts
getHeroImageSizes()    // → "100vw"
getCardImageSizes()    // → "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
getServiceImageSizes() // → "(max-width: 768px) 100vw, 50vw"
```

**Image Naming Convention:**
For automatic responsive srcset generation, name images with size suffixes:
```
hero-640.webp   (mobile)
hero-1280.webp  (desktop)
hero-1920.webp  (HD)
hero-3840.webp  (4K)
```

**Hero Images Now Include:**
- ✅ `srcSet` with multiple sizes
- ✅ `sizes="100vw"` for optimal loading
- ✅ Default `width={1920} height={1080}` to prevent CLS
- ✅ `loading="lazy"` for below-fold images
- ✅ `fetchpriority="high"` for first image only

---

## 🎯 Best Practices

### Touch Targets
- **Minimum 44×44px** for all interactive elements
- Use padding, not just icon size: `p-2` + 24px icon = 48px
- Mobile nav items: `px-4 py-3` = 48px height

### Typography Scale
- Use fluid scales that grow with viewport
- Example: `text-base sm:text-lg md:text-xl lg:text-2xl`
- Keep mobile readable (≥16px base to avoid iOS zoom)

### Layout
- **Mobile-first:** Start with single column, scale up
- **Grid columns:** `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`
- **Spacing:** Increase padding/gaps on larger screens

### Images
1. **Always provide `width` and `height`** to prevent CLS
2. **Use `srcset` and `sizes`** for responsive loading
3. **Lazy-load** below-the-fold images
4. **Priority** first hero image only

### Forms
- Input font-size ≥16px to prevent iOS zoom
- Full-width inputs on mobile
- Use native pickers (`type="date"`, `type="tel"`)

---

## 🧪 Testing Checklist

### Desktop (≥1024px)
- [ ] Header shows full navigation
- [ ] Business info is single line
- [ ] Buttons are large and prominent
- [ ] Images load HD versions

### Tablet (768px - 1023px)
- [ ] Header still shows full nav
- [ ] Grid layouts use 2 columns
- [ ] Touch targets remain ≥44px

### Mobile (< 768px)
- [ ] Hamburger menu appears
- [ ] All text is readable (no tiny fonts)
- [ ] CTA buttons are full width
- [ ] Phone number is tap-to-call
- [ ] Images load mobile-optimized sizes
- [ ] No horizontal scroll

### Mobile Menu
- [ ] Opens smoothly
- [ ] Closes after navigation
- [ ] Touch targets are generous
- [ ] Backdrop dismisses menu

---

## 🚀 Production Build

The viewport switcher **will not appear in production** because it's gated by:

```tsx
{import.meta.env.DEV ? (
  <ViewportFrame>
    {routes}
    <ViewportSwitcher />
  </ViewportFrame>
) : (
  routes
)}
```

In production, users get the standard responsive layout without the dev frame.

---

## 📝 Adding Responsive Images

### For New Images

1. **Generate multiple sizes** (use scripts like `convert-images.js`):
   ```bash
   npm run convert-images
   ```

2. **Name with size suffix:**
   ```
   service-detailing-640.webp
   service-detailing-1280.webp
   service-detailing-1920.webp
   ```

3. **Use in components:**
   ```tsx
   import { generateSrcSet, getCardImageSizes } from '@/shared/utils';
   
   <img
     src={image}
     srcSet={generateSrcSet(image)}
     sizes={getCardImageSizes()}
     alt="Service image"
     width={1280}
     height={720}
     loading="lazy"
   />
   ```

---

## 🔧 Troubleshooting

### Viewport Switcher Not Showing
- Ensure you're in dev mode: `npm run dev`
- Check console for errors
- Clear localStorage: `localStorage.removeItem('devViewport')`

### Images Not Responsive
- Verify image naming follows `-{size}.{ext}` pattern
- Check that `generateSrcSet()` is called
- Inspect network tab to see which size is loaded

### Mobile Menu Not Closing
- Ensure `setIsMobileMenuOpen(false)` is in onClick handlers
- Check React DevTools for state updates

### Text Too Large on Mobile
- Use responsive classes: `text-base sm:text-lg md:text-xl`
- Never use fixed `text-4xl` without breakpoints

---

## 📚 Further Reading

- [Tailwind Responsive Design](https://tailwindcss.com/docs/responsive-design)
- [MDN: Responsive Images](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images)
- [Web.dev: Touch Targets](https://web.dev/accessible-tap-targets/)
- [WCAG Touch Target Guidelines](https://www.w3.org/WAI/WCAG21/Understanding/target-size.html)

