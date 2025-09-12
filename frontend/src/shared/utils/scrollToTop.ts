/**
 * Utility function to scroll to the top of the page
 * Useful for ensuring users land at the top after navigation
 */
export const scrollToTop = (): void => {
  // Smooth scroll to top for better UX
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: 'smooth'
  });
};

/**
 * Utility function to scroll to top immediately without animation
 * Useful for cases where smooth scrolling might interfere with page loading
 */
export const scrollToTopImmediate = (): void => {
  window.scrollTo(0, 0);
};
