import { FAQItem } from '../../types';

// Helper function for geo parts
function getGeoParts(cfg: any) {
  const business = cfg?.business ?? {};
  const city = business.city || business.locality || "Your City";
  const state = business.state || business.region || "Your State";
  const cityState = `${city}, ${state}`;
  return { city, state, cityState };
}

export const AFFILIATE_FAQ_PRICING = (cfg: any): FAQItem[] => {
  const { cityState } = getGeoParts(cfg);
  return [
    {
      category: "Pricing & Quotes",
      question: `How much does mobile detailing cost in ${cityState}?`,
      answer:
        `Pricing depends on vehicle size, condition, and selected services. Basic interior or exterior details typically start around $100–$160, full details $180–$320+, machine polishing from $200+, ceramic coating from ~$500+, and PPF is quoted by coverage. You'll see a clear estimate during online booking.`,
    },
    {
      category: "Pricing & Quotes",
      question: `Can I get an instant quote online?`,
      answer:
        `Yes. Choose vehicle type, services, and your ${cityState} location to see an instant estimate or connect for a custom quote if your project needs inspection (heavy pet hair, stains, correction, PPF templates).`,
    },
    {
      category: "Pricing & Quotes",
      question: `Do you have bundled packages or promotions?`,
      answer:
        `We offer bundles (interior + exterior, add headlight restoration or odor removal) and seasonal promos for ${cityState}. Check the booking flow or ask for current deals.`,
    },
  ];
};