/**
 * Preview API Client
 * 
 * HTTP calls for preview token generation and verification.
 * No UI imports, no DOM usage - pure API layer.
 */

import { env } from '@/shared/env';

import type {
  CreatePreviewResponse,
  PreviewErrorResponse,
  PreviewPayload,
  VerifyPreviewResponse,
} from '../types/preview.types';
import { PreviewPayloadSchema } from '../types/preview.types';

const API_BASE = env.VITE_API_URL_LOCAL || 'http://localhost:3001';

/**
 * Create a preview token
 * @param payload - Business information for preview
 * @returns Promise with preview URL and token
 */
export async function createPreview(
  payload: PreviewPayload
): Promise<CreatePreviewResponse> {
  // Validate payload before sending
  const validation = PreviewPayloadSchema.safeParse(payload);
  if (!validation.success) {
    throw new Error(validation.error.errors[0]?.message || 'Invalid payload');
  }

  const response = await fetch(`${API_BASE}/api/previews`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(validation.data),
  });

  if (!response.ok) {
    const error: PreviewErrorResponse = await response.json();
    throw new Error(error.message || 'Failed to create preview');
  }

  return response.json();
}

/**
 * Verify a preview token
 * @param token - JWT token to verify
 * @returns Promise with decoded payload
 */
export async function verifyPreview(token: string): Promise<PreviewPayload> {
  const response = await fetch(
    `${API_BASE}/api/preview/verify?t=${encodeURIComponent(token)}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    const error: PreviewErrorResponse = await response.json();
    throw new Error(error.message || 'Failed to verify preview');
  }

  const data: VerifyPreviewResponse = await response.json();
  
  // Validate the payload from the backend
  const validation = PreviewPayloadSchema.safeParse(data.payload);
  if (!validation.success) {
    throw new Error('Invalid payload received from server');
  }

  return validation.data;
}

