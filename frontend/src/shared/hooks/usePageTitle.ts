/**
 * usePageTitle Hook - Simple API for page titles and favicons
 * 
 * Clean interface: pass props, get correct title and favicon.
 * Defaults to "That Smart Site" and the main logo.
 */

import { useBrowserTab } from './useBrowserTab';

interface PageTitleOptions {
  /**
   * Page type - determines title format
   * @default 'default'
   */
  type?: 'preview' | 'dashboard' | 'admin' | 'default';
  
  /**
   * Industry or business name
   * @example 'mobile-detailing' or 'John's Detail Shop'
   */
  name?: string;
  
  /**
   * Custom page name (e.g., 'Contact', 'About')
   */
  page?: string;
}

/**
 * Simple hook for page title and favicon management
 * 
 * @example
 * ```tsx
 * // Default - "That Smart Site"
 * usePageTitle();
 * 
 * // Preview page - "Mobile Detailing Preview | That Smart Site"
 * usePageTitle({ type: 'preview', name: 'mobile-detailing' });
 * 
 * // Dashboard - "Dashboard | John's Detail Shop"
 * usePageTitle({ type: 'dashboard', name: "John's Detail Shop" });
 * 
 * // Custom page - "Contact | That Smart Site"
 * usePageTitle({ page: 'Contact' });
 * ```
 */
export function usePageTitle(options: PageTitleOptions = {}) {
  const { type = 'default', name, page } = options;
  
  // Build the title based on type
  let title: string;
  
  if (page) {
    // Custom page: "Contact | That Smart Site"
    title = `${page} | That Smart Site`;
  } else if (type === 'preview' && name) {
    // Preview: "Mobile Detailing Preview | That Smart Site"
    const displayName = name
      .split('-')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
    title = `${displayName} Preview | That Smart Site`;
  } else if (type === 'dashboard' && name) {
    // Dashboard: "Dashboard | Business Name"
    title = `Dashboard | ${name}`;
  } else if (type === 'admin') {
    // Admin: "Admin | That Smart Site"
    title = 'Admin | That Smart Site';
  } else if (name) {
    // Just name: "Business Name | That Smart Site"
    title = `${name} | That Smart Site`;
  } else {
    // Default: "That Smart Site"
    title = 'That Smart Site';
  }
  
  // Use the existing useBrowserTab with simple config
  useBrowserTab({
    title,
    favicon: '/favicon.ico',
    useBusinessName: false,
  });
  
  return { title, favicon: '/favicon.ico' };
}

