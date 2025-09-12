import type { ReactNode } from 'react';
import React, { createContext, useCallback, useEffect, useState } from 'react';

import { config } from '@/../config/env';

import { getStaticMDHConfig, initializeGlobalConfig, type MDHConfig } from '../../../data/mdh';

// Types are now imported from @/data/mdh/mdh-config

// Global window interface for JSON-LD loader compatibility
declare global {
  interface Window {
    __MDH__?: {
      name: string;
      url: string;
      logo: string;
      phone: string;
      email: string;
      socials: {
        facebook: string;
        instagram: string;
        youtube: string;
        tiktok: string;
      };
      header_display: string;
      tagline: string;
      services_description: string;
      logo_url: string;
      favicon_url: string;
      ogImage: string;
      created_at: string;
      updated_at: string;
    };
  }
}

export interface MDHConfigContextType {
  mdhConfig: MDHConfig | null;
  isLoading: boolean;
  error: string | null;
  refreshConfig: () => Promise<void>;
}

export const MDHConfigContext = createContext<MDHConfigContextType | null>(null);


interface MDHConfigProviderProps {
  children: ReactNode;
}

// Global config cache to prevent duplicate fetches
let globalConfigCache: MDHConfig | null = null;
let globalConfigPromise: Promise<MDHConfig> | null = null;

export const MDHConfigProvider: React.FC<MDHConfigProviderProps> = ({ children }) => {
  const [mdhConfig, setMdhConfig] = useState<MDHConfig | null>(() => {
    // Initialize with static config from TypeScript file
    const staticConfig = getStaticMDHConfig();
    
    // Initialize global object for JSON-LD loader compatibility
    initializeGlobalConfig();
    
    return staticConfig;
  });
  const [isLoading, setIsLoading] = useState(false); // Start with false since we have static data
  const [error, setError] = useState<string | null>(null);

  const fetchMDHConfig = async (): Promise<MDHConfig> => {
    try {
      const response = await fetch(`${config.apiUrl}/api/mdh-config`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ [MDHConfig] Response not OK:', errorText);
        throw new Error(`Failed to fetch MDH config: ${response.status.toString()} - ${errorText}`);
      }
      
      const data = await response.json() as MDHConfig;
      return data;
    } catch (err) {
      console.error('❌ [MDHConfig] Error fetching MDH config:', err);
      throw err;
    }
  };

  const refreshConfig = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Use global cache if available
      if (globalConfigCache !== null) {
        setMdhConfig(globalConfigCache);
        setIsLoading(false);
        return;
      }

      // Use global promise if already fetching
      if (globalConfigPromise !== null) {
        const data = await globalConfigPromise;
        setMdhConfig(data);
        setIsLoading(false);
        return;
      }

      // Create new fetch promise
      globalConfigPromise = fetchMDHConfig();
      const data = await globalConfigPromise;
      
      // Cache the result globally
      globalConfigCache = data;
      globalConfigPromise = null;
      
      setMdhConfig(data);
    } catch (err) {
      console.error('Error refreshing MDH config:', err);
      setError(err instanceof Error ? err.message : 'Failed to refresh MDH config');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Only fetch if we don't have static config and haven't cached anything
    if (mdhConfig === null && globalConfigCache === null && globalConfigPromise === null) {
      void refreshConfig();
    }
  }, [mdhConfig, refreshConfig]);

  const value: MDHConfigContextType = {
    mdhConfig,
    isLoading,
    error,
    refreshConfig,
  };

  return (
    <MDHConfigContext.Provider value={value}>
      {children}
    </MDHConfigContext.Provider>
  );
};
