/**
 * Load industry defaults for tenant provisioning
 * 
 * These defaults are used ONLY during tenant signup to populate the database.
 * At runtime, the site loads content from the database (single source of truth).
 */

export type IndustrySlug = 
  | 'mobile-detailing'
  | 'lawncare'
  | 'maid-service'
  | 'pet-grooming';

export interface FAQItem {
  category: string;
  question: string;
  answer: string;
}

export interface ContentDefaults {
  hero: {
    h1: string;
    subTitle: string;
  };
  reviews: {
    title: string;
    subtitle: string;
  };
  faq: {
    title: string;
    subtitle: string;
  };
}

export interface SEODefaults {
  title: string;
  description: string;
  keywords: string;
  ogImage: string;
  twitterImage: string;
  canonicalPath: string;
  robots: string;
}

export interface IndustryDefaults {
  content: ContentDefaults;
  seo: SEODefaults;
  faqItems: FAQItem[];
}

/**
 * Load FAQ items for an industry from all category files
 * 
 * @param industry - Industry identifier
 * @returns Array of FAQ items from all categories
 */
async function loadFAQItems(industry: IndustrySlug): Promise<FAQItem[]> {
  const categories = [
    'general',
    'services',
    'pricing',
    'scheduling',
    'locations',
    'preparation',
    'payments',
    'warranty',
    'aftercare',
  ];
  
  const faqArrays = await Promise.all(
    categories.map(async (category) => {
      try {
        const module = await import(`@/data/${industry}/faq/${category}.json`) as { default: FAQItem[] };
        return module.default;
      } catch {
        // Category file might not exist for all industries
        return [];
      }
    })
  );
  
  // Flatten all categories into a single array (no IDs needed for database storage)
  return faqArrays.flat();
}

/**
 * Load all defaults for an industry (content + SEO + FAQ items)
 * 
 * Used ONLY during tenant signup to populate website.content table.
 * Not used at runtime - DB is the single source of truth.
 * 
 * @param industry - Industry identifier
 * @returns All defaults for database provisioning
 */
export async function loadDefaults(
  industry: IndustrySlug
): Promise<IndustryDefaults> {
  try {
    const [contentModule, seoModule, faqItems] = await Promise.all([
      import(`@/data/${industry}/content-defaults.json`) as Promise<{ default: ContentDefaults }>,
      import(`@/data/${industry}/seo-defaults.json`) as Promise<{ default: SEODefaults }>,
      loadFAQItems(industry)
    ]);
    
    return {
      content: contentModule.default,
      seo: seoModule.default,
      faqItems
    };
  } catch (error) {
    console.error(`Failed to load defaults for ${industry}:`, error);
    throw new Error(`Defaults not found for industry: ${industry}`);
  }
}

