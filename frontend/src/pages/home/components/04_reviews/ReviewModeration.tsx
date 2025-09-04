import React, { useState } from 'react';
import { DatabaseReview, ReviewUpdate } from './types';
import { useReviews } from './hooks/useReviews';

interface ReviewModerationProps {
  isAdmin?: boolean;
}

export const ReviewModeration: React.FC<ReviewModerationProps> = ({ isAdmin = false }) => {
  const [selectedReview, setSelectedReview] = useState<DatabaseReview | null>(null);
  const [moderationNotes, setModerationNotes] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // Fetch pending reviews for moderation
  const { 
    reviews: pendingReviews, 
    loading, 
    error, 
    refetch 
  } = useReviews({
    type: 'mdh', // Could be expanded to include affiliate reviews
    status: 'pending',
    limit: 20
  });

  const handleApprove = async (review: DatabaseReview) => {
    if (!isAdmin) return;
    
    setIsUpdating(true);
    try {
      const updateData: ReviewUpdate = {
        status: 'approved',
        moderation_notes: moderationNotes || undefined
      };

      const response = await fetch(`/api/reviews/${review.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` // In production, use proper auth
        },
        body: JSON.stringify(updateData)
      });

      if (!response.ok) {
        throw new Error('Failed to approve review');
      }

      setSelectedReview(null);
      setModerationNotes('');
      refetch();
    } catch (error) {
      console.error('Error approving review:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleReject = async (review: DatabaseReview) => {
    if (!isAdmin) return;
    
    setIsUpdating(true);
    try {
      const updateData: ReviewUpdate = {
        status: 'rejected',
        moderation_notes: moderationNotes || 'Review rejected by moderator'
      };

      const response = await fetch(`/api/reviews/${review.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` // In production, use proper auth
        },
        body: JSON.stringify(updateData)
      });

      if (!response.ok) {
        throw new Error('Failed to reject review');
      }

      setSelectedReview(null);
      setModerationNotes('');
      refetch();
    } catch (error) {
      console.error('Error rejecting review:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleFeature = async (review: DatabaseReview) => {
    if (!isAdmin) return;
    
    setIsUpdating(true);
    try {
      const updateData: ReviewUpdate = {
        is_featured: !review.is_featured
      };

      const response = await fetch(`/api/reviews/${review.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` // In production, use proper auth
        },
        body: JSON.stringify(updateData)
      });

      if (!response.ok) {
        throw new Error('Failed to update review');
      }

      refetch();
    } catch (error) {
      console.error('Error updating review:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  if (!isAdmin) {
    return null;
  }

  if (loading) {
    return (
      <div className="bg-stone-800 rounded-xl p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-400 mx-auto mb-4"></div>
          <p className="text-stone-300">Loading reviews for moderation...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-stone-800 rounded-xl p-6">
        <div className="text-center text-red-400">
          <p>Error loading reviews: {error}</p>
          <button 
            onClick={refetch}
            className="mt-2 bg-orange-400 text-stone-900 px-4 py-2 rounded hover:bg-orange-300 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-stone-800 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Review Moderation</h2>
        <span className="bg-orange-400 text-stone-900 px-3 py-1 rounded-full text-sm font-medium">
          {pendingReviews.length} pending
        </span>
      </div>

      {pendingReviews.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-stone-400">No pending reviews to moderate</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingReviews.map((review) => (
            <div key={review.id} className="bg-stone-700 rounded-lg p-4 border border-stone-600">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-white font-semibold">{review.reviewer_name}</h3>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }, (_, i) => (
                        <span
                          key={i}
                          className={`text-lg ${
                            i < review.rating ? 'text-yellow-400' : 'text-stone-500'
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    {review.is_verified && (
                      <span className="text-orange-400 text-xs bg-orange-400/20 px-2 py-1 rounded">
                        Verified
                      </span>
                    )}
                  </div>
                  
                  {review.title && (
                    <h4 className="text-stone-300 font-medium mb-2">{review.title}</h4>
                  )}
                  
                  <p className="text-stone-300 text-sm leading-relaxed mb-3">
                    {review.content}
                  </p>
                  
                  <div className="flex items-center gap-4 text-xs text-stone-400">
                    <span>Submitted: {new Date(review.created_at).toLocaleDateString()}</span>
                    {review.service_category && (
                      <span>Service: {review.service_category}</span>
                    )}
                    {review.business_name && (
                      <span>Business: {review.business_name}</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-stone-600">
                <button
                  onClick={() => handleApprove(review)}
                  disabled={isUpdating}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors disabled:opacity-50"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleReject(review)}
                  disabled={isUpdating}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors disabled:opacity-50"
                >
                  Reject
                </button>
                <button
                  onClick={() => handleFeature(review)}
                  disabled={isUpdating}
                  className={`px-4 py-2 rounded text-sm font-medium transition-colors disabled:opacity-50 ${
                    review.is_featured
                      ? 'bg-orange-400 text-stone-900 hover:bg-orange-300'
                      : 'bg-stone-600 text-stone-300 hover:bg-stone-500'
                  }`}
                >
                  {review.is_featured ? 'Featured' : 'Feature'}
                </button>
                <button
                  onClick={() => setSelectedReview(review)}
                  className="bg-stone-600 hover:bg-stone-500 text-stone-300 px-4 py-2 rounded text-sm font-medium transition-colors"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Review Details Modal */}
      {selectedReview && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setSelectedReview(null)} />
            <div className="relative bg-stone-800 rounded-xl p-6 max-w-2xl w-full">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">Review Details</h3>
                <button
                  onClick={() => setSelectedReview(null)}
                  className="text-stone-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-stone-300 text-sm font-medium mb-2">
                    Moderation Notes
                  </label>
                  <textarea
                    value={moderationNotes}
                    onChange={(e) => setModerationNotes(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 bg-stone-700 border border-stone-600 rounded text-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
                    placeholder="Add notes about this review..."
                  />
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={() => handleApprove(selectedReview)}
                    disabled={isUpdating}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-medium transition-colors disabled:opacity-50"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(selectedReview)}
                    disabled={isUpdating}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-medium transition-colors disabled:opacity-50"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => setSelectedReview(null)}
                    className="bg-stone-600 hover:bg-stone-500 text-stone-300 px-4 py-2 rounded font-medium transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
