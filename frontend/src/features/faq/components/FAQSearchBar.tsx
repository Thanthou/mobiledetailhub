import React from 'react';
import { Search } from 'lucide-react';

interface FAQSearchBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

const FAQSearchBar: React.FC<FAQSearchBarProps> = ({ searchTerm, onSearchChange }) => {
  return (
    <div className="relative max-w-md mx-auto mb-6">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 h-5 w-5" />
      <input
        type="text"
        placeholder="Search FAQs..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full pl-10 pr-4 py-3 bg-stone-800/80 backdrop-blur-sm border border-stone-600/50 rounded-lg text-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 shadow-lg"
      />
    </div>
  );
};

export default FAQSearchBar;
