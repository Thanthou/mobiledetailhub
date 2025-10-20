/**
 * Tenant Asset Locator
 * 
 * Centralized helper for constructing tenant asset URLs with fallbacks.
 * Eliminates brittle string concatenation throughout the codebase.
 * 
 * Pure function - no IO, no network calls, no DOM access.
 */

import type { Vertical } from '@shared/types';

/**
 * Supported asset types for tenant branding and content
 */
export type AssetType =
  | 'logo'           // Primary brand logo
  | 'logo-dark'      // Dark mode variant
  | 'logo-light'     // Light mode variant
  | 'favicon'        // Browser favicon
  | 'hero'           // Hero/banner images
  | 'hero-1'         // Specific hero image (numbered)
  | 'hero-2'
  | 'hero-3'
  | 'og-image'       // Open Graph social share image
  | 'twitter-image'  // Twitter Card image
  | 'avatar'         // User/review avatar
  | 'gallery';       // Gallery/portfolio images

/**
 * File extension preferences
 */
export type AssetExtension = 'webp' | 'png' | 'jpg' | 'jpeg' | 'svg' | 'gif';

/**
 * Options for asset URL generation
 */
export interface AssetLocatorOptions {
  /** Tenant ID (e.g., 'jps', '123') - if provided, checks uploads first */
  tenantId?: string;
  
  /** Vertical/industry (e.g., 'mobile-detailing') - used for fallback paths */
  vertical: Vertical;
  
  /** Asset type to locate */
  type: AssetType;
  
  /** Custom filename (useful for avatars, gallery images) */
  filename?: string;
  
  /** Preferred file extension (default: 'webp' for most, 'svg' for favicon) */
  extension?: AssetExtension;
  
  /** Use tenant-specific uploads directory (default: true if tenantId provided) */
  useTenantUploads?: boolean;
  
  /** Force fallback to vertical default (skip tenant uploads check) */
  forceVerticalDefault?: boolean;
}

/**
 * Get the default extension for a given asset type
 */
function getDefaultExtension(type: AssetType): AssetExtension {
  if (type === 'favicon') return 'svg';
  if (type.startsWith('logo')) return 'webp';
  return 'webp';
}

/**
 * Get the subdirectory path for a given asset type
 */
function getAssetSubdirectory(type: AssetType): string {
  if (type === 'avatar') return 'avatars';
  if (type === 'gallery') return 'gallery';
  if (type.startsWith('hero')) return 'hero';
  if (type.startsWith('logo') || type === 'favicon') return 'icons';
  if (type === 'og-image' || type === 'twitter-image') return 'social';
  return 'images';
}

/**
 * Get the filename for a given asset type
 */
function getAssetFilename(type: AssetType, customFilename?: string, extension?: AssetExtension): string {
  // If custom filename provided (common for avatars, gallery), use it
  if (customFilename) {
    // If filename already has extension, use as-is
    if (/\.(webp|png|jpg|jpeg|svg|gif)$/i.test(customFilename)) {
      return customFilename;
    }
    // Otherwise append extension
    return `${customFilename}.${extension || 'webp'}`;
  }
  
  // Standard filenames by type
  const ext = extension || getDefaultExtension(type);
  
  switch (type) {
    case 'logo':
      return `logo.${ext}`;
    case 'logo-dark':
      return `logo-dark.${ext}`;
    case 'logo-light':
      return `logo-light.${ext}`;
    case 'favicon':
      return `favicon.${ext}`;
    case 'hero':
    case 'hero-1':
      return `hero1.${ext}`;
    case 'hero-2':
      return `hero2.${ext}`;
    case 'hero-3':
      return `hero3.${ext}`;
    case 'og-image':
      return `og-image.${ext}`;
    case 'twitter-image':
      return `twitter-image.${ext}`;
    default:
      return `${type}.${ext}`;
  }
}

/**
 * Generate tenant-specific upload URL
 * Format: /uploads/{tenantId}/{subdirectory}/{filename}
 */
function getTenantUploadUrl(
  tenantId: string,
  type: AssetType,
  filename: string
): string {
  const subdirectory = getAssetSubdirectory(type);
  
  // For avatars, uploads structure is: /uploads/avatars/{filename}
  if (type === 'avatar') {
    return `/uploads/avatars/${filename}`;
  }
  
  // For other assets: /uploads/{tenantId}/{subdirectory}/{filename}
  return `/uploads/${tenantId}/${subdirectory}/${filename}`;
}

/**
 * Generate vertical default URL
 * Format: /{vertical}/{subdirectory}/{filename}
 */
function getVerticalDefaultUrl(
  vertical: Vertical,
  type: AssetType,
  filename: string
): string {
  const subdirectory = getAssetSubdirectory(type);
  return `/${vertical}/${subdirectory}/${filename}`;
}

/**
 * Get tenant asset URL with intelligent fallback logic
 * 
 * Priority:
 * 1. Custom URL (if provided via database/config)
 * 2. Tenant-specific uploads (if tenantId provided and useTenantUploads=true)
 * 3. Vertical default assets (fallback)
 * 
 * @example
 * // Get tenant logo (checks uploads, falls back to vertical)
 * getTenantAssetUrl({ tenantId: 'jps', vertical: 'mobile-detailing', type: 'logo' })
 * // => '/uploads/jps/icons/logo.webp' or '/{vertical}/icons/logo.webp'
 * 
 * @example
 * // Get specific hero image
 * getTenantAssetUrl({ vertical: 'mobile-detailing', type: 'hero-2' })
 * // => '/mobile-detailing/hero/hero2.webp'
 * 
 * @example
 * // Get avatar with custom filename
 * getTenantAssetUrl({ vertical: 'mobile-detailing', type: 'avatar', filename: 'user-123.jpg' })
 * // => '/uploads/avatars/user-123.jpg'
 * 
 * @example
 * // Force vertical default (skip tenant check)
 * getTenantAssetUrl({ 
 *   tenantId: 'jps', 
 *   vertical: 'mobile-detailing', 
 *   type: 'logo',
 *   forceVerticalDefault: true 
 * })
 * // => '/mobile-detailing/icons/logo.webp'
 */
export function getTenantAssetUrl(options: AssetLocatorOptions): string {
  const {
    tenantId,
    vertical,
    type,
    filename: customFilename,
    extension,
    useTenantUploads = true,
    forceVerticalDefault = false,
  } = options;
  
  // Generate filename
  const filename = getAssetFilename(type, customFilename, extension);
  
  // If forcing vertical default, skip tenant uploads
  if (forceVerticalDefault) {
    return getVerticalDefaultUrl(vertical, type, filename);
  }
  
  // Avatars always use /uploads/avatars/ (no tenant-specific directory)
  if (type === 'avatar') {
    return `/uploads/avatars/${filename}`;
  }
  
  // If tenant ID provided and uploads enabled, use tenant-specific path
  if (tenantId && useTenantUploads) {
    return getTenantUploadUrl(tenantId, type, filename);
  }
  
  // Fallback to vertical default
  return getVerticalDefaultUrl(vertical, type, filename);
}

/**
 * Get multiple asset URLs at once (useful for responsive images, variants)
 * 
 * @example
 * // Get all hero images
 * getTenantAssetUrls({ 
 *   vertical: 'mobile-detailing', 
 *   types: ['hero-1', 'hero-2', 'hero-3'] 
 * })
 * // => ['/mobile-detailing/hero/hero1.webp', '/mobile-detailing/hero/hero2.webp', ...]
 */
export function getTenantAssetUrls(
  options: Omit<AssetLocatorOptions, 'type'> & { types: AssetType[] }
): string[] {
  const { types, ...baseOptions } = options;
  return types.map(type => getTenantAssetUrl({ ...baseOptions, type }));
}

/**
 * Get logo with automatic dark/light mode fallback
 * Returns an object with all logo variants
 */
export interface LogoUrls {
  default: string;
  dark?: string;
  light?: string;
}

export function getTenantLogoUrls(
  options: Omit<AssetLocatorOptions, 'type'>
): LogoUrls {
  return {
    default: getTenantAssetUrl({ ...options, type: 'logo' }),
    dark: getTenantAssetUrl({ ...options, type: 'logo-dark' }),
    light: getTenantAssetUrl({ ...options, type: 'logo-light' }),
  };
}

/**
 * Check if a filename already includes an extension
 */
export function hasFileExtension(filename: string): boolean {
  return /\.(webp|png|jpg|jpeg|svg|gif|bmp|ico)$/i.test(filename);
}

/**
 * Ensure a URL has proper leading slash
 */
export function normalizeAssetUrl(url: string): string {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return url.startsWith('/') ? url : `/${url}`;
}

