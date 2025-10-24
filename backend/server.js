/**
 * That Smart Site - Backend Server Entry Point
 * 
 * This is a simple loader that delegates to the modular bootstrap system.
 * All startup logic lives in backend/bootstrap/ for maintainability.
 * 
 * Bootstrap phases:
 * 1. loadEnv.js        - Environment validation
 * 2. setupSecurity.js  - Helmet, CORS, body parsing
 * 3. setupMiddleware.js - Logging, tenants, rate limiting
 * 4. setupRoutes.js    - API route mounting
 * 5. setupErrors.js    - Global error handler
 * 6. server.start.js   - Static assets & server startup
 */

import './bootstrap/server.start.js';
