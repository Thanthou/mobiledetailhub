import { useEffect, useState } from 'react';

interface Affiliate {
  slug: string;
  name: string;
}

interface UseAffiliatesReturn {
  affiliates: Affiliate[];
  isLoading: boolean;
  error: string | null;
}

export const useAffiliates = (): UseAffiliatesReturn => {
  const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAffiliates = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch('/api/affiliates/slugs');
        if (!response.ok) {
          throw new Error(`Failed to fetch affiliates: ${String(response.status)}`);
        }
        
        const data = await response.json() as Affiliate[];
        setAffiliates(data);
      } catch (err) {
        console.error('Error fetching affiliates:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch affiliates');
      } finally {
        setIsLoading(false);
      }
    };

    void fetchAffiliates();
  }, []);

  return { affiliates, isLoading, error };
};
