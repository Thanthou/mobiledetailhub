# Refactoring Checklist - Architecture Cleanup

Generated: 2025-10-14  
Based on: `.cursorrules` compliance audit

---

## ✅ Priority 1: Cross-Feature Import Boundaries
**Status:** ✅ COMPLETE  
**Impact:** 🔥 Critical - Prevents architecture decay

- [x] Features isolated with no cross-imports
- [x] Page compositions properly documented with eslint-disable
- [x] Boundary linter in place (`npm run lint:boundaries`)

---

## 🎯 Priority 2: Centralized Config Loader
**Status:** 🔄 TODO  
**Impact:** 🚀 High - Enables multi-tenant scaling  
**Effort:** Medium (2-4 hours)

**Current State:**
- Multiple features read tenant config/industry data directly
- No single source of truth for tenant configuration
- Potential for inconsistent data access patterns

**Action Items:**
- [ ] Create `shared/hooks/useTenantConfig.ts` hook
  - Consolidate tenant config reading
  - Add React Query caching
  - Normalize config shape
  
- [ ] Create `shared/hooks/useIndustryConfig.ts` hook
  - Load industry-specific defaults from `/data/`
  - Merge with tenant overrides
  
- [ ] Audit and replace direct config reads in:
  - [ ] `features/booking/`
  - [ ] `features/hero/`
  - [ ] `features/services/`
  - [ ] `features/locations/`
  
- [ ] Add TypeScript types for normalized config shape

**Files to Create:**
```
frontend/src/shared/hooks/useTenantConfig.ts
frontend/src/shared/hooks/useIndustryConfig.ts
frontend/src/shared/types/tenant-config.types.ts
```

---

## 🧭 Priority 3: SEO Unification
**Status:** 🔄 TODO  
**Impact:** 🧭 High - Improves visibility + structure  
**Effort:** Medium (3-5 hours)

**Current State:**
- SEO logic scattered across features
- Meta tags duplicated per page
- No centralized JSON-LD generation
- Missing robots.txt/sitemap automation

**Action Items:**
- [ ] Create unified SEO component
  ```tsx
  // shared/components/seo/SEOManager.tsx
  <SEOManager
    title="Mobile Detailing"
    description="Professional on-site auto detailing"
    schemaType="Service"
    canonical="/mobile-detailing"
  />
  ```
  
- [ ] Build JSON-LD helpers in `shared/utils/seo/`
  - [ ] `generateLocalBusinessSchema()`
  - [ ] `generateServiceSchema()`
  - [ ] `generateFAQSchema()`
  
- [ ] Add robots.txt generation per tenant
  - [ ] Allow live tenants
  - [ ] Disallow `/preview/*`
  
- [ ] Add sitemap generation
  - [ ] Per-tenant sitemaps: `/sitemaps/<tenant>.xml`
  - [ ] Include: home, services, locations
  
- [ ] Audit and migrate existing meta logic:
  - [ ] `features/locations/LocationPage.tsx`
  - [ ] `features/services/`
  - [ ] All page components

**Files to Create:**
```
frontend/src/shared/components/seo/SEOManager.tsx
frontend/src/shared/utils/seo/schema-generators.ts
frontend/src/shared/utils/seo/robots.ts
frontend/src/shared/utils/seo/sitemap.ts
```

---

## 💎 Priority 4: Feature Encapsulation (index.ts)
**Status:** 🔄 TODO  
**Impact:** 💎 Medium - Cleaner imports  
**Effort:** Low (1-2 hours)

**Current State:**
- Features expose deep internal paths
- Consumers use long import chains: `@/features/booking/components/Button`
- No clear public API per feature

**Action Items:**
- [ ] Add barrel exports to each feature
  ```ts
  // features/booking/index.ts
  export * from './components';
  export * from './hooks';
  export * from './types';
  // Don't export internal utils
  ```
  
- [ ] Update feature imports to use root-level exports
  ```ts
  // Before: import { Button } from '@/features/booking/components/Button'
  // After:  import { Button } from '@/features/booking'
  ```
  
- [ ] Features to update (13 total):
  - [ ] `adminDashboard/`
  - [ ] `tenantDashboard/`
  - [ ] `tenantOnboarding/`
  - [ ] `booking/`
  - [ ] `gallery/`
  - [ ] `hero/`
  - [ ] `services/`
  - [ ] `locations/`
  - [ ] `reviews/`
  - [ ] `quotes/`
  - [ ] `faq/`
  - [ ] `footer/`
  - [ ] `navigation/`

**Implementation Notes:**
- Start with one feature as proof-of-concept
- Only export public-facing components/hooks
- Keep internal utils/helpers private

---

## 🧱 Priority 5: Quality/Ops Enforcement
**Status:** 🔄 TODO  
**Impact:** 🧱 Medium - Prevents regressions  
**Effort:** Low (1 hour)

**Current State:**
- Linting exists but not enforced in CI
- No test coverage requirements
- No automated quality gates

**Action Items:**
- [ ] Add CI quality gates (if not already present)
  ```yaml
  # .github/workflows/quality.yml
  - name: Lint
    run: npm run lint
  - name: Type Check
    run: npm run type-check
  - name: Boundary Check
    run: npm run lint:boundaries
  ```
  
- [ ] Add pre-commit hooks
  ```json
  // package.json
  "husky": {
    "hooks": {
      "pre-commit": "npm run lint:boundaries && npm run type-check"
    }
  }
  ```
  
- [ ] Document quality requirements in README
  - Lint must pass
  - Type check must pass
  - Boundary check must pass

---

## ⚙️ Priority 6: Backend Logic Split
**Status:** 🔄 TODO  
**Impact:** ⚙️ Medium - Simplifies provisioning  
**Effort:** Medium (2-3 hours)

**Current State:**
- Backend handles provisioning AND default templates
- Template logic mixed with database operations
- Difficult to test provisioning independently

**Action Items:**
- [ ] Audit backend provisioning logic
  - [ ] `backend/routes/tenants.js`
  - [ ] `backend/routes/tenantOnboarding.js`
  
- [ ] Move default templates to frontend
  - [ ] Extract template JSON to `/frontend/src/data/templates/`
  - [ ] Backend only returns tenant record + status
  - [ ] Frontend applies defaults via data loader
  
- [ ] Create template versioning system
  ```
  /frontend/src/data/templates/
    v1/
      mobile-detailing.json
      maid-service.json
    v2/
      ...
  ```

---

## 🧠 Priority 7: State Isolation
**Status:** 🔄 TODO  
**Impact:** 🧠 Medium - Reduces bugs  
**Effort:** Low (1-2 hours)

**Current State:**
- Zustand stores exist but no enforced conventions
- Risk of shared global state

**Action Items:**
- [ ] Audit all Zustand stores
  ```bash
  find frontend/src/features -name "*.store.ts"
  ```
  
- [ ] Enforce one-store-per-feature pattern
  ```
  features/booking/state/booking.store.ts
  features/gallery/state/gallery.store.ts
  ```
  
- [ ] Document store conventions:
  - Stores are feature-local only
  - Never import stores across features
  - Use React Query for cross-feature data
  - Use context for cross-feature events
  
- [ ] Add linter rule to prevent cross-feature store imports

---

## 💾 Priority 8: Database Migration Layer
**Status:** 🔄 TODO  
**Impact:** 💾 Medium - Predictable schema  
**Effort:** High (4-6 hours)

**Current State:**
- Manual SQL migrations in `backend/database/migrations/`
- No version tracking
- Risk of schema drift

**Action Items:**
- [ ] Evaluate migration tools
  - Option A: `knex` (Node.js, minimal)
  - Option B: `drizzle-kit` (TypeScript-first)
  
- [ ] Implement chosen tool
  - [ ] Install and configure
  - [ ] Create initial migration from current schema
  - [ ] Add migration runner to startup
  
- [ ] Create migration conventions
  - Naming: `YYYYMMDD_descriptive_name.sql`
  - One feature per migration file
  - Always include rollback (down migration)
  
- [ ] Document migration workflow
  ```bash
  npm run migrate:create -- add_booking_notes
  npm run migrate:up
  npm run migrate:down
  ```

---

## 🔐 Priority 9: Env Normalization
**Status:** 🔄 TODO  
**Impact:** 🔐 Low - Security + clarity  
**Effort:** Low (1 hour)

**Current State:**
- Features may access env vars directly
- No centralized env validation
- Risk of undefined env values

**Action Items:**
- [ ] Create centralized env file
  ```ts
  // shared/config/env.ts
  export const ENV = {
    STRIPE_KEY: import.meta.env.VITE_STRIPE_KEY!,
    API_URL: import.meta.env.VITE_API_URL!,
    // ... all env vars
  } as const;
  ```
  
- [ ] Add runtime validation
  ```ts
  // Throw error on startup if required vars missing
  Object.entries(ENV).forEach(([key, value]) => {
    if (!value) throw new Error(`Missing env var: ${key}`);
  });
  ```
  
- [ ] Replace direct `import.meta.env` usage
  - [ ] Search: `import\.meta\.env\.VITE_`
  - [ ] Replace with: `import { ENV } from '@/shared/config/env'`
  
- [ ] Add TypeScript types for env
  ```ts
  // env.d.ts
  interface ImportMetaEnv {
    VITE_STRIPE_KEY: string;
    VITE_API_URL: string;
    // ...
  }
  ```

---

## 📊 Progress Summary

| Priority | Status | Impact | Effort |
|----------|--------|--------|--------|
| 1. Import Boundaries | ✅ Complete | 🔥 Critical | - |
| 2. Config Loader | 🔄 TODO | 🚀 High | Medium |
| 3. SEO Unification | 🔄 TODO | 🧭 High | Medium |
| 4. Feature Encapsulation | 🔄 TODO | 💎 Medium | Low |
| 5. Quality/Ops | 🔄 TODO | 🧱 Medium | Low |
| 6. Backend Split | 🔄 TODO | ⚙️ Medium | Medium |
| 7. State Isolation | 🔄 TODO | 🧠 Medium | Low |
| 8. Migration Layer | 🔄 TODO | 💾 Medium | High |
| 9. Env Normalization | 🔄 TODO | 🔐 Low | Low |

**Recommended Order:**
1. ✅ Import Boundaries (Done!)
2. **Config Loader** (enables everything else)
3. **SEO Unification** (high user impact)
4. **Feature Encapsulation** (quick win)
5. **Quality/Ops** (prevent future issues)
6. **Env Normalization** (quick win)
7. **State Isolation** (polish)
8. **Backend Split** (when time allows)
9. **Migration Layer** (when time allows)

---

## Next Steps

To begin **Priority 2 (Config Loader)**:
```bash
# Let's start with the most impactful refactor
# This will enable cleaner multi-tenant scaling
```

Would you like to start with Priority 2, or tackle a different priority first?

