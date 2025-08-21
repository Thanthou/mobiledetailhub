import React from 'react';
import SocialMediaIcons from '../SocialMediaIcons';
import { NAV_LINKS } from '../constants';
import { useSiteContext } from '../../../hooks/useSiteContext';
import { useLocation } from '../../../contexts/LocationContext';
import LocationEditModal from '../../shared/LocationEditModal';
import { scrollToTop } from '../../../utils/scrollToTop';
import LoginButton from '../LoginButton';
import { useAuth } from '../../../contexts/AuthContext';
import UserMenu from '../UserMenu';
import { useAffiliate } from '../../../contexts/AffiliateContext';
import { useMDHConfig } from '../../../contexts/MDHConfigContext';

const HeaderAffiliate: React.FC = () => {
  const { businessSlug } = useSiteContext();
  const { user } = useAuth();
  const { selectedLocation } = useLocation();
  const { affiliateData, isLoading: affiliateLoading, error: affiliateError } = useAffiliate();
  const { mdhConfig, isLoading: mdhLoading, error: mdhError } = useMDHConfig();
  
  console.log('HeaderAffiliate businessSlug:', businessSlug);

  const isLoading = affiliateLoading || mdhLoading;
  const hasError = affiliateError || mdhError;

  if (isLoading) {
    return (
      <header className="fixed top-0 z-50 bg-black/20 backdrop-blur-sm w-full">
        <div className="w-full py-4">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-white text-center">Loading...</div>
          </div>
        </div>
      </header>
    );
  }

  if (hasError || !mdhConfig || !affiliateData) {
    return (
      <header className="fixed top-0 z-50 bg-black/20 backdrop-blur-sm w-full">
        <div className="w-full py-4">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-white text-center">Header placeholder</div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="fixed top-0 z-50 bg-black/20 backdrop-blur-sm w-full">
      <div className="w-full py-4">
        <div className="max-w-7xl mx-auto flex items-center px-4">
          {/* 1. Logo/Business Name/Info */}
          <div className="flex items-center space-x-3">
            {mdhConfig.logo_url && (
              <button 
                onClick={scrollToTop}
                className="hover:opacity-80 transition-opacity duration-200 cursor-pointer"
              >
                <img src={mdhConfig.logo_url} alt="Logo" className="h-8 w-8 md:h-10 md:w-10" />
              </button>
            )}
            <div>
              <button 
                onClick={scrollToTop}
                className="hover:opacity-80 transition-opacity duration-200 cursor-pointer text-left"
              >
                <h1 className="text-2xl md:text-3xl font-bold text-white">{affiliateData.name}</h1>
              </button>
                             <div className="text-white text-sm md:text-base font-semibold">
                 <div className="flex items-center space-x-2">
                   {affiliateData.phone && <span>{affiliateData.phone}</span>}
                   {affiliateData.phone && selectedLocation && <span className="text-orange-400">•</span>}
                   {selectedLocation && (
                     <LocationEditModal
                       placeholder="Enter new location"
                       buttonClassName="text-white hover:text-orange-400 text-sm md:text-base font-semibold hover:underline cursor-pointer"
                       fallbackText={selectedLocation.fullLocation}
                       showIcon={false}
                     />
                   )}
                 </div>
               </div>
            </div>
          </div>

          {/* 2. Links/Social Media */}
          <div className="flex items-center space-x-4 ml-auto">
            <nav className="flex space-x-4">
              {NAV_LINKS.map(link => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-white hover:text-orange-400 transition-colors duration-200"
                >
                  {link.name}
                </a>
              ))}
            </nav>
            {(mdhConfig.facebook || mdhConfig.instagram || mdhConfig.tiktok || mdhConfig.youtube) && (
              <SocialMediaIcons socialMedia={{
                facebook: mdhConfig.facebook,
                instagram: mdhConfig.instagram,
                tiktok: mdhConfig.tiktok,
                youtube: mdhConfig.youtube,
              }} />
            )}
          </div>

          {/* 3. Login/User */}
          <div className="ml-6">
            {user ? <UserMenu /> : <LoginButton />}
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeaderAffiliate;
