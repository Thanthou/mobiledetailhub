/**
 * MDH Static Configuration
 * 
 * This provides instant fallback data for header/footer rendering
 * when the database is unavailable or during initial page load.
 * 
 * The data structure matches the database schema from system.system_config
 * and the API response from /api/mdh-config
 */

export interface MDHStaticConfig {
  // Basic business info
  name: string;
  url: string;
  logo: string;
  phone: string;
  email: string;
  
  // Social media links
  socials: {
    facebook: string;
    instagram: string;
    youtube: string;
    tiktok: string;
  };
  
  // Display and branding
  header_display: string;
  tagline: string;
  services_description: string;
  
  // Assets
  logo_url: string;
  favicon_url: string;
  ogImage: string;
  
  // Timestamps (will be updated by API)
  created_at: string;
  updated_at: string;
}

export interface MDHConfig {
  id: number;
  email: string;
  phone: string;
  sms_phone: string;
  logo_url: string;
  favicon_url: string;
  header_display: string;
  tagline: string;
  services_description: string;
  facebook: string;
  instagram: string;
  tiktok: string;
  youtube: string;
  created_at: string;
  updated_at: string;
}

/**
 * Static MDH configuration data
 * This matches the structure expected by the MDHConfigContext
 */
export const mdhStaticConfig: MDHStaticConfig = {
  // Basic business info
  name: "Mobile Detail Hub",
  url: "https://mobiledetailhub.com/",
  logo: "/icons/logo.webp",
  phone: "(888) 555-1234",
  email: "service@mobiledetailhub.com",
  
  // Social media links
  socials: {
    facebook: "https://www.facebook.com/mobiledetailhub",
    instagram: "https://www.instagram.com/mobiledetailhub",
    youtube: "https://www.youtube.com/@mobiledetailhub",
    tiktok: "https://www.tiktok.com/@mobiledetailhub"
  },
  
  // Display and branding
  header_display: "Mobile Detail Hub",
  tagline: "Mobile Car, Boat & RV Detailing Near You",
  services_description: "Find trusted mobile detailers for cars, boats, and RVs with Mobile Detail Hub. Compare services, read reviews, and book online with verified pros in your area.",
  
  // Assets
  logo_url: "/icons/logo.webp",
  favicon_url: "/icons/favicon.webp",
  ogImage: "/hero/image1.png",
  
  // Timestamps (will be updated by API)
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

/**
 * Converts static config to database format
 * This ensures compatibility with the MDHConfigContext
 */
export const convertStaticToDatabaseFormat = (staticConfig: MDHStaticConfig): MDHConfig => ({
  id: 1,
  email: staticConfig.email,
  phone: staticConfig.phone,
  sms_phone: staticConfig.phone, // Use same phone for SMS
  logo_url: staticConfig.logo_url,
  favicon_url: staticConfig.favicon_url,
  header_display: staticConfig.header_display,
  tagline: staticConfig.tagline,
  services_description: staticConfig.services_description,
  facebook: staticConfig.socials.facebook,
  instagram: staticConfig.socials.instagram,
  tiktok: staticConfig.socials.tiktok,
  youtube: staticConfig.socials.youtube,
  created_at: staticConfig.created_at,
  updated_at: staticConfig.updated_at
});

/**
 * Get static config in database format
 * This is the main export used by MDHConfigContext
 */
export const getStaticMDHConfig = (): MDHConfig => {
  return convertStaticToDatabaseFormat(mdhStaticConfig);
};
