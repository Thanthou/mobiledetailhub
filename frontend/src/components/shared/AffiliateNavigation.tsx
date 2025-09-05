import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, Globe, ExternalLink, BarChart3 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { affiliateEventManager } from '../../utils/affiliateEvents';

interface Affiliate {
  id: number;
  slug: string;
  business_name: string;
  phone: string;
  application_status: string;
  created_at: string;
  updated_at: string;
}

const AffiliateNavigation: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastFetched, setLastFetched] = useState<Date | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Listen for affiliate events (deleted, approved, etc.) and refresh data
  useEffect(() => {
    const unsubscribe = affiliateEventManager.subscribe(() => {
      // Affiliate Navigation: Received affiliate update event, refreshing data
      setAffiliates([]); // Clear cache
      setLastFetched(null); // Reset timestamp
      if (isOpen) {
        fetchAffiliates(true); // Force refresh if menu is open
      }
    });

    return unsubscribe;
  }, [isOpen]);

  // Fetch affiliates when menu opens
  const fetchAffiliates = async (forceRefresh = false) => {
    if (loading || (!forceRefresh && affiliates.length > 0)) return; // Don't refetch if already loaded unless forced
    
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/affiliates', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          setAffiliates(data.data);
          setLastFetched(new Date());
        } else {
          setError('No affiliates found');
        }
      } else {
        const errorText = await response.text();
        setError(`Failed to fetch affiliates (${response.status})`);
      }
    } catch (error) {
      console.error('Affiliate Navigation: Could not fetch affiliates', error);
      setError('Database connection failed');
    } finally {
      setLoading(false);
    }
  };

  // Don't render while auth is loading
  if (authLoading) {
    return null;
  }

  // Only render when logged in as admin
  if (!user || user.role !== 'admin') {
    return null;
  }

  const handleNavigation = (path: string) => {
    // Affiliate Navigation: Going to path
    setIsOpen(false);
    navigate(path);
  };

  const handleMenuToggle = () => {
    if (!isOpen) {
      fetchAffiliates(); // Fetch affiliates when opening menu
    }
    setIsOpen(!isOpen);
  };

  const handleRefresh = () => {
    setAffiliates([]); // Clear cache
    fetchAffiliates(true); // Force refresh
  };

  // Group affiliates by first 3 letters of slug
  const groupedAffiliates = affiliates.reduce((groups, affiliate) => {
    // Skip affiliates with invalid slugs
    if (!affiliate.slug || typeof affiliate.slug !== 'string' || affiliate.slug.length < 3) {
      return groups;
    }
    
    const prefix = affiliate.slug.substring(0, 3).toUpperCase();
    if (!groups[prefix]) {
      groups[prefix] = [];
    }
    groups[prefix].push(affiliate);
    return groups;
  }, {} as Record<string, Affiliate[]>);

  // Sort groups alphabetically
  const sortedGroups = Object.keys(groupedAffiliates).sort();

  return (
    <div 
      ref={menuRef}
      className="relative"
    >
      {/* Affiliate Button */}
      <button
        onClick={handleMenuToggle}
        className="flex items-center space-x-2 px-3 py-2 text-xs bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors duration-200 shadow-lg"
        title="Affiliate Navigation"
      >
        <Globe className="h-4 w-4" />
        <span>Affiliates</span>
        <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50 max-h-96 overflow-y-auto">
          {/* Header with refresh button */}
          <div className="px-4 py-2 border-b border-gray-200 flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">Affiliates</span>
            <div className="flex items-center space-x-2">
              {lastFetched && (
                <span className="text-xs text-gray-500">
                  {lastFetched.toLocaleTimeString()}
                </span>
              )}
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="text-xs text-blue-600 hover:text-blue-800 disabled:text-gray-400"
                title="Refresh affiliates list"
              >
                {loading ? 'Refreshing...' : 'Refresh'}
              </button>
            </div>
          </div>
          
          {loading ? (
            <div className="px-4 py-4 text-center">
              <p className="text-sm text-gray-500">Loading affiliates...</p>
            </div>
          ) : error ? (
            <div className="px-4 py-4 text-center">
              <p className="text-sm text-red-600 mb-2">{error}</p>
              <button
                onClick={handleRefresh}
                className="text-xs text-blue-600 hover:text-blue-800 underline"
              >
                Try again
              </button>
            </div>
          ) : affiliates.length === 0 ? (
            <div className="px-4 py-4 text-center">
              <p className="text-sm text-gray-500">No affiliates found</p>
            </div>
          ) : sortedGroups.length > 0 ? (
            sortedGroups.map((prefix) => (
              <div key={prefix}>
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{prefix}</p>
                </div>
                {groupedAffiliates[prefix].map((affiliate) => (
                  <div key={affiliate.id} className="px-4 py-1">
                    <div className="flex flex-col space-y-1">
                      <button
                        onClick={() => handleNavigation(`/${affiliate.slug}`)}
                        className="flex items-center text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-2 py-1 rounded transition-colors duration-200"
                        title={`Visit ${affiliate.business_name} site`}
                      >
                        <ExternalLink className="h-3 w-3 mr-2" />
                        {affiliate.business_name}
                      </button>
                      <button
                        onClick={() => handleNavigation(`/${affiliate.slug}/dashboard`)}
                        className="flex items-center text-xs text-green-600 hover:text-green-800 hover:bg-green-50 px-2 py-1 rounded transition-colors duration-200"
                        title={`Visit ${affiliate.business_name} dashboard`}
                      >
                        <BarChart3 className="h-3 w-3 mr-2" />
                        {affiliate.business_name}
                      </button>
                    </div>
                  </div>
                ))}
                {prefix !== sortedGroups[sortedGroups.length - 1] && (
                  <hr className="my-2 mx-4" />
                )}
              </div>
            ))
          ) : (
            <div className="px-4 py-4 text-center">
              <p className="text-sm text-gray-500">No valid affiliates found</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AffiliateNavigation;
