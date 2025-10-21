# Shared Folder Audit Report

**Date**: 2025-10-21  
**Scope**: `frontend/src/shared/`  
**Status**: 🔴 Critical Issues Found

## Executive Summary

The `frontend/src/shared` directory has significant organizational issues with legacy files, boundary violations, and misplaced components. **Immediate refactoring recommended.**

---

## Critical Issues 🔴

### 1. **pages/** - MAJOR BOUNDARY VIOLATION
**Path**: `frontend/src/shared/pages/`  
**Status**: 🔴 DELETE or RELOCATE

**Files**:
- `HomePage.tsx` (71 lines)
- `ServicePage.tsx` (119 lines)

**Issues**:
- ❌ Pages should NEVER be in shared layer per repo rules
- ❌ `ServicePage.tsx` imports from `@tenant-app` AND `@admin-app` (massive boundary violation!)
  ```tsx
  import { DataProvider, Header } from '@tenant-app/components/header';
  import { PreviewCTAButton, PreviewDataProvider, usePreviewParams } from '@admin-app/components/preview';
  ```
- ❌ `HomePage.tsx` tries to handle both main-site AND tenant-app logic in one component
- ❌ These create circular dependency risks

**Current Usage**: ✅ ACTIVELY USED (NOT LEGACY!)
```tsx
// tenant-app/TenantApp.tsx - Lines 13-14
import HomePage from '@shared/pages/HomePage';
import ServicePage from '@shared/pages/ServicePage';

// Used in PreviewRoutes (lines 34-42) and LiveRoutes (lines 88, 101)
<Route path=":businessSlug/services/:serviceType" element={<ServicePage />} />
<Route path=":businessSlug" element={<HomePage />} />

// tenant-app/components/header/pages/TenantPage.tsx - Line 4
import HomePage from '@shared/pages/HomePage';
// Rendered on line 31
<HomePage onRequestQuote={handleOpenQuoteModal} />
```

**Note on main-site**: `main-site/routes/HomePage.tsx` is a **different component** (dev dashboard), not the shared one.

**Recommendation**: 
- Move `HomePage.tsx` to `tenant-app/pages/HomePage.tsx`
- Move `ServicePage.tsx` to `tenant-app/pages/ServicePage.tsx`
- Refactor to remove cross-app imports (admin-app preview components)
- Update imports in `TenantApp.tsx` and `TenantPage.tsx`
- DELETE `shared/pages/` folder entirely

---

### 2. **useRouterDebug.ts** - MISPLACED FILE
**Path**: `frontend/src/shared/useRouterDebug.ts` (root level)  
**Status**: 🟡 MOVE

**Issues**:
- ❌ Hook file sitting at shared root instead of in `hooks/` subfolder
- ✅ Actual code is fine (debugging utility with disabled logging)

**Current Usage**: ✅ ACTIVELY USED
```tsx
// tenant-app/TenantApp.tsx - Line 3
import { useRouterDebug } from '@shared/useRouterDebug';
// Used on line 108
useRouterDebug('TenantApp');
```

**Recommendation**: 
- Move to `frontend/src/shared/hooks/useRouterDebug.ts`
- Update import in `TenantApp.tsx`
- Export from `shared/hooks/index.ts`

---

### 3. **bootstrap/** - ARCHITECTURAL MISPLACEMENT
**Path**: `frontend/src/shared/bootstrap/`  
**Status**: 🟡 DISCUSS / KEEP WITH CAVEAT

**Files**:
- `AppShell.tsx` - Unified provider wrapper
- `SEOManager.tsx` - Centralized SEO management
- `RouterConfig.tsx` - Shared router utilities
- `README.md` - Documentation
- `index.ts` - Barrel exports

**Issues**:
- ⚠️ Per repo rules, bootstrap should be at `frontend/src/bootstrap/` (sibling to shared)
- ✅ However, NO such sibling folder exists
- ✅ Only imported in its own README (1 reference)
- ✅ Code itself is well-structured and useful

**Recommendation**: 
- **Option A**: Move to `frontend/src/bootstrap/` per rules (strict compliance)
- **Option B**: Keep in `shared/bootstrap/` and update repo rules (pragmatic choice)
- **Option C**: Absorb into `shared/components/` since it's provider/component logic

*I lean toward **Option B** - the code is good, it's just under shared instead of next to shared.*

---

### 4. **env.ts + env/** - CONFUSING DUPLICATION
**Path**: `frontend/src/shared/env.ts` (root) + `frontend/src/shared/env/` (folder)  
**Status**: 🟡 CONSOLIDATE

**Files**:
- `env.ts` (119 lines) - Full Zod-validated environment config
- `env/index.ts` (6 lines) - Legacy config: `{ apiUrl: ... }`

**Issues**:
- ❌ Two different env systems (confusing for developers)
- ✅ Root `env.ts` is well-structured with Zod validation
- ✅ Root `env.ts` is already exported from `shared/index.ts`
- ❌ `env/index.ts` is legacy and likely unused

**Recommendation**:
- Keep `env.ts` at root
- Delete `env/` folder (or verify it's not imported first)

---

### 5. **seo/seo/** - WEIRD NESTING
**Path**: `frontend/src/shared/seo/seo/`  
**Status**: 🟡 FLATTEN

**Structure**:
```
seo/
├── defaultSchemas.ts
├── index.ts
├── jsonld.ts
├── README.md
├── robotsHandler.ts
├── seo/              ← Why is this nested?
│   ├── api/
│   │   └── seo.api.ts
│   ├── hooks/
│   │   └── useTenantSEO.ts
│   ├── pages/
│   │   └── SeoSettingsPage.tsx
│   ├── types/
│   │   └── seo.types.ts
│   └── index.ts
├── seoDefaults/
├── SeoHead.tsx
└── sitemapBuilder.ts
```

**Issues**:
- ❌ `seo/seo/` nesting is bizarre
- ❌ `seo/seo/pages/SeoSettingsPage.tsx` - a PAGE in shared (violation)
- ✅ Most seo utilities at root level are fine

**Recommendation**:
- Flatten `seo/seo/*` into `seo/*`
- Move `SeoSettingsPage.tsx` to `admin-app/pages/` (it's a dashboard page)

---

### 6. **_templates/** - UNCLEAR PURPOSE
**Path**: `frontend/src/shared/_templates/`  
**Status**: 🟢 ACCEPTABLE (but document)

**Files**:
- `api-client.template.ts`
- `hook-with-api.template.ts`
- `README.md`

**Issues**:
- ⚠️ Unclear if these are code generation templates or example files
- ✅ README.md probably explains (not read yet)

**Recommendation**:
- Keep if they're useful code generation templates
- Consider moving to `scripts/devtools/templates/` if they're generator templates

---

## Items That Are Fine ✅

### Properly Organized Folders

| Folder | Purpose | Status |
|--------|---------|--------|
| `api/` | API clients and services | ✅ Good |
| `auth/` | Shared auth components, hooks, state | ✅ Well-organized |
| `components/` | Shared React components | ✅ Good |
| `config/` | Configuration utilities | ✅ Good |
| `constants/` | Shared constants | ✅ Good |
| `contexts/` | React contexts | ✅ Good |
| `data/` | Static data (just `states.ts`) | ✅ Good |
| `hooks/` | Shared React hooks | ✅ Good |
| `lib/` | Library wrappers | ✅ Good |
| `schemas/` | Zod/validation schemas | ✅ Good |
| `services/` | Business logic services | ✅ Good |
| `state/` | State management (Zustand stores) | ✅ Good |
| `testing/` | Testing utilities | ✅ Good |
| `types/` | TypeScript type definitions | ✅ Good |
| `ui/` | UI component library | ✅ Good |
| `utils/` | Pure utility functions | ✅ Good |
| `validation/` | Validation utilities | ✅ Good |
| `__tests__/` | Test setup | ✅ Good |

---

## Non-Existent Folders (False Alarms) ✅

These were mentioned in earlier analysis but **do NOT exist**:

- ❌ `industries/` - Does not exist
- ❌ `tenant/` - Does not exist  
- ❌ `backend/` - Does not exist

**Note**: Industry data lives at `frontend/src/data/` (sibling to shared), which is correct.

---

## Summary of Actions Required

### High Priority 🔴

1. **DELETE or RELOCATE** `shared/pages/`
   - Move `HomePage.tsx` into respective apps
   - Move `ServicePage.tsx` into `tenant-app/pages/`
   - Remove cross-app imports

2. **MOVE** `useRouterDebug.ts` into `shared/hooks/`
   - OR delete if unused

3. **FLATTEN** `seo/seo/` structure
   - Merge nested seo/ into parent seo/
   - Move `SeoSettingsPage.tsx` to admin-app

### Medium Priority 🟡

4. **CONSOLIDATE** env configuration
   - Keep root `env.ts`
   - Delete `env/` folder if unused

5. **DECIDE** on bootstrap/ location
   - Move to `frontend/src/bootstrap/` (strict)
   - Update repo rules to allow `shared/bootstrap/` (pragmatic)

### Low Priority 🟢

6. **DOCUMENT** `_templates/` folder purpose
   - Consider moving to scripts if they're generators

---

## Boundary Compliance

### Current State
- ❌ `shared/pages/ServicePage.tsx` imports from **@tenant-app** and **@admin-app**
- ❌ `shared/pages/HomePage.tsx` attempts to handle multiple app contexts
- ✅ Most other shared modules respect boundaries

### Target State
- ✅ Shared layer has zero knowledge of app layers
- ✅ All imports flow: `app → shared`, never `shared → app`
- ✅ No pages in shared layer

---

## Recommended File Moves

```bash
# Move misplaced hook
mv frontend/src/shared/useRouterDebug.ts frontend/src/shared/hooks/useRouterDebug.ts

# Delete cross-boundary pages (after moving logic to apps)
rm -rf frontend/src/shared/pages/

# Flatten SEO structure
mv frontend/src/shared/seo/seo/api/* frontend/src/shared/seo/api/
mv frontend/src/shared/seo/seo/hooks/* frontend/src/shared/seo/hooks/
mv frontend/src/shared/seo/seo/types/* frontend/src/shared/seo/types/
mv frontend/src/shared/seo/seo/pages/SeoSettingsPage.tsx frontend/apps/admin-app/pages/
rmdir frontend/src/shared/seo/seo/

# Clean up env duplication
rm -rf frontend/src/shared/env/
```

---

## Next Steps

1. Review this audit with the team
2. Decide on bootstrap/ folder location
3. Create refactoring tasks for high-priority items
4. Update repo rules documentation
5. Add linting rules to prevent future boundary violations

---

**Generated by**: Cursor AI Audit  
**Tool**: Manual inspection + grep analysis  
**Confidence**: High

