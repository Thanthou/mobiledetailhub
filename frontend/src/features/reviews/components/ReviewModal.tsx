import React, { useEffect, useState } from 'react';
import { Calendar, ExternalLink, X } from 'lucide-react';

import { Button } from '@/shared/ui';

import type { Review } from '../types/types';
import { ReviewSourceIcon } from './ReviewSourceIcon';
import { StarRating } from './StarRating';

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

  // Safe property access helpers
  const safeString = (value: unknown): string => {
    return typeof value === 'string' ? value : '';
  };

  const safeNumber = (value: unknown): number => {
    return typeof value === 'number' ? value : 0;
  };

  const safeBoolean = (value: unknown): boolean => {
    return Boolean(value);
  };

  // Handle escape key
  useEffect(() => {
    if (!isOpen) return;
    
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden'; // Prevent background scrolling

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
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClose();
          }
        }}
        role="button"
        tabIndex={0}
        aria-label="Close modal"
      />
      
      {/* Modal */}
      <div 
        className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-2xl bg-stone-900 text-left shadow-2xl transform transition-all animate-in fade-in-0 zoom-in-95 duration-300"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-600 px-6 py-4">
          <h3 id="modal-title" className="text-xl font-semibold text-white">Review Details</h3>
          <Button
            onClick={handleClose}
            variant="ghost"
            size="sm"
            className="rounded-lg p-2 text-stone-400 hover:bg-stone-700 hover:text-white"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="px-6 py-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Reviewer Info */}
          <div className="flex items-start gap-4 mb-6">
            {/* Profile Image */}
            {safeString(review.reviewerUrl) ? (
              <a
                href={safeString(review.reviewerUrl)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center text-white font-bold text-3xl overflow-hidden hover:from-orange-300 hover:to-orange-400 transition-all duration-200 cursor-pointer group"
                title={`View ${safeString(review.customerName)}'s profile`}
              >
                {safeString(review.profileImage) && !imageError ? (
                  <img 
                    src={safeString(review.profileImage)} 
                    alt={safeString(review.customerName)}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    onError={() => { setImageError(true); }}
                  />
                ) : (
                  safeString(review.customerName).charAt(0).toUpperCase()
                )}
              </a>
            ) : (
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center text-white font-bold text-3xl overflow-hidden">
                {safeString(review.profileImage) && !imageError ? (
                  <img 
                    src={safeString(review.profileImage)} 
                    alt={safeString(review.customerName)}
                    className="w-full h-full object-cover"
                    onError={() => { setImageError(true); }}
                  />
                ) : (
                  safeString(review.customerName).charAt(0).toUpperCase()
                )}
              </div>
            )}

            {/* Reviewer Details */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                {safeString(review.reviewerUrl) ? (
                  <a
                    href={safeString(review.reviewerUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xl font-semibold text-white hover:text-orange-400 transition-colors duration-200 cursor-pointer group flex items-center gap-2"
                    title={`View ${safeString(review.customerName)}'s profile`}
                  >
                    {safeString(review.customerName)}
                    <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  </a>
                ) : (
                  <h4 className="text-xl font-semibold text-white">
                    {safeString(review.customerName)}
                  </h4>
                )}
                {safeBoolean(review.isVerified) && (
                  <span className="text-orange-400 text-sm font-medium bg-orange-400/10 px-2 py-1 rounded">
                    Verified
                  </span>
                )}
              </div>

              <div className="flex items-center gap-4 text-stone-400 text-sm">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(safeString(review.date))}</span>
                </div>

                {safeString(review.reviewSource) && (
                  <div className="flex items-center gap-1">
                    <ReviewSourceIcon source={safeString(review.reviewSource) as 'website' | 'google' | 'yelp' | 'facebook' | 'imported'} size="sm" />
                    <span className="capitalize">{safeString(review.reviewSource)}</span>
                  </div>
                )}
              </div>

              {/* Service Category */}
              {safeString(review.serviceCategory) && (
                <div className="mt-2">
                  <span className="text-stone-400 text-sm bg-stone-700 px-3 py-1 rounded-full">
                    {safeString(review.serviceCategory)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Review Title */}
          {safeString(review.title) && (
            <h5 className="text-lg font-semibold text-white mb-4">
              {safeString(review.title)}
            </h5>
          )}

          {/* Full Review Text */}
          <div className="mb-6">
            <p className="text-gray-300 leading-relaxed text-base">
              &ldquo;{safeString(review.reviewText)}&rdquo;
            </p>
          </div>


          {/* Rating Display */}
          <div className="border-t border-stone-600 pt-4">
            <div className="flex items-center justify-center gap-2">
              <StarRating rating={safeNumber(review.rating)} size="md" />
              <span className="text-stone-400 text-sm ml-2">{safeNumber(review.rating)}/5</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-stone-600 px-6 py-4 bg-stone-900">
          <div className="flex justify-end gap-3">
            <Button
              onClick={handleClose}
              variant="primary"
              size="md"
              className="px-6 py-2 bg-orange-400 hover:bg-orange-300 text-stone-900 font-medium rounded-lg"
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
