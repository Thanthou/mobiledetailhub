# Validation Schemas

This directory contains all Zod validation schemas for API endpoints, organized by domain.

## 📁 Structure

```
validation/
  ├── index.js                    Re-exports all schemas (main entry point)
  ├── common.js                   Shared field validators (email, phone, etc.)
  ├── auth.schemas.js             Authentication & user management
  ├── tenants.schemas.js          Tenant signup & management
  ├── customers.schemas.js        Customer data (future)
  ├── schedule.schemas.js         Appointments & scheduling
  ├── reputation.schemas.js       Reviews & ratings
  ├── payments.schemas.js         Payment processing
  ├── services.schemas.js         Service catalog
  ├── website.schemas.js          Website content management
  ├── analytics.schemas.js        Analytics tracking
  ├── domains.schemas.js          Custom domain management
  ├── images.schemas.js           Image uploads
  ├── errors.schemas.js           Error tracking
  └── admin.schemas.js            Admin operations
```

## 🎯 Purpose

These schemas define **business rules and validation logic** for API input.

They answer: **"What should we accept as valid input?"**

This is different from:
- **Database types** (auto-generated) - "What exists in the database?"
- **TypeScript types** (auto-generated) - "What's the structure of data?"

## 📝 Usage

### Import Schemas

```javascript
// Import specific schemas
import { authSchemas, tenantSchemas } from './schemas/validation/index.js';

// Use in route handler
router.post('/api/auth/register', async (req, res) => {
  try {
    // Validate request body against schema
    const validated = authSchemas.register.parse(req.body);
    
    // validated is now type-safe and validated
    // ... create user ...
    
  } catch (error) {
    // Zod will throw detailed validation errors
    res.status(400).json({ errors: error.errors });
  }
});
```

### With Express Middleware

```javascript
// Create validation middleware
function validate(schema) {
  return (req, res, next) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      res.status(400).json({ errors: error.errors });
    }
  };
}

// Use in routes
router.post('/api/tenants/signup', 
  validate(tenantSchemas.signup),
  async (req, res) => {
    // req.body is already validated
  }
);
```

## 🔧 Adding New Validation

### 1. Choose the Right File

Match the database schema organization:

| Database Schema | Validation File |
|----------------|-----------------|
| `auth.*` tables | `auth.schemas.js` |
| `tenants.*` tables | `tenants.schemas.js` |
| `schedule.*` tables | `schedule.schemas.js` |
| `reputation.*` tables | `reputation.schemas.js` |

### 2. Add Schema

```javascript
// Example: Adding new validation to tenants.schemas.js
import { z } from 'zod';
import { commonFields } from './common.js';

export const tenantSchemas = {
  // Existing schemas...
  
  // Add new schema
  updateBusiness: z.object({
    businessName: commonFields.businessName,
    phone: commonFields.phone,
    website: commonFields.website,
  })
};
```

### 3. Export from Index

```javascript
// validation/index.js
export { tenantSchemas } from './tenants.schemas.js';
```

### 4. Use in Routes

```javascript
import { tenantSchemas } from './schemas/validation/index.js';

router.put('/api/tenants/:slug', async (req, res) => {
  const validated = tenantSchemas.updateBusiness.parse(req.body);
  // ...
});
```

## 🛡️ Validation vs Types

| Aspect | Zod Schemas (This Folder) | TypeScript Types (Auto-Generated) |
|--------|---------------------------|-----------------------------------|
| **Purpose** | Runtime validation | Compile-time type checking |
| **Contains** | Business rules | Data structure |
| **Example** | `z.string().email().max(255)` | `email?: string` |
| **Source** | Manual (your business logic) | Auto-generated from database |
| **When** | API input validation | Data modeling |

## 💡 Best Practices

### 1. Reuse Common Fields

```javascript
// ✅ Good: Reuse common validators
import { commonFields } from './common.js';

export const mySchema = z.object({
  email: commonFields.email,  // Consistent email validation
  phone: commonFields.phone,  // Consistent phone validation
});

// ❌ Bad: Duplicate validation logic
export const mySchema = z.object({
  email: z.string().email().max(255),  // Duplicates common.js
  phone: z.string().regex(/^\+?1?\d{10,15}$/),  // Duplicates common.js
});
```

### 2. Match Database Constraints

```sql
-- Database: slug VARCHAR(50)
```

```javascript
// ✅ Good: Zod max matches or is stricter than DB
slug: z.string().max(50)

// ❌ Bad: Zod allows more than DB can store
slug: z.string().max(255)  // DB will truncate!
```

### 3. Clear Error Messages

```javascript
// ✅ Good: Helpful error messages
slug: z.string()
  .min(2, 'Slug must be at least 2 characters')
  .max(50, 'Slug cannot exceed 50 characters')
  .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens')

// ❌ Bad: Generic errors
slug: z.string().min(2).max(50).regex(/^[a-z0-9-]+$/)
```

### 4. Organize by Domain

```javascript
// ✅ Good: Group related schemas
export const tenantSchemas = {
  signup: z.object({ /* ... */ }),
  update: z.object({ /* ... */ }),
  updateServiceAreas: z.object({ /* ... */ }),
};

// ❌ Bad: Flat exports
export const tenantSignup = z.object({ /* ... */ });
export const tenantUpdate = z.object({ /* ... */ });
export const tenantUpdateServiceAreas = z.object({ /* ... */ });
```

## 🔄 Maintenance

### When Database Schema Changes

1. **Add column to database** (via migration)
2. **Types auto-update** (from `npm run migrate`)
3. **Update Zod schema** (if you want to validate it)

```sql
-- 1. Migration
ALTER TABLE tenants.business ADD COLUMN logo_url TEXT;
```

```bash
# 2. Run migration (types auto-update)
npm run migrate
```

```javascript
// 3. Add validation (if needed)
// validation/tenants.schemas.js
export const tenantSchemas = {
  update: z.object({
    // ... existing fields ...
    logo_url: z.string().url().optional(),  // Add validation
  })
};
```

### When Removing a Column

```sql
-- 1. Migration
ALTER TABLE tenants.business DROP COLUMN temp;
```

```bash
# 2. Run migration (types auto-update)
npm run migrate
```

```javascript
// 3. Remove from Zod (if it was there)
export const tenantSchemas = {
  update: z.object({
    slug: z.string(),
    // temp: z.string(),  // ← Remove this
  })
};
```

## 🧪 Testing Schemas

```javascript
// Test validation behavior
import { authSchemas } from './validation/index.js';

// Valid input
const valid = authSchemas.register.parse({
  email: 'user@example.com',
  password: 'SecurePass123',
  name: 'John Doe'
});
// ✅ Returns validated object

// Invalid input
try {
  authSchemas.register.parse({
    email: 'invalid-email',
    password: '123',  // Too short
    name: 'J'  // Too short
  });
} catch (error) {
  console.log(error.errors);
  // ❌ Returns detailed validation errors
}
```

## 📚 Related

- **Database migrations**: `backend/migrations/`
- **Generated types**: `frontend/src/shared/types/generated/`
- **Database snapshot**: `backend/schemas/generated/current-schema.json`
- **Backwards compat**: `backend/schemas/apiSchemas.js` (deprecated)

## 🔗 Resources

- [Zod Documentation](https://zod.dev/)
- [Zod Error Handling](https://zod.dev/ERROR_HANDLING)
- [Project Architecture](../../../docs/ARCHITECTURE.md)

