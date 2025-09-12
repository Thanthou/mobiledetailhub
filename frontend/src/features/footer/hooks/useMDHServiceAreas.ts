import { useEffect, useState } from 'react';

interface StateCities {
  [state: string]: {
    [city: string]: string[]; // Array of slugs
  };
}

interface MDHServiceAreasResponse {
  success: boolean;
  service_areas: StateCities;
  count: number;
  message?: string;
}

export const useMDHServiceAreas = () => {
  const [serviceAreas, setServiceAreas] = useState<StateCities>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServiceAreas = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch('/api/service_areas/footer');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch service areas: ${response.status.toString()}`);
        }
        
        const data = await response.json() as MDHServiceAreasResponse;
        
        if (data.success) {
          setServiceAreas(data.service_areas);
        } else {
          throw new Error(data.message || 'Failed to fetch service areas');
        }
      } catch (err) {
        console.error('Error fetching MDH service areas:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        setServiceAreas({});
      } finally {
        setIsLoading(false);
      }
    };

    void fetchServiceAreas();
  }, []);

  return {
    serviceAreas,
    isLoading,
    error
  };
};
