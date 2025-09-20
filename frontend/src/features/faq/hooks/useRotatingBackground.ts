import { useState, useEffect } from 'react';
import { useImageRotation } from '@/shared/utils';
import { GalleryImage } from '@/features/gallery/types';

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

export function useRotatingBackground() {
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load gallery data
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/data/gallery.json');
        if (!res.ok) throw new Error(`Failed to fetch gallery data: ${res.status}`);
        const data: GalleryImage[] = await res.json();

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
  }, []);

  // Extract image URLs for the rotation utility
  const imageUrls = galleryImages.map(img => img.src);

  // Use the new image rotation utility
  const rotation = useImageRotation({
    images: imageUrls,
    autoRotate: true,
    interval: 7000, // 7 seconds to match original
    fadeDuration: 2000, // 2 seconds fade duration
    preloadNext: true,
    pauseOnHover: false // Background doesn't need hover pause
  });

  const { currentIndex, hasMultipleImages } = rotation;
  
  // Temporarily removed performance optimization to test if it causes the sudden pop

  // Return the original GalleryImage objects for compatibility
  const images = galleryImages;
  const currentImage = images[currentIndex] || null;
  const nextIndex = hasMultipleImages ? (currentIndex + 1) % images.length : 0;
  const nextImage = images[nextIndex] || null;

  return {
    images,
    currentIndex,
    loading,
    error,
    hasMultipleImages
  };
}
