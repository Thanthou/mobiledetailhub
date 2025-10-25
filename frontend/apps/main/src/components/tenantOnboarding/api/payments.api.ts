/**
 * Payment API client for tenant onboarding
 */

import { apiClient } from '@shared/api';

export interface CreatePaymentIntentRequest {
  amount: number;
  customerEmail: string;
  businessName: string;
  planType: string;
  metadata?: Record<string, unknown>;
}

export interface CreatePaymentIntentResponse {
  success: boolean;
  clientSecret?: string;
  paymentIntentId?: string;
  error?: string;
}

export interface ConfirmPaymentRequest {
  paymentIntentId: string;
  tenantData: Record<string, unknown>;
}

export interface ConfirmPaymentResponse {
  success: boolean;
  data?: {
    slug: string;
    websiteUrl: string;
    dashboardUrl: string;
    tenantId: string;
    userId: string;
    paymentIntentId: string;
  };
  error?: string;
}

export const createPaymentIntent = async (request: CreatePaymentIntentRequest): Promise<CreatePaymentIntentResponse> => {
  return apiClient.post<CreatePaymentIntentResponse>('/api/payments/create-intent', request);
};

export const confirmPayment = async (request: ConfirmPaymentRequest): Promise<ConfirmPaymentResponse> => {
  return apiClient.post<ConfirmPaymentResponse>('/api/payments/confirm', request);
};
