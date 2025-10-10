/**
 * Centralized Tenant Types & Configuration
 * Single source of truth for multi-vertical tenant management
 * 
 * Philosophy: Start minimal, expand as needed
 * - Only 10 core fields are required (matching current usage)
 * - Everything else is optional and can be added later
 * - Structure is organized for future expansion
 * 
 * Prevents duplication across verticals (detailing, petGrooming, etc.)
 * Aligned with backend database schemas and enums
 */

// ============================================================================
// Core Tenant Identification
// ============================================================================

/**
 * Unique identifier for a tenant (affiliate/business)
 */
export type TenantId = string | number;

/**
 * Business vertical types
 * Extensible for future verticals
 * 
 * Format: kebab-case (matches database, file paths, and API)
 * This ensures consistency across:
 * - Database industry column
 * - Folder structure: /src/data/{vertical}/
 * - Public assets: /public/{vertical}/icons/
 * - API responses
 */
export type Vertical = 
  | 'mobile-detailing'   // Auto/boat/RV detailing
  | 'pet-grooming'       // Pet grooming services (future)
  | 'lawn-care'          // Lawn & landscaping (future)
  | 'maid-service'       // Cleaning services (future)
  | 'hvac'               // HVAC services (future)
  | 'plumbing'           // Plumbing services (future)
  | 'electrical';        // Electrical services (future)

/**
 * Legacy alias for backward compatibility
 * @deprecated Use Vertical instead
 */
export type IndustryType = Vertical;

/**
 * Application/approval status
 */
export type TenantStatus = 
  | 'pending'
  | 'approved'
  | 'active'
  | 'suspended'
  | 'rejected';

/**
 * User role within a tenant organization
 */
export type TenantUserRole = 
  | 'owner'
  | 'manager'
  | 'tech'        // Technician/service provider
  | 'viewer';     // Read-only access

// ============================================================================
// Service Catalog Types (FUTURE - not used yet)
// ============================================================================
// Placeholder for when service catalog is needed
// These types align with backend database schemas

/**
 * Service categories (for future use)
 * Aligned with backend service_category enum
 */
export type ServiceCategory =
  | 'interior'
  | 'exterior'
  | 'service-packages'
  | 'addons'
  | 'ceramic-coating'
  | 'paint-correction'
  | 'paint-protection-film'
  | 'auto'
  | 'boat'
  | 'rv'
  | 'ppf'
  | 'ceramic';

/**
 * Vehicle types (for future use)
 */
export type VehicleType = 'auto' | 'boat' | 'rv' | 'truck' | 'motorcycle' | 'off-road';

/**
 * Service pricing tier (for future use)
 */
export interface ServiceTier {
  id: string | number;
  name: string;
  priceCents: number;
  durationMinutes: number;
  description: string;
  features: string[];
  popular?: boolean;
  enabled?: boolean;
  sortOrder?: number;
}

/**
 * Service definition (for future use)
 */
export interface Service {
  id: string | number;
  name: string;
  slug?: string;
  category: ServiceCategory;
  description?: string;
  vehicleTypes?: VehicleType[];
  basePriceCents?: number;
  tiers?: ServiceTier[];
  active?: boolean;
  featured?: boolean;
  metadata?: Record<string, unknown>;
}

/**
 * Service catalog (for future use)
 */
export interface ServiceCatalog {
  [category: string]: Service[];
}

// ============================================================================
// Branding & Visual Identity
// ============================================================================

/**
 * Logo configuration
 * REQUIRED: url (maps to current logo_url)
 * OPTIONAL: Everything else for future enhancement
 */
export interface Logo {
  url: string;                     // ✓ REQUIRED - Primary logo URL
  alt?: string;                    // Alt text for accessibility
  darkUrl?: string;                // Dark mode variant (future)
  lightUrl?: string;               // Light mode variant (future)
  width?: number;                  // Preferred width (future)
  height?: number;                 // Preferred height (future)
}

/**
 * Tenant branding configuration
 * REQUIRED: businessName, logo.url
 * OPTIONAL: Everything else for future use
 */
export interface TenantBranding {
  businessName: string;            // ✓ REQUIRED - Legal/display business name
  logo: Logo;                      // ✓ REQUIRED - At least logo.url
  tagline?: string;                // Marketing tagline (future)
  favicon?: string;                // Favicon URL (future)
  colors?: {                       // Brand colors (future)
    primary?: string;
    secondary?: string;
    accent?: string;
  };
  theme?: 'default' | 'southwest' | 'coastal' | 'modern' | 'classic';  // Future
}

// ============================================================================
// Contact & Social
// ============================================================================

/**
 * Phone numbers
 * REQUIRED: main (maps to current phone field)
 */
export interface PhoneNumbers {
  main: string;                    // ✓ REQUIRED - Primary business phone
  sms?: string;                    // SMS-capable number (future)
  twilio?: string;                 // Twilio integration number (future)
}

/**
 * Email addresses
 * REQUIRED: primary (maps to current email field)
 */
export interface EmailAddresses {
  primary: string;                 // ✓ REQUIRED - Primary contact email
  support?: string;                // Customer support (future)
  billing?: string;                // Billing inquiries (future)
}

/**
 * Social media profiles
 * REQUIRED: facebook, instagram, tiktok, youtube (maps to current fields)
 * Can be empty strings if not used
 */
export interface SocialMediaLinks {
  facebook: string;                // ✓ REQUIRED - Facebook URL or empty
  instagram: string;               // ✓ REQUIRED - Instagram URL or empty
  tiktok: string;                  // ✓ REQUIRED - TikTok URL or empty
  youtube: string;                 // ✓ REQUIRED - YouTube URL or empty
  twitter?: string;                // Future
  linkedin?: string;               // Future
  yelp?: string;                   // Future
  gbp?: string;                    // Google Business Profile (future)
}

/**
 * Base location info
 * REQUIRED: city, state (maps to current base_location)
 */
export interface BaseLocation {
  city: string;                    // ✓ REQUIRED - Primary city
  state: string;                   // ✓ REQUIRED - Primary state
}

/**
 * Contact information bundle
 * REQUIRED: phones.main, emails.primary, socials (all 4), baseLocation
 */
export interface ContactInfo {
  phones: PhoneNumbers;            // ✓ REQUIRED
  emails: EmailAddresses;          // ✓ REQUIRED
  socials: SocialMediaLinks;       // ✓ REQUIRED
  baseLocation: BaseLocation;      // ✓ REQUIRED
  address?: {                      // Future - full address
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
  };
}

// ============================================================================
// Service Areas & Locations (FUTURE - placeholder)
// ============================================================================

/**
 * Geographic service area (for future use)
 */
export interface ServiceArea {
  id?: string | number;
  city: string;
  citySlug: string;
  stateCode: string;
  stateName: string;
  zipCodes?: string[];
  latitude?: number;
  longitude?: number;
  radiusMiles?: number;
}

/**
 * Service area configuration (for future use)
 */
export interface ServiceAreaConfig {
  [stateCode: string]: ServiceArea[];
}

// ============================================================================
// Future Features (Placeholders - not used yet)
// ============================================================================

/**
 * SEO metadata (for future use)
 */
export interface SEOMetadata {
  title: string;
  description: string;
  keywords?: string[];
  canonicalPath?: string;
  ogImage?: string;
  twitterImage?: string;
  robots?: 'index,follow' | 'noindex,nofollow';
}

/**
 * FAQ item (for future use)
 */
export interface FAQItem {
  question: string;
  answer: string;
  category?: string;
}

/**
 * Location-specific page (for future use)
 */
export interface LocationPage {
  slug: string;
  city: string;
  stateCode: string;
  state: string;
  seo: SEOMetadata;
  faqs?: FAQItem[];
  pricingModifierPct?: number;
}

/**
 * Analytics configuration (for future use)
 */
export interface AnalyticsConfig {
  ga4?: string;
  googleAdsId?: string;
  facebookPixelId?: string;
}

/**
 * Payment configuration (for future use)
 */
export interface PaymentConfig {
  stripePublishableKey?: string;
  stripeAccountId?: string;
  acceptsPayments?: boolean;
  depositRequired?: boolean;
}

/**
 * Feature flags (for future use)
 */
export interface FeatureFlags {
  bookingEnabled?: boolean;
  loginEnabled?: boolean;
  reviewsEnabled?: boolean;
}

// ============================================================================
// Complete Tenant Configuration
// ============================================================================

/**
 * Minimal tenant configuration (current needs)
 * 
 * REQUIRED FIELDS (10 total - matching current usage):
 * ✓ id, slug, vertical, status
 * ✓ branding.businessName
 * ✓ branding.logo.url
 * ✓ contact.phones.main
 * ✓ contact.emails.primary
 * ✓ contact.socials (facebook, instagram, tiktok, youtube)
 * ✓ contact.baseLocation (city, state)
 * 
 * OPTIONAL FIELDS (everything else - add as needed):
 * - services (service catalog - future)
 * - serviceAreas (geographic coverage - future)
 * - locationPages (SEO pages - future)
 * - analytics (tracking - future)
 * - payment (Stripe integration - future)
 * - features (feature flags - future)
 * - All other fields
 */
export interface TenantConfig {
  // ============================================
  // CORE IDENTITY (4 required fields)
  // ============================================
  id: TenantId;                    // ✓ REQUIRED
  slug: string;                    // ✓ REQUIRED - URL-safe identifier
  vertical: Vertical;              // ✓ REQUIRED - Business vertical
  status: TenantStatus;            // ✓ REQUIRED - Approval status
  
  // ============================================
  // BRANDING (2 required fields)
  // ============================================
  branding: TenantBranding;        // ✓ REQUIRED
  // - branding.businessName (required)
  // - branding.logo.url (required)
  // - branding.tagline (optional)
  // - branding.colors (optional)
  // - branding.theme (optional)
  
  // ============================================
  // CONTACT (4 required fields nested)
  // ============================================
  contact: ContactInfo;            // ✓ REQUIRED
  // - contact.phones.main (required)
  // - contact.emails.primary (required)
  // - contact.socials.facebook (required, can be empty)
  // - contact.socials.instagram (required, can be empty)
  // - contact.socials.tiktok (required, can be empty)
  // - contact.socials.youtube (required, can be empty)
  // - contact.baseLocation.city (required)
  // - contact.baseLocation.state (required)
  // - contact.address (optional - future)
  
  // ============================================
  // FUTURE FEATURES (all optional)
  // ============================================
  services?: ServiceCatalog;       // Service catalog (future)
  enabledServiceCategories?: ServiceCategory[];
  
  serviceAreas?: ServiceAreaConfig; // Geographic coverage (future)
  serviceRadiusMiles?: number;
  
  locationPages?: LocationPage[];  // SEO landing pages (future)
  mainSiteSEO?: SEOMetadata;
  
  analytics?: AnalyticsConfig;     // Tracking integrations (future)
  payment?: PaymentConfig;         // Stripe integration (future)
  features?: FeatureFlags;         // Feature flags (future)
  
  domains?: string[];              // Custom domains (future)
  primaryDomain?: string;
  
  businessLicense?: string;        // Business details (future)
  insuranceProvider?: string;
  insuranceExpiry?: string;
  operatingHours?: Record<string, { open: string; close: string; closed?: boolean }>;
  
  rating?: number;                 // Performance metrics (future)
  reviewCount?: number;
  totalJobs?: number;
  
  metadata?: Record<string, unknown>; // Flexible additional data (future)
  createdAt?: string;
  updatedAt?: string;
  approvedAt?: string;
}

// ============================================================================
// Helper Types
// ============================================================================

/**
 * Partial tenant config for updates
 */
export type TenantConfigUpdate = Partial<TenantConfig>;

/**
 * Tenant summary (lightweight version for lists)
 */
export interface TenantSummary {
  id: TenantId;
  slug: string;
  businessName: string;
  vertical: Vertical;
  status: TenantStatus;
  mainPhone: string;
  email: string;
  rating?: number;
  reviewCount?: number;
}

/**
 * Tenant creation payload
 */
export type TenantCreatePayload = Omit<TenantConfig, 'id' | 'createdAt' | 'updatedAt' | 'approvedAt'>;

