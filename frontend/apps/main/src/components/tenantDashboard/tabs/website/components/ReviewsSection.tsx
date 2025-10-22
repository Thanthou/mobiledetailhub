import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Eye, FileText, Plus, Star } from 'lucide-react';

import { AddReviewForm } from './AddReviewForm';
import { RemoveReviewTab } from './RemoveReviewTab';
import { ReviewsContent } from './ReviewsContent';

interface ReviewsSectionProps {
  tenantSlug: string;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({ tenantSlug }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [activeTab, setActiveTab] = useState<'content' | 'add-review' | 'remove-review'>('content');

  return (
    <div className="bg-stone-800 rounded-lg p-6 border border-stone-700">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Star className="h-5 w-5 text-orange-400 mr-3" />
          <h3 className="text-lg font-semibold text-white">Reviews</h3>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => { /* Preview functionality */ }}
            className="flex items-center px-3 py-1 text-sm text-gray-400 hover:text-white transition-colors"
          >
            <Eye className="h-4 w-4 mr-1" />
            Preview
          </button>
          <button
            onClick={() => { setIsCollapsed(!isCollapsed); }}
            className="flex items-center px-3 py-1 text-sm text-gray-400 hover:text-white transition-colors"
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4 mr-1" />
            ) : (
              <ChevronDown className="h-4 w-4 mr-1" />
            )}
            {isCollapsed ? 'Expand' : 'Collapse'}
          </button>
        </div>
      </div>

      {!isCollapsed && (
        <div className="space-y-4">
          {/* Reviews Sub-tabs */}
          <div className="flex space-x-1 bg-stone-800 rounded-lg p-1 mb-4">
            <button
              onClick={() => { setActiveTab('content'); }}
              className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'content'
                  ? 'bg-orange-500 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-stone-700'
              }`}
            >
              <Star className="h-4 w-4 mr-2" />
              Content
            </button>
            <button
              onClick={() => { setActiveTab('add-review'); }}
              className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'add-review'
                  ? 'bg-orange-500 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-stone-700'
              }`}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Review
            </button>
            <button
              onClick={() => { setActiveTab('remove-review'); }}
              className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'remove-review'
                  ? 'bg-orange-500 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-stone-700'
              }`}
            >
              <FileText className="h-4 w-4 mr-2" />
              Remove Review
            </button>
          </div>

          {/* Reviews Sub-tab Content */}
          <div className="transition-all duration-300 ease-in-out">
            {activeTab === 'content' && (
              <ReviewsContent tenantSlug={tenantSlug} />
            )}
            {activeTab === 'add-review' && (
              <AddReviewForm tenantSlug={tenantSlug} />
            )}
            {activeTab === 'remove-review' && (
              <RemoveReviewTab tenantSlug={tenantSlug} />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

