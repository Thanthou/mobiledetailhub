import React from 'react';
import { useBusinessConfig } from '../hooks/useBusinessConfig';
import { getAffiliates } from '../config/affiliates';

const Affiliates: React.FC = () => {
  const { businessConfig, isLoading, error } = useBusinessConfig();

  // Show loading state while waiting for config
  if (isLoading || !businessConfig) {
    return (
      <section className="bg-stone-800 py-10">
        <div className="w-full">
          <div className="text-center text-white">Loading affiliates...</div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-stone-800 py-10">
        <div className="w-full">
          <div className="text-center text-white">Error loading affiliates: {error}</div>
        </div>
      </section>
    );
  }

  // Get affiliates data from business config
  const { affiliates } = businessConfig;
  
  // Handle both old items structure and new keywords structure
  let affiliateItems: any[] = [];
  
  if (affiliates?.keywords && affiliates.keywords.length > 0) {
    // New keyword-based system
    affiliateItems = getAffiliates(affiliates.keywords);
  } else if (affiliates?.items && affiliates.items.length > 0) {
    // Old items-based system (for backward compatibility)
    affiliateItems = affiliates.items;
  }
  
  // If no affiliates data in config, show default affiliates
  if (!affiliates || affiliateItems.length === 0) {
    return (
      <section className="bg-stone-800 py-10">
        <div className="w-full">
          <div className="text-center text-white">Affiliates section not configured</div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-stone-800 py-10">
      <div className="w-full">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">
            {affiliates.headline || 'Trusted brands we work with'}
          </h2>
        </div>
       
        <div className="flex justify-center items-center gap-4">
          {affiliateItems.map((affiliate, index) => (
            <a
              key={index}
              href={affiliate.url || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center"
              onClick={(e) => {
                // Prevent navigation if no URL
                if (!affiliate.url) {
                  e.preventDefault();
                }
              }}
            >
              <div className="w-40 h-40 bg-black rounded-full flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl overflow-hidden">
                <img 
                  src={affiliate.logo} 
                  alt={affiliate.name}
                  className={`object-contain ${affiliate.scale || 'scale-75'} ${affiliate.verticalPosition || 'translate-y-0'} ${affiliate.horizontalPosition || 'translate-x-0'}`} // Use individual scale, vertical and horizontal position from affiliate config
                  onError={(e) => {
                    // Fallback if image fails to load
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.nextElementSibling?.classList.remove('hidden');
                  }}
                />
                {/* Fallback text if image fails */}
                <span className="hidden text-white text-lg font-bold text-center px-4">
                  {affiliate.name}
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Affiliates; 