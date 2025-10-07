// FAQ Types based on legacy structure
export type FAQCategory =
  | "General"
  | "Services"
  | "Scheduling"
  | "Pricing"
  | "Preparation"
  | "Aftercare"
  | "RV"
  | "Marine"
  | "Locations"
  | "Payments"
  | "Warranty"
  | "Location Specific";

export type ServiceTag =
  | "Auto"
  | "Marine"
  | "RV"
  | "Motorcycle"
  | "Paint Correction"
  | "Ceramic Coating"
  | "Paint Protection Film"
  | "Odor Removal";

export interface FAQItem {
  id?: string; // for analytics and A/B testing
  question: string;
  answer: string;
  category: FAQCategory;
  services?: ServiceTag[];
}

export interface FAQCategoryData {
  id: string;
  title: FAQCategory;
  icon: React.ComponentType<any>;
  questions: FAQItem[];
}

export interface FAQItemWithIndex extends FAQItem {
  originalIndex: number;
}

export interface FAQProps {
  autoExpand?: boolean;
  customFAQs?: Array<{ id?: string; q: string; a: string }>;
  customFAQIntro?: string;
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
