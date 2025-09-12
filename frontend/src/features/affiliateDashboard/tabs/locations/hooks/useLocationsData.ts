import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { config } from '@/../config/env';
import type { ServiceArea } from '@/features/affiliateDashboard/tabs/locations/types';
import { useAuth } from '@/shared/hooks';

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
          const response = await fetch(`${config.apiUrl}/api/affiliates/${String(businessSlug)}`, {
            headers: {
              'Authorization': `Bearer ${String(token)}`,
              'Content-Type': 'application/json'
            }
          });
          
          if (response.ok) {
            const data = await response.json() as {
              success: boolean;
              affiliate?: { id: string };
            };
            if (data.success && data.affiliate) {
              setAdminAffiliateId(data.affiliate.id);
            }
          }
        } catch (error) {
          console.error('Error fetching affiliate ID:', error);
        }
      };
      
      void fetchAffiliateId();
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
        const response = await fetch(`${config.apiUrl}/api/affiliates/${String(businessSlug)}/service_areas`, {
          headers: {
            'Authorization': `Bearer ${String(token)}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json() as {
            service_areas?: ServiceArea[];
          };
          // Transform the data to match our ServiceArea interface
          const serviceAreas: ServiceArea[] = data.service_areas ?? [];
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
    if ((user?.role === 'affiliate' && user.id) || (user?.role === 'admin' && adminAffiliateId)) {
      void fetchLocations();
    }
  }, [user?.id, user?.role, adminAffiliateId, businessSlug]);

  const addLocation = async (locationData: Omit<ServiceArea, 'id'>) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${config.apiUrl}/api/affiliates/${String(businessSlug)}/service_areas`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${String(token)}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(locationData)
      });

      if (response.ok) {
        const result = await response.json() as {
          service_area: ServiceArea;
        };
        const newLocation = result.service_area;
        setLocations(prev => [...prev, newLocation]);
        return { success: true, data: newLocation };
      } else {
        const errorData = await response.json() as {
          error?: string;
        };
        return { success: false, error: errorData.error ?? 'Failed to add location' };
      }
    } catch (error) {
      console.error('Error adding location:', error);
      return { success: false, error: 'Failed to add location' };
    }
  };

  const removeLocation = async (locationId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${config.apiUrl}/api/affiliates/${String(businessSlug)}/service_areas/${locationId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${String(token)}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setLocations(prev => prev.filter(loc => `${loc.city}-${loc.state}` !== locationId));
        return { success: true };
      } else {
        const errorData = await response.json() as {
          error?: string;
        };
        return { success: false, error: errorData.error ?? 'Failed to remove location' };
      }
    } catch (error) {
      console.error('Error removing location:', error);
      return { success: false, error: 'Failed to remove location' };
    }
  };

  const updateLocation = async (locationId: string, updates: Partial<ServiceArea>) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${config.apiUrl}/api/affiliates/${String(businessSlug)}/service_areas/${locationId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${String(token)}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updates)
      });

      if (response.ok) {
        const result = await response.json() as {
          service_area: ServiceArea;
        };
        const updatedLocation = result.service_area;
        setLocations(prev => prev.map(loc => 
          `${loc.city}-${loc.state}` === locationId ? { ...loc, ...updatedLocation } : loc
        ));
        return { success: true, data: updatedLocation };
      } else {
        const errorData = await response.json() as {
          error?: string;
        };
        return { success: false, error: errorData.error ?? 'Failed to update location' };
      }
    } catch (error) {
      console.error('Error updating location:', error);
      return { success: false, error: 'Failed to update location' };
    }
  };

  const updateLocationField = async (locationId: string, field: keyof ServiceArea, value: unknown) => {
    // Update local state immediately for responsive UI
    setLocations(prev => prev.map(loc => {
      if (locationId === 'primary') {
        return loc.primary ? { ...loc, [field]: value } : loc;
      } else {
        return `${loc.city}-${loc.state}` === locationId ? { ...loc, [field]: value } : loc;
      }
    }));

    // Persist to database
    try {
      const token = localStorage.getItem('token');
      const location = locations.find(loc => {
        if (locationId === 'primary') {
          return loc.primary;
        } else {
          return `${loc.city}-${loc.state}` === locationId;
        }
      });

      if (!location) {
        console.error('Location not found for update');
        return;
      }

      const updateData: Record<string, unknown> = { [field]: value };
      const endpoint = locationId === 'primary' 
        ? `${config.apiUrl}/api/affiliates/${String(businessSlug)}/service_areas/primary`
        : `${config.apiUrl}/api/affiliates/${String(businessSlug)}/service_areas/${locationId}`;
      
      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${String(token)}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      });

      if (!response.ok) {
        console.error('Failed to update location in database');
        // Optionally revert the local state change here
      }
    } catch (error) {
      console.error('Error updating location in database:', error);
      // Optionally revert the local state change here
    }
  };

  return {
    locations,
    loading,
    error,
    addLocation,
    removeLocation,
    updateLocation,
    updateLocationField,
    refetch: () => {
      setLoading(true);
      // Trigger re-fetch by updating a dependency
    }
  };
};
