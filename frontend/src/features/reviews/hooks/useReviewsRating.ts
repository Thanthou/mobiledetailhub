import siteData from '@/data/mobile-detailing/site.json';
import { useWebsiteContent } from '@/shared/contexts/WebsiteContentContext';

interface UseReviewsRatingReturn {
  averageRating: number;
  totalReviews: number;
  googleBusinessUrl: string;
}

export const useReviewsRating = (): UseReviewsRatingReturn => {
  // Use static site data since we're now tenant-based
  
  // Try to get website content, but handle cases where provider isn't available
  let websiteContent = null;
  try {
    const { content } = useWebsiteContent();
    websiteContent = content;
  } catch {
    // WebsiteContentProvider not available, use fallbacks
    websiteContent = null;
  }
  
  // Pull from database first, then fall back to site data
  const averageRating = websiteContent?.reviews_avg_rating 
    ?? (siteData?.reviews?.ratingValue ? parseFloat(siteData.reviews.ratingValue) : 4.9);
    
  const totalReviews = websiteContent?.reviews_total_count 
    ?? siteData?.reviews?.reviewCount 
    ?? 112;
    
  const googleBusinessUrl = siteData?.socials?.googleBusiness 
    ?? 'https://share.google/fx8oPIguzvJmTarrl';

  return {
    averageRating,
    totalReviews,
    googleBusinessUrl
  };
};

