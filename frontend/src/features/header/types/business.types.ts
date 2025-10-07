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
  business_email: string;
  personal_email: string;
  first_name: string;
  last_name: string;
  personal_phone: string;
  business_start_date: string;
  website: string;
  gbp_url: string;
  facebook_url: string;
  youtube_url: string;
  tiktok_url: string;
  instagram_url: string;
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
