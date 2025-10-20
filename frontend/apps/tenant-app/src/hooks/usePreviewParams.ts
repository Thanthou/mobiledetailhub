/**
 * Preview Params Hook
 * 
 * Extracts and parses preview parameters from URL
 * Supports both slug-based and token-based preview modes
 */

import { useLocation, useParams } from 'react-router-dom';
import { useMemo } from 'react';

export interface PreviewParams {
  mode: 'slug' | 'token' | null;
  slug?: string;
  token?: string;
  industry?: string;
}

/**
 * Parse preview parameters from URL
 * 
 * Supports two modes:
 * 1. Slug mode: /mobile-detailing-preview
 * 2. Token mode: /preview?t=<jwt>
 */
export function usePreviewParams(): PreviewParams {
  const location = useLocation();
  const params = useParams();
  
  return useMemo(() => {
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get('t');
    
    // Token-based preview (from admin-generated links)
    if (token) {
      return {
        mode: 'token',
        token,
      };
    }
    
    // Slug-based preview (from industry templates)
    // Check if path contains "-preview" suffix
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const previewSlug = pathSegments.find(segment => segment.endsWith('-preview'));
    
    if (previewSlug) {
      // Extract industry from slug (e.g., "mobile-detailing-preview" → "mobile-detailing")
      const industry = previewSlug.replace('-preview', '');
      
      return {
        mode: 'slug',
        slug: previewSlug,
        industry,
      };
    }
    
    return { mode: null };
  }, [location.pathname, location.search, params]);
}

