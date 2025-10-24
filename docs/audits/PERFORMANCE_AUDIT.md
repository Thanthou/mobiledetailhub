# Performance Audit Report

**Generated:** 2025-10-24T06:47:28.512Z
**Duration:** 95ms
**Score:** 97/100

---

## Summary

- ✅ **Passed:** 5
- ⚠️  **Warnings:** 1
- ❌ **Errors:** 0

## Description

Analyzes frontend performance: route loading strategy, bundle sizes, and component complexity.

## Issues Found

### 🟡 Warnings

1. **Large component: schemaUtils.ts (549 lines)**
   - Path: `shared\utils\schemaUtils.ts`
   - Details: Consider refactoring for better maintainability

---

## Detailed Log


## Route Loading Strategy

✅ Total routes: 3 (0 lazy, 3 eager)
✅ Route loading strategy is efficient

## Bundle Sizes

✅ Total bundle size: 1.29MB across 48 files
✅ All bundles under 500KB threshold

## Component Sizes

✅ Total components: 418
⚠️ **WARNING**: Large component: schemaUtils.ts (549 lines)
   - Path: `shared\utils\schemaUtils.ts`

---

## Recommendations

1. Use dynamic imports and lazy loading for large chunks
2. Convert non-critical routes to lazy-loaded with React.lazy()
3. Wrap lazy routes with <Suspense> for smoother UX
4. Refactor components over 500 lines into smaller, focused units
5. Use code splitting to reduce initial bundle size
6. Monitor bundle sizes during development: npm run build
7. Consider using React.memo() for expensive components
