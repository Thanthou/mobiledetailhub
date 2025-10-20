/**
 * Preview Data Context
 * 
 * Provides industry-specific preview data when in preview mode.
 * This allows components to render with mock data instead of fetching from the database.
 */

import React, { createContext, useContext, useMemo } from 'react';
import type { MainSiteConfig } from '@shared/types/location';
import { usePreviewParams } from '../hooks/usePreviewParams';

interface PreviewDataContextValue {
  isPreviewMode: boolean;
  industry: string | null;
  previewConfig: MainSiteConfig | null;
  isLoading: boolean;
}

const PreviewDataContext = createContext<PreviewDataContextValue | undefined>(undefined);

export function PreviewDataProvider({ children }: { children: React.ReactNode }) {
  const { mode, industry } = usePreviewParams();
  const isPreviewMode = mode === 'slug';
  
  const [previewConfig, setPreviewConfig] = React.useState<MainSiteConfig | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  
  // Load industry config when preview mode is detected
  React.useEffect(() => {
    if (!isPreviewMode || !industry) {
      setPreviewConfig(null);
      return;
    }
    
    async function loadConfig() {
      setIsLoading(true);
      try {
        // Dynamically import the industry config loader
        let config: MainSiteConfig;
        
        switch (industry) {
          case 'mobile-detailing': {
            const { loadMobileDetailingConfig } = await import('@/data/mobile-detailing');
            config = loadMobileDetailingConfig();
            break;
          }
          case 'maid-service': {
            const { loadMaidServiceConfig } = await import('@/data/maid-service');
            config = await loadMaidServiceConfig();
            break;
          }
          case 'lawncare': {
            const { loadLawncareConfig } = await import('@/data/lawncare');
            config = await loadLawncareConfig();
            break;
          }
          case 'pet-grooming': {
            const { loadPetGroomingConfig } = await import('@/data/pet-grooming');
            config = await loadPetGroomingConfig();
            break;
          }
          case 'barber': {
            const { loadBarberConfig } = await import('@/data/barber');
            config = await loadBarberConfig();
            break;
          }
          default:
            console.warn(`Unknown industry: ${industry}`);
            setPreviewConfig(null);
            setIsLoading(false);
            return;
        }
        
        setPreviewConfig(config);
      } catch (error) {
        console.error('Failed to load preview config:', error);
        setPreviewConfig(null);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadConfig();
  }, [isPreviewMode, industry]);
  
  const value = useMemo(
    () => ({
      isPreviewMode,
      industry: industry || null,
      previewConfig,
      isLoading,
    }),
    [isPreviewMode, industry, previewConfig, isLoading]
  );
  
  return (
    <PreviewDataContext.Provider value={value}>
      {children}
    </PreviewDataContext.Provider>
  );
}

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
      isLoading: false,
    };
  }
  return context;
}

