import React, { useEffect, useState } from 'react';
import { X, Star, Calendar, ExternalLink } from 'lucide-react';
import { Review } from './types';
import { StarRating } from './StarRating';
import { ReviewSourceIcon } from './ReviewSourceIcon';

interface ReviewModalProps {
  review: Review;
  isOpen: boolean;
  onClose: () => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({ 
  review, 
  isOpen, 
  onClose 
}) => {
  const [imageError, setImageError] = useState(false);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4" style={{ zIndex: 999999 }}>
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-75 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div 
        className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-2xl bg-stone-900 text-left shadow-2xl transform transition-all animate-in fade-in-0 zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-600 px-6 py-4">
          <h3 className="text-xl font-semibold text-white">Review Details</h3>
          <button
            onClick={handleClose}
            className="rounded-lg p-2 text-stone-400 hover:bg-stone-700 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Reviewer Info */}
          <div className="flex items-start gap-4 mb-6">
            {/* Profile Image */}
            {review.reviewerUrl ? (
              <a
                href={review.reviewerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center text-white font-bold text-3xl overflow-hidden hover:from-orange-300 hover:to-orange-400 transition-all duration-200 cursor-pointer group"
                title={`View ${review.customerName}'s profile`}
              >
                {review.profileImage && !imageError ? (
                  <img 
                    src={review.profileImage} 
                    alt={review.customerName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  review.customerName.charAt(0).toUpperCase()
                )}
              </a>
            ) : (
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center text-white font-bold text-3xl overflow-hidden">
                {review.profileImage && !imageError ? (
                  <img 
                    src={review.profileImage} 
                    alt={review.customerName}
                    className="w-full h-full object-cover"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  review.customerName.charAt(0).toUpperCase()
                )}
              </div>
            )}

            {/* Reviewer Details */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                {review.reviewerUrl ? (
                  <a
                    href={review.reviewerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xl font-semibold text-white hover:text-orange-400 transition-colors duration-200 cursor-pointer group flex items-center gap-2"
                    title={`View ${review.customerName}'s profile`}
                  >
                    {review.customerName}
                    <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  </a>
                ) : (
                  <h4 className="text-xl font-semibold text-white">
                    {review.customerName}
                  </h4>
                )}
                {review.isVerified && (
                  <span className="text-orange-400 text-sm font-medium bg-orange-400/10 px-2 py-1 rounded">
                    Verified
                  </span>
                )}
              </div>

              <div className="flex items-center gap-4 text-stone-400 text-sm">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(review.date)}</span>
                </div>

                {review.reviewSource && (
                  <div className="flex items-center gap-1">
                    <ReviewSourceIcon source={review.reviewSource} size="sm" />
                    <span className="capitalize">{review.reviewSource}</span>
                  </div>
                )}
              </div>

              {/* Service Category */}
              {review.serviceCategory && (
                <div className="mt-2">
                  <span className="text-stone-400 text-sm bg-stone-700 px-3 py-1 rounded-full">
                    {review.serviceCategory}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Review Title */}
          {review.title && (
            <h5 className="text-lg font-semibold text-white mb-4">
              {review.title}
            </h5>
          )}

          {/* Full Review Text */}
          <div className="mb-6">
            <p className="text-gray-300 leading-relaxed text-base">
              "{review.reviewText}"
            </p>
          </div>


          {/* Rating Display */}
          <div className="border-t border-stone-600 pt-4">
            <div className="flex items-center justify-center gap-2">
              <StarRating rating={review.rating} size="md" />
              <span className="text-stone-400 text-sm ml-2">{review.rating}/5</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-stone-600 px-6 py-4 bg-stone-900">
          <div className="flex justify-end gap-3">
            <button
              onClick={handleClose}
              className="px-6 py-2 bg-orange-400 text-stone-900 font-medium rounded-lg hover:bg-orange-300 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};