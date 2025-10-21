import { useEffect, useState } from 'react';

import { galleryApi } from '../api/gallery.api';
import { GalleryImage } from '../types';
import { usePreviewData } from '@shared/contexts/PreviewDataProvider';

export const useGallery = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isPreviewMode } = usePreviewData();

  useEffect(() => {
    const fetchGalleryData = async (): Promise<void> => {
      try {
        setLoading(true);
        setError(null);
        
        // In preview mode, return empty gallery (no images)
        if (isPreviewMode) {
          setImages([]);
          setLoading(false);
          return;
        }
        
        const galleryImages = await galleryApi.getGalleryImages();
        setImages(galleryImages);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to load gallery data');
      } finally {
          setLoading(false);
        }
      };

      void fetchGalleryData();
    }, [isPreviewMode]);

    return {
      images,
      loading,
      error,
    };
  };
