/**
 * Site Data Utilities
 * Functions to transform and format data from site.json for display purposes
 */

import { formatPhoneNumber } from './phoneFormatter';

/**
 * Formats contact information from site.json for display
 */
export function formatContactInfo(siteData: any) {
  return {
    phone: siteData.contact?.phone ? formatPhoneNumber(siteData.contact.phone) : '',
    email: siteData.contact?.email || '',
    phoneRaw: siteData.contact?.phone || '', // Raw phone for tel: links
  };
}

/**
 * Formats social media links for display
 */
export function formatSocialMedia(siteData: any) {
  return {
    facebook: siteData.socials?.facebook || '',
    instagram: siteData.socials?.instagram || '',
    tiktok: siteData.socials?.tiktok || '',
    youtube: siteData.socials?.youtube || '',
  };
}

/**
 * Converts relative URLs to absolute URLs for SEO
 */
export function getAbsoluteUrl(relativeUrl: string): string {
  if (!relativeUrl) return '';
  
  // If it's already an absolute URL, return as is
  if (relativeUrl.startsWith('http://') || relativeUrl.startsWith('https://')) {
    return relativeUrl;
  }
  
  // In development, use localhost
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    return `${window.location.protocol}//${window.location.host}${relativeUrl}`;
  }
  
  // In production, use the canonical domain
  return `https://mobiledetailhub.com${relativeUrl}`;
}

/**
 * Formats SEO data for display
 */
export function formatSEO(siteData: any) {
  return {
    title: siteData.seo?.title || siteData.brand || 'Mobile Detail Hub',
    description: siteData.seo?.description || '',
    keywords: siteData.seo?.keywords || [],
    canonical: `https://mobiledetailhub.com${siteData.seo?.canonicalPath || '/'}`,
    ogImage: getAbsoluteUrl(siteData.seo?.ogImage || ''),
  };
}

/**
 * Formats hero section data for display
 */
export function formatHero(siteData: any) {
  return {
    h1: siteData.hero?.h1 || 'Professional Mobile Detailing',
    images: siteData.hero?.images || [],
    finder: {
      placeholder: siteData.finder?.placeholder || 'Enter your zip code or city to find services near you',
      sub: siteData.finder?.sub || 'We\'ll connect you with professional detailers in your area',
    },
  };
}

/**
 * Formats services grid data for display
 */
export function formatServices(siteData: any) {
  return siteData.servicesGrid || [];
}

/**
 * Formats reviews data for display
 */
export function formatReviews(siteData: any) {
  return {
    title: siteData.reviews?.title || 'What Our Customers Say',
    subtitle: siteData.reviews?.subtitle || 'Real reviews from real customers',
    items: siteData.reviews?.items || [],
  };
}

/**
 * Formats FAQ data for display
 */
export function formatFAQ(siteData: any) {
  return {
    title: siteData.faq?.title || 'Frequently Asked Questions',
    items: siteData.faq?.items || [],
  };
}

/**
 * Gets formatted business information
 */
export function getBusinessInfo(siteData: any) {
  return {
    name: siteData.brand || 'Mobile Detail Hub',
    logo: siteData.logo || '/icons/logo.webp',
    slug: siteData.slug || 'site',
    urlPath: siteData.urlPath || '/',
  };
}

/**
 * Comprehensive site data formatter - formats all site data at once
 */
export function formatSiteData(siteData: any) {
  return {
    business: getBusinessInfo(siteData),
    contact: formatContactInfo(siteData),
    socials: formatSocialMedia(siteData),
    seo: formatSEO(siteData),
    hero: formatHero(siteData),
    services: formatServices(siteData),
    reviews: formatReviews(siteData),
    faq: formatFAQ(siteData),
  };
}
