import { useEffect,useState } from 'react';

import { useImageRotation } from '@shared/hooks/useImageRotation';
import { usePreviewData } from '@tenant-app/contexts/PreviewDataProvider';

import type { Review } from '../types';

// Fisher-Yates shuffle algorithm
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = shuffled[i];
    if (temp !== undefined && shuffled[j] !== undefined) {
      shuffled[i] = shuffled[j];
      shuffled[j] = temp;
    }
  }
  return shuffled;
}

export function useRotatingReviews(reviews: Review[]) {
  const [reviewImages, setReviewImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isPreviewMode, industry } = usePreviewData();

  // Load gallery images for background rotation (no avatar images)
  useEffect(() => {
    let cancelled = false;
    void (async (): Promise<void> => {
      try {
        setLoading(true);
        setError(null);

        let images: string[] = [];

        // Load gallery images for background rotation
        const galleryUrl = `/industries/${industry || 'mobile-detailing'}/data/gallery.json`;
        try {
          const res = await fetch(galleryUrl);
          if (!res.ok) throw new Error(`Failed to fetch gallery data: ${res.status}`);
          const galleryData: unknown = await res.json();
          const galleryImages = Array.isArray(galleryData) 
            ? galleryData.map((img: unknown) => {
                if (typeof img === 'object' && img !== null && 'src' in img) {
                  return (img as { src: unknown }).src;
                }
                return null;
              }).filter((src): src is string => typeof src === 'string')
            : [];
          
          // Use only gallery images for background rotation
          images = shuffleArray(galleryImages);
          
          // If we have images, we're good to go
          if (images.length === 0) {
            console.warn(`No gallery images found for ${industry}. Background will be plain.`);
          }
        } catch (galleryError: unknown) {
          // Fallback to empty array - component will handle gracefully
          console.warn(`Failed to load gallery images for ${industry}:`, galleryError);
          images = [];
        }

        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- Prevents state updates after component unmount
        if (!cancelled) {
          setReviewImages(images);
          setLoading(false);
          setError(null);
        }
      } catch (err: unknown) {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- Prevents state updates after component unmount
        if (!cancelled) {
          setLoading(false);
          setError(err instanceof Error ? err.message : 'Failed to load review images');
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [industry]); // Load based on industry, not isPreviewMode

  // Use the image rotation utility (only if we have images)
  const rotation = useImageRotation({
    images: reviewImages.length > 0 ? reviewImages : [''], // Provide dummy if empty
    autoRotate: reviewImages.length > 0, // Only rotate if we have images
    interval: 8000, // Match FAQ interval
    fadeDuration: 2000, // 2 seconds fade duration
    preloadNext: true,
    pauseOnHover: false // Background doesn't need hover pause
  });

  const { currentIndex, hasMultipleImages } = rotation;
  
  return {
    images: reviewImages,
    currentIndex,
    loading,
    error,
    hasMultipleImages,
    ...rotation
  };
}
