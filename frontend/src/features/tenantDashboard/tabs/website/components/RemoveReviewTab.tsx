import React, { useState, useEffect } from 'react';
import { Trash2, Star, Calendar, ExternalLink, Car, Truck, Wrench } from 'lucide-react';
import { getReviews, deleteReview } from '../../../api/reviewsApi';

interface Review {
  id: number;
  customer_name: string;
  rating: number;
  comment: string;
  reviewer_url?: string;
  vehicle_type?: 'car' | 'truck' | 'suv' | 'boat' | 'rv' | 'motorcycle';
  paint_correction: boolean;
  ceramic_coating: boolean;
  paint_protection_film: boolean;
  source: 'website' | 'google' | 'yelp' | 'facebook';
  avatar_filename?: string;
  created_at: string;
}

interface RemoveReviewTabProps {
  tenantSlug?: string;
}

export const RemoveReviewTab: React.FC<RemoveReviewTabProps> = ({ tenantSlug }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    if (tenantSlug) {
      loadReviews();
    }
  }, [tenantSlug]);

  const loadReviews = async () => {
    if (!tenantSlug) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await getReviews(tenantSlug);
      setReviews(response.data || []);
    } catch (err) {
      setError('Failed to load reviews');
      console.error('Error loading reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReview = async (reviewId: number) => {
    if (!confirm('Are you sure you want to delete this review? This action cannot be undone.')) {
      return;
    }

    try {
      setDeletingId(reviewId);
      await deleteReview(reviewId);
      
      // Remove the review from the local state
      setReviews(prev => prev.filter(review => review.id !== reviewId));
      
    } catch (err) {
      console.error('Error deleting review:', err);
      alert('Failed to delete review. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  const getVehicleIcon = (vehicleType?: string) => {
    switch (vehicleType) {
      case 'car': return <Car className="h-4 w-4" />;
      case 'truck': return <Truck className="h-4 w-4" />;
      default: return <Car className="h-4 w-4" />;
    }
  };

  const getServiceIcons = (review: Review) => {
    const services = [];
    if (review.paint_correction) services.push('Paint Correction');
    if (review.ceramic_coating) services.push('Ceramic Coating');
    if (review.paint_protection_film) services.push('Paint Protection Film');
    return services.length > 0 ? services.join(', ') : 'No specific services';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-400'
        }`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-gray-400">Loading reviews...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-400 mb-4">{error}</div>
        <button
          onClick={loadReviews}
          className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-400 mb-4">No reviews found</div>
        <div className="text-sm text-gray-500">
          Reviews will appear here once they are added.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">
          Manage Reviews ({reviews.length})
        </h3>
        <button
          onClick={loadReviews}
          className="px-3 py-1 text-sm bg-stone-700 text-white rounded-lg hover:bg-stone-600 transition-colors"
        >
          Refresh
        </button>
      </div>

      <div className="space-y-3">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="bg-stone-800 border border-stone-700 rounded-lg p-4"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                {/* Header with customer name and rating */}
                <div className="flex items-center gap-3 mb-2">
                  <div className="font-medium text-white">{review.customer_name}</div>
                  <div className="flex items-center gap-1">
                    {renderStars(review.rating)}
                  </div>
                  <div className="text-sm text-gray-400">
                    {formatDate(review.created_at)}
                  </div>
                </div>

                {/* Review content */}
                <div className="text-gray-300 mb-3">
                  {review.comment}
                </div>

                {/* Review details */}
                <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                  {/* Vehicle type */}
                  {review.vehicle_type && (
                    <div className="flex items-center gap-1">
                      {getVehicleIcon(review.vehicle_type)}
                      <span className="capitalize">{review.vehicle_type}</span>
                    </div>
                  )}

                  {/* Services */}
                  <div className="flex items-center gap-1">
                    <Wrench className="h-4 w-4" />
                    <span>{getServiceIcons(review)}</span>
                  </div>

                  {/* Source */}
                  <div className="flex items-center gap-1">
                    <span className="capitalize">{review.source}</span>
                  </div>

                  {/* Reviewer URL */}
                  {review.reviewer_url && (
                    <a
                      href={review.reviewer_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-orange-400 hover:text-orange-300"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Profile
                    </a>
                  )}
                </div>
              </div>

              {/* Delete button */}
              <button
                onClick={() => handleDeleteReview(review.id)}
                disabled={deletingId === review.id}
                className="ml-4 p-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Delete review"
              >
                {deletingId === review.id ? (
                  <div className="animate-spin h-4 w-4 border-2 border-red-400 border-t-transparent rounded-full" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
