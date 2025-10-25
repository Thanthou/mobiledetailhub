# Performance Audit Report

**Generated:** 2025-10-25T22:21:51.880Z
**Duration:** 78ms
**Score:** 80/100

---

## Summary

- ✅ **Passed:** 4
- ⚠️  **Warnings:** 0
- ❌ **Errors:** 2

## Description

Analyzes frontend performance: route loading strategy, bundle sizes, and component complexity.

## Issues Found

### 🔴 Critical Errors

1. **Large bundle: index-CsYj9GKf.js (621KB)**
   - Path: `main\assets\index-CsYj9GKf.js`
   - Details: Use dynamic imports and code splitting to reduce size

2. **Huge component: db.types.ts (1245 lines)**
   - Path: `shared\types\generated\db.types.ts`
   - Details: Split into smaller, focused components for maintainability

---

## Detailed Log


## Route Loading Strategy

✅ Total routes: 2 (0 lazy, 2 eager)
✅ Route loading strategy is efficient

## Bundle Sizes

✅ Total bundle size: 1.94MB across 87 files
❌ **ERROR**: Large bundle: index-CsYj9GKf.js (621KB)
   - Path: `main\assets\index-CsYj9GKf.js`

## Component Sizes

✅ Total components: 303
❌ **ERROR**: Huge component: db.types.ts (1245 lines)
   - Path: `shared\types\generated\db.types.ts`

---

## Recommendations

1. Use dynamic imports and lazy loading for large chunks
2. Convert non-critical routes to lazy-loaded with React.lazy()
3. Wrap lazy routes with <Suspense> for smoother UX
4. Refactor components over 500 lines into smaller, focused units
5. Use code splitting to reduce initial bundle size
6. Monitor bundle sizes during development: npm run build
7. Consider using React.memo() for expensive components
