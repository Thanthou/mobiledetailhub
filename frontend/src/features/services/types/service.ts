export type ServiceType = 
  | 'auto-detailing'
  | 'ceramic-coating'
  | 'paint-correction'
  | 'paint-protection-film'
  | 'boat-detailing'
  | 'rv-detailing';

// Service tier interface for pricing
export interface ServiceTier {
  id: string;
  name: string;
  price: string;
  description: string;
  popular: boolean;
  features: string[];
}

// Service FAQ item interface
export interface ServiceFAQItem {
  id: number;
  question: string;
  answer: string;
}

// Service gallery image interface
export interface ServiceGalleryImage {
  id: string;
  src: string;
  alt: string;
  caption?: string;
}

// Service overview interface
export interface ServiceOverview {
  title: string;
  content: string;
  benefits: string[];
  features: string[];
}

// Service gallery interface
export interface ServiceGallery {
  title: string;
  images: ServiceGalleryImage[];
}

// Service FAQ interface
export interface ServiceFAQ {
  title: string;
  questions: ServiceFAQItem[];
}

// Service pricing interface
export interface ServicePricing {
  title: string;
  tiers: ServiceTier[];
  note?: string;
}

export interface ServiceData {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  heroImage: string;
  overview: ServiceOverview;
  gallery: ServiceGallery;
  faq: ServiceFAQ;
  pricing: ServicePricing;
  whatItIs: {
    description: string;
    benefits: string[];
    image?: string;
    chart?: {
      type: 'protection-comparison';
      title?: string;
    };
  };
  process: {
    title: string;
    steps: Array<{
      number: number;
      title: string;
      description: string | string[];
      image?: string;
    }>;
  };
  results: {
    description: string[];
    beforeImage: string;
    afterImage: string;
    containerSize?: 'small' | 'medium' | 'large';
  };
  information: {
    title: string;
    faqs: Array<{
      question: string;
      answer: string;
    }>;
  };
  action: {
    title: string;
    description: string;
    bookLabel: string;
    quoteLabel: string;
  };
}

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
  serviceData: ServiceData;
} & CTAProps;
