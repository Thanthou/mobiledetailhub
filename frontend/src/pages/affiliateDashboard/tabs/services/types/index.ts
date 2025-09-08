export interface ServiceTier {
  id: string;
  name: string;
  price: number;
  duration: number;
  features: string[];
  enabled: boolean;
  popular?: boolean;
}

export interface Service {
  id: string;
  name: string;
  tiers: ServiceTier[];
}

export interface Category {
  id: string;
  name: string;
  color: string;
  services: Service[];
}

export interface Vehicle {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  categories: Category[];
}