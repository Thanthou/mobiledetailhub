import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { config } from '../config/environment';

interface MDHConfig {
  email: string;
  phone: string;
  sms_phone?: string;
  logo_url: string;
  favicon_url: string;
  header_display: string;
  tagline: string;
  services_description: string;
  facebook: string;
  instagram: string;
  tiktok: string;
  youtube: string;
  created_at: string;
  updated_at: string;
}

// Static config interface to match mdh-config.js
interface StaticMDHConfig {
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
}

interface MDHConfigContextType {
  mdhConfig: MDHConfig | null;
  isLoading: boolean;
  error: string | null;
  refreshConfig: () => Promise<void>;
}

const MDHConfigContext = createContext<MDHConfigContextType | undefined>(undefined);

export const useMDHConfig = () => {
  const context = useContext(MDHConfigContext);
  if (context === undefined) {
    throw new Error('useMDHConfig must be used within an MDHConfigProvider');
  }
  return context;
};

interface MDHConfigProviderProps {
  children: ReactNode;
}

// Global config cache to prevent duplicate fetches
let globalConfigCache: MDHConfig | null = null;
let globalConfigPromise: Promise<MDHConfig> | null = null;

export const MDHConfigProvider: React.FC<MDHConfigProviderProps> = ({ children }) => {
  const [mdhConfig, setMdhConfig] = useState<MDHConfig | null>(() => {
    // Initialize with static config from mdh-config.js if available
    if (typeof window !== 'undefined' && window.__MDH__) {
      const staticConfig = window.__MDH__ as StaticMDHConfig;
      return {
        email: staticConfig.email,
        phone: staticConfig.phone,
        logo_url: staticConfig.logo_url,
        favicon_url: staticConfig.favicon_url,
        header_display: staticConfig.header_display,
        tagline: staticConfig.tagline,
        services_description: staticConfig.services_description,
        facebook: staticConfig.socials?.facebook || '',
        instagram: staticConfig.socials?.instagram || '',
        tiktok: staticConfig.socials?.tiktok || '',
        youtube: staticConfig.socials?.youtube || '',
        created_at: staticConfig.created_at,
        updated_at: staticConfig.updated_at
      };
    }
    return null;
  });
  const [isLoading, setIsLoading] = useState(false); // Start with false since we have static data
  const [error, setError] = useState<string | null>(null);

  const fetchMDHConfig = async (): Promise<MDHConfig> => {
    try {
      const response = await fetch(`${config.apiUrl}/api/mdh-config`);
      if (!response.ok) {
        throw new Error(`Failed to fetch MDH config: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (err) {
      console.error('Error fetching MDH config:', err);
      throw err;
    }
  };

  const refreshConfig = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Use global cache if available
      if (globalConfigCache) {
        setMdhConfig(globalConfigCache);
        setIsLoading(false);
        return;
      }

      // Use global promise if already fetching
      if (globalConfigPromise) {
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
  };

  useEffect(() => {
    // Only fetch if we don't have static config and haven't cached anything
    if (!mdhConfig && !globalConfigCache && !globalConfigPromise) {
      refreshConfig();
    }
  }, []);

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
