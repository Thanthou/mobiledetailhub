/**
 * Hook for resolving tenant ID from auth context or URL params
 * Handles both tenant users and admin users viewing other businesses
 */

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { useAuth } from '@/shared/hooks';

/**
 * Resolves the tenant ID for the current user/context
 * For tenant users: gets ID from auth context
 * For admin users: fetches ID from business slug in URL
 */
export function useTenantId(): string | undefined {
  const authContext = useAuth();
  const user = authContext.user;
  const { businessSlug } = useParams<{ businessSlug: string }>();
  const [adminTenantId, setAdminTenantId] = useState<string | null>(null);
  
  // Fetch tenant ID for admin users
  useEffect(() => {
    if (user?.role === 'admin' && businessSlug && !adminTenantId) {
      const fetchTenantId = async () => {
        try {
          const response = await fetch(`/api/tenants/${businessSlug}`);
          
          if (response.ok) {
            const data = await response.json() as {
              success: boolean;
              tenant?: {
                id: number;
              };
            };
            
            if (data.success && data.tenant?.id) {
              setAdminTenantId(data.tenant.id.toString());
            }
          }
        } catch (err: unknown) {
          console.error('Error fetching tenant ID:', err);
        }
      };
      void fetchTenantId();
    }
  }, [user?.role, businessSlug, adminTenantId]);
  
  return user?.tenant_id?.toString() ?? adminTenantId ?? undefined;
}

