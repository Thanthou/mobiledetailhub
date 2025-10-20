# Subdomain Routing & Tenant Resolution

## Overview

That Smart Site uses a multi-tenant architecture where each tenant gets their own subdomain. The backend handles routing and tenant resolution through a well-defined middleware chain.

## Middleware Chain Order

The middleware executes in this **strict order** (top to bottom):

```
1. CORS                        → Handle cross-origin requests
2. Request Logger             → Log all requests with correlation IDs
3. Admin Subdomain Middleware → Handle admin.thatsmartsite.com
4. Subdomain Middleware        → Handle {slug}.thatsmartsite.com
5. Tenant Resolver             → Legacy fallback & validation
6. Add Tenant Context          → Attach tenant info to responses
7. Body Parsers                → JSON & URL-encoded
8. Routes                      → API endpoints
```

### Why This Order Matters

1. **CORS first**: Must execute before any request processing
2. **Logger second**: Captures all requests for debugging (adds `req.correlationId`)
3. **Admin before tenants**: Admin subdomain takes priority
4. **Subdomain before resolver**: Primary tenant detection
5. **Resolver as fallback**: Ensures `req.tenant` is always defined
6. **Context before routes**: Routes can access `req.tenant` safely

## Tenant Resolution Methods

The system resolves tenants in this **priority order**:

### 1. Custom Domain (Highest Priority)
```
customdomain.com → lookup in `tenants.business.website_domain`
```

### 2. Explicit Parameters (Dev/Testing)
```
?tenant=slug           → query parameter
X-Tenant-Slug: slug    → HTTP header
```

### 3. Subdomain
```
slug.thatsmartsite.com → extract "slug"
slug.localhost         → extract "slug" (dev)
```

### 4. Fallback
```
thatsmartsite.com      → main site (null tenant)
admin.thatsmartsite.com → admin site (null tenant)
```

## Environment-Specific Routing

### Development (localhost)
```
http://localhost:3001              → main site
http://admin.localhost:3001        → admin site
http://tenant.localhost:3001       → tenant="tenant" (literal)
http://jps.localhost:3001          → tenant="jps"
```

### Production
```
https://thatsmartsite.com          → main site
https://admin.thatsmartsite.com    → admin site
https://jps.thatsmartsite.com      → tenant="jps"
https://customdomain.com           → lookup custom domain
```

## Request Contract

After middleware chain completes, every `req` object has:

```javascript
{
  // Primary fields
  tenant: { id, slug, ...data } | null,
  tenantSlug: string | null,
  tenantId: number | null,
  
  // Site type flags
  isMainSite: boolean,
  isAdminSite: boolean,
  isTenantSite: boolean,
  
  // Resolution metadata
  tenantResolutionMethod: string,
  isCustomDomain: boolean,
  
  // Logging
  correlationId: string,
  logger: PinoLogger
}
```

## Preview Routes

Preview routes allow admins to view tenant sites before DNS changes:

```
/preview/:slug                     → serve tenant site
/api/tenants/:slug/preview-token   → generate preview link
```

### Preview Flow

1. Admin generates preview token for tenant
2. Token stored in DB with expiration
3. Preview route validates token
4. Serves tenant site with temporary context

## Edge Cases & Fallbacks

### Reserved Subdomains
These subdomains are **never** treated as tenants:
- `www`
- `admin`
- `api`
- `mail`
- `ftp`

### Error Handling

| Scenario | Behavior |
|----------|----------|
| Subdomain exists, tenant not found | `tenantSlug` set, `tenant` = null, route decides behavior |
| Custom domain not in DB | Falls back to subdomain parsing |
| Database unavailable | Extracts slug, `tenant` = null, app continues |
| Malformed hostname | Treats as main site |
| IP address direct access | Treats as main site |

### SPA Fallback (Frontend)

For unmatched routes, backend serves the appropriate SPA:

```javascript
// main.thatsmartsite.com/* → main-site/index.html
// admin.thatsmartsite.com/* → admin-app/index.html
// jps.thatsmartsite.com/* → tenant-app/index.html
```

## Testing

### Unit Tests
```bash
cd backend
npm test tests/tenantResolution.test.js
```

Tests cover:
- Subdomain extraction
- Custom domain lookup
- Explicit parameters
- Priority order
- Edge cases (IP, malformed, missing DB)

### Manual Testing
```bash
# Test main site
curl http://localhost:3001/api/subdomain

# Test tenant subdomain
curl http://jps.localhost:3001/api/subdomain

# Test admin subdomain
curl http://admin.localhost:3001/api/subdomain

# Test explicit param
curl http://localhost:3001/api/subdomain?tenant=jps

# Test custom header
curl -H "X-Tenant-Slug: jps" http://localhost:3001/api/subdomain
```

## Configuration

### Environment Variables
```env
BASE_DOMAIN=thatsmartsite.com
NODE_ENV=development|production
```

### Middleware Options
```javascript
createSubdomainMiddleware({
  defaultTenant: null,           // Default tenant slug
  redirectInvalid: false,        // Redirect invalid subdomains
  enableCaching: true,           // Cache tenant lookups
  cacheTTL: 300000               // Cache TTL (5 minutes)
})
```

## Database Schema

### Tenant Table
```sql
tenants.business (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(255) UNIQUE NOT NULL,
  business_name VARCHAR(255),
  website_domain VARCHAR(255),  -- Custom domain
  application_status VARCHAR(50)
)
```

### Custom Domain Lookup
```sql
SELECT * FROM tenants.business 
WHERE website_domain = $1 
  AND application_status = 'approved'
LIMIT 1
```

## Dev Hub Integration

The Dev Hub (port 8080) proxies by hostname:

```
localhost:8080           → http://localhost:5175 (main-site)
admin.localhost:8080     → http://localhost:5176 (admin-app)
tenant.localhost:8080    → http://localhost:5177 (tenant-app)
```

Backend must handle these `.localhost` hostnames in development.

## Migration Guide

### From Old System
```javascript
// Old (deprecated)
const { tenant } = req.subdomain;

// New (current)
const { tenant } = req;
```

### Adding New Resolution Method
1. Update `backend/utils/tenantResolution.js`
2. Add priority in `resolveTenant()`
3. Add tests in `tenantResolution.test.js`
4. Update this documentation

## Troubleshooting

### "Tenant not found"
- Check slug spelling
- Verify tenant exists in DB
- Check `application_status = 'approved'`

### "Wrong tenant resolved"
- Check resolution priority
- Verify custom domain DNS
- Check for explicit params overriding

### "Preview not working"
- Verify token not expired
- Check `previews` table
- Ensure preview route before SPA fallback

## Related Documentation
- [Backend Architecture](./ARCHITECTURE.md)
- [Multi-Tenant Database](./MULTI_TENANT_DATABASE.md)
- [Dev Hub Setup](../devtools/DEV_HUB_SETUP.md)

