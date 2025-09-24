/**
 * Comprehensive TypeScript interfaces for location page data structure
 * Supports both main site configuration and city-specific overrides
 */

export interface LocationPage {
  // Core identification
  slug: string;
  city: string;
  stateCode: string; // e.g., "AZ"
  state: string;     // e.g., "Arizona"
  postalCode: string; // e.g., "86442"
  latitude: number; // e.g., 35.1359
  longitude: number; // e.g., -114.5286
  openingHours?: string | string[]; // e.g., ["Mo-Fr 06:00-20:00", "Sa 06:00-20:00", "Su 06:00-20:00"]
  urlPath: string;   // "/az/bullhead-city/"
  
  // Affiliate/employee references
  affiliateRef?: string; // maps to /data/affiliates/{affiliateRef}.json
  employee?: string;     // legacy alias for backward compatibility

  // Header overrides
  header?: {
    businessName?: string;   // "JP's Mobile Detailing"
    phoneDisplay?: string;   // "(928) 555-1234"
    phoneE164?: string;      // "+19285551234"
    cityStateLabel?: string; // "Bullhead City, AZ"
  };

  // SEO configuration
  seo: {
    title: string;
    description: string;
    keywords?: string[];
    canonicalPath: string;
    ogImage?: string;
    twitterImage?: string;
    robots?: "index,follow" | "noindex,nofollow";
  };

  // Hero section
  hero: {
    h1: string;
    sub?: string;
    // Note: Hero images are referenced from the images array by role: "hero"
  };

  // Content sections
  faqIntro?: string; // camelCase version of faq-intro
  neighborhoods?: string[];
  landmarks?: string[];
  localConditions?: string[];

  // Pricing
  pricingModifierPct?: number; // decimal percent: 0.00 = no markup, 0.10 = +10% markup, -0.05 = -5% discount

  // Images with performance optimization
  images?: Array<{
    url: string; // Image URL path (serves as both public URL and file path)
    alt: string;
    caption?: string;
            role: "hero" | "gallery" | "process" | "result" | "auto" | "marine" | "rv";
    width?: number;
    height?: number;
    priority?: boolean;
    sources?: Array<{
      srcset: string;
      type: string; // "image/webp", "image/avif", etc.
    }>;
  }>;

  // FAQ structure with analytics support
  faqs?: Array<{
    id?: string; // for analytics and A/B testing
    q: string;
    a: string;
  }>;

  // Reviews section
  reviewsSection?: {
    heading?: string;
    intro?: string;
    feedKey?: string; // for future GBP/Yelp integration
  };

  // Service area coverage
  serviceArea?: {
    postalCodes?: string[];
    // Future: could add polygon coordinates for precise mapping
  };

  // Operational information
  ops?: {
    acceptsSameDay?: boolean;
    leadTimeDays?: number;
    serviceRadiusMiles?: number;
  };

  // Schema.org structured data (most fields auto-generated from other location data)
  schemaOrg?: {
    // Auto-generated fields: name (from header.businessName), addressLocality (from city), 
    // addressRegion (from stateCode), postalCode (from postalCode), latitude/longitude (from top-level fields),
    // openingHours (from top-level openingHours), areaServed (from neighborhoods), url (from urlPath), 
    // telephone (from header.phoneE164), image (from images array with role: "hero"), 
    // aggregateRating (from site.json)
    
    // Manual fields only (if any):
    aggregateRating?: {
      "@type"?: string;
      ratingValue?: number;
      reviewCount?: number;
      bestRating?: number;
      worstRating?: number;
    };
    review?: Array<{
      "@type"?: string;
      author?: {
        "@type"?: string;
        name?: string;
      };
      reviewRating?: {
        "@type"?: string;
        ratingValue?: number;
        bestRating?: number;
        worstRating?: number;
      };
      reviewBody?: string;
    }>;
    // Allow additional schema properties
    [key: string]: unknown;
  };
}

/**
 * Main site configuration interface
 * Contains default values that city configs can override
 * Note: Header information comes from location-specific configs, not main config
 */
export interface MainSiteConfig {
  brand: string;
  slug: string;
  urlPath: string;
  
  logo: {
    url: string;
    alt: string;
    darkUrl?: string;
    lightUrl?: string;
  };

  seo: {
    title: string;
    description: string;
    keywords?: string[];
    canonicalPath: string;
    ogImage?: string;
    twitterImage?: string;
    robots?: "index,follow" | "noindex,nofollow";
  };

  hero: {
    h1: string;
    sub?: string;
    images?: Array<{
      url: string; // Image URL path (serves as both public URL and file path)
      alt: string;
      width?: number;
      height?: number;
      priority?: boolean;
    }>;
    ctas?: Array<{
      label: string;
      href: string;
    }>;
  };

  finder?: {
    placeholder?: string;
    sub?: string;
  };

  servicesGrid?: Array<{
    slug: string;
    title: string;
    image: string;
    alt: string;
    href: string;
    width?: number;
    height?: number;
    priority?: boolean;
  }>;

  reviews?: {
    title: string;
    subtitle?: string;
    ratingValue?: string;
    reviewCount?: number;
    source?: string;
  };

  faq?: {
    title: string;
    subtitle?: string;
  };

  contact?: {
    email?: string;
    phone?: string;
  };

  socials?: {
    facebook?: string;
    instagram?: string;
    tiktok?: string;
    youtube?: string;
    googleBusiness?: string;
  };

  jsonLd?: {
    organization?: Record<string, unknown>;
    website?: Record<string, unknown>;
  };
}

/**
 * Merged configuration type
 * Result of merging MainSiteConfig with LocationPage overrides
 */
export interface MergedLocationConfig extends LocationPage {
  // Inherits all LocationPage properties
  // Additional merged properties can be added here
}

/**
 * Utility types for type safety
 */
export type ImageRole = "hero" | "gallery" | "process" | "result";
export type RobotsDirective = "index,follow" | "noindex,nofollow";
export type SchemaOrgType = "LocalBusiness" | "WebSite" | "WebPage" | "Organization";

/**
 * Configuration validation result
 */
export interface ConfigValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}
