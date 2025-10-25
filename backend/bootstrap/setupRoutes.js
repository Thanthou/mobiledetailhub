// backend/bootstrap/setupRoutes.js
import { apiLimiter } from '../middleware/rateLimiter.js';
import healthRoutes from '../routes/health.js';
import authRoutes from '../routes/auth.js';
import tenantsRoutes from '../routes/tenants.js';
import domainRoutes from '../routes/domains.js';
import servicesRoutes from '../routes/services.js';
import reviewsRoutes from '../routes/reviews.js';
import galleryRoutes from '../routes/gallery.js';
import serviceAreasRoutes from '../routes/serviceAreas.js';
import locationsRoutes from '../routes/locations.js';
import customersRoutes from '../routes/customers.js';
import scheduleRoutes from '../routes/schedule.js';
import paymentsRoutes from '../routes/payments.js';
import analyticsRoutes from '../routes/analytics.new.js';
import googleAnalyticsRoutes from '../routes/googleAnalytics.js';
import googleReviewsRoutes from '../routes/googleReviews.js';
import googleAuthRoutes from '../routes/googleAuth.js';
import seoRoutes from '../routes/seo.js';
import configRoutes from '../routes/config.js';
import websiteContentRoutes from '../routes/websiteContent.js';
import adminRoutes from '../routes/admin.js';
import tenantDashboardRoutes from '../routes/tenantDashboard.js';
import tenantReviewsRoutes from '../routes/tenantReviews.js';
import tenantImagesRoutes from '../routes/tenantImages.js';
import tenantManifestRoutes from '../routes/tenantManifest.js';
import avatarRoutes from '../routes/avatar.js';
import previewRoutes from '../routes/previews.js';
import errorTrackingRoutes from '../routes/errorTracking.js';
import healthMonitoringRoutes from '../routes/healthMonitoring.js';
import performanceRoutes from '../routes/performance.js';

export function setupRoutes(app) {
  // Rate limiting for all API routes EXCEPT health (health must be fast for probes)
  // DISABLED in development to prevent double-count errors
  app.use('/api', (req, res, next) => {
    // Skip rate limiting entirely in development
    if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'dev') {
      return next();
    }
    // Skip rate limiting for health endpoints
    if (req.path.startsWith('/health')) {
      return next();
    }
    return apiLimiter(req, res, next);
  });
  
  // Health checks and monitoring (no auth, no rate limiting)
  app.use('/api/health', healthRoutes);
  app.use('/api/health-monitoring', healthMonitoringRoutes);

  // Performance monitoring (requires auth + admin)
  app.use('/api/performance', performanceRoutes);

  // Authentication
  app.use('/api/auth', authRoutes);
  app.use('/api/google/auth', googleAuthRoutes);

  // Tenant management
  app.use('/api/tenants', tenantsRoutes);
  app.use('/api/domains', domainRoutes);

  // Content management
  app.use('/api/services', servicesRoutes);
  app.use('/api/reviews', reviewsRoutes);
  app.use('/api/gallery', galleryRoutes);
  app.use('/api/service-areas', serviceAreasRoutes);
  app.use('/api/locations', locationsRoutes);
  app.use('/api/website-content', websiteContentRoutes);

  // Customer and scheduling
  app.use('/api/customers', customersRoutes);
  app.use('/api/schedule', scheduleRoutes);

  // Payments
  app.use('/api/payments', paymentsRoutes);

  // Analytics and SEO
  app.use('/api/analytics', analyticsRoutes);
  app.use('/api/google/analytics', googleAnalyticsRoutes);
  app.use('/api/google/reviews', googleReviewsRoutes);
  app.use('/api/seo', seoRoutes);

  // Configuration
  app.use('/api/config', configRoutes);

  // Admin
  app.use('/api/admin', adminRoutes);

  // Tenant dashboard
  app.use('/api/tenant-dashboard', tenantDashboardRoutes);
  app.use('/api/tenant/reviews', tenantReviewsRoutes);
  app.use('/api/tenant/images', tenantImagesRoutes);
  app.use('/api/tenant/manifest', tenantManifestRoutes);

  // User avatars
  app.use('/api/avatar', avatarRoutes);

  // Preview system
  app.use('/api/previews', previewRoutes);

  // Error tracking
  app.use('/api/errors', errorTrackingRoutes);

  console.log('🚦 Routes mounted');
  console.log('   ✓ 26+ API route groups registered (including performance monitoring)');
}

