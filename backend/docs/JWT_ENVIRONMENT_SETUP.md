# JWT Environment Setup Guide

## Overview

This guide will help you set up the environment variables and database migration required for the new JWT security system.

## Step 1: Environment Variables Setup

### 1.1 Create/Update Backend .env File

Create a `.env` file in your `backend/` directory (if it doesn't exist) or add the new variables to your existing one:

```bash
# Navigate to backend directory
cd backend

# Create .env file (if it doesn't exist)
touch .env
```

### 1.2 Add Required Environment Variables

Add these variables to your `backend/.env` file:

```bash
# Database Configuration (your existing variables)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=MobileDetailHub
DB_USER=postgres
DB_PASSWORD=your_database_password_here

# JWT Configuration (REQUIRED for new security system)
JWT_SECRET=your_jwt_secret_key_here_make_it_long_and_secure
JWT_REFRESH_SECRET=your_refresh_token_secret_key_here_different_from_jwt_secret

# Server Configuration
PORT=3001
NODE_ENV=development

# Admin Configuration
ADMIN_EMAILS=admin@example.com,another@example.com
ADMIN_PASSWORD=admin123

# Optional: Logging
LOG_LEVEL=info
```

### 1.3 Generate Secure Secrets

**IMPORTANT**: Generate unique, secure secrets for both JWT keys:

```bash
# Option 1: Using Node.js (recommended)
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Option 2: Using OpenSSL
openssl rand -hex 64

# Option 3: Online generator (less secure, use only for development)
# https://generate-secret.vercel.app/64
```

**Example generated secrets:**
```bash
JWT_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2g3h4i5j6k7l8m9n0o1p2q3r4s5t6u7v8w9x0y1z2
JWT_REFRESH_SECRET=b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2g3h4i5j6k7l8m9n0o1p2q3r4s5t6u7v8w9x0y1z2a3
```

## Step 2: Database Migration

### 2.1 Run the Migration Script

Execute the SQL script to create the `refresh_tokens` table:

```bash
# Connect to your PostgreSQL database
psql -U your_username -d your_database_name

# Run the migration script
\i backend/scripts/add_refresh_tokens_table.sql

# Verify the table was created
\d refresh_tokens

# Check indexes
\di refresh_tokens*

# Exit psql
\q
```

### 2.2 Alternative: Run from Command Line

```bash
# Run migration directly from command line
psql -U your_username -d your_database_name -f backend/scripts/add_refresh_tokens_table.sql
```

### 2.3 Verify Migration Success

Check that the table was created successfully:

```sql
-- Check table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'refresh_tokens';

-- Check if cleanup function exists
SELECT routine_name, routine_type 
FROM information_schema.routines 
WHERE routine_name = 'cleanup_expired_refresh_tokens';
```

## Step 3: Test the Setup

### 3.1 Start Your Backend Server

```bash
cd backend
npm start
```

### 3.2 Check Environment Validation

Your server should start without environment variable errors. Look for this message in the logs:

```
✅ Environment variables validated successfully
```

### 3.3 Test JWT Endpoints

Test the new JWT security system:

```bash
# Test registration (should return both access and refresh tokens)
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "testpassword123",
    "name": "Test User",
    "phone": "1234567890"
  }'

# Expected response should include:
# - accessToken
# - refreshToken
# - expiresIn
# - refreshExpiresIn
```

## Step 4: Environment Variable Validation

### 4.1 Check Required Variables

The system will automatically validate these variables on startup:

- ✅ `DB_HOST` - Database host
- ✅ `DB_PORT` - Database port  
- ✅ `DB_NAME` - Database name
- ✅ `DB_USER` - Database username
- ✅ `DB_PASSWORD` - Database password
- ✅ `JWT_SECRET` - JWT access token secret
- ✅ `JWT_REFRESH_SECRET` - JWT refresh token secret

### 4.2 Optional Variables

These are optional but recommended:

- `PORT` - Server port (defaults to 3001)
- `NODE_ENV` - Environment (defaults to development)
- `ADMIN_EMAILS` - Comma-separated admin email list
- `ADMIN_PASSWORD` - Admin password (defaults to admin123)
- `LOG_LEVEL` - Logging level (defaults to info)

## Troubleshooting

### Common Issues

#### 1. "JWT_REFRESH_SECRET environment variable not configured"

**Solution**: Add `JWT_REFRESH_SECRET` to your `.env` file

#### 2. "Database connection not available"

**Solution**: Check your database credentials and ensure PostgreSQL is running

#### 3. "relation 'refresh_tokens' does not exist"

**Solution**: Run the database migration script

#### 4. Environment variables not loading

**Solution**: Ensure your `.env` file is in the `backend/` directory and restart the server

### Debug Mode

Enable debug logging to troubleshoot issues:

```bash
# Set debug environment variable
export DEBUG=jwt:*
export LOG_LEVEL=debug

# Start server
npm start
```

## Security Notes

### 1. Secret Generation

- **Never use the example secrets** shown in this guide
- **Generate unique secrets** for each environment (dev, staging, prod)
- **Use at least 64 characters** for production secrets
- **Store secrets securely** and never commit them to version control

### 2. Environment Separation

- **Development**: Use simple secrets for local development
- **Staging**: Use different secrets from development
- **Production**: Use cryptographically strong, unique secrets

### 3. Secret Rotation

- **Rotate secrets regularly** in production environments
- **Plan for secret updates** without service disruption
- **Monitor for secret exposure** in logs and error messages

## Next Steps

After completing this setup:

1. ✅ **Test authentication endpoints** to ensure JWT security is working
2. ✅ **Update frontend** to handle token pairs and automatic refresh
3. ✅ **Monitor logs** for any JWT-related errors
4. ✅ **Test token expiration** and refresh functionality
5. ✅ **Verify logout** and token revocation

## Support

If you encounter issues:

1. Check the server logs for specific error messages
2. Verify all environment variables are set correctly
3. Ensure the database migration completed successfully
4. Check that PostgreSQL is running and accessible
5. Review the JWT security documentation for additional details
