# Backend Structure

## Overview
The backend has been refactored from a single `server.js` file into a modular structure for better maintainability and organization.

## Directory Structure
```
backend/
├── server.js                 # Main server entry point
├── database/
│   └── connection.js         # Database connection setup
├── middleware/
│   └── auth.js              # Authentication middleware
├── routes/
│   ├── health.js            # Health check endpoints
│   ├── serviceAreas.js      # Service areas endpoints
│   ├── auth.js              # Authentication endpoints
│   ├── affiliates.js        # Affiliate endpoints
│   ├── mdhConfig.js         # MDH config endpoints
│   ├── clients.js           # Client endpoints
│   └── admin.js             # Admin dashboard
├── utils/
│   └── databaseInit.js      # Database initialization utilities
└── package.json
```

## Key Benefits

### 1. **Separation of Concerns**
- Each route file handles one specific domain
- Database connection is centralized
- Authentication logic is reusable

### 2. **Easier Maintenance**
- Find and fix issues faster
- Add new features without touching existing code
- Better code organization

### 3. **Testing**
- Test individual modules in isolation
- Mock dependencies easily
- Better test coverage

### 4. **Team Collaboration**
- Multiple developers can work on different modules
- Reduced merge conflicts
- Clear ownership of code

## Route Modules

### `/api/health`
- `GET /` - Health check with database status
- `GET /test` - Simple test endpoint
- `GET /test-db` - Database connection test

### `/api/service_areas`
- `GET /` - Get all service areas (with fallback data)

### `/api/auth`
- `POST /register` - User registration
- `POST /login` - User login
- `GET /me` - Get current user (protected)
- `POST /logout` - Logout
- `POST /promote-admin` - Promote users to admin

### `/api/affiliates`
- `GET /slugs` - Get all affiliate slugs
- `GET /lookup` - Lookup affiliates by location
- `POST /update-zip` - Update zip codes
- `GET /:slug` - Get affiliate by slug
- `GET /:slug/field/:field` - Get specific affiliate field
- `GET /:slug/service_areas` - Get affiliate service areas

### `/api/mdh-config`
- `GET /` - Get MDH configuration
- `GET /field/:field` - Get specific config field

### `/api/clients`
- `GET /` - Get clients
- `GET /field/:field` - Get specific client field

### `/admin`
- `GET /` - Admin dashboard (protected)
- `POST /query` - Run custom SQL queries (protected)

## Database Initialization

The `utils/databaseInit.js` module automatically:
1. Creates all necessary tables if they don't exist
2. Inserts sample service areas data
3. Sets up basic MDH configuration

## Running the Server

```bash
# Development (with auto-restart)
npm run dev

# Production
npm start
```

## Environment Variables

Create a `.env` file in the backend directory:

```bash
DATABASE_URL=postgresql://username:password@localhost:5432/database_name
JWT_SECRET=your-secret-key-here
ADMIN_EMAILS=admin@example.com,admin2@example.com
PORT=3001
```

## Adding New Features

1. **New Route**: Create a new file in `routes/`
2. **New Middleware**: Add to `middleware/`
3. **New Database Table**: Add to `utils/databaseInit.js`
4. **Import and Use**: Add to `server.js`

## Migration from Old Structure

The old monolithic `server.js` has been completely replaced. All functionality has been preserved and organized into logical modules.
