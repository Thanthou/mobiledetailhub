# 📊 Frontend Flow Audit - tenant-app

**Generated:** 10/25/2025, 12:14:21 AM

## 🔴 Score: 0/100 (Poor Flow Health)

### Metrics

| Metric | Value |
|--------|-------|
| **App Files** | |
| Total App Files | 332 |
| Reachable App Files | 232 |
| Unreachable App Files | 62 |
| **Shared Files** | |
| Total Shared Files | 279 |
| Reachable Shared Files | 202 |
| Unreachable Shared Files | 60 |
| **Issues** | |
| Boundary Violations | 0 |
| Parse Errors | 0 |

## 🔴 Unreachable App Files (62)

These files in **tenant-app** are not imported from the entry point (dead code):

- apps/tenant-app/src/components/booking/components/BookingForm.tsx
- apps/tenant-app/src/components/booking/components/steps/StepAddons/Header.tsx
- apps/tenant-app/src/components/booking/components/steps/StepService/Header.tsx
- apps/tenant-app/src/components/booking/components/steps/StepVehicleSelection/Header.tsx
- apps/tenant-app/src/components/booking/hooks/useBookingAsync.ts
- apps/tenant-app/src/components/cta/components/MobileCTAButtons.tsx
- apps/tenant-app/src/components/cta/components/SmartCTAButtons.tsx
- apps/tenant-app/src/components/cta/hooks/useBookingCapabilities.ts
- apps/tenant-app/src/components/customers/classes/Customer.ts
- apps/tenant-app/src/components/header/routes/tenantRoutes.tsx
- apps/tenant-app/src/components/locations/api/locations.api.ts
- apps/tenant-app/src/components/locations/components/LocationSelector.tsx
- apps/tenant-app/src/components/locations/hooks/useLocationPageState.ts
- apps/tenant-app/src/components/locations/LocationPage.tsx
- apps/tenant-app/src/components/locations/utils/googleMaps.helpers.ts
- apps/tenant-app/src/components/locations/utils/googlePlace.ts
- apps/tenant-app/src/components/locations/utils/placesLoader.ts
- apps/tenant-app/src/components/reviews/api/reviewsApi.ts
- apps/tenant-app/src/components/reviews/components/GoogleReviewsTest.tsx
- apps/tenant-app/src/components/reviews/hooks/useGoogleReviews.ts
- apps/tenant-app/src/components/reviews/hooks/useReviews.ts
- apps/tenant-app/src/components/reviews/hooks/useReviewsAvailability.ts
- apps/tenant-app/src/components/reviews/hooks/useReviewsContent.ts
- apps/tenant-app/src/components/reviews/hooks/useReviewsRating.ts
- apps/tenant-app/src/components/reviews/hooks/useRotatingReviews.ts
- apps/tenant-app/src/components/reviews/utils/reviewUtils.ts
- apps/tenant-app/src/components/services/api/services.api.ts
- apps/tenant-app/src/components/tenantDashboard/components/AddToHomeScreen.tsx
- apps/tenant-app/src/components/tenantDashboard/components/AutoSaveStatus.tsx
- apps/tenant-app/src/components/tenantDashboard/hooks/useDashboardData.ts
- apps/tenant-app/src/components/tenantDashboard/tabs/locations/components/LocationCard.tsx
- apps/tenant-app/src/components/tenantDashboard/tabs/locations/components/LocationSearch.tsx
- apps/tenant-app/src/components/tenantDashboard/tabs/locations/hooks/useLocationSearch.ts
- apps/tenant-app/src/components/tenantDashboard/tabs/overview/components/MetricsCards.tsx
- apps/tenant-app/src/components/tenantDashboard/tabs/overview/components/NotificationPanel.tsx
- apps/tenant-app/src/components/tenantDashboard/tabs/overview/components/RecentAppointments.tsx
- apps/tenant-app/src/components/tenantDashboard/tabs/overview/components/RecentReviews.tsx
- apps/tenant-app/src/components/tenantDashboard/tabs/overview/hooks/useDashboardStats.ts
- apps/tenant-app/src/components/tenantDashboard/tabs/overview/hooks/useNotifications.ts
- apps/tenant-app/src/components/tenantDashboard/tabs/overview/hooks/useRecentAppointments.ts
- apps/tenant-app/src/components/tenantDashboard/tabs/overview/hooks/useRecentReviews.ts
- apps/tenant-app/src/components/tenantDashboard/tabs/overview/utils/getStatusColor.ts
- apps/tenant-app/src/components/tenantDashboard/tabs/performance/PerformanceTab.tsx
- apps/tenant-app/src/components/tenantDashboard/tabs/profile/components/SocialMediaUrlField.tsx
- apps/tenant-app/src/components/tenantDashboard/tabs/schedule/api/appointments.ts
- apps/tenant-app/src/components/tenantDashboard/tabs/schedule/api/blockedDays.ts
- apps/tenant-app/src/components/tenantDashboard/tabs/schedule/api/scheduleSettings.ts
- apps/tenant-app/src/components/tenantDashboard/tabs/schedule/api/timeBlocks.ts
- apps/tenant-app/src/components/tenantDashboard/tabs/services/components/AddServiceModal.tsx
- apps/tenant-app/src/components/tenantDashboard/tabs/services/components/FeatureList.tsx
- apps/tenant-app/src/components/tenantDashboard/tabs/services/components/SelectedServiceDetailsDisplay.tsx
- apps/tenant-app/src/components/tenantDashboard/tabs/services/components/SelectedServiceDisplay.tsx
- apps/tenant-app/src/components/tenantDashboard/tabs/services/components/ServiceActionsHeader.tsx
- apps/tenant-app/src/components/tenantDashboard/tabs/services/components/ServiceTierCards.tsx
- apps/tenant-app/src/components/tenantDashboard/tabs/services/FixedServicesTab.tsx
- apps/tenant-app/src/components/tenantDashboard/tabs/services/hooks/useFixedServicesHandlers.ts
- apps/tenant-app/src/components/tenantDashboard/tabs/services/hooks/useServiceOperations.ts
- apps/tenant-app/src/components/tenantDashboard/tabs/services/hooks/useServiceSelection.ts
- apps/tenant-app/src/components/tenantDashboard/tabs/services/ServicesTab.tsx
- apps/tenant-app/src/components/tenantDashboard/tabs/services/types/ServiceFeature.ts
- apps/tenant-app/src/components/tenantDashboard/utils/tenantEvents.ts
- apps/tenant-app/src/hooks/usePreviewParams.ts

## 🟡 Unreachable Shared Files (60)

These shared files are not used by **tenant-app** (but may be used by other apps):

- src/shared/api/errors.ts
- src/shared/auth/api/auth.api.ts
- src/shared/auth/components/LazyLoginModal.tsx
- src/shared/auth/components/LoginModalErrorBoundary.tsx
- src/shared/auth/components/LoginModalFallback.tsx
- src/shared/auth/hooks/useLoginModalPrefetch.ts
- src/shared/components/AddToHomeScreen.tsx
- src/shared/components/ErrorFallback.tsx
- src/shared/components/HomePageLayout.tsx
- src/shared/components/MergeDemo.tsx
- src/shared/components/preview/components/PreviewBanner.tsx
- src/shared/components/preview/hooks/usePreviewAsync.ts
- src/shared/components/PreviewBanner.tsx
- src/shared/components/seo/JsonLdSchema.tsx
- src/shared/components/seo/SeoHead.tsx
- src/shared/components/tenantOnboarding/api/api.ts
- src/shared/components/tenantOnboarding/api/onboarding.api.ts
- src/shared/components/tenantOnboarding/components/GoogleBusinessProfileModal.tsx
- src/shared/components/tenantOnboarding/components/IdentityContactSection.tsx
- src/shared/components/tenantOnboarding/components/LegalTermsSection.tsx

... and 40 more

