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
}

/**
 * Load all defaults for an industry (content + SEO)
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
    const [contentModule, seoModule] = await Promise.all([
      import(`@/data/${industry}/content-defaults.json`) as Promise<{ default: ContentDefaults }>,
      import(`@/data/${industry}/seo-defaults.json`) as Promise<{ default: SEODefaults }>
    ]);
    
    return {
      content: contentModule.default,
      seo: seoModule.default
    };
  } catch (error) {
    console.error(`Failed to load defaults for ${industry}:`, error);
    throw new Error(`Defaults not found for industry: ${industry}`);
  }
}

