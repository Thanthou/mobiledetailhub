// FAQ Types
export type FAQCategory =
  | "Services"
  | "Pricing & Quotes"
  | "Scheduling & Weather"
  | "Locations"
  | "Preparation"
  | "Payments & Deposits"
  | "Warranty & Guarantee"
  | "Aftercare & Maintenance"
  | "Fleet & Commercial"
  | "General";

export type ServiceTag =
  | "Auto"
  | "Marine"
  | "RV"
  | "Motorcycle"
  | "Ceramic Coating"
  | "PPF"
  | "Headlight Restore"
  | "Odor Removal";

export interface FAQItem {
  question: string;
  answer: string;
  category: FAQCategory;
  services?: ServiceTag[];
}

export interface FAQItemWithIndex extends FAQItem {
  originalIndex: number;
}

export interface FAQProps {
  autoExpand?: boolean;
}

export interface FAQRef {
  expand: () => void;
}

export interface GeoConfig {
  business?: {
    city?: string;
    locality?: string;
    state?: string;
    region?: string;
  };
}

export interface GroupedFAQs {
  [category: string]: FAQItem[];
}

export interface FAQState {
  openItems: Set<string>;
  toggleItem: (id: string) => void;
  resetState: () => void;
}

export interface FAQEffects {
  faqData: FAQItem[];
  isExpanded: boolean;
  resetState: () => void;
  setIsExpanded: (expanded: boolean) => void;
}
