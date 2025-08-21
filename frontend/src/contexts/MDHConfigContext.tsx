import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { config } from '../config/environment';

interface MDHConfig {
  email: string;
  phone: string;
  sms_phone: string;
  logo_url: string;
  favicon_url: string;
  header_display: string;
  tagline: string;
  facebook: string;
  instagram: string;
  tiktok: string;
  youtube: string;
  created_at: string;
  updated_at: string;
}

interface MDHConfigContextType {
  mdhConfig: MDHConfig | null;
  isLoading: boolean;
  error: string | null;
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

export const MDHConfigProvider: React.FC<MDHConfigProviderProps> = ({ children }) => {
  const [mdhConfig, setMdhConfig] = useState<MDHConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMDHConfig = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch(`${config.apiUrl}/api/mdh-config`);
        if (!response.ok) {
          throw new Error(`Failed to fetch MDH config: ${response.status}`);
        }
        
        const data = await response.json();
        setMdhConfig(data);
      } catch (err) {
        console.error('Error fetching MDH config:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch MDH config');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMDHConfig();
  }, []);

  const value: MDHConfigContextType = {
    mdhConfig,
    isLoading,
    error,
  };

  return (
    <MDHConfigContext.Provider value={value}>
      {children}
    </MDHConfigContext.Provider>
  );
};
