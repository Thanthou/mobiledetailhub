# Dependencies Audit Report

**Generated:** 2025-10-24T06:47:28.348Z
**Duration:** 7099ms
**Score:** 97/100

---

## Summary

- ✅ **Passed:** 9
- ⚠️  **Warnings:** 1
- ❌ **Errors:** 0

## Description

Validates file dependencies, npm packages, circular dependencies, hosts file entries, and port availability.

## Issues Found

### 🟡 Warnings

1. **Port 3001 (backend) is already in use**
   - Details: Stop existing process or use different port

---

## Detailed Log


## Required Files

✅ .port-registry.json exists
✅ .env exists

## NPM Dependencies

✅ All dependencies installed

## Circular Dependencies

✅ Analyzed 1046 files
✅ No circular dependencies detected

## Hosts File

✅ All required hosts entries present

## Port Availability

✅ Port 5175 (main) is available
✅ Port 5176 (admin) is available
✅ Port 5177 (tenant) is available
⚠️ **WARNING**: Port 3001 (backend) is already in use

---

## Recommendations

1. Ensure .port-registry.json and .env files exist
2. Install all missing npm packages
3. Resolve circular dependencies in frontend code
4. Add required entries to hosts file (admin.localhost, tenant.localhost)
5. Free up ports in use or update port registry
6. Run: npm install to fix missing dependencies
