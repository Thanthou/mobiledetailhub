# Backend Bootstrap System

## Overview

The bootstrap system provides a clean, modular approach to Express server initialization. Instead of a monolithic `server.js`, startup logic is organized into discrete, testable phases.

## Architecture

### Boot Sequence

```
server.js (entry point)
    ↓
bootstrap/server.start.js
    ↓
1. loadEnv.js         → Environment validation
2. setupSecurity.js   → Helmet, CORS, body parsing  
3. setupMiddleware.js → Logging, tenants, CSRF
4. setupRoutes.js     → API routes + rate limiting
5. setupErrors.js     → Global error handler
6. Static assets      → Frontend apps (main/admin/tenant)
7. Server listen      → Start HTTP server
```

### Module Responsibilities

#### `loadEnv.js`
- Loads `.env` from project root
- Validates required environment variables using Zod (via `env.async.js`)
- Fails fast in production if critical secrets missing
- **Exports:** `loadEnv()`, `env`

#### `setupSecurity.js`
- Configures Helmet security headers
- Sets up CORS for frontend origins (dev + production)
- Enables cookie parsing
- Configures body parsing (JSON + URL-encoded)
- **Exports:** `setupSecurity(app)`

#### `setupMiddleware.js`
- Request logging with correlation IDs
- Subdomain detection and tenant resolution
- CSRF protection for state-changing requests
- **Exports:** `setupMiddleware(app)`
- **Note:** Rate limiting is NOT here - it's route-specific in setupRoutes

#### `setupRoutes.js`
- Mounts all API routes under `/api/*`
- Applies rate limiting to API routes BEFORE mounting
- Includes 404 handler for undefined API routes
- Mounts 25+ route groups (auth, tenants, services, etc.)
- **Exports:** `setupRoutes(app)`

#### `setupErrors.js`
- Global error handler (must be last middleware)
- Formats errors consistently
- Logs errors with correlation IDs
- **Exports:** `setupErrors(app)`

#### `server.start.js`
- Orchestrates the entire boot sequence
- Serves static frontend apps
- Implements SPA fallback routing
- Configures graceful shutdown (SIGTERM/SIGINT)
- **Exports:** `app` (Express instance)

## Usage

### Starting the Server

```bash
# Development
npm run dev

# Production
npm start
```

### Testing Individual Modules

Each bootstrap module can be imported and tested independently:

```javascript
import { loadEnv } from './bootstrap/loadEnv.js';
import { setupSecurity } from './bootstrap/setupSecurity.js';

// Test env loading
const config = await loadEnv();
console.log(config.NODE_ENV);

// Test security setup
import express from 'express';
const app = express();
setupSecurity(app);
```

## Key Design Decisions

### 1. **Modular Over Monolithic**
Each phase is self-contained. This makes testing easier and reduces cognitive load.

### 2. **Explicit Ordering**
Middleware order matters in Express. The bootstrap system makes order explicit and verifiable:
- Security → Middleware → Routes → Errors (always)

### 3. **Rate Limiting at Route Level**
Rate limiting is applied in `setupRoutes` (not `setupMiddleware`) because it only applies to `/api/*` routes.

### 4. **Lazy Database Pool**
Database pool initializes on first use via `getPool()`. No explicit init needed.

### 5. **Frontend Apps as Static Assets**
The backend serves all three frontend apps (`/main`, `/admin`, `/tenant`) with SPA fallback routing.

## Migration from Legacy server.js

### What Changed?

| Before | After |
|--------|-------|
| 500-line `server.js` | 6 modular files (~100 lines each) |
| Unclear middleware order | Explicit phase-based loading |
| Mixed concerns | Separation of concerns |
| Hard to test | Each module independently testable |

### What Stayed the Same?

- All routes still work
- All middleware still active
- Environment validation unchanged
- CORS, Helmet, CSRF all preserved
- Static asset serving intact

## Troubleshooting

### Server won't start

1. Check environment variables: `node backend/bootstrap/loadEnv.js`
2. Verify all imports: `node --check backend/bootstrap/server.start.js`
3. Check for port conflicts: `lsof -i :3001` (Mac/Linux) or `netstat -ano | findstr :3001` (Windows)

### Routes return 404

- Ensure route is mounted in `setupRoutes.js`
- Check that route path starts with `/api/`
- Verify route file exports correctly

### ERR_HTTP_HEADERS_SENT errors

This is a pre-existing issue with rate limiting trying to set headers after 404 responses have been sent. Not related to the bootstrap system.

## Adding New Routes

1. Create route file in `backend/routes/`
2. Import in `setupRoutes.js`
3. Mount with `app.use('/api/your-route', yourRoutes)`

Example:
```javascript
// In setupRoutes.js
import yourNewRoutes from '../routes/yourNew.js';

export function setupRoutes(app) {
  // Rate limiting
  app.use('/api', apiLimiter);
  
  // Your new route
  app.use('/api/your-new', yourNewRoutes);
  
  // ... other routes
}
```

## Performance Notes

- ✅ No performance overhead vs. legacy `server.js`
- ✅ Module imports are cached by Node.js
- ✅ Initialization happens once at startup
- ✅ Request handling is identical to before

## Future Improvements

- [ ] Add health check for each bootstrap phase
- [ ] Create automated tests for boot sequence
- [ ] Add startup metrics/timing
- [ ] Document rollback procedure if issues arise

## Related Documentation

- [Environment Configuration](../config/env.async.js)
- [Middleware Guide](../middleware/README.md)
- [Route Structure](../routes/README.md)
- [Legacy Server Backup](../legacy/server.pre-rebuild.js)

---

**Last Updated:** 2025-10-23  
**Status:** ✅ Production Ready

