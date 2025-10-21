/**
 * Preview API Client
 * 
 * HTTP calls for preview token generation and verification.
 * No UI imports, no DOM usage - pure API layer.
 */

import { config } from '@shared/env';
import { safeValidationMessage } from '@shared/utils/errorHandling';

import type {
  CreatePreviewResponse,
  PreviewErrorResponse,
  PreviewPayload,
  VerifyPreviewResponse,
} from '../types/preview.types';
import { PreviewPayloadSchema } from '../types/preview.types';

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
    throw new Error(safeValidationMessage(validation.error));
  }

  try {
    const response = await fetch(`${config.apiUrl || ''}/api/previews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(validation.data),
    });

    if (!response.ok) {
      const error = await response.json() as PreviewErrorResponse;
      const errorMsg = error.message || 'Failed to create preview';
      throw new Error(errorMsg);
    }

    const result = await response.json() as CreatePreviewResponse;
    return result;
  } catch (error) {
    // Provide more helpful error messages for mobile devices
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Unable to connect to server. Please check your network connection and ensure you can reach the backend server.');
    }
    throw error;
  }
}

/**
 * Verify a preview token
 * @param token - JWT token to verify
 * @returns Promise with decoded payload
 */
export async function verifyPreview(token: string, tenantId?: string): Promise<PreviewPayload> {
  try {
    const url = new URL(`${config.apiUrl || ''}/api/preview/verify`, window.location.origin);
    url.searchParams.set('t', token);
    if (tenantId) url.searchParams.set('tenant_id', tenantId);
    const response = await fetch(
      url.toString(),
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      const error = await response.json() as PreviewErrorResponse;
      const errorMsg = error.message || 'Failed to verify preview';
      throw new Error(errorMsg);
    }

    const data = await response.json() as VerifyPreviewResponse;
    
    // Validate the payload from the backend
    const validation = PreviewPayloadSchema.safeParse(data.payload);
    if (!validation.success) {
      throw new Error('Invalid payload received from server');
    }

    return validation.data;
  } catch (error) {
    // Provide more helpful error messages for mobile devices
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Unable to connect to server. Please check your network connection and ensure you can reach the backend server.');
    }
    throw error;
  }
}

