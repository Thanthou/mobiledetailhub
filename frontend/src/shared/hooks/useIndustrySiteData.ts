import { useMemo } from 'react';
import { useData } from '@/features/header/contexts/DataProvider';

/**
 * Hook to dynamically load the correct site.json based on the tenant's industry
 * This ensures we use the right data directory structure: /src/data/{industry}/site.json
 */
export const useIndustrySiteData = () => {
  const { industry } = useData();
  
  const siteData = useMemo(() => {
    try {
      // Dynamically import the site.json file based on industry
      // This will load from /src/data/{industry}/site.json
      const industryModule = require(`@/data/${industry}/site.json`);
      return industryModule.default || industryModule;
    } catch (error) {
      console.warn(`Failed to load site data for industry "${industry}", falling back to mobile-detailing`, error);
      // Fallback to mobile-detailing if the industry-specific file doesn't exist
      try {
        const fallbackModule = require('@/data/mobile-detailing/site.json');
        return fallbackModule.default || fallbackModule;
      } catch (fallbackError) {
        console.error('Failed to load fallback site data', fallbackError);
        return null;
      }
    }
  }, [industry]);

  return {
    siteData,
    industry
  };
};
