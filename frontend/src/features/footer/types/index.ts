// Footer types for the new footer structure

export interface ServiceArea {
  city: string;
  state: string;
  primary?: boolean;
}

export interface SocialMediaConfig {
  facebook?: string;
  instagram?: string;
  tiktok?: string;
  youtube?: string;
}

export interface ContactConfig {
  phone?: string;
  email?: string;
  base_location?: {
    city?: string;
    state_name?: string;
  };
}

export interface FooterColumnProps {
  config?: ContactConfig;
  socialMedia?: SocialMediaConfig;
  serviceAreas?: ServiceArea[];
  onRequestQuote?: () => void;
  onQuoteHover?: () => void;
  onServiceAreaClick?: (city: string, state: string) => void;
}

export interface FooterBottomProps {
  businessInfo: {
    name: string;
  };
  onRequestQuote?: () => void;
}
