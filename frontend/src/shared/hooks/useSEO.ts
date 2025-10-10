import { useEffect } from 'react';

import { useData } from '@/shared/contexts/DataContext';
import { useIndustrySiteData } from '@/shared/hooks/useIndustrySiteData';
import { useTenantConfig } from '@/shared/hooks/useTenantConfig';
import type { Vertical } from '@/shared/types';
import { getAbsoluteUrl, getTenantAssetUrl } from '@/shared/utils';

/**
 * Hook to manage SEO metadata for the homepage
 * Updates the document head with dynamically loaded industry-specific site.json
 * and tenant-specific business name and favicon
 */
export const useSEO = () => {
  const { siteData } = useIndustrySiteData();
  const { businessName, industry, isLoading: isDataLoading } = useData(); // Use same source as BusinessInfo
  const { logoUrl, isLoading: isConfigLoading } = useTenantConfig(); // Use same source as Logo
  
  // Use tenant config logo, fallback to industry default via asset locator (same as Logo component)
  const faviconUrl = logoUrl || getTenantAssetUrl({
    vertical: industry as Vertical,
    type: 'logo',
  });

  useEffect(() => {
    if (!siteData) return;
    
    // Don't update title if data is still loading
    if (isDataLoading) return;
    
    // Use business name if available and loaded, otherwise fall back to SEO title
    const pageTitle = businessName && businessName !== 'Loading...' && businessName !== 'undefined'
      ? businessName 
      : (siteData.seo.title || 'That Smart Site');
    
    // Update title (the browser tab text)
    const titleElement = document.getElementById('meta-title');
    if (titleElement) {
      titleElement.textContent = pageTitle;
    }
    
    // Also update document.title for better compatibility
    document.title = pageTitle;

    // Update meta title
    const metaTitleElement = document.getElementById('meta-title-tag');
    if (metaTitleElement) {
      metaTitleElement.setAttribute('content', pageTitle);
    }
    
    // Update favicon to match header logo (same logic as Logo component)
    if (faviconUrl) {
      const faviconElement = document.getElementById('favicon') as HTMLLinkElement | null;
      if (faviconElement) {
        faviconElement.href = faviconUrl;
        // Also update the type based on the image format
        if (faviconUrl.endsWith('.svg')) {
          faviconElement.type = 'image/svg+xml';
        } else if (faviconUrl.endsWith('.png')) {
          faviconElement.type = 'image/png';
        } else if (faviconUrl.endsWith('.ico')) {
          faviconElement.type = 'image/x-icon';
        }
      }
      
      const appleTouchIcon = document.getElementById('apple-touch-icon') as HTMLLinkElement | null;
      if (appleTouchIcon) {
        appleTouchIcon.href = faviconUrl;
      }
    }

    // Update meta description
    const metaDescElement = document.getElementById('meta-desc');
    if (metaDescElement) {
      metaDescElement.setAttribute('content', siteData.seo.description);
    }

    // Update meta keywords
    const metaKeywordsElement = document.getElementById('meta-keywords');
    if (metaKeywordsElement && siteData.seo.keywords) {
      metaKeywordsElement.setAttribute('content', siteData.seo.keywords.join(', '));
    }

    // Update Open Graph title with business name
    const ogTitleElement = document.getElementById('og-title');
    if (ogTitleElement) {
      ogTitleElement.setAttribute('content', pageTitle);
    }

    // Update Open Graph description
    const ogDescElement = document.getElementById('og-desc');
    if (ogDescElement) {
      ogDescElement.setAttribute('content', siteData.seo.description);
    }

    // Update Open Graph image
    const ogImageElement = document.getElementById('og-image');
    if (ogImageElement && siteData.seo.ogImage) {
      const absoluteImageUrl = getAbsoluteUrl(siteData.seo.ogImage);
      ogImageElement.setAttribute('content', absoluteImageUrl);
    }

    // Update Twitter title with business name
    const twTitleElement = document.getElementById('tw-title');
    if (twTitleElement) {
      twTitleElement.setAttribute('content', pageTitle);
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
      if (twitterImage) {
        const absoluteImageUrl = getAbsoluteUrl(twitterImage);
        twImageElement.setAttribute('content', absoluteImageUrl);
      }
    }

    // Update canonical URL
    const canonicalElement = document.getElementById('canonical-link');
    if (canonicalElement && siteData.seo.canonicalPath) {
      const domain = window.location.host;
      canonicalElement.setAttribute('href', `https://${domain}${siteData.seo.canonicalPath}`);
    }

  }, [siteData, businessName, faviconUrl, isDataLoading, isConfigLoading]);
};
