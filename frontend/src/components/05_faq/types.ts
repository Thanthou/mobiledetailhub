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
  /** Optional UX toggle — defaults to false for better engagement/SEO */
  autoCollapseOnScroll?: boolean;
}

export interface FAQRef {
  expand: () => void;
}