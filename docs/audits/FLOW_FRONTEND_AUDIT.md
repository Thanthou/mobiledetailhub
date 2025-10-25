# Frontend Flow Tracer Audit Report

**Generated:** 2025-10-25T22:45:21.333Z
**Duration:** 1143ms
**Score:** 52/100

---

## Summary

- ✅ **Passed:** 6
- ⚠️  **Warnings:** 16
- ❌ **Errors:** 0

## Description

Complete frontend flow analysis: maps React component dependencies, validates architectural boundaries, identifies unreachable code.

## Issues Found

### 🟡 Warnings

1. **admin-app: 15 unreachable app files**
   - Details: Dead code - files not imported from entry point

2. **  apps/admin-app/src/components/adminDashboard/api/admin.api.ts**
   - Details: Dead code - not imported from entry point

3. **  apps/admin-app/src/components/adminDashboard/components/AdminLayout.tsx**
   - Details: Dead code - not imported from entry point

4. **  apps/admin-app/src/components/adminDashboard/components/AdminTabs.tsx**
   - Details: Dead code - not imported from entry point

5. **  apps/admin-app/src/components/adminDashboard/components/shared/ApplicationModal.tsx**
   - Details: Dead code - not imported from entry point

6. **  apps/admin-app/src/components/adminDashboard/components/shared/DeleteConfirmationModal.tsx**
   - Details: Dead code - not imported from entry point

7. **  apps/admin-app/src/components/adminDashboard/components/shared/Toast.tsx**
   - Details: Dead code - not imported from entry point

8. **  apps/admin-app/src/components/adminDashboard/components/TabContent.tsx**
   - Details: Dead code - not imported from entry point

9. **  apps/admin-app/src/components/adminDashboard/components/tabs/analytics/AnalyticsTab.tsx**
   - Details: Dead code - not imported from entry point

10. **  apps/admin-app/src/components/adminDashboard/components/tabs/analytics/SEOHealthCard.tsx**
   - Details: Dead code - not imported from entry point

11. **  apps/admin-app/src/components/adminDashboard/components/tabs/reviews/ReviewsTab.tsx**
   - Details: Dead code - not imported from entry point

12. **  apps/admin-app/src/components/adminDashboard/components/tabs/settings/SettingsTab.tsx**
   - Details: Dead code - not imported from entry point

13. **  apps/admin-app/src/components/adminDashboard/components/tabs/users/UsersTab.tsx**
   - Details: Dead code - not imported from entry point

14. **  apps/admin-app/src/components/adminDashboard/DashboardPage.tsx**
   - Details: Dead code - not imported from entry point

15. **  apps/admin-app/src/components/adminDashboard/hooks/useSeedReview.ts**
   - Details: Dead code - not imported from entry point

16. **  apps/admin-app/src/components/adminDashboard/utils/constants.ts**
   - Details: Dead code - not imported from entry point

---

## Detailed Log

Apps: admin-app

## Phase 1: File Discovery

✅ Found 710 TypeScript/TSX files

## Phase 2: AST Parsing

✅ All files parsed successfully

## Phase 3: Graph Construction

✅ Built dependency graph with 710 nodes

## Phase 4: App Analysis

✅ admin-app: 135 reachable files
✅ admin-app: No boundary violations
⚠️ **WARNING**: admin-app: 15 unreachable app files
⚠️ **WARNING**:   apps/admin-app/src/components/adminDashboard/api/admin.api.ts
⚠️ **WARNING**:   apps/admin-app/src/components/adminDashboard/components/AdminLayout.tsx
⚠️ **WARNING**:   apps/admin-app/src/components/adminDashboard/components/AdminTabs.tsx
⚠️ **WARNING**:   apps/admin-app/src/components/adminDashboard/components/shared/ApplicationModal.tsx
⚠️ **WARNING**:   apps/admin-app/src/components/adminDashboard/components/shared/DeleteConfirmationModal.tsx
⚠️ **WARNING**:   apps/admin-app/src/components/adminDashboard/components/shared/Toast.tsx
⚠️ **WARNING**:   apps/admin-app/src/components/adminDashboard/components/TabContent.tsx
⚠️ **WARNING**:   apps/admin-app/src/components/adminDashboard/components/tabs/analytics/AnalyticsTab.tsx
⚠️ **WARNING**:   apps/admin-app/src/components/adminDashboard/components/tabs/analytics/SEOHealthCard.tsx
⚠️ **WARNING**:   apps/admin-app/src/components/adminDashboard/components/tabs/reviews/ReviewsTab.tsx
⚠️ **WARNING**:   apps/admin-app/src/components/adminDashboard/components/tabs/settings/SettingsTab.tsx
⚠️ **WARNING**:   apps/admin-app/src/components/adminDashboard/components/tabs/users/UsersTab.tsx
⚠️ **WARNING**:   apps/admin-app/src/components/adminDashboard/DashboardPage.tsx
⚠️ **WARNING**:   apps/admin-app/src/components/adminDashboard/hooks/useSeedReview.ts
⚠️ **WARNING**:   apps/admin-app/src/components/adminDashboard/utils/constants.ts
✅ admin-app: Report saved to docs\audits\FLOW_FRONTEND_ADMIN_APP.md

## Phase 5: Report Generation


---

## Recommendations

1. Review boundary violations - they violate architectural rules
2. Investigate unreachable files - they may be dead code
3. Consider consolidating duplicate components across apps
4. Use this flow map for impact analysis before making changes
