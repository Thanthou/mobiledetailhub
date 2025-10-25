# 📊 Frontend Flow Audit - admin-app

**Generated:** 10/25/2025, 12:14:21 AM

## 🔴 Score: 18/100 (Poor Flow Health)

### Metrics

| Metric | Value |
|--------|-------|
| **App Files** | |
| Total App Files | 61 |
| Reachable App Files | 6 |
| Unreachable App Files | 41 |
| **Shared Files** | |
| Total Shared Files | 279 |
| Reachable Shared Files | 128 |
| Unreachable Shared Files | 120 |
| **Issues** | |
| Boundary Violations | 0 |
| Parse Errors | 0 |

## 🔴 Unreachable App Files (41)

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
- apps/admin-app/src/components/tenantOnboarding/api/api.ts
- apps/admin-app/src/components/tenantOnboarding/api/onboarding.api.ts
- apps/admin-app/src/components/tenantOnboarding/api/payments.api.ts
- apps/admin-app/src/components/tenantOnboarding/components/ApplicationHeader.tsx
- apps/admin-app/src/components/tenantOnboarding/components/BusinessInformationSection.tsx
- apps/admin-app/src/components/tenantOnboarding/components/GoogleBusinessProfileModal.tsx
- apps/admin-app/src/components/tenantOnboarding/components/IdentityContactSection.tsx
- apps/admin-app/src/components/tenantOnboarding/components/LegalTermsSection.tsx
- apps/admin-app/src/components/tenantOnboarding/components/LocationInput.tsx
- apps/admin-app/src/components/tenantOnboarding/components/OperatingBasicsSection.tsx
- apps/admin-app/src/components/tenantOnboarding/components/PaymentSection.tsx
- apps/admin-app/src/components/tenantOnboarding/components/PersonalInformationSection.tsx
- apps/admin-app/src/components/tenantOnboarding/components/PlanSelectionSection.tsx
- apps/admin-app/src/components/tenantOnboarding/components/ProofOfWorkSection.tsx
- apps/admin-app/src/components/tenantOnboarding/components/SocialMediaSection.tsx
- apps/admin-app/src/components/tenantOnboarding/components/StepProgress.tsx
- apps/admin-app/src/components/tenantOnboarding/components/SubmitSection.tsx
- apps/admin-app/src/components/tenantOnboarding/components/SuccessPage.tsx
- apps/admin-app/src/components/tenantOnboarding/components/TenantApplicationPage.tsx
- apps/admin-app/src/components/tenantOnboarding/components/TenantPrivacyModal.tsx
- apps/admin-app/src/components/tenantOnboarding/components/TenantTermsModal.tsx
- apps/admin-app/src/components/tenantOnboarding/hooks/useAutoSave.ts
- apps/admin-app/src/components/tenantOnboarding/hooks/useFileUpload.ts
- apps/admin-app/src/components/tenantOnboarding/hooks/useFormHandlers.ts
- apps/admin-app/src/components/tenantOnboarding/hooks/useLocalDraft.ts
- apps/admin-app/src/components/tenantOnboarding/utils/validation.ts

## 🟡 Unreachable Shared Files (120)

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

... and 100 more

