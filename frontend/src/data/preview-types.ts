/**
 * Shared Preview Data Types
 * 
 * Common types used across all industry preview data
 * 
 * Note: Services and FAQs use existing dynamic loaders from the industry configs,
 * so they're not included here. This is just business info and reviews.
 */

export interface PreviewBusiness {
  businessName: string;
  phone: string;
  email: string;
  city: string;
  state: string;
  tagline?: string; // Optional - only if displayed on preview page
  description?: string; // Optional - only if displayed on preview page
}

export interface PreviewReview {
  name: string;
  rating: number;
  text: string;
  date: string;
  avatar?: string; // Optional avatar image path
}

export interface IndustryPreviewData {
  business: PreviewBusiness;
  reviews: PreviewReview[];
}

