/**
 * Hook for resolving affiliate ID from auth context or URL params
 * Handles both affiliate users and admin users viewing other businesses
 */

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { useAuth } from '@/shared/hooks';

/**
 * Resolves the affiliate ID for the current user/context
 * For affiliate users: gets ID from auth context
 * For admin users: fetches ID from business slug in URL
 */
export function useAffiliateId(): string | undefined {
  const authContext = useAuth();
  const user = authContext.user;
  const { businessSlug } = useParams<{ businessSlug: string }>();
  const [adminAffiliateId, setAdminAffiliateId] = useState<string | null>(null);
  
  // Fetch affiliate ID for admin users
  useEffect(() => {
    if (user?.role === 'admin' && businessSlug && !adminAffiliateId) {
      const fetchAffiliateId = async () => {
        try {
          const response = await fetch(`/api/affiliates/${businessSlug}`);
          
          if (response.ok) {
            const data = await response.json() as {
              success: boolean;
              affiliate?: {
                id: number;
              };
            };
            
            if (data.success && data.affiliate?.id) {
              setAdminAffiliateId(data.affiliate.id.toString());
            }
          }
        } catch (err: unknown) {
          console.error('Error fetching affiliate ID:', err);
        }
      };
      void fetchAffiliateId();
    }
  }, [user?.role, businessSlug, adminAffiliateId]);
  
  return user?.affiliate_id?.toString() ?? adminAffiliateId ?? undefined;
}

