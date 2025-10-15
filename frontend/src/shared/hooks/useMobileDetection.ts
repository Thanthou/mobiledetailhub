import { useEffect, useState } from 'react';

/**
 * Hook to detect if the user is on a mobile device
 * Returns true for phones and small tablets, false for desktop/large tablets
 */
export function useMobileDetection(): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      // Check user agent for mobile indicators
      const userAgent = navigator.userAgent.toLowerCase();
      const isMobileUA = /android|webos|iphone|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
      
      // Check screen size - consider devices with width <= 768px as mobile
      const isSmallScreen = window.innerWidth <= 768;
      
      // Check if device has touch capability (but not desktop with touch)
      const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      
      // Mobile if: (mobile user agent AND small screen) OR (small screen AND touch)
      const mobile = (isMobileUA && isSmallScreen) || (isSmallScreen && hasTouch && window.innerWidth <= 1024);
      
      setIsMobile(mobile);
    };

    // Check on mount
    checkMobile();

    // Check on resize (in case of orientation change)
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  return isMobile;
}
