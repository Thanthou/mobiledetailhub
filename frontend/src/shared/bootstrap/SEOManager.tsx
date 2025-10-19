import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

import { injectAllSchemas } from '@/shared/utils/schemaUtils';
import { defaultOrganizationSchema, defaultWebsiteSchema } from '@/shared/seo/defaultSchemas';

/**
 * SEO Manager component that handles:
 * - Schema injection for structured data
 * - Dynamic meta tag management
 * - Analytics integration (future)
 * - Performance monitoring (future)
 */
export const SEOManager: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    // Inject default schemas on app initialization
    injectAllSchemas([defaultOrganizationSchema, defaultWebsiteSchema]);
  }, []);

  useEffect(() => {
    // Handle route changes for analytics and SEO tracking
    // TODO: Add analytics tracking here
    console.log('Route changed:', location.pathname);
  }, [location.pathname]);

  return (
    <Helmet>
      {/* Default meta tags that can be overridden by individual pages */}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="theme-color" content="#1f2937" />
      
      {/* Performance hints */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
    </Helmet>
  );
};
