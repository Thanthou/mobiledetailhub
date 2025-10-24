/**
 * Preview Data Provider (Unified)
 * 
 * Provides mock tenant data for preview mode.
 * Combines preview config loading with DataContext provision.
 * Components using useData() will get this mock data instead of fetching from API.
 * 
 * Architecture:
 * 1. Detects industry from URL path
 * 2. Loads industry config (assets, content, SEO)
 * 3. Provides mock DataContext with preview data
 * 4. Provides PreviewDataContext for preview-specific hooks
 */

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { MainSiteConfig } from '@shared/types/location';
import type { IndustryPreviewData } from '@data/preview-types';
import { DataContext, type DataContextType } from '@shared/contexts/DataContext';
import { getPreviewIndustry } from '@shared/utils';
import { loadIndustryPreview } from '@data/preview-loader';

interface PreviewDataProviderProps {
  children: React.ReactNode;
  industry?: string | undefined;
}

interface PreviewDataContextValue {
  isPreviewMode: boolean;
  industry: string | null;
  previewConfig: MainSiteConfig | null;
  previewData: IndustryPreviewData | null;
  isLoading: boolean;
}

// Context for preview-specific metadata
const PreviewDataContext = createContext<PreviewDataContextValue | undefined>(undefined);

/**
 * Hook to access preview data context
 */
export function usePreviewData(): PreviewDataContextValue {
  const context = useContext(PreviewDataContext);
  if (context === undefined) {
    // Return default values if not in preview context
    return {
      isPreviewMode: false,
      industry: null,
      previewConfig: null,
      previewData: null,
      isLoading: false,
    };
  }
  return context;
}

/**
 * Main PreviewDataProvider
 * 
 * Provides both:
 * 1. DataContext (mock tenant data for components)
 * 2. PreviewDataContext (preview metadata for hooks)
 */
export function PreviewDataProvider({ children, industry: industryProp }: PreviewDataProviderProps) {
  const [previewConfig, setPreviewConfig] = useState<MainSiteConfig | null>(null);
  const [previewData, setPreviewData] = useState<IndustryPreviewData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Use prop if provided, otherwise extract from URL path
  const industry = industryProp || getPreviewIndustry();
  
  // Load industry config and preview data
  useEffect(() => {
    if (!industry || industry === 'main') {
      // No industry specified or marketing site - no preview data needed
      setPreviewConfig(null);
      setPreviewData(null);
      setIsLoading(false);
      return;
    }
    
    async function loadConfig() {
      setIsLoading(true);
      
      try {
        let config: MainSiteConfig;
        
        switch (industry) {
          case 'mobile-detailing': {
            const { loadMobileDetailingConfig } = await import('@data/mobile-detailing');
            config = loadMobileDetailingConfig();
            break;
          }
          case 'maid-service': {
            const { loadMaidServiceConfig } = await import('@data/maid-service');
            config = await loadMaidServiceConfig();
            break;
          }
          case 'lawncare': {
            const { loadLawncareConfig } = await import('@data/lawncare');
            config = await loadLawncareConfig();
            break;
          }
          case 'pet-grooming': {
            const { loadPetGroomingConfig } = await import('@data/pet-grooming');
            config = await loadPetGroomingConfig();
            break;
          }
          case 'barber': {
            const { loadBarberConfig } = await import('@data/barber');
            config = await loadBarberConfig();
            break;
          }
          default:
            console.warn(`Unknown industry: ${industry}`);
            setPreviewConfig(null);
            setPreviewData(null);
            setIsLoading(false);
            return;
        }
        
        setPreviewConfig(config);
        
        // Load preview-specific mock data (business, reviews, FAQs)
        const mockData = await loadIndustryPreview(industry);
        setPreviewData(mockData);
      } catch (error) {
        console.error('[PreviewDataProvider] ERROR loading preview config for', industry, ':', error);
        alert(`Failed to load preview config for ${industry}: ${error}`);
        setPreviewConfig(null);
        setPreviewData(null);
      } finally {
        setIsLoading(false);
      }
    }
    
    void loadConfig();
  }, [industry]);
  
  // Create mock tenant data from preview config and preview data
  const mockTenantData: DataContextType = useMemo(() => ({
    businessName: previewData?.business.businessName || 'Loading Preview...',
    phone: previewData?.business.phone || '(555) 123-4567',
    email: previewData?.business.email || previewConfig?.contact?.email || 'contact@example.com',
    owner: 'Demo Owner',
    location: previewData?.business.city && previewData?.business.state
      ? `${previewData.business.city}, ${previewData.business.state}`
      : 'Demo City, ST',
    industry: industry || 'mobile-detailing',
    serviceAreas: [
      {
        city: previewData?.business.city || 'Demo City',
        state: previewData?.business.state || 'ST',
        primary: true,
      }
    ],
    socialMedia: {
      facebook: previewConfig?.socials?.facebook,
      instagram: previewConfig?.socials?.instagram,
      tiktok: previewConfig?.socials?.tiktok,
      youtube: previewConfig?.socials?.youtube,
    },
    siteConfig: previewConfig || null,
    isLoading: isLoading,
    isTenant: true,
    isPreview: true,
  }), [previewConfig, previewData, industry, isLoading]);
  
  // Preview metadata for hooks
  const previewContextValue = useMemo(() => ({
    isPreviewMode: true,
    industry,
    previewConfig,
    previewData,
    isLoading,
  }), [industry, previewConfig, previewData, isLoading]);
  
  return (
    <PreviewDataContext.Provider value={previewContextValue}>
      <DataContext.Provider value={mockTenantData}>
        {children}
      </DataContext.Provider>
    </PreviewDataContext.Provider>
  );
}

