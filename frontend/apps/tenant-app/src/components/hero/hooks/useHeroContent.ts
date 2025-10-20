import { useWebsiteContent } from '@shared/contexts/WebsiteContentContext';
import { useIndustrySiteData } from '@shared/hooks/useIndustrySiteData';
import type { LocationPage } from '@shared/types/location';

interface UseHeroContentReturn {
  title: string;
  subtitle: string;
  isLocation: boolean;
  locationName: string;
}

interface UseHeroContentProps {
  locationData?: LocationPage;
}

export const useHeroContent = (props?: UseHeroContentProps): UseHeroContentReturn => {
  // Get industry-specific site data
  const { siteData } = useIndustrySiteData();
  
  // Always call hooks unconditionally
  const { content: websiteContent } = useWebsiteContent();
  
  // Use passed locationData as fallback
  const locationData = props?.locationData;
  
  // All sites are now tenant-based, so use database content or industry-specific site data
  // Priority: Database content > Industry-specific site data > Fallback
  const title = String(websiteContent?.hero_title || siteData?.hero.h1 || 'Professional Services');
  const subtitle = String(websiteContent?.hero_subtitle || siteData?.hero.sub || 'Quality service for your needs');

  return {
    title,
    subtitle,
    isLocation: false, // All sites are now tenant-based
    locationName: locationData?.city ?? ''
  };
};
