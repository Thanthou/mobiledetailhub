import { useEffect, useState, RefObject } from 'react';

export function useScrollSpy(
  sectionIds: string[], 
  scrollContainerRef?: RefObject<HTMLElement>,
  offset: number = 100
) {
  const [activeSection, setActiveSection] = useState<string>('top');

  useEffect(() => {
    const scrollContainer = scrollContainerRef?.current;
    const targetElement = scrollContainer || window;

    const handleScroll = () => {
      // Get scroll position from container or window
      const scrollPosition = scrollContainer 
        ? scrollContainer.scrollTop
        : window.scrollY;

      // Find which section is currently in view
      let foundSection = sectionIds[0]; // Default to first section
      
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const section = document.getElementById(sectionIds[i]);
        if (section) {
          const sectionTop = scrollContainer
            ? section.offsetTop - scrollContainer.offsetTop
            : section.offsetTop;
          
          // Check if we've scrolled past the top of this section
          // Using a small threshold for snap scrolling
          if (scrollPosition >= sectionTop - 50) {
            foundSection = sectionIds[i];
            break;
          }
        }
      }
      
      setActiveSection(foundSection);
    };

    // Initial check
    handleScroll();

    // Listen to scroll events
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
      return () => scrollContainer.removeEventListener('scroll', handleScroll);
    } else {
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [sectionIds, offset, scrollContainerRef]);

  return activeSection;
}

