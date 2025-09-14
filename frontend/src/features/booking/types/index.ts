// Vehicle types
export interface Vehicle {
  id: string;
  name: string;
  description: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any;
}

// Service types
export interface Service {
  id: string;
  name: string;
  description: string;
  base_price_cents: string;
  tiers?: ServiceTier[];
}

export interface ServiceTier {
  id: string;
  name: string;
  price: number;
  duration: number;
  features: string[];
  enabled: boolean;
  popular?: boolean;
  addonType?: 'wheels' | 'windows' | 'trim';
}

// Category types
export interface Category {
  id: string;
  name: string;
  color: string;
  services: Service[];
}

// Service definition types
export interface ServiceDefinition {
  explanation?: string;
  vehicles?: {
    [vehicleType: string]: {
      features?: string[];
      duration?: string;
    };
  };
}

// Booking state types
export interface BookingState {
  selectedVehicle: string;
  selectedService: string;
  availableVehicles: Vehicle[];
  availableServices: Service[];
  loadingServices: boolean;
  loadingVehicles: boolean;
  currentTierIndex: { [serviceId: string]: number };
  selectedTierForModal: ServiceTier | null;
  isModalOpen: boolean;
  expandedFeature: string | null;
  averageRating: number;
  totalReviews: number;
  selectedTierForService: { [serviceId: string]: string };
}

// Selected service data type
export interface SelectedServiceData {
  serviceName: string;
  tierName: string;
  price: number;
  duration: number;
  features: string[];
}
