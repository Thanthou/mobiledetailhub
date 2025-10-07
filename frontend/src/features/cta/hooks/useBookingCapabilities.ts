import { useData } from '@/features/header/contexts/DataProvider';

interface BookingCapabilities {
  hasOnlineBooking: boolean;
  hasPhoneSupport: boolean;
  hasQuoteSystem: boolean;
  preferredContactMethod: 'booking' | 'phone' | 'quote';
  bookingUrl?: string;
  phoneNumber?: string;
}

/**
 * Hook to determine tenant booking capabilities and preferred contact methods
 * This should eventually integrate with tenant settings from the API
 */
export const useBookingCapabilities = (): BookingCapabilities => {
  const { phone, businessName, isTenant } = useData();

  // For now, we'll use simple heuristics
  // TODO: Replace with actual tenant settings from API
  const hasPhoneSupport = !!phone;
  const hasOnlineBooking = isTenant && hasPhoneSupport; // Assume booking is enabled for tenants with phone
  const hasQuoteSystem = true; // Always available as fallback

  // Determine preferred contact method based on capabilities
  let preferredContactMethod: 'booking' | 'phone' | 'quote' = 'quote';
  
  if (hasOnlineBooking) {
    preferredContactMethod = 'booking';
  } else if (hasPhoneSupport) {
    preferredContactMethod = 'phone';
  }

  return {
    hasOnlineBooking,
    hasPhoneSupport,
    hasQuoteSystem,
    preferredContactMethod,
    bookingUrl: hasOnlineBooking ? '/booking' : undefined,
    phoneNumber: phone
  };
};
