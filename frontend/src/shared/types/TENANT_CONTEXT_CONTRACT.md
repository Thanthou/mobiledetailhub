# Tenant Context Contract

This document defines the shared contract between frontend and backend for tenant context management. This contract ensures consistency across all layers and eliminates duplication.

## Overview

The tenant context contract provides:

- **Consistent Data Structure**: Same tenant data format across frontend and backend
- **Validation Logic**: Shared validation rules and error handling
- **Type Safety**: TypeScript types that match backend implementation
- **Error Handling**: Standardized error responses and status codes

## Core Types

### TenantCore
Basic tenant identification and info:
```typescript
interface TenantCore {
  id: string;
  slug: string;
  schema: string;
  domain: string;
  businessName: string;
}
```

### TenantInfo
Extended tenant information for full context:
```typescript
interface TenantInfo extends TenantCore {
  owner: string;
  businessEmail: string | null;
  personalEmail: string;
  businessPhone: string;
  personalPhone: string;
  industry: string;
  applicationStatus: 'pending' | 'approved' | 'rejected';
  businessStartDate: string;
  website: string;
  
  socialMedia: {
    facebook?: string;
    instagram?: string;
    tiktok?: string;
    youtube?: string;
    googleBusiness?: string;
  };
  
  serviceAreas: Array<{
    city: string;
    state: string;
    zip?: string;
    primary?: boolean;
    minimum?: number;
    multiplier?: number;
  }>;
  
  createdAt: string;
  updatedAt: string;
  lastActivity?: string;
}
```

### TenantContext
Complete tenant context for request/response handling:
```typescript
interface TenantContext {
  tenant: TenantInfo;
  user?: {
    id: string;
    email: string;
    isAdmin: boolean;
    roles?: string[];
  };
  requestId?: string;
  correlationId?: string;
}
```

## Backend Implementation

### Middleware Usage

The backend middleware now uses the shared contract:

```javascript
// withTenant middleware
const withTenant = asyncHandler(async (req, res, next) => {
  const businessRow = await getTenantBySlug(slug);
  
  // Use shared contract to attach tenant context
  attachTenantContext(req, businessRow, req.user);
  
  // Validate tenant context
  const validation = validateTenantContext(req.tenant);
  if (!validation.isValid) {
    return res.status(validation.error.statusCode).json({
      success: false,
      error: validation.error
    });
  }
  
  next();
});
```

### Validation Middleware

New validation middleware ensures consistent tenant context:

```javascript
import { validateTenantExists, validateTenantApproved } from './tenantValidation.js';

// Validate tenant exists and is valid
router.use('/tenant/:slug', validateTenantExists);

// Validate tenant is approved
router.use('/tenant/:slug', validateTenantApproved);
```

## Frontend Implementation

### Unified Tenant Provider

The frontend now uses a unified tenant context provider:

```typescript
import { UnifiedTenantProvider, useTenantContext } from '@/shared/contexts/TenantContext';

function App() {
  return (
    <UnifiedTenantProvider>
      <YourApp />
    </UnifiedTenantProvider>
  );
}

function YourComponent() {
  const { tenant, loading, error, isValid } = useTenantContext();
  
  if (loading) return <Spinner />;
  if (!isValid) return <Error />;
  
  return <div>{tenant.businessName}</div>;
}
```

### Hook Usage

Multiple hooks provide different levels of tenant access:

```typescript
// Full tenant context
const { tenant, loading, error } = useTenantContext();

// Backward compatibility
const { slug } = useTenant();

// Validation status
const { isValid } = useIsValidTenant();

// Validation details
const validation = useTenantValidation();
```

## API Response Format

All tenant-related API responses follow this format:

```typescript
interface TenantApiResponse {
  success: boolean;
  data?: TenantInfo;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  meta?: {
    requestId: string;
    timestamp: string;
    version: string;
  };
}
```

## Error Codes

Standardized error codes for tenant context:

- `NO_TENANT_CONTEXT`: No tenant context available
- `INVALID_TENANT_CONTEXT`: Missing required fields
- `TENANT_NOT_APPROVED`: Tenant is not approved
- `TENANT_NOT_FOUND`: Tenant does not exist
- `TENANT_ACCESS_DENIED`: User lacks access to tenant
- `AUTHENTICATION_REQUIRED`: Authentication needed

## Migration Guide

### Backend Migration

1. Import the tenant context contract utilities
2. Update middleware to use `attachTenantContext`
3. Add validation middleware where needed
4. Update API responses to use standardized format

### Frontend Migration

1. Replace existing tenant context providers with `UnifiedTenantProvider`
2. Update hooks to use `useTenantContext` instead of multiple hooks
3. Update components to use the new tenant data structure
4. Remove duplicate tenant context implementations

## Benefits

1. **Eliminates Duplication**: Single source of truth for tenant data structure
2. **Consistent Validation**: Same validation rules across frontend and backend
3. **Type Safety**: Strong typing prevents mismatches between layers
4. **Better Error Handling**: Standardized error responses and status codes
5. **Easier Debugging**: Consistent logging and correlation IDs
6. **Future-Proof**: Extensible design for new tenant features

## Testing

The contract includes validation functions that can be used in tests:

```typescript
import { validateTenantContext } from '@/shared/types/tenant.types';

const result = validateTenantContext(mockTenant);
expect(result.isValid).toBe(true);
```

This ensures that test data matches the production contract.
