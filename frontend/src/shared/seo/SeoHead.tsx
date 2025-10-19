/**
 * Central SEO head manager.
 * Handles <title>, <meta>, <canonical>, noindex logic, and JSON-LD structured data.
 * 
 * This component anchors Cursor's understanding of SEO head management.
 */
import React from "react";
import { Helmet } from "react-helmet-async";

interface SeoHeadProps {
  title?: string;
  description?: string;
  canonical?: string;
  noindex?: boolean;
  jsonLd?: any | any[]; // Single schema object or array of schemas
  ogImage?: string;
  ogType?: string;
  twitterCard?: string;
}

export const SeoHead: React.FC<SeoHeadProps> = ({
  title,
  description,
  canonical,
  noindex,
  jsonLd,
  ogImage,
  ogType = "website",
  twitterCard = "summary_large_image",
}) => {
  // Handle JSON-LD - can be single object or array
  const jsonLdSchemas = Array.isArray(jsonLd) ? jsonLd : (jsonLd ? [jsonLd] : []);

  return (
    <Helmet>
      {/* Basic meta tags */}
      {title && <title>{title}</title>}
      {description && <meta name="description" content={description} />}
      {canonical && <link rel="canonical" href={canonical} />}
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      
      {/* Open Graph tags */}
      {title && <meta property="og:title" content={title} />}
      {description && <meta property="og:description" content={description} />}
      {canonical && <meta property="og:url" content={canonical} />}
      <meta property="og:type" content={ogType} />
      {ogImage && <meta property="og:image" content={ogImage} />}
      
      {/* Twitter Card tags */}
      <meta name="twitter:card" content={twitterCard} />
      {title && <meta name="twitter:title" content={title} />}
      {description && <meta name="twitter:description" content={description} />}
      {ogImage && <meta name="twitter:image" content={ogImage} />}
      
      {/* JSON-LD structured data */}
      {jsonLdSchemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema, null, 2),
          }}
        />
      ))}
    </Helmet>
  );
};
