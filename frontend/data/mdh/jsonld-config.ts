/**
 * JSON-LD Configuration
 * 
 * This provides the data structure needed by jsonld-loader.js
 * It's separate from the main MDH config to avoid circular dependencies
 */

import { mdhStaticConfig } from './mdh-config';

export interface JSONLDConfig {
  name: string;
  url: string;
  logo: string;
  phone: string;
  email: string;
  socials: {
    facebook: string;
    instagram: string;
    youtube: string;
    tiktok: string;
  };
  header_display: string;
  tagline: string;
  services_description: string;
  logo_url: string;
  favicon_url: string;
  ogImage: string;
  created_at: string;
  updated_at: string;
}

/**
 * Convert MDH static config to JSON-LD format
 */
export const getJSONLDConfig = (): JSONLDConfig => ({
  name: mdhStaticConfig.header_display,
  url: mdhStaticConfig.url,
  logo: mdhStaticConfig.logo_url,
  phone: mdhStaticConfig.phone,
  email: mdhStaticConfig.email,
  socials: mdhStaticConfig.socials,
  header_display: mdhStaticConfig.header_display,
  tagline: mdhStaticConfig.tagline,
  services_description: mdhStaticConfig.services_description,
  logo_url: mdhStaticConfig.logo_url,
  favicon_url: mdhStaticConfig.favicon_url,
  ogImage: mdhStaticConfig.ogImage,
  created_at: mdhStaticConfig.created_at,
  updated_at: mdhStaticConfig.updated_at
});

/**
 * Set global window.__MDH__ object for JSON-LD loader
 * This should be called early in the app initialization
 */
export const initializeGlobalConfig = (): void => {
  if (typeof window !== 'undefined') {
    window.__MDH__ = getJSONLDConfig();
  }
};
