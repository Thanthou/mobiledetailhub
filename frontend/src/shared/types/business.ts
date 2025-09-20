export interface ServiceArea {
  city: string;
  state: string;
  zip: string;
}

export interface BusinessData {
  name: string;
  slug: string;
  "business-name": string;
  "business-slug": string;
  "business-url": string;
  "business-phone": string;
  "business-email": string;
  "business-address": string;
  "business-city": string;
  "business-state": string;
  "business-zip": string;
  "business-logo": string;
  "business-description": string;
  "business-services": string[];
  "business-hours": string;
  "service-areas": ServiceArea[];
}

export interface EmployeesData {
  [affiliateSlug: string]: BusinessData;
}
