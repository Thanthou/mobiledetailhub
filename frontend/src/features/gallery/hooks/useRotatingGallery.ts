import { useCallback,useEffect, useRef, useState } from 'react';

import { GalleryImage } from '../types';

// Fisher-Yates shuffle algorithm
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    // Safe swap - indices are guaranteed to be valid by loop bounds
    const temp = shuffled[i];
    const itemJ = shuffled[j];
    if (temp !== undefined && itemJ !== undefined) {
      shuffled[i] = itemJ;
      shuffled[j] = temp;
    }
  }
  return shuffled;
}

type RotatingState = {
  currentImages: GalleryImage[];
  loading: boolean;
  error: string | null;
  fadingIndex: number | null; // which card is currently fading (0,1,2)
  nextImages: GalleryImage[]; // next images for crossfade
};

export function useRotatingGallery() {
  const [allImages, setAllImages] = useState<GalleryImage[]>([]);
  const [state, setState] = useState<RotatingState>({
    currentImages: [],
    loading: true,
    error: null,
    fadingIndex: null,
    nextImages: [],
  });

  // Refs to avoid stale closures inside timers
  const allImagesRef = useRef<GalleryImage[]>([]);
  const currentRef = useRef<GalleryImage[]>([]);
  const fadingIndexRef = useRef<number>(-1);
  const nextPtrRef = useRef<number>(0); // next index in allImages to try
  const intervalRef = useRef<number | null>(null);
  const fadeTimeoutRef = useRef<number | null>(null);
  const unFadeTimeoutRef = useRef<{ timeout: number | null; raf: number | null }>({ 
    timeout: null, 
    raf: null 
  });

  // Load data
  useEffect(() => {
    let cancelled = false;
    void (async (): Promise<void> => {
        try {
          const res = await fetch('/mobile-detailing/data/gallery.json');
          if (!res.ok) throw new Error(`Failed to fetch gallery data: ${res.status}`);
          const data = await res.json() as GalleryImage[];

          // Check if component is still mounted before updating state
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- cancelled can be set to true by cleanup function before async completes
          if (cancelled) return;
          
          const shuffledData = shuffleArray(data);
          setAllImages(shuffledData);
          allImagesRef.current = shuffledData;

          const initial = shuffledData.slice(0, Math.min(3, shuffledData.length));
          currentRef.current = initial;

          // set nextPtr to first unseen image
          nextPtrRef.current = initial.length % shuffledData.length;

          setState(s => ({
            ...s,
            currentImages: initial,
            nextImages: initial,
            loading: false,
            error: null,
          }));
      } catch (err: unknown) {
        // Check if component is still mounted before updating state
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- cancelled can be set to true by cleanup function before async completes
        if (cancelled) return;
        
        setState(s => ({
          ...s,
          loading: false,
          error: err instanceof Error ? err.message : 'Failed to load gallery data',
        }));
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // Helper: advance nextPtr to an image not currently displayed (avoid dupes)
  const getNextUniqueImage = useCallback((): GalleryImage | null => {
    const all = allImagesRef.current;
    const current = currentRef.current;
    if (all.length === 0) return null;

    const visibleIds = new Set(current.map(i => i.id));
    let tries = 0;
    let ptr = nextPtrRef.current;

    while (tries < all.length) {
      const candidate = all[ptr];
      ptr = (ptr + 1) % all.length;
      tries++;

      if (!candidate) continue;
      if (!visibleIds.has(candidate.id)) {
        // lock in the advanced ptr
        nextPtrRef.current = ptr;
        return candidate;
      }
    }

    // Fallback: if everything is visible (e.g., all.length <= 3), just cycle anyway
    const fallback = all[nextPtrRef.current];
    nextPtrRef.current = (nextPtrRef.current + 1) % all.length;
    return fallback ?? null;
  }, []);

  // One-step rotation: fade one card, swap only that card, un-fade, move to next card index
  const rotateOneCard = useCallback(() => {
    const all = allImagesRef.current;
    if (all.length === 0) return;

    const current = currentRef.current;
    if (current.length === 0) return;

    // if only 1–3 images total, we can still fade them one-by-one but replacement may repeat
    const nextFadeIndex = (fadingIndexRef.current + 1) % Math.min(current.length, 3);
    fadingIndexRef.current = nextFadeIndex;

    // Get replacement image
    const replacement = getNextUniqueImage();
    if (replacement) {
      // Create next images array with replacement
      const nextImages = currentRef.current.slice();
      nextImages[nextFadeIndex] = replacement;
      
      // 1) Set next images first (paint baseline)
      setState(s => ({ ...s, nextImages }));
      
      // 2) Flip the fade flag on the next frame so CSS transitions fire
      const raf = window.requestAnimationFrame(() => {
        setState(s => ({ ...s, fadingIndex: nextFadeIndex }));
      });

      // Store raf id to clean up if needed
      unFadeTimeoutRef.current.raf = raf;

      // After 1000ms (CSS duration), commit nextImages -> currentImages
      const timeout = window.setTimeout(() => {
        // Update current images to the new ones
        currentRef.current = nextImages;
        setState(s => ({ 
          ...s, 
          currentImages: nextImages,
          fadingIndex: null 
        }));
      }, 1000 + 50); // + small buffer
      
      unFadeTimeoutRef.current.timeout = timeout;
    }
  }, [getNextUniqueImage]);

  // Interval: every 7s rotate one card
  useEffect(() => {
    if (allImages.length === 0) return;

    // Clear any existing
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = window.setInterval(rotateOneCard, 7000);

    return () => {
      // Clean up interval
      if (intervalRef.current) clearInterval(intervalRef.current);
      
      // Clean up fade timeouts - capture ref values at cleanup time
      // eslint-disable-next-line react-hooks/exhaustive-deps -- We intentionally capture current ref values at cleanup time, not at effect setup
      const fadeTimeout = fadeTimeoutRef.current;
      // eslint-disable-next-line react-hooks/exhaustive-deps -- We intentionally capture current ref values at cleanup time, not at effect setup
      const unFadeTimeouts = unFadeTimeoutRef.current;
      
      if (fadeTimeout !== null) {
        clearTimeout(fadeTimeout);
      }
      if (unFadeTimeouts.timeout !== null) {
        clearTimeout(unFadeTimeouts.timeout);
      }
      if (unFadeTimeouts.raf !== null) {
        cancelAnimationFrame(unFadeTimeouts.raf);
      }
    };
  }, [allImages.length, rotateOneCard]);

  return {
    currentImages: state.currentImages,   // render these 3
    nextImages: state.nextImages,         // next images for crossfade
    loading: state.loading,
    error: state.error,
    fadingIndex: state.fadingIndex,       // which card should have the fade class
  };
}
