import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { getAvailableBusinesses } from '../utils/businessLoader';

interface BusinessOption {
  slug: string;
  name: string;
  domain: string;
}

interface BusinessSelectorProps {
  onBusinessChange: (businessSlug: string) => void;
  selectedBusiness: string;
}

const BusinessSelector: React.FC<BusinessSelectorProps> = ({ onBusinessChange, selectedBusiness }) => {
  const [availableBusinesses, setAvailableBusinesses] = useState<BusinessOption[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isChanging, setIsChanging] = useState(false);

  useEffect(() => {
    // Fetch available businesses using the unified business loader
    const fetchBusinesses = async () => {
      try {
        setError(null);
        const businesses = await getAvailableBusinesses();
        setAvailableBusinesses(businesses);
      } catch (error) {
        console.error('Failed to fetch businesses:', error);
        setError(error instanceof Error ? error.message : 'Unknown error');
        setAvailableBusinesses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBusinesses();
  }, []);

  const selectedBusinessData = availableBusinesses.find(b => b.slug === selectedBusiness);

  const handleBusinessChange = (businessSlug: string) => {
    if (isChanging || businessSlug === selectedBusiness) {
      return; // Prevent rapid switching or switching to same business
    }
    
    setIsChanging(true);
    setIsOpen(false);
    
    // Call the parent handler
    onBusinessChange(businessSlug);
    
    // Reset the changing state after a delay
    setTimeout(() => {
      setIsChanging(false);
    }, 1000); // 1 second cooldown
  };

  if (loading) {
    return (
      <div className="fixed top-4 right-4 z-50 bg-white border border-gray-300 rounded-lg p-3 shadow-lg">
        <div className="text-sm text-gray-600">Loading businesses...</div>
      </div>
    );
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="bg-white border border-gray-300 rounded-lg shadow-lg">
        <div className="p-2">
          <div className="text-xs text-gray-500 mb-1">Development Mode</div>
          {error && (
            <div className="text-xs text-red-500 mb-1">
              Backend error: {error}
            </div>
          )}
          <div className="relative">
            <button
              onClick={() => setIsOpen(!isOpen)}
              disabled={isChanging}
              className={`flex items-center justify-between w-64 px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isChanging ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <div className="text-left">
                <div className="font-medium text-gray-900">
                  {selectedBusinessData?.name || 'Select Business'}
                </div>
                <div className="text-xs text-gray-500">
                  {selectedBusinessData?.domain || 'No domain'}
                </div>
                {isChanging && (
                  <div className="text-xs text-blue-500 mt-1">Switching...</div>
                )}
              </div>
              <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto">
                {availableBusinesses.map((business) => (
                  <button
                    key={business.slug}
                    onClick={() => handleBusinessChange(business.slug)}
                    disabled={isChanging || business.slug === selectedBusiness}
                    className={`w-full px-3 py-2 text-left hover:bg-gray-50 focus:outline-none focus:bg-gray-50 ${
                      selectedBusiness === business.slug ? 'bg-blue-50 text-blue-700' : 'text-gray-900'
                    } ${
                      isChanging || business.slug === selectedBusiness ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <div className="font-medium">{business.name}</div>
                    <div className="text-xs text-gray-500">{business.domain}</div>
                    {isChanging && business.slug !== selectedBusiness && (
                      <div className="text-xs text-gray-400 mt-1">Please wait...</div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessSelector;
