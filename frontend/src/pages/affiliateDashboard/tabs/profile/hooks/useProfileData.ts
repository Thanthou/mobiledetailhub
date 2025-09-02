import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../../../../contexts/AuthContext';
import { config } from '../../../../../config/environment';
import type { ProfileData, ProfileFormData, ProfileUpdateResponse, ProfileValidationErrors } from '../types';

interface UseProfileDataReturn {
  profileData: ProfileData | null;
  loading: boolean;
  error: string | null;
  validationErrors: ProfileValidationErrors;
  updateProfile: (data: ProfileFormData) => Promise<ProfileUpdateResponse>;
  isUpdating: boolean;
}

export const useProfileData = (): UseProfileDataReturn => {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<ProfileValidationErrors>({});
  const [isUpdating, setIsUpdating] = useState(false);
  
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
          const response = await fetch(`${config.apiUrl}/api/admin/users?status=affiliates&slug=${businessSlug}`, {
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

  // Fetch profile data
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Please log in to view your profile');
        }

        let affiliateId = user?.id;
        
        // For admin users, use the fetched affiliate ID
        if (user?.role === 'admin' && adminAffiliateId) {
          affiliateId = adminAffiliateId;
        }
        
        if (!affiliateId) {
          throw new Error('No affiliate ID available');
        }

        // Fetch profile data from the affiliate endpoint
        const response = await fetch(`${config.apiUrl}/api/affiliates/${businessSlug}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error('Authentication failed. Please log in again.');
          }
          if (response.status === 404) {
            throw new Error('Profile not found. Please contact support to set up your affiliate profile.');
          }
          throw new Error(`Failed to fetch profile: ${response.statusText}`);
        }

        const result = await response.json();
        const data = result.affiliate;
        
        // Transform the data to match our ProfileData interface
        const transformedData: ProfileData = {
          first_name: data.first_name || data.owner?.split(' ')[0] || '',
          last_name: data.last_name || data.owner?.split(' ').slice(1).join(' ') || '',
          personal_phone: data.personal_phone || data.phone || '',
          personal_email: data.personal_email || data.email || '',
          business_name: data.business_name || '',
          business_email: data.business_email || data.email || '',
          business_phone: data.business_phone || data.phone || '',
          business_start_date: data.business_start_date || data.created_at || '',
          // URL fields
          website_url: data.website_url || '',
          gbp_url: data.gbp_url || '',
          facebook_url: data.facebook_url || '',
          youtube_url: data.youtube_url || '',
          tiktok_url: data.tiktok_url || '',
          instagram_url: data.instagram_url || '',
          // Additional fields from database
          id: data.id,
          slug: data.slug,
          owner: data.owner,
          email: data.email,
          phone: data.phone,
          created_at: data.created_at,
          updated_at: data.updated_at,
        };

        setProfileData(transformedData);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch profile data';
        setError(errorMessage);
        console.error('Error fetching profile data:', err);
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if we have the necessary data
    if ((user?.role === 'affiliate' && user?.id) || (user?.role === 'admin' && adminAffiliateId)) {
      fetchProfileData();
    }
  }, [user?.id, user?.role, adminAffiliateId, businessSlug]);

  // Update profile data
  const updateProfile = async (data: ProfileFormData): Promise<ProfileUpdateResponse> => {
    try {
      setIsUpdating(true);
      setValidationErrors({});

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Validate the data
      const errors = validateProfileData(data);
      if (Object.keys(errors).length > 0) {
        setValidationErrors(errors);
        return { success: false, error: 'Validation failed' };
      }

      let affiliateId = user?.id;
      
      // For admin users, use the fetched affiliate ID
      if (user?.role === 'admin' && adminAffiliateId) {
        affiliateId = adminAffiliateId;
      }
      
      if (!affiliateId) {
        throw new Error('No affiliate ID available');
      }

      // Update profile data via API
      const response = await fetch(`${config.apiUrl}/api/affiliates/${businessSlug}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication failed. Please log in again.');
        }
        if (response.status === 400) {
          const errorData = await response.json();
          if (errorData.errors) {
            setValidationErrors(errorData.errors);
            return { success: false, error: 'Validation failed' };
          }
        }
        throw new Error(`Failed to update profile: ${response.statusText}`);
      }

      const responseData = await response.json();
      
      // Update local state with the new data
      const updatedProfile: ProfileData = {
        ...profileData!,
        ...data,
        updated_at: new Date().toISOString(),
      };
      
      setProfileData(updatedProfile);
      return { success: true, data: updatedProfile };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update profile';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    profileData,
    loading,
    error,
    validationErrors,
    updateProfile,
    isUpdating,
  };
};

// Validation function
const validateProfileData = (data: ProfileFormData): ProfileValidationErrors => {
  const errors: ProfileValidationErrors = {};

  // Personal Information Validation - only validate format if provided
  if (data.personal_phone?.trim() && !/^[\d\s\-\+\(\)]{10,20}$/.test(data.personal_phone)) {
    errors.personal_phone = 'Please enter a valid phone number';
  }

  if (data.personal_email?.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.personal_email)) {
    errors.personal_email = 'Please enter a valid email address';
  }

  // Business Information Validation - only validate format if provided
  if (data.business_email?.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.business_email)) {
    errors.business_email = 'Please enter a valid email address';
  }

  if (data.business_phone?.trim() && !/^[\d\s\-\+\(\)]{10,20}$/.test(data.business_phone)) {
    errors.business_phone = 'Please enter a valid phone number';
  }

  // URL Validation - only validate format if provided
  const urlPattern = /^https?:\/\/.+/;
  
  if (data.gbp_url?.trim() && !urlPattern.test(data.gbp_url)) {
    errors.gbp_url = 'Please enter a valid URL (must start with http:// or https://)';
  }
  
  if (data.facebook_url?.trim() && !urlPattern.test(data.facebook_url)) {
    errors.facebook_url = 'Please enter a valid URL (must start with http:// or https://)';
  }
  
  if (data.youtube_url?.trim() && !urlPattern.test(data.youtube_url)) {
    errors.youtube_url = 'Please enter a valid URL (must start with http:// or https://)';
  }
  
  if (data.tiktok_url?.trim() && !urlPattern.test(data.tiktok_url)) {
    errors.tiktok_url = 'Please enter a valid URL (must start with http:// or https://)';
  }
  
  if (data.instagram_url?.trim() && !urlPattern.test(data.instagram_url)) {
    errors.instagram_url = 'Please enter a valid URL (must start with http:// or https://)';
  }

  return errors;
};
