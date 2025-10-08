import { useWebsiteContent } from '@/shared/contexts/WebsiteContentContext';
import { useIndustrySiteData } from '@/shared/hooks/useIndustrySiteData';

interface UseReviewsContentReturn {
  title: string;
  subtitle: string;
}

interface UseReviewsContentProps {
  locationData?: any;
  customHeading?: string;
  customIntro?: string;
}

export const useReviewsContent = (props?: UseReviewsContentProps): UseReviewsContentReturn => {
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

