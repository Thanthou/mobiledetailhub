import React, { useEffect } from 'react';

interface SeoHeadProps {
  title: string;
  description?: string;
  keywords?: string[];
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  twitterCard?: 'summary' | 'summary_large_image';
  noindex?: boolean;
}

/**
 * SeoHead - Centralized SEO meta tag management
 * 
 * @deprecated Use the new hooks instead:
 * - `useBrowserTab()` for browser tab title + favicon
 * - `useMetaTags()` for meta description, OG tags, etc.
 * - `useSEO()` for both (convenience wrapper)
 * 
 * This component is kept for backward compatibility but is no longer recommended.
 * The new hooks provide better separation of concerns and are easier to use.
 * 
 * @example Migration
 * ```tsx
 * // Old way (deprecated)
 * <SeoHead 
 *   title="Mobile Detailing Services"
 *   description="Professional mobile auto detailing"
 *   keywords={['mobile detailing', 'car wash']}
 * />
 * 
 * // New way (recommended)
 * useBrowserTab({ title: 'Mobile Detailing Services' });
 * useMetaTags({ 
 *   description: 'Professional mobile auto detailing',
 *   keywords: ['mobile detailing', 'car wash']
 * });
 * ```
 */
export const SeoHead: React.FC<SeoHeadProps> = ({
  title,
  description,
  keywords,
  canonicalUrl,
  ogImage,
  ogType = 'website',
  twitterCard = 'summary_large_image',
  noindex = false,
}) => {
  useEffect(() => {
    // Update title
    document.title = title;

    // Helper to set or remove meta tag
    const setMetaTag = (name: string, content: string | undefined, property = false) => {
      const attr = property ? 'property' : 'name';
      const tag = document.querySelector(`meta[${attr}="${name}"]`);
      
      if (content) {
        if (tag) {
          tag.content = content;
        } else {
          const newTag = document.createElement('meta');
          newTag.setAttribute(attr, name);
          newTag.content = content;
          document.head.appendChild(newTag);
        }
      } else if (tag) {
        tag.remove();
      }
    };

    // Set standard meta tags
    setMetaTag('description', description);
    setMetaTag('keywords', keywords?.join(', '));
    setMetaTag('robots', noindex ? 'noindex,nofollow' : 'index,follow');

    // Set Open Graph tags
    setMetaTag('og:title', title, true);
    setMetaTag('og:description', description, true);
    setMetaTag('og:type', ogType, true);
    setMetaTag('og:image', ogImage, true);
    setMetaTag('og:url', canonicalUrl, true);

    // Set Twitter Card tags
    setMetaTag('twitter:card', twitterCard);
    setMetaTag('twitter:title', title);
    setMetaTag('twitter:description', description);
    setMetaTag('twitter:image', ogImage);

    // Set canonical URL
    const canonicalTag = document.querySelector('link[rel="canonical"]');
    if (canonicalUrl) {
      if (canonicalTag) {
        canonicalTag.href = canonicalUrl;
      } else {
        const newCanonicalTag = document.createElement('link');
        newCanonicalTag.rel = 'canonical';
        newCanonicalTag.href = canonicalUrl;
        document.head.appendChild(newCanonicalTag);
      }
    } else if (canonicalTag) {
      canonicalTag.remove();
    }

    // Set viewport (ensure it's always present)
    const viewportTag = document.querySelector('meta[name="viewport"]');
    if (!viewportTag) {
      const newViewportTag = document.createElement('meta');
      newViewportTag.name = 'viewport';
      newViewportTag.content = 'width=device-width, initial-scale=1';
      document.head.appendChild(newViewportTag);
    }
  }, [title, description, keywords, canonicalUrl, ogImage, ogType, twitterCard, noindex]);

  return null; // This component only manages <head>, renders nothing
};

