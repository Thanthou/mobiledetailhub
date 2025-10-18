const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./BookingApp-f9C5pRXt.js","./react-vendor-DQPnB1La.js","./vendor-70dlA11R.js","./query-vendor-B2vaS9Wk.js","./usePreviewParams-BhJVeIAh.js","./index-Lf2ND122.js"])))=>i.map(i=>d[i]);
import { j as useIndustrySiteData, k as useData, u as useBrowserTab, C as CTAButtons, l as useTenantSlug, m as useReviewsAvailability, b as useIsDesktop, c as useScrollSpy, n as injectAllSchemas, H as Header, e as Hero, S as ServicesGrid, R as Reviews, F as FAQ, G as Gallery, D as DataProvider, L as LazyRequestQuoteModal, E as ErrorBoundary, A as AuthProvider, T as TenantConfigProvider, W as WebsiteContentProvider$1, o as config, B as Button, g as formatPhoneNumber, p as getPhoneDigits, q as useAuth, r as loadIndustryFAQs, s as env, I as Input, t as __variableDynamicImportRuntimeHelper, _ as __vitePreload, v as useServices, a as usePreviewParams, P as PreviewDataProvider, d as PreviewCTAButton, h as LoginPage, i as ProtectedRoute } from './usePreviewParams-BhJVeIAh.js';
import { j as jsxRuntimeExports, L as Loader2, A as AlertCircle, C as CheckCircle, r as reactExports, t as useInRouterContext, Q as QueryClientProvider, v as Car, w as Calendar, x as Home, G as Globe, y as MapPin, z as User, U as Users, F as useParams, c as X, P as Plus, d as AlertTriangle, k as Trash2, I as ChevronDown, J as ChevronRight, K as Building2, O as Link, V as Clock, l as Phone, M as Mail, W as DollarSign, Y as FileText, _ as ChevronLeft, $ as Filter, a0 as Search, a1 as reactDomExports, a2 as Save, a3 as Pen, a4 as Truck, a5 as Bot, a6 as Bike, a7 as Mountain, a8 as HelpCircle, q as React, S as Settings, a9 as MessageSquare, aa as Upload, ab as Send, a as Star, n as Eye, ac as Image, ad as RefreshCw, X as XCircle, ae as Check, af as Wrench, E as ExternalLink, B as BarChart3, ag as Copy, b as Shield, Z as Zap, ah as useQuery, T as TrendingUp, ai as Heart, aj as Link$1, ak as ArrowLeft, m as Sparkles, u as useNavigate, al as useStripe, am as useElements, an as CreditCard, ao as CardElement, ap as Lock, aq as useLocation, ar as Elements, as as useSearchParams, R as Routes, o as Route, N as Navigate, p as createRoot, s as BrowserRouter } from './react-vendor-DQPnB1La.js';
import { b as QueryClient } from './query-vendor-B2vaS9Wk.js';
import { o as object, b as string, e as email, n as number, _ as _enum, d as boolean, l as loadStripe } from './vendor-70dlA11R.js';

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

function useRouterDebug(name) {
  const inside = useInRouterContext();
  reactExports.useEffect(() => console.log(`[RouterDebug] ${name} in router?`, inside), [inside]);
}

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
  useRouterDebug("Providers");
  return /* @__PURE__ */ jsxRuntimeExports.jsx(ErrorBoundary, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(QueryClientProvider, { client: queryClient, children: /* @__PURE__ */ jsxRuntimeExports.jsx(AuthProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(TenantConfigProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(WebsiteContentProvider$1, { children }) }) }) }) });
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
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { className: "h-6 w-6 text-orange-500" }),
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
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { className: "h-4 w-4 mr-2" }),
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
        /* @__PURE__ */ jsxRuntimeExports.jsx(Image, { className: "h-5 w-5 text-orange-400 mr-3" }),
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
              /* @__PURE__ */ jsxRuntimeExports.jsx(Image, { className: "h-4 w-4 mr-2" }),
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
            /* @__PURE__ */ jsxRuntimeExports.jsx(Image, { className: "h-8 w-8 mx-auto mb-2 opacity-50" }),
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
        /* @__PURE__ */ jsxRuntimeExports.jsx(Image, { className: "h-5 w-5 text-orange-400 mr-3" }),
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
              /* @__PURE__ */ jsxRuntimeExports.jsx(Image, { className: "h-4 w-4 mr-2" }),
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
    /* @__PURE__ */ jsxRuntimeExports.jsx(Link$1, { to: "/", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
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
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link$1, { to: "/", className: "w-full sm:w-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
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
        const module = await __variableDynamicImportRuntimeHelper((/* #__PURE__ */ Object.assign({"../../data/mobile-detailing/faq/aftercare.json": () => __vitePreload(() => import('./aftercare-ZKXYZUbn.js'),true?[]:void 0,import.meta.url),"../../data/mobile-detailing/faq/general.json": () => __vitePreload(() => import('./general-BhqPoWqx.js'),true?[]:void 0,import.meta.url),"../../data/mobile-detailing/faq/locations.json": () => __vitePreload(() => import('./locations-D5I2ap43.js'),true?[]:void 0,import.meta.url),"../../data/mobile-detailing/faq/payments.json": () => __vitePreload(() => import('./payments-CrPeLMHg.js'),true?[]:void 0,import.meta.url),"../../data/mobile-detailing/faq/preparation.json": () => __vitePreload(() => import('./preparation-Btp8GDff.js'),true?[]:void 0,import.meta.url),"../../data/mobile-detailing/faq/pricing.json": () => __vitePreload(() => import('./pricing-Bzt245QG.js'),true?[]:void 0,import.meta.url),"../../data/mobile-detailing/faq/scheduling.json": () => __vitePreload(() => import('./scheduling-Cx-yGBz2.js'),true?[]:void 0,import.meta.url),"../../data/mobile-detailing/faq/services.json": () => __vitePreload(() => import('./services-BqnJbWY7.js'),true?[]:void 0,import.meta.url),"../../data/mobile-detailing/faq/warranty.json": () => __vitePreload(() => import('./warranty-CGuBowID.js'),true?[]:void 0,import.meta.url)})), `../../data/${industry}/faq/${category}.json`, 6);
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
      __variableDynamicImportRuntimeHelper((/* #__PURE__ */ Object.assign({"../../data/lawncare/content-defaults.json": () => __vitePreload(() => import('./content-defaults-DUKtAQk1.js'),true?[]:void 0,import.meta.url),"../../data/maid-service/content-defaults.json": () => __vitePreload(() => import('./content-defaults-VsXc3K3N.js'),true?[]:void 0,import.meta.url),"../../data/mobile-detailing/content-defaults.json": () => __vitePreload(() => import('./content-defaults-Df6c8CcD.js'),true?[]:void 0,import.meta.url),"../../data/pet-grooming/content-defaults.json": () => __vitePreload(() => import('./content-defaults-L38T1BM2.js'),true?[]:void 0,import.meta.url)})), `../../data/${industry}/content-defaults.json`, 5),
      __variableDynamicImportRuntimeHelper((/* #__PURE__ */ Object.assign({"../../data/lawncare/seo-defaults.json": () => __vitePreload(() => import('./seo-defaults-DFelq5cF.js'),true?[]:void 0,import.meta.url),"../../data/maid-service/seo-defaults.json": () => __vitePreload(() => import('./seo-defaults-DbAKbhjx.js'),true?[]:void 0,import.meta.url),"../../data/mobile-detailing/seo-defaults.json": () => __vitePreload(() => import('./seo-defaults-2tSsldvQ.js'),true?[]:void 0,import.meta.url),"../../data/pet-grooming/seo-defaults.json": () => __vitePreload(() => import('./seo-defaults-CEdMz0wm.js'),true?[]:void 0,import.meta.url)})), `../../data/${industry}/seo-defaults.json`, 5),
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

const Booking = reactExports.lazy(() => __vitePreload(() => import('./BookingApp-f9C5pRXt.js'),true?__vite__mapDeps([0,1,2,3,4,5]):void 0,import.meta.url));
function TenantApp() {
  useRouterDebug("TenantApp");
  const [isQuoteModalOpen, setIsQuoteModalOpen] = reactExports.useState(false);
  const handleCloseQuoteModal = () => {
    setIsQuoteModalOpen(false);
  };
  const routes = /* @__PURE__ */ jsxRuntimeExports.jsx(reactExports.Suspense, { fallback: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-8 text-white", children: "Loading…" }), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Routes, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/", element: /* @__PURE__ */ jsxRuntimeExports.jsx(TenantPage, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/login", element: /* @__PURE__ */ jsxRuntimeExports.jsx(LoginPage, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/dashboard", element: /* @__PURE__ */ jsxRuntimeExports.jsx(ProtectedRoute, { requiredRole: ["admin", "tenant"], fallbackPath: "/", children: /* @__PURE__ */ jsxRuntimeExports.jsx(DashboardPage, {}) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/tenant-onboarding", element: /* @__PURE__ */ jsxRuntimeExports.jsx(TenantApplicationPage, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/booking", element: /* @__PURE__ */ jsxRuntimeExports.jsx(Booking, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/services/:serviceType", element: /* @__PURE__ */ jsxRuntimeExports.jsx(Navigate, { to: "/services/:serviceType", replace: true }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/:businessSlug/services/:serviceType", element: /* @__PURE__ */ jsxRuntimeExports.jsx(ServicePage, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/:businessSlug/dashboard", element: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: "20px", background: "red", color: "white" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { children: "DASHBOARD ROUTE MATCHED!" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
        "Business Slug: ",
        window.location.pathname.split("/")[1]
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ProtectedRoute, { requiredRole: ["admin", "tenant"], fallbackPath: "/", children: /* @__PURE__ */ jsxRuntimeExports.jsx(DashboardPage, {}) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/:businessSlug/booking", element: /* @__PURE__ */ jsxRuntimeExports.jsx(Booking, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/:businessSlug", element: /* @__PURE__ */ jsxRuntimeExports.jsx(HomePage, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "*", element: /* @__PURE__ */ jsxRuntimeExports.jsx(Navigate, { to: "/", replace: true }) })
  ] }) });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-gray-900", children: [
    routes,
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      LazyRequestQuoteModal,
      {
        isOpen: isQuoteModalOpen,
        onClose: handleCloseQuoteModal
      }
    )
  ] });
}

const container = document.getElementById("root");
if (!container) {
  throw new Error("Root element not found");
}
const root = createRoot(container);
root.render(
  /* @__PURE__ */ jsxRuntimeExports.jsx(React.StrictMode, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(BrowserRouter, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Providers, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(TenantApp, {}) }) }) })
);
//# sourceMappingURL=tenant-qfHrHyGl.js.map
