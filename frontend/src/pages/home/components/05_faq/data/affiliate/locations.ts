import type { FAQItem } from '../../types';
import { getGeoParts } from '../../utils/geoHelpers';

interface GeoConfig {
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

export const AFFILIATE_FAQ_LOCATIONS = (cfg: GeoConfig): FAQItem[] => {
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