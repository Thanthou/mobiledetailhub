/**
 * Shared Types Index
 * 
 * Re-exports commonly used types from across the shared types directory.
 * This provides a convenient single import point for frequently used types.
 */

// Auto-generated database types (single source of truth from PostgreSQL)
export type {
  Business,
  Reviews,
  Appointments,
  Users,
  Services,
  ServiceTiers,
  Customers,
  CustomerVehicles,
  BlockedDays,
  ScheduleSettings,
  WebsiteContent,
  GoogleAnalyticsTokens,
} from './generated/db.types';

// Hand-written helper types
export type { 
  TenantCore,
  TenantInfo,
  TenantContext,
} from './tenant.types';

export type {
  ServiceArea,
  BusinessResponse,
} from './tenant-business.types';

export type {
  ServiceData,
  ProcessStep,
  ImageRef,
  VideoRef,
  CTAButton,
} from './service.types';

export type {
  GalleryImage,
  GalleryCategory,
} from './gallery.types';

/**
 * Usage Examples:
 * 
 * // Import database types
 * import type { Business, Reviews } from '@/shared/types';
 * 
 * // Import helper types
 * import type { TenantContext, ServiceArea } from '@/shared/types';
 * 
 * // Use in components
 * interface Props {
 *   business: Business;
 *   reviews: Reviews[];
 *   tenant: TenantContext;
 * }
 */
