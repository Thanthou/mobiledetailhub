// Header feature types - minimal set for current implementation

// Navigation link structure
export interface NavLink {
  name: string;
  href: string;
  isFAQ?: boolean;
  isGallery?: boolean;
}

// Social media configuration
export interface SocialMediaConfig {
  facebook?: string;
  instagram?: string;
  tiktok?: string;
  youtube?: string;
}
