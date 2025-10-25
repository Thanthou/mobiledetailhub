# 📊 Frontend Flow Audit - admin-app

**Generated:** 10/25/2025, 3:45:21 PM

## 🟡 Score: 70/100 (Needs Review)

### Metrics

| Metric | Value |
|--------|-------|
| **App Files** | |
| Total App Files | 30 |
| Reachable App Files | 6 |
| Unreachable App Files | 15 |
| **Shared Files** | |
| Total Shared Files | 249 |
| Reachable Shared Files | 129 |
| Unreachable Shared Files | 96 |
| **Issues** | |
| Boundary Violations | 0 |
| Parse Errors | 0 |

## 🔴 Unreachable App Files (15)

These files in **admin-app** are not imported from the entry point (dead code):

- apps/admin-app/src/components/adminDashboard/api/admin.api.ts
- apps/admin-app/src/components/adminDashboard/components/AdminLayout.tsx
- apps/admin-app/src/components/adminDashboard/components/AdminTabs.tsx
- apps/admin-app/src/components/adminDashboard/components/shared/ApplicationModal.tsx
- apps/admin-app/src/components/adminDashboard/components/shared/DeleteConfirmationModal.tsx
- apps/admin-app/src/components/adminDashboard/components/shared/Toast.tsx
- apps/admin-app/src/components/adminDashboard/components/TabContent.tsx
- apps/admin-app/src/components/adminDashboard/components/tabs/analytics/AnalyticsTab.tsx
- apps/admin-app/src/components/adminDashboard/components/tabs/analytics/SEOHealthCard.tsx
- apps/admin-app/src/components/adminDashboard/components/tabs/reviews/ReviewsTab.tsx
- apps/admin-app/src/components/adminDashboard/components/tabs/settings/SettingsTab.tsx
- apps/admin-app/src/components/adminDashboard/components/tabs/users/UsersTab.tsx
- apps/admin-app/src/components/adminDashboard/DashboardPage.tsx
- apps/admin-app/src/components/adminDashboard/hooks/useSeedReview.ts
- apps/admin-app/src/components/adminDashboard/utils/constants.ts

## 🟡 Unreachable Shared Files (96)

These shared files are not used by **admin-app** (but may be used by other apps):

- src/shared/api/errors.ts
- src/shared/api/services.api.ts
- src/shared/auth/api/auth.api.ts
- src/shared/auth/components/ErrorDisplay.tsx
- src/shared/auth/components/FormField.tsx
- src/shared/auth/components/LazyLoginModal.tsx
- src/shared/auth/components/LoginForm.tsx
- src/shared/auth/components/LoginFormValidation.tsx
- src/shared/auth/components/LoginModal.tsx
- src/shared/auth/components/LoginModalErrorBoundary.tsx
- src/shared/auth/components/LoginModalFallback.tsx
- src/shared/auth/components/ModalBackdrop.tsx
- src/shared/auth/components/ModalHeader.tsx
- src/shared/auth/components/RegisterForm.tsx
- src/shared/auth/components/RememberForgotSection.tsx
- src/shared/auth/components/SocialLogin.tsx
- src/shared/auth/components/ToggleMode.tsx
- src/shared/auth/hooks/useAuthModal.ts
- src/shared/auth/hooks/useFormValidation.ts
- src/shared/auth/hooks/useLoginModalPrefetch.ts

... and 76 more

