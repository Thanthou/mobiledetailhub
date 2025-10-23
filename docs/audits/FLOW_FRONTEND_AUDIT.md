# Frontend Flow Tracer Audit Report

**Generated:** 2025-10-23T10:29:15.821Z
**Duration:** 1703ms
**Score:** 0/100

---

## Summary

- ✅ **Passed:** 6
- ⚠️  **Warnings:** 245
- ❌ **Errors:** 0

## Description

Complete frontend flow analysis: maps React component dependencies, validates architectural boundaries, identifies unreachable code.

## Issues Found

### 🟡 Warnings

1. **main: 244 unreachable app files**
   - Details: Dead code - files not imported from entry point

2. **  apps/main/src/components/booking/api/booking.api.ts**
   - Details: Dead code - not imported from entry point

3. **  apps/main/src/components/booking/BookingApp.tsx**
   - Details: Dead code - not imported from entry point

4. **  apps/main/src/components/booking/components/BookingFlowController.tsx**
   - Details: Dead code - not imported from entry point

5. **  apps/main/src/components/booking/components/BookingForm.tsx**
   - Details: Dead code - not imported from entry point

6. **  apps/main/src/components/booking/components/BookingLayout.tsx**
   - Details: Dead code - not imported from entry point

7. **  apps/main/src/components/booking/components/BookingPage.tsx**
   - Details: Dead code - not imported from entry point

8. **  apps/main/src/components/booking/components/BookingSteps.tsx**
   - Details: Dead code - not imported from entry point

9. **  apps/main/src/components/booking/components/payment/PaymentOption.tsx**
   - Details: Dead code - not imported from entry point

10. **  apps/main/src/components/booking/components/shared/DetailsModal.tsx**
   - Details: Dead code - not imported from entry point

11. **  apps/main/src/components/booking/components/shared/Footer.tsx**
   - Details: Dead code - not imported from entry point

12. **  apps/main/src/components/booking/components/shared/HeroBackground.tsx**
   - Details: Dead code - not imported from entry point

13. **  apps/main/src/components/booking/components/steps/StepAddons/AddonDetailsModal.tsx**
   - Details: Dead code - not imported from entry point

14. **  apps/main/src/components/booking/components/steps/StepAddons/Addons.tsx**
   - Details: Dead code - not imported from entry point

15. **  apps/main/src/components/booking/components/steps/StepAddons/Header.tsx**
   - Details: Dead code - not imported from entry point

16. **  apps/main/src/components/booking/components/steps/StepAddons/StepAddons.tsx**
   - Details: Dead code - not imported from entry point

17. **  apps/main/src/components/booking/components/steps/StepAddons/Tabs.tsx**
   - Details: Dead code - not imported from entry point

18. **  apps/main/src/components/booking/components/steps/StepLocation/StepLocation.tsx**
   - Details: Dead code - not imported from entry point

19. **  apps/main/src/components/booking/components/steps/StepPayment/components/PaymentSummary.tsx**
   - Details: Dead code - not imported from entry point

20. **  apps/main/src/components/booking/components/steps/StepPayment/components/PaymentTabs.tsx**
   - Details: Dead code - not imported from entry point

21. **  apps/main/src/components/booking/components/steps/StepPayment/components/SummarySection.tsx**
   - Details: Dead code - not imported from entry point

22. **  apps/main/src/components/booking/components/steps/StepPayment/components/VehicleSection.tsx**
   - Details: Dead code - not imported from entry point

23. **  apps/main/src/components/booking/components/steps/StepPayment/StepPayment.tsx**
   - Details: Dead code - not imported from entry point

24. **  apps/main/src/components/booking/components/steps/StepSchedule/StepSchedule.tsx**
   - Details: Dead code - not imported from entry point

25. **  apps/main/src/components/booking/components/steps/StepService/Header.tsx**
   - Details: Dead code - not imported from entry point

26. **  apps/main/src/components/booking/components/steps/StepService/ServiceCard.tsx**
   - Details: Dead code - not imported from entry point

27. **  apps/main/src/components/booking/components/steps/StepService/ServiceCarousel.tsx**
   - Details: Dead code - not imported from entry point

28. **  apps/main/src/components/booking/components/steps/StepService/ServiceDetailsModal.tsx**
   - Details: Dead code - not imported from entry point

29. **  apps/main/src/components/booking/components/steps/StepService/StepService.tsx**
   - Details: Dead code - not imported from entry point

30. **  apps/main/src/components/booking/components/steps/StepVehicleSelection/Header.tsx**
   - Details: Dead code - not imported from entry point

31. **  apps/main/src/components/booking/components/steps/StepVehicleSelection/StepVehicleSelection.tsx**
   - Details: Dead code - not imported from entry point

32. **  apps/main/src/components/booking/components/steps/StepVehicleSelection/Tabs.tsx**
   - Details: Dead code - not imported from entry point

33. **  apps/main/src/components/booking/components/steps/StepVehicleSelection/VehicleType.tsx**
   - Details: Dead code - not imported from entry point

34. **  apps/main/src/components/booking/constants/hero.ts**
   - Details: Dead code - not imported from entry point

35. **  apps/main/src/components/booking/hooks/useAddons.ts**
   - Details: Dead code - not imported from entry point

36. **  apps/main/src/components/booking/hooks/useBookingAsync.ts**
   - Details: Dead code - not imported from entry point

37. **  apps/main/src/components/booking/hooks/useBookingGallery.ts**
   - Details: Dead code - not imported from entry point

38. **  apps/main/src/components/booking/hooks/useFeaturesData.ts**
   - Details: Dead code - not imported from entry point

39. **  apps/main/src/components/booking/hooks/usePaymentData.ts**
   - Details: Dead code - not imported from entry point

40. **  apps/main/src/components/booking/hooks/usePaymentForm.ts**
   - Details: Dead code - not imported from entry point

41. **  apps/main/src/components/booking/hooks/usePaymentMethods.ts**
   - Details: Dead code - not imported from entry point

42. **  apps/main/src/components/booking/hooks/useScheduleOptions.ts**
   - Details: Dead code - not imported from entry point

43. **  apps/main/src/components/booking/hooks/useServiceTiers.ts**
   - Details: Dead code - not imported from entry point

44. **  apps/main/src/components/booking/hooks/useVehicleData.ts**
   - Details: Dead code - not imported from entry point

45. **  apps/main/src/components/booking/state/bookingStore.ts**
   - Details: Dead code - not imported from entry point

46. **  apps/main/src/components/booking/state/types.ts**
   - Details: Dead code - not imported from entry point

47. **  apps/main/src/components/booking/utils/displayUtils.ts**
   - Details: Dead code - not imported from entry point

48. **  apps/main/src/components/cta/components/MobileCTAButtons.tsx**
   - Details: Dead code - not imported from entry point

49. **  apps/main/src/components/cta/components/SmartCTAButtons.tsx**
   - Details: Dead code - not imported from entry point

50. **  apps/main/src/components/cta/hooks/useBookingCapabilities.ts**
   - Details: Dead code - not imported from entry point

51. **  apps/main/src/components/customers/classes/Customer.ts**
   - Details: Dead code - not imported from entry point

52. **  apps/main/src/components/faq/components/FAQ.tsx**
   - Details: Dead code - not imported from entry point

53. **  apps/main/src/components/faq/components/FAQCategoryFilter.tsx**
   - Details: Dead code - not imported from entry point

54. **  apps/main/src/components/faq/components/FAQEmptyState.tsx**
   - Details: Dead code - not imported from entry point

55. **  apps/main/src/components/faq/components/FAQItem.tsx**
   - Details: Dead code - not imported from entry point

56. **  apps/main/src/components/faq/components/FAQList.tsx**
   - Details: Dead code - not imported from entry point

57. **  apps/main/src/components/faq/components/FAQSearchBar.tsx**
   - Details: Dead code - not imported from entry point

58. **  apps/main/src/components/faq/components/ServiceAreasLink.tsx**
   - Details: Dead code - not imported from entry point

59. **  apps/main/src/components/faq/hooks/useFAQContent.ts**
   - Details: Dead code - not imported from entry point

60. **  apps/main/src/components/faq/hooks/useFAQData.ts**
   - Details: Dead code - not imported from entry point

61. **  apps/main/src/components/faq/hooks/useRotatingBackground.ts**
   - Details: Dead code - not imported from entry point

62. **  apps/main/src/components/footer/components/ContactColumn.tsx**
   - Details: Dead code - not imported from entry point

63. **  apps/main/src/components/footer/components/Disclaimer.tsx**
   - Details: Dead code - not imported from entry point

64. **  apps/main/src/components/footer/components/FollowUs.tsx**
   - Details: Dead code - not imported from entry point

65. **  apps/main/src/components/footer/components/Footer.tsx**
   - Details: Dead code - not imported from entry point

66. **  apps/main/src/components/footer/components/FooterBottom.tsx**
   - Details: Dead code - not imported from entry point

67. **  apps/main/src/components/footer/components/GetInTouch.tsx**
   - Details: Dead code - not imported from entry point

68. **  apps/main/src/components/footer/components/ServiceAreas.tsx**
   - Details: Dead code - not imported from entry point

69. **  apps/main/src/components/footer/components/ServiceAreasColumn.tsx**
   - Details: Dead code - not imported from entry point

70. **  apps/main/src/components/footer/components/SocialMediaColumn.tsx**
   - Details: Dead code - not imported from entry point

71. **  apps/main/src/components/gallery/api/gallery.api.ts**
   - Details: Dead code - not imported from entry point

72. **  apps/main/src/components/gallery/components/Gallery.tsx**
   - Details: Dead code - not imported from entry point

73. **  apps/main/src/components/gallery/components/GalleryItem.tsx**
   - Details: Dead code - not imported from entry point

74. **  apps/main/src/components/gallery/components/RotatingGalleryItem.tsx**
   - Details: Dead code - not imported from entry point

75. **  apps/main/src/components/gallery/hooks/useGallery.ts**
   - Details: Dead code - not imported from entry point

76. **  apps/main/src/components/gallery/hooks/useRotatingGallery.ts**
   - Details: Dead code - not imported from entry point

77. **  apps/main/src/components/hero/components/ContentContainer.tsx**
   - Details: Dead code - not imported from entry point

78. **  apps/main/src/components/hero/components/CTA.tsx**
   - Details: Dead code - not imported from entry point

79. **  apps/main/src/components/hero/components/Hero.tsx**
   - Details: Dead code - not imported from entry point

80. **  apps/main/src/components/hero/components/ImageCarousel.tsx**
   - Details: Dead code - not imported from entry point

81. **  apps/main/src/components/hero/components/SmartHero.tsx**
   - Details: Dead code - not imported from entry point

82. **  apps/main/src/components/hero/components/TextDisplay.tsx**
   - Details: Dead code - not imported from entry point

83. **  apps/main/src/components/hero/hooks/useHeroContent.ts**
   - Details: Dead code - not imported from entry point

84. **  apps/main/src/components/locations/api/locations.api.ts**
   - Details: Dead code - not imported from entry point

85. **  apps/main/src/components/locations/components/LocationSelector.tsx**
   - Details: Dead code - not imported from entry point

86. **  apps/main/src/components/locations/hooks/useLocationPageState.ts**
   - Details: Dead code - not imported from entry point

87. **  apps/main/src/components/locations/LocationPage.tsx**
   - Details: Dead code - not imported from entry point

88. **  apps/main/src/components/locations/utils/googleMaps.helpers.ts**
   - Details: Dead code - not imported from entry point

89. **  apps/main/src/components/locations/utils/googlePlace.ts**
   - Details: Dead code - not imported from entry point

90. **  apps/main/src/components/locations/utils/placesLoader.ts**
   - Details: Dead code - not imported from entry point

91. **  apps/main/src/components/PreviewPage.tsx**
   - Details: Dead code - not imported from entry point

92. **  apps/main/src/components/quotes/api/quotes.api.ts**
   - Details: Dead code - not imported from entry point

93. **  apps/main/src/components/quotes/components/ContactSection.tsx**
   - Details: Dead code - not imported from entry point

94. **  apps/main/src/components/quotes/components/LazyRequestQuoteModal.tsx**
   - Details: Dead code - not imported from entry point

95. **  apps/main/src/components/quotes/components/QuoteForm.tsx**
   - Details: Dead code - not imported from entry point

96. **  apps/main/src/components/quotes/components/RequestQuoteModal.tsx**
   - Details: Dead code - not imported from entry point

97. **  apps/main/src/components/quotes/components/ServicesSection.tsx**
   - Details: Dead code - not imported from entry point

98. **  apps/main/src/components/quotes/components/SuccessMessage.tsx**
   - Details: Dead code - not imported from entry point

99. **  apps/main/src/components/quotes/components/VehicleSection.tsx**
   - Details: Dead code - not imported from entry point

100. **  apps/main/src/components/quotes/hooks/useQuoteForm.ts**
   - Details: Dead code - not imported from entry point

101. **  apps/main/src/components/quotes/hooks/useQuoteFormLogic.ts**
   - Details: Dead code - not imported from entry point

102. **  apps/main/src/components/quotes/hooks/useQuoteFormState.ts**
   - Details: Dead code - not imported from entry point

103. **  apps/main/src/components/quotes/hooks/useQuoteModal.ts**
   - Details: Dead code - not imported from entry point

104. **  apps/main/src/components/quotes/hooks/useQuoteSubmission.ts**
   - Details: Dead code - not imported from entry point

105. **  apps/main/src/components/quotes/hooks/useQuoteTenantData.ts**
   - Details: Dead code - not imported from entry point

106. **  apps/main/src/components/quotes/hooks/useQuoteValidation.ts**
   - Details: Dead code - not imported from entry point

107. **  apps/main/src/components/quotes/hooks/useQuoteVehicleData.ts**
   - Details: Dead code - not imported from entry point

108. **  apps/main/src/components/reviews/api/reviewsApi.ts**
   - Details: Dead code - not imported from entry point

109. **  apps/main/src/components/reviews/components/GoogleReviewsTest.tsx**
   - Details: Dead code - not imported from entry point

110. **  apps/main/src/components/reviews/components/ReviewCard.tsx**
   - Details: Dead code - not imported from entry point

111. **  apps/main/src/components/reviews/components/ReviewModal.tsx**
   - Details: Dead code - not imported from entry point

112. **  apps/main/src/components/reviews/components/Reviews.tsx**
   - Details: Dead code - not imported from entry point

113. **  apps/main/src/components/reviews/components/ReviewsCarousel.tsx**
   - Details: Dead code - not imported from entry point

114. **  apps/main/src/components/reviews/components/ReviewsHeader.tsx**
   - Details: Dead code - not imported from entry point

115. **  apps/main/src/components/reviews/hooks/useGoogleReviews.ts**
   - Details: Dead code - not imported from entry point

116. **  apps/main/src/components/reviews/hooks/useReviews.ts**
   - Details: Dead code - not imported from entry point

117. **  apps/main/src/components/reviews/hooks/useReviewsAvailability.ts**
   - Details: Dead code - not imported from entry point

118. **  apps/main/src/components/reviews/hooks/useReviewsContent.ts**
   - Details: Dead code - not imported from entry point

119. **  apps/main/src/components/reviews/hooks/useReviewsRating.ts**
   - Details: Dead code - not imported from entry point

120. **  apps/main/src/components/reviews/hooks/useRotatingReviews.ts**
   - Details: Dead code - not imported from entry point

121. **  apps/main/src/components/reviews/types/types.ts**
   - Details: Dead code - not imported from entry point

122. **  apps/main/src/components/reviews/utils/reviewUtils.ts**
   - Details: Dead code - not imported from entry point

123. **  apps/main/src/components/services/api/services.api.ts**
   - Details: Dead code - not imported from entry point

124. **  apps/main/src/components/services/components/BeforeAfterSlider.tsx**
   - Details: Dead code - not imported from entry point

125. **  apps/main/src/components/services/components/Process.tsx**
   - Details: Dead code - not imported from entry point

126. **  apps/main/src/components/services/components/ProtectionComparisonChart.tsx**
   - Details: Dead code - not imported from entry point

127. **  apps/main/src/components/services/components/Results.tsx**
   - Details: Dead code - not imported from entry point

128. **  apps/main/src/components/services/components/ServiceCard.tsx**
   - Details: Dead code - not imported from entry point

129. **  apps/main/src/components/services/components/ServiceCTA.tsx**
   - Details: Dead code - not imported from entry point

130. **  apps/main/src/components/services/components/ServiceHero.tsx**
   - Details: Dead code - not imported from entry point

131. **  apps/main/src/components/services/components/ServicesGrid.tsx**
   - Details: Dead code - not imported from entry point

132. **  apps/main/src/components/services/components/WhatItIs.tsx**
   - Details: Dead code - not imported from entry point

133. **  apps/main/src/components/services/hooks/useServicePage.ts**
   - Details: Dead code - not imported from entry point

134. **  apps/main/src/components/services/hooks/useServices.ts**
   - Details: Dead code - not imported from entry point

135. **  apps/main/src/components/services/types/service-data.ts**
   - Details: Dead code - not imported from entry point

136. **  apps/main/src/components/services/utils/protectionComparison.ts**
   - Details: Dead code - not imported from entry point

137. **  apps/main/src/components/tenantDashboard/api/analytics.ts**
   - Details: Dead code - not imported from entry point

138. **  apps/main/src/components/tenantDashboard/api/dashboard.api.ts**
   - Details: Dead code - not imported from entry point

139. **  apps/main/src/components/tenantDashboard/api/healthApi.ts**
   - Details: Dead code - not imported from entry point

140. **  apps/main/src/components/tenantDashboard/api/locationsApi.ts**
   - Details: Dead code - not imported from entry point

141. **  apps/main/src/components/tenantDashboard/api/reviewsApi.ts**
   - Details: Dead code - not imported from entry point

142. **  apps/main/src/components/tenantDashboard/api/websiteContentApi.ts**
   - Details: Dead code - not imported from entry point

143. **  apps/main/src/components/tenantDashboard/components/AddToHomeScreen.tsx**
   - Details: Dead code - not imported from entry point

144. **  apps/main/src/components/tenantDashboard/components/AutoSaveStatus.tsx**
   - Details: Dead code - not imported from entry point

145. **  apps/main/src/components/tenantDashboard/components/Dashboard.tsx**
   - Details: Dead code - not imported from entry point

146. **  apps/main/src/components/tenantDashboard/components/DashboardHeader.tsx**
   - Details: Dead code - not imported from entry point

147. **  apps/main/src/components/tenantDashboard/components/DashboardLayout.tsx**
   - Details: Dead code - not imported from entry point

148. **  apps/main/src/components/tenantDashboard/components/DashboardPage.tsx**
   - Details: Dead code - not imported from entry point

149. **  apps/main/src/components/tenantDashboard/components/DashboardTabs.tsx**
   - Details: Dead code - not imported from entry point

150. **  apps/main/src/components/tenantDashboard/components/TabContent.tsx**
   - Details: Dead code - not imported from entry point

151. **  apps/main/src/components/tenantDashboard/config/tabConfig.ts**
   - Details: Dead code - not imported from entry point

152. **  apps/main/src/components/tenantDashboard/hooks/useDashboardData.ts**
   - Details: Dead code - not imported from entry point

153. **  apps/main/src/components/tenantDashboard/hooks/useTenantBusinessData.ts**
   - Details: Dead code - not imported from entry point

154. **  apps/main/src/components/tenantDashboard/tabs/customers/CustomersTab.tsx**
   - Details: Dead code - not imported from entry point

155. **  apps/main/src/components/tenantDashboard/tabs/locations/components/AddLocationModal.tsx**
   - Details: Dead code - not imported from entry point

156. **  apps/main/src/components/tenantDashboard/tabs/locations/components/DeleteLocationModal.tsx**
   - Details: Dead code - not imported from entry point

157. **  apps/main/src/components/tenantDashboard/tabs/locations/components/LocationCard.tsx**
   - Details: Dead code - not imported from entry point

158. **  apps/main/src/components/tenantDashboard/tabs/locations/components/LocationSearch.tsx**
   - Details: Dead code - not imported from entry point

159. **  apps/main/src/components/tenantDashboard/tabs/locations/components/PrimaryServiceArea.tsx**
   - Details: Dead code - not imported from entry point

160. **  apps/main/src/components/tenantDashboard/tabs/locations/components/ServiceAreasList.tsx**
   - Details: Dead code - not imported from entry point

161. **  apps/main/src/components/tenantDashboard/tabs/locations/hooks/useGoogleMaps.ts**
   - Details: Dead code - not imported from entry point

162. **  apps/main/src/components/tenantDashboard/tabs/locations/hooks/useLocationSearch.ts**
   - Details: Dead code - not imported from entry point

163. **  apps/main/src/components/tenantDashboard/tabs/locations/hooks/useLocationState.ts**
   - Details: Dead code - not imported from entry point

164. **  apps/main/src/components/tenantDashboard/tabs/locations/LocationsTab.tsx**
   - Details: Dead code - not imported from entry point

165. **  apps/main/src/components/tenantDashboard/tabs/overview/components/MetricsCards.tsx**
   - Details: Dead code - not imported from entry point

166. **  apps/main/src/components/tenantDashboard/tabs/overview/components/NotificationPanel.tsx**
   - Details: Dead code - not imported from entry point

167. **  apps/main/src/components/tenantDashboard/tabs/overview/components/QuickActions.tsx**
   - Details: Dead code - not imported from entry point

168. **  apps/main/src/components/tenantDashboard/tabs/overview/components/RecentAppointments.tsx**
   - Details: Dead code - not imported from entry point

169. **  apps/main/src/components/tenantDashboard/tabs/overview/components/RecentReviews.tsx**
   - Details: Dead code - not imported from entry point

170. **  apps/main/src/components/tenantDashboard/tabs/overview/hooks/useDashboardStats.ts**
   - Details: Dead code - not imported from entry point

171. **  apps/main/src/components/tenantDashboard/tabs/overview/hooks/useNotifications.ts**
   - Details: Dead code - not imported from entry point

172. **  apps/main/src/components/tenantDashboard/tabs/overview/hooks/useRecentAppointments.ts**
   - Details: Dead code - not imported from entry point

173. **  apps/main/src/components/tenantDashboard/tabs/overview/hooks/useRecentReviews.ts**
   - Details: Dead code - not imported from entry point

174. **  apps/main/src/components/tenantDashboard/tabs/overview/OverviewTab.tsx**
   - Details: Dead code - not imported from entry point

175. **  apps/main/src/components/tenantDashboard/tabs/overview/utils/getStatusColor.ts**
   - Details: Dead code - not imported from entry point

176. **  apps/main/src/components/tenantDashboard/tabs/performance/PerformanceTab.tsx**
   - Details: Dead code - not imported from entry point

177. **  apps/main/src/components/tenantDashboard/tabs/profile/components/AutoSaveField.tsx**
   - Details: Dead code - not imported from entry point

178. **  apps/main/src/components/tenantDashboard/tabs/profile/components/ProfileForm.tsx**
   - Details: Dead code - not imported from entry point

179. **  apps/main/src/components/tenantDashboard/tabs/profile/components/SocialMediaUrlField.tsx**
   - Details: Dead code - not imported from entry point

180. **  apps/main/src/components/tenantDashboard/tabs/profile/hooks/useAutoSaveField.ts**
   - Details: Dead code - not imported from entry point

181. **  apps/main/src/components/tenantDashboard/tabs/profile/hooks/useProfileData.ts**
   - Details: Dead code - not imported from entry point

182. **  apps/main/src/components/tenantDashboard/tabs/profile/ProfileTab.tsx**
   - Details: Dead code - not imported from entry point

183. **  apps/main/src/components/tenantDashboard/tabs/schedule/api/appointments.ts**
   - Details: Dead code - not imported from entry point

184. **  apps/main/src/components/tenantDashboard/tabs/schedule/api/blockedDays.ts**
   - Details: Dead code - not imported from entry point

185. **  apps/main/src/components/tenantDashboard/tabs/schedule/api/scheduleSettings.ts**
   - Details: Dead code - not imported from entry point

186. **  apps/main/src/components/tenantDashboard/tabs/schedule/api/timeBlocks.ts**
   - Details: Dead code - not imported from entry point

187. **  apps/main/src/components/tenantDashboard/tabs/schedule/components/AppointmentCard.tsx**
   - Details: Dead code - not imported from entry point

188. **  apps/main/src/components/tenantDashboard/tabs/schedule/components/DayView.tsx**
   - Details: Dead code - not imported from entry point

189. **  apps/main/src/components/tenantDashboard/tabs/schedule/components/modals/AppointmentModal.tsx**
   - Details: Dead code - not imported from entry point

190. **  apps/main/src/components/tenantDashboard/tabs/schedule/components/MonthView.tsx**
   - Details: Dead code - not imported from entry point

191. **  apps/main/src/components/tenantDashboard/tabs/schedule/components/ScheduleGrid.tsx**
   - Details: Dead code - not imported from entry point

192. **  apps/main/src/components/tenantDashboard/tabs/schedule/components/ScheduleHeader.tsx**
   - Details: Dead code - not imported from entry point

193. **  apps/main/src/components/tenantDashboard/tabs/schedule/components/ScheduleLoadingState.tsx**
   - Details: Dead code - not imported from entry point

194. **  apps/main/src/components/tenantDashboard/tabs/schedule/components/ScheduleNavigationHeader.tsx**
   - Details: Dead code - not imported from entry point

195. **  apps/main/src/components/tenantDashboard/tabs/schedule/components/ScheduleSidebar.tsx**
   - Details: Dead code - not imported from entry point

196. **  apps/main/src/components/tenantDashboard/tabs/schedule/components/scheduleUtils.ts**
   - Details: Dead code - not imported from entry point

197. **  apps/main/src/components/tenantDashboard/tabs/schedule/components/WeekView.tsx**
   - Details: Dead code - not imported from entry point

198. **  apps/main/src/components/tenantDashboard/tabs/schedule/hooks/useScheduleData.ts**
   - Details: Dead code - not imported from entry point

199. **  apps/main/src/components/tenantDashboard/tabs/schedule/ScheduleTab.tsx**
   - Details: Dead code - not imported from entry point

200. **  apps/main/src/components/tenantDashboard/tabs/services/components/AddServiceModal.tsx**
   - Details: Dead code - not imported from entry point

201. **  apps/main/src/components/tenantDashboard/tabs/services/components/CategorySelector.tsx**
   - Details: Dead code - not imported from entry point

202. **  apps/main/src/components/tenantDashboard/tabs/services/components/DeleteServiceModal.tsx**
   - Details: Dead code - not imported from entry point

203. **  apps/main/src/components/tenantDashboard/tabs/services/components/FeatureDropdown.tsx**
   - Details: Dead code - not imported from entry point

204. **  apps/main/src/components/tenantDashboard/tabs/services/components/FeatureList.tsx**
   - Details: Dead code - not imported from entry point

205. **  apps/main/src/components/tenantDashboard/tabs/services/components/MultiTierPricingModal.tsx**
   - Details: Dead code - not imported from entry point

206. **  apps/main/src/components/tenantDashboard/tabs/services/components/SelectedServiceDetailsDisplay.tsx**
   - Details: Dead code - not imported from entry point

207. **  apps/main/src/components/tenantDashboard/tabs/services/components/SelectedServiceDisplay.tsx**
   - Details: Dead code - not imported from entry point

208. **  apps/main/src/components/tenantDashboard/tabs/services/components/ServiceActionsHeader.tsx**
   - Details: Dead code - not imported from entry point

209. **  apps/main/src/components/tenantDashboard/tabs/services/components/ServiceSelector.tsx**
   - Details: Dead code - not imported from entry point

210. **  apps/main/src/components/tenantDashboard/tabs/services/components/ServiceTierCards.tsx**
   - Details: Dead code - not imported from entry point

211. **  apps/main/src/components/tenantDashboard/tabs/services/components/VehicleSelector.tsx**
   - Details: Dead code - not imported from entry point

212. **  apps/main/src/components/tenantDashboard/tabs/services/FixedServicesTab.tsx**
   - Details: Dead code - not imported from entry point

213. **  apps/main/src/components/tenantDashboard/tabs/services/hooks/useFixedServicesHandlers.ts**
   - Details: Dead code - not imported from entry point

214. **  apps/main/src/components/tenantDashboard/tabs/services/hooks/useServiceOperations.ts**
   - Details: Dead code - not imported from entry point

215. **  apps/main/src/components/tenantDashboard/tabs/services/hooks/useServicesData.ts**
   - Details: Dead code - not imported from entry point

216. **  apps/main/src/components/tenantDashboard/tabs/services/hooks/useServiceSelection.ts**
   - Details: Dead code - not imported from entry point

217. **  apps/main/src/components/tenantDashboard/tabs/services/hooks/useTenantId.ts**
   - Details: Dead code - not imported from entry point

218. **  apps/main/src/components/tenantDashboard/tabs/services/ServicesTab.tsx**
   - Details: Dead code - not imported from entry point

219. **  apps/main/src/components/tenantDashboard/tabs/services/SimpleFixedServicesTab.tsx**
   - Details: Dead code - not imported from entry point

220. **  apps/main/src/components/tenantDashboard/tabs/services/types/ServiceClasses.ts**
   - Details: Dead code - not imported from entry point

221. **  apps/main/src/components/tenantDashboard/tabs/services/types/ServiceFeature.ts**
   - Details: Dead code - not imported from entry point

222. **  apps/main/src/components/tenantDashboard/tabs/website/components/AddReviewForm.tsx**
   - Details: Dead code - not imported from entry point

223. **  apps/main/src/components/tenantDashboard/tabs/website/components/FAQItemAutoSaveField.tsx**
   - Details: Dead code - not imported from entry point

224. **  apps/main/src/components/tenantDashboard/tabs/website/components/FAQSection.tsx**
   - Details: Dead code - not imported from entry point

225. **  apps/main/src/components/tenantDashboard/tabs/website/components/GallerySection.tsx**
   - Details: Dead code - not imported from entry point

226. **  apps/main/src/components/tenantDashboard/tabs/website/components/HealthTab.tsx**
   - Details: Dead code - not imported from entry point

227. **  apps/main/src/components/tenantDashboard/tabs/website/components/HeroSection.tsx**
   - Details: Dead code - not imported from entry point

228. **  apps/main/src/components/tenantDashboard/tabs/website/components/RemoveReviewTab.tsx**
   - Details: Dead code - not imported from entry point

229. **  apps/main/src/components/tenantDashboard/tabs/website/components/ReviewsContent.tsx**
   - Details: Dead code - not imported from entry point

230. **  apps/main/src/components/tenantDashboard/tabs/website/components/ReviewsSection.tsx**
   - Details: Dead code - not imported from entry point

231. **  apps/main/src/components/tenantDashboard/tabs/website/components/ServicesSection.tsx**
   - Details: Dead code - not imported from entry point

232. **  apps/main/src/components/tenantDashboard/tabs/website/components/WebsiteAutoSaveField.tsx**
   - Details: Dead code - not imported from entry point

233. **  apps/main/src/components/tenantDashboard/tabs/website/contexts/WebsiteContentContext.tsx**
   - Details: Dead code - not imported from entry point

234. **  apps/main/src/components/tenantDashboard/tabs/website/hooks/useWebsiteContentData.ts**
   - Details: Dead code - not imported from entry point

235. **  apps/main/src/components/tenantDashboard/tabs/website/hooks/useWebsiteContentField.ts**
   - Details: Dead code - not imported from entry point

236. **  apps/main/src/components/tenantDashboard/tabs/website/WebsiteContentTab.tsx**
   - Details: Dead code - not imported from entry point

237. **  apps/main/src/components/tenantDashboard/tabs/website/WebsiteDomainTab.tsx**
   - Details: Dead code - not imported from entry point

238. **  apps/main/src/components/tenantDashboard/tabs/website/WebsiteHealthTab.tsx**
   - Details: Dead code - not imported from entry point

239. **  apps/main/src/components/tenantDashboard/tabs/website/WebsitePerformanceTab.tsx**
   - Details: Dead code - not imported from entry point

240. **  apps/main/src/components/tenantDashboard/tabs/website/WebsiteTab.tsx**
   - Details: Dead code - not imported from entry point

241. **  apps/main/src/components/tenantDashboard/utils/constants.ts**
   - Details: Dead code - not imported from entry point

242. **  apps/main/src/components/tenantDashboard/utils/tenantEvents.ts**
   - Details: Dead code - not imported from entry point

243. **  apps/main/src/MainApp.tsx**
   - Details: Dead code - not imported from entry point

244. **  apps/main/src/modes/MarketingSite.tsx**
   - Details: Dead code - not imported from entry point

245. **  apps/main/src/providers.tsx**
   - Details: Dead code - not imported from entry point

---

## Detailed Log

Apps: main

## Phase 1: File Discovery

✅ Found 1176 TypeScript/TSX files

## Phase 2: AST Parsing

✅ All files parsed successfully

## Phase 3: Graph Construction

✅ Built dependency graph with 1176 nodes

## Phase 4: App Analysis

✅ main: 161 reachable files
✅ main: No boundary violations
⚠️ **WARNING**: main: 244 unreachable app files
⚠️ **WARNING**:   apps/main/src/components/booking/api/booking.api.ts
⚠️ **WARNING**:   apps/main/src/components/booking/BookingApp.tsx
⚠️ **WARNING**:   apps/main/src/components/booking/components/BookingFlowController.tsx
⚠️ **WARNING**:   apps/main/src/components/booking/components/BookingForm.tsx
⚠️ **WARNING**:   apps/main/src/components/booking/components/BookingLayout.tsx
⚠️ **WARNING**:   apps/main/src/components/booking/components/BookingPage.tsx
⚠️ **WARNING**:   apps/main/src/components/booking/components/BookingSteps.tsx
⚠️ **WARNING**:   apps/main/src/components/booking/components/payment/PaymentOption.tsx
⚠️ **WARNING**:   apps/main/src/components/booking/components/shared/DetailsModal.tsx
⚠️ **WARNING**:   apps/main/src/components/booking/components/shared/Footer.tsx
⚠️ **WARNING**:   apps/main/src/components/booking/components/shared/HeroBackground.tsx
⚠️ **WARNING**:   apps/main/src/components/booking/components/steps/StepAddons/AddonDetailsModal.tsx
⚠️ **WARNING**:   apps/main/src/components/booking/components/steps/StepAddons/Addons.tsx
⚠️ **WARNING**:   apps/main/src/components/booking/components/steps/StepAddons/Header.tsx
⚠️ **WARNING**:   apps/main/src/components/booking/components/steps/StepAddons/StepAddons.tsx
⚠️ **WARNING**:   apps/main/src/components/booking/components/steps/StepAddons/Tabs.tsx
⚠️ **WARNING**:   apps/main/src/components/booking/components/steps/StepLocation/StepLocation.tsx
⚠️ **WARNING**:   apps/main/src/components/booking/components/steps/StepPayment/components/PaymentSummary.tsx
⚠️ **WARNING**:   apps/main/src/components/booking/components/steps/StepPayment/components/PaymentTabs.tsx
⚠️ **WARNING**:   apps/main/src/components/booking/components/steps/StepPayment/components/SummarySection.tsx
⚠️ **WARNING**:   apps/main/src/components/booking/components/steps/StepPayment/components/VehicleSection.tsx
⚠️ **WARNING**:   apps/main/src/components/booking/components/steps/StepPayment/StepPayment.tsx
⚠️ **WARNING**:   apps/main/src/components/booking/components/steps/StepSchedule/StepSchedule.tsx
⚠️ **WARNING**:   apps/main/src/components/booking/components/steps/StepService/Header.tsx
⚠️ **WARNING**:   apps/main/src/components/booking/components/steps/StepService/ServiceCard.tsx
⚠️ **WARNING**:   apps/main/src/components/booking/components/steps/StepService/ServiceCarousel.tsx
⚠️ **WARNING**:   apps/main/src/components/booking/components/steps/StepService/ServiceDetailsModal.tsx
⚠️ **WARNING**:   apps/main/src/components/booking/components/steps/StepService/StepService.tsx
⚠️ **WARNING**:   apps/main/src/components/booking/components/steps/StepVehicleSelection/Header.tsx
⚠️ **WARNING**:   apps/main/src/components/booking/components/steps/StepVehicleSelection/StepVehicleSelection.tsx
⚠️ **WARNING**:   apps/main/src/components/booking/components/steps/StepVehicleSelection/Tabs.tsx
⚠️ **WARNING**:   apps/main/src/components/booking/components/steps/StepVehicleSelection/VehicleType.tsx
⚠️ **WARNING**:   apps/main/src/components/booking/constants/hero.ts
⚠️ **WARNING**:   apps/main/src/components/booking/hooks/useAddons.ts
⚠️ **WARNING**:   apps/main/src/components/booking/hooks/useBookingAsync.ts
⚠️ **WARNING**:   apps/main/src/components/booking/hooks/useBookingGallery.ts
⚠️ **WARNING**:   apps/main/src/components/booking/hooks/useFeaturesData.ts
⚠️ **WARNING**:   apps/main/src/components/booking/hooks/usePaymentData.ts
⚠️ **WARNING**:   apps/main/src/components/booking/hooks/usePaymentForm.ts
⚠️ **WARNING**:   apps/main/src/components/booking/hooks/usePaymentMethods.ts
⚠️ **WARNING**:   apps/main/src/components/booking/hooks/useScheduleOptions.ts
⚠️ **WARNING**:   apps/main/src/components/booking/hooks/useServiceTiers.ts
⚠️ **WARNING**:   apps/main/src/components/booking/hooks/useVehicleData.ts
⚠️ **WARNING**:   apps/main/src/components/booking/state/bookingStore.ts
⚠️ **WARNING**:   apps/main/src/components/booking/state/types.ts
⚠️ **WARNING**:   apps/main/src/components/booking/utils/displayUtils.ts
⚠️ **WARNING**:   apps/main/src/components/cta/components/MobileCTAButtons.tsx
⚠️ **WARNING**:   apps/main/src/components/cta/components/SmartCTAButtons.tsx
⚠️ **WARNING**:   apps/main/src/components/cta/hooks/useBookingCapabilities.ts
⚠️ **WARNING**:   apps/main/src/components/customers/classes/Customer.ts
⚠️ **WARNING**:   apps/main/src/components/faq/components/FAQ.tsx
⚠️ **WARNING**:   apps/main/src/components/faq/components/FAQCategoryFilter.tsx
⚠️ **WARNING**:   apps/main/src/components/faq/components/FAQEmptyState.tsx
⚠️ **WARNING**:   apps/main/src/components/faq/components/FAQItem.tsx
⚠️ **WARNING**:   apps/main/src/components/faq/components/FAQList.tsx
⚠️ **WARNING**:   apps/main/src/components/faq/components/FAQSearchBar.tsx
⚠️ **WARNING**:   apps/main/src/components/faq/components/ServiceAreasLink.tsx
⚠️ **WARNING**:   apps/main/src/components/faq/hooks/useFAQContent.ts
⚠️ **WARNING**:   apps/main/src/components/faq/hooks/useFAQData.ts
⚠️ **WARNING**:   apps/main/src/components/faq/hooks/useRotatingBackground.ts
⚠️ **WARNING**:   apps/main/src/components/footer/components/ContactColumn.tsx
⚠️ **WARNING**:   apps/main/src/components/footer/components/Disclaimer.tsx
⚠️ **WARNING**:   apps/main/src/components/footer/components/FollowUs.tsx
⚠️ **WARNING**:   apps/main/src/components/footer/components/Footer.tsx
⚠️ **WARNING**:   apps/main/src/components/footer/components/FooterBottom.tsx
⚠️ **WARNING**:   apps/main/src/components/footer/components/GetInTouch.tsx
⚠️ **WARNING**:   apps/main/src/components/footer/components/ServiceAreas.tsx
⚠️ **WARNING**:   apps/main/src/components/footer/components/ServiceAreasColumn.tsx
⚠️ **WARNING**:   apps/main/src/components/footer/components/SocialMediaColumn.tsx
⚠️ **WARNING**:   apps/main/src/components/gallery/api/gallery.api.ts
⚠️ **WARNING**:   apps/main/src/components/gallery/components/Gallery.tsx
⚠️ **WARNING**:   apps/main/src/components/gallery/components/GalleryItem.tsx
⚠️ **WARNING**:   apps/main/src/components/gallery/components/RotatingGalleryItem.tsx
⚠️ **WARNING**:   apps/main/src/components/gallery/hooks/useGallery.ts
⚠️ **WARNING**:   apps/main/src/components/gallery/hooks/useRotatingGallery.ts
⚠️ **WARNING**:   apps/main/src/components/hero/components/ContentContainer.tsx
⚠️ **WARNING**:   apps/main/src/components/hero/components/CTA.tsx
⚠️ **WARNING**:   apps/main/src/components/hero/components/Hero.tsx
⚠️ **WARNING**:   apps/main/src/components/hero/components/ImageCarousel.tsx
⚠️ **WARNING**:   apps/main/src/components/hero/components/SmartHero.tsx
⚠️ **WARNING**:   apps/main/src/components/hero/components/TextDisplay.tsx
⚠️ **WARNING**:   apps/main/src/components/hero/hooks/useHeroContent.ts
⚠️ **WARNING**:   apps/main/src/components/locations/api/locations.api.ts
⚠️ **WARNING**:   apps/main/src/components/locations/components/LocationSelector.tsx
⚠️ **WARNING**:   apps/main/src/components/locations/hooks/useLocationPageState.ts
⚠️ **WARNING**:   apps/main/src/components/locations/LocationPage.tsx
⚠️ **WARNING**:   apps/main/src/components/locations/utils/googleMaps.helpers.ts
⚠️ **WARNING**:   apps/main/src/components/locations/utils/googlePlace.ts
⚠️ **WARNING**:   apps/main/src/components/locations/utils/placesLoader.ts
⚠️ **WARNING**:   apps/main/src/components/PreviewPage.tsx
⚠️ **WARNING**:   apps/main/src/components/quotes/api/quotes.api.ts
⚠️ **WARNING**:   apps/main/src/components/quotes/components/ContactSection.tsx
⚠️ **WARNING**:   apps/main/src/components/quotes/components/LazyRequestQuoteModal.tsx
⚠️ **WARNING**:   apps/main/src/components/quotes/components/QuoteForm.tsx
⚠️ **WARNING**:   apps/main/src/components/quotes/components/RequestQuoteModal.tsx
⚠️ **WARNING**:   apps/main/src/components/quotes/components/ServicesSection.tsx
⚠️ **WARNING**:   apps/main/src/components/quotes/components/SuccessMessage.tsx
⚠️ **WARNING**:   apps/main/src/components/quotes/components/VehicleSection.tsx
⚠️ **WARNING**:   apps/main/src/components/quotes/hooks/useQuoteForm.ts
⚠️ **WARNING**:   apps/main/src/components/quotes/hooks/useQuoteFormLogic.ts
⚠️ **WARNING**:   apps/main/src/components/quotes/hooks/useQuoteFormState.ts
⚠️ **WARNING**:   apps/main/src/components/quotes/hooks/useQuoteModal.ts
⚠️ **WARNING**:   apps/main/src/components/quotes/hooks/useQuoteSubmission.ts
⚠️ **WARNING**:   apps/main/src/components/quotes/hooks/useQuoteTenantData.ts
⚠️ **WARNING**:   apps/main/src/components/quotes/hooks/useQuoteValidation.ts
⚠️ **WARNING**:   apps/main/src/components/quotes/hooks/useQuoteVehicleData.ts
⚠️ **WARNING**:   apps/main/src/components/reviews/api/reviewsApi.ts
⚠️ **WARNING**:   apps/main/src/components/reviews/components/GoogleReviewsTest.tsx
⚠️ **WARNING**:   apps/main/src/components/reviews/components/ReviewCard.tsx
⚠️ **WARNING**:   apps/main/src/components/reviews/components/ReviewModal.tsx
⚠️ **WARNING**:   apps/main/src/components/reviews/components/Reviews.tsx
⚠️ **WARNING**:   apps/main/src/components/reviews/components/ReviewsCarousel.tsx
⚠️ **WARNING**:   apps/main/src/components/reviews/components/ReviewsHeader.tsx
⚠️ **WARNING**:   apps/main/src/components/reviews/hooks/useGoogleReviews.ts
⚠️ **WARNING**:   apps/main/src/components/reviews/hooks/useReviews.ts
⚠️ **WARNING**:   apps/main/src/components/reviews/hooks/useReviewsAvailability.ts
⚠️ **WARNING**:   apps/main/src/components/reviews/hooks/useReviewsContent.ts
⚠️ **WARNING**:   apps/main/src/components/reviews/hooks/useReviewsRating.ts
⚠️ **WARNING**:   apps/main/src/components/reviews/hooks/useRotatingReviews.ts
⚠️ **WARNING**:   apps/main/src/components/reviews/types/types.ts
⚠️ **WARNING**:   apps/main/src/components/reviews/utils/reviewUtils.ts
⚠️ **WARNING**:   apps/main/src/components/services/api/services.api.ts
⚠️ **WARNING**:   apps/main/src/components/services/components/BeforeAfterSlider.tsx
⚠️ **WARNING**:   apps/main/src/components/services/components/Process.tsx
⚠️ **WARNING**:   apps/main/src/components/services/components/ProtectionComparisonChart.tsx
⚠️ **WARNING**:   apps/main/src/components/services/components/Results.tsx
⚠️ **WARNING**:   apps/main/src/components/services/components/ServiceCard.tsx
⚠️ **WARNING**:   apps/main/src/components/services/components/ServiceCTA.tsx
⚠️ **WARNING**:   apps/main/src/components/services/components/ServiceHero.tsx
⚠️ **WARNING**:   apps/main/src/components/services/components/ServicesGrid.tsx
⚠️ **WARNING**:   apps/main/src/components/services/components/WhatItIs.tsx
⚠️ **WARNING**:   apps/main/src/components/services/hooks/useServicePage.ts
⚠️ **WARNING**:   apps/main/src/components/services/hooks/useServices.ts
⚠️ **WARNING**:   apps/main/src/components/services/types/service-data.ts
⚠️ **WARNING**:   apps/main/src/components/services/utils/protectionComparison.ts
⚠️ **WARNING**:   apps/main/src/components/tenantDashboard/api/analytics.ts
⚠️ **WARNING**:   apps/main/src/components/tenantDashboard/api/dashboard.api.ts
⚠️ **WARNING**:   apps/main/src/components/tenantDashboard/api/healthApi.ts
⚠️ **WARNING**:   apps/main/src/components/tenantDashboard/api/locationsApi.ts
⚠️ **WARNING**:   apps/main/src/components/tenantDashboard/api/reviewsApi.ts
⚠️ **WARNING**:   apps/main/src/components/tenantDashboard/api/websiteContentApi.ts
⚠️ **WARNING**:   apps/main/src/components/tenantDashboard/components/AddToHomeScreen.tsx
⚠️ **WARNING**:   apps/main/src/components/tenantDashboard/components/AutoSaveStatus.tsx
⚠️ **WARNING**:   apps/main/src/components/tenantDashboard/components/Dashboard.tsx
⚠️ **WARNING**:   apps/main/src/components/tenantDashboard/components/DashboardHeader.tsx
⚠️ **WARNING**:   apps/main/src/components/tenantDashboard/components/DashboardLayout.tsx
⚠️ **WARNING**:   apps/main/src/components/tenantDashboard/components/DashboardPage.tsx
⚠️ **WARNING**:   apps/main/src/components/tenantDashboard/components/DashboardTabs.tsx
⚠️ **WARNING**:   apps/main/src/components/tenantDashboard/components/TabContent.tsx
⚠️ **WARNING**:   apps/main/src/components/tenantDashboard/config/tabConfig.ts
⚠️ **WARNING**:   apps/main/src/components/tenantDashboard/hooks/useDashboardData.ts
⚠️ **WARNING**:   apps/main/src/components/tenantDashboard/hooks/useTenantBusinessData.ts
⚠️ **WARNING**:   apps/main/src/components/tenantDashboard/tabs/customers/CustomersTab.tsx
⚠️ **WARNING**:   apps/main/src/components/tenantDashboard/tabs/locations/components/AddLocationModal.tsx
⚠️ **WARNING**:   apps/main/src/components/tenantDashboard/tabs/locations/components/DeleteLocationModal.tsx
⚠️ **WARNING**:   apps/main/src/components/tenantDashboard/tabs/locations/components/LocationCard.tsx
⚠️ **WARNING**:   apps/main/src/components/tenantDashboard/tabs/locations/components/LocationSearch.tsx
⚠️ **WARNING**:   apps/main/src/components/tenantDashboard/tabs/locations/components/PrimaryServiceArea.tsx
⚠️ **WARNING**:   apps/main/src/components/tenantDashboard/tabs/locations/components/ServiceAreasList.tsx
⚠️ **WARNING**:   apps/main/src/components/tenantDashboard/tabs/locations/hooks/useGoogleMaps.ts
⚠️ **WARNING**:   apps/main/src/components/tenantDashboard/tabs/locations/hooks/useLocationSearch.ts
⚠️ **WARNING**:   apps/main/src/components/tenantDashboard/tabs/locations/hooks/useLocationState.ts
⚠️ **WARNING**:   apps/main/src/components/tenantDashboard/tabs/locations/LocationsTab.tsx
⚠️ **WARNING**:   apps/main/src/components/tenantDashboard/tabs/overview/components/MetricsCards.tsx
⚠️ **WARNING**:   apps/main/src/components/tenantDashboard/tabs/overview/components/NotificationPanel.tsx
⚠️ **WARNING**:   apps/main/src/components/tenantDashboard/tabs/overview/components/QuickActions.tsx
⚠️ **WARNING**:   apps/main/src/components/tenantDashboard/tabs/overview/components/RecentAppointments.tsx
⚠️ **WARNING**:   apps/main/src/components/tenantDashboard/tabs/overview/components/RecentReviews.tsx
⚠️ **WARNING**:   apps/main/src/components/tenantDashboard/tabs/overview/hooks/useDashboardStats.ts
⚠️ **WARNING**:   apps/main/src/components/tenantDashboard/tabs/overview/hooks/useNotifications.ts
⚠️ **WARNING**:   apps/main/src/components/tenantDashboard/tabs/overview/hooks/useRecentAppointments.ts
⚠️ **WARNING**:   apps/main/src/components/tenantDashboard/tabs/overview/hooks/useRecentReviews.ts
⚠️ **WARNING**:   apps/main/src/components/tenantDashboard/tabs/overview/OverviewTab.tsx
⚠️ **WARNING**:   apps/main/src/components/tenantDashboard/tabs/overview/utils/getStatusColor.ts
⚠️ **WARNING**:   apps/main/src/components/tenantDashboard/tabs/performance/PerformanceTab.tsx
⚠️ **WARNING**:   apps/main/src/components/tenantDashboard/tabs/profile/components/AutoSaveField.tsx
⚠️ **WARNING**:   apps/main/src/components/tenantDashboard/tabs/profile/components/ProfileForm.tsx
⚠️ **WARNING**:   apps/main/src/components/tenantDashboard/tabs/profile/components/SocialMediaUrlField.tsx
⚠️ **WARNING**:   apps/main/src/components/tenantDashboard/tabs/profile/hooks/useAutoSaveField.ts
⚠️ **WARNING**:   apps/main/src/components/tenantDashboard/tabs/profile/hooks/useProfileData.ts
⚠️ **WARNING**:   apps/main/src/components/tenantDashboard/tabs/profile/ProfileTab.tsx
⚠️ **WARNING**:   apps/main/src/components/tenantDashboard/tabs/schedule/api/appointments.ts
⚠️ **WARNING**:   apps/main/src/components/tenantDashboard/tabs/schedule/api/blockedDays.ts
⚠️ **WARNING**:   apps/main/src/components/tenantDashboard/tabs/schedule/api/scheduleSettings.ts
⚠️ **WARNING**:   apps/main/src/components/tenantDashboard/tabs/schedule/api/timeBlocks.ts
⚠️ **WARNING**:   apps/main/src/components/tenantDashboard/tabs/schedule/components/AppointmentCard.tsx
⚠️ **WARNING**:   apps/main/src/components/tenantDashboard/tabs/schedule/components/DayView.tsx
⚠️ **WARNING**:   apps/main/src/components/tenantDashboard/tabs/schedule/components/modals/AppointmentModal.tsx
⚠️ **WARNING**:   apps/main/src/components/tenantDashboard/tabs/schedule/components/MonthView.tsx
⚠️ **WARNING**:   apps/main/src/components/tenantDashboard/tabs/schedule/components/ScheduleGrid.tsx
⚠️ **WARNING**:   apps/main/src/components/tenantDashboard/tabs/schedule/components/ScheduleHeader.tsx
⚠️ **WARNING**:   apps/main/src/components/tenantDashboard/tabs/schedule/components/ScheduleLoadingState.tsx
⚠️ **WARNING**:   apps/main/src/components/tenantDashboard/tabs/schedule/components/ScheduleNavigationHeader.tsx
⚠️ **WARNING**:   apps/main/src/components/tenantDashboard/tabs/schedule/components/ScheduleSidebar.tsx
⚠️ **WARNING**:   apps/main/src/components/tenantDashboard/tabs/schedule/components/scheduleUtils.ts
⚠️ **WARNING**:   apps/main/src/components/tenantDashboard/tabs/schedule/components/WeekView.tsx
⚠️ **WARNING**:   apps/main/src/components/tenantDashboard/tabs/schedule/hooks/useScheduleData.ts
⚠️ **WARNING**:   apps/main/src/components/tenantDashboard/tabs/schedule/ScheduleTab.tsx
⚠️ **WARNING**:   apps/main/src/components/tenantDashboard/tabs/services/components/AddServiceModal.tsx
⚠️ **WARNING**:   apps/main/src/components/tenantDashboard/tabs/services/components/CategorySelector.tsx
⚠️ **WARNING**:   apps/main/src/components/tenantDashboard/tabs/services/components/DeleteServiceModal.tsx
⚠️ **WARNING**:   apps/main/src/components/tenantDashboard/tabs/services/components/FeatureDropdown.tsx
⚠️ **WARNING**:   apps/main/src/components/tenantDashboard/tabs/services/components/FeatureList.tsx
⚠️ **WARNING**:   apps/main/src/components/tenantDashboard/tabs/services/components/MultiTierPricingModal.tsx
⚠️ **WARNING**:   apps/main/src/components/tenantDashboard/tabs/services/components/SelectedServiceDetailsDisplay.tsx
⚠️ **WARNING**:   apps/main/src/components/tenantDashboard/tabs/services/components/SelectedServiceDisplay.tsx
⚠️ **WARNING**:   apps/main/src/components/tenantDashboard/tabs/services/components/ServiceActionsHeader.tsx
⚠️ **WARNING**:   apps/main/src/components/tenantDashboard/tabs/services/components/ServiceSelector.tsx
⚠️ **WARNING**:   apps/main/src/components/tenantDashboard/tabs/services/components/ServiceTierCards.tsx
⚠️ **WARNING**:   apps/main/src/components/tenantDashboard/tabs/services/components/VehicleSelector.tsx
⚠️ **WARNING**:   apps/main/src/components/tenantDashboard/tabs/services/FixedServicesTab.tsx
⚠️ **WARNING**:   apps/main/src/components/tenantDashboard/tabs/services/hooks/useFixedServicesHandlers.ts
⚠️ **WARNING**:   apps/main/src/components/tenantDashboard/tabs/services/hooks/useServiceOperations.ts
⚠️ **WARNING**:   apps/main/src/components/tenantDashboard/tabs/services/hooks/useServicesData.ts
⚠️ **WARNING**:   apps/main/src/components/tenantDashboard/tabs/services/hooks/useServiceSelection.ts
⚠️ **WARNING**:   apps/main/src/components/tenantDashboard/tabs/services/hooks/useTenantId.ts
⚠️ **WARNING**:   apps/main/src/components/tenantDashboard/tabs/services/ServicesTab.tsx
⚠️ **WARNING**:   apps/main/src/components/tenantDashboard/tabs/services/SimpleFixedServicesTab.tsx
⚠️ **WARNING**:   apps/main/src/components/tenantDashboard/tabs/services/types/ServiceClasses.ts
⚠️ **WARNING**:   apps/main/src/components/tenantDashboard/tabs/services/types/ServiceFeature.ts
⚠️ **WARNING**:   apps/main/src/components/tenantDashboard/tabs/website/components/AddReviewForm.tsx
⚠️ **WARNING**:   apps/main/src/components/tenantDashboard/tabs/website/components/FAQItemAutoSaveField.tsx
⚠️ **WARNING**:   apps/main/src/components/tenantDashboard/tabs/website/components/FAQSection.tsx
⚠️ **WARNING**:   apps/main/src/components/tenantDashboard/tabs/website/components/GallerySection.tsx
⚠️ **WARNING**:   apps/main/src/components/tenantDashboard/tabs/website/components/HealthTab.tsx
⚠️ **WARNING**:   apps/main/src/components/tenantDashboard/tabs/website/components/HeroSection.tsx
⚠️ **WARNING**:   apps/main/src/components/tenantDashboard/tabs/website/components/RemoveReviewTab.tsx
⚠️ **WARNING**:   apps/main/src/components/tenantDashboard/tabs/website/components/ReviewsContent.tsx
⚠️ **WARNING**:   apps/main/src/components/tenantDashboard/tabs/website/components/ReviewsSection.tsx
⚠️ **WARNING**:   apps/main/src/components/tenantDashboard/tabs/website/components/ServicesSection.tsx
⚠️ **WARNING**:   apps/main/src/components/tenantDashboard/tabs/website/components/WebsiteAutoSaveField.tsx
⚠️ **WARNING**:   apps/main/src/components/tenantDashboard/tabs/website/contexts/WebsiteContentContext.tsx
⚠️ **WARNING**:   apps/main/src/components/tenantDashboard/tabs/website/hooks/useWebsiteContentData.ts
⚠️ **WARNING**:   apps/main/src/components/tenantDashboard/tabs/website/hooks/useWebsiteContentField.ts
⚠️ **WARNING**:   apps/main/src/components/tenantDashboard/tabs/website/WebsiteContentTab.tsx
⚠️ **WARNING**:   apps/main/src/components/tenantDashboard/tabs/website/WebsiteDomainTab.tsx
⚠️ **WARNING**:   apps/main/src/components/tenantDashboard/tabs/website/WebsiteHealthTab.tsx
⚠️ **WARNING**:   apps/main/src/components/tenantDashboard/tabs/website/WebsitePerformanceTab.tsx
⚠️ **WARNING**:   apps/main/src/components/tenantDashboard/tabs/website/WebsiteTab.tsx
⚠️ **WARNING**:   apps/main/src/components/tenantDashboard/utils/constants.ts
⚠️ **WARNING**:   apps/main/src/components/tenantDashboard/utils/tenantEvents.ts
⚠️ **WARNING**:   apps/main/src/MainApp.tsx
⚠️ **WARNING**:   apps/main/src/modes/MarketingSite.tsx
⚠️ **WARNING**:   apps/main/src/providers.tsx
✅ main: Report saved to docs\audits\FLOW_FRONTEND_MAIN.md

## Phase 5: Report Generation


---

## Recommendations

1. Review boundary violations - they violate architectural rules
2. Investigate unreachable files - they may be dead code
3. Consider consolidating duplicate components across apps
4. Use this flow map for impact analysis before making changes
