/**
 * Utility functions for generating Schema.org structured data
 * from location configuration data
 */

import type { LocationPage } from '@/shared/types/location';
import siteData from '@/data/mdh/site.json';

/**
 * Automatically generate Schema.org image array from location images
 * Filters images by role and returns their URLs
 */
export function generateSchemaImages(
  locationData: LocationPage, 
  roles: string[] = ['hero']
): string[] {
  if (!locationData.images) {
    return [];
  }

  return locationData.images
    .filter(img => roles.includes(img.role))
    .map(img => img.url);
}

/**
 * Generate complete Schema.org LocalBusiness structure
 * from location data with automatic image population and enhanced fields
 */
export function generateLocationSchema(locationData: LocationPage): Record<string, unknown> {
  // Get hero images automatically
  const heroImages = generateSchemaImages(locationData, ['hero']);
  
  // Auto-generate area served from postal codes, neighborhoods, and city
  const areaServed = [
    locationData.city,
    ...(locationData.serviceArea?.postalCodes || []),
    ...(locationData.neighborhoods || []).map(n => `${n}, ${locationData.stateCode}`)
  ];

  // Base schema structure with auto-generated fields
  const baseSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": locationData.header?.businessName || `${locationData.city} Mobile Detailing`,
    "url": `https://mobiledetailhub.com${locationData.urlPath}`,
    "telephone": locationData.header?.phoneE164,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": locationData.city,  // Auto-generated
      "addressRegion": locationData.stateCode,  // Auto-generated
      "postalCode": locationData.postalCode || "86442"  // Auto-generated from location data
    },
    "areaServed": areaServed,  // Auto-generated
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": locationData.latitude,
      "longitude": locationData.longitude
    },
    "sameAs": [
      "https://www.facebook.com/mobiledetailhub",
      "https://www.instagram.com/mobiledetailhub"
    ],
    "description": locationData.seo?.description || `Professional mobile detailing services in ${locationData.city}, ${locationData.stateCode}`,
    "priceRange": "$$",
    "currenciesAccepted": "USD",
    "paymentAccepted": ["Cash", "Credit Card", "Debit Card", "Check"],
    "serviceType": [
      "Mobile Car Detailing",
      "Paint Correction",
      "Ceramic Coating",
      "Interior Detailing",
      "RV Detailing",
      "Boat Detailing",
      "Aircraft Detailing"
    ]
  };

  // Add images if available
  let schema = { ...baseSchema };
  if (heroImages.length > 0) {
    schema.image = heroImages;
  }

  // Add aggregate rating from site.json (global reviews)
  if (siteData.reviews?.ratingValue && siteData.reviews?.reviewCount) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      "ratingValue": siteData.reviews.ratingValue,
      "reviewCount": siteData.reviews.reviewCount.toString(),
      "bestRating": "5",
      "worstRating": "1"
    };
  }

  // Note: Individual reviews are handled globally, not per location
  // Reviews are managed through the main Reviews component and site.json

  // Add business hours from top-level openingHours field
  if (locationData.openingHours) {
    schema.openingHours = locationData.openingHours;
  }

  // Add operational information for better service understanding
  if (locationData.ops) {
    const operationalInfo = getOperationalInfo(locationData);
    
    // Add service area information
    schema.hasOfferCatalog = {
      "@type": "OfferCatalog",
      "name": "Mobile Detailing Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Mobile Auto Detailing",
            "description": `Professional mobile detailing within ${operationalInfo.serviceRadiusMiles} miles`,
            "areaServed": {
              "@type": "GeoCircle",
              "geoMidpoint": {
                "@type": "GeoCoordinates",
                "latitude": locationData.latitude,
                "longitude": locationData.longitude
              },
              "geoRadius": `${operationalInfo.serviceRadiusMiles * 1609.34}` // Convert miles to meters
            }
          }
        }
      ]
    };

    // Add availability information
    if (operationalInfo.acceptsSameDay) {
      schema.availability = "https://schema.org/InStock";
    }
  }

  // Add pricing information if available
  if (locationData.pricingModifierPct !== undefined) {
    const pricingValidation = validatePricingModifier(locationData.pricingModifierPct);
    if (pricingValidation.isValid) {
      schema.priceRange = pricingValidation.value === 0 
        ? "$$" 
        : pricingValidation.value > 0 
          ? "$$$" 
          : "$";
    }
  }

  return schema;
}

/**
 * Generate FAQ Schema from location FAQs
 */
export function generateFAQSchema(faqs: Array<{ id?: string; q: string; a: string }>): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a
      }
    }))
  };
}

/**
 * Get service-specific image from location data with fallback
 */
export function getServiceImageFromLocation(
  locationData: LocationPage | null, 
  serviceRole: "auto" | "marine" | "rv", 
  fallbackImage: string
): {
  url: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
} {
  if (!locationData?.images || locationData.images.length === 0) {
    return {
      url: fallbackImage,
      alt: "Service image",
      width: 400,
      height: 300,
      priority: false
    };
  }

  const serviceImage = locationData.images.find(img => img.role === serviceRole);
  
  if (serviceImage) {
    return {
      url: serviceImage.url,
      alt: serviceImage.alt,
      width: serviceImage.width || 400,
      height: serviceImage.height || 300,
      priority: serviceImage.priority || false
    };
  }

  // Fallback to default image
  return {
    url: fallbackImage,
    alt: "Service image",
    width: 400,
    height: 300,
    priority: false
  };
}

/**
 * Get operational information for a location
 */
export function getOperationalInfo(locationData: LocationPage): {
  acceptsSameDay: boolean;
  leadTimeDays: number;
  serviceRadiusMiles: number;
  leadTimeText: string;
  serviceAreaText: string;
} {
  const ops = locationData.ops || {};
  
  return {
    acceptsSameDay: ops.acceptsSameDay || false,
    leadTimeDays: ops.leadTimeDays || 2,
    serviceRadiusMiles: ops.serviceRadiusMiles || 25,
    leadTimeText: ops.acceptsSameDay ? 'Same day available' : `${ops.leadTimeDays || 2} day lead time`,
    serviceAreaText: `${ops.serviceRadiusMiles || 25} mile service radius`
  };
}

/**
 * Check if a postal code is served by a location
 */
export function isPostalCodeServed(locationData: LocationPage, postalCode: string): boolean {
  if (!locationData.serviceArea?.postalCodes) {
    return false;
  }
  
  return locationData.serviceArea.postalCodes.includes(postalCode);
}

/**
 * Get service area information for a location
 */
export function getServiceAreaInfo(locationData: LocationPage): {
  postalCodes: string[];
  postalCodeCount: number;
  serviceAreaText: string;
  primaryPostalCode: string;
} {
  const postalCodes = locationData.serviceArea?.postalCodes || [];
  
  return {
    postalCodes,
    postalCodeCount: postalCodes.length,
    serviceAreaText: postalCodes.length > 0 
      ? `We serve ${postalCodes.length} ZIP code${postalCodes.length === 1 ? '' : 's'} in ${locationData.city}`
      : `Service area: ${locationData.city}`,
    primaryPostalCode: postalCodes[0] || locationData.postalCode
  };
}

/**
 * Validate and format pricing modifier
 */
export function validatePricingModifier(pricingModifierPct?: number): {
  isValid: boolean;
  value: number;
  percentage: number;
  displayText: string;
  error?: string;
} {
  // Default to no markup if not provided
  const value = pricingModifierPct ?? 0;
  const percentage = value * 100;

  // Validate range (reasonable limits: -50% to +100%)
  if (value < -0.5 || value > 1.0) {
    return {
      isValid: false,
      value,
      percentage,
      displayText: `${percentage.toFixed(1)}%`,
      error: 'Pricing modifier must be between -0.50 (-50%) and 1.00 (+100%)'
    };
  }

  // Format display text
  let displayText: string;
  if (value === 0) {
    displayText = 'Standard pricing';
  } else if (value > 0) {
    displayText = `+${percentage.toFixed(1)}% markup`;
  } else {
    displayText = `${percentage.toFixed(1)}% discount`;
  }

  return {
    isValid: true,
    value,
    percentage,
    displayText
  };
}

/**
 * Apply pricing modifier to a base price
 */
export function applyPricingModifier(basePrice: number, pricingModifierPct?: number): {
  originalPrice: number;
  modifier: number;
  finalPrice: number;
  difference: number;
  displayText: string;
} {
  const validation = validatePricingModifier(pricingModifierPct);
  
  if (!validation.isValid) {
    throw new Error(`Invalid pricing modifier: ${validation.error}`);
  }

  const finalPrice = basePrice * (1 + validation.value);
  const difference = finalPrice - basePrice;

  return {
    originalPrice: basePrice,
    modifier: validation.value,
    finalPrice: Math.round(finalPrice * 100) / 100, // Round to 2 decimal places
    difference: Math.round(difference * 100) / 100,
    displayText: validation.displayText
  };
}

/**
 * Generate BreadcrumbList Schema for location pages
 */
export function generateBreadcrumbSchema(locationData: LocationPage): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://mobiledetailhub.com/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": locationData.state,
        "item": `https://mobiledetailhub.com/${locationData.stateCode.toLowerCase()}/`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": locationData.city,
        "item": `https://mobiledetailhub.com${locationData.urlPath}`
      }
    ]
  };
}

/**
 * Generate Organization Schema for main site
 */
export function generateOrganizationSchema(siteData: any): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": siteData.brand || "Mobile Detail Hub",
    "url": "https://mobiledetailhub.com/",
    "logo": "https://mobiledetailhub.com/images/brand/logo.png",
    "sameAs": [
      "https://www.facebook.com/mobiledetailhub",
      "https://www.instagram.com/mobiledetailhub",
      "https://www.youtube.com/@mobiledetailhub",
      "https://share.google/fx8oPIguzvJmTarrl"
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": siteData.reviews?.ratingValue || "4.9",
      "reviewCount": siteData.reviews?.reviewCount?.toString() || "112",
      "bestRating": "5",
      "worstRating": "1"
    },
    "contactPoint": [{
      "@type": "ContactPoint",
      "contactType": "customer service",
      "telephone": siteData.contact?.phone || "+1-555-123-4567",
      "areaServed": "US"
    }]
  };
}

/**
 * Generate Website Schema for main site
 */
export function generateWebsiteSchema(siteData: any): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "url": "https://mobiledetailhub.com/",
    "name": siteData.brand || "Mobile Detail Hub",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://mobiledetailhub.com/search?q={query}",
      "query-input": "required name=query"
    }
  };
}

/**
 * Generate WebPage Schema for any page
 */
export function generateWebPageSchema(
  pageData: any, 
  pageType: 'home' | 'location' = 'home'
): Record<string, unknown> {
  const baseUrl = 'https://mobiledetailhub.com';
  
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "url": `${baseUrl}${pageData.urlPath || '/'}`,
    "name": pageData.seo?.title || pageData.brand || "Mobile Detail Hub",
    "description": pageData.seo?.description || "Premium mobile detailing services",
    "isPartOf": {
      "@type": "WebSite",
      "name": "Mobile Detail Hub",
      "url": baseUrl
    }
  };

  if (pageData.seo?.keywords && Array.isArray(pageData.seo.keywords)) {
    schema.keywords = pageData.seo.keywords.join(', ');
  }

  if (pageData.seo?.ogImage) {
    schema.image = pageData.seo.ogImage;
  }

  if (pageType === 'location') {
    schema.about = {
      "@type": "LocalBusiness",
      "name": pageData.header?.businessName || `${pageData.city} Mobile Detailing`,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": pageData.city,
        "addressRegion": pageData.stateCode,
        "postalCode": pageData.postalCode
      }
    };
  }

  return schema;
}

/**
 * Generate all JSON-LD schemas for a page
 */
export function generateAllSchemas(
  pageData: any,
  pageType: 'home' | 'location' = 'home'
): Record<string, unknown>[] {
  const schemas: Record<string, unknown>[] = [];

  if (pageType === 'home') {
    // Main site gets Organization and Website schemas
    schemas.push(generateOrganizationSchema(pageData));
    schemas.push(generateWebsiteSchema(pageData));
  } else {
    // Location pages get LocalBusiness, FAQPage, BreadcrumbList, and WebPage schemas
    schemas.push(generateLocationSchema(pageData));
    schemas.push(generateWebPageSchema(pageData, 'location'));
    schemas.push(generateBreadcrumbSchema(pageData));
    
    if (pageData.faqs && pageData.faqs.length > 0) {
      schemas.push(generateFAQSchema(pageData.faqs));
    }
  }

  return schemas;
}

/**
 * Inject all schemas into document head
 */
export function injectAllSchemas(schemas: Record<string, unknown>[]): void {
  // Remove existing schema scripts
  const existingSchemas = document.querySelectorAll('script[type="application/ld+json"]');
  existingSchemas.forEach(schema => schema.remove());

  // Inject new schemas
  schemas.forEach((schema, index) => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(schema);
    script.setAttribute('data-schema-index', index.toString());
    document.head.appendChild(script);
  });
}
