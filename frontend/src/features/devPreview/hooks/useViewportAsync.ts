/**
 * Viewport Async Operations Hook
 * Handles all async operations for viewport functionality
 * Separated from Zustand store to maintain clean separation of concerns
 */

import React, { useCallback, useEffect,useState } from 'react';

import type { Viewport } from '../state/viewportStore';
import { useViewportStore } from '../state/viewportStore';

export interface ViewportDimensions {
  width: number;
  height: number;
}

export interface ViewportBreakpoint {
  name: Viewport;
  minWidth: number;
  maxWidth: number;
  dimensions: ViewportDimensions;
}

const VIEWPORT_BREAKPOINTS: Record<Viewport, ViewportBreakpoint> = {
  mobile: {
    name: 'mobile',
    minWidth: 0,
    maxWidth: 767,
    dimensions: { width: 375, height: 667 }
  },
  tablet: {
    name: 'tablet',
    minWidth: 768,
    maxWidth: 1023,
    dimensions: { width: 768, height: 1024 }
  },
  desktop: {
    name: 'desktop',
    minWidth: 1024,
    maxWidth: 1439,
    dimensions: { width: 1440, height: 900 }
  },
  full: {
    name: 'full',
    minWidth: 0,
    maxWidth: Infinity,
    dimensions: { width: window.innerWidth, height: window.innerHeight }
  }
};

export const useViewportAsync = () => {
  const [isResizing, setIsResizing] = useState(false);
  const [currentDimensions, setCurrentDimensions] = useState<ViewportDimensions>({
    width: window.innerWidth,
    height: window.innerHeight
  });

  // Get store actions
  const { viewport, setViewport } = useViewportStore();

  /**
   * Get viewport breakpoint for current dimensions
   */
  const getViewportBreakpoint = useCallback((width: number): Viewport => {
    for (const breakpoint of Object.values(VIEWPORT_BREAKPOINTS)) {
      if (width >= breakpoint.minWidth && width <= breakpoint.maxWidth) {
        return breakpoint.name;
      }
    }
    return 'full'; // Fallback
  }, []);

  /**
   * Get dimensions for a specific viewport
   */
  const getViewportDimensions = useCallback((viewportType: Viewport): ViewportDimensions => {
    return VIEWPORT_BREAKPOINTS[viewportType].dimensions;
  }, []);

  /**
   * Set viewport with dimensions
   */
  const setViewportWithDimensions = useCallback((viewportType: Viewport) => {
    const dimensions = getViewportDimensions(viewportType);
    setCurrentDimensions(dimensions);
    setViewport(viewportType);
  }, [getViewportDimensions, setViewport]);

  /**
   * Auto-detect viewport based on current window size
   */
  const autoDetectViewport = useCallback(() => {
    const detectedViewport = getViewportBreakpoint(currentDimensions.width);
    if (detectedViewport !== viewport) {
      setViewport(detectedViewport);
    }
  }, [currentDimensions.width, viewport, getViewportBreakpoint, setViewport]);

  /**
   * Handle window resize
   */
  const handleResize = useCallback(() => {
    setIsResizing(true);
    
    const newDimensions = {
      width: window.innerWidth,
      height: window.innerHeight
    };
    
    setCurrentDimensions(newDimensions);
    
    // Auto-detect viewport if not manually set
    if (viewport !== 'full') {
      const detectedViewport = getViewportBreakpoint(newDimensions.width);
      if (detectedViewport !== viewport) {
        setViewport(detectedViewport);
      }
    }
    
    // Reset resizing state after a short delay
    setTimeout(() => { 
      setIsResizing(false); 
    }, 150);
  }, [viewport, getViewportBreakpoint, setViewport]);

  /**
   * Reset to full viewport
   */
  const resetToFull = useCallback(() => {
    setCurrentDimensions({
      width: window.innerWidth,
      height: window.innerHeight
    });
    setViewport('full');
  }, [setViewport]);

  /**
   * Get CSS for viewport simulation
   */
  const getViewportCSS = useCallback((viewportType: Viewport): React.CSSProperties => {
    if (viewportType === 'full') {
      return {
        width: '100%',
        height: '100%',
        maxWidth: 'none',
        maxHeight: 'none'
      };
    }

    const breakpoint = VIEWPORT_BREAKPOINTS[viewportType];
    return {
      width: `${breakpoint.dimensions.width}px`,
      height: `${breakpoint.dimensions.height}px`,
      maxWidth: `${breakpoint.dimensions.width}px`,
      maxHeight: `${breakpoint.dimensions.height}px`,
      margin: '0 auto',
      overflow: 'auto'
    };
  }, []);

  // Set up resize listener
  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => { 
      window.removeEventListener('resize', handleResize); 
    };
  }, [handleResize]);

  return {
    // State
    isResizing,
    currentDimensions,
    
    // Computed values
    currentBreakpoint: VIEWPORT_BREAKPOINTS[viewport],
    viewportCSS: getViewportCSS(viewport),
    
    // Actions
    setViewportWithDimensions,
    autoDetectViewport,
    resetToFull,
    getViewportDimensions,
    getViewportBreakpoint,
  };
};

/**
 * Hook for viewport persistence
 */
export const useViewportPersistence = () => {
  const { viewport } = useViewportStore();
  const { setViewportWithDimensions } = useViewportAsync();

  // Load saved viewport on mount
  useEffect(() => {
    const savedViewport = localStorage.getItem('devViewport') as Viewport | null;
    if (savedViewport && savedViewport !== viewport) {
      setViewportWithDimensions(savedViewport);
    }
  }, [viewport, setViewportWithDimensions]);

  return {
    currentViewport: viewport,
  };
};
