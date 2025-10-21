import { useData } from '@shared/components/header/contexts/DataProvider';
import type { MainSiteConfig } from '@shared/types/location';

/**
 * Hook to access the correct site.json based on the tenant's industry
 * Site data is now centrally loaded and cached in DataProvider
 * 
 * This hook provides a convenient interface for components that need site config
 */
export const useIndustrySiteData = (): {
  siteData: MainSiteConfig | null;
  industry: string;
  isLoading: boolean;
} => {
  const { industry, siteConfig, isLoading } = useData();

  return {
    siteData: siteConfig,
    industry,
    isLoading
  };
};
