export interface BaseLocation {
  city: string;
  state: string;
  zip: string;
}

export interface ServiceArea {
  city: string;
  state: string;
  zip: number | null;
  primary: boolean;
  minimum: number;
  multiplier: number;
}



export interface UploadFile {
  name: string;
  size: number;
  type: string;
  url: string;
}

// Address interface for reusability
export interface Address {
  address: string;
  city: string;
  state: string;
  zip: string;
}

// Pricing plan interface
export interface PricingPlan {
  id: 'starter' | 'pro' | 'enterprise';
  name: string;
  price: number;
  interval: string;
  features: string[];
  popular?: boolean;
}

// Preview state interface
export interface PreviewState {
  fromPreview?: boolean;
  businessName?: string;
  phone?: string;
  city?: string;
  state?: string;
  industry?: string;
}

// New simplified tenant application interface
export interface TenantApplication {
  id?: string;
  firstName: string;
  lastName: string;
  personalPhone: string;
  personalEmail: string;
  businessName: string;
  businessPhone: string;
  businessEmail: string;
  businessAddress: Address;
  selectedPlan: 'starter' | 'pro' | 'enterprise' | '';
  planPrice: number;
  paymentMethod: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  billingAddress: Address;
  useSameAddress: boolean;
  industry?: string;
  step: number;
  status: 'draft' | 'pending' | 'approved' | 'rejected';
}

// Legacy interface for backward compatibility
export interface AffiliateApplication {
  legal_name: string;
  primary_contact: string;
  phone: string;
  email: string;
  base_location: BaseLocation;
  categories: string[];
  gbp_url?: string;
  instagram_url?: string;
  tiktok_url?: string;
  facebook_url?: string;
  youtube_url?: string;
  website_url?: string;
  uploads?: UploadFile[];
  has_insurance: boolean;
  accept_terms: boolean;
  consent_notifications: boolean;
  source: string;
  notes?: string;
}

export const US_STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
];

export const CATEGORIES = [
  'Auto Detailing',
  'Boat Detailing',
  'RV Detailing',
  'PPF Installation',
  'Ceramic Coating',
  'Paint Correction'
];

export const SOURCES = [
  'Google Search',
  'Social Media',
  'Referral',
  'Direct Mail',
  'Other'
];

// Pricing plans with updated $15/$25/$35 pricing
export const pricingPlans: PricingPlan[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: 15,
    interval: 'month',
    features: [
      'Single location website',
      '5 custom pages',
      'Mobile responsive design',
      'Contact form integration',
      'Basic SEO optimization',
      'SSL certificate included',
      'Email support',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 25,
    interval: 'month',
    popular: true,
    features: [
      'Multi-location support',
      'Unlimited pages',
      'Advanced SEO tools',
      'Online booking system',
      'Google Maps integration',
      'Analytics dashboard',
      'Priority support',
      'Custom domain',
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 35,
    interval: 'month',
    features: [
      'Everything in Pro',
      'Custom development',
      'API integrations',
      'Dedicated account manager',
      'White-label options',
      'SLA guarantee',
      '24/7 phone support',
    ],
  },
];

// Default values for new simplified tenant application
export const tenantApplicationDefaultValues: TenantApplication = {
  firstName: '',
  lastName: '',
  personalPhone: '',
  personalEmail: '',
  businessName: '',
  businessPhone: '',
  businessEmail: '',
  businessAddress: {
    address: '',
    city: '',
    state: '',
    zip: ''
  },
  selectedPlan: '',
  planPrice: 0,
  paymentMethod: '',
  cardNumber: '',
  expiryDate: '',
  cvv: '',
  billingAddress: {
    address: '',
    city: '',
    state: '',
    zip: ''
  },
  useSameAddress: true,
  industry: 'mobile-detailing',
  step: 0,
  status: 'draft'
};

// Legacy default values for backward compatibility
export const defaultValues: AffiliateApplication = {
  legal_name: '',
  primary_contact: '',
  phone: '',
  email: '',
  base_location: {
    city: '',
    state: '',
    zip: ''
  },
  categories: [],
  gbp_url: '',
  instagram_url: '',
  tiktok_url: '',
  facebook_url: '',
  youtube_url: '',
  website_url: '',
  uploads: [],
  has_insurance: false,
  accept_terms: false,
  consent_notifications: false,
  source: '',
  notes: ''
};
