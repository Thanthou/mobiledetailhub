// Database review interface (matches reputation.reviews table)
export interface DatabaseReview {
  id: number;
  tenant_slug: string;
  customer_name: string;
  rating: number;
  comment: string;
  reviewer_url?: string;
  vehicle_type?: 'car' | 'truck' | 'suv' | 'boat' | 'rv' | 'motorcycle';
  paint_correction: boolean;
  ceramic_coating: boolean;
  paint_protection_film: boolean;
  source: 'website' | 'google' | 'yelp' | 'facebook';
  avatar_filename?: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
  published_at?: string;
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
  tenant_slug?: string;
  limit?: number;
  offset?: number;
}

// Component props
export interface ReviewsProps {
  maxReviews?: number;
  tenantSlug?: string;
  customHeading?: string;
  customIntro?: string;
  feedKey?: string; // for future GBP/Yelp integration
  locationData?: any; // location-specific data
}
