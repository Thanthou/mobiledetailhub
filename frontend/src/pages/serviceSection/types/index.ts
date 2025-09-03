export interface ServiceData {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  heroImage: string;
  overview: {
    title: string;
    content: string;
    benefits: string[];
    features: string[];
  };
  process: {
    title: string;
    steps: ProcessStep[];
  };
  pricing: {
    title: string;
    tiers: PricingTier[];
    note?: string;
  };
  gallery: {
    title: string;
    images: GalleryImage[];
  };
  faq: {
    title: string;
    questions: FAQItem[];
  };
  cta: {
    title: string;
    description: string;
    buttonText: string;
    buttonLink: string;
  };
  meta: {
    title: string;
    description: string;
    keywords: string[];
  };
}

export interface ProcessStep {
  id: number;
  title: string;
  description: string;
  icon?: string;
  duration?: string;
}

export interface PricingTier {
  id: string;
  name: string;
  price: string;
  description: string;
  features: string[];
  popular?: boolean;
}

export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  caption?: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export type ServiceType = 
  | 'auto-detailing'
  | 'marine-detailing'
  | 'rv-detailing'
  | 'ceramic-coating'
  | 'paint-correction'
  | 'paint-protection-film';

export interface ServicePageProps {
  serviceData: ServiceData;
}

export interface ServiceHookReturn {
  serviceData: ServiceData | null;
  isLoading: boolean;
  error: string | null;
}
