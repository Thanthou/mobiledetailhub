import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { config } from '@/../config/env';

interface BusinessData {
  id: string;
  slug: string;
  business_name: string;
  owner: string;
  business_email: string;
  business_phone: string;
  personal_email?: string;
  personal_phone?: string;
  first_name?: string;
  last_name?: string;
  twilio_phone?: string;
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

interface UseProfileDataReturn {
  businessData: BusinessData | null;
  loading: boolean;
  error: string | null;
  updateBusiness: (data: Partial<BusinessData>) => Promise<boolean>;
  isUpdating: boolean;
}

export const useProfileData = (): UseProfileDataReturn => {
  const [businessData, setBusinessData] = useState<BusinessData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  
  const { slug } = useParams<{ slug: string }>();

  // Fetch business data
  useEffect(() => {
    const fetchBusinessData = async () => {
      if (!slug) {
        setError('Business slug is required');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`${config.apiUrl}/api/tenants/${slug}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Business not found');
          }
          throw new Error(`Failed to fetch business data: ${response.statusText}`);
        }

        const result = await response.json() as { data?: BusinessData };
        const data = result.data;
        
        if (!data) {
          throw new Error('No business data received');
        }
        
        setBusinessData(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch business data';
        setError(errorMessage);
        console.error('Error fetching business data:', err);
      } finally {
        setLoading(false);
      }
    };

    void fetchBusinessData();
  }, [slug]);

  // Update business data
  const updateBusiness = async (data: Partial<BusinessData>): Promise<boolean> => {
    if (!slug) {
      setError('Business slug is required');
      return false;
    }

    try {
      setIsUpdating(true);
      setError(null);

      // Only send the fields that have values (not empty strings or undefined)
      const updateData: Partial<BusinessData> = {};
      
      if (data.first_name !== undefined) updateData.first_name = data.first_name;
      if (data.last_name !== undefined) updateData.last_name = data.last_name;
      if (data.personal_phone !== undefined) updateData.personal_phone = data.personal_phone;
      if (data.personal_email !== undefined) updateData.personal_email = data.personal_email;
      if (data.business_name !== undefined) updateData.business_name = data.business_name;
      if (data.business_email !== undefined) updateData.business_email = data.business_email;
      if (data.business_phone !== undefined) updateData.business_phone = data.business_phone;
      if (data.twilio_phone !== undefined) updateData.twilio_phone = data.twilio_phone;
      if (data.business_start_date !== undefined) updateData.business_start_date = data.business_start_date;
      if (data.website !== undefined) updateData.website = data.website;
      if (data.gbp_url !== undefined) updateData.gbp_url = data.gbp_url;
      if (data.facebook_url !== undefined) updateData.facebook_url = data.facebook_url;
      if (data.youtube_url !== undefined) updateData.youtube_url = data.youtube_url;
      if (data.tiktok_url !== undefined) updateData.tiktok_url = data.tiktok_url;
      if (data.instagram_url !== undefined) updateData.instagram_url = data.instagram_url;


      const response = await fetch(`${config.apiUrl}/api/tenants/${slug}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error(`Failed to update business data: ${response.statusText}`);
      }

      const result = await response.json() as { data?: BusinessData };
      const updatedData = result.data;
      
      if (updatedData) {
        setBusinessData(updatedData);
      }
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update business data';
      setError(errorMessage);
      console.error('Error updating business data:', err);
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    businessData,
    loading,
    error,
    updateBusiness,
    isUpdating,
  };
};