import type { ReactNode } from 'react';
import React, { createContext, useCallback, useEffect, useState } from 'react';

import siteData from '@/data/mdh/site.json';

// Create a simple interface that matches what components expect
interface MDHConfig {
  business_name: string;
  phone: string;
  email: string;
  logo_url: string;
  facebook: string;
  instagram: string;
  tiktok: string;
  youtube: string;
  base_location: {
    city: string;
    state: string;
  };
}

// Convert site.json to MDHConfig format
const mdhConfig: MDHConfig = {
  business_name: siteData.brand,
  phone: siteData.contact.phone,
  email: siteData.contact.email,
  logo_url: siteData.logo,
  facebook: siteData.socials.facebook,
  instagram: siteData.socials.instagram,
  tiktok: siteData.socials.tiktok,
  youtube: siteData.socials.youtube,
  base_location: {
    city: "Los Angeles",
    state: "California"
  }
};

export interface MDHConfigContextType {
  mdhConfig: MDHConfig | null;
  isLoading: boolean;
  error: string | null;
  refreshMDHConfig: () => Promise<void>;
}

export const MDHConfigContext = createContext<MDHConfigContextType | null>(null);

interface MDHConfigProviderProps {
  children: ReactNode;
}

export const MDHConfigProvider: React.FC<MDHConfigProviderProps> = ({ children }) => {
  const [mdhConfigState, setMdhConfigState] = useState<MDHConfig | null>(mdhConfig);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshMDHConfig = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // For now, we're using static data from mdh-config.ts
      // In the future, this could be enhanced to load from an API
      setMdhConfigState(mdhConfig);
    } catch (err) {
      console.error('Error refreshing MDH config:', err);
      setError(err instanceof Error ? err.message : 'Failed to refresh MDH config');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Initialize with static data
    if (!mdhConfigState) {
      setMdhConfigState(mdhConfig);
    }
  }, [mdhConfigState]);

  const value: MDHConfigContextType = {
    mdhConfig: mdhConfigState,
    isLoading,
    error,
    refreshMDHConfig,
  };

  return (
    <MDHConfigContext.Provider value={value}>
      {children}
    </MDHConfigContext.Provider>
  );
};
