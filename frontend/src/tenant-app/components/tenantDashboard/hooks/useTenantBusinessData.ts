import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { config } from '@/../config/env';

export interface TenantServiceArea {
  city: string;
  state: string;
  zip?: string;
  primary: boolean;
  minimum?: number;
  multiplier?: number;
}

export interface TenantBusinessData {
  id: string;
  slug: string;
  business_name: string;
  application_status: string;
  phone: string;
  sms_phone?: string;
  twilio_phone?: string;
  service_areas: TenantServiceArea[];
  owner?: string;
  business_email?: string;
  personal_email?: string;
  first_name?: string;
  last_name?: string;
  personal_phone?: string;
  business_start_date?: string;
  website?: string;
  gbp_url?: string;
  facebook_url?: string;
  youtube_url?: string;
  tiktok_url?: string;
  instagram_url?: string;
  created_at: string;
  updated_at: string;
}

export const useTenantBusinessData = () => {
  const [businessData, setBusinessData] = useState<TenantBusinessData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  const { slug } = useParams<{ slug: string }>();

  const fetchBusinessData = useCallback(async () => {
    if (!slug) {
      setError('No business slug provided');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      const response = await fetch(`${config.apiUrl}/api/tenants/${slug}`, {
        headers: {
          'Authorization': `Bearer ${String(token)}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json() as {
          success: boolean;
          data?: TenantBusinessData;
        };
        
        if (data.success && data.data) {
          setBusinessData(data.data);
        } else {
          setError('Failed to fetch business data');
        }
      } else {
        const errorData = await response.json() as {
          error?: string;
          message?: string;
        };
        setError(errorData.error || errorData.message || 'Failed to fetch business data');
      }
    } catch (error) {
      console.error('Error fetching business data:', error);
      setError('Failed to fetch business data');
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    void fetchBusinessData();
  }, [fetchBusinessData, refreshTrigger]);

  // Get service areas with first entry as primary
  const serviceAreas = businessData?.service_areas || [];
  const primaryServiceArea = serviceAreas.length > 0 ? serviceAreas[0] : null;
  const otherServiceAreas = serviceAreas.slice(1);

  return {
    businessData,
    serviceAreas,
    primaryServiceArea,
    otherServiceAreas,
    loading,
    error,
    refetch: () => {
      setRefreshTrigger(prev => prev + 1);
    }
  };
};
