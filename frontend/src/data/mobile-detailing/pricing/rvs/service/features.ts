import serviceData from './features.json';

export interface ServiceOption {
  order: number;
  name: string;
  description: string;
  explanation: string;
  image: string;
  duration: number;
  features: string[];
}

export interface ServiceOptions {
  [key: string]: ServiceOption;
}

export const RV_SERVICE_OPTIONS: ServiceOptions = serviceData;
