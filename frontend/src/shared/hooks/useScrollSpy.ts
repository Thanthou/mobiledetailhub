import { useEffect } from 'react';

import { type SectionId,useSectionStore } from '@shared/state/sectionStore';

type Opts = {
  ids: SectionId[];
  headerPx?: number;       // sticky header height
  threshold?: number;      // how much must be visible
  updateHash?: boolean;    // keep URL hash in sync
};

export function useScrollSpy({
  ids,
  headerPx = 88,
  threshold = 0.55,
  updateHash = false,
}: Opts) {
  const setCurrent = useSectionStore((s) => s.setCurrent);

  useEffect(() => {
    const els = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el);
    if (!els.length) return;

    // Use multiple thresholds for more granular detection
    const thresholds = Array.from({ length: 21 }, (_, i) => i * 0.05);

    const io = new IntersectionObserver(
      (entries) => {
        // Only process if we have intersecting entries
        const intersecting = entries.filter((e) => e.isIntersecting);
        
        if (intersecting.length === 0) return;

        // Find the MOST visible section (highest intersection ratio)
        const mostVisible = intersecting.reduce((best, current) => {
          return current.intersectionRatio > best.intersectionRatio ? current : best;
        });

        // Only update if intersection ratio is significant (avoid brief overlaps during scroll)
        if (mostVisible.intersectionRatio > 0.3) {
          const id = mostVisible.target.id as SectionId | null;
          setCurrent(id);

          if (updateHash && id) {
            const hash = `#${id}`;
            if (location.hash !== hash) history.replaceState(null, '', hash);
          }
        }
      },
      {
        root: null,
        rootMargin: `-${headerPx}px 0px -20% 0px`, // Account for header and bottom
        threshold: thresholds,
      }
    );

    els.forEach((el) => { io.observe(el); });
    return () => { io.disconnect(); };
  }, [ids, headerPx, threshold, updateHash, setCurrent]);
}

