# Feature Templates

## Quick Start

Copy these templates when creating a new feature:

### 1. API Client (`api-client.template.ts`)
→ Copy to `features/<your-feature>/api/<feature>.api.ts`

**Purpose:** All HTTP calls for your feature

**Pattern:**
```typescript
export const yourFeatureApi = {
  getItems: async () => apiClient.get('/endpoint'),
  createItem: async (data) => apiClient.post('/endpoint', data),
};

export const yourFeatureKeys = {
  all: ['yourFeature'] as const,
  detail: (id) => ['yourFeature', id] as const,
};
```

### 2. Hook with API (`hook-with-api.template.ts`)
→ Copy to `features/<your-feature>/hooks/useYourFeature.ts`

**Purpose:** React Query hooks that use the API client

**Pattern:**
```typescript
export function useYourFeatureData() {
  return useQuery({
    queryKey: yourFeatureKeys.all,
    queryFn: () => yourFeatureApi.getItems(),
  });
}
```

### 3. Component Usage

**Pattern:**
```typescript
import { useYourFeatureData } from '../hooks/useYourFeature';

export function YourComponent() {
  const { data, isLoading } = useYourFeatureData();
  // Render UI - no fetch calls!
}
```

---

## ✅ Rules Enforced by ESLint

- ❌ **NO `fetch()` in components/** - ESLint will error
- ❌ **NO `fetch()` in shared/ui/** - Must be pure
- ✅ **YES `fetch()` in api/** - That's what it's for
- ✅ **YES `fetch()` in hooks/** - Via API clients

---

## Architecture

```
Component (pure, no side effects)
   ↓ uses
Hook (side effects allowed)
   ↓ uses
API Client (HTTP calls)
   ↓ calls
Backend
```

**Components stay dumb, hooks stay smart!**

