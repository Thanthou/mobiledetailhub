/**
 * Central SEO head manager.
 * Handles <title>, <meta>, <canonical>, and noindex logic.
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
}

export const SeoHead: React.FC<SeoHeadProps> = ({
  title,
  description,
  canonical,
  noindex,
}) => {
  return (
    <Helmet>
      {title && <title>{title}</title>}
      {description && <meta name="description" content={description} />}
      {canonical && <link rel="canonical" href={canonical} />}
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      {/* Social sharing defaults */}
      {title && <meta property="og:title" content={title} />}
      {description && <meta property="og:description" content={description} />}
      <meta name="twitter:card" content="summary_large_image" />
    </Helmet>
  );
};
