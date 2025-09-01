import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../../../../contexts/AuthContext';

export interface AffiliateData {
  city: string;
  state: string;
  zip?: string;
  minimum?: number;
  multiplier?: number;
}

export const useAffiliateData = () => {
  const [affiliateData, setAffiliateData] = useState<AffiliateData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { user } = useAuth();
  const { businessSlug } = useParams<{ businessSlug: string }>();

  useEffect(() => {
    const fetchAffiliateData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const token = localStorage.getItem('token');
        
        if (!businessSlug) {
          setError('No business slug provided');
          setLoading(false);
          return;
        }

        // Fetch affiliate data from the database
        const response = await fetch(`/api/affiliates/${businessSlug}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.affiliate) {
            const affiliate = data.affiliate;
            setAffiliateData({
              city: affiliate.city || '',
              state: affiliate.state || '',
              zip: affiliate.zip || '',
              minimum: affiliate.minimum || 0,
              multiplier: affiliate.multiplier || 1.0
            });
          } else {
            setError('Affiliate not found');
          }
        } else {
          setError('Failed to fetch affiliate data');
        }
      } catch (error) {
        console.error('Error fetching affiliate data:', error);
        setError('Failed to fetch affiliate data');
      } finally {
        setLoading(false);
      }
    };

    fetchAffiliateData();
  }, [businessSlug]);

  const updateAffiliateData = async (updates: Partial<AffiliateData>) => {
    try {
      const token = localStorage.getItem('token');
      
      // Check if we're updating primary service area fields (city, state, zip, minimum, multiplier)
      const isPrimaryServiceAreaUpdate = updates.city !== undefined || 
                                        updates.state !== undefined || 
                                        updates.zip !== undefined || 
                                        updates.minimum !== undefined || 
                                        updates.multiplier !== undefined;
      
      if (isPrimaryServiceAreaUpdate) {
        // Update primary service area in service_areas JSONB column
        // Always include current city and state since backend requires them
        const updateData = {
          city: updates.city !== undefined ? updates.city : affiliateData?.city || '',
          state: updates.state !== undefined ? updates.state : affiliateData?.state || '',
          zip: updates.zip !== undefined ? updates.zip : affiliateData?.zip || '',
          minimum: updates.minimum !== undefined ? updates.minimum : affiliateData?.minimum || 0,
          multiplier: updates.multiplier !== undefined ? updates.multiplier : affiliateData?.multiplier || 1.0
        };
        
        const response = await fetch(`/api/affiliates/${businessSlug}/service_areas/primary`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(updateData)
        });

        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            setAffiliateData(prev => prev ? { ...prev, ...updates } : null);
            return { success: true };
          } else {
            return { success: false, error: result.error || 'Failed to update primary service area' };
          }
        } else {
          const errorData = await response.json();
          return { success: false, error: errorData.error || 'Failed to update primary service area' };
        }
      } else {
        // Update other affiliate data (non-service area fields)
        const response = await fetch(`/api/affiliates/${businessSlug}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(updates)
        });

        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            setAffiliateData(prev => prev ? { ...prev, ...updates } : null);
            return { success: true };
          } else {
            return { success: false, error: result.error || 'Failed to update affiliate data' };
          }
        } else {
          const errorData = await response.json();
          return { success: false, error: errorData.error || 'Failed to update affiliate data' };
        }
      }
    } catch (error) {
      console.error('Error updating affiliate data:', error);
      return { success: false, error: 'Failed to update affiliate data' };
    }
  };

  return {
    affiliateData,
    loading,
    error,
    updateAffiliateData
  };
};
