/**
 * Payment API client for tenant onboarding
 */

import { config } from '@/shared/env';

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
  const response = await fetch(`${config.apiBaseUrl}/api/payments/create-intent`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error(`Failed to create payment intent: ${response.statusText}`);
  }

  return response.json() as Promise<CreatePaymentIntentResponse>;
};

export const confirmPayment = async (request: ConfirmPaymentRequest): Promise<ConfirmPaymentResponse> => {
  const response = await fetch(`${config.apiBaseUrl}/api/payments/confirm`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error(`Failed to confirm payment: ${response.statusText}`);
  }

  return response.json() as Promise<ConfirmPaymentResponse>;
};
