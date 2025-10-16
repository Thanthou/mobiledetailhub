/**
 * Section Async Operations Hook
 * Handles all async operations for section functionality
 * Separated from Zustand store to maintain clean separation of concerns
 */

import { useCallback, useEffect, useRef,useState } from 'react';

import { type SectionId,useSectionStore } from '../state/sectionStore';

export interface SectionIntersectionOptions {
  rootMargin?: string;
  threshold?: number | number[];
  root?: Element | null;
}

export interface SectionScrollOptions {
  behavior?: ScrollBehavior;
  block?: ScrollLogicalPosition;
  inline?: ScrollLogicalPosition;
}

export const useSectionAsync = () => {
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isIntersecting, setIsIntersecting] = useState(false);
  
  const scrollTimeoutRef = useRef<number | null>(null);
  const intersectionObserverRef = useRef<IntersectionObserver | null>(null);

  // Get store actions
  const { current, setCurrent } = useSectionStore();

  /**
   * Scroll to a specific section
   */
  const scrollToSection = useCallback((
    sectionId: SectionId, 
    options: SectionScrollOptions = {}
  ): void => {
    const element = document.getElementById(sectionId);
    if (!element) {
      console.warn(`Section with id "${sectionId}" not found`);
      return;
    }

    setIsScrolling(true);
    
    try {
      element.scrollIntoView({
        behavior: options.behavior || 'smooth',
        block: options.block || 'start',
        inline: options.inline || 'nearest'
      });

      // Update current section after scroll
      setCurrent(sectionId);
      
    } catch (error) {
      console.error('Error scrolling to section:', error);
    } finally {
      // Reset scrolling state after a delay
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      scrollTimeoutRef.current = window.setTimeout(() => {
        setIsScrolling(false);
      }, 500);
    }
  }, [setCurrent]);

  /**
   * Scroll to next section
   */
  const scrollToNext = useCallback((): void => {
    const sections: SectionId[] = ['top', 'services', 'reviews', 'faq', 'gallery', 'footer'];
    const currentIndex = sections.indexOf(current || 'top');
    
    if (currentIndex < sections.length - 1) {
      const nextSection = sections[currentIndex + 1];
      if (nextSection) {
        scrollToSection(nextSection);
      }
    }
  }, [current, scrollToSection]);

  /**
   * Scroll to previous section
   */
  const scrollToPrevious = useCallback((): void => {
    const sections: SectionId[] = ['top', 'services', 'reviews', 'faq', 'gallery', 'footer'];
    const currentIndex = sections.indexOf(current || 'top');
    
    if (currentIndex > 0) {
      const prevSection = sections[currentIndex - 1];
      if (prevSection) {
        scrollToSection(prevSection);
      }
    }
  }, [current, scrollToSection]);

  /**
   * Set up intersection observer for automatic section detection
   */
  const setupIntersectionObserver = useCallback((
    options: SectionIntersectionOptions = {}
  ) => {
    // Clean up existing observer
    if (intersectionObserverRef.current) {
      intersectionObserverRef.current.disconnect();
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.id as SectionId;
            setCurrent(sectionId);
            setIsIntersecting(true);
          } else {
            setIsIntersecting(false);
          }
        });
      },
      {
        rootMargin: options.rootMargin || '-20% 0px -20% 0px',
        threshold: options.threshold || 0.1,
        root: options.root || null,
      }
    );

    intersectionObserverRef.current = observer;

    // Observe all section elements
    const sections: SectionId[] = ['top', 'services', 'reviews', 'faq', 'gallery', 'footer'];
    sections.forEach((sectionId) => {
      const element = document.getElementById(sectionId);
      if (element) {
        observer.observe(element);
      }
    });

    return observer;
  }, [setCurrent]);

  /**
   * Calculate scroll progress for current section
   */
  const calculateScrollProgress = useCallback(() => {
    if (!current) return 0;

    const element = document.getElementById(current);
    if (!element) return 0;

    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const elementHeight = rect.height;
    
    // Calculate progress based on how much of the element is visible
    const visibleTop = Math.max(0, -rect.top);
    const visibleBottom = Math.min(elementHeight, windowHeight - rect.top);
    const visibleHeight = Math.max(0, visibleBottom - visibleTop);
    
    return Math.min(1, Math.max(0, visibleHeight / elementHeight));
  }, [current]);

  /**
   * Handle scroll events
   */
  const handleScroll = useCallback(() => {
    const progress = calculateScrollProgress();
    setScrollProgress(progress);
  }, [calculateScrollProgress]);

  /**
   * Get section navigation data
   */
  const getSectionNavigation = useCallback(() => {
    const sections: SectionId[] = ['top', 'services', 'reviews', 'faq', 'gallery', 'footer'];
    const currentIndex = sections.indexOf(current || 'top');
    
    return {
      currentIndex,
      totalSections: sections.length,
      hasNext: currentIndex < sections.length - 1,
      hasPrevious: currentIndex > 0,
      nextSection: currentIndex < sections.length - 1 ? sections[currentIndex + 1] : null,
      previousSection: currentIndex > 0 ? sections[currentIndex - 1] : null,
    };
  }, [current]);

  // Set up scroll listener
  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => { 
      window.removeEventListener('scroll', handleScroll); 
    };
  }, [handleScroll]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intersectionObserverRef.current) {
        intersectionObserverRef.current.disconnect();
      }
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  return {
    // State
    isScrolling,
    scrollProgress,
    isIntersecting,
    
    // Computed values
    navigation: getSectionNavigation(),
    
    // Actions
    scrollToSection,
    scrollToNext,
    scrollToPrevious,
    setupIntersectionObserver,
    calculateScrollProgress,
  };
};

/**
 * Hook for section persistence
 */
export const useSectionPersistence = () => {
  const { current } = useSectionStore();
  const { setupIntersectionObserver } = useSectionAsync();

  // Set up intersection observer on mount
  useEffect(() => {
    const observer = setupIntersectionObserver();
    return () => { 
      observer.disconnect(); 
    };
  }, [setupIntersectionObserver]);

  return {
    currentSection: current,
  };
};
