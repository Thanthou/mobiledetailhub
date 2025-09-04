import React, { useState } from 'react';
import { StarRating } from './StarRating';
import { ReviewSourceIcon } from './ReviewSourceIcon';
import { ReviewModal } from './ReviewModal';
import { ReviewCardProps } from './types';
import { useReviewVote } from './hooks/useReviews';

export const ReviewCard: React.FC<ReviewCardProps> = ({ 
  review, 
  showVoting = false, 
  onVote 
}) => {
  const [hasVoted, setHasVoted] = useState(false);
  const [userVote, setUserVote] = useState<'helpful' | 'not_helpful' | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { voteOnReview, loading: votingLoading } = useReviewVote();

  // Text truncation settings
  const MAX_WORDS = 25;
  const words = review.reviewText.split(' ');
  const isTruncated = words.length > MAX_WORDS;
  const truncatedText = isTruncated ? words.slice(0, MAX_WORDS).join(' ') + '...' : review.reviewText;

  // Check if review is from this week (within last 7 days)
  const isThisWeek = () => {
    const reviewDate = new Date(review.date);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - reviewDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  };

  const handleVote = async (voteType: 'helpful' | 'not_helpful') => {
    if (hasVoted || votingLoading) return;

    try {
      await voteOnReview(review.id, voteType);
      setHasVoted(true);
      setUserVote(voteType);
      onVote?.(review.id, voteType);
    } catch (error) {
      console.error('Failed to vote on review:', error);
    }
  };
  return (
    <div 
      className={`bg-stone-800 rounded-xl p-6 hover:bg-stone-700 transition-all duration-300 hover:scale-105 hover:shadow-2xl border hover:border-orange-400/30 cursor-pointer ${
        review.isFeatured ? 'border-orange-400/50 bg-gradient-to-br from-stone-800 to-stone-700' : 'border-stone-600'
      }`}
      onClick={(e) => {
        e.stopPropagation();
        setIsModalOpen(true);
      }}
    >
      {/* This Week badge */}
      {isThisWeek() && (
        <div className="absolute -top-2 -right-2 bg-orange-400 text-stone-900 text-xs font-bold px-2 py-1 rounded-full">
          This Week
        </div>
      )}

      {/* Header with profile and rating */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {/* Profile image */}
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center text-white font-bold text-3xl overflow-hidden">
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
          <div>
            <h3 className="text-white font-semibold text-lg leading-tight">
              {review.customerName}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <StarRating rating={review.rating} size="sm" />
              {review.isVerified && (
                <span className="text-orange-400 text-xs font-medium">
                  Verified
                </span>
              )}
              {review.reviewSource && (
                <ReviewSourceIcon source={review.reviewSource} size="sm" />
              )}
              {review.serviceCategory && (
                <span className="text-stone-400 text-xs bg-stone-700 px-2 py-1 rounded">
                  {review.serviceCategory}
                </span>
              )}
            </div>
          </div>
        </div>
        
      </div>

      {/* Review title */}
      {review.title && (
        <h4 className="text-white font-semibold text-base mb-2">
          {review.title}
        </h4>
      )}

      {/* Review text */}
      <p className="text-gray-300 leading-relaxed mb-4">
        "{truncatedText}"
      </p>

      {/* Voting section */}
      {showVoting && (review.helpfulVotes !== undefined || review.totalVotes !== undefined) && (
        <div 
          className="mb-4 p-3 bg-stone-700/50 rounded-lg"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-stone-300 text-sm">Was this review helpful?</span>
            <span className="text-stone-400 text-xs">
              {review.helpfulVotes || 0} of {review.totalVotes || 0} found helpful
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleVote('helpful');
              }}
              disabled={hasVoted || votingLoading}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                hasVoted && userVote === 'helpful'
                  ? 'bg-green-600 text-white'
                  : hasVoted
                  ? 'bg-stone-600 text-stone-400 cursor-not-allowed'
                  : 'bg-stone-600 text-stone-300 hover:bg-green-600 hover:text-white'
              }`}
            >
              {votingLoading ? '...' : '👍 Helpful'}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleVote('not_helpful');
              }}
              disabled={hasVoted || votingLoading}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                hasVoted && userVote === 'not_helpful'
                  ? 'bg-red-600 text-white'
                  : hasVoted
                  ? 'bg-stone-600 text-stone-400 cursor-not-allowed'
                  : 'bg-stone-600 text-stone-300 hover:bg-red-600 hover:text-white'
              }`}
            >
              {votingLoading ? '...' : '👎 Not helpful'}
            </button>
          </div>
        </div>
      )}

      {/* Date */}
      <div className="flex items-center justify-between pt-3 border-t border-stone-600">
        <span className="text-gray-400 text-sm">
          {new Date(review.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </span>
        <div className="flex gap-1">
          <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-orange-400/60 rounded-full animate-pulse delay-150"></div>
          <div className="w-2 h-2 bg-orange-400/30 rounded-full animate-pulse delay-300"></div>
        </div>
      </div>

      {/* Review Modal */}
      <ReviewModal
        review={review}
        isOpen={isModalOpen}
        onClose={() => {
          // Use setTimeout to prevent immediate reopening due to event bubbling
          setTimeout(() => {
            setIsModalOpen(false);
          }, 0);
        }}
      />
    </div>
  );
};