import { useSiteContext } from '@/shared/utils/siteContext';
import { useWebsiteContent } from '@/shared/contexts/WebsiteContentContext';

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
  const { isLocation, locationData: contextLocationData, siteData } = useSiteContext();
  
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
  const locationData = props?.locationData || contextLocationData;
  
  // Determine content based on context
  // Priority: Database content > Location data > Site data > Fallback
  const title = isLocation 
    ? websiteContent?.hero_title ?? locationData?.hero?.h1 ?? siteData?.hero?.h1 ?? 'Mobile Detailing'
    : websiteContent?.hero_title ?? siteData?.hero?.h1 ?? 'Mobile Detailing';
    
  const subtitle = isLocation
    ? websiteContent?.hero_subtitle ?? locationData?.hero?.sub ?? siteData?.hero?.sub ?? 'Professional mobile detailing services'
    : websiteContent?.hero_subtitle ?? siteData?.hero?.sub ?? 'Professional mobile detailing services';

  return {
    title,
    subtitle,
    isLocation: Boolean(isLocation),
    locationName: locationData?.city ?? ''
  };
};
