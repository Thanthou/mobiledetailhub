/**
 * Tenant Data Transformation Utilities
 * 
 * Single responsibility: Transform flat API data into consumer-friendly formats
 * Pure functions with no side effects
 */

import type { Business } from '@/shared/types/tenant-business.types';

/**
 * Social media links object
 */
export interface SocialMediaLinks {
  facebook?: string;
  instagram?: string;
  youtube?: string;
  tiktok?: string;
  googleBusiness?: string;
}

/**
 * Social media platform data structure
 */
export interface SocialMediaPlatform {
  url: string;
  enabled: boolean;
}

/**
 * Transform business social media data into a clean object
 * Uses new social_media structure with enabled/url fields
 * Only includes platforms that are enabled and have non-empty URLs
 * 
 * @param business - Business data from API
 * @returns Social media links object with only enabled platforms that have URLs
 * 
 * @example
 * ```ts
 * const socials = transformSocialMedia(businessData);
 * // { facebook: 'https://...', instagram: 'https://...' }
 * ```
 */
export function transformSocialMedia(business: Business): SocialMediaLinks {
  const socials: SocialMediaLinks = {};
  
  // Use new social_media structure if available, otherwise fall back to old fields
  if (business.social_media) {
    // New structure: only show if enabled
    if (business.social_media.facebook.enabled) {
      socials.facebook = business.social_media.facebook.url || '';
    }
    
    if (business.social_media.instagram.enabled) {
      socials.instagram = business.social_media.instagram.url || '';
    }
    
    if (business.social_media.youtube.enabled) {
      socials.youtube = business.social_media.youtube.url || '';
    }
    
    if (business.social_media.tiktok.enabled) {
      socials.tiktok = business.social_media.tiktok.url || '';
    }
  } else {
    // Fallback to old individual URL fields for backward compatibility
    if (business.facebook_url?.trim()) {
      socials.facebook = business.facebook_url;
    }
    
    if (business.instagram_url?.trim()) {
      socials.instagram = business.instagram_url;
    }
    
    if (business.youtube_url?.trim()) {
      socials.youtube = business.youtube_url;
    }
    
    if (business.tiktok_url?.trim()) {
      socials.tiktok = business.tiktok_url;
    }
  }
  
  // Google Business Profile is still handled separately
  if (business.gbp_url?.trim()) {
    socials.googleBusiness = business.gbp_url;
  }
  
  return socials;
}

/**
 * Get primary location from service areas
 * Returns the first primary area, or the first area if no primary is set
 * 
 * @param business - Business data from API
 * @returns Location string in format "City, State" or empty string
 * 
 * @example
 * ```ts
 * const location = getPrimaryLocation(businessData);
 * // "Bullhead City, AZ"
 * ```
 */
export function getPrimaryLocation(business: Business): string {
  if (business.service_areas.length === 0) {
    return '';
  }
  
  // Find primary service area
  const primaryArea = business.service_areas.find(area => area.primary);
  const area = primaryArea ?? business.service_areas[0];
  
  // At this point, area is guaranteed to exist due to length check above
  if (!area) {
    return '';
  }
  
  return `${area.city}, ${area.state}`;
}

/**
 * Get all primary service areas (can be multiple)
 * 
 * @param business - Business data from API
 * @returns Array of primary service areas
 */
export function getPrimaryServiceAreas(business: Business) {
  if (business.service_areas.length === 0) {
    return [];
  }
  
  const primaryAreas = business.service_areas.filter(area => area.primary);
  
  // If no primary areas are marked, return the first one
  if (primaryAreas.length === 0) {
    return [business.service_areas[0]];
  }
  
  return primaryAreas;
}

/**
 * Format business phone for display
 * Handles various formats and ensures consistent output
 * 
 * @param phone - Phone number string
 * @returns Formatted phone or empty string
 */
export function formatBusinessPhone(phone?: string): string {
  if (!phone?.trim()) {
    return '';
  }
  
  // Remove all non-numeric characters
  const digits = phone.replace(/\D/g, '');
  
  // Format as (XXX) XXX-XXXX for 10-digit US numbers
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  
  // Format as +X (XXX) XXX-XXXX for 11-digit numbers
  if (digits.length === 11) {
    return `+${digits[0]} (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
  }
  
  // Return original if format is unexpected
  return phone;
}

/**
 * Check if business has any social media links
 * 
 * @param business - Business data from API
 * @returns True if at least one social media link exists
 */
export function hasSocialMedia(business: Business): boolean {
  // Use new social_media structure if available
  if (business.social_media) {
    return !!(
      (business.social_media.facebook.enabled && business.social_media.facebook.url?.trim()) ||
      (business.social_media.instagram.enabled && business.social_media.instagram.url?.trim()) ||
      (business.social_media.youtube.enabled && business.social_media.youtube.url?.trim()) ||
      (business.social_media.tiktok.enabled && business.social_media.tiktok.url?.trim()) ||
      business.gbp_url?.trim()
    );
  }
  
  // Fallback to old individual URL fields
  return !!(
    business.facebook_url?.trim() ||
    business.instagram_url?.trim() ||
    business.youtube_url?.trim() ||
    business.tiktok_url?.trim() ||
    business.gbp_url?.trim()
  );
}

/**
 * Get business contact email with fallback
 * 
 * @param business - Business data from API
 * @param fallback - Fallback email if none exists
 * @returns Email address
 */
export function getBusinessEmail(business: Business, fallback: string = 'hello@thatsmartsite.com'): string {
  return business.business_email?.trim() || fallback;
}

