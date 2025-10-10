# Feature Architecture - Enforced Boundaries

## ✅ Rules (Enforced by ESLint + Scripts)

### 1. **No Cross-Feature Imports**
```typescript
// ❌ FORBIDDEN
import { Something } from '@/features/otherFeature/...';

// ✅ ALLOWED
import { Something } from '@/shared/...';
import { Something } from './components/...';  // Same feature
```

### 2. **No fetch() in Components**
```typescript
// ❌ FORBIDDEN in components/
fetch('/api/data')

// ✅ ALLOWED - Use hooks
const { data } = useYourFeatureData();  // Hook uses API client
```

### 3. **API Clients Required**
```
features/yourFeature/
  ├── api/
  │   └── yourFeature.api.ts  ← All HTTP calls here
  ├── hooks/
  │   └── useYourFeature.ts   ← Uses API client
  └── components/
      └── YourComponent.tsx   ← Uses hooks (no API calls)
```

---

## 🚀 Quick Start

### Creating a New Feature

1. **Copy templates:**
   ```bash
   cp _templates/api-client.template.ts your-feature/api/yourFeature.api.ts
   cp _templates/hook-with-api.template.ts your-feature/hooks/useYourFeature.ts
   ```

2. **Customize:**
   - Update API endpoints
   - Add your domain logic
   - Export typed responses

3. **Use in components:**
   ```typescript
   import { useYourFeature } from '../hooks/useYourFeature';
   
   function YourComponent() {
     const { data, isLoading } = useYourFeature();
     // Render - no fetch, no API imports!
   }
   ```

---

## 🔍 Checking Boundaries

```bash
# Check for violations
npm run lint:boundaries

# Verbose output
npm run lint:boundaries:verbose

# Auto-runs on: npm run lint
```

---

## 📋 Allowed Imports

### From Components
- ✅ `@/shared/**` - Shared utilities, components, types
- ✅ `../hooks/...` - Same feature hooks
- ✅ `../utils/...` - Same feature utils
- ✅ `../types/...` - Same feature types
- ❌ `@/features/otherFeature/**` - Cross-feature imports

### From Hooks
- ✅ `@/shared/**`
- ✅ `../api/...` - Same feature API client
- ✅ `../utils/...` - Same feature utils
- ✅ `../types/...` - Same feature types
- ❌ `@/features/otherFeature/**`

### From API Clients
- ✅ `@/shared/api` - Shared API client
- ✅ `../types/...` - Same feature types
- ❌ `@/features/otherFeature/**`

---

**Keep features isolated. Share via @/shared or props!**

