# Environment Setup Guide

## Overview
This guide explains how to configure environment variables for the Mobile Detail Hub backend.

## Required Environment Variables

### Database Configuration
You must provide **either** individual database variables **OR** a full DATABASE_URL:

#### Option 1: Individual Database Variables
```bash
DB_HOST=localhost
DB_PORT=5432
DB_NAME=MobileDetailHub
DB_USER=postgres
DB_PASSWORD=your_database_password
```

#### Option 2: Full Database URL
```bash
DATABASE_URL=postgresql://username:password@host:port/database
```

### JWT Configuration
```bash
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
```

## Optional Environment Variables

### Server Configuration
```bash
PORT=3001                    # Defaults to 3001
NODE_ENV=development         # Defaults to 'development'
```

### Admin Configuration
```bash
ADMIN_PASSWORD=your_secure_admin_password  # Defaults to 'admin123'
```

## Complete .env Example
```bash
# ========================================
# REQUIRED: Database Configuration
# ========================================
DB_HOST=localhost
DB_PORT=5432
DB_NAME=MobileDetailHub
DB_USER=postgres
DB_PASSWORD=your_database_password

# ========================================
# REQUIRED: JWT Configuration
# ========================================
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random

# ========================================
# OPTIONAL: Server Configuration
# ========================================
PORT=3001
NODE_ENV=development

# ========================================
# OPTIONAL: Admin Configuration
# ========================================
ADMIN_PASSWORD=your_secure_admin_password
```

## Validation
The application will validate all required environment variables on startup. If any are missing, the server will:
1. Display a clear error message listing missing variables
2. Exit with error code 1
3. Provide helpful descriptions for each missing variable

## Security Notes
- Never commit `.env` files to version control
- Use strong, unique passwords
- Generate a random, long JWT_SECRET
- Consider using a password manager for credentials
