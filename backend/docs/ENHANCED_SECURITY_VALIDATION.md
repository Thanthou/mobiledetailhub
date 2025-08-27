# Enhanced Security Validation

## Overview
The environment validator has been enhanced to enforce strong secret policies and block weak defaults at startup, particularly in production environments.

## New Security Features

### 1. JWT Secret Validation
- **Minimum Length**: JWT secrets must be ≥32 characters
- **Entropy Check**: Minimum entropy of 3.5 for strong randomness
- **Weak Pattern Detection**: Blocks common weak patterns like `admin123`, `password`, `secret`, etc.
- **Character Distribution**: Prevents secrets with >50% repeated characters

### 2. Admin Password Validation
- **Minimum Length**: Admin passwords must be ≥12 characters
- **Entropy Check**: Minimum entropy of 3.0 for admin access
- **Weak Pattern Detection**: Same pattern blocking as JWT secrets

### 3. Production Environment Enforcement
- **Critical Blocking**: Weak secrets cause `process.exit(1)` in production
- **Warning Mode**: Development/staging shows warnings but allows startup
- **Clear Error Messages**: Detailed feedback on what needs to be fixed

## Validation Rules

### JWT Secrets (JWT_SECRET, JWT_REFRESH_SECRET)
```
✅ Strong: K8x#mP9$vL2@nQ7&hF4!jR5*wE8^sA3%tY6#uI1&oP9$kL4@mN7!hF2^jR5*wE8
❌ Weak: admin123admin123admin123admin123 (pattern detected)
❌ Weak: weak (too short, low entropy)
❌ Weak: aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa (repeated characters)
```

### Admin Password
```
✅ Strong: Str0ng!P@ssw0rd2024
❌ Weak: admin123 (pattern detected)
❌ Weak: password (pattern detected)
❌ Weak: 123456789 (too short, low entropy)
```

## Usage

### Development/Staging
- Weak secrets generate warnings but allow startup
- Use for testing and development

### Production
- Weak secrets block startup with `process.exit(1)`
- Must use strong, unique secrets
- Clear error messages guide remediation

## Testing

Run the validation test script:
```bash
node backend/scripts/test_env_validation.js
```

## Environment Variables

### Required Strong Secrets
```bash
JWT_SECRET=your-strong-jwt-secret-here-min-32-chars
JWT_REFRESH_SECRET=your-strong-refresh-secret-here-min-32-chars
ADMIN_PASSWORD=your-strong-admin-password-here-min-12-chars
```

### Example Strong Secrets
```bash
# JWT Secrets (64+ characters, mixed case, symbols, numbers)
JWT_SECRET=K8x#mP9$vL2@nQ7&hF4!jR5*wE8^sA3%tY6#uI1&oP9$kL4@mN7!hF2^jR5*wE8
JWT_REFRESH_SECRET=Q9#wE2$rT7@yU4&iO1!pA6^sD9*fG3%hJ7#kL2&mN5$pQ8@rT1!uI4^oP7*wA0

# Admin Password (20+ characters, mixed case, symbols, numbers)
ADMIN_PASSWORD=Str0ng!P@ssw0rd2024#Secure
```

## Security Benefits

1. **Prevents Weak Defaults**: Blocks common weak patterns
2. **Enforces Length**: Ensures sufficient secret complexity
3. **Entropy Validation**: Measures actual randomness, not just length
4. **Production Hardening**: Critical blocking in production environments
5. **Clear Feedback**: Detailed error messages for quick remediation

## Implementation Details

- **Entropy Calculation**: Uses Shannon entropy formula for randomness measurement
- **Pattern Detection**: Regex-based detection of common weak patterns
- **Character Analysis**: Prevents character repetition attacks
- **Environment Awareness**: Different behavior for dev vs production
- **Graceful Degradation**: Warnings in dev, blocking in production
