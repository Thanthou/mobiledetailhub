import { useEffect,useState } from 'react';

import { GalleryImage } from '../types';

export const useGallery = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGalleryData = async (): Promise<void> => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('/mobile-detailing/data/gallery.json');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch gallery data: ${response.status}`);
        }
        
        const data = await response.json() as { images?: GalleryImage[] };
        setImages(data.images || []);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to load gallery data');
      } finally {
        setLoading(false);
      }
    };

    void fetchGalleryData();
  }, []);

  return {
    images,
    loading,
    error,
  };
};
