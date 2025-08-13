import { useState, useEffect } from 'react';
// No theme system needed - business config is loaded directly

interface BusinessConfig {
  domain: string;
  slug: string;
  business: {
    name: string;
    email: string;
    phone: string;
    smsPhone: string;
    address: string;
    services: string[];
    description: string;
    hours?: string; // Added for new helper
  };
  services: {
    available: string[];
    vehicleTypes: string[];
  };
  booking: {
    link: string;
    enabled: boolean;
  };
  emailNotifications: string[];
  serviceLocations: string[];
  branding: {
    primaryColor: string;
    secondaryColor: string;
    logo: string;
    favicon: string;
  };
  header: {
    businessName: string;
    phone: string;
    location: string;
    navLinks: { name: string; href: string; onClick?: () => void }[];
    socialLinks: {
      facebook?: string;
      instagram?: string;
      tiktok?: string;
      youtube?: string;
    };
  };
  hero: {
    backgroundImage: string;
    headline: string;
    subheadline?: string; // Made optional since it can be commented out
    ctaText: string;
    ctaSubtext: string;
    secondaryCta: string;
  };
  servicesSection: {
    headline: string;
    subheadline: string;
    items: Array<{
      title: string;
      description: string;
      image: string;
      highlights: string[];
    }>;
  };
  faq: {
    headline: string;
    items: Array<{
      question: string;
      answer: string;
    }>;
  };
  contact: {
    headline: string;
    subheadline: string;
    phone: string;
    email: string;
    locations: string[];
  };
  affiliates: {
    headline?: string;
    subheadline?: string;
    // Support both old items structure and new keywords structure
    items?: Array<{
      name: string;
      description: string;
      logo: string;
    }>;
    keywords?: string[];
  };
  footer: {
    businessName: string;
    contactInfo: {
      phone: string;
      email: string;
      location: string;
    };
    quickLinks: Array<{ name: string; href: string }>;
    attribution: {
      text: string;
      link: string;
    };
  };
  attribution: {
    text: string;
    link: string;
  };
  overrides?: { // Added for new helper
    useParentEmail?: boolean;
    useParentPhone?: boolean;
    useParentAddress?: boolean;
    useParentHours?: boolean;
    useParentAttribution?: boolean;
  };
}

interface ParentConfig {
  branding: {
    logo: string;
    colors: {
      primary: string;
      secondary: string;
    };
  };
  socialMedia: {
    facebook?: string;
    instagram?: string;
    tiktok?: string;
    youtube?: string;
  };
  attribution: {
    text: string;
    link: string;
  };
  // Add other parent company specific fields as needed
  business?: { // Added for new helper
    email?: string;
    phone?: string;
    address?: string;
    hours?: string;
  };
}

interface UseBusinessConfigReturn {
  businessConfig: BusinessConfig | null;
  parentConfig: ParentConfig | null;
  isLoading: boolean;
  error: string | null;
  currentBusinessSlug: string | null;
  getBusinessInfoWithOverrides: { // Added for new helper
    name: string;
    email: string;
    phone: string;
    address: string;
    hours: string;
    attribution: string;
  } | null;
}

export const useBusinessConfig = (): UseBusinessConfigReturn => {
  const [businessConfig, setBusinessConfig] = useState<BusinessConfig | null>(null);
  const [parentConfig, setParentConfig] = useState<ParentConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentBusinessSlug, setCurrentBusinessSlug] = useState<string | null>(null);

  // Helper function to get value based on override settings
  const getValueWithOverride = (businessValue: string, parentValue: string, overrideFlag: boolean) => {
    console.log('getValueWithOverride:', { businessValue, parentValue, overrideFlag });
    
    if (overrideFlag && parentValue) {
      console.log('Using parent value:', parentValue);
      return parentValue; // Use parent company value
    }
    
    if (businessValue) {
      console.log('Using business value:', businessValue);
      return businessValue; // Use business value
    }
    
    console.log('Falling back to parent value:', parentValue);
    return parentValue; // Fallback to parent if business value is empty
  };

  // Helper function to get business info with overrides applied
  const getBusinessInfoWithOverrides = () => {
    if (!businessConfig || !parentConfig) {
      console.log('Missing configs:', { businessConfig: !!businessConfig, parentConfig: !!parentConfig });
      return null;
    }

    console.log('Applying overrides:', businessConfig.overrides);
    console.log('Business values:', businessConfig.business);
    console.log('Parent values:', parentConfig.business);

    const result = {
      name: businessConfig.business.name,
      email: getValueWithOverride(
        businessConfig.business.email,
        parentConfig.business?.email || '',
        businessConfig.overrides?.useParentEmail || false
      ),
      phone: getValueWithOverride(
        businessConfig.business.phone,
        parentConfig.business?.phone || '',
        businessConfig.overrides?.useParentPhone || false
      ),
      address: getValueWithOverride(
        businessConfig.business.address,
        parentConfig.business?.address || '',
        businessConfig.overrides?.useParentAddress || false
      ),
      hours: getValueWithOverride(
        businessConfig.business.hours || '',
        parentConfig.business?.hours || '',
        businessConfig.overrides?.useParentHours || false
      ),
      attribution: getValueWithOverride(
        businessConfig.attribution?.text || '',
        parentConfig.attribution?.text || '',
        businessConfig.overrides?.useParentAttribution || false
      )
    };

    console.log('Final result with overrides:', result);
    return result;
  };

  useEffect(() => {
    const loadConfigs = async () => {
      try {
        setIsLoading(true);
        setError(null);

        console.log('useBusinessConfig: Starting to load configs...');

        // Detect business from URL or default to 'mdh'
        let businessSlug = 'mdh';
        
        // Check if there's a business in the URL path
        const pathParts = window.location.pathname.split('/');
        if (pathParts.length > 1 && ['jps', 'mdh', 'abc'].includes(pathParts[1])) {
          businessSlug = pathParts[1];
        }
        
        // Check if there's a business query parameter
        const urlParams = new URLSearchParams(window.location.search);
        const businessFromQuery = urlParams.get('business');
        if (businessFromQuery && ['jps', 'mdh', 'abc'].includes(businessFromQuery)) {
          businessSlug = businessFromQuery;
        }
        
        console.log('useBusinessConfig: Detected business slug:', businessSlug);
        
        setCurrentBusinessSlug(businessSlug);

        // Load business-specific config
        console.log('useBusinessConfig: Loading business config for:', businessSlug);
        const businessResponse = await fetch(`http://localhost:3001/api/business-config/${businessSlug}`);
        console.log('useBusinessConfig: Business response status:', businessResponse.status);
        
        if (!businessResponse.ok) {
          throw new Error(`Failed to load business config: ${businessResponse.status}`);
        }
        
        const businessData: BusinessConfig = await businessResponse.json();
        console.log('useBusinessConfig: Business config loaded:', businessData);
        setBusinessConfig(businessData);

        // Load parent company config (MDH)
        console.log('useBusinessConfig: Loading parent config for: mdh');
        const parentResponse = await fetch('http://localhost:3001/api/business-config/mdh');
        console.log('useBusinessConfig: Parent response status:', parentResponse.status);
        
        if (parentResponse.ok) {
          const parentData: ParentConfig = await parentResponse.json();
          console.log('useBusinessConfig: Parent config loaded:', parentData);
          setParentConfig(parentData);
        } else {
          console.warn('useBusinessConfig: Failed to load parent config, using defaults');
          // Set default parent config if MDH config not available
          setParentConfig({
            branding: {
              logo: '/favicon.png',
              colors: {
                primary: '#1aa5ff',
                secondary: '#f4a72c'
              }
            },
            socialMedia: {
              facebook: 'https://facebook.com/mobiledetailhub',
              instagram: 'https://instagram.com/mobiledetailhub',
              tiktok: 'https://tiktok.com/@mobiledetailhub',
              youtube: 'https://youtube.com/@mobiledetailhub'
            },
            attribution: {
              text: 'Powered by MobileDetailHub',
              link: 'https://mobiledetailhub.com'
            }
          });
        }

        console.log('useBusinessConfig: All configs loaded successfully');

      } catch (err) {
        console.error('useBusinessConfig: Error loading configs:', err);
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    loadConfigs();
  }, []);

  return {
    businessConfig,
    parentConfig,
    isLoading,
    error,
    currentBusinessSlug,
    getBusinessInfoWithOverrides: getBusinessInfoWithOverrides()
  };
};
