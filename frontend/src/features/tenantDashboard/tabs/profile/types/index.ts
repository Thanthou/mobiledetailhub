export interface BusinessData {
  id: number;
  slug: string;
  business_name: string;
  owner: string;
  first_name: string;
  last_name: string;
  user_id: number;
  application_status: string;
  business_start_date: string;
  business_phone: string;
  personal_phone: string;
  business_email: string;
  personal_email: string;
  twilio_phone: string;
  sms_phone: string;
  website: string; // Database column is 'website', not 'website_url'
  gbp_url: string;
  facebook_url: string;
  instagram_url: string;
  youtube_url: string;
  tiktok_url: string;
  source: string;
  notes: string;
  service_areas: Array<{ city: string; state: string; zip?: string }>;
  application_date: string;
  approved_date: string;
  last_activity: string;
  created_at: string;
  updated_at: string;
}

export interface ProfileFormProps {
  businessData: BusinessData | null;
  onUpdate: (data: Partial<BusinessData>) => Promise<boolean>;
  isUpdating: boolean;
}

export interface UseProfileDataReturn {
  businessData: BusinessData | null;
  loading: boolean;
  error: string | null;
  updateBusiness: (data: Partial<BusinessData>) => Promise<boolean>;
  isUpdating: boolean;
}