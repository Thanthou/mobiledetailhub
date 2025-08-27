# Backend Setup

## Environment Variables

Create a `.env` file in the backend directory with the following variables:

```bash
# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/database_name

# JWT Secret (for authentication)
JWT_SECRET=your-secret-key-here

# Admin Emails (comma-separated)
ADMIN_EMAILS=admin@example.com,admin2@example.com

# Server Port (optional, defaults to 3001)
PORT=3001
```

## Database Setup

1. Ensure PostgreSQL is running
2. Create a database named `MobileDetailHub` (or update DATABASE_URL)
3. Run the setup script: `node server.js` (this will create tables automatically)

## Running the Server

```bash
npm install
npm run dev  # for development with nodemon
npm start    # for production
```

## API Endpoints

### Health & Status
- `GET /api/health` - Comprehensive health check with database status
- `GET /api/health/live` - Liveness check (process responsive, always 200 if event loop working)
- `GET /api/health/ready` - Readiness check (database connectivity + migration status)
- `GET /api/health/db-status` - Database connection status only
- `GET /api/health/test-db` - Simple database connection test
- `GET /api/health/migrations` - Migration status and history

### Core Services
- `GET /api/service_areas` - Get service areas (with fallback data)
- `GET /api/test` - Test endpoint

## Database Connection Features

### ✅ **Improved Error Handling**
- **No more crashes**: Database connection failures no longer cause `process.exit(-1)`
- **Automatic retry**: Built-in retry logic with exponential backoff
- **Graceful degradation**: Application continues running even when database is unavailable

### ✅ **Connection Management**
- **Health monitoring**: Real-time connection pool status
- **Auto-reconnection**: Automatic reconnection on connection failures
- **Graceful shutdown**: Proper cleanup on application termination

### ✅ **Developer Tools**
- **Helper utilities**: `executeQuery()`, `executeTransaction()`, `isConnected()`
- **Connection status**: Detailed pool metrics and health information
- **Migration guide**: Complete guide for updating existing code

## Troubleshooting

### Database Connection Issues
1. **Check if PostgreSQL is running**
2. **Verify DATABASE_URL in .env file**
3. **Ensure the database exists**
4. **Check the server logs for detailed error messages**

### Health Check System (Liveness vs Readiness)

The application now provides proper separation of liveness and readiness checks for container orchestration:

#### Liveness Endpoint (`/api/health/live`)
- **Purpose**: Check if the process is responsive
- **Response**: Always returns 200 if event loop is working
- **Use case**: Kubernetes liveness probes, container health checks
- **Checks**: Process uptime, memory usage, PID

#### Readiness Endpoint (`/api/health/ready`)
- **Purpose**: Check if service is ready to receive traffic
- **Response**: 200 if ready, 503 if not ready
- **Use case**: Kubernetes readiness probes, load balancer health checks
- **Checks**: Database connectivity, circuit breaker status, migration version

#### Usage Examples
```bash
# Liveness check (always 200 if process is up)
curl http://localhost:3001/api/health/live

# Readiness check (200 if ready, 503 if not ready)
curl http://localhost:3001/api/health/ready

# Comprehensive health check
curl http://localhost:3001/api/health

# Migration status
curl http://localhost:3001/api/health/migrations
```

### Migration Tracking

The system now tracks database schema versions:
- Automatic creation of `schema_migrations` table
- Version history tracking with timestamps
- Integration with readiness checks
- Utility script for recording migrations: `node scripts/record_migration.js <version> <description>`

### Connection Retry Logic
The system automatically retries failed connections:
- **Initial delay**: 1 second
- **Maximum retries**: 5 attempts
- **Backoff strategy**: Exponential (1s, 2s, 4s, 8s, 16s)
- **Maximum delay cap**: 30 seconds

## Migration Guide

If you're updating existing code to use the new database connection pattern, see:
- [`docs/DATABASE_CONNECTION_MIGRATION.md`](docs/DATABASE_CONNECTION_MIGRATION.md) - Complete migration guide
- [`utils/dbHelper.js`](utils/dbHelper.js) - Helper utility functions
- [`database/connection.js`](database/connection.js) - New connection management

## Performance Monitoring

The health endpoints provide real-time metrics:
- Database connection status
- Query response times
- Connection pool utilization
- Memory usage
- Application uptime
