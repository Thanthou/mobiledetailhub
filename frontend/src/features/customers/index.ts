// Customer feature barrel exports
// Following MDH project conventions - only export components from this barrel

export { Customer } from './classes/Customer';
export type {
  Customer as CustomerData,
  CustomerStatus,
  RegistrationSource,
  VehicleType,
  SizeBucket,
  CommunicationType,
  CommunicationDirection,
  CommunicationStatus,
  CommunicationPriority,
  ContactPreferences,
  ServicePreferences,
  CustomerVehicle,
  CustomerCommunication,
  CreateCustomerRequest,
  UpdateCustomerRequest,
  CustomerSearchFilters,
  CustomerStats,
  DEFAULT_CONTACT_PREFERENCES,
  DEFAULT_SERVICE_PREFERENCES,
  DEFAULT_CUSTOMER_STATUS,
  DEFAULT_COUNTRY,
} from './types';
