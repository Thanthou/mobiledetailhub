# Subdomain Routing Documentation

## Overview

The subdomain middleware system enables multi-tenant routing using subdomains like `slug.thatsmartsite.com`. This allows each tenant to have their own branded subdomain while sharing the same codebase.

## Architecture

### Middleware Stack

1. **Subdomain Middleware** - Detects and resolves tenant slugs from subdomains
2. **Admin Subdomain Middleware** - Handles `admin.thatsmartsite.com` routing
3. **Tenant Resolver** - Legacy compatibility layer
4. **Tenant Context** - Adds tenant info to response locals

### Request Flow

```
Request: slug.thatsmartsite.com/dashboard
    ↓
Subdomain Middleware extracts "slug"
    ↓
Tenant Service looks up tenant by slug
    ↓
Request object gets tenant info attached
    ↓
Route handler processes with tenant context
```

## Supported Subdomains

### Main Site
- `thatsmartsite.com` - Main marketing site
- `www.thatsmartsite.com` - Redirects to main site

### Admin Site
- `admin.thatsmartsite.com` - Admin dashboard

### Tenant Sites
- `{slug}.thatsmartsite.com` - Tenant-specific sites
- Examples: `mobile-detailing.thatsmartsite.com`, `maid-service.thatsmartsite.com`

## Configuration

### Environment Variables

```bash
# Production
NODE_ENV=production
DOMAIN=thatsmartsite.com

# Development
NODE_ENV=development
DOMAIN=localhost
```

### Middleware Options

```javascript
createSubdomainMiddleware({
  defaultTenant: null,           // Default tenant for main site
  redirectInvalid: true,         // Redirect invalid subdomains to main
  enableCaching: true,           // Enable tenant lookup caching
  cacheTTL: 5 * 60 * 1000       // Cache TTL in milliseconds
})
```

## API Endpoints

### Subdomain Information
```
GET /api/subdomain/info
```
Returns current subdomain and tenant information.

### Subdomain Test
```
GET /api/subdomain/test
```
Test endpoint that responds differently based on subdomain type.

### Tenant Content
```
GET /api/subdomain/tenant-content/:slug
```
Retrieves website content for a specific tenant slug.

## Request Object Properties

After subdomain middleware processing, the request object contains:

```javascript
req.tenant          // Tenant object from database
req.tenantSlug      // Extracted slug (e.g., "mobile-detailing")
req.isMainSite      // Boolean - is main site
req.isTenantSite    // Boolean - is tenant site
req.isAdminSite     // Boolean - is admin site
```

## Response Locals

Template rendering context:

```javascript
res.locals.tenant = {
  id: tenant.id,
  slug: tenant.slug,
  businessName: tenant.business_name,
  industry: tenant.industry,
  isActive: tenant.is_active
}

res.locals.routing = {
  isMainSite: true/false,
  isTenantSite: true/false,
  isAdminSite: true/false,
  tenantSlug: "slug-or-null"
}
```

## Testing

### Local Testing

1. **Start the server:**
   ```bash
   npm run dev:backend
   ```

2. **Run subdomain tests:**
   ```bash
   npm run test:subdomain
   ```

3. **Test with hosts file:**
   Add to `/etc/hosts` (Mac/Linux) or `C:\Windows\System32\drivers\etc\hosts` (Windows):
   ```
   127.0.0.1 admin.localhost
   127.0.0.1 test-tenant.localhost
   ```

4. **Visit test URLs:**
   - `http://admin.localhost:3000/api/subdomain/test`
   - `http://test-tenant.localhost:3000/api/subdomain/test`
   - `http://localhost:3000/api/subdomain/test`

### Production Testing

```bash
# Test main site
curl -H "Host: thatsmartsite.com" https://your-domain.com/api/subdomain/test

# Test admin subdomain
curl -H "Host: admin.thatsmartsite.com" https://your-domain.com/api/subdomain/test

# Test tenant subdomain
curl -H "Host: mobile-detailing.thatsmartsite.com" https://your-domain.com/api/subdomain/test
```

## Error Handling

### Invalid Subdomains
- **Redirect Mode**: Redirects to main site with 301 status
- **404 Mode**: Returns 404 JSON response

### Database Errors
- Logs error and continues without tenant context
- Graceful degradation to main site behavior

### Caching
- In-memory cache for tenant lookups
- 5-minute TTL by default
- Cache invalidation on errors

## Security Considerations

### Reserved Subdomains
The following subdomains are reserved and not treated as tenant slugs:
- `www`
- `api`
- `admin`
- `main-site`
- `staging`
- `dev`

### Validation
- Tenant slugs must be 3-50 characters
- Only alphanumeric characters and hyphens allowed
- Case-insensitive matching

## Performance

### Caching Strategy
- Tenant lookups cached for 5 minutes
- Database queries minimized
- Graceful fallback on cache misses

### Database Optimization
- Indexed tenant slug lookups
- Efficient query patterns
- Connection pooling

## Monitoring

### Logging
All subdomain operations are logged with structured data:
- Subdomain extraction
- Tenant lookups
- Cache hits/misses
- Errors and exceptions

### Metrics
Track key metrics:
- Subdomain resolution time
- Cache hit rate
- Tenant lookup success rate
- Error rates by subdomain type

## Troubleshooting

### Common Issues

1. **Subdomain not resolving:**
   - Check hosts file configuration
   - Verify DNS settings
   - Check middleware order

2. **Tenant not found:**
   - Verify tenant exists in database
   - Check tenant is active
   - Verify slug format

3. **Caching issues:**
   - Clear cache by restarting server
   - Check cache TTL settings
   - Monitor cache hit rates

### Debug Mode

Enable debug logging:
```bash
LOG_LEVEL=debug npm run dev:backend
```

### Health Checks

Check subdomain middleware status:
```bash
curl http://localhost:3000/api/subdomain/info
```
