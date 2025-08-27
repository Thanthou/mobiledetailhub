# Admin Password Setup

## Overview
The admin password is no longer hardcoded in the source code. Instead, it's now dynamically generated from an environment variable.

## Environment Variable
Add the following to your `.env` file:

```bash
ADMIN_PASSWORD=your_secure_password_here
```

## Default Behavior
If `ADMIN_PASSWORD` is not set, the system will use a default password: `admin123`

## Security Recommendations
1. Use a strong, unique password
2. Change the default password immediately after first login
3. Store the password securely (not in version control)
4. Consider using a password manager

## How It Works
- The password is hashed using bcrypt with a salt rounds of 10
- The hash is generated dynamically when the database is initialized
- No password hashes are stored in the source code

## Example .env Entry
```bash
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=MobileDetailHub
DB_USER=postgres
DB_PASSWORD=your_db_password

# Admin Configuration
ADMIN_PASSWORD=MySecureAdminPassword123!

# JWT Configuration
JWT_SECRET=your_jwt_secret_here
```
