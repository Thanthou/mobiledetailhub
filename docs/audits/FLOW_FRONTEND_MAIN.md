# 📊 Frontend Flow Audit - main

**Generated:** 10/25/2025, 2:12:45 PM

## 🔴 Score: 0/100 (Poor Flow Health)

### Metrics

| Metric | Value |
|--------|-------|
| **App Files** | |
| Total App Files | 185 |
| Reachable App Files | 27 |
| Unreachable App Files | 123 |
| **Shared Files** | |
| Total Shared Files | 280 |
| Reachable Shared Files | 136 |
| Unreachable Shared Files | 115 |
| **Issues** | |
| Boundary Violations | 0 |
| Parse Errors | 0 |

## 🔴 Unreachable App Files (123)

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
- apps/main/src/MainApp.tsx
- apps/main/src/modes/MarketingSite.tsx
- apps/main/src/providers.tsx

## 🟡 Unreachable Shared Files (115)

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

... and 95 more

