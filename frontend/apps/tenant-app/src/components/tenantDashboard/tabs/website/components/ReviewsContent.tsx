import React, { useState } from 'react';
import { RefreshCw } from 'lucide-react';

import { getBusinessData, scrapeGoogleBusinessProfile } from '../../../api/reviewsApi';
import { useWebsiteContent } from '../contexts/WebsiteContentContext';
import { WebsiteAutoSaveField } from './WebsiteAutoSaveField';

interface ReviewsContentProps {
  tenantSlug: string;
}

export const ReviewsContent: React.FC<ReviewsContentProps> = ({ 
  tenantSlug
}) => {
  const { updateContent, refetch } = useWebsiteContent();
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateMessage, setUpdateMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleUpdateBusinessData = async () => {
    setIsUpdating(true);
    setUpdateMessage(null);

    try {
      // First, get the business data to find the Google Maps URL
      const businessResponse = await getBusinessData(tenantSlug);
      
      if (!businessResponse.success || !businessResponse.data.google_maps_url) {
        setUpdateMessage({ 
          type: 'error', 
          message: 'No Google Maps URL found for this business' 
        });
        return;
      }

      const googleMapsUrl = businessResponse.data.google_maps_url;
      
      // Now scrape the Google Business Profile using the Google Maps URL
      const scrapeResponse = await scrapeGoogleBusinessProfile(googleMapsUrl, tenantSlug);
      
      if (scrapeResponse.success && scrapeResponse.data) {
        const { averageRating, totalReviews, businessName } = scrapeResponse.data;
        
        // Update the fields immediately with the scraped data
        const updates: Record<string, number> = {};
        if (averageRating !== null) {
          updates.reviews_avg_rating = parseFloat(averageRating);
        }
        if (totalReviews !== null) {
          updates.reviews_total_count = parseInt(totalReviews, 10);
        }
        
        if (Object.keys(updates).length > 0) {
          await updateContent(updates);
          // Refetch to update all field instances immediately
          await refetch();
        }
        
        // Show success message with the scraped values
        const ratingText = averageRating ? `Rating: ${averageRating}` : '';
        const reviewsText = totalReviews ? `Reviews: ${totalReviews}` : '';
        const separator = ratingText && reviewsText ? ', ' : '';
        const successMessage = `Successfully scraped ${businessName || 'business'}: ${ratingText}${separator}${reviewsText}`.trim();
        
        setUpdateMessage({ 
          type: 'success', 
          message: successMessage
        });
        
        // Clear message after 8 seconds (longer for more complex message)
        setTimeout(() => { setUpdateMessage(null); }, 8000);
      } else {
        setUpdateMessage({ 
          type: 'error', 
          message: 'Failed to scrape Google Maps data. Check server logs for details.' 
        });
      }
    } catch (error) {
      console.error('Scraping error:', error);
      setUpdateMessage({ 
        type: 'error', 
        message: error instanceof Error ? error.message : 'Failed to update business data. Check console for details.' 
      });
    } finally {
      setIsUpdating(false);
    }
  };
  
  return (
    <div className="space-y-4">
      {/* Section Title */}
      <WebsiteAutoSaveField
        field="reviews_title"
        label="Section Title"
        placeholder="Enter reviews section title"
      />

      {/* Section Description */}
      <WebsiteAutoSaveField
        field="reviews_subtitle"
        label="Section Description"
        type="textarea"
        rows={3}
        placeholder="Enter reviews section description"
      />

      {/* Average Review and Total Review Count - Side by Side */}
      <div className="space-y-3">
        <div className="flex gap-4 items-end">
          {/* Average Review */}
          <div className="w-32">
            <WebsiteAutoSaveField
              field="reviews_avg_rating"
              label="Avg Rating"
              type="number"
              step="0.01"
              placeholder="4.90"
            />
          </div>

          {/* Total Review Count */}
          <div className="w-32">
            <WebsiteAutoSaveField
              field="reviews_total_count"
              label="Total"
              type="number"
              placeholder="0"
            />
          </div>

          {/* Update Button */}
          <button
            type="button"
            onClick={() => void handleUpdateBusinessData()}
            disabled={isUpdating}
            className="px-3 py-2 bg-orange-600 hover:bg-orange-700 disabled:bg-orange-800 disabled:cursor-not-allowed text-white rounded text-sm font-medium transition-colors flex items-center gap-2 whitespace-nowrap"
            title="Scrape Google Maps URL for rating and review count"
          >
            <RefreshCw className={`h-4 w-4 ${isUpdating ? 'animate-spin' : ''}`} />
            {isUpdating ? 'Loading...' : 'Update from Google'}
          </button>
        </div>
        
        <div className="text-xs text-gray-400">
          <strong className="text-gray-300">Note:</strong> You can manually edit these values or click &quot;Update from Google&quot; to fetch the latest ratings from your Google Business Profile.
        </div>
      </div>

      {/* Update Message */}
      {updateMessage && (
        <div className={`text-sm p-3 rounded ${
          updateMessage.type === 'success' 
            ? 'bg-green-900 text-green-300 border border-green-700' 
            : 'bg-red-900 text-red-300 border border-red-700'
        }`}>
          {updateMessage.message}
        </div>
      )}
    </div>
  );
};
