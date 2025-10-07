/**
 * Affiliate/Tenant types for white-labeling support
 */

export type IndustryType = 'mobile-detailing' | 'pet-grooming' | 'lawncare' | 'maid-service';

export interface ServiceArea {
  zip?: string;
  city: string;
  state: string;
  primary?: boolean;
  minimum?: number;
  multiplier?: number;
}

export interface Affiliate {
  id: number;
  slug: string;
  business_name: string;
  owner: string;
  first_name: string;
  last_name: string;
  user_id?: number;
  application_status: 'pending' | 'approved' | 'rejected';
  business_start_date: string;
  business_phone: string;
  personal_phone?: string;
  business_email: string;
  personal_email?: string;
  twilio_phone: string;
  sms_phone: string;
  website: string;
  gbp_url?: string;
  facebook_url?: string;
  instagram_url?: string;
  youtube_url?: string;
  tiktok_url?: string;
  source: string;
  notes?: string;
  service_areas: ServiceArea[];
  application_date: string;
  approved_date?: string;
  last_activity: string;
  created_at: string;
  updated_at: string;
  google_maps_url?: string;
  industry: IndustryType; // New field for white-labeling
}

export interface AffiliateConfig {
  industry: IndustryType;
  siteConfig: {
    tenant: {
      brand: string | null;
      businessName: string;
      customBranding: boolean;
    };
    // Add other config fields as needed
  };
}
