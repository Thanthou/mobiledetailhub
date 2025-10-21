import { useEffect, useState } from 'react';

import { useImageRotation } from '@shared/hooks';
import { GalleryImage } from '@shared/types';
import { usePreviewData } from '@/tenant-app/contexts/PreviewDataProvider';

// Fisher-Yates shuffle algorithm
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = shuffled[i];
    const itemAtJ = shuffled[j];
    if (temp !== undefined && itemAtJ !== undefined) {
      shuffled[i] = itemAtJ;
      shuffled[j] = temp;
    }
  }
  return shuffled;
}

export function useRotatingBackground() {
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isPreviewMode, industry } = usePreviewData();

  // Load gallery data
  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        // Load gallery images for both preview and live mode
        const galleryUrl = `/industries/${industry || 'mobile-detailing'}/data/gallery.json`;
        const res = await fetch(galleryUrl);
        if (!res.ok) throw new Error(`Failed to fetch gallery data: ${String(res.status)}`);
        const data = await res.json() as GalleryImage[];

        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- cancelled flag is set in cleanup
        if (cancelled) return;

        // Shuffle the images for random order
        const shuffledData = shuffleArray(data);
        setGalleryImages(shuffledData);
        setLoading(false);
        setError(null);
      } catch (err) {
        setLoading(false);
        setError(err instanceof Error ? err.message : 'Failed to load gallery data');
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [industry]);

  // Extract image URLs for the rotation utility
  const imageUrls = galleryImages.map(img => img.src);

  // Use the new image rotation utility (only if we have images)
  const rotation = useImageRotation({
    images: imageUrls.length > 0 ? imageUrls : [''], // Provide dummy if empty
    autoRotate: imageUrls.length > 0, // Only rotate if we have images
    interval: 7000, // 7 seconds to match original
    fadeDuration: 2000, // 2 seconds fade duration
    preloadNext: true,
    pauseOnHover: false // Background doesn't need hover pause
  });

  const { currentIndex, hasMultipleImages } = rotation;

  return {
    images: galleryImages,
    currentIndex,
    loading,
    error,
    hasMultipleImages: imageUrls.length > 1, // Only true if we actually have multiple images
  };
}
