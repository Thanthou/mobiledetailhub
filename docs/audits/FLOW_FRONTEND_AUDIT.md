# Frontend Flow Tracer Audit Report

**Generated:** 2025-10-25T22:49:35.709Z
**Duration:** 1137ms
**Score:** 0/100

---

## Summary

- ✅ **Passed:** 6
- ⚠️  **Warnings:** 66
- ❌ **Errors:** 0

## Description

Complete frontend flow analysis: maps React component dependencies, validates architectural boundaries, identifies unreachable code.

## Issues Found

### 🟡 Warnings

1. **tenant-app: 65 unreachable app files**
   - Details: Dead code - files not imported from entry point

2. **  apps/tenant-app/src/components/booking/components/BookingForm.tsx**
   - Details: Dead code - not imported from entry point

3. **  apps/tenant-app/src/components/booking/components/steps/StepAddons/Header.tsx**
   - Details: Dead code - not imported from entry point

4. **  apps/tenant-app/src/components/booking/components/steps/StepService/Header.tsx**
   - Details: Dead code - not imported from entry point

5. **  apps/tenant-app/src/components/booking/components/steps/StepVehicleSelection/Header.tsx**
   - Details: Dead code - not imported from entry point

6. **  apps/tenant-app/src/components/booking/hooks/useBookingAsync.ts**
   - Details: Dead code - not imported from entry point

7. **  apps/tenant-app/src/components/cta/components/MobileCTAButtons.tsx**
   - Details: Dead code - not imported from entry point

8. **  apps/tenant-app/src/components/cta/components/SmartCTAButtons.tsx**
   - Details: Dead code - not imported from entry point

9. **  apps/tenant-app/src/components/cta/hooks/useBookingCapabilities.ts**
   - Details: Dead code - not imported from entry point

10. **  apps/tenant-app/src/components/customers/classes/Customer.ts**
   - Details: Dead code - not imported from entry point

11. **  apps/tenant-app/src/components/header/routes/tenantRoutes.tsx**
   - Details: Dead code - not imported from entry point

12. **  apps/tenant-app/src/components/locations/api/locations.api.ts**
   - Details: Dead code - not imported from entry point

13. **  apps/tenant-app/src/components/locations/components/LocationSelector.tsx**
   - Details: Dead code - not imported from entry point

14. **  apps/tenant-app/src/components/locations/hooks/useLocationPageState.ts**
   - Details: Dead code - not imported from entry point

15. **  apps/tenant-app/src/components/locations/LocationPage.tsx**
   - Details: Dead code - not imported from entry point

16. **  apps/tenant-app/src/components/locations/utils/googleMaps.helpers.ts**
   - Details: Dead code - not imported from entry point

17. **  apps/tenant-app/src/components/locations/utils/googlePlace.ts**
   - Details: Dead code - not imported from entry point

18. **  apps/tenant-app/src/components/locations/utils/placesLoader.ts**
   - Details: Dead code - not imported from entry point

19. **  apps/tenant-app/src/components/reviews/api/reviewsApi.ts**
   - Details: Dead code - not imported from entry point

20. **  apps/tenant-app/src/components/reviews/components/GoogleReviewsTest.tsx**
   - Details: Dead code - not imported from entry point

21. **  apps/tenant-app/src/components/reviews/hooks/useGoogleReviews.ts**
   - Details: Dead code - not imported from entry point

22. **  apps/tenant-app/src/components/reviews/hooks/useReviews.ts**
   - Details: Dead code - not imported from entry point

23. **  apps/tenant-app/src/components/reviews/hooks/useReviewsAvailability.ts**
   - Details: Dead code - not imported from entry point

24. **  apps/tenant-app/src/components/reviews/hooks/useReviewsContent.ts**
   - Details: Dead code - not imported from entry point

25. **  apps/tenant-app/src/components/reviews/hooks/useReviewsRating.ts**
   - Details: Dead code - not imported from entry point

26. **  apps/tenant-app/src/components/reviews/hooks/useRotatingReviews.ts**
   - Details: Dead code - not imported from entry point

27. **  apps/tenant-app/src/components/reviews/utils/reviewUtils.ts**
   - Details: Dead code - not imported from entry point

28. **  apps/tenant-app/src/components/services/api/services.api.ts**
   - Details: Dead code - not imported from entry point

29. **  apps/tenant-app/src/components/tenantDashboard/components/AddToHomeScreen.tsx**
   - Details: Dead code - not imported from entry point

30. **  apps/tenant-app/src/components/tenantDashboard/components/AutoSaveStatus.tsx**
   - Details: Dead code - not imported from entry point

31. **  apps/tenant-app/src/components/tenantDashboard/hooks/useDashboardData.ts**
   - Details: Dead code - not imported from entry point

32. **  apps/tenant-app/src/components/tenantDashboard/tabs/locations/components/LocationCard.tsx**
   - Details: Dead code - not imported from entry point

33. **  apps/tenant-app/src/components/tenantDashboard/tabs/locations/components/LocationSearch.tsx**
   - Details: Dead code - not imported from entry point

34. **  apps/tenant-app/src/components/tenantDashboard/tabs/locations/hooks/useLocationSearch.ts**
   - Details: Dead code - not imported from entry point

35. **  apps/tenant-app/src/components/tenantDashboard/tabs/overview/components/MetricsCards.tsx**
   - Details: Dead code - not imported from entry point

36. **  apps/tenant-app/src/components/tenantDashboard/tabs/overview/components/NotificationPanel.tsx**
   - Details: Dead code - not imported from entry point

37. **  apps/tenant-app/src/components/tenantDashboard/tabs/overview/components/RecentAppointments.tsx**
   - Details: Dead code - not imported from entry point

38. **  apps/tenant-app/src/components/tenantDashboard/tabs/overview/components/RecentReviews.tsx**
   - Details: Dead code - not imported from entry point

39. **  apps/tenant-app/src/components/tenantDashboard/tabs/overview/hooks/useDashboardStats.ts**
   - Details: Dead code - not imported from entry point

40. **  apps/tenant-app/src/components/tenantDashboard/tabs/overview/hooks/useNotifications.ts**
   - Details: Dead code - not imported from entry point

41. **  apps/tenant-app/src/components/tenantDashboard/tabs/overview/hooks/useRecentAppointments.ts**
   - Details: Dead code - not imported from entry point

42. **  apps/tenant-app/src/components/tenantDashboard/tabs/overview/hooks/useRecentReviews.ts**
   - Details: Dead code - not imported from entry point

43. **  apps/tenant-app/src/components/tenantDashboard/tabs/overview/utils/getStatusColor.ts**
   - Details: Dead code - not imported from entry point

44. **  apps/tenant-app/src/components/tenantDashboard/tabs/performance/PerformanceTab.tsx**
   - Details: Dead code - not imported from entry point

45. **  apps/tenant-app/src/components/tenantDashboard/tabs/profile/components/AutoSaveField.tsx**
   - Details: Dead code - not imported from entry point

46. **  apps/tenant-app/src/components/tenantDashboard/tabs/profile/components/ProfileForm.tsx**
   - Details: Dead code - not imported from entry point

47. **  apps/tenant-app/src/components/tenantDashboard/tabs/profile/components/SocialMediaUrlField.tsx**
   - Details: Dead code - not imported from entry point

48. **  apps/tenant-app/src/components/tenantDashboard/tabs/profile/hooks/useAutoSaveField.ts**
   - Details: Dead code - not imported from entry point

49. **  apps/tenant-app/src/components/tenantDashboard/tabs/schedule/api/appointments.ts**
   - Details: Dead code - not imported from entry point

50. **  apps/tenant-app/src/components/tenantDashboard/tabs/schedule/api/blockedDays.ts**
   - Details: Dead code - not imported from entry point

51. **  apps/tenant-app/src/components/tenantDashboard/tabs/schedule/api/scheduleSettings.ts**
   - Details: Dead code - not imported from entry point

52. **  apps/tenant-app/src/components/tenantDashboard/tabs/schedule/api/timeBlocks.ts**
   - Details: Dead code - not imported from entry point

53. **  apps/tenant-app/src/components/tenantDashboard/tabs/services/components/AddServiceModal.tsx**
   - Details: Dead code - not imported from entry point

54. **  apps/tenant-app/src/components/tenantDashboard/tabs/services/components/FeatureList.tsx**
   - Details: Dead code - not imported from entry point

55. **  apps/tenant-app/src/components/tenantDashboard/tabs/services/components/SelectedServiceDetailsDisplay.tsx**
   - Details: Dead code - not imported from entry point

56. **  apps/tenant-app/src/components/tenantDashboard/tabs/services/components/SelectedServiceDisplay.tsx**
   - Details: Dead code - not imported from entry point

57. **  apps/tenant-app/src/components/tenantDashboard/tabs/services/components/ServiceActionsHeader.tsx**
   - Details: Dead code - not imported from entry point

58. **  apps/tenant-app/src/components/tenantDashboard/tabs/services/components/ServiceTierCards.tsx**
   - Details: Dead code - not imported from entry point

59. **  apps/tenant-app/src/components/tenantDashboard/tabs/services/FixedServicesTab.tsx**
   - Details: Dead code - not imported from entry point

60. **  apps/tenant-app/src/components/tenantDashboard/tabs/services/hooks/useFixedServicesHandlers.ts**
   - Details: Dead code - not imported from entry point

61. **  apps/tenant-app/src/components/tenantDashboard/tabs/services/hooks/useServiceOperations.ts**
   - Details: Dead code - not imported from entry point

62. **  apps/tenant-app/src/components/tenantDashboard/tabs/services/hooks/useServiceSelection.ts**
   - Details: Dead code - not imported from entry point

63. **  apps/tenant-app/src/components/tenantDashboard/tabs/services/ServicesTab.tsx**
   - Details: Dead code - not imported from entry point

64. **  apps/tenant-app/src/components/tenantDashboard/tabs/services/types/ServiceFeature.ts**
   - Details: Dead code - not imported from entry point

65. **  apps/tenant-app/src/components/tenantDashboard/utils/tenantEvents.ts**
   - Details: Dead code - not imported from entry point

66. **  apps/tenant-app/src/hooks/usePreviewParams.ts**
   - Details: Dead code - not imported from entry point

---

## Detailed Log

Apps: tenant-app

## Phase 1: File Discovery

✅ Found 709 TypeScript/TSX files

## Phase 2: AST Parsing

✅ All files parsed successfully

## Phase 3: Graph Construction

✅ Built dependency graph with 709 nodes

## Phase 4: App Analysis

✅ tenant-app: 420 reachable files
✅ tenant-app: No boundary violations
⚠️ **WARNING**: tenant-app: 65 unreachable app files
⚠️ **WARNING**:   apps/tenant-app/src/components/booking/components/BookingForm.tsx
⚠️ **WARNING**:   apps/tenant-app/src/components/booking/components/steps/StepAddons/Header.tsx
⚠️ **WARNING**:   apps/tenant-app/src/components/booking/components/steps/StepService/Header.tsx
⚠️ **WARNING**:   apps/tenant-app/src/components/booking/components/steps/StepVehicleSelection/Header.tsx
⚠️ **WARNING**:   apps/tenant-app/src/components/booking/hooks/useBookingAsync.ts
⚠️ **WARNING**:   apps/tenant-app/src/components/cta/components/MobileCTAButtons.tsx
⚠️ **WARNING**:   apps/tenant-app/src/components/cta/components/SmartCTAButtons.tsx
⚠️ **WARNING**:   apps/tenant-app/src/components/cta/hooks/useBookingCapabilities.ts
⚠️ **WARNING**:   apps/tenant-app/src/components/customers/classes/Customer.ts
⚠️ **WARNING**:   apps/tenant-app/src/components/header/routes/tenantRoutes.tsx
⚠️ **WARNING**:   apps/tenant-app/src/components/locations/api/locations.api.ts
⚠️ **WARNING**:   apps/tenant-app/src/components/locations/components/LocationSelector.tsx
⚠️ **WARNING**:   apps/tenant-app/src/components/locations/hooks/useLocationPageState.ts
⚠️ **WARNING**:   apps/tenant-app/src/components/locations/LocationPage.tsx
⚠️ **WARNING**:   apps/tenant-app/src/components/locations/utils/googleMaps.helpers.ts
⚠️ **WARNING**:   apps/tenant-app/src/components/locations/utils/googlePlace.ts
⚠️ **WARNING**:   apps/tenant-app/src/components/locations/utils/placesLoader.ts
⚠️ **WARNING**:   apps/tenant-app/src/components/reviews/api/reviewsApi.ts
⚠️ **WARNING**:   apps/tenant-app/src/components/reviews/components/GoogleReviewsTest.tsx
⚠️ **WARNING**:   apps/tenant-app/src/components/reviews/hooks/useGoogleReviews.ts
⚠️ **WARNING**:   apps/tenant-app/src/components/reviews/hooks/useReviews.ts
⚠️ **WARNING**:   apps/tenant-app/src/components/reviews/hooks/useReviewsAvailability.ts
⚠️ **WARNING**:   apps/tenant-app/src/components/reviews/hooks/useReviewsContent.ts
⚠️ **WARNING**:   apps/tenant-app/src/components/reviews/hooks/useReviewsRating.ts
⚠️ **WARNING**:   apps/tenant-app/src/components/reviews/hooks/useRotatingReviews.ts
⚠️ **WARNING**:   apps/tenant-app/src/components/reviews/utils/reviewUtils.ts
⚠️ **WARNING**:   apps/tenant-app/src/components/services/api/services.api.ts
⚠️ **WARNING**:   apps/tenant-app/src/components/tenantDashboard/components/AddToHomeScreen.tsx
⚠️ **WARNING**:   apps/tenant-app/src/components/tenantDashboard/components/AutoSaveStatus.tsx
⚠️ **WARNING**:   apps/tenant-app/src/components/tenantDashboard/hooks/useDashboardData.ts
⚠️ **WARNING**:   apps/tenant-app/src/components/tenantDashboard/tabs/locations/components/LocationCard.tsx
⚠️ **WARNING**:   apps/tenant-app/src/components/tenantDashboard/tabs/locations/components/LocationSearch.tsx
⚠️ **WARNING**:   apps/tenant-app/src/components/tenantDashboard/tabs/locations/hooks/useLocationSearch.ts
⚠️ **WARNING**:   apps/tenant-app/src/components/tenantDashboard/tabs/overview/components/MetricsCards.tsx
⚠️ **WARNING**:   apps/tenant-app/src/components/tenantDashboard/tabs/overview/components/NotificationPanel.tsx
⚠️ **WARNING**:   apps/tenant-app/src/components/tenantDashboard/tabs/overview/components/RecentAppointments.tsx
⚠️ **WARNING**:   apps/tenant-app/src/components/tenantDashboard/tabs/overview/components/RecentReviews.tsx
⚠️ **WARNING**:   apps/tenant-app/src/components/tenantDashboard/tabs/overview/hooks/useDashboardStats.ts
⚠️ **WARNING**:   apps/tenant-app/src/components/tenantDashboard/tabs/overview/hooks/useNotifications.ts
⚠️ **WARNING**:   apps/tenant-app/src/components/tenantDashboard/tabs/overview/hooks/useRecentAppointments.ts
⚠️ **WARNING**:   apps/tenant-app/src/components/tenantDashboard/tabs/overview/hooks/useRecentReviews.ts
⚠️ **WARNING**:   apps/tenant-app/src/components/tenantDashboard/tabs/overview/utils/getStatusColor.ts
⚠️ **WARNING**:   apps/tenant-app/src/components/tenantDashboard/tabs/performance/PerformanceTab.tsx
⚠️ **WARNING**:   apps/tenant-app/src/components/tenantDashboard/tabs/profile/components/AutoSaveField.tsx
⚠️ **WARNING**:   apps/tenant-app/src/components/tenantDashboard/tabs/profile/components/ProfileForm.tsx
⚠️ **WARNING**:   apps/tenant-app/src/components/tenantDashboard/tabs/profile/components/SocialMediaUrlField.tsx
⚠️ **WARNING**:   apps/tenant-app/src/components/tenantDashboard/tabs/profile/hooks/useAutoSaveField.ts
⚠️ **WARNING**:   apps/tenant-app/src/components/tenantDashboard/tabs/schedule/api/appointments.ts
⚠️ **WARNING**:   apps/tenant-app/src/components/tenantDashboard/tabs/schedule/api/blockedDays.ts
⚠️ **WARNING**:   apps/tenant-app/src/components/tenantDashboard/tabs/schedule/api/scheduleSettings.ts
⚠️ **WARNING**:   apps/tenant-app/src/components/tenantDashboard/tabs/schedule/api/timeBlocks.ts
⚠️ **WARNING**:   apps/tenant-app/src/components/tenantDashboard/tabs/services/components/AddServiceModal.tsx
⚠️ **WARNING**:   apps/tenant-app/src/components/tenantDashboard/tabs/services/components/FeatureList.tsx
⚠️ **WARNING**:   apps/tenant-app/src/components/tenantDashboard/tabs/services/components/SelectedServiceDetailsDisplay.tsx
⚠️ **WARNING**:   apps/tenant-app/src/components/tenantDashboard/tabs/services/components/SelectedServiceDisplay.tsx
⚠️ **WARNING**:   apps/tenant-app/src/components/tenantDashboard/tabs/services/components/ServiceActionsHeader.tsx
⚠️ **WARNING**:   apps/tenant-app/src/components/tenantDashboard/tabs/services/components/ServiceTierCards.tsx
⚠️ **WARNING**:   apps/tenant-app/src/components/tenantDashboard/tabs/services/FixedServicesTab.tsx
⚠️ **WARNING**:   apps/tenant-app/src/components/tenantDashboard/tabs/services/hooks/useFixedServicesHandlers.ts
⚠️ **WARNING**:   apps/tenant-app/src/components/tenantDashboard/tabs/services/hooks/useServiceOperations.ts
⚠️ **WARNING**:   apps/tenant-app/src/components/tenantDashboard/tabs/services/hooks/useServiceSelection.ts
⚠️ **WARNING**:   apps/tenant-app/src/components/tenantDashboard/tabs/services/ServicesTab.tsx
⚠️ **WARNING**:   apps/tenant-app/src/components/tenantDashboard/tabs/services/types/ServiceFeature.ts
⚠️ **WARNING**:   apps/tenant-app/src/components/tenantDashboard/utils/tenantEvents.ts
⚠️ **WARNING**:   apps/tenant-app/src/hooks/usePreviewParams.ts
✅ tenant-app: Report saved to docs\audits\FLOW_FRONTEND_TENANT_APP.md

## Phase 5: Report Generation


---

## Recommendations

1. Review boundary violations - they violate architectural rules
2. Investigate unreachable files - they may be dead code
3. Consider consolidating duplicate components across apps
4. Use this flow map for impact analysis before making changes
