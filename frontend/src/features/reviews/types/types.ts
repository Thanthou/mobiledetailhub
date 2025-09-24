// Database review interface (matches reputation.reviews table)
export interface DatabaseReview {
  id: number;
  review_type: 'affiliate' | 'mdh';
  affiliate_id?: number;
  business_slug?: string;
  rating: number;
  title?: string;
  content: string;
  reviewer_name: string;
  reviewer_email?: string;
  reviewer_phone?: string;
  reviewer_avatar_url?: string;
  reviewer_url?: string;
  review_source: 'website' | 'google' | 'yelp' | 'facebook' | 'imported';
  status: 'pending' | 'approved' | 'rejected' | 'hidden';
  moderation_notes?: string;
  moderated_by?: number;
  moderated_at?: string;
  is_verified: boolean;
  verification_method?: 'email' | 'phone' | 'booking' | 'external';
  service_category?: string;
  service_date?: string;
  booking_id?: number;
  helpful_votes: number;
  total_votes: number;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
  published_at?: string;
  business_name?: string;
  business_slug_actual?: string;
}

// Frontend review interface (simplified for display)
export interface Review {
  id: string;
  customerName: string;
  profileImage?: string;
  rating: number;
  reviewText: string;
  title?: string;
  date: string;
  isVerified?: boolean;
  isFeatured?: boolean;
  helpfulVotes?: number;
  totalVotes?: number;
  serviceCategory?: string;
  businessName?: string;
  businessSlug?: string;
  reviewSource?: 'website' | 'google' | 'yelp' | 'facebook' | 'imported';
  reviewerUrl?: string;
}

// API response interfaces
export interface ReviewsResponse {
  success: boolean;
  data: DatabaseReview[];
  pagination?: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
  message?: string;
  error?: string;
}

// Review query parameters
export interface ReviewQueryParams {
  type?: 'affiliate' | 'mdh';
  affiliate_id?: number;
  business_slug?: string;
  status?: 'pending' | 'approved' | 'rejected' | 'hidden';
  limit?: number;
  offset?: number;
  featured_only?: boolean;
  verified_only?: boolean;
}

// Component props
export interface ReviewsProps {
  maxReviews?: number;
  reviewType?: 'affiliate' | 'mdh';
  businessSlug?: string;
  featuredOnly?: boolean;
  verifiedOnly?: boolean;
  customHeading?: string;
  customIntro?: string;
  feedKey?: string; // for future GBP/Yelp integration
  locationData?: any; // location-specific data
}
