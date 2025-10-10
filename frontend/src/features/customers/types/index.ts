// Customer types and interfaces for the MDH customer management system

export type CustomerStatus = 'anonymous' | 'registered' | 'verified' | 'inactive';
export type RegistrationSource = 'website' | 'phone' | 'walk_in' | 'referral' | 'social_media' | 'advertisement' | 'other';
export type VehicleType = 'auto' | 'boat' | 'rv' | 'motorcycle';
export type SizeBucket = 'xs' | 's' | 'm' | 'l' | 'xl';
export type CommunicationType = 'email' | 'sms' | 'phone' | 'in_app' | 'mail';
export type CommunicationDirection = 'inbound' | 'outbound';
export type CommunicationStatus = 'sent' | 'delivered' | 'read' | 'failed' | 'bounced';
export type CommunicationPriority = 'low' | 'normal' | 'high' | 'urgent';

// Main Customer interface
export interface Customer {
  id: string;
  user_id?: string; // null for anonymous customers
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  country: string;
  
  // Customer status and lifecycle
  status: CustomerStatus;
  registration_source?: RegistrationSource;
  converted_at?: string;
  
  // Contact preferences
  contact_preferences: ContactPreferences;
  
  // Service preferences
  service_preferences: ServicePreferences;
  
  // Customer metadata
  notes?: string;
  tags: string[];
  lifetime_value_cents: number;
  total_bookings: number;
  last_booking_at?: string;
  last_activity_at: string;
  
  // Timestamps
  created_at: string;
  updated_at: string;
}

// Contact preferences
export interface ContactPreferences {
  email: boolean;
  sms: boolean;
  phone: boolean;
  marketing_emails: boolean;
  promotional_offers: boolean;
}

// Service preferences
export interface ServicePreferences {
  preferred_services: string[];
  preferred_affiliates: string[];
  vehicle_preferences: Record<string, unknown>;
  service_notes: string;
}

// Customer vehicle interface
export interface CustomerVehicle {
  id: string;
  customer_id: string;
  
  // Vehicle identification
  make: string;
  model: string;
  year?: number;
  color?: string;
  license_plate?: string;
  vin?: string;
  
  // Vehicle details
  vehicle_type: VehicleType;
  size_bucket?: SizeBucket;
  mileage?: number;
  
  // Service history and preferences
  service_notes?: string;
  preferred_services: string[];
  last_service_date?: string;
  next_service_due?: string;
  
  // Vehicle status
  is_primary: boolean;
  is_active: boolean;
  
  // Timestamps
  created_at: string;
  updated_at: string;
}

// Customer communication interface
export interface CustomerCommunication {
  id: string;
  customer_id: string;
  
  // Communication details
  communication_type: CommunicationType;
  direction: CommunicationDirection;
  subject?: string;
  content: string;
  
  // Communication metadata
  status: CommunicationStatus;
  priority: CommunicationPriority;
  category?: string;
  
  // Related entities
  related_booking_id?: string;
  related_quote_id?: string;
  related_affiliate_id?: string;
  
  // Delivery tracking
  sent_at?: string;
  delivered_at?: string;
  read_at?: string;
  failed_at?: string;
  failure_reason?: string;
  
  // Response tracking
  response_required: boolean;
  response_received_at?: string;
  response_content?: string;
  
  // External system tracking
  external_id?: string;
  external_status?: string;
  
  // Timestamps
  created_at: string;
  updated_at: string;
}

// Customer creation/update interfaces
export interface CreateCustomerRequest {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  country?: string;
  registration_source?: RegistrationSource;
  contact_preferences?: Partial<ContactPreferences>;
  service_preferences?: Partial<ServicePreferences>;
  notes?: string;
  tags?: string[];
}

export interface UpdateCustomerRequest {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  country?: string;
  contact_preferences?: Partial<ContactPreferences>;
  service_preferences?: Partial<ServicePreferences>;
  notes?: string;
  tags?: string[];
}

// Customer search and filtering
export interface CustomerSearchFilters {
  status?: CustomerStatus[];
  tags?: string[];
  registration_source?: RegistrationSource[];
  created_after?: string;
  created_before?: string;
  last_activity_after?: string;
  last_activity_before?: string;
  lifetime_value_min?: number;
  lifetime_value_max?: number;
  total_bookings_min?: number;
  total_bookings_max?: number;
  search_query?: string; // searches name, email, phone
}

// Customer statistics
export interface CustomerStats {
  total_customers: number;
  anonymous_customers: number;
  registered_customers: number;
  verified_customers: number;
  inactive_customers: number;
  average_lifetime_value: number;
  total_lifetime_value: number;
  average_bookings_per_customer: number;
  new_customers_this_month: number;
  customers_by_source: Record<RegistrationSource, number>;
  customers_by_status: Record<CustomerStatus, number>;
}

// Default values
export const DEFAULT_CONTACT_PREFERENCES: ContactPreferences = {
  email: true,
  sms: true,
  phone: true,
  marketing_emails: false,
  promotional_offers: false,
};

export const DEFAULT_SERVICE_PREFERENCES: ServicePreferences = {
  preferred_services: [],
  preferred_affiliates: [],
  vehicle_preferences: {},
  service_notes: '',
};

export const DEFAULT_CUSTOMER_STATUS: CustomerStatus = 'anonymous';
export const DEFAULT_COUNTRY = 'US';
