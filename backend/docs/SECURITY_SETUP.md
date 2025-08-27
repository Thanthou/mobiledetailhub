# Security Setup Guide

## Critical Security Requirements

This application requires the following environment variables to be properly configured for security:

### Required Environment Variables

Create a `.env` file in the backend directory with the following variables:

```bash
# Database Configuration
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=your_secure_password_here
DB_NAME=MobileDetailHub
DB_PORT=5432

# JWT Configuration (CRITICAL)
JWT_SECRET=your_very_long_random_jwt_secret_key_here

# Admin Configuration
ADMIN_EMAILS=admin@example.com,another@example.com

# Server Configuration
PORT=3001
NODE_ENV=development
```
