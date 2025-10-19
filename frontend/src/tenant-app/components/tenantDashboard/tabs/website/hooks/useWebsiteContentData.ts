import { useEffect, useState } from 'react';

import { config } from '@/../config/env';
import type { WebsiteContentData } from '@/shared/api/websiteContent.api';

interface UseWebsiteContentDataReturn {
  contentData: WebsiteContentData | null;
  loading: boolean;
  error: string | null;
  updateContent: (data: Partial<WebsiteContentData>) => Promise<boolean>;
  isUpdating: boolean;
  refetch: () => Promise<void>;
}

export const useWebsiteContentData = (tenantSlug?: string): UseWebsiteContentDataReturn => {
  const [contentData, setContentData] = useState<WebsiteContentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  // Fetch website content data
  useEffect(() => {
    const fetchContentData = async () => {
      if (!tenantSlug) {
        setError('Tenant slug is required');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`${config.apiUrl}/api/website-content/${tenantSlug}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Website content not found');
          }
          throw new Error(`Failed to fetch website content: ${response.statusText}`);
        }

        const result = await response.json() as { content?: WebsiteContentData };
        const data = result.content;
        
        if (!data) {
          throw new Error('No website content received');
        }
        
        setContentData(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch website content';
        setError(errorMessage);
        console.error('Error fetching website content:', err);
      } finally {
        setLoading(false);
      }
    };

    void fetchContentData();
  }, [tenantSlug, refetchTrigger]);

  // Refetch function
  const refetch = () => {
    setRefetchTrigger(prev => prev + 1);
    return Promise.resolve();
  };

  // Update website content data
  const updateContent = async (data: Partial<WebsiteContentData>): Promise<boolean> => {
    if (!tenantSlug) {
      setError('Tenant slug is required');
      return false;
    }

    try {
      setIsUpdating(true);
      setError(null);

      // Send the partial data to update
      const response = await fetch(`${config.apiUrl}/api/website-content/${tenantSlug}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...contentData, ...data }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update website content: ${response.statusText}`);
      }

      const result = await response.json() as { content?: WebsiteContentData };
      const updatedData = result.content;
      
      if (updatedData) {
        setContentData(updatedData);
      }
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update website content';
      setError(errorMessage);
      console.error('Error updating website content:', err);
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    contentData,
    loading,
    error,
    updateContent,
    isUpdating,
    refetch,
  };
};

