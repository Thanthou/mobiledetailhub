# Health Endpoints: Liveness vs Readiness Fix

## Issue Description

The health endpoints existed but were not properly separated for orchestration systems:
- **Liveness**: Should reflect if the process is responsive (always 200 if event loop working)
- **Readiness**: Should reflect if the service is ready to receive traffic (database connectivity + migrations)

## Solution Implemented

### ✅ **New Endpoints Added**

#### 1. Liveness Endpoint (`/api/health/live`)
- **Purpose**: Check if process is responsive
- **Response**: Always returns 200 if event loop is working
- **Use case**: Kubernetes liveness probes, container health checks
- **Checks**: Process uptime, memory usage, PID

#### 2. Enhanced Readiness Endpoint (`/api/health/ready`)
- **Purpose**: Check if service is ready to receive traffic
- **Response**: 200 if ready, 503 if not ready
- **Use case**: Kubernetes readiness probes, load balancer health checks
- **Checks**: Database connectivity, circuit breaker status, migration version

### ✅ **Migration Tracking System**

#### New Utility: `backend/utils/migrationTracker.js`
- Automatic creation of `schema_migrations` table
- Version history tracking with timestamps
- Integration with readiness checks
- Methods for recording and querying migrations

#### New Script: `backend/scripts/record_migration.js`
- Command-line utility for recording migrations
- Usage: `node scripts/record_migration.js <version> <description> [checksum] [execution_time_ms]`
- Example: `node scripts/record_migration.js "1.0.1" "Add user preferences table"`

### ✅ **Enhanced Health Endpoints**

#### Updated `backend/routes/health.js`
- `/live` - Liveness check (process responsive)
- `/ready` - Readiness check (database + migrations)
- `/migrations` - Migration status and history
- Maintains backward compatibility with existing endpoints

## API Response Examples

### Liveness Check (`/api/health/live`)
```json
{
  "status": "alive",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 3600.5,
  "pid": 12345,
  "memory": {
    "used": 45,
    "total": 67,
    "external": 12
  }
}
```

### Readiness Check (`/api/health/ready`)
```json
{
  "status": "ready",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "database": {
    "connected": true,
    "circuitBreaker": "CLOSED",
    "isReady": true,
    "migrationVersion": "1.0.0",
    "migrationStatus": {
      "currentVersion": "1.0.0",
      "totalMigrations": 1,
      "lastApplied": "2024-01-15T10:00:00.000Z",
      "isHealthy": true
    }
  },
  "service": {
    "uptime": 3600.5,
    "memory": 45
  }
}
```

## Usage in Container Orchestration

### Kubernetes Configuration Example
```yaml
livenessProbe:
  httpGet:
    path: /api/health/live
    port: 3001
  initialDelaySeconds: 30
  periodSeconds: 10

readinessProbe:
  httpGet:
    path: /api/health/ready
    port: 3001
  initialDelaySeconds: 5
  periodSeconds: 5
```

### Load Balancer Health Checks
- **Liveness**: Use `/api/health/live` for basic process health
- **Readiness**: Use `/api/health/ready` for traffic routing decisions

## Migration Management

### Automatic Setup
- `schema_migrations` table is created automatically on first readiness check
- Initial version `1.0.0` is set automatically

### Recording New Migrations
```bash
# After running a migration script
node scripts/record_migration.js "1.0.1" "Add user preferences table"

# With checksum and execution time
node scripts/record_migration.js "1.0.2" "Update service areas" "abc123" 1500
```

### Migration Status Monitoring
```bash
# Check migration status
curl http://localhost:3001/api/health/migrations

# Check readiness (includes migration version)
curl http://localhost:3001/api/health/ready
```

## Benefits

1. **Proper Orchestration Support**: Kubernetes and other container systems can properly monitor service health
2. **Traffic Management**: Load balancers can make informed decisions about routing traffic
3. **Migration Tracking**: Database schema versions are tracked and monitored
4. **Operational Visibility**: Clear separation between process health and service readiness
5. **Backward Compatibility**: Existing health endpoints continue to work

## Testing

### Manual Testing
```bash
# Test liveness (should always return 200)
curl http://localhost:3001/api/health/live

# Test readiness (200 if ready, 503 if not)
curl http://localhost:3001/api/health/ready

# Test migration status
curl http://localhost:3001/api/health/migrations
```

### Automated Testing
- Liveness endpoint should always return 200 if process is running
- Readiness endpoint should return 503 if database is unavailable
- Migration tracking should work automatically

## Files Modified

- `backend/routes/health.js` - Added liveness and enhanced readiness endpoints
- `backend/utils/migrationTracker.js` - New migration tracking utility
- `backend/scripts/record_migration.js` - New migration recording script
- `backend/README.md` - Updated documentation

## Next Steps

1. **Deploy and test** the new endpoints
2. **Update orchestration configurations** to use proper liveness/readiness probes
3. **Record existing migrations** using the new tracking system
4. **Monitor** migration status in production health checks
