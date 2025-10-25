/**
 * Validation Schemas Index
 * 
 * Central export point for all Zod validation schemas.
 * Re-exports schemas organized by domain for easy imports.
 * 
 * Usage:
 *   import { authSchemas, tenantSchemas } from './schemas/validation/index.js';
 *   // or shorter with path alias:
 *   import { authSchemas } from '@/schemas/validation';
 */

// Common fields (shared validators)
export { commonFields } from './common.js';

// Domain-specific schemas
export { authSchemas } from './auth.schemas.js';
export { tenantSchemas, serviceAreaSchemas } from './tenants.schemas.js';
export { paymentSchemas } from './payments.schemas.js';
export { websiteContentSchemas } from './website.schemas.js';
export { reviewSchemas } from './reputation.schemas.js';
export { scheduleSchemas } from './schedule.schemas.js';
export { analyticsSchemas } from './analytics.schemas.js';
export { serviceSchemas } from './services.schemas.js';
export { errorTrackingSchemas } from './errors.schemas.js';
export { tenantImagesSchemas } from './images.schemas.js';
export { domainSchemas } from './domains.schemas.js';
export { adminSchemas } from './admin.schemas.js';

// Re-export individual schemas for backwards compatibility
export * from './auth.schemas.js';
export * from './tenants.schemas.js';
export * from './payments.schemas.js';
export * from './website.schemas.js';
export * from './reputation.schemas.js';
export * from './schedule.schemas.js';
export * from './analytics.schemas.js';
export * from './services.schemas.js';
export * from './errors.schemas.js';
export * from './images.schemas.js';
export * from './domains.schemas.js';
export * from './admin.schemas.js';

