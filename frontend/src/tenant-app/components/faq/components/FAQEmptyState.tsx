import React from 'react';
import { Search } from 'lucide-react';

const FAQEmptyState: React.FC = () => {
  return (
    <div className="text-center py-12">
      <div className="bg-stone-800/80 backdrop-blur-sm rounded-lg p-8 border border-stone-700/50 shadow-xl">
        <Search className="h-12 w-12 text-stone-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">No FAQs Found</h3>
        <p className="text-stone-400">
          Try adjusting your search or selecting a different category.
        </p>
      </div>
    </div>
  );
};

export default FAQEmptyState;
