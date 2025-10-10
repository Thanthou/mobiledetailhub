/**
 * Site Data Utilities
 * Industry-agnostic functions to transform and format data from site.json for display purposes
 * All functions accept MainSiteConfig to support multi-industry architecture
 */

import type { MainSiteConfig } from '@/shared/types/location';

import { formatPhoneNumber } from './phoneFormatter';

/**
 * Formats contact information from site.json for display
 */
export function formatContactInfo(siteConfig: MainSiteConfig) {
  return {
    phone: siteConfig.contact?.phone ? formatPhoneNumber(siteConfig.contact.phone) : '',
    email: siteConfig.contact?.email || '',
    phoneRaw: siteConfig.contact?.phone || '', // Raw phone for tel: links
  };
}

/**
 * Formats social media links for display
 */
export function formatSocialMedia(siteConfig: MainSiteConfig) {
  return {
    facebook: siteConfig.socials?.facebook || '',
    instagram: siteConfig.socials?.instagram || '',
    tiktok: siteConfig.socials?.tiktok || '',
    youtube: siteConfig.socials?.youtube || '',
  };
}

/**
 * Converts relative URLs to absolute URLs for SEO
 * Uses current window location to determine the domain (works for any industry/subdomain)
 */
export function getAbsoluteUrl(relativeUrl: string): string {
  if (!relativeUrl) return '';
  
  // If it's already an absolute URL, return as is
  if (relativeUrl.startsWith('http://') || relativeUrl.startsWith('https://')) {
    return relativeUrl;
  }
  
  // Use current window location (works for all industries/subdomains)
  if (typeof window !== 'undefined') {
    return `${window.location.protocol}//${window.location.host}${relativeUrl}`;
  }
  
  // Fallback for SSR (should rarely be hit)
  return relativeUrl;
}

/**
 * Formats SEO data for display
 */
export function formatSEO(siteConfig: MainSiteConfig) {
  return {
    title: siteConfig.seo.title || siteConfig.brand || '',
    description: siteConfig.seo.description || '',
    keywords: siteConfig.seo.keywords || [],
    canonical: getAbsoluteUrl(siteConfig.seo.canonicalPath || '/'),
    ogImage: getAbsoluteUrl(siteConfig.seo.ogImage || ''),
  };
}

/**
 * Formats hero section data for display
 */
export function formatHero(siteConfig: MainSiteConfig) {
  return {
    h1: siteConfig.hero.h1 || '',
    images: siteConfig.hero.images || [],
    finder: {
      placeholder: siteConfig.finder?.placeholder || '',
      sub: siteConfig.finder?.sub || '',
    },
  };
}

/**
 * Formats services grid data for display
 */
export function formatServices(siteConfig: MainSiteConfig) {
  return siteConfig.servicesGrid || [];
}

/**
 * Formats reviews data for display
 */
export function formatReviews(siteConfig: MainSiteConfig) {
  return {
    title: siteConfig.reviews?.title || '',
    subtitle: siteConfig.reviews?.subtitle || '',
    ratingValue: siteConfig.reviews?.ratingValue || '',
    reviewCount: siteConfig.reviews?.reviewCount || 0,
    source: siteConfig.reviews?.source || '',
  };
}

/**
 * Formats FAQ data for display
 */
export function formatFAQ(siteConfig: MainSiteConfig) {
  return {
    title: siteConfig.faq?.title || '',
    subtitle: siteConfig.faq?.subtitle || '',
  };
}

/**
 * Gets formatted business information
 */
export function getBusinessInfo(siteConfig: MainSiteConfig) {
  return {
    name: siteConfig.brand || '',
    logo: siteConfig.logo.url || '',
    logoAlt: siteConfig.logo.alt || '',
    slug: siteConfig.slug || '',
    urlPath: siteConfig.urlPath || '/',
  };
}

/**
 * Comprehensive site data formatter - formats all site data at once
 */
export function formatSiteData(siteConfig: MainSiteConfig) {
  return {
    business: getBusinessInfo(siteConfig),
    contact: formatContactInfo(siteConfig),
    socials: formatSocialMedia(siteConfig),
    seo: formatSEO(siteConfig),
    hero: formatHero(siteConfig),
    services: formatServices(siteConfig),
    reviews: formatReviews(siteConfig),
    faq: formatFAQ(siteConfig),
  };
}
