import { useEffect,useState } from 'react';

import { useImageRotation } from '@/shared/hooks';

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

  // Load gallery images for background rotation (no avatar images)
  useEffect(() => {
    let cancelled = false;
    void (async (): Promise<void> => {
      try {
        setLoading(true);
        setError(null);

        let images: string[] = [];

        // Load gallery images for background rotation (no avatar images)
        try {
          const res = await fetch('/mobile-detailing/data/gallery.json');
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
          
          // If we still don't have enough images, add some defaults
          if (images.length < 3) {
            const defaultImages = [
              '/mobile-detailing/images/gallery/dodge-viper-gts-grigio-telesto-studio.png',
              '/mobile-detailing/images/gallery/bmw-m4-competition-grigio-telesto-studio.png'
            ];
            images = shuffleArray([...images, ...defaultImages]);
          }
        } catch (galleryError: unknown) {
          // Fallback to default images only
          console.warn('Failed to load gallery images:', galleryError);
          images = ['/mobile-detailing/images/gallery/dodge-viper-gts-grigio-telesto-studio.png'];
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
  }, [reviews]);

  // Use the image rotation utility
  const rotation = useImageRotation({
    images: reviewImages,
    autoRotate: true,
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
