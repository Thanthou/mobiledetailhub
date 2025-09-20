export interface Service {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  route: string;
  category: string;
}

export interface ServiceCardProps {
  service: Service;
  className?: string;
}

export interface ServicesGridProps {
  services: Service[];
  onServiceClick: (service: Service) => void;
  className?: string;
}

// Re-export ServiceData from service-data.ts
export type { ServiceData } from './service-data';
