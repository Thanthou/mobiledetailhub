import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { getAreaBySlug } from '@/shared/utils';
import { SiteContextType, SiteActions, SiteState } from '@/shared/types/site';

// Action types
type SiteAction = 
  | { type: 'SET_LOCATION'; payload: { locationSlug: string } }
  | { type: 'CLEAR_LOCATION' }
  | { type: 'SET_LOADING'; payload: { loading: boolean } }
  | { type: 'SET_ERROR'; payload: { error: boolean } }
  | { type: 'SET_BUSINESS_DATA'; payload: { businessData: any } };

// Initial state
const initialState: SiteContextType = {
  siteState: 'mdh',
  currentLocation: null,
  businessData: null,
  isLoading: false,
  hasError: false,
};

// Reducer
function siteReducer(state: SiteContextType, action: SiteAction): SiteContextType {
  switch (action.type) {
    case 'SET_LOCATION':
      return {
        ...state,
        siteState: 'affiliate',
        currentLocation: {
          slug: action.payload.locationSlug,
          city: '',
          state: '',
          affiliate: '',
        },
        isLoading: true,
        hasError: false,
      };
    
    case 'CLEAR_LOCATION':
      return {
        ...state,
        siteState: 'mdh',
        currentLocation: null,
        businessData: null,
        isLoading: false,
        hasError: false,
      };
    
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload.loading,
      };
    
    case 'SET_ERROR':
      return {
        ...state,
        hasError: action.payload.error,
        isLoading: false,
      };
    
    case 'SET_BUSINESS_DATA':
      return {
        ...state,
        businessData: action.payload.businessData,
        isLoading: false,
        hasError: false,
      };
    
    default:
      return state;
  }
}

// Context
const SiteContext = createContext<(SiteContextType & SiteActions) | null>(null);

// Provider component
export const SiteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(siteReducer, initialState);
  const location = useLocation();

  // Auto-detect location from URL
  useEffect(() => {
    try {
      const pathSegments = location.pathname.split('/').filter(Boolean);
      
      if (pathSegments.length >= 2) {
        const stateCode = pathSegments[0];
        const city = pathSegments[1];
        const locationSlug = `${stateCode}-${city}`;
        
        // Only update if it's different from current location
        if (state.currentLocation?.slug !== locationSlug) {
          dispatch({ type: 'SET_LOCATION', payload: { locationSlug } });
          
          // Load business data
          try {
            const areaData = getAreaBySlug(locationSlug);
            const businessData = areaData ? {
              businessName: areaData.affiliate,
              businessPhone: '',
              city: areaData.city,
              state: areaData.state
            } : null;
            if (businessData) {
              dispatch({ 
                type: 'SET_BUSINESS_DATA', 
                payload: { 
                  businessData: {
                    name: businessData.businessName,
                    phone: businessData.businessPhone,
                    city: businessData.city,
                    state: businessData.state,
                  }
                } 
              });
            } else {
              console.warn('No business data found for location:', locationSlug);
              dispatch({ type: 'SET_ERROR', payload: { error: true } });
            }
          } catch (error) {
            console.error('Error loading business data:', error);
            dispatch({ type: 'SET_ERROR', payload: { error: true } });
          }
        }
      } else {
        // On main site (no location specified)
        if (state.siteState !== 'mdh') {
          dispatch({ type: 'CLEAR_LOCATION' });
        }
      }
    } catch (error) {
      console.error('Error in SiteContext location detection:', error);
      dispatch({ type: 'SET_ERROR', payload: { error: true } });
    }
  }, [location.pathname, state.currentLocation?.slug, state.siteState]);

  // Actions
  const actions: SiteActions = {
    setLocation: (locationSlug: string) => {
      dispatch({ type: 'SET_LOCATION', payload: { locationSlug } });
    },
    
    clearLocation: () => {
      dispatch({ type: 'CLEAR_LOCATION' });
    },
    
    setLoading: (loading: boolean) => {
      dispatch({ type: 'SET_LOADING', payload: { loading } });
    },
    
    setError: (error: boolean) => {
      dispatch({ type: 'SET_ERROR', payload: { error } });
    },
  };

  const contextValue = {
    ...state,
    ...actions,
  };

  return (
    <SiteContext.Provider value={contextValue}>
      {children}
    </SiteContext.Provider>
  );
};

// Hook to use the context
export const useSiteState = () => {
  const context = useContext(SiteContext);
  if (!context) {
    console.error('useSiteState must be used within a SiteProvider');
    // Return a safe fallback instead of throwing
    return {
      siteState: 'mdh' as const,
      currentLocation: null,
      businessData: null,
      isLoading: false,
      hasError: false,
      setLocation: () => {},
      clearLocation: () => {},
      setLoading: () => {},
      setError: () => {},
    };
  }
  return context;
};
