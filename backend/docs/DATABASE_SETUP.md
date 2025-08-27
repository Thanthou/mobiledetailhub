# Database Setup

## Environment Variables

To avoid hardcoded database credentials, create a `.env` file in the backend directory with the following variables:

```bash
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=MobileDetailHub
DB_USER=postgres
DB_PASSWORD=your_actual_password_here

# Alternative: You can also set DATABASE_URL directly
DATABASE_URL=postgresql://username:password@host:port/database
```

## Setup Instructions

1. Copy the `.env.example` file to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit the `.env` file with your actual database credentials

3. Restart your server

## Security Notes

- Never commit `.env` files to version control
- The `.env` file is already in `.gitignore`
- Use strong, unique passwords for production databases
- Consider using a secrets management service for production environments
