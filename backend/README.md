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

- `GET /api/health` - Health check with database status
- `GET /api/service_areas` - Get service areas (with fallback data)
- `GET /api/test-db` - Test database connection
- `GET /api/test` - Test endpoint

## Troubleshooting

If you get database connection errors:
1. Check if PostgreSQL is running
2. Verify DATABASE_URL in .env file
3. Ensure the database exists
4. Check the server logs for detailed error messages
