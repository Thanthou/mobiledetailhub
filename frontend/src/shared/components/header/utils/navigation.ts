/**
 * Navigation utility functions
 */

/**
 * Smoothly scrolls to a section by its ID
 * @param sectionId - The ID of the section to scroll to (with or without #)
 */
export const scrollToSection = (sectionId: string): void => {
  const cleanId = sectionId.replace('#', '');
  // NOTE: Using inline window.innerWidth check here is intentional
  // This is a utility function (not a React component), so hooks can't be used
  // We need the current viewport width at the time this function is called
  const isDesktop = window.innerWidth >= 768;
  
  // Map nav ID to actual section ID based on screen size
  let targetId = cleanId;
  if (cleanId === 'services') {
    targetId = isDesktop ? 'services-desktop' : 'services';
  } else if (cleanId === 'footer') {
    targetId = isDesktop ? 'gallery-desktop' : 'footer';
  }
  
  const element = document.getElementById(targetId);
  
  if (element) {
    // Temporarily disable snap scrolling for smooth navigation
    const scrollContainer = document.querySelector('.snap-container');
    
    if (scrollContainer) {
      scrollContainer.classList.remove('snap-y', 'snap-mandatory');
      
      element.scrollIntoView({ behavior: 'smooth' });
      
      // Re-enable snap scrolling after a delay
      setTimeout(() => {
        scrollContainer.classList.add('snap-y', 'snap-mandatory');
      }, 1000);
    } else {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
};

/**
 * Handles section click events with smooth scrolling
 * @param sectionId - The ID of the section to scroll to
 */
export const handleSectionClick = (sectionId: string): void => {
  scrollToSection(sectionId);
};
