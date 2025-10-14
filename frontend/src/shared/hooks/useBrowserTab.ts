import { useEffect } from 'react';

import { useDataOptional } from '@/shared/contexts/DataContext';
import { useTenantConfigLoader } from '@/shared/hooks';
import type { Vertical } from '@/shared/types';
import { getTenantAssetUrl } from '@/shared/utils';

export interface UseBrowserTabOptions {
  /** Custom page title (overrides default business name) */
  title?: string;
  /** Custom favicon URL (overrides tenant logo) */
  favicon?: string;
  /** Whether to use business name as title (default: true) */
  useBusinessName?: boolean;
  /** Fallback title if no business name available */
  fallbackTitle?: string;
}

/**
 * Hook to manage browser tab title and favicon
 * 
 * Automatically sets:
 * - Browser tab title (uses business name by default)
 * - Favicon (uses tenant logo by default)
 * - Apple touch icon
 * 
 * @example
 * // Use defaults (business name + tenant logo)
 * useBrowserTab();
 * 
 * @example
 * // Custom title
 * useBrowserTab({ title: 'Contact Us - My Business' });
 * 
 * @example
 * // Custom favicon
 * useBrowserTab({ favicon: '/custom-icon.png' });
 * 
 * @example
 * // Preview mode with custom title
 * useBrowserTab({ 
 *   title: `${businessName} - Preview`,
 *   useBusinessName: false 
 * });
 */
export const useBrowserTab = (options: UseBrowserTabOptions = {}) => {
  const {
    title: customTitle,
    favicon: customFavicon,
    useBusinessName = true,
    fallbackTitle = 'That Smart Site',
  } = options;

  // Try to get tenant context (may not exist for platform pages)
  // useDataOptional returns null instead of throwing if not in context
  const data = useDataOptional();
  const businessName = data?.businessName || '';
  const industry = data?.industry || '';
  const isDataLoading = data?.isLoading || false;

  // Tenant config hook - safe to call, will return defaults if no tenant
  const { data: tenantConfig, isLoading: isConfigLoading } = useTenantConfigLoader();
  const logoUrl = tenantConfig?.branding.logo.url;

  // Determine the page title
  const pageTitle = customTitle || (
    useBusinessName && businessName && businessName !== 'Loading...' && businessName !== 'undefined'
      ? businessName
      : fallbackTitle
  );

  // Determine the favicon URL with proper fallbacks
  const faviconUrl = customFavicon 
    || logoUrl 
    || (industry ? getTenantAssetUrl({ vertical: industry as Vertical, type: 'logo' }) : null)
    || '/shared/icons/logo-white.svg'; // Platform logo fallback (white for clean favicon)

  useEffect(() => {
    // Don't update if data is still loading (unless custom values provided)
    if (!customTitle && !customFavicon && (isDataLoading || isConfigLoading)) {
      return;
    }

    // Update page title
    updateTitle(pageTitle);

    // Update favicon
    if (faviconUrl) {
      updateFavicon(faviconUrl);
    }
  }, [pageTitle, faviconUrl, customTitle, customFavicon, isDataLoading, isConfigLoading]);

  return {
    title: pageTitle,
    favicon: faviconUrl,
  };
};

/**
 * Update the browser tab title
 */
function updateTitle(title: string): void {
  // Update <title> element text content
  const titleElement = document.getElementById('meta-title');
  if (titleElement) {
    titleElement.textContent = title;
  }

  // Update document.title for better compatibility
  document.title = title;
}

/**
 * Update the favicon
 */
function updateFavicon(url: string): void {
  // Update main favicon
  const faviconElement = document.getElementById('favicon') as HTMLLinkElement | null;
  if (faviconElement) {
    faviconElement.href = url;

    // Update the MIME type based on file extension
    if (url.endsWith('.svg')) {
      faviconElement.type = 'image/svg+xml';
    } else if (url.endsWith('.png')) {
      faviconElement.type = 'image/png';
    } else if (url.endsWith('.ico')) {
      faviconElement.type = 'image/x-icon';
    } else if (url.endsWith('.webp')) {
      faviconElement.type = 'image/webp';
    }
  }

  // Update Apple touch icon
  const appleTouchIcon = document.getElementById('apple-touch-icon') as HTMLLinkElement | null;
  if (appleTouchIcon) {
    appleTouchIcon.href = url;
  }
}

/**
 * Utility function to manually set browser tab title
 * Use this for one-off updates outside of React components
 */
export const setBrowserTitle = (title: string): void => {
  updateTitle(title);
};

/**
 * Utility function to manually set favicon
 * Use this for one-off updates outside of React components
 */
export const setFavicon = (url: string): void => {
  updateFavicon(url);
};

/**
 * Utility function to set both title and favicon
 * Use this for one-off updates outside of React components
 */
export const setBrowserTab = (title: string, favicon?: string): void => {
  updateTitle(title);
  if (favicon) {
    updateFavicon(favicon);
  }
};

