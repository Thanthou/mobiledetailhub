import type { FAQItem } from '../../types';

// Helper function for geo parts
function getGeoParts(cfg: unknown) {
  const config = cfg as {
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
  };
  const business = config.business ?? {};
  const serviceLocations: string[] = config.serviceLocations ?? [];

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

export const AFFILIATE_FAQ_LOCATIONS = (cfg: unknown): FAQItem[] => {
  const { primaryArea, nearbyList, cityState } = getGeoParts(cfg);
  return [
    {
      category: "Locations",
      question: `Which areas do you service around ${cityState}?`,
      answer:
        `We're fully mobile in ${primaryArea} and nearby communities (${nearbyList}). Enter your address during booking to confirm availability and any travel fees beyond the standard radius.`,
    },
    {
      category: "Locations",
      question: `Can you detail at my home, apartment, or workplace?`,
      answer:
        `Yes — driveway, garage, or office parking lots are ideal as long as property rules allow mobile services and there's safe access to the vehicle. For apartments/gated communities, please confirm access with management.`,
    },
    {
      category: "Locations",
      question: `Do you bring water and power?`,
      answer:
        `Most jobs are self-contained. If we'll need on-site water or power for a specialty service, we'll flag that before your appointment.`,
    },
  ];
};