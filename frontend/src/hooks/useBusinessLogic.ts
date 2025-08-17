import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAvailableBusinesses, loadBusinessConfig } from '../utils/businessLoader';

export const useBusinessLogic = () => {
  const { businessSlug } = useParams<{ businessSlug?: string }>();
  const navigate = useNavigate();
  
  const [currentBusiness, setCurrentBusiness] = useState<string>('mdh');
  const [currentConfig, setCurrentConfig] = useState<any>(null);
  const [businessConfigs, setBusinessConfigs] = useState<{[key: string]: any}>({});
  const [isLoading, setIsLoading] = useState(false);

  // Detect business from URL path
  useEffect(() => {
    if (businessSlug && ['jps', 'mdh', 'abc'].includes(businessSlug)) {
      setCurrentBusiness(businessSlug);
    } else {
      setCurrentBusiness('mdh');
    }
  }, [businessSlug]);

  // Load initial business config
  useEffect(() => {
    if (currentBusiness && !businessConfigs[currentBusiness]) {
      const loadInitialConfig = async () => {
        try {
          const config = await loadBusinessConfig(currentBusiness);
          if (config) {
            setBusinessConfigs(prev => ({ ...prev, [currentBusiness]: config }));
          }
        } catch (error) {
          console.error(`Error loading initial config for ${currentBusiness}:`, error);
        }
      };

      loadInitialConfig();
    }
  }, [currentBusiness, businessConfigs]);

  // Update current config when business changes
  useEffect(() => {
    if (currentBusiness && businessConfigs[currentBusiness]) {
      setCurrentConfig(businessConfigs[currentBusiness]);
    }
  }, [currentBusiness, businessConfigs]);

  const handleBusinessChange = async (businessSlug: string) => {
    if (isLoading) return;

    setIsLoading(true);
    setCurrentConfig(null);
    setBusinessConfigs(prev => ({ ...prev, [businessSlug]: null }));

    navigate(`/${businessSlug}`);
    setCurrentBusiness(businessSlug);

    try {
      const config = await loadBusinessConfig(businessSlug);
      if (config) {
        setBusinessConfigs(prev => ({ ...prev, [businessSlug]: config }));
        setCurrentConfig(config);
      }
    } catch (error) {
      console.error(`Error loading business config for ${businessSlug}:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    currentBusiness,
    currentConfig,
    isLoading,
    handleBusinessChange
  };
};