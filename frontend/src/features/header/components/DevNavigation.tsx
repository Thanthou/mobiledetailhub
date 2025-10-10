import React, { useEffect,useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronDown, Eye, ExternalLink, Home,Settings, Users } from 'lucide-react';

import { useTenants } from '../hooks/useTenants';

const DevNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isTenantsOpen, setIsTenantsOpen] = useState(false);
  const adminRef = useRef<HTMLDivElement>(null);
  const tenantsRef = useRef<HTMLDivElement>(null);

  // Check if on preview page (by URL path)
  const isPreview = location.pathname === '/preview';

  // Fetch tenants data from API
  const { data: tenants, isLoading, error } = useTenants();

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (adminRef.current && !adminRef.current.contains(event.target as Node)) {
        setIsAdminOpen(false);
      }
      if (tenantsRef.current && !tenantsRef.current.contains(event.target as Node)) {
        setIsTenantsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => { document.removeEventListener('mousedown', handleClickOutside); };
  }, []);

  const handleAdminHomepage = () => {
    void navigate('/');
    setIsAdminOpen(false);
  };

  const handleAdminDashboard = () => {
    void navigate('/admin-dashboard');
    setIsAdminOpen(false);
  };

  const handleTenantHomepage = (slug: string) => {
    if (import.meta.env.DEV) {
      // In development, navigate to localhost with slug
      window.location.href = `http://localhost:5173/${slug}`;
    } else {
      // In production, navigate to the actual website
      const tenant = tenants?.find(t => t.slug === slug);
      if (tenant?.website) {
        window.open(tenant.website, '_blank');
      }
    }
    setIsTenantsOpen(false);
  };

  const handleTenantDashboard = (slug: string) => {
    void navigate(`/${slug}/dashboard`);
    setIsTenantsOpen(false);
  };

  // Adjust position if in preview mode (to make room for CTA button)
  const topPosition = isPreview ? 'top-20' : 'top-4';

  return (
    <div className={`fixed ${topPosition} right-4 z-[9999] flex space-x-2`} style={{ pointerEvents: 'auto' }}>
      {/* Admin Dropdown */}
      <div className="relative" ref={adminRef}>
        <button
          onClick={() => {
            setIsAdminOpen(!isAdminOpen);
          }}
          className="flex items-center space-x-1 px-3 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors duration-200"
        >
          <Settings className="h-3 w-3" />
          <span>Admin</span>
          <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${isAdminOpen ? 'rotate-180' : ''}`} />
        </button>

        {isAdminOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200">
            <div className="py-1">
              <button
                onClick={handleAdminHomepage}
                className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                role="menuitem"
              >
                <Home className="h-4 w-4 mr-3" />
                Main Site
              </button>
              <button
                onClick={handleAdminDashboard}
                className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                role="menuitem"
              >
                <Settings className="h-4 w-4 mr-3" />
                Admin Dashboard
              </button>
              <button
                onClick={() => {
                  void navigate('/tenant-onboarding');
                  setIsAdminOpen(false);
                }}
                className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                role="menuitem"
              >
                <Users className="h-4 w-4 mr-3" />
                Tenant Onboarding
              </button>
              <button
                onClick={() => {
                  void navigate('/preview-generator');
                  setIsAdminOpen(false);
                }}
                className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                role="menuitem"
              >
                <Eye className="h-4 w-4 mr-3" />
                Tenant Preview
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Tenants Dropdown */}
      <div className="relative" ref={tenantsRef}>
        <button
          onClick={() => { setIsTenantsOpen(!isTenantsOpen); }}
          className="flex items-center space-x-1 px-3 py-2 text-xs font-medium text-white bg-green-600 hover:bg-green-700 rounded-md transition-colors duration-200"
        >
          <Users className="h-3 w-3" />
          <span>Tenants</span>
          <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${isTenantsOpen ? 'rotate-180' : ''}`} />
        </button>

        {isTenantsOpen && (
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg border border-gray-200 max-h-96 overflow-y-auto">
            {isLoading ? (
              <div className="px-4 py-3 text-sm text-gray-500">Loading tenants...</div>
            ) : error ? (
              <div className="px-4 py-3 text-sm text-red-500">Error loading tenants</div>
            ) : !tenants || tenants.length === 0 ? (
              <div className="px-4 py-3 text-sm text-gray-500">No tenants found</div>
            ) : (
              <div className="py-1">
                {tenants.map((tenant) => (
                  <div key={tenant.slug} className="border-b border-gray-100 last:border-b-0">
                    <div className="px-4 py-2 text-sm font-medium text-gray-900 bg-gray-50">
                      <div className="font-mono text-xs">{tenant.slug}</div>
                    </div>
                    <div className="px-2 py-1 space-y-1">
                      <button
                        onClick={() => { handleTenantHomepage(tenant.slug); }}
                        className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                        role="menuitem"
                      >
                        <ExternalLink className="h-4 w-4 mr-3" />
                        <span>Homepage</span>
                      </button>
                      <button
                        onClick={() => { handleTenantDashboard(tenant.slug); }}
                        className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                        role="menuitem"
                      >
                        <Settings className="h-4 w-4 mr-3" />
                        <span>Dashboard</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DevNavigation;
