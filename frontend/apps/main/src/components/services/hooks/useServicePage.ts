import { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';

import { ServiceData } from '@main/components/services/types/service.types';
import { loadServiceData } from '@shared/utils/serviceLoader';
import { usePreviewData } from '@shared/components/preview';
import { useData } from '@shared/hooks';

export const useServicePage = () => {
  const { serviceType } = useParams<{ serviceType: string }>();
  const location = useLocation();
  const { isPreviewMode, industry: previewIndustry } = usePreviewData();
  const data = useData();
  
  const [serviceData, setServiceData] = useState<ServiceData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (!serviceType) {
      setServiceData(null);
      setIsLoading(false);
      return;
    }
    
    async function loadData() {
      setIsLoading(true);
      setError(null);
      
      try {
        // Determine industry from context
        const industry = isPreviewMode ? previewIndustry : data?.industry;
        
        if (!industry) {
          throw new Error('Industry not found');
        }
        
        // Load service data dynamically
        const data = await loadServiceData(industry, serviceType);
        
        if (!data) {
          throw new Error(`Service ${serviceType} not found for ${industry}`);
        }
        
        setServiceData(data);
      } catch (err) {
        console.error('Error loading service data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load service');
        setServiceData(null);
      } finally {
        setIsLoading(false);
      }
    }
    
    void loadData();
  }, [serviceType, isPreviewMode, previewIndustry, data?.industry]);

  return {
    serviceType,
    serviceData,
    isLoading,
    error
  };
};
