# Repo Checks Report

- ✅ **dev_env_hosts_proxy** — Dev hub proxies by host; .port-registry.json present; hosts documented
  - Pointers: .port-registry.json, devtools/dev-hub.js, docs/frontend/DEV_SETUP.md
- ✅ **request_logger_correlation** — Request logger assigns correlation ID and logs via on-finished
  - Pointers: backend/middleware/requestLogger.js
- ✅ **auth_access_ttl** — Access token TTL ≤ 1h (ideally 15m)
  - Pointers: backend/config/auth.js
  - Recommendation: Use 15m for ACCESS_EXPIRES_IN
- ✅ **auth_refresh_rotation** — Refresh flow invalidates old token and issues new one
  - Pointers: backend/services/authService.js, backend/controllers/authController.js
- ✅ **auth_csrf_boundary** — Refresh endpoint has origin/CSRF/samesite guard
  - Pointers: backend/controllers/authController.js, backend/config/auth.js
- ❌ **env_fail_fast** — env.async.js throws in production if JWT secrets missing
  - Pointers: backend/config/env.async.js
- ✅ **domains_flow** — Domain availability/status endpoints present; verify TODO noted
  - Pointers: backend/controllers/domainController.js
- ✅ **dashboard_filters_pagination** — getDateFilter + pagination + tenant guard
  - Pointers: backend/controllers/tenantDashboardController.js, backend/middleware/withTenant.js