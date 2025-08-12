// Frontend Business Configuration Loader
// Uses the shared backend business loader via API calls

import { setCurrentBusiness } from '../config/themes';

interface BusinessConfig {
  business: {
    name: string;
    phone: string;
    email: string;
    address: string;
    hours: string;
    services: string[];
    description: string;
  };
  domain: string;
  theme: string;
  emailNotifications?: string[];
}

interface Business {
  slug: string;
  name: string;
  domain: string;
}

// Backend API base URL
const API_BASE_URL = 'http://localhost:3001';

// Function to get all available businesses from backend
export async function getAvailableBusinesses(): Promise<Business[]> {
  console.log('getAvailableBusinesses: Starting API call to', `${API_BASE_URL}/api/businesses`);
  try {
    const response = await fetch(`${API_BASE_URL}/api/businesses`);
    console.log('getAvailableBusinesses: Response status:', response.status);
    console.log('getAvailableBusinesses: Response ok:', response.ok);
    
    if (response.ok) {
      const businesses = await response.json();
      console.log('getAvailableBusinesses: Successfully loaded businesses:', businesses);
      return businesses;
    } else {
      console.error('getAvailableBusinesses: Response not ok, status:', response.status);
      throw new Error('Failed to fetch businesses');
    }
  } catch (error) {
    console.error('getAvailableBusinesses: Error fetching businesses:', error);
    return [];
  }
}

// Function to get a specific business by slug from backend
export async function getBusinessBySlug(slug: string): Promise<Business | undefined> {
  console.log('getBusinessBySlug: Called with slug:', slug);
  try {
    const businesses = await getAvailableBusinesses();
    const business = businesses.find(business => business.slug === slug);
    console.log('getBusinessBySlug: Found business:', business);
    return business;
  } catch (error) {
    console.error('getBusinessBySlug: Error getting business by slug:', error);
    return undefined;
  }
}

// Function to load business configuration from backend
export async function loadBusinessConfig(businessSlug: string): Promise<BusinessConfig> {
  console.log('loadBusinessConfig: Starting with businessSlug:', businessSlug);
  
  try {
    console.log('loadBusinessConfig: Making API call to', `${API_BASE_URL}/api/business-config/${businessSlug}`);
    const response = await fetch(`${API_BASE_URL}/api/business-config/${businessSlug}`);
    console.log('loadBusinessConfig: Response status:', response.status);
    console.log('loadBusinessConfig: Response ok:', response.ok);
    
    if (response.ok) {
      const config = await response.json();
      console.log('loadBusinessConfig: Successfully loaded config:', config);
      
      // Set the current business in the theme system
      console.log('loadBusinessConfig: Setting current business to:', businessSlug);
      setCurrentBusiness(businessSlug);
      
      return config;
    } else {
      console.error('loadBusinessConfig: Response not ok, status:', response.status);
      throw new Error(`Failed to load business config: ${response.status}`);
    }
  } catch (error) {
    console.error('loadBusinessConfig: Error loading config:', error);
    throw error;
  }
}

// Function to get business config synchronously (for immediate use)
// Note: This will return null since we need to fetch from backend
export function getBusinessConfigSync(businessSlug: string): BusinessConfig | null {
  // Cannot provide sync access to backend data
  // Use loadBusinessConfig() for async access instead
  console.warn('getBusinessConfigSync is deprecated. Use loadBusinessConfig() for async access.');
  return null;
}
