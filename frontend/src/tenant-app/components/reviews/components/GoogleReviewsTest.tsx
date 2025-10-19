/**
 * GoogleReviewsTest Component
 * 
 * Test component to demonstrate Google Reviews integration
 * Shows how to use the useGoogleReviews hook
 */

import React from 'react';
import { useGoogleReviews } from '../hooks';

interface GoogleReviewsTestProps {
  tenantSlug: string;
}

const GoogleReviewsTest: React.FC<GoogleReviewsTestProps> = ({ tenantSlug }) => {
  const {
    reviews,
    summary,
    isLoading,
    isError,
    error,
    source,
    message,
    shouldShowReviews
  } = useGoogleReviews({ tenantSlug });

  if (isLoading) {
    return (
      <div className="p-4 bg-gray-50 rounded-lg">
        <p className="text-gray-600">Loading Google reviews...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600">Error loading reviews: {error?.message}</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white border border-gray-200 rounded-lg">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Google Reviews Test</h3>
        <p className="text-sm text-gray-600">
          Source: <span className="font-mono bg-gray-100 px-2 py-1 rounded">{source}</span>
        </p>
        {message && (
          <p className="text-xs text-gray-500 mt-1">{message}</p>
        )}
      </div>

      {summary && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Review Summary</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-blue-700">Total Reviews:</span>
              <span className="ml-2 font-semibold">{summary.totalReviews}</span>
            </div>
            <div>
              <span className="text-blue-700">Average Rating:</span>
              <span className="ml-2 font-semibold">{summary.averageRating}/5</span>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Reviews ({reviews.length})</h4>
        {reviews.map((review) => (
          <div key={review.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              {review.profileImage && (
                <img
                  src={review.profileImage}
                  alt={review.customerName}
                  className="w-10 h-10 rounded-full object-cover"
                />
              )}
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-medium text-gray-900">{review.customerName}</span>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`text-sm ${
                          i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">{review.rating}/5</span>
                </div>
                <p className="text-gray-700 text-sm">{review.reviewText}</p>
                <p className="text-xs text-gray-500 mt-2">
                  {new Date(review.date).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {!shouldShowReviews && (
        <div className="text-center py-8 text-gray-500">
          <p>No reviews found for this tenant.</p>
          <p className="text-sm mt-2">
            {source === 'mock' ? 'Mock reviews are only shown for dummy tenants.' : 'Reviews will appear here once Google OAuth is connected and reviews are available.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default GoogleReviewsTest;
