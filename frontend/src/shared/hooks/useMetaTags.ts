import { useEffect } from 'react';

import { useData } from '@/shared/hooks/useData';
import { useIndustrySiteData } from '@/shared/hooks/useIndustrySiteData';
import { getAbsoluteUrl } from '@/shared/utils';

export interface UseMetaTagsOptions {
  /** Custom page title (for OG/Twitter tags) */
  title?: string;
  /** Custom meta description */
  description?: string;
  /** Custom meta keywords */
  keywords?: string[];
  /** Custom Open Graph image */
  ogImage?: string;
  /** Custom Twitter image (defaults to ogImage if not provided) */
  twitterImage?: string;
  /** Custom canonical path */
  canonicalPath?: string;
}

/**
 * Hook to manage SEO meta tags
 * 
 * Automatically sets:
 * - Meta description
 * - Meta keywords
 * - Open Graph tags (title, description, image)
 * - Twitter Card tags (title, description, image)
 * - Canonical URL
 * 
 * @example
 * // Use defaults from site config
 * useMetaTags();
 * 
 * @example
 * // Custom description
 * useMetaTags({ 
 *   description: 'Custom page description for this specific page' 
 * });
 * 
 * @example
 * // Full customization for a specific page
 * useMetaTags({
 *   title: 'Contact Us - Business Name',
 *   description: 'Get in touch with our team',
 *   ogImage: '/images/contact-hero.jpg',
 *   canonicalPath: '/contact'
 * });
 */
export const useMetaTags = (options: UseMetaTagsOptions = {}) => {
  const { siteData } = useIndustrySiteData();
  const { businessName } = useData();

  const {
    title: customTitle,
    description: customDescription,
    keywords: customKeywords,
    ogImage: customOgImage,
    twitterImage: customTwitterImage,
    canonicalPath: customCanonicalPath,
  } = options;

  useEffect(() => {
    if (!siteData) return;

    // Determine the page title (for OG/Twitter, not browser tab)
    const pageTitle = customTitle || businessName || siteData.seo.title;
    const description = customDescription || siteData.seo.description;
    const keywords = customKeywords || siteData.seo.keywords;
    const ogImage = customOgImage || siteData.seo.ogImage;
    const twitterImage = customTwitterImage || siteData.seo.twitterImage || ogImage;
    const canonicalPath = customCanonicalPath || siteData.seo.canonicalPath;

    // Update meta description
    updateMetaTag('meta-desc', 'content', description);

    // Update meta keywords
    if (keywords && keywords.length > 0) {
      updateMetaTag('meta-keywords', 'content', keywords.join(', '));
    }

    // Update Open Graph tags
    updateMetaTag('og-title', 'content', pageTitle);
    updateMetaTag('og-desc', 'content', description);
    
    if (ogImage) {
      const absoluteImageUrl = getAbsoluteUrl(ogImage);
      updateMetaTag('og-image', 'content', absoluteImageUrl);
    }

    // Update Twitter Card tags
    updateMetaTag('tw-title', 'content', pageTitle);
    updateMetaTag('tw-desc', 'content', description);
    
    if (twitterImage) {
      const absoluteImageUrl = getAbsoluteUrl(twitterImage);
      updateMetaTag('tw-image', 'content', absoluteImageUrl);
    }

    // Update canonical URL
    if (canonicalPath) {
      const canonicalElement = document.getElementById('canonical-link');
      if (canonicalElement) {
        const domain = window.location.host;
        canonicalElement.setAttribute('href', `https://${domain}${canonicalPath}`);
      }
    }

  }, [
    siteData,
    businessName,
    customTitle,
    customDescription,
    customKeywords,
    customOgImage,
    customTwitterImage,
    customCanonicalPath,
  ]);

  return {
    title: customTitle || businessName || siteData?.seo.title,
    description: customDescription || siteData?.seo.description,
    keywords: customKeywords || siteData?.seo.keywords,
  };
};

/**
 * Update a meta tag by element ID
 */
function updateMetaTag(elementId: string, attribute: string, value: string): void {
  const element = document.getElementById(elementId);
  if (element) {
    element.setAttribute(attribute, value);
  }
}

/**
 * Utility function to manually update meta description
 * Use this for one-off updates outside of React components
 */
export const setMetaDescription = (description: string): void => {
  updateMetaTag('meta-desc', 'content', description);
};

/**
 * Utility function to manually update Open Graph image
 * Use this for one-off updates outside of React components
 */
export const setOgImage = (imageUrl: string): void => {
  const absoluteUrl = getAbsoluteUrl(imageUrl);
  updateMetaTag('og-image', 'content', absoluteUrl);
};

