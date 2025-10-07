import { useState, useEffect } from 'react';
import { useImageRotation } from '@/shared/hooks';
import type { Review } from '../types';

// Fisher-Yates shuffle algorithm
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = shuffled[i]!;
    shuffled[i] = shuffled[j]!;
    shuffled[j] = temp;
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
    (async () => {
      try {
        setLoading(true);
        setError(null);

        let images: string[] = [];

        // Load gallery images for background rotation (no avatar images)
        try {
          const res = await fetch('/mobile-detailing/data/gallery.json');
          if (!res.ok) throw new Error(`Failed to fetch gallery data: ${res.status}`);
          const galleryData = await res.json();
          const galleryImages = galleryData.map((img: any) => img.src).filter(Boolean);
          
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
        } catch (galleryError) {
          // Fallback to default images only
          images = ['/mobile-detailing/images/gallery/dodge-viper-gts-grigio-telesto-studio.png'];
        }

        if (cancelled) return;

        setReviewImages(images);
        setLoading(false);
        setError(null);
      } catch (err) {
        setLoading(false);
        setError(err instanceof Error ? err.message : 'Failed to load review images');
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
