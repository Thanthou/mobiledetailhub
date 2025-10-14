import { useEffect, useState } from 'react';

/**
 * Responsive breakpoints matching Tailwind's default configuration
 */
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

/**
 * Hook for responsive media queries
 * @param query - Media query string (e.g., '(min-width: 768px)')
 * @returns boolean indicating if the media query matches
 * 
 * @example
 * const isDesktop = useMediaQuery('(min-width: 768px)');
 * const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');
 */
export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState<boolean>(() => {
    // SSR-safe initialization
    if (typeof window === 'undefined') return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia(query);
    
    // Update state if initial value differs from current
    if (mediaQuery.matches !== matches) {
      setMatches(mediaQuery.matches);
    }

    // Event handler for media query changes
    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Modern browsers support addEventListener
    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [query, matches]);

  return matches;
};

/**
 * Hook to detect if viewport is mobile size (< 768px)
 * @returns boolean indicating if viewport is mobile
 * 
 * @example
 * const isMobile = useIsMobile();
 * return isMobile ? <MobileMenu /> : <DesktopMenu />;
 */
export const useIsMobile = (): boolean => {
  return useMediaQuery(`(max-width: ${BREAKPOINTS.md - 1}px)`);
};

/**
 * Hook to detect if viewport is tablet size (>= 768px and < 1024px)
 * @returns boolean indicating if viewport is tablet
 * 
 * @example
 * const isTablet = useIsTablet();
 */
export const useIsTablet = (): boolean => {
  const isAboveMobile = useMediaQuery(`(min-width: ${BREAKPOINTS.md}px)`);
  const isBelowDesktop = useMediaQuery(`(max-width: ${BREAKPOINTS.lg - 1}px)`);
  return isAboveMobile && isBelowDesktop;
};

/**
 * Hook to detect if viewport is desktop size (>= 768px)
 * @returns boolean indicating if viewport is desktop
 * 
 * @example
 * const isDesktop = useIsDesktop();
 */
export const useIsDesktop = (): boolean => {
  return useMediaQuery(`(min-width: ${BREAKPOINTS.md}px)`);
};

/**
 * Hook to detect if viewport is large desktop size (>= 1024px)
 * @returns boolean indicating if viewport is large desktop
 * 
 * @example
 * const isLargeDesktop = useIsLargeDesktop();
 */
export const useIsLargeDesktop = (): boolean => {
  return useMediaQuery(`(min-width: ${BREAKPOINTS.lg}px)`);
};

/**
 * Hook that returns current breakpoint name
 * @returns Current breakpoint ('sm' | 'md' | 'lg' | 'xl' | '2xl')
 * 
 * @example
 * const breakpoint = useBreakpoint();
 * if (breakpoint === 'sm') { ... }
 */
export const useBreakpoint = (): keyof typeof BREAKPOINTS => {
  const is2xl = useMediaQuery(`(min-width: ${BREAKPOINTS['2xl']}px)`);
  const isXl = useMediaQuery(`(min-width: ${BREAKPOINTS.xl}px)`);
  const isLg = useMediaQuery(`(min-width: ${BREAKPOINTS.lg}px)`);
  const isMd = useMediaQuery(`(min-width: ${BREAKPOINTS.md}px)`);

  if (is2xl) return '2xl';
  if (isXl) return 'xl';
  if (isLg) return 'lg';
  if (isMd) return 'md';
  return 'sm';
};

