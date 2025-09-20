import type { BusinessData, EmployeesData } from '@/shared/types/business';

// Import employees data
import employeesData from '@/data/employee/employees.json';

/**
 * Get business data by affiliate slug
 */
export function getBusinessBySlug(affiliateSlug: string): BusinessData | null {
  try {
    const employees = employeesData as EmployeesData;
    return employees[affiliateSlug] || null;
  } catch (error) {
    console.error('Error getting business by slug:', error);
    return null;
  }
}

/**
 * Get all available business slugs
 */
export function getAllBusinessSlugs(): string[] {
  const employees = employeesData as EmployeesData;
  return Object.keys(employees);
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
