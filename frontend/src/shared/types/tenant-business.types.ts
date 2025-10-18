// Tenant business data from API
// Shared types for API responses

export interface Business {
  id: number;
  slug: string;
  business_name: string;
  application_status: string;
  business_phone: string;
  sms_phone: string;
  twilio_phone: string;
  service_areas: ServiceArea[];
  owner: string;
  business_email: string | null;
  personal_email: string;
  first_name: string;
  last_name: string;
  personal_phone: string;
  business_start_date: string;
  website: string;
  gbp_url: string | null;
  facebook_url: string | null;
  facebook_enabled: boolean;
  youtube_url: string | null;
  youtube_enabled: boolean;
  tiktok_url: string | null;
  tiktok_enabled: boolean;
  instagram_url: string | null;
  instagram_enabled: boolean;
  industry: string;
  created_at: string;
  updated_at: string;
}

export interface ServiceArea {
  city: string;
  state: string;
  zip?: string;
  primary?: boolean;
  minimum?: number;
  multiplier?: number;
}

export interface BusinessResponse {
  success: boolean;
  data: Business;
}

