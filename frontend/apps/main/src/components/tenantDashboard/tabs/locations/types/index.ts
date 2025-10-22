export interface ServiceArea {
  id?: string;
  city: string;
  state: string;
  zip: number | null;
  primary: boolean;
  minimum: number;
  multiplier: number;
}

export interface LocationData {
  service_areas: ServiceArea[];
  base_location?: {
    city: string;
    state: string;
    zip?: string;
  };
}

export interface LocationFormData {
  city: string;
  state: string;
  zip?: string;
  minimum: number;
  multiplier: number;
}

export interface LocationValidationErrors {
  city?: string;
  state?: string;
  zip?: string;
  minimum?: string;
  multiplier?: string;
  general?: string;
}
