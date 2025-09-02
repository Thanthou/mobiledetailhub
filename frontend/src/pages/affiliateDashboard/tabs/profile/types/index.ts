export interface ProfileData {
  // Personal Information
  first_name: string;
  last_name: string;
  personal_phone: string;
  personal_email: string;
  
  // Business Information
  business_name: string;
  business_email: string;
  business_phone: string;
  business_start_date: string;
  
  // URLs
  website_url?: string;
  gbp_url?: string;
  facebook_url?: string;
  youtube_url?: string;
  tiktok_url?: string;
  instagram_url?: string;
  
  // Additional fields from database
  id?: number;
  slug?: string;
  owner?: string;
  email?: string; // Legacy field
  phone?: string; // Legacy field
  created_at?: string;
  updated_at?: string;
}

export interface ProfileFormData {
  // Personal Information
  first_name: string;
  last_name: string;
  personal_phone: string;
  personal_email: string;
  
  // Business Information
  business_name: string;
  business_email: string;
  business_phone: string;
  business_start_date: string;
  
  // URLs
  website_url?: string; // Auto-generated, not user-editable
  gbp_url: string;
  facebook_url: string;
  youtube_url: string;
  tiktok_url: string;
  instagram_url: string;
}

export interface ProfileUpdateResponse {
  success: boolean;
  data?: ProfileData;
  error?: string;
}

export interface ProfileValidationErrors {
  first_name?: string;
  last_name?: string;
  personal_phone?: string;
  personal_email?: string;
  business_name?: string;
  business_email?: string;
  business_phone?: string;
  business_start_date?: string;
  website_url?: string;
  gbp_url?: string;
  facebook_url?: string;
  youtube_url?: string;
  tiktok_url?: string;
  instagram_url?: string;
}
