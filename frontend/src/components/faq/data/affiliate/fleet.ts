import { FAQItem } from '../../types';

// Helper function for geo parts
function getGeoParts(cfg: any) {
  const business = cfg?.business ?? {};
  const city = business.city || business.locality || "Your City";
  const state = business.state || business.region || "Your State";
  const cityState = `${city}, ${state}`;
  return { cityState };
}

export const AFFILIATE_FAQ_FLEET = (cfg: any): FAQItem[] => {
  const { cityState } = getGeoParts(cfg);
  return [
    {
      category: "Fleet & Commercial",
      question: `Do you service fleets in ${cityState}?`,
      answer:
        `Yes — on-site fleet washing and detailing for cars, vans, and light trucks. We offer recurring schedules, consolidated billing, and consistent standards across vehicles.`,
    },
    {
      category: "Fleet & Commercial",
      question: "Can you support dealerships or commercial accounts?",
      answer:
        "Absolutely. We coordinate multi-vehicle days, add paint correction or coatings for showcase units, and align hours to reduce downtime.",
    },
  ];
};