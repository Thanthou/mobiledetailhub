/**
 * useFavicon Hook
 * 
 * Simple hook to set page favicon based on industry.
 * Uses the industryAssets utility to get the correct path.
 */

import { useEffect } from 'react';
import { getFavicon, setFavicon } from '@shared/utils';

/**
 * Set the page favicon based on industry
 * 
 * @param industry - Industry slug (e.g., 'mobile-detailing')
 * 
 * @example
 * ```tsx
 * function PreviewPage() {
 *   useFavicon('mobile-detailing'); // Sets /industries/mobile-detailing/icons/favicon.webp
 *   return <div>...</div>;
 * }
 * ```
 */
export function useFavicon(industry: string | null | undefined) {
  useEffect(() => {
    if (!industry) return;
    
    const faviconUrl = getFavicon(industry);
    setFavicon(faviconUrl);
  }, [industry]);
}

