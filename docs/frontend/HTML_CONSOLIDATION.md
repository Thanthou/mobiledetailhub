# HTML File Consolidation - Task #1 Complete ✅

**Date**: October 20, 2025  
**Status**: ✅ Complete

## Problem
Multiple duplicate `index.html` entry points across both `frontend/` root level *and* `frontend/apps/` directories caused:
- Confusing base paths and build outputs
- Inconsistent favicon references
- Build/preview issues
- No single source of truth

## Solution Implemented

### 1. Source Files Consolidated
**Single source of truth** → `frontend/apps/*/index.html`:
- ✅ `frontend/apps/main-site/index.html`
- ✅ `frontend/apps/admin-app/index.html`
- ✅ `frontend/apps/tenant-app/index.html`

**Deleted duplicates**:
- ❌ `frontend/main-site/index.html`
- ❌ `frontend/admin-app/index.html`
- ❌ `frontend/tenant-app/index.html`
- ❌ `frontend/index.html`
- ❌ `frontend/src/main-site/index.html`

### 2. Vite Configs Updated
All three configs now point to canonical source and output to backend-expected directories:

**`frontend/vite.config.main.ts`**:
```ts
build: {
  outDir: 'dist/main',  // was: dist/main-site
  rollupOptions: {
    input: path.resolve(__dirname, 'apps/main-site/index.html'),
  },
}
```

**`frontend/vite.config.admin.ts`**:
```ts
build: {
  outDir: 'dist/admin',  // was: dist/admin-app
  rollupOptions: {
    input: path.resolve(__dirname, 'apps/admin-app/index.html'),
  },
}
```

**`frontend/vite.config.tenant.ts`**:
```ts
build: {
  outDir: 'dist/tenant',  // was: dist/tenant-app
  rollupOptions: {
    input: path.resolve(__dirname, 'apps/tenant-app/index.html'),
  },
}
```

**`frontend/vite.config.ts`** (fallback multi-entry config):
```ts
rollupOptions: {
  input: {
    "main-site": path.resolve(__dirname, "apps/main-site/index.html"),
    "tenant-app": path.resolve(__dirname, "apps/tenant-app/index.html"),
    "admin-app": path.resolve(__dirname, "apps/admin-app/index.html"),
  },
}
```

### 3. Post-Build Script Added
**File**: `frontend/scripts/post-build.js`

Vite preserves directory structure from source, so HTML files were being nested at `dist/*/apps/*/index.html`. The post-build script:
1. ✅ Moves HTML from `dist/*/apps/*/index.html` → `dist/*/index.html`
2. ✅ Fixes asset paths: `../../assets/` → `./assets/`
3. ✅ Cleans up nested `apps/` directories

**Integrated into build scripts**:
```json
"build:main": "vite build --config vite.config.main.ts && node scripts/post-build.js",
"build:admin": "vite build --config vite.config.admin.ts && node scripts/post-build.js",
"build:tenant": "vite build --config vite.config.tenant.ts && node scripts/post-build.js"
```

### 4. Favicon Unified
All apps now use the same default favicon:
```html
<link rel="icon" type="image/x-icon" href="./favicon.ico" />
```

References `frontend/public/favicon.ico` which is served by all apps.

## File Structure (After)

```
frontend/
├── apps/
│   ├── main-site/
│   │   └── index.html          ← Single source of truth
│   ├── admin-app/
│   │   └── index.html          ← Single source of truth
│   └── tenant-app/
│       └── index.html          ← Single source of truth
├── dist/
│   ├── main/
│   │   ├── index.html          ← Flattened by post-build
│   │   ├── assets/
│   │   └── favicon.ico
│   ├── admin/
│   │   ├── index.html          ← Flattened by post-build
│   │   ├── assets/
│   │   └── favicon.ico
│   └── tenant/
│       ├── index.html          ← Flattened by post-build
│       ├── assets/
│       └── favicon.ico
├── scripts/
│   └── post-build.js           ← New: flattens HTML output
├── vite.config.main.ts         ← Updated
├── vite.config.admin.ts        ← Updated
├── vite.config.tenant.ts       ← Updated
└── vite.config.ts              ← Updated
```

## Backend Integration

The backend expects HTML at:
- `frontend/dist/main/index.html` ✅
- `frontend/dist/admin/index.html` ✅
- `frontend/dist/tenant/index.html` ✅

**No backend changes required** - our build output now matches expectations.

## Verification

All builds pass:
```bash
npm run build:all
```

Output structure:
```
✓ dist/main/index.html       (favicon: ./favicon.ico, assets: ./assets/*)
✓ dist/admin/index.html      (favicon: ./favicon.ico, assets: ./assets/*)
✓ dist/tenant/index.html     (favicon: ./favicon.ico, assets: ./assets/*)
```

## Benefits

1. ✅ **Single source of truth** - All HTML files in `frontend/apps/*/`
2. ✅ **No duplicates** - Eliminated 5 duplicate HTML files
3. ✅ **Clear structure** - Organized by app in `apps/` directory
4. ✅ **Backend compatible** - Output matches server expectations
5. ✅ **Unified favicon** - Consistent across all apps
6. ✅ **Maintainable** - Post-build script handles path flattening automatically

## Next Steps

From the original "Top 5 Focus" list:
- ✅ **#1: Unify multi-app Vite build/preview** - COMPLETE
- 🔜 **#2: Harden `/api/analytics/track`**
- 🔜 **#3: Tenant deletion service layer**
- 🔜 **#4: Standardize subdomain routing**
- 🔜 **#5: Runtime config discipline**

## Notes

- Empty directories `frontend/main-site/`, `frontend/admin-app/`, `frontend/tenant-app/` remain but can be manually deleted
- Post-build script warnings about missing files are expected when running `build:all` (each build cleans up its own nested folder)
- The `vite.config.ts` fallback config is kept for compatibility but the per-app configs are preferred

---

**Related Files**:
- Source HTML: `frontend/apps/{main-site,admin-app,tenant-app}/index.html`
- Vite configs: `frontend/vite.config.{main,admin,tenant}.ts`
- Post-build: `frontend/scripts/post-build.js`
- Backend server: `backend/server.js` (lines 254-281)

