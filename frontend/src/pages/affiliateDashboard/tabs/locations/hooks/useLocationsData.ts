import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../../../../contexts/AuthContext';
import type { ServiceArea, LocationData } from '../types';

export const useLocationsData = () => {
  const [locations, setLocations] = useState<ServiceArea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { user } = useAuth();
  const { businessSlug } = useParams<{ businessSlug: string }>();
  
  // For affiliate users, get ID from auth context
  // For admin users, we'll need to fetch affiliate ID from the business slug
  const [adminAffiliateId, setAdminAffiliateId] = useState<string | null>(null);

  // Fetch affiliate ID for admin users
  useEffect(() => {
    if (user?.role === 'admin' && businessSlug && !adminAffiliateId) {
      const fetchAffiliateId = async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await fetch(`/api/admin/users?status=affiliates&slug=${businessSlug}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          
          if (response.ok) {
            const data = await response.json();
            if (data.success && data.users && data.users.length > 0) {
              setAdminAffiliateId(data.users[0].id);
            }
          }
        } catch (error) {
          console.error('Error fetching affiliate ID:', error);
        }
      };
      
      fetchAffiliateId();
    }
  }, [user?.role, businessSlug, adminAffiliateId]);

  // Fetch locations data
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const token = localStorage.getItem('token');
        let affiliateId = user?.id;
        
        // For admin users, use the fetched affiliate ID
        if (user?.role === 'admin' && adminAffiliateId) {
          affiliateId = adminAffiliateId;
        }
        
        if (!affiliateId) {
          setError('No affiliate ID available');
          setLoading(false);
          return;
        }

        // Fetch service areas from the affiliate's data
        const response = await fetch(`/api/affiliates/${businessSlug}/service_areas`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          // Transform the data to match our ServiceArea interface
          const serviceAreas: ServiceArea[] = data.service_areas || [];
          setLocations(serviceAreas);
        } else {
          setError('Failed to fetch locations');
        }
      } catch (error) {
        console.error('Error fetching locations:', error);
        setError('Failed to fetch locations');
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if we have the necessary data
    if ((user?.role === 'affiliate' && user?.id) || (user?.role === 'admin' && adminAffiliateId)) {
      fetchLocations();
    }
  }, [user?.id, user?.role, adminAffiliateId, businessSlug]);

  const addLocation = async (locationData: Omit<ServiceArea, 'id'>) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/affiliates/${businessSlug}/service_areas`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(locationData)
      });

      if (response.ok) {
        const result = await response.json();
        const newLocation = result.service_area;
        setLocations(prev => [...prev, newLocation]);
        return { success: true, data: newLocation };
      } else {
        const errorData = await response.json();
        return { success: false, error: errorData.error || 'Failed to add location' };
      }
    } catch (error) {
      console.error('Error adding location:', error);
      return { success: false, error: 'Failed to add location' };
    }
  };

  const removeLocation = async (locationId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/affiliates/${businessSlug}/service_areas/${locationId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setLocations(prev => prev.filter(loc => `${loc.city}-${loc.state}` !== locationId));
        return { success: true };
      } else {
        const errorData = await response.json();
        return { success: false, error: errorData.error || 'Failed to remove location' };
      }
    } catch (error) {
      console.error('Error removing location:', error);
      return { success: false, error: 'Failed to remove location' };
    }
  };

  return {
    locations,
    loading,
    error,
    addLocation,
    removeLocation,
    refetch: () => {
      setLoading(true);
      // Trigger re-fetch by updating a dependency
    }
  };
};
