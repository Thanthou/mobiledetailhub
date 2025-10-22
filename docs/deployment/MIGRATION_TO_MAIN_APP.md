# Migration Guide: 3-App → 2-App Architecture

**Date:** 2025-10-22  
**Status:** 🟡 Phase 1 Complete (Documentation)  
**Target:** Merge `main-site/` + `tenant-app/` → `main/`

---

## 📋 Overview

### What We're Doing

**Before (3 apps):**
```
frontend/apps/
├── main-site/      → Marketing site (thatsmartsite.com)
├── tenant-app/     → Tenant sites (subdomain.thatsmartsite.com)
└── admin-app/      → Admin dashboard (admin.thatsmartsite.com)
```

**After (2 apps):**
```
frontend/apps/
├── main/           → Unified site engine (marketing + all tenant sites)
└── admin-app/      → Admin dashboard (unchanged)
```

### Why?

✅ **DRY** → Single codebase for all public-facing sites  
✅ **Dogfooding** → Marketing site uses the same platform  
✅ **Simpler boundaries** → Only 2 apps, clear separation  
✅ **Less duplication** → Shared components naturally belong in one place  
✅ **Easier audits** → Only check `main ↔ admin-app` boundaries  

---

## 🎯 Migration Phases

### ✅ Phase 1: Documentation & Planning (COMPLETE)
- [x] Update `.cursorrules` with new architecture
- [x] Create this migration guide
- [x] Document new import patterns

### 🟡 Phase 2: Setup Structure (NEXT)
- [ ] Create `apps/main/` directory
- [ ] Set up `vite.config.main.ts`
- [ ] Copy base files (package.json, index.html, etc.)
- [ ] Create merged entry point (`main.tsx`)
- [ ] Set up runtime detection logic

### ⏳ Phase 3: Merge Components
- [ ] Audit component overlap
- [ ] Move components to appropriate locations
- [ ] Update imports across codebase
- [ ] Add feature flags where needed

### ⏳ Phase 4: Clean Up
- [ ] Delete `main-site/` directory
- [ ] Delete `tenant-app/` directory
- [ ] Update all Vite configs
- [ ] Update TypeScript paths
- [ ] Run build tests
- [ ] Update documentation

---

## 📂 Phase 2: Setup Structure

### Step 1: Create Directory Structure

```bash
mkdir -p frontend/apps/main/src/{components,pages,hooks,utils,types}
mkdir -p frontend/apps/main/src/features-wip
mkdir -p frontend/apps/main/src/features-experimental
mkdir -p frontend/apps/main/public
```

### Step 2: Create Base Files

**`frontend/apps/main/index.html`:**
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/icons/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="theme-color" content="#0b0b0b" />
    <title>That Smart Site - Professional Websites for Local Businesses</title>
    <meta name="description" content="White-label website platform for local service businesses. Get your professional site in minutes." />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="./src/main.tsx"></script>
  </body>
</html>
```

**`frontend/apps/main/src/main.tsx`:**
```typescript
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import { ErrorBoundary } from '@shared/ui';
import { MainApp } from './MainApp';
import { MainProviders } from './MainProviders';
import '../../../src/index.css';

const container = document.getElementById('root');
if (!container) {
  throw new Error('Root element not found');
}

const root = createRoot(container);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ErrorBoundary>
        <MainProviders>
          <MainApp />
        </MainProviders>
      </ErrorBoundary>
    </BrowserRouter>
  </React.StrictMode>
);
```

**`frontend/apps/main/src/MainApp.tsx`:**
```typescript
import { lazy, Suspense, useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useRouterDebug } from '@shared/hooks';
import { getTenantId, isTenantZero } from '@shared/utils';

// Lazy load mode-specific apps
const ShowcaseApp = lazy(() => import('./modes/ShowcaseApp'));
const TenantSiteApp = lazy(() => import('./modes/TenantSiteApp'));

export default function MainApp() {
  useRouterDebug('MainApp');
  const [tenantId, setTenantId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Detect tenant from hostname
    const detectTenant = async () => {
      const id = await getTenantId();
      setTenantId(id);
      setLoading(false);
    };
    
    detectTenant();
  }, []);

  if (loading) {
    return <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="text-xl">Loading...</div>
    </div>;
  }

  // Runtime branching: Tenant-0 = showcase, others = standard sites
  return (
    <Suspense fallback={<div className="p-8 text-white">Loading site...</div>}>
      {isTenantZero(tenantId) ? (
        <ShowcaseApp />
      ) : (
        <TenantSiteApp tenantId={tenantId} />
      )}
    </Suspense>
  );
}
```

### Step 3: Create Vite Config

**`frontend/vite.config.main.ts`:**
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'node:url';
import { sharedPublicConfig } from './vite.shared-public.config';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: 'apps/main',
  base: '/',
  publicDir: sharedPublicConfig.publicDir,
  plugins: [react()],
  resolve: {
    alias: {
      '@shared': path.resolve(__dirname, 'src/shared'),
      '@/main': path.resolve(__dirname, 'apps/main/src'),
      '@main': path.resolve(__dirname, 'apps/main/src'),
      '@/admin-app': path.resolve(__dirname, 'apps/admin-app/src'),
      '@admin-app': path.resolve(__dirname, 'apps/admin-app/src'),
      '@/data': path.resolve(__dirname, 'src/data'),
      '@data': path.resolve(__dirname, 'src/data'),
      '@/../config': path.resolve(__dirname, 'config'),
    },
    dedupe: ['react', 'react-dom', 'scheduler'],
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    port: 5175,
    strictPort: true,
    host: '0.0.0.0',
    open: false,
    cors: true,
    fs: {
      allow: ['../..'],
    },
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      },
      '/uploads': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    outDir: '../../dist/main',
    emptyOutDir: true,
  },
});
```

### Step 4: Update package.json Scripts

**`frontend/package.json`:**
```json
{
  "scripts": {
    "dev:main": "npx vite --config vite.config.main.ts",
    "build:main": "npx vite build --config vite.config.main.ts && node scripts/post-build.js",
    "preview:main": "npx vite preview --config vite.config.main.ts",
    
    "dev:admin": "npx vite --config vite.config.admin.ts",
    "build:admin": "npx vite build --config vite.config.admin.ts && node scripts/post-build.js",
    
    "dev:all": "concurrently -n MAIN,ADMIN,BACKEND -c cyan,magenta,green \"npm run dev:main\" \"npm run dev:admin\" \"npm run dev:backend\"",
    "build:all": "npm run build:main && npm run build:admin"
  }
}
```

---

## 📦 Phase 3: Merge Components

### Component Audit

Components that exist in BOTH apps need merging:

| Component | main-site | tenant-app | Decision |
|-----------|-----------|------------|----------|
| **Hero** | ✅ | ✅ | **Merge** → Add `mode` prop |
| **Header** | ✅ | ✅ | **Merge** → Add showcase/tenant variants |
| **Footer** | ✅ | ✅ | **Merge** → Use tenant config |
| **Gallery** | ❌ | ✅ | **Keep** → Tenant-only (in components/) |
| **Reviews** | ❌ | ✅ | **Keep** → Tenant-only |
| **Services** | ❌ | ✅ | **Keep** → Tenant-only |
| **Booking** | ❌ | ✅ | **Keep** → Tenant-only |
| **FAQ** | ❌ | ✅ | **Keep** → Tenant-only |
| **Quotes** | ❌ | ✅ | **Keep** → Tenant-only |
| **Onboarding** | ✅ | ❌ | **Keep** → Showcase-only |
| **Pricing** | ✅ | ❌ | **Keep** → Showcase-only |

### Migration Strategy

**For Shared Components (Hero, Header, Footer):**
```typescript
// Before (separate)
// main-site/Hero.tsx
// tenant-app/Hero.tsx

// After (unified with branching)
// apps/main/components/hero/Hero.tsx
interface HeroProps {
  mode: 'showcase' | 'tenant';
  config: TenantConfig;
}

export function Hero({ mode, config }: HeroProps) {
  if (mode === 'showcase') {
    return <ShowcaseHero config={config} />;
  }
  return <TenantHero config={config} />;
}
```

**For App-Specific Components:**
```
apps/main/
├── components/
│   ├── hero/          ← Unified (with mode variants)
│   ├── header/        ← Unified
│   ├── footer/        ← Unified
│   ├── gallery/       ← Tenant-only (no showcase variant)
│   ├── reviews/       ← Tenant-only
│   ├── services/      ← Tenant-only
│   └── booking/       ← Tenant-only
└── modes/
    ├── showcase/
    │   ├── ShowcaseApp.tsx
    │   ├── pages/
    │   │   ├── PricingPage.tsx
    │   │   └── OnboardingPage.tsx
    │   └── components/
    │       └── FeatureShowcase.tsx
    └── tenant/
        ├── TenantSiteApp.tsx
        └── pages/
            ├── ServicePage.tsx
            └── BookingPage.tsx
```

---

## 🗑️ Phase 4: Clean Up

### Files to Delete

```bash
# After verifying main/ works
rm -rf frontend/apps/main-site/
rm -rf frontend/apps/tenant-app/

# Delete old configs
rm frontend/vite.config.main-site.ts  # if exists
rm frontend/vite.config.tenant.ts
```

### Files to Update

**`frontend/tsconfig.json`:**
```json
{
  "compilerOptions": {
    "paths": {
      "@/main/*": ["./apps/main/src/*"],
      "@main/*": ["./apps/main/src/*"],
      "@/admin-app/*": ["./apps/admin-app/src/*"],
      "@admin-app/*": ["./apps/admin-app/src/*"],
      "@shared/*": ["./src/shared/*"],
      "@data/*": ["./src/data/*"]
    }
  }
}
```

**`scripts/audits/audit-flows-frontend.js`:**
```javascript
const APPS = {
  'main': {
    name: 'main',
    entry: 'apps/main/src/main.tsx',
    dir: path.join(frontendDir, 'apps/main'),
    alias: '@/main'
  },
  'admin-app': {
    name: 'admin-app',
    entry: 'apps/admin-app/src/main.tsx',
    dir: path.join(frontendDir, 'apps/admin-app'),
    alias: '@/admin-app'
  }
};
```

---

## 🧪 Testing Checklist

After migration, verify:

### Main App
- [ ] Marketing site loads at `localhost:5175`
- [ ] Tenant sites load with subdomain simulation
- [ ] Runtime detection works (Tenant-0 vs Tenant-N)
- [ ] All routes work in both modes
- [ ] Booking flow works (tenant mode only)
- [ ] Gallery/Reviews render (tenant mode only)
- [ ] Onboarding/Pricing work (showcase mode only)

### Admin App
- [ ] Admin dashboard loads at `localhost:5176`
- [ ] No broken imports
- [ ] All features still functional

### Build
- [ ] `npm run build:main` succeeds
- [ ] `npm run build:admin` succeeds
- [ ] `npm run build:all` succeeds
- [ ] Production builds work

### Audits
- [ ] `npm run audit:flows:main` passes
- [ ] `npm run audit:flows:admin` passes
- [ ] No unreachable files (except features-wip/)

---

## 🚨 Rollback Plan

If migration fails:

1. **Git revert** all changes
2. Or restore from backup:
   ```bash
   git checkout main
   git reset --hard origin/main
   ```

---

## 📝 Import Pattern Changes

### Before (3 apps)
```typescript
// From main-site
import { Hero } from '@/main-site/components/hero';

// From tenant-app
import { Gallery } from '@/tenant-app/components/gallery';

// Shared (unchanged)
import { Button } from '@shared/ui';
```

### After (2 apps)
```typescript
// From main (unified)
import { Hero } from '@/main/components/hero';
import { Gallery } from '@/main/components/gallery';

// Shared (unchanged)
import { Button } from '@shared/ui';
```

---

## 🎯 Success Criteria

Migration is complete when:

✅ Old `main-site/` and `tenant-app/` directories are deleted  
✅ New `main/` app runs both marketing and tenant modes  
✅ All builds pass without errors  
✅ All audits pass  
✅ No broken imports  
✅ Documentation is updated  
✅ Team is onboarded to new structure  

---

## 📚 Related Documentation

- [Feature Maturity System](../devtools/FEATURE_MATURITY_SYSTEM.md)
- [Unreachable Files Analysis](../audits/UNREACHABLE_FILES_ANALYSIS.md)
- [Project Structure](../overview/PROJECT_STRUCTURE.md)

---

**Next Steps:** Proceed to Phase 2 when ready!

