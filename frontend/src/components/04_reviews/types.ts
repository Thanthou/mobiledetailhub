export interface Review {
  id: string;
  customerName: string;
  profileImage?: string;
  rating: number;
  reviewText: string;
  date: string;
  isVerified?: boolean;
}

export interface ReviewsProps {
  reviews?: Review[];
  maxReviews?: number;
  showGoogleBadge?: boolean;
}

export interface ReviewCardProps {
  review: Review;
}

export interface StarRatingProps {
  rating: number;
  maxStars?: number;
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
}