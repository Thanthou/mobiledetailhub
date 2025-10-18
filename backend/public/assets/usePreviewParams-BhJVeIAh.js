const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./index-BbwpX3nH.js","./content-defaults-Df6c8CcD.js","./seo-defaults-2tSsldvQ.js","./react-vendor-DQPnB1La.js","./vendor-70dlA11R.js","./query-vendor-B2vaS9Wk.js","./index-C31ODCSt.js","./index-DTw_9gfh.js","./index-D3OeRrNe.js","./RequestQuoteModal-BRMwHJKh.js","./api-BcBw9jk9.js","./index-Lf2ND122.js"])))=>i.map(i=>d[i]);
import { r as reactExports, j as jsxRuntimeExports, ah as useQuery, F as useParams, q as React, at as create, aj as Link, u as useNavigate, N as Navigate, a as Star, U as Users, m as Sparkles, b as Shield, an as CreditCard, y as MapPin, v as Car, S as Settings, a0 as Search, c as X, a1 as reactDomExports, I as ChevronDown, au as SiFacebook, av as SiInstagram, aw as SiTiktok, ax as SiYoutube, ay as Menu, _ as ChevronLeft, J as ChevronRight, as as useSearchParams, l as Phone, M as Mail } from './react-vendor-DQPnB1La.js';
import { o as object, b as string, d as boolean, _ as _enum, t as twMerge, f as clsx, n as number, g as array, u as union, r as record, h as unknown, Z as ZodError, P as PropTypes, j as any, k as url, e as email } from './vendor-70dlA11R.js';

true&&(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
}());

const getApiBaseUrl = () => {
  {
    return "";
  }
};
const API_BASE_URL$2 = getApiBaseUrl();
const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL$2}/api/auth/login`,
    ME: `${API_BASE_URL$2}/api/auth/me`,
    LOGOUT: `${API_BASE_URL$2}/api/auth/logout`
  },
  HEALTH: `${API_BASE_URL$2}/api/health`
};

const AuthContext = reactExports.createContext(void 0);
const AuthProvider = ({ children }) => {
  const [user, setUser] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(true);
  const [error, setError] = reactExports.useState(null);
  reactExports.useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      fetch(API_ENDPOINTS.AUTH.ME, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      }).then((res) => res.json()).then((data) => {
        if (data.success) {
          setUser(data);
        } else {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
        }
      }).catch(() => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      }).finally(() => {
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);
  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(API_ENDPOINTS.AUTH.LOGIN, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(credentials)
      });
      const data = await response.json();
      if (data.success) {
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
        setUser(data.user);
        return true;
      } else {
        setError(data.error || "Login failed");
        return false;
      }
    } catch (err) {
      setError("Network error. Please try again.");
      return false;
    } finally {
      setLoading(false);
    }
  };
  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setUser(null);
  };
  const value = {
    user,
    loading,
    error,
    login,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.is_admin || false
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AuthContext.Provider, { value, children });
};
const useAuth = () => {
  const context = reactExports.useContext(AuthContext);
  if (context === void 0) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

const scriptRel = 'modulepreload';const assetsURL = function(dep, importerUrl) { return new URL(dep, importerUrl).href };const seen = {};const __vitePreload = function preload(baseModule, deps, importerUrl) {
  let promise = Promise.resolve();
  if (true && deps && deps.length > 0) {
    const links = document.getElementsByTagName("link");
    const cspNonceMeta = document.querySelector(
      "meta[property=csp-nonce]"
    );
    const cspNonce = cspNonceMeta?.nonce || cspNonceMeta?.getAttribute("nonce");
    promise = Promise.allSettled(
      deps.map((dep) => {
        dep = assetsURL(dep, importerUrl);
        if (dep in seen) return;
        seen[dep] = true;
        const isCss = dep.endsWith(".css");
        const cssSelector = isCss ? '[rel="stylesheet"]' : "";
        const isBaseRelative = !!importerUrl;
        if (isBaseRelative) {
          for (let i = links.length - 1; i >= 0; i--) {
            const link2 = links[i];
            if (link2.href === dep && (!isCss || link2.rel === "stylesheet")) {
              return;
            }
          }
        } else if (document.querySelector(`link[href="${dep}"]${cssSelector}`)) {
          return;
        }
        const link = document.createElement("link");
        link.rel = isCss ? "stylesheet" : scriptRel;
        if (!isCss) {
          link.as = "script";
        }
        link.crossOrigin = "";
        link.href = dep;
        if (cspNonce) {
          link.setAttribute("nonce", cspNonce);
        }
        document.head.appendChild(link);
        if (isCss) {
          return new Promise((res, rej) => {
            link.addEventListener("load", res);
            link.addEventListener(
              "error",
              () => rej(new Error(`Unable to preload CSS for ${dep}`))
            );
          });
        }
      })
    );
  }
  function handlePreloadError(err) {
    const e = new Event("vite:preloadError", {
      cancelable: true
    });
    e.payload = err;
    window.dispatchEvent(e);
    if (!e.defaultPrevented) {
      throw err;
    }
  }
  return promise.then((res) => {
    for (const item of res || []) {
      if (item.status !== "rejected") continue;
      handlePreloadError(item.reason);
    }
    return baseModule().catch(handlePreloadError);
  });
};

async function fetchIndustryConfig(industry) {
  try {
    switch (industry) {
      case "mobile-detailing": {
        const { loadMobileDetailingConfig } = await __vitePreload(async () => { const { loadMobileDetailingConfig } = await import('./index-BbwpX3nH.js');return { loadMobileDetailingConfig }},true?__vite__mapDeps([0,1,2,3,4,5]):void 0,import.meta.url);
        return loadMobileDetailingConfig();
      }
      case "pet-grooming": {
        const { loadPetGroomingConfig } = await __vitePreload(async () => { const { loadPetGroomingConfig } = await import('./index-C31ODCSt.js');return { loadPetGroomingConfig }},true?__vite__mapDeps([6,3,4,5]):void 0,import.meta.url);
        return await loadPetGroomingConfig();
      }
      case "maid-service": {
        const { loadMaidServiceConfig } = await __vitePreload(async () => { const { loadMaidServiceConfig } = await import('./index-DTw_9gfh.js');return { loadMaidServiceConfig }},true?__vite__mapDeps([7,3,4,5]):void 0,import.meta.url);
        return await loadMaidServiceConfig();
      }
      case "lawncare": {
        const { loadLawncareConfig } = await __vitePreload(async () => { const { loadLawncareConfig } = await import('./index-D3OeRrNe.js');return { loadLawncareConfig }},true?__vite__mapDeps([8,3,4,5]):void 0,import.meta.url);
        return await loadLawncareConfig();
      }
      default:
        console.warn(`Unknown industry: ${industry}`);
        return null;
    }
  } catch (error) {
    console.error(`Failed to load config for industry: ${industry}`, error);
    return null;
  }
}

const __vite_import_meta_env__ = {"BASE_URL": "./", "DEV": false, "MODE": "production", "PROD": true, "SSR": false, "VITE_API_URL_LIVE": "https://thatsmartsite.onrender.com", "VITE_GOOGLE_CLIENT_ID": "1234567890-abcdefg.apps.googleusercontent.com", "VITE_GOOGLE_MAPS_API_KEY": "AIzaSyDM7hg-lMTC1YY43JVBqtB7nGKx09XVFT8", "VITE_STRIPE_PUBLISHABLE_KEY": "pk_test_51SICKVFg0l3R2Dfo1laXSOBzj8jMU2fDRsl2Gh4SKZ0ElGShLXccEy4GVqNpuS40geSpFrn28gXrZdtjavNc39KP00IeaYiwqq"};
const EnvSchema = object({
  // Vite built-in variables
  MODE: _enum(["development", "production", "test"]),
  DEV: boolean(),
  PROD: boolean(),
  // API Configuration
  VITE_API_URL: string().optional(),
  VITE_API_URL_LOCAL: string().optional(),
  VITE_API_URL_LIVE: string().optional(),
  VITE_API_BASE_URL: string().optional(),
  // Third-party API Keys
  VITE_GOOGLE_MAPS_API_KEY: string().optional(),
  VITE_STRIPE_PUBLISHABLE_KEY: string().optional(),
  // Feature Flags
  VITE_ENABLE_SW: string().optional()
  // Service worker flag ('1' or '0')
});
const env = EnvSchema.parse(__vite_import_meta_env__);
const config = {
  // Environment
  isDevelopment: env.DEV,
  isProduction: env.PROD,
  mode: env.MODE,
  // API Configuration
  apiBaseUrl: env.VITE_API_BASE_URL || "/api",
  // Use relative path for Vite proxy
  apiUrl: env.PROD ? env.VITE_API_URL_LIVE || "" : "",
  // Force empty in dev to use Vite proxy
  apiUrls: {
    local: env.VITE_API_URL_LOCAL || "http://localhost:3001",
    live: env.VITE_API_URL_LIVE || ""
  },
  // Third-party Services
  googleMapsApiKey: env.VITE_GOOGLE_MAPS_API_KEY,
  stripePublishableKey: env.VITE_STRIPE_PUBLISHABLE_KEY || "pk_test_placeholder",
  // Feature Flags
  serviceWorkerEnabled: env.VITE_ENABLE_SW === "1" && env.PROD
};

const API_BASE_URL$1 = env.VITE_API_URL || "";
async function fetchTenantBySlug(slug) {
  try {
    const response = await fetch(`${API_BASE_URL$1}/api/tenants/${slug}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch tenant: ${response.status}`);
    }
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching tenant:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    };
  }
}
async function fetchBusinessBySlug(slug) {
  const response = await fetch(`${API_BASE_URL$1}/api/tenants/${slug}`);
  if (!response.ok) {
    throw new Error("Failed to fetch business data");
  }
  const result = await response.json();
  if (!result.success) {
    throw new Error("API returned error");
  }
  return result.data;
}

function useTenantData(options) {
  const {
    slug,
    enabled = true,
    staleTime = 10 * 60 * 1e3,
    // 10 minutes
    retry = 2
  } = options;
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["shared", "business", slug],
    queryFn: () => {
      if (!slug) {
        throw new Error("Slug is required to fetch business data");
      }
      return fetchBusinessBySlug(slug);
    },
    enabled: enabled && !!slug,
    staleTime,
    retry
  });
  return {
    data,
    isLoading,
    error: error || null,
    refetch: () => {
      void refetch();
    }
  };
}

const CUSTOM_DOMAIN_MAPPINGS = {
  "jpsdetailing.com": "jps",
  "example.com": "example",
  "thatsmartsite.com": "main-site",
  // Main site for admin dashboard
  "thatsmartsite-backend.onrender.com": "main-site"
  // Render URL for admin dashboard
  // Add more domain mappings as needed
};
const RESERVED_SUBDOMAINS = ["www", "thatsmartsite", "api", "admin", "staging", "dev", "main-site"];
function getTenantFromSubdomain(hostname) {
  if (!hostname.includes(".")) {
    return null;
  }
  const parts = hostname.split(".");
  const subdomain = parts[0];
  if (!subdomain || RESERVED_SUBDOMAINS.includes(subdomain)) {
    return null;
  }
  const domain = parts.slice(-2).join(".");
  if (domain === "thatsmartsite.com" || domain === "lvh.me") {
    return subdomain;
  }
  return null;
}
function getTenantFromCustomDomain(hostname) {
  return CUSTOM_DOMAIN_MAPPINGS[hostname] || null;
}
function getTenantFromDomain(hostname = window.location.hostname, defaultSlug = "main-site") {
  const subdomainSlug = getTenantFromSubdomain(hostname);
  if (subdomainSlug) {
    return subdomainSlug;
  }
  const customDomainSlug = getTenantFromCustomDomain(hostname);
  if (customDomainSlug) {
    return customDomainSlug;
  }
  return defaultSlug;
}

function useTenantSlug() {
  const params = useParams();
  const domainSlug = getTenantFromDomain();
  if (domainSlug && domainSlug !== "main-site") {
    return domainSlug;
  }
  if (env.DEV) {
    return params["businessSlug"] || params["tenantSlug"] || params["slug"];
  }
  return void 0;
}

function transformSocialMedia(business) {
  const socials = {};
  if (business.facebook_enabled) {
    socials.facebook = business.facebook_url?.trim() || "";
  }
  if (business.instagram_enabled) {
    socials.instagram = business.instagram_url?.trim() || "";
  }
  if (business.youtube_enabled) {
    socials.youtube = business.youtube_url?.trim() || "";
  }
  if (business.tiktok_enabled) {
    socials.tiktok = business.tiktok_url?.trim() || "";
  }
  if (business.gbp_url?.trim()) {
    socials.googleBusiness = business.gbp_url;
  }
  return socials;
}
function getPrimaryLocation(business) {
  if (business.service_areas.length === 0) {
    return "";
  }
  const primaryArea = business.service_areas.find((area2) => area2.primary);
  const area = primaryArea ?? business.service_areas[0];
  if (!area) {
    return "";
  }
  return `${area.city}, ${area.state}`;
}
function getBusinessEmail(business, fallback = "hello@thatsmartsite.com") {
  return business.business_email?.trim() || fallback;
}

const DataContext = reactExports.createContext(null);
const DataProvider = ({ children }) => {
  const slug = useTenantSlug();
  const { data: businessData, isLoading: isLoadingBusiness } = useTenantData({
    slug
  });
  const industry = businessData?.industry || "mobile-detailing";
  const { data: siteConfig, isLoading: isLoadingSiteConfig } = useQuery({
    queryKey: ["shared", "siteConfig", industry],
    queryFn: () => fetchIndustryConfig(industry),
    enabled: !!businessData?.industry,
    staleTime: 10 * 60 * 1e3,
    // 10 minutes
    retry: 2
  });
  const isLoading = isLoadingBusiness || isLoadingSiteConfig;
  const transformedSocialMedia = businessData ? transformSocialMedia(businessData) : {};
  const contextValue = {
    // Tenant data with fallbacks
    businessName: businessData?.business_name || "Loading...",
    phone: businessData?.business_phone || "",
    email: businessData ? getBusinessEmail(businessData) : "service@thatsmartsite.com",
    owner: businessData?.owner || "",
    location: businessData ? getPrimaryLocation(businessData) : "",
    industry: businessData?.industry || "mobile-detailing",
    serviceAreas: businessData?.service_areas || [],
    // Social media (filtered and transformed)
    socialMedia: transformedSocialMedia,
    // Industry config
    siteConfig: siteConfig || null,
    // Status
    isLoading,
    isTenant: true,
    // Always a tenant page
    isPreview: false
    // Regular tenant page, not preview
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(DataContext.Provider, { value: contextValue, children });
};

reactExports.createContext(null);

function getDefaultExtension(type) {
  if (type === "favicon") return "svg";
  if (type.startsWith("logo")) return "webp";
  return "webp";
}
function getAssetSubdirectory(type) {
  if (type === "avatar") return "avatars";
  if (type === "gallery") return "gallery";
  if (type.startsWith("hero")) return "hero";
  if (type.startsWith("logo") || type === "favicon") return "icons";
  if (type === "og-image" || type === "twitter-image") return "social";
  return "images";
}
function getAssetFilename(type, customFilename, extension) {
  if (customFilename) {
    if (/\.(webp|png|jpg|jpeg|svg|gif)$/i.test(customFilename)) {
      return customFilename;
    }
    return `${customFilename}.${extension || "webp"}`;
  }
  const ext = extension || getDefaultExtension(type);
  switch (type) {
    case "logo":
      return `logo.${ext}`;
    case "logo-dark":
      return `logo-dark.${ext}`;
    case "logo-light":
      return `logo-light.${ext}`;
    case "favicon":
      return `favicon.${ext}`;
    case "hero":
    case "hero-1":
      return `hero1.${ext}`;
    case "hero-2":
      return `hero2.${ext}`;
    case "hero-3":
      return `hero3.${ext}`;
    case "og-image":
      return `og-image.${ext}`;
    case "twitter-image":
      return `twitter-image.${ext}`;
    default:
      return `${type}.${ext}`;
  }
}
function getTenantUploadUrl(tenantId, type, filename) {
  const subdirectory = getAssetSubdirectory(type);
  if (type === "avatar") {
    return `/uploads/avatars/${filename}`;
  }
  return `/uploads/${tenantId}/${subdirectory}/${filename}`;
}
function getVerticalDefaultUrl(vertical, type, filename) {
  const subdirectory = getAssetSubdirectory(type);
  return `/${vertical}/${subdirectory}/${filename}`;
}
function getTenantAssetUrl(options) {
  const {
    tenantId,
    vertical,
    type,
    filename: customFilename,
    extension,
    useTenantUploads = true,
    forceVerticalDefault = false
  } = options;
  const filename = getAssetFilename(type, customFilename, extension);
  if (forceVerticalDefault) {
    return getVerticalDefaultUrl(vertical, type, filename);
  }
  if (type === "avatar") {
    return `/uploads/avatars/${filename}`;
  }
  if (tenantId && useTenantUploads) {
    return getTenantUploadUrl(tenantId, type, filename);
  }
  return getVerticalDefaultUrl(vertical, type, filename);
}

function isValidVertical(value) {
  return typeof value === "string" && [
    "mobile-detailing",
    "pet-grooming",
    "lawn-care",
    "maid-service",
    "hvac",
    "plumbing",
    "electrical"
  ].includes(value);
}
function tenantConfigToLegacy(config) {
  return {
    business_name: config.branding.businessName,
    phone: config.contact.phones.main,
    email: config.contact.emails.primary,
    logo_url: config.branding.logo.url,
    facebook: config.contact.socials.facebook,
    instagram: config.contact.socials.instagram,
    tiktok: config.contact.socials.tiktok,
    youtube: config.contact.socials.youtube,
    base_location: {
      city: config.contact.baseLocation.city,
      state: config.contact.baseLocation.state
    }
  };
}
function affiliateToTenantConfig(affiliate) {
  const primaryArea = affiliate.service_areas?.find((area) => area.primary) || affiliate.service_areas?.[0];
  const vertical = isValidVertical(affiliate.industry) ? affiliate.industry : "mobile-detailing";
  const logoUrl = affiliate.logo_url || getTenantAssetUrl({
    vertical,
    type: "logo",
    forceVerticalDefault: true
    // Always use industry default if no custom logo
  });
  return {
    // Core identity
    id: affiliate.id || affiliate.slug || "unknown",
    slug: affiliate.slug || affiliate.business_name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    vertical,
    status: "active",
    // Branding
    branding: {
      businessName: affiliate.business_name,
      logo: {
        url: logoUrl
      }
    },
    // Contact
    contact: {
      phones: {
        main: affiliate.business_phone
      },
      emails: {
        primary: affiliate.business_email
      },
      socials: {
        facebook: affiliate.facebook_url || "",
        instagram: affiliate.instagram_url || "",
        tiktok: affiliate.tiktok_url || "",
        youtube: affiliate.youtube_url || ""
      },
      baseLocation: {
        city: primaryArea?.city || "Unknown",
        state: primaryArea?.state || "Unknown"
      }
    }
  };
}

const tenantConfigMigration = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  affiliateToTenantConfig,
  tenantConfigToLegacy
}, Symbol.toStringTag, { value: 'Module' }));

const TenantConfigContext = reactExports.createContext(null);
const TenantConfigProvider = ({ children }) => {
  const [tenantConfigState, setTenantConfigState] = reactExports.useState(null);
  const [isLoading, setIsLoading] = reactExports.useState(true);
  const [error, setError] = reactExports.useState(null);
  const { slug } = useParams();
  const currentPath = window.location.pathname;
  const isNonTenantRoute = currentPath.startsWith("/admin-dashboard") || currentPath.startsWith("/tenant-dashboard") || currentPath.startsWith("/tenant-onboarding") || currentPath.startsWith("/login") || currentPath.startsWith("/booking") || currentPath.startsWith("/preview-generator") || currentPath.startsWith("/preview");
  const refreshTenantConfig = reactExports.useCallback(async () => {
    if (!slug || isNonTenantRoute) {
      setTenantConfigState(null);
      setIsLoading(false);
      return;
    }
    try {
      setIsLoading(true);
      setError(null);
      const result = await fetchTenantBySlug(slug);
      if (result.success && result.data) {
        const config = affiliateToTenantConfig({
          id: result.data.id,
          slug: result.data.slug,
          business_name: result.data.business_name,
          business_phone: result.data.business_phone,
          business_email: result.data.business_email,
          facebook_url: result.data.facebook_url,
          instagram_url: result.data.instagram_url,
          tiktok_url: result.data.tiktok_url,
          youtube_url: result.data.youtube_url,
          service_areas: result.data.service_areas,
          industry: result.data.industry,
          logo_url: result.data.logo_url
        });
        setTenantConfigState(config);
      } else {
        setError(result.error || "Failed to load tenant data");
        setTenantConfigState(null);
      }
    } catch (err) {
      console.error("Error refreshing tenant config:", err);
      setError(err instanceof Error ? err.message : "Failed to refresh tenant config");
      setTenantConfigState(null);
    } finally {
      setIsLoading(false);
    }
  }, [slug, isNonTenantRoute]);
  reactExports.useEffect(() => {
    void refreshTenantConfig();
  }, [refreshTenantConfig]);
  const legacyConfig = tenantConfigState ? tenantConfigToLegacy(tenantConfigState) : null;
  const value = {
    tenantConfig: tenantConfigState,
    legacyConfig,
    isLoading,
    error,
    refreshTenantConfig
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(TenantConfigContext.Provider, { value, children });
};

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const Button = React.forwardRef(
  ({
    className,
    variant = "primary",
    size = "md",
    loading = false,
    leftIcon,
    rightIcon,
    children,
    disabled,
    ...props
  }, ref) => {
    const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
    const variants = {
      primary: "bg-orange-500 text-white hover:bg-orange-600",
      secondary: "bg-gray-600 text-white hover:bg-gray-700",
      outline: "border border-gray-300 bg-transparent text-gray-700 hover:bg-gray-50",
      "outline-white": "border border-white bg-transparent text-white hover:bg-white hover:text-gray-900",
      ghost: "text-gray-700 hover:bg-gray-100",
      destructive: "bg-red-500 text-white hover:bg-red-600"
    };
    const sizes = {
      sm: "h-9 px-3 text-sm",
      md: "h-10 px-4 py-2",
      lg: "h-11 px-8 text-lg",
      xl: "h-14 px-10 text-xl"
    };
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        className: cn(
          baseStyles,
          variants[variant],
          sizes[size],
          className
        ),
        disabled: disabled || loading,
        ref,
        ...props,
        children: [
          loading && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "svg",
            {
              className: "mr-2 h-4 w-4 animate-spin",
              xmlns: "http://www.w3.org/2000/svg",
              fill: "none",
              viewBox: "0 0 24 24",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "circle",
                  {
                    className: "opacity-25",
                    cx: "12",
                    cy: "12",
                    r: "10",
                    stroke: "currentColor",
                    strokeWidth: "4"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "path",
                  {
                    className: "opacity-75",
                    fill: "currentColor",
                    d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  }
                )
              ]
            }
          ),
          !loading && leftIcon && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mr-2", children: leftIcon }),
          children,
          !loading && rightIcon && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-2", children: rightIcon })
        ]
      }
    );
  }
);
Button.displayName = "Button";

const Badge = React.forwardRef(
  ({ className, variant = "default", size = "md", dot = false, children, ...props }, ref) => {
    const baseStyles = "inline-flex items-center rounded-full font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2";
    const variants = {
      default: "bg-primary text-primary-foreground hover:bg-primary/80",
      secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
      destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/80",
      outline: "text-foreground border border-input",
      success: "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-200",
      warning: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900 dark:text-yellow-200"
    };
    const sizes = {
      sm: "px-2 py-1 text-xs",
      md: "px-2.5 py-0.5 text-sm",
      lg: "px-3 py-1 text-base"
    };
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        ref,
        className: cn(
          baseStyles,
          variants[variant],
          sizes[size],
          className
        ),
        ...props,
        children: [
          dot && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-2 h-2 rounded-full bg-current mr-1.5" }),
          children
        ]
      }
    );
  }
);
Badge.displayName = "Badge";

const FilterChip = React.forwardRef(
  ({
    className,
    isSelected = false,
    icon: Icon,
    children,
    variant = "default",
    size = "md",
    ...props
  }, ref) => {
    const baseStyles = "inline-flex items-center gap-2 rounded-full font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
    const variants = {
      default: isSelected ? "bg-orange-500 text-white shadow-lg shadow-orange-500/30 hover:bg-orange-600" : "bg-stone-800/70 text-stone-200 hover:bg-stone-700/70 hover:text-white border border-stone-600/50",
      outline: isSelected ? "bg-orange-500 text-white border-orange-500 shadow-lg shadow-orange-500/30" : "text-stone-200 border border-stone-600/50 hover:bg-stone-800/50 hover:border-stone-500",
      ghost: isSelected ? "bg-orange-500/20 text-orange-300 hover:bg-orange-500/30" : "text-stone-300 hover:text-white hover:bg-stone-800/50"
    };
    const sizes = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2 text-base",
      lg: "px-6 py-3 text-lg"
    };
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        ref,
        className: cn(
          baseStyles,
          variants[variant],
          sizes[size],
          className
        ),
        ...props,
        children: [
          Icon && /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-4 w-4" }),
          children
        ]
      }
    );
  }
);
FilterChip.displayName = "FilterChip";

const Input = React.forwardRef(
  ({
    className,
    type = "text",
    label,
    error,
    helperText,
    leftIcon,
    rightIcon,
    variant = "default",
    id,
    ...props
  }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substring(2, 11)}`;
    const baseStyles = "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";
    const variants = {
      default: "border-input",
      filled: "border-transparent bg-muted",
      outlined: "border-2 border-input"
    };
    const inputClasses = cn(
      baseStyles,
      variants[variant],
      error && "border-destructive focus-visible:ring-destructive",
      leftIcon && "pl-10",
      rightIcon && "pr-10",
      className
    );
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full", children: [
      label && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "label",
        {
          htmlFor: inputId,
          className: "block text-sm font-medium text-foreground mb-2",
          children: [
            label,
            props.required && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive ml-1", children: "*" })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
        leftIcon && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground", children: leftIcon }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type,
            className: inputClasses,
            ref,
            id: inputId,
            ...props
          }
        ),
        rightIcon && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground", children: rightIcon })
      ] }),
      error && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-destructive", role: "alert", children: error }),
      helperText && !error && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: helperText })
    ] });
  }
);
Input.displayName = "Input";

const Card = React.forwardRef(
  ({ className, variant = "default", padding = "md", ...props }, ref) => {
    const baseStyles = "rounded-lg border bg-card text-card-foreground shadow-sm";
    const variants = {
      default: "border-border",
      outlined: "border-2 border-border",
      elevated: "border-border shadow-lg"
    };
    const paddings = {
      none: "",
      sm: "p-3",
      md: "p-6",
      lg: "p-8"
    };
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        ref,
        className: cn(
          baseStyles,
          variants[variant],
          paddings[padding],
          className
        ),
        ...props
      }
    );
  }
);
Card.displayName = "Card";
const CardHeader = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  "div",
  {
    ref,
    className: cn("flex flex-col space-y-1.5 p-6", className),
    ...props
  }
));
CardHeader.displayName = "CardHeader";
const CardTitle = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  "h3",
  {
    ref,
    className: cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    ),
    ...props,
    children
  }
));
CardTitle.displayName = "CardTitle";
const CardDescription = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  "p",
  {
    ref,
    className: cn("text-sm text-muted-foreground", className),
    ...props
  }
));
CardDescription.displayName = "CardDescription";
const CardContent = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref, className: cn("p-6 pt-0", className), ...props }));
CardContent.displayName = "CardContent";
const CardFooter = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  "div",
  {
    ref,
    className: cn("flex items-center p-6 pt-0", className),
    ...props
  }
));
CardFooter.displayName = "CardFooter";

function formatPhoneNumber(input) {
  if (!input) return "";
  const digitsOnly = input.replace(/\D/g, "");
  const withoutCountryCode = digitsOnly.startsWith("1") && digitsOnly.length > 10 ? digitsOnly.slice(1) : digitsOnly;
  if (withoutCountryCode.length !== 10) {
    return withoutCountryCode;
  }
  const areaCode = withoutCountryCode.slice(0, 3);
  const prefix = withoutCountryCode.slice(3, 6);
  const lineNumber = withoutCountryCode.slice(6, 10);
  return `(${areaCode}) ${prefix}-${lineNumber}`;
}
function getPhoneDigits(input) {
  const digitsOnly = input.replace(/\D/g, "");
  const withoutCountryCode = digitsOnly.startsWith("1") && digitsOnly.length > 10 ? digitsOnly.slice(1) : digitsOnly;
  return withoutCountryCode;
}
function formatPhoneNumberAsTyped(input, cursorPosition) {
  if (!input) return { value: "", cursorPosition: 0 };
  const currentDigits = getPhoneDigits(input);
  if (currentDigits.length >= 10) {
    const formatted = formatPhoneNumber(currentDigits);
    let newPosition = cursorPosition;
    if (cursorPosition > 0) {
      const beforeCursor = input.slice(0, cursorPosition);
      const digitsBeforeCursor = beforeCursor.replace(/\D/g, "").length;
      let digitCount = 0;
      for (let i = 0; i < formatted.length; i++) {
        if (/\d/.test(formatted[i])) {
          digitCount++;
          if (digitCount === digitsBeforeCursor) {
            newPosition = i + 1;
            break;
          }
        }
      }
    }
    return { value: formatted, cursorPosition: newPosition };
  }
  return { value: currentDigits, cursorPosition };
}

const getNextImageIndex = (currentIndex, totalImages) => {
  return (currentIndex + 1) % totalImages;
};
const getPreviousImageIndex = (currentIndex, totalImages) => {
  return currentIndex === 0 ? totalImages - 1 : currentIndex - 1;
};
const preloadImage = (imageUrl) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve();
    };
    img.onerror = () => {
      reject(new Error(`Failed to preload image: ${imageUrl}`));
    };
    img.src = imageUrl;
  });
};
const preloadImages = async (imageUrls) => {
  await Promise.all(imageUrls.map(preloadImage));
};
const getTransitionDuration = (durationMs) => {
  return `${durationMs}ms`;
};
const getImageOpacityClasses = (imageIndex, currentIndex, fadeDuration = 2e3) => {
  const isActive = imageIndex === currentIndex;
  const duration = getTransitionDuration(fadeDuration);
  return `transition-opacity duration-[${duration}] ${isActive ? "opacity-100" : "opacity-0"}`;
};
const getTransitionStyles = (durationMs) => {
  return {
    transitionDuration: getTransitionDuration(durationMs)
  };
};
const validateImageRotationConfig = (config) => {
  const errors = [];
  if (config.images.length === 0) {
    errors.push("Images array cannot be empty");
  }
  if (config.interval && config.interval < 1e3) {
    errors.push("Interval should be at least 1000ms for better UX");
  }
  if (config.fadeDuration && config.fadeDuration < 100) {
    errors.push("Fade duration should be at least 100ms");
  }
  return {
    isValid: errors.length === 0,
    errors
  };
};

({
  enabled: env.DEV});

reactExports.createContext(void 0);

const useData = () => {
  const context = reactExports.useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};
const useDataOptional = () => {
  const context = reactExports.useContext(DataContext);
  return context;
};

const useBrowserTab = (options = {}) => {
  const {
    title: customTitle,
    favicon: customFavicon,
    useBusinessName = true,
    fallbackTitle = "That Smart Site"
  } = options;
  const data = useDataOptional();
  const businessName = data?.businessName || "";
  const industry = data?.industry || "";
  const isDataLoading = data?.isLoading || false;
  const { data: tenantConfig, isLoading: isConfigLoading } = useTenantConfigLoader();
  const logoUrl = tenantConfig?.branding.logo.url;
  const pageTitle = customTitle || (useBusinessName && businessName && businessName !== "Loading..." && businessName !== "undefined" ? businessName : fallbackTitle);
  const faviconUrl = customFavicon || logoUrl || (industry ? getTenantAssetUrl({ vertical: industry, type: "logo" }) : null) || "/shared/icons/logo-white.svg";
  const manifestUrl = data?.slug ? `/${data.slug}/manifest.json` : "/manifest.webmanifest";
  reactExports.useEffect(() => {
    if (!customTitle && !customFavicon && (isDataLoading || isConfigLoading)) {
      return;
    }
    updateTitle(pageTitle);
    {
      updateFavicon(faviconUrl);
    }
    updateManifest(manifestUrl);
  }, [pageTitle, faviconUrl, manifestUrl, customTitle, customFavicon, isDataLoading, isConfigLoading]);
  return {
    title: pageTitle,
    favicon: faviconUrl,
    manifest: manifestUrl
  };
};
function updateTitle(title) {
  const titleElement = document.getElementById("meta-title");
  if (titleElement) {
    titleElement.textContent = title;
  }
  document.title = title;
}
function updateFavicon(url) {
  const faviconElement = document.getElementById("favicon");
  if (faviconElement) {
    faviconElement.href = url;
    if (url.endsWith(".svg")) {
      faviconElement.type = "image/svg+xml";
    } else if (url.endsWith(".png")) {
      faviconElement.type = "image/png";
    } else if (url.endsWith(".ico")) {
      faviconElement.type = "image/x-icon";
    } else if (url.endsWith(".webp")) {
      faviconElement.type = "image/webp";
    }
  }
  const appleTouchIcon = document.getElementById("apple-touch-icon");
  if (appleTouchIcon) {
    appleTouchIcon.href = url;
  }
}
function updateManifest(url) {
  let manifestElement = document.querySelector('link[rel="manifest"]');
  if (!manifestElement) {
    manifestElement = document.createElement("link");
    manifestElement.rel = "manifest";
    document.head.appendChild(manifestElement);
  }
  manifestElement.href = url;
}

const useIndustrySiteData = () => {
  const { industry, siteConfig, isLoading } = useData();
  return {
    siteData: siteConfig,
    industry,
    isLoading
  };
};

const VerticalSchema = _enum([
  "mobile-detailing",
  "pet-grooming",
  "lawn-care",
  "maid-service",
  "hvac",
  "plumbing",
  "electrical"
]);
const TenantStatusSchema = _enum([
  "pending",
  "approved",
  "active",
  "suspended",
  "rejected"
]);
_enum([
  "owner",
  "manager",
  "tech",
  "viewer"
]);
const ServiceCategorySchema = _enum([
  "interior",
  "exterior",
  "service-packages",
  "addons",
  "ceramic-coating",
  "paint-correction",
  "paint-protection-film",
  "auto",
  "boat",
  "rv",
  "ppf",
  "ceramic"
]);
const VehicleTypeSchema = _enum([
  "auto",
  "boat",
  "rv",
  "truck",
  "motorcycle",
  "off-road"
]);
_enum(["xs", "s", "m", "l", "xl"]);
const PricingUnitSchema = _enum(["flat", "hour"]);
const ServiceTierSchema = object({
  id: union([string(), number()]),
  name: string().min(1, "Tier name is required"),
  priceCents: number().int().nonnegative("Price must be non-negative"),
  durationMinutes: number().int().positive("Duration must be positive"),
  description: string(),
  features: array(string()),
  popular: boolean().optional(),
  enabled: boolean().optional().default(true),
  sortOrder: number().int().optional()
});
const ServiceSchema = object({
  id: union([string(), number()]),
  name: string().min(1, "Service name is required"),
  slug: string().optional(),
  category: ServiceCategorySchema,
  description: string().optional(),
  vehicleTypes: array(VehicleTypeSchema).optional(),
  basePriceCents: number().int().nonnegative().optional(),
  pricingUnit: PricingUnitSchema.optional(),
  minDurationMinutes: number().int().positive().optional(),
  tiers: array(ServiceTierSchema).optional(),
  active: boolean().optional().default(true),
  featured: boolean().optional().default(false),
  metadata: record(unknown()).optional()
});
const ServiceCatalogSchema = record(
  string(),
  array(ServiceSchema)
);
const HexColorSchema = string().regex(/^#[0-9A-Fa-f]{6}$/, "Must be a valid hex color");
object({
  primary: HexColorSchema.optional(),
  secondary: HexColorSchema.optional(),
  accent: HexColorSchema.optional(),
  background: HexColorSchema.optional(),
  text: HexColorSchema.optional(),
  textLight: HexColorSchema.optional()
}).optional();
const LogoSchema = object({
  url: string().min(1, "Logo URL is required"),
  // ✓ REQUIRED
  alt: string().optional(),
  darkUrl: string().optional(),
  lightUrl: string().optional(),
  width: number().int().positive().optional(),
  height: number().int().positive().optional()
});
const TenantBrandingSchema = object({
  businessName: string().min(1, "Business name is required"),
  // ✓ REQUIRED
  logo: LogoSchema,
  // ✓ REQUIRED (at least logo.url)
  tagline: string().optional(),
  favicon: string().optional(),
  colors: object({
    primary: string().optional(),
    secondary: string().optional(),
    accent: string().optional()
  }).optional(),
  theme: _enum(["default", "southwest", "coastal", "modern", "classic"]).optional()
});
const PhoneSchema = string().min(1, "Phone number is required");
const EmailSchema = string().email("Must be a valid email address");
const URLSchema = string().url("Must be a valid URL");
const PhoneNumbersSchema = object({
  main: PhoneSchema,
  // ✓ REQUIRED
  sms: string().optional(),
  twilio: string().optional()
});
const EmailAddressesSchema = object({
  primary: EmailSchema,
  // ✓ REQUIRED
  support: EmailSchema.optional(),
  billing: EmailSchema.optional()
});
const SocialMediaLinksSchema = object({
  facebook: string(),
  // ✓ REQUIRED (can be empty string)
  instagram: string(),
  // ✓ REQUIRED (can be empty string)
  tiktok: string(),
  // ✓ REQUIRED (can be empty string)
  youtube: string(),
  // ✓ REQUIRED (can be empty string)
  twitter: string().optional(),
  linkedin: string().optional(),
  yelp: string().optional(),
  gbp: string().optional()
});
const BaseLocationSchema = object({
  city: string().min(1, "City is required"),
  // ✓ REQUIRED
  state: string().min(1, "State is required")
  // ✓ REQUIRED
});
const ContactInfoSchema = object({
  phones: PhoneNumbersSchema,
  // ✓ REQUIRED
  emails: EmailAddressesSchema,
  // ✓ REQUIRED
  socials: SocialMediaLinksSchema,
  // ✓ REQUIRED
  baseLocation: BaseLocationSchema,
  // ✓ REQUIRED
  address: object({
    street: string().optional(),
    city: string().optional(),
    state: string().optional(),
    zip: string().optional(),
    country: string().optional()
  }).optional()
});
const ServiceAreaSchema$1 = object({
  id: union([string(), number()]).optional(),
  city: string().min(1, "City is required"),
  citySlug: string().min(1, "City slug is required"),
  stateCode: string().length(2, "State code must be 2 characters"),
  stateName: string().min(1, "State name is required"),
  zipCodes: array(string()).optional(),
  latitude: number().optional(),
  longitude: number().optional(),
  radiusMiles: number().int().positive().optional()
});
const ServiceAreaConfigSchema = record(
  string().length(2),
  // State code
  array(ServiceAreaSchema$1)
);
const SEOMetadataSchema = object({
  title: string().min(1, "SEO title is required").max(60, "SEO title should be under 60 characters"),
  description: string().min(1, "SEO description is required").max(160, "SEO description should be under 160 characters"),
  keywords: array(string()).optional(),
  canonicalPath: string().optional(),
  ogImage: URLSchema.optional(),
  twitterImage: URLSchema.optional(),
  robots: _enum(["index,follow", "noindex,nofollow"]).optional()
});
const HeroContentSchema = object({
  h1: string().min(1, "Hero headline is required"),
  subtitle: string().optional(),
  ctas: array(object({
    label: string().min(1),
    href: string(),
    variant: _enum(["primary", "secondary"]).optional()
  })).optional()
});
const FAQItemSchema = object({
  question: string().min(1, "Question is required"),
  answer: string().min(1, "Answer is required"),
  category: string().optional()
});
const LocationPageSchema = object({
  slug: string().min(1, "Location slug is required"),
  city: string().min(1, "City is required"),
  stateCode: string().length(2),
  state: string().min(1),
  postalCode: string().optional(),
  latitude: number().optional(),
  longitude: number().optional(),
  urlPath: string().min(1, "URL path is required"),
  affiliateRef: string().optional(),
  seo: SEOMetadataSchema,
  hero: HeroContentSchema,
  faqIntro: string().optional(),
  faqs: array(FAQItemSchema).optional(),
  neighborhoods: array(string()).optional(),
  landmarks: array(string()).optional(),
  localConditions: array(string()).optional(),
  pricingModifierPct: number().min(-1).max(1).optional(),
  images: array(object({
    url: URLSchema,
    alt: string().min(1),
    role: _enum(["hero", "gallery", "service"]).optional(),
    width: number().int().positive().optional(),
    height: number().int().positive().optional(),
    priority: boolean().optional()
  })).optional(),
  reviews: object({
    ratingValue: number().min(0).max(5).optional(),
    reviewCount: number().int().nonnegative().optional(),
    featured: array(string()).optional()
  }).optional(),
  openingHours: union([string(), array(string())]).optional()
});
const AnalyticsConfigSchema = object({
  ga4: string().optional(),
  googleAdsId: string().optional(),
  facebookPixelId: string().optional(),
  hotjarId: string().optional()
}).optional();
const PaymentConfigSchema = object({
  stripePublishableKey: string().optional(),
  stripeAccountId: string().optional(),
  acceptsPayments: boolean().optional().default(false),
  depositRequired: boolean().optional().default(false),
  depositPercentage: number().min(0).max(1).optional()
}).optional();
const FeatureFlagsSchema = object({
  bookingEnabled: boolean().optional().default(false),
  loginEnabled: boolean().optional().default(false),
  reviewsEnabled: boolean().optional().default(true),
  blogEnabled: boolean().optional().default(false),
  referralProgramEnabled: boolean().optional().default(false),
  loyaltyProgramEnabled: boolean().optional().default(false),
  smsNotificationsEnabled: boolean().optional().default(false),
  emailNotificationsEnabled: boolean().optional().default(true)
}).optional();
const TenantConfigSchema = object({
  // ============================================
  // CORE IDENTITY (4 required)
  // ============================================
  id: union([string(), number()]),
  // ✓ REQUIRED
  slug: string().min(1, "Tenant slug is required"),
  // ✓ REQUIRED
  vertical: VerticalSchema,
  // ✓ REQUIRED
  status: TenantStatusSchema,
  // ✓ REQUIRED
  // ============================================
  // BRANDING (2 required nested)
  // ============================================
  branding: TenantBrandingSchema,
  // ✓ REQUIRED
  // ============================================
  // CONTACT (4 required nested)
  // ============================================
  contact: ContactInfoSchema,
  // ✓ REQUIRED
  // ============================================
  // FUTURE FEATURES (all optional)
  // ============================================
  services: ServiceCatalogSchema.optional(),
  enabledServiceCategories: array(ServiceCategorySchema).optional(),
  serviceAreas: ServiceAreaConfigSchema.optional(),
  serviceRadiusMiles: number().int().positive().optional(),
  locationPages: array(LocationPageSchema).optional(),
  mainSiteSEO: SEOMetadataSchema.optional(),
  analytics: AnalyticsConfigSchema.optional(),
  payment: PaymentConfigSchema.optional(),
  features: FeatureFlagsSchema.optional(),
  domains: array(string()).optional(),
  primaryDomain: string().optional(),
  businessLicense: string().optional(),
  insuranceProvider: string().optional(),
  insuranceExpiry: string().optional(),
  operatingHours: record(
    string(),
    object({
      open: string(),
      close: string(),
      closed: boolean().optional()
    })
  ).optional(),
  rating: number().min(0).max(5).optional(),
  reviewCount: number().int().nonnegative().optional(),
  totalJobs: number().int().nonnegative().optional(),
  metadata: record(unknown()).optional(),
  createdAt: string().optional(),
  updatedAt: string().optional(),
  approvedAt: string().optional()
});
TenantConfigSchema.partial();
object({
  id: union([string(), number()]),
  slug: string(),
  businessName: string(),
  vertical: VerticalSchema,
  status: TenantStatusSchema,
  mainPhone: string(),
  // eslint-disable-next-line @typescript-eslint/no-deprecated -- z.string().email() is the correct modern Zod syntax despite deprecation warning
  email: string().email("Must be a valid email address"),
  rating: number().min(0).max(5).optional(),
  reviewCount: number().int().nonnegative().optional()
});
TenantConfigSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  approvedAt: true
});
function validateTenantConfig(data) {
  try {
    const validated = TenantConfigSchema.parse(data);
    return { success: true, data: validated };
  } catch (error) {
    if (error instanceof ZodError) {
      return { success: false, errors: error };
    }
    throw error;
  }
}

object({
  name: string(),
  description: string(),
  explanation: string(),
  image: string(),
  duration: number(),
  features: array(string())
});
object({
  cost: number(),
  features: array(string()),
  popular: boolean().optional(),
  description: string().optional()
});
object({
  id: string(),
  name: string(),
  price: number(),
  description: string(),
  features: array(string()),
  featureIds: array(string()),
  popular: boolean().optional()
});
object({
  id: string(),
  name: string(),
  price: number(),
  description: string(),
  features: array(string()),
  featureIds: array(string()),
  popular: boolean().optional()
});
const VehicleDetailsSchema = object({
  make: string(),
  model: string(),
  year: string(),
  color: string(),
  length: string()
});
const ScheduleSchema = object({
  date: string(),
  time: string()
});
const BookingDataSchema = object({
  vehicle: string(),
  vehicleDetails: VehicleDetailsSchema,
  serviceTier: string(),
  addons: array(string()),
  schedule: ScheduleSchema,
  paymentMethod: string()
});
object({
  currentStep: _enum(["vehicle-selection", "service-tier", "addons", "schedule", "payment"]),
  bookingData: BookingDataSchema,
  completedSteps: array(string()),
  isLoading: boolean(),
  errors: array(string())
});

class RefreshTokenGuard {
  isRefreshing = false;
  failedQueue = [];
  async executeRefresh() {
    if (this.isRefreshing) {
      return new Promise((resolve, reject) => {
        this.failedQueue.push({ resolve, reject });
      });
    }
    this.isRefreshing = true;
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        throw new Error("No refresh token available");
      }
      const response = await fetch(`${config.apiUrl}/api/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ refreshToken })
      });
      if (!response.ok) {
        throw new Error("Refresh token failed");
      }
      const data = await response.json();
      localStorage.setItem("token", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      this.processQueue(null, data.accessToken);
      return data.accessToken;
    } catch (error) {
      this.processQueue(error, null);
      throw error;
    } finally {
      this.isRefreshing = false;
    }
  }
  processQueue(error, token) {
    this.failedQueue.forEach(({ resolve, reject }) => {
      if (error) {
        reject(error);
      } else if (token) {
        resolve(token);
      }
    });
    this.failedQueue = [];
  }
}
class ApiClient {
  refreshGuard = new RefreshTokenGuard();
  baseURL;
  constructor(baseURL) {
    this.baseURL = baseURL;
  }
  // Main request method with automatic token refresh
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = localStorage.getItem("token");
    if (token) {
      options.headers = {
        ...options.headers,
        "Authorization": `Bearer ${token}`
      };
    }
    try {
      const response = await fetch(url, options);
      if (response.status === 401 && localStorage.getItem("refreshToken")) {
        try {
          const newToken = await this.refreshGuard.executeRefresh();
          const retryOptions = {
            ...options,
            headers: {
              ...options.headers,
              "Authorization": `Bearer ${newToken}`
            }
          };
          const retryResponse = await fetch(url, retryOptions);
          if (!retryResponse.ok) {
            throw new Error(`Request failed: ${retryResponse.status.toString()}`);
          }
          return await retryResponse.json();
        } catch {
          this.handleAuthFailure();
          throw new Error("Authentication failed");
        }
      }
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 429) {
          const error = new Error(errorData.error ?? "Rate limited");
          error.code = "RATE_LIMITED";
          error.retryAfterSeconds = errorData.retryAfterSeconds;
          error.remainingAttempts = errorData.remainingAttempts;
          error.resetTime = errorData.resetTime;
          throw error;
        }
        if (response.status === 401) {
          const error = new Error(errorData.error ?? "Unauthorized");
          error.code = "UNAUTHORIZED";
          throw error;
        }
        if (response.status === 403) {
          const error = new Error(errorData.error ?? "Forbidden");
          error.code = "FORBIDDEN";
          throw error;
        }
        throw new Error(errorData.error ?? errorData.message ?? `Request failed: ${response.status.toString()}`);
      }
      return await response.json();
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }
  // Handle authentication failure
  handleAuthFailure() {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    if (window.location.pathname !== "/") {
      window.location.href = "/";
    }
  }
  // GET request
  async get(endpoint) {
    return this.request(endpoint, { method: "GET" });
  }
  // POST request
  async post(endpoint, data) {
    return this.request(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: data ? JSON.stringify(data) : void 0
    });
  }
  // PUT request
  async put(endpoint, data) {
    return this.request(endpoint, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: data ? JSON.stringify(data) : void 0
    });
  }
  // DELETE request
  async delete(endpoint) {
    return this.request(endpoint, { method: "DELETE" });
  }
  // PATCH request
  async patch(endpoint, data) {
    return this.request(endpoint, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: data ? JSON.stringify(data) : void 0
    });
  }
  // Upload file
  async upload(endpoint, formData) {
    return this.request(endpoint, {
      method: "POST",
      body: formData
      // Don't set Content-Type for FormData, let browser set it with boundary
    });
  }
}
const apiClient = new ApiClient(config.apiUrl);

async function fetchTenantConfigBySlug(slug) {
  const response = await apiClient.get(`/api/tenants/${slug}`);
  const { data } = response;
  if (!data || !data.business_name) {
    throw new Error(`Tenant not found: ${slug}`);
  }
  const { affiliateToTenantConfig } = await __vitePreload(async () => { const { affiliateToTenantConfig } = await Promise.resolve().then(() => tenantConfigMigration);return { affiliateToTenantConfig }},true?void 0:void 0,import.meta.url);
  const config = affiliateToTenantConfig({
    id: data.id,
    slug: data.slug,
    business_name: data.business_name,
    business_phone: data.business_phone || data.phone,
    business_email: data.business_email || data.email,
    facebook_url: data.facebook_url,
    instagram_url: data.instagram_url,
    tiktok_url: data.tiktok_url,
    youtube_url: data.youtube_url,
    service_areas: data.service_areas,
    industry: data.industry,
    logo_url: data.logo_url
  });
  const result = validateTenantConfig(config);
  if (!result.success) {
    console.error("Tenant config validation failed:", result.errors);
    throw new Error("Invalid tenant configuration");
  }
  return result.data;
}
async function fetchTenantConfigById(tenantId) {
  const response = await apiClient.get(`/api/tenants/id/${tenantId}`);
  const { data } = response;
  if (!data || !data.business_name) {
    throw new Error(`Tenant not found: ${tenantId}`);
  }
  const { affiliateToTenantConfig } = await __vitePreload(async () => { const { affiliateToTenantConfig } = await Promise.resolve().then(() => tenantConfigMigration);return { affiliateToTenantConfig }},true?void 0:void 0,import.meta.url);
  const config = affiliateToTenantConfig({
    id: data.id,
    slug: data.slug,
    business_name: data.business_name,
    business_phone: data.business_phone || data.phone,
    business_email: data.business_email || data.email,
    facebook_url: data.facebook_url,
    instagram_url: data.instagram_url,
    tiktok_url: data.tiktok_url,
    youtube_url: data.youtube_url,
    service_areas: data.service_areas,
    industry: data.industry,
    logo_url: data.logo_url
  });
  const result = validateTenantConfig(config);
  if (!result.success) {
    throw new Error("Invalid tenant configuration");
  }
  return result.data;
}
const tenantConfigKeys = {
  all: ["tenant", "config"],
  lists: () => [...tenantConfigKeys.all, "list"],
  list: (vertical) => [...tenantConfigKeys.lists(), { vertical }],
  details: () => [...tenantConfigKeys.all, "detail"],
  detail: (identifier) => [...tenantConfigKeys.details(), identifier],
  bySlug: (slug) => [...tenantConfigKeys.detail(slug), "slug"],
  byId: (id) => [...tenantConfigKeys.detail(id), "id"]
};

function useTenantConfigLoader(options = {}) {
  const params = useParams();
  const urlSlug = params.slug || params.tenantSlug || params.businessSlug;
  const domainTenantSlug = useTenantSlug();
  const {
    tenantId,
    slug = domainTenantSlug || urlSlug,
    // Prioritize domain-based slug
    enabled = true
  } = options;
  const fetchFn = async () => {
    if (tenantId) {
      return fetchTenantConfigById(tenantId);
    } else if (slug) {
      return fetchTenantConfigBySlug(slug);
    }
    throw new Error("Either tenantId or slug must be provided");
  };
  const queryKey = tenantId ? tenantConfigKeys.byId(tenantId) : slug ? tenantConfigKeys.bySlug(slug) : tenantConfigKeys.all;
  return useQuery({
    queryKey,
    queryFn: fetchFn,
    enabled: enabled && (!!tenantId || !!slug),
    staleTime: 5 * 60 * 1e3,
    // 5 minutes
    gcTime: 10 * 60 * 1e3,
    // 10 minutes (cache time)
    retry: 2,
    refetchOnWindowFocus: false
  });
}

const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024};
const useMediaQuery = (query) => {
  const [matches, setMatches] = reactExports.useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia(query).matches;
  });
  reactExports.useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia(query);
    if (mediaQuery.matches !== matches) {
      setMatches(mediaQuery.matches);
    }
    const handleChange = (event) => {
      setMatches(event.matches);
    };
    mediaQuery.addEventListener("change", handleChange);
    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, [query, matches]);
  return matches;
};
const useIsMobile = () => {
  return useMediaQuery(`(max-width: ${BREAKPOINTS.md - 1}px)`);
};
const useIsTablet = () => {
  const isAboveMobile = useMediaQuery(`(min-width: ${BREAKPOINTS.md}px)`);
  const isBelowDesktop = useMediaQuery(`(max-width: ${BREAKPOINTS.lg - 1}px)`);
  return isAboveMobile && isBelowDesktop;
};
const useIsDesktop = () => {
  return useMediaQuery(`(min-width: ${BREAKPOINTS.md}px)`);
};

const getNavId = (sectionId) => {
  if (!sectionId) return null;
  if (sectionId === "services-desktop") return "services";
  if (sectionId === "gallery-desktop" || sectionId === "gallery") return "footer";
  return sectionId;
};
const useSectionStore = create((set) => ({
  current: null,
  setCurrent: (id) => {
    set({ current: id });
  }
}));

function useScrollSpy({
  ids,
  headerPx = 88,
  threshold = 0.55,
  updateHash = false
}) {
  const setCurrent = useSectionStore((s) => s.setCurrent);
  reactExports.useEffect(() => {
    const els = ids.map((id) => document.getElementById(id)).filter((el) => !!el);
    if (!els.length) return;
    const thresholds = Array.from({ length: 21 }, (_, i) => i * 0.05);
    const io = new IntersectionObserver(
      (entries) => {
        const intersecting = entries.filter((e) => e.isIntersecting);
        if (intersecting.length === 0) return;
        const mostVisible = intersecting.reduce((best, current) => {
          return current.intersectionRatio > best.intersectionRatio ? current : best;
        });
        if (mostVisible.intersectionRatio > 0.3) {
          const id = mostVisible.target.id;
          setCurrent(id);
          if (updateHash && id) {
            const hash = `#${id}`;
            if (location.hash !== hash) history.replaceState(null, "", hash);
          }
        }
      },
      {
        root: null,
        rootMargin: `-${headerPx}px 0px -20% 0px`,
        // Account for header and bottom
        threshold: thresholds
      }
    );
    els.forEach((el) => {
      io.observe(el);
    });
    return () => {
      io.disconnect();
    };
  }, [ids, headerPx, threshold, updateHash, setCurrent]);
}

const useImageRotation = (config) => {
  const { images, autoRotate, interval, preloadNext } = config;
  const { isValid, errors } = validateImageRotationConfig(config);
  const totalImages = images.length;
  const hasMultipleImages = totalImages > 1;
  const [currentIndex, setCurrentIndex] = reactExports.useState(0);
  const [isPaused, setIsPaused] = reactExports.useState(false);
  const [_prefersReducedMotion, setPrefersReducedMotion] = reactExports.useState(false);
  const intervalRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);
    const handleChange = (e) => {
      setPrefersReducedMotion(e.matches);
    };
    mediaQuery.addEventListener("change", handleChange);
    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);
  reactExports.useEffect(() => {
    if (preloadNext && totalImages > 1) {
      void preloadImages(images);
    }
  }, [images, preloadNext, totalImages]);
  reactExports.useEffect(() => {
    if (!isValid || !autoRotate || !hasMultipleImages || isPaused) {
      return;
    }
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => getNextImageIndex(prevIndex, totalImages));
    }, interval);
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isValid, autoRotate, hasMultipleImages, isPaused, interval, totalImages]);
  reactExports.useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);
  const next = reactExports.useCallback(() => {
    if (!isValid || !hasMultipleImages) return;
    setCurrentIndex((prevIndex) => getNextImageIndex(prevIndex, totalImages));
  }, [isValid, hasMultipleImages, totalImages]);
  const previous = reactExports.useCallback(() => {
    if (!isValid || !hasMultipleImages) return;
    setCurrentIndex((prevIndex) => getPreviousImageIndex(prevIndex, totalImages));
  }, [isValid, hasMultipleImages, totalImages]);
  const goTo = reactExports.useCallback((index) => {
    if (!isValid || !hasMultipleImages || index < 0 || index >= totalImages) return;
    setCurrentIndex(index);
  }, [isValid, hasMultipleImages, totalImages]);
  const togglePause = reactExports.useCallback(() => {
    setIsPaused((prev) => !prev);
  }, []);
  const setPaused = reactExports.useCallback((paused) => {
    setIsPaused(paused);
  }, []);
  return {
    currentIndex,
    nextIndex: getNextImageIndex(currentIndex, totalImages),
    isPaused,
    hasMultipleImages,
    totalImages,
    isValid,
    errors,
    next,
    previous,
    goTo,
    togglePause,
    setPaused
  };
};

const API_BASE_URL = "/api/reviews";
const reviewsApi = {
  // Get reviews with filtering
  getReviews: async (params = {}) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== void 0 && value !== "") {
        searchParams.append(key, String(value));
      }
    });
    const response = await fetch(`${API_BASE_URL}?${searchParams.toString()}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch reviews: ${response.statusText}`);
    }
    return response.json();
  },
  // Get a specific review by ID
  getReview: async (id) => {
    const response = await fetch(`${API_BASE_URL}/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch review: ${response.statusText}`);
    }
    return response.json();
  },
  // Submit a new review
  submitReview: async (reviewData) => {
    const response = await fetch(API_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(reviewData)
    });
    if (!response.ok) {
      throw new Error(`Failed to submit review: ${response.statusText}`);
    }
    return response.json();
  }
};

const convertDatabaseReviewToReview = (dbReview) => {
  const review = {
    id: dbReview.id.toString(),
    customerName: dbReview.customer_name,
    rating: dbReview.rating,
    reviewText: dbReview.comment,
    date: dbReview.published_at || dbReview.created_at,
    reviewSource: dbReview.source
  };
  if (dbReview.avatar_filename) {
    review.profileImage = `/uploads/avatars/${dbReview.avatar_filename}`;
  }
  if (dbReview.reviewer_url) {
    review.reviewerUrl = dbReview.reviewer_url;
  }
  if (dbReview.vehicle_type) {
    review.serviceCategory = dbReview.vehicle_type;
  }
  return review;
};
const useReviews = (params = {}) => {
  const queryKey = ["reviews", params];
  const hasParams = Object.values(params).some((value) => value !== void 0 && value !== "");
  const {
    data: response,
    isLoading: loading,
    error,
    refetch
  } = useQuery({
    queryKey,
    queryFn: async () => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
      }, 5e3);
      try {
        const response2 = await reviewsApi.getReviews(params);
        clearTimeout(timeoutId);
        if (!response2.success) {
          throw new Error(response2.error || "Failed to fetch reviews");
        }
        return response2;
      } catch (err) {
        clearTimeout(timeoutId);
        throw err;
      }
    },
    enabled: hasParams,
    staleTime: 5 * 60 * 1e3,
    // 5 minutes
    retry: 1
  });
  const reviews = response?.data ? response.data.map(convertDatabaseReviewToReview) : [];
  const pagination = response?.pagination || null;
  const errorMessage = error instanceof Error ? error.message : null;
  const loadMore = () => {
    if (pagination?.hasMore) {
      refetch();
    }
  };
  return {
    reviews,
    loading,
    error: errorMessage,
    pagination,
    refetch,
    loadMore
  };
};

const useReviewsAvailability = () => {
  const data = useDataOptional();
  const isTenant = data?.isTenant || false;
  const queryParams = {
    limit: 1
  };
  if (isTenant) {
    const urlSlug = window.location.pathname.split("/")[1];
    if (urlSlug) {
      queryParams.tenant_slug = urlSlug;
    }
  }
  const { reviews, loading } = useReviews(queryParams);
  return !loading && reviews.length > 0;
};

const BookNow = React.forwardRef(
  ({
    to,
    onClick,
    variant = "primary",
    size = "lg",
    loading = false,
    leftIcon,
    rightIcon,
    className = "",
    children,
    style,
    ...props
  }, ref) => {
    const buttonText = children || "Book Now";
    const getDestination = () => {
      if (to) return to;
      return "/booking";
    };
    const buttonProps = {
      variant,
      size,
      loading,
      leftIcon,
      rightIcon,
      className: cn(
        "whitespace-nowrap",
        className
      ),
      style,
      children: buttonText,
      ref,
      ...props
    };
    if (onClick) {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          onClick,
          ...buttonProps
        }
      );
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: getDestination(), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { ...buttonProps }) });
  }
);
BookNow.displayName = "BookNow";

const GetQuote = React.forwardRef(
  ({
    variant = "secondary",
    size = "lg",
    loading = false,
    leftIcon,
    rightIcon,
    className = "",
    children,
    style,
    ...props
  }, ref) => {
    const buttonText = children || "Request Quote";
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Button,
      {
        variant,
        size,
        loading,
        leftIcon,
        rightIcon,
        className: cn(
          "whitespace-nowrap",
          className
        ),
        style,
        ref,
        ...props,
        children: buttonText
      }
    );
  }
);
GetQuote.displayName = "GetQuote";

const CTAButtons = ({
  layout = "horizontal",
  className = "",
  bookNowProps = {},
  getQuoteProps = {}
}) => {
  const data = useDataOptional();
  const isPreview = data?.isPreview || false;
  const buttonSize = bookNowProps.size ?? getQuoteProps.size ?? "lg";
  const containerClasses = layout === "vertical" ? (
    // Single column, centered, consistent width
    "flex flex-col gap-3 w-full max-w-[28rem] md:max-w-[32rem] mx-auto px-6"
  ) : (
    // 1 col on mobile, 2 equal cols ≥ sm
    "grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-[28rem] md:max-w-[32rem] mx-auto px-6"
  );
  const commonBtnClasses = "w-full justify-center";
  const handleBookNowClick = (e) => {
    if (isPreview) {
      e.preventDefault();
      e.stopPropagation();
      alert("📋 Preview Mode\n\nBooking is disabled in preview mode.\n\nThis is a demonstration site to showcase features to potential clients.");
      return;
    }
    bookNowProps.onClick?.();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cn(containerClasses, className), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      BookNow,
      {
        variant: bookNowProps.variant ?? "primary",
        size: buttonSize,
        className: cn(commonBtnClasses, isPreview && "cursor-pointer", bookNowProps.className),
        onClick: isPreview ? handleBookNowClick : bookNowProps.onClick,
        ...bookNowProps.to && !isPreview && { to: bookNowProps.to },
        children: bookNowProps.children ?? "Book Now"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      GetQuote,
      {
        variant: getQuoteProps.variant ?? "outline-white",
        size: buttonSize,
        className: cn(commonBtnClasses, getQuoteProps.className),
        onClick: getQuoteProps.onClick,
        children: getQuoteProps.children ?? "Request Quote"
      }
    )
  ] });
};

function getErrorStack(error) {
  if (error && typeof error === "object" && "stack" in error) {
    return String(error.stack);
  }
  return void 0;
}
function getErrorMessage(error) {
  if (error && typeof error === "object" && "message" in error) {
    return String(error.message);
  }
  return String(error);
}
class ErrorMonitor {
  errors = [];
  maxErrors = 1e3;
  // Keep last 1000 errors
  sessionId;
  userId;
  isEnabled = false;
  // Disabled to see actual console errors
  listeners = [];
  constructor() {
    this.sessionId = this.generateSessionId();
    this.setupGlobalErrorHandlers();
    this.setupConsoleErrorHandling();
    this.setupNetworkErrorHandling();
  }
  generateSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
  }
  setupGlobalErrorHandlers() {
    window.addEventListener("error", (event) => {
      const stack = getErrorStack(event.error);
      this.captureError({
        type: "unhandled",
        message: event.message,
        ...stack ? { stack } : {},
        url: event.filename,
        line: event.lineno,
        column: event.colno
      });
    });
    window.addEventListener("unhandledrejection", (event) => {
      const stack = getErrorStack(event.reason);
      this.captureError({
        type: "promise",
        message: getErrorMessage(event.reason),
        ...stack ? { stack } : {}
      });
    });
    window.addEventListener("error", (event) => {
      if (event.target !== window) {
        const target = event.target;
        const targetName = target instanceof Element ? target.tagName.toLowerCase() : "unknown";
        let url = "unknown";
        if (target && typeof target === "object") {
          if ("src" in target && typeof target.src === "string") {
            url = target.src;
          } else if ("href" in target && typeof target.href === "string") {
            url = target.href;
          }
        }
        this.captureError({
          type: "network",
          message: `Resource loading error: ${targetName}`,
          networkInfo: {
            url,
            method: "GET"
          }
        });
      }
    }, true);
  }
  setupConsoleErrorHandling() {
    const originalConsoleError = console.error;
    const originalConsoleWarn = console.warn;
    console.error = (...args) => {
      const stack = new Error().stack;
      this.captureError({
        type: "console",
        message: args.map((arg) => typeof arg === "string" ? arg : JSON.stringify(arg)).join(" "),
        ...stack ? { stack } : {}
      });
      originalConsoleError.apply(console, args);
    };
    console.warn = (...args) => {
      const stack = new Error().stack;
      this.captureError({
        type: "console",
        message: `WARNING: ${args.map((arg) => typeof arg === "string" ? arg : JSON.stringify(arg)).join(" ")}`,
        ...stack ? { stack } : {}
      });
      originalConsoleWarn.apply(console, args);
    };
  }
  setupNetworkErrorHandling() {
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const startTime = Date.now();
      const requestInput = args[0];
      let url;
      if (typeof requestInput === "string") {
        url = requestInput;
      } else {
        url = requestInput.url;
      }
      const method = args[1]?.method || "GET";
      try {
        const response = await originalFetch(...args);
        const responseTime = Date.now() - startTime;
        if (!response.ok && !(url.includes("localhost:5173") && response.status === 0)) {
          this.captureError({
            type: "network",
            message: `HTTP ${response.status}: ${response.statusText}`,
            networkInfo: {
              url,
              method,
              status: response.status,
              responseTime
            }
          });
        }
        return response;
      } catch (error) {
        const responseTime = Date.now() - startTime;
        const errorMessage = getErrorMessage(error);
        const isLocalConnectionError = url.includes("localhost:5173") && error instanceof TypeError && errorMessage.includes("ERR_CONNECTION_REFUSED");
        if (!isLocalConnectionError) {
          this.captureError({
            type: "network",
            message: `Network error: ${errorMessage}`,
            networkInfo: {
              url,
              method,
              responseTime
            }
          });
        }
        throw error;
      }
    };
  }
  captureError(errorData) {
    if (!this.isEnabled) return;
    const error = {
      id: `error_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
      timestamp: /* @__PURE__ */ new Date(),
      type: "console",
      message: "",
      url: window.location.href,
      userAgent: navigator.userAgent,
      sessionId: this.sessionId,
      ...this.userId ? { userId: this.userId } : {},
      ...errorData
    };
    this.errors.push(error);
    if (this.errors.length > this.maxErrors) {
      this.errors = this.errors.slice(-this.maxErrors);
    }
    this.listeners.forEach((listener) => {
      listener(error);
    });
  }
  // Public methods
  captureReactError(error, errorInfo, componentStack) {
    const stack = error.stack;
    const component = componentStack || errorInfo.componentStack;
    this.captureError({
      type: "react",
      message: error.message,
      ...stack ? { stack } : {},
      ...component ? { componentStack: component } : {}
    });
  }
  setUserId(userId) {
    this.userId = userId;
  }
  enable() {
    this.isEnabled = true;
  }
  disable() {
    this.isEnabled = false;
  }
  getErrors() {
    return [...this.errors];
  }
  getErrorsByType(type) {
    return this.errors.filter((error) => error.type === type);
  }
  getRecentErrors(count = 10) {
    return this.errors.slice(-count);
  }
  clearErrors() {
    this.errors = [];
  }
  addListener(listener) {
    this.listeners.push(listener);
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }
  exportErrors() {
    return JSON.stringify({
      sessionId: this.sessionId,
      userId: this.userId,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      errors: this.errors
    }, null, 2);
  }
  printErrorsToConsole() {
    console.group("🔍 Error Monitor - All Captured Errors");
    console.log(`Session ID: ${this.sessionId}`);
    console.log(`Total Errors: ${this.errors.length}`);
    console.log(`User ID: ${this.userId || "Not set"}`);
    this.errors.forEach((error, index) => {
      console.group(`Error ${index + 1} (${error.type})`);
      console.log("Time:", error.timestamp.toISOString());
      console.log("Message:", error.message);
      console.log("URL:", error.url);
      if (error.stack) console.log("Stack:", error.stack);
      if (error.componentStack) console.log("Component Stack:", error.componentStack);
      if (error.networkInfo) console.log("Network Info:", error.networkInfo);
      console.groupEnd();
    });
    console.groupEnd();
  }
  getErrorSummary() {
    const byType = this.errors.reduce((acc, error) => {
      acc[error.type] = (acc[error.type] || 0) + 1;
      return acc;
    }, {});
    return {
      total: this.errors.length,
      byType,
      recent: this.getRecentErrors(5)
    };
  }
}
const errorMonitor = new ErrorMonitor();
const handleReactError = (error, errorInfo, componentStack) => {
  errorMonitor.captureReactError(error, errorInfo, componentStack);
};
if (typeof window !== "undefined") {
  window.errorMonitor = errorMonitor;
  window.printErrors = () => {
    errorMonitor.printErrorsToConsole();
  };
  window.getErrors = () => errorMonitor.getErrors();
  window.clearErrors = () => {
    errorMonitor.clearErrors();
  };
  window.exportErrors = () => errorMonitor.exportErrors();
}

class ErrorBoundary extends reactExports.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    handleReactError(error, errorInfo, errorInfo.componentStack);
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
    if (env.PROD) {
      console.error("Production error:", { error, errorInfo });
    }
  }
  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen bg-gray-50 flex items-center justify-center p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-8 h-8 text-red-600", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-semibold text-gray-900 mb-2", children: "Something went wrong" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-600 mb-4", children: "We're sorry, but something unexpected happened. Please try refreshing the page." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => {
              window.location.reload();
            },
            className: "bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors",
            children: "Refresh Page"
          }
        ),
        env.DEV && this.state.error && /* @__PURE__ */ jsxRuntimeExports.jsxs("details", { className: "mt-4 text-left", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("summary", { className: "cursor-pointer text-sm text-gray-500 hover:text-gray-700", children: "Error Details (Development)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("pre", { className: "mt-2 text-xs text-red-600 bg-red-50 p-2 rounded overflow-auto", children: this.state.error.toString() })
        ] })
      ] }) });
    }
    return this.props.children;
  }
}
ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
  fallback: PropTypes.node,
  onError: PropTypes.func
};

const LoginPage = () => {
  const [email, setEmail] = reactExports.useState("admin@thatsmartsite.com");
  const [password, setPassword] = reactExports.useState("");
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login({ email, password });
    if (success) {
      setTimeout(() => {
        navigate("/admin-dashboard");
      }, 100);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen bg-gray-900 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md w-full bg-gray-800 rounded-lg shadow-lg p-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold text-white mb-2", children: "Admin Login" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-400", children: "Sign in to access the admin dashboard" })
    ] }),
    error && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4", children: error }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { className: "space-y-6", onSubmit: handleSubmit, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "email", className: "block text-sm font-medium text-gray-300 mb-2", children: "Email Address" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "email",
            id: "email",
            value: email,
            onChange: (e) => setEmail(e.target.value),
            className: "w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500",
            placeholder: "admin@thatsmartsite.com",
            required: true
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "password", className: "block text-sm font-medium text-gray-300 mb-2", children: "Password" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "password",
            id: "password",
            value: password,
            onChange: (e) => setPassword(e.target.value),
            className: "w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500",
            placeholder: "Enter your password",
            required: true
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "submit",
          disabled: loading,
          className: "w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed",
          children: loading ? "Signing In..." : "Sign In"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-gray-400 text-sm", children: [
      "Don't have an account?",
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/tenant-onboarding", className: "text-blue-400 hover:text-blue-300", children: "Apply for tenant access" })
    ] }) })
  ] }) });
};

const ProtectedRoute = ({
  children,
  requiredRole = "user",
  fallbackPath = "/login"
}) => {
  const { user, loading, isAuthenticated, isAdmin } = useAuth();
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen bg-gray-900 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-white text-2xl mb-4", children: "Loading..." }) }) });
  }
  if (!isAuthenticated) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Navigate, { to: fallbackPath, replace: true });
  }
  if (Array.isArray(requiredRole)) {
    if (requiredRole.includes("admin") && !isAdmin) {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(Navigate, { to: fallbackPath, replace: true });
    }
    if (requiredRole.includes("tenant") && isAdmin) {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(Navigate, { to: fallbackPath, replace: true });
    }
  } else {
    if (requiredRole === "admin" && !isAdmin) {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(Navigate, { to: fallbackPath, replace: true });
    }
    if (requiredRole === "tenant" && isAdmin) {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(Navigate, { to: fallbackPath, replace: true });
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children });
};

const ImageSchema = object({
  url: string().min(1, "Image URL is required"),
  alt: string().min(1, "Image alt text is required"),
  caption: string().optional(),
  role: _enum(["hero", "gallery", "process", "result", "auto", "marine", "rv"], {
    errorMap: () => ({ message: "Image role must be one of: hero, gallery, process, result, auto, marine, rv" })
  }),
  width: number().positive("Image width must be positive").optional(),
  height: number().positive("Image height must be positive").optional(),
  priority: boolean().optional(),
  sources: array(object({
    srcset: string(),
    type: string()
  })).optional()
});
const HeaderSchema = object({
  businessName: string().min(1, "Business name is required").optional(),
  phoneDisplay: string().min(1, "Phone display format is required").optional(),
  phoneE164: string().regex(/^\+[1-9]\d{1,14}$/, "Phone must be in E.164 format (e.g., +1234567890)").optional(),
  cityStateLabel: string().min(1, "City state label is required").optional()
});
const SEOSchema = object({
  title: string().min(1, "SEO title is required"),
  description: string().min(1, "SEO description is required"),
  keywords: array(string()).optional(),
  canonicalPath: string().regex(/^\/.*\/?$/, "Canonical path must start with /").optional(),
  ogImage: string().optional(),
  twitterImage: string().optional(),
  robots: _enum(["index,follow", "noindex,nofollow"]).optional()
});
const HeroSchema = object({
  h1: string().min(1, "Hero H1 is required"),
  sub: string().optional()
});
const OpsSchema = object({
  acceptsSameDay: boolean().optional(),
  leadTimeDays: number().int().min(0, "Lead time days must be non-negative").max(30, "Lead time days must be reasonable").optional(),
  serviceRadiusMiles: number().positive("Service radius must be positive").max(100, "Service radius must be reasonable").optional()
});
const ServiceAreaSchema = object({
  postalCodes: array(string().regex(/^\d{5}(-\d{4})?$/, "Postal codes must be valid ZIP format")).min(1, "At least one postal code is required")
});
const FAQSchema = object({
  id: string().optional(),
  q: string().min(1, "FAQ question is required"),
  a: string().min(1, "FAQ answer is required")
});
const ReviewsSectionSchema = object({
  heading: string().min(1, "Reviews heading is required").optional(),
  intro: string().min(1, "Reviews intro is required").optional(),
  feedKey: string().optional()
});
const SchemaOrgSchema = object({
  // Manual fields only
  aggregateRating: object({
    "@type": string().optional(),
    ratingValue: string().optional(),
    reviewCount: string().optional(),
    bestRating: string().optional(),
    worstRating: string().optional()
  }).optional(),
  review: array(object({
    "@type": string().optional(),
    author: object({
      "@type": string().optional(),
      name: string().optional()
    }).optional(),
    reviewRating: object({
      "@type": string().optional(),
      ratingValue: string().optional(),
      bestRating: string().optional(),
      worstRating: string().optional()
    }).optional(),
    reviewBody: string().optional()
  })).optional(),
  openingHours: union([string(), array(string())]).optional()
  // Allow additional schema properties
  // eslint-disable-next-line @typescript-eslint/no-deprecated -- passthrough is correct for this zod version
}).passthrough();
object({
  // Core identification
  slug: string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
  city: string().min(1, "City is required"),
  stateCode: string().length(2, "State code must be 2 characters").regex(/^[A-Z]{2}$/, "State code must be uppercase"),
  state: string().min(1, "State name is required"),
  postalCode: string().regex(/^\d{5}(-\d{4})?$/, "Postal code must be valid ZIP format"),
  latitude: number().min(-90).max(90, "Latitude must be between -90 and 90"),
  longitude: number().min(-180).max(180, "Longitude must be between -180 and 180"),
  openingHours: union([string(), array(string())]).optional(),
  urlPath: string().regex(/^\/.*\/$/, "URL path must start and end with /"),
  // Affiliate/employee references
  affiliateRef: string().optional(),
  employee: string().optional(),
  // Header information
  header: HeaderSchema.optional(),
  // SEO
  seo: SEOSchema,
  // Hero
  hero: HeroSchema,
  // Content
  faqIntro: string().optional(),
  neighborhoods: array(string()).optional(),
  landmarks: array(string()).optional(),
  localConditions: array(string()).optional(),
  // Pricing
  pricingModifierPct: number().min(-0.5, "Pricing modifier cannot be less than -50%").max(1, "Pricing modifier cannot be more than +100%").optional(),
  // Images
  images: array(ImageSchema).optional(),
  // FAQs
  faqs: array(FAQSchema).optional(),
  // Reviews
  reviewsSection: ReviewsSectionSchema.optional(),
  // Operations
  ops: OpsSchema.optional(),
  // Service area
  serviceArea: ServiceAreaSchema.optional(),
  // Schema.org
  schemaOrg: SchemaOrgSchema.optional()
});
object({
  brand: string().min(1, "Brand name is required"),
  slug: string().min(1, "Slug is required"),
  urlPath: string().regex(/^\/.*\/?$/, "URL path must start with /"),
  logo: object({
    url: string().min(1, "Logo URL is required"),
    alt: string().min(1, "Logo alt text is required"),
    darkUrl: string().optional(),
    lightUrl: string().optional()
  }),
  seo: SEOSchema,
  hero: HeroSchema.extend({
    images: array(ImageSchema).optional(),
    ctas: array(object({
      label: string(),
      href: string()
    })).optional()
  }),
  servicesGrid: array(object({
    slug: string(),
    title: string(),
    image: string(),
    alt: string(),
    href: string(),
    width: number().positive().optional(),
    height: number().positive().optional(),
    priority: boolean().optional()
  })).optional(),
  reviews: object({
    title: string(),
    subtitle: string(),
    ratingValue: string(),
    reviewCount: number(),
    source: string()
  }).optional(),
  faq: object({
    title: string(),
    subtitle: string()
  }).optional(),
  contact: object({
    email: email("Valid email is required"),
    phone: string().min(1, "Phone is required")
  }).optional(),
  socials: object({
    facebook: url().optional(),
    instagram: url().optional(),
    tiktok: url().optional(),
    youtube: url().optional(),
    googleBusiness: url().optional()
  }).optional(),
  jsonLd: object({
    organization: record(any()).optional(),
    website: record(any()).optional()
  }).optional()
});

const websiteContentApi = {
  // Get website content for a specific tenant
  getWebsiteContent: async (tenantSlug) => {
    const response = await fetch(`/api/website-content/${tenantSlug}`, {
      headers: {
        "Content-Type": "application/json"
      }
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch website content: ${response.statusText}`);
    }
    const data = await response.json();
    if (!data.success || !data.content) {
      throw new Error(data.message || "Failed to fetch website content");
    }
    return data.content;
  },
  // Get website content for the main site (no tenant slug)
  getMainSiteContent: async () => {
    const response = await fetch("/api/website-content/main", {
      headers: {
        "Content-Type": "application/json"
      }
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch main site content: ${response.statusText}`);
    }
    const data = await response.json();
    if (!data.success || !data.content) {
      throw new Error(data.message || "Failed to fetch main site content");
    }
    return data.content;
  }
};

const WebsiteContentContext = reactExports.createContext(null);
const WebsiteContentProvider = ({ children }) => {
  const params = useParams();
  const slug = params.businessSlug || params.tenantSlug || params.slug;
  const currentPath = window.location.pathname;
  const isNonTenantRoute = currentPath.startsWith("/admin-dashboard") || currentPath.startsWith("/tenant-dashboard") || currentPath.startsWith("/tenant-onboarding") || currentPath.startsWith("/login") || currentPath.startsWith("/booking") || currentPath.startsWith("/preview-generator") || currentPath.startsWith("/preview");
  const {
    data: content,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ["shared", "websiteContent", slug],
    queryFn: async () => {
      if (!slug) {
        return null;
      }
      const result = await websiteContentApi.getWebsiteContent(slug);
      return result;
    },
    staleTime: 5 * 60 * 1e3,
    // 5 minutes
    cacheTime: 10 * 60 * 1e3,
    // 10 minutes
    retry: 2,
    enabled: !!slug && !isNonTenantRoute
  });
  const contextValue = {
    content: content || null,
    isLoading,
    error: error?.message ?? null,
    refetch: () => {
      void refetch();
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(WebsiteContentContext.Provider, { value: contextValue, children });
};
const useWebsiteContent = () => {
  const context = reactExports.useContext(WebsiteContentContext);
  if (!context) {
    throw new Error("useWebsiteContent must be used within a WebsiteContentProvider");
  }
  return context;
};

const useReviewsContent = (props) => {
  const { siteData } = useIndustrySiteData();
  const { content: websiteContent } = useWebsiteContent();
  const title = props?.customHeading || websiteContent?.reviews_title || (siteData?.reviews?.title ?? "Customer Reviews");
  const subtitle = props?.customIntro || websiteContent?.reviews_subtitle || (siteData?.reviews?.subtitle ?? "What our customers say");
  return {
    title,
    subtitle
  };
};

const useReviewsRating = () => {
  const data = useDataOptional();
  const { content: websiteContent } = useWebsiteContent();
  const isPreview = data?.isPreview || false;
  if (isPreview) {
    return {
      averageRating: 4.9,
      totalReviews: 863,
      googleBusinessUrl: "#"
      // Dead link in preview
    };
  }
  const averageRating = websiteContent?.reviews_avg_rating ?? 4.9;
  const totalReviews = websiteContent?.reviews_total_count ?? 112;
  const googleBusinessUrl = data?.socialMedia.googleBusiness ?? data?.siteConfig?.socials?.googleBusiness ?? "#";
  return {
    averageRating,
    totalReviews,
    googleBusinessUrl
  };
};

function shuffleArray$2(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = shuffled[i];
    if (temp !== void 0 && shuffled[j] !== void 0) {
      shuffled[i] = shuffled[j];
      shuffled[j] = temp;
    }
  }
  return shuffled;
}
function useRotatingReviews(reviews) {
  const [reviewImages, setReviewImages] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [error, setError] = reactExports.useState(null);
  reactExports.useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        setLoading(true);
        setError(null);
        let images = [];
        try {
          const res = await fetch("/mobile-detailing/data/gallery.json");
          if (!res.ok) throw new Error(`Failed to fetch gallery data: ${res.status}`);
          const galleryData = await res.json();
          const galleryImages = Array.isArray(galleryData) ? galleryData.map((img) => {
            if (typeof img === "object" && img !== null && "src" in img) {
              return img.src;
            }
            return null;
          }).filter((src) => typeof src === "string") : [];
          images = shuffleArray$2(galleryImages);
          if (images.length < 3) {
            const defaultImages = [
              "/mobile-detailing/images/gallery/dodge-viper-gts-grigio-telesto-studio.png",
              "/mobile-detailing/images/gallery/bmw-m4-competition-grigio-telesto-studio.png"
            ];
            images = shuffleArray$2([...images, ...defaultImages]);
          }
        } catch (galleryError) {
          console.warn("Failed to load gallery images:", galleryError);
          images = ["/mobile-detailing/images/gallery/dodge-viper-gts-grigio-telesto-studio.png"];
        }
        if (!cancelled) {
          setReviewImages(images);
          setLoading(false);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setLoading(false);
          setError(err instanceof Error ? err.message : "Failed to load review images");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [reviews]);
  const rotation = useImageRotation({
    images: reviewImages,
    autoRotate: true,
    interval: 8e3,
    // Match FAQ interval
    fadeDuration: 2e3,
    // 2 seconds fade duration
    preloadNext: true});
  const { currentIndex, hasMultipleImages } = rotation;
  return {
    images: reviewImages,
    currentIndex,
    loading,
    error,
    hasMultipleImages,
    ...rotation
  };
}

const ReviewsSummary = ({
  averageRating: propAverageRating,
  totalReviews: propTotalReviews,
  googleBusinessUrl: propGoogleBusinessUrl,
  className = "",
  variant = "default"
}) => {
  const data = useDataOptional();
  const isPreview = data?.isPreview || false;
  const hasReviews = useReviewsAvailability();
  const dbData = useReviewsRating();
  const averageRating = typeof propAverageRating === "number" ? propAverageRating : typeof dbData.averageRating === "number" ? dbData.averageRating : parseFloat(String(dbData.averageRating)) || 4.9;
  const totalReviews = typeof propTotalReviews === "number" ? propTotalReviews : typeof dbData.totalReviews === "number" ? dbData.totalReviews : parseInt(String(dbData.totalReviews), 10) || 112;
  const googleBusinessUrl = propGoogleBusinessUrl ?? dbData.googleBusinessUrl;
  const isCompact = variant === "compact";
  if (!isPreview && !hasReviews) {
    return null;
  }
  const containerClasses = isCompact ? "flex items-center justify-center gap-4" : "flex items-center justify-center gap-8";
  const textSize = isCompact ? "text-lg" : "text-2xl";
  const iconSize = isCompact ? "w-4 h-4" : "w-6 h-6";
  const usersIconSize = isCompact ? "w-4 h-4" : "w-5 h-5";
  const dividerHeight = isCompact ? "h-6" : "h-8";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `${containerClasses} ${className}`, children: [
    isPreview ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2 cursor-pointer", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: `${iconSize} text-orange-400 fill-current` }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `${textSize} font-bold text-white`, children: averageRating.toFixed(1) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-300", children: "average" })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "a",
      {
        href: googleBusinessUrl,
        target: "_blank",
        rel: "noopener noreferrer",
        className: "flex items-center gap-2 hover:opacity-80 transition-opacity duration-200 cursor-pointer",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: `${iconSize} text-orange-400 fill-current` }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `${textSize} font-bold text-white`, children: averageRating.toFixed(1) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-300", children: "average" })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `w-px ${dividerHeight} bg-stone-600` }),
    isPreview ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2 cursor-pointer", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: `${usersIconSize} text-orange-400` }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `${textSize} font-bold text-white`, children: totalReviews.toLocaleString() }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-300", children: "reviews" })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "a",
      {
        href: googleBusinessUrl,
        target: "_blank",
        rel: "noopener noreferrer",
        className: "flex items-center gap-2 hover:opacity-80 transition-opacity duration-200 cursor-pointer",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: `${usersIconSize} text-orange-400` }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `${textSize} font-bold text-white`, children: totalReviews.toLocaleString() }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-300", children: "reviews" })
        ]
      }
    )
  ] });
};

function safeErrorMessage(error) {
  if (typeof error === "string") {
    return error;
  }
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === "object" && error !== null) {
    const errorObj = error;
    if (typeof errorObj.message === "string") {
      return errorObj.message;
    }
  }
  return "An unexpected error occurred";
}
function safeValidationMessage(error) {
  if (typeof error === "object" && error !== null) {
    const errorObj = error;
    if (Array.isArray(errorObj.errors) && errorObj.errors.length > 0) {
      const firstError = errorObj.errors[0];
      if (typeof firstError === "object" && firstError !== null) {
        const err = firstError;
        if (typeof err.message === "string") {
          return err.message;
        }
      }
    }
  }
  return safeErrorMessage(error);
}

const PreviewPayloadSchema = object({
  businessName: string().min(2, "Business name must be at least 2 characters").max(100, "Business name must be less than 100 characters"),
  phone: string().min(7, "Phone number must be at least 7 characters").max(20, "Phone number must be less than 20 characters"),
  city: string().min(2, "City must be at least 2 characters").max(50, "City must be less than 50 characters"),
  state: string().length(2, "State must be 2 characters (e.g., AZ, CA)").regex(/^[A-Z]{2}$/, "State must be uppercase letters"),
  industry: _enum(["mobile-detailing", "maid-service", "lawncare", "pet-grooming"], {
    errorMap: () => ({ message: "Invalid industry type" })
  })
});

async function createPreview(payload) {
  const validation = PreviewPayloadSchema.safeParse(payload);
  if (!validation.success) {
    throw new Error(safeValidationMessage(validation.error));
  }
  try {
    const response = await fetch(`${config.apiUrl || ""}/api/previews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(validation.data)
    });
    if (!response.ok) {
      const error = await response.json();
      const errorMsg = error.message || "Failed to create preview";
      throw new Error(errorMsg);
    }
    const result = await response.json();
    return result;
  } catch (error) {
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new Error("Unable to connect to server. Please check your network connection and ensure you can reach the backend server.");
    }
    throw error;
  }
}
async function verifyPreview(token) {
  try {
    const response = await fetch(
      `${config.apiUrl || ""}/api/preview/verify?t=${encodeURIComponent(token)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
    if (!response.ok) {
      const error = await response.json();
      const errorMsg = error.message || "Failed to verify preview";
      throw new Error(errorMsg);
    }
    const data = await response.json();
    const validation = PreviewPayloadSchema.safeParse(data.payload);
    if (!validation.success) {
      throw new Error("Invalid payload received from server");
    }
    return validation.data;
  } catch (error) {
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new Error("Unable to connect to server. Please check your network connection and ensure you can reach the backend server.");
    }
    throw error;
  }
}

const PreviewCTAButton = ({ position = "left" }) => {
  const navigate = useNavigate();
  const data = useData();
  const currentSection = useSectionStore((s) => s.current);
  const handleGetThisSite = () => {
    void navigate("/tenant-onboarding", {
      state: {
        fromPreview: true,
        businessName: data.businessName,
        phone: data.phone,
        city: data.serviceAreas[0]?.city || "",
        state: data.serviceAreas[0]?.state || "",
        industry: data.industry
      }
    });
  };
  const shouldShowButton = currentSection === "top" || currentSection === "gallery" || currentSection === "gallery-desktop" || currentSection === "footer";
  if (!shouldShowButton) {
    return null;
  }
  if (position === "right") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hidden md:block fixed top-4 right-4 z-[10000]", style: { pointerEvents: "auto" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        onClick: handleGetThisSite,
        className: "flex items-center space-x-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-md transition-colors shadow-lg",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Get This Site" })
        ]
      }
    ) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed left-4 z-[10000] top-[88px] md:top-4", style: { pointerEvents: "auto" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "button",
    {
      type: "button",
      onClick: handleGetThisSite,
      className: "flex items-center space-x-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-md transition-colors shadow-lg",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-4 w-4" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Get This Site" })
      ]
    }
  ) });
};

async function getIndustryTemplate(industry) {
  try {
    let config;
    switch (industry) {
      case "mobile-detailing": {
        const { loadMobileDetailingConfig } = await __vitePreload(async () => { const { loadMobileDetailingConfig } = await import('./index-BbwpX3nH.js');return { loadMobileDetailingConfig }},true?__vite__mapDeps([0,1,2,3,4,5]):void 0,import.meta.url);
        config = loadMobileDetailingConfig();
        break;
      }
      case "pet-grooming": {
        const { loadPetGroomingConfig } = await __vitePreload(async () => { const { loadPetGroomingConfig } = await import('./index-C31ODCSt.js');return { loadPetGroomingConfig }},true?__vite__mapDeps([6,3,4,5]):void 0,import.meta.url);
        config = await loadPetGroomingConfig();
        break;
      }
      case "maid-service": {
        const { loadMaidServiceConfig } = await __vitePreload(async () => { const { loadMaidServiceConfig } = await import('./index-DTw_9gfh.js');return { loadMaidServiceConfig }},true?__vite__mapDeps([7,3,4,5]):void 0,import.meta.url);
        config = await loadMaidServiceConfig();
        break;
      }
      case "lawncare": {
        const { loadLawncareConfig } = await __vitePreload(async () => { const { loadLawncareConfig } = await import('./index-D3OeRrNe.js');return { loadLawncareConfig }},true?__vite__mapDeps([8,3,4,5]):void 0,import.meta.url);
        config = await loadLawncareConfig();
        break;
      }
      default: {
        const unknownIndustry = industry;
        throw new Error(`Unknown industry: ${unknownIndustry}`);
      }
    }
    return {
      tenant: {
        brand: config.brand || null,
        businessName: null,
        customBranding: false
      },
      slug: config.slug || "site",
      urlPath: config.urlPath || "/",
      logo: config.logo,
      seo: {
        Title: config.seo.title,
        subTitle: config.seo.description,
        canonicalPath: config.seo.canonicalPath,
        OgImage: config.seo.ogImage,
        TwitterImage: config.seo.twitterImage,
        robots: config.seo.robots
      },
      hero: {
        h1: config.hero.h1,
        subTitle: config.hero.sub || "",
        Images: config.hero.images || []
      },
      servicesGrid: config.servicesGrid
    };
  } catch (error) {
    console.error("Failed to load industry template:", error);
    const errorMsg = error instanceof Error ? error.message : "Unknown error";
    const industryStr = industry;
    throw new Error(`Failed to load template for industry ${industryStr}: ${errorMsg}`);
  }
}

const PreviewDataProvider = ({
  children,
  payload
}) => {
  const [siteConfig, setSiteConfig] = reactExports.useState(null);
  const [isLoading, setIsLoading] = reactExports.useState(true);
  reactExports.useEffect(() => {
    async function loadTemplate() {
      try {
        setIsLoading(true);
        const template = await getIndustryTemplate(payload.industry);
        setSiteConfig(template);
      } catch (error) {
        console.error("Failed to load industry template:", error);
      } finally {
        setIsLoading(false);
      }
    }
    void loadTemplate();
  }, [payload.industry]);
  const generateEmail = (businessName) => {
    const domain = businessName.toLowerCase().replace(/[^a-z0-9\s]/g, "").replace(/\s+/g, "").trim();
    return `info@${domain}.com`;
  };
  const mockContextValue = {
    businessName: payload.businessName,
    phone: payload.phone,
    email: generateEmail(payload.businessName),
    owner: payload.businessName,
    location: `${payload.city}, ${payload.state}`,
    industry: payload.industry,
    serviceAreas: [
      {
        city: payload.city,
        state: payload.state,
        primary: true
      }
    ],
    socialMedia: {
      facebook: "#",
      instagram: "#",
      youtube: "#",
      tiktok: "#",
      googleBusiness: "#"
    },
    siteConfig,
    isLoading,
    isTenant: true,
    isPreview: true
    // Mark as preview mode
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(DataContext.Provider, { value: mockContextValue, children });
};

const __variableDynamicImportRuntimeHelper = (glob, path, segs) => {
  const v = glob[path];
  if (v) {
    return typeof v === "function" ? v() : Promise.resolve(v);
  }
  return new Promise((_, reject) => {
    (typeof queueMicrotask === "function" ? queueMicrotask : setTimeout)(
      reject.bind(
        null,
        new Error(
          "Unknown variable dynamic import: " + path + (path.split("/").length !== segs ? ". Note that variables only represent file names one level deep." : "")
        )
      )
    );
  });
};

async function loadIndustryFAQs(industry) {
  const categories = [
    "services",
    "pricing",
    "scheduling",
    "locations",
    "preparation",
    "payments",
    "warranty",
    "aftercare",
    "general"
  ];
  try {
    const faqArrays = await Promise.all(
      categories.map(async (category) => {
        try {
          const module = await __variableDynamicImportRuntimeHelper((/* #__PURE__ */ Object.assign({"../../data/mobile-detailing/faq/aftercare.json": () => __vitePreload(() => import('./aftercare-ZKXYZUbn.js'),true?[]:void 0,import.meta.url),"../../data/mobile-detailing/faq/general.json": () => __vitePreload(() => import('./general-BhqPoWqx.js'),true?[]:void 0,import.meta.url),"../../data/mobile-detailing/faq/locations.json": () => __vitePreload(() => import('./locations-D5I2ap43.js'),true?[]:void 0,import.meta.url),"../../data/mobile-detailing/faq/payments.json": () => __vitePreload(() => import('./payments-CrPeLMHg.js'),true?[]:void 0,import.meta.url),"../../data/mobile-detailing/faq/preparation.json": () => __vitePreload(() => import('./preparation-Btp8GDff.js'),true?[]:void 0,import.meta.url),"../../data/mobile-detailing/faq/pricing.json": () => __vitePreload(() => import('./pricing-Bzt245QG.js'),true?[]:void 0,import.meta.url),"../../data/mobile-detailing/faq/scheduling.json": () => __vitePreload(() => import('./scheduling-Cx-yGBz2.js'),true?[]:void 0,import.meta.url),"../../data/mobile-detailing/faq/services.json": () => __vitePreload(() => import('./services-BqnJbWY7.js'),true?[]:void 0,import.meta.url),"../../data/mobile-detailing/faq/warranty.json": () => __vitePreload(() => import('./warranty-CGuBowID.js'),true?[]:void 0,import.meta.url)})), `../../data/${industry}/faq/${category}.json`, 6);
          return module.default;
        } catch {
          console.warn(`FAQ category ${category} not found for ${industry}, skipping`);
          return [];
        }
      })
    );
    const allFAQs = faqArrays.flat();
    return allFAQs.map((faq, index) => ({
      ...faq,
      id: `${industry}-${String(index)}`
    }));
  } catch (error) {
    console.error(`Failed to load FAQs for ${industry}:`, error);
    return [];
  }
}

const useFAQData = () => {
  const [openItems, setOpenItems] = reactExports.useState(/* @__PURE__ */ new Set());
  const [faqData, setFaqData] = reactExports.useState([]);
  const { industry } = useData();
  reactExports.useEffect(() => {
    if (!industry) return;
    loadIndustryFAQs(industry).then(setFaqData).catch((error) => {
      console.error("Failed to load FAQs:", error);
      setFaqData([]);
    });
  }, [industry]);
  const toggleItem = (question) => {
    setOpenItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(question)) {
        newSet.delete(question);
      } else {
        newSet.add(question);
      }
      return newSet;
    });
  };
  const resetState = () => {
    setOpenItems(/* @__PURE__ */ new Set());
  };
  return {
    faqData,
    openItems,
    toggleItem,
    resetState
  };
};

const useFAQContent = (props) => {
  const { siteData } = useIndustrySiteData();
  const locationData = props?.locationData;
  const { content: websiteContent } = useWebsiteContent();
  const { faqData: industryFAQs } = useFAQData();
  const faqTitle = websiteContent?.faq_title ?? siteData?.faq?.title ?? "Frequently Asked Questions";
  const faqSubtitle = websiteContent?.faq_subtitle ?? siteData?.faq?.subtitle ?? locationData?.faqIntro ?? "Find answers to common questions about our services";
  const databaseFAQs = reactExports.useMemo(() => {
    if (!websiteContent?.faq_items || !Array.isArray(websiteContent.faq_items)) {
      return [];
    }
    return websiteContent.faq_items.map((faq, index) => ({
      id: `db-${String(index)}`,
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- faq properties from database might be null
      question: String(faq.question ?? ""),
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- faq properties from database might be null
      answer: String(faq.answer ?? ""),
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- faq properties from database might be null
      category: String(faq.category ?? "General")
    }));
  }, [websiteContent?.faq_items]);
  const locationFAQs = reactExports.useMemo(() => {
    if (!locationData?.faqs) return [];
    return locationData.faqs.map((faq, index) => ({
      id: `location-${String(index)}`,
      question: faq.q,
      answer: faq.a,
      category: locationData.city ?? "Location"
    }));
  }, [locationData]);
  const faqItems = reactExports.useMemo(() => {
    if (databaseFAQs.length > 0) {
      return [...databaseFAQs, ...locationFAQs];
    }
    return [...industryFAQs, ...locationFAQs];
  }, [databaseFAQs, industryFAQs, locationFAQs]);
  const categories = reactExports.useMemo(() => {
    const uniqueCategories = Array.from(new Set(faqItems.map((faq) => faq.category)));
    return ["All", ...uniqueCategories];
  }, [faqItems]);
  return {
    faqTitle: String(faqTitle),
    faqSubtitle: String(faqSubtitle),
    faqItems,
    categories
  };
};

function shuffleArray$1(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = shuffled[i];
    const itemAtJ = shuffled[j];
    if (temp !== void 0 && itemAtJ !== void 0) {
      shuffled[i] = itemAtJ;
      shuffled[j] = temp;
    }
  }
  return shuffled;
}
function useRotatingBackground() {
  const [galleryImages, setGalleryImages] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [error, setError] = reactExports.useState(null);
  reactExports.useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const res = await fetch("/mobile-detailing/data/gallery.json");
        if (!res.ok) throw new Error(`Failed to fetch gallery data: ${String(res.status)}`);
        const data = await res.json();
        if (cancelled) return;
        const shuffledData = shuffleArray$1(data);
        setGalleryImages(shuffledData);
        setLoading(false);
        setError(null);
      } catch (err) {
        setLoading(false);
        setError(err instanceof Error ? err.message : "Failed to load gallery data");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);
  const imageUrls = galleryImages.map((img) => img.src);
  const rotation = useImageRotation({
    images: imageUrls,
    autoRotate: true,
    interval: 7e3,
    // 7 seconds to match original
    fadeDuration: 2e3,
    // 2 seconds fade duration
    preloadNext: true});
  const { currentIndex, hasMultipleImages } = rotation;
  return {
    images: galleryImages,
    currentIndex,
    loading,
    error,
    hasMultipleImages
  };
}

const categoryIcons = {
  All: Car,
  General: Car,
  Services: Car,
  Scheduling: Settings,
  Pricing: CreditCard,
  Preparation: Shield,
  RV: Car,
  Locations: MapPin,
  Payments: CreditCard,
  Warranty: Shield,
  Aftercare: Shield
};
const FAQCategoryFilter = ({
  selectedCategory,
  onCategoryChange,
  categories
}) => {
  const renderChip = (categoryName) => {
    const isSelected = selectedCategory === categoryName;
    const IconComponent = categoryIcons[categoryName] || MapPin;
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      FilterChip,
      {
        onClick: () => {
          onCategoryChange(categoryName);
        },
        isSelected,
        icon: IconComponent,
        className: "transform hover:scale-105 backdrop-blur-sm text-sm md:text-base",
        children: categoryName
      },
      categoryName
    );
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap justify-center gap-2 md:gap-3 max-w-3xl mx-auto", children: categories.map(renderChip) });
};

const FAQEmptyState = () => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-12", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-stone-800/80 backdrop-blur-sm rounded-lg p-8 border border-stone-700/50 shadow-xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "h-12 w-12 text-stone-400 mx-auto mb-4" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-semibold text-white mb-2", children: "No FAQs Found" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-stone-400", children: "Try adjusting your search or selecting a different category." })
  ] }) });
};

const ServiceAreasModal = ({
  isOpen,
  onClose,
  serviceAreas,
  businessName = "Our Business"
}) => {
  const areasByState = reactExports.useMemo(() => {
    const grouped = {};
    serviceAreas.forEach((area) => {
      if (!grouped[area.state]) {
        grouped[area.state] = [];
      }
      grouped[area.state].push(area);
    });
    const sortedStates = Object.keys(grouped).sort();
    const result = {};
    sortedStates.forEach((state) => {
      result[state] = grouped[state].sort((a, b) => {
        if (a.primary && !b.primary) return -1;
        if (!a.primary && b.primary) return 1;
        return a.city.localeCompare(b.city);
      });
    });
    return result;
  }, [serviceAreas]);
  if (!isOpen) return null;
  const modalContent = /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-stone-800 rounded-lg shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden border border-stone-700", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-6 border-b border-stone-700", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold text-white", children: "Service Areas" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-gray-400 mt-1", children: [
          "Where ",
          businessName,
          " provides mobile detailing services"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: onClose,
          className: "text-gray-400 hover:text-white transition-colors p-2 hover:bg-stone-700 rounded-lg",
          "aria-label": "Close modal",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-6 w-6" })
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 overflow-y-auto max-h-[calc(80vh-120px)]", children: [
      Object.entries(areasByState).map(([state, areas]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-8 last:mb-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-5 w-5 text-orange-400" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-semibold text-orange-400", children: state }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-gray-400 text-sm", children: [
            "(",
            areas.length,
            " ",
            areas.length === 1 ? "city" : "cities",
            ")"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 ml-7", children: areas.map((area, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center gap-2 text-gray-300 hover:text-white transition-colors",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-1.5 h-1.5 rounded-full bg-orange-400 flex-shrink-0" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm", children: [
                area.city,
                area.primary && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-2 text-xs text-orange-400 font-medium", children: "Primary" })
              ] })
            ]
          },
          `${area.state}-${area.city}-${index}`
        )) })
      ] }, state)),
      serviceAreas.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-12", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-12 w-12 text-gray-600 mx-auto mb-4" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-400", children: "No service areas configured" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-6 border-t border-stone-700 bg-stone-900", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-gray-400", children: [
        serviceAreas.length,
        " total service ",
        serviceAreas.length === 1 ? "area" : "areas"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: onClose,
          className: "px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors font-medium",
          children: "Close"
        }
      )
    ] }) })
  ] }) });
  return reactDomExports.createPortal(modalContent, document.body);
};

const ServiceAreasLink = ({
  children = "view our service areas",
  className = ""
}) => {
  const [isModalOpen, setIsModalOpen] = reactExports.useState(false);
  const tenantData = useData();
  if (tenantData.serviceAreas.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        onClick: () => {
          setIsModalOpen(true);
        },
        className: `text-orange-400 hover:text-orange-300 underline transition-colors cursor-pointer bg-transparent border-none p-0 font-inherit ${className}`,
        children
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ServiceAreasModal,
      {
        isOpen: isModalOpen,
        onClose: () => {
          setIsModalOpen(false);
        },
        serviceAreas: tenantData.serviceAreas,
        businessName: tenantData.businessName
      }
    )
  ] });
};

const FAQItem = ({ faq, isExpanded, onToggle }) => {
  const handleToggle = () => {
    if (faq.id && !isExpanded) {
      if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", "faq_expanded", {
          faq_id: faq.id,
          faq_question: faq.question,
          faq_category: faq.category
        });
      }
    }
    onToggle();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "bg-stone-800/80 backdrop-blur-sm rounded-lg border border-stone-700/50 overflow-hidden hover:shadow-xl hover:shadow-black/30 transition-all duration-300 h-fit",
      "data-faq-id": faq.id,
      "data-faq-category": faq.category,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: handleToggle,
            className: "w-full px-4 py-4 text-left flex justify-between items-start hover:bg-stone-700/40 transition-colors duration-200 group",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 pr-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-white font-semibold text-base group-hover:text-orange-400 transition-colors duration-200 leading-tight", children: faq.question }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                ChevronDown,
                {
                  className: `h-4 w-4 text-stone-400 transition-transform duration-200 flex-shrink-0 mt-1 ${isExpanded ? "rotate-180 text-orange-400" : ""}`
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: `overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? "max-h-48 opacity-100" : "max-h-0 opacity-0"}`,
            children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 pb-4 border-t border-stone-700/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pt-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-stone-300 text-sm leading-relaxed", children: faq.question === "What areas do you service?" ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              faq.answer.split("We proudly serve")[0],
              "We proudly serve",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx(ServiceAreasLink, { children: "our service areas" }),
              faq.answer.includes("We proudly serve.") ? faq.answer.split("We proudly serve.")[1] : faq.answer.split("We proudly serve")[1] || ""
            ] }) : faq.answer }) }) })
          }
        )
      ]
    }
  );
};

const FAQList = ({ faqs, expandedFaq, onToggleFaq }) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-5 lg:gap-6", children: faqs.map((faq, index) => {
    const key = faq.id ?? `faq-${String(index)}`;
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      FAQItem,
      {
        faq,
        isExpanded: expandedFaq === key,
        onToggle: () => {
          onToggleFaq(key);
        }
      },
      key
    );
  }) });
};

const FAQSearchBar = ({ searchTerm, onSearchChange }) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative max-w-md mx-auto mb-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 h-5 w-5" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        type: "text",
        placeholder: "Search FAQs...",
        value: searchTerm,
        onChange: (e) => {
          onSearchChange(e.target.value);
        },
        className: "w-full pl-10 pr-4 py-3 bg-stone-800/80 backdrop-blur-sm border border-stone-600/50 rounded-lg text-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 shadow-lg"
      }
    )
  ] });
};

const FAQ = ({ locationData }) => {
  const [selectedCategory, setSelectedCategory] = reactExports.useState("Services");
  const [expandedFaq, setExpandedFaq] = reactExports.useState(null);
  const [searchTerm, setSearchTerm] = reactExports.useState("");
  const { faqTitle, faqSubtitle, faqItems, categories } = useFAQContent({ locationData });
  const { images, currentIndex, loading: backgroundLoading } = useRotatingBackground();
  const filteredFaqs = faqItems.filter((faq) => {
    const matchesCategory = selectedCategory === "All" || faq.category === selectedCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) || faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });
  const toggleFaq = (id) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { id: "faq", className: "relative h-screen snap-start snap-always overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 z-0", children: [
      images.map((image, index) => {
        return /* @__PURE__ */ jsxRuntimeExports.jsx(
          "img",
          {
            src: image.src,
            alt: image.alt || `FAQ background image ${String(index + 1)}`,
            className: `absolute inset-0 w-full h-full object-cover ${getImageOpacityClasses(index, currentIndex, 2e3)}`,
            style: getTransitionStyles(2e3),
            decoding: index === 0 ? "sync" : "async",
            loading: index === 0 ? "eager" : "lazy"
          },
          image.id
        );
      }),
      !images.length && !backgroundLoading && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "absolute inset-0",
          style: {
            backgroundImage: "url(/images/gallery/dodge-viper-gts-grigio-telesto-studio.png)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed"
          }
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-stone-900/85" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative z-10 h-full overflow-y-auto pt-[72px] md:pt-[88px]", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-6xl mx-auto w-full px-4 py-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-4xl md:text-5xl font-bold text-white mb-3 drop-shadow-lg", children: faqTitle }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-stone-200 text-lg max-w-2xl mx-auto drop-shadow-md", children: faqSubtitle })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          FAQSearchBar,
          {
            searchTerm,
            onSearchChange: setSearchTerm
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          FAQCategoryFilter,
          {
            selectedCategory,
            onCategoryChange: setSelectedCategory,
            categories
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-4xl mx-auto", children: filteredFaqs.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(FAQEmptyState, {}) : /* @__PURE__ */ jsxRuntimeExports.jsx(
        FAQList,
        {
          faqs: filteredFaqs,
          expandedFaq,
          onToggleFaq: toggleFaq
        }
      ) })
    ] }) })
  ] });
};

const Disclaimer = ({ businessInfo }) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-t border-stone-600 pt-4 md:pt-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-gray-300 text-sm md:text-base", children: [
    "© 2024 ",
    businessInfo.name,
    ". All rights reserved."
  ] }) }) }) });
};

const FollowUs = ({ socialMedia }) => {
  const { isPreview } = useData();
  const socialLinks = [
    {
      platform: "Facebook",
      url: socialMedia?.facebook,
      icon: SiFacebook,
      label: "Facebook"
    },
    {
      platform: "Instagram",
      url: socialMedia?.instagram,
      icon: SiInstagram,
      label: "Instagram"
    },
    {
      platform: "TikTok",
      url: socialMedia?.tiktok,
      icon: SiTiktok,
      label: "TikTok"
    },
    {
      platform: "YouTube",
      url: socialMedia?.youtube,
      icon: SiYoutube,
      label: "YouTube"
    }
  ];
  const visibleLinks = socialLinks.filter((link) => link.url !== void 0);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-bold text-orange-400 text-xl mb-6", children: "Follow Us" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "inline-flex flex-col space-y-3 items-start", children: visibleLinks.map(({ platform, url, icon: Icon, label }) => {
      const hasUrl = url && url.trim() !== "";
      if (isPreview) {
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "span",
          {
            className: "text-white hover:text-orange-400 transition-colors duration-200 flex items-center space-x-2 md:space-x-3 cursor-pointer",
            title: "Social media links available in your live site",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-4 w-4 md:h-5 md:w-5 flex-shrink-0" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm md:text-lg", children: label })
            ]
          },
          platform
        );
      }
      if (!hasUrl) {
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "span",
          {
            className: "text-white hover:text-orange-400 transition-colors duration-200 flex items-center space-x-2 md:space-x-3 cursor-pointer",
            title: "Social media link not configured",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-4 w-4 md:h-5 md:w-5 flex-shrink-0" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm md:text-lg", children: label })
            ]
          },
          platform
        );
      }
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "a",
        {
          href: url,
          target: "_blank",
          rel: "noopener noreferrer",
          className: "text-white hover:text-orange-400 transition-colors duration-200 flex items-center space-x-3",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-5 w-5 flex-shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg", children: label })
          ]
        },
        platform
      );
    }) })
  ] });
};

const BusinessInfo = () => {
  const { businessName, phone, location, isTenant } = useData();
  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  if (!isTenant) {
    return null;
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col space-y-1 md:space-y-1 md:ml-2 min-w-0 flex-1", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        onClick: handleClick,
        className: "hover:opacity-80 transition-opacity text-left min-w-0",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold text-white leading-tight truncate", children: businessName })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 md:gap-2 min-w-0 flex-wrap", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "a",
        {
          href: `tel:${phone || "5551234580"}`,
          className: "text-sm md:text-sm lg:text-base text-stone-300 hover:text-orange-400 transition-colors truncate flex-shrink-0",
          children: formatPhoneNumber(phone || "(555) 123-4580")
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-stone-400 flex-shrink-0 text-sm", children: "•" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-4 w-4 md:h-4 md:w-4 text-orange-400 flex-shrink-0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm md:text-sm lg:text-base text-orange-400 truncate", children: location || "Service Area" })
      ] })
    ] })
  ] });
};

reactExports.createContext(null);

const NAV_LINKS = [
  { name: "Home", href: "#top" },
  { name: "Services", href: "#services" },
  { name: "Reviews", href: "#reviews" },
  { name: "FAQ", href: "#faq", isFAQ: true },
  { name: "Gallery", href: "#gallery", isGallery: true }
];

const scrollToSection = (sectionId) => {
  const cleanId = sectionId.replace("#", "");
  const isDesktop = window.innerWidth >= 768;
  let targetId = cleanId;
  if (cleanId === "services") {
    targetId = isDesktop ? "services-desktop" : "services";
  } else if (cleanId === "footer") {
    targetId = isDesktop ? "gallery-desktop" : "footer";
  }
  const element = document.getElementById(targetId);
  if (element) {
    const scrollContainer = document.querySelector(".snap-container");
    if (scrollContainer) {
      scrollContainer.classList.remove("snap-y", "snap-mandatory");
      element.scrollIntoView({ behavior: "smooth" });
      setTimeout(() => {
        scrollContainer.classList.add("snap-y", "snap-mandatory");
      }, 1e3);
    } else {
      element.scrollIntoView({ behavior: "smooth" });
    }
  }
};
const handleSectionClick = (sectionId) => {
  scrollToSection(sectionId);
};

const Logo = () => {
  const { industry, isLoading: isDataLoading } = useData();
  const { data: tenantConfig, isLoading: isConfigLoading } = useTenantConfigLoader();
  const isLoading = isDataLoading || isConfigLoading;
  const logoUrl = tenantConfig?.branding.logo.url;
  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const src = logoUrl || getTenantAssetUrl({
    vertical: industry,
    type: "logo"
  });
  const alt = tenantConfig?.branding.businessName || `${industry} Logo`;
  if (isLoading && !src) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 lg:h-16 lg:w-16 bg-gray-200 animate-pulse rounded flex-shrink-0" });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "button",
    {
      onClick: handleClick,
      className: "flex items-center hover:opacity-80 transition-opacity flex-shrink-0",
      "aria-label": `${industry} home`,
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("picture", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("source", { srcSet: src.endsWith(".webp") ? src : src.replace(/\.(png|jpg|jpeg)$/i, ".webp"), type: "image/webp" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "img",
          {
            src,
            alt,
            className: "h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 lg:h-16 lg:w-16",
            width: 64,
            height: 64,
            decoding: "async",
            loading: "eager"
          }
        )
      ] })
    }
  );
};

const Navigation = ({ activeSection }) => {
  const hasReviews = useReviewsAvailability();
  const filteredNavLinks = NAV_LINKS.filter((link) => {
    if (link.name === "Reviews") {
      return hasReviews;
    }
    return true;
  });
  const isActive = (link) => {
    const isLinkActive = link.name === "Home" && activeSection === "top" || link.name === "Services" && activeSection === "services" || link.name === "Reviews" && activeSection === "reviews" || link.name === "FAQ" && activeSection === "faq" || link.name === "Gallery" && activeSection === "footer";
    return isLinkActive;
  };
  const getNavItemClasses = (link) => {
    const isLinkActive = isActive(link);
    const baseClasses = "nav-link hover:text-orange-400 focus:text-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 focus:ring-offset-black/20 transition-colors duration-200 p-2 font-inherit cursor-pointer rounded";
    const finalClasses = isLinkActive ? `${baseClasses} text-orange-400 bg-transparent border-none ring-2 ring-orange-400 ring-offset-2 ring-offset-black/20` : `${baseClasses} text-white bg-transparent border-none`;
    return finalClasses;
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { "aria-label": "Primary navigation", className: "hidden xl:flex space-x-6", children: filteredNavLinks.map((link) => link.isFAQ ? /* @__PURE__ */ jsxRuntimeExports.jsx(
    "button",
    {
      onClick: (e) => {
        handleSectionClick("#faq");
        e.currentTarget.blur();
      },
      className: getNavItemClasses(link),
      "aria-label": `Scroll to ${link.name} section`,
      children: link.name
    },
    link.name
  ) : link.isGallery ? /* @__PURE__ */ jsxRuntimeExports.jsx(
    "button",
    {
      onClick: (e) => {
        handleSectionClick("#footer");
        e.currentTarget.blur();
      },
      className: getNavItemClasses(link),
      "aria-label": `Scroll to ${link.name} section`,
      children: link.name
    },
    link.name
  ) : link.name === "Reviews" ? /* @__PURE__ */ jsxRuntimeExports.jsx(
    "button",
    {
      onClick: (e) => {
        handleSectionClick("#reviews");
        e.currentTarget.blur();
      },
      className: getNavItemClasses(link),
      "aria-label": `Scroll to ${link.name} section`,
      children: link.name
    },
    link.name
  ) : link.name === "Home" ? /* @__PURE__ */ jsxRuntimeExports.jsx(
    "button",
    {
      onClick: (e) => {
        handleSectionClick("#top");
        e.currentTarget.blur();
      },
      className: getNavItemClasses(link),
      "aria-label": `Scroll to ${link.name} section`,
      children: link.name
    },
    link.name
  ) : link.name === "Services" ? /* @__PURE__ */ jsxRuntimeExports.jsx(
    "button",
    {
      onClick: (e) => {
        handleSectionClick("#services");
        e.currentTarget.blur();
      },
      className: getNavItemClasses(link),
      "aria-label": `Scroll to ${link.name} section`,
      children: link.name
    },
    link.name
  ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
    "a",
    {
      href: link.href,
      className: getNavItemClasses(link),
      "aria-label": `Navigate to ${link.name} page`,
      children: link.name
    },
    link.name
  )) });
};

const TikTokIcon = ({ className }) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  "svg",
  {
    className,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" })
  }
);
const SocialMediaIcons = () => {
  const { isTenant, socialMedia, siteConfig, isPreview } = useData();
  const socials = isTenant ? socialMedia : siteConfig?.socials;
  const socialLinks = [
    {
      platform: "Facebook",
      url: socials?.facebook,
      icon: SiFacebook,
      ariaLabel: "Visit our Facebook page"
    },
    {
      platform: "Instagram",
      url: socials?.instagram,
      icon: SiInstagram,
      ariaLabel: "Visit our Instagram page"
    },
    {
      platform: "TikTok",
      url: socials?.tiktok,
      icon: TikTokIcon,
      ariaLabel: "Visit our TikTok page"
    },
    {
      platform: "YouTube",
      url: socials?.youtube,
      icon: SiYoutube,
      ariaLabel: "Visit our YouTube channel"
    }
  ];
  const visibleLinks = socialLinks.filter((link) => {
    const url = link.url;
    return typeof url === "string";
  });
  if (visibleLinks.length === 0) {
    return null;
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center space-x-3 ml-4", children: visibleLinks.map(({ platform, url, icon: Icon, ariaLabel }) => {
    const href = url;
    const hasUrl = href && href.trim() !== "";
    if (isPreview) {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        "span",
        {
          className: "text-white hover:text-orange-400 transition-colors duration-200 cursor-pointer",
          "aria-label": ariaLabel,
          title: "Social media links available in your live site",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-5 w-5" })
        },
        platform
      );
    }
    if (!hasUrl) {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        "span",
        {
          className: "text-white hover:text-orange-400 transition-colors duration-200 cursor-pointer",
          "aria-label": ariaLabel,
          title: "Social media link not configured",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-5 w-5" })
        },
        platform
      );
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "a",
      {
        href,
        target: "_blank",
        rel: "noopener noreferrer",
        className: "text-white hover:text-orange-400 transition-colors duration-200",
        "aria-label": ariaLabel,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-5 w-5" })
      },
      platform
    );
  }) });
};

function Header() {
  const [open, setOpen] = reactExports.useState(false);
  const hasReviews = useReviewsAvailability();
  const currentSection = useSectionStore((s) => s.current);
  const activeSection = getNavId(currentSection) || "top";
  reactExports.useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "header",
    {
      role: "banner",
      className: "fixed top-0 left-0 right-0 z-50 bg-black/40 backdrop-blur supports-[backdrop-filter]:backdrop-blur w-full",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "a",
          {
            href: "#main",
            className: "sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-orange-500 focus:text-white focus:rounded-md",
            children: "Skip to content"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "py-3 sm:py-4 md:py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-4 md:px-6 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex md:hidden items-center justify-between gap-3 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-1 min-w-0 overflow-hidden", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Logo, {}),
              /* @__PURE__ */ jsxRuntimeExports.jsx(BusinessInfo, {})
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                "aria-label": open ? "Close menu" : "Open menu",
                "aria-expanded": open,
                "aria-controls": "mobile-menu",
                onClick: () => {
                  setOpen((v) => !v);
                },
                className: "flex-shrink-0 inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-orange-400",
                children: open ? /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-6 w-6" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Menu, { className: "h-6 w-6" })
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden md:flex items-center gap-4 lg:gap-6 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Logo, {}),
            /* @__PURE__ */ jsxRuntimeExports.jsx(BusinessInfo, {}),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 lg:gap-6 ml-auto flex-shrink-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Navigation, { activeSection }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SocialMediaIcons, {})
            ] })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            id: "mobile-menu",
            role: "dialog",
            "aria-modal": "true",
            className: `md:hidden absolute inset-x-0 top-full z-50 bg-black/90 transition-opacity duration-200
          ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`,
            "aria-hidden": !open,
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-6 space-y-4 max-w-7xl mx-auto", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "sr-only", children: "Mobile Navigation Menu" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { "aria-label": "Mobile navigation", className: "space-y-2", children: [
                (() => {
                  const handleClick = () => {
                    document.documentElement.style.overflow = "";
                    setOpen(false);
                  };
                  return NAV_LINKS.filter((link) => {
                    if (link.name === "Reviews") return hasReviews;
                    return true;
                  }).map((link) => {
                    return link.isFAQ ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        onClick: () => {
                          handleSectionClick("#faq");
                          handleClick();
                        },
                        className: "nav-link w-full text-left px-4 py-3 rounded-lg text-base sm:text-lg text-white bg-transparent hover:text-orange-400 hover:bg-orange-500/10 focus:text-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 focus:ring-offset-black/20 transition-colors duration-200",
                        "aria-label": `Scroll to ${link.name} section`,
                        children: link.name
                      },
                      link.name
                    ) : link.isGallery ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        onClick: () => {
                          handleSectionClick("#gallery");
                          handleClick();
                        },
                        className: "nav-link w-full text-left px-4 py-3 rounded-lg text-base sm:text-lg text-white bg-transparent hover:text-orange-400 hover:bg-orange-500/10 focus:text-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 focus:ring-offset-black/20 transition-colors duration-200",
                        "aria-label": `Scroll to ${link.name} section`,
                        children: link.name
                      },
                      link.name
                    ) : link.name === "Reviews" ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        onClick: () => {
                          handleSectionClick("#reviews");
                          handleClick();
                        },
                        className: "nav-link w-full text-left px-4 py-3 rounded-lg text-base sm:text-lg text-white bg-transparent hover:text-orange-400 hover:bg-orange-500/10 focus:text-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 focus:ring-offset-black/20 transition-colors duration-200",
                        "aria-label": `Scroll to ${link.name} section`,
                        children: link.name
                      },
                      link.name
                    ) : link.name === "Home" ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        onClick: () => {
                          handleSectionClick("#top");
                          handleClick();
                        },
                        className: "nav-link w-full text-left px-4 py-3 rounded-lg text-base sm:text-lg text-white bg-transparent hover:text-orange-400 hover:bg-orange-500/10 focus:text-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 focus:ring-offset-black/20 transition-colors duration-200",
                        "aria-label": `Scroll to ${link.name} section`,
                        children: link.name
                      },
                      link.name
                    ) : link.name === "Services" ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        onClick: () => {
                          handleSectionClick("#services");
                          handleClick();
                        },
                        className: "nav-link w-full text-left px-4 py-3 rounded-lg text-base sm:text-lg text-white bg-transparent hover:text-orange-400 hover:bg-orange-500/10 focus:text-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 focus:ring-offset-black/20 transition-colors duration-200",
                        "aria-label": `Scroll to ${link.name} section`,
                        children: link.name
                      },
                      link.name
                    ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "a",
                      {
                        href: link.href,
                        onClick: handleClick,
                        className: "nav-link block w-full text-left px-4 py-3 rounded-lg text-base sm:text-lg text-white bg-transparent hover:text-orange-400 hover:bg-orange-500/10 focus:text-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 focus:ring-offset-black/20 transition-colors duration-200",
                        "aria-label": `Navigate to ${link.name} page`,
                        children: link.name
                      },
                      link.name
                    );
                  });
                })(),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    onClick: () => {
                      handleSectionClick("#footer");
                      const closeMobileMenu = () => {
                        document.documentElement.style.overflow = "";
                        setOpen(false);
                      };
                      closeMobileMenu();
                    },
                    className: "nav-link w-full text-left px-4 py-3 rounded-lg text-base sm:text-lg text-white bg-transparent hover:text-orange-400 hover:bg-orange-500/10 focus:text-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 focus:ring-offset-black/20 transition-colors duration-200",
                    "aria-label": "Scroll to Contact section",
                    children: "Contact"
                  }
                )
              ] })
            ] })
          }
        )
      ]
    }
  );
}

const CTA = ({
  className = "",
  onRequestQuote
}) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    CTAButtons,
    {
      className,
      bookNowProps: {},
      getQuoteProps: {
        onClick: onRequestQuote
      }
    }
  );
};

const TextDisplay = ({
  title,
  subtitle,
  className = ""
}) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `text-center text-white max-w-4xl mx-auto px-4 sm:px-6 ${className}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-1 sm:mb-4 md:mb-6 [text-wrap:balance] leading-tight", children: title }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-gray-200 leading-relaxed", children: subtitle })
  ] });
};

const ContentContainer = ({
  title,
  subtitle,
  onRequestQuote,
  className = ""
}) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `flex flex-col items-center justify-end h-full ${className}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      TextDisplay,
      {
        title,
        subtitle,
        className: "mb-0 sm:mb-8"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CTA, { onRequestQuote }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ReviewsSummary,
      {
        variant: "compact",
        className: "mt-0 sm:mt-6 text-base sm:text-lg md:text-xl"
      }
    )
  ] });
};

const useHeroContent = (props) => {
  const { siteData } = useIndustrySiteData();
  const { content: websiteContent } = useWebsiteContent();
  const locationData = props?.locationData;
  const title = String(websiteContent?.hero_title || siteData?.hero.h1 || "Professional Services");
  const subtitle = String(websiteContent?.hero_subtitle || siteData?.hero.sub || "Quality service for your needs");
  return {
    title,
    subtitle,
    isLocation: false,
    // All sites are now tenant-based
    locationName: locationData?.city ?? ""
  };
};

const ImageCarousel = ({
  autoRotate = true,
  interval = 7e3
}) => {
  const { siteConfig } = useData();
  const heroImages = siteConfig?.hero?.Images || [];
  const imageData = heroImages;
  const images = imageData.map((img) => img.url);
  const rotation = useImageRotation({
    images: images.length > 0 ? images : [""],
    // Provide dummy array if empty
    autoRotate,
    interval,
    fadeDuration: 2e3,
    // 2s fade duration to match original
    preloadNext: true});
  const { currentIndex } = rotation;
  if (images.length === 0) {
    return null;
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 pointer-events-none", "aria-hidden": "true", children: [
    images.map((image, index) => {
      const imgData = imageData[index];
      const desktopUrl = image;
      const mobileUrl = imgData?.mobileUrl;
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "absolute inset-0",
          style: getTransitionStyles(2e3),
          children: mobileUrl ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "img",
              {
                src: mobileUrl,
                alt: imgData.alt || "",
                className: "absolute inset-0 w-full h-full object-cover object-top sm:hidden",
                style: {
                  opacity: index === currentIndex ? 1 : 0,
                  transition: "opacity 2s ease-in-out",
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  top: 0,
                  left: 0,
                  zIndex: index === currentIndex ? 2 : 1
                },
                loading: index === 0 ? "eager" : "lazy",
                decoding: "async"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "img",
              {
                src: desktopUrl,
                alt: imgData.alt || "",
                className: "absolute inset-0 w-full h-full object-cover object-center hidden sm:block",
                style: {
                  opacity: index === currentIndex ? 1 : 0,
                  transition: "opacity 2s ease-in-out",
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  top: 0,
                  left: 0,
                  zIndex: index === currentIndex ? 2 : 1
                },
                loading: index === 0 ? "eager" : "lazy",
                decoding: "async"
              }
            )
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: desktopUrl,
              alt: imgData?.alt || "",
              className: "absolute inset-0 w-full h-full object-cover object-top sm:object-center",
              style: {
                opacity: index === currentIndex ? 1 : 0,
                transition: "opacity 2s ease-in-out",
                width: "100%",
                height: "100%",
                position: "absolute",
                top: 0,
                left: 0,
                zIndex: index === currentIndex ? 2 : 1
              },
              loading: index === 0 ? "eager" : "lazy",
              decoding: "async"
            }
          )
        },
        index
      );
    }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/30 pointer-events-none" })
  ] });
};

const Hero = ({ onRequestQuote }) => {
  const { title, subtitle } = useHeroContent({});
  const isSmallMobile = useMediaQuery(`(max-width: ${BREAKPOINTS.sm - 1}px)`);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "section",
    {
      id: "top",
      className: "relative isolate overflow-hidden h-[100dvh] sm:h-screen flex items-end justify-center snap-start snap-always",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 -z-10", style: { top: "-72px", height: "calc(100% + 72px)" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(ImageCarousel, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "main",
          {
            id: "main",
            className: "relative z-10 w-full",
            style: {
              marginTop: "72px",
              paddingBottom: isSmallMobile ? "56px" : "7rem"
            },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              ContentContainer,
              {
                title,
                subtitle,
                ...onRequestQuote && { onRequestQuote },
                className: ""
              }
            )
          }
        )
      ]
    }
  );
};

const ReviewCard = ({ review, onReviewClick }) => {
  const handleClick = () => {
    onReviewClick?.(review);
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onReviewClick?.(review);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "relative bg-white/10 backdrop-blur-sm rounded-lg p-6 md:p-8 lg:p-9 cursor-pointer hover:bg-white/20 transition-colors",
      onClick: handleClick,
      onKeyDown: handleKeyDown,
      role: "button",
      tabIndex: 0,
      "aria-label": `Review by ${review.customerName}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center mb-4 md:mb-5 lg:mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center text-white font-semibold overflow-hidden", children: review.profileImage ? /* @__PURE__ */ jsxRuntimeExports.jsxs("picture", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "source",
              {
                type: "image/webp",
                srcSet: `${review.profileImage.replace(/\.(png|jpg|jpeg)$/i, ".webp")} 64w`,
                sizes: "64px"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "img",
              {
                src: review.profileImage,
                alt: review.customerName,
                className: "w-full h-full object-cover rounded-full",
                width: 64,
                height: 64,
                loading: "lazy",
                decoding: "async"
              }
            )
          ] }) : review.customerName.charAt(0).toUpperCase() }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-white font-semibold text-lg", children: review.customerName }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center", children: Array.from({ length: 5 }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: `text-2xl ${i < review.rating ? "text-yellow-400" : "text-gray-400"}`,
                children: "★"
              },
              i
            )) })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col justify-start pb-16", children: [
          review.title && /* @__PURE__ */ jsxRuntimeExports.jsxs("h5", { className: "text-white font-medium mb-2 text-base", children: [
            review.title.split(" ").slice(0, 8).join(" "),
            review.title.split(" ").length > 8 && "..."
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-gray-300 text-base leading-relaxed", children: [
            review.reviewText.split(" ").slice(0, 25).join(" "),
            review.reviewText.split(" ").length > 25 && "..."
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute bottom-4 left-4 right-4 flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: review.serviceCategory && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm bg-white/20 text-white px-3 py-2 rounded-full", children: review.serviceCategory }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: review.reviewSource && /* @__PURE__ */ jsxRuntimeExports.jsxs("picture", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "source",
              {
                type: "image/webp",
                srcSet: `/shared/icons/${review.reviewSource}.webp`,
                sizes: "20px"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "img",
              {
                src: `/shared/icons/${review.reviewSource}.png`,
                alt: review.reviewSource,
                className: "w-5 h-5 rounded",
                width: 20,
                height: 20,
                loading: "lazy",
                decoding: "async"
              }
            )
          ] }) })
        ] })
      ]
    }
  );
};

const ReviewModal = ({ review, isOpen, onClose }) => {
  if (!isOpen || !review) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-stone-900 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-stone-700", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-start mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-2xl font-bold text-white", children: "Review Details" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: onClose,
          className: "text-gray-400 hover:text-orange-400 text-2xl transition-colors",
          children: "×"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-4", children: [
        review.reviewerUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          "a",
          {
            href: review.reviewerUrl,
            target: "_blank",
            rel: "noopener noreferrer",
            className: "w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center text-white font-semibold text-xl overflow-hidden hover:bg-orange-600 transition-colors",
            children: review.profileImage ? /* @__PURE__ */ jsxRuntimeExports.jsxs("picture", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "source",
                {
                  type: "image/webp",
                  srcSet: `${review.profileImage.replace(/\.(png|jpg|jpeg)$/i, ".webp")} 64w`,
                  sizes: "64px"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "img",
                {
                  src: review.profileImage,
                  alt: review.customerName,
                  className: "w-full h-full object-cover rounded-full",
                  width: 64,
                  height: 64,
                  loading: "lazy",
                  decoding: "async"
                }
              )
            ] }) : review.customerName.charAt(0).toUpperCase()
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center text-white font-semibold text-xl overflow-hidden", children: review.profileImage ? /* @__PURE__ */ jsxRuntimeExports.jsxs("picture", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "source",
            {
              type: "image/webp",
              srcSet: `${review.profileImage.replace(/\.(png|jpg|jpeg)$/i, ".webp")} 64w`,
              sizes: "64px"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: review.profileImage,
              alt: review.customerName,
              className: "w-full h-full object-cover rounded-full",
              width: 64,
              height: 64,
              loading: "lazy",
              decoding: "async"
            }
          )
        ] }) : review.customerName.charAt(0).toUpperCase() }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          review.reviewerUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            "a",
            {
              href: review.reviewerUrl,
              target: "_blank",
              rel: "noopener noreferrer",
              className: "text-xl font-semibold text-white hover:text-orange-400 transition-colors",
              children: review.customerName
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-xl font-semibold text-white", children: review.customerName }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center", children: Array.from({ length: 5 }, (_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: `text-xl ${i < review.rating ? "text-yellow-400" : "text-gray-300"}`,
              children: "★"
            },
            i
          )) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center", children: [
        review.reviewSource && review.reviewerUrl && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "a",
          {
            href: review.reviewerUrl,
            target: "_blank",
            rel: "noopener noreferrer",
            className: "hover:opacity-80 transition-opacity",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("picture", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "source",
                {
                  type: "image/webp",
                  srcSet: `/shared/icons/${review.reviewSource}.webp`,
                  sizes: "32px"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "img",
                {
                  src: `/shared/icons/${review.reviewSource}.png`,
                  alt: review.reviewSource,
                  className: "w-8 h-8 rounded",
                  width: 32,
                  height: 32,
                  loading: "lazy",
                  decoding: "async"
                }
              )
            ] })
          }
        ),
        review.reviewSource && !review.reviewerUrl && /* @__PURE__ */ jsxRuntimeExports.jsxs("picture", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "source",
            {
              type: "image/webp",
              srcSet: `/shared/icons/${review.reviewSource}.webp`,
              sizes: "32px"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: `/shared/icons/${review.reviewSource}.png`,
              alt: review.reviewSource,
              className: "w-8 h-8 rounded",
              width: 32,
              height: 32,
              loading: "lazy",
              decoding: "async"
            }
          )
        ] })
      ] })
    ] }),
    review.title && /* @__PURE__ */ jsxRuntimeExports.jsx("h5", { className: "text-lg font-medium text-white mb-3", children: review.title }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-300 leading-relaxed mb-4", children: review.reviewText }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2 mb-4", children: review.serviceCategory && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-500/20 text-orange-400 border border-orange-500/30", children: review.serviceCategory }) })
  ] }) }) });
};

const ReviewsCarousel = ({
  reviews,
  onReviewClick,
  maxVisible = 3
}) => {
  const [currentIndex, setCurrentIndex] = reactExports.useState(0);
  const touchStartX = reactExports.useRef(null);
  const touchEndX = reactExports.useRef(null);
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const visibleCount = isMobile ? 1 : isTablet ? 2 : maxVisible;
  const handlePrevious = () => {
    setCurrentIndex((prev) => prev > 0 ? prev - 1 : reviews.length - 1);
  };
  const handleNext = () => {
    setCurrentIndex((prev) => prev < reviews.length - 1 ? prev + 1 : 0);
  };
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0]?.clientX ?? null;
  };
  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0]?.clientX ?? null;
  };
  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const diff = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;
    if (Math.abs(diff) > minSwipeDistance) {
      if (diff > 0) {
        handleNext();
      } else {
        handlePrevious();
      }
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };
  const getVisibleReviews = () => {
    if (isMobile) {
      return [reviews[currentIndex]].filter(Boolean);
    }
    const visible = [];
    for (let i = 0; i < visibleCount; i++) {
      const index = (currentIndex + i) % reviews.length;
      const review = reviews[index];
      if (review) {
        visible.push(review);
      }
    }
    return visible;
  };
  if (reviews.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-12", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-300 text-lg", children: "No reviews available" }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-full max-w-6xl mx-auto", children: [
    reviews.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: handlePrevious,
          className: "hidden md:flex absolute -left-12 top-1/2 -translate-y-1/2 z-20 bg-orange-500 hover:bg-orange-600 text-white p-3 rounded-full transition-colors shadow-lg items-center justify-center",
          "aria-label": "Previous review",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "h-5 w-5" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: handleNext,
          className: "hidden md:flex absolute -right-12 top-1/2 -translate-y-1/2 z-20 bg-orange-500 hover:bg-orange-600 text-white p-3 rounded-full transition-colors shadow-lg items-center justify-center",
          "aria-label": "Next review",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-5 w-5" })
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "px-4 md:px-0",
        onTouchStart: handleTouchStart,
        onTouchMove: handleTouchMove,
        onTouchEnd: handleTouchEnd,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8", children: getVisibleReviews().map((review) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          ReviewCard,
          {
            review,
            onReviewClick
          },
          review.id
        )) })
      }
    ),
    reviews.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center mt-4 md:mt-8 space-x-2", children: reviews.map((_, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        onClick: () => {
          setCurrentIndex(index);
        },
        className: `w-2 h-2 md:w-3 md:h-3 rounded-full transition-colors ${currentIndex === index ? "bg-orange-500" : "bg-gray-400 hover:bg-gray-300"}`,
        "aria-label": `Go to review ${index + 1}`
      },
      index
    )) })
  ] });
};

const ReviewsHeader = ({
  title = "Customer Reviews",
  subtitle = "See what our customers are saying about our mobile detailing services"
}) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-12", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-4xl md:text-5xl font-bold text-white mb-4", children: title }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl text-gray-300 max-w-3xl mx-auto", children: subtitle })
  ] });
};

const Reviews = ({
  maxReviews = 50,
  tenantSlug,
  customHeading,
  customIntro,
  feedKey,
  locationData
}) => {
  const [selectedReview, setSelectedReview] = reactExports.useState(null);
  const [isModalOpen, setIsModalOpen] = reactExports.useState(false);
  const { title, subtitle } = useReviewsContent({ customHeading, customIntro });
  let isTenant = false;
  try {
    const tenantData = useData();
    isTenant = tenantData.isTenant || false;
  } catch {
    isTenant = false;
  }
  const queryParams = {
    limit: maxReviews
  };
  if (tenantSlug) {
    queryParams.tenant_slug = tenantSlug;
  }
  feedKey || locationData?.reviewsSection?.feedKey;
  if (isTenant) {
    const urlSlug = window.location.pathname.split("/")[1];
    if (urlSlug) {
      queryParams.tenant_slug = urlSlug;
    }
  }
  const { reviews, loading, error } = useReviews(queryParams);
  const { images: backgroundImages, currentIndex} = useRotatingReviews(reviews);
  const handleReviewClick = (review) => {
    setSelectedReview(review);
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedReview(null);
  };
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { id: "reviews", className: "relative h-screen snap-start snap-always overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 z-0", children: [
        backgroundImages.map((image, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "img",
          {
            src: image,
            alt: `Customer reviews background ${index + 1}`,
            className: `absolute inset-0 w-full h-full object-cover ${getImageOpacityClasses(index, currentIndex, 2e3)}`,
            style: getTransitionStyles(2e3),
            decoding: index === 0 ? "sync" : "async",
            loading: index === 0 ? "eager" : "lazy"
          },
          image
        )),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-stone-900/85" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative z-10 h-full flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white text-lg", children: "Loading reviews..." })
      ] }) })
    ] });
  }
  if (error) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { id: "reviews", className: "relative h-screen snap-start snap-always overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 z-0", children: [
        backgroundImages.map((image, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "img",
          {
            src: image,
            alt: `Customer reviews background ${index + 1}`,
            className: `absolute inset-0 w-full h-full object-cover ${getImageOpacityClasses(index, currentIndex, 2e3)}`,
            style: getTransitionStyles(2e3),
            decoding: index === 0 ? "sync" : "async",
            loading: index === 0 ? "eager" : "lazy"
          },
          image
        )),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-stone-900/85" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative z-10 h-full flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-red-400 text-lg mb-4", children: "Error loading reviews" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white text-sm", children: error })
      ] }) })
    ] });
  }
  if (!reviews.length) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { id: "reviews", className: "relative h-screen snap-start snap-always overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 z-0", children: [
        backgroundImages.map((image, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "img",
          {
            src: image,
            alt: `Customer reviews background ${index + 1}`,
            className: `absolute inset-0 w-full h-full object-cover ${getImageOpacityClasses(index, currentIndex, 2e3)}`,
            style: getTransitionStyles(2e3),
            decoding: index === 0 ? "sync" : "async",
            loading: index === 0 ? "eager" : "lazy"
          },
          image
        )),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-stone-900/85" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative z-10 h-full flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white text-lg", children: "No reviews available" }) }) })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { id: "reviews", className: "relative h-screen snap-start snap-always overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-full pt-[80px] md:pt-[88px]", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 z-0", children: [
      backgroundImages.map((image, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "img",
        {
          src: image,
          alt: `Customer reviews background ${index + 1}`,
          className: `absolute inset-0 w-full h-full object-cover ${getImageOpacityClasses(index, currentIndex, 2e3)}`,
          style: getTransitionStyles(2e3),
          decoding: index === 0 ? "sync" : "async",
          loading: index === 0 ? "eager" : "lazy"
        },
        image
      )),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-stone-900/85" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative z-10 h-full flex flex-col items-center justify-start md:justify-center px-4 pt-[20px] md:pt-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-6xl mx-auto w-full", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        ReviewsHeader,
        {
          title,
          subtitle
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ReviewsSummary, { className: "mb-8" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        ReviewsCarousel,
        {
          reviews,
          onReviewClick: handleReviewClick
        }
      )
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ReviewModal,
      {
        review: selectedReview,
        isOpen: isModalOpen,
        onClose: handleCloseModal
      }
    )
  ] }) });
};

const ServiceCard = ({
  service,
  className = ""
}) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const handleClick = () => {
    const token = searchParams.get("t");
    const route = token ? `${service.route}?t=${token}` : service.route;
    void navigate(route);
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      const token = searchParams.get("t");
      const route = token ? `${service.route}?t=${token}` : service.route;
      void navigate(route);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      onClick: handleClick,
      onKeyDown: handleKeyDown,
      role: "button",
      tabIndex: 0,
      "aria-label": `View ${service.title}`,
      className: `group relative block rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl cursor-pointer ${className}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-40 sm:h-64 lg:h-[24rem] xl:h-[28rem]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "img",
          {
            src: service.imageUrl,
            alt: "",
            loading: service.imagePriority ? "eager" : "lazy",
            decoding: service.imagePriority ? "sync" : "async",
            ...service.imagePriority && { fetchPriority: "high" },
            width: service.imageWidth || 600,
            height: service.imageHeight || 400,
            className: "absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-0 left-0 right-0 p-3 sm:p-6 lg:p-8 text-white text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-base sm:text-xl lg:text-2xl font-semibold", children: service.title }) }) })
      ]
    }
  ) });
};

const logo = {
	"default": {
		url: "/mobile-detailing/icons/logo.webp",
		alt: "Mobile Detailing Logo"
	},
	dark: {
		url: "/mobile-detailing/icons/logo.webp"},
	light: {
		url: "/mobile-detailing/icons/logo.webp"}
};
const hero$6 = [
	{
		id: "hero-1",
		desktop: {
			url: "/mobile-detailing/images/hero/hero1.png",
			width: 1536,
			height: 1024,
			aspectRatio: 1.5
		},
		mobile: {
			url: "/mobile-detailing/images/hero/hero1-mobile.png",
			width: 1024,
			height: 1536,
			aspectRatio: 0.666
		},
		alt: "Professional mobile detailing service in action",
		priority: true
	},
	{
		id: "hero-2",
		desktop: {
			url: "/mobile-detailing/images/hero/hero2.png",
			width: 1536,
			height: 1024,
			aspectRatio: 1.5
		},
		mobile: {
			url: "/mobile-detailing/images/hero/hero2-mobile.png",
			width: 1024,
			height: 1536,
			aspectRatio: 0.666
		},
		alt: "High-quality car detailing and ceramic coating",
		priority: true
	},
	{
		id: "hero-3",
		desktop: {
			url: "/mobile-detailing/images/hero/hero3.png",
			width: 1536,
			height: 1024,
			aspectRatio: 1.5
		},
		mobile: {
			url: "/mobile-detailing/images/hero/hero3-mobile.png",
			width: 1024,
			height: 1536,
			aspectRatio: 0.666
		},
		alt: "High-quality car detailing, paint correction, and ceramic coating",
		priority: true
	},
	{
		id: "hero-4",
		desktop: {
			url: "/mobile-detailing/images/hero/hero4.png",
			width: 1536,
			height: 1024,
			aspectRatio: 1.5
		},
		mobile: {
			url: "/mobile-detailing/images/hero/hero4-mobile.png",
			width: 1024,
			height: 1536,
			aspectRatio: 0.666
		},
		alt: "High-quality car detailing, paint correction, and ceramic coating",
		priority: true
	},
	{
		id: "hero-5",
		desktop: {
			url: "/mobile-detailing/images/hero/hero5.png",
			width: 1536,
			height: 1024,
			aspectRatio: 1.5
		},
		mobile: {
			url: "/mobile-detailing/images/hero/hero5-mobile.png",
			width: 1024,
			height: 1536,
			aspectRatio: 0.666
		},
		alt: "High-quality car detailing, paint correction, and ceramic coating",
		priority: true
	}
];
const services = {
	grid: [
		{
			slug: "auto-detailing",
			title: "Auto",
			href: "/services/auto-detailing",
			priority: false
		},
		{
			slug: "marine-detailing",
			title: "Marine",
			href: "/services/marine-detailing",
			priority: false
		},
		{
			slug: "rv-detailing",
			title: "RV",
			href: "/services/rv-detailing",
			priority: false
		},
		{
			slug: "ceramic-coating",
			title: "Ceramic Coating",
			href: "/services/ceramic-coating",
			priority: false
		},
		{
			slug: "paint-correction",
			title: "Paint Correction",
			href: "/services/paint-correction",
			priority: false
		},
		{
			slug: "paint-protection-film",
			title: "Paint Protection Film",
			href: "/services/paint-protection-film",
			priority: false
		}
	],
	thumbnails: {
		"auto-detailing": {
			url: "/mobile-detailing/images/services/thumbnails/auto.png",
			alt: "Professional auto detailing service",
			width: 1536,
			height: 1024
		},
		"marine-detailing": {
			url: "/mobile-detailing/images/services/thumbnails/boat.png",
			alt: "Professional boat and marine detailing service",
			width: 1536,
			height: 1024
		},
		"rv-detailing": {
			url: "/mobile-detailing/images/services/thumbnails/rv.png",
			alt: "Professional RV and motorhome detailing service",
			width: 1536,
			height: 1024
		},
		"ceramic-coating": {
			url: "/mobile-detailing/images/services/thumbnails/ceramic.png",
			alt: "Ceramic coating application",
			width: 1024,
			height: 1024
		},
		"paint-correction": {
			url: "/mobile-detailing/images/services/thumbnails/paint.png",
			alt: "Professional paint correction and restoration service",
			width: 1204,
			height: 1024
		},
		"paint-protection-film": {
			url: "/mobile-detailing/images/services/thumbnails/ppf.png",
			alt: "Paint protection film installation",
			width: 1024,
			height: 1024
		}
	}
};
const assetsData = {
	logo: logo,
	hero: hero$6,
	services: services
};

const id$5 = "auto-detailing";
const slug$5 = "auto-detailing";
const route$5 = "/service/auto-detailing";
const title$5 = "Auto Detailing";
const shortDescription$5 = "Complete interior and exterior detailing service";
const seo$5 = {
	metaTitle: "Auto Detailing",
	metaDescription: "Thorough interior and exterior detailing that restores clarity, cleanliness, and protection—ideal prep for coatings and PPF.",
	keywords: [
		"auto detailing",
		"mobile detailing",
		"paint decontamination",
		"interior deep clean",
		"sealant"
	],
	canonicalPath: "/service/auto-detailing",
	ogImage: "/mobile-detailing/images/services/auto-detailing/hero.jpg",
	robots: "index,follow"
};
const hero$5 = {
	image: {
		src: "/mobile-detailing/images/services/auto-detailing/hero.png",
		alt: "Professional auto detailing service",
		caption: "Premium mobile auto detailing at your location"
	},
	headline: "Auto Detailing",
	subheadline: "Thorough interior and exterior detailing that restores clarity, cleanliness, and protection—setting the stage for coatings and film.",
	ctas: [
		{
			label: "Book Now",
			href: "/book?service=auto-detailing"
		},
		{
			label: "Request Quote",
			href: "/quote?service=auto-detailing"
		}
	]
};
const overview$5 = {
	summary: "Professional mobile auto detailing service that brings the detail shop to your location.",
	benefits: [
		"Convenient mobile service",
		"Professional equipment and products",
		"Thorough interior and exterior cleaning"
	],
	features: [
		"Water spot removal",
		"Paint decontamination",
		"Interior deep cleaning",
		"Protective sealant application"
	]
};
const whatItIs$5 = {
	description: "Complete interior + exterior service focused on deep cleaning, decontamination, and entry-level protection. The ideal baseline before paint correction, ceramic coating, or paint protection film (PPF).",
	benefits: [
		"Removes bonded contaminants (rail dust, overspray, brake fallout)",
		"Restores gloss and clarity with safe wash + clay process",
		"Interior deep clean: carpets, seats, vents, touch points",
		"Protective sealant applied for short-term hydrophobics",
		"Prepares paint for advanced services (Correction, Coating, PPF)"
	],
	image: {
		src: "/mobile-detailing/images/services/auto-detailing/what-it-is.png",
		alt: "Auto detailing explanation graphic"
	}
};
const process$5 = {
	title: "Our Auto Detailing Process",
	steps: [
		{
			number: 1,
			title: "Assessment & Prep",
			bullets: [
				"Inspection of paint and interior condition",
				"Reverse Osmosis mineral-free pre-rinse",
				"Foam and hand wash with contact-safe media"
			],
			image: {
				src: "/mobile-detailing/images/services/auto-detailing/process-1.png",
				alt: "Assessment and prep"
			}
		},
		{
			number: 2,
			title: "Decontamination",
			bullets: [
				"Fallout removal + clay treatment",
				"Removal of iron & bonded contaminants",
				"Surface prepped for correction and protection"
			],
			image: {
				src: "/mobile-detailing/images/services/auto-detailing/process-2.png",
				alt: "Decontamination step"
			}
		},
		{
			number: 3,
			title: "Exterior & Interior Protection",
			bullets: [
				"Exterior paint sealant and enhancement",
				"Interior vacuum and steam/spot clean",
				"Trim and plastics dressed satin-matte"
			],
			image: {
				src: "/mobile-detailing/images/services/auto-detailing/process-3.jpg",
				alt: "Protection step"
			}
		}
	]
};
const results$5 = {
	bullets: [
		"Crisp, glossy finish that restores your vehicle's showroom look",
		"Fresh, hygienic cabin with deep interior cleaning",
		"Contaminant-free surface that maximizes Ceramic Coating/PPF bond"
	],
	images: {
		before: {
			src: "/mobile-detailing/images/services/auto-detailing/before.png",
			alt: "Before detailing"
		},
		after: {
			src: "/mobile-detailing/images/services/auto-detailing/after.png",
			alt: "After detailing"
		}
	},
	containerSize: "large"
};
const gallery$5 = {
	title: "Auto Detailing Gallery",
	images: [
		{
			id: "1",
			src: "/images/services/auto-detailing/hero.png",
			alt: "Auto detailing service",
			caption: "Professional auto detailing"
		}
	]
};
const faq$4 = {
	title: "Auto Detailing FAQ",
	items: [
		{
			q: "How long does auto detailing take?",
			a: "Typically 2-4 hours for standard vehicles and details. Paint correction, ceramic coating, and PPF typically take much longer."
		},
		{
			q: "Do you bring water and power?",
			a: "Yes. We are fully mobile and bring filtered water, power, and all professional equipment."
		},
		{
			q: "Will detailing remove scratches or swirls?",
			a: "No. Paint correction is needed to removes swirls and light scratches; deep defects may need automotive bodywork."
		},
		{
			q: "Is detailing required before Ceramic Coating or PPF?",
			a: "Yes. A pristine, contaminant-free surface is essential and benefits from multi-stage correction."
		}
	]
};
const cta$5 = {
	title: "Ready to get started?",
	description: "",
	primary: {
		label: "Book Now",
		href: "/book?service=auto-detailing"
	},
	secondary: {
		label: "Request Quote",
		href: "/quote?service=auto-detailing"
	}
};
const jsonLd$5 = {
	service: {
		"@context": "https://schema.org",
		"@type": "Service",
		name: "Auto Detailing",
		serviceType: "Auto Detailing",
		provider: {
			"@type": "Organization",
			name: "Mobile Detail Hub"
		},
		areaServed: {
			"@type": "Place",
			name: "{CITY}, {STATE}"
		},
		description: "Thorough interior and exterior detailing that restores clarity, cleanliness, and protection.",
		brand: "Mobile Detail Hub",
		offers: {
			"@type": "AggregateOffer",
			priceCurrency: "USD",
			lowPrice: 150,
			highPrice: 250,
			offerCount: 2
		}
	},
	faq: {
		"@context": "https://schema.org",
		"@type": "FAQPage",
		mainEntity: [
			{
				"@type": "Question",
				name: "How long does auto detailing take?",
				acceptedAnswer: {
					"@type": "Answer",
					text: "Typically 5–8 hours for standard vehicles and details."
				}
			},
			{
				"@type": "Question",
				name: "Do you bring water and power?",
				acceptedAnswer: {
					"@type": "Answer",
					text: "Yes. We bring filtered water, power, and all professional equipment."
				}
			}
		]
	},
	breadcrumbs: {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: [
			{
				"@type": "ListItem",
				position: 1,
				name: "Services",
				item: "{ORIGIN}/services"
			},
			{
				"@type": "ListItem",
				position: 2,
				name: "Auto Detailing",
				item: "{ORIGIN}/service/auto-detailing"
			}
		]
	}
};
const autoDetailingData = {
	id: id$5,
	slug: slug$5,
	route: route$5,
	title: title$5,
	shortDescription: shortDescription$5,
	seo: seo$5,
	hero: hero$5,
	overview: overview$5,
	whatItIs: whatItIs$5,
	process: process$5,
	results: results$5,
	gallery: gallery$5,
	faq: faq$4,
	cta: cta$5,
	jsonLd: jsonLd$5
};

const id$4 = "ceramic-coating";
const slug$4 = "ceramic-coating";
const route$4 = "/service/ceramic-coating";
const title$4 = "Ceramic Coating";
const shortDescription$4 = "Long-term hydrophobic protection and gloss with professional SiO₂/ceramic coatings";
const seo$4 = {
	metaTitle: "Ceramic Coating for Cars | Mobile Detail Hub",
	metaDescription: "Professional ceramic coating service with proper paint prep and correction. Deep gloss, hydrophobics, and long-term protection (1–8 year options).",
	keywords: [
		"ceramic coating",
		"SiO2 coating",
		"nano ceramic",
		"graphene ceramic coating",
		"paint protection",
		"hydrophobic coating",
		"car ceramic coating",
		"professional ceramic coating"
	],
	canonicalPath: "/service/ceramic-coating",
	ogImage: "/images/services/ceramic-coating/hero.png",
	robots: "index,follow"
};
const hero$4 = {
	image: {
		src: "/mobile-detailing/images/services/ceramic-coating/hero.png",
		alt: "Professional ceramic coating being applied to vehicle paint",
		caption: "Pro-grade ceramic coatings installed with proper prep and correction"
	},
	headline: "Ceramic Coating",
	subheadline: "Locked-in gloss, slickness, and easy maintenance—installed with proper decontamination and paint correction.",
	ctas: [
		{
			label: "Book Now",
			href: "/book?service=ceramic-coating"
		},
		{
			label: "Request Quote",
			href: "/quote?service=ceramic-coating"
		}
	]
};
const overview$4 = {
	summary: "Durable SiO₂/ceramic protection that bonds to paint, trim, and wheels for long-term gloss and easier washing.",
	benefits: [
		"Long-term hydrophobic protection",
		"Enhanced depth and gloss",
		"UV resistance and chemical resistance",
		"Easier washing and drying"
	],
	features: [
		"Professional surface prep and panel wipe",
		"Paint correction tailored to condition",
		"Multi-year coating options (1–8 years)",
		"Optional wheel/trim/glass coating add-ons"
	]
};
const whatItIs$4 = {
	description: "A pro-grade, nano-ceramic layer applied to your clear coat. It cures into a dense, slick barrier that boosts gloss, resists chemicals/UV, and keeps paint cleaner between washes.",
	benefits: [
		"Deep, mirror-like gloss that makes color pop",
		"Hydrophobic surface: water beads/sheets off to reduce spotting",
		"Strong resistance to chemicals, UV, and road grime",
		"Easier, faster maintenance with less dirt bonding",
		"Durable, semi-permanent protection measured in years"
	],
	chart: {
		type: "protection-comparison",
		title: "How Ceramic Coating Compares",
		description: "See how ceramic coating stacks up against traditional protection methods",
		seo: {
			title: "Ceramic Coating vs Wax vs Sealant vs PPF Comparison",
			description: "Compare protection levels, longevity, ease of maintenance, and rock chip resistance across different paint protection options"
		},
		data: {
			wax: {
				protection: 1,
				longevity: 1,
				ease: 2,
				chipResistance: 1
			},
			sealant: {
				protection: 2,
				longevity: 2,
				ease: 2,
				chipResistance: 1
			},
			ceramic: {
				protection: 4,
				longevity: 4,
				ease: 4,
				chipResistance: 1
			},
			ppf: {
				protection: 5,
				longevity: 5,
				ease: 3,
				chipResistance: 5
			}
		}
	}
};
const process$4 = {
	title: "Our Ceramic Coating Process",
	steps: [
		{
			number: 1,
			title: "Deep Clean & Decontamination",
			bullets: [
				"Foam pre-wash and contact wash",
				"Iron/fallout removal and clay bar treatment",
				"Thorough drying and masking of sensitive areas"
			],
			image: {
				src: "/mobile-detailing/images/services/ceramic-coating/process-1.png",
				alt: "Decontamination prior to coating"
			}
		},
		{
			number: 2,
			title: "Paint Correction",
			bullets: [
				"Single or multi-stage correction based on condition",
				"Gloss enhancement and defect reduction",
				"Panel wipe to remove polishing oils"
			],
			image: {
				src: "/mobile-detailing/images/services/ceramic-coating/process-2.png",
				alt: "Paint correction step before coating"
			}
		},
		{
			number: 3,
			title: "Coating Application & Cure",
			bullets: [
				"Even application per panel with proper leveling",
				"IR/controlled cure where applicable",
				"Final inspection and aftercare guidance"
			],
			image: {
				src: "/mobile-detailing/images/services/ceramic-coating/process-3.png",
				alt: "Applying ceramic coating and curing"
			}
		}
	]
};
const results$4 = {
	bullets: [
		"Deep, high-gloss finish with crisp reflections",
		"Strong hydrophobics for faster, easier washes",
		"Longer-lasting protection vs. waxes and sealants"
	],
	images: {
		before: {
			src: "/mobile-detailing/images/services/ceramic-coating/before.png",
			alt: "Before ceramic coating"
		},
		after: {
			src: "/mobile-detailing/images/services/ceramic-coating/after.png",
			alt: "After ceramic coating"
		}
	},
	containerSize: "large"
};
const gallery$4 = {
	title: "Ceramic Coating Gallery",
	images: [
		{
			id: "1",
			src: "/mobile-detailing/images/services/ceramic-coating/hero.png",
			alt: "Ceramic coating high gloss finish",
			caption: "Locked-in gloss and protection"
		}
	]
};
const pricing$3 = {
	title: "Ceramic Coating Packages",
	tiers: [
		{
			id: "essential",
			name: "Essential (≈1–2 Year)",
			price: {
				label: "From $700",
				min: 700,
				currency: "USD"
			},
			description: "Entry ceramic protection with single-stage correction.",
			popular: false,
			features: [
				"Decon wash + clay + iron removal",
				"Single-stage paint enhancement",
				"1–2 year ceramic coating on paint",
				"Basic aftercare kit"
			]
		},
		{
			id: "enduring",
			name: "Enduring (≈3–5 Year)",
			price: {
				label: "From $1,200",
				min: 1200,
				currency: "USD"
			},
			description: "Multi-year coating with elevated correction and durability.",
			popular: true,
			features: [
				"Enhanced decon and multi-stage correction (as needed)",
				"3–5 year ceramic coating on paint",
				"Coated trim & faces of wheels (light)",
				"Aftercare kit + first-wash guidance"
			]
		},
		{
			id: "elite",
			name: "Elite (≈7–8 Year)",
			price: {
				label: "From $1,800",
				min: 1800,
				currency: "USD"
			},
			description: "Maximum longevity and gloss with premium coating chemistry.",
			popular: false,
			features: [
				"Comprehensive correction to high-gloss finish",
				"7–8 year ceramic coating on paint",
				"Optional wheel-off & glass coating add-ons",
				"Maintenance plan & warranty requirements"
			]
		}
	],
	notes: "Final price varies by vehicle size, paint condition, correction scope, and add-ons (wheels, glass, trim, interior, PPF synergy)."
};
const faq$3 = {
	title: "Ceramic Coating FAQ",
	items: [
		{
			q: "Does ceramic coating replace PPF?",
			a: "No. Coatings add gloss, hydrophobics, and chemical resistance; PPF is a physical barrier that absorbs rock chips and impacts. Many owners choose both."
		},
		{
			q: "Is paint correction required?",
			a: "Yes. Coatings lock in the finish. We correct paint to a suitable level first so the coating bonds well and enhances a refined surface."
		},
		{
			q: "How long before I can wash the car?",
			a: "Avoid water for 12–24 hours if possible; avoid soaps/chemicals for 5–7 days while the coating fully cures. We’ll provide aftercare steps."
		},
		{
			q: "What maintenance is recommended?",
			a: "pH-neutral washes, proper towels/mitts, and periodic topper/booster after inspections. Annual maintenance helps preserve performance and warranties."
		}
	]
};
const cta$4 = {
	title: "Ready for locked-in gloss?",
	description: "",
	primary: {
		label: "Book Now",
		href: "/book?service=ceramic-coating"
	},
	secondary: {
		label: "Request Quote",
		href: "/quote?service=ceramic-coating"
	}
};
const jsonLd$4 = {
	service: {
		"@context": "https://schema.org",
		"@type": "Service",
		name: "Ceramic Coating",
		serviceType: "Automotive Ceramic Coating",
		provider: {
			"@type": "Organization",
			name: "Mobile Detail Hub"
		},
		areaServed: {
			"@type": "Place",
			name: "{CITY}, {STATE}"
		},
		description: "Professional ceramic coating with proper paint correction for long-term gloss, hydrophobics, and chemical resistance.",
		brand: "Mobile Detail Hub",
		offers: {
			"@type": "AggregateOffer",
			priceCurrency: "USD",
			lowPrice: 700,
			highPrice: 1800,
			offerCount: 3
		}
	},
	faq: {
		"@context": "https://schema.org",
		"@type": "FAQPage",
		mainEntity: [
			{
				"@type": "Question",
				name: "Does ceramic coating replace PPF?",
				acceptedAnswer: {
					"@type": "Answer",
					text: "No. Coatings add gloss, hydrophobics, and chemical resistance; PPF is a physical barrier for rock chips and impacts. Many owners choose both."
				}
			},
			{
				"@type": "Question",
				name: "Is paint correction required?",
				acceptedAnswer: {
					"@type": "Answer",
					text: "Yes. Coatings lock in the finish. Correction ensures optimal bonding and a refined appearance before coating."
				}
			}
		]
	},
	breadcrumbs: {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: [
			{
				"@type": "ListItem",
				position: 1,
				name: "Services",
				item: "{ORIGIN}/services"
			},
			{
				"@type": "ListItem",
				position: 2,
				name: "Ceramic Coating",
				item: "{ORIGIN}/service/ceramic-coating"
			}
		]
	}
};
const ceramicCoatingData = {
	id: id$4,
	slug: slug$4,
	route: route$4,
	title: title$4,
	shortDescription: shortDescription$4,
	seo: seo$4,
	hero: hero$4,
	overview: overview$4,
	whatItIs: whatItIs$4,
	process: process$4,
	results: results$4,
	gallery: gallery$4,
	pricing: pricing$3,
	faq: faq$3,
	cta: cta$4,
	jsonLd: jsonLd$4
};

const id$3 = "marine-detailing";
const slug$3 = "marine-detailing";
const route$3 = "/service/marine-detailing";
const title$3 = "Boat & Marine Detailing";
const shortDescription$3 = "Salt removal, oxidation treatment, and UV protection for boats and watercraft";
const seo$3 = {
	metaTitle: "Boat Detailing (Marine) | Mobile Detail Hub",
	metaDescription: "Professional mobile boat detailing: salt & mineral removal, hull/deck decontamination, oxidation treatment, and marine-grade UV protection for lasting gloss and performance.",
	keywords: [
		"boat detailing",
		"marine detailing",
		"hull cleaning",
		"gelcoat oxidation removal",
		"salt removal",
		"UV protection",
		"barnacle removal",
		"deck cleaning"
	],
	canonicalPath: "/service/marine-detailing",
	ogImage: "/mobile-detailing/images/services/marine-detailing/hero.png",
	robots: "index,follow"
};
const hero$3 = {
	image: {
		src: "/mobile-detailing/images/services/marine-detailing/hero.png",
		alt: "Professional boat and marine detailing service",
		caption: "Premium mobile marine detailing at your marina or dock"
	},
	headline: "Boat & Marine Detailing",
	subheadline: "Salt removal, oxidation treatment, and marine-grade UV protection—engineered for harsh marine environments.",
	ctas: [
		{
			label: "Book Now",
			href: "/book?service=marine-detailing"
		},
		{
			label: "Request Quote",
			href: "/quote?service=marine-detailing"
		}
	]
};
const overview$3 = {
	summary: "Professional mobile marine detailing designed for boats, yachts, and watercraft exposed to salt, sun, and marine growth.",
	benefits: [
		"Convenient dockside or marina service",
		"Marine-grade products and techniques",
		"Improved gloss, protection, and efficiency"
	],
	features: [
		"Fresh-water rinse and salt neutralizer",
		"Hull & deck decontamination",
		"Gelcoat oxidation treatment",
		"Marine-grade UV sealant or wax"
	]
};
const whatItIs$3 = {
	description: "A complete marine-grade service focused on salt removal, decontamination, and UV protection for gelcoat and marine surfaces. Ideal prep before advanced marine coatings or seasonal protection.",
	benefits: [
		"Removes salt, minerals, and marine contaminants (algae, barnacles, spray)",
		"Restores gloss on gelcoat with safe wash + mechanical decon",
		"Treats light oxidation and brightens hardware",
		"Applies marine-grade UV sealant for hydrophobics and easier washing",
		"Preps hull/deck for long-term ceramic or polymer coatings"
	],
	image: {
		src: "/mobile-detailing/images/services/marine-detailing/what-it-is.jpg",
		alt: "Marine detailing explanation graphic"
	}
};
const process$3 = {
	title: "Our Marine Detailing Process",
	steps: [
		{
			number: 1,
			title: "Marine Assessment & Prep",
			bullets: [
				"Inspection of hull, deck, gelcoat, and hardware",
				"Fresh-water pre-rinse with salt neutralizer",
				"Marine-safe foam wash and contact wash"
			],
			image: {
				src: "/mobile-detailing/images/services/marine-detailing/process-1.jpg",
				alt: "Marine assessment and preparation"
			}
		},
		{
			number: 2,
			title: "Decontamination & Oxidation Care",
			bullets: [
				"Hull & deck decon (iron, mineral, organic growth)",
				"Spot barnacle/marine growth removal (where accessible)",
				"Light gelcoat oxidation treatment to restore clarity"
			],
			image: {
				src: "/mobile-detailing/images/services/marine-detailing/process-2.png",
				alt: "Marine decontamination and oxidation treatment"
			}
		},
		{
			number: 3,
			title: "Protection & Finishing",
			bullets: [
				"Marine-grade UV sealant or wax on gelcoat",
				"Non-slip deck & vinyl cleaned and dressed appropriately",
				"Metals polished; plastics restored to satin-matte"
			],
			image: {
				src: "/mobile-detailing/images/services/marine-detailing/process-3.png",
				alt: "Marine protection and finishing"
			}
		}
	]
};
const results$3 = {
	bullets: [
		"Salt-free, glossy hull and deck for easier maintenance",
		"UV-protected gelcoat to resist fading and chalking",
		"Clean, decontaminated surfaces that enhance coating longevity"
	],
	images: {
		before: {
			src: "/mobile-detailing/images/services/marine-detailing/before.png",
			alt: "Boat before detailing"
		},
		after: {
			src: "/mobile-detailing/images/services/marine-detailing/after.jpg",
			alt: "Boat after detailing"
		}
	},
	containerSize: "large"
};
const gallery$3 = {
	title: "Marine Detailing Gallery",
	images: [
		{
			id: "1",
			src: "/mobile-detailing/images/services/marine-detailing/hero.png",
			alt: "Marine detailing service",
			caption: "Professional marine detailing"
		}
	]
};
const cta$3 = {
	title: "Ready to protect your vessel?",
	description: "",
	primary: {
		label: "Book Now",
		href: "/book?service=marine-detailing"
	},
	secondary: {
		label: "Request Quote",
		href: "/quote?service=marine-detailing"
	}
};
const jsonLd$3 = {
	service: {
		"@context": "https://schema.org",
		"@type": "Service",
		name: "Marine Detailing",
		serviceType: "Boat Detailing",
		provider: {
			"@type": "Organization",
			name: "Mobile Detail Hub"
		},
		areaServed: {
			"@type": "Place",
			name: "{CITY}, {STATE}"
		},
		description: "Professional mobile marine detailing: salt removal, decontamination, oxidation care, and UV protection for boats and watercraft.",
		brand: "Mobile Detail Hub",
		offers: {
			"@type": "AggregateOffer",
			priceCurrency: "USD",
			lowPrice: 200,
			highPrice: 350,
			offerCount: 2
		}
	},
	faq: {
		"@context": "https://schema.org",
		"@type": "FAQPage",
		mainEntity: [
			{
				"@type": "Question",
				name: "How long does marine detailing take?",
				acceptedAnswer: {
					"@type": "Answer",
					text: "Typically 6–10 hours for standard boats; larger vessels can take 1–3 days depending on size and condition."
				}
			},
			{
				"@type": "Question",
				name: "Do you service marinas and docks?",
				acceptedAnswer: {
					"@type": "Answer",
					text: "Yes. We are fully mobile and can service most marinas, docks, and boat ramps (subject to site permissions)."
				}
			}
		]
	},
	breadcrumbs: {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: [
			{
				"@type": "ListItem",
				position: 1,
				name: "Services",
				item: "{ORIGIN}/services"
			},
			{
				"@type": "ListItem",
				position: 2,
				name: "Boat & Marine Detailing",
				item: "{ORIGIN}/service/marine-detailing"
			}
		]
	}
};
const marineDetailingData = {
	id: id$3,
	slug: slug$3,
	route: route$3,
	title: title$3,
	shortDescription: shortDescription$3,
	seo: seo$3,
	hero: hero$3,
	overview: overview$3,
	whatItIs: whatItIs$3,
	process: process$3,
	results: results$3,
	gallery: gallery$3,
	cta: cta$3,
	jsonLd: jsonLd$3
};

const id$2 = "paint-correction";
const slug$2 = "paint-correction";
const route$2 = "/service/paint-correction";
const title$2 = "Paint Correction";
const shortDescription$2 = "Machine polishing to remove swirls, haze, and oxidation for a deep, mirror-like finish";
const seo$2 = {
	metaTitle: "Paint Correction (1–3 Stage) | Mobile Detail Hub",
	metaDescription: "Professional paint correction to remove swirls, light scratches, and oxidation. Single- and multi-stage polishing to restore gloss and clarity—ideal before ceramic coating or PPF.",
	keywords: [
		"paint correction",
		"machine polishing",
		"swirl removal",
		"scratch removal",
		"oxidation removal",
		"cut and polish",
		"paint enhancement",
		"polishing compound"
	],
	canonicalPath: "/service/paint-correction",
	ogImage: "/images/services/paint-correction/hero.jpg",
	robots: "index,follow"
};
const hero$2 = {
	image: {
		src: "/mobile-detailing/images/services/paint-correction/hero.jpg",
		alt: "Professional paint correction machine polishing a vehicle panel",
		caption: "Defect removal and gloss restoration with calibrated polishing systems"
	},
	headline: "Paint Correction",
	subheadline: "Remove swirls, haze, and oxidation with single- or multi-stage polishing—perfect prep for ceramic coating or film.",
	ctas: [
		{
			label: "Book Now",
			href: "/book?service=paint-correction"
		},
		{
			label: "Request Quote",
			href: "/quote?service=paint-correction"
		}
	]
};
const overview$2 = {
	summary: "A precision polishing service that levels micro-defects in clear coat to dramatically improve gloss, clarity, and depth.",
	benefits: [
		"Removes swirls, light scratches, and wash marring",
		"Restores depth, clarity, and color accuracy",
		"Prepares paint for long-term ceramic or PPF protection"
	],
	features: [
		"Paint depth & defect assessment with lighting",
		"Safe test-spot to dial in pad/polish system",
		"Measured single- or multi-stage correction",
		"Panel wipe to ensure true, filler-free results"
	]
};
const whatItIs$2 = {
	description: "Paint correction uses abrasives and machine polishers to safely level microscopic defects in your clear coat. Unlike glazes or fillers, true correction removes defects rather than hiding them, revealing crisp reflections and maximum gloss.",
	benefits: [
		"Permanent removal of many light-to-moderate defects",
		"Significantly reduced haze and improved reflectivity",
		"Creates a pristine surface that maximizes coating/PPF bond"
	],
	image: {
		src: "/mobile-detailing/images/services/paint-correction/what-it-is.png",
		alt: "Close-up before/after of corrected automotive paint"
	}
};
const process$2 = {
	title: "Our Paint Correction Process",
	steps: [
		{
			number: 1,
			title: "Decontamination & Prep",
			bullets: [
				"Foam pre-wash, contact wash, and thorough dry",
				"Iron/fallout remover and clay bar treatment",
				"Mask sensitive trim and edges"
			],
			image: {
				src: "/mobile-detailing/images/services/paint-correction/process-1.jpg",
				alt: "Decontamination and preparation before polishing"
			}
		},
		{
			number: 2,
			title: "Test Spot & Correction",
			bullets: [
				"Lighting-based inspection and paint readings (where applicable)",
				"Test spot to choose optimal pad/polish combo",
				"Single or multi-stage machine polishing to target defects"
			],
			image: {
				src: "/mobile-detailing/images/services/paint-correction/process-2.jpg",
				alt: "Machine polishing and defect removal"
			}
		},
		{
			number: 3,
			title: "Refinement & Protection",
			bullets: [
				"Finishing polish to maximize clarity and gloss",
				"Panel wipe to remove polishing oils (filler-free check)",
				"Sealant or ceramic coating application (if selected)"
			],
			image: {
				src: "/mobile-detailing/images/services/paint-correction/process-3.jpg",
				alt: "Refinement and protection after correction"
			}
		}
	]
};
const results$2 = {
	bullets: [
		"Dramatically improved gloss and mirror-like reflections",
		"Swirl and haze reduction for a cleaner, deeper look",
		"Perfect foundation for ceramic coating or PPF"
	],
	images: {
		before: {
			src: "/mobile-detailing/images/services/paint-correction/before.jpg",
			alt: "Paint before correction with visible swirls"
		},
		after: {
			src: "/mobile-detailing/images/services/paint-correction/after.jpg",
			alt: "Paint after correction with high gloss"
		}
	},
	containerSize: "large"
};
const gallery$2 = {
	title: "Paint Correction Gallery",
	images: [
		{
			id: "1",
			src: "/mobile-detailing/images/services/paint-correction/hero.jpg",
			alt: "High-gloss paint after correction",
			caption: "Defect removal and high-gloss finish"
		}
	]
};
const pricing$2 = {
	title: "Paint Correction Packages",
	tiers: [
		{
			id: "1-stage",
			name: "1-Stage Enhancement",
			price: {
				label: "From $400",
				min: 400,
				currency: "USD"
			},
			description: "Single-step polish to boost gloss and remove light swirls.",
			popular: false,
			features: [
				"Decon wash + clay + iron removal",
				"Single-step polishing (finish-focused)",
				"Panel wipe + sealant (or coating add-on)"
			]
		},
		{
			id: "2-stage",
			name: "2-Stage Correction",
			price: {
				label: "From $900",
				min: 900,
				currency: "USD"
			},
			description: "Cut and polish to address moderate defects and restore depth.",
			popular: true,
			features: [
				"Compounding stage for defect removal",
				"Finishing stage for clarity and gloss",
				"Panel wipe + protection (sealant or coating)"
			]
		},
		{
			id: "multi-stage",
			name: "Multi-Stage / Intensive",
			price: {
				label: "From $1,500",
				min: 1500,
				currency: "USD"
			},
			description: "High-level restoration for challenging paint or show-car outcomes.",
			popular: false,
			features: [
				"Advanced pad/polish systems tailored per panel",
				"Extensive refinement for near-flawless finish",
				"Ideal base for premium ceramic or PPF"
			]
		}
	],
	notes: "Final pricing varies by vehicle size, paint hardness, defect severity, and chosen protection (ceramic/PPF)."
};
const faq$2 = {
	title: "Paint Correction FAQ",
	items: [
		{
			q: "Will all scratches be removed?",
			a: "Many light-to-moderate defects can be permanently reduced or removed. Deep scratches through the clear coat may require touch-up or refinishing."
		},
		{
			q: "Is clear coat safe during correction?",
			a: "Yes—our approach uses measured, minimal removal and test-spot dialing to preserve clear coat while achieving visible improvement."
		},
		{
			q: "Do I need ceramic coating after correction?",
			a: "Highly recommended. Coatings help preserve results, add hydrophobics, and simplify maintenance. Sealants are also available."
		},
		{
			q: "How long does it take?",
			a: "Typically 4–8 hours for 1-Stage, 8–14 hours for 2-Stage, and 1–2+ days for intensive multi-stage work, depending on condition."
		}
	]
};
const cta$2 = {
	title: "Ready to restore your gloss?",
	description: "",
	primary: {
		label: "Book Now",
		href: "/book?service=paint-correction"
	},
	secondary: {
		label: "Request Quote",
		href: "/quote?service=paint-correction"
	}
};
const jsonLd$2 = {
	service: {
		"@context": "https://schema.org",
		"@type": "Service",
		name: "Paint Correction",
		serviceType: "Automotive Paint Correction",
		provider: {
			"@type": "Organization",
			name: "Mobile Detail Hub"
		},
		areaServed: {
			"@type": "Place",
			name: "{CITY}, {STATE}"
		},
		description: "Professional machine polishing to remove swirls, haze, and oxidation—single- and multi-stage options to restore gloss and clarity.",
		brand: "Mobile Detail Hub",
		offers: {
			"@type": "AggregateOffer",
			priceCurrency: "USD",
			lowPrice: 400,
			highPrice: 1500,
			offerCount: 3
		}
	},
	faq: {
		"@context": "https://schema.org",
		"@type": "FAQPage",
		mainEntity: [
			{
				"@type": "Question",
				name: "Will all scratches be removed?",
				acceptedAnswer: {
					"@type": "Answer",
					text: "Many light-to-moderate defects can be permanently reduced or removed. Deep scratches through the clear coat may require refinishing."
				}
			},
			{
				"@type": "Question",
				name: "Do I need ceramic coating after correction?",
				acceptedAnswer: {
					"@type": "Answer",
					text: "Coatings help preserve results, add hydrophobics, and simplify maintenance. Sealants are also available."
				}
			}
		]
	},
	breadcrumbs: {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: [
			{
				"@type": "ListItem",
				position: 1,
				name: "Services",
				item: "{ORIGIN}/services"
			},
			{
				"@type": "ListItem",
				position: 2,
				name: "Paint Correction",
				item: "{ORIGIN}/service/paint-correction"
			}
		]
	}
};
const paintCorrectionData = {
	id: id$2,
	slug: slug$2,
	route: route$2,
	title: title$2,
	shortDescription: shortDescription$2,
	seo: seo$2,
	hero: hero$2,
	overview: overview$2,
	whatItIs: whatItIs$2,
	process: process$2,
	results: results$2,
	gallery: gallery$2,
	pricing: pricing$2,
	faq: faq$2,
	cta: cta$2,
	jsonLd: jsonLd$2
};

const id$1 = "ppf";
const slug$1 = "paint-protection-film";
const route$1 = "/service/ppf-installation";
const title$1 = "Paint Protection Film (PPF)";
const shortDescription$1 = "Self-healing urethane film that guards against rock chips, abrasion, and road rash";
const seo$1 = {
	metaTitle: "Paint Protection Film (PPF) | Mobile Detail Hub",
	metaDescription: "Professional PPF installation: self-healing, stain-resistant urethane film to protect high-impact areas or the entire vehicle. Options: Partial Front, Full Front, Track Pack, Full Body.",
	keywords: [
		"paint protection film",
		"PPF",
		"clear bra",
		"self-healing film",
		"rock chip protection",
		"front bumper protection",
		"full front PPF",
		"track package PPF",
		"full body PPF"
	],
	canonicalPath: "/service/ppf-installation",
	ogImage: "/mobile-detailing/images/services/ppf/hero.png",
	robots: "index,follow"
};
const hero$1 = {
	image: {
		src: "/mobile-detailing/images/services/ppf-installation/hero.jpg",
		alt: "Installing clear paint protection film on a vehicle panel",
		caption: "Invisible, self-healing protection for your paint"
	},
	headline: "Paint Protection Film (PPF)",
	subheadline: "Clear, self-healing urethane that absorbs rock chips and road rash—keep your finish looking new.",
	ctas: [
		{
			label: "Book Now",
			href: "/book?service=ppf"
		},
		{
			label: "Request Quote",
			href: "/quote?service=ppf"
		}
	]
};
const overview$1 = {
	summary: "Premium PPF installed with precision patterns and expert edge work. Choose targeted coverage like Full Front or protect the entire vehicle.",
	benefits: [
		"Absorbs rock chips and abrasion",
		"Self-healing top coat reduces swirls",
		"UV and chemical resistance",
		"Enhances resale value by preserving paint"
	],
	features: [
		"Pre-cut pattern library with custom bulk options",
		"Wrapped edges where eligible panels allow",
		"Seam planning for clean aesthetics",
		"Compatible with ceramic-topper for easier washing"
	]
};
const whatItIs$1 = {
	description: "Paint Protection Film is a thick, optically clear aliphatic polyurethane layer applied to painted panels to absorb impact and abrasion. Its self-healing top coat reduces light marring with heat or sun exposure.",
	benefits: [
		"Physical barrier against chips, sandblasting, and road debris",
		"Self-healing surface helps keep a swirl-free look",
		"Stain resistance against bugs, tar, and road salts",
		"Pairs well with ceramic coating for slickness and easier maintenance"
	],
	video: {
		src: "/mobile-detailing/video/ppf-what-it-is.mp4",
		alt: "Video showcasing the benefits and durability of paint protection film (ppf)"
	}
};
const process$1 = {
	title: "Our PPF Installation Process",
	steps: [
		{
			number: 1,
			title: "Prep & Panel Mapping",
			bullets: [
				"Decon wash, iron removal, and clay bar",
				"Panel wipe to remove oils and residues",
				"Pattern selection or bulk templating; seam/edge planning"
			],
			image: {
				src: "/mobile-detailing/images/services/ppf-installation/process-1.png",
				alt: "Vehicle decontamination and surface preparation for PPF"
			}
		},
		{
			number: 2,
			title: "Precision Install",
			bullets: [
				"Slip solution application and film positioning",
				"Squeegee set, edge wrapping where applicable",
				"Heat-set and micro-bubble inspection"
			],
			image: {
				src: "/mobile-detailing/images/services/ppf-installation/process-2.png",
				alt: "Careful squeegee work during PPF installation"
			}
		},
		{
			number: 3,
			title: "Cure & Quality Check",
			bullets: [
				"Final alignment and edge checks",
				"Cure time guidance and first-wash instructions",
				"Optional ceramic topper for easier cleaning"
			],
			image: {
				src: "/mobile-detailing/images/services/ppf-installation/process-3.png",
				alt: "PPF curing and final inspection"
			}
		}
	]
};
const results$1 = {
	bullets: [
		"High-impact zones shielded from chips and pitting",
		"Self-healing clarity with reduced swirl appearance",
		"Clean seams and wrapped edges for a near-invisible install"
	],
	video: {
		src: "/mobile-detailing/video/ppf-results.mp4",
		alt: "Video showcasing the benefits and durability of paint protection film (ppf)"
	}
};
const gallery$1 = {
	title: "PPF Gallery",
	images: [
		{
			id: "1",
			src: "/mobile-detailing/images/services/ppf-installation/hero.png",
			alt: "PPF on front end with wrapped edges",
			caption: "Invisible coverage, maximum protection"
		}
	]
};
const pricing$1 = {
	title: "PPF Coverage Options",
	tiers: [
		{
			id: "partial-front",
			name: "Partial Front",
			price: {
				label: "From $900",
				min: 900,
				currency: "USD"
			},
			description: "Front bumper + ~18–24\" hood/fenders + mirrors.",
			popular: false,
			features: [
				"Front bumper coverage",
				"Partial hood & fender leading edges",
				"Mirror caps",
				"Wrapped edges where applicable"
			]
		},
		{
			id: "full-front",
			name: "Full Front",
			price: {
				label: "From $1,800",
				min: 1800,
				currency: "USD"
			},
			description: "Full hood, full fenders, bumper, headlights, and mirrors.",
			popular: true,
			features: [
				"Full hood & full fenders",
				"Front bumper & headlights",
				"Mirrors, badges trimmed cleanly",
				"Expanded wrapped edges where panels allow"
			]
		},
		{
			id: "track-pack",
			name: "Track Pack",
			price: {
				label: "From $2,400",
				min: 2400,
				currency: "USD"
			},
			description: "Adds rocker panels and splash zones for spirited driving.",
			popular: false,
			features: [
				"Full Front package",
				"Rockers / lower doors",
				"Rear impact areas behind wheels",
				"Optional luggage strip"
			]
		},
		{
			id: "full-body",
			name: "Full Body",
			price: {
				label: "From $4,500",
				min: 4500,
				currency: "USD"
			},
			description: "Ultimate protection for every painted panel.",
			popular: false,
			features: [
				"All painted panels protected",
				"Advanced seam planning",
				"Extensive wrapped edges",
				"New-car preservation or show-car builds"
			]
		}
	],
	notes: "Pricing varies by vehicle size/complexity, panel shapes, badge/vent count, and film selection. In-person inspection recommended."
};
const faq$1 = {
	title: "PPF FAQ",
	items: [
		{
			q: "PPF vs. Ceramic Coating—what’s the difference?",
			a: "PPF is a physical urethane barrier that absorbs impacts from debris and prevents chips; ceramic adds slickness, gloss, and chemical resistance. Many owners combine both for maximum results."
		},
		{
			q: "Is PPF really self-healing?",
			a: "Yes—light swirls and marks in the top coat reduce with heat from the sun, warm water, or gentle heat sources. Deep gouges or impacts may not heal."
		},
		{
			q: "How long does PPF last?",
			a: "Quality films typically last 5–10 years depending on environment and care. Regular washes and safe products help maintain clarity."
		},
		{
			q: "Will I see edges or seams?",
			a: "We use precise patterns and wrap edges where panels allow. Some seams are necessary for complex shapes; we place them discreetly for a clean look."
		}
	]
};
const cta$1 = {
	title: "Ready to shield your paint?",
	description: "",
	primary: {
		label: "Book Now",
		href: "/book?service=ppf"
	},
	secondary: {
		label: "Request Quote",
		href: "/quote?service=ppf"
	}
};
const jsonLd$1 = {
	service: {
		"@context": "https://schema.org",
		"@type": "Service",
		name: "Paint Protection Film (PPF)",
		serviceType: "Automotive Paint Protection Film",
		provider: {
			"@type": "Organization",
			name: "Mobile Detail Hub"
		},
		areaServed: {
			"@type": "Place",
			name: "{CITY}, {STATE}"
		},
		description: "Professional PPF installation using self-healing, stain-resistant urethane film to protect high-impact areas or the entire vehicle.",
		brand: "Mobile Detail Hub",
		offers: {
			"@type": "AggregateOffer",
			priceCurrency: "USD",
			lowPrice: 900,
			highPrice: 4500,
			offerCount: 4
		}
	},
	faq: {
		"@context": "https://schema.org",
		"@type": "FAQPage",
		mainEntity: [
			{
				"@type": "Question",
				name: "PPF vs. Ceramic Coating—what’s the difference?",
				acceptedAnswer: {
					"@type": "Answer",
					text: "PPF is a physical barrier that absorbs impacts and prevents chips; ceramic adds slickness, gloss, and chemical resistance. Many owners choose both."
				}
			},
			{
				"@type": "Question",
				name: "Is PPF really self-healing?",
				acceptedAnswer: {
					"@type": "Answer",
					text: "Light swirls in the PPF top coat reduce with heat from the sun, warm water, or gentle heat sources. Deep gouges may not heal."
				}
			}
		]
	},
	breadcrumbs: {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: [
			{
				"@type": "ListItem",
				position: 1,
				name: "Services",
				item: "{ORIGIN}/services"
			},
			{
				"@type": "ListItem",
				position: 2,
				name: "Paint Protection Film (PPF)",
				item: "{ORIGIN}/service/ppf-installation"
			}
		]
	}
};
const ppfData = {
	id: id$1,
	slug: slug$1,
	route: route$1,
	title: title$1,
	shortDescription: shortDescription$1,
	seo: seo$1,
	hero: hero$1,
	overview: overview$1,
	whatItIs: whatItIs$1,
	process: process$1,
	results: results$1,
	gallery: gallery$1,
	pricing: pricing$1,
	faq: faq$1,
	cta: cta$1,
	jsonLd: jsonLd$1
};

const id = "rv-detailing";
const slug = "rv-detailing";
const route = "/service/rv-detailing";
const title = "RV Detailing";
const shortDescription = "Deep cleaning, oxidation care, roof treatment, and protection for motorhomes and trailers";
const seo = {
	metaTitle: "RV Detailing (Motorhome & Trailer) | Mobile Detail Hub",
	metaDescription: "Professional mobile RV detailing: roof cleaning/treatment, bug & tar removal, black streak removal, gelcoat oxidation care, decal-safe wash, and UV protection for motorhomes, travel trailers, and fifth wheels.",
	keywords: [
		"rv detailing",
		"motorhome detailing",
		"travel trailer detailing",
		"fifth wheel detailing",
		"rv roof cleaning",
		"black streak removal",
		"gelcoat oxidation removal",
		"rv ceramic coating prep"
	],
	canonicalPath: "/service/rv-detailing",
	ogImage: "/images/services/rv-detailing/hero.jpg",
	robots: "index,follow"
};
const hero = {
	image: {
		src: "/mobile-detailing/images/services/rv-detailing/hero.jpg",
		alt: "Professional RV detailing service",
		caption: "Mobile RV detailing at your site, storage facility, or park"
	},
	headline: "RV Detailing",
	subheadline: "Roof to wheels: oxidation care, black streak removal, and UV protection designed for large-format vehicles.",
	ctas: [
		{
			label: "Book Now",
			href: "/book?service=rv-detailing"
		},
		{
			label: "Request Quote",
			href: "/quote?service=rv-detailing"
		}
	]
};
const overview = {
	summary: "Comprehensive mobile RV detailing for motorhomes, travel trailers, and fifth wheels—optimized for fiberglass/gelcoat, painted panels, and vinyl decals.",
	benefits: [
		"Convenient on-site service (park, storage, home)",
		"Large-vehicle safe methods and ladders/scaffolds",
		"Improved gloss, cleanliness, and protection"
	],
	features: [
		"Roof cleaning and treatment",
		"Bug/tar and black streak removal",
		"Gelcoat oxidation care (light)",
		"UV sealant or wax applied to exterior"
	]
};
const whatItIs = {
	description: "A complete RV exterior service focused on safe washing, decontamination, roof care, and protection for gelcoat, painted panels, and decals. Ideal preparation before multi-stage correction or ceramic coating.",
	benefits: [
		"Removes bugs, tar, road film, and black streaks",
		"Cleans and treats the roof to resist UV and chalking",
		"Light oxidation care to brighten gelcoat and painted panels",
		"Decal-safe wash methods and appropriate dressings",
		"Applies UV sealant for easier washing and seasonal protection"
	],
	image: {
		src: "/mobile-detailing/images/services/rv-detailing/what-it-is.jpg",
		alt: "RV detailing explanation graphic"
	}
};
const process = {
	title: "Our RV Detailing Process",
	steps: [
		{
			number: 1,
			title: "Inspection & Prep",
			bullets: [
				"Assess roof, panels, decals, and oxidation",
				"Pre-rinse and foam wash with RV-safe detergents",
				"Bug/tar treatment and safe contact wash"
			],
			image: {
				src: "/mobile-detailing/images/services/rv-detailing/process-1.jpg",
				alt: "RV inspection and preparation"
			}
		},
		{
			number: 2,
			title: "Decontamination & Roof Care",
			bullets: [
				"Mechanical decon where appropriate (rail dust/overspray)",
				"Roof cleaning and treatment to resist UV/chalking",
				"Black streak removal along gutters and trim"
			],
			image: {
				src: "/mobile-detailing/images/services/rv-detailing/process-2.jpg",
				alt: "RV decontamination and roof treatment"
			}
		},
		{
			number: 3,
			title: "Protection & Finishing",
			bullets: [
				"Light oxidation care on gelcoat/paint (where included)",
				"UV sealant or wax applied to exterior surfaces",
				"Trim/tires dressed to a clean satin finish"
			],
			image: {
				src: "/mobile-detailing/images/services/rv-detailing/process-3.jpg",
				alt: "RV protection and finishing"
			}
		}
	]
};
const results = {
	bullets: [
		"Clean, streak-free exterior with restored clarity",
		"Roof treated to slow UV damage and chalking",
		"Protected surfaces that wash easier and stay glossy longer"
	],
	images: {
		before: {
			src: "/mobile-detailing/images/services/rv-detailing/before.jpg",
			alt: "RV before detailing"
		},
		after: {
			src: "/mobile-detailing/images/services/rv-detailing/after.jpg",
			alt: "RV after detailing"
		}
	},
	containerSize: "large"
};
const gallery = {
	title: "RV Detailing Gallery",
	images: [
		{
			id: "1",
			src: "/mobile-detailing/images/services/rv-detailing/hero.jpg",
			alt: "RV detailing service",
			caption: "Professional RV detailing"
		}
	]
};
const pricing = {
	title: "RV Detailing Pricing",
	tiers: [
		{
			id: "essential",
			name: "Essential RV Detail",
			price: {
				label: "From $300",
				min: 300,
				currency: "USD"
			},
			description: "Exterior wash, roof clean, and seasonal UV protection",
			popular: false,
			features: [
				"Foam/hand wash + bug & tar removal",
				"Roof cleaning and treatment",
				"Black streak removal (standard)",
				"UV sealant on gelcoat/painted panels"
			]
		},
		{
			id: "premium",
			name: "Premium RV Detail",
			price: {
				label: "From $550",
				min: 550,
				currency: "USD"
			},
			description: "Deeper decon and light oxidation care with extended protection",
			popular: true,
			features: [
				"Enhanced decontamination (rail dust/overspray)",
				"Expanded black streak remediation",
				"Light oxidation care for gelcoat/paint",
				"Extended-durability UV protection"
			]
		}
	],
	notes: "Final pricing depends on size (Class B/C/A, travel trailer, fifth wheel), condition, and accessibility."
};
const faq = {
	title: "RV Detailing FAQ",
	items: [
		{
			q: "How long does RV detailing take?",
			a: "Typically 6–10 hours for mid-size RVs; large Class A or multi-slide units can take 1–2 days depending on condition and access."
		},
		{
			q: "Do you service RV parks and storage facilities?",
			a: "Yes. We are fully mobile and service homes, parks, and storage sites where permitted."
		},
		{
			q: "Will this remove oxidation on my RV?",
			a: "Premium includes light oxidation care. Severe oxidation/chalking may require multi-stage correction or restoration quoted separately."
		},
		{
			q: "Is this safe for decals and graphics?",
			a: "Yes. We use decal-safe products and techniques to clean and protect without lifting edges or fading."
		}
	]
};
const cta = {
	title: "Ready to refresh your RV?",
	description: "",
	primary: {
		label: "Book Now",
		href: "/book?service=rv-detailing"
	},
	secondary: {
		label: "Request Quote",
		href: "/quote?service=rv-detailing"
	}
};
const jsonLd = {
	service: {
		"@context": "https://schema.org",
		"@type": "Service",
		name: "RV Detailing",
		serviceType: "RV Detailing",
		provider: {
			"@type": "Organization",
			name: "Mobile Detail Hub"
		},
		areaServed: {
			"@type": "Place",
			name: "{CITY}, {STATE}"
		},
		description: "Mobile RV detailing including roof cleaning/treatment, black streak removal, bug/tar removal, light oxidation care, and UV protection.",
		brand: "Mobile Detail Hub",
		offers: {
			"@type": "AggregateOffer",
			priceCurrency: "USD",
			lowPrice: 300,
			highPrice: 550,
			offerCount: 2
		}
	},
	faq: {
		"@context": "https://schema.org",
		"@type": "FAQPage",
		mainEntity: [
			{
				"@type": "Question",
				name: "How long does RV detailing take?",
				acceptedAnswer: {
					"@type": "Answer",
					text: "Typically 6–10 hours for mid-size RVs; large Class A or multi-slide units can take 1–2 days depending on condition and access."
				}
			},
			{
				"@type": "Question",
				name: "Do you service RV parks and storage facilities?",
				acceptedAnswer: {
					"@type": "Answer",
					text: "Yes. We are fully mobile and service homes, parks, and storage sites where permitted."
				}
			}
		]
	},
	breadcrumbs: {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: [
			{
				"@type": "ListItem",
				position: 1,
				name: "Services",
				item: "{ORIGIN}/services"
			},
			{
				"@type": "ListItem",
				position: 2,
				name: "RV Detailing",
				item: "{ORIGIN}/service/rv-detailing"
			}
		]
	}
};
const rvDetailingData = {
	id: id,
	slug: slug,
	route: route,
	title: title,
	shortDescription: shortDescription,
	seo: seo,
	hero: hero,
	overview: overview,
	whatItIs: whatItIs,
	process: process,
	results: results,
	gallery: gallery,
	pricing: pricing,
	faq: faq,
	cta: cta,
	jsonLd: jsonLd
};

function getServiceImageFromLocation(locationData, serviceRole, fallbackImage) {
  if (!locationData?.images || locationData.images.length === 0) {
    return {
      url: fallbackImage,
      alt: "Service image",
      width: 400,
      height: 300,
      priority: false
    };
  }
  const serviceImage = locationData.images.find((img) => img.role === serviceRole);
  if (serviceImage) {
    return {
      url: serviceImage.url,
      alt: serviceImage.alt,
      width: serviceImage.width || 400,
      height: serviceImage.height || 300,
      priority: serviceImage.priority || false
    };
  }
  return {
    url: fallbackImage,
    alt: "Service image",
    width: 400,
    height: 300,
    priority: false
  };
}
function injectAllSchemas(schemas) {
  const existingSchemas = document.querySelectorAll('script[type="application/ld+json"]');
  existingSchemas.forEach((schema) => {
    schema.remove();
  });
  schemas.forEach((schema, index) => {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(schema);
    script.setAttribute("data-schema-index", index.toString());
    document.head.appendChild(script);
  });
}

const getServicesFromSiteData = (locationData, tenantSlug) => {
  return assetsData.services.grid.map((service, index) => {
    const thumbnail = assetsData.services.thumbnails[service.slug];
    let serviceRole = null;
    if (service.slug.includes("auto-detailing")) {
      serviceRole = "auto";
    } else if (service.slug.includes("marine-detailing")) {
      serviceRole = "marine";
    } else if (service.slug.includes("rv-detailing")) {
      serviceRole = "rv";
    }
    const imageData = serviceRole && locationData ? getServiceImageFromLocation(locationData, serviceRole, thumbnail.url || "") : {
      url: thumbnail.url || "",
      alt: thumbnail.alt || "",
      width: thumbnail.width || 400,
      height: thumbnail.height || 300,
      priority: service.priority
    };
    const route = env.DEV && tenantSlug ? `/${tenantSlug}/services/${service.slug}` : `/service/${service.slug}`;
    const serviceData = {
      id: (index + 1).toString(),
      title: service.title,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- service.alt from JSON, type refinement planned
      description: service.alt,
      // Using alt text as description
      imageUrl: imageData.url,
      route,
      category: service.slug.split("-")[0] || "general",
      // Extract category from slug
      imageWidth: imageData.width,
      imageHeight: imageData.height,
      imagePriority: imageData.priority
    };
    return serviceData;
  });
};
const useServices = (locationData) => {
  const navigate = useNavigate();
  const tenantSlug = useTenantSlug();
  const handleServiceClick = (service) => {
    void navigate(service.route);
  };
  const getServices = () => {
    return getServicesFromSiteData(locationData, tenantSlug);
  };
  const getServiceById = (id) => {
    return getServicesFromSiteData(locationData, tenantSlug).find((service) => service.id === id);
  };
  const getServicesByCategory = (category) => {
    return getServicesFromSiteData(locationData, tenantSlug).filter((service) => service.category === category);
  };
  const getAutoDetailingData = () => {
    return autoDetailingData;
  };
  const getMarineDetailingData = () => {
    return marineDetailingData;
  };
  const getRvDetailingData = () => {
    return rvDetailingData;
  };
  const getCeramicCoatingData = () => {
    return ceramicCoatingData;
  };
  const getPaintCorrectionData = () => {
    return paintCorrectionData;
  };
  const getPpfData = () => {
    return ppfData;
  };
  return {
    services: getServices(),
    handleServiceClick,
    getServiceById,
    getServicesByCategory,
    getAutoDetailingData,
    getMarineDetailingData,
    getRvDetailingData,
    getCeramicCoatingData,
    getPaintCorrectionData,
    getPpfData
  };
};

const ServicesGrid = ({ locationData }) => {
  const { services } = useServices(locationData);
  const firstThreeServices = services.slice(0, 3);
  const lastThreeServices = services.slice(3, 6);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "section",
      {
        id: "services",
        className: "md:hidden relative z-0 h-screen snap-start snap-always bg-stone-800 px-4 py-4",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto w-full h-full flex flex-col justify-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-3xl font-bold text-white text-center mb-4", children: "Our Services" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "grid grid-cols-1 gap-4", children: firstThreeServices.map((service) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            ServiceCard,
            {
              service
            },
            service.id
          )) })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "section",
      {
        className: "md:hidden relative z-0 h-screen snap-start snap-always bg-stone-800 px-4 py-2",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto w-full h-full flex flex-col justify-start pt-[80px]", children: /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "grid grid-cols-1 gap-4 [&>li>div>div]:h-[calc((100vh-200px)/3)]", children: lastThreeServices.map((service) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          ServiceCard,
          {
            service
          },
          service.id
        )) }) })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "section",
      {
        id: "services-desktop",
        className: "hidden md:block relative z-0 min-h-screen snap-start snap-always bg-stone-800 px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 py-8 md:py-12 pt-[100px] md:pt-[120px]",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto w-full", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-3xl md:text-4xl lg:text-5xl font-bold text-white text-center mb-4 md:mb-6 lg:mb-8", children: "Our Services" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8", children: services.map((service) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            ServiceCard,
            {
              service
            },
            service.id
          )) })
        ] })
      }
    )
  ] });
};

const RequestQuoteModal = React.lazy(() => __vitePreload(() => import('./RequestQuoteModal-BRMwHJKh.js'),true?__vite__mapDeps([9,3,4,5,10,11]):void 0,import.meta.url));
const LazyRequestQuoteModal = (props) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(reactExports.Suspense, { fallback: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-stone-800 text-white p-6 rounded-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "animate-pulse", children: "Loading quote form..." }) }) }), children: /* @__PURE__ */ jsxRuntimeExports.jsx(RequestQuoteModal, { ...props }) });
};

const getVehicleYears = () => {
  const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
  const maxYear = currentYear + 1;
  const minYear = 1950;
  const years = [];
  for (let year = maxYear; year >= minYear; year--) {
    years.push(year);
  }
  years.push(`Before ${String(minYear)}`);
  return years;
};
({
  maxYear: (/* @__PURE__ */ new Date()).getFullYear() + 1,
  totalYears: (/* @__PURE__ */ new Date()).getFullYear() + 1 - 1950 + 1
});

const quoteRequestSchema = object({
  name: string().min(2, "Name must be at least 2 characters"),
  email: email("Invalid email address"),
  phone: string().min(10, "Phone number must be at least 10 digits"),
  vehicleType: string().min(1, "Vehicle type is required"),
  vehicleMake: string().min(1, "Vehicle make is required"),
  vehicleModel: string().min(1, "Vehicle model is required"),
  vehicleYear: string().min(4, "Vehicle year must be 4 digits"),
  services: array(string()).min(1, "At least one service must be selected"),
  message: string().optional(),
  city: string().min(1, "City is required"),
  state: string().min(2, "State is required"),
  zipCode: string().min(5, "Zip code must be at least 5 digits"),
  businessSlug: string().optional()
});
object({
  status: _enum(["pending", "in_progress", "completed", "cancelled"]),
  notes: string().optional(),
  estimatedPrice: number().optional(),
  estimatedDuration: number().optional()
});
object({
  id: string(),
  name: string(),
  email: string(),
  phone: string(),
  vehicleType: string(),
  vehicleMake: string(),
  vehicleModel: string(),
  vehicleYear: string(),
  services: array(string()),
  message: string().optional(),
  city: string(),
  state: string(),
  zipCode: string(),
  businessSlug: string().optional(),
  status: _enum(["pending", "in_progress", "completed", "cancelled"]),
  createdAt: string(),
  updatedAt: string(),
  estimatedPrice: number().optional(),
  estimatedDuration: number().optional(),
  notes: string().optional()
});
object({
  business_slug: string().optional(),
  user_id: string().optional(),
  status: _enum(["pending", "in_progress", "completed", "cancelled"]).optional(),
  limit: number().min(1).max(100).default(10),
  offset: number().min(0).default(0)
});
object({
  reason: string().optional(),
  notes: string().optional()
});

const FooterLocations = ({ serviceAreas }) => {
  const [isModalOpen, setIsModalOpen] = reactExports.useState(false);
  const tenantData = useData();
  const shouldUseTenantData = tenantData.isTenant && serviceAreas && serviceAreas.length > 0;
  const displayAreas = shouldUseTenantData ? serviceAreas.slice(0, 4) : [];
  const hasMore = shouldUseTenantData && serviceAreas.length > 4;
  const handleViewMore = () => {
    setIsModalOpen(true);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center md:text-right", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-bold text-orange-400 text-xl mb-6", children: "Service Areas" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col space-y-3", children: shouldUseTenantData ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        displayAreas.map((area, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-white text-lg", children: [
          area.city,
          ", ",
          area.state
        ] }, index)),
        hasMore && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center md:justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: handleViewMore,
            className: "text-orange-400 hover:text-orange-300 transition-colors duration-200 text-lg bg-transparent border-none p-0 font-inherit cursor-pointer",
            children: "View More"
          }
        ) })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-white text-lg", children: "Multiple Service Areas" }) })
    ] }),
    shouldUseTenantData && /* @__PURE__ */ jsxRuntimeExports.jsx(
      ServiceAreasModal,
      {
        isOpen: isModalOpen,
        onClose: () => {
          setIsModalOpen(false);
        },
        serviceAreas,
        businessName: tenantData.businessName
      }
    )
  ] });
};

const GetInTouch = ({
  config,
  onRequestQuote,
  showLocationSetter = false
}) => {
  const contactInfo = {
    phone: config?.phone ?? "(555) 123-4567",
    email: config?.email ?? "hello@thatsmartsite.com",
    location: config?.base_location?.city && config.base_location.state_name ? `${config.base_location.city}, ${config.base_location.state_name}` : null
    // Don't show location for main site
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center md:text-left", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-bold text-orange-400 text-xl mb-6", children: "Get in Touch" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center md:justify-start space-x-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "h-5 w-5 flex-shrink-0 text-orange-400" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "a",
          {
            href: `tel:${contactInfo.phone}`,
            className: "text-lg text-white hover:text-orange-400 transition-colors duration-200",
            children: contactInfo.phone
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center md:justify-start space-x-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "h-5 w-5 flex-shrink-0 text-orange-400" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: onRequestQuote,
            className: "text-lg text-white hover:text-orange-400 transition-colors duration-200 bg-transparent border-none p-0 font-inherit cursor-pointer text-left",
            children: contactInfo.email
          }
        )
      ] }),
      contactInfo.location && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden md:flex items-center justify-center md:justify-start space-x-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-5 w-5 flex-shrink-0 text-orange-400" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg text-white", children: contactInfo.location })
      ] }),
      showLocationSetter && !contactInfo.location && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center md:justify-start space-x-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-5 w-5 flex-shrink-0 text-orange-400" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "a",
          {
            href: "/locations",
            className: "text-lg text-orange-400 hover:text-orange-300 transition-colors duration-200",
            children: "Set Your Location"
          }
        )
      ] })
    ] })
  ] });
};

const Footer = ({ onRequestQuote }) => {
  const tenantData = useData();
  const config = {
    phone: formatPhoneNumber(tenantData.phone),
    email: tenantData.email,
    base_location: {
      city: tenantData.location.split(", ")[0] ?? "",
      state_name: tenantData.location.split(", ")[1] ?? ""
    }
  };
  const socialMedia = {
    facebook: tenantData.socialMedia.facebook,
    instagram: tenantData.socialMedia.instagram,
    tiktok: tenantData.socialMedia.tiktok,
    youtube: tenantData.socialMedia.youtube
  };
  const businessInfo = {
    name: tenantData.businessName
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-6xl mx-auto w-full px-4 md:px-6 lg:px-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:hidden space-y-6 mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        GetInTouch,
        {
          config,
          onRequestQuote: onRequestQuote || (() => {
          }),
          showLocationSetter: false
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(FollowUs, { socialMedia }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(FooterLocations, { serviceAreas: tenantData.serviceAreas })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden md:grid md:grid-cols-3 gap-6 md:gap-7 lg:gap-8 mb-6 md:mb-7 lg:mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        GetInTouch,
        {
          config,
          onRequestQuote: onRequestQuote || (() => {
          }),
          showLocationSetter: false
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(FollowUs, { socialMedia }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(FooterLocations, { serviceAreas: tenantData.serviceAreas })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center mb-4 md:mb-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      CTAButtons,
      {
        getQuoteProps: { onClick: onRequestQuote },
        bookNowProps: { size: "md" }
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Disclaimer,
      {
        businessInfo
      }
    )
  ] });
};

const GALLERY_DATA_URL = "/mobile-detailing/data/gallery.json";
const isValidGalleryImage = (item) => {
  return typeof item === "object" && item !== null && "src" in item && "tags" in item;
};
const galleryApi = {
  /**
   * Fetch gallery images
   */
  getGalleryImages: async () => {
    try {
      const response = await fetch(GALLERY_DATA_URL);
      if (!response.ok) {
        throw new Error(`Failed to fetch gallery data: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Gallery API Error:", error);
      throw new Error(`Failed to load gallery images: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  },
  /**
   * Get random gallery images for background rotation
   */
  getRandomGalleryImages: async (count = 5) => {
    try {
      const response = await fetch(GALLERY_DATA_URL);
      if (!response.ok) {
        throw new Error(`Failed to fetch gallery data: ${response.status}`);
      }
      const allImages = await response.json();
      const backgroundImages = allImages.filter((img) => {
        if (!isValidGalleryImage(img)) return false;
        const src = img.src.toLowerCase();
        return !src.includes("avatar") && !src.includes("profile");
      });
      const shuffled = [...backgroundImages].sort(() => Math.random() - 0.5);
      return shuffled.slice(0, Math.min(count, shuffled.length));
    } catch (error) {
      console.error("Random Gallery API Error:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      throw new Error(`Failed to load random gallery images: ${errorMessage}`);
    }
  },
  /**
   * Get gallery images for a specific category
   */
  getGalleryImagesByCategory: async (category) => {
    try {
      const response = await fetch(GALLERY_DATA_URL);
      if (!response.ok) {
        throw new Error(`Failed to fetch gallery data: ${response.status}`);
      }
      const allImages = await response.json();
      return allImages.filter((img) => {
        if (!isValidGalleryImage(img)) return false;
        return img.tags.some((tag) => tag.toLowerCase().includes(category.toLowerCase()));
      });
    } catch (error) {
      console.error("Gallery Category API Error:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      throw new Error(`Failed to load gallery images for category ${category}: ${errorMessage}`);
    }
  },
  /**
   * Get featured gallery images
   */
  getFeaturedGalleryImages: async () => {
    try {
      const allImages = await galleryApi.getGalleryImages();
      return allImages;
    } catch (error) {
      console.error("Featured Gallery API Error:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      throw new Error(`Failed to load featured gallery images: ${errorMessage}`);
    }
  }
};

const useGallery = () => {
  const [images, setImages] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [error, setError] = reactExports.useState(null);
  reactExports.useEffect(() => {
    const fetchGalleryData = async () => {
      try {
        setLoading(true);
        setError(null);
        const galleryImages = await galleryApi.getGalleryImages();
        setImages(galleryImages);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load gallery data");
      } finally {
        setLoading(false);
      }
    };
    void fetchGalleryData();
  }, []);
  return {
    images,
    loading,
    error
  };
};

function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = shuffled[i];
    const itemJ = shuffled[j];
    if (temp !== void 0 && itemJ !== void 0) {
      shuffled[i] = itemJ;
      shuffled[j] = temp;
    }
  }
  return shuffled;
}
function useRotatingGallery() {
  const [allImages, setAllImages] = reactExports.useState([]);
  const [state, setState] = reactExports.useState({
    currentImages: [],
    loading: true,
    error: null,
    fadingIndex: null,
    nextImages: []
  });
  const allImagesRef = reactExports.useRef([]);
  const currentRef = reactExports.useRef([]);
  const fadingIndexRef = reactExports.useRef(-1);
  const nextPtrRef = reactExports.useRef(0);
  const intervalRef = reactExports.useRef(null);
  const fadeTimeoutRef = reactExports.useRef(null);
  const unFadeTimeoutRef = reactExports.useRef({
    timeout: null,
    raf: null
  });
  reactExports.useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const data = await galleryApi.getGalleryImages();
        if (cancelled) return;
        const shuffledData = shuffleArray(data);
        setAllImages(shuffledData);
        allImagesRef.current = shuffledData;
        const initial = shuffledData.slice(0, Math.min(3, shuffledData.length));
        currentRef.current = initial;
        nextPtrRef.current = initial.length % shuffledData.length;
        setState((s) => ({
          ...s,
          currentImages: initial,
          nextImages: initial,
          loading: false,
          error: null
        }));
      } catch (err) {
        if (cancelled) return;
        setState((s) => ({
          ...s,
          loading: false,
          error: err instanceof Error ? err.message : "Failed to load gallery data"
        }));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);
  const getNextUniqueImage = reactExports.useCallback(() => {
    const all = allImagesRef.current;
    const current = currentRef.current;
    if (all.length === 0) return null;
    const visibleIds = new Set(current.map((i) => i.id));
    let tries = 0;
    let ptr = nextPtrRef.current;
    while (tries < all.length) {
      const candidate = all[ptr];
      ptr = (ptr + 1) % all.length;
      tries++;
      if (!candidate) continue;
      if (!visibleIds.has(candidate.id)) {
        nextPtrRef.current = ptr;
        return candidate;
      }
    }
    const fallback = all[nextPtrRef.current];
    nextPtrRef.current = (nextPtrRef.current + 1) % all.length;
    return fallback ?? null;
  }, []);
  const rotateOneCard = reactExports.useCallback(() => {
    const all = allImagesRef.current;
    if (all.length === 0) return;
    const current = currentRef.current;
    if (current.length === 0) return;
    const nextFadeIndex = (fadingIndexRef.current + 1) % Math.min(current.length, 3);
    fadingIndexRef.current = nextFadeIndex;
    const replacement = getNextUniqueImage();
    if (replacement) {
      const nextImages = currentRef.current.slice();
      nextImages[nextFadeIndex] = replacement;
      setState((s) => ({ ...s, nextImages }));
      const raf = window.requestAnimationFrame(() => {
        setState((s) => ({ ...s, fadingIndex: nextFadeIndex }));
      });
      unFadeTimeoutRef.current.raf = raf;
      const timeout = window.setTimeout(() => {
        currentRef.current = nextImages;
        setState((s) => ({
          ...s,
          currentImages: nextImages,
          fadingIndex: null
        }));
      }, 1e3 + 50);
      unFadeTimeoutRef.current.timeout = timeout;
    }
  }, [getNextUniqueImage]);
  reactExports.useEffect(() => {
    if (allImages.length === 0) return;
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = window.setInterval(rotateOneCard, 7e3);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      const fadeTimeout = fadeTimeoutRef.current;
      const unFadeTimeouts = unFadeTimeoutRef.current;
      if (fadeTimeout !== null) {
        clearTimeout(fadeTimeout);
      }
      if (unFadeTimeouts.timeout !== null) {
        clearTimeout(unFadeTimeouts.timeout);
      }
      if (unFadeTimeouts.raf !== null) {
        cancelAnimationFrame(unFadeTimeouts.raf);
      }
    };
  }, [allImages.length, rotateOneCard]);
  return {
    currentImages: state.currentImages,
    // render these 3
    nextImages: state.nextImages,
    // next images for crossfade
    loading: state.loading,
    error: state.error,
    fadingIndex: state.fadingIndex
    // which card should have the fade class
  };
}

const GalleryItem = ({ image }) => {
  try {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "group relative block rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "aspect-[3/2]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "img",
        {
          src: image.src,
          alt: image.alt,
          width: image.width,
          height: image.height,
          loading: image.loading || "lazy",
          className: "absolute inset-0 w-full h-full object-cover",
          onError: (e) => {
            const target = e.target;
            target.style.display = "none";
            const parent = target.parentElement;
            if (parent) {
              parent.innerHTML = `
                  <div class="absolute inset-0 w-full h-full bg-stone-700 flex items-center justify-center">
                    <div class="text-center text-stone-400">
                      <div class="text-4xl mb-2">📷</div>
                      <div class="text-sm">Add ${image.src.split("/").pop()}</div>
                    </div>
                  </div>
                `;
            }
          }
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute bottom-0 left-0 right-0 p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-white font-semibold text-sm mb-1 truncate", children: image.title || "Untitled" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-stone-300 text-xs overflow-hidden", style: { display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }, children: image.caption || "No description available" })
      ] }) })
    ] }) });
  } catch (error) {
    console.error("Error rendering gallery item:", error);
    return /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "group relative block rounded-lg overflow-hidden shadow-lg bg-stone-700", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "aspect-[3/2] flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-stone-400", children: "Error loading image" }) }) }) });
  }
};

const RotatingGalleryItem = ({ image, nextImage, isTransitioning, index: _index }) => {
  const next = nextImage ?? image;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `group relative block rounded-lg overflow-hidden shadow-lg transition-all duration-1000 hover:-translate-y-2 hover:shadow-xl ${isTransitioning ? "is-fading" : ""}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "aspect-[3/2] relative", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "img",
        {
          src: image.src,
          alt: image.alt,
          width: image.width,
          height: image.height,
          loading: image.loading || "lazy",
          className: `absolute inset-0 w-full h-full object-cover transition-opacity will-change-opacity ${isTransitioning ? "opacity-0" : "opacity-100"}`,
          style: { transitionDuration: "1000ms" },
          onError: (e) => {
            const target = e.target;
            target.style.display = "none";
            const parent = target.parentElement;
            if (parent) {
              parent.innerHTML = `
                  <div class="absolute inset-0 w-full h-full bg-stone-700 flex items-center justify-center">
                    <div class="text-center text-stone-400">
                      <div class="text-4xl mb-2">📷</div>
                      <div class="text-sm">Add ${image.src.split("/").pop()}</div>
                    </div>
                  </div>
                `;
            }
          }
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "img",
        {
          src: next.src,
          alt: next.alt,
          width: next.width,
          height: next.height,
          loading: "lazy",
          className: `absolute inset-0 w-full h-full object-cover transition-opacity will-change-opacity ${isTransitioning ? "opacity-100" : "opacity-0"}`,
          style: { transitionDuration: "1000ms" }
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent transition-opacity will-change-opacity",
        style: { transitionDuration: "1000ms" },
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute bottom-0 left-0 right-0 p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-white font-semibold text-sm mb-1 truncate", children: isTransitioning ? next.title || "Untitled" : image.title || "Untitled" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-stone-300 text-xs overflow-hidden", style: { display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }, children: isTransitioning ? next.caption || "No description available" : image.caption || "No description available" })
        ] })
      }
    )
  ] }) });
};

const Gallery = ({ onRequestQuote, locationData: _locationData }) => {
  const { images, loading, error } = useGallery();
  const [currentIndex, setCurrentIndex] = reactExports.useState(0);
  const touchStartX = reactExports.useRef(null);
  const touchEndX = reactExports.useRef(null);
  const { currentImages, nextImages, loading: rotatingLoading, error: rotatingError, fadingIndex } = useRotatingGallery();
  const handlePrevious = () => {
    setCurrentIndex((prev) => prev > 0 ? prev - 1 : images.length - 1);
  };
  const handleNext = () => {
    setCurrentIndex((prev) => prev < images.length - 1 ? prev + 1 : 0);
  };
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0]?.clientX ?? null;
  };
  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0]?.clientX ?? null;
  };
  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const diff = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;
    if (Math.abs(diff) > minSwipeDistance) {
      if (diff > 0) {
        handleNext();
      } else {
        handlePrevious();
      }
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { id: "gallery", className: "md:hidden relative h-screen snap-start snap-always flex items-center justify-center bg-stone-900 px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full w-full flex items-center justify-center pt-[72px]", children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-stone-400", children: "Loading gallery..." }) : error ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-red-400", children: [
      "Error loading gallery: ",
      error
    ] }) : images.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-stone-400", children: "No images available" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-full mx-auto flex flex-col h-full justify-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-3xl font-bold text-white text-center mb-8", children: "Gallery" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          onTouchStart: handleTouchStart,
          onTouchMove: handleTouchMove,
          onTouchEnd: handleTouchEnd,
          className: "w-full",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "w-full mb-6", children: images[currentIndex] && /* @__PURE__ */ jsxRuntimeExports.jsx(GalleryItem, { image: images[currentIndex] }) }),
            images.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4 px-4", children: [
              images[(currentIndex + 1) % images.length] && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: () => {
                    setCurrentIndex((currentIndex + 1) % images.length);
                  },
                  className: "rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "img",
                    {
                      src: images[(currentIndex + 1) % images.length].src,
                      alt: images[(currentIndex + 1) % images.length].alt,
                      className: "w-full h-24 object-cover"
                    }
                  )
                }
              ),
              images[(currentIndex + 2) % images.length] && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: () => {
                    setCurrentIndex((currentIndex + 2) % images.length);
                  },
                  className: "rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "img",
                    {
                      src: images[(currentIndex + 2) % images.length].src,
                      alt: images[(currentIndex + 2) % images.length].alt,
                      className: "w-full h-24 object-cover"
                    }
                  )
                }
              )
            ] })
          ]
        }
      ),
      images.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center mt-6 space-x-2", children: images.map((_, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => {
            setCurrentIndex(index);
          },
          className: `w-3 h-3 rounded-full transition-colors ${currentIndex === index ? "bg-orange-500" : "bg-gray-400 hover:bg-gray-300"}`,
          "aria-label": `Go to image ${index + 1}`
        },
        index
      )) })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { id: "footer", className: "md:hidden relative snap-start snap-always bg-stone-900", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pt-[72px] py-12", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Footer, { onRequestQuote: onRequestQuote || (() => {
    }) }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { id: "gallery-desktop", className: "hidden md:block relative h-screen snap-start snap-always overflow-hidden bg-stone-900", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full pt-[88px]", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10 h-full px-4 pt-20", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1/2 flex items-center justify-center px-4 sm:px-6 lg:px-8 relative", children: rotatingLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-stone-400", children: "Loading gallery..." }) }) : rotatingError ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-red-400", children: [
        "Error loading gallery: ",
        rotatingError
      ] }) }) : currentImages.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-stone-400", children: "No images available" }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 lg:gap-6 w-full", children: currentImages.map((image, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        RotatingGalleryItem,
        {
          image,
          ...nextImages[index] && { nextImage: nextImages[index] },
          isTransitioning: fadingIndex === index,
          index
        },
        image.id
      )) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1/2 flex flex-col justify-center border-t border-stone-700", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Footer, { onRequestQuote: onRequestQuote || (() => {
      }) }) })
    ] }) }) })
  ] });
};

const usePreviewStore = create((set) => ({
  payload: null,
  isLoading: false,
  error: null,
  setPayload: (payload) => {
    set({
      payload,
      error: null
    });
  },
  setLoading: (loading) => {
    set({
      isLoading: loading
    });
  },
  setError: (error) => {
    set({
      error,
      isLoading: false
    });
  },
  clearPreview: () => {
    set({
      payload: null,
      error: null,
      isLoading: false
    });
  }
}));

function usePreviewParams() {
  const [searchParams] = useSearchParams();
  const { payload, isLoading, error, setPayload, setLoading, setError } = usePreviewStore();
  const [hasInitialized, setHasInitialized] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (hasInitialized) return;
    setHasInitialized(true);
    async function loadPreview() {
      setLoading(true);
      setError(null);
      try {
        const token = searchParams.get("t");
        if (token) {
          const verifiedPayload = await verifyPreview(token);
          setPayload(verifiedPayload);
          return;
        }
        const name = searchParams.get("name");
        const phone = searchParams.get("phone");
        const city = searchParams.get("city");
        const state = searchParams.get("state");
        const industry = searchParams.get("industry");
        if (!name || !phone || !city || !state || !industry) {
          throw new Error("Missing required parameters. Please use a valid preview link.");
        }
        const validation = PreviewPayloadSchema.safeParse({
          businessName: name,
          phone,
          city,
          state: state.toUpperCase(),
          industry
        });
        if (!validation.success) {
          throw new Error(safeValidationMessage(validation.error));
        }
        setPayload(validation.data);
      } catch (err) {
        setError(safeErrorMessage(err));
      } finally {
        setLoading(false);
      }
    }
    void loadPreview();
  }, [searchParams, hasInitialized, setPayload, setLoading, setError]);
  return {
    payload,
    isLoading,
    error
  };
}

export { AuthProvider as A, Button as B, CTAButtons as C, DataProvider as D, ErrorBoundary as E, FAQ as F, Gallery as G, Header as H, Input as I, getVehicleYears as J, assetsData as K, LazyRequestQuoteModal as L, cn as M, formatPhoneNumberAsTyped as N, quoteRequestSchema as O, PreviewDataProvider as P, useTenantConfigLoader as Q, Reviews as R, ServicesGrid as S, TenantConfigProvider as T, WebsiteContentProvider as W, __vitePreload as _, usePreviewParams as a, useIsDesktop as b, useScrollSpy as c, PreviewCTAButton as d, Hero as e, createPreview as f, formatPhoneNumber as g, LoginPage as h, ProtectedRoute as i, useIndustrySiteData as j, useData as k, useTenantSlug as l, useReviewsAvailability as m, injectAllSchemas as n, config as o, getPhoneDigits as p, useAuth as q, loadIndustryFAQs as r, env as s, __variableDynamicImportRuntimeHelper as t, useBrowserTab as u, useServices as v, useImageRotation as w, getTransitionStyles as x, getImageOpacityClasses as y, useDataOptional as z };
//# sourceMappingURL=usePreviewParams-BhJVeIAh.js.map
