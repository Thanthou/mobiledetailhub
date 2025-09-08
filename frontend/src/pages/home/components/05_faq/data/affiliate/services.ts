import type { FAQItem } from '../../types';

// Configuration interface for affiliate data
interface AffiliateConfig {
  business?: {
    city?: string;
    locality?: string;
    state?: string;
    region?: string;
    zip?: string;
    postalCode?: string;
    address?: string;
  };
  serviceLocations?: string[];
}

// Geo parts interface
interface GeoParts {
  city: string;
  state: string;
  zip: string;
  address: string;
  primaryArea: string;
  nearbyList: string;
  cityState: string;
}

// Helper function for geo parts
function getGeoParts(cfg: AffiliateConfig): GeoParts {
  const business = cfg.business ?? {};
  const serviceLocations: string[] = cfg.serviceLocations ?? [];

  const city = business.city || business.locality || "Your City";
  const state = business.state || business.region || "Your State";
  const zip = business.zip || business.postalCode || '';
  const address = business.address || `${city}, ${state}${zip ? ' ' + zip : ''}`;

  const primaryArea = address;
  const nearbyList = serviceLocations.length > 0
    ? serviceLocations.slice(0, 7).join(", ")
    : `${city}, ${state}`;

  const cityState = `${city}, ${state}`;

  return { city, state, zip, address, primaryArea, nearbyList, cityState };
}

export const AFFILIATE_FAQ_SERVICES = (cfg: AffiliateConfig): FAQItem[] => {
  const { city, state, cityState } = getGeoParts(cfg);
  return [
    {
      category: "Services",
      question: `What mobile detailing services do you offer in ${cityState}?`,
      answer:
        `We provide full-service mobile car detailing in ${cityState} — exterior wash, decon (iron/tar/clay), paint-safe drying, wheel & tire cleaning, interior vacuuming and crevice work, interior glass, and protectants. Add-ons include one-step & multi-step machine polishing, ceramic coating, headlight restoration, odor removal, and paint protection film (PPF).`,
    },
    {
      category: "Services",
      question: `Do you offer ceramic coating in ${city}, ${state}?`,
      answer:
        `Yes — professional-grade ceramic coatings that enhance gloss, resist chemicals, and make maintenance washes faster. We prep the paint properly (wash, decon, optional correction) and offer durability packages from ~1–5+ years with care guides tailored to ${cityState}.`,
    },
    {
      category: "Services",
      question: `Do you install Paint Protection Film (PPF) near ${cityState}?`,
      answer:
        `We install self-healing urethane PPF on high-impact areas (front bumper, hood, fenders, mirrors) or full panels. PPF helps prevent rock chips and road rash on ${city} highways and local roads, and can be combined with a ceramic top coat for easier cleaning.`,
    },
    {
      category: "Services",
      question: `Do you detail boats and RVs in ${cityState}?`,
      answer:
        `Yes — marine & RV detailing including wash, oxidation removal, machine polish, and long-term protection (gelcoat-safe sealants, coatings). We tailor workflow to large surfaces, seams, and ladders common to RVs and watercraft in ${cityState}.`,
    },
    {
      category: "Services",
      question: `Is your process safe for modern paint, interior leather, and touchscreens?`,
      answer:
        `Absolutely. We use pH-appropriate soaps, contact wash with premium mitts, microfiber drying, measured machine polishing, leather-safe cleaners/conditioners, and screen-safe interior products recommended for today's OEM finishes.`,
    },
  ];
};