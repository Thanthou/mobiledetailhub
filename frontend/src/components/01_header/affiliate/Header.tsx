console.log('Header index rendered');
import React, { useEffect, useState } from 'react';
import SocialMediaIcons from '../SocialMediaIcons';
import { NAV_LINKS } from '../constants';
import { useSiteContext } from '../../../hooks/useSiteContext';
import LoginButton from '../LoginButton';
import { useAuth } from '../../../contexts/AuthContext';
import UserMenu from '../UserMenu';

const HeaderAffiliate: React.FC = () => {
  const { businessSlug } = useSiteContext();
  const { user } = useAuth();
  console.log('HeaderAffiliate businessSlug:', businessSlug);

  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [socialMedia, setSocialMedia] = useState<any>({});
  const [businessName, setBusinessName] = useState<string | null>(null);
  const [phone, setPhone] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch('/api/mdh-config').then(res => res.json()),
      businessSlug ? fetch(`/api/businesses/${businessSlug}`).then(res => res.json()) : Promise.resolve(null),
    ])
      .then(([mdhConfig, businessData]) => {
        setLogoUrl(mdhConfig.logo_url);
        setSocialMedia({
          facebook: mdhConfig.facebook,
          instagram: mdhConfig.instagram,
          tiktok: mdhConfig.tiktok,
          youtube: mdhConfig.youtube,
        });
        if (businessData) {
          setBusinessName(businessData.name);
          setPhone(businessData.phone);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [businessSlug]);

  if (loading) {
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

  if (!logoUrl && !businessName) {
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
            {logoUrl && (
              <img src={logoUrl} alt="Logo" className="h-8 w-8 md:h-10 md:w-10" />
            )}
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">{businessName}</h1>
              <div className="text-white text-1g font-semibold">
                {phone && <div>{phone}</div>}
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
            {Object.values(socialMedia).some(Boolean) && (
              <SocialMediaIcons socialMedia={socialMedia} />
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
