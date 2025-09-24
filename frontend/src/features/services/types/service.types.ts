export interface Service {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  route: string;
  category: string;
  imageWidth?: number;
  imageHeight?: number;
  imagePriority?: boolean;
}

export interface ServiceCardProps {
  service: Service;
  className?: string;
}

export interface ServicesGridProps {
  services?: Service[];
  onServiceClick?: (service: Service) => void;
  className?: string;
  locationData?: any;
}

// Re-export ServiceData from service-data.ts
export type { ServiceData } from './service-data';
