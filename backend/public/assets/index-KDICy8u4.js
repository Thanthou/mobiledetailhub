const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/index-D59D2CiF.js","assets/content-defaults-Df6c8CcD.js","assets/seo-defaults-2tSsldvQ.js","assets/react-vendor-BgPOigzi.js","assets/vendor-CKIjew4F.js","assets/query-vendor-B2vaS9Wk.js","assets/index-CRBJDcLP.js","assets/index-to5g6MKS.js","assets/index-Co7RayUv.js","assets/RequestQuoteModal-Dp9PY4DU.js","assets/index-jqSxKnA5.js","assets/BookingApp-vCIuGZzg.js"])))=>i.map(i=>d[i]);
import { j as jsxRuntimeExports, D as Database, S as Settings, B as BarChart3, a as Star, U as Users, R as React, L as Loader2, A as AlertCircle, C as CheckCircle, r as reactExports, u as useQuery, b as useParams, c as create, d as Link, e as useNavigate, N as Navigate, T as TrendingUp, f as Shield, X as XCircle, h as X, i as AlertTriangle, k as UserPlus, l as UserCog, m as UserCheck, n as UserX, P as Plus, E as ExternalLink, o as Trash2, M as MapPin, p as SiFacebook, q as SiInstagram, s as SiYoutube, t as Menu, v as CreditCard, w as Car, x as Search, y as reactDomExports, z as ChevronDown, F as SiTiktok, G as Phone, H as Mail, I as ChevronLeft, J as ChevronRight, K as useSearchParams, O as Sparkles, Q as Helmet, Z as Zap, V as Eye, W as Calendar, Y as Home, _ as Globe, $ as User, a0 as Building2, a1 as Link$1, a2 as Clock, a3 as DollarSign, a4 as FileText, a5 as Filter, a6 as Save, a7 as Pen, a8 as Truck, a9 as Bot, aa as Bike, ab as Mountain, ac as HelpCircle, ad as MessageSquare, ae as Upload, af as Send, ag as Image$1, ah as RefreshCw, ai as Check, aj as Wrench, ak as Copy, al as Heart, am as ArrowLeft, an as useStripe, ao as useElements, ap as CardElement, aq as Lock, ar as useLocation, as as Elements, at as QueryClientProvider, au as BrowserRouter, av as Routes, aw as Route, ax as createRoot, ay as HelmetProvider } from './react-vendor-BgPOigzi.js';
import { o as object, b as string, d as boolean, _ as _enum, t as twMerge, e as clsx, n as number, f as array, u as union, r as record, g as unknown, Z as ZodError, P as PropTypes, h as any, j as url, k as email, l as loadStripe } from './vendor-CKIjew4F.js';
import { b as QueryClient } from './query-vendor-B2vaS9Wk.js';

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

const __vite_import_meta_env__ = {"BASE_URL": "/", "DEV": false, "MODE": "production", "PROD": true, "SSR": false, "VITE_API_URL_LIVE": "https://thatsmartsite.onrender.com", "VITE_GOOGLE_CLIENT_ID": "1234567890-abcdefg.apps.googleusercontent.com", "VITE_GOOGLE_MAPS_API_KEY": "AIzaSyDM7hg-lMTC1YY43JVBqtB7nGKx09XVFT8", "VITE_STRIPE_PUBLISHABLE_KEY": "pk_test_51SICKVFg0l3R2Dfo1laXSOBzj8jMU2fDRsl2Gh4SKZ0ElGShLXccEy4GVqNpuS40geSpFrn28gXrZdtjavNc39KP00IeaYiwqq"};
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

const scriptRel = 'modulepreload';const assetsURL = function(dep) { return "/"+dep };const seen = {};const __vitePreload = function preload(baseModule, deps, importerUrl) {
  let promise = Promise.resolve();
  if (true && deps && deps.length > 0) {
    document.getElementsByTagName("link");
    const cspNonceMeta = document.querySelector(
      "meta[property=csp-nonce]"
    );
    const cspNonce = cspNonceMeta?.nonce || cspNonceMeta?.getAttribute("nonce");
    promise = Promise.allSettled(
      deps.map((dep) => {
        dep = assetsURL(dep);
        if (dep in seen) return;
        seen[dep] = true;
        const isCss = dep.endsWith(".css");
        const cssSelector = isCss ? '[rel="stylesheet"]' : "";
        if (document.querySelector(`link[href="${dep}"]${cssSelector}`)) {
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

const AdminLayout = ({ children }) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-gray-900", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "bg-gray-800 shadow-sm border-b border-gray-700", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between h-16", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Database, { className: "w-8 h-8 text-blue-600 mr-3" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-semibold text-white", children: "Admin Dashboard" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-gray-300", children: "Welcome back, Admin" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white text-sm font-medium", children: "A" }) })
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children })
  ] });
};

const ADMIN_TABS = [
  { id: "users", label: "Users", icon: "Users" },
  { id: "reviews", label: "Reviews", icon: "Star" },
  { id: "analytics", label: "Analytics", icon: "BarChart3" },
  { id: "settings", label: "Settings", icon: "Settings" }
];

const iconMap = {
  Database,
  Users,
  Star,
  BarChart3,
  Settings
};
const AdminTabs = ({ activeTab, onTabChange }) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "flex space-x-8 mb-8", children: ADMIN_TABS.map((tab) => {
    const Icon = iconMap[tab.icon];
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        onClick: () => {
          onTabChange(tab.id);
        },
        className: `flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === tab.id ? "bg-blue-900 text-blue-300 border-b-2 border-blue-400" : "text-gray-300 hover:text-white hover:bg-gray-700"}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "w-4 h-4" }),
          tab.label
        ]
      },
      tab.id
    );
  }) });
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

const AutoSaveInput = ({
  label,
  type = "text",
  value,
  onChange,
  isSaving,
  error,
  placeholder,
  className = "",
  disabled = false
}) => {
  const handleChange = (e) => {
    onChange(e.target.value);
  };
  const getStatusIcon = () => {
    if (isSaving) {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(Loader2, { className: "h-4 w-4 text-blue-500 animate-spin" });
    }
    if (error) {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(AlertCircle, { className: "h-4 w-4 text-red-500" });
    }
    if (value && value.trim() !== "") {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(CheckCircle, { className: "h-4 w-4 text-green-500" });
    }
    return null;
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium text-gray-300 mb-2", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          type,
          value,
          onChange: handleChange,
          placeholder,
          disabled,
          className: `w-full px-3 py-2 pr-10 border rounded-md bg-stone-700 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${error ? "border-red-500" : "border-stone-600"} ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-y-0 right-0 flex items-center pr-3", children: getStatusIcon() })
    ] }),
    error && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-red-400", children: error }),
    isSaving && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-blue-400", children: "Saving..." })
  ] });
};

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

function useAutoSave$1(initialValue, saveFn, options = {}) {
  const { debounce = 800 } = options;
  const [value, setValue] = reactExports.useState(initialValue);
  const [isSaving, setIsSaving] = reactExports.useState(false);
  const [error, setError] = reactExports.useState(null);
  const timeoutRef = reactExports.useRef(null);
  const isFirstRender = reactExports.useRef(true);
  const previousInitialValue = reactExports.useRef(initialValue);
  reactExports.useEffect(() => {
    if (previousInitialValue.current !== initialValue) {
      setValue(initialValue);
      isFirstRender.current = true;
      previousInitialValue.current = initialValue;
    }
  }, [initialValue]);
  reactExports.useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setIsSaving(true);
    setError(null);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => {
      void (async () => {
        try {
          await saveFn(value);
          setIsSaving(false);
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : "Failed to save";
          setError(errorMessage);
          setIsSaving(false);
        }
      })();
    }, debounce);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [value]);
  return { value, setValue, isSaving, error };
}

function getToday() {
  const now = /* @__PURE__ */ new Date();
  return formatDateToYYYYMMDD(now);
}
function parseLocalDate(dateString) {
  const [year = 0, month = 1, day = 1] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day);
}
function formatDateToYYYYMMDD(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
function formatDateForDisplay(date, options = {
  year: "numeric",
  month: "long",
  day: "numeric"
}) {
  const dateObj = typeof date === "string" ? parseLocalDate(date) : date;
  return dateObj.toLocaleDateString("en-US", options);
}
function formatMonthYear(date) {
  return formatDateForDisplay(date, {
    year: "numeric",
    month: "long"
  });
}
function getWeekDates(dateString) {
  const parts = dateString.split("-").map(Number);
  const year = parts[0] ?? 0;
  const month = parts[1] ?? 1;
  const day = parts[2] ?? 1;
  const selectedDate = new Date(year, month - 1, day);
  const dayOfWeek = selectedDate.getDay();
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const weekDates = [];
  for (let i = 0; i < 7; i++) {
    const weekDate = new Date(year, month - 1, day + mondayOffset + i);
    weekDates.push(formatDateToYYYYMMDD(weekDate));
  }
  return weekDates;
}
function formatWeekRange(dateString) {
  const weekDates = getWeekDates(dateString);
  const firstDate = weekDates[0];
  const lastDate = weekDates[6];
  if (!firstDate || !lastDate) {
    return "";
  }
  const startDate = parseLocalDate(firstDate);
  const endDate = parseLocalDate(lastDate);
  const startFormatted = startDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric"
  });
  const endFormatted = endDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
  return `${startFormatted} - ${endFormatted}`;
}

function getAbsoluteUrl(relativeUrl) {
  if (!relativeUrl) return "";
  if (relativeUrl.startsWith("http://") || relativeUrl.startsWith("https://")) {
    return relativeUrl;
  }
  if (typeof window !== "undefined") {
    return `${window.location.protocol}//${window.location.host}${relativeUrl}`;
  }
  return relativeUrl;
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

reactExports.createContext(void 0);

const getApiBaseUrl = () => {
  {
    return "";
  }
};
const API_BASE_URL$3 = getApiBaseUrl();
const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL$3}/api/auth/login`,
    ME: `${API_BASE_URL$3}/api/auth/me`,
    LOGOUT: `${API_BASE_URL$3}/api/auth/logout`
  },
  HEALTH: `${API_BASE_URL$3}/api/health`
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

async function fetchIndustryConfig(industry) {
  try {
    switch (industry) {
      case "mobile-detailing": {
        const { loadMobileDetailingConfig } = await __vitePreload(async () => { const { loadMobileDetailingConfig } = await import('./index-D59D2CiF.js');return { loadMobileDetailingConfig }},true?__vite__mapDeps([0,1,2,3,4,5]):void 0);
        return loadMobileDetailingConfig();
      }
      case "pet-grooming": {
        const { loadPetGroomingConfig } = await __vitePreload(async () => { const { loadPetGroomingConfig } = await import('./index-CRBJDcLP.js');return { loadPetGroomingConfig }},true?__vite__mapDeps([6,3,4,5]):void 0);
        return await loadPetGroomingConfig();
      }
      case "maid-service": {
        const { loadMaidServiceConfig } = await __vitePreload(async () => { const { loadMaidServiceConfig } = await import('./index-to5g6MKS.js');return { loadMaidServiceConfig }},true?__vite__mapDeps([7,3,4,5]):void 0);
        return await loadMaidServiceConfig();
      }
      case "lawncare": {
        const { loadLawncareConfig } = await __vitePreload(async () => { const { loadLawncareConfig } = await import('./index-Co7RayUv.js');return { loadLawncareConfig }},true?__vite__mapDeps([8,3,4,5]):void 0);
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

const API_BASE_URL$2 = env.VITE_API_URL || "";
async function fetchTenantBySlug(slug) {
  try {
    const response = await fetch(`${API_BASE_URL$2}/api/tenants/${slug}`);
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
  const response = await fetch(`${API_BASE_URL$2}/api/tenants/${slug}`);
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

const useMetaTags = (options = {}) => {
  const { siteData } = useIndustrySiteData();
  const { businessName } = useData();
  const {
    title: customTitle,
    description: customDescription,
    keywords: customKeywords,
    ogImage: customOgImage,
    twitterImage: customTwitterImage,
    canonicalPath: customCanonicalPath
  } = options;
  reactExports.useEffect(() => {
    if (!siteData) return;
    const pageTitle = customTitle || businessName || siteData.seo.title;
    const description = customDescription || siteData.seo.description;
    const keywords = customKeywords || siteData.seo.keywords;
    const ogImage = customOgImage || siteData.seo.ogImage;
    const twitterImage = customTwitterImage || siteData.seo.twitterImage || ogImage;
    const canonicalPath = customCanonicalPath || siteData.seo.canonicalPath;
    updateMetaTag("meta-desc", "content", description);
    if (keywords && keywords.length > 0) {
      updateMetaTag("meta-keywords", "content", keywords.join(", "));
    }
    updateMetaTag("og-title", "content", pageTitle);
    updateMetaTag("og-desc", "content", description);
    if (ogImage) {
      const absoluteImageUrl = getAbsoluteUrl(ogImage);
      updateMetaTag("og-image", "content", absoluteImageUrl);
    }
    updateMetaTag("tw-title", "content", pageTitle);
    updateMetaTag("tw-desc", "content", description);
    if (twitterImage) {
      const absoluteImageUrl = getAbsoluteUrl(twitterImage);
      updateMetaTag("tw-image", "content", absoluteImageUrl);
    }
    if (canonicalPath) {
      const canonicalElement = document.getElementById("canonical-link");
      if (canonicalElement) {
        const domain = window.location.host;
        canonicalElement.setAttribute("href", `https://${domain}${canonicalPath}`);
      }
    }
  }, [
    siteData,
    businessName,
    customTitle,
    customDescription,
    customKeywords,
    customOgImage,
    customTwitterImage,
    customCanonicalPath
  ]);
  return {
    title: customTitle || businessName || siteData?.seo.title,
    description: customDescription || siteData?.seo.description,
    keywords: customKeywords || siteData?.seo.keywords
  };
};
function updateMetaTag(elementId, attribute, value) {
  const element = document.getElementById(elementId);
  if (element) {
    element.setAttribute(attribute, value);
  }
}

const useSEO = (options = {}) => {
  const {
    title,
    favicon,
    description,
    keywords,
    ogImage,
    twitterImage,
    canonicalPath,
    skipBrowserTab = false,
    skipMetaTags = false
  } = options;
  const browserTab = useBrowserTab(
    skipBrowserTab ? { useBusinessName: false } : { title, favicon }
  );
  const metaTags = useMetaTags(
    skipMetaTags ? {} : {
      title,
      description,
      keywords,
      ogImage,
      twitterImage,
      canonicalPath
    }
  );
  return {
    ...browserTab,
    ...metaTags
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

let RefreshTokenGuard$1 = class RefreshTokenGuard {
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
};
let ApiClient$1 = class ApiClient {
  refreshGuard = new RefreshTokenGuard$1();
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
};
const apiClient$1 = new ApiClient$1(config.apiUrl);

async function fetchTenantConfigBySlug(slug) {
  const response = await apiClient$1.get(`/api/tenants/${slug}`);
  const { data } = response;
  if (!data || !data.business_name) {
    throw new Error(`Tenant not found: ${slug}`);
  }
  const { affiliateToTenantConfig } = await __vitePreload(async () => { const { affiliateToTenantConfig } = await Promise.resolve().then(() => tenantConfigMigration);return { affiliateToTenantConfig }},true?void 0:void 0);
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
  const response = await apiClient$1.get(`/api/tenants/id/${tenantId}`);
  const { data } = response;
  if (!data || !data.business_name) {
    throw new Error(`Tenant not found: ${tenantId}`);
  }
  const { affiliateToTenantConfig } = await __vitePreload(async () => { const { affiliateToTenantConfig } = await Promise.resolve().then(() => tenantConfigMigration);return { affiliateToTenantConfig }},true?void 0:void 0);
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

const API_BASE_URL$1 = "/api/reviews";
const reviewsApi = {
  // Get reviews with filtering
  getReviews: async (params = {}) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== void 0 && value !== "") {
        searchParams.append(key, String(value));
      }
    });
    const response = await fetch(`${API_BASE_URL$1}?${searchParams.toString()}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch reviews: ${response.statusText}`);
    }
    return response.json();
  },
  // Get a specific review by ID
  getReview: async (id) => {
    const response = await fetch(`${API_BASE_URL$1}/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch review: ${response.statusText}`);
    }
    return response.json();
  },
  // Submit a new review
  submitReview: async (reviewData) => {
    const response = await fetch(API_BASE_URL$1, {
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

const WebsiteContentContext$1 = reactExports.createContext(null);
const WebsiteContentProvider$1 = ({ children }) => {
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
  return /* @__PURE__ */ jsxRuntimeExports.jsx(WebsiteContentContext$1.Provider, { value: contextValue, children });
};
const useWebsiteContent$1 = () => {
  const context = reactExports.useContext(WebsiteContentContext$1);
  if (!context) {
    throw new Error("useWebsiteContent must be used within a WebsiteContentProvider");
  }
  return context;
};

const useReviewsContent = (props) => {
  const { siteData } = useIndustrySiteData();
  const { content: websiteContent } = useWebsiteContent$1();
  const title = props?.customHeading || websiteContent?.reviews_title || (siteData?.reviews?.title ?? "Customer Reviews");
  const subtitle = props?.customIntro || websiteContent?.reviews_subtitle || (siteData?.reviews?.subtitle ?? "What our customers say");
  return {
    title,
    subtitle
  };
};

const useReviewsRating = () => {
  const data = useDataOptional();
  const { content: websiteContent } = useWebsiteContent$1();
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

const AnalyticsTab = () => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gray-800 rounded-lg shadow-sm border border-gray-700", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-6 py-4 border-b border-gray-700", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-lg font-semibold text-white flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(BarChart3, { className: "w-5 h-5 text-blue-400" }),
        "Analytics Dashboard"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "secondary",
          size: "sm",
          className: "flex items-center gap-2 px-3 py-1.5 bg-gray-600 hover:bg-gray-700 text-white rounded-md",
          leftIcon: /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "w-4 h-4" }),
          children: "Export Report"
        }
      ) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center text-gray-300", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(BarChart3, { className: "w-16 h-16 mx-auto mb-4 text-gray-600" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold mb-2", children: "Analytics Coming Soon" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "This section will provide comprehensive analytics and reporting capabilities." })
    ] }) })
  ] }) });
};

const seedReviews = async (reviews, signal) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No authentication token found");
  }
  const response = await fetch("/api/admin/seed-reviews", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ reviews }),
    signal
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Server error: ${String(response.status)} - ${errorText}`);
  }
  return await response.json();
};
const uploadReviewerAvatar = async (avatarFile, reviewerName, reviewId) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No authentication token found");
  }
  const formData = new FormData();
  formData.append("avatar", avatarFile);
  formData.append("reviewerName", reviewerName);
  formData.append("reviewId", reviewId);
  const response = await fetch("/api/avatar/upload", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`
    },
    body: formData
  });
  if (!response.ok) {
    throw new Error("Avatar upload failed");
  }
  return await response.json();
};

const useSeedReview = () => {
  const [isSubmitting, setIsSubmitting] = reactExports.useState(false);
  const [submitStatus, setSubmitStatus] = reactExports.useState("idle");
  const [submitMessage, setSubmitMessage] = reactExports.useState("");
  const submitReview = async (formData) => {
    if (!formData.name || !formData.title || !formData.content) {
      setSubmitMessage("Please fill in all required fields");
      setSubmitStatus("error");
      return false;
    }
    if (formData.type === "affiliate" && !formData.businessSlug) {
      setSubmitMessage("Please select a business for affiliate reviews");
      setSubmitStatus("error");
      return false;
    }
    setIsSubmitting(true);
    setSubmitStatus("idle");
    setSubmitMessage("Sending request...");
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
      }, 1e4);
      const result = await seedReviews([formData], controller.signal);
      clearTimeout(timeoutId);
      if (result.errorDetails && result.errorDetails.length > 0) {
        console.error("Review creation errors:", result.errorDetails);
      }
      if (formData.avatarFile && result.count && result.count > 0) {
        setSubmitMessage("Review created! Uploading avatar...");
        try {
          await uploadReviewerAvatar(
            formData.avatarFile,
            formData.name,
            result.reviewIds?.[0] ?? "1"
          );
          setSubmitMessage(`Successfully added review with avatar: "${formData.title}"`);
          setSubmitStatus("success");
        } catch (avatarError) {
          console.warn("Avatar upload error:", avatarError);
          setSubmitMessage(`Review created (avatar upload failed): "${formData.title}"`);
          setSubmitStatus("success");
        }
      } else {
        setSubmitMessage(`Successfully added review: "${formData.title}"`);
        setSubmitStatus("success");
      }
      return true;
    } catch (error) {
      console.error("Submit error:", error);
      setSubmitStatus("error");
      if (error instanceof Error && error.name === "AbortError") {
        setSubmitMessage(
          "Request timed out after 10 seconds. Please check if the backend server is running."
        );
      } else {
        setSubmitMessage(error instanceof Error ? error.message : "Failed to seed review");
      }
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };
  const resetStatus = () => {
    setSubmitStatus("idle");
    setSubmitMessage("");
  };
  return {
    isSubmitting,
    submitStatus,
    submitMessage,
    submitReview,
    resetStatus
  };
};

const ReviewsTab = () => {
  const [formData, setFormData] = reactExports.useState({
    name: "",
    stars: 5,
    title: "",
    content: "",
    type: "mdh",
    businessSlug: "",
    source: "website",
    daysAgo: 0,
    weeksAgo: 0,
    specificDate: "",
    serviceCategory: "none",
    reviewerUrl: ""
  });
  const { isSubmitting, submitStatus, submitMessage, submitReview } = useSeedReview();
  const businessSlugs = [
    { value: "jps", label: "JP's Mobile Detailing" },
    { value: "premium-auto-spa", label: "Premium Auto Spa" },
    { value: "elite-mobile-detail", label: "Elite Mobile Detail" },
    { value: "quick-clean-mobile", label: "Quick Clean Mobile" }
  ];
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };
  const handleSubmitReview = async () => {
    const success = await submitReview(formData);
    if (success) {
      setFormData({
        name: "",
        stars: 5,
        title: "",
        content: "",
        type: "mdh",
        businessSlug: "",
        source: "website",
        daysAgo: 0,
        weeksAgo: 0,
        specificDate: "",
        serviceCategory: "none",
        reviewerUrl: ""
      });
    }
  };
  const renderStars = (rating, interactive = false) => {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex space-x-1", children: [1, 2, 3, 4, 5].map((star) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      Star,
      {
        className: `w-5 h-5 ${star <= rating ? "text-yellow-400 fill-current" : "text-gray-300"} ${interactive ? "cursor-pointer hover:text-yellow-300" : ""}`,
        onClick: () => {
          if (interactive) handleInputChange("stars", star);
        }
      },
      star
    )) });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-blue-900 rounded-lg p-6 border border-blue-700", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-xl font-semibold text-white mb-4 flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "w-5 h-5 text-yellow-400" }),
        "Google Reviews Integration"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-blue-200 mb-4", children: "Connect your Google Business Profile to automatically fetch and display reviews on your website." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "a",
        {
          href: "http://localhost:3001/api/google/auth",
          className: "inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "w-4 h-4" }),
            "Connect Google Reviews"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-blue-300 mt-2", children: "This will open Google's authorization screen to connect your business profile." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gray-800 rounded-lg p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-semibold text-white mb-4", children: "Seed Reviews" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-300 mb-6", children: "Add reviews to the system. Just fill in the 4 required fields and the rest will be handled automatically." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 mb-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "reviewer-name", className: "block text-sm font-medium text-gray-300 mb-2", children: "Reviewer Name *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              id: "reviewer-name",
              type: "text",
              value: formData.name,
              onChange: (e) => {
                handleInputChange("name", e.target.value);
              },
              className: "w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500",
              placeholder: "e.g., John Smith"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "rating", className: "block text-sm font-medium text-gray-300 mb-2", children: "Rating *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { id: "rating", children: renderStars(formData.stars, true) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:col-span-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "review-title", className: "block text-sm font-medium text-gray-300 mb-2", children: "Review Title *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              id: "review-title",
              type: "text",
              value: formData.title,
              onChange: (e) => {
                handleInputChange("title", e.target.value);
              },
              className: "w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500",
              placeholder: "e.g., Amazing service!"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:col-span-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "review-content", className: "block text-sm font-medium text-gray-300 mb-2", children: "Review Content *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "textarea",
            {
              id: "review-content",
              value: formData.content,
              onChange: (e) => {
                handleInputChange("content", e.target.value);
              },
              rows: 3,
              className: "w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500",
              placeholder: "Write your review here..."
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "review-type", className: "block text-sm font-medium text-gray-300 mb-2", children: "Review Type" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "select",
            {
              id: "review-type",
              value: formData.type,
              onChange: (e) => {
                handleInputChange("type", e.target.value);
              },
              className: "w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "mdh", children: "MDH Site Review" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "affiliate", children: "Affiliate Review" })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { htmlFor: "business-slug", className: "block text-sm font-medium text-gray-300 mb-2", children: [
            "Business ",
            formData.type === "affiliate" && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-400", children: "*" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "select",
            {
              id: "business-slug",
              value: formData.businessSlug,
              onChange: (e) => {
                handleInputChange("businessSlug", e.target.value);
              },
              className: `w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${formData.type === "affiliate" ? "" : "opacity-50 cursor-not-allowed"}`,
              disabled: formData.type !== "affiliate",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: formData.type === "affiliate" ? "Select a business" : "N/A for MDH reviews" }),
                businessSlugs.map((business) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: business.value, children: business.label }, business.value))
              ]
            }
          ),
          formData.type !== "affiliate" && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-400 mt-1", children: "Business selection only applies to affiliate reviews" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "review-source", className: "block text-sm font-medium text-gray-300 mb-2", children: "Review Source" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "select",
            {
              id: "review-source",
              value: formData.source,
              onChange: (e) => {
                handleInputChange("source", e.target.value);
              },
              className: "w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "website", children: "Website" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "google", children: "Google" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "yelp", children: "Yelp" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "facebook", children: "Facebook" })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "days-ago", className: "block text-sm font-medium text-gray-300 mb-2", children: "Days Ago (0-6 for recent reviews)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              id: "days-ago",
              type: "number",
              min: "0",
              max: "6",
              value: formData.daysAgo,
              onChange: (e) => {
                const days = parseInt(e.target.value) || 0;
                handleInputChange("daysAgo", days);
                if (days > 0) {
                  handleInputChange("weeksAgo", 0);
                }
              },
              className: "w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500",
              placeholder: "0"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "weeks-ago", className: "block text-sm font-medium text-gray-300 mb-2", children: "Weeks Ago (1+ for older reviews)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              id: "weeks-ago",
              type: "number",
              min: "0",
              max: "52",
              value: formData.weeksAgo,
              onChange: (e) => {
                const weeks = parseInt(e.target.value) || 0;
                handleInputChange("weeksAgo", weeks);
                if (weeks > 0) {
                  handleInputChange("daysAgo", 0);
                  handleInputChange("specificDate", "");
                }
              },
              className: "w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500",
              placeholder: "0"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "specific-date", className: "block text-sm font-medium text-gray-300 mb-2", children: "Specific Date (for reviews older than 52 weeks)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              id: "specific-date",
              type: "date",
              value: formData.specificDate,
              onChange: (e) => {
                handleInputChange("specificDate", e.target.value);
                if (e.target.value) {
                  handleInputChange("daysAgo", 0);
                  handleInputChange("weeksAgo", 0);
                }
              },
              className: "w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-400 mt-1", children: "Use this for reviews older than 52 weeks (Google switches to date mode)" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "service-category", className: "block text-sm font-medium text-gray-300 mb-2", children: "Service Category" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "select",
            {
              id: "service-category",
              value: formData.serviceCategory,
              onChange: (e) => {
                handleInputChange("serviceCategory", e.target.value);
              },
              className: "w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "none", children: "None" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "car", children: "Car" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "truck", children: "Truck" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "boat", children: "Boat" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "rv", children: "RV" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "motorcycle", children: "Motorcycle" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "ceramic", children: "Ceramic" })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "avatar-file", className: "block text-sm font-medium text-gray-300 mb-2", children: "Avatar Image (Optional)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              id: "avatar-file",
              type: "file",
              accept: "image/*",
              onChange: (e) => {
                const file = e.target.files?.[0];
                if (file) {
                  if (file.size > 5 * 1024 * 1024) {
                    alert("Avatar file must be less than 5MB");
                    e.target.value = "";
                    return;
                  }
                  handleInputChange("avatarFile", file);
                }
              },
              className: "w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-600 file:text-white hover:file:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            }
          ),
          formData.avatarFile && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 text-sm text-gray-400", children: [
            "Selected: ",
            formData.avatarFile.name,
            " (",
            (formData.avatarFile.size / 1024 / 1024).toFixed(2),
            " MB)"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "reviewer-url", className: "block text-sm font-medium text-gray-300 mb-2", children: "Reviewer Profile URL (Optional)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              id: "reviewer-url",
              type: "url",
              value: formData.reviewerUrl,
              onChange: (e) => {
                handleInputChange("reviewerUrl", e.target.value);
              },
              className: "w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500",
              placeholder: "e.g., https://www.google.com/maps/contrib/123456789"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-400 mt-1", children: "Link to reviewer’s profile page (Google, Yelp, etc.)" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex space-x-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => {
            void handleSubmitReview();
          },
          disabled: isSubmitting,
          className: "flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed",
          children: isSubmitting ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" }),
            "Saving..."
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CheckCircle, { className: "w-4 h-4" }),
            "Save Review"
          ] })
        }
      ) }),
      submitMessage && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `mt-4 p-3 rounded-md flex items-center gap-2 ${submitStatus === "success" ? "bg-green-900 text-green-300" : "bg-red-900 text-red-300"}`, children: [
        submitStatus === "success" ? /* @__PURE__ */ jsxRuntimeExports.jsx(CheckCircle, { className: "w-4 h-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(AlertCircle, { className: "w-4 h-4" }),
        submitMessage
      ] })
    ] })
  ] });
};

const SettingsTab = () => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gray-800 rounded-lg shadow-sm border border-gray-700", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-6 py-4 border-b border-gray-700", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-lg font-semibold text-white flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { className: "w-5 h-5 text-blue-400" }),
        "System Settings"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "primary",
          size: "sm",
          className: "flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md",
          leftIcon: /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "w-4 h-4" }),
          children: "Save Changes"
        }
      )
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center text-gray-300", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { className: "w-16 h-16 mx-auto mb-4 text-gray-600" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold mb-2", children: "Settings Coming Soon" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "This section will allow you to configure system settings and preferences." })
    ] }) })
  ] }) });
};

const ApplicationModal = ({
  isOpen,
  onClose,
  onSubmit,
  type,
  businessName,
  isLoading = false
}) => {
  const [formData, setFormData] = reactExports.useState({
    slug: "",
    reason: "",
    notes: ""
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    if (type === "approve" && formData.slug) {
      if (formData.slug.length < 3) {
        alert("Slug must be at least 3 characters long");
        return;
      }
      if (formData.slug.length > 50) {
        alert("Slug must be less than 50 characters long");
        return;
      }
      if (!/^[a-z0-9-]+$/.test(formData.slug)) {
        alert("Slug must contain only lowercase letters, numbers, and hyphens");
        return;
      }
      if (formData.slug.startsWith("-") || formData.slug.endsWith("-")) {
        alert("Slug cannot start or end with a hyphen");
        return;
      }
      if (formData.slug.includes("--")) {
        alert("Slug cannot contain consecutive hyphens");
        return;
      }
    }
    if (type === "reject" && formData.reason) {
      if (formData.reason.trim().length < 10) {
        alert("Rejection reason must be at least 10 characters long");
        return;
      }
      if (formData.reason.trim().length > 500) {
        alert("Rejection reason must be less than 500 characters long");
        return;
      }
    }
    if (formData.notes && formData.notes.trim().length > 1e3) {
      alert("Admin notes must be less than 1000 characters long");
      return;
    }
    void onSubmit(formData);
    setFormData({ slug: "", reason: "", notes: "" });
  };
  const handleClose = () => {
    setFormData({ slug: "", reason: "", notes: "" });
    onClose();
  };
  if (!isOpen) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        type === "approve" ? /* @__PURE__ */ jsxRuntimeExports.jsx(CheckCircle, { className: "w-6 h-6 text-green-400" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(XCircle, { className: "w-6 h-6 text-red-400" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-lg font-semibold text-white", children: [
          type === "approve" ? "Approve" : "Reject",
          " Application"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          onClick: handleClose,
          variant: "ghost",
          size: "sm",
          className: "text-gray-400 hover:text-white p-1",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-5 h-5" })
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-gray-300 text-sm", children: [
      type === "approve" ? "Approving" : "Rejecting",
      " application for",
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-white", children: businessName })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
      type === "approve" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "slug", className: "block text-sm font-medium text-gray-300 mb-2", children: "Approved Slug *" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "text",
            id: "slug",
            value: formData.slug,
            onChange: (e) => {
              setFormData({ ...formData, slug: e.target.value });
            },
            className: "w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
            placeholder: "e.g., my-business-name",
            required: true
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-400 mt-1", children: "This will be the URL slug for the affiliate’s business page" })
      ] }),
      type === "reject" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "reason", className: "block text-sm font-medium text-gray-300 mb-2", children: "Rejection Reason *" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "textarea",
          {
            id: "reason",
            value: formData.reason,
            onChange: (e) => {
              setFormData({ ...formData, reason: e.target.value });
            },
            className: "w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
            placeholder: "Please provide a reason for rejection...",
            rows: 3,
            required: true
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "notes", className: "block text-sm font-medium text-gray-300 mb-2", children: "Admin Notes" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "textarea",
          {
            id: "notes",
            value: formData.notes,
            onChange: (e) => {
              setFormData({ ...formData, notes: e.target.value });
            },
            className: "w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
            placeholder: "Additional notes (optional)...",
            rows: 3
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 pt-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "button",
            onClick: handleClose,
            variant: "secondary",
            size: "md",
            className: "flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700",
            disabled: isLoading,
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "submit",
            variant: type === "approve" ? "primary" : "destructive",
            size: "md",
            className: `flex-1 px-4 py-2 ${type === "approve" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}`,
            loading: isLoading,
            disabled: isLoading,
            children: type === "approve" ? "Approve" : "Reject"
          }
        )
      ] })
    ] })
  ] }) });
};

const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  itemName,
  isLoading = false,
  isTenant = false
}) => {
  if (!isOpen) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertTriangle, { className: "w-6 h-6 text-red-400" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold text-white", children: title })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          onClick: onClose,
          variant: "ghost",
          size: "sm",
          className: "text-gray-400 hover:text-white",
          disabled: isLoading,
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-4 h-4" })
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-300 mb-4", children: message }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-gray-700 rounded-lg p-3 mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white font-medium", children: itemName }) }),
      isTenant && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-red-900/20 border border-red-700 rounded-lg p-4 mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-red-200 text-sm font-medium mb-2", children: "⚠️ This will permanently delete:" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "text-red-300 text-xs space-y-1 ml-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• Tenant business record" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• User account" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• All reviews" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• Website content" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• Images and gallery" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• Services and pricing" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• Bookings and quotes" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• Schedule and appointments" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• Subscriptions" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• Health monitoring data" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-red-400 text-sm font-medium", children: "This action cannot be undone!" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          onClick: onClose,
          variant: "secondary",
          className: "flex-1",
          disabled: isLoading,
          children: "Cancel"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          onClick: onConfirm,
          variant: "destructive",
          className: "flex-1 bg-red-600 hover:bg-red-700",
          disabled: isLoading,
          children: isLoading ? "Deleting..." : "Delete"
        }
      )
    ] })
  ] }) });
};

const Toast = ({
  message,
  type,
  isVisible,
  onClose,
  duration = 5e3
}) => {
  reactExports.useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [isVisible, duration, onClose]);
  if (!isVisible) return null;
  const bgColor = type === "success" ? "bg-green-600" : "bg-red-600";
  const Icon = type === "success" ? CheckCircle : XCircle;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `fixed top-4 right-4 z-50 ${bgColor} text-white px-6 py-4 rounded-lg shadow-lg max-w-sm`, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "w-5 h-5" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-1", children: message }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        onClick: onClose,
        className: "text-white hover:text-gray-200 transition-colors",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-4 h-4" })
      }
    )
  ] }) });
};

const API_BASE_URL = "";
class ApiService {
  async makeRequest(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const defaultOptions = {
      headers: {
        "Content-Type": "application/json"
      },
      ...options
    };
    try {
      const response = await fetch(url, defaultOptions);
      const data = await response.json();
      if (!response.ok) {
        const errorMessage = data.message || data.error || "Network response was not ok";
        throw new Error(errorMessage);
      }
      return data;
    } catch (error) {
      console.error("API request failed:", error);
      throw new Error(error instanceof Error ? error.message : "An error occurred");
    }
  }
  async submitQuoteRequest(data) {
    return this.makeRequest("/api/quote", {
      method: "POST",
      body: JSON.stringify(data)
    });
  }
  async checkHealth() {
    return this.makeRequest("/api/health");
  }
  async login(email, password) {
    const url = "/api/auth/login";
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
      }, 1e4);
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      const data = await response.json();
      if (!response.ok) {
        if (response.status === 429) {
          const error = new Error(data.error || "Rate limited");
          error.code = "RATE_LIMITED";
          error.retryAfterSeconds = data.retryAfterSeconds;
          error.remainingAttempts = data.remainingAttempts;
          error.resetTime = data.resetTime;
          throw error;
        }
        if (response.status === 401) {
          const error = new Error(data.error || "Invalid credentials");
          error.code = "INVALID_CREDENTIALS";
          throw error;
        }
        if (response.status === 403) {
          const error = new Error(data.error || "Access denied");
          error.code = "FORBIDDEN";
          throw error;
        }
        const errorMessage = data.message || data.error || "Login failed";
        throw new Error(errorMessage);
      }
      return data;
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        const timeoutError = new Error("Login request timed out. Please check your connection and try again.");
        timeoutError.code = "TIMEOUT";
        throw timeoutError;
      }
      if (error instanceof TypeError && error.message.includes("fetch")) {
        const networkError = new Error("Network error. Please check your connection and try again.");
        networkError.code = "NETWORK_ERROR";
        throw networkError;
      }
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(error instanceof Error ? error.message : "Login failed");
    }
  }
  async register(email, password, name, phone) {
    const url = "/api/auth/register";
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password, name, phone })
      });
      const data = await response.json();
      if (!response.ok) {
        if (response.status === 429) {
          const error = new Error(data.error || "Rate limited");
          error.code = "RATE_LIMITED";
          error.retryAfterSeconds = data.retryAfterSeconds;
          error.remainingAttempts = data.remainingAttempts;
          error.resetTime = data.resetTime;
          throw error;
        }
        if (response.status === 400) {
          const errorMessage2 = data.message || data.error || "Registration failed";
          const error = new Error(errorMessage2);
          error.code = "VALIDATION_ERROR";
          throw error;
        }
        const errorMessage = data.message || data.error || "Registration failed";
        throw new Error(errorMessage);
      }
      return data;
    } catch (error) {
      console.error("Registration failed:", error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(error instanceof Error ? error.message : "Registration failed");
    }
  }
  async getUsers(status) {
    const endpoint = status && status !== "all-users" ? `/api/admin/users?status=${status}` : "/api/admin/users";
    const token = localStorage.getItem("token");
    const headers = {
      "Content-Type": "application/json"
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    return this.makeRequest(endpoint, {
      headers
    });
  }
  async getPendingApplications() {
    const url = "/api/admin/pending-applications";
    const token = localStorage.getItem("token");
    try {
      const headers = {
        "Content-Type": "application/json"
      };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
      const response = await fetch(url, {
        headers
      });
      const data = await response.json();
      if (!response.ok) {
        const errorMessage = data.message || "Network response was not ok";
        throw new Error(errorMessage);
      }
      return data;
    } catch (error) {
      console.error("API request failed:", error);
      throw new Error(error instanceof Error ? error.message : "An error occurred");
    }
  }
  async approveApplication(applicationId, approvedSlug, adminNotes, serviceAreas) {
    const url = `/api/admin/approve-application/${applicationId.toString()}`;
    const token = localStorage.getItem("token");
    try {
      const headers = {
        "Content-Type": "application/json"
      };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
      const response = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify({
          approved_slug: approvedSlug,
          admin_notes: adminNotes,
          ...serviceAreas && serviceAreas.length > 0 && { service_areas: serviceAreas }
        })
      });
      const data = await response.json();
      if (!response.ok) {
        const errorMessage = data.message || "Network response was not ok";
        throw new Error(errorMessage);
      }
      return data;
    } catch (error) {
      console.error("API request failed:", error);
      throw new Error(error instanceof Error ? error.message : "An error occurred");
    }
  }
  async rejectApplication(applicationId, rejectionReason, adminNotes) {
    const url = `/api/admin/reject-application/${applicationId.toString()}`;
    const token = localStorage.getItem("token");
    try {
      const headers = {
        "Content-Type": "application/json"
      };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
      const response = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify({
          rejection_reason: rejectionReason,
          admin_notes: adminNotes
        })
      });
      const data = await response.json();
      if (!response.ok) {
        const errorMessage = data.message || "Network response was not ok";
        throw new Error(errorMessage);
      }
      return data;
    } catch (error) {
      console.error("API request failed:", error);
      throw new Error(error instanceof Error ? error.message : "An error occurred");
    }
  }
  async deleteAffiliate(affiliateId) {
    const url = `/api/admin/tenants/${affiliateId.toString()}`;
    const token = localStorage.getItem("token");
    try {
      const headers = {
        "Content-Type": "application/json"
      };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
      const response = await fetch(url, {
        method: "DELETE",
        headers
      });
      const data = await response.json();
      if (!response.ok) {
        const errorMessage = data.message || "Network response was not ok";
        throw new Error(errorMessage);
      }
      return data;
    } catch (error) {
      console.error("API request failed:", error);
      throw new Error(error instanceof Error ? error.message : "An error occurred");
    }
  }
}
const apiService = new ApiService();

class TenantEventManager {
  listeners = [];
  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }
  notify() {
    this.listeners.forEach((listener) => {
      listener();
    });
  }
}
const tenantEventManager = new TenantEventManager();

const UsersTab = () => {
  const [activeSubTab, setActiveSubTab] = reactExports.useState("all-users");
  const [users, setUsers] = reactExports.useState([]);
  const [pendingApplications, setPendingApplications] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(false);
  const [error, setError] = reactExports.useState(null);
  const [modalState, setModalState] = reactExports.useState(null);
  const [deleteModalState, setDeleteModalState] = reactExports.useState(null);
  const [processingApplication, setProcessingApplication] = reactExports.useState(false);
  const [toast, setToast] = reactExports.useState(null);
  const [deletingAffiliate, setDeletingAffiliate] = reactExports.useState(null);
  const debounceTimer = reactExports.useRef(null);
  const lastFetchRef = reactExports.useRef(null);
  const subTabs = [
    { id: "all-users", label: "All Users", icon: Users },
    { id: "admin", label: "Admin", icon: UserCog },
    { id: "tenant", label: "Tenants", icon: UserCheck },
    { id: "customer", label: "Customers", icon: UserX },
    { id: "pending", label: "Pending", icon: UserPlus }
  ];
  const fetchUsers = reactExports.useCallback((status, force = false) => {
    const now = Date.now();
    const lastFetch = lastFetchRef.current;
    if (!force && lastFetch && lastFetch.status === status && now - lastFetch.timestamp < 1e3) {
      return;
    }
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    debounceTimer.current = setTimeout(() => {
      void (async () => {
        setLoading(true);
        setError(null);
        lastFetchRef.current = { status, timestamp: now };
        try {
          if (status === "pending") {
            const response = await apiService.getPendingApplications();
            setPendingApplications(response.applications);
          } else {
            const response = await apiService.getUsers(status);
            setUsers(response.users);
          }
        } catch (err) {
          setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
          setLoading(false);
        }
      })();
    }, 200);
  }, []);
  reactExports.useEffect(() => {
    fetchUsers(activeSubTab);
  }, [activeSubTab, fetchUsers]);
  reactExports.useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);
  const handleSubTabChange = (subTab) => {
    setActiveSubTab(subTab);
  };
  const handleApproveApplication = (applicationId, businessName) => {
    const application = pendingApplications.find((app) => app.id === applicationId);
    if (!application) {
      setToast({
        message: "Application not found or already processed",
        type: "error",
        isVisible: true
      });
      return;
    }
    setModalState({
      isOpen: true,
      type: "approve",
      applicationId,
      businessName
    });
  };
  const handleRejectApplication = (applicationId, businessName) => {
    const application = pendingApplications.find((app) => app.id === applicationId);
    if (!application) {
      setToast({
        message: "Application not found or already processed",
        type: "error",
        isVisible: true
      });
      return;
    }
    setModalState({
      isOpen: true,
      type: "reject",
      applicationId,
      businessName
    });
  };
  const handleModalSubmit = async (data) => {
    if (!modalState) return;
    setProcessingApplication(true);
    try {
      let response;
      if (modalState.type === "approve") {
        if (!data.slug) {
          throw new Error("Slug is required for approval");
        }
        response = await apiService.approveApplication(modalState.applicationId, data.slug, data.notes);
      } else {
        if (!data.reason) {
          throw new Error("Rejection reason is required");
        }
        response = await apiService.rejectApplication(modalState.applicationId, data.reason, data.notes);
      }
      if (!response.success) {
        throw new Error(response.message || "Operation failed");
      }
      fetchUsers("pending", true);
      tenantEventManager.notify();
      setModalState(null);
      setToast({
        message: `Application ${modalState.type === "approve" ? "approved" : "rejected"} successfully`,
        type: "success",
        isVisible: true
      });
    } catch (err) {
      console.error(`Error ${modalState.type === "approve" ? "approving" : "rejecting"} application:`, err);
      let errorMessage = "An error occurred";
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === "string") {
        errorMessage = err;
      } else if (err && typeof err === "object" && "message" in err) {
        errorMessage = String(err.message);
      }
      setToast({
        message: errorMessage,
        type: "error",
        isVisible: true
      });
    } finally {
      setProcessingApplication(false);
    }
  };
  const closeModal = () => {
    setModalState(null);
  };
  const handleDeleteClick = (userId, name, isTenant) => {
    setDeleteModalState({
      isOpen: true,
      userId,
      name,
      isTenant
    });
  };
  const handleDeleteConfirm = async () => {
    if (!deleteModalState) return;
    setDeletingAffiliate(deleteModalState.userId);
    try {
      const response = await apiService.deleteAffiliate(deleteModalState.userId);
      if (response.success) {
        setToast({
          message: `"${deleteModalState.name}" deleted successfully. All associated data has been removed.`,
          type: "success",
          isVisible: true
        });
        fetchUsers(activeSubTab, true);
        tenantEventManager.notify();
        setDeleteModalState(null);
      } else {
        throw new Error(response.message || "Failed to delete");
      }
    } catch (err) {
      console.error("Error deleting:", err);
      let errorMessage = "An error occurred";
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === "string") {
        errorMessage = err;
      } else if (err && typeof err === "object" && "message" in err) {
        errorMessage = String(err.message);
      }
      setToast({
        message: errorMessage,
        type: "error",
        isVisible: true
      });
      setDeleteModalState(null);
    } finally {
      setDeletingAffiliate(null);
    }
  };
  const renderSubTabContent = (subTab) => {
    if (loading) {
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center text-gray-300", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Loader2, { className: "w-16 h-16 mx-auto mb-4 text-blue-400 animate-spin" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold mb-2", children: "Loading Users..." })
      ] });
    }
    if (error) {
      if (error.includes("401") || error.includes("Unauthorized") || error.includes("Forbidden")) {
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center text-gray-300", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 mx-auto mb-4 text-yellow-400", children: "🔒" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold mb-2 text-yellow-400", children: "Authentication Required" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-yellow-300", children: "You need to be logged in as an admin to view users." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-400 mt-2", children: "Please log in with an admin account or check your authentication status." })
        ] });
      }
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center text-gray-300", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 mx-auto mb-4 text-red-400", children: "⚠️" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold mb-2 text-red-400", children: "Error" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-red-300", children: error }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => {
              fetchUsers(subTab, true);
            },
            className: "mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors",
            children: "Retry"
          }
        )
      ] });
    }
    if (activeSubTab === "pending") {
      if (pendingApplications.length === 0) {
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center text-gray-300", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(UserPlus, { className: "w-16 h-16 mx-auto mb-4 text-gray-600" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold mb-2", children: "No Pending Applications" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "All affiliate applications have been processed." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => {
                fetchUsers("pending", true);
              },
              className: "mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors",
              children: "Refresh"
            }
          )
        ] });
      }
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-sm text-gray-400 mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            "Showing ",
            pendingApplications.length,
            " pending application",
            pendingApplications.length !== 1 ? "s" : ""
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => {
                fetchUsers("pending", true);
              },
              className: "px-3 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700 transition-colors",
              children: "Refresh"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-4", children: pendingApplications.map((app) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-gray-700 rounded-lg p-4 border border-gray-600", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-medium text-white", children: app.business_name }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-gray-300 text-sm", children: [
              "Owner: ",
              app.owner
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-300 text-sm", children: app.email }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-300 text-sm", children: app.phone }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-gray-400 text-xs mt-2", children: [
              "Location: ",
              app.city,
              ", ",
              app.state_code,
              " ",
              app.postal_code
            ] }),
            app.has_insurance && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-green-400 text-xs mt-2", children: "✓ Has Insurance" }),
            app.source && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-gray-400 text-xs mt-1", children: [
              "Source: ",
              app.source
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-gray-400 text-xs mt-2", children: [
              "Applied: ",
              new Date(app.application_date).toLocaleDateString()
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ml-4 flex flex-col gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => {
                  handleApproveApplication(app.id, app.business_name);
                },
                disabled: processingApplication,
                className: `px-3 py-1.5 text-white text-xs rounded transition-colors ${processingApplication ? "bg-gray-500 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"}`,
                children: processingApplication ? "Processing..." : "Approve"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => {
                  handleRejectApplication(app.id, app.business_name);
                },
                disabled: processingApplication,
                className: `px-3 py-1.5 text-white text-xs rounded transition-colors ${processingApplication ? "bg-gray-500 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"}`,
                children: processingApplication ? "Processing..." : "Reject"
              }
            )
          ] })
        ] }) }, app.id)) })
      ] });
    }
    if (users.length === 0) {
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center text-gray-300", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-16 h-16 mx-auto mb-4 text-gray-600" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold mb-2", children: "No Users Found" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "No users match the current filter criteria." })
      ] });
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-sm text-gray-400 mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          "Showing ",
          users.length,
          " user",
          users.length !== 1 ? "s" : ""
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => {
              fetchUsers(activeSubTab, true);
            },
            className: "px-3 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700 transition-colors",
            children: "Refresh"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-4", children: users.map((user) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-gray-700 rounded-lg p-4 border border-gray-600", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-medium text-white text-lg", children: user.name }),
            user.role && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `px-2 py-1 text-xs font-semibold rounded-full ${user.role === "admin" ? "bg-purple-600 text-purple-100" : user.role === "tenant" ? "bg-green-600 text-green-100" : "bg-blue-600 text-blue-100"}`, children: user.role.toUpperCase() })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-300 text-sm mb-1", children: user.email }),
          user.business_name && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-gray-300 text-sm mb-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-400", children: "Business:" }),
            " ",
            user.business_name
          ] }),
          user.slug && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-gray-400 text-xs", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-500", children: "Slug:" }),
            " ",
            user.slug
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right text-xs text-gray-400", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
              "ID: ",
              user.id
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
              "Created: ",
              new Date(user.created_at).toLocaleDateString()
            ] })
          ] }),
          user.role === "tenant" && user.slug && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "a",
              {
                href: `http://${user.slug}.lvh.me:${window.location.port}/`,
                target: "_blank",
                rel: "noopener noreferrer",
                className: "flex items-center gap-1 px-3 py-1.5 text-white text-xs rounded transition-colors bg-blue-600 hover:bg-blue-700",
                title: "View tenant website",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "w-3 h-3" }),
                  "Website"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "a",
              {
                href: `http://${user.slug}.lvh.me:${window.location.port}/dashboard`,
                target: "_blank",
                rel: "noopener noreferrer",
                className: "flex items-center gap-1 px-3 py-1.5 text-white text-xs rounded transition-colors bg-green-600 hover:bg-green-700",
                title: "View tenant dashboard",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { className: "w-3 h-3" }),
                  "Dashboard"
                ]
              }
            )
          ] }),
          user.role === "tenant" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => {
                handleDeleteClick(user.tenant_id || user.id, user.business_name || user.name, true);
              },
              disabled: deletingAffiliate === (user.tenant_id || user.id),
              className: `flex items-center gap-2 px-3 py-1.5 text-white text-xs rounded transition-colors ${deletingAffiliate === (user.tenant_id || user.id) ? "bg-gray-500 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"}`,
              title: "Delete tenant and all associated data",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3 h-3" }),
                deletingAffiliate === (user.tenant_id || user.id) ? "Deleting..." : "Delete"
              ]
            }
          ),
          (user.role === "customer" || user.role === "admin") && user.id !== 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => {
                handleDeleteClick(user.id, user.name, false);
              },
              disabled: deletingAffiliate === user.id,
              className: `flex items-center gap-2 px-3 py-1.5 text-white text-xs rounded transition-colors ${deletingAffiliate === user.id ? "bg-gray-500 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"}`,
              title: "Delete user",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3 h-3" }),
                deletingAffiliate === user.id ? "Deleting..." : "Delete"
              ]
            }
          )
        ] })
      ] }) }, user.id)) })
    ] });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gray-800 rounded-lg shadow-sm border border-gray-700", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-6 py-4 border-b border-gray-700", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-lg font-semibold text-white flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-5 h-5 text-blue-400" }),
          "User Management"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "primary",
            size: "sm",
            className: "flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700",
            leftIcon: /* @__PURE__ */ jsxRuntimeExports.jsx(UserPlus, { className: "w-4 h-4" }),
            children: "Add User"
          }
        )
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-6 py-3 border-b border-gray-700", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "flex space-x-6", children: subTabs.map((subTab) => {
          const Icon = subTab.icon;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => {
                handleSubTabChange(subTab.id);
              },
              className: `flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${activeSubTab === subTab.id ? "bg-blue-900 text-blue-300 border-b-2 border-blue-400" : "text-gray-300 hover:text-white hover:bg-gray-700"}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "w-4 h-4" }),
                subTab.label
              ]
            },
            subTab.id
          );
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "a",
          {
            href: "/tenant-onboarding",
            target: "_blank",
            rel: "noopener noreferrer",
            className: "flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-md transition-colors",
            title: "Open tenant onboarding form",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }),
              "New Tenant"
            ]
          }
        )
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-6", children: renderSubTabContent(activeSubTab) })
    ] }),
    modalState && /* @__PURE__ */ jsxRuntimeExports.jsx(
      ApplicationModal,
      {
        isOpen: modalState.isOpen,
        onClose: closeModal,
        onSubmit: handleModalSubmit,
        type: modalState.type,
        applicationId: modalState.applicationId,
        businessName: modalState.businessName,
        isLoading: processingApplication
      }
    ),
    deleteModalState && /* @__PURE__ */ jsxRuntimeExports.jsx(
      DeleteConfirmationModal,
      {
        isOpen: deleteModalState.isOpen,
        onClose: () => {
          setDeleteModalState(null);
        },
        onConfirm: () => {
          void handleDeleteConfirm();
        },
        title: deleteModalState.isTenant ? "Delete Tenant" : "Delete User",
        message: deleteModalState.isTenant ? `Are you sure you want to delete this tenant and all associated data?` : `Are you sure you want to delete this user account?`,
        itemName: deleteModalState.name,
        isLoading: deletingAffiliate === deleteModalState.userId,
        isTenant: deleteModalState.isTenant
      }
    ),
    toast && /* @__PURE__ */ jsxRuntimeExports.jsx(
      Toast,
      {
        message: toast.message,
        type: toast.type,
        isVisible: toast.isVisible,
        onClose: () => {
          setToast(null);
        }
      }
    )
  ] });
};

const TabContent$1 = ({ activeTab }) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { children: [
    activeTab === "users" && /* @__PURE__ */ jsxRuntimeExports.jsx(UsersTab, {}),
    activeTab === "reviews" && /* @__PURE__ */ jsxRuntimeExports.jsx(ReviewsTab, {}),
    activeTab === "analytics" && /* @__PURE__ */ jsxRuntimeExports.jsx(AnalyticsTab, {}),
    activeTab === "settings" && /* @__PURE__ */ jsxRuntimeExports.jsx(SettingsTab, {})
  ] });
};

const DashboardPage$1 = () => {
  const [activeTab, setActiveTab] = reactExports.useState("users");
  useBrowserTab({
    title: "Admin Dashboard - That Smart Site",
    useBusinessName: false
  });
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AdminLayout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      AdminTabs,
      {
        activeTab,
        onTabChange: handleTabChange
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      TabContent$1,
      {
        activeTab
      }
    )
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
          const module = await __variableDynamicImportRuntimeHelper((/* #__PURE__ */ Object.assign({"../../data/mobile-detailing/faq/aftercare.json": () => __vitePreload(() => import('./aftercare-ZKXYZUbn.js'),true?[]:void 0),"../../data/mobile-detailing/faq/general.json": () => __vitePreload(() => import('./general-BhqPoWqx.js'),true?[]:void 0),"../../data/mobile-detailing/faq/locations.json": () => __vitePreload(() => import('./locations-D5I2ap43.js'),true?[]:void 0),"../../data/mobile-detailing/faq/payments.json": () => __vitePreload(() => import('./payments-CrPeLMHg.js'),true?[]:void 0),"../../data/mobile-detailing/faq/preparation.json": () => __vitePreload(() => import('./preparation-Btp8GDff.js'),true?[]:void 0),"../../data/mobile-detailing/faq/pricing.json": () => __vitePreload(() => import('./pricing-Bzt245QG.js'),true?[]:void 0),"../../data/mobile-detailing/faq/scheduling.json": () => __vitePreload(() => import('./scheduling-Cx-yGBz2.js'),true?[]:void 0),"../../data/mobile-detailing/faq/services.json": () => __vitePreload(() => import('./services-BqnJbWY7.js'),true?[]:void 0),"../../data/mobile-detailing/faq/warranty.json": () => __vitePreload(() => import('./warranty-CGuBowID.js'),true?[]:void 0)})), `../../data/${industry}/faq/${category}.json`, 6);
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
  const { content: websiteContent } = useWebsiteContent$1();
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
  const { content: websiteContent } = useWebsiteContent$1();
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

const BeforeAfterSlider = ({
  beforeImage,
  afterImage,
  beforeLabel = "BEFORE",
  afterLabel = "AFTER",
  className = ""
}) => {
  const [sliderPosition, setSliderPosition] = reactExports.useState(50);
  const [isDragging, setIsDragging] = reactExports.useState(false);
  const containerRef = reactExports.useRef(null);
  const handleMouseMove = (e) => {
    if (!isDragging || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width * 100;
    setSliderPosition(Math.max(0, Math.min(100, percentage)));
  };
  const handleMouseDown = () => {
    setIsDragging(true);
  };
  const handleMouseUp = () => {
    setIsDragging(false);
  };
  const handleTouchMove = (e) => {
    if (!containerRef.current || !e.touches[0]) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left;
    const percentage = x / rect.width * 100;
    setSliderPosition(Math.max(0, Math.min(100, percentage)));
  };
  const handleKeyDown = (e) => {
    switch (e.key) {
      case "ArrowLeft":
        e.preventDefault();
        setSliderPosition(Math.max(0, sliderPosition - 1));
        break;
      case "ArrowRight":
        e.preventDefault();
        setSliderPosition(Math.min(100, sliderPosition + 1));
        break;
      case "Home":
        e.preventDefault();
        setSliderPosition(0);
        break;
      case "End":
        e.preventDefault();
        setSliderPosition(100);
        break;
    }
  };
  reactExports.useEffect(() => {
    const handleGlobalMouseUp = () => {
      setIsDragging(false);
    };
    const handleGlobalMouseMove = (e) => {
      if (!isDragging || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = x / rect.width * 100;
      setSliderPosition(Math.max(0, Math.min(100, percentage)));
    };
    if (isDragging) {
      document.addEventListener("mousemove", handleGlobalMouseMove);
      document.addEventListener("mouseup", handleGlobalMouseUp);
    }
    return () => {
      document.removeEventListener("mousemove", handleGlobalMouseMove);
      document.removeEventListener("mouseup", handleGlobalMouseUp);
    };
  }, [isDragging]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `relative w-full aspect-[3/2] rounded-2xl overflow-hidden bg-stone-700 ring-1 ring-white/10 ${className}`, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      ref: containerRef,
      className: "relative w-full h-full cursor-col-resize select-none",
      role: "slider",
      tabIndex: 0,
      "aria-label": "Before and after image slider",
      "aria-valuenow": sliderPosition,
      "aria-valuemin": 0,
      "aria-valuemax": 100,
      "aria-valuetext": `${Math.round(sliderPosition)}% - showing ${sliderPosition < 50 ? "before" : "after"} image`,
      "aria-orientation": "horizontal",
      onMouseMove: handleMouseMove,
      onMouseDown: handleMouseDown,
      onMouseUp: handleMouseUp,
      onTouchMove: handleTouchMove,
      onTouchStart: () => {
        setIsDragging(true);
      },
      onTouchEnd: () => {
        setIsDragging(false);
      },
      onKeyDown: handleKeyDown,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: beforeImage,
              alt: `${beforeLabel}: original state`,
              width: 600,
              height: 400,
              loading: "lazy",
              decoding: "async",
              className: "w-full h-full object-cover"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium", children: beforeLabel })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "absolute inset-0 overflow-hidden",
            style: { clipPath: `inset(0 ${String(100 - sliderPosition)}% 0 0)` },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "img",
                {
                  src: afterImage,
                  alt: `${afterLabel}: improved state`,
                  width: 600,
                  height: 400,
                  loading: "lazy",
                  decoding: "async",
                  className: "w-full h-full object-cover"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium", children: afterLabel })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "absolute top-0 bottom-0 w-1 bg-white shadow-lg z-10",
            style: { left: `${String(sliderPosition)}%` },
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center cursor-col-resize", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-1 h-4 bg-stone-300" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-1 h-4 bg-stone-300 ml-1" })
            ] })
          }
        )
      ]
    }
  ) });
};

const ProcessStep = ({
  step,
  isReversed = false
}) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `grid gap-8 lg:grid-cols-2 items-start ${isReversed ? "lg:grid-flow-col-dense" : ""}`, children: [
  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `${isReversed ? "lg:col-start-2" : ""} space-y-4`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-12 w-12 items-center justify-center rounded-full bg-orange-500 text-white text-xl font-bold mr-4 flex-shrink-0", children: step.number }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-semibold text-white", children: step.title })
    ] }),
    Array.isArray(step.bullets) ? /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "text-slate-300 leading-relaxed space-y-2 pl-6", children: step.bullets.map((item, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-orange-400 mr-3 text-lg flex-shrink-0", "aria-hidden": "true", children: "•" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-300 text-lg", children: item })
    ] }, index)) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-slate-300 leading-relaxed pl-6", children: step.description })
  ] }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `${isReversed ? "lg:col-start-1" : ""} flex justify-center lg:justify-start`, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "aspect-[4/3] rounded-2xl bg-stone-700 ring-1 ring-white/10 overflow-hidden w-full max-w-md", children: step.image?.src ? /* @__PURE__ */ jsxRuntimeExports.jsx(
    "img",
    {
      src: step.image.src,
      alt: step.image.alt || step.title,
      width: 600,
      height: 450,
      loading: "lazy",
      decoding: "async",
      className: "w-full h-full object-cover"
    }
  ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full h-full flex items-center justify-center text-white/50", children: [
    "Step ",
    step.number,
    " Image"
  ] }) }) })
] });
const Process = ({ serviceData }) => {
  const steps = serviceData.process?.steps || [];
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "bg-stone-900 py-16", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl sm:text-3xl font-bold text-white mb-12", children: serviceData.process?.title || "Process" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-20", children: steps.map((step, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      ProcessStep,
      {
        step,
        isReversed: index % 2 === 1
      },
      step.number
    )) })
  ] }) });
};

const DEFAULT_RATINGS = {
  wax: { protection: 1, longevity: 1, ease: 2, chipResistance: 1 },
  sealant: { protection: 2, longevity: 2, ease: 2, chipResistance: 1 },
  ceramic: { protection: 4, longevity: 4, ease: 4, chipResistance: 1 },
  ppf: { protection: 5, longevity: 5, ease: 3, chipResistance: 5 }
};
const METRIC_LABELS = {
  protection: "Protection",
  longevity: "Longevity",
  ease: "Ease of Wash",
  chipResistance: "Rock-Chip Resistance"
};
const PRODUCT_LABELS = {
  wax: "Wax",
  sealant: "Sealant",
  ceramic: "Ceramic",
  ppf: "PPF"
};

const StarIcon = ({ filled, className = "" }) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  "svg",
  {
    viewBox: "0 0 16 16",
    className: `w-4 h-4 ${className}`,
    fill: filled ? "currentColor" : "none",
    stroke: "currentColor",
    strokeWidth: "1",
    children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M8 1l2 4h4l-3 3 1 4-4-2-4 2 1-4-3-3h4l2-4z" })
  }
);
const getProductLabel = (product) => PRODUCT_LABELS[product];
const getMetricLabel = (metric) => METRIC_LABELS[metric];
const RatingStars = ({ rating, product, metric, className = "" }) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: `flex items-center gap-1 ${className}`,
      role: "img",
      "aria-label": `${getProductLabel(product)} — ${getMetricLabel(metric)}: ${String(rating)} out of 5 stars`,
      children: [
        [1, 2, 3, 4, 5].map((star) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          StarIcon,
          {
            filled: star <= rating,
            className: star <= rating ? "text-orange-500" : "text-stone-600"
          },
          star
        )),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "sr-only", children: [
          rating,
          "/5"
        ] })
      ]
    }
  );
};
const ProtectionComparisonChart = ({
  ratings = DEFAULT_RATINGS,
  title = "Protection Options Compared",
  description,
  className = ""
}) => {
  const metrics = ["protection", "longevity", "ease", "chipResistance"];
  const products = ["wax", "sealant", "ceramic", "ppf"];
  const getRating = (product, metric) => ratings[product][metric];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("figure", { className: `rounded-2xl border border-stone-600 p-4 md:p-6 bg-stone-800 shadow-sm ${className}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("figcaption", { className: "text-lg md:text-xl font-semibold text-white", children: title }),
      description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-300 mt-2", children: description })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "block md:hidden space-y-4", children: metrics.map((metric) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-stone-600 rounded-lg p-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-medium text-white mb-3", children: getMetricLabel(metric) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: products.map((product) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-slate-300 min-w-0 flex-shrink-0 mr-3", children: getProductLabel(product) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 min-w-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          RatingStars,
          {
            rating: getRating(product, metric),
            product,
            metric
          }
        ) })
      ] }, product)) })
    ] }, metric)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden md:block", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-5 gap-6 mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium text-slate-400" }),
        products.map((product) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "text-sm font-medium text-center text-white",
            children: getProductLabel(product)
          },
          product
        ))
      ] }),
      metrics.map((metric) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-5 gap-6 items-center py-3 border-b border-stone-600 last:border-b-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium text-slate-300", children: getMetricLabel(metric) }),
        products.map((product) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          RatingStars,
          {
            rating: getRating(product, metric),
            product,
            metric
          }
        ) }, product))
      ] }, metric))
    ] })
  ] });
};

const Results = ({ serviceData }) => {
  const before = serviceData.results?.images?.before?.src;
  const after = serviceData.results?.images?.after?.src;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "bg-stone-800 py-16", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl sm:text-3xl font-bold text-white mb-12 text-center", children: "Results" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-8 lg:grid-cols-2 items-center", children: [
      serviceData.results?.video ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-2xl bg-stone-700 ring-1 ring-white/10 overflow-hidden w-80 sm:w-[22.4rem] lg:w-[25.6rem] mx-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "video",
        {
          src: serviceData.results.video.src,
          controls: true,
          className: "w-full h-full object-cover",
          "aria-label": serviceData.results.video.alt || "Results video",
          playsInline: true,
          style: { aspectRatio: "2/3" },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("track", { kind: "captions" }),
            "Your browser does not support the video tag."
          ]
        }
      ) }) }) : before && after ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        BeforeAfterSlider,
        {
          beforeImage: before,
          afterImage: after,
          beforeLabel: "BEFORE",
          afterLabel: "AFTER",
          className: "w-full"
        }
      ) }) : null,
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-semibold text-white mb-6", children: "What You'll Get" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-4 text-slate-300", children: serviceData.results?.bullets?.map((bullet, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-orange-400 mr-3 text-lg", children: "•" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg text-slate-300", children: bullet })
        ] }, index)) })
      ] })
    ] })
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

const ServiceCTA = ({ serviceData, onRequestQuote }) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "bg-stone-900 py-16", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl sm:text-3xl font-bold text-white mb-4", children: serviceData.cta?.title || "Ready to get started?" }),
    serviceData.cta?.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-slate-300 mb-8", children: serviceData.cta.description }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      CTAButtons,
      {
        layout: "horizontal",
        bookNowProps: {
          children: serviceData.cta?.primary?.label || serviceData.hero.ctas?.[0]?.label || "Book Now"
        },
        getQuoteProps: {
          children: serviceData.cta?.secondary?.label || serviceData.hero.ctas?.[1]?.label || "Request Quote",
          variant: "outline-white",
          onClick: onRequestQuote || (() => {
          })
        }
      }
    )
  ] }) });
};

const ServiceHero = ({ serviceData, onRequestQuote }) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "bg-stone-900 py-16 sm:py-24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-8 lg:grid-cols-[3fr_2fr] items-center mb-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "aspect-[3/2] rounded-2xl bg-stone-800/80 ring-1 ring-white/10 overflow-hidden", children: serviceData.hero.image?.src ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      "img",
      {
        src: serviceData.hero.image.src,
        alt: serviceData.hero.image.alt,
        width: 800,
        height: 533,
        loading: "lazy",
        decoding: "async",
        className: "w-full h-full object-cover"
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-full flex items-center justify-center text-white/50", children: "Image Placeholder" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl sm:text-4xl font-extrabold text-white", children: serviceData.hero.headline || serviceData.title || "Service Title" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-slate-300 text-xl md:text-2xl", children: serviceData.hero.subheadline || serviceData.shortDescription || "Short subhead that sells the value. Placeholder copy." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        CTAButtons,
        {
          layout: "horizontal",
          bookNowProps: {
            children: serviceData.hero.ctas?.[0]?.label || "Book Now"
          },
          getQuoteProps: {
            children: serviceData.hero.ctas?.[1]?.label || "Request Quote",
            variant: "outline-white",
            onClick: onRequestQuote
          }
        }
      ) })
    ] })
  ] }) }) });
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

const WhatItIs = ({ serviceData }) => {
  const hasChart = serviceData.whatItIs?.chart?.type === "protection-comparison";
  const isPaintCorrection = serviceData.slug === "paint-correction";
  const isCeramicCoating = serviceData.slug === "ceramic-coating";
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "bg-stone-800 py-16", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8", children: [
    hasChart && serviceData.whatItIs?.chart && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-12", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      ProtectionComparisonChart,
      {
        ratings: serviceData.whatItIs.chart.data,
        title: serviceData.whatItIs.chart.title,
        description: serviceData.whatItIs.chart.description
      }
    ) }),
    isPaintCorrection ? (
      // Special two-column layout for paint correction
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-10 lg:grid-cols-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-10", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-3xl sm:text-4xl font-bold text-white mb-4", children: "What It Is" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-slate-300 mb-6 text-lg", children: serviceData.whatItIs?.description || "Explain what the service is. Placeholder text." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-2 text-slate-300", children: serviceData.whatItIs?.benefits?.map((benefit, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-orange-400 mr-3 text-lg", "aria-hidden": "true", children: "•" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg", children: benefit })
          ] }, index)) }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col justify-center", children: [
          serviceData.whatItIs?.image?.src && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-2xl bg-stone-700 ring-1 ring-white/10 overflow-hidden w-full max-w-lg mx-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: serviceData.whatItIs.image.src,
              alt: serviceData.whatItIs.image.alt || "Service illustration",
              width: 500,
              height: 400,
              loading: "lazy",
              decoding: "async",
              className: "w-full h-full object-contain"
            }
          ) }),
          serviceData.whatItIs?.video?.src && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-2xl bg-stone-700 ring-1 ring-white/10 overflow-hidden w-80 sm:w-[22.4rem] lg:w-[25.6rem] mx-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "video",
            {
              src: serviceData.whatItIs.video.src,
              controls: true,
              className: "w-full h-full object-cover",
              "aria-label": serviceData.whatItIs.video.alt || "Service video",
              playsInline: true,
              style: { aspectRatio: "2/3" },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("track", { kind: "captions" }),
                "Your browser does not support the video tag."
              ]
            }
          ) })
        ] })
      ] })
    ) : isCeramicCoating ? (
      // Two column layout for ceramic coating (after chart)
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-10 lg:grid-cols-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl sm:text-3xl font-bold text-white mb-4", children: "What It Is" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-slate-300 mb-6", children: serviceData.whatItIs?.description || "Explain what the service is. Placeholder text." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-2 text-slate-300", children: serviceData.whatItIs?.benefits?.map((benefit, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-orange-400 mr-3 text-lg", "aria-hidden": "true", children: "•" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg", children: benefit })
        ] }, index)) }) })
      ] })
    ) : (
      // Two column layout for other services
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-10 lg:grid-cols-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `space-y-6 ${serviceData.whatItIs?.video?.src ? "flex flex-col justify-center" : ""}`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-3xl sm:text-4xl font-bold text-white mb-4", children: "What It Is" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-slate-300 mb-6 text-lg", children: serviceData.whatItIs?.description || "Explain what the service is. Placeholder text." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-2 text-slate-300", children: serviceData.whatItIs?.benefits?.map((benefit, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-orange-400 mr-3 text-lg", "aria-hidden": "true", children: "•" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg", children: benefit })
          ] }, index)) }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col justify-center", children: [
          serviceData.whatItIs?.image?.src && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-2xl bg-stone-700 ring-1 ring-white/10 overflow-hidden w-full max-w-lg mx-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: serviceData.whatItIs.image.src,
              alt: serviceData.whatItIs.image.alt || "Service illustration",
              width: 500,
              height: 400,
              loading: "lazy",
              decoding: "async",
              className: "w-full h-full object-contain"
            }
          ) }),
          serviceData.whatItIs?.video?.src && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-2xl bg-stone-700 ring-1 ring-white/10 overflow-hidden w-80 sm:w-[22.4rem] lg:w-[25.6rem] mx-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "video",
            {
              src: serviceData.whatItIs.video.src,
              controls: true,
              className: "w-full h-full object-cover",
              "aria-label": serviceData.whatItIs.video.alt || "Service video",
              playsInline: true,
              style: { aspectRatio: "2/3" },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("track", { kind: "captions" }),
                "Your browser does not support the video tag."
              ]
            }
          ) })
        ] })
      ] })
    )
  ] }) });
};

const HomePage = ({ onRequestQuote, locationData }) => {
  const tenantSlug = useTenantSlug();
  useSEO();
  const hasReviews = useReviewsAvailability();
  const isDesktop = useIsDesktop();
  const sectionIds = isDesktop ? ["top", "services-desktop", "reviews", "faq", "gallery-desktop"] : ["top", "services", "reviews", "faq", "gallery", "footer"];
  useScrollSpy({
    ids: sectionIds,
    headerPx: isDesktop ? 88 : 72,
    updateHash: false
  });
  reactExports.useEffect(() => {
    if (!locationData) {
      injectAllSchemas([]);
    }
  }, [locationData]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Header, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-screen snap-y snap-mandatory overflow-y-scroll snap-container scrollbar-hide pt-[72px] md:pt-[88px]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Hero,
        {
          ...onRequestQuote && { onRequestQuote }
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ServicesGrid, {}),
      hasReviews && /* @__PURE__ */ jsxRuntimeExports.jsx(Reviews, { tenantSlug }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(FAQ, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Gallery,
        {
          ...onRequestQuote && { onRequestQuote }
        }
      )
    ] })
  ] });
};

const RequestQuoteModal = React.lazy(() => __vitePreload(() => import('./RequestQuoteModal-Dp9PY4DU.js'),true?__vite__mapDeps([9,3,4,5,10]):void 0));
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

const TenantPage = () => {
  const [isQuoteModalOpen, setIsQuoteModalOpen] = reactExports.useState(false);
  const handleOpenQuoteModal = () => {
    setIsQuoteModalOpen(true);
  };
  const handleCloseQuoteModal = () => {
    setIsQuoteModalOpen(false);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(DataProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(HomePage, { onRequestQuote: handleOpenQuoteModal }),
    isQuoteModalOpen && /* @__PURE__ */ jsxRuntimeExports.jsx(
      LazyRequestQuoteModal,
      {
        isOpen: isQuoteModalOpen,
        onClose: handleCloseQuoteModal
      }
    )
  ] }) });
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
        const { loadMobileDetailingConfig } = await __vitePreload(async () => { const { loadMobileDetailingConfig } = await import('./index-D59D2CiF.js');return { loadMobileDetailingConfig }},true?__vite__mapDeps([0,1,2,3,4,5]):void 0);
        config = loadMobileDetailingConfig();
        break;
      }
      case "pet-grooming": {
        const { loadPetGroomingConfig } = await __vitePreload(async () => { const { loadPetGroomingConfig } = await import('./index-CRBJDcLP.js');return { loadPetGroomingConfig }},true?__vite__mapDeps([6,3,4,5]):void 0);
        config = await loadPetGroomingConfig();
        break;
      }
      case "maid-service": {
        const { loadMaidServiceConfig } = await __vitePreload(async () => { const { loadMaidServiceConfig } = await import('./index-to5g6MKS.js');return { loadMaidServiceConfig }},true?__vite__mapDeps([7,3,4,5]):void 0);
        config = await loadMaidServiceConfig();
        break;
      }
      case "lawncare": {
        const { loadLawncareConfig } = await __vitePreload(async () => { const { loadLawncareConfig } = await import('./index-Co7RayUv.js');return { loadLawncareConfig }},true?__vite__mapDeps([8,3,4,5]):void 0);
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

const PreviewError = ({ error }) => {
  const isExpired = error.toLowerCase().includes("expired");
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md w-full bg-gray-800 rounded-lg shadow-xl p-8 text-center space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(AlertCircle, { className: "h-16 w-16 text-red-500 mx-auto" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold text-white", children: "Preview Unavailable" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-300", children: error }),
    isExpired && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-orange-900/30 border border-orange-700 rounded-md p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-orange-200 text-sm", children: "Preview links expire after 7 days for security." }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-4 space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-400", children: "Need a new preview link or have questions?" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "a",
          {
            href: "tel:+15551234567",
            className: "flex items-center justify-center space-x-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md transition-colors",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "h-4 w-4" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Call Us" })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "a",
          {
            href: "mailto:hello@thatsmartsite.com",
            className: "flex items-center justify-center space-x-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "h-4 w-4" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Email Sales" })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "a",
        {
          href: "/",
          className: "text-sm text-orange-400 hover:text-orange-300 block pt-2",
          children: "Visit our main site →"
        }
      )
    ] })
  ] }) });
};

const PreviewLoading = () => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Loader2, { className: "h-12 w-12 text-orange-500 animate-spin mx-auto" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-semibold text-white", children: "Loading Preview..." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-400", children: "Setting up your demo site" })
  ] }) });
};

const SeoHead = ({
  title,
  description,
  canonical,
  noindex
}) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Helmet, { children: [
    title && /* @__PURE__ */ jsxRuntimeExports.jsx("title", { children: title }),
    description && /* @__PURE__ */ jsxRuntimeExports.jsx("meta", { name: "description", content: description }),
    canonical && /* @__PURE__ */ jsxRuntimeExports.jsx("link", { rel: "canonical", href: canonical }),
    noindex && /* @__PURE__ */ jsxRuntimeExports.jsx("meta", { name: "robots", content: "noindex, nofollow" }),
    title && /* @__PURE__ */ jsxRuntimeExports.jsx("meta", { property: "og:title", content: title }),
    description && /* @__PURE__ */ jsxRuntimeExports.jsx("meta", { property: "og:description", content: description }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("meta", { name: "twitter:card", content: "summary_large_image" })
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

const PreviewPage = () => {
  const { payload, isLoading, error } = usePreviewParams();
  const [isQuoteModalOpen, setIsQuoteModalOpen] = reactExports.useState(false);
  const isDesktop = useIsDesktop();
  const handleOpenQuoteModal = () => {
    setIsQuoteModalOpen(true);
  };
  const handleCloseQuoteModal = () => {
    setIsQuoteModalOpen(false);
  };
  useBrowserTab({
    title: payload?.businessName ? `${payload.businessName} - Preview` : "Platform Preview",
    useBusinessName: false
    // Don't use default business name, we have custom format
  });
  const sectionIds = isDesktop ? ["top", "services", "services-desktop", "reviews", "faq", "gallery", "gallery-desktop", "footer"] : ["top", "services", "reviews", "faq", "gallery", "footer"];
  useScrollSpy({
    ids: sectionIds,
    headerPx: isDesktop ? 88 : 72,
    updateHash: false
  });
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(PreviewLoading, {});
  }
  if (error || !payload) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(PreviewError, { error: error || "Failed to load preview" });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(PreviewDataProvider, { payload, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      SeoHead,
      {
        title: payload.businessName ? `${payload.businessName} - Preview` : "Platform Preview",
        description: `Preview of ${payload.businessName || "business"} website`,
        noindex: true
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(PreviewCTAButton, { position: "left" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(PreviewCTAButton, { position: "right" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-screen snap-y snap-mandatory overflow-y-scroll snap-container", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Header, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Hero, { onRequestQuote: handleOpenQuoteModal }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ServicesGrid, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Reviews, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(FAQ, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Gallery, { onRequestQuote: handleOpenQuoteModal })
    ] }),
    isQuoteModalOpen && /* @__PURE__ */ jsxRuntimeExports.jsx(
      LazyRequestQuoteModal,
      {
        isOpen: isQuoteModalOpen,
        onClose: handleCloseQuoteModal
      }
    )
  ] });
};

const INDUSTRIES$1 = [
  { value: "mobile-detailing", label: "Mobile Detailing" },
  { value: "maid-service", label: "Maid Service" },
  { value: "lawncare", label: "Lawn Care" },
  { value: "pet-grooming", label: "Pet Grooming" }
];
const TEST_DATA = {
  "mobile-detailing": {
    businessName: "JP's Mobile Detail",
    phone: "(702) 420-3140",
    city: "Bullhead City",
    state: "AZ"
  },
  "maid-service": {
    businessName: "Sparkle Clean Maids",
    phone: "(602) 555-5678",
    city: "Phoenix",
    state: "AZ"
  },
  "lawncare": {
    businessName: "Green Horizons Lawn Care",
    phone: "(928) 555-9012",
    city: "Flagstaff",
    state: "AZ"
  },
  "pet-grooming": {
    businessName: "Pampered Paws Grooming",
    phone: "(520) 555-3456",
    city: "Tucson",
    state: "AZ"
  }
};
const PreviewGeneratorPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = reactExports.useState(false);
  const [error, setError] = reactExports.useState(null);
  useBrowserTab({
    title: "Preview Generator - That Smart Site",
    useBusinessName: false
  });
  const [formData, setFormData] = reactExports.useState({
    businessName: "",
    phone: "",
    city: "",
    state: "",
    industry: "mobile-detailing"
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    void (async () => {
      try {
        const response = await createPreview(formData);
        void navigate(response.url);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to create preview";
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    })();
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handlePhoneChange = (e) => {
    const formatted = formatPhoneNumber(e.target.value);
    setFormData((prev) => ({ ...prev, phone: formatted }));
  };
  const handleStateChange = (e) => {
    const value = e.target.value.toUpperCase().slice(0, 2);
    setFormData((prev) => ({ ...prev, state: value }));
  };
  const handleAutofill = () => {
    const testData = TEST_DATA[formData.industry];
    setFormData({
      industry: formData.industry,
      businessName: testData.businessName,
      phone: testData.phone,
      city: testData.city,
      state: testData.state
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center px-4 py-12", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md w-full", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "inline-flex items-center justify-center w-16 h-16 bg-orange-500 rounded-full mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-8 w-8 text-white" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold text-white mb-2", children: "Tenant Preview Generator" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-400", children: "Create instant preview sites for sales demos" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "bg-gray-800 rounded-lg shadow-xl p-8 space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "businessName", className: "block text-sm font-medium text-gray-200 mb-2", children: "Business Name" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "text",
            id: "businessName",
            name: "businessName",
            value: formData.businessName,
            onChange: handleChange,
            required: true,
            minLength: 2,
            maxLength: 100,
            placeholder: "JP's Mobile Detail",
            className: "w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "phone", className: "block text-sm font-medium text-gray-200 mb-2", children: "Phone Number" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "tel",
            id: "phone",
            name: "phone",
            value: formData.phone,
            onChange: handlePhoneChange,
            required: true,
            minLength: 14,
            maxLength: 14,
            placeholder: "(928) 555-1234",
            className: "w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "city", className: "block text-sm font-medium text-gray-200 mb-2", children: "City" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "text",
              id: "city",
              name: "city",
              value: formData.city,
              onChange: handleChange,
              required: true,
              minLength: 2,
              maxLength: 50,
              placeholder: "Phoenix",
              className: "w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "state", className: "block text-sm font-medium text-gray-200 mb-2", children: "State" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "text",
              id: "state",
              name: "state",
              value: formData.state,
              onChange: handleStateChange,
              required: true,
              minLength: 2,
              maxLength: 2,
              placeholder: "AZ",
              className: "w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent uppercase"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "industry", className: "block text-sm font-medium text-gray-200 mb-2", children: "Industry" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "select",
          {
            id: "industry",
            name: "industry",
            value: formData.industry,
            onChange: handleChange,
            required: true,
            className: "w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent",
            children: INDUSTRIES$1.map((industry) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: industry.value, children: industry.label }, industry.value))
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: handleAutofill,
          className: "w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors border border-blue-500",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-4 w-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Quick Fill Test Data" })
          ]
        }
      ),
      error && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-red-900/50 border border-red-700 rounded-md p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-red-200", children: error }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "submit",
          disabled: isLoading,
          className: "w-full flex items-center justify-center space-x-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-md transition-colors shadow-lg",
          children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Loader2, { className: "h-5 w-5 animate-spin" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Generating Preview..." })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "h-5 w-5" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Generate Preview" })
          ] })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-400 text-center", children: "Preview links expire after 7 days" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        onClick: () => {
          void navigate("/");
        },
        className: "text-sm text-gray-400 hover:text-white transition-colors",
        children: "← Back to Home"
      }
    ) })
  ] }) });
};

const DashboardHeader = ({
  detailerData
}) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-stone-800 rounded-2xl shadow-lg border border-stone-700 mb-8 overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-8 py-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col lg:flex-row items-start lg:items-center justify-between", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-6 mb-6 lg:mb-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-20 w-20 bg-stone-700 rounded-2xl flex items-center justify-center shadow-sm border border-stone-600", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Car, { className: "h-10 w-10 text-orange-500" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -bottom-2 -right-2 h-6 w-6 bg-green-500 rounded-full border-2 border-stone-800 shadow-sm" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold mb-2 text-white", children: detailerData.business_name || "Your Business Name" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-300 text-lg mb-1", children: detailerData.first_name && detailerData.last_name ? `${detailerData.first_name} ${detailerData.last_name}` : "Owner Name" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center text-gray-400 mb-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Car, { className: "h-4 w-4 mr-2" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: detailerData.location || "Business Location" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center text-gray-400", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-4 w-4 mr-2" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            "In business since ",
            detailerData.memberSince || "2019"
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-6 w-full lg:w-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-stone-700 rounded-xl p-4 text-center border border-stone-600", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold text-white", children: "$2,450" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-gray-300 text-sm", children: "This Week" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-stone-700 rounded-xl p-4 text-center border border-stone-600", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold text-white", children: "23" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-gray-300 text-sm", children: "Appointments" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-stone-700 rounded-xl p-4 text-center border border-stone-600", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold text-white", children: "142" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-gray-300 text-sm", children: "Customers" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-stone-700 rounded-xl p-4 text-center border border-stone-600", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold text-white", children: "4.9★" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-gray-300 text-sm", children: "Rating" })
      ] })
    ] })
  ] }) }) });
};

const DashboardLayout = ({ children }) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen bg-stone-900 transition-colors duration-500", children });
};

const DASHBOARD_TABS = [
  { id: "overview", name: "Overview", icon: Home },
  { id: "website", name: "Website", icon: Globe },
  { id: "locations", name: "Locations", icon: MapPin },
  { id: "profile", name: "Profile", icon: User },
  { id: "schedule", name: "Schedule", icon: Calendar },
  { id: "customers", name: "Customers", icon: Users },
  { id: "services", name: "Services", icon: Car }
];

const DEFAULT_TAB_CONFIG = {
  schedule: false,
  customers: false,
  services: false,
  locations: true,
  profile: true,
  website: true
};
const TENANT_TAB_CONFIGS = {
  // Example configurations:
  // 'jps': { schedule: true, customers: true },
  // 'premium-tenant': { schedule: true, customers: true, services: true },
  // 'basic-tenant': { schedule: false, customers: false, services: false },
  // Current configuration for 'jps' tenant (as requested):
  "jps": {
    schedule: false,
    customers: false,
    services: false,
    locations: true,
    profile: true,
    website: true
  }
};
const getTabConfig = (tenantSlug) => {
  if (!tenantSlug) {
    return DEFAULT_TAB_CONFIG;
  }
  const tenantConfig = TENANT_TAB_CONFIGS[tenantSlug];
  if (!tenantConfig) {
    return DEFAULT_TAB_CONFIG;
  }
  return {
    ...DEFAULT_TAB_CONFIG,
    ...tenantConfig
  };
};

const DashboardTabs = ({
  activeTab,
  onTabChange,
  tenantSlug
}) => {
  const tabConfig = getTabConfig(tenantSlug);
  const visibleTabs = DASHBOARD_TABS.filter((tab) => {
    switch (tab.id) {
      case "schedule":
        return tabConfig.schedule;
      case "customers":
        return tabConfig.customers;
      case "services":
        return tabConfig.services;
      case "locations":
        return tabConfig.locations;
      case "profile":
        return tabConfig.profile;
      case "website":
        return tabConfig.website;
      case "overview":
        return true;
      default:
        return true;
    }
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "flex space-x-1 bg-stone-800 rounded-xl p-1 shadow-lg border border-stone-700", children: visibleTabs.map((tab) => {
    const Icon = tab.icon;
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        onClick: () => {
          onTabChange(tab.id);
        },
        className: `flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === tab.id ? "bg-orange-500 text-white shadow-md hover:bg-orange-600" : "text-gray-300 hover:text-white hover:bg-stone-700"}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-4 w-4 mr-2" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: tab.name })
        ]
      },
      tab.id
    );
  }) }) });
};

const CustomersTab = () => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "Customers Tab (placeholder)" });

const saveServiceAreas = async (tenantSlug, serviceAreas) => {
  const response = await fetch(`/api/locations/service-areas/${tenantSlug}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ serviceAreas })
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to save service areas");
  }
  return response.json();
};
const addServiceArea = async (tenantSlug, areaData) => {
  const response = await fetch(`/api/locations/service-areas/${tenantSlug}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(areaData)
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to add service area");
  }
  return response.json();
};
const deleteServiceArea = async (tenantSlug, areaId) => {
  const response = await fetch(`/api/locations/service-areas/${tenantSlug}/${areaId}`, {
    method: "DELETE"
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to delete service area");
  }
  return response.json();
};

const useTenantBusinessData = () => {
  const [businessData, setBusinessData] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(true);
  const [error, setError] = reactExports.useState(null);
  const [refreshTrigger, setRefreshTrigger] = reactExports.useState(0);
  const { slug } = useParams();
  const fetchBusinessData = reactExports.useCallback(async () => {
    if (!slug) {
      setError("No business slug provided");
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");
      const response = await fetch(`${config.apiUrl}/api/tenants/${slug}`, {
        headers: {
          "Authorization": `Bearer ${String(token)}`,
          "Content-Type": "application/json"
        }
      });
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          setBusinessData(data.data);
        } else {
          setError("Failed to fetch business data");
        }
      } else {
        const errorData = await response.json();
        setError(errorData.error || errorData.message || "Failed to fetch business data");
      }
    } catch (error2) {
      console.error("Error fetching business data:", error2);
      setError("Failed to fetch business data");
    } finally {
      setLoading(false);
    }
  }, [slug]);
  reactExports.useEffect(() => {
    void fetchBusinessData();
  }, [fetchBusinessData, refreshTrigger]);
  const serviceAreas = businessData?.service_areas || [];
  const primaryServiceArea = serviceAreas.length > 0 ? serviceAreas[0] : null;
  const otherServiceAreas = serviceAreas.slice(1);
  return {
    businessData,
    serviceAreas,
    primaryServiceArea,
    otherServiceAreas,
    loading,
    error,
    refetch: () => {
      setRefreshTrigger((prev) => prev + 1);
    }
  };
};

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

const STATES = {
  // 50 US States
  "AL": "Alabama",
  "AK": "Alaska",
  "AZ": "Arizona",
  "AR": "Arkansas",
  "CA": "California",
  "CO": "Colorado",
  "CT": "Connecticut",
  "DE": "Delaware",
  "FL": "Florida",
  "GA": "Georgia",
  "HI": "Hawaii",
  "ID": "Idaho",
  "IL": "Illinois",
  "IN": "Indiana",
  "IA": "Iowa",
  "KS": "Kansas",
  "KY": "Kentucky",
  "LA": "Louisiana",
  "ME": "Maine",
  "MD": "Maryland",
  "MA": "Massachusetts",
  "MI": "Michigan",
  "MN": "Minnesota",
  "MS": "Mississippi",
  "MO": "Missouri",
  "MT": "Montana",
  "NE": "Nebraska",
  "NV": "Nevada",
  "NH": "New Hampshire",
  "NJ": "New Jersey",
  "NM": "New Mexico",
  "NY": "New York",
  "NC": "North Carolina",
  "ND": "North Dakota",
  "OH": "Ohio",
  "OK": "Oklahoma",
  "OR": "Oregon",
  "PA": "Pennsylvania",
  "RI": "Rhode Island",
  "SC": "South Carolina",
  "SD": "South Dakota",
  "TN": "Tennessee",
  "TX": "Texas",
  "UT": "Utah",
  "VT": "Vermont",
  "VA": "Virginia",
  "WA": "Washington",
  "WV": "West Virginia",
  "WI": "Wisconsin",
  "WY": "Wyoming",
  // US Territories
  "DC": "District of Columbia",
  "AS": "American Samoa",
  "GU": "Guam",
  "MP": "Northern Mariana Islands",
  "PR": "Puerto Rico",
  "VI": "U.S. Virgin Islands",
  // Military/Diplomatic
  "AA": "Armed Forces Americas",
  "AE": "Armed Forces Europe",
  "AP": "Armed Forces Pacific"
};
function isValidStateCode(code) {
  return code.toUpperCase() in STATES;
}

function getGoogle() {
  return window.google;
}
function hasImportLibrary() {
  const g = getGoogle();
  return !!g?.maps.importLibrary;
}

const AddLocationModal = ({
  isOpen,
  onClose,
  onAdd
}) => {
  const [formData, setFormData] = reactExports.useState({
    city: "",
    state: "",
    zip: "",
    minimum: 0,
    multiplier: 1
  });
  const [errors, setErrors] = reactExports.useState({});
  const [isSubmitting, setIsSubmitting] = reactExports.useState(false);
  const validateForm = reactExports.useCallback(() => {
    const newErrors = {};
    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    }
    if (!formData.state.trim()) {
      newErrors.state = "State is required";
    } else if (!isValidStateCode(formData.state)) {
      newErrors.state = "Please enter a valid 2-letter state code (e.g., CA, NY, TX)";
    }
    if (formData.zip && !/^\d{5}(-\d{4})?$/.test(formData.zip)) {
      newErrors.zip = "ZIP code must be 5 digits or 5+4 format";
    }
    if (formData.minimum < 0) {
      newErrors.minimum = "Minimum must be a positive number";
    }
    if (formData.multiplier <= 0) {
      newErrors.multiplier = "Multiplier must be greater than 0";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);
  const handleSubmit = reactExports.useCallback(async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    setIsSubmitting(true);
    try {
      const result = await onAdd(formData);
      if (result.success) {
        setFormData({ city: "", state: "", zip: "", minimum: 0, multiplier: 1 });
        setErrors({});
        onClose();
      } else {
        setErrors({ general: result.error || "Failed to add location" });
      }
    } catch {
      setErrors({ general: "An unexpected error occurred" });
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, onAdd, onClose, validateForm]);
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: void 0 }));
    }
  };
  if (!isOpen) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-lg shadow-xl max-w-md w-full mx-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-6 border-b border-gray-200", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-5 w-5 text-orange-500" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold text-gray-900", children: "Add Service Location" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          onClick: onClose,
          variant: "ghost",
          size: "sm",
          className: "text-gray-400 hover:text-gray-600 p-1",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-5 w-5" })
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: (e) => {
      void handleSubmit(e);
    }, className: "p-6 space-y-4", children: [
      errors.general && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-red-50 border border-red-200 rounded-md p-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-red-600", children: errors.general }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "city", className: "block text-sm font-medium text-gray-700 mb-1", children: "City *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              id: "city",
              type: "text",
              value: formData.city,
              onChange: (e) => {
                handleInputChange("city", e.target.value);
              },
              className: `w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${errors.city ? "border-red-300" : "border-gray-300"}`,
              placeholder: "Enter city name"
            }
          ),
          errors.city && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-red-600", children: errors.city })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "state", className: "block text-sm font-medium text-gray-700 mb-1", children: "State *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              id: "state",
              type: "text",
              value: formData.state,
              onChange: (e) => {
                handleInputChange("state", e.target.value.toUpperCase());
              },
              className: `w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${errors.state ? "border-red-500 bg-red-50" : "border-gray-300"}`,
              placeholder: "CA, NY, TX",
              maxLength: 2
            }
          ),
          errors.state && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-red-600", children: errors.state })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "zip", className: "block text-sm font-medium text-gray-700 mb-1", children: "ZIP Code" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              id: "zip",
              type: "text",
              value: formData.zip,
              onChange: (e) => {
                handleInputChange("zip", e.target.value);
              },
              className: `w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${errors.zip ? "border-red-300" : "border-gray-300"}`,
              placeholder: "12345 or 12345-6789"
            }
          ),
          errors.zip && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-red-600", children: errors.zip })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "minimum", className: "block text-sm font-medium text-gray-700 mb-1", children: "Minimum" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "number",
              id: "minimum",
              value: formData.minimum || "",
              onChange: (e) => {
                handleInputChange("minimum", parseFloat(e.target.value) || 0);
              },
              className: `w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${errors.minimum ? "border-red-300" : "border-gray-300"}`,
              placeholder: "0.00",
              step: "0.01",
              min: "0"
            }
          ),
          errors.minimum && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-red-600", children: errors.minimum })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "multiplier", className: "block text-sm font-medium text-gray-700 mb-1", children: "Multiplier" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "number",
              id: "multiplier",
              value: formData.multiplier || "",
              onChange: (e) => {
                handleInputChange("multiplier", parseFloat(e.target.value) || 1);
              },
              className: `w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${errors.multiplier ? "border-red-300" : "border-gray-300"}`,
              placeholder: "1.00",
              step: "0.01",
              min: "0.01"
            }
          ),
          errors.multiplier && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-red-600", children: errors.multiplier })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end space-x-3 pt-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "button",
            onClick: onClose,
            variant: "secondary",
            size: "md",
            className: "px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200",
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "submit",
            variant: "primary",
            size: "md",
            className: "px-4 py-2 text-sm font-medium bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300",
            loading: isSubmitting,
            disabled: isSubmitting,
            leftIcon: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
            children: "Add Location"
          }
        )
      ] })
    ] })
  ] }) });
};

const DeleteLocationModal = ({
  isOpen,
  location,
  onClose,
  onConfirm,
  isDeleting = false
}) => {
  if (!isOpen || !location) return null;
  const formatLocation = () => {
    const parts = [location.city, location.state];
    if (location.zip) {
      parts.push(location.zip);
    }
    return parts.join(", ");
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-lg shadow-xl max-w-md w-full mx-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-6 border-b border-gray-200", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertTriangle, { className: "h-5 w-5 text-red-500" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold text-gray-900", children: "Delete Location" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          onClick: onClose,
          variant: "ghost",
          size: "sm",
          className: "text-gray-400 hover:text-gray-600 disabled:text-gray-300 p-1",
          disabled: isDeleting,
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-5 w-5" })
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-600 mb-2", children: "Are you sure you want to delete this service location?" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-gray-50 border border-gray-200 rounded-md p-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4 text-orange-500" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-gray-900", children: location.city }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-500", children: formatLocation() })
          ] })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertTriangle, { className: "h-4 w-4 text-yellow-400 mt-0.5 mr-2 flex-shrink-0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-yellow-800", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Warning:" }),
          " This action cannot be undone. Customers in this area will no longer be able to find your services."
        ] }) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end space-x-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            onClick: onClose,
            variant: "secondary",
            size: "md",
            className: "px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400",
            disabled: isDeleting,
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            onClick: () => {
              void onConfirm();
            },
            variant: "destructive",
            size: "md",
            className: "px-4 py-2 text-sm font-medium bg-red-500 hover:bg-red-600 disabled:bg-red-300",
            loading: isDeleting,
            disabled: isDeleting,
            leftIcon: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" }),
            children: "Delete Location"
          }
        )
      ] })
    ] })
  ] }) });
};

const PrimaryServiceArea = ({
  primaryServiceArea,
  isEditMode,
  onEditModeChange,
  onLocationUpdate,
  apiLoaded: _apiLoaded
}) => {
  const [errors, setErrors] = reactExports.useState({});
  const handleCancel = () => {
    setErrors({});
    onEditModeChange(false);
  };
  const handleStateChange = (value) => {
    const upperValue = value.toUpperCase();
    onLocationUpdate("state", upperValue);
    if (errors.state) {
      setErrors({});
    }
  };
  const handleSave = () => {
    if (!primaryServiceArea) return;
    if (!isValidStateCode(primaryServiceArea.state)) {
      setErrors({ state: "Please enter a valid 2-letter state code (e.g., CA, NY, TX)" });
      return;
    }
    setErrors({});
    onEditModeChange(false);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-between", children: /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold text-orange-500", children: "Primary Service Area" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-stone-800 border border-stone-700 rounded-lg p-6", children: !primaryServiceArea ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-yellow-50 border border-yellow-200 rounded-md p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-yellow-600", children: "No primary service area found" }) }) : isEditMode ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "primary-city", className: "block text-sm font-medium text-gray-300 mb-1", children: "City *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              id: "primary-city",
              type: "text",
              value: primaryServiceArea.city,
              onChange: (e) => {
                onLocationUpdate("city", e.target.value);
              },
              className: "w-full px-3 py-2 border border-stone-700 bg-stone-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500",
              placeholder: "Enter city name"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "primary-state", className: "block text-sm font-medium text-gray-300 mb-1", children: "State *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              id: "primary-state",
              type: "text",
              value: primaryServiceArea.state,
              onChange: (e) => {
                handleStateChange(e.target.value);
              },
              className: `w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${errors.state ? "border-red-500 bg-red-900/20" : "border-stone-700 bg-stone-700"} text-white`,
              placeholder: "CA, NY, TX",
              maxLength: 2
            }
          ),
          errors.state && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-red-400", children: errors.state })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "primary-zip", className: "block text-sm font-medium text-gray-300 mb-1", children: "ZIP Code" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              id: "primary-zip",
              type: "text",
              value: primaryServiceArea.zip || "",
              onChange: (e) => {
                onLocationUpdate("zip", e.target.value);
              },
              className: "w-full px-3 py-2 border border-stone-700 bg-stone-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500",
              placeholder: "12345 or 12345-6789"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end space-x-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            onClick: handleCancel,
            variant: "secondary",
            size: "sm",
            className: "px-4 py-2",
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            onClick: handleSave,
            variant: "primary",
            size: "sm",
            className: "px-4 py-2",
            children: "Save"
          }
        )
      ] })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "block text-sm font-medium text-gray-300 mb-1", children: "City" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-4 w-4 text-gray-400" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white", children: primaryServiceArea.city })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "block text-sm font-medium text-gray-300 mb-1", children: "State" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white", children: primaryServiceArea.state })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "block text-sm font-medium text-gray-300 mb-1", children: "ZIP Code" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white", children: primaryServiceArea.zip || "N/A" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          onClick: () => {
            onEditModeChange(true);
          },
          variant: "secondary",
          size: "sm",
          className: "px-4 py-2 bg-stone-700 hover:bg-stone-600 text-sm font-medium rounded-lg",
          children: "Edit Location"
        }
      ) })
    ] }) })
  ] });
};

const ServiceAreasList = ({
  locationsByState,
  stateNames,
  expandedStates,
  isEditMode,
  editingLocationId,
  apiLoaded: _apiLoaded,
  onToggleStateExpansion,
  onEditModeChange,
  onStartEditingLocation,
  onStopEditingLocation,
  onLocationUpdate,
  onDeleteLocation,
  onLocationSelect
}) => {
  const [errors, setErrors] = reactExports.useState({});
  const [newLocationForm, setNewLocationForm] = reactExports.useState({
    city: "",
    state: "",
    zip: ""
  });
  const handleStateChange = (locationId, value) => {
    const upperValue = value.toUpperCase();
    onLocationUpdate(locationId, "state", upperValue);
    if (errors[locationId]?.state) {
      setErrors((prev) => ({
        ...prev,
        [locationId]: { ...prev[locationId], state: void 0 }
      }));
    }
  };
  const handleNewLocationInputChange = (field, value) => {
    const processedValue = field === "state" ? value.toUpperCase() : value;
    setNewLocationForm((prev) => ({ ...prev, [field]: processedValue }));
  };
  const handleSave = (locationId, location) => {
    if (!isValidStateCode(location.state)) {
      setErrors((prev) => ({
        ...prev,
        [locationId]: { state: "Please enter a valid 2-letter state code (e.g., CA, NY, TX)" }
      }));
      return;
    }
    setErrors((prev) => {
      const { [locationId]: _removed, ...newErrors } = prev;
      return newErrors;
    });
    onStopEditingLocation();
  };
  const handleCancel = () => {
    setNewLocationForm({ city: "", state: "", zip: "" });
    onEditModeChange(false);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold text-orange-500", children: "Service Areas" }),
        stateNames.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              onClick: () => {
                onToggleStateExpansion("expand-all");
              },
              variant: "ghost",
              size: "sm",
              className: "text-xs text-gray-500 hover:text-orange-500",
              children: "Expand All"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-300", children: "|" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              onClick: () => {
                onToggleStateExpansion("collapse-all");
              },
              variant: "ghost",
              size: "sm",
              className: "text-xs text-gray-500 hover:text-orange-500",
              children: "Collapse All"
            }
          )
        ] })
      ] }),
      !isEditMode && /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          onClick: () => {
            onEditModeChange(true);
          },
          variant: "primary",
          size: "md",
          className: "px-4 py-2 bg-orange-500 hover:bg-orange-600 text-sm font-medium rounded-lg",
          leftIcon: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
          children: "Add Location"
        }
      )
    ] }),
    isEditMode && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-stone-800 border border-stone-700 rounded-lg p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "new-location-city", className: "block text-sm font-medium text-gray-300 mb-1", children: "City *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              id: "new-location-city",
              type: "text",
              value: newLocationForm.city,
              onChange: (e) => {
                handleNewLocationInputChange("city", e.target.value);
              },
              className: "w-full px-3 py-2 border border-stone-700 bg-stone-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500",
              placeholder: "Enter city name"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "new-location-state", className: "block text-sm font-medium text-gray-300 mb-1", children: "State *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              id: "new-location-state",
              type: "text",
              value: newLocationForm.state,
              onChange: (e) => {
                handleNewLocationInputChange("state", e.target.value);
              },
              className: "w-full px-3 py-2 border border-stone-700 bg-stone-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500",
              placeholder: "CA, NY, TX",
              maxLength: 2
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "new-location-zip", className: "block text-sm font-medium text-gray-300 mb-1", children: "ZIP Code" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              id: "new-location-zip",
              type: "text",
              value: newLocationForm.zip,
              onChange: (e) => {
                handleNewLocationInputChange("zip", e.target.value);
              },
              className: "w-full px-3 py-2 border border-stone-700 bg-stone-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500",
              placeholder: "12345 or 12345-6789"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end space-x-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            onClick: handleCancel,
            variant: "secondary",
            size: "sm",
            className: "px-4 py-2",
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            onClick: () => {
              if (!newLocationForm.city.trim()) {
                alert("Please enter a city");
                return;
              }
              if (!newLocationForm.state.trim()) {
                alert("Please enter a state");
                return;
              }
              if (!isValidStateCode(newLocationForm.state)) {
                alert("Please enter a valid 2-letter state code (e.g., CA, NY, TX)");
                return;
              }
              const formData = {
                city: newLocationForm.city.trim(),
                state: newLocationForm.state.trim(),
                zipCode: newLocationForm.zip.trim()
              };
              onLocationSelect(formData);
              setNewLocationForm({ city: "", state: "", zip: "" });
            },
            variant: "primary",
            size: "sm",
            className: "px-4 py-2",
            children: "Save"
          }
        )
      ] })
    ] }) }),
    stateNames.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: stateNames.map((state) => {
      const stateLocations = locationsByState[state];
      const isExpanded = expandedStates.has(state);
      const locationCount = stateLocations?.length || 0;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-stone-800 border border-stone-700 rounded-lg overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => {
              onToggleStateExpansion(state);
            },
            className: "w-full px-6 py-4 flex items-center justify-between hover:bg-stone-700 transition-colors",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-3", children: [
              isExpanded ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-5 w-5 text-orange-500" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-5 w-5 text-orange-500" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-lg font-semibold text-white", children: state }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800", children: [
                locationCount,
                " ",
                locationCount === 1 ? "location" : "locations"
              ] })
            ] })
          }
        ),
        isExpanded && stateLocations && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-t border-stone-700", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-6 space-y-4", children: stateLocations.map((location, index) => {
          const locationId = `${location.city}-${location.state}`;
          const isEditingThisLocation = editingLocationId === locationId;
          return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-stone-700 border border-stone-600 rounded-lg p-4", children: isEditingThisLocation ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: `edit-city-${locationId}`, className: "block text-sm font-medium text-gray-300 mb-1", children: "City *" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    id: `edit-city-${locationId}`,
                    type: "text",
                    value: location.city,
                    onChange: (e) => {
                      onLocationUpdate(locationId, "city", e.target.value);
                    },
                    className: "w-full px-3 py-2 border border-stone-700 bg-stone-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500",
                    placeholder: "Enter city name"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: `edit-state-${locationId}`, className: "block text-sm font-medium text-gray-300 mb-1", children: "State *" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    id: `edit-state-${locationId}`,
                    type: "text",
                    value: location.state,
                    onChange: (e) => {
                      handleStateChange(locationId, e.target.value);
                    },
                    className: `w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${errors[locationId]?.state ? "border-red-500 bg-red-900/20" : "border-stone-700 bg-stone-700"} text-white`,
                    placeholder: "CA, NY, TX",
                    maxLength: 2
                  }
                ),
                errors[locationId]?.state && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-red-400", children: errors[locationId].state })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: `edit-zip-${locationId}`, className: "block text-sm font-medium text-gray-300 mb-1", children: "ZIP Code" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    id: `edit-zip-${locationId}`,
                    type: "text",
                    value: location.zip || "",
                    onChange: (e) => {
                      onLocationUpdate(locationId, "zip", e.target.value);
                    },
                    className: "w-full px-3 py-2 border border-stone-700 bg-stone-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500",
                    placeholder: "12345 or 12345-6789"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end space-x-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  onClick: onStopEditingLocation,
                  variant: "secondary",
                  size: "sm",
                  className: "px-4 py-2",
                  children: "Cancel"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  onClick: () => {
                    handleSave(locationId, location);
                  },
                  variant: "primary",
                  size: "sm",
                  className: "px-4 py-2",
                  children: "Save"
                }
              )
            ] })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: `readonly-city-${locationId}`, className: "block text-sm font-medium text-gray-300 mb-1", children: "City" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  id: `readonly-city-${locationId}`,
                  type: "text",
                  value: location.city,
                  readOnly: true,
                  onClick: () => {
                    onStartEditingLocation(locationId);
                  },
                  className: "w-full px-3 py-2 border border-stone-600 rounded-md bg-stone-600 text-white cursor-pointer hover:bg-stone-500 transition-colors",
                  title: "Click to edit location"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: `readonly-state-${locationId}`, className: "block text-sm font-medium text-gray-300 mb-1", children: "State" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  id: `readonly-state-${locationId}`,
                  type: "text",
                  value: location.state,
                  readOnly: true,
                  onClick: () => {
                    onStartEditingLocation(locationId);
                  },
                  className: "w-full px-3 py-2 border border-stone-600 rounded-md bg-stone-600 text-white cursor-pointer hover:bg-stone-500 transition-colors",
                  title: "Click to edit location"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: `readonly-zip-${locationId}`, className: "block text-sm font-medium text-gray-300 mb-1", children: "ZIP Code" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  id: `readonly-zip-${locationId}`,
                  type: "text",
                  value: location.zip || "N/A",
                  readOnly: true,
                  onClick: () => {
                    onStartEditingLocation(locationId);
                  },
                  className: "w-full px-3 py-2 border border-stone-600 rounded-md bg-stone-600 text-white cursor-pointer hover:bg-stone-500 transition-colors",
                  title: "Click to edit location"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "lg:col-span-2 flex items-end", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                onClick: () => {
                  onDeleteLocation(location);
                },
                variant: "ghost",
                size: "sm",
                className: "text-red-400 hover:text-red-300 hover:bg-red-900/20 p-2",
                title: "Delete location",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" })
              }
            ) })
          ] }) }, `${location.city}-${location.state}-${(index + 1).toString()}`);
        }) }) })
      ] }, state);
    }) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-stone-800 border border-stone-700 rounded-lg p-6 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-12 w-12 text-gray-400 mx-auto mb-4" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-medium text-gray-300 mb-2", children: "No Service Areas" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-500", children: "Add locations where you provide services to get started." })
    ] })
  ] });
};

const useGoogleMaps = () => {
  const [apiLoaded, setApiLoaded] = reactExports.useState(false);
  const checkAPIReady = reactExports.useCallback(async () => {
    try {
      if (!hasImportLibrary()) {
        setTimeout(() => {
          void checkAPIReady();
        }, 250);
        return;
      }
      const g = getGoogle();
      if (!g?.maps.importLibrary) {
        setTimeout(() => {
          void checkAPIReady();
        }, 250);
        return;
      }
      await g.maps.importLibrary("places");
      setApiLoaded(true);
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      console.error("Google Maps API initialization error:", msg);
      setApiLoaded(false);
    }
  }, []);
  const loadGooglePlacesAPI = reactExports.useCallback(() => {
    const g = getGoogle();
    if (g?.maps) {
      setTimeout(() => {
        void checkAPIReady();
      }, 300);
      return;
    }
    if (document.querySelector('script[src*="maps.googleapis.com"]')) {
      setTimeout(() => {
        void checkAPIReady();
      }, 500);
      return;
    }
    const script = document.createElement("script");
    const apiKey = config.googleMapsApiKey;
    if (!apiKey) {
      console.error("Google Maps API key not found. Please set VITE_GOOGLE_MAPS_API_KEY in your .env file");
      setApiLoaded(false);
      return;
    }
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&v=beta&loading=async`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      void setTimeout(() => {
        void checkAPIReady();
      }, 500);
    };
    script.onerror = (err) => {
      const msg = err instanceof Error ? err.message : String(err);
      console.error("Failed to load Google Maps JS API", msg);
      setApiLoaded(false);
    };
    document.head.appendChild(script);
  }, [checkAPIReady]);
  reactExports.useEffect(() => {
    loadGooglePlacesAPI();
  }, [loadGooglePlacesAPI]);
  return { apiLoaded };
};

const useLocationState = () => {
  const [isAddModalOpen, setIsAddModalOpen] = reactExports.useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = reactExports.useState(false);
  const [locationToDelete, setLocationToDelete] = reactExports.useState(null);
  const [isDeleting, setIsDeleting] = reactExports.useState(false);
  const [expandedStates, setExpandedStates] = reactExports.useState(/* @__PURE__ */ new Set());
  const [editingLocationId, setEditingLocationId] = reactExports.useState(null);
  const toggleStateExpansion = reactExports.useCallback((state) => {
    setExpandedStates((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(state)) {
        newSet.delete(state);
      } else {
        newSet.add(state);
      }
      return newSet;
    });
  }, []);
  const expandAllStates = reactExports.useCallback((stateNames) => {
    setExpandedStates(new Set(stateNames));
  }, []);
  const collapseAllStates = reactExports.useCallback(() => {
    setExpandedStates(/* @__PURE__ */ new Set());
  }, []);
  const openDeleteModal = reactExports.useCallback((location) => {
    setLocationToDelete(location);
    setIsDeleteModalOpen(true);
  }, []);
  const closeDeleteModal = reactExports.useCallback(() => {
    setIsDeleteModalOpen(false);
    setLocationToDelete(null);
  }, []);
  const startEditingLocation = reactExports.useCallback((locationId) => {
    setEditingLocationId(locationId);
  }, []);
  const stopEditingLocation = reactExports.useCallback(() => {
    setEditingLocationId(null);
  }, []);
  return {
    // Modal state
    isAddModalOpen,
    setIsAddModalOpen,
    isDeleteModalOpen,
    locationToDelete,
    isDeleting,
    setIsDeleting,
    openDeleteModal,
    closeDeleteModal,
    // State expansion
    expandedStates,
    toggleStateExpansion,
    expandAllStates,
    collapseAllStates,
    // Location editing
    editingLocationId,
    startEditingLocation,
    stopEditingLocation
  };
};

const LocationsTab = () => {
  const { apiLoaded } = useGoogleMaps();
  const {
    primaryServiceArea,
    otherServiceAreas,
    loading,
    error,
    refetch
  } = useTenantBusinessData();
  const {
    isAddModalOpen,
    setIsAddModalOpen,
    isDeleteModalOpen,
    locationToDelete,
    isDeleting,
    setIsDeleting,
    openDeleteModal,
    closeDeleteModal,
    expandedStates,
    toggleStateExpansion,
    expandAllStates,
    collapseAllStates,
    editingLocationId,
    startEditingLocation,
    stopEditingLocation
  } = useLocationState();
  const [isPrimaryEditMode, setIsPrimaryEditMode] = reactExports.useState(false);
  const [isServiceAreaEditMode, setIsServiceAreaEditMode] = reactExports.useState(false);
  const locationsByState = reactExports.useMemo(() => {
    const grouped = {};
    otherServiceAreas.forEach((location) => {
      const state = location.state.toUpperCase();
      if (state && !grouped[state]) {
        grouped[state] = [];
      }
      if (state && grouped[state]) {
        grouped[state].push(location);
      }
    });
    Object.keys(grouped).forEach((state) => {
      if (grouped[state]) {
        grouped[state].sort((a, b) => a.city.localeCompare(b.city));
      }
    });
    return grouped;
  }, [otherServiceAreas]);
  const stateNames = reactExports.useMemo(() => {
    return Object.keys(locationsByState).sort();
  }, [locationsByState]);
  const handleToggleStateExpansion = (state) => {
    if (state === "expand-all") {
      expandAllStates(stateNames);
    } else if (state === "collapse-all") {
      collapseAllStates();
    } else {
      toggleStateExpansion(state);
    }
  };
  const currentTenantSlug = "jps";
  const updatePrimaryServiceAreaField = async (field, value) => {
    if (!primaryServiceArea) return;
    try {
      const updatedArea = { ...primaryServiceArea, [field]: value };
      const allServiceAreas = [updatedArea, ...otherServiceAreas];
      await saveServiceAreas(currentTenantSlug, allServiceAreas);
      refetch();
    } catch (error2) {
      console.error("Error updating primary service area:", error2);
      throw error2;
    }
  };
  const handleAddLocation = async (locationData) => {
    try {
      await addServiceArea(currentTenantSlug, locationData);
      setIsAddModalOpen(false);
      refetch();
      return { success: true };
    } catch (error2) {
      console.error("Error adding location:", error2);
      throw error2;
    }
  };
  const handleDeleteLocation = async () => {
    if (!locationToDelete) return;
    setIsDeleting(true);
    try {
      await deleteServiceArea(currentTenantSlug, locationToDelete.id);
      closeDeleteModal();
      refetch();
    } catch (error2) {
      console.error("Error deleting location:", error2);
      throw error2;
    } finally {
      setIsDeleting(false);
    }
  };
  const handleLocationUpdate = async (locationId, field, value) => {
    try {
      const allServiceAreas = [...primaryServiceArea ? [primaryServiceArea] : [], ...otherServiceAreas];
      const updatedAreas = allServiceAreas.map(
        (area) => area.id === locationId ? { ...area, [field]: value } : area
      );
      await saveServiceAreas(currentTenantSlug, updatedAreas);
      refetch();
    } catch (error2) {
      console.error("Error updating location:", error2);
      throw error2;
    }
  };
  const handleServiceAreaLocationSelect = async (place) => {
    await handleAddLocation({
      city: place.city,
      state: place.state,
      zip: place.zipCode,
      minimum: 0,
      multiplier: 1
    });
  };
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-between", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold text-white", children: "Service Locations" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-400 mt-1", children: "Manage the areas where you provide services" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center py-12", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-3 text-gray-400", children: "Loading locations..." })
      ] })
    ] });
  }
  if (error) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-between", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold text-white", children: "Service Locations" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-400 mt-1", children: "Manage the areas where you provide services" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-red-900/20 border border-red-500/20 rounded-lg p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertCircle, { className: "h-5 w-5 text-red-400 flex-shrink-0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-medium text-red-300", children: "Error Loading Locations" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-red-400 mt-1", children: error })
        ] })
      ] }) })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    primaryServiceArea && /* @__PURE__ */ jsxRuntimeExports.jsx(
      PrimaryServiceArea,
      {
        primaryServiceArea,
        isEditMode: isPrimaryEditMode,
        onEditModeChange: setIsPrimaryEditMode,
        onLocationUpdate: (field, value) => {
          void updatePrimaryServiceAreaField(field, value);
        },
        apiLoaded
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ServiceAreasList,
      {
        locationsByState,
        stateNames,
        expandedStates,
        isEditMode: isServiceAreaEditMode,
        editingLocationId,
        apiLoaded,
        onToggleStateExpansion: handleToggleStateExpansion,
        onEditModeChange: setIsServiceAreaEditMode,
        onStartEditingLocation: startEditingLocation,
        onStopEditingLocation: stopEditingLocation,
        onLocationUpdate: (id, field, value) => {
          void handleLocationUpdate(id, field, value);
        },
        onDeleteLocation: openDeleteModal,
        onLocationSelect: (place) => {
          void handleServiceAreaLocationSelect(place);
        }
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      AddLocationModal,
      {
        isOpen: isAddModalOpen,
        onClose: () => {
          setIsAddModalOpen(false);
        },
        onAdd: handleAddLocation
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      DeleteLocationModal,
      {
        isOpen: isDeleteModalOpen,
        onClose: closeDeleteModal,
        onConfirm: handleDeleteLocation,
        location: locationToDelete,
        isDeleting
      }
    )
  ] });
};

const QuickActions = () => {
  return null;
};

const OverviewTab = () => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(QuickActions, {}) });
};

const useProfileData = () => {
  const [businessData, setBusinessData] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(true);
  const [error, setError] = reactExports.useState(null);
  const [isUpdating, setIsUpdating] = reactExports.useState(false);
  const slug = useTenantSlug();
  reactExports.useEffect(() => {
    const fetchBusinessData = async () => {
      if (!slug) {
        setError("Business slug is required");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`${config.apiUrl}/api/tenants/${slug}`);
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Business not found");
          }
          throw new Error(`Failed to fetch business data: ${response.statusText}`);
        }
        const result = await response.json();
        const data = result.data;
        if (!data) {
          throw new Error("No business data received");
        }
        setBusinessData(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to fetch business data";
        setError(errorMessage);
        console.error("Error fetching business data:", err);
      } finally {
        setLoading(false);
      }
    };
    void fetchBusinessData();
  }, [slug]);
  const updateBusiness = async (data) => {
    if (!slug) {
      setError("Business slug is required");
      return false;
    }
    try {
      setIsUpdating(true);
      setError(null);
      const updateData = {};
      if (data.first_name !== void 0) updateData.first_name = data.first_name;
      if (data.last_name !== void 0) updateData.last_name = data.last_name;
      if (data.personal_phone !== void 0) updateData.personal_phone = data.personal_phone;
      if (data.personal_email !== void 0) updateData.personal_email = data.personal_email;
      if (data.business_name !== void 0) updateData.business_name = data.business_name;
      if (data.business_email !== void 0) updateData.business_email = data.business_email;
      if (data.business_phone !== void 0) updateData.business_phone = data.business_phone;
      if (data.twilio_phone !== void 0) updateData.twilio_phone = data.twilio_phone;
      if (data.business_start_date !== void 0) updateData.business_start_date = data.business_start_date;
      if (data.website !== void 0) updateData.website = data.website;
      if (data.gbp_url !== void 0) updateData.gbp_url = data.gbp_url;
      if (data.facebook_url !== void 0) updateData.facebook_url = data.facebook_url;
      if (data.facebook_enabled !== void 0) updateData.facebook_enabled = data.facebook_enabled;
      if (data.youtube_url !== void 0) updateData.youtube_url = data.youtube_url;
      if (data.youtube_enabled !== void 0) updateData.youtube_enabled = data.youtube_enabled;
      if (data.tiktok_url !== void 0) updateData.tiktok_url = data.tiktok_url;
      if (data.tiktok_enabled !== void 0) updateData.tiktok_enabled = data.tiktok_enabled;
      if (data.instagram_url !== void 0) updateData.instagram_url = data.instagram_url;
      if (data.instagram_enabled !== void 0) updateData.instagram_enabled = data.instagram_enabled;
      const response = await fetch(`${config.apiUrl}/api/tenants/${slug}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(updateData)
      });
      if (!response.ok) {
        throw new Error(`Failed to update business data: ${response.statusText}`);
      }
      const result = await response.json();
      const updatedData = result.data;
      setBusinessData((prev) => ({ ...prev, ...updateData }));
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update business data";
      setError(errorMessage);
      console.error("Error updating business data:", err);
      return false;
    } finally {
      setIsUpdating(false);
    }
  };
  return {
    businessData,
    loading,
    error,
    updateBusiness,
    isUpdating
  };
};

const formatTwilioPhone = (input) => {
  if (!input) return "";
  const cleaned = input.replace(/[^\d+]/g, "");
  if (cleaned.startsWith("+1") && cleaned.length === 12) {
    const digits = cleaned.slice(2);
    return `+1 (${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  if (cleaned.length === 10) {
    return `+1 (${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  if (cleaned.length === 11 && cleaned.startsWith("1")) {
    const digits = cleaned.slice(1);
    return `+1 (${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  return cleaned;
};
const getTwilioPhoneDigits = (input) => {
  if (!input) return "";
  const cleaned = input.replace(/[^\d+]/g, "");
  if (cleaned.startsWith("+1") && cleaned.length === 12) {
    return cleaned;
  }
  if (cleaned.length === 10) {
    return `+1${cleaned}`;
  }
  if (cleaned.length === 11 && cleaned.startsWith("1")) {
    return `+${cleaned}`;
  }
  return cleaned;
};
function useAutoSaveField(options) {
  const { debounce = 1e3, field } = options;
  const { updateBusiness, businessData } = useProfileData();
  const getCurrentValue = () => {
    if (!businessData) return "";
    switch (field) {
      case "personal_phone":
      case "business_phone":
        return businessData[field] ? formatPhoneNumber(businessData[field]) : "";
      case "twilio_phone":
        return businessData[field] ? formatTwilioPhone(businessData[field]) : "";
      case "business_start_date":
        return businessData[field] ? new Date(businessData[field]).toISOString().split("T")[0] : "";
      default: {
        const value = businessData[field];
        if (value === null || value === void 0 || value === "null" || value === "") {
          return "";
        }
        return typeof value === "string" ? value : String(value);
      }
    }
  };
  const [currentValue, setCurrentValue] = reactExports.useState(() => getCurrentValue());
  reactExports.useEffect(() => {
    setCurrentValue(getCurrentValue());
  }, [businessData, field]);
  const saveField = async (value) => {
    if (!businessData) return;
    let saveValue = value;
    if (field === "personal_phone" || field === "business_phone") {
      saveValue = getPhoneDigits(value);
    } else if (field === "twilio_phone") {
      saveValue = getTwilioPhoneDigits(value);
    }
    const updateData = { [field]: saveValue };
    const success = await updateBusiness(updateData);
    if (!success) {
      throw new Error(`Failed to save ${field}`);
    }
  };
  return useAutoSave$1(currentValue, saveField, { debounce });
}

const AutoSaveField = ({
  field,
  label,
  type = "text",
  placeholder,
  className = "",
  debounce = 1e3
}) => {
  const { value, setValue, isSaving, error } = useAutoSaveField({
    field,
    debounce
  });
  const handleChange = (newValue) => {
    if (type === "tel" && (field === "personal_phone" || field === "business_phone")) {
      const formatted = formatPhoneNumber(newValue);
      setValue(formatted);
    } else if (type === "tel" && field === "twilio_phone") {
      setValue(newValue);
    } else {
      setValue(newValue);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    AutoSaveInput,
    {
      label,
      type,
      value,
      onChange: handleChange,
      isSaving,
      error,
      placeholder,
      className
    }
  );
};

const ProfileForm = () => {
  const { businessData, updateBusiness, isUpdating } = useProfileData();
  const handleSocialMediaToggle = async (platform, enabled) => {
    const fieldName = `${platform}_enabled`;
    await updateBusiness({ [fieldName]: enabled });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-stone-800 border border-stone-700 rounded-lg p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-3 mb-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { className: "h-6 w-6 text-orange-500" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold text-white", children: "Business Information" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          AutoSaveField,
          {
            field: "business_name",
            label: "Business Name",
            placeholder: "Enter your business name"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          AutoSaveField,
          {
            field: "business_email",
            label: "Business Email",
            type: "email",
            placeholder: "Enter your business email"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          AutoSaveField,
          {
            field: "business_phone",
            label: "Business Phone",
            type: "tel",
            placeholder: "(###) ###-####"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          AutoSaveField,
          {
            field: "twilio_phone",
            label: "Twilio Phone (SMS)",
            type: "tel",
            placeholder: "+1 (###) ###-####"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "md:col-span-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          AutoSaveField,
          {
            field: "business_start_date",
            label: "Business Start Date",
            type: "date"
          }
        ) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-stone-800 border border-stone-700 rounded-lg p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-3 mb-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "h-6 w-6 text-orange-500" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold text-white", children: "Personal Information" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          AutoSaveField,
          {
            field: "first_name",
            label: "First Name",
            placeholder: "Enter your first name"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          AutoSaveField,
          {
            field: "last_name",
            label: "Last Name",
            placeholder: "Enter your last name"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          AutoSaveField,
          {
            field: "personal_phone",
            label: "Personal Phone",
            type: "tel",
            placeholder: "(###) ###-####"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          AutoSaveField,
          {
            field: "personal_email",
            label: "Personal Email",
            type: "email",
            placeholder: "Enter your personal email"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-stone-800 border border-stone-700 rounded-lg p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-3 mb-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link$1, { className: "h-6 w-6 text-orange-500" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold text-white", children: "URLs & Social Media" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium text-gray-300", children: "Website URL (Auto-generated)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-3 py-2 bg-stone-700 border border-stone-600 rounded-md text-gray-400 cursor-not-allowed", children: [
            "http://",
            businessData?.slug || "your-slug",
            ".thatsmartsite.com"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-500", children: "This URL is automatically generated based on your business slug and cannot be changed." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          AutoSaveField,
          {
            field: "gbp_url",
            label: "Google Business Profile URL",
            type: "url",
            placeholder: "https://business.google.com/your-business"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end space-x-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              AutoSaveField,
              {
                field: "facebook_url",
                label: "Facebook URL",
                type: "url",
                placeholder: "https://facebook.com/yourpage",
                disabled: !businessData?.facebook_enabled
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2 pb-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "checkbox",
                  id: "facebook_enabled",
                  checked: businessData?.facebook_enabled ?? true,
                  onChange: (e) => handleSocialMediaToggle("facebook", e.target.checked),
                  disabled: isUpdating,
                  className: "h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded disabled:opacity-50"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "facebook_enabled", className: "text-sm font-medium text-gray-300", children: "Enable" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end space-x-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              AutoSaveField,
              {
                field: "youtube_url",
                label: "YouTube URL",
                type: "url",
                placeholder: "https://youtube.com/@yourchannel",
                disabled: !businessData?.youtube_enabled
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2 pb-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "checkbox",
                  id: "youtube_enabled",
                  checked: businessData?.youtube_enabled ?? true,
                  onChange: (e) => handleSocialMediaToggle("youtube", e.target.checked),
                  disabled: isUpdating,
                  className: "h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded disabled:opacity-50"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "youtube_enabled", className: "text-sm font-medium text-gray-300", children: "Enable" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end space-x-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              AutoSaveField,
              {
                field: "tiktok_url",
                label: "TikTok URL",
                type: "url",
                placeholder: "https://tiktok.com/@yourusername",
                disabled: !businessData?.tiktok_enabled
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2 pb-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "checkbox",
                  id: "tiktok_enabled",
                  checked: businessData?.tiktok_enabled ?? true,
                  onChange: (e) => handleSocialMediaToggle("tiktok", e.target.checked),
                  disabled: isUpdating,
                  className: "h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded disabled:opacity-50"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "tiktok_enabled", className: "text-sm font-medium text-gray-300", children: "Enable" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end space-x-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              AutoSaveField,
              {
                field: "instagram_url",
                label: "Instagram URL",
                type: "url",
                placeholder: "https://instagram.com/yourusername",
                disabled: !businessData?.instagram_enabled
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2 pb-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "checkbox",
                  id: "instagram_enabled",
                  checked: businessData?.instagram_enabled ?? true,
                  onChange: (e) => handleSocialMediaToggle("instagram", e.target.checked),
                  disabled: isUpdating,
                  className: "h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded disabled:opacity-50"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "instagram_enabled", className: "text-sm font-medium text-gray-300", children: "Enable" })
            ] })
          ] })
        ] })
      ] })
    ] })
  ] });
};

const ProfileTab = () => {
  const {
    loading,
    error} = useProfileData();
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center py-12", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-3 text-gray-600", children: "Loading business profile..." })
    ] });
  }
  if (error) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-red-50 border border-red-200 rounded-lg p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(AlertCircle, { className: "h-5 w-5 text-red-500 flex-shrink-0" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-medium text-red-800", children: "Unable to Load Business Profile" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-red-600 mt-1", children: error })
      ] })
    ] }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ProfileForm, {}) });
};

const API_BASE$2 = `${config.apiUrl || ""}/api/schedule`;
async function makeRequest$2(endpoint, options = {}) {
  const url = `${API_BASE$2}${endpoint}`;
  const token = localStorage.getItem("token");
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, 1e4);
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...token && { "Authorization": `Bearer ${token}` },
        ...options.headers
      },
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: "Request failed" }));
      throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("Request timeout");
    }
    console.error("API request failed:", error);
    throw error;
  }
}
const getAppointments = async (startDate, endDate) => {
  const params = new URLSearchParams({ startDate, endDate });
  return makeRequest$2(`/appointments?${params}`);
};
const createAppointment = async (data) => {
  return makeRequest$2("/appointments", {
    method: "POST",
    body: JSON.stringify(data)
  });
};
const updateAppointment = async (id, data) => {
  return makeRequest$2(`/appointments/${id}`, {
    method: "PUT",
    body: JSON.stringify(data)
  });
};

const API_BASE$1 = "/api/schedule";
const makeRequest$1 = async (endpoint, options = {}) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE$1}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
      ...options.headers
    }
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};
const getBlockedDays = async (startDate, endDate) => {
  const params = new URLSearchParams({
    startDate,
    endDate
  });
  return makeRequest$1(`/blocked-days?${params}`);
};
const toggleBlockedDay = async (date, reason) => {
  return makeRequest$1("/blocked-days/toggle", {
    method: "POST",
    body: JSON.stringify({ date, reason })
  });
};

const API_BASE = `${config.apiUrl || ""}/api/schedule`;
async function makeRequest(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const token = localStorage.getItem("token");
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, 1e4);
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...token && { "Authorization": `Bearer ${token}` },
        ...options.headers
      },
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: "Request failed" }));
      throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("Request timeout");
    }
    console.error("API request failed:", error);
    throw error;
  }
}
const getTimeBlocks = async (startDate, endDate) => {
  const params = new URLSearchParams({ startDate, endDate });
  return makeRequest(`/time-blocks?${params}`);
};

const AppointmentModal = ({
  isOpen,
  onClose,
  onSuccess,
  appointment,
  selectedDate,
  selectedTime
}) => {
  const [formData, setFormData] = reactExports.useState({
    title: "",
    description: "",
    service_type: "",
    service_duration: 60,
    start_time: "",
    end_time: "",
    customer_name: "",
    customer_phone: "",
    customer_email: "",
    price: 0,
    deposit: 0,
    notes: "",
    internal_notes: ""
  });
  const [loading, setLoading] = reactExports.useState(false);
  const [error, setError] = reactExports.useState(null);
  const isEdit = !!appointment;
  reactExports.useEffect(() => {
    if (isOpen) {
      if (appointment) {
        setFormData({
          title: appointment.title,
          description: appointment.description || "",
          service_type: appointment.service_type,
          service_duration: appointment.service_duration,
          start_time: appointment.start_time,
          end_time: appointment.end_time,
          customer_name: appointment.customer_name,
          customer_phone: appointment.customer_phone,
          customer_email: appointment.customer_email || "",
          price: appointment.price || 0,
          deposit: appointment.deposit || 0,
          notes: appointment.notes || "",
          internal_notes: appointment.internal_notes || ""
        });
      } else {
        const startTime = selectedTime ? `${selectedDate}T${selectedTime}:00` : `${selectedDate}T09:00:00`;
        const endTime = selectedTime ? new Date(new Date(startTime).getTime() + 60 * 60 * 1e3).toISOString() : new Date(new Date(startTime).getTime() + 60 * 60 * 1e3).toISOString();
        setFormData({
          title: "",
          description: "",
          service_type: "",
          service_duration: 60,
          start_time: startTime,
          end_time: endTime,
          customer_name: "",
          customer_phone: "",
          customer_email: "",
          price: 0,
          deposit: 0,
          notes: "",
          internal_notes: ""
        });
      }
      setError(null);
    }
  }, [isOpen, appointment, selectedDate, selectedTime]);
  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value
    }));
  };
  const handleDurationChange = (duration) => {
    const startTime = new Date(formData.start_time);
    const endTime = new Date(startTime.getTime() + duration * 60 * 1e3);
    setFormData((prev) => ({
      ...prev,
      service_duration: duration,
      end_time: endTime.toISOString()
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (isEdit) {
        const updateData = {
          id: appointment.id,
          ...formData
        };
        await updateAppointment(appointment.id, updateData);
      } else {
        const createData = formData;
        await createAppointment(createData);
      }
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Error saving appointment:", err);
      setError(err instanceof Error ? err.message : "Failed to save appointment");
    } finally {
      setLoading(false);
    }
  };
  if (!isOpen) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-stone-800 rounded-xl border border-stone-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold text-white", children: isEdit ? "Edit Appointment" : "New Appointment" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "ghost",
          size: "sm",
          onClick: onClose,
          className: "text-gray-400 hover:text-white",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-5 w-5" })
        }
      )
    ] }),
    error && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-4 p-3 bg-red-900/30 border border-red-500 rounded-lg text-red-300", children: error }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: (e) => {
      e.preventDefault();
      void handleSubmit(e);
    }, className: "space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { htmlFor: "appointment-title", className: "block text-sm font-medium text-gray-300 mb-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "inline h-4 w-4 mr-2" }),
            "Title *"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              id: "appointment-title",
              type: "text",
              name: "title",
              value: formData.title,
              onChange: handleInputChange,
              required: true,
              className: "w-full px-3 py-2 bg-stone-700 border border-stone-600 rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { htmlFor: "appointment-service-type", className: "block text-sm font-medium text-gray-300 mb-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "inline h-4 w-4 mr-2" }),
            "Service Type *"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              id: "appointment-service-type",
              type: "text",
              name: "service_type",
              value: formData.service_type,
              onChange: handleInputChange,
              required: true,
              className: "w-full px-3 py-2 bg-stone-700 border border-stone-600 rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "appointment-description", className: "block text-sm font-medium text-gray-300 mb-2", children: "Description" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "textarea",
          {
            id: "appointment-description",
            name: "description",
            value: formData.description,
            onChange: handleInputChange,
            rows: 3,
            className: "w-full px-3 py-2 bg-stone-700 border border-stone-600 rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "appointment-start-time", className: "block text-sm font-medium text-gray-300 mb-2", children: "Start Time *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              id: "appointment-start-time",
              type: "datetime-local",
              name: "start_time",
              value: formData.start_time.slice(0, 16),
              onChange: handleInputChange,
              required: true,
              className: "w-full px-3 py-2 bg-stone-700 border border-stone-600 rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "appointment-duration", className: "block text-sm font-medium text-gray-300 mb-2", children: "Duration (minutes) *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "select",
            {
              id: "appointment-duration",
              name: "service_duration",
              value: formData.service_duration,
              onChange: (e) => {
                handleDurationChange(Number(e.target.value));
              },
              required: true,
              className: "w-full px-3 py-2 bg-stone-700 border border-stone-600 rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: 30, children: "30 minutes" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: 60, children: "1 hour" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: 90, children: "1.5 hours" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: 120, children: "2 hours" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: 180, children: "3 hours" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: 240, children: "4 hours" })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "appointment-end-time", className: "block text-sm font-medium text-gray-300 mb-2", children: "End Time" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              id: "appointment-end-time",
              type: "datetime-local",
              name: "end_time",
              value: formData.end_time.slice(0, 16),
              onChange: handleInputChange,
              required: true,
              className: "w-full px-3 py-2 bg-stone-700 border border-stone-600 rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { htmlFor: "appointment-customer-name", className: "block text-sm font-medium text-gray-300 mb-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "inline h-4 w-4 mr-2" }),
            "Customer Name *"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              id: "appointment-customer-name",
              type: "text",
              name: "customer_name",
              value: formData.customer_name,
              onChange: handleInputChange,
              required: true,
              className: "w-full px-3 py-2 bg-stone-700 border border-stone-600 rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { htmlFor: "appointment-customer-phone", className: "block text-sm font-medium text-gray-300 mb-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "inline h-4 w-4 mr-2" }),
            "Phone *"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              id: "appointment-customer-phone",
              type: "tel",
              name: "customer_phone",
              value: formData.customer_phone,
              onChange: handleInputChange,
              required: true,
              className: "w-full px-3 py-2 bg-stone-700 border border-stone-600 rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { htmlFor: "appointment-customer-email", className: "block text-sm font-medium text-gray-300 mb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "inline h-4 w-4 mr-2" }),
          "Email"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            id: "appointment-customer-email",
            type: "email",
            name: "customer_email",
            value: formData.customer_email,
            onChange: handleInputChange,
            className: "w-full px-3 py-2 bg-stone-700 border border-stone-600 rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { htmlFor: "appointment-price", className: "block text-sm font-medium text-gray-300 mb-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(DollarSign, { className: "inline h-4 w-4 mr-2" }),
            "Price"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              id: "appointment-price",
              type: "number",
              name: "price",
              value: formData.price,
              onChange: handleInputChange,
              min: "0",
              step: "0.01",
              className: "w-full px-3 py-2 bg-stone-700 border border-stone-600 rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { htmlFor: "appointment-deposit", className: "block text-sm font-medium text-gray-300 mb-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(DollarSign, { className: "inline h-4 w-4 mr-2" }),
            "Deposit"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              id: "appointment-deposit",
              type: "number",
              name: "deposit",
              value: formData.deposit,
              onChange: handleInputChange,
              min: "0",
              step: "0.01",
              className: "w-full px-3 py-2 bg-stone-700 border border-stone-600 rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { htmlFor: "appointment-notes", className: "block text-sm font-medium text-gray-300 mb-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "inline h-4 w-4 mr-2" }),
            "Customer Notes"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "textarea",
            {
              id: "appointment-notes",
              name: "notes",
              value: formData.notes,
              onChange: handleInputChange,
              rows: 3,
              className: "w-full px-3 py-2 bg-stone-700 border border-stone-600 rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { htmlFor: "appointment-internal-notes", className: "block text-sm font-medium text-gray-300 mb-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "inline h-4 w-4 mr-2" }),
            "Internal Notes"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "textarea",
            {
              id: "appointment-internal-notes",
              name: "internal_notes",
              value: formData.internal_notes,
              onChange: handleInputChange,
              rows: 3,
              className: "w-full px-3 py-2 bg-stone-700 border border-stone-600 rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end space-x-3 pt-4 border-t border-stone-700", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "button",
            variant: "secondary",
            onClick: onClose,
            disabled: loading,
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "submit",
            variant: "primary",
            disabled: loading,
            className: "bg-orange-500 hover:bg-orange-600",
            children: loading ? "Saving..." : isEdit ? "Update" : "Create"
          }
        )
      ] })
    ] })
  ] }) }) });
};

function getStatusStyles(status) {
  switch (status) {
    case "confirmed":
      return {
        background: "bg-green-900/30 border-green-500",
        badge: "bg-green-900 text-green-300"
      };
    case "scheduled":
      return {
        background: "bg-blue-900/30 border-blue-500",
        badge: "bg-blue-900 text-blue-300"
      };
    case "in_progress":
      return {
        background: "bg-orange-900/30 border-orange-500",
        badge: "bg-orange-900 text-orange-300"
      };
    case "completed":
      return {
        background: "bg-gray-900/30 border-gray-500",
        badge: "bg-gray-900 text-gray-300"
      };
    case "cancelled":
      return {
        background: "bg-red-900/30 border-red-500",
        badge: "bg-red-900 text-red-300"
      };
    default:
      return {
        background: "bg-yellow-900/30 border-yellow-500",
        badge: "bg-yellow-900 text-yellow-300"
      };
  }
}
function generateTimeSlots() {
  return Array.from({ length: 12 }, (_, i) => {
    const hour = i + 8;
    return `${hour.toString().padStart(2, "0")}:00`;
  });
}

const DayView = ({
  selectedDate,
  appointments,
  timeBlocks,
  onEditAppointment,
  onCreateAppointment
}) => {
  const timeSlots = generateTimeSlots();
  const getAppointmentForDateTime = (date, time) => {
    return appointments.find((apt) => {
      const startTime = new Date(apt.start_time);
      const appointmentDate = startTime.toISOString().split("T")[0];
      const timeString = startTime.toTimeString().slice(0, 5);
      return appointmentDate === date && timeString === time;
    });
  };
  const getTimeBlockForDateTime = (date, time) => {
    return timeBlocks.find((block) => {
      const startTime = new Date(block.start_time);
      const endTime = new Date(block.end_time);
      const blockDate = startTime.toISOString().split("T")[0];
      const slotTime = /* @__PURE__ */ new Date(`${date}T${time}:00`);
      return blockDate === date && slotTime >= startTime && slotTime < endTime;
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: timeSlots.map((time) => {
    const appointment = getAppointmentForDateTime(selectedDate, time);
    const timeBlock = getTimeBlockForDateTime(selectedDate, time);
    const { background, badge } = appointment ? getStatusStyles(appointment.status) : { background: "", badge: "" };
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center border-b border-stone-700 last:border-b-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 text-gray-400 text-sm font-medium py-3", children: time }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 py-2", children: appointment ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          className: `w-full text-left p-3 rounded-lg border-l-4 cursor-pointer hover:opacity-80 transition-opacity ${background}`,
          onClick: () => {
            onEditAppointment(appointment);
          },
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-white", children: appointment.customer_name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-300 text-sm", children: appointment.title }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-gray-400 text-xs", children: [
                appointment.service_duration,
                " minutes"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-300 text-sm", children: appointment.customer_phone }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `inline-block px-2 py-1 rounded-full text-xs font-medium ${badge}`, children: appointment.status.replace("_", " ") })
            ] })
          ] })
        }
      ) : timeBlock ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-3 rounded-lg border-l-4 bg-gray-900/30 border-gray-500", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-white", children: timeBlock.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-300 text-sm", children: timeBlock.description }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-400 text-xs", children: timeBlock.block_type })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-block px-2 py-1 rounded-full text-xs font-medium bg-gray-900 text-gray-300", children: timeBlock.block_type }) })
      ] }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          className: "h-12 w-full text-left flex items-center text-gray-500 text-sm cursor-pointer hover:text-white hover:bg-stone-700/50 rounded-lg transition-colors",
          onClick: () => {
            onCreateAppointment(time, selectedDate);
          },
          children: "Available - Click to add appointment"
        }
      ) })
    ] }, time);
  }) });
};

const AppointmentCard = ({
  appointment,
  onEdit,
  compact = false
}) => {
  const { background, badge } = getStatusStyles(appointment.status);
  if (compact) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        className: `w-full text-left p-1 rounded text-xs cursor-pointer hover:opacity-80 transition-opacity ${background}`,
        onClick: (e) => {
          e.stopPropagation();
          onEdit(appointment);
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "truncate", children: appointment.customer_name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "truncate text-xs opacity-75", children: appointment.title })
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "button",
    {
      type: "button",
      className: `w-full text-left p-3 rounded-lg border-l-4 cursor-pointer hover:opacity-80 transition-opacity ${background}`,
      onClick: () => {
        onEdit(appointment);
      },
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-white text-sm", children: appointment.customer_name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-300 text-xs", children: appointment.title })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-gray-400", children: [
            new Date(appointment.start_time).toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
              hour12: true
            }),
            " - ",
            new Date(appointment.end_time).toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
              hour12: true
            })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-gray-400", children: [
            appointment.service_duration,
            " minutes"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-gray-400", children: appointment.customer_phone })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pt-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `inline-block px-2 py-1 rounded-full text-xs font-medium ${badge}`, children: appointment.status.replace("_", " ") }) })
      ] })
    }
  );
};

const MonthView = ({
  selectedDate,
  appointments,
  blockedDays,
  onEditAppointment,
  onToggleDayBlock
}) => {
  const selectedDateObj = parseLocalDate(selectedDate);
  const yearNum = selectedDateObj.getFullYear();
  const monthNum = selectedDateObj.getMonth();
  const firstDay = new Date(yearNum, monthNum, 1);
  const firstDayOfWeek = firstDay.getDay();
  const mondayOffset = firstDayOfWeek === 0 ? -6 : 1 - firstDayOfWeek;
  const startDate = new Date(firstDay);
  startDate.setDate(firstDay.getDate() + mondayOffset);
  const calendarDays = [];
  for (let i = 0; i < 42; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    calendarDays.push(date);
  }
  const monthAppointments = appointments.filter((apt) => {
    const aptDate = new Date(apt.start_time);
    return aptDate.getFullYear() === yearNum && aptDate.getMonth() === monthNum;
  });
  const today = getToday();
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-full", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-7 gap-1 mb-2", children: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-2 text-gray-400 text-sm font-medium", children: day }, day)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-7 gap-1", children: calendarDays.map((date, index) => {
      const isCurrentMonth = date.getMonth() === monthNum;
      const dateString = formatDateToYYYYMMDD(date);
      const isToday = dateString === today;
      const isBlocked = blockedDays.has(dateString);
      const dayAppointments = monthAppointments.filter((apt) => {
        const aptDate = new Date(apt.start_time).toISOString().split("T")[0];
        return aptDate === dateString;
      });
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          className: `w-full text-left min-h-[6rem] p-2 border border-stone-700 rounded-lg relative cursor-pointer transition-all duration-200 ${isCurrentMonth ? "bg-stone-800" : "bg-stone-900/50"} ${isToday ? "ring-2 ring-orange-500" : ""} ${isBlocked ? "bg-red-900/20 border-red-500" : ""}`,
          onClick: () => {
            void onToggleDayBlock(dateString).catch((err) => {
              console.error(err);
            });
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `text-sm font-medium mb-1 ${isCurrentMonth ? "text-white" : "text-gray-500"} ${isToday ? "text-orange-300" : ""}`, children: date.getDate() }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              !isBlocked && dayAppointments.slice(0, 3).map((appointment) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                AppointmentCard,
                {
                  appointment,
                  onEdit: onEditAppointment,
                  compact: true
                },
                appointment.id
              )),
              !isBlocked && dayAppointments.length > 3 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-gray-400", children: [
                "+",
                dayAppointments.length - 3,
                " more"
              ] })
            ] }),
            isBlocked && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 flex items-center justify-center pointer-events-none", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-8 h-8 text-red-500 opacity-80", strokeWidth: 3 }) })
          ]
        },
        index
      );
    }) })
  ] }) });
};

const ScheduleLoadingState = ({ viewMode }) => {
  const timeSlots = generateTimeSlots();
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-stone-800 rounded-xl border border-stone-700 p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "animate-pulse space-y-4", children: viewMode === "day" ? timeSlots.map((time) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-12 bg-stone-700 rounded" }, time)) : viewMode === "week" ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-7 gap-4", children: Array.from({ length: 7 }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-[200px] bg-stone-700 rounded-xl animate-pulse" }, i)) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-7 gap-1", children: Array.from({ length: 42 }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-24 bg-stone-700 rounded" }, i)) }) }) });
};

const ScheduleNavigationHeader = ({
  selectedDate,
  viewMode,
  onNavigateMonth,
  onNavigateWeek
}) => {
  const getTitle = () => {
    const date = parseLocalDate(selectedDate);
    switch (viewMode) {
      case "day":
        return date.toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric"
        });
      case "week":
      case "month":
        return "";
      default:
        return "";
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4 flex items-center justify-between relative", children: [
    getTitle() && /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold text-white", children: getTitle() }),
    viewMode === "week" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute left-1/2 transform -translate-x-1/2 flex items-center space-x-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => {
            onNavigateWeek("prev");
          },
          className: "text-gray-300 hover:text-white hover:bg-stone-700 p-2 rounded transition-colors",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "h-6 w-6" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg font-semibold text-white", children: formatWeekRange(selectedDate) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => {
            onNavigateWeek("next");
          },
          className: "text-gray-300 hover:text-white hover:bg-stone-700 p-2 rounded transition-colors",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-6 w-6" })
        }
      )
    ] }),
    viewMode === "month" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute left-1/2 transform -translate-x-1/2 flex items-center space-x-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => {
            onNavigateMonth("prev");
          },
          className: "text-gray-300 hover:text-white hover:bg-stone-700 p-2 rounded transition-colors",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "h-6 w-6" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg font-semibold text-white", children: formatMonthYear(selectedDate) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => {
            onNavigateMonth("next");
          },
          className: "text-gray-300 hover:text-white hover:bg-stone-700 p-2 rounded transition-colors",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-6 w-6" })
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Filter, { className: "h-4 w-4 text-gray-400" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "h-4 w-4 text-gray-400" })
    ] })
  ] });
};

const WeekView = ({
  selectedDate,
  appointments,
  timeBlocks,
  blockedDays,
  onEditAppointment,
  onCreateAppointment,
  onToggleDayBlock
}) => {
  const weekDates = getWeekDates(selectedDate);
  const today = getToday();
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-7 gap-4", children: weekDates.map((date) => {
    const dateObj = parseLocalDate(date);
    const isToday = date === today;
    const isCurrentMonth = dateObj.getMonth() === parseLocalDate(selectedDate).getMonth();
    const isBlocked = blockedDays.has(date);
    const dayAppointment = appointments.find((apt) => {
      const aptDate = new Date(apt.start_time).toISOString().split("T")[0];
      return aptDate === date;
    });
    const dayTimeBlock = timeBlocks.find((block) => {
      const blockDate = new Date(block.start_time).toISOString().split("T")[0];
      return blockDate === date;
    });
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        className: `min-h-[200px] p-4 rounded-xl border-2 transition-all duration-200 relative cursor-pointer text-left w-full ${isToday ? "border-orange-500 bg-orange-500/10" : isCurrentMonth ? "border-stone-600 bg-stone-800/50" : "border-stone-700 bg-stone-900/30"} ${isBlocked ? "bg-red-900/20 border-red-500" : ""}`,
        onClick: () => {
          alert("CLICKED: " + date);
          void onToggleDayBlock(date).catch((err) => {
            console.error(err);
          });
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `flex items-center justify-between text-sm font-medium ${isToday ? "text-orange-300" : isCurrentMonth ? "text-white" : "text-gray-500"}`, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: dateObj.toLocaleDateString("en-US", { weekday: "short" }) }),
              !dayAppointment && !dayTimeBlock && !isBlocked && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  className: "w-8 h-8 flex items-center justify-center text-gray-500 hover:text-white hover:bg-orange-500/20 rounded-full transition-all duration-200 cursor-pointer",
                  onClick: (e) => {
                    e.stopPropagation();
                    onCreateAppointment(void 0, date);
                  },
                  "aria-label": "Add appointment",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg font-light", children: "+" })
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `text-lg font-bold ${isToday ? "text-orange-300" : isCurrentMonth ? "text-white" : "text-gray-500"}`, children: dateObj.getDate() })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1", children: dayAppointment ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            AppointmentCard,
            {
              appointment: dayAppointment,
              onEdit: onEditAppointment
            }
          ) : dayTimeBlock ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-3 rounded-lg border-l-4 bg-gray-900/30 border-gray-500", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-white text-sm", children: dayTimeBlock.title }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-300 text-xs", children: dayTimeBlock.description })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-gray-400", children: dayTimeBlock.block_type }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pt-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-block px-2 py-1 rounded-full text-xs font-medium bg-gray-900 text-gray-300", children: dayTimeBlock.block_type }) })
          ] }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full" }) }),
          isBlocked && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 flex items-center justify-center pointer-events-none", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-16 h-16 text-red-500 opacity-80", strokeWidth: 3 }) })
        ]
      },
      date
    );
  }) });
};

const ScheduleGrid = ({
  selectedDate,
  appointments,
  timeBlocks,
  loading,
  viewMode,
  onEditAppointment,
  onCreateAppointment,
  blockedDays,
  onToggleDayBlock,
  onNavigateMonth,
  onNavigateWeek
}) => {
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(ScheduleLoadingState, { viewMode });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-stone-800 rounded-xl border border-stone-700 p-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ScheduleNavigationHeader,
      {
        selectedDate,
        viewMode,
        onNavigateMonth,
        onNavigateWeek
      }
    ),
    viewMode === "day" && /* @__PURE__ */ jsxRuntimeExports.jsx(
      DayView,
      {
        selectedDate,
        appointments,
        timeBlocks,
        onEditAppointment,
        onCreateAppointment
      }
    ),
    viewMode === "week" && /* @__PURE__ */ jsxRuntimeExports.jsx(
      WeekView,
      {
        selectedDate,
        appointments,
        timeBlocks,
        blockedDays,
        onEditAppointment,
        onCreateAppointment,
        onToggleDayBlock
      }
    ),
    viewMode === "month" && /* @__PURE__ */ jsxRuntimeExports.jsx(
      MonthView,
      {
        selectedDate,
        appointments,
        blockedDays,
        onEditAppointment,
        onToggleDayBlock
      }
    )
  ] });
};

const ScheduleHeader = ({
  selectedDate,
  setSelectedDate,
  viewMode,
  setViewMode,
  onCreateAppointment,
  onGoToToday
}) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-stone-800 rounded-xl border border-stone-700 p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col lg:flex-row items-start lg:items-center justify-between space-y-4 lg:space-y-0", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-6 w-6 text-orange-500" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold text-white", children: "Schedule" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex bg-stone-700 rounded-lg p-1", children: ["day", "week", "month"].map((mode) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          onClick: () => {
            setViewMode(mode);
          },
          variant: viewMode === mode ? "primary" : "ghost",
          size: "sm",
          className: `px-3 py-1 rounded-md text-sm font-medium capitalize ${viewMode === mode ? "bg-orange-500 text-white" : "text-gray-300 hover:text-white"}`,
          children: mode
        },
        mode
      )) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          type: "date",
          id: "schedule-date",
          name: "selectedDate",
          value: selectedDate,
          onChange: (e) => {
            setSelectedDate(e.target.value);
          },
          className: "bg-stone-700 border border-stone-600 text-white rounded-lg px-3 py-2 text-sm"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "secondary",
          size: "sm",
          className: "bg-stone-700 hover:bg-stone-600 text-white px-3 py-2 rounded-lg text-sm",
          onClick: onGoToToday,
          children: "Today"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "primary",
          size: "md",
          className: "bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium flex items-center",
          leftIcon: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
          onClick: onCreateAppointment,
          children: "New Appointment"
        }
      )
    ] })
  ] }) });
};

const ScheduleSidebar = ({ viewMode }) => {
  const renderSummary = () => {
    if (viewMode === "month") {
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-stone-800 rounded-xl border border-stone-700 p-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold text-white mb-4", children: "Monthly Summary" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-300", children: "Total Appointments" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white font-semibold", children: "32" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-300", children: "Confirmed" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-green-400 font-semibold", children: "28" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-300", children: "Pending" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-yellow-400 font-semibold", children: "4" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-300", children: "Blocked Days" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-400 font-semibold", children: "3" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-stone-800 rounded-xl border border-stone-700 p-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold text-white mb-4", children: "Monthly Revenue Summary" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-300", children: "Total Booked" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-blue-400 font-semibold", children: "$12,800" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-300", children: "Collected" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-green-400 font-semibold", children: "$9,600" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-300", children: "Remaining" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-orange-400 font-semibold", children: "$3,200" })
            ] })
          ] })
        ] })
      ] });
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-stone-800 rounded-xl border border-stone-700 p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold text-white mb-4", children: "Weekly Summary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-300", children: "Total Appointments" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white font-semibold", children: "8" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-300", children: "Confirmed" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-green-400 font-semibold", children: "6" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-300", children: "Pending" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-yellow-400 font-semibold", children: "2" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-300", children: "Blocked Days" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-400 font-semibold", children: "1" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-stone-800 rounded-xl border border-stone-700 p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold text-white mb-4", children: "Weekly Revenue Summary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-300", children: "Total Booked" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-blue-400 font-semibold", children: "$3,200" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-300", children: "Collected" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-green-400 font-semibold", children: "$2,400" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-300", children: "Remaining" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-orange-400 font-semibold", children: "$800" })
          ] })
        ] })
      ] })
    ] });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-6", children: renderSummary() });
};

const useScheduleData = (selectedDate, viewMode = "day") => {
  const [appointments, setAppointments] = reactExports.useState([]);
  const [timeBlocks, setTimeBlocks] = reactExports.useState([]);
  const [blockedDays, setBlockedDays] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [error, setError] = reactExports.useState(null);
  const getDateRange = (date, mode) => {
    const selectedDateObj = new Date(date);
    switch (mode) {
      case "day":
        return { startDate: date, endDate: date };
      case "week": {
        const dayOfWeek = selectedDateObj.getDay();
        const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
        const monday = new Date(selectedDateObj);
        monday.setDate(selectedDateObj.getDate() + mondayOffset);
        const sunday = new Date(monday);
        sunday.setDate(monday.getDate() + 6);
        return {
          startDate: monday.toISOString().split("T")[0],
          endDate: sunday.toISOString().split("T")[0]
        };
      }
      case "month": {
        const firstDay = new Date(selectedDateObj.getFullYear(), selectedDateObj.getMonth(), 1);
        const lastDay = new Date(selectedDateObj.getFullYear(), selectedDateObj.getMonth() + 1, 0);
        return {
          startDate: firstDay.toISOString().split("T")[0],
          endDate: lastDay.toISOString().split("T")[0]
        };
      }
      default:
        return { startDate: date, endDate: date };
    }
  };
  const fetchScheduleData = reactExports.useCallback(async () => {
    if (!selectedDate) return;
    setLoading(true);
    setError(null);
    try {
      const { startDate, endDate } = getDateRange(selectedDate, viewMode);
      const [appointmentsData, timeBlocksData, blockedDaysData] = await Promise.all([
        getAppointments(startDate, endDate),
        getTimeBlocks(startDate, endDate),
        getBlockedDays(startDate, endDate)
      ]);
      setAppointments(appointmentsData);
      setTimeBlocks(timeBlocksData);
      setBlockedDays(blockedDaysData);
    } catch (err) {
      console.error("Error fetching schedule data:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch schedule data");
    } finally {
      setLoading(false);
    }
  }, [selectedDate, viewMode]);
  reactExports.useEffect(() => {
    void fetchScheduleData();
  }, [fetchScheduleData]);
  const refreshData = reactExports.useCallback(() => {
    if (!selectedDate) return;
    setLoading(true);
    setError(null);
    const { startDate, endDate } = getDateRange(selectedDate, viewMode);
    Promise.all([
      getAppointments(startDate, endDate),
      getTimeBlocks(startDate, endDate),
      getBlockedDays(startDate, endDate)
    ]).then(([appointmentsData, timeBlocksData, blockedDaysData]) => {
      setAppointments(appointmentsData);
      setTimeBlocks(timeBlocksData);
      setBlockedDays(blockedDaysData);
    }).catch((err) => {
      console.error("Error fetching schedule data:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch schedule data");
    }).finally(() => {
      setLoading(false);
    });
  }, [selectedDate, viewMode]);
  return {
    appointments,
    timeBlocks,
    blockedDays,
    loading,
    error,
    refreshData
  };
};

const toYmd = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const ScheduleTab = () => {
  const [selectedDate, setSelectedDate] = reactExports.useState(() => toYmd(/* @__PURE__ */ new Date()));
  const [viewMode, setViewMode] = reactExports.useState("day");
  const [isModalOpen, setIsModalOpen] = reactExports.useState(false);
  const [editingAppointment, setEditingAppointment] = reactExports.useState(null);
  const [selectedTime, setSelectedTime] = reactExports.useState();
  const {
    appointments,
    timeBlocks,
    blockedDays: apiBlockedDays,
    isInitialLoading,
    // <- only true on first load
    isRefetching,
    refreshData
  } = useScheduleData(selectedDate, viewMode);
  const [blockedDaysLocal, setBlockedDaysLocal] = reactExports.useState(/* @__PURE__ */ new Set());
  const [isMutatingBlock, setIsMutatingBlock] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (isMutatingBlock) return;
    const next = new Set(
      apiBlockedDays.map((d) => toYmd(new Date(d.blocked_date)))
    );
    setBlockedDaysLocal(next);
  }, [apiBlockedDays, isMutatingBlock]);
  const toggleDayBlock = reactExports.useCallback(async (date) => {
    setIsMutatingBlock(true);
    setBlockedDaysLocal((prev) => {
      const next = new Set(prev);
      if (next.has(date)) next.delete(date);
      else next.add(date);
      return next;
    });
    try {
      await toggleBlockedDay(date);
      refreshData();
    } catch (e) {
      setBlockedDaysLocal((prev) => {
        const next = new Set(prev);
        if (next.has(date)) next.delete(date);
        else next.add(date);
        return next;
      });
      console.error("Error toggling blocked day:", e);
    } finally {
      setIsMutatingBlock(false);
    }
  }, [refreshData]);
  const handleCreateAppointment = reactExports.useCallback((time, date) => {
    setSelectedTime(time);
    if (date) setSelectedDate(date);
    setEditingAppointment(null);
    setIsModalOpen(true);
  }, []);
  const handleEditAppointment = reactExports.useCallback((appointment) => {
    setEditingAppointment(appointment);
    setSelectedTime(void 0);
    setIsModalOpen(true);
  }, []);
  const handleModalClose = reactExports.useCallback(() => {
    setIsModalOpen(false);
    setEditingAppointment(null);
    setSelectedTime(void 0);
  }, []);
  const handleModalSuccess = reactExports.useCallback(() => {
    refreshData();
  }, [refreshData]);
  const goToToday = reactExports.useCallback(() => {
    reactExports.startTransition(() => {
      setSelectedDate(toYmd(/* @__PURE__ */ new Date()));
    });
  }, []);
  const navigateWeek = reactExports.useCallback((direction) => {
    reactExports.startTransition(() => {
      const [y, m, d] = selectedDate.split("-").map(Number);
      const dt = new Date(y, m - 1, d);
      dt.setDate(dt.getDate() + (direction === "prev" ? -7 : 7));
      setSelectedDate(toYmd(dt));
    });
  }, [selectedDate]);
  const navigateMonth = reactExports.useCallback((direction) => {
    reactExports.startTransition(() => {
      const [y, m, d] = selectedDate.split("-").map(Number);
      const dt = new Date(y, m - 1, d);
      dt.setMonth(dt.getMonth() + (direction === "prev" ? -1 : 1));
      setSelectedDate(toYmd(dt));
    });
  }, [selectedDate]);
  const blockedDaysSet = blockedDaysLocal;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ScheduleHeader,
      {
        selectedDate,
        setSelectedDate: (v) => {
          reactExports.startTransition(() => {
            setSelectedDate(v);
          });
        },
        viewMode,
        setViewMode: (v) => {
          reactExports.startTransition(() => {
            setViewMode(v);
          });
        },
        onCreateAppointment: () => {
          handleCreateAppointment();
        },
        onGoToToday: goToToday
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ScheduleGrid,
      {
        selectedDate,
        appointments,
        timeBlocks,
        loading: !!isInitialLoading,
        viewMode,
        onEditAppointment: handleEditAppointment,
        onCreateAppointment: handleCreateAppointment,
        blockedDays: blockedDaysSet,
        onToggleDayBlock: toggleDayBlock,
        onNavigateMonth: navigateMonth,
        onNavigateWeek: navigateWeek,
        isRefreshing: !!isRefetching || isMutatingBlock
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ScheduleSidebar, { viewMode }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      AppointmentModal,
      {
        isOpen: isModalOpen,
        onClose: handleModalClose,
        onSuccess: handleModalSuccess,
        appointment: editingAppointment,
        selectedDate,
        selectedTime
      }
    )
  ] });
};

const CategorySelector = ({
  categories,
  selectedCategory,
  onCategoryChange
}) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4", children: categories.map((category) => {
    const isSelected = selectedCategory === category.id;
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        onClick: () => {
          onCategoryChange(category.id);
        },
        className: `w-full flex items-center space-x-3 p-3 mb-2 rounded-lg text-left transition-colors ${isSelected ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-stone-700 hover:text-white"}`,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: category.name })
      },
      category.id
    );
  }) });
};

const DeleteServiceModal = ({
  isOpen,
  onClose,
  onConfirm,
  serviceName,
  loading
}) => {
  if (!isOpen) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-stone-800 rounded-lg p-6 max-w-md w-full mx-4 border border-stone-700", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertTriangle, { className: "h-6 w-6 text-red-500" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold text-white", children: "Delete Service" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          onClick: onClose,
          variant: "ghost",
          size: "sm",
          className: "text-gray-400 hover:text-white p-1",
          disabled: loading,
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-5 w-5" })
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-gray-300 mb-6", children: [
      "Are you sure you want to delete ",
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-semibold text-white", children: [
        "“",
        serviceName,
        "”"
      ] }),
      "? This action cannot be undone and will remove all associated service tiers."
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex space-x-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          onClick: onClose,
          variant: "outline",
          size: "md",
          className: "flex-1 px-4 py-2 text-gray-300 border-gray-600 hover:bg-gray-700",
          disabled: loading,
          children: "Cancel"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          onClick: onConfirm,
          variant: "destructive",
          size: "md",
          className: "flex-1 px-4 py-2 bg-red-600 hover:bg-red-700",
          loading,
          disabled: loading,
          children: "Delete Service"
        }
      )
    ] })
  ] }) });
};

const CAR_SERVICE_OPTIONS$1 = [];
const CAR_ADDON_SERVICE_OPTIONS = [];
const CAR_INTERIOR_TRIM_SERVICE_OPTIONS = [];
const CAR_WINDOWS_SERVICE_OPTIONS = [];
const CAR_WHEELS_SERVICE_OPTIONS = [];
const VEHICLE_SERVICES = {
  cars: CAR_SERVICE_OPTIONS$1
  // trucks: TRUCK_SERVICE_OPTIONS,
  // rvs: RV_SERVICE_OPTIONS,
  // boats: BOAT_SERVICE_OPTIONS,
  // motorcycles: MOTORCYCLE_SERVICE_OPTIONS,
  // offroad: OFFROAD_SERVICE_OPTIONS,
  // other: OTHER_SERVICE_OPTIONS,
};
const VEHICLE_ADDON_SERVICES = {
  cars: CAR_ADDON_SERVICE_OPTIONS
  // trucks: TRUCK_ADDON_SERVICE_OPTIONS,
  // rvs: RV_ADDON_SERVICE_OPTIONS,
  // boats: BOAT_ADDON_SERVICE_OPTIONS,
  // motorcycles: MOTORCYCLE_ADDON_SERVICE_OPTIONS,
  // offroad: OFFROAD_ADDON_SERVICE_OPTIONS,
  // other: OTHER_ADDON_SERVICE_OPTIONS,
};
const getAddonServicesForService = (serviceName) => {
  const serviceNameLower = serviceName.toLowerCase();
  if (serviceNameLower.includes("trim") || serviceNameLower.includes("interior-trim") || serviceNameLower.includes("interior trim") || serviceNameLower.includes("dash") || serviceNameLower.includes("console") || serviceNameLower.includes("panel")) {
    return CAR_INTERIOR_TRIM_SERVICE_OPTIONS;
  } else if (serviceNameLower.includes("window") || serviceNameLower.includes("glass") || serviceNameLower.includes("windshield") || serviceNameLower.includes("tinted") || serviceNameLower.includes("tint")) {
    return CAR_WINDOWS_SERVICE_OPTIONS;
  } else if (serviceNameLower.includes("wheel") || serviceNameLower.includes("rim") || serviceNameLower.includes("tire") || serviceNameLower.includes("brake") || serviceNameLower.includes("caliper")) {
    return CAR_WHEELS_SERVICE_OPTIONS;
  }
  return CAR_ADDON_SERVICE_OPTIONS;
};
const FeatureDropdown = ({
  selectedFeatures,
  onFeaturesChange,
  vehicleType = "cars",
  categoryType = "service-packages",
  serviceName,
  disabled = false
}) => {
  const [isOpen, setIsOpen] = reactExports.useState(false);
  const [dropdownPosition, setDropdownPosition] = reactExports.useState({ top: 0, left: 0 });
  const dropdownRef = reactExports.useRef(null);
  const availableServices = categoryType === "addons" ? serviceName ? getAddonServicesForService(serviceName) : VEHICLE_ADDON_SERVICES[vehicleType] : VEHICLE_SERVICES[vehicleType];
  const filteredServices = availableServices;
  const selectedServiceObjects = selectedFeatures.map((id) => availableServices.find((s) => s.id === id)).filter(Boolean);
  const handleServiceToggle = (serviceId) => {
    if (selectedFeatures.includes(serviceId)) {
      onFeaturesChange(selectedFeatures.filter((id) => id !== serviceId));
    } else {
      onFeaturesChange([...selectedFeatures, serviceId]);
    }
  };
  reactExports.useEffect(() => {
    const handleClickOutside = (event) => {
      const target = event.target;
      const isInsideButton = dropdownRef.current?.contains(target);
      const isInsideDropdown = document.querySelector("[data-dropdown-portal]")?.contains(target);
      if (!isInsideButton && !isInsideDropdown) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium text-gray-300", children: categoryType === "addons" ? "Addon Services" : "Service Options" }),
    selectedServiceObjects.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-gray-400", children: [
        selectedServiceObjects.length,
        " service",
        selectedServiceObjects.length !== 1 ? "s" : "",
        " selected:"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: selectedServiceObjects.map((service) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "inline-flex items-center gap-2 bg-blue-900 text-blue-200 px-3 py-1 rounded-full text-sm",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: service.name })
        },
        service.id
      )) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", ref: dropdownRef, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: () => {
            if (!isOpen && dropdownRef.current) {
              const rect = dropdownRef.current.getBoundingClientRect();
              setDropdownPosition({
                top: rect.bottom + window.scrollY + 4,
                left: rect.left + window.scrollX
              });
            }
            setIsOpen(!isOpen);
          },
          disabled,
          className: "w-full bg-gray-600 border border-gray-500 rounded px-3 py-2 text-left text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-between",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-300", children: selectedServiceObjects.length > 0 ? `Add more ${categoryType === "addons" ? "addons" : "services"} (${selectedServiceObjects.length} selected)` : `Select ${categoryType === "addons" ? "addons" : "services"}...` }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: `h-4 w-4 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}` })
          ]
        }
      ),
      isOpen && reactDomExports.createPortal(
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            "data-dropdown-portal": true,
            className: "fixed z-[60] w-96 bg-gray-700 border border-gray-600 rounded-lg shadow-lg",
            style: {
              top: dropdownPosition.top,
              left: dropdownPosition.left
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: filteredServices.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "py-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-0", children: filteredServices.map((service) => {
                const isSelected = selectedFeatures.includes(service.id);
                return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: (e) => {
                      e.stopPropagation();
                      handleServiceToggle(service.id);
                    },
                    className: `w-full text-left px-3 py-2 hover:bg-gray-600 transition-colors flex items-center gap-2 ${isSelected ? "bg-blue-900 text-blue-200" : "text-gray-300"}`,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `w-4 h-4 rounded border-2 flex items-center justify-center ${isSelected ? "bg-blue-500 border-blue-500" : "border-gray-400"}`, children: isSelected && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-2 h-2 bg-white rounded-sm" }) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", children: service.name })
                    ]
                  },
                  service.id
                );
              }) }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-3 py-4 text-center text-gray-400 text-sm", children: "No services available" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-3 border-t border-gray-600 bg-gray-800", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-gray-400 text-center", children: [
                "Select ",
                categoryType === "addons" ? "addons" : "services",
                " to add to this service tier"
              ] }) })
            ]
          }
        ),
        document.body
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-gray-400", children: [
      "Choose from our standardized ",
      categoryType === "addons" ? "addon" : "service",
      " list to ensure consistent service descriptions for customers."
    ] })
  ] });
};

class Tier {
  id;
  name;
  price;
  duration;
  serviceOptions;
  // Only service IDs from service.json
  enabled;
  popular;
  constructor(id, name, price, duration) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.duration = duration;
    this.serviceOptions = [];
    this.enabled = true;
    this.popular = false;
  }
  // Add a service option (only service IDs from service.json)
  addServiceOption(option) {
    if (!this.serviceOptions.includes(option)) {
      this.serviceOptions.push(option);
    }
  }
  // Get all features (just the serviceOptions, no complex logic)
  get all_features() {
    return [...this.serviceOptions];
  }
  // Get all service IDs (all options are service IDs now)
  getServiceIds(availableServices) {
    return this.serviceOptions.filter(
      (option) => availableServices.some((service) => service.id === option)
    );
  }
}
class Service {
  id;
  name;
  tiers;
  constructor(id, name) {
    this.id = id;
    this.name = name;
    this.tiers = [];
  }
  addTier(tier) {
    this.tiers.push(tier);
  }
  getTierById(id) {
    return this.tiers.find((tier) => tier.id === id);
  }
  getTierNames() {
    return this.tiers.map((tier) => tier.name);
  }
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      tiers: this.tiers.map((tier) => ({
        id: tier.id,
        name: tier.name,
        price: tier.price,
        duration: tier.duration,
        serviceOptions: tier.serviceOptions,
        enabled: tier.enabled,
        popular: tier.popular
      }))
    };
  }
  static fromJSON(data) {
    const service = new Service(data.id, data.name);
    service.tiers = data.tiers.map((tierData) => {
      const tier = new Tier(tierData.id, tierData.name, tierData.price, tierData.duration);
      tier.enabled = tierData.enabled;
      tier.popular = tierData.popular;
      tier.serviceOptions = tierData.serviceOptions || [];
      return tier;
    });
    return service;
  }
}

const CAR_SERVICE_OPTIONS = [];
const MultiTierPricingModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialTiers = [],
  initialServiceName = "",
  loading = false,
  error = null,
  vehicleType = "cars",
  categoryType = "service-packages"
}) => {
  const [serviceName, setServiceName] = reactExports.useState(initialServiceName);
  const [service, setService] = reactExports.useState(() => {
    if (initialTiers.length > 0) {
      const service2 = new Service("temp-id", initialServiceName);
      initialTiers.forEach((tierData) => {
        const tier = new Tier(tierData.id, tierData.name, tierData.price, tierData.duration);
        tier.serviceOptions = tierData.serviceOptions || [];
        tier.enabled = tierData.enabled;
        tier.popular = tierData.popular;
        service2.addTier(tier);
      });
      return service2;
    } else {
      const service2 = new Service("temp-id", initialServiceName);
      service2.addTier(createDefaultTier());
      return service2;
    }
  });
  const [editingTierId, setEditingTierId] = reactExports.useState(null);
  const [editingTier, setEditingTier] = reactExports.useState(null);
  const scrollContainerRef = reactExports.useRef(null);
  const prevInitialTiersRef = reactExports.useRef(initialTiers);
  const prevInitialServiceNameRef = reactExports.useRef(initialServiceName);
  reactExports.useEffect(() => {
    const hasInitialTiers = initialTiers.length > 0;
    const tiersChanged = JSON.stringify(prevInitialTiersRef.current) !== JSON.stringify(initialTiers);
    const serviceNameChanged = prevInitialServiceNameRef.current !== initialServiceName;
    if (tiersChanged || hasInitialTiers) {
      if (initialTiers.length > 0) {
        const service2 = new Service("temp-id", initialServiceName);
        initialTiers.forEach((tierData) => {
          const tier = new Tier(tierData.id, tierData.name, tierData.price, tierData.duration);
          tier.serviceOptions = tierData.serviceOptions || [];
          tier.enabled = tierData.enabled;
          tier.popular = tierData.popular;
          service2.addTier(tier);
        });
        setService(service2);
      } else {
        const service2 = new Service("temp-id", initialServiceName);
        service2.addTier(createDefaultTier());
        setService(service2);
      }
      setEditingTierId(null);
      setEditingTier(null);
      prevInitialTiersRef.current = initialTiers;
    }
    if (serviceNameChanged) {
      setServiceName(initialServiceName);
      prevInitialServiceNameRef.current = initialServiceName;
    }
  }, [initialTiers, initialServiceName]);
  function createDefaultTier() {
    return new Tier(
      `tier-${Date.now().toString()}-${Math.random().toString(36).substring(2, 11)}`,
      "",
      0,
      60
    );
  }
  const ensureTierInstance = (tier) => {
    if (tier instanceof Tier) {
      return tier;
    } else {
      const tierInstance = new Tier(tier.id, tier.name, tier.price, tier.duration);
      tierInstance.serviceOptions = tier.serviceOptions || [];
      tierInstance.tierCopies = tier.tierCopies || {};
      tierInstance.enabled = tier.enabled;
      tierInstance.popular = tier.popular;
      return tierInstance;
    }
  };
  const addTier = () => {
    setService((prev) => {
      const newService = new Service(prev.id, prev.name);
      prev.tiers.forEach((tier) => {
        newService.addTier(ensureTierInstance(tier));
      });
      newService.addTier(createDefaultTier());
      return newService;
    });
    setTimeout(() => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollLeft = scrollContainerRef.current.scrollWidth;
      }
    }, 100);
  };
  const removeTier = (tierId) => {
    if (service.tiers.length > 1) {
      setService((prev) => {
        const newService = new Service(prev.id, prev.name);
        prev.tiers.forEach((tier) => {
          if (tier.id !== tierId) {
            newService.addTier(ensureTierInstance(tier));
          }
        });
        return newService;
      });
      if (editingTierId === tierId) {
        setEditingTierId(null);
        setEditingTier(null);
      }
    }
  };
  const startEditing = (tier) => {
    setEditingTierId(tier.id);
    setEditingTier({ ...tier });
  };
  const saveTier = () => {
    if (editingTier) {
      setService((prev) => {
        const newService = new Service(prev.id, prev.name);
        prev.tiers.forEach((tier) => {
          if (tier.id === editingTier.id) {
            newService.addTier(editingTier);
          } else {
            newService.addTier(ensureTierInstance(tier));
          }
        });
        return newService;
      });
      setEditingTierId(null);
      setEditingTier(null);
    }
  };
  const cancelEditing = () => {
    setEditingTierId(null);
    setEditingTier(null);
  };
  const updateEditingTier = (field, value) => {
    if (editingTier) {
      setEditingTier({ ...editingTier, [field]: value });
    }
  };
  const handleSubmit = () => {
    if (!serviceName.trim()) {
      return;
    }
    const validTiers = service.tiers.filter((tier) => tier.name.trim() !== "").map((tier) => ({
      id: tier.id,
      name: tier.name,
      price: tier.price,
      duration: tier.duration,
      features: tier.serviceOptions,
      // Convert serviceOptions to features for backend
      enabled: tier.enabled,
      popular: tier.popular
    }));
    if (validTiers.length > 0) {
      onSubmit(serviceName.trim(), validTiers);
    }
  };
  const handleClose = () => {
    if (initialTiers.length > 0) {
      const service2 = new Service("temp-id", initialServiceName);
      initialTiers.forEach((tierData) => {
        const tier = new Tier(tierData.id, tierData.name, tierData.price, tierData.duration);
        tier.serviceOptions = tierData.serviceOptions || [];
        tier.enabled = tierData.enabled;
        tier.popular = tierData.popular;
        service2.addTier(tier);
      });
      setService(service2);
    } else {
      const service2 = new Service("temp-id", initialServiceName);
      service2.addTier(createDefaultTier());
      setService(service2);
    }
    setServiceName(initialServiceName);
    setEditingTierId(null);
    setEditingTier(null);
    onClose();
  };
  if (!isOpen) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gray-800 rounded-lg w-full max-w-6xl max-h-[90vh] overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-6 border-b border-gray-700", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-semibold text-white", children: "Multi-Tier Pricing" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          onClick: handleClose,
          variant: "ghost",
          size: "sm",
          className: "text-gray-400 hover:text-white p-2",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-6 w-6" })
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 overflow-y-auto max-h-[calc(90vh-140px)]", children: [
      error && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-4 p-3 bg-red-900 border border-red-700 rounded-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-red-200 text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Error:" }),
        " ",
        error
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "service-name", className: "block text-sm font-medium text-gray-300 mb-2", children: "Service Name" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            id: "service-name",
            type: "text",
            value: serviceName,
            onChange: (e) => {
              setServiceName(e.target.value);
            },
            className: "w-full bg-gray-600 border border-gray-500 rounded px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500",
            placeholder: "e.g., Premium Auto Detail, Basic Wash, etc."
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-medium text-white", children: "Service Tiers" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              onClick: addTier,
              variant: "primary",
              size: "md",
              className: "px-4 py-2",
              leftIcon: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
              children: "Add Tier"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            ref: scrollContainerRef,
            className: "flex gap-4 overflow-x-auto pb-4",
            style: {
              scrollbarWidth: "thin",
              scrollbarColor: "#6B7280 #374151"
            },
            children: service.tiers.map((tier, index) => {
              const tierInstance = ensureTierInstance(tier);
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: `min-w-[300px] bg-gray-700 rounded-lg p-4 border-2 ${editingTierId === tierInstance.id ? "border-blue-500" : "border-gray-600"}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-3", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm text-gray-400", children: [
                        "Tier ",
                        index + 1
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
                        editingTierId === tier.id ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            Button,
                            {
                              onClick: saveTier,
                              variant: "ghost",
                              size: "sm",
                              className: "text-green-400 hover:text-green-300 p-1",
                              title: "Save",
                              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "h-4 w-4" })
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            Button,
                            {
                              onClick: cancelEditing,
                              variant: "ghost",
                              size: "sm",
                              className: "text-gray-400 hover:text-gray-300 p-1",
                              title: "Cancel",
                              children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" })
                            }
                          )
                        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                          Button,
                          {
                            onClick: () => {
                              startEditing(tier);
                            },
                            variant: "ghost",
                            size: "sm",
                            className: "text-blue-400 hover:text-blue-300 p-1",
                            title: "Edit",
                            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pen, { className: "h-4 w-4" })
                          }
                        ),
                        service.tiers.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsx(
                          Button,
                          {
                            onClick: () => {
                              removeTier(tier.id);
                            },
                            variant: "ghost",
                            size: "sm",
                            className: "text-red-400 hover:text-red-300 p-1",
                            title: "Remove Tier",
                            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" })
                          }
                        )
                      ] })
                    ] }),
                    editingTierId === tier.id && editingTier ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: `tier-name-${tier.id}`, className: "block text-sm font-medium text-gray-300 mb-1", children: "Tier Name" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "input",
                          {
                            id: `tier-name-${tier.id}`,
                            type: "text",
                            value: editingTier.name,
                            onChange: (e) => {
                              updateEditingTier("name", e.target.value);
                            },
                            className: "w-full bg-gray-600 border border-gray-500 rounded px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500",
                            placeholder: "e.g., Basic, Premium, Ultimate"
                          }
                        )
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: `tier-price-${tier.id}`, className: "block text-sm font-medium text-gray-300 mb-1", children: "Price ($)" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "input",
                          {
                            id: `tier-price-${tier.id}`,
                            type: "text",
                            value: editingTier.price,
                            onChange: (e) => {
                              const value = e.target.value;
                              if (value === "" || /^\d*\.?\d*$/.test(value)) {
                                const numValue = value === "" ? 0 : parseFloat(value) || 0;
                                updateEditingTier("price", numValue);
                              }
                            },
                            className: "w-full bg-gray-600 border border-gray-500 rounded px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500",
                            placeholder: "0.00"
                          }
                        )
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: `tier-duration-${tier.id}`, className: "block text-sm font-medium text-gray-300 mb-1", children: "Duration (minutes)" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "input",
                          {
                            id: `tier-duration-${tier.id}`,
                            type: "text",
                            value: editingTier.duration,
                            onChange: (e) => {
                              const value = e.target.value;
                              if (value === "" || /^\d+$/.test(value)) {
                                const numValue = value === "" ? 0 : parseInt(value, 10);
                                updateEditingTier("duration", numValue);
                              }
                            },
                            className: "w-full bg-gray-600 border border-gray-500 rounded px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500",
                            placeholder: "60"
                          }
                        )
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        FeatureDropdown,
                        {
                          selectedFeatures: editingTier.serviceOptions,
                          onFeaturesChange: (features) => {
                            updateEditingTier("serviceOptions", features);
                          },
                          vehicleType,
                          categoryType,
                          serviceName,
                          disabled: false
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-4", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-2", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "input",
                            {
                              type: "checkbox",
                              checked: editingTier.enabled,
                              onChange: (e) => {
                                updateEditingTier("enabled", e.target.checked);
                              },
                              className: "rounded border-gray-500 text-blue-500 focus:ring-blue-500"
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-gray-300", children: "Enabled" })
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-2", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "input",
                            {
                              type: "checkbox",
                              checked: editingTier.popular,
                              onChange: (e) => {
                                updateEditingTier("popular", e.target.checked);
                              },
                              className: "rounded border-gray-500 text-blue-500 focus:ring-blue-500"
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-gray-300", children: "Popular" })
                        ] })
                      ] })
                    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-medium text-white mb-2", children: tierInstance.name || `Tier ${(index + 1).toString()}` }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-2xl font-bold text-green-400", children: [
                          "$",
                          tierInstance.price.toFixed(2)
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-gray-400", children: [
                          tierInstance.duration,
                          " minutes"
                        ] })
                      ] }),
                      tierInstance.serviceOptions.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("h5", { className: "text-sm font-medium text-gray-300 mb-2", children: "Features:" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-1", children: tierInstance.serviceOptions.map((option) => {
                          const serviceOption = CAR_SERVICE_OPTIONS.find((s) => s.id === option);
                          return /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "text-sm text-gray-300 flex items-center", children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2 h-2 bg-gray-400 rounded-full mr-2" }),
                            serviceOption?.name || option
                          ] }, option);
                        }) })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
                        !tier.enabled && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-900 text-red-200", children: "Disabled" }),
                        tier.popular && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-900 text-yellow-200", children: "Popular" })
                      ] })
                    ] })
                  ]
                },
                tierInstance.id
              );
            })
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-end gap-3 p-6 border-t border-gray-700", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          onClick: handleClose,
          variant: "ghost",
          size: "md",
          className: "px-4 py-2 text-gray-300 hover:text-white",
          children: "Cancel"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          onClick: handleSubmit,
          variant: "primary",
          size: "md",
          loading,
          disabled: !serviceName.trim() || service.tiers.filter((t) => t.name.trim()).length === 0,
          className: "px-6 py-2",
          children: loading ? "Saving..." : "Save Service"
        }
      )
    ] })
  ] }) });
};

const ServiceSelector = ({
  services,
  selectedService,
  onServiceChange
}) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4", children: services.map((service) => {
    const isSelected = selectedService === service.id;
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        onClick: () => {
          onServiceChange(service.id);
        },
        className: `w-full flex items-center space-x-3 p-3 mb-2 rounded-lg text-left transition-colors ${isSelected ? "bg-purple-600 text-white" : "text-gray-300 hover:bg-stone-700 hover:text-white"}`,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: service.name })
      },
      service.id
    );
  }) });
};

const VehicleSelector = ({
  vehicles,
  selectedVehicle,
  onVehicleChange
}) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4", children: vehicles.map((vehicle) => {
    const VehicleIcon = vehicle.icon;
    const isSelected = selectedVehicle === vehicle.id;
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        onClick: () => {
          onVehicleChange(vehicle.id);
        },
        className: `w-full flex items-center space-x-3 p-3 mb-2 rounded-lg text-left transition-colors ${isSelected ? "bg-green-600 text-white" : "text-gray-300 hover:bg-stone-700 hover:text-white"}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(VehicleIcon, { className: "h-5 w-5" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: vehicle.name })
        ]
      },
      vehicle.id
    );
  }) });
};

const useServicesData = () => {
  const [vehicles] = reactExports.useState([
    {
      id: "cars",
      name: "Cars",
      icon: Car,
      categories: [
        {
          id: "service-packages",
          name: "Service Packages",
          color: "bg-green-600",
          services: []
        },
        {
          id: "addons",
          name: "Addons",
          color: "bg-indigo-600",
          services: []
        }
      ]
    },
    {
      id: "suv",
      name: "SUV",
      icon: Car,
      categories: [
        {
          id: "service-packages",
          name: "Service Packages",
          color: "bg-green-600",
          services: []
        },
        {
          id: "addons",
          name: "Addons",
          color: "bg-indigo-600",
          services: []
        }
      ]
    },
    {
      id: "trucks",
      name: "Trucks",
      icon: Truck,
      categories: [
        {
          id: "service-packages",
          name: "Service Packages",
          color: "bg-green-600",
          services: []
        },
        {
          id: "addons",
          name: "Addons",
          color: "bg-indigo-600",
          services: []
        }
      ]
    },
    {
      id: "rvs",
      name: "RVs",
      icon: Home,
      categories: [
        {
          id: "service-packages",
          name: "Service Packages",
          color: "bg-green-600",
          services: []
        },
        {
          id: "addons",
          name: "Addons",
          color: "bg-indigo-600",
          services: []
        }
      ]
    },
    {
      id: "boats",
      name: "Boats",
      icon: Bot,
      categories: [
        {
          id: "service-packages",
          name: "Service Packages",
          color: "bg-green-600",
          services: []
        },
        {
          id: "addons",
          name: "Addons",
          color: "bg-indigo-600",
          services: []
        }
      ]
    },
    {
      id: "motorcycles",
      name: "Motorcycles",
      icon: Bike,
      categories: [
        {
          id: "service-packages",
          name: "Service Packages",
          color: "bg-green-600",
          services: []
        },
        {
          id: "addons",
          name: "Addons",
          color: "bg-indigo-600",
          services: []
        }
      ]
    },
    {
      id: "offroad",
      name: "Off-Road",
      icon: Mountain,
      categories: [
        {
          id: "service-packages",
          name: "Service Packages",
          color: "bg-green-600",
          services: []
        },
        {
          id: "addons",
          name: "Addons",
          color: "bg-indigo-600",
          services: []
        }
      ]
    },
    {
      id: "other",
      name: "Other",
      icon: HelpCircle,
      categories: [
        {
          id: "service-packages",
          name: "Service Packages",
          color: "bg-green-600",
          services: []
        },
        {
          id: "addons",
          name: "Addons",
          color: "bg-indigo-600",
          services: []
        }
      ]
    }
  ]);
  const toggleTierEnabled = () => {
  };
  return {
    vehicles,
    toggleTierEnabled
  };
};

const SimpleFixedServicesTab = () => {
  const [selectedVehicle, setSelectedVehicle] = reactExports.useState("cars");
  const [selectedCategory, setSelectedCategory] = reactExports.useState("service-packages");
  const [selectedService, setSelectedService] = reactExports.useState("");
  const [currentServiceData, setCurrentServiceData] = reactExports.useState(null);
  const [availableServices, setAvailableServices] = reactExports.useState([]);
  const [isMultiTierModalOpen, setIsMultiTierModalOpen] = reactExports.useState(false);
  const [isDeleteServiceModalOpen, setIsDeleteServiceModalOpen] = reactExports.useState(false);
  const [isEditingService, setIsEditingService] = reactExports.useState(false);
  const [loading, setLoading] = reactExports.useState(false);
  const [error, setError] = reactExports.useState(null);
  const lastFetchRef = React.useRef("");
  const authContext = useAuth();
  const user = authContext.user;
  const { businessSlug } = useParams();
  const [adminTenantId, setAdminTenantId] = reactExports.useState(null);
  reactExports.useEffect(() => {
    if (user?.role === "admin" && businessSlug && !adminTenantId) {
      const fetchTenantId = async () => {
        try {
          const response = await fetch(`/api/tenants/${businessSlug}`);
          if (response.ok) {
            const data = await response.json();
            if (data.success && data.tenant?.id) {
              setAdminTenantId(data.tenant.id.toString());
            }
          }
        } catch (err) {
          console.error("Error fetching tenant ID:", err);
        }
      };
      void fetchTenantId();
    }
  }, [user?.role, businessSlug, adminTenantId]);
  const tenantId = user?.tenant_id?.toString() ?? adminTenantId ?? void 0;
  const { vehicles } = useServicesData();
  const fetchServicesDirect = reactExports.useCallback(async (vehicleId, categoryId) => {
    if (!tenantId) return null;
    setLoading(true);
    setError(null);
    try {
      const VEHICLE_ID_MAP = {
        "cars": 1,
        "suv": 3,
        // SUV has its own database ID
        "trucks": 2,
        "rvs": 4,
        "boats": 5,
        "motorcycles": 6,
        "offroad": 7,
        "other": 8
      };
      const CATEGORY_ID_MAP = {
        "interior": 1,
        "exterior": 2,
        "service-packages": 3,
        "addons": 7,
        "ceramic-coating": 4,
        "paint-correction": 5,
        "paint-protection-film": 6
      };
      const dbVehicleId = VEHICLE_ID_MAP[vehicleId];
      const dbCategoryId = CATEGORY_ID_MAP[categoryId];
      if (!dbVehicleId || !dbCategoryId) {
        throw new Error("Invalid vehicle or category ID");
      }
      const response = await fetch(`/api/services/tenant/${tenantId}/vehicle/${vehicleId}/category/${dbCategoryId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch services");
      }
      const data = await response.json();
      return data.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch services");
      return null;
    } finally {
      setLoading(false);
    }
  }, [tenantId]);
  reactExports.useEffect(() => {
    if (selectedVehicle && selectedCategory && tenantId) {
      const fetchKey = `${selectedVehicle}-${selectedCategory}-${tenantId}`;
      if (lastFetchRef.current === fetchKey) {
        return;
      }
      lastFetchRef.current = fetchKey;
      void fetchServicesDirect(selectedVehicle, selectedCategory).then((data) => {
        if (data && Array.isArray(data) && data.length > 0) {
          const services = data.map((serviceData) => {
            const service = serviceData;
            return {
              id: service.id.toString(),
              name: service.name,
              tiers: service.tiers && service.tiers.length > 0 ? service.tiers.map((tier) => ({
                id: tier.id.toString(),
                name: tier.name,
                price: tier.price,
                duration: tier.duration,
                features: tier.features || [],
                enabled: tier.enabled,
                popular: tier.popular || false
              })) : []
            };
          });
          setAvailableServices(services);
          if (!selectedService && services.length > 0) {
            const firstService = services[0];
            if (firstService) {
              setSelectedService(firstService.id);
              setCurrentServiceData(firstService);
            }
          } else if (selectedService) {
            const currentService = services.find((s) => s.id === selectedService);
            if (currentService) {
              setCurrentServiceData(currentService);
            } else if (services.length > 0) {
              const firstService = services[0];
              if (firstService) {
                setSelectedService(firstService.id);
                setCurrentServiceData(firstService);
              }
            }
          }
        } else {
          setCurrentServiceData(null);
          setAvailableServices([]);
          setSelectedService("");
        }
      });
    }
  }, [selectedVehicle, selectedCategory, tenantId, fetchServicesDirect, selectedService]);
  reactExports.useEffect(() => {
    if (selectedService && availableServices.length > 0) {
      const selectedServiceData = availableServices.find((service) => service.id === selectedService);
      if (selectedServiceData) {
        setCurrentServiceData(selectedServiceData);
      }
    }
  }, [selectedService, availableServices]);
  const selectedVehicleData = vehicles.find((v) => v.id === selectedVehicle);
  const selectedCategoryData = selectedVehicleData?.categories.find((c) => c.id === selectedCategory);
  if (user?.role === "admin" && businessSlug && !tenantId) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-12", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-gray-400 mb-4", children: "Loading affiliate data..." }) });
  }
  if (!tenantId) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-12", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-red-400 mb-4", children: "Configuration Error" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-medium text-white mb-2", children: "Affiliate ID not found" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-400 mb-4", children: user?.role === "admin" ? "Unable to load affiliate data. Please check the URL and try again." : "Please log in again or contact support" })
    ] });
  }
  const handleVehicleChange = (vehicleId) => {
    setSelectedVehicle(vehicleId);
    const vehicle = vehicles.find((v) => v.id === vehicleId);
    if (vehicle && vehicle.categories.length > 0) {
      setSelectedCategory(vehicle.categories[0]?.id || "service-packages");
      setSelectedService("");
    }
  };
  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    setSelectedService("");
  };
  const handleEditService = () => {
    if (currentServiceData) {
      setIsEditingService(true);
      setIsMultiTierModalOpen(true);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-stone-800 rounded-lg border border-stone-700 overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 border-b border-stone-700", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-[200px_200px_200px_auto] gap-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold text-white px-4", children: "Vehicle" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold text-white px-4", children: "Category" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold text-white px-4", children: "Service" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-end space-x-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "ghost",
              size: "sm",
              className: "p-2 text-gray-400 hover:text-white",
              title: "Edit Service",
              onClick: handleEditService,
              disabled: !selectedService || !currentServiceData,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { className: "h-5 w-5" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "primary",
              size: "sm",
              className: "p-2 bg-green-500 hover:bg-green-600",
              title: "Add Service",
              onClick: () => {
                setIsEditingService(false);
                setIsMultiTierModalOpen(true);
              },
              leftIcon: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-5 w-5" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "destructive",
              size: "sm",
              className: "p-2 bg-red-500 hover:bg-red-600",
              title: "Delete Service",
              onClick: () => {
                setIsDeleteServiceModalOpen(true);
              },
              disabled: !selectedService || !currentServiceData,
              leftIcon: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-5 w-5" })
            }
          )
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-[200px_200px_200px_auto] gap-0 min-h-[400px]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          VehicleSelector,
          {
            vehicles,
            selectedVehicle,
            onVehicleChange: handleVehicleChange
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          CategorySelector,
          {
            categories: selectedVehicleData?.categories || [],
            selectedCategory,
            onCategoryChange: handleCategoryChange
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          ServiceSelector,
          {
            services: availableServices,
            selectedService,
            onServiceChange: setSelectedService
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", {})
      ] })
    ] }),
    currentServiceData && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-stone-800 rounded-lg border border-stone-700 p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-lg font-semibold text-white mb-4", children: [
        "Selected Service: ",
        currentServiceData.name
      ] }),
      currentServiceData.tiers.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-gray-400 mb-2", children: [
          currentServiceData.tiers.length,
          " tier",
          currentServiceData.tiers.length !== 1 ? "s" : "",
          " configured:"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: currentServiceData.tiers.map((tier, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-stone-700 rounded-lg p-4 border border-stone-600", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-medium text-white", children: tier.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-gray-400", children: [
              "Tier ",
              index + 1
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-2xl font-bold text-green-400", children: [
              "$",
              Number(tier.price).toFixed(2)
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-gray-400", children: [
              tier.duration,
              " minutes"
            ] }),
            tier.features.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-gray-300", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium mb-2", children: "Features:" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "list-disc list-inside space-y-1", children: tier.features.map((feature, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { className: "text-gray-400", children: feature }, idx)) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 mt-3", children: [
              tier.enabled && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-900 text-green-200", children: "Enabled" }),
              tier.popular && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-900 text-yellow-200", children: "Popular" })
            ] })
          ] })
        ] }, tier.id)) })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-gray-400", children: "No tiers configured for this service." })
    ] }),
    loading && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-12", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-gray-400 mb-4", children: "Loading services..." }) }),
    error && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-12", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-red-400 mb-4", children: [
      "Error: ",
      error
    ] }) }),
    availableServices.length === 0 && !loading && !error && selectedCategoryData && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-12", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-gray-400 mb-4", children: "No services configured for this category yet." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-medium text-white mb-2", children: "Add Your First Service" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-400 mb-4", children: "Click the + button above to create your first service and pricing tiers." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      MultiTierPricingModal,
      {
        isOpen: isMultiTierModalOpen,
        onClose: () => {
          setIsMultiTierModalOpen(false);
          setIsEditingService(false);
        },
        onSubmit: (_serviceName, _tiers) => {
          setIsMultiTierModalOpen(false);
          setIsEditingService(false);
        },
        initialTiers: isEditingService ? currentServiceData?.tiers : void 0,
        initialServiceName: isEditingService ? currentServiceData?.name || "" : "",
        loading: loading || false,
        error,
        vehicleType: selectedVehicle,
        categoryType: selectedCategory
      },
      `${isEditingService ? "edit" : "create"}-${currentServiceData?.id || "new"}`
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      DeleteServiceModal,
      {
        isOpen: isDeleteServiceModalOpen,
        onClose: () => {
          setIsDeleteServiceModalOpen(false);
        },
        onConfirm: () => {
          setIsDeleteServiceModalOpen(false);
        },
        serviceName: currentServiceData?.name || "",
        loading: loading || false
      }
    )
  ] });
};

const saveWebsiteContent = async (tenantSlug, contentData) => {
  try {
    const response = await fetch(`/api/website-content/${tenantSlug}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(contentData)
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to save website content");
    }
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error saving website content:", error);
    throw error;
  }
};
const getWebsiteContent = async (tenantSlug) => {
  try {
    const response = await fetch(`/api/website-content/${tenantSlug}`);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to fetch website content");
    }
    const result = await response.json();
    if (!result.content) {
      throw new Error("No content data received from server");
    }
    return result.content;
  } catch (error) {
    console.error("Error fetching website content:", error);
    throw error;
  }
};

const createReview = async (tenantSlug, reviewData) => {
  const response = await fetch("/api/tenant-reviews", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      tenant_slug: tenantSlug,
      ...reviewData
    })
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};
const deleteReview = async (reviewId) => {
  const response = await fetch(`/api/tenant-reviews/${reviewId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json"
    }
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};
const uploadAvatar = async (avatarFile, customerName, reviewId) => {
  const formData = new FormData();
  formData.append("avatar", avatarFile);
  formData.append("customerName", customerName);
  formData.append("reviewId", reviewId.toString());
  const response = await fetch("/api/tenant-reviews/upload-avatar", {
    method: "POST",
    body: formData
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};
const getReviews = async (tenantSlug, options = {}) => {
  const params = new URLSearchParams();
  if (options.limit) params.append("limit", options.limit.toString());
  if (options.offset) params.append("offset", options.offset.toString());
  const response = await fetch(`/api/tenant-reviews/${tenantSlug}?${params}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};
const getBusinessData = async (tenantSlug) => {
  const response = await fetch(`/api/tenants/${tenantSlug}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};
const scrapeGoogleBusinessProfile = async (url, tenantSlug) => {
  const response = await fetch("/api/tenant-reviews/scrape-google-business", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      gbpUrl: url,
      // Backend still expects gbpUrl parameter name
      tenantSlug
    })
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

const AddReviewForm = ({ tenantSlug }) => {
  const [formData, setFormData] = reactExports.useState({
    customerName: "",
    reviewerUrl: "",
    rating: 0,
    comment: "",
    vehicleType: "car",
    paintCorrection: false,
    ceramicCoating: false,
    paintProtectionFilm: false,
    source: "website"
  });
  const [isSubmitting, setIsSubmitting] = reactExports.useState(false);
  const [submitMessage, setSubmitMessage] = reactExports.useState(null);
  const vehicleTypes = [
    { value: "car", label: "Car" },
    { value: "truck", label: "Truck" },
    { value: "suv", label: "SUV" },
    { value: "boat", label: "Boat" },
    { value: "rv", label: "RV" },
    { value: "motorcycle", label: "Motorcycle" }
  ];
  const detectReviewSource = (url) => {
    if (!url) return "website";
    const lowerUrl = url.toLowerCase();
    if (lowerUrl.includes("google.com") || lowerUrl.includes("maps.google") || lowerUrl.includes("google.com/maps")) {
      return "google";
    }
    if (lowerUrl.includes("yelp.com")) {
      return "yelp";
    }
    if (lowerUrl.includes("facebook.com") || lowerUrl.includes("fb.com")) {
      return "facebook";
    }
    return "website";
  };
  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => {
      const newData = {
        ...prev,
        [name]: type === "checkbox" ? e.target.checked : value
      };
      if (name === "reviewerUrl") {
        newData.source = detectReviewSource(value);
      }
      return newData;
    });
  };
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setSubmitMessage({
          type: "error",
          message: "Avatar file must be less than 5MB"
        });
        return;
      }
      setFormData((prev) => ({
        ...prev,
        avatarFile: file
      }));
    }
  };
  const handleRatingClick = (rating) => {
    setFormData((prev) => ({
      ...prev,
      rating
    }));
  };
  const renderStars = (rating, interactive = false) => {
    return Array.from({ length: 5 }, (_, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "button",
        onClick: () => {
          if (interactive) handleRatingClick(index + 1);
        },
        disabled: !interactive,
        className: `h-8 w-8 transition-colors ${index < rating ? "text-yellow-400 fill-current" : "text-gray-300 hover:text-yellow-300"} ${interactive ? "cursor-pointer hover:scale-110" : "cursor-default"}`,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "h-full w-full" })
      },
      index
    ));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.rating === 0) {
      setSubmitMessage({
        type: "error",
        message: "Please select a rating"
      });
      return;
    }
    if (!tenantSlug) {
      setSubmitMessage({
        type: "error",
        message: "Tenant information is missing. Please refresh the page."
      });
      return;
    }
    setIsSubmitting(true);
    setSubmitMessage(null);
    try {
      const reviewData = {
        customer_name: formData.customerName,
        rating: formData.rating,
        comment: formData.comment,
        reviewer_url: formData.reviewerUrl || void 0,
        vehicle_type: formData.vehicleType,
        paint_correction: formData.paintCorrection,
        ceramic_coating: formData.ceramicCoating,
        paint_protection_film: formData.paintProtectionFilm,
        source: formData.source
        // Don't include avatar_filename yet - we'll upload the file first
      };
      const createResponse = await createReview(tenantSlug, reviewData);
      const reviewId = createResponse.data.id;
      if (formData.avatarFile && reviewId) {
        try {
          const _avatarResult = await uploadAvatar(formData.avatarFile, formData.customerName, reviewId);
        } catch (avatarError) {
          console.warn("Avatar upload failed:", avatarError);
        }
      }
      setSubmitMessage({
        type: "success",
        message: "Review published successfully!"
      });
      setFormData({
        customerName: "",
        reviewerUrl: "",
        rating: 0,
        comment: "",
        vehicleType: "car",
        paintCorrection: false,
        ceramicCoating: false,
        paintProtectionFilm: false,
        source: "website"
      });
    } catch (error) {
      setSubmitMessage({
        type: "error",
        message: error instanceof Error ? error.message : "Failed to add review. Please try again."
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  const isFormValid = formData.customerName.trim() && formData.rating > 0 && formData.comment.trim();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold text-white", children: "Add New Review" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-400 text-sm", children: "Add a customer review to showcase your services" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-stone-800 rounded-xl border border-stone-700 p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: (e) => {
      e.preventDefault();
      void handleSubmit(e);
    }, className: "space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { htmlFor: "customerName", className: "flex items-center text-sm font-medium text-white mb-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "h-4 w-4 mr-2" }),
            "Customer Name *"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "text",
              id: "customerName",
              name: "customerName",
              value: formData.customerName,
              onChange: handleInputChange,
              className: "w-full px-4 py-3 bg-stone-700 border border-stone-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent",
              placeholder: "Enter customer name",
              required: true
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { htmlFor: "reviewerUrl", className: "flex items-center text-sm font-medium text-white mb-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link$1, { className: "h-4 w-4 mr-2" }),
            "Reviewer Profile URL"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "url",
              id: "reviewerUrl",
              name: "reviewerUrl",
              value: formData.reviewerUrl,
              onChange: handleInputChange,
              className: "w-full px-4 py-3 bg-stone-700 border border-stone-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent",
              placeholder: "e.g., https://www.google.com/maps/contrib/123456789"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-400 mt-1", children: "Link to reviewer's profile page (Google, Yelp, etc.)" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "vehicleType", className: "block text-sm font-medium text-white mb-2", children: "Vehicle Type" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "select",
          {
            id: "vehicleType",
            name: "vehicleType",
            value: formData.vehicleType,
            onChange: handleInputChange,
            className: "w-1/4 px-3 py-2 bg-stone-700 border border-stone-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent",
            children: vehicleTypes.map((type) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: type.value, children: type.label }, type.value))
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "block text-sm font-medium text-white mb-3", children: "Service Types" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "checkbox",
                id: "paintCorrection",
                name: "paintCorrection",
                checked: formData.paintCorrection,
                onChange: handleInputChange,
                className: "h-4 w-4 text-orange-500 bg-stone-700 border-stone-600 rounded focus:ring-orange-500 focus:ring-2"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "paintCorrection", className: "ml-2 text-sm text-white", children: "Paint Correction" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "checkbox",
                id: "ceramicCoating",
                name: "ceramicCoating",
                checked: formData.ceramicCoating,
                onChange: handleInputChange,
                className: "h-4 w-4 text-orange-500 bg-stone-700 border-stone-600 rounded focus:ring-orange-500 focus:ring-2"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "ceramicCoating", className: "ml-2 text-sm text-white", children: "Ceramic Coating" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "checkbox",
                id: "paintProtectionFilm",
                name: "paintProtectionFilm",
                checked: formData.paintProtectionFilm,
                onChange: handleInputChange,
                className: "h-4 w-4 text-orange-500 bg-stone-700 border-stone-600 rounded focus:ring-orange-500 focus:ring-2"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "paintProtectionFilm", className: "ml-2 text-sm text-white", children: "Paint Protection Film" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { htmlFor: "source", className: "block text-sm font-medium text-white mb-2", children: [
          "Review Source",
          formData.reviewerUrl && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-gray-400 ml-2", children: "(auto-detected)" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "select",
          {
            id: "source",
            name: "source",
            value: formData.source,
            onChange: handleInputChange,
            className: "w-1/4 px-3 py-2 bg-stone-700 border border-stone-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "website", children: "Website" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "google", children: "Google" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "yelp", children: "Yelp" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "facebook", children: "Facebook" })
            ]
          }
        ),
        formData.reviewerUrl && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-400 mt-1", children: "Automatically detected from profile URL. You can change this manually if needed." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "block text-sm font-medium text-white mb-3", children: "Rating *" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-1", children: [
          renderStars(formData.rating, true),
          formData.rating > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-3 text-gray-300", children: [
            formData.rating,
            " out of 5 stars"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { htmlFor: "comment", className: "flex items-center text-sm font-medium text-white mb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { className: "h-4 w-4 mr-2" }),
          "Review Comment *"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "textarea",
          {
            id: "comment",
            name: "comment",
            value: formData.comment,
            onChange: handleInputChange,
            rows: 4,
            className: "w-full px-4 py-3 bg-stone-700 border border-stone-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none",
            placeholder: "Enter the customer's review comment...",
            required: true
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { htmlFor: "avatarFile", className: "flex items-center text-sm font-medium text-white mb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "h-4 w-4 mr-2" }),
          "Avatar Image (Optional)"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "file",
            id: "avatarFile",
            name: "avatarFile",
            accept: "image/*",
            onChange: handleFileChange,
            className: "w-full px-4 py-3 bg-stone-700 border border-stone-600 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-orange-600 file:text-white hover:file:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          }
        ),
        formData.avatarFile && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 text-sm text-gray-400", children: [
          "Selected: ",
          formData.avatarFile.name,
          " (",
          (formData.avatarFile.size / 1024 / 1024).toFixed(2),
          " MB)"
        ] })
      ] }),
      submitMessage && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `flex items-center space-x-2 p-4 rounded-lg ${submitMessage.type === "success" ? "bg-green-900/20 border border-green-700 text-green-400" : "bg-red-900/20 border border-red-700 text-red-400"}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertCircle, { className: "h-5 w-5" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: submitMessage.message })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "submit",
          disabled: !isFormValid || isSubmitting,
          className: `flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${isFormValid && !isSubmitting ? "bg-orange-500 hover:bg-orange-600 text-white shadow-lg hover:shadow-xl" : "bg-gray-600 text-gray-400 cursor-not-allowed"}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "h-4 w-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: isSubmitting ? "Adding Review..." : "Add Review" })
          ]
        }
      ) })
    ] }) })
  ] });
};

const useWebsiteContentData = (tenantSlug) => {
  const [contentData, setContentData] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(true);
  const [error, setError] = reactExports.useState(null);
  const [isUpdating, setIsUpdating] = reactExports.useState(false);
  const [refetchTrigger, setRefetchTrigger] = reactExports.useState(0);
  reactExports.useEffect(() => {
    const fetchContentData = async () => {
      if (!tenantSlug) {
        setError("Tenant slug is required");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`${config.apiUrl}/api/website-content/${tenantSlug}`);
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Website content not found");
          }
          throw new Error(`Failed to fetch website content: ${response.statusText}`);
        }
        const result = await response.json();
        const data = result.content;
        if (!data) {
          throw new Error("No website content received");
        }
        setContentData(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to fetch website content";
        setError(errorMessage);
        console.error("Error fetching website content:", err);
      } finally {
        setLoading(false);
      }
    };
    void fetchContentData();
  }, [tenantSlug, refetchTrigger]);
  const refetch = () => {
    setRefetchTrigger((prev) => prev + 1);
    return Promise.resolve();
  };
  const updateContent = async (data) => {
    if (!tenantSlug) {
      setError("Tenant slug is required");
      return false;
    }
    try {
      setIsUpdating(true);
      setError(null);
      const response = await fetch(`${config.apiUrl}/api/website-content/${tenantSlug}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ ...contentData, ...data })
      });
      if (!response.ok) {
        throw new Error(`Failed to update website content: ${response.statusText}`);
      }
      const result = await response.json();
      const updatedData = result.content;
      if (updatedData) {
        setContentData(updatedData);
      }
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update website content";
      setError(errorMessage);
      console.error("Error updating website content:", err);
      return false;
    } finally {
      setIsUpdating(false);
    }
  };
  return {
    contentData,
    loading,
    error,
    updateContent,
    isUpdating,
    refetch
  };
};

const WebsiteContentContext = reactExports.createContext(void 0);
const WebsiteContentProvider = ({
  tenantSlug,
  children
}) => {
  const value = useWebsiteContentData(tenantSlug);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(WebsiteContentContext.Provider, { value, children });
};
const useWebsiteContent = () => {
  const context = reactExports.useContext(WebsiteContentContext);
  if (!context) {
    throw new Error("useWebsiteContent must be used within WebsiteContentProvider");
  }
  return context;
};

const FAQItemAutoSaveField = ({
  faqIndex,
  field,
  label,
  type = "text",
  placeholder,
  rows = 3
}) => {
  const { contentData, updateContent } = useWebsiteContent();
  const getInitialValue = () => {
    if (!contentData?.faq_items) return "";
    const faqItem = contentData.faq_items[faqIndex];
    if (!faqItem) return "";
    return faqItem[field] || "";
  };
  const saveField = async (value2) => {
    if (!contentData?.faq_items) return;
    const currentItem = contentData.faq_items[faqIndex];
    if (!currentItem) return;
    const updatedFaqItems = [...contentData.faq_items];
    updatedFaqItems[faqIndex] = {
      ...currentItem,
      [field]: value2
    };
    await updateContent({ faq_items: updatedFaqItems });
  };
  const { value, setValue, isSaving, error } = useAutoSave$1(
    getInitialValue(),
    saveField,
    { debounce: 1e3 }
  );
  const handleChange = (e) => {
    setValue(e.target.value);
  };
  const getStatusIcon = () => {
    if (isSaving) {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(Loader2, { className: "h-4 w-4 text-blue-500 animate-spin" });
    }
    if (error) {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(AlertCircle, { className: "h-4 w-4 text-red-500" });
    }
    if (value && value.trim() !== "") {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(CheckCircle, { className: "h-4 w-4 text-green-500" });
    }
    return null;
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs font-medium text-gray-300 mb-1", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
      type === "textarea" ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        "textarea",
        {
          value,
          onChange: handleChange,
          placeholder,
          rows,
          className: `w-full px-3 py-2 pr-10 bg-stone-600 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none ${error ? "border-red-500" : "border-stone-500"}`
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          type,
          value,
          onChange: handleChange,
          placeholder,
          className: `w-full px-3 py-2 pr-10 bg-stone-600 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${error ? "border-red-500" : "border-stone-500"}`
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none", children: getStatusIcon() })
    ] }),
    error && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-red-400", children: error })
  ] });
};

function useWebsiteContentField(options) {
  const { debounce = 1e3, field } = options;
  const { updateContent, contentData } = useWebsiteContent();
  const getInitialValue = () => {
    if (!contentData) return "";
    const value = contentData[field];
    if (typeof value === "number") return String(value);
    if (typeof value === "string") return value;
    return "";
  };
  const saveField = async (value) => {
    if (!contentData) return;
    let saveValue = value;
    if (field === "reviews_avg_rating") {
      saveValue = parseFloat(value) || 0;
    } else if (field === "reviews_total_count") {
      saveValue = parseInt(value, 10) || 0;
    }
    const updateData = { [field]: saveValue };
    const success = await updateContent(updateData);
    if (!success) {
      throw new Error(`Failed to save ${field}`);
    }
  };
  return useAutoSave$1(getInitialValue(), saveField, { debounce });
}

const WebsiteAutoSaveField = ({
  field,
  label,
  type = "text",
  placeholder,
  className = "",
  debounce = 1e3,
  rows = 3,
  step
}) => {
  const { value, setValue, isSaving, error } = useWebsiteContentField({
    field,
    debounce
  });
  const handleChange = (e) => {
    setValue(e.target.value);
  };
  const getStatusIcon = () => {
    if (isSaving) {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(Loader2, { className: "h-4 w-4 text-blue-500 animate-spin" });
    }
    if (error) {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(AlertCircle, { className: "h-4 w-4 text-red-500" });
    }
    if (value && value.trim() !== "") {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(CheckCircle, { className: "h-4 w-4 text-green-500" });
    }
    return null;
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium text-gray-300 mb-2", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
      type === "textarea" ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        "textarea",
        {
          value,
          onChange: handleChange,
          placeholder,
          rows,
          className: `w-full px-3 py-2 pr-10 border rounded-md bg-stone-700 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none ${error ? "border-red-500" : "border-stone-600"} ${className}`
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          type,
          value,
          onChange: handleChange,
          placeholder,
          step,
          className: `w-full px-3 py-2 pr-10 border rounded-md bg-stone-700 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${error ? "border-red-500" : "border-stone-600"} ${className}`
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none", children: getStatusIcon() })
    ] }),
    error && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-red-400", children: error }),
    isSaving && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-blue-400", children: "Saving..." })
  ] });
};

const FAQSection = ({
  faqContent,
  onUpdateContent,
  onResetToDefault
}) => {
  const [isCollapsed, setIsCollapsed] = reactExports.useState(true);
  const [activeTab, setActiveTab] = reactExports.useState("content");
  const [activeCategory, setActiveCategory] = reactExports.useState("Services");
  const faqCategories = [
    "Services",
    "Pricing",
    "Scheduling",
    "Locations",
    "Preparation",
    "Payments",
    "Warranty",
    "Aftercare",
    "General"
  ];
  const { industry } = useData();
  const [industryFAQs, setIndustryFAQs] = React.useState([]);
  React.useEffect(() => {
    if (!industry) return;
    loadIndustryFAQs(industry).then(setIndustryFAQs).catch(() => {
      setIndustryFAQs([]);
    });
  }, [industry]);
  reactExports.useMemo(() => {
    const map = {};
    industryFAQs.forEach((faq) => {
      if (!map[faq.category]) {
        map[faq.category] = [];
      }
      map[faq.category].push(faq);
    });
    return map;
  }, [industryFAQs]);
  const handleAddFAQ = () => {
    const currentContent = faqContent || [];
    const newContent = [...currentContent, {
      question: `New ${activeCategory} question`,
      answer: `New ${activeCategory} answer`,
      category: activeCategory
    }];
    onUpdateContent("content", newContent);
  };
  const handleRemoveFAQ = (globalIndex) => {
    const currentContent = faqContent || [];
    const newContent = currentContent.filter((_item, i) => i !== globalIndex);
    onUpdateContent("content", newContent);
  };
  const customFaqs = (faqContent || []).filter((faq) => faq.category === activeCategory);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-stone-800 rounded-lg p-6 border border-stone-700", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(HelpCircle, { className: "h-5 w-5 text-orange-400 mr-3" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold text-white", children: "FAQ" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => {
            },
            className: "flex items-center px-3 py-1 text-sm text-gray-400 hover:text-white transition-colors",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "h-4 w-4 mr-1" }),
              "Preview"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: onResetToDefault,
            className: "flex items-center px-3 py-1 text-sm text-gray-400 hover:text-white transition-colors",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "h-4 w-4 mr-1" }),
              "Default"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => {
              setIsCollapsed(!isCollapsed);
            },
            className: "flex items-center px-3 py-1 text-sm text-gray-400 hover:text-white transition-colors",
            children: [
              isCollapsed ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-4 w-4 mr-1" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-4 w-4 mr-1" }),
              isCollapsed ? "Expand" : "Collapse"
            ]
          }
        )
      ] })
    ] }),
    !isCollapsed && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex space-x-1 bg-stone-800 rounded-lg p-1 mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => {
              setActiveTab("content");
            },
            className: `flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === "content" ? "bg-orange-500 text-white" : "text-gray-400 hover:text-white hover:bg-stone-700"}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-4 w-4 mr-2" }),
              "Content"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => {
              setActiveTab("categories");
            },
            className: `flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === "categories" ? "bg-orange-500 text-white" : "text-gray-400 hover:text-white hover:bg-stone-700"}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(HelpCircle, { className: "h-4 w-4 mr-2" }),
              "Categories"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "transition-all duration-300 ease-in-out", children: [
        activeTab === "content" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-2/5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            WebsiteAutoSaveField,
            {
              field: "faq_title",
              label: "FAQ Title",
              placeholder: "Enter FAQ title"
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-2/5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            WebsiteAutoSaveField,
            {
              field: "faq_subtitle",
              label: "FAQ Subtitle",
              placeholder: "Enter FAQ subtitle"
            }
          ) })
        ] }),
        activeTab === "categories" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1 bg-stone-800 rounded-lg p-1 mb-4", children: faqCategories.map((category) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => {
                setActiveCategory(category);
              },
              className: `flex items-center px-3 py-2 rounded-md text-xs font-medium transition-colors ${activeCategory === category ? "bg-orange-500 text-white" : "text-gray-400 hover:text-white hover:bg-stone-700"}`,
              children: category
            },
            category
          )) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "block text-sm font-medium text-gray-300", children: [
                activeCategory,
                " FAQs"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  onClick: handleAddFAQ,
                  className: "flex items-center px-3 py-1 bg-orange-500 text-white rounded text-xs hover:bg-orange-600 transition-colors",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3 w-3 mr-1" }),
                    "Add ",
                    activeCategory,
                    " FAQ"
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
              customFaqs.map((faq, categoryIndex) => {
                const currentContent = faqContent || [];
                const globalIndex = currentContent.findIndex((item) => item === faq);
                return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg p-4 bg-stone-700 border border-stone-600", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 gap-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    FAQItemAutoSaveField,
                    {
                      faqIndex: globalIndex,
                      field: "question",
                      label: "Question",
                      placeholder: `Enter ${activeCategory.toLowerCase()} question...`
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    FAQItemAutoSaveField,
                    {
                      faqIndex: globalIndex,
                      field: "answer",
                      label: "Answer",
                      type: "textarea",
                      rows: 3,
                      placeholder: `Enter ${activeCategory.toLowerCase()} answer...`
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "button",
                    {
                      onClick: () => {
                        handleRemoveFAQ(globalIndex);
                      },
                      className: "flex items-center px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700 transition-colors",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3 w-3 mr-1" }),
                        "Remove"
                      ]
                    }
                  ) })
                ] }) }, `${activeCategory}-${categoryIndex}`);
              }),
              customFaqs.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-8 text-gray-400", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(HelpCircle, { className: "h-8 w-8 mx-auto mb-2 opacity-50" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm", children: [
                  "No ",
                  activeCategory,
                  " FAQs yet"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs mt-1", children: [
                  'Click "Add ',
                  activeCategory,
                  ' FAQ" to get started'
                ] })
              ] })
            ] })
          ] })
        ] })
      ] })
    ] })
  ] });
};

const GallerySection = ({
  stockImages,
  customImages,
  onAddCustomImage
}) => {
  const [isCollapsed, setIsCollapsed] = reactExports.useState(true);
  const [activeTab, setActiveTab] = reactExports.useState("stock");
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-stone-800 rounded-lg p-6 border border-stone-700", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Image$1, { className: "h-5 w-5 text-orange-400 mr-3" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold text-white", children: "Gallery" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => {
            },
            className: "flex items-center px-3 py-1 text-sm text-gray-400 hover:text-white transition-colors",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "h-4 w-4 mr-1" }),
              "Preview"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => {
              setIsCollapsed(!isCollapsed);
            },
            className: "flex items-center px-3 py-1 text-sm text-gray-400 hover:text-white transition-colors",
            children: [
              isCollapsed ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-4 w-4 mr-1" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-4 w-4 mr-1" }),
              isCollapsed ? "Expand" : "Collapse"
            ]
          }
        )
      ] })
    ] }),
    !isCollapsed && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex space-x-1 bg-stone-800 rounded-lg p-1 mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => {
              setActiveTab("stock");
            },
            className: `flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === "stock" ? "bg-orange-500 text-white" : "text-gray-400 hover:text-white hover:bg-stone-700"}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Image$1, { className: "h-4 w-4 mr-2" }),
              "Stock"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => {
              setActiveTab("custom");
            },
            className: `flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === "custom" ? "bg-orange-500 text-white" : "text-gray-400 hover:text-white hover:bg-stone-700"}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4 mr-2" }),
              "Custom"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "transition-all duration-300 ease-in-out", children: [
        activeTab === "stock" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "block text-sm font-medium text-gray-300 mb-2", children: "Stock Gallery Images" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-4 gap-4 max-w-6xl", children: stockImages.map((imageItem, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "relative cursor-pointer rounded-lg overflow-hidden border-2 border-stone-600 hover:border-stone-500 transition-all duration-200",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "aspect-square bg-stone-700 relative", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "img",
                  {
                    src: imageItem.src,
                    alt: imageItem.alt,
                    className: "w-full h-full object-cover",
                    onError: (e) => {
                      const target = e.target;
                      target.style.display = "none";
                      const fallback = document.createElement("div");
                      fallback.className = "w-full h-full flex items-center justify-center text-gray-400 text-sm";
                      fallback.textContent = "Image not found";
                      target.parentNode?.appendChild(fallback);
                    }
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2 bg-stone-800", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-300 truncate", children: imageItem.alt }) })
              ]
            },
            `stock-${index}`
          )) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-gray-500 mt-2", children: [
            stockImages.length,
            " stock gallery images loaded from gallery.json"
          ] })
        ] }) }),
        activeTab === "custom" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "block text-sm font-medium text-gray-300", children: "Custom Gallery Images" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                onClick: onAddCustomImage,
                className: "flex items-center px-3 py-1 bg-orange-500 text-white rounded text-xs hover:bg-orange-600 transition-colors",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3 w-3 mr-1" }),
                  "Add Custom Image"
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-4 gap-4 max-w-6xl", children: customImages.map((imageItem, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "relative cursor-pointer rounded-lg overflow-hidden border-2 border-stone-600 hover:border-stone-500 transition-all duration-200",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "aspect-square bg-stone-700 relative", children: imageItem.src ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "img",
                  {
                    src: imageItem.src,
                    alt: imageItem.alt || "Custom gallery image",
                    className: "w-full h-full object-cover",
                    onError: (e) => {
                      const target = e.target;
                      target.style.display = "none";
                      const fallback = document.createElement("div");
                      fallback.className = "w-full h-full flex items-center justify-center text-gray-400 text-sm";
                      fallback.textContent = "Image not found";
                      target.parentNode?.appendChild(fallback);
                    }
                  }
                ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-full flex items-center justify-center text-gray-400 text-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-8 w-8 mx-auto mb-2 opacity-50" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Add Image" })
                ] }) }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2 bg-stone-800", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-300 truncate", children: imageItem.alt || "Custom Image" }) })
              ]
            },
            index
          )) }),
          customImages.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-8 text-gray-400", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Image$1, { className: "h-8 w-8 mx-auto mb-2 opacity-50" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: "No custom images yet" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs mt-1", children: 'Click "Add Custom Image" to get started' })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-gray-500 mt-2", children: [
            customImages.length,
            " custom gallery images"
          ] })
        ] }) })
      ] })
    ] })
  ] });
};

const getHealthStatus = async (tenantSlug) => {
  const response = await fetch(`/api/health-monitoring/${tenantSlug}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};
const triggerHealthScan = async (tenantSlug) => {
  const response = await fetch(`/api/health-monitoring/${tenantSlug}/scan`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    }
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};
const getScoreColor = (score) => {
  if (score >= 90) return "text-green-500";
  if (score >= 70) return "text-yellow-500";
  if (score >= 50) return "text-orange-500";
  return "text-red-500";
};
const formatDisplayValue = (value, unit = "") => {
  if (value === null || value === void 0) return "N/A";
  const numericValue = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(numericValue)) return "N/A";
  if (unit === "ms") {
    return `${Math.round(numericValue)}ms`;
  } else if (unit === "s") {
    return `${(numericValue / 1e3).toFixed(2)}s`;
  } else if (unit === "bytes") {
    if (numericValue > 1024 * 1024) {
      return `${(numericValue / (1024 * 1024)).toFixed(1)}MB`;
    } else if (numericValue > 1024) {
      return `${(numericValue / 1024).toFixed(1)}KB`;
    }
    return `${numericValue}B`;
  }
  return numericValue.toString();
};

const HealthTab = ({ tenantSlug }) => {
  const [healthData, setHealthData] = reactExports.useState(null);
  const [isLoading, setIsLoading] = reactExports.useState(false);
  const [isScanning, setIsScanning] = reactExports.useState(false);
  const [error, setError] = reactExports.useState(null);
  const [scanResult, setScanResult] = reactExports.useState(null);
  const loadHealthData = reactExports.useCallback(async () => {
    if (!tenantSlug) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await getHealthStatus(tenantSlug);
      setHealthData(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load health data");
    } finally {
      setIsLoading(false);
    }
  }, [tenantSlug]);
  const handleScan = async () => {
    if (!tenantSlug) return;
    setIsScanning(true);
    setError(null);
    setScanResult(null);
    try {
      const response = await triggerHealthScan(tenantSlug);
      setScanResult(response.data);
      setTimeout(() => {
        void loadHealthData();
      }, 1e3);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to run health scan");
    } finally {
      setIsScanning(false);
    }
  };
  reactExports.useEffect(() => {
    void loadHealthData();
  }, [loadHealthData]);
  const getStatusIcon = (status) => {
    switch (status) {
      case "healthy":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(CheckCircle, { className: "h-4 w-4 text-green-500" });
      case "warning":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(AlertTriangle, { className: "h-4 w-4 text-yellow-500" });
      case "critical":
      case "error":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(XCircle, { className: "h-4 w-4 text-red-500" });
      default:
        return /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-4 w-4 text-gray-500" });
    }
  };
  const renderScoreRing = (score, size = "w-16 h-16") => {
    const radius = 28;
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - score / 100 * circumference;
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `${size} relative`, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { className: "w-full h-full transform -rotate-90", viewBox: "0 0 60 60", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "circle",
          {
            cx: "30",
            cy: "30",
            r: radius,
            stroke: "currentColor",
            strokeWidth: "4",
            fill: "none",
            className: "text-gray-700"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "circle",
          {
            cx: "30",
            cy: "30",
            r: radius,
            stroke: "currentColor",
            strokeWidth: "4",
            fill: "none",
            strokeDasharray,
            strokeDashoffset,
            strokeLinecap: "round",
            className: `transition-all duration-300 ${getScoreColor(score).replace("text-", "")}`,
            style: {
              stroke: score >= 90 ? "#10b981" : score >= 50 ? "#f59e0b" : "#ef4444"
            }
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-sm font-bold ${getScoreColor(score)}`, children: score }) })
    ] });
  };
  const renderScoreCard = (title, score, _color) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-stone-800 rounded-lg p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
    renderScoreRing(score),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-sm font-medium text-gray-300", children: title }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-gray-500 mt-1", children: score >= 90 ? "Good" : score >= 50 ? "Needs Improvement" : "Poor" })
    ] })
  ] }) });
  const renderCoreWebVitals = (data) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-sm font-medium text-gray-300", children: "Core Web Vitals" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-stone-800 rounded-lg p-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        renderScoreRing(Math.round(data.lcp.score * 100), "w-12 h-12"),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-gray-400", children: "LCP" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-xs font-medium ${getScoreColor(data.lcp.score * 100)}`, children: formatDisplayValue(data.lcp.value, "ms") })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-gray-500", children: "Largest Contentful Paint" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-stone-800 rounded-lg p-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        renderScoreRing(Math.round(data.fid.score * 100), "w-12 h-12"),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-gray-400", children: "FID" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-xs font-medium ${getScoreColor(data.fid.score * 100)}`, children: formatDisplayValue(data.fid.value, "ms") })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-gray-500", children: "First Input Delay" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-stone-800 rounded-lg p-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        renderScoreRing(Math.round(data.cls.score * 100), "w-12 h-12"),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-gray-400", children: "CLS" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-xs font-medium ${getScoreColor(data.cls.score * 100)}`, children: data.cls.value ? typeof data.cls.value === "number" ? data.cls.value.toFixed(3) : parseFloat(data.cls.value).toFixed(3) : "N/A" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-gray-500", children: "Cumulative Layout Shift" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-stone-800 rounded-lg p-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        renderScoreRing(Math.round(data.fcp.score * 100), "w-12 h-12"),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-gray-400", children: "FCP" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-xs font-medium ${getScoreColor(data.fcp.score * 100)}`, children: formatDisplayValue(data.fcp.value, "ms") })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-gray-500", children: "First Contentful Paint" })
        ] })
      ] }) })
    ] })
  ] });
  const renderOpportunities = (opportunities) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-sm font-medium text-gray-300", children: "Top Optimization Opportunities" }),
    opportunities.slice(0, 3).map((opp, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-stone-800 rounded-lg p-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h5", { className: "text-sm font-medium text-white", children: opp.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-green-400", children: [
          "Save ",
          formatDisplayValue(opp.savings, "ms")
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-400", children: opp.description })
    ] }, index))
  ] });
  if (!tenantSlug) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center h-64", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-400", children: "No tenant selected" }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold text-white", children: "Website Health" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-400", children: "Monitor your website's performance and Core Web Vitals" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: () => void handleScan(),
          disabled: isScanning || isLoading,
          className: "px-4 py-2 bg-orange-600 hover:bg-orange-700 disabled:bg-orange-800 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex items-center gap-2",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: `h-4 w-4 ${isScanning ? "animate-spin" : ""}` }),
            isScanning ? "Scanning..." : "Run Health Scan"
          ]
        }
      )
    ] }),
    error && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-red-900 text-red-300 border border-red-700 rounded-lg p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(XCircle, { className: "h-4 w-4" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: "Error" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm mt-1", children: error })
    ] }),
    scanResult && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-green-900 text-green-300 border border-green-700 rounded-lg p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CheckCircle, { className: "h-4 w-4" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: "Scan Completed" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm mt-1", children: [
        "Overall Score: ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold", children: scanResult.overallScore })
      ] }),
      scanResult.summary.priority.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-green-400", children: "Priority Issues:" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "text-xs mt-1 space-y-1", children: scanResult.summary.priority.map((item, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
          "• ",
          item
        ] }, index)) })
      ] })
    ] }),
    isLoading && !healthData && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center h-64", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "h-5 w-5 animate-spin text-orange-500" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-400", children: "Loading health data..." })
    ] }) }),
    !isLoading && healthData && !healthData.hasData && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center h-64", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-12 w-12 text-gray-500 mx-auto mb-4" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-lg font-medium text-white mb-2", children: "No Health Data" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-400 mb-4", children: healthData.message }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => void handleScan(),
          className: "px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-colors",
          children: "Run First Health Scan"
        }
      )
    ] }) }),
    healthData && healthData.hasData && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
      healthData.overall && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-stone-800 rounded-lg p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-6", children: [
        renderScoreRing(healthData.overall.score, "w-20 h-20"),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
            getStatusIcon(healthData.overall.status),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg font-semibold text-white", children: "Overall Health" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-400 mb-2", children: healthData.overall.score >= 90 ? "Excellent" : healthData.overall.score >= 50 ? "Needs Improvement" : "Poor" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-gray-500", children: [
            "Last updated: ",
            new Date(healthData.lastUpdated || "").toLocaleString()
          ] })
        ] })
      ] }) }),
      healthData.performance ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-lg font-semibold text-white flex items-center gap-2", children: "📱 Mobile Performance" }),
          healthData.performance.mobile ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
              renderScoreCard("Performance", healthData.performance.mobile.performanceScore || healthData.performance.mobile.overallScore || 0),
              renderScoreCard("Accessibility", healthData.performance.mobile.accessibilityScore || 0),
              renderScoreCard("Best Practices", healthData.performance.mobile.bestPracticesScore || 0),
              renderScoreCard("SEO", healthData.performance.mobile.seoScore || 0)
            ] }),
            renderCoreWebVitals(healthData.performance.mobile.coreWebVitals),
            healthData.performance.mobile.opportunities.length > 0 && renderOpportunities(healthData.performance.mobile.opportunities)
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-stone-700 rounded-lg p-6 text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-400", children: "No mobile performance data available" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-500 mt-1", children: "Run a health scan to get mobile metrics" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-lg font-semibold text-white flex items-center gap-2", children: "🖥️ Desktop Performance" }),
          healthData.performance.desktop ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
              renderScoreCard("Performance", healthData.performance.desktop.performanceScore || healthData.performance.desktop.overallScore || 0),
              renderScoreCard("Accessibility", healthData.performance.desktop.accessibilityScore || 0),
              renderScoreCard("Best Practices", healthData.performance.desktop.bestPracticesScore || 0),
              renderScoreCard("SEO", healthData.performance.desktop.seoScore || 0)
            ] }),
            renderCoreWebVitals(healthData.performance.desktop.coreWebVitals),
            healthData.performance.desktop.opportunities.length > 0 && renderOpportunities(healthData.performance.desktop.opportunities)
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-stone-700 rounded-lg p-6 text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-400", children: "No desktop performance data available" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-500 mt-1", children: "Run a health scan to get desktop metrics" })
          ] })
        ] })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-stone-800 rounded-lg p-8 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-gray-400 mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-16 h-16 mx-auto mb-4 text-gray-500", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 1.5, d: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold text-white mb-2", children: "No Performance Data" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-400 mb-4", children: "Run a health scan to get detailed performance metrics for both mobile and desktop." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => void handleScan(),
            disabled: isScanning,
            className: "px-4 py-2 bg-orange-600 hover:bg-orange-700 disabled:bg-orange-800 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2 mx-auto",
            children: isScanning ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" }),
              "Scanning..."
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" }) }),
              "Run Health Scan"
            ] })
          }
        )
      ] })
    ] })
  ] });
};

const HeroSection = ({
  heroImages = [],
  onUpdateContent
}) => {
  const [isCollapsed, setIsCollapsed] = reactExports.useState(true);
  const [activeTab, setActiveTab] = reactExports.useState("content");
  const availableImages = [
    { url: "/images/hero/hero1.png", alt: "Professional mobile detailing service in action" },
    { url: "/images/hero/hero2.png", alt: "High-quality car detailing and ceramic coating" }
  ];
  const handleImageSelect = (imageUrl, isSelected) => {
    let newImages;
    if (isSelected) {
      newImages = heroImages.filter((img) => img !== imageUrl);
    } else {
      if (heroImages.length < 2) {
        newImages = [...heroImages, imageUrl];
      } else {
        newImages = [imageUrl, heroImages[1]];
      }
    }
    onUpdateContent("images", newImages);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-stone-800 rounded-lg p-6 border border-stone-700", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Image$1, { className: "h-5 w-5 text-orange-400 mr-3" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold text-white", children: "Hero" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => {
            },
            className: "flex items-center px-3 py-1 text-sm text-gray-400 hover:text-white transition-colors",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "h-4 w-4 mr-1" }),
              "Preview"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => {
              setIsCollapsed(!isCollapsed);
            },
            className: "flex items-center px-3 py-1 text-sm text-gray-400 hover:text-white transition-colors",
            children: [
              isCollapsed ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-4 w-4 mr-1" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-4 w-4 mr-1" }),
              isCollapsed ? "Expand" : "Collapse"
            ]
          }
        )
      ] })
    ] }),
    !isCollapsed && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex space-x-1 bg-stone-800 rounded-lg p-1 mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => {
              setActiveTab("content");
            },
            className: `flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === "content" ? "bg-orange-500 text-white" : "text-gray-400 hover:text-white hover:bg-stone-700"}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-4 w-4 mr-2" }),
              "Content"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => {
              setActiveTab("images");
            },
            className: `flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === "images" ? "bg-orange-500 text-white" : "text-gray-400 hover:text-white hover:bg-stone-700"}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Image$1, { className: "h-4 w-4 mr-2" }),
              "Images"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "transition-all duration-300 ease-in-out", children: [
        activeTab === "content" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-2/5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            WebsiteAutoSaveField,
            {
              field: "hero_title",
              label: "Hero Title",
              placeholder: "Enter hero title"
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-2/5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            WebsiteAutoSaveField,
            {
              field: "hero_subtitle",
              label: "Hero Subtitle",
              placeholder: "Enter hero subtitle"
            }
          ) })
        ] }),
        activeTab === "images" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "block text-sm font-medium text-gray-300 mb-2", children: "Hero Images (Select up to 2 images)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-4 max-w-2xl", children: availableImages.map((image, index) => {
            const isSelected = heroImages.includes(image.url);
            return /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                role: "button",
                tabIndex: 0,
                className: `relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all duration-200 ${isSelected ? "border-orange-500 ring-2 ring-orange-500/20" : "border-stone-600 hover:border-stone-500"}`,
                onClick: () => {
                  handleImageSelect(image.url, isSelected);
                },
                onKeyDown: (e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleImageSelect(image.url, isSelected);
                  }
                },
                children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "aspect-video bg-stone-700 relative", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "img",
                    {
                      src: image.url,
                      alt: image.alt,
                      className: "w-full h-full object-cover",
                      onError: (e) => {
                        const target = e.target;
                        target.style.display = "none";
                        const fallback = document.createElement("div");
                        fallback.className = "w-full h-full flex items-center justify-center text-gray-400 text-sm";
                        fallback.textContent = "Image not found";
                        target.parentNode?.appendChild(fallback);
                      }
                    }
                  ),
                  isSelected && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-orange-500/20 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-orange-500 text-white rounded-full p-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-5 w-5" }) }) })
                ] })
              },
              index
            );
          }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-500 mt-2", children: "These images will rotate as the hero background on your website homepage." })
        ] }) })
      ] })
    ] })
  ] });
};

const RemoveReviewTab = ({ tenantSlug }) => {
  const [reviews, setReviews] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [error, setError] = reactExports.useState(null);
  const [deletingId, setDeletingId] = reactExports.useState(null);
  const loadReviews = reactExports.useCallback(async () => {
    if (!tenantSlug) return;
    try {
      setLoading(true);
      setError(null);
      const response = await getReviews(tenantSlug);
      setReviews(response.data);
    } catch (err) {
      setError("Failed to load reviews");
      console.error("Error loading reviews:", err);
    } finally {
      setLoading(false);
    }
  }, [tenantSlug]);
  reactExports.useEffect(() => {
    if (tenantSlug) {
      void loadReviews();
    }
  }, [tenantSlug, loadReviews]);
  const handleDeleteReview = async (reviewId) => {
    if (!confirm("Are you sure you want to delete this review? This action cannot be undone.")) {
      return;
    }
    try {
      setDeletingId(reviewId);
      await deleteReview(reviewId);
      setReviews((prev) => prev.filter((review) => review.id !== reviewId));
    } catch (err) {
      console.error("Error deleting review:", err);
      alert("Failed to delete review. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };
  const getVehicleIcon = (vehicleType) => {
    switch (vehicleType) {
      case "car":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(Car, { className: "h-4 w-4" });
      case "truck":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(Truck, { className: "h-4 w-4" });
      default:
        return /* @__PURE__ */ jsxRuntimeExports.jsx(Car, { className: "h-4 w-4" });
    }
  };
  const getServiceIcons = (review) => {
    const services = [];
    if (review.paint_correction) services.push("Paint Correction");
    if (review.ceramic_coating) services.push("Ceramic Coating");
    if (review.paint_protection_film) services.push("Paint Protection Film");
    return services.length > 0 ? services.join(", ") : "No specific services";
  };
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      Star,
      {
        className: `h-4 w-4 ${i < rating ? "text-yellow-400 fill-current" : "text-gray-400"}`
      },
      i
    ));
  };
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center py-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-gray-400", children: "Loading reviews..." }) });
  }
  if (error) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-red-400 mb-4", children: error }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => void loadReviews(),
          className: "px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors",
          children: "Try Again"
        }
      )
    ] });
  }
  if (reviews.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-gray-400 mb-4", children: "No reviews found" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-gray-500", children: "Reviews will appear here once they are added." })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-lg font-semibold text-white", children: [
        "Manage Reviews (",
        reviews.length,
        ")"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => void loadReviews(),
          className: "px-3 py-1 text-sm bg-stone-700 text-white rounded-lg hover:bg-stone-600 transition-colors",
          children: "Refresh"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: reviews.map((review) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "bg-stone-800 border border-stone-700 rounded-lg p-4",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium text-white", children: review.customer_name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1", children: renderStars(review.rating) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-gray-400", children: formatDate(review.created_at) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-gray-300 mb-3", children: review.comment }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-4 text-sm text-gray-400", children: [
              review.vehicle_type && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
                getVehicleIcon(review.vehicle_type),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "capitalize", children: review.vehicle_type })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Wrench, { className: "h-4 w-4" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: getServiceIcons(review) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "capitalize", children: review.source }) }),
              review.reviewer_url && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "a",
                {
                  href: review.reviewer_url,
                  target: "_blank",
                  rel: "noopener noreferrer",
                  className: "flex items-center gap-1 text-orange-400 hover:text-orange-300",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "h-4 w-4" }),
                    "Profile"
                  ]
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => void handleDeleteReview(review.id),
              disabled: deletingId === review.id,
              className: "ml-4 p-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
              title: "Delete review",
              children: deletingId === review.id ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "animate-spin h-4 w-4 border-2 border-red-400 border-t-transparent rounded-full" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" })
            }
          )
        ] })
      },
      review.id
    )) })
  ] });
};

const ReviewsContent = ({
  tenantSlug
}) => {
  const { updateContent, refetch } = useWebsiteContent();
  const [isUpdating, setIsUpdating] = reactExports.useState(false);
  const [updateMessage, setUpdateMessage] = reactExports.useState(null);
  const handleUpdateBusinessData = async () => {
    setIsUpdating(true);
    setUpdateMessage(null);
    try {
      const businessResponse = await getBusinessData(tenantSlug);
      if (!businessResponse.success || !businessResponse.data.google_maps_url) {
        setUpdateMessage({
          type: "error",
          message: "No Google Maps URL found for this business"
        });
        return;
      }
      const googleMapsUrl = businessResponse.data.google_maps_url;
      const scrapeResponse = await scrapeGoogleBusinessProfile(googleMapsUrl, tenantSlug);
      if (scrapeResponse.success && scrapeResponse.data) {
        const { averageRating, totalReviews, businessName } = scrapeResponse.data;
        const updates = {};
        if (averageRating !== null) {
          updates.reviews_avg_rating = parseFloat(averageRating);
        }
        if (totalReviews !== null) {
          updates.reviews_total_count = parseInt(totalReviews, 10);
        }
        if (Object.keys(updates).length > 0) {
          await updateContent(updates);
          await refetch();
        }
        const ratingText = averageRating ? `Rating: ${averageRating}` : "";
        const reviewsText = totalReviews ? `Reviews: ${totalReviews}` : "";
        const separator = ratingText && reviewsText ? ", " : "";
        const successMessage = `Successfully scraped ${businessName || "business"}: ${ratingText}${separator}${reviewsText}`.trim();
        setUpdateMessage({
          type: "success",
          message: successMessage
        });
        setTimeout(() => {
          setUpdateMessage(null);
        }, 8e3);
      } else {
        setUpdateMessage({
          type: "error",
          message: "Failed to scrape Google Maps data. Check server logs for details."
        });
      }
    } catch (error) {
      console.error("Scraping error:", error);
      setUpdateMessage({
        type: "error",
        message: error instanceof Error ? error.message : "Failed to update business data. Check console for details."
      });
    } finally {
      setIsUpdating(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      WebsiteAutoSaveField,
      {
        field: "reviews_title",
        label: "Section Title",
        placeholder: "Enter reviews section title"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      WebsiteAutoSaveField,
      {
        field: "reviews_subtitle",
        label: "Section Description",
        type: "textarea",
        rows: 3,
        placeholder: "Enter reviews section description"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-4 items-end", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-32", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          WebsiteAutoSaveField,
          {
            field: "reviews_avg_rating",
            label: "Avg Rating",
            type: "number",
            step: "0.01",
            placeholder: "4.90"
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-32", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          WebsiteAutoSaveField,
          {
            field: "reviews_total_count",
            label: "Total",
            type: "number",
            placeholder: "0"
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: () => void handleUpdateBusinessData(),
            disabled: isUpdating,
            className: "px-3 py-2 bg-orange-600 hover:bg-orange-700 disabled:bg-orange-800 disabled:cursor-not-allowed text-white rounded text-sm font-medium transition-colors flex items-center gap-2 whitespace-nowrap",
            title: "Scrape Google Maps URL for rating and review count",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: `h-4 w-4 ${isUpdating ? "animate-spin" : ""}` }),
              isUpdating ? "Loading..." : "Update from Google"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-gray-400", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-gray-300", children: "Note:" }),
        ' You can manually edit these values or click "Update from Google" to fetch the latest ratings from your Google Business Profile.'
      ] })
    ] }),
    updateMessage && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `text-sm p-3 rounded ${updateMessage.type === "success" ? "bg-green-900 text-green-300 border border-green-700" : "bg-red-900 text-red-300 border border-red-700"}`, children: updateMessage.message })
  ] });
};

const ReviewsSection = ({ tenantSlug }) => {
  const [isCollapsed, setIsCollapsed] = reactExports.useState(true);
  const [activeTab, setActiveTab] = reactExports.useState("content");
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-stone-800 rounded-lg p-6 border border-stone-700", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "h-5 w-5 text-orange-400 mr-3" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold text-white", children: "Reviews" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => {
            },
            className: "flex items-center px-3 py-1 text-sm text-gray-400 hover:text-white transition-colors",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "h-4 w-4 mr-1" }),
              "Preview"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => {
              setIsCollapsed(!isCollapsed);
            },
            className: "flex items-center px-3 py-1 text-sm text-gray-400 hover:text-white transition-colors",
            children: [
              isCollapsed ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-4 w-4 mr-1" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-4 w-4 mr-1" }),
              isCollapsed ? "Expand" : "Collapse"
            ]
          }
        )
      ] })
    ] }),
    !isCollapsed && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex space-x-1 bg-stone-800 rounded-lg p-1 mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => {
              setActiveTab("content");
            },
            className: `flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === "content" ? "bg-orange-500 text-white" : "text-gray-400 hover:text-white hover:bg-stone-700"}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "h-4 w-4 mr-2" }),
              "Content"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => {
              setActiveTab("add-review");
            },
            className: `flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === "add-review" ? "bg-orange-500 text-white" : "text-gray-400 hover:text-white hover:bg-stone-700"}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4 mr-2" }),
              "Add Review"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => {
              setActiveTab("remove-review");
            },
            className: `flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === "remove-review" ? "bg-orange-500 text-white" : "text-gray-400 hover:text-white hover:bg-stone-700"}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-4 w-4 mr-2" }),
              "Remove Review"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "transition-all duration-300 ease-in-out", children: [
        activeTab === "content" && /* @__PURE__ */ jsxRuntimeExports.jsx(ReviewsContent, { tenantSlug }),
        activeTab === "add-review" && /* @__PURE__ */ jsxRuntimeExports.jsx(AddReviewForm, { tenantSlug }),
        activeTab === "remove-review" && /* @__PURE__ */ jsxRuntimeExports.jsx(RemoveReviewTab, { tenantSlug })
      ] })
    ] })
  ] });
};

const ServicesSection = ({
  serviceImages = []
}) => {
  const [isCollapsed, setIsCollapsed] = reactExports.useState(true);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-stone-800 rounded-lg p-6 border border-stone-700", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(BarChart3, { className: "h-5 w-5 text-orange-400 mr-3" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold text-white", children: "Services" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => {
            },
            className: "flex items-center px-3 py-1 text-sm text-gray-400 hover:text-white transition-colors",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "h-4 w-4 mr-1" }),
              "Preview"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => {
              setIsCollapsed(!isCollapsed);
            },
            className: "flex items-center px-3 py-1 text-sm text-gray-400 hover:text-white transition-colors",
            children: [
              isCollapsed ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-4 w-4 mr-1" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-4 w-4 mr-1" }),
              isCollapsed ? "Expand" : "Collapse"
            ]
          }
        )
      ] })
    ] }),
    !isCollapsed && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "block text-sm font-medium text-gray-300 mb-2", children: "Service Images (6 services)" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-6 max-w-5xl", children: serviceImages.map((service) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "relative cursor-pointer rounded-lg overflow-hidden border-2 border-stone-600 hover:border-stone-500 transition-all duration-200",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "aspect-[4/3] bg-stone-700 relative", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "img",
              {
                src: service.image,
                alt: service.alt,
                className: "w-full h-full object-cover",
                onError: (e) => {
                  const target = e.target;
                  target.style.display = "none";
                  const fallback = document.createElement("div");
                  fallback.className = "w-full h-full flex items-center justify-center text-gray-400 text-sm";
                  fallback.textContent = "Image not found";
                  target.parentNode?.appendChild(fallback);
                }
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 bg-stone-800", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-300 font-medium text-center", children: service.title }) })
          ]
        },
        service.slug
      )) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-500 mt-2", children: "These 6 service images will be displayed in the services grid on your website." })
    ] }) })
  ] });
};

const WebsiteContentTab = ({ tenantSlug }) => {
  const [galleryImages, setGalleryImages] = reactExports.useState([]);
  const [customGalleryImages, setCustomGalleryImages] = reactExports.useState([]);
  const [isLoading, setIsLoading] = reactExports.useState(true);
  const { industry } = useData();
  const [industryFAQs, setIndustryFAQs] = reactExports.useState([]);
  reactExports.useEffect(() => {
    if (!industry) return;
    loadIndustryFAQs(industry).then(setIndustryFAQs).catch(() => {
      setIndustryFAQs([]);
    });
  }, [industry]);
  const categoryFaqMap = reactExports.useMemo(() => {
    const map = {};
    industryFAQs.forEach((faq) => {
      if (!map[faq.category]) {
        map[faq.category] = [];
      }
      map[faq.category].push(faq);
    });
    return map;
  }, [industryFAQs]);
  const initialContentData = reactExports.useMemo(() => ({
    hero_title: "",
    hero_subtitle: "",
    services_title: "",
    services_subtitle: "",
    services_auto_description: "",
    services_marine_description: "",
    services_rv_description: "",
    services_ceramic_description: "",
    services_correction_description: "",
    services_ppf_description: "",
    reviews_title: "",
    reviews_subtitle: "",
    reviews_avg_rating: 0,
    reviews_total_count: 0,
    faq_title: "",
    faq_subtitle: "",
    faq_content: []
  }), []);
  const saveContentData = reactExports.useMemo(() => {
    return async (data) => {
      if (!tenantSlug) {
        throw new Error("No tenant selected");
      }
      const cleanedFaqContent = data.faq_content.filter(
        (faq) => faq.question && faq.question.trim() !== "" && faq.answer && faq.answer.trim() !== "" && faq.category && faq.category.trim() !== ""
      );
      const cleanedData = {
        ...data,
        faq_content: cleanedFaqContent
      };
      const result = await saveWebsiteContent(tenantSlug, cleanedData);
      return result;
    };
  }, [tenantSlug]);
  const { value: contentData, setValue: setContentData } = useAutoSave$1(
    initialContentData,
    saveContentData,
    { debounce: 1e3 }
  );
  reactExports.useEffect(() => {
    const loadContentData = async () => {
      if (!tenantSlug) return;
      try {
        setIsLoading(true);
        const data = await getWebsiteContent(tenantSlug);
        setContentData(data);
      } catch (error) {
        console.error("Failed to load website content:", error);
      } finally {
        setIsLoading(false);
      }
    };
    void loadContentData();
  }, [tenantSlug, setContentData]);
  const updateContent = (section, field, value) => {
    setContentData((prev) => {
      if (section === "hero") {
        const fieldMap = {
          "title": "hero_title",
          "subtitle": "hero_subtitle"
        };
        const dbField = fieldMap[field];
        if (dbField) {
          return {
            ...prev,
            [dbField]: value
          };
        }
      } else if (section === "reviews") {
        const fieldMap = {
          "title": "reviews_title",
          "subtitle": "reviews_subtitle",
          "avg_rating": "reviews_avg_rating",
          "total_count": "reviews_total_count"
        };
        const dbField = fieldMap[field];
        if (dbField) {
          return {
            ...prev,
            [dbField]: value
          };
        }
      } else if (section === "faq") {
        const fieldMap = {
          "title": "faq_title",
          "subtitle": "faq_subtitle",
          "content": "faq_content"
        };
        const dbField = fieldMap[field];
        if (dbField) {
          return {
            ...prev,
            [dbField]: value
          };
        }
      }
      const sectionKey = section;
      const existingSection = prev[sectionKey];
      const sectionValue = typeof existingSection === "object" && existingSection !== null ? { ...existingSection, [field]: value } : { [field]: value };
      return {
        ...prev,
        [section]: sectionValue
      };
    });
  };
  const resetToDefault = () => {
    const defaultFaqs = Object.values(categoryFaqMap).flat().map((faq) => ({
      category: faq.category,
      question: faq.question,
      answer: faq.answer
    }));
    const updatedContentData = {
      ...contentData,
      faq_content: defaultFaqs
    };
    setContentData(updatedContentData);
  };
  const loadGalleryImages = async () => {
    try {
      const response = await fetch("/mobile-detailing/data/gallery.json");
      const galleryData = await response.json();
      setGalleryImages(galleryData);
    } catch {
      setGalleryImages([]);
    }
  };
  reactExports.useEffect(() => {
    void loadGalleryImages();
  }, []);
  const handleAddCustomImage = () => {
    const newCustomImage = {
      src: "",
      alt: ""
    };
    setCustomGalleryImages((prev) => [...prev, newCustomImage]);
  };
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center h-64", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-400", children: "Loading website content..." })
    ] }) });
  }
  if (!tenantSlug) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-red-500", children: "Error: No tenant slug provided" });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(WebsiteContentProvider, { tenantSlug, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-between", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold text-white", children: "Website Content" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-400 mt-1", children: "Manage your website sections and content" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        HeroSection,
        {
          heroTitle: contentData.hero_title || "",
          heroSubtitle: contentData.hero_subtitle || "",
          heroImages: contentData.services?.images || [],
          onUpdateContent: (field, value) => {
            updateContent("hero", field, value);
          }
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        ServicesSection,
        {
          serviceImages: contentData.services?.images || []
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ReviewsSection, { tenantSlug }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        FAQSection,
        {
          faqContent: contentData.faq_content,
          onUpdateContent: (field, value) => {
            updateContent("faq", field, value);
          },
          onResetToDefault: resetToDefault
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        GallerySection,
        {
          stockImages: galleryImages,
          customImages: customGalleryImages,
          onAddCustomImage: handleAddCustomImage
        }
      )
    ] })
  ] }) });
};

const WebsiteDomainTab = () => {
  const [isEditing, setIsEditing] = reactExports.useState(false);
  const [copiedField, setCopiedField] = reactExports.useState(null);
  const [domainData, setDomainData] = reactExports.useState({
    primaryDomain: "jpsmobiledetailing.com",
    customDomain: "",
    subdomain: "jps",
    sslStatus: "active",
    dnsStatus: "configured",
    lastChecked: "2024-01-15T10:30:00Z",
    nameservers: [
      "ns1.example.com",
      "ns2.example.com"
    ],
    records: [
      { type: "A", name: "@", value: "192.168.1.1", ttl: 3600 },
      { type: "CNAME", name: "www", value: "jpsmobiledetailing.com", ttl: 3600 },
      { type: "MX", name: "@", value: "mail.example.com", ttl: 3600 }
    ]
  });
  const handleSave = () => {
    setIsEditing(false);
  };
  const handleCopy = (text, field) => {
    void navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => {
      setCopiedField(null);
    }, 2e3);
  };
  const getStatusColor = (status) => {
    switch (status) {
      case "active":
      case "configured":
        return "text-green-400 bg-green-900/20";
      case "pending":
        return "text-yellow-400 bg-yellow-900/20";
      case "error":
        return "text-red-400 bg-red-900/20";
      default:
        return "text-gray-400 bg-gray-900/20";
    }
  };
  const getStatusIcon = (status) => {
    switch (status) {
      case "active":
      case "configured":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-4 w-4" });
      case "pending":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-4 w-4" });
      case "error":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(AlertCircle, { className: "h-4 w-4" });
      default:
        return /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { className: "h-4 w-4" });
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold text-white", children: "Domain Settings" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-400 mt-1", children: "Manage your website domain and DNS configuration" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex space-x-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => {
              setIsEditing(!isEditing);
            },
            className: "flex items-center px-4 py-2 bg-stone-700 text-white rounded-lg hover:bg-stone-600 transition-colors",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { className: "h-4 w-4 mr-2" }),
              isEditing ? "Cancel" : "Edit"
            ]
          }
        ),
        isEditing && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: handleSave,
            className: "flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-4 w-4 mr-2" }),
              "Save"
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-stone-800 rounded-lg p-6 border border-stone-700", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "h-5 w-5 text-orange-400 mr-2" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold text-white", children: "Primary Domain" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(domainData.sslStatus)}`, children: [
            getStatusIcon(domainData.sslStatus),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-1 capitalize", children: domainData.sslStatus })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white font-mono", children: domainData.primaryDomain }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => {
                handleCopy(domainData.primaryDomain, "primary");
              },
              className: "flex items-center text-gray-400 hover:text-white transition-colors",
              children: copiedField === "primary" ? /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-4 w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "h-4 w-4" })
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-stone-800 rounded-lg p-6 border border-stone-700", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "h-5 w-5 text-orange-400 mr-2" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold text-white", children: "SSL Certificate" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(domainData.sslStatus)}`, children: [
            getStatusIcon(domainData.sslStatus),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-1 capitalize", children: domainData.sslStatus })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-400 text-sm", children: "Valid until: Jan 15, 2025" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-stone-800 rounded-lg p-6 border border-stone-700", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { className: "h-5 w-5 text-orange-400 mr-2" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold text-white", children: "DNS Status" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(domainData.dnsStatus)}`, children: [
            getStatusIcon(domainData.dnsStatus),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-1 capitalize", children: domainData.dnsStatus })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-gray-400 text-sm", children: [
          "Last checked: ",
          new Date(domainData.lastChecked).toLocaleDateString()
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-stone-800 rounded-lg p-6 border border-stone-700", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "h-5 w-5 text-orange-400 mr-2" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold text-white", children: "Primary Domain" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "domain-name-input", className: "block text-sm font-medium text-gray-300 mb-2", children: "Domain Name" }),
            isEditing ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                id: "domain-name-input",
                type: "text",
                value: domainData.primaryDomain,
                onChange: (e) => {
                  setDomainData({ ...domainData, primaryDomain: e.target.value });
                },
                className: "w-full px-3 py-2 bg-stone-700 border border-stone-600 rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white font-mono", children: domainData.primaryDomain }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: () => {
                    handleCopy(domainData.primaryDomain, "primary");
                  },
                  className: "flex items-center text-gray-400 hover:text-white transition-colors",
                  children: copiedField === "primary" ? /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-4 w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "h-4 w-4" })
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "subdomain-input", className: "block text-sm font-medium text-gray-300 mb-2", children: "Subdomain" }),
            isEditing ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                id: "subdomain-input",
                type: "text",
                value: domainData.subdomain,
                onChange: (e) => {
                  setDomainData({ ...domainData, subdomain: e.target.value });
                },
                className: "w-full px-3 py-2 bg-stone-700 border border-stone-600 rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-white font-mono", children: [
                domainData.subdomain,
                ".yourdomain.com"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: () => {
                    handleCopy(`${domainData.subdomain}.yourdomain.com`, "subdomain");
                  },
                  className: "flex items-center text-gray-400 hover:text-white transition-colors",
                  children: copiedField === "subdomain" ? /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-4 w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "h-4 w-4" })
                }
              )
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-stone-800 rounded-lg p-6 border border-stone-700", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "h-5 w-5 text-orange-400 mr-2" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold text-white", children: "Custom Domain" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "custom-domain-input", className: "block text-sm font-medium text-gray-300 mb-2", children: "Custom Domain (Optional)" }),
            isEditing ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                id: "custom-domain-input",
                type: "text",
                value: domainData.customDomain,
                onChange: (e) => {
                  setDomainData({ ...domainData, customDomain: e.target.value });
                },
                placeholder: "your-custom-domain.com",
                className: "w-full px-3 py-2 bg-stone-700 border border-stone-600 rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white font-mono", children: domainData.customDomain || "No custom domain set" }),
              domainData.customDomain && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: () => {
                    handleCopy(domainData.customDomain, "custom");
                  },
                  className: "flex items-center text-gray-400 hover:text-white transition-colors",
                  children: copiedField === "custom" ? /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-4 w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "h-4 w-4" })
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-gray-400", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "To use a custom domain:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "list-disc list-inside mt-2 space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Purchase a domain from a registrar" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Point your domain's DNS to our nameservers" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Add your domain here once DNS is configured" })
            ] })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-stone-800 rounded-lg p-6 border border-stone-700", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { className: "h-5 w-5 text-orange-400 mr-2" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold text-white", children: "DNS Records" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "text-sm text-orange-400 hover:text-orange-300 transition-colors", children: "Refresh DNS" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-stone-700", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left py-3 px-4 text-sm font-medium text-gray-300", children: "Type" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left py-3 px-4 text-sm font-medium text-gray-300", children: "Name" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left py-3 px-4 text-sm font-medium text-gray-300", children: "Value" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left py-3 px-4 text-sm font-medium text-gray-300", children: "TTL" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left py-3 px-4 text-sm font-medium text-gray-300", children: "Actions" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: domainData.records.map((record, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-stone-700/50", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3 px-4 text-sm text-white font-mono", children: record.type }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3 px-4 text-sm text-white font-mono", children: record.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3 px-4 text-sm text-white font-mono", children: record.value }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3 px-4 text-sm text-gray-400", children: record.ttl }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3 px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => {
                handleCopy(record.value, `record-${index}`);
              },
              className: "flex items-center text-gray-400 hover:text-white transition-colors",
              children: copiedField === `record-${index}` ? /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-4 w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "h-4 w-4" })
            }
          ) })
        ] }, index)) })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-stone-800 rounded-lg p-6 border border-stone-700", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold text-white mb-4", children: "Quick Actions" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "flex items-center justify-center px-4 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "h-4 w-4 mr-2" }),
          "View Live Site"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "flex items-center justify-center px-4 py-3 bg-stone-700 text-white rounded-lg hover:bg-stone-600 transition-colors", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { className: "h-4 w-4 mr-2" }),
          "DNS Settings"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "flex items-center justify-center px-4 py-3 bg-stone-700 text-white rounded-lg hover:bg-stone-600 transition-colors", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "h-4 w-4 mr-2" }),
          "SSL Certificate"
        ] })
      ] })
    ] })
  ] });
};

const WebsiteHealthTab = ({ tenantSlug }) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(HealthTab, { tenantSlug });
};

function useGoogleAnalyticsStatus(tenantId) {
  return useQuery({
    queryKey: ["analytics", "status", tenantId],
    queryFn: async () => {
      const response = await fetch(`/api/google/analytics/status?tenant_id=${tenantId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch analytics status");
      }
      const data = await response.json();
      return data.data;
    },
    enabled: !!tenantId,
    refetchInterval: 3e4
    // Refetch every 30 seconds
  });
}
function useAnalyticsSummary(tenantId, days = 7) {
  return useQuery({
    queryKey: ["analytics", "summary", tenantId, days],
    queryFn: async () => {
      const response = await fetch(`/api/google/analytics/summary?tenant_id=${tenantId}&days=${days}`);
      if (!response.ok) {
        throw new Error("Failed to fetch analytics summary");
      }
      const data = await response.json();
      return data.data;
    },
    enabled: !!tenantId,
    refetchInterval: 5 * 60 * 1e3
    // Refetch every 5 minutes
  });
}
function useRealtimeData(tenantId) {
  return useQuery({
    queryKey: ["analytics", "realtime", tenantId],
    queryFn: async () => {
      const response = await fetch(`/api/google/analytics/realtime?tenant_id=${tenantId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch realtime data");
      }
      const data = await response.json();
      return data.data;
    },
    enabled: !!tenantId,
    refetchInterval: 30 * 1e3
    // Refetch every 30 seconds
  });
}
function initiateGoogleAnalyticsAuth(tenantId) {
  const authUrl = `/api/google/analytics/auth?tenant_id=${tenantId}`;
  window.open(authUrl, "_blank", "width=600,height=700");
}

function useTenantId() {
  const authContext = useAuth();
  const user = authContext.user;
  const { businessSlug } = useParams();
  const [adminTenantId, setAdminTenantId] = reactExports.useState(null);
  reactExports.useEffect(() => {
    if (user?.role === "admin" && businessSlug && !adminTenantId) {
      const fetchTenantId = async () => {
        try {
          const response = await fetch(`/api/tenants/${businessSlug}`);
          if (response.ok) {
            const data = await response.json();
            if (data.success && data.tenant?.id) {
              setAdminTenantId(data.tenant.id.toString());
            }
          }
        } catch (err) {
          console.error("Error fetching tenant ID:", err);
        }
      };
      void fetchTenantId();
    }
  }, [user?.role, businessSlug, adminTenantId]);
  return user?.tenant_id?.toString() ?? adminTenantId ?? void 0;
}

const WebsitePerformanceTab = () => {
  const [timeRange, setTimeRange] = reactExports.useState("30d");
  const tenantIdString = useTenantId();
  const tenantId = tenantIdString ? parseInt(tenantIdString) : void 0;
  const { businessSlug } = useParams();
  const days = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90;
  const { data: analyticsStatus, isLoading: statusLoading } = useGoogleAnalyticsStatus(tenantId);
  const { data: analyticsData, isLoading: analyticsLoading, error: analyticsError } = useAnalyticsSummary(tenantId, days);
  const { data: realtimeData, isLoading: realtimeLoading } = useRealtimeData(tenantId);
  const isLoading = statusLoading || analyticsLoading || realtimeLoading;
  const ConnectionStatus = () => {
    if (!analyticsStatus) return null;
    if (!analyticsStatus.connected) {
      return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-stone-800 rounded-lg p-6 border border-stone-700", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(AlertCircle, { className: "h-6 w-6 text-yellow-400 mr-3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold text-white", children: "Google Analytics Not Connected" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-400 mt-1", children: "Connect your Google Analytics account to view website performance data" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => tenantId && initiateGoogleAnalyticsAuth(tenantId),
            className: "px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(BarChart3, { className: "h-4 w-4 mr-2" }),
              "Connect Analytics"
            ]
          }
        )
      ] }) });
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-stone-800 rounded-lg p-4 border border-stone-700", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-3 w-3 bg-green-400 rounded-full mr-3" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white font-medium", children: "Google Analytics Connected" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-gray-400 text-sm", children: [
            "Last sync: ",
            analyticsStatus.lastSync ? new Date(analyticsStatus.lastSync).toLocaleString() : "Never"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => window.location.reload(),
          className: "p-2 text-gray-400 hover:text-white transition-colors",
          title: "Refresh data",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "h-4 w-4" })
        }
      )
    ] }) });
  };
  const StatCard = ({
    title,
    value,
    change,
    trend,
    icon: Icon
  }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-stone-800 rounded-lg p-6 border border-stone-700", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-5 w-5 text-orange-400 mr-2" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-medium text-gray-300", children: title })
      ] }),
      change !== 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `flex items-center text-sm ${trend === "up" ? "text-green-400" : "text-red-400"}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: `h-4 w-4 mr-1 ${trend === "down" ? "rotate-180" : ""}` }),
        Math.abs(change),
        "%"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold text-white mb-1", children: value }),
    change !== 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-gray-400", children: [
      trend === "up" ? "↗" : "↘",
      " ",
      change > 0 ? "+" : "",
      change,
      "% from last period"
    ] })
  ] });
  const formatSessionDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}m ${remainingSeconds}s`;
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold text-white", children: "Website Performance" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-400 mt-1", children: "Analytics and performance metrics for your website" })
      ] }),
      analyticsStatus?.connected && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex space-x-2", children: ["7d", "30d", "90d"].map((range) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => {
            setTimeRange(range);
          },
          className: `px-3 py-1 rounded-lg text-sm font-medium transition-colors ${timeRange === range ? "bg-orange-500 text-white" : "bg-stone-700 text-gray-300 hover:bg-stone-600"}`,
          children: range === "7d" ? "7 Days" : range === "30d" ? "30 Days" : "90 Days"
        },
        range
      )) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ConnectionStatus, {}),
    analyticsStatus?.connected && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6", children: [...Array(4)].map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-stone-800 rounded-lg p-6 border border-stone-700 animate-pulse", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-4 bg-stone-700 rounded mb-4" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 bg-stone-700 rounded mb-2" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-3 bg-stone-700 rounded" })
      ] }, i)) }) : analyticsError ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-stone-800 rounded-lg p-6 border border-stone-700", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertCircle, { className: "h-6 w-6 text-red-400 mr-3" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold text-white", children: "Error Loading Analytics" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-400 mt-1", children: "Failed to fetch analytics data. Please try refreshing." })
        ] })
      ] }) }) : analyticsData ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          StatCard,
          {
            title: "Total Sessions",
            value: analyticsData.totalSessions.toLocaleString(),
            change: 0,
            trend: "up",
            icon: Users
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          StatCard,
          {
            title: "Total Users",
            value: analyticsData.totalUsers.toLocaleString(),
            change: 0,
            trend: "up",
            icon: Eye
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          StatCard,
          {
            title: "Bounce Rate",
            value: `${analyticsData.averageBounceRate.toFixed(1)}%`,
            change: 0,
            trend: "down",
            icon: BarChart3
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          StatCard,
          {
            title: "Avg. Session",
            value: formatSessionDuration(analyticsData.averageSessionDuration),
            change: 0,
            trend: "up",
            icon: Clock
          }
        )
      ] }) : null,
      realtimeData && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-stone-800 rounded-lg p-6 border border-stone-700", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold text-white", children: "Real-time Activity" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-2 w-2 bg-green-400 rounded-full mr-2 animate-pulse" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-gray-400", children: "Live" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-3xl font-bold text-white", children: realtimeData.activeUsers }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-gray-400", children: "Active Users" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-3xl font-bold text-white", children: realtimeData.countries.length }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-gray-400", children: "Countries" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-gray-400", children: "Last Updated" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-gray-300", children: new Date(realtimeData.lastUpdated).toLocaleTimeString() })
          ] })
        ] })
      ] })
    ] }),
    analyticsStatus?.connected && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-stone-800 rounded-lg p-6 border border-stone-700", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold text-white mb-4", children: "Quick Actions" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => window.open("https://analytics.google.com", "_blank"),
            className: "flex items-center justify-center px-4 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(BarChart3, { className: "h-4 w-4 mr-2" }),
              "View Full Analytics"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => window.open(`https://${businessSlug}.thatsmartsite.com`, "_blank"),
            className: "flex items-center justify-center px-4 py-3 bg-stone-700 text-white rounded-lg hover:bg-stone-600 transition-colors",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "h-4 w-4 mr-2" }),
              "Open Website"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => window.location.reload(),
            className: "flex items-center justify-center px-4 py-3 bg-stone-700 text-white rounded-lg hover:bg-stone-600 transition-colors",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "h-4 w-4 mr-2" }),
              "Refresh Data"
            ]
          }
        )
      ] })
    ] })
  ] });
};

const WebsiteTab = ({ tenantSlug }) => {
  const [activeSubTab, setActiveSubTab] = reactExports.useState("content");
  const subTabs = [
    { id: "content", name: "Content", icon: FileText },
    { id: "performance", name: "Performance", icon: BarChart3 },
    { id: "health", name: "Health", icon: Heart },
    { id: "domain", name: "Domain", icon: Globe }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-b border-stone-700", children: /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "flex space-x-8", children: subTabs.map((tab) => {
      const Icon = tab.icon;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: () => {
            setActiveSubTab(tab.id);
          },
          className: `flex items-center px-1 py-4 text-sm font-medium border-b-2 transition-colors duration-200 ${activeSubTab === tab.id ? "border-orange-500 text-orange-400" : "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300"}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-4 w-4 mr-2" }),
            tab.name
          ]
        },
        tab.id
      );
    }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6", children: [
      activeSubTab === "content" && /* @__PURE__ */ jsxRuntimeExports.jsx(WebsiteContentTab, { tenantSlug }),
      activeSubTab === "performance" && /* @__PURE__ */ jsxRuntimeExports.jsx(WebsitePerformanceTab, {}),
      activeSubTab === "health" && /* @__PURE__ */ jsxRuntimeExports.jsx(WebsiteHealthTab, { tenantSlug }),
      activeSubTab === "domain" && /* @__PURE__ */ jsxRuntimeExports.jsx(WebsiteDomainTab, {})
    ] })
  ] });
};

const TabContent = ({
  activeTab,
  detailerData,
  onDataUpdate,
  tenantSlug
}) => {
  const tabConfig = getTabConfig(tenantSlug);
  const isTabEnabled = (tab) => {
    switch (tab) {
      case "schedule":
        return tabConfig.schedule;
      case "customers":
        return tabConfig.customers;
      case "services":
        return tabConfig.services;
      case "locations":
        return tabConfig.locations;
      case "profile":
        return tabConfig.profile;
      case "website":
        return tabConfig.website;
      case "overview":
        return true;
      default:
        return true;
    }
  };
  if (!isTabEnabled(activeTab)) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "transition-all duration-300 ease-in-out", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-stone-800 rounded-lg p-8 text-center border border-stone-700", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-orange-400 text-6xl mb-4", children: "🔒" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-semibold text-white mb-2", children: "Feature Not Available" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-300 mb-4", children: "This feature is not currently enabled for your account." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-400", children: "Contact support to upgrade your plan and unlock this feature." })
    ] }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "transition-all duration-300 ease-in-out", children: [
    activeTab === "overview" && /* @__PURE__ */ jsxRuntimeExports.jsx(OverviewTab, {}),
    activeTab === "website" && /* @__PURE__ */ jsxRuntimeExports.jsx(WebsiteTab, { tenantSlug }),
    activeTab === "locations" && /* @__PURE__ */ jsxRuntimeExports.jsx(LocationsTab, { detailerData }),
    activeTab === "profile" && /* @__PURE__ */ jsxRuntimeExports.jsx(
      ProfileTab,
      {
        detailerData,
        onDataUpdate
      }
    ),
    activeTab === "schedule" && /* @__PURE__ */ jsxRuntimeExports.jsx(ScheduleTab, {}),
    activeTab === "customers" && /* @__PURE__ */ jsxRuntimeExports.jsx(CustomersTab, {}),
    activeTab === "services" && /* @__PURE__ */ jsxRuntimeExports.jsx(SimpleFixedServicesTab, {})
  ] });
};

const dashboardApi = {
  /**
   * Get dashboard data for a tenant
   */
  getDashboardData: async (slug) => {
    try {
      const response = await fetch(`/api/tenants/${slug}`, {
        headers: {
          "Content-Type": "application/json"
        }
      });
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Tenant not found");
        }
        throw new Error(`Failed to fetch dashboard data: ${response.status} ${response.statusText}`);
      }
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || "Failed to fetch dashboard data");
      }
      return result.data;
    } catch (error) {
      console.error("Dashboard API Error:", error);
      throw new Error(`Failed to load dashboard data: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  },
  /**
   * Update tenant information
   */
  updateTenantInfo: async (slug, data) => {
    try {
      const response = await fetch(`/api/tenants/${slug}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        throw new Error(`Failed to update tenant info: ${response.status} ${response.statusText}`);
      }
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || "Failed to update tenant info");
      }
      return result.data;
    } catch (error) {
      console.error("Dashboard API Error:", error);
      throw new Error(`Failed to update tenant info: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  },
  /**
   * Get tenant health status
   */
  getTenantHealth: async (slug) => {
    try {
      const response = await fetch(`/api/tenants/${slug}/health`);
      if (!response.ok) {
        throw new Error(`Failed to fetch tenant health: ${response.status} ${response.statusText}`);
      }
      const result = await response.json();
      if (!result.success) {
        throw new Error("Failed to fetch tenant health");
      }
      return result.data;
    } catch (error) {
      console.error("Dashboard API Error:", error);
      throw new Error(`Failed to load tenant health: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }
};

const DashboardPage = () => {
  const slug = useTenantSlug();
  const [activeTab, setActiveTab] = reactExports.useState("overview");
  const [detailerData, setDetailerData] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(true);
  const [error, setError] = reactExports.useState(null);
  useBrowserTab({
    title: detailerData?.businessName ? `${detailerData.businessName} - Dashboard` : "Dashboard - That Smart Site"
  });
  reactExports.useEffect(() => {
    const fetchTenantData = async () => {
      if (!slug) {
        setError("No business slug provided");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const tenant = await dashboardApi.getDashboardData(slug);
        const transformedData = {
          business_name: tenant.business_name || "Unknown Business",
          first_name: tenant.first_name || "Unknown",
          last_name: tenant.last_name || "Unknown",
          email: tenant.business_email || tenant.personal_email || "No email",
          phone: tenant.business_phone || tenant.personal_phone || "No phone",
          location: tenant.service_areas.length > 0 ? `${tenant.service_areas[0]?.city ?? ""}, ${tenant.service_areas[0]?.state ?? ""}` : "No location",
          services: tenant.service_areas.length > 0 ? tenant.service_areas.map((area) => area.city).slice(0, 4) : ["Mobile Detailing"],
          memberSince: tenant.created_at ? new Date(tenant.created_at).getFullYear().toString() : "Unknown"
        };
        setDetailerData(transformedData);
      } catch (error2) {
        setError(error2 instanceof Error ? error2.message : "Failed to fetch business data");
      } finally {
        setLoading(false);
      }
    };
    void fetchTenantData();
  }, [slug]);
  const handleDataUpdate = (data) => {
    if (detailerData) {
      setDetailerData({ ...detailerData, ...data });
    }
  };
  const handleBackToForm = () => {
  };
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(DashboardLayout, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg text-gray-600", children: "Loading business dashboard..." }) }) }) });
  }
  if (error || !detailerData) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(DashboardLayout, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-lg text-red-600", children: [
      "Error: ",
      error || "Failed to load business data"
    ] }) }) }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(DashboardLayout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      DashboardHeader,
      {
        detailerData,
        onBackToForm: handleBackToForm
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      DashboardTabs,
      {
        activeTab,
        onTabChange: setActiveTab,
        tenantSlug: slug
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      TabContent,
      {
        activeTab,
        detailerData,
        onDataUpdate: handleDataUpdate,
        tenantSlug: slug
      }
    )
  ] }) });
};

const ApplicationHeader = () => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "fixed top-0 z-50 bg-stone-900/95 backdrop-blur-sm w-full border-b border-stone-800 relative", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "img",
        {
          src: "/shared/icons/logo.png",
          alt: "That Smart Site Logo",
          className: "h-14 w-14 object-contain",
          width: 56,
          height: 56,
          decoding: "async",
          loading: "eager"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl md:text-3xl font-bold text-white", children: "That Smart Site" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Button,
      {
        variant: "ghost",
        size: "sm",
        className: "text-gray-300 hover:text-white hover:bg-stone-700 px-3 py-2 rounded-lg transition-colors",
        leftIcon: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "w-4 h-4" }),
        children: "Back"
      }
    ) })
  ] }) }) });
};

const INDUSTRIES = [
  { value: "mobile-detailing", label: "Mobile Detailing" },
  { value: "maid-service", label: "Maid Service" },
  { value: "lawncare", label: "Lawn Care" },
  { value: "pet-grooming", label: "Pet Grooming" },
  { value: "barber", label: "Barber Shop" }
];
const BusinessInformationSection = ({
  formData,
  handleInputChange,
  handleAddressChange
}) => {
  const handlePhoneChange = (value) => {
    const formatted = formatPhoneNumber(value);
    handleInputChange("businessPhone", formatted);
  };
  const handleAutoFill = () => {
    handleInputChange("businessName", "Testing Mobile Detail");
    handleInputChange("industry", "mobile-detailing");
    handleInputChange("businessPhone", formatPhoneNumber("7024206066"));
    handleInputChange("businessEmail", "bcoleman143@gmail.com");
    handleAddressChange("address", "2550 Country Club Dr");
    handleAddressChange("city", "Bullhead City");
    handleAddressChange("state", "AZ");
    handleAddressChange("zip", "86442");
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-stone-800 border border-stone-700 rounded-lg", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-6 border-b border-stone-700", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-white text-lg font-semibold flex items-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { className: "h-5 w-5 mr-2" }),
          "Business Information"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-400 text-sm mt-1", children: "Tell us about your business" })
      ] }),
      env.DEV && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: handleAutoFill,
          className: "flex items-center gap-2 px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium rounded-lg transition-colors",
          title: "Auto-fill with test data",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-4 w-4" }),
            "Auto-fill"
          ]
        }
      )
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:col-span-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "businessName", className: "block text-sm font-medium text-gray-300 mb-2", children: "Business Name *" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "businessName",
            type: "text",
            value: formData.businessName,
            onChange: (e) => {
              handleInputChange("businessName", e.target.value);
            },
            placeholder: "Enter your business name",
            required: true,
            className: "w-full bg-stone-700 border border-stone-600 text-white placeholder:text-gray-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:col-span-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "industry", className: "block text-sm font-medium text-gray-300 mb-2", children: "Industry *" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "select",
          {
            id: "industry",
            value: formData.industry || "mobile-detailing",
            onChange: (e) => {
              handleInputChange("industry", e.target.value);
            },
            required: true,
            className: "w-full bg-stone-700 border border-stone-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500",
            children: INDUSTRIES.map((industry) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: industry.value, children: industry.label }, industry.value))
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-400 text-xs mt-1", children: "This determines your website template and features" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "businessPhone", className: "block text-sm font-medium text-gray-300 mb-2", children: "Business Phone *" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "businessPhone",
            type: "tel",
            value: formData.businessPhone,
            onChange: (e) => {
              handlePhoneChange(e.target.value);
            },
            placeholder: "(555) 123-4567",
            required: true,
            maxLength: 14,
            className: "w-full bg-stone-700 border border-stone-600 text-white placeholder:text-gray-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "businessEmail", className: "block text-sm font-medium text-gray-300 mb-2", children: "Business Email *" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "businessEmail",
            type: "email",
            value: formData.businessEmail,
            onChange: (e) => {
              handleInputChange("businessEmail", e.target.value);
            },
            placeholder: "business@example.com",
            required: true,
            className: "w-full bg-stone-700 border border-stone-600 text-white placeholder:text-gray-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:col-span-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold text-white mb-4", children: "Business Address" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:col-span-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "businessAddress", className: "block text-sm font-medium text-gray-300 mb-2", children: "Street Address *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "businessAddress",
                type: "text",
                value: formData.businessAddress.address,
                onChange: (e) => {
                  handleAddressChange("address", e.target.value);
                },
                placeholder: "123 Main Street",
                required: true,
                className: "w-full bg-stone-700 border border-stone-600 text-white placeholder:text-gray-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "businessCity", className: "block text-sm font-medium text-gray-300 mb-2", children: "City *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "businessCity",
                type: "text",
                value: formData.businessAddress.city,
                onChange: (e) => {
                  handleAddressChange("city", e.target.value);
                },
                placeholder: "Phoenix",
                required: true,
                className: "w-full bg-stone-700 border border-stone-600 text-white placeholder:text-gray-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "businessState", className: "block text-sm font-medium text-gray-300 mb-2", children: "State *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "businessState",
                type: "text",
                value: formData.businessAddress.state,
                onChange: (e) => {
                  handleAddressChange("state", e.target.value);
                },
                placeholder: "AZ",
                required: true,
                className: "w-full bg-stone-700 border border-stone-600 text-white placeholder:text-gray-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500",
                maxLength: 2
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "businessZip", className: "block text-sm font-medium text-gray-300 mb-2", children: "ZIP Code *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "businessZip",
                type: "text",
                value: formData.businessAddress.zip,
                onChange: (e) => {
                  handleAddressChange("zip", e.target.value);
                },
                placeholder: "85001",
                required: true,
                className: "w-full bg-stone-700 border border-stone-600 text-white placeholder:text-gray-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500",
                maxLength: 10
              }
            )
          ] })
        ] })
      ] })
    ] }) })
  ] });
};

const PersonalInformationSection = ({
  formData,
  handleInputChange,
  errors = {}
}) => {
  const handlePhoneChange = (value) => {
    const formatted = formatPhoneNumber(value);
    handleInputChange("personalPhone", formatted);
  };
  const handleAutoFill = () => {
    handleInputChange("firstName", "John");
    handleInputChange("lastName", "Doe");
    handleInputChange("personalPhone", formatPhoneNumber("5551112222"));
    handleInputChange("personalEmail", "coleman143@hotmail.com");
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-stone-800 border border-stone-700 rounded-lg", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-6 border-b border-stone-700", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-white text-lg font-semibold flex items-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "h-5 w-5 mr-2" }),
          "Personal Information"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-400 text-sm mt-1", children: "Tell us about yourself" })
      ] }),
      env.DEV && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: handleAutoFill,
          className: "flex items-center gap-2 px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium rounded-lg transition-colors",
          title: "Auto-fill with test data",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-4 w-4" }),
            "Auto-fill"
          ]
        }
      )
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "firstName", className: "block text-sm font-medium text-gray-300 mb-2", children: "First Name *" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "firstName",
            type: "text",
            value: formData.firstName,
            onChange: (e) => {
              handleInputChange("firstName", e.target.value);
            },
            placeholder: "Enter your first name",
            required: true,
            className: "w-full bg-stone-700 border border-stone-600 text-white placeholder:text-gray-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "lastName", className: "block text-sm font-medium text-gray-300 mb-2", children: "Last Name *" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "lastName",
            type: "text",
            value: formData.lastName,
            onChange: (e) => {
              handleInputChange("lastName", e.target.value);
            },
            placeholder: "Enter your last name",
            required: true,
            className: "w-full bg-stone-700 border border-stone-600 text-white placeholder:text-gray-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "personalPhone", className: "block text-sm font-medium text-gray-300 mb-2", children: "Personal Phone *" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "personalPhone",
            type: "tel",
            value: formData.personalPhone,
            onChange: (e) => {
              handlePhoneChange(e.target.value);
            },
            placeholder: "(555) 123-4567",
            required: true,
            maxLength: 14,
            className: "w-full bg-stone-700 border border-stone-600 text-white placeholder:text-gray-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "personalEmail", className: "block text-sm font-medium text-gray-300 mb-2", children: "Personal Email *" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "personalEmail",
            type: "email",
            value: formData.personalEmail,
            onChange: (e) => {
              handleInputChange("personalEmail", e.target.value);
            },
            placeholder: "your.email@example.com",
            required: true,
            className: "w-full bg-stone-700 border border-stone-600 text-white placeholder:text-gray-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
          }
        ),
        errors["personalEmail"] && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-red-400", children: errors["personalEmail"] })
      ] })
    ] }) })
  ] });
};

const pricingPlans = [
  {
    id: "starter",
    name: "Starter",
    price: 15,
    interval: "month",
    features: [
      "Single location website",
      "5 custom pages",
      "Mobile responsive design",
      "Contact form integration",
      "Basic SEO optimization",
      "SSL certificate included",
      "Email support"
    ]
  },
  {
    id: "pro",
    name: "Pro",
    price: 25,
    interval: "month",
    popular: true,
    features: [
      "Multi-location support",
      "Unlimited pages",
      "Advanced SEO tools",
      "Online booking system",
      "Google Maps integration",
      "Analytics dashboard",
      "Priority support",
      "Custom domain"
    ]
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 35,
    interval: "month",
    features: [
      "Everything in Pro",
      "Custom development",
      "API integrations",
      "Dedicated account manager",
      "White-label options",
      "SLA guarantee",
      "24/7 phone support"
    ]
  }
];
const tenantApplicationDefaultValues = {
  firstName: "",
  lastName: "",
  personalPhone: "",
  personalEmail: "",
  businessName: "",
  businessPhone: "",
  businessEmail: "",
  businessAddress: {
    address: "",
    city: "",
    state: "",
    zip: ""
  },
  selectedPlan: "",
  planPrice: 0,
  paymentMethod: "",
  cardNumber: "",
  expiryDate: "",
  cvv: "",
  billingAddress: {
    address: "",
    city: "",
    state: "",
    zip: ""
  },
  useSameAddress: true,
  industry: "mobile-detailing",
  step: 0,
  status: "draft"
};

const PlanSelectionSection = ({
  selectedPlan,
  onSelectPlan
}) => {
  const [hoveredPlan, setHoveredPlan] = reactExports.useState(null);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-6xl mx-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-8 sm:mb-12", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 sm:mb-4", children: "Choose Your Plan" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-400 text-base sm:text-lg max-w-2xl mx-auto px-4", children: "Select the perfect plan for your business. All plans include a 14-day money-back guarantee." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 px-4 items-stretch", children: pricingPlans.map((plan) => {
      const isSelected = selectedPlan === plan.id;
      const isHovered = hoveredPlan === plan.id;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: `
                relative rounded-2xl border-2 transition-all duration-300 flex flex-col h-full
                ${isSelected ? "border-orange-600 bg-stone-800 shadow-xl shadow-orange-600/20 scale-105" : isHovered ? "border-orange-500 bg-stone-800/80 scale-102" : "border-stone-700 bg-stone-800/60"}
                ${plan.popular ? "lg:scale-105 lg:z-10" : ""}
              `,
          onMouseEnter: () => {
            setHoveredPlan(plan.id);
          },
          onMouseLeave: () => {
            setHoveredPlan(null);
          },
          children: [
            plan.popular && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -top-4 left-1/2 transform -translate-x-1/2 z-20", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gradient-to-r from-orange-600 to-orange-500 text-white text-xs sm:text-sm font-bold px-4 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-3 h-3 sm:w-4 sm:h-4" }),
              "MOST POPULAR"
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 sm:p-8 flex flex-col h-full", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl sm:text-2xl font-bold text-white mb-2", children: plan.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-baseline gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-3xl sm:text-4xl lg:text-5xl font-bold text-white", children: [
                  "$",
                  plan.price
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-gray-400 text-base sm:text-lg", children: [
                  "/",
                  plan.interval
                ] })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-3 sm:space-y-4 mb-6 sm:mb-8 flex-grow", children: plan.features.map((feature, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-300 text-sm sm:text-base", children: feature })
              ] }, index)) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => {
                    onSelectPlan(plan.id, plan.price * 100);
                  },
                  className: `
                    w-full py-3 sm:py-3.5 px-6 rounded-lg font-semibold text-base sm:text-lg
                    transition-all duration-200
                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-stone-800
                    ${isSelected ? "bg-orange-600 text-white hover:bg-orange-700 focus:ring-orange-500" : "bg-stone-700 text-white hover:bg-stone-600 focus:ring-stone-500"}
                  `,
                  children: isSelected ? "Selected" : "Select Plan"
                }
              )
            ] })
          ]
        },
        plan.id
      );
    }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 text-center px-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap justify-center items-center gap-4 sm:gap-8 text-sm text-gray-400", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-4 h-4 text-orange-600" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "14-day money-back guarantee" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-4 h-4 text-orange-600" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Cancel anytime" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-4 h-4 text-orange-600" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "No setup fees" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap justify-center items-center gap-3 sm:gap-6 text-xs text-gray-500 mt-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Powered by Stripe" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: "•" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "SSL Secure" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: "•" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "PCI Compliant" })
      ] })
    ] })
  ] });
};

const StepProgress = ({ steps, currentStep }) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full py-6 sm:py-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center items-center px-4", children: steps.map((step, index) => {
    const isActive = step.id === currentStep;
    const isCompleted = step.id < currentStep;
    const isLast = index === steps.length - 1;
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(React.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: `
                    flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2
                    transition-all duration-300 relative
                    ${isCompleted ? "bg-orange-600 border-orange-600 text-white scale-100" : isActive ? "bg-orange-600 border-orange-600 text-white scale-110 shadow-lg shadow-orange-600/50" : "bg-stone-800 border-stone-600 text-gray-400"}
                  `,
            children: isCompleted ? /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-4 h-4 sm:w-5 sm:h-5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm sm:text-base font-semibold", children: step.id + 1 })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: `
                    text-xs sm:text-sm font-medium mt-2 text-center transition-colors
                    ${isActive ? "text-orange-600" : isCompleted ? "text-gray-300" : "text-gray-500"}
                  `,
            children: step.label
          }
        )
      ] }),
      !isLast && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: `
                    h-0.5 w-12 sm:w-20 lg:w-24 mx-2 sm:mx-4 mb-6 transition-all duration-500
                    ${isCompleted ? "bg-orange-600" : "bg-stone-700"}
                  `
        }
      )
    ] }, step.id);
  }) }) });
};

const SuccessPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [tenantSlug, setTenantSlug] = reactExports.useState(null);
  const [websiteUrl, setWebsiteUrl] = reactExports.useState(null);
  const [dashboardUrl, setDashboardUrl] = reactExports.useState(null);
  const [isLoggingIn, setIsLoggingIn] = reactExports.useState(false);
  reactExports.useEffect(() => {
    const slug = sessionStorage.getItem("newTenantSlug");
    const url = sessionStorage.getItem("newTenantWebsiteUrl");
    const dashboard = sessionStorage.getItem("newTenantDashboardUrl");
    if (slug) {
      setTenantSlug(slug);
      setWebsiteUrl(url || `/${slug}`);
      setDashboardUrl(dashboard || `/${slug}/dashboard`);
      sessionStorage.removeItem("newTenantSlug");
      sessionStorage.removeItem("newTenantWebsiteUrl");
      sessionStorage.removeItem("newTenantDashboardUrl");
    }
  }, []);
  const handleGoToDashboard = () => {
    if (dashboardUrl) {
      void navigate(dashboardUrl);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen bg-stone-900 text-white flex items-center justify-center p-4 pb-32", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-stone-800 border border-stone-700 rounded-2xl max-w-2xl w-full p-6 sm:p-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-600/50", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CheckCircle, { className: "w-10 h-10 text-white" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl sm:text-4xl text-white font-bold mb-3", children: "Welcome to ThatSmartSite! 🎉" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-300 text-lg mb-8", children: "Your website has been created and is ready to view!" })
    ] }),
    tenantSlug && websiteUrl && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gradient-to-br from-green-900/30 to-green-800/20 border border-green-600/50 rounded-lg p-6 mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-white text-lg mb-3 text-center", children: "🎉 Your Website is Ready!" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-gray-300 text-sm mb-4 text-center", children: [
        "Your website is live at: ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-green-400 font-mono text-xs", children: websiteUrl })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-300 text-sm mb-6 text-center", children: "Now let's customize it to make it perfect for your business!" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          onClick: handleGoToDashboard,
          variant: "primary",
          size: "lg",
          className: "w-full bg-green-600 hover:bg-green-700 flex items-center justify-center gap-2",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { className: "w-5 h-5" }),
            "Go to Dashboard"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-gradient-to-br from-orange-900/30 to-orange-800/20 border border-orange-600/50 rounded-lg p-6 mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-6 h-6 text-orange-400 flex-shrink-0 mt-1" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-white text-lg mb-2", children: "What's Next?" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "space-y-2 text-gray-300 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-orange-400 mr-2", children: "•" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Customize your site content, photos, and business information" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-orange-400 mr-2", children: "•" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Add your services, pricing, and contact information" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-orange-400 mr-2", children: "•" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "You'll receive a welcome email with instructions to set your password" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-orange-400 mr-2", children: "•" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Our team will reach out to help you get started" })
          ] })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-stone-700/50 border border-stone-600 rounded-lg p-4 mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-gray-300 text-sm text-center", children: [
      "Check your email inbox for a confirmation message from",
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-orange-400 font-semibold", children: "hello@thatsmartsite.com" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row gap-3 justify-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "w-full sm:w-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "outline",
          size: "lg",
          className: "w-full border border-stone-600 text-gray-300 hover:bg-stone-700 font-semibold",
          children: "Back to Home"
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          onClick: () => {
            void navigate("/contact");
          },
          variant: "primary",
          size: "lg",
          className: "w-full sm:w-auto bg-orange-600 hover:bg-orange-700",
          children: "Contact Support"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-8 pt-6 border-t border-stone-700 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-gray-500", children: [
      "Need help? Call us at ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-orange-400", children: "(555) 123-4567" }),
      " or email",
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-orange-400", children: "support@thatsmartsite.com" })
    ] }) })
  ] }) }) });
};

async function loadFAQItems(industry) {
  const categories = [
    "general",
    "services",
    "pricing",
    "scheduling",
    "locations",
    "preparation",
    "payments",
    "warranty",
    "aftercare"
  ];
  const faqArrays = await Promise.all(
    categories.map(async (category) => {
      try {
        const module = await __variableDynamicImportRuntimeHelper((/* #__PURE__ */ Object.assign({"../../data/mobile-detailing/faq/aftercare.json": () => __vitePreload(() => import('./aftercare-ZKXYZUbn.js'),true?[]:void 0),"../../data/mobile-detailing/faq/general.json": () => __vitePreload(() => import('./general-BhqPoWqx.js'),true?[]:void 0),"../../data/mobile-detailing/faq/locations.json": () => __vitePreload(() => import('./locations-D5I2ap43.js'),true?[]:void 0),"../../data/mobile-detailing/faq/payments.json": () => __vitePreload(() => import('./payments-CrPeLMHg.js'),true?[]:void 0),"../../data/mobile-detailing/faq/preparation.json": () => __vitePreload(() => import('./preparation-Btp8GDff.js'),true?[]:void 0),"../../data/mobile-detailing/faq/pricing.json": () => __vitePreload(() => import('./pricing-Bzt245QG.js'),true?[]:void 0),"../../data/mobile-detailing/faq/scheduling.json": () => __vitePreload(() => import('./scheduling-Cx-yGBz2.js'),true?[]:void 0),"../../data/mobile-detailing/faq/services.json": () => __vitePreload(() => import('./services-BqnJbWY7.js'),true?[]:void 0),"../../data/mobile-detailing/faq/warranty.json": () => __vitePreload(() => import('./warranty-CGuBowID.js'),true?[]:void 0)})), `../../data/${industry}/faq/${category}.json`, 6);
        return module.default;
      } catch {
        return [];
      }
    })
  );
  return faqArrays.flat();
}
async function loadDefaults(industry) {
  try {
    const [contentModule, seoModule, faqItems] = await Promise.all([
      __variableDynamicImportRuntimeHelper((/* #__PURE__ */ Object.assign({"../../data/lawncare/content-defaults.json": () => __vitePreload(() => import('./content-defaults-DUKtAQk1.js'),true?[]:void 0),"../../data/maid-service/content-defaults.json": () => __vitePreload(() => import('./content-defaults-VsXc3K3N.js'),true?[]:void 0),"../../data/mobile-detailing/content-defaults.json": () => __vitePreload(() => import('./content-defaults-Df6c8CcD.js'),true?[]:void 0),"../../data/pet-grooming/content-defaults.json": () => __vitePreload(() => import('./content-defaults-L38T1BM2.js'),true?[]:void 0)})), `../../data/${industry}/content-defaults.json`, 5),
      __variableDynamicImportRuntimeHelper((/* #__PURE__ */ Object.assign({"../../data/lawncare/seo-defaults.json": () => __vitePreload(() => import('./seo-defaults-DFelq5cF.js'),true?[]:void 0),"../../data/maid-service/seo-defaults.json": () => __vitePreload(() => import('./seo-defaults-DbAKbhjx.js'),true?[]:void 0),"../../data/mobile-detailing/seo-defaults.json": () => __vitePreload(() => import('./seo-defaults-2tSsldvQ.js'),true?[]:void 0),"../../data/pet-grooming/seo-defaults.json": () => __vitePreload(() => import('./seo-defaults-CEdMz0wm.js'),true?[]:void 0)})), `../../data/${industry}/seo-defaults.json`, 5),
      loadFAQItems(industry)
    ]);
    return {
      content: contentModule.default,
      seo: seoModule.default,
      faqItems
    };
  } catch (error) {
    console.error(`Failed to load defaults for ${industry}:`, error);
    throw new Error(`Defaults not found for industry: ${industry}`);
  }
}

const STORAGE_KEY = "tenant_application_draft";
const useAutoSave = ({
  formData,
  enabled = true,
  interval = 2e3
}) => {
  const timeoutRef = reactExports.useRef(null);
  const lastSavedRef = reactExports.useRef("");
  const saveToLocalStorage = reactExports.useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
    } catch (error) {
      console.error("Failed to save to localStorage:", error);
    }
  }, [formData]);
  const performSave = reactExports.useCallback(() => {
    const currentData = JSON.stringify(formData);
    if (currentData === lastSavedRef.current) {
      return;
    }
    saveToLocalStorage();
    lastSavedRef.current = currentData;
  }, [formData, saveToLocalStorage]);
  reactExports.useEffect(() => {
    if (!enabled) return;
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      performSave();
    }, interval);
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [formData, enabled, interval, performSave]);
  const loadFromLocalStorage = reactExports.useCallback(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch (error) {
      console.error("Failed to load from localStorage:", error);
      return null;
    }
  }, []);
  const clearSavedData = reactExports.useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error("Failed to clear saved data:", error);
    }
  }, []);
  return {
    loadFromLocalStorage,
    clearSavedData
  };
};

const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
const addressSchema = object({
  address: string().min(1, "Address is required"),
  city: string().min(1, "City is required"),
  state: string().length(2, "State must be 2 characters (e.g., CA)").toUpperCase(),
  zip: string().regex(/^\d{5}(-\d{4})?$/, "Invalid ZIP code")
});
const personalInfoSchema = object({
  firstName: string().min(1, "First name is required").max(50),
  lastName: string().min(1, "Last name is required").max(50),
  personalPhone: string().regex(phoneRegex, "Invalid phone number"),
  personalEmail: email("Invalid email address")
});
const businessInfoSchema = object({
  businessName: string().min(1, "Business name is required").max(100),
  businessPhone: string().regex(phoneRegex, "Invalid phone number"),
  businessEmail: email("Invalid email address"),
  businessAddress: addressSchema,
  industry: string().optional()
});
const planSelectionSchema = object({
  selectedPlan: _enum(["starter", "pro", "enterprise"], {
    errorMap: () => ({ message: "Please select a plan" })
  }),
  planPrice: number().min(0)
});
object({
  billingAddress: addressSchema,
  useSameAddress: boolean()
});

const createPaymentIntent = async (request) => {
  return apiClient.post("/api/payments/create-intent", request);
};
const confirmPayment = async (request) => {
  return apiClient.post("/api/payments/confirm", request);
};

const PaymentSection = ({
  formData,
  onAddressChange,
  onToggleSameAddress,
  onPaymentSuccess,
  errors,
  setErrors
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [cardError, setCardError] = reactExports.useState("");
  const [isProcessing, setIsProcessing] = reactExports.useState(false);
  const [clientSecret, setClientSecret] = reactExports.useState(null);
  const validateField = (field, value) => {
    try {
      const addressField = field.split(".")[1];
      switch (addressField) {
        case "address":
          addressSchema.pick({ address: true }).parse({ address: value });
          break;
        case "city":
          addressSchema.pick({ city: true }).parse({ city: value });
          break;
        case "state":
          addressSchema.pick({ state: true }).parse({ state: value });
          break;
        case "zip":
          addressSchema.pick({ zip: true }).parse({ zip: value });
          break;
      }
      setErrors({ ...errors, [field]: "" });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Invalid input";
      setErrors({ ...errors, [field]: message });
    }
  };
  const handleCardChange = (event) => {
    if (event.error) {
      setCardError(event.error.message);
    } else {
      setCardError("");
    }
  };
  React.useEffect(() => {
    const createPaymentIntentAsync = async () => {
      try {
        if (!formData.planPrice || !formData.personalEmail || !formData.businessName || !formData.selectedPlan) {
          console.error("Missing required fields for payment intent:", {
            planPrice: formData.planPrice,
            personalEmail: formData.personalEmail,
            businessName: formData.businessName,
            selectedPlan: formData.selectedPlan
          });
          setCardError("Please complete all required fields before proceeding to payment");
          return;
        }
        const result = await createPaymentIntent({
          amount: formData.planPrice,
          customerEmail: formData.personalEmail,
          businessName: formData.businessName,
          planType: formData.selectedPlan,
          metadata: {
            industry: formData.industry
          }
        });
        if (result.success && result.clientSecret) {
          setClientSecret(result.clientSecret);
        } else {
          setCardError(result.error || "Failed to initialize payment");
        }
      } catch (error) {
        if (error instanceof TypeError && error.message.includes("fetch")) {
          setCardError("Unable to connect to server. Please check your network connection.");
        } else {
          setCardError("Failed to initialize payment");
        }
      }
    };
    void createPaymentIntentAsync();
  }, [formData.planPrice, formData.personalEmail, formData.businessName, formData.selectedPlan, formData.industry]);
  const handlePayment = async () => {
    if (!stripe || !elements || !clientSecret) {
      setCardError("Payment system not ready. Please try again.");
      return;
    }
    setIsProcessing(true);
    setCardError("");
    try {
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error("Card element not found");
      }
      console.log("Checking payment intent status before confirmation...");
      const { error: retrieveError, paymentIntent: existingIntent } = await stripe.retrievePaymentIntent(clientSecret);
      if (retrieveError) {
        console.error("Error retrieving payment intent:", retrieveError);
      } else {
        console.log("Payment intent status before confirmation:", existingIntent.status);
        if (existingIntent.status === "succeeded") {
          console.log("Payment already succeeded, proceeding with tenant creation...");
          const confirmResult = await confirmPayment({
            paymentIntentId: existingIntent.id,
            tenantData: formData
          });
          if (confirmResult.success && confirmResult.data) {
            onPaymentSuccess(confirmResult.data);
          } else {
            setCardError(confirmResult.error || "Failed to create your account");
          }
          return;
        }
      }
      console.log("Confirming payment with client secret:", clientSecret);
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: `${formData.firstName} ${formData.lastName}`,
              email: formData.personalEmail,
              phone: formData.personalPhone,
              address: {
                line1: formData.billingAddress.address,
                city: formData.billingAddress.city,
                state: formData.billingAddress.state,
                postal_code: formData.billingAddress.zip,
                country: "US"
              }
            }
          }
        }
      );
      console.log("Payment confirmation result:", { stripeError, paymentIntent });
      if (stripeError) {
        console.error("Stripe payment error:", stripeError);
        setCardError(stripeError.message || "Payment failed");
        return;
      }
      if (paymentIntent.status === "succeeded") {
        const confirmResult = await confirmPayment({
          paymentIntentId: paymentIntent.id,
          tenantData: formData
        });
        if (confirmResult.success && confirmResult.data) {
          onPaymentSuccess(confirmResult.data);
        } else {
          setCardError(confirmResult.error || "Failed to create your account");
        }
      }
    } catch (error) {
      console.error("Payment processing error:", error);
      if (error instanceof TypeError && error.message.includes("fetch")) {
        setCardError("Unable to connect to server. Please check your network connection.");
      } else {
        setCardError(`Payment failed: ${error instanceof Error ? error.message : "Please try again."}`);
      }
    } finally {
      setIsProcessing(false);
    }
  };
  const CARD_ELEMENT_OPTIONS = {
    style: {
      base: {
        color: "#ffffff",
        fontFamily: "system-ui, -apple-system, sans-serif",
        fontSize: "16px",
        fontSmoothing: "antialiased",
        "::placeholder": {
          color: "#78716c"
        }
      },
      invalid: {
        color: "#f87171",
        iconColor: "#f87171"
      }
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full max-w-2xl mx-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-stone-800 border border-stone-700 rounded-2xl overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 sm:p-6 border-b border-stone-700", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-white text-xl sm:text-2xl font-semibold flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CreditCard, { className: "h-5 w-5 sm:h-6 sm:w-6 text-orange-600" }),
        "Payment Information"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-400 text-sm sm:text-base mt-2", children: "Secure payment powered by Stripe" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 sm:p-6 space-y-4 sm:space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-stone-700/50 border border-stone-600 rounded-lg p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-400", children: "Selected Plan" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl font-bold text-white capitalize mt-1", children: formData.selectedPlan })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-400", children: "Monthly" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-2xl font-bold text-orange-600 mt-1", children: [
              "$",
              (formData.planPrice / 100).toFixed(2)
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 pt-4 border-t border-stone-600", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-400", children: "Billed monthly. Cancel anytime. 14-day money-back guarantee." }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "block text-sm font-medium text-gray-300 mb-3", children: [
          "Card Information ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-orange-500", children: "*" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-stone-700 border border-stone-600 rounded-lg p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardElement, { options: CARD_ELEMENT_OPTIONS, onChange: handleCardChange }) }),
        cardError && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 flex items-center gap-2 text-sm text-red-400", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(AlertCircle, { className: "w-4 h-4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: cardError })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex items-center gap-2 text-xs text-gray-400", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "w-3 h-3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Your payment information is encrypted and secure" })
        ] }),
        env.DEV && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 p-3 bg-yellow-900/20 border border-yellow-700 rounded-lg", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-sm font-medium text-yellow-400 mb-2", children: "🧪 Test Cards (Development)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-yellow-300 space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Success:" }),
              " 4242 4242 4242 4242"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Decline:" }),
              " 4000 0000 0000 0002"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "CVV:" }),
              " Any 3 digits | ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Expiry:" }),
              " Any future date"
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "checkbox",
              id: "sameAddress",
              checked: formData.useSameAddress,
              onChange: (e) => {
                onToggleSameAddress(e.target.checked);
              },
              className: "w-4 h-4 rounded border-stone-600 text-orange-600 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-stone-800 bg-stone-700"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "sameAddress", className: "text-sm text-gray-300 cursor-pointer", children: "Billing address same as business address" })
        ] }),
        !formData.useSameAddress && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 pt-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-white text-base sm:text-lg font-medium", children: "Billing Address" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              label: "Street Address",
              type: "text",
              value: formData.billingAddress.address,
              onChange: (e) => {
                onAddressChange("address", e.target.value);
              },
              onBlur: () => {
                validateField("billingAddress.address", formData.billingAddress.address);
              },
              error: errors["billingAddress.address"] || "",
              placeholder: "123 Main Street",
              required: true
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sm:col-span-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                label: "City",
                type: "text",
                value: formData.billingAddress.city,
                onChange: (e) => {
                  onAddressChange("city", e.target.value);
                },
                onBlur: () => {
                  validateField("billingAddress.city", formData.billingAddress.city);
                },
                error: errors["billingAddress.city"] || "",
                placeholder: "San Francisco",
                required: true
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                label: "State",
                type: "text",
                value: formData.billingAddress.state,
                onChange: (e) => {
                  onAddressChange("state", e.target.value.toUpperCase());
                },
                onBlur: () => {
                  validateField("billingAddress.state", formData.billingAddress.state);
                },
                error: errors["billingAddress.state"] || "",
                placeholder: "CA",
                required: true,
                maxLength: 2,
                helperText: "2 letters"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              label: "ZIP Code",
              type: "text",
              value: formData.billingAddress.zip,
              onChange: (e) => {
                onAddressChange("zip", e.target.value);
              },
              onBlur: () => {
                validateField("billingAddress.zip", formData.billingAddress.zip);
              },
              error: errors["billingAddress.zip"] || "",
              placeholder: "94102",
              required: true,
              maxLength: 10
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-4 border-t border-stone-700", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => {
              void handlePayment();
            },
            disabled: !stripe || !clientSecret || isProcessing,
            className: `
                w-full py-4 px-6 rounded-lg font-semibold text-lg
                transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-stone-800
                ${!stripe || !clientSecret || isProcessing ? "bg-gray-600 text-gray-400 cursor-not-allowed" : "bg-orange-600 text-white hover:bg-orange-700 focus:ring-orange-500"}
              `,
            children: isProcessing ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" }),
              "Processing Payment..."
            ] }) : `Complete Purchase - $${(formData.planPrice / 100).toFixed(2)}`
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-center text-xs text-gray-400 mt-2", children: [
          "You'll be charged $",
          (formData.planPrice / 100).toFixed(2),
          " monthly. Cancel anytime."
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-stone-700", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-white", children: "PCI Compliant" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-400 mt-0.5", children: "Bank-level security" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-white", children: "256-bit SSL" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-400 mt-0.5", children: "Encrypted connection" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CreditCard, { className: "w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-white", children: "Money-back" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-400 mt-0.5", children: "14-day guarantee" })
          ] })
        ] })
      ] })
    ] })
  ] }) });
};

const stripePromise = loadStripe(config.stripePublishableKey);
const STEPS = [
  { id: 0, label: "Plan" },
  { id: 1, label: "Personal" },
  { id: 2, label: "Business" },
  { id: 3, label: "Payment" }
];
const TenantApplicationPage = () => {
  const location = useLocation();
  const previewData = location.state;
  const [formData, setFormData] = reactExports.useState(tenantApplicationDefaultValues);
  const [currentStep, setCurrentStep] = reactExports.useState(0);
  const [errors, setErrors] = reactExports.useState({});
  const [isSubmitting, setIsSubmitting] = reactExports.useState(false);
  const [isSuccess, setIsSuccess] = reactExports.useState(false);
  useBrowserTab({
    useBusinessName: false
    // Platform page, not tenant-specific
  });
  const { loadFromLocalStorage, clearSavedData } = useAutoSave({
    formData,
    enabled: currentStep > 0
  });
  reactExports.useEffect(() => {
    const loadSavedData = () => {
      const localData = loadFromLocalStorage();
      if (localData) {
        setFormData(localData);
        setCurrentStep(localData.step);
        return;
      }
      if (previewData?.fromPreview) {
        setFormData((prev) => ({
          ...prev,
          businessName: previewData.businessName || prev.businessName,
          businessPhone: previewData.phone || prev.businessPhone,
          businessAddress: {
            ...prev.businessAddress,
            city: previewData.city || prev.businessAddress.city,
            state: previewData.state || prev.businessAddress.state
          },
          industry: previewData.industry
        }));
      }
    };
    loadSavedData();
  }, [loadFromLocalStorage, previewData, clearSavedData]);
  reactExports.useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (currentStep > 0 && currentStep < STEPS.length - 1) {
        e.preventDefault();
        return "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [currentStep]);
  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };
  const handleAddressChange = (addressType, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [addressType]: { ...prev[addressType], [field]: value }
    }));
  };
  const handlePlanSelect = (planId, price) => {
    setFormData((prev) => ({
      ...prev,
      selectedPlan: planId,
      planPrice: price
    }));
  };
  const handleToggleSameAddress = (value) => {
    setFormData((prev) => ({
      ...prev,
      useSameAddress: value,
      billingAddress: value ? prev.businessAddress : prev.billingAddress
    }));
  };
  const validateStep = async (step) => {
    try {
      switch (step) {
        case 0:
          planSelectionSchema.parse({
            selectedPlan: formData.selectedPlan,
            planPrice: formData.planPrice
          });
          return true;
        case 1: {
          personalInfoSchema.parse({
            firstName: formData.firstName,
            lastName: formData.lastName,
            personalPhone: formData.personalPhone,
            personalEmail: formData.personalEmail
          });
          try {
            const response = await fetch(`${config.apiUrl || ""}/api/auth/check-email?email=${encodeURIComponent(formData.personalEmail)}`);
            if (!response.ok) {
              throw new Error(`Email check failed: ${response.status} ${response.statusText}`);
            }
            const result = await response.json();
            if (result.exists) {
              setErrors({ personalEmail: "An account with this email already exists" });
              return false;
            }
          } catch (emailCheckError) {
            console.error("Error checking email:", emailCheckError);
            setErrors({ personalEmail: "Unable to verify email availability. You can still proceed - duplicates will be caught during signup." });
          }
          return true;
        }
        case 2:
          businessInfoSchema.parse({
            businessName: formData.businessName,
            businessPhone: formData.businessPhone,
            businessEmail: formData.businessEmail,
            businessAddress: formData.businessAddress,
            industry: formData.industry
          });
          return true;
        case 3:
          return true;
        default:
          return false;
      }
    } catch (error) {
      const newErrors = {};
      if (error && typeof error === "object" && "errors" in error) {
        const zodError = error;
        zodError.errors.forEach((err) => {
          const field = err.path.join(".");
          newErrors[field] = err.message;
        });
      }
      setErrors(newErrors);
      return false;
    }
  };
  const goToNextStep = async () => {
    const isValid = await validateStep(currentStep);
    if (isValid) {
      const nextStep = currentStep + 1;
      setFormData((prev) => ({ ...prev, step: nextStep }));
      setCurrentStep(nextStep);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };
  const goToPreviousStep = () => {
    if (currentStep > 0) {
      const prevStep = currentStep - 1;
      setFormData((prev) => ({ ...prev, step: prevStep }));
      setCurrentStep(prevStep);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };
  const handlePaymentSuccess = (data) => {
    sessionStorage.setItem("newTenantSlug", data.slug);
    sessionStorage.setItem("newTenantWebsiteUrl", data.websiteUrl);
    sessionStorage.setItem("newTenantDashboardUrl", data.dashboardUrl);
    clearSavedData();
    setIsSuccess(true);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (currentStep === 3) {
      return;
    }
    const isValid = await validateStep(currentStep);
    if (!isValid) {
      return;
    }
    setIsSubmitting(true);
    try {
      if (currentStep === 2) {
        const industry = formData.industry || "mobile-detailing";
        const defaults = await loadDefaults(industry);
        setFormData((prev) => ({ ...prev, defaults }));
      }
      const nextStep = currentStep + 1;
      setFormData((prev) => ({ ...prev, step: nextStep }));
      setCurrentStep(nextStep);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      console.error("Step validation error:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to proceed. Please try again.";
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };
  if (isSuccess) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(SuccessPage, {});
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-stone-900 text-white", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(ApplicationHeader, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pt-16 sm:pt-20", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(StepProgress, { steps: STEPS, currentStep }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: (e) => {
        void handleSubmit(e);
      }, className: "pb-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-[400px] flex items-center justify-center", children: [
          currentStep === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
            PlanSelectionSection,
            {
              selectedPlan: formData.selectedPlan,
              onSelectPlan: handlePlanSelect
            }
          ),
          currentStep === 1 && /* @__PURE__ */ jsxRuntimeExports.jsx(
            PersonalInformationSection,
            {
              formData,
              handleInputChange: handleFieldChange,
              errors
            }
          ),
          currentStep === 2 && /* @__PURE__ */ jsxRuntimeExports.jsx(
            BusinessInformationSection,
            {
              formData,
              handleInputChange: handleFieldChange,
              handleAddressChange: (field, value) => {
                handleAddressChange("businessAddress", field, value);
              }
            }
          ),
          currentStep === 3 && /* @__PURE__ */ jsxRuntimeExports.jsx(Elements, { stripe: stripePromise, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            PaymentSection,
            {
              formData,
              businessAddress: formData.businessAddress,
              onAddressChange: (field, value) => {
                handleAddressChange("billingAddress", field, value);
              },
              onToggleSameAddress: handleToggleSameAddress,
              onPaymentSuccess: handlePaymentSuccess,
              errors,
              setErrors
            }
          ) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-2xl mx-auto mt-8 px-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col-reverse sm:flex-row justify-center gap-3 sm:gap-4", children: [
            currentStep > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                type: "button",
                onClick: goToPreviousStep,
                variant: "outline",
                size: "lg",
                className: "flex items-center justify-center gap-2",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "w-4 h-4" }),
                  "Back"
                ]
              }
            ),
            currentStep < STEPS.length - 1 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "button",
                onClick: () => {
                  void goToNextStep();
                },
                variant: "primary",
                size: "lg",
                className: currentStep === 0 ? "w-full" : "",
                disabled: currentStep === 0 && !formData.selectedPlan,
                children: currentStep === 0 ? "Get Started" : "Continue"
              }
            ) : currentStep !== 3 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "submit",
                variant: "primary",
                size: "lg",
                disabled: isSubmitting,
                className: "min-w-[200px]",
                children: isSubmitting ? "Processing..." : "Complete Purchase"
              }
            ) : null
          ] }),
          currentStep > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-center text-xs text-gray-500 mt-4", children: "Your progress is automatically saved" })
        ] })
      ] })
    ] }) })
  ] });
};

const useServicePage = () => {
  const { serviceType } = useParams();
  const { getAutoDetailingData, getMarineDetailingData, getRvDetailingData, getCeramicCoatingData, getPaintCorrectionData, getPpfData } = useServices();
  const getServiceData = () => {
    switch (serviceType) {
      case "auto-detailing":
        return getAutoDetailingData();
      case "marine-detailing":
        return getMarineDetailingData();
      case "rv-detailing":
        return getRvDetailingData();
      case "ceramic-coating":
        return getCeramicCoatingData();
      case "paint-correction":
        return getPaintCorrectionData();
      case "paint-protection-film":
      case "ppf-installation":
        return getPpfData();
      case "aircraft-detailing":
        return getAutoDetailingData();
      default:
        return getAutoDetailingData();
    }
  };
  const serviceData = getServiceData();
  return {
    serviceType,
    serviceData,
    isLoading: false,
    error: null
  };
};

const ServicePage = ({ onRequestQuote }) => {
  const { serviceData } = useServicePage();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("t");
  const { payload } = usePreviewParams();
  const [isQuoteModalOpen, setIsQuoteModalOpen] = reactExports.useState(false);
  const handleOpenQuoteModal = () => {
    if (onRequestQuote) {
      onRequestQuote();
    } else {
      setIsQuoteModalOpen(true);
    }
  };
  const handleCloseQuoteModal = () => {
    setIsQuoteModalOpen(false);
  };
  if (!serviceData) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "bg-stone-900 text-white min-h-screen flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold text-white mb-4", children: "Service Not Found" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-slate-300", children: "The requested service could not be found." })
    ] }) });
  }
  if (token && payload) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(PreviewDataProvider, { payload, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(PreviewCTAButton, { position: "left" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(PreviewCTAButton, { position: "right" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "bg-stone-900 text-white", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Header, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ServiceHero, { serviceData, onRequestQuote: handleOpenQuoteModal }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(WhatItIs, { serviceData }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Process, { serviceData }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Results, { serviceData }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ServiceCTA, { serviceData, onRequestQuote: handleOpenQuoteModal })
      ] }),
      isQuoteModalOpen && /* @__PURE__ */ jsxRuntimeExports.jsx(
        LazyRequestQuoteModal,
        {
          isOpen: isQuoteModalOpen,
          onClose: handleCloseQuoteModal
        }
      )
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(DataProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "bg-stone-900 text-white", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Header, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ServiceHero, { serviceData, ...onRequestQuote && { onRequestQuote } }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(WhatItIs, { serviceData }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Process, { serviceData }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Results, { serviceData }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ServiceCTA, { serviceData, ...onRequestQuote && { onRequestQuote } })
  ] }) });
};

reactExports.createContext(null);

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

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1e3,
      // 5 minutes
      gcTime: 10 * 60 * 1e3,
      // 10 minutes (formerly cacheTime)
      retry: 1,
      refetchOnWindowFocus: false
    }
  }
});
const Providers = ({ children }) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(ErrorBoundary, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(QueryClientProvider, { client: queryClient, children: /* @__PURE__ */ jsxRuntimeExports.jsx(AuthProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(TenantConfigProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(BrowserRouter, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(WebsiteContentProvider$1, { children }) }) }) }) }) });
};

const Booking = reactExports.lazy(() => __vitePreload(() => import('./BookingApp-vCIuGZzg.js'),true?__vite__mapDeps([11,3,4,5,10]):void 0));
const RootRouteHandler = () => {
  const [shouldRedirectToAdmin, setShouldRedirectToAdmin] = reactExports.useState(null);
  reactExports.useEffect(() => {
    const hostname = window.location.hostname;
    const isAdminDomain = hostname === "localhost" || hostname === "127.0.0.1" || hostname === "thatsmartsite-backend.onrender.com" || hostname === "thatsmartsite.com" || hostname === "www.thatsmartsite.com";
    setShouldRedirectToAdmin(isAdminDomain);
  }, []);
  if (shouldRedirectToAdmin === null) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-8 text-white", children: "Loading…" });
  }
  if (shouldRedirectToAdmin) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Navigate, { to: "/admin-dashboard", replace: true });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(TenantPage, {});
};
function App() {
  const [isQuoteModalOpen, setIsQuoteModalOpen] = reactExports.useState(false);
  const handleOpenQuoteModal = () => {
    setIsQuoteModalOpen(true);
  };
  const handleCloseQuoteModal = () => {
    setIsQuoteModalOpen(false);
  };
  const routes = /* @__PURE__ */ jsxRuntimeExports.jsx(reactExports.Suspense, { fallback: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-8 text-white", children: "Loading…" }), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Routes, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/", element: /* @__PURE__ */ jsxRuntimeExports.jsx(RootRouteHandler, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/login", element: /* @__PURE__ */ jsxRuntimeExports.jsx(LoginPage, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/admin-dashboard", element: /* @__PURE__ */ jsxRuntimeExports.jsx(ProtectedRoute, { requiredRole: "admin", fallbackPath: "/login", children: /* @__PURE__ */ jsxRuntimeExports.jsx(DashboardPage$1, {}) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/locations/:slug", element: /* @__PURE__ */ jsxRuntimeExports.jsx(HomePage, { onRequestQuote: handleOpenQuoteModal }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/service/:slug", element: /* @__PURE__ */ jsxRuntimeExports.jsx(ServicePage, { onRequestQuote: handleOpenQuoteModal }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/services/:slug", element: /* @__PURE__ */ jsxRuntimeExports.jsx(ServicePage, { onRequestQuote: handleOpenQuoteModal }) }),
    env.DEV && /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/:tenantSlug/services/:serviceType", element: /* @__PURE__ */ jsxRuntimeExports.jsx(ServicePage, { onRequestQuote: handleOpenQuoteModal }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/locations/:slug/book", element: /* @__PURE__ */ jsxRuntimeExports.jsx(Booking, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/book", element: /* @__PURE__ */ jsxRuntimeExports.jsx(Booking, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/booking", element: /* @__PURE__ */ jsxRuntimeExports.jsx(Booking, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/tenant-onboarding", element: /* @__PURE__ */ jsxRuntimeExports.jsx(TenantApplicationPage, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/preview-generator", element: /* @__PURE__ */ jsxRuntimeExports.jsx(PreviewGeneratorPage, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/preview", element: /* @__PURE__ */ jsxRuntimeExports.jsx(PreviewPage, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/dashboard", element: /* @__PURE__ */ jsxRuntimeExports.jsx(DataProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DashboardPage, {}) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/:slug/dashboard", element: /* @__PURE__ */ jsxRuntimeExports.jsx(DataProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DashboardPage, {}) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/:slug", element: /* @__PURE__ */ jsxRuntimeExports.jsx(TenantPage, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "*", element: /* @__PURE__ */ jsxRuntimeExports.jsx(Navigate, { to: "/", replace: true }) })
  ] }) });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Providers, { children: [
    routes,
    isQuoteModalOpen && /* @__PURE__ */ jsxRuntimeExports.jsx(
      LazyRequestQuoteModal,
      {
        isOpen: isQuoteModalOpen,
        onClose: handleCloseQuoteModal
      }
    )
  ] });
}

if ("serviceWorker" in navigator && config.serviceWorkerEnabled) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch((err) => {
      console.warn("SW registration failed:", err);
    });
  });
}
const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}
createRoot(rootElement).render(
  /* @__PURE__ */ jsxRuntimeExports.jsx(HelmetProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(App, {}) })
);

export { Button as B, __variableDynamicImportRuntimeHelper as _, __vitePreload as a, getImageOpacityClasses as b, useDataOptional as c, getVehicleYears as d, cn as e, formatPhoneNumberAsTyped as f, getTransitionStyles as g, apiService as h, useData as i, useTenantConfigLoader as j, assetsData as k, quoteRequestSchema as q, useImageRotation as u };
//# sourceMappingURL=index-KDICy8u4.js.map
