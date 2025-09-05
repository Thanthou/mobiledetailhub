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

export interface ReviewResponse {
  success: boolean;
  data: DatabaseReview;
  message?: string;
  error?: string;
}

// Review submission interface
export interface ReviewSubmission {
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
  review_source?: 'website' | 'google' | 'yelp' | 'facebook' | 'imported';
  service_category?: string;
  service_date?: string;
  booking_id?: number;
}

// Review update interface (admin only)
export interface ReviewUpdate {
  rating?: number;
  title?: string;
  content?: string;
  reviewer_name?: string;
  reviewer_email?: string;
  reviewer_phone?: string;
  reviewer_avatar_url?: string;
  status?: 'pending' | 'approved' | 'rejected' | 'hidden';
  moderation_notes?: string;
  is_verified?: boolean;
  verification_method?: 'email' | 'phone' | 'booking' | 'external';
  service_category?: string;
  service_date?: string;
  is_featured?: boolean;
}

// Review vote interface
export interface ReviewVote {
  vote_type: 'helpful' | 'not_helpful';
  user_ip: string;
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

export interface ReviewsProps {
  reviews?: Review[];
  maxReviews?: number;
  reviewType?: 'affiliate' | 'mdh';
  businessSlug?: string;
  featuredOnly?: boolean;
  verifiedOnly?: boolean;
}

export interface ReviewCardProps {
  review: Review;
  showVoting?: boolean;
  onVote?: (reviewId: string, voteType: 'helpful' | 'not_helpful') => void;
  onReviewClick?: (review: Review) => void;
}

export interface StarRatingProps {
  rating: number;
  maxStars?: number;
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
}

// Review form interfaces
export interface ReviewFormData {
  rating: number;
  title?: string;
  content: string;
  reviewer_name: string;
  reviewer_email?: string;
  reviewer_phone?: string;
  service_category?: string;
  service_date?: string;
}

export interface ReviewFormProps {
  businessSlug?: string;
  businessName?: string;
  reviewType: 'affiliate' | 'mdh';
  onSubmit: (data: ReviewFormData) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
}