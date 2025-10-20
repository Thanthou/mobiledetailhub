import { useEffect } from 'react';

import { useSEO } from '@shared/hooks/useSEO';

export interface SeoHeadProps {
  /** Custom page title (overrides business name) */
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
  /** Whether this is a preview page (adds noindex) */
  isPreview?: boolean;
  /** Custom robots directive */
  robots?: string;
}

/**
 * Centralized SEO head management component
 * 
 * This component wraps the existing useSEO hook with additional functionality:
 * - Automatic preview detection and noindex handling
 * - Enhanced robots directive management
 * - Integration with existing SEO infrastructure
 * 
 * @example
 * // Use defaults from site config
 * <SeoHead />
 * 
 * @example
 * // Custom title and description
 * <SeoHead 
 *   title="Contact Us - Business Name"
 *   description="Get in touch with our team"
 * />
 * 
 * @example
 * // Preview page (automatically adds noindex)
 * <SeoHead isPreview />
 */
export const SeoHead = ({
  title,
  description,
  keywords,
  ogImage,
  twitterImage,
  canonicalPath,
  isPreview = false,
  robots,
}: SeoHeadProps) => {
  // Use the existing useSEO hook for core functionality
  useSEO({
    title,
    description,
    keywords,
    ogImage,
    twitterImage,
    canonicalPath,
  });

  // Handle preview-specific robots directive
  useEffect(() => {
    if (isPreview) {
      updateElement('meta-robots', 'content', 'noindex,nofollow');
    } else if (robots) {
      updateElement('meta-robots', 'content', robots);
    }
  }, [isPreview, robots]);

  return null; // This component only manages head tags
};

/**
 * Update an element by ID
 */
function updateElement(elementId: string, attribute: string, value: string): void {
  const element = document.getElementById(elementId);
  if (element) {
    if (attribute === 'textContent') {
      element.textContent = value;
    } else {
      element.setAttribute(attribute, value);
    }
  }
}
