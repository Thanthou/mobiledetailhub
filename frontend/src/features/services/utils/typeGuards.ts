import type { ServiceData, ServiceFAQ, ServiceGallery, ServiceOverview, ServicePricing } from '../types/service';

// Type guard for ServiceData
export function isServiceData(x: unknown): x is ServiceData {
  return !!x && 
    typeof x === 'object' && 
    'title' in x && 
    'slug' in x && 
    'overview' in x && 
    'gallery' in x && 
    'faq' in x && 
    'pricing' in x &&
    'process' in x &&
    'whatItIs' in x &&
    'results' in x &&
    'information' in x &&
    'action' in x;
}

// Type guard for ServiceOverview
export function isServiceOverview(x: unknown): x is ServiceOverview {
  return !!x && 
    typeof x === 'object' && 
    'title' in x && 
    'content' in x && 
    'benefits' in x && 
    'features' in x;
}

// Type guard for ServiceGallery
export function isServiceGallery(x: unknown): x is ServiceGallery {
  return !!x && 
    typeof x === 'object' && 
    'title' in x && 
    'images' in x && 
    Array.isArray((x as ServiceGallery).images);
}

// Type guard for ServiceFAQ
export function isServiceFAQ(x: unknown): x is ServiceFAQ {
  return !!x && 
    typeof x === 'object' && 
    'title' in x && 
    'questions' in x && 
    Array.isArray((x as ServiceFAQ).questions);
}

// Type guard for ServicePricing
export function isServicePricing(x: unknown): x is ServicePricing {
  return !!x && 
    typeof x === 'object' && 
    'title' in x && 
    'tiers' in x && 
    Array.isArray((x as ServicePricing).tiers);
}

// Error handling utility
export function handleError(error: unknown): Error {
  if (error instanceof Error) {
    return error;
  }
  return new Error(String(error));
}
