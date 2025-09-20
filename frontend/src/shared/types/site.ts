export type SiteState = 'mdh' | 'affiliate';

export interface SiteContextType {
  siteState: SiteState;
  currentLocation: {
    slug: string;
    city: string;
    state: string;
    affiliate: string;
  } | null;
  businessData: {
    name: string;
    phone: string;
    email: string;
    url: string;
    logo: string;
    description: string;
    services: string[];
    hours: string;
    serviceAreas: Array<{
      city: string;
      state: string;
      zip: string;
    }>;
  } | null;
  isLoading: boolean;
  hasError: boolean;
}

export interface SiteActions {
  setLocation: (locationSlug: string) => void;
  clearLocation: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: boolean) => void;
}
