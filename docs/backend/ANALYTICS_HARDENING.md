# Analytics Endpoint Hardening - Task #2 Complete ✅

**Date**: October 20, 2025  
**Status**: ✅ Complete

## Problem

The original `/api/analytics/track` endpoint had several serious issues:
- ⚠️ **Lazy pool initialization** - Pool initialized asynchronously, could fail silently
- ⚠️ **Ad-hoc tenant detection** - Used unsafe `LIKE` query with slug matching
- ⚠️ **No rate limiting** - Open to abuse and spam
- ⚠️ **No authentication** - Anyone could send analytics events
- ⚠️ **No resilience** - Database errors resulted in lost analytics data

## Solution Implemented

### 1. Factory Pattern with Pool Injection ✅

**Before** (❌ Bad):
```javascript
// Lazy initialization - can fail silently
let pool;
(async () => { 
  try {
    pool = await getPool(); 
  } catch (error) {
    logger.warn('Failed to initialize analytics pool:', error.message);
  }
})();

export default router; // No guarantee pool exists!
```

**After** (✅ Good):
```javascript
// Factory pattern - fail fast if no pool
export default function createAnalyticsRouter(pool) {
  if (!pool) {
    throw new Error('Analytics router requires a database pool');
  }
  
  const router = express.Router();
  // ... routes use pool
  return router;
}
```

**server.js**:
```javascript
try {
  const pool = await getPool();
  analyticsRouter = createAnalyticsRouter(pool);
  logger.info('Analytics router initialized with database pool');
} catch (error) {
  logger.error('Failed to initialize analytics router', { error: error.message });
  // Graceful fallback
  analyticsRouter = express.Router();
  analyticsRouter.all('*', (req, res) => {
    res.status(503).json({ success: false, error: 'Analytics service temporarily unavailable' });
  });
}
```

---

### 2. Unified Tenant Resolution ✅

**Before** (❌ Bad):
```javascript
// Ad-hoc, unsafe SQL with LIKE matching
const host = req.get('host');
const result = await pool.query(`
  SELECT id, slug, business_name
  FROM tenants.business 
  WHERE website_domain = $1 
     OR $1 LIKE '%' || slug || '%'  ← ⚠️ Dangerous!
  ORDER BY approved_date DESC
  LIMIT 1
`, [host]);
```

**After** (✅ Good):
```javascript
// Middleware with proper SQL and priority ordering
export function tenantResolverWithDB(pool) {
  return async (req, res, next) => {
    // ... slug resolution logic ...
    
    const result = await pool.query(`
      SELECT id, slug, business_name, website_domain
      FROM tenants.business 
      WHERE slug = $1 OR website_domain = $2  ← ✅ Exact matches only
      ORDER BY 
        CASE WHEN slug = $1 THEN 1 ELSE 2 END,  ← ✅ Prefer slug match
        approved_date DESC
      LIMIT 1
    `, [req.tenantSlug, host]);
    
    req.tenantId = result.rows[0]?.id || null;
    next();
  };
}
```

Usage:
```javascript
router.post('/track',
  analyticsLimiter,
  tenantResolverWithDB(pool),  ← ✅ Middleware handles tenant resolution
  verifyIngestKey,
  validateBody(analyticsSchemas.track),
  asyncHandler(async (req, res) => {
    const tenantId = req.tenantId;  ← ✅ Already resolved
    // ...
  })
);
```

---

### 3. Rate Limiting ✅

**Added** `backend/middleware/rateLimiter.js`:
```javascript
const analyticsLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 200 : 10000, // 200 events per 15min in prod
  skipSuccessfulRequests: false, // Count all requests to prevent spam
  standardHeaders: true,
  handler: (req, res) => {
    logger.warn('Analytics rate limit exceeded', {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      host: req.get('host'),
      tenantSlug: req.tenantSlug
    });
    
    res.status(429).json({
      code: 'RATE_LIMITED',
      error: 'Too many analytics requests. Please try again later.',
      retryAfterSeconds: Math.ceil(req.rateLimit.resetTime / 1000)
    });
  }
});
```

**Usage**:
```javascript
router.post('/track',
  analyticsLimiter,  ← ✅ Applied to endpoint
  // ... other middleware
);
```

---

### 4. Ingest Key Verification ✅

**Added** optional spam prevention:
```javascript
const verifyIngestKey = (req, res, next) => {
  const ingestKey = process.env.ANALYTICS_INGEST_KEY;
  
  // Skip verification if no key is configured
  if (!ingestKey) {
    return next();
  }

  const providedKey = req.get('X-Analytics-Key') || req.body.ingestKey;
  
  if (providedKey !== ingestKey) {
    logger.warn('Invalid analytics ingest key', {
      ip: req.ip,
      host: req.get('host')
    });
    
    return res.status(401).json({
      success: false,
      error: 'Invalid or missing ingest key'
    });
  }

  next();
};
```

**Usage**:
- Set `ANALYTICS_INGEST_KEY=your-secret-key` in `.env` (optional)
- Frontend sends key via header: `X-Analytics-Key: your-secret-key`
- Or in body: `{ ingestKey: "your-secret-key", ... }`

---

### 5. Disk-Based Queue for Resilience ✅

**Created** `backend/utils/analyticsQueue.js`:

**Features**:
- ✅ Queues failed events to disk (`backend/logs/analytics-queue.jsonl`)
- ✅ Auto-flushes queue every 5 minutes
- ✅ Maximum queue size (10,000 events)
- ✅ Graceful shutdown support

**API**:
```javascript
import { queueEvent, getQueueSize, flushQueue, startAutoFlush, stopAutoFlush } from './utils/analyticsQueue.js';

// Queue an event
queueEvent({
  tenant_id: 123,
  event_name: 'page_view',
  event_parameters: '{"page": "/"}',
  // ...
});

// Get queue size
const size = getQueueSize(); // → 42

// Manual flush
await flushQueue(pool); // → { success: 40, failed: 2 }

// Auto-flush (starts in server.js)
const handle = startAutoFlush(pool);

// Stop auto-flush (on shutdown)
stopAutoFlush(handle);
```

**Usage in router**:
```javascript
try {
  await pool.query(/* INSERT ... */);
  res.status(200).json({ success: true, queued: false });
} catch (dbError) {
  // Database failed - queue event for later
  const queued = queueEvent(eventData);
  
  res.status(202).json({
    success: true,
    message: 'Event queued for processing',
    queued,
    queueSize: queued ? getQueueSize() : undefined
  });
}
```

---

### 6. Graceful Shutdown ✅

**Added** to `backend/server.js`:
```javascript
// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully');
  
  // Stop analytics queue auto-flush
  if (autoFlushHandle) {
    const { stopAutoFlush } = await import('./utils/analyticsQueue.js');
    stopAutoFlush(autoFlushHandle);
  }
  
  // Close server
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
  
  // Force close after 10 seconds
  setTimeout(() => {
    logger.error('Forcing shutdown after timeout');
    process.exit(1);
  }, 10000);
});
```

---

## File Changes

### New Files Created
- ✅ `backend/routes/analytics.new.js` - Hardened analytics router (factory pattern)
- ✅ `backend/utils/analyticsQueue.js` - Disk-based event queue

### Files Modified
- ✅ `backend/middleware/rateLimiter.js` - Added `analyticsLimiter`
- ✅ `backend/middleware/tenantResolver.js` - Added `tenantResolverWithDB(pool)`
- ✅ `backend/server.js` - Integrated new router, auto-flush, graceful shutdown

### Files Unchanged (Legacy)
- ⚠️ `backend/routes/analytics.js` - Old version (keep for reference, not mounted)

---

## Migration Path

### ✅ Step 1: Deploy (Zero Downtime)
The new router is at `/api/analytics` (same path), so no frontend changes required!

```bash
# Deploy code
git pull origin main
npm install

# Restart server
pm2 restart backend
```

### ✅ Step 2: Optional - Add Ingest Key
To enable spam prevention:

```bash
# Add to .env (production)
ANALYTICS_INGEST_KEY=generate_a_random_secret_here
```

Then update frontend to send key:
```javascript
fetch('/api/analytics/track', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Analytics-Key': 'your_secret_key'  // ← Add this
  },
  body: JSON.stringify({ event: 'page_view', ... })
});
```

### ✅ Step 3: Monitor Queue
Check queue status (admin only):
```bash
curl http://localhost:3001/api/analytics/queue/status \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

Response:
```json
{
  "success": true,
  "queueSize": 0,
  "queueFile": "backend/logs/analytics-queue.jsonl"
}
```

### ✅ Step 4: Delete Old Router (After Testing)
Once confident the new router works:
```bash
rm backend/routes/analytics.js
```

---

## Testing

### Manual Test 1: Basic Event Tracking
```bash
curl -X POST http://localhost:3001/api/analytics/track \
  -H "Content-Type: application/json" \
  -d '{
    "event": "test_event",
    "parameters": {"page": "/test"},
    "timestamp": "2025-10-20T12:00:00Z"
  }'
```

Expected:
```json
{
  "success": true,
  "message": "Analytics event tracked successfully",
  "queued": false
}
```

### Manual Test 2: Rate Limiting
```bash
# Send 201 requests rapidly (in production)
for i in {1..201}; do
  curl -X POST http://localhost:3001/api/analytics/track \
    -H "Content-Type: application/json" \
    -d '{"event": "spam_test"}' &
done
```

Expected: 429 rate limit error after 200 requests.

### Manual Test 3: Ingest Key
```bash
# Set ANALYTICS_INGEST_KEY=test123 in .env

# Without key (should fail)
curl -X POST http://localhost:3001/api/analytics/track \
  -H "Content-Type: application/json" \
  -d '{"event": "test"}'

# With key (should succeed)
curl -X POST http://localhost:3001/api/analytics/track \
  -H "Content-Type: application/json" \
  -H "X-Analytics-Key: test123" \
  -d '{"event": "test"}'
```

### Manual Test 4: Queue Resilience
```bash
# Stop database
docker stop postgres

# Send event (should queue)
curl -X POST http://localhost:3001/api/analytics/track \
  -H "Content-Type: application/json" \
  -d '{"event": "queued_event"}'

# Check queue file
cat backend/logs/analytics-queue.jsonl

# Start database
docker start postgres

# Wait 5 minutes for auto-flush, or manually flush via admin endpoint
```

---

## Benefits

### Before vs After

| Feature | Before | After |
|---------|--------|-------|
| **Pool initialization** | ❌ Lazy, can fail silently | ✅ Factory, fails fast |
| **Tenant resolution** | ❌ Ad-hoc `LIKE` query | ✅ Middleware, safe SQL |
| **Rate limiting** | ❌ None | ✅ 200 events / 15min |
| **Authentication** | ❌ None | ✅ Optional ingest key |
| **Resilience** | ❌ Lost events on DB failure | ✅ Disk queue + auto-flush |
| **Graceful shutdown** | ❌ No cleanup | ✅ Stops queue, closes cleanly |
| **Testability** | ❌ Hard to test | ✅ Factory pattern, mockable |

---

## Next Steps

From the original "Top 5 Focus" list:
- ✅ **#1: Unify multi-app Vite build/preview** - COMPLETE
- ✅ **#2: Harden `/api/analytics/track`** - COMPLETE
- 🔜 **#3: Tenant deletion service layer**
- 🔜 **#4: Standardize subdomain routing**
- 🔜 **#5: Runtime config discipline**

---

## Related Files

- **New router**: `backend/routes/analytics.new.js`
- **Queue utility**: `backend/utils/analyticsQueue.js`
- **Rate limiter**: `backend/middleware/rateLimiter.js`
- **Tenant resolver**: `backend/middleware/tenantResolver.js`
- **Server bootstrap**: `backend/server.js`
- **Legacy router**: `backend/routes/analytics.js` (not mounted)

