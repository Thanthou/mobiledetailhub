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
- `GET /api/health/ready` - Readiness check (database connectivity)
- `GET /api/health/db-status` - Database connection status only
- `GET /api/health/test-db` - Simple database connection test


### Core Services
- `GET /api/service_areas` - Get service areas (with fallback data)
- `GET /api/test` - Test endpoint

## Database Connection Features

### ✅ **Simple & Reliable**
- **Single pool**: Global PostgreSQL pool configured from `DATABASE_URL`
- **Fast boot**: 1-second database ping on startup, fails fast if unavailable
- **Direct queries**: Simple `pool.query()` calls throughout the application

### ✅ **Built-in PostgreSQL Management** 
- **Auto-reconnection**: PostgreSQL driver handles connection recovery
- **Pool management**: Automatic connection pooling with configurable limits
- **Graceful shutdown**: Clean pool closure with `pool.end()`

### ✅ **Developer Tools**
- **Timeout helper**: `query()` function with per-call timeout (default 5s)
- **Health endpoints**: Fast readiness checks with 250ms timeout
- **Environment validation**: DATABASE_URL format and SSL validation

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
- **Checks**: Database connectivity with 250ms timeout

#### Usage Examples
```bash
# Liveness check (always 200 if process is up)
curl http://localhost:3001/api/health/live

# Readiness check (200 if ready, 503 if not ready)
curl http://localhost:3001/api/health/ready

# Comprehensive health check
curl http://localhost:3001/api/health

# Database status  
curl http://localhost:3001/api/health/db-status
```



### Database Configuration
Simple pool configuration using PostgreSQL's built-in connection management:
- **Connection string**: Single `DATABASE_URL` environment variable
- **Pool limits**: 20 max connections, 30s idle timeout, 10s connection timeout
- **SSL support**: Automatic SSL enablement in production environments
- **Error handling**: Simple logging via `pool.on('error')` event

## Database Usage

### Direct Pool Usage (Recommended)
```javascript
const pool = require('./database/pool');

// Simple query
const result = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);

// With transaction
const client = await pool.connect();
try {
  await client.query('BEGIN');
  await client.query('INSERT INTO users (name) VALUES ($1)', [name]);
  await client.query('COMMIT');
} finally {
  client.release();
}
```

### With Timeout Helper
```javascript
const { query } = require('./utils/db');

// Query with 3-second timeout
const result = await query('SELECT * FROM users', [], { timeoutMs: 3000 });
```

### Migration Guide
- [`docs/DATABASE_CONNECTION_MIGRATION.md`](docs/DATABASE_CONNECTION_MIGRATION.md) - Migration from complex connection manager
- [`utils/dbHelper.js`](utils/dbHelper.js) - Legacy helper utilities (still supported)
- [`database/pool.js`](database/pool.js) - Simple pool configuration

## Performance Monitoring

The health endpoints provide simple, fast metrics:
- **Live endpoint**: Process responsiveness (always 200 if running)
- **Ready endpoint**: Database ping with 250ms timeout (200/503)
- **Health endpoint**: Query timing and basic pool metrics
- **Pool status**: Connection counts (total, idle, waiting)
