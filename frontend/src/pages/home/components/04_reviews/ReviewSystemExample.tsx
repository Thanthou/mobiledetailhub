import React, { useState } from 'react';
import { Reviews, ReviewSubmissionModal, ReviewModeration } from './index';

/**
 * Example component showing how to use the new review system
 * This demonstrates all the features available
 */
export const ReviewSystemExample: React.FC = () => {
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);
  const [showModeration, setShowModeration] = useState(false);

  return (
    <div className="space-y-8">
      {/* MDH Site Reviews */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white">MDH Site Reviews</h2>
          <button
            onClick={() => setShowSubmissionModal(true)}
            className="bg-orange-400 text-stone-900 px-4 py-2 rounded-lg hover:bg-orange-300 transition-colors"
          >
            Write Review
          </button>
        </div>
        <Reviews 
          reviewType="mdh"
          maxReviews={3}
          showGoogleBadge={true}
        />
      </section>

      {/* Affiliate Business Reviews */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white">Business Reviews</h2>
          <button
            onClick={() => setShowSubmissionModal(true)}
            className="bg-orange-400 text-stone-900 px-4 py-2 rounded-lg hover:bg-orange-300 transition-colors"
          >
            Write Review
          </button>
        </div>
        <Reviews 
          reviewType="affiliate"
          businessSlug="jps" // Example business slug
          maxReviews={3}
          showGoogleBadge={true}
        />
      </section>

      {/* Featured Reviews Only */}
      <section>
        <h2 className="text-2xl font-bold text-white mb-4">Featured Reviews</h2>
        <Reviews 
          reviewType="mdh"
          featuredOnly={true}
          maxReviews={2}
          showGoogleBadge={false}
        />
      </section>

      {/* Admin Moderation (only show if user is admin) */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white">Review Moderation</h2>
          <button
            onClick={() => setShowModeration(!showModeration)}
            className="bg-stone-600 text-stone-300 px-4 py-2 rounded-lg hover:bg-stone-500 transition-colors"
          >
            {showModeration ? 'Hide' : 'Show'} Moderation
          </button>
        </div>
        {showModeration && (
          <ReviewModeration isAdmin={true} />
        )}
      </section>

      {/* Review Submission Modal */}
      <ReviewSubmissionModal
        isOpen={showSubmissionModal}
        onClose={() => setShowSubmissionModal(false)}
        reviewType="mdh"
        onSuccess={() => {
          console.log('Review submitted successfully!');
          // You might want to refresh the reviews here
        }}
      />
    </div>
  );
};

export default ReviewSystemExample;
