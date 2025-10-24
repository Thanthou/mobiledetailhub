// backend/bootstrap/setupErrors.js
import { errorHandler } from '../middleware/errorHandler.js';

export function setupErrors(app) {
  // NO custom 404 handler - Express's finalhandler works correctly now
  // that asyncHandler properly returns promises
  
  // Global error handler (catches actual errors, must be last)
  app.use((err, req, res, next) => {
    console.log('🔴 ERROR HANDLER HIT:', err.message);
    errorHandler(err, req, res, next);
  });

  console.log('🩹 Error handler active');
  console.log('   ✓ Global error handler (asyncHandler now returns promises)');
  console.log('   ✓ Express finalhandler will handle 404s correctly');
}

