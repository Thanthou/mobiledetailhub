import { useBrowserTab } from './useBrowserTab';
import { useMetaTags } from './useMetaTags';

export interface UseSEOOptions {
  /** Custom page title (overrides business name) */
  title?: string;
  /** Custom favicon URL */
  favicon?: string;
  /** Custom meta description */
  description?: string;
  /** Custom meta keywords */
  keywords?: string[];
  /** Custom Open Graph image */
  ogImage?: string;
  /** Custom Twitter image */
  twitterImage?: string;
  /** Custom canonical path */
  canonicalPath?: string;
  /** Skip browser tab updates (title + favicon) */
  skipBrowserTab?: boolean;
  /** Skip meta tag updates */
  skipMetaTags?: boolean;
}

/**
 * Convenience hook that manages all SEO metadata
 * 
 * This is a wrapper around useBrowserTab + useMetaTags for convenience.
 * For more granular control, use those hooks directly.
 * 
 * Manages:
 * - Browser tab title and favicon
 * - Meta description, keywords
 * - Open Graph tags
 * - Twitter Card tags
 * - Canonical URL
 * 
 * @example
 * // Use defaults (loads from site config + tenant data)
 * useSEO();
 * 
 * @example
 * // Custom title and description
 * useSEO({
 *   title: 'Contact Us - Business Name',
 *   description: 'Get in touch with our team'
 * });
 * 
 * @example
 * // Only update meta tags, skip browser tab
 * useSEO({
 *   description: 'Custom description',
 *   skipBrowserTab: true
 * });
 */
export const useSEO = (options: UseSEOOptions = {}) => {
  const {
    title,
    favicon,
    description,
    keywords,
    ogImage,
    twitterImage,
    canonicalPath,
    skipBrowserTab = false,
    skipMetaTags = false,
  } = options;

  // Update browser tab (title + favicon)
  const browserTab = useBrowserTab(
    skipBrowserTab
      ? { useBusinessName: false }
      : { title, favicon }
  );

  // Update meta tags (description, OG, Twitter, etc.)
  const metaTags = useMetaTags(
    skipMetaTags
      ? {}
      : {
          title,
          description,
          keywords,
          ogImage,
          twitterImage,
          canonicalPath,
        }
  );

  return {
    ...browserTab,
    ...metaTags,
  };
};
