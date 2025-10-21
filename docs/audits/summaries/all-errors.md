# All Audits - Issues Summary

**Generated:** 2025-10-21T21:26:33.713Z
**Total Audits:** 14

---

## ❌ Errors

**Total Errors:** 4

### 1. Dependencies

**Error:** @babel/parser not installed

**Path:** `scripts\audits\audit-flows.js`

### 2. Dependencies

**Error:** @babel/traverse not installed

**Path:** `scripts\audits\audit-flows.js`

### 3. Performance

**Error:** Large bundle: react-vendor--vAscSmE.js (1122KB)

**Path:** `assets\react-vendor--vAscSmE.js`

### 4. Performance

**Error:** Large bundle: tenant-app-LfYPzNrW.js (807KB)

**Path:** `tenant-app-LfYPzNrW.js`

---

## ⚠️  Warnings

**Total Warnings:** 61

### 1. Schema Switching

**Warning:** Tenants schema can access website table: content

**Path:** `N/A`

### 2. Middleware

**Warning:** Missing middleware dependency: express-validator

**Path:** `backend/package.json`

### 3. Middleware

**Warning:** Missing middleware dependency: cookie-parser

**Path:** `backend/package.json`

### 4. Middleware

**Warning:** Error handler missing 4-parameter function

**Path:** `backend/middleware/errorHandler.js`

### 5. Middleware

**Warning:** Error handler missing JSON response

**Path:** `backend/middleware/errorHandler.js`

### 6. Middleware

**Warning:** Error handler should be positioned after routes

**Path:** `backend/server.js`

### 7. Middleware

**Warning:** Security middleware missing: helmet

**Path:** `backend/server.js`

### 8. Middleware

**Warning:** Security middleware missing: rateLimiter

**Path:** `backend/server.js`

### 9. Middleware

**Warning:** Security middleware missing: csrfProtection

**Path:** `backend/server.js`

### 10. API Contracts

**Warning:** Route file missing validation: config.js

**Path:** `N/A`

### 11. API Contracts

**Warning:** Route file missing validation: domains.js

**Path:** `N/A`

### 12. API Contracts

**Warning:** Route file missing validation: errorTracking.js

**Path:** `N/A`

### 13. API Contracts

**Warning:** Route file missing validation: gallery.js

**Path:** `N/A`

### 14. API Contracts

**Warning:** Route file missing validation: googleAnalytics.js

**Path:** `N/A`

### 15. API Contracts

**Warning:** Route file missing validation: googleAuth.js

**Path:** `N/A`

### 16. API Contracts

**Warning:** Route file missing validation: googleReviews.js

**Path:** `N/A`

### 17. API Contracts

**Warning:** Route file missing validation: health.js

**Path:** `N/A`

### 18. API Contracts

**Warning:** Route file missing validation: payments.js

**Path:** `N/A`

### 19. API Contracts

**Warning:** Route file missing validation: reviews.js

**Path:** `N/A`

### 20. API Contracts

**Warning:** Route file missing validation: seo.js

**Path:** `N/A`

### 21. API Contracts

**Warning:** Route file missing validation: services.js

**Path:** `N/A`

### 22. API Contracts

**Warning:** Route file missing validation: subdomainTest.js

**Path:** `N/A`

### 23. API Contracts

**Warning:** Route file missing validation: tenantImages.js

**Path:** `N/A`

### 24. API Contracts

**Warning:** Route file missing validation: tenantManifest.js

**Path:** `N/A`

### 25. API Contracts

**Warning:** Route file missing validation: websiteContent.js

**Path:** `N/A`

### 26. API Contracts

**Warning:** Controller missing validation: tenantDashboardController.js

**Path:** `N/A`

### 27. API Contracts

**Warning:** Route file missing validation middleware: config.js

**Path:** `N/A`

### 28. API Contracts

**Warning:** Route file missing validation middleware: domains.js

**Path:** `N/A`

### 29. API Contracts

**Warning:** Route file missing validation middleware: errorTracking.js

**Path:** `N/A`

### 30. API Contracts

**Warning:** Body parsing without validation in errorTracking.js

**Path:** `N/A`

### 31. API Contracts

**Warning:** Route file missing validation middleware: gallery.js

**Path:** `N/A`

### 32. API Contracts

**Warning:** Route file missing validation middleware: googleAnalytics.js

**Path:** `N/A`

### 33. API Contracts

**Warning:** Route file missing validation middleware: googleAuth.js

**Path:** `N/A`

### 34. API Contracts

**Warning:** Route file missing validation middleware: googleReviews.js

**Path:** `N/A`

### 35. API Contracts

**Warning:** Route file missing validation middleware: health.js

**Path:** `N/A`

### 36. API Contracts

**Warning:** Route file missing validation middleware: payments.js

**Path:** `N/A`

### 37. API Contracts

**Warning:** Body parsing without validation in payments.js

**Path:** `N/A`

### 38. API Contracts

**Warning:** Route file missing validation middleware: reviews.js

**Path:** `N/A`

### 39. API Contracts

**Warning:** Body parsing without validation in reviews.js

**Path:** `N/A`

### 40. API Contracts

**Warning:** Route file missing validation middleware: seo.js

**Path:** `N/A`

### 41. API Contracts

**Warning:** Route file missing validation middleware: services.js

**Path:** `N/A`

### 42. API Contracts

**Warning:** Body parsing without validation in services.js

**Path:** `N/A`

### 43. API Contracts

**Warning:** Route file missing validation middleware: subdomainTest.js

**Path:** `N/A`

### 44. API Contracts

**Warning:** Route file missing validation middleware: tenantImages.js

**Path:** `N/A`

### 45. API Contracts

**Warning:** Body parsing without validation in tenantImages.js

**Path:** `N/A`

### 46. API Contracts

**Warning:** Route file missing validation middleware: tenantManifest.js

**Path:** `N/A`

### 47. API Contracts

**Warning:** Route file missing validation middleware: websiteContent.js

**Path:** `N/A`

### 48. API Contracts

**Warning:** Body parsing without validation in websiteContent.js

**Path:** `N/A`

### 49. API Contracts

**Warning:** No API documentation found

**Path:** `docs/`

### 50. Assets

**Warning:** Apple touch icon not referenced in HTML: index.html

**Path:** `N/A`

### 51. Assets

**Warning:** Theme color meta tag missing: index.html

**Path:** `N/A`

### 52. Assets

**Warning:** Apple touch icon not referenced in HTML: index.html

**Path:** `N/A`

### 53. Assets

**Warning:** Apple touch icon not referenced in HTML: index.html

**Path:** `N/A`

### 54. Assets

**Warning:** Security headers not configured

**Path:** `backend/server.js`

### 55. Assets

**Warning:** No WebP images found - consider adding WebP support for better performance

**Path:** `N/A`

### 56. Assets

**Warning:** Vite build optimization not configured

**Path:** `frontend/vite.config.ts`

### 57. Backend Routes

**Warning:** admin.js: Inconsistent response format patterns

**Path:** `backend/routes/admin.js`

### 58. Backend Routes

**Warning:** avatar.js: Uses legacy pool import (should use getPool)

**Path:** `backend/routes/avatar.js`

### 59. Backend Routes

**Warning:** errorTracking.js: Inconsistent response format patterns

**Path:** `backend/routes/errorTracking.js`

### 60. Performance

**Warning:** Large component: schemaUtils.ts (549 lines)

**Path:** `shared\utils\schemaUtils.ts`

### 61. Project Overview

**Warning:** No audit reports found

**Path:** `N/A`

---

## 📊 Audit Results Summary

- 🟢 **Environment**: Pass (0 errors, 0 warnings)
- 🟢 **Security**: Pass (0 errors, 0 warnings)
- 🟢 **Database**: Pass (0 errors, 0 warnings)
- 🟡 **Schema Switching**: Pass (0 errors, 1 warnings)
- 🟢 **Import Boundaries**: Pass (0 errors, 0 warnings)
- 🟢 **Backend Flow Tracer**: Pass (0 errors, 0 warnings)
- 🟡 **Middleware**: Pass (0 errors, 8 warnings)
- 🟡 **API Contracts**: Pass (0 errors, 40 warnings)
- 🟡 **Assets**: Pass (0 errors, 7 warnings)
- 🟡 **Backend Routes**: Pass (0 errors, 3 warnings)
- 🟢 **Frontend Routing**: Pass (0 errors, 0 warnings)
- 🔴 **Dependencies**: Fail (2 errors, 0 warnings)
- 🔴 **Performance**: Fail (2 errors, 1 warnings)
- 🟡 **Project Overview**: Pass (0 errors, 1 warnings)

---

_Generated by `npm run audit:all` at 2025-10-21T21:26:33.713Z_