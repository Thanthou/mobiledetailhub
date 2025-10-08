import { useWebsiteContent } from '@/shared/contexts/WebsiteContentContext';
import { useIndustrySiteData } from '@/shared/hooks/useIndustrySiteData';

interface UseHeroContentReturn {
  title: string;
  subtitle: string;
  isLocation: boolean;
  locationName: string;
}

interface UseHeroContentProps {
  locationData?: any;
}

export const useHeroContent = (props?: UseHeroContentProps): UseHeroContentReturn => {
  // Get industry-specific site data
  const { siteData } = useIndustrySiteData();
  
  // Try to get website content, but handle cases where provider isn't available
  let websiteContent = null;
  try {
    const { content } = useWebsiteContent();
    websiteContent = content;
  } catch {
    // WebsiteContentProvider not available, use fallbacks
    websiteContent = null;
  }
  
  // Use passed locationData as fallback
  const locationData = props?.locationData;
  
  // All sites are now tenant-based, so use database content or industry-specific site data
  // Priority: Database content > Industry-specific site data > Fallback
  const title = websiteContent?.hero_title ?? siteData?.hero?.h1 ?? 'Mobile Detailing';
  const subtitle = websiteContent?.hero_subtitle ?? siteData?.hero?.subTitle ?? 'Professional mobile detailing services';

  return {
    title,
    subtitle,
    isLocation: false, // All sites are now tenant-based
    locationName: locationData?.city ?? ''
  };
};
