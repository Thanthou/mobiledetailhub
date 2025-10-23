# 📊 Frontend Flow Audit - admin-app

**Generated:** 10/23/2025, 3:27:24 AM

## 🔴 Score: 0/100 (Poor Flow Health)

### Metrics

| Metric | Value |
|--------|-------|
| **App Files** | |
| Total App Files | 79 |
| Reachable App Files | 6 |
| Unreachable App Files | 56 |
| **Shared Files** | |
| Total Shared Files | 393 |
| Reachable Shared Files | 219 |
| Unreachable Shared Files | 139 |
| **Issues** | |
| Boundary Violations | 0 |
| Parse Errors | 0 |

## 🔴 Unreachable App Files (56)

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
- apps/admin-app/src/components/devPreview/components/ViewportFrame.tsx
- apps/admin-app/src/components/devPreview/components/ViewportSwitcher.tsx
- apps/admin-app/src/components/devPreview/hooks/useViewportAsync.ts
- apps/admin-app/src/components/devPreview/state/viewportStore.ts
- apps/admin-app/src/components/preview/api/preview.api.ts
- apps/admin-app/src/components/preview/components/PreviewBanner.tsx
- apps/admin-app/src/components/preview/components/PreviewCTAButton.tsx
- apps/admin-app/src/components/preview/components/PreviewDataProvider.tsx
- apps/admin-app/src/components/preview/components/PreviewError.tsx
- apps/admin-app/src/components/preview/components/PreviewLoading.tsx
- apps/admin-app/src/components/preview/components/PreviewPage.tsx
- apps/admin-app/src/components/preview/hooks/usePreviewAsync.ts
- apps/admin-app/src/components/preview/hooks/usePreviewParams.ts
- apps/admin-app/src/components/preview/pages/PreviewGeneratorPage.tsx
- apps/admin-app/src/components/preview/state/previewStore.ts
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

## 🟡 Unreachable Shared Files (139)

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

... and 119 more

