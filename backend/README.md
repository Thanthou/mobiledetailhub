# JPS Backend API

Backend server for JPS Detailing website handling contact forms, quote requests, and email notifications.

## Features

- ✅ Contact form submissions with email notifications
- ✅ Quote request handling
- ✅ Rate limiting for security
- ✅ CORS configuration
- ✅ Email notifications via Gmail or custom SMTP
- ✅ Input validation
- ✅ Error handling

## Setup

1. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Configure environment variables:**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` with your email settings:
   - For Gmail: Use app password (not regular password)
   - For custom SMTP: Configure host, port, and credentials

3. **Start the server:**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## API Endpoints

### Health Check
- `GET /api/health` - Check if server is running

### Contact Form
- `POST /api/contact`
  - Body: `{ name, email, phone?, message, service? }`
  - Sends email notification

### Quote Request
- `POST /api/quote`
  - Body: `{ name, email, phone?, vehicle, service, additionalInfo?, preferredDate? }`
  - Sends email notification

## Email Configuration

### Gmail Setup (Recommended)
1. Enable 2-factor authentication
2. Generate app password
3. Use app password in `EMAIL_PASS`

### Custom SMTP
Configure your SMTP settings in `.env`:
```
EMAIL_SERVICE=custom
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-password
```

## Deployment

### Vercel
The backend is configured to work with Vercel. The main server file is `server.js`.

### Environment Variables for Production
Set these in your Vercel dashboard:
- `EMAIL_SERVICE`
- `EMAIL_USER`
- `EMAIL_PASS`
- `NOTIFICATION_EMAIL`
- `FRONTEND_URL`

## Security Features

- Rate limiting (100 requests per 15 minutes)
- Helmet.js for security headers
- Input validation
- CORS protection
- Error handling

## Development

```bash
# Start with nodemon (auto-restart on changes)
npm run dev

# Check server health
curl http://localhost:3001/api/health
``` 