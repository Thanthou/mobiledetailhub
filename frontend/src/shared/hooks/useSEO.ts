import { useEffect } from 'react';

import { getAbsoluteUrl } from '@/shared/utils';
import siteData from '@/data/mdh/site.json';

/**
 * Hook to manage SEO metadata for the homepage
 * Updates the document head with data from site.json
 */
export const useSEO = () => {
  useEffect(() => {
    // Update title
    const titleElement = document.getElementById('meta-title');
    if (titleElement) {
      titleElement.textContent = siteData.seo.title;
    }

    // Update meta title
    const metaTitleElement = document.getElementById('meta-title-tag');
    if (metaTitleElement) {
      metaTitleElement.setAttribute('content', siteData.seo.title);
    }

    // Update meta description
    const metaDescElement = document.getElementById('meta-desc');
    if (metaDescElement) {
      metaDescElement.setAttribute('content', siteData.seo.description);
    }

    // Update meta keywords
    const metaKeywordsElement = document.getElementById('meta-keywords');
    if (metaKeywordsElement) {
      metaKeywordsElement.setAttribute('content', siteData.seo.keywords.join(', '));
    }

    // Update Open Graph title
    const ogTitleElement = document.getElementById('og-title');
    if (ogTitleElement) {
      ogTitleElement.setAttribute('content', siteData.seo.title);
    }

    // Update Open Graph description
    const ogDescElement = document.getElementById('og-desc');
    if (ogDescElement) {
      ogDescElement.setAttribute('content', siteData.seo.description);
    }

    // Update Open Graph image
    const ogImageElement = document.getElementById('og-image');
    if (ogImageElement) {
      const absoluteImageUrl = getAbsoluteUrl(siteData.seo.ogImage);
      ogImageElement.setAttribute('content', absoluteImageUrl);
    }

    // Update Twitter title
    const twTitleElement = document.getElementById('tw-title');
    if (twTitleElement) {
      twTitleElement.setAttribute('content', siteData.seo.title);
    }

    // Update Twitter description
    const twDescElement = document.getElementById('tw-desc');
    if (twDescElement) {
      twDescElement.setAttribute('content', siteData.seo.description);
    }

    // Update Twitter image
    const twImageElement = document.getElementById('tw-image');
    if (twImageElement) {
      const twitterImage = siteData.seo.twitterImage || siteData.seo.ogImage;
      const absoluteImageUrl = getAbsoluteUrl(twitterImage);
      twImageElement.setAttribute('content', absoluteImageUrl);
    }

    // Update canonical URL
    const canonicalElement = document.getElementById('canonical-link');
    if (canonicalElement) {
      canonicalElement.setAttribute('href', `https://mobiledetailhub.com${siteData.seo.canonicalPath}`);
    }

  }, []);
};
