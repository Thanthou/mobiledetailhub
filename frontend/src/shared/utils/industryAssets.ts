/**
 * Industry Asset Utilities
 * 
 * Simple functions to get industry-specific assets (logo, favicon, etc.)
 * Returns paths based on industry slug.
 */

/**
 * Get the logo path for an industry
 * 
 * @param industry - Industry slug (e.g., 'mobile-detailing')
 * @returns Path to logo file
 * 
 * @example
 * getIndustryLogo('mobile-detailing') → '/industries/mobile-detailing/icons/logo.webp'
 * getIndustryLogo('main') → '/icons/logo.png'
 */
export function getIndustryLogo(industry: string): string {
  // Special case for main marketing site
  if (industry === 'main') {
    return '/icons/logo.png';
  }
  return `/industries/${industry}/icons/logo.webp`;
}

/**
 * Get the favicon path for an industry
 * 
 * @param industry - Industry slug (e.g., 'mobile-detailing') - optional
 * @returns Path to favicon file (defaults to /icons/favicon.svg if no industry)
 * 
 * @example
 * getFavicon('mobile-detailing') → '/industries/mobile-detailing/icons/favicon.webp'
 * getFavicon() → '/icons/favicon.svg'
 * getFavicon(null) → '/icons/favicon.svg'
 */
export function getFavicon(industry?: string | null): string {
  if (!industry) {
    return '/icons/favicon.svg'; // Default That Smart Site favicon (from public/icons)
  }
  return `/industries/${industry}/icons/favicon.webp`;
}

/**
 * Get the logo alt text for an industry
 * 
 * @param industry - Industry slug (e.g., 'mobile-detailing')
 * @returns Alt text for logo
 * 
 * @example
 * getIndustryLogoAlt('mobile-detailing') → 'Mobile Detailing Logo'
 * getIndustryLogoAlt('main') → 'That Smart Site Logo'
 */
export function getIndustryLogoAlt(industry: string): string {
  // Special case for main marketing site
  if (industry === 'main') {
    return 'That Smart Site Logo';
  }
  const displayName = industry
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
  return `${displayName} Logo`;
}

/**
 * Set the page favicon dynamically
 * 
 * @param faviconUrl - Path to favicon file
 * 
 * @example
 * setFavicon('/mobile-detailing/icons/favicon.webp')
 */
export function setFavicon(faviconUrl: string): void {
  let link: HTMLLinkElement | null = document.querySelector("link[rel~='icon']");
  
  if (!link) {
    link = document.createElement('link');
    link.rel = 'icon';
    document.head.appendChild(link);
  }
  
  link.href = faviconUrl;
  
  // Set type based on file extension
  if (faviconUrl.endsWith('.webp')) {
    link.type = 'image/webp';
  } else if (faviconUrl.endsWith('.svg')) {
    link.type = 'image/svg+xml';
  } else if (faviconUrl.endsWith('.png')) {
    link.type = 'image/png';
  } else if (faviconUrl.endsWith('.ico')) {
    link.type = 'image/x-icon';
  }
}

/**
 * Set the page title
 * 
 * @param title - Page title
 * 
 * @example
 * setPageTitle('Mobile Detailing Preview | That Smart Site')
 */
export function setPageTitle(title: string): void {
  document.title = title;
}

