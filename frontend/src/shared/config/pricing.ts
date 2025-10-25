/**
 * Centralized Pricing Configuration
 * 
 * Single source of truth for all pricing plans across the application.
 * Update prices here and they'll reflect everywhere: signup, homepage, pricing page.
 */

export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  interval: 'month' | 'year';
  description: string;
  features: string[];
  popular?: boolean;
  cta?: string;
}

/**
 * Current pricing plans (as of Oct 2024)
 * Prices in USD
 * 
 * Philosophy:
 * - Starter: Get online fast (credible presence + visibility) - 0 location pages
 * - Metro: Turn site into lead-generation tool - 6 location pages (cap: 10, +$3 each)
 * - Pro: Automate operations & marketing follow-ups - 15 location pages (cap: 25, +$3 each or +$10/mo unlimited within cap)
 * 
 * Location Page Add-ons:
 * - Metro: +$3 per additional page (max 10 total)
 * - Pro: +$3 per page OR +$10/mo for up to 25 pages
 */
export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: 15,
    interval: 'month',
    description: 'Get online fast and look professional',
    features: [
      'Instant launch on subdomain',
      'Mobile-optimized design',
      '6 pre-built service pages',
      'Automatic SEO metadata & sitemap',
      'Google Review sync (showcase)',
      'Analytics basics (visits, devices)',
      'Website health monitor',
      'Email support',
    ],
    cta: 'Get Started',
  },
  {
    id: 'metro',
    name: 'Metro',
    price: 25,
    interval: 'month',
    description: 'Turn your website into a sales assistant',
    popular: true,
    features: [
      'Everything in Starter',
      'Custom domain + SSL',
      'Professional email addresses',
      '6 location pages',
      'Semi-automated location content',
      'Instant quote text alerts',
      'Contact form → CRM bridge',
      'Basic booking form',
      'Priority support (chat + email)',
    ],
    cta: 'Get Started',
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 35,
    interval: 'month',
    description: 'Automate your marketing and follow-ups',
    features: [
      'Everything in Metro',
      '15 location pages',
      'Full AI-powered location generation',
      'Full booking & payment system',
      'Client dashboard (history, invoices)',
      'Smart completion texts (auto thank-you)',
      'AI business insights dashboard',
      'Advanced analytics & trends',
      'Phone support + dedicated onboarding',
    ],
    cta: 'Get Started',
  },
];

/**
 * Get a specific plan by ID
 */
export function getPlanById(id: string): PricingPlan | undefined {
  return PRICING_PLANS.find(plan => plan.id === id);
}

/**
 * Get the popular/recommended plan
 */
export function getPopularPlan(): PricingPlan | undefined {
  return PRICING_PLANS.find(plan => plan.popular);
}

/**
 * Format price for display
 */
export function formatPrice(price: number, interval: 'month' | 'year' = 'month'): string {
  return `$${price}/${interval}`;
}

