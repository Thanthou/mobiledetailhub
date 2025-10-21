# API Contracts Audit Report

**Generated:** 2025-10-21T12:30:05.230Z
**Duration:** 13ms
**Score:** 0/100

---

## Summary

- ✅ **Passed:** 157
- ⚠️  **Warnings:** 44
- ❌ **Errors:** 0

## Description

Validates consistent request/response shapes across API endpoints

## Issues Found

### 🟡 Warnings

1. **Route file missing validation: config.js**

2. **Route file missing validation: domains.js**

3. **Route file missing validation: errorTracking.js**

4. **Route file missing validation: gallery.js**

5. **Route file missing validation: googleAnalytics.js**

6. **Route file missing validation: googleAuth.js**

7. **Route file missing validation: googleReviews.js**

8. **Route file missing validation: health.js**

9. **Route file missing validation: payments.js**

10. **Route file missing validation: reviews.js**

11. **Route file missing validation: seo.js**

12. **Route file missing validation: services.js**

13. **Route file missing validation: stockImages.js**

14. **Route file missing validation: subdomainTest.js**

15. **Route file missing validation: tenantImages.js**

16. **Route file missing validation: tenantManifest.js**

17. **Route file missing validation: upload.js**

18. **Route file missing validation: websiteContent.js**

19. **Controller missing validation: tenantDashboardController.js**

20. **Route file missing validation middleware: config.js**

21. **Route file missing validation middleware: domains.js**

22. **Route file missing validation middleware: errorTracking.js**

23. **Body parsing without validation in errorTracking.js**

24. **Route file missing validation middleware: gallery.js**

25. **Route file missing validation middleware: googleAnalytics.js**

26. **Route file missing validation middleware: googleAuth.js**

27. **Route file missing validation middleware: googleReviews.js**

28. **Route file missing validation middleware: health.js**

29. **Route file missing validation middleware: payments.js**

30. **Body parsing without validation in payments.js**

31. **Route file missing validation middleware: reviews.js**

32. **Body parsing without validation in reviews.js**

33. **Route file missing validation middleware: seo.js**

34. **Route file missing validation middleware: services.js**

35. **Body parsing without validation in services.js**

36. **Route file missing validation middleware: stockImages.js**

37. **Route file missing validation middleware: subdomainTest.js**

38. **Route file missing validation middleware: tenantImages.js**

39. **Body parsing without validation in tenantImages.js**

40. **Route file missing validation middleware: tenantManifest.js**

41. **Route file missing validation middleware: upload.js**

42. **Route file missing validation middleware: websiteContent.js**

43. **Body parsing without validation in websiteContent.js**

44. **No API documentation found**
   - Path: `docs/`

---

## Detailed Log


## Route Files Analysis

Found 32 route files: admin.js, analytics.js, analytics.new.js, auth.js, avatar.js, config.js, customers.js, domains.js, errorTracking.js, gallery.js, googleAnalytics.js, googleAuth.js, googleReviews.js, health.js, healthMonitoring.js, locations.js, payments.js, previews.js, reviews.js, schedule.js, seo.js, serviceAreas.js, services.js, stockImages.js, subdomainTest.js, tenantDashboard.js, tenantImages.js, tenantManifest.js, tenantReviews.js, tenants.js, upload.js, websiteContent.js
✅ Route file has validation: admin.js
Found 3 GET endpoints in admin.js
Found 3 POST endpoints in admin.js
Found 3 DELETE endpoints in admin.js
✅ Route file has validation: analytics.js
Found 2 GET endpoints in analytics.js
Found 1 POST endpoints in analytics.js
✅ Route file has validation: analytics.new.js
Found 3 GET endpoints in analytics.new.js
Found 1 POST endpoints in analytics.new.js
✅ Route file has validation: auth.js
Found 7 GET endpoints in auth.js
Found 10 POST endpoints in auth.js
✅ Route file has validation: avatar.js
Found 1 GET endpoints in avatar.js
Found 2 POST endpoints in avatar.js
Found 1 DELETE endpoints in avatar.js
⚠️ **WARNING**: Route file missing validation: config.js
Found 2 GET endpoints in config.js
✅ Route file has validation: customers.js
Found 2 GET endpoints in customers.js
⚠️ **WARNING**: Route file missing validation: domains.js
Found 3 GET endpoints in domains.js
Found 1 POST endpoints in domains.js
Found 1 PUT endpoints in domains.js
Found 1 DELETE endpoints in domains.js
⚠️ **WARNING**: Route file missing validation: errorTracking.js
Found 2 GET endpoints in errorTracking.js
Found 1 POST endpoints in errorTracking.js
⚠️ **WARNING**: Route file missing validation: gallery.js
Found 1 GET endpoints in gallery.js
⚠️ **WARNING**: Route file missing validation: googleAnalytics.js
Found 6 GET endpoints in googleAnalytics.js
⚠️ **WARNING**: Route file missing validation: googleAuth.js
Found 3 GET endpoints in googleAuth.js
⚠️ **WARNING**: Route file missing validation: googleReviews.js
Found 2 GET endpoints in googleReviews.js
⚠️ **WARNING**: Route file missing validation: health.js
Found 5 GET endpoints in health.js
✅ Route file has validation: healthMonitoring.js
Found 6 GET endpoints in healthMonitoring.js
Found 1 POST endpoints in healthMonitoring.js
✅ Route file has validation: locations.js
Found 1 GET endpoints in locations.js
Found 1 POST endpoints in locations.js
Found 1 PUT endpoints in locations.js
Found 1 DELETE endpoints in locations.js
⚠️ **WARNING**: Route file missing validation: payments.js
Found 2 POST endpoints in payments.js
✅ Route file has validation: previews.js
Found 1 GET endpoints in previews.js
Found 1 POST endpoints in previews.js
⚠️ **WARNING**: Route file missing validation: reviews.js
Found 2 GET endpoints in reviews.js
Found 1 POST endpoints in reviews.js
Found 1 PUT endpoints in reviews.js
Found 1 DELETE endpoints in reviews.js
✅ Route file has validation: schedule.js
Found 8 GET endpoints in schedule.js
Found 5 POST endpoints in schedule.js
Found 3 PUT endpoints in schedule.js
Found 1 PATCH endpoints in schedule.js
Found 3 DELETE endpoints in schedule.js
⚠️ **WARNING**: Route file missing validation: seo.js
Found 2 GET endpoints in seo.js
✅ Route file has validation: serviceAreas.js
Found 5 GET endpoints in serviceAreas.js
⚠️ **WARNING**: Route file missing validation: services.js
Found 1 GET endpoints in services.js
Found 1 POST endpoints in services.js
Found 1 PUT endpoints in services.js
Found 1 DELETE endpoints in services.js
⚠️ **WARNING**: Route file missing validation: stockImages.js
Found 1 GET endpoints in stockImages.js
⚠️ **WARNING**: Route file missing validation: subdomainTest.js
Found 3 GET endpoints in subdomainTest.js
✅ Route file has validation: tenantDashboard.js
Found 5 GET endpoints in tenantDashboard.js
⚠️ **WARNING**: Route file missing validation: tenantImages.js
Found 1 GET endpoints in tenantImages.js
Found 1 POST endpoints in tenantImages.js
⚠️ **WARNING**: Route file missing validation: tenantManifest.js
Found 1 GET endpoints in tenantManifest.js
✅ Route file has validation: tenantReviews.js
Found 3 GET endpoints in tenantReviews.js
Found 3 POST endpoints in tenantReviews.js
Found 1 DELETE endpoints in tenantReviews.js
✅ Route file has validation: tenants.js
Found 3 GET endpoints in tenants.js
Found 1 POST endpoints in tenants.js
Found 1 PUT endpoints in tenants.js
⚠️ **WARNING**: Route file missing validation: upload.js
Found 1 GET endpoints in upload.js
Found 3 POST endpoints in upload.js
⚠️ **WARNING**: Route file missing validation: websiteContent.js
Found 2 GET endpoints in websiteContent.js
Found 1 PUT endpoints in websiteContent.js
Total endpoints across all routes: 149
Routes with validation: 14/32

## Controller Patterns

Found 6 controller files
✅ Controller uses async/await: authController.js
✅ Controller has error handling: authController.js
✅ Controller has validation: authController.js
✅ Controller has proper exports: authController.js
✅ Controller uses async/await: domainController.js
✅ Controller has error handling: domainController.js
✅ Controller has validation: domainController.js
✅ Controller has proper exports: domainController.js
✅ Controller uses async/await: passwordResetController.js
✅ Controller has error handling: passwordResetController.js
✅ Controller has validation: passwordResetController.js
✅ Controller has proper exports: passwordResetController.js
✅ Controller uses async/await: passwordSetupController.js
✅ Controller has error handling: passwordSetupController.js
✅ Controller has validation: passwordSetupController.js
✅ Controller has proper exports: passwordSetupController.js
✅ Controller uses async/await: tenantController.js
✅ Controller has error handling: tenantController.js
✅ Controller has validation: tenantController.js
✅ Controller has proper exports: tenantController.js
✅ Controller uses async/await: tenantDashboardController.js
✅ Controller has error handling: tenantDashboardController.js
⚠️ **WARNING**: Controller missing validation: tenantDashboardController.js
✅ Controller has proper exports: tenantDashboardController.js
Controllers with async/await: 6/6
Controllers with error handling: 6/6
Controllers with validation: 5/6

## Response Consistency

✅ Success responses should have { success: true } found in authController.js
✅ Responses should include message field found in authController.js
✅ Success responses should include data field found in authController.js
✅ Success status code 201 found in authController.js
✅ Success responses should have { success: true } found in domainController.js
✅ Responses should include message field found in domainController.js
✅ Success responses should include data field found in domainController.js
✅ Client error status code 400 found in domainController.js
✅ Client error status code 404 found in domainController.js
✅ Server error status code 500 found in domainController.js
✅ Client error status code 400 found in domainController.js
✅ Server error status code 500 found in domainController.js
✅ Server error status code 500 found in domainController.js
✅ Client error status code 404 found in domainController.js
✅ Server error status code 500 found in domainController.js
✅ Server error status code 500 found in domainController.js
✅ Client error status code 400 found in domainController.js
✅ Server error status code 500 found in domainController.js
✅ Success responses should have { success: true } found in passwordResetController.js
✅ Responses should include message field found in passwordResetController.js
✅ Success responses should include data field found in passwordResetController.js
✅ Server error status code 500 found in passwordResetController.js
✅ Client error status code 400 found in passwordResetController.js
✅ Server error status code 500 found in passwordResetController.js
✅ Client error status code 400 found in passwordResetController.js
✅ Client error status code 400 found in passwordResetController.js
✅ Server error status code 500 found in passwordResetController.js
✅ Client error status code 403 found in passwordResetController.js
✅ Server error status code 500 found in passwordResetController.js
✅ Success responses should have { success: true } found in passwordSetupController.js
✅ Responses should include message field found in passwordSetupController.js
✅ Success responses should include data field found in passwordSetupController.js
✅ Client error status code 400 found in passwordSetupController.js
✅ Client error status code 400 found in passwordSetupController.js
✅ Client error status code 404 found in passwordSetupController.js
✅ Server error status code 500 found in passwordSetupController.js
✅ Client error status code 400 found in passwordSetupController.js
✅ Client error status code 400 found in passwordSetupController.js
✅ Client error status code 400 found in passwordSetupController.js
✅ Server error status code 500 found in passwordSetupController.js
✅ Client error status code 400 found in passwordSetupController.js
✅ Client error status code 400 found in passwordSetupController.js
✅ Server error status code 500 found in passwordSetupController.js
✅ Client error status code 403 found in passwordSetupController.js
✅ Server error status code 500 found in passwordSetupController.js
✅ Success responses should have { success: true } found in tenantController.js
✅ Responses should include message field found in tenantController.js
✅ Success responses should include data field found in tenantController.js
✅ Success status code 201 found in tenantController.js
✅ Client error status code 404 found in tenantController.js
✅ Client error status code 404 found in tenantController.js
✅ Client error status code 400 found in tenantController.js
✅ Server error status code 500 found in tenantController.js
✅ Client error status code 400 found in tenantDashboardController.js
✅ Client error status code 400 found in tenantDashboardController.js
✅ Client error status code 400 found in tenantDashboardController.js
✅ Client error status code 400 found in tenantDashboardController.js
✅ Client error status code 400 found in tenantDashboardController.js
✅ Client error status code 400 found in tenantDashboardController.js
Consistent response patterns: 15/33

## Error Handling

✅ Proper error handling in authController.js
✅ Proper error handling in domainController.js
✅ Proper error handling in passwordResetController.js
✅ Proper error handling in passwordSetupController.js
✅ Proper error handling in tenantController.js
✅ Proper error handling in tenantDashboardController.js
Controllers with proper error handling: 6/6

## Request Validation

✅ Route file has validation middleware: admin.js
✅ Body parsing with validation in admin.js
✅ Route file has validation middleware: analytics.js
✅ Body parsing with validation in analytics.js
✅ Route file has validation middleware: analytics.new.js
✅ Body parsing with validation in analytics.new.js
✅ Route file has validation middleware: auth.js
✅ Body parsing with validation in auth.js
✅ Route file has validation middleware: avatar.js
✅ Body parsing with validation in avatar.js
⚠️ **WARNING**: Route file missing validation middleware: config.js
✅ Route file has validation middleware: customers.js
⚠️ **WARNING**: Route file missing validation middleware: domains.js
⚠️ **WARNING**: Route file missing validation middleware: errorTracking.js
⚠️ **WARNING**: Body parsing without validation in errorTracking.js
⚠️ **WARNING**: Route file missing validation middleware: gallery.js
⚠️ **WARNING**: Route file missing validation middleware: googleAnalytics.js
⚠️ **WARNING**: Route file missing validation middleware: googleAuth.js
⚠️ **WARNING**: Route file missing validation middleware: googleReviews.js
⚠️ **WARNING**: Route file missing validation middleware: health.js
✅ Route file has validation middleware: healthMonitoring.js
✅ Route file has validation middleware: locations.js
✅ Body parsing with validation in locations.js
⚠️ **WARNING**: Route file missing validation middleware: payments.js
⚠️ **WARNING**: Body parsing without validation in payments.js
✅ Route file has validation middleware: previews.js
✅ Body parsing with validation in previews.js
⚠️ **WARNING**: Route file missing validation middleware: reviews.js
⚠️ **WARNING**: Body parsing without validation in reviews.js
✅ Route file has validation middleware: schedule.js
✅ Body parsing with validation in schedule.js
⚠️ **WARNING**: Route file missing validation middleware: seo.js
✅ Route file has validation middleware: serviceAreas.js
⚠️ **WARNING**: Route file missing validation middleware: services.js
⚠️ **WARNING**: Body parsing without validation in services.js
⚠️ **WARNING**: Route file missing validation middleware: stockImages.js
⚠️ **WARNING**: Route file missing validation middleware: subdomainTest.js
✅ Route file has validation middleware: tenantDashboard.js
⚠️ **WARNING**: Route file missing validation middleware: tenantImages.js
⚠️ **WARNING**: Body parsing without validation in tenantImages.js
⚠️ **WARNING**: Route file missing validation middleware: tenantManifest.js
✅ Route file has validation middleware: tenantReviews.js
✅ Body parsing with validation in tenantReviews.js
✅ Route file has validation middleware: tenants.js
⚠️ **WARNING**: Route file missing validation middleware: upload.js
⚠️ **WARNING**: Route file missing validation middleware: websiteContent.js
⚠️ **WARNING**: Body parsing without validation in websiteContent.js
Routes with validation: 94/149

## API Documentation

⚠️ **WARNING**: No API documentation found
   - Path: `docs/`
✅ Route file has documentation: admin.js
✅ Route file has documentation: analytics.js
✅ Route file has documentation: analytics.new.js
✅ Route file has documentation: auth.js
✅ Route file has documentation: avatar.js
✅ Route file has documentation: config.js
✅ Route file has documentation: customers.js
✅ Route file has documentation: domains.js
✅ Route file has documentation: errorTracking.js
✅ Route file has documentation: gallery.js
✅ Route file has documentation: googleAnalytics.js
✅ Route file has documentation: googleAuth.js
✅ Route file has documentation: googleReviews.js
✅ Route file has documentation: health.js
✅ Route file has documentation: healthMonitoring.js
✅ Route file has documentation: locations.js
✅ Route file has documentation: payments.js
✅ Route file has documentation: previews.js
✅ Route file has documentation: reviews.js
✅ Route file has documentation: schedule.js
✅ Route file has documentation: seo.js
✅ Route file has documentation: serviceAreas.js
✅ Route file has documentation: services.js
✅ Route file has documentation: stockImages.js
✅ Route file has documentation: subdomainTest.js
✅ Route file has documentation: tenantDashboard.js
✅ Route file has documentation: tenantImages.js
✅ Route file has documentation: tenantManifest.js
✅ Route file has documentation: tenantReviews.js
✅ Route file has documentation: tenants.js
✅ Route file has documentation: upload.js
✅ Route file has documentation: websiteContent.js
Route files with documentation: 32/32

## Summary

Total API contract checks: 201
Score: 78/100

---

## Recommendations

1. Ensure all responses use standard format: { success: true/false, data: ..., message: ... }
2. Add request validation middleware to all POST/PUT/PATCH endpoints
3. Document API contracts in docs/api.md or OpenAPI spec
4. Use consistent HTTP status codes (200, 201, 400, 401, 404, 500)
5. Add JSDoc comments to all controller functions
