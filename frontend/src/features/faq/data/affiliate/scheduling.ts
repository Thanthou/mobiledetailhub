import type { FAQItem } from '../../types';

// Type definitions for configuration
interface BusinessConfig {
  city?: string;
  locality?: string;
  state?: string;
  region?: string;
}

interface AffiliateConfig {
  business?: BusinessConfig;
}

// Helper function for geo parts
function getGeoParts(cfg: AffiliateConfig): { city: string; state: string } {
  const business = cfg.business ?? {};
  const city = business.city || business.locality || "Your City";
  const state = business.state || business.region || "Your State";
  return { city, state };
}

export const AFFILIATE_FAQ_SCHEDULING = (cfg: AffiliateConfig): FAQItem[] => {
  const { city, state } = getGeoParts(cfg);
  return [
    {
      category: "Scheduling & Weather",
      question: `How do I book a mobile detail in ${city}, ${state}?`,
      answer:
        `Book 24/7 online — pick your vehicle, services, and a time that fits your schedule. You'll receive confirmation and day-of updates so you know exactly when we're en route.`,
    },
    {
      category: "Scheduling & Weather",
      question: `What if it's raining or too hot on my appointment day?`,
      answer:
        `We monitor local weather in ${city}, ${state}. For rain, we may reschedule or work under cover; for extreme heat or cold, we may adjust timing or postpone coatings/correction to protect results. We'll coordinate the best option with you.`,
    },
    {
      category: "Scheduling & Weather",
      question: `Do you offer weekend or evening appointments?`,
      answer:
        `Yes — limited weekend and evening slots are available. The calendar shows current openings for ${city}, ${state}.`,
    },
  ];
};