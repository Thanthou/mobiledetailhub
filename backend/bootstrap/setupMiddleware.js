// backend/bootstrap/setupMiddleware.js
import { requestLogger } from '../middleware/requestLogger.js';
import { tenantResolver } from '../middleware/tenantResolver.js';
import { createSubdomainMiddleware, createAdminSubdomainMiddleware, addTenantContext } from '../middleware/subdomainMiddleware.js';
import { csrfProtection } from '../middleware/csrfProtection.js';

// Initialize subdomain middleware with same config as legacy server
const adminSubdomainMiddleware = createAdminSubdomainMiddleware();
const subdomainMiddleware = createSubdomainMiddleware({
  defaultTenant: null,
  redirectInvalid: false, // Disable redirect for development testing
  enableCaching: true,
  cacheTTL: 5 * 60 * 1000 // 5 minutes
});

export function setupMiddleware(app) {
  // Request logging (must be first to capture all requests)
  app.use(requestLogger);

  // 1️⃣ Admin subdomain middleware - handles admin.thatsmartsite.com (must come first)
  app.use(adminSubdomainMiddleware);

  // 2️⃣ Subdomain middleware - handles slug.thatsmartsite.com routing
  app.use(subdomainMiddleware);

  // 3️⃣ Legacy tenant resolver (for backward compatibility and fallback)
  app.use(tenantResolver);

  // 4️⃣ Add tenant context to responses
  app.use(addTenantContext);

  // CSRF protection
  app.use(csrfProtection);

  console.log('🪜 Core middleware chain ready');
  console.log('   ✓ Request logging');
  console.log('   ✓ Admin subdomain middleware');
  console.log('   ✓ Subdomain middleware (redirectInvalid: false)');
  console.log('   ✓ Legacy tenant resolver');
  console.log('   ✓ Tenant context');
  console.log('   ✓ CSRF protection');
}

