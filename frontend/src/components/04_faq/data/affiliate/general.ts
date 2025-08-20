import { FAQItem } from '../../types';

// Helper function for geo parts
function getGeoParts(cfg: any) {
  const business = cfg?.business ?? {};
  const city = business.city || business.locality || "Your City";
  const state = business.state || business.region || "Your State";
  const cityState = `${city}, ${state}`;
  return { cityState };
}

export const AFFILIATE_FAQ_GENERAL = (cfg: any): FAQItem[] => {
  const { cityState } = getGeoParts(cfg);
  return [
    {
      category: "General",
      question: `Why choose a mobile detailer in ${cityState}?`,
      answer:
        `We come to you — save time vs. shop drop-offs. You get pro results with transparent pricing and vetted techs familiar with ${cityState} weather and road conditions.`,
    },
    {
      category: "General",
      question: "How long does a typical appointment take?",
      answer:
        "Standard details take ~2–4 hours; machine polishing/coatings can take 4–8+ hours. PPF install time varies by coverage. We'll estimate the window during booking.",
    },
  ];
};