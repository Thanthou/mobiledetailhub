# Dependencies Audit Report

**Generated:** 2025-10-21T21:26:33.539Z
**Duration:** 4967ms
**Score:** 80/100

---

## Summary

- ✅ **Passed:** 10
- ⚠️  **Warnings:** 0
- ❌ **Errors:** 2

## Description

Validates file dependencies, npm packages, circular dependencies, hosts file entries, and port availability.

## Issues Found

### 🔴 Critical Errors

1. **@babel/parser not installed**
   - Path: `scripts\audits\audit-flows.js`
   - Details: Run: npm install

2. **@babel/traverse not installed**
   - Path: `scripts\audits\audit-flows.js`
   - Details: Run: npm install

---

## Detailed Log


## Required Files

✅ .port-registry.json exists
✅ .env exists

## NPM Dependencies

❌ **ERROR**: @babel/parser not installed
   - Path: `scripts\audits\audit-flows.js`
❌ **ERROR**: @babel/traverse not installed
   - Path: `scripts\audits\audit-flows.js`

## Circular Dependencies

✅ Analyzed 623 files
✅ No circular dependencies detected

## Hosts File

✅ All required hosts entries present

## Port Availability

✅ Port 5175 (main) is available
✅ Port 5176 (admin) is available
✅ Port 5177 (tenant) is available
✅ Port 3001 (backend) is available
✅ All registered ports are available

---

## Recommendations

1. Ensure .port-registry.json and .env files exist
2. Install all missing npm packages
3. Resolve circular dependencies in frontend code
4. Add required entries to hosts file (admin.localhost, tenant.localhost)
5. Free up ports in use or update port registry
6. Run: npm install to fix missing dependencies
