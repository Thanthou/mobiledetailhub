# That Smart Site API Documentation

> **Version:** 1.0.0  
> **Base URL:** `https://api.thatsmartsite.com` (Production) | `http://localhost:3001` (Development)  
> **Last Updated:** October 25, 2025

---

## Table of Contents

- [Overview](#overview)
- [Authentication](#authentication)
- [Multi-Tenant Architecture](#multi-tenant-architecture)
- [API Endpoints](#api-endpoints)
  - [Health & Monitoring](#health--monitoring)
  - [Authentication & Authorization](#authentication--authorization)
  - [Tenant Management](#tenant-management)
  - [Content Management](#content-management)
  - [Analytics](#analytics)
  - [SEO](#seo)
  - [Payments](#payments)
  - [Media & Assets](#media--assets)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)

---

## Overview

The That Smart Site API is a RESTful API that powers a multi-tenant SaaS platform for local service businesses. The API serves three frontend applications:

1. **Main App** (`thatsmartsite.com`) - Marketing site
2. **Tenant App** (`{subdomain}.thatsmartsite.com`) - Tenant websites
3. **Admin App** (`admin.thatsmartsite.com`) - Management dashboard

### Architecture

- **Backend:** Node.js/Express with ESM modules
- **Database:** PostgreSQL with schema-based multi-tenancy
- **Authentication:** JWT-based with refresh tokens
- **Middleware:** Tenant resolution, rate limiting, CSRF protection

---

## Authentication

All authenticated endpoints require a valid JWT token in the Authorization header:

```http
Authorization: Bearer <your_jwt_token>
```

### Token Refresh

Tokens expire after a set period. Use the refresh token endpoint to obtain a new access token.

### Tenant Context

Most endpoints require a tenant context, which is automatically resolved via:
- Subdomain (`tenant1.thatsmartsite.com`)
- Custom domain (`www.clientbusiness.com`)
- Header (`X-Tenant-ID`)

---

## Multi-Tenant Architecture

The API uses PostgreSQL schemas for tenant isolation:

- **Public Schema:** Platform-level data (tenant registry, system config)
- **Tenant Schemas:** `tenant_{id}` - Each tenant's isolated data

Tenant resolution happens at the middleware level via `tenantResolver.js` and `withTenant.js`.

---

## API Endpoints

### Health & Monitoring

#### `GET /api/health`
Basic health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-10-25T12:00:00.000Z"
}
```

#### `GET /api/health/monitoring`
Detailed health monitoring with database connection status.

**Response:**
```json
{
  "status": "healthy",
  "database": "connected",
  "uptime": 123456,
  "memory": { "used": 123456789, "total": 987654321 }
}
```

---

### Authentication & Authorization

**Routes:** `/api/auth/*`

#### `POST /api/auth/register`
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "firstName": "John",
  "lastName": "Doe"
}
```

#### `POST /api/auth/login`
Authenticate and receive JWT tokens.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "role": "tenant_owner"
  }
}
```

#### `POST /api/auth/refresh`
Refresh an expired access token.

#### `POST /api/auth/logout`
Invalidate current session.

#### `POST /api/auth/password-reset`
Request password reset email.

#### `POST /api/auth/password-setup`
Complete password reset process.

---

### Tenant Management

**Routes:** `/api/tenants/*`

#### `GET /api/tenants`
List all tenants (admin only).

#### `GET /api/tenants/:id`
Get tenant details.

#### `POST /api/tenants`
Create a new tenant.

**Request Body:**
```json
{
  "businessName": "ABC Detailing",
  "subdomain": "abc-detailing",
  "industry": "auto-detailing",
  "ownerEmail": "owner@abc-detailing.com"
}
```

#### `PATCH /api/tenants/:id`
Update tenant settings.

#### `DELETE /api/tenants/:id`
Delete a tenant and all associated data.

#### `GET /api/tenants/:id/dashboard`
Get tenant dashboard data (analytics, recent activity).

---

### Content Management

#### Services

**Routes:** `/api/services/*`

- `GET /api/services` - List all services for a tenant
- `POST /api/services` - Create a new service
- `PATCH /api/services/:id` - Update service details
- `DELETE /api/services/:id` - Delete a service

#### Reviews

**Routes:** `/api/reviews/*`, `/api/tenant-reviews/*`

- `GET /api/reviews` - Get reviews for tenant
- `POST /api/reviews` - Create a review
- `GET /api/google-reviews` - Fetch Google My Business reviews

#### Gallery

**Routes:** `/api/gallery/*`

- `GET /api/gallery` - Get gallery images
- `POST /api/gallery` - Upload new images
- `DELETE /api/gallery/:id` - Remove image

#### Website Content

**Routes:** `/api/website-content/*`

- `GET /api/website-content` - Get tenant website content (hero, about, etc.)
- `PATCH /api/website-content` - Update website content

---

### Analytics

**Routes:** `/api/analytics/*`

#### `GET /api/analytics/overview`
Get analytics overview for tenant.

**Query Parameters:**
- `startDate` - ISO date string
- `endDate` - ISO date string

**Response:**
```json
{
  "pageViews": 1234,
  "uniqueVisitors": 567,
  "bookings": 89,
  "revenue": 12345.67
}
```

#### `GET /api/analytics/performance`
Get performance metrics.

#### `POST /api/analytics/track`
Track custom analytics event.

---

### SEO

**Routes:** `/api/seo/*`

#### `GET /api/seo/meta/:tenantId`
Get SEO metadata for tenant site.

#### `PATCH /api/seo/meta/:tenantId`
Update SEO metadata.

**Request Body:**
```json
{
  "title": "ABC Detailing - Premium Auto Detailing",
  "description": "Professional auto detailing services...",
  "keywords": ["auto detailing", "car wash", "paint correction"]
}
```

#### `GET /api/seo/sitemap/:tenantId`
Generate XML sitemap for tenant.

#### `GET /api/seo/robots/:tenantId`
Get robots.txt for tenant.

---

### Payments

**Routes:** `/api/payments/*`

#### `POST /api/payments/checkout`
Create payment session.

#### `POST /api/payments/webhook`
Handle payment provider webhooks.

#### `GET /api/payments/history`
Get payment history for tenant.

---

### Media & Assets

#### Tenant Images

**Routes:** `/api/tenant-images/*`

- `GET /api/tenant-images` - List tenant images
- `POST /api/tenant-images/upload` - Upload image
- `DELETE /api/tenant-images/:id` - Delete image

#### Avatars

**Routes:** `/api/avatar/*`

- `POST /api/avatar/upload` - Upload user avatar
- `GET /api/avatar/:userId` - Get user avatar

---

### Domains

**Routes:** `/api/domains/*`

#### `GET /api/domains/:tenantId`
Get custom domains for tenant.

#### `POST /api/domains/:tenantId`
Add custom domain.

**Request Body:**
```json
{
  "domain": "www.mycustomdomain.com",
  "isPrimary": true
}
```

#### `DELETE /api/domains/:tenantId/:domainId`
Remove custom domain.

---

### Additional Features

#### Schedule & Booking

**Routes:** `/api/schedule/*`

- Manage business hours
- Handle appointment booking
- Track availability

#### Service Areas

**Routes:** `/api/service-areas/*`

- Define geographic service areas
- Manage ZIP codes served

#### Locations

**Routes:** `/api/locations/*`

- Manage business locations
- Set primary location

#### Google Integrations

**Routes:** `/api/google-auth/*`, `/api/google-analytics/*`

- OAuth authentication with Google
- Sync Google My Business data
- Integrate Google Analytics

---

## Error Handling

All errors follow a consistent structure:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input provided",
    "details": {
      "field": "email",
      "issue": "Email format is invalid"
    }
  }
}
```

### HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (missing or invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `429` - Too Many Requests (rate limit exceeded)
- `500` - Internal Server Error

---

## Rate Limiting

API endpoints are rate-limited to prevent abuse:

- **Unauthenticated:** 100 requests per 15 minutes
- **Authenticated:** 1000 requests per 15 minutes
- **Admin:** 5000 requests per 15 minutes

Rate limit headers are included in responses:

```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1635177600
```

---

## Versioning

The API currently uses implicit versioning. Future versions will use URL-based versioning:

```
/api/v2/tenants
```

---

## Support

For API support:
- **Documentation:** See individual route files in `backend/routes/`
- **Issues:** Contact support@thatsmartsite.com
- **Updates:** Check `CHANGELOG.md` for API changes

---

## Related Documentation

- [Backend Architecture](backend/README.md)
- [Schema Documentation](backend/schemas/README.md)
- [Migration Guide](backend/migrations/README.md)
- [Security Practices](docs/audits/SECURITY_AUDIT.md)

