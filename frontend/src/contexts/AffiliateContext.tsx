import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useParams } from 'react-router-dom';
import { config } from '../config/environment';

interface AffiliateData {
  id: number;
  slug: string;
  name: string;
  email: string;
  phone: string;
  sms_phone: string;
  address: string;
  logo_url: string;
  website: string;
  description: string;
  service_areas: string[];
  state_cities: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface AffiliateContextType {
  affiliateData: AffiliateData | null;
  isLoading: boolean;
  error: string | null;
  businessSlug: string | null;
}

const AffiliateContext = createContext<AffiliateContextType | undefined>(undefined);

export const useAffiliate = () => {
  const context = useContext(AffiliateContext);
  if (context === undefined) {
    throw new Error('useAffiliate must be used within an AffiliateProvider');
  }
  return context;
};

interface AffiliateProviderProps {
  children: ReactNode;
}

export const AffiliateProvider: React.FC<AffiliateProviderProps> = ({ children }) => {
  const { businessSlug } = useParams<{ businessSlug: string }>();
  const [affiliateData, setAffiliateData] = useState<AffiliateData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!businessSlug) {
      setIsLoading(false);
      return;
    }

    const fetchAffiliateData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch(`${config.apiUrl}/api/affiliates/${businessSlug}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch affiliate data: ${response.status}`);
        }
        
        const data = await response.json();
        setAffiliateData(data);
      } catch (err) {
        console.error('Error fetching affiliate data:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch affiliate data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAffiliateData();
  }, [businessSlug]);

  const value: AffiliateContextType = {
    affiliateData,
    isLoading,
    error,
    businessSlug,
  };

  return (
    <AffiliateContext.Provider value={value}>
      {children}
    </AffiliateContext.Provider>
  );
};
