import { Star } from 'lucide-react';
import React from 'react';

import { useRecentReviews } from '../hooks/useRecentReviews';

export const RecentReviews: React.FC = () => {
  const { reviews } = useRecentReviews();

  return (
    <div className="bg-stone-800 rounded-xl border border-stone-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white">Recent Reviews</h3>
        <Star className="h-5 w-5 text-yellow-400" />
      </div>
      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="p-4 bg-stone-700 rounded-lg border border-stone-600">
            <div className="flex items-center justify-between mb-2">
              <p className="font-medium text-white text-sm">{review.customer}</p>
              <div className="flex items-center">
                {Array.from({ length: review.rating }).map((_, i) => (
                  <Star key={i} className="h-3 w-3 text-yellow-400 fill-current" />
                ))}
              </div>
            </div>
            <p className="text-gray-300 text-xs mb-2">{review.comment}</p>
            <p className="text-gray-400 text-xs">{review.date}</p>
          </div>
        ))}
      </div>
    </div>
  );
};