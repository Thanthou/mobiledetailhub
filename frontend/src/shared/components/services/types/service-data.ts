export interface ImageRef {
  src: string;
  alt?: string;
  caption?: string;
}

export interface VideoRef {
  src: string;
  alt?: string;
}

export interface CTAButton {
  label: string;
  href: string;
}

export interface ProcessStep {
  number: number;
  title: string;
  bullets?: string[];
  description?: string;
  image?: ImageRef;
}

export interface ChartData {
  type: string;
  title: string;
  description: string;
  data: Record<string, unknown>; // Chart-specific data structure
}

export interface ServiceData {
  id: string;
  slug: string;
  route: string;
  title: string;
  shortDescription?: string;
  
  seo?: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
    canonicalPath: string;
    ogImage: string;
    robots: string;
  };
  
  hero: {
    image?: ImageRef;
    headline?: string;
    subheadline?: string;
    ctas?: CTAButton[];
  };
  
  overview?: {
    summary: string;
    benefits: string[];
    features: string[];
  };
  
  whatItIs?: {
    description?: string;
    benefits?: string[];
    image?: ImageRef;
    video?: VideoRef;
    chart?: ChartData;
  };
  
  process?: {
    title?: string;
    steps: ProcessStep[];
  };
  
  results?: {
    bullets?: string[];
    images?: {
      before?: ImageRef;
      after?: ImageRef;
    };
    video?: VideoRef;
    containerSize?: string;
  };
  
  gallery?: {
    title: string;
    images: ImageRef[];
  };
  
  pricing?: {
    title: string;
    tiers: Array<{
      id: string;
      name: string;
      price: {
        label: string;
        min: number;
        currency: string;
      };
      description: string;
      popular: boolean;
      features: string[];
    }>;
  };
  
  faq?: {
    title: string;
    items: Array<{
      q: string;
      a: string;
    }>;
  };
  
  cta?: {
    title?: string;
    description?: string;
    primary?: CTAButton;
    secondary?: CTAButton;
  };
  
  jsonLd?: {
    service: Record<string, unknown>; // Schema.org Service JSON-LD structure
  };
}
