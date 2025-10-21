/**
 * Preview Data Provider
 * 
 * Wraps preview pages with the ACTUAL DataContext used by all components.
 * This allows existing components (Header, Hero, etc.) to work
 * without modification in preview mode.
 */

import React, { useEffect, useState } from 'react';

import { DataContext } from '@shared/contexts/DataContext';
import type { MainSiteConfig } from '@shared/types/location';
import type { IndustryTemplate } from '@shared/utils/industryRegistry';
import { getIndustryTemplate } from '@shared/utils/industryRegistry';

import type { PreviewPayload } from '../types/preview.types';

interface PreviewDataProviderProps {
  children: React.ReactNode;
  payload: PreviewPayload;
}

/**
 * PreviewDataProvider
 * 
 * Provides mock data to the actual DataContext that all components use.
 * This makes existing components work without modification in preview mode.
 */
export const PreviewDataProvider: React.FC<PreviewDataProviderProps> = ({
  children,
  payload,
}) => {
  const [siteConfig, setSiteConfig] = useState<IndustryTemplate | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadTemplate() {
      try {
        setIsLoading(true);
        const template = await getIndustryTemplate(payload.industry);
        setSiteConfig(template);
      } catch (error) {
        console.error('Failed to load industry template:', error);
      } finally {
        setIsLoading(false);
      }
    }

    void loadTemplate();
  }, [payload.industry]);

  // Generate email from business name
  const generateEmail = (businessName: string) => {
    // Convert "JP's Mobile Detail" → "jpsmobiledetail"
    const domain = businessName
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '') // Remove special chars
      .replace(/\s+/g, '')          // Remove spaces
      .trim();
    return `info@${domain}.com`;
  };

  // Create mock context value matching the real DataContext interface
  const mockContextValue = {
    businessName: payload.businessName,
    phone: payload.phone,
    email: generateEmail(payload.businessName),
    owner: payload.businessName,
    location: `${payload.city}, ${payload.state}`,
    industry: payload.industry,
    serviceAreas: [
      {
        city: payload.city,
        state: payload.state,
        primary: true,
      },
    ],
    socialMedia: {
      facebook: '#',
      instagram: '#',
      youtube: '#',
      tiktok: '#',
      googleBusiness: '#',
    },
    siteConfig: siteConfig as MainSiteConfig | null,
    isLoading,
    isTenant: true,
    isPreview: true, // Mark as preview mode
  };

  // Provide to the ACTUAL DataContext that components are using
  return (
    <DataContext.Provider value={mockContextValue}>
      {children}
    </DataContext.Provider>
  );
};

