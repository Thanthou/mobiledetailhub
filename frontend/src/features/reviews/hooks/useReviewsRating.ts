import { useDataOptional } from '@/shared/contexts/DataContext';
import { useWebsiteContent } from '@/shared/contexts/WebsiteContentContext';

interface UseReviewsRatingReturn {
  averageRating: number;
  totalReviews: number;
  googleBusinessUrl: string;
}

export const useReviewsRating = (): UseReviewsRatingReturn => {
  // Always call hooks unconditionally (hooks rules)
  const data = useDataOptional();
  const { content: websiteContent } = useWebsiteContent();
  
  const isPreview = data?.isPreview || false;
  
  // In preview mode, return impressive stats
  if (isPreview) {
    return {
      averageRating: 4.9,
      totalReviews: 863,
      googleBusinessUrl: '#', // Dead link in preview
    };
  }
  
  // Pull reviews data from database, with sensible defaults
  const averageRating = websiteContent?.reviews_avg_rating ?? 4.9;
  const totalReviews = websiteContent?.reviews_total_count ?? 112;
  
  // Get Google Business URL from tenant's social media data (from DataContext)
  // Fall back to legacy site.json if available, then to a default placeholder
  const googleBusinessUrl = 
    data?.socialMedia?.googleBusiness 
    ?? data?.siteConfig?.socials?.googleBusiness 
    ?? '#';

  return {
    averageRating,
    totalReviews,
    googleBusinessUrl
  };
};

