import { useWebsiteContent } from '@/shared/contexts/WebsiteContentContext';
import { useIndustrySiteData } from '@/shared/hooks/useIndustrySiteData';

interface UseReviewsContentReturn {
  title: string;
  subtitle: string;
}

interface UseReviewsContentProps {
  locationData?: unknown;
  customHeading?: string;
  customIntro?: string;
}

export const useReviewsContent = (props?: UseReviewsContentProps): UseReviewsContentReturn => {
  // Get industry-specific site data
  const { siteData } = useIndustrySiteData();
  
  // Always call hooks unconditionally
  const { content: websiteContent } = useWebsiteContent();
  
  // Use passed locationData as fallback (reserved for future use)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- Reserved for future location-specific data
  const _locationData = props?.locationData;
  
  // All sites are now tenant-based, so use database content or industry-specific site data
  // Priority: Custom props > Database content > Industry-specific site data > Fallback
  const title = props?.customHeading
    || websiteContent?.reviews_title
    || (siteData?.reviews?.title ?? 'Customer Reviews');
    
  const subtitle = props?.customIntro
    || websiteContent?.reviews_subtitle
    || (siteData?.reviews?.subtitle ?? 'What our customers say');

  return {
    title,
    subtitle
  };
};

