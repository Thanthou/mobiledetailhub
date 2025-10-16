import { useEffect, useState } from 'react';

import { galleryApi } from '../api/gallery.api';
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
        
        const galleryImages = await galleryApi.getGalleryImages();
        setImages(galleryImages);
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
