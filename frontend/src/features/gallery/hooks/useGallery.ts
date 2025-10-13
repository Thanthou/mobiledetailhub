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
        
        const data: unknown = await response.json();
        // Gallery.json is an array directly, not an object with images property
        const galleryImages = Array.isArray(data) ? data : ((data as { images?: unknown[] }).images || []);
        setImages(galleryImages as GalleryImage[]);
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
