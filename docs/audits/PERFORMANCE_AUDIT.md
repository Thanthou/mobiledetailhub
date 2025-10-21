# Performance Audit Report

**Generated:** 2025-10-21T21:26:33.661Z
**Duration:** 61ms
**Score:** 77/100

---

## Summary

- ✅ **Passed:** 4
- ⚠️  **Warnings:** 1
- ❌ **Errors:** 2

## Description

Analyzes frontend performance: route loading strategy, bundle sizes, and component complexity.

## Issues Found

### 🔴 Critical Errors

1. **Large bundle: react-vendor--vAscSmE.js (1122KB)**
   - Path: `assets\react-vendor--vAscSmE.js`
   - Details: Use dynamic imports and code splitting to reduce size

2. **Large bundle: tenant-app-LfYPzNrW.js (807KB)**
   - Path: `tenant-app-LfYPzNrW.js`
   - Details: Use dynamic imports and code splitting to reduce size

### 🟡 Warnings

1. **Large component: schemaUtils.ts (549 lines)**
   - Path: `shared\utils\schemaUtils.ts`
   - Details: Consider refactoring for better maintainability

---

## Detailed Log


## Route Loading Strategy

✅ Total routes: 2 (0 lazy, 2 eager)
✅ Route loading strategy is efficient

## Bundle Sizes

✅ Total bundle size: 3.47MB across 40 files
❌ **ERROR**: Large bundle: react-vendor--vAscSmE.js (1122KB)
   - Path: `assets\react-vendor--vAscSmE.js`
❌ **ERROR**: Large bundle: tenant-app-LfYPzNrW.js (807KB)
   - Path: `tenant-app-LfYPzNrW.js`

## Component Sizes

✅ Total components: 239
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
