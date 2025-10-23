# 📊 Frontend Flow Audit - main

**Generated:** 10/23/2025, 3:29:15 AM

## 🔴 Score: 0/100 (Poor Flow Health)

### Metrics

| Metric | Value |
|--------|-------|
| **App Files** | |
| Total App Files | 332 |
| Reachable App Files | 24 |
| Unreachable App Files | 244 |
| **Shared Files** | |
| Total Shared Files | 393 |
| Reachable Shared Files | 137 |
| Unreachable Shared Files | 203 |
| **Issues** | |
| Boundary Violations | 0 |
| Parse Errors | 0 |

## 🔴 Unreachable App Files (244)

These files in **main** are not imported from the entry point (dead code):

- apps/main/src/components/booking/api/booking.api.ts
- apps/main/src/components/booking/BookingApp.tsx
- apps/main/src/components/booking/components/BookingFlowController.tsx
- apps/main/src/components/booking/components/BookingForm.tsx
- apps/main/src/components/booking/components/BookingLayout.tsx
- apps/main/src/components/booking/components/BookingPage.tsx
- apps/main/src/components/booking/components/BookingSteps.tsx
- apps/main/src/components/booking/components/payment/PaymentOption.tsx
- apps/main/src/components/booking/components/shared/DetailsModal.tsx
- apps/main/src/components/booking/components/shared/Footer.tsx
- apps/main/src/components/booking/components/shared/HeroBackground.tsx
- apps/main/src/components/booking/components/steps/StepAddons/AddonDetailsModal.tsx
- apps/main/src/components/booking/components/steps/StepAddons/Addons.tsx
- apps/main/src/components/booking/components/steps/StepAddons/Header.tsx
- apps/main/src/components/booking/components/steps/StepAddons/StepAddons.tsx
- apps/main/src/components/booking/components/steps/StepAddons/Tabs.tsx
- apps/main/src/components/booking/components/steps/StepLocation/StepLocation.tsx
- apps/main/src/components/booking/components/steps/StepPayment/components/PaymentSummary.tsx
- apps/main/src/components/booking/components/steps/StepPayment/components/PaymentTabs.tsx
- apps/main/src/components/booking/components/steps/StepPayment/components/SummarySection.tsx
- apps/main/src/components/booking/components/steps/StepPayment/components/VehicleSection.tsx
- apps/main/src/components/booking/components/steps/StepPayment/StepPayment.tsx
- apps/main/src/components/booking/components/steps/StepSchedule/StepSchedule.tsx
- apps/main/src/components/booking/components/steps/StepService/Header.tsx
- apps/main/src/components/booking/components/steps/StepService/ServiceCard.tsx
- apps/main/src/components/booking/components/steps/StepService/ServiceCarousel.tsx
- apps/main/src/components/booking/components/steps/StepService/ServiceDetailsModal.tsx
- apps/main/src/components/booking/components/steps/StepService/StepService.tsx
- apps/main/src/components/booking/components/steps/StepVehicleSelection/Header.tsx
- apps/main/src/components/booking/components/steps/StepVehicleSelection/StepVehicleSelection.tsx
- apps/main/src/components/booking/components/steps/StepVehicleSelection/Tabs.tsx
- apps/main/src/components/booking/components/steps/StepVehicleSelection/VehicleType.tsx
- apps/main/src/components/booking/constants/hero.ts
- apps/main/src/components/booking/hooks/useAddons.ts
- apps/main/src/components/booking/hooks/useBookingAsync.ts
- apps/main/src/components/booking/hooks/useBookingGallery.ts
- apps/main/src/components/booking/hooks/useFeaturesData.ts
- apps/main/src/components/booking/hooks/usePaymentData.ts
- apps/main/src/components/booking/hooks/usePaymentForm.ts
- apps/main/src/components/booking/hooks/usePaymentMethods.ts
- apps/main/src/components/booking/hooks/useScheduleOptions.ts
- apps/main/src/components/booking/hooks/useServiceTiers.ts
- apps/main/src/components/booking/hooks/useVehicleData.ts
- apps/main/src/components/booking/state/bookingStore.ts
- apps/main/src/components/booking/state/types.ts
- apps/main/src/components/booking/utils/displayUtils.ts
- apps/main/src/components/cta/components/MobileCTAButtons.tsx
- apps/main/src/components/cta/components/SmartCTAButtons.tsx
- apps/main/src/components/cta/hooks/useBookingCapabilities.ts
- apps/main/src/components/customers/classes/Customer.ts
- apps/main/src/components/faq/components/FAQ.tsx
- apps/main/src/components/faq/components/FAQCategoryFilter.tsx
- apps/main/src/components/faq/components/FAQEmptyState.tsx
- apps/main/src/components/faq/components/FAQItem.tsx
- apps/main/src/components/faq/components/FAQList.tsx
- apps/main/src/components/faq/components/FAQSearchBar.tsx
- apps/main/src/components/faq/components/ServiceAreasLink.tsx
- apps/main/src/components/faq/hooks/useFAQContent.ts
- apps/main/src/components/faq/hooks/useFAQData.ts
- apps/main/src/components/faq/hooks/useRotatingBackground.ts
- apps/main/src/components/footer/components/ContactColumn.tsx
- apps/main/src/components/footer/components/Disclaimer.tsx
- apps/main/src/components/footer/components/FollowUs.tsx
- apps/main/src/components/footer/components/Footer.tsx
- apps/main/src/components/footer/components/FooterBottom.tsx
- apps/main/src/components/footer/components/GetInTouch.tsx
- apps/main/src/components/footer/components/ServiceAreas.tsx
- apps/main/src/components/footer/components/ServiceAreasColumn.tsx
- apps/main/src/components/footer/components/SocialMediaColumn.tsx
- apps/main/src/components/gallery/api/gallery.api.ts
- apps/main/src/components/gallery/components/Gallery.tsx
- apps/main/src/components/gallery/components/GalleryItem.tsx
- apps/main/src/components/gallery/components/RotatingGalleryItem.tsx
- apps/main/src/components/gallery/hooks/useGallery.ts
- apps/main/src/components/gallery/hooks/useRotatingGallery.ts
- apps/main/src/components/hero/components/ContentContainer.tsx
- apps/main/src/components/hero/components/CTA.tsx
- apps/main/src/components/hero/components/Hero.tsx
- apps/main/src/components/hero/components/ImageCarousel.tsx
- apps/main/src/components/hero/components/SmartHero.tsx
- apps/main/src/components/hero/components/TextDisplay.tsx
- apps/main/src/components/hero/hooks/useHeroContent.ts
- apps/main/src/components/locations/api/locations.api.ts
- apps/main/src/components/locations/components/LocationSelector.tsx
- apps/main/src/components/locations/hooks/useLocationPageState.ts
- apps/main/src/components/locations/LocationPage.tsx
- apps/main/src/components/locations/utils/googleMaps.helpers.ts
- apps/main/src/components/locations/utils/googlePlace.ts
- apps/main/src/components/locations/utils/placesLoader.ts
- apps/main/src/components/PreviewPage.tsx
- apps/main/src/components/quotes/api/quotes.api.ts
- apps/main/src/components/quotes/components/ContactSection.tsx
- apps/main/src/components/quotes/components/LazyRequestQuoteModal.tsx
- apps/main/src/components/quotes/components/QuoteForm.tsx
- apps/main/src/components/quotes/components/RequestQuoteModal.tsx
- apps/main/src/components/quotes/components/ServicesSection.tsx
- apps/main/src/components/quotes/components/SuccessMessage.tsx
- apps/main/src/components/quotes/components/VehicleSection.tsx
- apps/main/src/components/quotes/hooks/useQuoteForm.ts
- apps/main/src/components/quotes/hooks/useQuoteFormLogic.ts
- apps/main/src/components/quotes/hooks/useQuoteFormState.ts
- apps/main/src/components/quotes/hooks/useQuoteModal.ts
- apps/main/src/components/quotes/hooks/useQuoteSubmission.ts
- apps/main/src/components/quotes/hooks/useQuoteTenantData.ts
- apps/main/src/components/quotes/hooks/useQuoteValidation.ts
- apps/main/src/components/quotes/hooks/useQuoteVehicleData.ts
- apps/main/src/components/reviews/api/reviewsApi.ts
- apps/main/src/components/reviews/components/GoogleReviewsTest.tsx
- apps/main/src/components/reviews/components/ReviewCard.tsx
- apps/main/src/components/reviews/components/ReviewModal.tsx
- apps/main/src/components/reviews/components/Reviews.tsx
- apps/main/src/components/reviews/components/ReviewsCarousel.tsx
- apps/main/src/components/reviews/components/ReviewsHeader.tsx
- apps/main/src/components/reviews/hooks/useGoogleReviews.ts
- apps/main/src/components/reviews/hooks/useReviews.ts
- apps/main/src/components/reviews/hooks/useReviewsAvailability.ts
- apps/main/src/components/reviews/hooks/useReviewsContent.ts
- apps/main/src/components/reviews/hooks/useReviewsRating.ts
- apps/main/src/components/reviews/hooks/useRotatingReviews.ts
- apps/main/src/components/reviews/types/types.ts
- apps/main/src/components/reviews/utils/reviewUtils.ts
- apps/main/src/components/services/api/services.api.ts
- apps/main/src/components/services/components/BeforeAfterSlider.tsx
- apps/main/src/components/services/components/Process.tsx
- apps/main/src/components/services/components/ProtectionComparisonChart.tsx
- apps/main/src/components/services/components/Results.tsx
- apps/main/src/components/services/components/ServiceCard.tsx
- apps/main/src/components/services/components/ServiceCTA.tsx
- apps/main/src/components/services/components/ServiceHero.tsx
- apps/main/src/components/services/components/ServicesGrid.tsx
- apps/main/src/components/services/components/WhatItIs.tsx
- apps/main/src/components/services/hooks/useServicePage.ts
- apps/main/src/components/services/hooks/useServices.ts
- apps/main/src/components/services/types/service-data.ts
- apps/main/src/components/services/utils/protectionComparison.ts
- apps/main/src/components/tenantDashboard/api/analytics.ts
- apps/main/src/components/tenantDashboard/api/dashboard.api.ts
- apps/main/src/components/tenantDashboard/api/healthApi.ts
- apps/main/src/components/tenantDashboard/api/locationsApi.ts
- apps/main/src/components/tenantDashboard/api/reviewsApi.ts
- apps/main/src/components/tenantDashboard/api/websiteContentApi.ts
- apps/main/src/components/tenantDashboard/components/AddToHomeScreen.tsx
- apps/main/src/components/tenantDashboard/components/AutoSaveStatus.tsx
- apps/main/src/components/tenantDashboard/components/Dashboard.tsx
- apps/main/src/components/tenantDashboard/components/DashboardHeader.tsx
- apps/main/src/components/tenantDashboard/components/DashboardLayout.tsx
- apps/main/src/components/tenantDashboard/components/DashboardPage.tsx
- apps/main/src/components/tenantDashboard/components/DashboardTabs.tsx
- apps/main/src/components/tenantDashboard/components/TabContent.tsx
- apps/main/src/components/tenantDashboard/config/tabConfig.ts
- apps/main/src/components/tenantDashboard/hooks/useDashboardData.ts
- apps/main/src/components/tenantDashboard/hooks/useTenantBusinessData.ts
- apps/main/src/components/tenantDashboard/tabs/customers/CustomersTab.tsx
- apps/main/src/components/tenantDashboard/tabs/locations/components/AddLocationModal.tsx
- apps/main/src/components/tenantDashboard/tabs/locations/components/DeleteLocationModal.tsx
- apps/main/src/components/tenantDashboard/tabs/locations/components/LocationCard.tsx
- apps/main/src/components/tenantDashboard/tabs/locations/components/LocationSearch.tsx
- apps/main/src/components/tenantDashboard/tabs/locations/components/PrimaryServiceArea.tsx
- apps/main/src/components/tenantDashboard/tabs/locations/components/ServiceAreasList.tsx
- apps/main/src/components/tenantDashboard/tabs/locations/hooks/useGoogleMaps.ts
- apps/main/src/components/tenantDashboard/tabs/locations/hooks/useLocationSearch.ts
- apps/main/src/components/tenantDashboard/tabs/locations/hooks/useLocationState.ts
- apps/main/src/components/tenantDashboard/tabs/locations/LocationsTab.tsx
- apps/main/src/components/tenantDashboard/tabs/overview/components/MetricsCards.tsx
- apps/main/src/components/tenantDashboard/tabs/overview/components/NotificationPanel.tsx
- apps/main/src/components/tenantDashboard/tabs/overview/components/QuickActions.tsx
- apps/main/src/components/tenantDashboard/tabs/overview/components/RecentAppointments.tsx
- apps/main/src/components/tenantDashboard/tabs/overview/components/RecentReviews.tsx
- apps/main/src/components/tenantDashboard/tabs/overview/hooks/useDashboardStats.ts
- apps/main/src/components/tenantDashboard/tabs/overview/hooks/useNotifications.ts
- apps/main/src/components/tenantDashboard/tabs/overview/hooks/useRecentAppointments.ts
- apps/main/src/components/tenantDashboard/tabs/overview/hooks/useRecentReviews.ts
- apps/main/src/components/tenantDashboard/tabs/overview/OverviewTab.tsx
- apps/main/src/components/tenantDashboard/tabs/overview/utils/getStatusColor.ts
- apps/main/src/components/tenantDashboard/tabs/performance/PerformanceTab.tsx
- apps/main/src/components/tenantDashboard/tabs/profile/components/AutoSaveField.tsx
- apps/main/src/components/tenantDashboard/tabs/profile/components/ProfileForm.tsx
- apps/main/src/components/tenantDashboard/tabs/profile/components/SocialMediaUrlField.tsx
- apps/main/src/components/tenantDashboard/tabs/profile/hooks/useAutoSaveField.ts
- apps/main/src/components/tenantDashboard/tabs/profile/hooks/useProfileData.ts
- apps/main/src/components/tenantDashboard/tabs/profile/ProfileTab.tsx
- apps/main/src/components/tenantDashboard/tabs/schedule/api/appointments.ts
- apps/main/src/components/tenantDashboard/tabs/schedule/api/blockedDays.ts
- apps/main/src/components/tenantDashboard/tabs/schedule/api/scheduleSettings.ts
- apps/main/src/components/tenantDashboard/tabs/schedule/api/timeBlocks.ts
- apps/main/src/components/tenantDashboard/tabs/schedule/components/AppointmentCard.tsx
- apps/main/src/components/tenantDashboard/tabs/schedule/components/DayView.tsx
- apps/main/src/components/tenantDashboard/tabs/schedule/components/modals/AppointmentModal.tsx
- apps/main/src/components/tenantDashboard/tabs/schedule/components/MonthView.tsx
- apps/main/src/components/tenantDashboard/tabs/schedule/components/ScheduleGrid.tsx
- apps/main/src/components/tenantDashboard/tabs/schedule/components/ScheduleHeader.tsx
- apps/main/src/components/tenantDashboard/tabs/schedule/components/ScheduleLoadingState.tsx
- apps/main/src/components/tenantDashboard/tabs/schedule/components/ScheduleNavigationHeader.tsx
- apps/main/src/components/tenantDashboard/tabs/schedule/components/ScheduleSidebar.tsx
- apps/main/src/components/tenantDashboard/tabs/schedule/components/scheduleUtils.ts
- apps/main/src/components/tenantDashboard/tabs/schedule/components/WeekView.tsx
- apps/main/src/components/tenantDashboard/tabs/schedule/hooks/useScheduleData.ts
- apps/main/src/components/tenantDashboard/tabs/schedule/ScheduleTab.tsx
- apps/main/src/components/tenantDashboard/tabs/services/components/AddServiceModal.tsx
- apps/main/src/components/tenantDashboard/tabs/services/components/CategorySelector.tsx
- apps/main/src/components/tenantDashboard/tabs/services/components/DeleteServiceModal.tsx
- apps/main/src/components/tenantDashboard/tabs/services/components/FeatureDropdown.tsx
- apps/main/src/components/tenantDashboard/tabs/services/components/FeatureList.tsx
- apps/main/src/components/tenantDashboard/tabs/services/components/MultiTierPricingModal.tsx
- apps/main/src/components/tenantDashboard/tabs/services/components/SelectedServiceDetailsDisplay.tsx
- apps/main/src/components/tenantDashboard/tabs/services/components/SelectedServiceDisplay.tsx
- apps/main/src/components/tenantDashboard/tabs/services/components/ServiceActionsHeader.tsx
- apps/main/src/components/tenantDashboard/tabs/services/components/ServiceSelector.tsx
- apps/main/src/components/tenantDashboard/tabs/services/components/ServiceTierCards.tsx
- apps/main/src/components/tenantDashboard/tabs/services/components/VehicleSelector.tsx
- apps/main/src/components/tenantDashboard/tabs/services/FixedServicesTab.tsx
- apps/main/src/components/tenantDashboard/tabs/services/hooks/useFixedServicesHandlers.ts
- apps/main/src/components/tenantDashboard/tabs/services/hooks/useServiceOperations.ts
- apps/main/src/components/tenantDashboard/tabs/services/hooks/useServicesData.ts
- apps/main/src/components/tenantDashboard/tabs/services/hooks/useServiceSelection.ts
- apps/main/src/components/tenantDashboard/tabs/services/hooks/useTenantId.ts
- apps/main/src/components/tenantDashboard/tabs/services/ServicesTab.tsx
- apps/main/src/components/tenantDashboard/tabs/services/SimpleFixedServicesTab.tsx
- apps/main/src/components/tenantDashboard/tabs/services/types/ServiceClasses.ts
- apps/main/src/components/tenantDashboard/tabs/services/types/ServiceFeature.ts
- apps/main/src/components/tenantDashboard/tabs/website/components/AddReviewForm.tsx
- apps/main/src/components/tenantDashboard/tabs/website/components/FAQItemAutoSaveField.tsx
- apps/main/src/components/tenantDashboard/tabs/website/components/FAQSection.tsx
- apps/main/src/components/tenantDashboard/tabs/website/components/GallerySection.tsx
- apps/main/src/components/tenantDashboard/tabs/website/components/HealthTab.tsx
- apps/main/src/components/tenantDashboard/tabs/website/components/HeroSection.tsx
- apps/main/src/components/tenantDashboard/tabs/website/components/RemoveReviewTab.tsx
- apps/main/src/components/tenantDashboard/tabs/website/components/ReviewsContent.tsx
- apps/main/src/components/tenantDashboard/tabs/website/components/ReviewsSection.tsx
- apps/main/src/components/tenantDashboard/tabs/website/components/ServicesSection.tsx
- apps/main/src/components/tenantDashboard/tabs/website/components/WebsiteAutoSaveField.tsx
- apps/main/src/components/tenantDashboard/tabs/website/contexts/WebsiteContentContext.tsx
- apps/main/src/components/tenantDashboard/tabs/website/hooks/useWebsiteContentData.ts
- apps/main/src/components/tenantDashboard/tabs/website/hooks/useWebsiteContentField.ts
- apps/main/src/components/tenantDashboard/tabs/website/WebsiteContentTab.tsx
- apps/main/src/components/tenantDashboard/tabs/website/WebsiteDomainTab.tsx
- apps/main/src/components/tenantDashboard/tabs/website/WebsiteHealthTab.tsx
- apps/main/src/components/tenantDashboard/tabs/website/WebsitePerformanceTab.tsx
- apps/main/src/components/tenantDashboard/tabs/website/WebsiteTab.tsx
- apps/main/src/components/tenantDashboard/utils/constants.ts
- apps/main/src/components/tenantDashboard/utils/tenantEvents.ts
- apps/main/src/MainApp.tsx
- apps/main/src/modes/MarketingSite.tsx
- apps/main/src/providers.tsx

## 🟡 Unreachable Shared Files (203)

These shared files are not used by **main** (but may be used by other apps):

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

... and 183 more

