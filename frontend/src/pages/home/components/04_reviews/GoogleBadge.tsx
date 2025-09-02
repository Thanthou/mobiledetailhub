import React from 'react';
import { Star } from 'lucide-react';

export const GoogleBadge: React.FC = () => {
  return (
    <div className="text-center">
      <div className="inline-flex items-center gap-3 bg-white/10 rounded-full px-8 py-4 backdrop-blur-sm hover:bg-white/20 transition-all duration-300">
        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 via-red-500 to-yellow-500 rounded-full flex items-center justify-center">
          <span className="text-white text-sm font-bold">G</span>
        </div>
        <div className="text-left">
          <div className="text-white font-semibold">Google Business</div>
          <div className="text-gray-300 text-sm">Verified Reviews</div>
        </div>
        <div className="flex gap-1 ml-4">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-4 h-4 text-orange-400 fill-current" />
          ))}
        </div>
      </div>
    </div>
  );
};