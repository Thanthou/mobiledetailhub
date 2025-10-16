/**
 * JSON-LD structured data helpers.
 * Generates schema.org markup for SEO.
 * 
 * This module anchors Cursor's understanding of structured data generation.
 */

export const getLocalBusinessSchema = (biz: {
  name: string;
  phone?: string;
  address?: unknown;
  image?: string;
  url?: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: biz.name,
  telephone: biz.phone,
  image: biz.image,
  url: biz.url,
  address: biz.address as Record<string, unknown>,
});

export const getServiceSchema = (service: {
  name: string;
  description?: string;
  price?: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "Service",
  name: service.name,
  description: service.description,
  offers: service.price
    ? { "@type": "Offer", price: service.price, priceCurrency: "USD" }
    : undefined,
});

export const getFAQSchema = (faqs: { q: string; a: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
});