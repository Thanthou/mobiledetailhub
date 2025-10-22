import { useQuery } from '@tanstack/react-query';

export interface PaymentMethod {
  id: string;
  type: 'card' | 'paypal' | 'apple_pay' | 'google_pay' | 'bank_transfer';
  name: string;
  description: string;
  icon?: string;
  enabled: boolean;
  processingFee?: number;
}

export interface PaymentToken {
  id: string;
  methodId: string;
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
}

/**
 * Hook to load payment methods for a specific affiliate
 */
export const usePaymentMethods = (affiliateId?: string) => {
  return useQuery({
    queryKey: ['booking','paymentMethods', affiliateId],
    queryFn: async (): Promise<PaymentMethod[]> => {
      // TODO: Replace with actual API call
      // For now, return mock data
      const mockPaymentMethods: PaymentMethod[] = [
        {
          id: 'card',
          type: 'card',
          name: 'Credit/Debit Card',
          description: 'Pay with Visa, Mastercard, American Express, or Discover',
          enabled: true,
          processingFee: 2.9
        },
        {
          id: 'paypal',
          type: 'paypal',
          name: 'PayPal',
          description: 'Pay securely with your PayPal account',
          enabled: true,
          processingFee: 3.4
        },
        {
          id: 'apple_pay',
          type: 'apple_pay',
          name: 'Apple Pay',
          description: 'Pay with Touch ID or Face ID',
          enabled: true,
          processingFee: 2.9
        },
        {
          id: 'google_pay',
          type: 'google_pay',
          name: 'Google Pay',
          description: 'Pay with your Google account',
          enabled: true,
          processingFee: 2.9
        }
      ];

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      return mockPaymentMethods;
    },
    enabled: !!affiliateId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook to load saved payment tokens for a user
 */
export const usePaymentTokens = (userId?: string) => {
  return useQuery({
    queryKey: ['booking','paymentTokens', userId],
    queryFn: async (): Promise<PaymentToken[]> => {
      // TODO: Replace with actual API call
      // For now, return mock data
      const mockPaymentTokens: PaymentToken[] = [
        {
          id: 'token_1',
          methodId: 'card',
          last4: '4242',
          brand: 'Visa',
          expiryMonth: 12,
          expiryYear: 2025,
          isDefault: true
        },
        {
          id: 'token_2',
          methodId: 'card',
          last4: '5555',
          brand: 'Mastercard',
          expiryMonth: 8,
          expiryYear: 2026,
          isDefault: false
        }
      ];

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 200));
      
      return mockPaymentTokens;
    },
    enabled: !!userId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    cacheTime: 5 * 60 * 1000, // 5 minutes
  });
};
