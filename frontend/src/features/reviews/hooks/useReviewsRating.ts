import siteDataRaw from '@/data/mobile-detailing/site.json';
import { useDataOptional } from '@/shared/contexts/DataContext';
import { useWebsiteContent } from '@/shared/contexts/WebsiteContentContext';
import type { MainSiteConfig } from '@/shared/types/location';

const siteData = siteDataRaw as MainSiteConfig;

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
  
  // Pull from database first, then fall back to site data
  const averageRating = websiteContent?.reviews_avg_rating 
    ?? (siteData.reviews?.ratingValue ? parseFloat(siteData.reviews.ratingValue) : 4.9);
    
  const totalReviews = websiteContent?.reviews_total_count 
    ?? siteData.reviews?.reviewCount 
    ?? 112;
    
  const googleBusinessUrl = siteData.socials?.googleBusiness 
    ?? 'https://share.google/fx8oPIguzvJmTarrl';

  return {
    averageRating,
    totalReviews,
    googleBusinessUrl
  };
};

