/**
 * Advanced scroll restoration utilities for React Router v7 compatibility
 * and enhanced user experience
 */

interface ScrollPosition {
  x: number;
  y: number;
}

class ScrollRestorationManager {
  private scrollPositions = new Map<string, ScrollPosition>();
  private isRestoring = false;

  /**
   * Save scroll position for a specific route
   */
  saveScrollPosition(pathname: string): void {
    if (this.isRestoring) return;
    
    this.scrollPositions.set(pathname, {
      x: window.scrollX,
      y: window.scrollY
    });
  }

  /**
   * Restore scroll position for a specific route
   */
  restoreScrollPosition(pathname: string): void {
    const position = this.scrollPositions.get(pathname);
    
    if (position) {
      this.isRestoring = true;
      window.scrollTo({
        left: position.x,
        top: position.y,
        behavior: 'auto'
      });
      
      // Reset flag after a short delay to allow scroll to complete
      setTimeout(() => {
        this.isRestoring = false;
      }, 100);
    } else {
      // No saved position, scroll to top
      this.scrollToTop();
    }
  }

  /**
   * Scroll to top of the page
   */
  scrollToTop(): void {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }

  /**
   * Clear all saved scroll positions
   */
  clearScrollPositions(): void {
    this.scrollPositions.clear();
  }

  /**
   * Get current scroll position
   */
  getCurrentScrollPosition(): ScrollPosition {
    return {
      x: window.scrollX,
      y: window.scrollY
    };
  }
}

// Export singleton instance
export const scrollRestoration = new ScrollRestorationManager();

/**
 * Hook for manual scroll restoration control
 */
export const useScrollRestoration = () => {
  return {
    savePosition: (pathname: string) => scrollRestoration.saveScrollPosition(pathname),
    restorePosition: (pathname: string) => scrollRestoration.restoreScrollPosition(pathname),
    scrollToTop: () => scrollRestoration.scrollToTop(),
    clearPositions: () => scrollRestoration.clearScrollPositions()
  };
};
