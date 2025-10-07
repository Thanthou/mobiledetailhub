// API functions for website content management

export interface WebsiteContentData {
  hero: {
    title: string;
    subtitle: string;
    images: string[];
  };
  services: {
    images: Array<{
      slug: string;
      title: string;
      image: string;
      alt: string;
      href: string;
      width: number;
      height: number;
      priority: boolean;
    }>;
  };
  reviews: {
    title: string;
    subtitle: string;
    avg_rating: number;
    total_count: number;
  };
  faq: {
    title: string;
    subtitle: string;
    content: Array<{
      category: string;
      question: string;
      answer: string;
    }>;
  };
}

// Save website content for a tenant
export const saveWebsiteContent = async (tenantSlug: string, contentData: any): Promise<{ success: boolean; message?: string }> => {
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
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to save website content');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error saving website content:', error);
    throw error;
  }
};

// Get website content for a tenant
export const getWebsiteContent = async (tenantSlug: string): Promise<any> => {
  try {
    const response = await fetch(`/api/website-content/${tenantSlug}`);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch website content');
    }

    const result = await response.json();
    // Backend returns { success: true, content: {...} }
    // Return the content directly
    return result.content || result;
  } catch (error) {
    console.error('Error fetching website content:', error);
    throw error;
  }
};
