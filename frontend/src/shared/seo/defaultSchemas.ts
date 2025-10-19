/**
 * Default JSON-LD schemas for the main platform
 * Used when no tenant-specific data is available
 */

import { getOrganizationSchema, getWebsiteSchema } from './jsonld';

// Default organization schema for That Smart Site
export const defaultOrganizationSchema = getOrganizationSchema({
  name: "That Smart Site",
  url: "https://thatsmartsite.com",
  description: "Multi-tenant website platform for local service businesses. Mobile detailing, maid service, lawn care, pet grooming, and more.",
  contactPoint: {
    telephone: "+1-555-0123",
    contactType: "customer service",
    email: "support@thatsmartsite.com",
  },
  sameAs: [
    "https://facebook.com/thatsmartsite",
    "https://twitter.com/thatsmartsite",
    "https://linkedin.com/company/thatsmartsite",
  ],
});

// Default website schema for the main platform
export const defaultWebsiteSchema = getWebsiteSchema({
  name: "That Smart Site",
  url: "https://thatsmartsite.com",
  description: "Professional website platform for local service businesses. Get online fast with mobile detailing, maid service, lawn care, pet grooming, and more.",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://thatsmartsite.com/search?q={search_term_string}",
    "query-input": "required name=search_term_string",
  },
});

// Default FAQ schema for the main platform
export const defaultFAQSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is That Smart Site?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "That Smart Site is a multi-tenant website platform designed specifically for local service businesses. We help mobile detailers, maid services, lawn care companies, pet groomers, and barber shops get online quickly with professional, SEO-optimized websites.",
      },
    },
    {
      "@type": "Question",
      name: "How much does it cost?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We offer three pricing tiers: Starter at $15/month, Metro at $25/month, and Pro at $35/month. Each tier includes different features like custom domains, multiple email addresses, and advanced booking capabilities.",
      },
    },
    {
      "@type": "Question",
      name: "Do I need technical knowledge?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No technical knowledge required! We handle all the technical setup, hosting, and maintenance. You just need to provide your business information and we'll create a professional website for you.",
      },
    },
    {
      "@type": "Question",
      name: "Can I customize my website?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes! You can customize your business information, services, pricing, photos, and more through our easy-to-use dashboard. No coding required.",
      },
    },
    {
      "@type": "Question",
      name: "Will my website show up on Google?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Absolutely! All our websites are built with SEO best practices and include features like sitemaps, meta tags, and structured data to help search engines find and rank your business.",
      },
    },
  ],
};

// Service schemas for each industry
export const industryServiceSchemas = {
  mobileDetailing: {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Mobile Detailing Services",
    description: "Professional mobile car detailing services at your location",
    serviceType: "Automotive Detailing",
    provider: {
      "@type": "Organization",
      name: "That Smart Site",
      url: "https://thatsmartsite.com",
    },
    areaServed: [
      { "@type": "City", name: "New York, NY" },
      { "@type": "City", name: "Los Angeles, CA" },
      { "@type": "City", name: "Chicago, IL" },
    ],
  },
  maidService: {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Maid Service",
    description: "Professional residential cleaning services",
    serviceType: "Cleaning Service",
    provider: {
      "@type": "Organization",
      name: "That Smart Site",
      url: "https://thatsmartsite.com",
    },
    areaServed: [
      { "@type": "City", name: "New York, NY" },
      { "@type": "City", name: "Los Angeles, CA" },
      { "@type": "City", name: "Chicago, IL" },
    ],
  },
  lawnCare: {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Lawn Care Services",
    description: "Professional lawn maintenance and landscaping services",
    serviceType: "Landscaping Service",
    provider: {
      "@type": "Organization",
      name: "That Smart Site",
      url: "https://thatsmartsite.com",
    },
    areaServed: [
      { "@type": "City", name: "New York, NY" },
      { "@type": "City", name: "Los Angeles, CA" },
      { "@type": "City", name: "Chicago, IL" },
    ],
  },
  petGrooming: {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Pet Grooming Services",
    description: "Professional pet grooming and care services",
    serviceType: "Pet Grooming Service",
    provider: {
      "@type": "Organization",
      name: "That Smart Site",
      url: "https://thatsmartsite.com",
    },
    areaServed: [
      { "@type": "City", name: "New York, NY" },
      { "@type": "City", name: "Los Angeles, CA" },
      { "@type": "City", name: "Chicago, IL" },
    ],
  },
  barberShop: {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Barber Shop Services",
    description: "Professional haircuts and grooming services",
    serviceType: "Beauty Service",
    provider: {
      "@type": "Organization",
      name: "That Smart Site",
      url: "https://thatsmartsite.com",
    },
    areaServed: [
      { "@type": "City", name: "New York, NY" },
      { "@type": "City", name: "Los Angeles, CA" },
      { "@type": "City", name: "Chicago, IL" },
    ],
  },
};

// Default schemas array for main platform pages
export const defaultSchemas = [
  defaultOrganizationSchema,
  defaultWebsiteSchema,
  defaultFAQSchema,
];
