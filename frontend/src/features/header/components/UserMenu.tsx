import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, ChevronDown, ExternalLink,Home, Shield } from 'lucide-react';

import { env } from '@/shared/env';

import { useTenants } from '../hooks/useTenants';

const UserMenu: React.FC = () => {
  // Admin dropdown with Tenant Onboarding link
  const navigate = useNavigate();
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isTenantsOpen, setIsTenantsOpen] = useState(false);
  const adminMenuRef = useRef<HTMLDivElement>(null);
  const tenantsMenuRef = useRef<HTMLDivElement>(null);
  const { data: tenants, isLoading: tenantsLoading } = useTenants();

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (adminMenuRef.current && !adminMenuRef.current.contains(event.target as Node)) {
        setIsAdminOpen(false);
      }
      if (tenantsMenuRef.current && !tenantsMenuRef.current.contains(event.target as Node)) {
        setIsTenantsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => { document.removeEventListener('mousedown', handleClickOutside); };
  }, []);

  const handleNavigation = useCallback((path: string) => {
    void navigate(path);
    setIsAdminOpen(false);
    setIsTenantsOpen(false);
  }, [navigate]);

  const handleTenantHomepage = useCallback((slug: string) => {
    // In development, navigate to localhost with the slug
    const isDevelopment = env.DEV;
    if (isDevelopment) {
      window.open(`http://localhost:5173/${slug}`, '_blank', 'noopener,noreferrer');
    } else {
      // In production, use the actual website URL
      window.open(`http://thatsmartsite.com/${slug}`, '_blank', 'noopener,noreferrer');
    }
    setIsTenantsOpen(false);
  }, []);

  return (
    <div className="flex items-center space-x-2">
      {/* Tenants Dropdown */}
      <div className="relative" ref={tenantsMenuRef}>
        <button
          id="tenants-menu-button"
          onClick={() => { 
            setIsTenantsOpen(!isTenantsOpen);
            setIsAdminOpen(false); // Close other menus
          }}
          className="flex items-center space-x-1 bg-green-600 hover:bg-green-700 text-white px-2 py-1.5 rounded-md text-xs font-medium transition-colors"
          aria-expanded={isTenantsOpen}
          aria-haspopup="true"
        >
          <Building2 className="h-3 w-3" />
          <span>Tenants</span>
          <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${isTenantsOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Tenants Dropdown Menu */}
        {isTenantsOpen && (
          <div 
            className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 max-h-96 overflow-y-auto"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="tenants-menu-button"
          >
            {tenantsLoading ? (
              <div className="px-4 py-2 text-sm text-gray-500">Loading tenants...</div>
            ) : tenants && tenants.length > 0 ? (
              tenants.map((tenant) => (
                <div key={tenant.slug} className="border-b border-gray-100 last:border-b-0">
                  <div className="px-4 py-2 text-sm font-medium text-gray-900 bg-gray-50">
                    <div className="font-semibold">{tenant.branding.businessName}</div>
                    <div className="text-xs text-gray-500 font-mono">/{tenant.slug}</div>
                  </div>
                  
                  <button
                    onClick={() => { handleTenantHomepage(tenant.slug); }}
                    className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                    role="menuitem"
                  >
                    <ExternalLink className="h-4 w-4 mr-3" />
                    <div className="flex flex-col items-start">
                      <span>Homepage</span>
                      <span className="text-xs text-gray-500 font-mono">
                        {env.DEV ? `http://localhost:5173/${tenant.slug}` : tenant.contact.socials.facebook || 'No website'}
                      </span>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => { handleNavigation(`/${tenant.slug}/dashboard`); }}
                    className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                    role="menuitem"
                  >
                    <Building2 className="h-4 w-4 mr-3" />
                    <div className="flex flex-col items-start">
                      <span>Dashboard</span>
                      <span className="text-xs text-gray-500 font-mono">/{tenant.slug}/dashboard</span>
                    </div>
                  </button>
                </div>
              ))
            ) : (
              <div className="px-4 py-2 text-sm text-gray-500">No tenants found</div>
            )}
          </div>
        )}
      </div>

      {/* Admin Dropdown */}
      <div className="relative" ref={adminMenuRef}>
        <button
          id="admin-menu-button"
          onClick={() => { 
            setIsAdminOpen(!isAdminOpen);
            setIsTenantsOpen(false); // Close other menus
          }}
          className="flex items-center space-x-1 bg-blue-600 hover:bg-blue-700 text-white px-2 py-1.5 rounded-md text-xs font-medium transition-colors"
          aria-expanded={isAdminOpen}
          aria-haspopup="true"
        >
          <Shield className="h-3 w-3" />
          <span>Admin</span>
          <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${isAdminOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Admin Dropdown Menu */}
        {isAdminOpen && (
          <div 
            className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="admin-menu-button"
          >
            <button
              onClick={() => { handleNavigation('/'); }}
              className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
              role="menuitem"
            >
              <Home className="h-4 w-4 mr-3" />
              Main Site
            </button>
            
            <button
              onClick={() => { 
                handleNavigation('/admin-dashboard'); 
              }}
              className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
              role="menuitem"
            >
              <Shield className="h-4 w-4 mr-3" />
              Admin Dashboard
            </button>
            
            <button
              onClick={() => { 
                handleNavigation('/tenant-onboarding'); 
              }}
              className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
              role="menuitem"
            >
              <Building2 className="h-4 w-4 mr-3" />
              Tenant Onboarding
            </button>
          </div>
        )}
      </div>

    </div>
  );
};

export default UserMenu;