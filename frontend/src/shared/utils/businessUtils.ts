import type { BusinessData, EmployeesData } from '@/shared/types/business';

// Note: Employee data is now stored in the database
// These functions should be updated to use API calls

/**
 * Get business data by affiliate slug
 * TODO: Update to use API call to database
 */
export function getBusinessBySlug(affiliateSlug: string): BusinessData | null {
  console.warn('getBusinessBySlug is using legacy JSON data. Should be updated to use database API.');
  // TODO: Replace with API call
  return null;
}

/**
 * Get all available business slugs
 * TODO: Update to use API call to database
 */
export function getAllBusinessSlugs(): string[] {
  console.warn('getAllBusinessSlugs is using legacy JSON data. Should be updated to use database API.');
  // TODO: Replace with API call
  return [];
}

/**
 * Get business name for display
 */
export function getBusinessName(affiliateSlug: string): string {
  const business = getBusinessBySlug(affiliateSlug);
  return business?.['business-name'] || 'Business';
}

/**
 * Get formatted business phone number
 */
export function getBusinessPhone(affiliateSlug: string): string {
  const business = getBusinessBySlug(affiliateSlug);
  const phone = business?.['business-phone'];
  if (!phone) return '';
  
  // Format phone number as (###) ### - #### (user's preferred format)
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)} - ${cleaned.slice(6)}`;
  }
  return phone;
}

/**
 * Get business email
 */
export function getBusinessEmail(affiliateSlug: string): string {
  const business = getBusinessBySlug(affiliateSlug);
  return business?.['business-email'] || '';
}

/**
 * Get business URL
 */
export function getBusinessUrl(affiliateSlug: string): string {
  const business = getBusinessBySlug(affiliateSlug);
  return business?.['business-url'] || '';
}

/**
 * Get business logo
 */
export function getBusinessLogo(affiliateSlug: string): string {
  const business = getBusinessBySlug(affiliateSlug);
  return business?.['business-logo'] || '';
}

/**
 * Get business description
 */
export function getBusinessDescription(affiliateSlug: string): string {
  const business = getBusinessBySlug(affiliateSlug);
  return business?.['business-description'] || '';
}

/**
 * Get business services
 */
export function getBusinessServices(affiliateSlug: string): string[] {
  const business = getBusinessBySlug(affiliateSlug);
  return business?.['business-services'] || [];
}

/**
 * Get business hours
 */
export function getBusinessHours(affiliateSlug: string): string {
  const business = getBusinessBySlug(affiliateSlug);
  return business?.['business-hours'] || '';
}

/**
 * Get service areas for a business
 */
export function getBusinessServiceAreas(affiliateSlug: string) {
  const business = getBusinessBySlug(affiliateSlug);
  return business?.['service-areas'] || [];
}
