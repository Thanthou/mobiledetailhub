# CORS Security Setup

## Overview
This document explains the CORS (Cross-Origin Resource Sharing) configuration implemented to prevent token leakage and secure the API endpoints.

## Security Features

### ✅ Origin Restriction
- **Production**: Only allows domains specified in `ALLOWED_ORIGINS`
- **Staging**: Allows staging domains + localhost for testing
- **Development**: Allows localhost and common dev ports

### ✅ Method Restriction
- Only allows: `GET`, `POST`, `PUT`, `DELETE`, `OPTIONS`

### ✅ Header Restriction
- Only allows: `Content-Type`, `Authorization`

### ✅ Credentials Disabled
- `credentials: false` prevents token leakage via cookies

## Environment Variables

### Required in Production
```bash
NODE_ENV=production
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

### Optional in Development/Staging
```bash
NODE_ENV=development
# ALLOWED_ORIGINS not required - uses localhost defaults
```

## Example .env Configurations

### Production
```bash
NODE_ENV=production
ALLOWED_ORIGINS=https://mobile-detail-hub.com,https://www.mobile-detail-hub.com
```

### Staging
```bash
NODE_ENV=staging
ALLOWED_ORIGINS=https://staging.mobile-detail-hub.com
```

### Development
```bash
NODE_ENV=development
# Uses localhost defaults automatically
```

## Security Benefits

1. **Prevents Token Leakage**: No credentials sent cross-origin
2. **Origin Validation**: Only trusted domains can access the API
3. **Method Limiting**: Restricts HTTP methods to necessary ones
4. **Header Control**: Prevents injection of malicious headers
5. **Environment Awareness**: Different security levels per environment

## Testing

### Local Development
- ✅ `http://localhost:3000` → Allowed
- ✅ `http://localhost:5173` → Allowed (Vite default)
- ❌ `http://malicious-site.com` → Blocked

### Production
- ✅ `https://yourdomain.com` → Allowed (if in ALLOWED_ORIGINS)
- ❌ `http://localhost:3000` → Blocked
- ❌ `https://malicious-site.com` → Blocked

## Troubleshooting

### CORS Errors
If you see CORS errors:
1. Check `NODE_ENV` is set correctly
2. Verify `ALLOWED_ORIGINS` includes your domain (production)
3. Ensure your frontend origin matches allowed origins

### Adding New Domains
To allow a new domain in production:
1. Add to `ALLOWED_ORIGINS` environment variable
2. Restart the server
3. Test the endpoint from the new domain
