// API functions for website content management

import type { WebsiteContentData } from '@/shared/api/websiteContent.api';

// Save website content for a tenant
export const saveWebsiteContent = async (tenantSlug: string, contentData: Partial<WebsiteContentData>): Promise<{ success: boolean; message?: string }> => {
  try {
    // Backend expects flat structure, so just pass contentData as is
    // The WebsiteContentTab component already manages the flat structure
    const response = await fetch(`/api/website-content/${tenantSlug}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(contentData),
    });

    if (!response.ok) {
      const errorData = await response.json() as { error?: string };
      throw new Error(errorData.error || 'Failed to save website content');
    }

    const result = await response.json() as { success: boolean; message?: string };
    return result;
  } catch (error) {
    console.error('Error saving website content:', error);
    throw error;
  }
};

// Get website content for a tenant
export const getWebsiteContent = async (tenantSlug: string): Promise<WebsiteContentData> => {
  try {
    const response = await fetch(`/api/website-content/${tenantSlug}`);

    if (!response.ok) {
      const errorData = await response.json() as { error?: string };
      throw new Error(errorData.error || 'Failed to fetch website content');
    }

    const result = await response.json() as { success: boolean; content?: WebsiteContentData };
    // Backend returns { success: true, content: {...} }
    // Return the content directly or throw if missing
    if (!result.content) {
      throw new Error('No content data received from server');
    }
    return result.content;
  } catch (error) {
    console.error('Error fetching website content:', error);
    throw error;
  }
};
