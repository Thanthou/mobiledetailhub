import { useEffect, useState } from 'react';

import type { GalleryImage } from '@/shared/types';

import { getBookingGalleryImages } from '../api/booking.api';

interface UseBookingGalleryReturn {
  images: GalleryImage[];
  isLoading: boolean;
  error: Error | null;
}

/**
 * Hook to load gallery images for booking background
 */
export function useBookingGallery(): UseBookingGalleryReturn {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadImages = async (): Promise<void> => {
      try {
        setIsLoading(true);
        const data = await getBookingGalleryImages();
        
        if (!cancelled) {
          setImages(data);
          setError(null);
        }
      } catch (err: unknown) {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error(String(err)));
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    void loadImages();

    return () => {
      cancelled = true;
    };
  }, []);

  return { images, isLoading, error };
}

