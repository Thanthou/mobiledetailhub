# Auth Schema Review

**Generated:** 2025-10-13  
**Database:** ThatSmartSite  
**Schema:** `auth`

---

## 📋 Table of Contents
1. [Overview](#overview)
2. [Tables Review](#tables-review)
3. [Issues & Recommendations](#issues--recommendations)
4. [Action Items](#action-items)

---

## Overview

The `auth` schema contains **4 tables** for authentication and security:

| Table | Purpose | Status |
|-------|---------|--------|
| `users` | Core user accounts & authentication | ✅ Schema file matches DB |
| `refresh_tokens` | Token management & rotation | ✅ Schema file matches DB |
| `user_sessions` | Active session tracking | ✅ Schema file matches DB |
| `login_attempts` | Security monitoring & rate limiting | ✅ Schema file matches DB |
| `token_blacklist` | ❌ **LEGACY FILE** - Not in database | 🔴 Delete schema file |

---

## Tables Review

### 1. `users` ✅

**Purpose:** Core user accounts, authentication, and profile management.

**Schema File:** `backend/database/schemas/auth/users.sql`

**Key Features:**
- ✅ Email authentication with verification
- ✅ Password hashing (stores hash only, never plaintext)
- ✅ Password reset flow (token + expiration)
- ✅ Phone number support with verification
- ✅ Account lockout protection (failed attempts + locked_until)
- ✅ Admin flag for elevated permissions
- ✅ Account status (active, suspended, disabled)
- ✅ Two-factor authentication support (secret + backup codes)
- ✅ Login tracking (last_login_at, last_login_ip)
- ✅ Flexible profile/preferences as JSONB
- ✅ Comprehensive indexing (email, phone, admin, status, dates)
- ✅ Auto-update trigger for `updated_at`
- ✅ Check constraints on account_status and failed_login_attempts

**Columns:**
```sql
id, email (unique), email_verified, email_verification_token, email_verification_expires_at,
name, phone, phone_verified, password_hash, password_reset_token, password_reset_expires_at,
is_admin, account_status, last_login_at, last_login_ip,
failed_login_attempts, locked_until, two_factor_enabled, two_factor_secret, two_factor_backup_codes,
profile_data, preferences, created_at, updated_at
```

**Status:** **EXCELLENT** - Production-ready with all modern auth features

**Security Features:**
- ✅ Account lockout after failed attempts
- ✅ Email verification required
- ✅ Two-factor authentication optional
- ✅ Password reset with expiring tokens
- ✅ IP tracking for suspicious activity
- ✅ Account suspension capability

---

### 2. `refresh_tokens` ✅

**Purpose:** Secure token management with rotation and revocation.

**Schema File:** `backend/database/schemas/auth/refresh_tokens.sql`

**Key Features:**
- ✅ Token rotation security (token_family, parent_token_id)
- ✅ Revocation tracking (is_revoked, revoked_at, revoked_reason)
- ✅ Device fingerprinting for security
- ✅ Token expiration management
- ✅ Geographic location tracking
- ✅ User agent tracking
- ✅ Foreign key to users with CASCADE delete
- ✅ Self-referencing FK for token rotation history
- ✅ Comprehensive indexing (user_id, token_hash, family, device, expiry)
- ✅ Auto-update trigger
- ✅ Check constraints on token_type and revoked_reason

**Columns:**
```sql
id, user_id, token_hash, token_family, token_type, user_agent, ip_address,
device_id, device_fingerprint, location_data, expires_at, revoked_at, revoked_reason,
is_revoked, is_rotated, parent_token_id, created_at, updated_at
```

**Status:** **EXCELLENT** - Industry-standard token security with rotation

**Security Features:**
- ✅ Token rotation prevents replay attacks
- ✅ Device fingerprinting detects stolen tokens
- ✅ Token families track rotation chains
- ✅ Revocation reasons for audit trails
- ✅ Automatic CASCADE delete when user deleted

**Note:** This table **REPLACES** the need for a separate `token_blacklist` table. Revoked tokens are marked with `is_revoked = true` and `revoked_at` timestamp.

---

### 3. `user_sessions` ✅

**Purpose:** Track active user sessions for concurrent session management.

**Schema File:** `backend/database/schemas/auth/user_sessions.sql`

**Key Features:**
- ✅ Session token tracking (unique constraint)
- ✅ Links to refresh_token for full token lifecycle
- ✅ Device and location tracking
- ✅ Active session flag (is_active)
- ✅ Last activity timestamp for idle timeout
- ✅ Session expiration management
- ✅ Foreign keys to users and refresh_tokens
- ✅ Comprehensive indexing
- ✅ Auto-update trigger

**Columns:**
```sql
id, user_id, session_token (unique), refresh_token_id, ip_address, user_agent,
device_id, device_fingerprint, location_data, is_active, last_activity_at, expires_at,
created_at, updated_at
```

**Status:** **GOOD** - Solid session management

**Use Cases:**
- Track all active sessions for a user
- Allow "logout from all devices" feature
- Detect concurrent logins from different locations
- Monitor session activity for security

---

### 4. `login_attempts` ✅

**Purpose:** Security monitoring, rate limiting, and suspicious activity detection.

**Schema File:** `backend/database/schemas/auth/login_attempts.sql`

**Key Features:**
- ✅ Tracks both successful and failed logins
- ✅ Detailed failure reasons (wrong_password, account_locked, etc.)
- ✅ IP address tracking for rate limiting
- ✅ User agent tracking
- ✅ Location data as JSONB
- ✅ Good indexing (email, IP, success, timestamp)
- ✅ Check constraint on failure_reason

**Columns:**
```sql
id, email, ip_address, user_agent, success, failure_reason, attempted_at, location_data
```

**Status:** **GOOD** - Essential for security monitoring

**Use Cases:**
- Rate limiting by IP address
- Brute force attack detection
- Account security alerts
- Login analytics
- Audit trail for compliance

---

### 5. `token_blacklist` 🔴 **LEGACY - NOT IN DATABASE**

**Schema File:** `backend/database/schemas/auth/token_blacklist.sql`

**Status:** ❌ **DELETE THIS FILE**

**Why:**
- Table does NOT exist in the database
- Functionality is handled by `refresh_tokens.is_revoked` instead
- Duplicate/redundant with better approach in `refresh_tokens`
- Causes confusion with outdated schema file

**Recommendation:** Delete `backend/database/schemas/auth/token_blacklist.sql`

---

## Issues & Recommendations

### 🔴 Critical Issues

**1. Legacy Schema File**
- **File:** `token_blacklist.sql`
- **Issue:** Table doesn't exist in database, but schema file exists
- **Fix:** Delete the schema file immediately
- **Impact:** Low (just cleanup)

---

### ⚠️ Medium Priority

**1. Missing Stripe Customer ID Link**

**Issue:** Users table has no `stripe_customer_id` field to link Stripe payments.

**Current:**
```sql
-- tenants.subscriptions has stripe_customer_id
-- But auth.users does NOT
```

**Recommendation:** Add `stripe_customer_id` to users table:

```sql
ALTER TABLE auth.users 
  ADD COLUMN stripe_customer_id VARCHAR(255) UNIQUE;

CREATE INDEX idx_users_stripe_customer_id 
  ON auth.users(stripe_customer_id);
```

**Why:** Makes it easy to look up user from Stripe webhooks.

---

**2. No Helper Functions for Common Operations**

**Missing:**
- Function to check if email is available
- Function to increment failed login attempts
- Function to lock account after N failed attempts
- Function to cleanup expired sessions/tokens

**Recommendation:** Add these helper functions (see suggestions below).

---

### 💡 Optimization Opportunities

#### 1. **Add Stripe Integration Column**

```sql
-- Migration to add Stripe customer ID
ALTER TABLE auth.users 
  ADD COLUMN IF NOT EXISTS stripe_customer_id VARCHAR(255) UNIQUE;

CREATE INDEX IF NOT EXISTS idx_users_stripe_customer_id 
  ON auth.users(stripe_customer_id);

COMMENT ON COLUMN auth.users.stripe_customer_id IS 
  'Stripe customer ID for payment processing';
```

---

#### 2. **Add Helper Functions**

```sql
-- Check if email is available
CREATE OR REPLACE FUNCTION auth.is_email_available(p_email VARCHAR)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN NOT EXISTS (SELECT 1 FROM auth.users WHERE email = p_email);
END;
$$ LANGUAGE plpgsql;

-- Increment failed login attempts
CREATE OR REPLACE FUNCTION auth.record_failed_login(p_email VARCHAR)
RETURNS VOID AS $$
BEGIN
    UPDATE auth.users 
    SET failed_login_attempts = failed_login_attempts + 1,
        last_login_at = CURRENT_TIMESTAMP
    WHERE email = p_email;
    
    -- Lock account after 5 failed attempts for 30 minutes
    UPDATE auth.users
    SET locked_until = CURRENT_TIMESTAMP + INTERVAL '30 minutes'
    WHERE email = p_email 
      AND failed_login_attempts >= 5
      AND locked_until IS NULL;
END;
$$ LANGUAGE plpgsql;

-- Reset failed login attempts on successful login
CREATE OR REPLACE FUNCTION auth.record_successful_login(
    p_user_id INTEGER,
    p_ip_address INET
)
RETURNS VOID AS $$
BEGIN
    UPDATE auth.users 
    SET failed_login_attempts = 0,
        locked_until = NULL,
        last_login_at = CURRENT_TIMESTAMP,
        last_login_ip = p_ip_address
    WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql;

-- Cleanup expired tokens and sessions
CREATE OR REPLACE FUNCTION auth.cleanup_expired_data()
RETURNS TABLE(
    expired_tokens INTEGER,
    expired_sessions INTEGER
) AS $$
DECLARE
    token_count INTEGER;
    session_count INTEGER;
BEGIN
    -- Delete expired refresh tokens
    DELETE FROM auth.refresh_tokens 
    WHERE expires_at < CURRENT_TIMESTAMP AND is_revoked = false;
    GET DIAGNOSTICS token_count = ROW_COUNT;
    
    -- Delete expired sessions
    DELETE FROM auth.user_sessions 
    WHERE expires_at < CURRENT_TIMESTAMP;
    GET DIAGNOSTICS session_count = ROW_COUNT;
    
    RETURN QUERY SELECT token_count, session_count;
END;
$$ LANGUAGE plpgsql;

-- Revoke all tokens for a user (logout from all devices)
CREATE OR REPLACE FUNCTION auth.revoke_all_user_tokens(p_user_id INTEGER)
RETURNS INTEGER AS $$
DECLARE
    revoked_count INTEGER;
BEGIN
    UPDATE auth.refresh_tokens 
    SET is_revoked = true,
        revoked_at = CURRENT_TIMESTAMP,
        revoked_reason = 'admin_revoke'
    WHERE user_id = p_user_id 
      AND is_revoked = false;
    
    GET DIAGNOSTICS revoked_count = ROW_COUNT;
    
    UPDATE auth.user_sessions 
    SET is_active = false
    WHERE user_id = p_user_id;
    
    RETURN revoked_count;
END;
$$ LANGUAGE plpgsql;
```

---

#### 3. **Add Composite Indexes for Common Queries**

```sql
-- Find active sessions for a user
CREATE INDEX idx_user_sessions_user_active 
  ON auth.user_sessions(user_id, is_active) 
  WHERE is_active = true;

-- Find non-revoked tokens for a user
CREATE INDEX idx_refresh_tokens_user_active 
  ON auth.refresh_tokens(user_id, is_revoked, expires_at) 
  WHERE is_revoked = false;

-- Find recent failed login attempts by email
CREATE INDEX idx_login_attempts_email_recent 
  ON auth.login_attempts(email, attempted_at DESC, success) 
  WHERE success = false;
```

---

#### 4. **Add Missing Foreign Key**

**Issue:** `login_attempts` doesn't reference `users` table.

**Current:** Just stores email as string (can have orphaned records)

**Recommendation:** Add optional user_id:

```sql
ALTER TABLE auth.login_attempts 
  ADD COLUMN user_id INTEGER;

CREATE INDEX idx_login_attempts_user_id 
  ON auth.login_attempts(user_id);

-- Optional FK (nullable to allow failed attempts for non-existent users)
ALTER TABLE auth.login_attempts 
  ADD CONSTRAINT fk_login_attempts_user_id 
  FOREIGN KEY (user_id) 
  REFERENCES auth.users(id) 
  ON DELETE SET NULL;
```

---

## Action Items

### Priority 1 (Do Now)
- [ ] Delete `token_blacklist.sql` schema file (legacy, not in database)
- [ ] Add `stripe_customer_id` column to `users` table

### Priority 2 (Do Soon)
- [ ] Add helper functions for common auth operations
- [ ] Add composite indexes for performance
- [ ] Add `user_id` to `login_attempts` table

### Priority 3 (Nice to Have)
- [ ] Setup scheduled job to cleanup expired tokens/sessions
- [ ] Add database views for common queries (active sessions, recent logins, etc.)
- [ ] Consider adding email/SMS notification triggers for suspicious logins

---

## Summary

**Overall Assessment:** ✅ **EXCELLENT**

The auth schema is well-designed with:
- ✅ Modern token rotation security
- ✅ Comprehensive session tracking
- ✅ Security monitoring (login attempts)
- ✅ Two-factor authentication support
- ✅ Account lockout protection
- ✅ Proper foreign keys and CASCADE behavior
- ✅ Good indexing strategy
- ✅ Auto-update triggers

**Minor issues:**
- 🔴 One legacy schema file to delete (`token_blacklist.sql`)
- ⚠️ Missing Stripe integration column
- 💡 Could benefit from helper functions

**Security posture:** Strong - implements industry best practices for authentication and token management.

---

**Next Steps:**
1. Delete legacy `token_blacklist.sql` file
2. Add Stripe customer ID column
3. Add helper functions for common operations
4. Move to next schema review (system, customers, etc.)

