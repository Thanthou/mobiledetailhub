# Environment Configuration Template

Copy this to `.env` in the root directory and update with your values:

```bash
# Environment Configuration
# Copy this to .env and update with your values

# Node Environment
NODE_ENV=development

# Database Configuration
# Note: Ports will be dynamically assigned, but you can override with PORT=3001
DATABASE_URL=postgresql://postgres:password@localhost:5432/ThatSmartSite
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ThatSmartSite
DB_USER=postgres
DB_PASSWORD=password

# Backend Configuration
# PORT will be dynamically assigned (3001, 3002, 3003...)
# You can override with: PORT=3001
# PORT=3001

# Frontend Configuration
# FRONTEND_URL will be dynamically assigned (5175, 5176, 5177...)
# You can override with: FRONTEND_URL=http://localhost:5175
# FRONTEND_URL=http://localhost:5175

# API Configuration
VITE_API_URL_LOCAL=http://localhost:3001
VITE_API_URL_LIVE=https://thatsmartsite.com

# Domain Configuration
BASE_DOMAIN=thatsmartsite.com

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d

# Email Configuration (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Stripe Configuration (Optional)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Google APIs (Optional)
GOOGLE_PAGESPEED_API_KEY=your-pagespeed-api-key
GOOGLE_CRUX_API_KEY=your-crux-api-key

# Logging
LOG_LEVEL=info
```

## Dynamic Port Assignment

The system now automatically assigns ports:

- **Backend**: Starts at 3001, increments if busy (3002, 3003, etc.)
- **Frontend**: Starts at 5175, increments if busy (5176, 5177, etc.)

You can override these by setting `PORT=3001` or `FRONTEND_URL=http://localhost:5175` in your `.env` file.
