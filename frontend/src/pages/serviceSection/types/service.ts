import type { ServiceData } from '../data/types';

export type CTAProps = {
  onBook?: () => void;
  onQuote?: () => void;
  onQuoteHover?: () => void;
  bookLabel?: string;
  quoteLabel?: string;
};

export type SectionProps = {
  id?: string;
  className?: string;
  serviceData?: ServiceData;
} & CTAProps;
