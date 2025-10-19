/**
 * JSON-LD structured data helpers.
 * Generates schema.org markup for SEO.
 * 
 * This module anchors Cursor's understanding of structured data generation.
 */

// Enhanced LocalBusiness schema with more fields
export const getLocalBusinessSchema = (biz: {
  name: string;
  phone?: string;
  address?: {
    streetAddress?: string;
    addressLocality?: string;
    addressRegion?: string;
    postalCode?: string;
    addressCountry?: string;
  };
  image?: string;
  url?: string;
  description?: string;
  priceRange?: string;
  openingHours?: string[];
  sameAs?: string[];
  aggregateRating?: {
    ratingValue: number;
    reviewCount: number;
  };
}) => ({
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: biz.name,
  description: biz.description,
  telephone: biz.phone,
  image: biz.image,
  url: biz.url,
  priceRange: biz.priceRange,
  openingHours: biz.openingHours,
  sameAs: biz.sameAs,
  address: biz.address ? {
    "@type": "PostalAddress",
    streetAddress: biz.address.streetAddress,
    addressLocality: biz.address.addressLocality,
    addressRegion: biz.address.addressRegion,
    postalCode: biz.address.postalCode,
    addressCountry: biz.address.addressCountry || "US",
  } : undefined,
  aggregateRating: biz.aggregateRating ? {
    "@type": "AggregateRating",
    ratingValue: biz.aggregateRating.ratingValue,
    reviewCount: biz.aggregateRating.reviewCount,
  } : undefined,
});

// Enhanced Service schema
export const getServiceSchema = (service: {
  name: string;
  description?: string;
  price?: string;
  priceCurrency?: string;
  serviceType?: string;
  provider?: {
    name: string;
    url?: string;
  };
  areaServed?: string[];
  availableChannel?: {
    "@type": "ServiceChannel";
    serviceUrl?: string;
    servicePhone?: string;
  };
}) => ({
  "@context": "https://schema.org",
  "@type": "Service",
  name: service.name,
  description: service.description,
  serviceType: service.serviceType,
  provider: service.provider ? {
    "@type": "Organization",
    name: service.provider.name,
    url: service.provider.url,
  } : undefined,
  areaServed: service.areaServed?.map(area => ({
    "@type": "City",
    name: area,
  })),
  availableChannel: service.availableChannel,
  offers: service.price
    ? { 
        "@type": "Offer", 
        price: service.price, 
        priceCurrency: service.priceCurrency || "USD",
        availability: "https://schema.org/InStock",
      }
    : undefined,
});

// Enhanced FAQ schema
export const getFAQSchema = (faqs: { q: string; a: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { 
      "@type": "Answer", 
      text: f.a,
    },
  })),
});

// Website schema for the main platform
export const getWebsiteSchema = (website: {
  name: string;
  url: string;
  description?: string;
  potentialAction?: {
    "@type": "SearchAction";
    target: string;
    "query-input": string;
  };
}) => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: website.name,
  url: website.url,
  description: website.description,
  potentialAction: website.potentialAction,
});

// Organization schema for That Smart Site
export const getOrganizationSchema = (org: {
  name: string;
  url: string;
  logo?: string;
  description?: string;
  contactPoint?: {
    telephone?: string;
    contactType?: string;
    email?: string;
  };
  sameAs?: string[];
}) => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: org.name,
  url: org.url,
  logo: org.logo,
  description: org.description,
  contactPoint: org.contactPoint ? {
    "@type": "ContactPoint",
    telephone: org.contactPoint.telephone,
    contactType: org.contactPoint.contactType,
    email: org.contactPoint.email,
  } : undefined,
  sameAs: org.sameAs,
});

// Breadcrumb schema
export const getBreadcrumbSchema = (breadcrumbs: {
  name: string;
  url: string;
}[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: breadcrumbs.map((crumb, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: crumb.name,
    item: crumb.url,
  })),
});

// Review schema
export const getReviewSchema = (review: {
  author: string;
  reviewBody: string;
  ratingValue: number;
  bestRating?: number;
  worstRating?: number;
  datePublished?: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "Review",
  author: {
    "@type": "Person",
    name: review.author,
  },
  reviewBody: review.reviewBody,
  reviewRating: {
    "@type": "Rating",
    ratingValue: review.ratingValue,
    bestRating: review.bestRating || 5,
    worstRating: review.worstRating || 1,
  },
  datePublished: review.datePublished,
});

// Industry-specific schemas
export const getIndustrySchemas = {
  mobileDetailing: (business: any) => ({
    ...getLocalBusinessSchema(business),
    "@type": ["LocalBusiness", "AutomotiveBusiness"],
    additionalType: "https://schema.org/AutomotiveRepair",
  }),
  
  maidService: (business: any) => ({
    ...getLocalBusinessSchema(business),
    "@type": ["LocalBusiness", "HomeAndConstructionBusiness"],
    additionalType: "https://schema.org/CleaningService",
  }),
  
  lawnCare: (business: any) => ({
    ...getLocalBusinessSchema(business),
    "@type": ["LocalBusiness", "HomeAndConstructionBusiness"],
    additionalType: "https://schema.org/LandscapingService",
  }),
  
  petGrooming: (business: any) => ({
    ...getLocalBusinessSchema(business),
    "@type": ["LocalBusiness", "PetStore"],
    additionalType: "https://schema.org/PetGroomingService",
  }),
  
  barberShop: (business: any) => ({
    ...getLocalBusinessSchema(business),
    "@type": ["LocalBusiness", "HealthAndBeautyBusiness"],
    additionalType: "https://schema.org/BeautySalon",
  }),
};