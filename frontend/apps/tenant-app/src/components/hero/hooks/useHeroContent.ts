import { useWebsiteContent } from '@shared/contexts/WebsiteContentContext';
import { useIndustrySiteData } from '@shared/hooks/useIndustrySiteData';
import { usePreviewData } from '@/tenant-app/contexts/PreviewDataContext';
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
  // Check for preview mode FIRST
  const { isPreviewMode, previewConfig } = usePreviewData();
  
  // Get industry-specific site data
  const { siteData } = useIndustrySiteData();
  
  // Always call hooks unconditionally
  const { content: websiteContent } = useWebsiteContent();
  
  // Use passed locationData as fallback
  const locationData = props?.locationData;
  
  // Priority: Preview data > Database content > Industry-specific site data > Fallback
  let title: string;
  let subtitle: string;
  
  if (isPreviewMode && previewConfig) {
    // In preview mode, use the preview config data
    title = previewConfig.hero.h1;
    subtitle = previewConfig.hero.sub || '';
  } else {
    // Normal mode - use database or industry config
    title = String(websiteContent?.hero_title || siteData?.hero.h1 || 'Professional Services');
    subtitle = String(websiteContent?.hero_subtitle || siteData?.hero.sub || 'Quality service for your needs');
  }

  return {
    title,
    subtitle,
    isLocation: false, // All sites are now tenant-based
    locationName: locationData?.city ?? ''
  };
};
