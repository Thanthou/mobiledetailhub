import { useState, useEffect } from 'react';
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
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
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
        setImages(shuffledData);
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

  // Auto-rotate every 7 seconds
  useEffect(() => {
    if (!images.length) return;
    
    const intervalId = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 7000);
    
    return () => clearInterval(intervalId);
  }, [images.length]);

  const currentImage = images[currentIndex] || null;
  const nextIndex = images.length > 1 ? (currentIndex + 1) % images.length : 0;
  const nextImage = images[nextIndex] || null;

  return {
    images,
    currentIndex,
    loading,
    error,
  };
}
