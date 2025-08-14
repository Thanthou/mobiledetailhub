/**
 * Scroll Utilities
 * Provides smooth scrolling functionality to different sections of the page
 */

/**
 * Scrolls to the top of the page
 */
export function scrollToTop(): void {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Scrolls to the bottom of the page
 */
export function scrollToBottom(): void {
  window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
}

/**
 * Scrolls to a specific element by ID
 * @param elementId - The ID of the element to scroll to
 */
export function scrollToElement(elementId: string): void {
  const element = document.getElementById(elementId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
}

/**
 * Scrolls to the services section
 */
export function scrollToServices(): void {
  const element = document.getElementById('services');
  if (element) {
    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
    const offset = 50; // Add 50px offset to scroll down further
    window.scrollTo({ 
      top: elementPosition + offset, 
      behavior: 'smooth' 
    });
  }
}

/**
 * Scrolls to the contact section
 */
export function scrollToContact(): void {
  scrollToElement('contact');
}

/**
 * Scrolls to the FAQ section and sets URL hash
 */
export function scrollToFAQ(): void {
  // Set URL hash to trigger FAQ expansion
  window.location.hash = 'faq';
  scrollToElement('faq');
  
  // Small delay to ensure FAQ component detects the hash change
  setTimeout(() => {
    // Trigger a custom event that the FAQ component can listen for
    window.dispatchEvent(new CustomEvent('faq-navigation'));
  }, 100);
}

/**
 * Scrolls to the affiliates section
 */
export function scrollToAffiliates(): void {
  scrollToElement('affiliates');
}
