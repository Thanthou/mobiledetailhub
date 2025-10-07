import { useSiteContext } from '@/shared/utils/siteContext';
import { useWebsiteContent } from '@/shared/contexts/WebsiteContentContext';

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
  // Priority: Custom props > Database content > Location data > Site data > Fallback
  const title = props?.customHeading
    || (isLocation 
      ? websiteContent?.reviews_title ?? locationData?.reviewsSection?.heading ?? siteData?.reviews?.title ?? 'Customer Reviews'
      : websiteContent?.reviews_title ?? siteData?.reviews?.title ?? 'Customer Reviews');
    
  const subtitle = props?.customIntro
    || (isLocation
      ? websiteContent?.reviews_subtitle ?? locationData?.reviewsSection?.intro ?? siteData?.reviews?.subtitle ?? 'What our customers say'
      : websiteContent?.reviews_subtitle ?? siteData?.reviews?.subtitle ?? 'What our customers say');

  return {
    title,
    subtitle
  };
};

