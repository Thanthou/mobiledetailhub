/**
 * Navigation utility functions
 */

/**
 * Smoothly scrolls to a section by its ID
 * @param sectionId - The ID of the section to scroll to (with or without #)
 */
export const scrollToSection = (sectionId: string): void => {
  const element = document.getElementById(sectionId.replace('#', ''));
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};

/**
 * Handles section click events with smooth scrolling
 * @param sectionId - The ID of the section to scroll to
 */
export const handleSectionClick = (sectionId: string): void => {
  scrollToSection(sectionId);
};
