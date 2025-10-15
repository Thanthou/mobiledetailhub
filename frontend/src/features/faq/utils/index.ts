/**
 * FAQ Data Loader
 * 
 * Dynamically loads FAQ data from industry-specific JSON files.
 * This allows each industry to have its own FAQ content.
 */

import type { FAQItem } from '../types';

/**
 * Load all FAQ categories for a specific industry
 * 
 * @param industry - Industry slug (e.g., 'mobile-detailing')
 * @returns Array of FAQ items with unique IDs
 */
export async function loadIndustryFAQs(industry: string): Promise<FAQItem[]> {
  const categories = [
    'services',
    'pricing',
    'scheduling',
    'locations',
    'preparation',
    'payments',
    'warranty',
    'aftercare',
    'general',
  ];
  
  try {
    const faqArrays = await Promise.all(
      categories.map(async (category) => {
        try {
          const module = await import(`@/data/${industry}/faq/${category}.json`) as { default: FAQItem[] };
          return module.default;
        } catch (error) {
          console.warn(`FAQ category ${category} not found for ${industry}, skipping`);
          return [];
        }
      })
    );
    
    // Flatten and add unique IDs
    const allFAQs = faqArrays.flat();
    return allFAQs.map((faq, index) => ({
      ...faq,
      id: `${industry}-${String(index)}`
    }));
  } catch (error) {
    console.error(`Failed to load FAQs for ${industry}:`, error);
    return [];
  }
}
