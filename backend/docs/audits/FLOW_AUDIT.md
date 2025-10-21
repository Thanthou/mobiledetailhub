# Backend Flow Tracer Audit Report

**Generated:** 2025-10-21T20:15:53.974Z
**Duration:** 378ms
**Score:** 0/100

---

## Summary

- ✅ **Passed:** 7
- ⚠️  **Warnings:** 49
- ❌ **Errors:** 0

## Description

Complete backend flow analysis: maps all HTTP request paths, builds call graph, identifies unreachable code.

## Issues Found

### 🟡 Warnings

1. **Parse error: routes\avatar.js**
   - Details: 'import' and 'export' may only appear at the top level. (171:6)

2. **Parse error: routes\seo.js**
   - Details: Missing semicolon. (23:15)

3. **2 files had parse errors**
   - Details: These files will be included but with incomplete analysis

4. **Unreachable files: 45**
   - Details: These files are not imported from any entry point

5. **  config\env.async.js**
   - Details: Has exports but not imported

6. **  middleware\unifiedErrorHandler.js**
   - Details: Has exports but not imported

7. **  middleware\upload.js**
   - Details: No exports, may be unused

8. **  middleware\validation.js**
   - Details: No exports, may be unused

9. **  routes\analytics.js**
   - Details: Has exports but not imported

10. **  routes\avatar.js**
   - Details: No exports, may be unused

11. **  routes\customers.js**
   - Details: Has exports but not imported

12. **  routes\errorTracking.js**
   - Details: Has exports but not imported

13. **  routes\gallery.js**
   - Details: Has exports but not imported

14. **  routes\schedule.js**
   - Details: No exports, may be unused

15. **  routes\seo\index.ts**
   - Details: No exports, may be unused

16. **  routes\seo\previewRoute.ts**
   - Details: Has exports but not imported

17. **  routes\seo\robotsRoute.ts**
   - Details: Has exports but not imported

18. **  routes\seo\seoConfigRoute.ts**
   - Details: Has exports but not imported

19. **  routes\seo\sitemapRoute.ts**
   - Details: Has exports but not imported

20. **  routes\seo.js**
   - Details: No exports, may be unused

21. **  routes\serviceAreas.js**
   - Details: Has exports but not imported

22. **  routes\services.js**
   - Details: No exports, may be unused

23. **  routes\stockImages.js**
   - Details: No exports, may be unused

24. **  routes\tenantImages.js**
   - Details: Has exports but not imported

25. **  routes\tenantManifest.js**
   - Details: Has exports but not imported

26. **  routes\tenantReviews.js**
   - Details: Has exports but not imported

27. **  routes\upload.js**
   - Details: Has exports but not imported

28. **  routes\__tests__\.eslintrc.js**
   - Details: No exports, may be unused

29. **  routes\__tests__\analytics.access.test.js**
   - Details: No exports, may be unused

30. **  routes\__tests__\seo.test.js**
   - Details: No exports, may be unused

31. **  services\cronService.js**
   - Details: No exports, may be unused

32. **  services\googleBusinessScraper.js**
   - Details: No exports, may be unused

33. **  services\stripeService.js**
   - Details: Has exports but not imported

34. **  services\tenantDeletionService.js**
   - Details: Has exports but not imported

35. **  services\tenantProvisionService.js**
   - Details: No exports, may be unused

36. **  services\unifiedErrorService.js**
   - Details: Has exports but not imported

37. **  tests\tenantResolution.test.js**
   - Details: No exports, may be unused

38. **  tests\test-affiliate-endpoint.js**
   - Details: No exports, may be unused

39. **  tests\test-affiliate-security.js**
   - Details: No exports, may be unused

40. **  utils\avatarUtils.js**
   - Details: No exports, may be unused

41. **  utils\databaseInit.js**
   - Details: No exports, may be unused

42. **  utils\db.js**
   - Details: No exports, may be unused

43. **  utils\dbHelper.js**
   - Details: No exports, may be unused

44. **  utils\envValidator.js**
   - Details: No exports, may be unused

45. **  utils\migrationTracker.js**
   - Details: No exports, may be unused

46. **  utils\serviceAreaProcessor.js**
   - Details: No exports, may be unused

47. **  utils\uploadValidator.js**
   - Details: No exports, may be unused

48. **  utils\validationSchemas.js**
   - Details: No exports, may be unused

49. **  utils\vehicleMapping.js**
   - Details: No exports, may be unused

---

## Detailed Log


## Phase 1: File Discovery

✅ Found 107 files to analyze

## Phase 2: AST Parsing

⚠️ **WARNING**: Parse error: routes\avatar.js
⚠️ **WARNING**: Parse error: routes\seo.js
⚠️ **WARNING**: 2 files had parse errors

## Phase 3: Call Graph Construction

✅ Built call graph with 107 nodes

## Phase 4: Reachability Analysis

✅ Reachability analysis complete

## File Discovery

✅ Discovered 107 backend files

## Entry Points

✅ Entry point: server.js

## HTTP Endpoints

✅ Discovered 247 HTTP endpoints

## Reachability Analysis

✅ Reachable files: 62/107 (57.9%)
⚠️ **WARNING**: Unreachable files: 45
⚠️ **WARNING**:   config\env.async.js
⚠️ **WARNING**:   middleware\unifiedErrorHandler.js
⚠️ **WARNING**:   middleware\upload.js
⚠️ **WARNING**:   middleware\validation.js
⚠️ **WARNING**:   routes\analytics.js
⚠️ **WARNING**:   routes\avatar.js
⚠️ **WARNING**:   routes\customers.js
⚠️ **WARNING**:   routes\errorTracking.js
⚠️ **WARNING**:   routes\gallery.js
⚠️ **WARNING**:   routes\schedule.js
⚠️ **WARNING**:   routes\seo\index.ts
⚠️ **WARNING**:   routes\seo\previewRoute.ts
⚠️ **WARNING**:   routes\seo\robotsRoute.ts
⚠️ **WARNING**:   routes\seo\seoConfigRoute.ts
⚠️ **WARNING**:   routes\seo\sitemapRoute.ts
⚠️ **WARNING**:   routes\seo.js
⚠️ **WARNING**:   routes\serviceAreas.js
⚠️ **WARNING**:   routes\services.js
⚠️ **WARNING**:   routes\stockImages.js
⚠️ **WARNING**:   routes\tenantImages.js
⚠️ **WARNING**:   routes\tenantManifest.js
⚠️ **WARNING**:   routes\tenantReviews.js
⚠️ **WARNING**:   routes\upload.js
⚠️ **WARNING**:   routes\__tests__\.eslintrc.js
⚠️ **WARNING**:   routes\__tests__\analytics.access.test.js
⚠️ **WARNING**:   routes\__tests__\seo.test.js
⚠️ **WARNING**:   services\cronService.js
⚠️ **WARNING**:   services\googleBusinessScraper.js
⚠️ **WARNING**:   services\stripeService.js
⚠️ **WARNING**:   services\tenantDeletionService.js
⚠️ **WARNING**:   services\tenantProvisionService.js
⚠️ **WARNING**:   services\unifiedErrorService.js
⚠️ **WARNING**:   tests\tenantResolution.test.js
⚠️ **WARNING**:   tests\test-affiliate-endpoint.js
⚠️ **WARNING**:   tests\test-affiliate-security.js
⚠️ **WARNING**:   utils\avatarUtils.js
⚠️ **WARNING**:   utils\databaseInit.js
⚠️ **WARNING**:   utils\db.js
⚠️ **WARNING**:   utils\dbHelper.js
⚠️ **WARNING**:   utils\envValidator.js
⚠️ **WARNING**:   utils\migrationTracker.js
⚠️ **WARNING**:   utils\serviceAreaProcessor.js
⚠️ **WARNING**:   utils\uploadValidator.js
⚠️ **WARNING**:   utils\validationSchemas.js
⚠️ **WARNING**:   utils\vehicleMapping.js

## Dependency Analysis


---

## Recommendations

1. ⚠️ PRIORITY: Investigate 45 unreachable files
2. Review unreachable files - they may be dead code that can be removed
3. Ensure all route handlers are properly connected to controllers/services
4. Consider refactoring files with high import counts (>10) to reduce coupling
5. Monitor files imported by many others - changes will have wide impact
6. Use this flow map for impact analysis before making changes
