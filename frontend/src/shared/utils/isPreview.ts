/**
 * Preview Mode Detection Utilities
 * 
 * Central source of truth for determining if the app is in preview mode.
 * Used by providers, hooks, and route guards to prevent live data fetching
 * and actions during preview.
 */

/**
 * Check if the current pathname is a preview route
 * 
 * Matches patterns like:
 * - /mobile-detailing-preview
 * - /house-cleaning-preview/
 * - /preview/mobile-detailing
 * 
 * @param pathname - URL pathname to check (defaults to window.location.pathname)
 * @returns true if the path indicates preview mode
 */
export function isPreviewPath(pathname: string = window.location.pathname): boolean {
  return /-preview\/?$/.test(pathname) || pathname.includes('/preview/');
}

/**
 * Check if the current hostname is the preview host
 * 
 * Preview host is 'tenant.thatsmartsite.com' or 'tenant.localhost'
 * Real tenants are '<slug>.thatsmartsite.com'
 * 
 * @param hostname - Hostname to check (defaults to window.location.hostname)
 * @returns true if the hostname is the preview host
 */
export function isPreviewHost(hostname: string = window.location.hostname): boolean {
  const subdomain = hostname.split('.')[0];
  return subdomain === 'tenant';
}

/**
 * Master check: are we in preview mode?
 * 
 * Returns true if EITHER:
 * - The path indicates preview (e.g., /-preview routes)
 * - The host is the preview subdomain (tenant.*)
 * 
 * This is the canonical check that should be used throughout the app.
 * 
 * @returns true if the app is in preview mode
 * 
 * @example
 * ```ts
 * // In a provider
 * if (inPreviewMode()) {
 *   return <PreviewDataProvider>{children}</PreviewDataProvider>;
 * }
 * 
 * // In a hook
 * if (inPreviewMode()) {
 *   return mockData;
 * }
 * 
 * // In a form handler
 * const handleSubmit = (e) => {
 *   if (inPreviewMode()) {
 *     e.preventDefault();
 *     toast.info('Demo mode - no actions taken');
 *     return;
 *   }
 *   // ... real submission
 * };
 * ```
 */
export function inPreviewMode(): boolean {
  return isPreviewPath() || isPreviewHost();
}

/**
 * Extract industry slug from preview path
 * 
 * Examples:
 * - /mobile-detailing-preview → 'mobile-detailing'
 * - /house-cleaning-preview/ → 'house-cleaning'
 * - /preview/lawncare → 'lawncare'
 * 
 * @param pathname - URL pathname (defaults to window.location.pathname)
 * @returns Industry slug or null if not a preview path
 */
export function getPreviewIndustry(pathname: string = window.location.pathname): string | null {
  // Match /{industry}-preview or /preview/{industry}
  const match = pathname.match(/\/([a-z-]+)-preview\/?$/) || pathname.match(/\/preview\/([a-z-]+)\/?$/);
  return match ? match[1] : null;
}

