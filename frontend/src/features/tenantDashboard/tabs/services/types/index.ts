import type { ComponentType } from 'react';

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

export interface Subcategory {
  id: string;
  name: string;
  color: string;
  services: Service[];
}

export interface Category {
  id: string;
  name: string;
  color: string;
  services: Service[];
  subcategories?: Subcategory[];
}

export interface Vehicle {
  id: string;
  name: string;
  icon: ComponentType<{ className?: string }>;
  categories: Category[];
}