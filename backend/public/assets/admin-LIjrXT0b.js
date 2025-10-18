const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/BookingApp-C1px0hd6.js","assets/react-vendor-BNN4RoXa.js","assets/vendor-DHzeC1vT.js","assets/query-vendor-B2vaS9Wk.js","assets/usePreviewParams-CvkX68EC.js","assets/index-uRGx5rua.js"])))=>i.map(i=>d[i]);
import { E as ErrorBoundary, A as AuthProvider, B as Button, u as useBrowserTab, a as usePreviewParams, b as useIsDesktop, c as useScrollSpy, P as PreviewDataProvider, d as PreviewCTAButton, H as Header, e as Hero, S as ServicesGrid, R as Reviews, F as FAQ, G as Gallery, L as LazyRequestQuoteModal, f as createPreview, g as formatPhoneNumber, _ as __vitePreload, h as LoginPage, i as ProtectedRoute } from './usePreviewParams-CvkX68EC.js';
import { j as jsxRuntimeExports, Q as QueryClientProvider, D as Database, S as Settings, B as BarChart3, a as Star, U as Users, T as TrendingUp, r as reactExports, C as CheckCircle, A as AlertCircle, b as Shield, X as XCircle, c as X, d as AlertTriangle, e as UserPlus, f as UserCog, h as UserCheck, i as UserX, P as Plus, L as Loader2, E as ExternalLink, k as Trash2, l as Phone, M as Mail, H as Helmet, u as useNavigate, m as Sparkles, Z as Zap, n as Eye, R as Routes, o as Route, N as Navigate, p as createRoot, q as React, s as BrowserRouter } from './react-vendor-BNN4RoXa.js';
import { b as QueryClient } from './query-vendor-B2vaS9Wk.js';
import { a as apiService } from './api-BcBw9jk9.js';
import './vendor-DHzeC1vT.js';

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
const AdminProviders = ({ children }) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(ErrorBoundary, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(QueryClientProvider, { client: queryClient, children: /* @__PURE__ */ jsxRuntimeExports.jsx(AuthProvider, { children }) }) });
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

function getEnvironmentConfig() {
  return {
    isDevelopment: false,
    baseDomain: "thatsmartsite.com",
    port: void 0
    // No port needed in production
  };
}
function generateTenantWebsiteUrl(slug) {
  const config = getEnvironmentConfig();
  if (config.isDevelopment) {
    return `http://${slug}.${config.baseDomain}:${config.port}/`;
  }
  return `https://${slug}.${config.baseDomain}/`;
}
function generateTenantDashboardUrl(slug) {
  const config = getEnvironmentConfig();
  if (config.isDevelopment) {
    return `http://${slug}.${config.baseDomain}:${config.port}/dashboard`;
  }
  return `https://${slug}.${config.baseDomain}/dashboard`;
}
function generateTenantOnboardingUrl() {
  const config = getEnvironmentConfig();
  if (config.isDevelopment) {
    return `http://localhost:${config.port}/tenant-onboarding`;
  }
  return `https://${config.baseDomain}/tenant-onboarding`;
}

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
                href: generateTenantWebsiteUrl(user.slug),
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
                href: generateTenantDashboardUrl(user.slug),
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
            href: generateTenantOnboardingUrl(),
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

const TabContent = ({ activeTab }) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { children: [
    activeTab === "users" && /* @__PURE__ */ jsxRuntimeExports.jsx(UsersTab, {}),
    activeTab === "reviews" && /* @__PURE__ */ jsxRuntimeExports.jsx(ReviewsTab, {}),
    activeTab === "analytics" && /* @__PURE__ */ jsxRuntimeExports.jsx(AnalyticsTab, {}),
    activeTab === "settings" && /* @__PURE__ */ jsxRuntimeExports.jsx(SettingsTab, {})
  ] });
};

const DashboardPage = () => {
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
      TabContent,
      {
        activeTab
      }
    )
  ] });
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

const INDUSTRIES = [
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
            children: INDUSTRIES.map((industry) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: industry.value, children: industry.label }, industry.value))
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

const Booking = reactExports.lazy(() => __vitePreload(() => import('./BookingApp-C1px0hd6.js'),true?__vite__mapDeps([0,1,2,3,4,5]):void 0));
function AdminApp() {
  const routes = /* @__PURE__ */ jsxRuntimeExports.jsx(reactExports.Suspense, { fallback: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-8 text-white", children: "Loading…" }), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Routes, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/", element: /* @__PURE__ */ jsxRuntimeExports.jsx(Navigate, { to: "/admin-dashboard", replace: true }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/login", element: /* @__PURE__ */ jsxRuntimeExports.jsx(LoginPage, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/admin-dashboard", element: /* @__PURE__ */ jsxRuntimeExports.jsx(ProtectedRoute, { requiredRole: "admin", fallbackPath: "/login", children: /* @__PURE__ */ jsxRuntimeExports.jsx(DashboardPage, {}) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/preview-generator", element: /* @__PURE__ */ jsxRuntimeExports.jsx(PreviewGeneratorPage, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/preview/:tenantSlug", element: /* @__PURE__ */ jsxRuntimeExports.jsx(PreviewPage, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/booking", element: /* @__PURE__ */ jsxRuntimeExports.jsx(Booking, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "*", element: /* @__PURE__ */ jsxRuntimeExports.jsx(Navigate, { to: "/admin-dashboard", replace: true }) })
  ] }) });
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen bg-gray-900", children: routes });
}

const container = document.getElementById("root");
if (!container) {
  throw new Error("Root element not found");
}
const root = createRoot(container);
root.render(
  /* @__PURE__ */ jsxRuntimeExports.jsx(React.StrictMode, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(BrowserRouter, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(AdminProviders, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(AdminApp, {}) }) }) })
);
//# sourceMappingURL=admin-LIjrXT0b.js.map
