# API Contracts Audit Report

**Generated:** 2025-10-25T07:24:36.698Z
**Duration:** 12ms
**Score:** 100/100

---

## Summary

- ✅ **Passed:** 195
- ⚠️  **Warnings:** 0
- ❌ **Errors:** 0

## Description

Validates consistent request/response shapes across API endpoints

## ✅ All Checks Passed!

No issues found during this audit.

---

## Detailed Log


## Route Files Analysis

Found 30 route files: admin.js, analytics.new.js, auth.js, avatar.js, config.js, customers.js, domains.js, errorTracking.js, gallery.js, googleAnalytics.js, googleAuth.js, googleReviews.js, health.js, healthMonitoring.js, locations.js, payments.js, performance.js, previews.js, reviews.js, schedule.js, seo.js, serviceAreas.js, services.js, subdomainTest.js, tenantDashboard.js, tenantImages.js, tenantManifest.js, tenantReviews.js, tenants.js, websiteContent.js
✅ Route file has validation: admin.js
Found 3 GET endpoints in admin.js
Found 3 POST endpoints in admin.js
Found 3 DELETE endpoints in admin.js
✅ Route file has validation: analytics.new.js
Found 3 GET endpoints in analytics.new.js
Found 1 POST endpoints in analytics.new.js
✅ Route file has validation: auth.js
Found 8 GET endpoints in auth.js
Found 10 POST endpoints in auth.js
✅ Route file has validation: avatar.js
Found 1 GET endpoints in avatar.js
Found 2 POST endpoints in avatar.js
Found 1 DELETE endpoints in avatar.js
✅ Route file is GET-only (no validation needed): config.js
Found 2 GET endpoints in config.js
✅ Route file is GET-only (no validation needed): customers.js
Found 2 GET endpoints in customers.js
✅ Route file has validation: domains.js
Found 3 GET endpoints in domains.js
Found 1 POST endpoints in domains.js
Found 1 PUT endpoints in domains.js
Found 1 DELETE endpoints in domains.js
✅ Route file has validation: errorTracking.js
Found 2 GET endpoints in errorTracking.js
Found 1 POST endpoints in errorTracking.js
✅ Route file is GET-only (no validation needed): gallery.js
Found 1 GET endpoints in gallery.js
✅ Route file is GET-only (no validation needed): googleAnalytics.js
Found 6 GET endpoints in googleAnalytics.js
✅ Route file is GET-only (no validation needed): googleAuth.js
Found 3 GET endpoints in googleAuth.js
✅ Route file is GET-only (no validation needed): googleReviews.js
Found 2 GET endpoints in googleReviews.js
✅ Route file is GET-only (no validation needed): health.js
Found 7 GET endpoints in health.js
✅ Route file has validation: healthMonitoring.js
Found 6 GET endpoints in healthMonitoring.js
Found 1 POST endpoints in healthMonitoring.js
✅ Route file has validation: locations.js
Found 1 GET endpoints in locations.js
Found 1 POST endpoints in locations.js
Found 1 PUT endpoints in locations.js
Found 1 DELETE endpoints in locations.js
✅ Route file has validation: payments.js
Found 2 POST endpoints in payments.js
✅ Route file has POST routes without body data (no validation needed): performance.js
Found 7 GET endpoints in performance.js
Found 1 POST endpoints in performance.js
✅ Route file has validation: previews.js
Found 1 GET endpoints in previews.js
Found 1 POST endpoints in previews.js
✅ Route file has validation: reviews.js
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
✅ Route file is GET-only (no validation needed): seo.js
Found 2 GET endpoints in seo.js
✅ Route file is GET-only (no validation needed): serviceAreas.js
Found 5 GET endpoints in serviceAreas.js
✅ Route file has validation: services.js
Found 1 GET endpoints in services.js
Found 1 POST endpoints in services.js
Found 1 PUT endpoints in services.js
Found 1 DELETE endpoints in services.js
✅ Route file is GET-only (no validation needed): subdomainTest.js
Found 3 GET endpoints in subdomainTest.js
✅ Route file is GET-only (no validation needed): tenantDashboard.js
Found 5 GET endpoints in tenantDashboard.js
✅ Route file has validation: tenantImages.js
Found 1 GET endpoints in tenantImages.js
Found 1 POST endpoints in tenantImages.js
✅ Route file is GET-only (no validation needed): tenantManifest.js
Found 1 GET endpoints in tenantManifest.js
✅ Route file has validation: tenantReviews.js
Found 3 GET endpoints in tenantReviews.js
Found 3 POST endpoints in tenantReviews.js
Found 1 DELETE endpoints in tenantReviews.js
✅ Route file has validation: tenants.js
Found 3 GET endpoints in tenants.js
Found 1 POST endpoints in tenants.js
Found 1 PUT endpoints in tenants.js
✅ Route file has validation: websiteContent.js
Found 2 GET endpoints in websiteContent.js
Found 1 PUT endpoints in websiteContent.js
Total endpoints across all routes: 152
Routes with validation: 17/30

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
✅ Controller has validation: tenantDashboardController.js
✅ Controller has proper exports: tenantDashboardController.js
Controllers with async/await: 6/6
Controllers with error handling: 6/6
Controllers with validation: 6/6

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
✅ Route file has validation middleware: analytics.new.js
✅ Body parsing with validation in analytics.new.js
✅ Route file has validation middleware: auth.js
✅ Body parsing with validation in auth.js
✅ Route file has validation middleware: avatar.js
✅ Body parsing with validation in avatar.js
✅ Route file is GET-only (no validation middleware needed): config.js
✅ Route file is GET-only (no validation middleware needed): customers.js
✅ Route file has validation middleware: domains.js
✅ Route file has validation middleware: errorTracking.js
✅ Body parsing with validation in errorTracking.js
✅ Route file is GET-only (no validation middleware needed): gallery.js
✅ Route file is GET-only (no validation middleware needed): googleAnalytics.js
✅ Route file is GET-only (no validation middleware needed): googleAuth.js
✅ Route file is GET-only (no validation middleware needed): googleReviews.js
✅ Route file is GET-only (no validation middleware needed): health.js
✅ Route file has validation middleware: healthMonitoring.js
✅ Route file has validation middleware: locations.js
✅ Body parsing with validation in locations.js
✅ Route file has validation middleware: payments.js
✅ Body parsing with validation in payments.js
✅ Route file has POST routes without body data (no validation needed): performance.js
✅ Route file has validation middleware: previews.js
✅ Body parsing with validation in previews.js
✅ Route file has validation middleware: reviews.js
✅ Body parsing with validation in reviews.js
✅ Route file has validation middleware: schedule.js
✅ Body parsing with validation in schedule.js
✅ Route file is GET-only (no validation middleware needed): seo.js
✅ Route file is GET-only (no validation middleware needed): serviceAreas.js
✅ Route file has validation middleware: services.js
✅ Body parsing with validation in services.js
✅ Route file is GET-only (no validation middleware needed): subdomainTest.js
✅ Route file is GET-only (no validation middleware needed): tenantDashboard.js
✅ Route file has validation middleware: tenantImages.js
✅ Body parsing with validation in tenantImages.js
✅ Route file is GET-only (no validation middleware needed): tenantManifest.js
✅ Route file has validation middleware: tenantReviews.js
✅ Body parsing with validation in tenantReviews.js
✅ Route file has validation middleware: tenants.js
✅ Route file has validation middleware: websiteContent.js
✅ Body parsing with validation in websiteContent.js
Routes with validation: 105/152

## API Documentation

✅ API documentation found: API.md
✅ API documentation found: api.md
✅ Route file has documentation: admin.js
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
✅ Route file has documentation: performance.js
✅ Route file has documentation: previews.js
✅ Route file has documentation: reviews.js
✅ Route file has documentation: schedule.js
✅ Route file has documentation: seo.js
✅ Route file has documentation: serviceAreas.js
✅ Route file has documentation: services.js
✅ Route file has documentation: subdomainTest.js
✅ Route file has documentation: tenantDashboard.js
✅ Route file has documentation: tenantImages.js
✅ Route file has documentation: tenantManifest.js
✅ Route file has documentation: tenantReviews.js
✅ Route file has documentation: tenants.js
✅ Route file has documentation: websiteContent.js
Route files with documentation: 30/30

## Summary

Total API contract checks: 195
Score: 100/100

---

## Recommendations

1. Ensure all responses use standard format: { success: true/false, data: ..., message: ... }
2. Add request validation middleware to all POST/PUT/PATCH endpoints
3. Document API contracts in docs/api.md or OpenAPI spec
4. Use consistent HTTP status codes (200, 201, 400, 401, 404, 500)
5. Add JSDoc comments to all controller functions
