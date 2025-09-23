/**
 * External URLs configuration
 * Centralized external links to avoid hardcoding and enable environment switching
 */

export const EXTERNAL_URLS = {
  // Trust and review platforms
  googleReviews: 'https://www.google.com/search?q=site:google.com+reviews+MDH+auto+detailing',
  stripe: 'https://stripe.com',
  
  // Social media platforms
  facebook: 'https://facebook.com',
  instagram: 'https://instagram.com',
  twitter: 'https://twitter.com',
  linkedin: 'https://linkedin.com',
  
  // Business platforms
  yelp: 'https://yelp.com',
  googleMaps: 'https://maps.google.com',
  
  // Payment processors
  paypal: 'https://paypal.com',
  square: 'https://squareup.com',
  
  // Analytics and tracking
  googleAnalytics: 'https://analytics.google.com',
  googleTagManager: 'https://tagmanager.google.com',
  
  // Support and help
  support: 'https://support.example.com',
  help: 'https://help.example.com',
  privacy: 'https://example.com/privacy',
  terms: 'https://example.com/terms'
} as const;

export type ExternalUrlKey = keyof typeof EXTERNAL_URLS;

/**
 * Get external URL by key
 */
export const getExternalUrl = (key: ExternalUrlKey): string => {
  return EXTERNAL_URLS[key];
};

/**
 * Check if URL is external
 */
export const isExternalUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    return urlObj.origin !== window.location.origin;
  } catch {
    return false;
  }
};

/**
 * Open external URL in new tab
 */
export const openExternalUrl = (key: ExternalUrlKey): void => {
  const url = getExternalUrl(key);
  window.open(url, '_blank', 'noopener,noreferrer');
};
