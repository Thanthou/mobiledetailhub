# Required Environment Variables for Render Deployment

## Database (Auto-configured by Render)
- `DATABASE_URL` - Automatically set by Render when linked to PostgreSQL service

## Required for Production
- `NODE_ENV=production` - Set in render.yaml
- `PORT=10000` - Set in render.yaml
- `JWT_SECRET` - Generate a secure random string
- `JWT_REFRESH_SECRET` - Generate a different secure random string

## External Services (Add in Render Dashboard)
- `GOOGLE_PAGESPEED_API_KEY` - For performance monitoring
- `SENDGRID_API_KEY` - For email notifications
- `STRIPE_SECRET_KEY` - For payment processing
- `ADMIN_EMAILS` - Comma-separated list of admin emails

## Optional
- `LOG_LEVEL=error` - For production logging
- `ALLOWED_ORIGINS` - CORS origins (defaults to thatsmartsite.com)

## How to Add in Render:
1. Go to your service dashboard
2. Click "Environment" tab
3. Add each variable with its value
4. Redeploy the service
