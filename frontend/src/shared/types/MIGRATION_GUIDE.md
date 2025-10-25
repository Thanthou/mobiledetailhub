# Migration Guide: Using Auto-Generated Database Types

This guide shows how to migrate from hand-written types to auto-generated database types.

## ✅ What Changed

We now auto-generate TypeScript types directly from the PostgreSQL database schema. This ensures frontend types always match the backend database structure.

## 📦 Where to Import From

### Auto-Generated Database Types (NEW)
```typescript
// Single source of truth - generated from database
import type { Business, Reviews, Appointments } from '@/shared/types/generated/db.types';

// Or use the convenience index
import type { Business, Reviews } from '@/shared/types';
```

### Hand-Written Helper Types (KEEP)
```typescript
// Custom types not from database
import type { TenantContext, ServiceArea } from '@/shared/types';
```

## 🔄 Migration Examples

### Before: Hand-Written Types
```typescript
// ❌ OLD: frontend/src/shared/types/business.types.ts
export interface Business {
  id: number;
  slug: string;
  business_name: string;
  // ... manually maintained (can drift from DB)
}
```

### After: Generated Types
```typescript
// ✅ NEW: Import from generated
import type { Business } from '@/shared/types/generated/db.types';

// Business now has:
// - All columns from tenants.business table
// - Correct TypeScript types (string, number, boolean, etc.)
// - Optional fields for nullable columns
// - Always in sync with database
```

## 📝 Common Patterns

### Pattern 1: Direct Database Type
```typescript
// When API returns raw database rows
import type { Reviews } from '@/shared/types';

interface Props {
  reviews: Reviews[];
}

async function fetchReviews(): Promise<Reviews[]> {
  const response = await fetch('/api/reviews');
  return response.json();
}
```

### Pattern 2: Extending Database Types
```typescript
// When API adds computed fields or transforms data
import type { Business as DBBusiness } from '@/shared/types/generated/db.types';

export interface BusinessWithStats extends DBBusiness {
  // Add computed fields not in database
  totalReviews: number;
  averageRating: number;
  isActive: boolean;
}
```

### Pattern 3: Type Overrides
```typescript
// When API transforms JSONB or other complex types
import type { Business as DBBusiness } from '@/shared/types/generated/db.types';

export type Business = Omit<DBBusiness, 'service_areas'> & {
  // Override JSONB field with strongly-typed structure
  service_areas: ServiceArea[];
};
```

### Pattern 4: Partial Updates
```typescript
// For PATCH/PUT operations where not all fields are required
import type { Business } from '@/shared/types/generated/db.types';

// Use TypeScript's built-in Partial utility
type BusinessUpdate = Partial<Business>;

async function updateBusiness(id: number, data: BusinessUpdate) {
  // Only send fields that changed
  await fetch(`/api/tenants/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data)
  });
}
```

### Pattern 5: Insert Types (Omit Auto-Generated)
```typescript
// For POST operations where ID and timestamps are auto-generated
import type { Reviews } from '@/shared/types/generated/db.types';

// Omit fields the database generates automatically
type ReviewInsert = Omit<Reviews, 'id' | 'created_at' | 'updated_at'>;

async function createReview(data: ReviewInsert) {
  await fetch('/api/reviews', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}
```

## 🎯 When to Use Each Approach

| Scenario | Solution | Example |
|----------|----------|---------|
| **API returns raw DB row** | Direct import | `import type { Business } from '@/shared/types'` |
| **API adds computed fields** | Extend with `&` | `DBBusiness & { totalReviews: number }` |
| **API transforms JSONB** | Override with `Omit` + `&` | `Omit<DB, 'jsonField'> & { jsonField: Typed }` |
| **Form submission** | Use `Omit` for auto-fields | `Omit<Review, 'id' \| 'created_at'>` |
| **Partial updates** | Use `Partial<T>` | `Partial<Business>` |
| **UI-only state** | Create new type | Keep in app-specific `types/` folder |

## 🚀 Quick Migration Checklist

1. ✅ **Find hand-written database types** in your code
2. ✅ **Replace with imports** from `@/shared/types/generated/db.types`
3. ✅ **Extend if needed** for API transformations (use `&` or `Omit`)
4. ✅ **Keep UI-only types** as-is (they don't represent database tables)
5. ✅ **Run `npm run migrate`** to regenerate types after schema changes

## 📚 File Organization

```
frontend/src/shared/types/
  generated/
    db.types.ts          ← AUTO-GENERATED (don't edit)
    README.md            ← Documentation
  
  index.ts               ← Convenience re-exports
  tenant.types.ts        ← Hand-written helpers
  tenant-business.types.ts ← Extends generated types
  service.types.ts       ← UI/display types (not DB)
  gallery.types.ts       ← UI/display types (not DB)
```

## ❓ FAQ

**Q: Do I need to update all my types right now?**  
A: No. Generated types are additive. Migrate gradually as you touch files.

**Q: What if I need a field that's not in the database?**  
A: Extend the generated type with `&` or create a new interface.

**Q: Can I edit the generated file?**  
A: No. Changes will be overwritten. Extend types in separate files instead.

**Q: How do I know which types are generated?**  
A: Check the import path. If it includes `/generated/`, it's auto-generated.

**Q: What about Zod schemas for validation?**  
A: Keep them! Generated types are for TypeScript. Zod schemas are for runtime validation. They serve different purposes.

## 🎓 Real-World Example

```typescript
// apps/admin-app/src/features/applications/ApplicationList.tsx

// Before: Manual types that might drift
import type { Application } from '../../types/applications';

// After: Generated types + extension
import type { Business } from '@/shared/types/generated/db.types';

// Extend with UI-specific computed fields
interface ApplicationRow extends Business {
  daysWaiting: number;
  isOverdue: boolean;
}

export function ApplicationList() {
  const [applications, setApplications] = useState<ApplicationRow[]>([]);
  
  // Fetch raw database data
  const fetchApplications = async () => {
    const data: Business[] = await api.get('/api/admin/applications');
    
    // Transform to add computed fields
    const enhanced = data.map(app => ({
      ...app,
      daysWaiting: calculateDays(app.application_date),
      isOverdue: isOverdueCheck(app.application_date),
    }));
    
    setApplications(enhanced);
  };
  
  return (/* render table */);
}
```

---

**Need help?** Check the generated file's header comments or ask the team!

