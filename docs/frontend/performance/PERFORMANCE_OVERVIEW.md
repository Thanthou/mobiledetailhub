# Performance & Optimization Overview

**Complete guide to frontend performance optimization and mobile responsiveness.**

---

## 📋 Quick Reference

### Performance Monitoring
```bash
npm run build:analyze    # Visual bundle analyzer
npm run check:sizes      # Bundle size check
npm run audit:performance  # Lighthouse audit
```

### Mobile Development
- **Dev viewport switcher**: Bottom-right corner (dev mode only)
- **Breakpoints**: `mobile` (390px), `tablet` (768px), `desktop` (1280px)

---

## 🚀 Performance Optimization

### 1. JavaScript Bundle Optimization

#### Current Status ✅
- **Vendor splitting**: React, routing, and query libraries separated
- **Lazy loading**: Features loaded by domain
- **Critical path**: Essential code in main bundle
- **Shared code**: Efficiently grouped

#### Bundle Analysis

```bash
# Visual analysis
npm run build:analyze

# Shows:
# - Chunk sizes and dependencies
# - Gzip/Brotli compression ratios
# - Unused code detection
```

#### Best Practices

**DO ✅:**
```javascript
// Import specific icons
import { Star, Heart } from 'lucide-react';

// Lazy load heavy components
const HeavyComponent = lazy(() => import('./HeavyComponent'));

// Use React.memo for expensive renders
const ExpensiveComponent = React.memo(({ data }) => {
  return <div>{/* expensive render */}</div>;
});
```

**DON'T ❌:**
```javascript
// Import entire icon library
import * as Icons from 'lucide-react';

// Load everything upfront
import HeavyComponent from './HeavyComponent';
```

---

### 2. Text Compression

#### Backend (Express) ✅
```javascript
// Gzip compression enabled (level 6)
import compression from 'compression';
app.use(compression({ level: 6 }));
```

#### Vite Build ✅
```javascript
// Build output is pre-compressed
build: {
  minify: 'terser',
  sourcemap: true
}
```

---

### 3. Image Optimization

#### Formats
- **Use WebP** for photos (70-80% smaller than JPEG)
- **Use SVG** for logos and icons
- **Lazy load** off-screen images

#### Implementation
```jsx
// Lazy loading with native browser support
<img
  src="/images/hero.webp"
  loading="lazy"
  alt="Description"
/>

// Responsive images
<picture>
  <source srcSet="/images/hero-mobile.webp" media="(max-width: 768px)" />
  <source srcSet="/images/hero-desktop.webp" media="(min-width: 769px)" />
  <img src="/images/hero-desktop.webp" alt="Hero" />
</picture>
```

#### Tools
```bash
# Convert to WebP
npx @squoosh/cli --webp auto *.jpg

# Optimize SVGs
npx svgo *.svg
```

---

### 4. Code Splitting Strategy

#### Current Vite Config
```javascript
build: {
  rollupOptions: {
    output: {
      manualChunks: (id) => {
        // React ecosystem
        if (id.includes('react') || id.includes('react-dom'))
          return 'react-vendor';
        
        // Query libraries
        if (id.includes('@tanstack'))
          return 'query-vendor';
        
        // Icons
        if (id.includes('lucide-react'))
          return 'icons-vendor';
        
        // All other node_modules
        if (id.includes('node_modules'))
          return 'vendor';
      }
    }
  }
}
```

#### Route-Based Splitting
```javascript
// Lazy load route components
const HomePage = lazy(() => import('./pages/HomePage'));
const Dashboard = lazy(() => import('./pages/Dashboard'));

// Wrap in Suspense
<Suspense fallback={<LoadingSpinner />}>
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/dashboard" element={<Dashboard />} />
  </Routes>
</Suspense>
```

---

### 5. Caching Strategy

#### Service Worker (PWA)
```javascript
// Cache static assets
workbox.precaching.precacheAndRoute(self.__WB_MANIFEST);

// Cache API responses
workbox.routing.registerRoute(
  /^https:\/\/api\.thatsmartsite\.com\//,
  new workbox.strategies.NetworkFirst({
    cacheName: 'api-cache',
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 5 * 60 // 5 minutes
      })
    ]
  })
);
```

#### HTTP Headers
```javascript
// Express cache headers
app.use('/assets', express.static('dist/assets', {
  maxAge: '1y',
  immutable: true
}));
```

---

### 6. Performance Monitoring

#### Lighthouse Scores

Target metrics:
- **Performance**: 90+
- **Accessibility**: 95+
- **Best Practices**: 95+
- **SEO**: 100

```bash
# Run audit
npm run audit:seo

# Check results
cat docs/audits/SEO_AUDIT.md
```

#### Core Web Vitals

**LCP (Largest Contentful Paint)**: < 2.5s
- Optimize hero images
- Preload critical resources
- Use CDN for assets

**FID (First Input Delay)**: < 100ms
- Minimize JavaScript execution
- Code split large bundles
- Use web workers for heavy tasks

**CLS (Cumulative Layout Shift)**: < 0.1
- Set image dimensions
- Reserve space for ads/embeds
- Use font-display: swap

---

## 📱 Mobile Optimization

### Responsive Breakpoints

```css
/* Tailwind breakpoints (mobile-first) */
sm: 640px   /* Small tablets */
md: 768px   /* Tablets */
lg: 1024px  /* Small laptops */
xl: 1280px  /* Desktops */
2xl: 1536px /* Large desktops */
```

### Dev Viewport Switcher

#### What It Does
Floating viewport switcher (dev mode only) for testing different screen sizes.

#### How to Use

1. **Start dev server**: `npm run dev`
2. **Find the control**: Bottom-right corner
3. **Select viewport**:
   - **Full Width**: Normal browser width
   - **💻 Desktop (1280px)**
   - **📱 Tablet (768px)**
   - **📱 Mobile (390px)**

#### Features
- Persists in `localStorage`
- Deep-link support: `?viewport=mobile`
- Keyboard shortcut: `Alt+V`

#### Implementation
```jsx
// src/shared/components/ViewportSwitcher.tsx
{import.meta.env.DEV && <ViewportSwitcher />}
```

---

### Mobile-First Development

#### CSS Approach
```css
/* Base styles (mobile) */
.hero {
  font-size: 24px;
  padding: 1rem;
}

/* Tablet and up */
@media (min-width: 768px) {
  .hero {
    font-size: 32px;
    padding: 2rem;
  }
}

/* Desktop and up */
@media (min-width: 1280px) {
  .hero {
    font-size: 48px;
    padding: 4rem;
  }
}
```

#### Tailwind Approach
```jsx
<div className="
  text-2xl p-4        /* Mobile */
  md:text-3xl md:p-8  /* Tablet */
  xl:text-5xl xl:p-16 /* Desktop */
">
  Responsive Text
</div>
```

---

### Touch Optimization

#### Tap Targets
```css
/* Minimum 44x44px for touch targets */
.button {
  min-width: 44px;
  min-height: 44px;
  padding: 12px 24px;
}
```

#### Hover States
```css
/* Disable hover on touch devices */
@media (hover: hover) {
  .button:hover {
    background: #007bff;
  }
}
```

#### Gestures
```javascript
// Swipe detection
import { useSwipe } from '@/hooks/useSwipe';

const { onTouchStart, onTouchMove, onTouchEnd } = useSwipe({
  onSwipeLeft: () => console.log('Swiped left'),
  onSwipeRight: () => console.log('Swiped right')
});

<div
  onTouchStart={onTouchStart}
  onTouchMove={onTouchMove}
  onTouchEnd={onTouchEnd}
>
  Swipeable content
</div>
```

---

### Mobile Images

#### Hero Images
```jsx
// Mobile-specific hero
{isMobile ? (
  <img
    src="/images/hero-mobile.webp"
    width="390"
    height="600"
    alt="Hero"
  />
) : (
  <img
    src="/images/hero-desktop.webp"
    width="1920"
    height="1080"
    alt="Hero"
  />
)}
```

#### Responsive Images
```jsx
<picture>
  <source
    srcSet="/images/product-small.webp"
    media="(max-width: 640px)"
  />
  <source
    srcSet="/images/product-medium.webp"
    media="(max-width: 1024px)"
  />
  <img
    src="/images/product-large.webp"
    alt="Product"
    loading="lazy"
  />
</picture>
```

---

## 🎯 Performance Checklist

### Initial Load
- [ ] Critical CSS inlined
- [ ] Non-critical CSS loaded async
- [ ] JavaScript deferred or async
- [ ] Preload critical resources
- [ ] Use CDN for static assets

### Runtime
- [ ] Lazy load images
- [ ] Code split routes
- [ ] Memoize expensive components
- [ ] Debounce scroll/resize handlers
- [ ] Use virtualization for long lists

### Mobile
- [ ] Touch targets ≥ 44px
- [ ] Viewport meta tag set
- [ ] Mobile-optimized images
- [ ] Disable hover on touch
- [ ] Test on real devices

### SEO & Accessibility
- [ ] Semantic HTML
- [ ] Alt text for images
- [ ] ARIA labels where needed
- [ ] Keyboard navigation
- [ ] Color contrast ≥ 4.5:1

---

## 🛠️ Development Tools

### Bundle Analysis
```bash
npm run build:analyze
```

Opens visualizer showing:
- Bundle composition
- Duplicate dependencies
- Unused code
- Compression ratios

### Performance Profiling
```bash
# React DevTools Profiler
# 1. Install React DevTools extension
# 2. Open "Profiler" tab
# 3. Click record
# 4. Interact with app
# 5. Stop recording
# 6. Analyze flame graph
```

### Lighthouse CI
```bash
# Install
npm install -g @lhci/cli

# Run
lhci autorun --collect.url=http://localhost:5173

# Compare
lhci compare --url1=commit1 --url2=commit2
```

---

## 📊 Monitoring & Metrics

### Real User Monitoring (RUM)

```javascript
// Track Core Web Vitals
import { onCLS, onFID, onLCP } from 'web-vitals';

onCLS(metric => console.log('CLS:', metric.value));
onFID(metric => console.log('FID:', metric.value));
onLCP(metric => console.log('LCP:', metric.value));
```

### Custom Metrics

```javascript
// Track component render time
import { measure } from '@/utils/performance';

const MyComponent = () => {
  useEffect(() => {
    const stop = measure('MyComponent');
    return () => stop();
  }, []);
  
  return <div>Content</div>;
};
```

---

## 📚 Related Documentation

- **Vite Configuration**: `docs/frontend/build/VITE_CONFIG_UNIFICATION.md`
- **SEO Optimization**: `docs/audits/`
- **PWA Features**: `docs/frontend/apps/PWA_ADD_TO_HOME_SCREEN.md`
- **Mobile Images**: `docs/frontend/performance/MOBILE_HERO_IMAGES.md`

---

**Last Updated**: October 19, 2025  
**Maintained By**: Development Team

