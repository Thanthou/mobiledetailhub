import { r as reactExports, j as jsxRuntimeExports, Y as ChevronLeft, I as ChevronRight, as as create, ag as useQuery, c as X, ay as ChevronUp, F as ChevronDown, a as Star, ao as Lock, m as Sparkles, ae as Wrench, az as Droplets, b as Shield, C as CheckCircle, q as React, t as Car, x as MapPin, W as FileText, am as CreditCard, P as Plus, aA as CarFront, a3 as Truck, aB as Ship, aC as Plane, a5 as Bike, aD as MoreHorizontal, u as useNavigate } from './react-vendor-B9VNSH7T.js';
import { m as subscribeWithSelector, p as devtools } from './vendor-Utq0i4S3.js';
import { t as __variableDynamicImportRuntimeHelper, _ as __vitePreload, w as useImageRotation, x as getTransitionStyles, y as getImageOpacityClasses, z as useDataOptional, J as getVehicleYears } from './usePreviewParams-DBlmro9g.js';
import { g as getMakesForType, a as getModelsForMake } from './index-Blp59fFO.js';
import './query-vendor-B2vaS9Wk.js';

const Carousel = ({
  items,
  selectedItem,
  renderItem,
  onItemClick,
  emptyMessage = "No items available",
  containerHeight = "h-[70vh]",
  containerTop = "top-[36.5%]"
}) => {
  const [currentIndex, setCurrentIndex] = reactExports.useState(0);
  reactExports.useEffect(() => {
    if (items.length > 0) {
      const popularIndex = items.findIndex((item) => item.popular);
      const initialIndex = popularIndex !== -1 ? popularIndex : 0;
      setCurrentIndex(initialIndex);
    }
  }, [items]);
  const handlePrevious = () => {
    setCurrentIndex((prev) => prev > 0 ? prev - 1 : items.length - 1);
  };
  const handleNext = () => {
    setCurrentIndex((prev) => prev < items.length - 1 ? prev + 1 : 0);
  };
  const getVisibleItems = () => {
    const visible = [];
    for (let i = -1; i <= 1; i++) {
      const index = (currentIndex + i + items.length) % items.length;
      const item = items[index];
      if (item) {
        visible.push({
          ...item,
          popular: item.popular || false,
          // Ensure boolean type
          position: i === 0 ? "center" : i === -1 ? "left" : "right"
        });
      }
    }
    return visible;
  };
  if (items.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-12", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-300 text-lg", children: emptyMessage }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `relative w-full max-w-5xl mx-auto ${containerHeight}`, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `absolute ${containerTop} left-1/2 transform -translate-x-1/2 w-full`, children: [
    items.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: handlePrevious,
          className: "absolute -left-8 sm:-left-16 md:-left-32 lg:-left-64 top-1/2 -translate-y-1/2 z-20 bg-orange-500 hover:bg-orange-600 text-white p-4 rounded-full transition-colors shadow-lg",
          "aria-label": "Previous item",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "h-6 w-6" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: handleNext,
          className: "absolute -right-8 sm:-right-16 md:-right-32 lg:-right-64 top-1/2 -translate-y-1/2 z-20 bg-orange-500 hover:bg-orange-600 text-white p-4 rounded-full transition-colors shadow-lg",
          "aria-label": "Next item",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-6 w-6" })
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center gap-4 w-full max-w-5xl", children: getVisibleItems().map((item) => {
      const isSelected = selectedItem === item.id;
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: () => onItemClick?.(item),
          className: "bg-transparent border-none p-0 cursor-pointer",
          children: renderItem(item, isSelected)
        },
        item.id
      );
    }) })
  ] }) });
};

const initialBookingData = {
  vehicle: "",
  vehicleDetails: {
    make: "",
    model: "",
    year: "",
    color: "",
    length: ""
  },
  location: {
    address: "",
    city: "",
    state: "",
    zip: "",
    notes: "",
    locationType: ""
  },
  serviceTier: "",
  addons: [],
  schedule: { dates: [], time: "" },
  paymentMethod: ""
};
const stepOrder = ["vehicle-selection", "location", "service-tier", "addons", "schedule", "payment"];
const useBookingStore = create()(
  subscribeWithSelector(
    devtools(
      (set, get) => ({
        // Initial state
        currentStep: "vehicle-selection",
        bookingData: initialBookingData,
        completedSteps: [],
        isLoading: false,
        errors: [],
        // Actions
        setCurrentStep: (step) => {
          const currentIndex = stepOrder.indexOf(step);
          const completedSteps = stepOrder.slice(0, currentIndex);
          set({
            currentStep: step,
            completedSteps,
            errors: []
            // Clear errors when changing steps
          });
        },
        updateBookingData: (data) => {
          set((state) => ({
            bookingData: { ...state.bookingData, ...data }
          }));
        },
        setVehicle: (vehicle) => {
          set((state) => ({
            bookingData: { ...state.bookingData, vehicle }
          }));
        },
        setVehicleDetails: (details) => {
          set((state) => ({
            bookingData: {
              ...state.bookingData,
              vehicleDetails: { ...state.bookingData.vehicleDetails, ...details }
            }
          }));
        },
        setLocation: (location) => {
          set((state) => ({
            bookingData: {
              ...state.bookingData,
              location: { ...state.bookingData.location, ...location }
            }
          }));
        },
        setServiceTier: (tier) => {
          set((state) => ({
            bookingData: { ...state.bookingData, serviceTier: tier }
          }));
        },
        setAddons: (addons) => {
          set((state) => ({
            bookingData: { ...state.bookingData, addons }
          }));
        },
        setSchedule: (schedule) => {
          set((state) => ({
            bookingData: { ...state.bookingData, schedule }
          }));
        },
        setPaymentMethod: (method) => {
          set((state) => ({
            bookingData: { ...state.bookingData, paymentMethod: method }
          }));
        },
        nextStep: () => {
          const { currentStep } = get();
          const currentIndex = stepOrder.indexOf(currentStep);
          if (currentIndex < stepOrder.length - 1) {
            const nextStep = stepOrder[currentIndex + 1];
            if (nextStep) {
              set(() => {
                const newIndex = stepOrder.indexOf(nextStep);
                const completedSteps = stepOrder.slice(0, newIndex);
                return {
                  currentStep: nextStep,
                  completedSteps,
                  errors: []
                  // Clear errors when changing steps
                };
              });
            }
          }
        },
        previousStep: () => {
          const { currentStep } = get();
          const currentIndex = stepOrder.indexOf(currentStep);
          if (currentIndex > 0) {
            const prevStep = stepOrder[currentIndex - 1];
            if (prevStep) {
              set(() => {
                const newIndex = stepOrder.indexOf(prevStep);
                const completedSteps = stepOrder.slice(0, newIndex);
                return {
                  currentStep: prevStep,
                  completedSteps,
                  errors: []
                  // Clear errors when changing steps
                };
              });
            }
          }
        },
        resetBooking: () => {
          set({
            currentStep: "vehicle-selection",
            bookingData: initialBookingData,
            completedSteps: [],
            isLoading: false,
            errors: []
          });
        },
        setLoading: (loading) => {
          set({ isLoading: loading });
        },
        setErrors: (errors) => {
          set({ errors });
        },
        addError: (error) => {
          set((state) => ({
            errors: [...state.errors, error]
          }));
        },
        clearErrors: () => {
          set({ errors: [] });
        }
      }),
      {
        name: "booking-store"
        // Unique name for devtools
      }
    )
  )
);
const useBookingStep = () => {
  const currentStep = useBookingStore((state) => state.currentStep);
  const completedSteps = useBookingStore((state) => state.completedSteps);
  const nextStep = useBookingStore((state) => state.nextStep);
  const previousStep = useBookingStore((state) => state.previousStep);
  const setCurrentStep = useBookingStore((state) => state.setCurrentStep);
  return reactExports.useMemo(() => ({
    currentStep,
    completedSteps,
    nextStep,
    previousStep,
    setCurrentStep
  }), [currentStep, completedSteps, nextStep, previousStep, setCurrentStep]);
};
const useBookingData = () => {
  const bookingData = useBookingStore((state) => state.bookingData);
  const setVehicle = useBookingStore((state) => state.setVehicle);
  const setVehicleDetails = useBookingStore((state) => state.setVehicleDetails);
  const setLocation = useBookingStore((state) => state.setLocation);
  const setServiceTier = useBookingStore((state) => state.setServiceTier);
  const setAddons = useBookingStore((state) => state.setAddons);
  const setSchedule = useBookingStore((state) => state.setSchedule);
  const setPaymentMethod = useBookingStore((state) => state.setPaymentMethod);
  return reactExports.useMemo(() => ({
    bookingData,
    setVehicle,
    setVehicleDetails,
    setLocation,
    setServiceTier,
    setAddons,
    setSchedule,
    setPaymentMethod
  }), [bookingData, setVehicle, setVehicleDetails, setLocation, setServiceTier, setAddons, setSchedule, setPaymentMethod]);
};
const useBookingVehicle = () => {
  const vehicle = useBookingStore((state) => state.bookingData.vehicle);
  const vehicleDetails = useBookingStore((state) => state.bookingData.vehicleDetails);
  const setVehicle = useBookingStore((state) => state.setVehicle);
  const setVehicleDetails = useBookingStore((state) => state.setVehicleDetails);
  return reactExports.useMemo(() => ({
    vehicle,
    vehicleDetails,
    setVehicle,
    setVehicleDetails
  }), [vehicle, vehicleDetails, setVehicle, setVehicleDetails]);
};
const useBookingService = () => {
  const serviceTier = useBookingStore((state) => state.bookingData.serviceTier);
  const setServiceTier = useBookingStore((state) => state.setServiceTier);
  return reactExports.useMemo(() => ({
    serviceTier,
    setServiceTier
  }), [serviceTier, setServiceTier]);
};
const useBookingAddons = () => {
  const addons = useBookingStore((state) => state.bookingData.addons);
  const setAddons = useBookingStore((state) => state.setAddons);
  return reactExports.useMemo(() => ({
    addons,
    setAddons
  }), [addons, setAddons]);
};
const useBookingSchedule = () => {
  const schedule = useBookingStore((state) => state.bookingData.schedule);
  const setSchedule = useBookingStore((state) => state.setSchedule);
  return reactExports.useMemo(() => ({
    schedule,
    setSchedule
  }), [schedule, setSchedule]);
};
const useBookingPayment = () => {
  const paymentMethod = useBookingStore((state) => state.bookingData.paymentMethod);
  const setPaymentMethod = useBookingStore((state) => state.setPaymentMethod);
  return reactExports.useMemo(() => ({
    paymentMethod,
    setPaymentMethod
  }), [paymentMethod, setPaymentMethod]);
};

async function getBookingGalleryImages() {
  try {
    const res = await fetch("/mobile-detailing/data/gallery.json");
    if (!res.ok) {
      throw new Error(`Failed to fetch gallery data: ${res.status}`);
    }
    const data = await res.json();
    if (!Array.isArray(data)) {
      throw new Error("Gallery data is not an array");
    }
    return data;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Failed to load gallery images:", message);
    throw error;
  }
}

function useBookingGallery() {
  const [images, setImages] = reactExports.useState([]);
  const [isLoading, setIsLoading] = reactExports.useState(true);
  const [error, setError] = reactExports.useState(null);
  reactExports.useEffect(() => {
    let cancelled = false;
    const loadImages = async () => {
      try {
        setIsLoading(true);
        const data = await getBookingGalleryImages();
        if (!cancelled) {
          setImages(data);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error(String(err)));
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };
    void loadImages();
    return () => {
      cancelled = true;
    };
  }, []);
  return { images, isLoading, error };
}

const VEHICLE_FOLDER_MAP = {
  "car": "cars",
  "truck": "trucks",
  "suv": "suvs",
  "boat": "boats",
  "rv": "rvs"
};
const toFolderName = (vehicleType) => {
  return VEHICLE_FOLDER_MAP[vehicleType] || null;
};

const getCardDescription = (serviceData, featureKeys, featuresData, maxFeatures = 3) => {
  if (serviceData.description) {
    return serviceData.description;
  }
  if (featureKeys.length === 0) {
    return "No features available";
  }
  const featureNames = featureKeys.map((featureKey) => {
    const feature = featuresData[featureKey];
    return feature ? feature.name : featureKey;
  });
  if (featureNames.length > maxFeatures) {
    return featureNames.slice(0, maxFeatures).join(", ") + "...";
  }
  return featureNames.join(", ");
};
const generateFeatureDetails = (featureKey, featuresData) => {
  return featuresData[featureKey] || null;
};

const useAddons = (vehicleType, category) => {
  const [availableAddons, setAvailableAddons] = reactExports.useState([]);
  const { data, isLoading, error } = useQuery({
    queryKey: ["addons", vehicleType, category],
    queryFn: async () => {
      const folderName = toFolderName(vehicleType);
      if (!folderName) {
        throw new Error(`No addons available for vehicle type: ${vehicleType}`);
      }
      try {
        try {
          const [addonsData, featuresData] = await Promise.all([
            __variableDynamicImportRuntimeHelper((/* #__PURE__ */ Object.assign({"../../../data/mobile-detailing/pricing/cars/addons/engine/service.json": () => __vitePreload(() => import('./service-BEzWcS-g.js'),true?[]:void 0,import.meta.url),"../../../data/mobile-detailing/pricing/cars/addons/trim/service.json": () => __vitePreload(() => import('./service-D4pcyjdy.js'),true?[]:void 0,import.meta.url),"../../../data/mobile-detailing/pricing/cars/addons/wheels/service.json": () => __vitePreload(() => import('./service-CbM9I9RS.js'),true?[]:void 0,import.meta.url),"../../../data/mobile-detailing/pricing/cars/addons/windows/service.json": () => __vitePreload(() => import('./service-BdopIuPk.js'),true?[]:void 0,import.meta.url),"../../../data/mobile-detailing/pricing/suvs/addons/engine/service.json": () => __vitePreload(() => import('./service-DH9YX95O.js'),true?[]:void 0,import.meta.url),"../../../data/mobile-detailing/pricing/suvs/addons/trim/service.json": () => __vitePreload(() => import('./service-DFW3ksOf.js'),true?[]:void 0,import.meta.url),"../../../data/mobile-detailing/pricing/suvs/addons/wheels/service.json": () => __vitePreload(() => import('./service-CT15kkxn.js'),true?[]:void 0,import.meta.url),"../../../data/mobile-detailing/pricing/suvs/addons/windows/service.json": () => __vitePreload(() => import('./service-Du4ndQtF.js'),true?[]:void 0,import.meta.url),"../../../data/mobile-detailing/pricing/trucks/addons/engine/service.json": () => __vitePreload(() => import('./service-g9ErXRIi.js'),true?[]:void 0,import.meta.url),"../../../data/mobile-detailing/pricing/trucks/addons/trim/service.json": () => __vitePreload(() => import('./service-BfYcBDVL.js'),true?[]:void 0,import.meta.url),"../../../data/mobile-detailing/pricing/trucks/addons/wheels/service.json": () => __vitePreload(() => import('./service-CaAmcbK8.js'),true?[]:void 0,import.meta.url),"../../../data/mobile-detailing/pricing/trucks/addons/windows/service.json": () => __vitePreload(() => import('./service-Ce_J3A95.js'),true?[]:void 0,import.meta.url)})), `../../../data/mobile-detailing/pricing/${folderName}/addons/${category}/service.json`, 10),
            __variableDynamicImportRuntimeHelper((/* #__PURE__ */ Object.assign({"../../../data/mobile-detailing/pricing/cars/addons/engine/features.json": () => __vitePreload(() => import('./features-CS68DUQ8.js'),true?[]:void 0,import.meta.url),"../../../data/mobile-detailing/pricing/cars/addons/trim/features.json": () => __vitePreload(() => import('./features-P4yOr9AI.js'),true?[]:void 0,import.meta.url),"../../../data/mobile-detailing/pricing/cars/addons/wheels/features.json": () => __vitePreload(() => import('./features-DOO7wXgF.js'),true?[]:void 0,import.meta.url),"../../../data/mobile-detailing/pricing/cars/addons/windows/features.json": () => __vitePreload(() => import('./features-D8cJNIGE.js'),true?[]:void 0,import.meta.url),"../../../data/mobile-detailing/pricing/suvs/addons/engine/features.json": () => __vitePreload(() => import('./features-FEf-_h5D.js'),true?[]:void 0,import.meta.url),"../../../data/mobile-detailing/pricing/suvs/addons/trim/features.json": () => __vitePreload(() => import('./features-aPwWVBb4.js'),true?[]:void 0,import.meta.url),"../../../data/mobile-detailing/pricing/suvs/addons/wheels/features.json": () => __vitePreload(() => import('./features-DLMh5PwL.js'),true?[]:void 0,import.meta.url),"../../../data/mobile-detailing/pricing/suvs/addons/windows/features.json": () => __vitePreload(() => import('./features-DR3z9Yat.js'),true?[]:void 0,import.meta.url),"../../../data/mobile-detailing/pricing/trucks/addons/engine/features.json": () => __vitePreload(() => import('./features-YLEwsVtC.js'),true?[]:void 0,import.meta.url),"../../../data/mobile-detailing/pricing/trucks/addons/trim/features.json": () => __vitePreload(() => import('./features-azYXzFfc.js'),true?[]:void 0,import.meta.url),"../../../data/mobile-detailing/pricing/trucks/addons/wheels/features.json": () => __vitePreload(() => import('./features-DCwu-Jfs.js'),true?[]:void 0,import.meta.url),"../../../data/mobile-detailing/pricing/trucks/addons/windows/features.json": () => __vitePreload(() => import('./features-rvX0tStJ.js'),true?[]:void 0,import.meta.url)})), `../../../data/mobile-detailing/pricing/${folderName}/addons/${category}/features.json`, 10)
          ]);
          return {
            addons: addonsData.default,
            features: featuresData.default,
            type: "service"
          };
        } catch {
          const categoryData = await __variableDynamicImportRuntimeHelper((/* #__PURE__ */ Object.assign({"../../../data/mobile-detailing/pricing/cars/addons/engine/features.json": () => __vitePreload(() => import('./features-CS68DUQ8.js'),true?[]:void 0,import.meta.url),"../../../data/mobile-detailing/pricing/cars/addons/engine/service.json": () => __vitePreload(() => import('./service-BEzWcS-g.js'),true?[]:void 0,import.meta.url),"../../../data/mobile-detailing/pricing/cars/addons/trim/features.json": () => __vitePreload(() => import('./features-P4yOr9AI.js'),true?[]:void 0,import.meta.url),"../../../data/mobile-detailing/pricing/cars/addons/trim/service.json": () => __vitePreload(() => import('./service-D4pcyjdy.js'),true?[]:void 0,import.meta.url),"../../../data/mobile-detailing/pricing/cars/addons/wheels/features.json": () => __vitePreload(() => import('./features-DOO7wXgF.js'),true?[]:void 0,import.meta.url),"../../../data/mobile-detailing/pricing/cars/addons/wheels/service.json": () => __vitePreload(() => import('./service-CbM9I9RS.js'),true?[]:void 0,import.meta.url),"../../../data/mobile-detailing/pricing/cars/addons/windows/features.json": () => __vitePreload(() => import('./features-D8cJNIGE.js'),true?[]:void 0,import.meta.url),"../../../data/mobile-detailing/pricing/cars/addons/windows/service.json": () => __vitePreload(() => import('./service-BdopIuPk.js'),true?[]:void 0,import.meta.url),"../../../data/mobile-detailing/pricing/suvs/addons/engine/features.json": () => __vitePreload(() => import('./features-FEf-_h5D.js'),true?[]:void 0,import.meta.url),"../../../data/mobile-detailing/pricing/suvs/addons/engine/service.json": () => __vitePreload(() => import('./service-DH9YX95O.js'),true?[]:void 0,import.meta.url),"../../../data/mobile-detailing/pricing/suvs/addons/trim/features.json": () => __vitePreload(() => import('./features-aPwWVBb4.js'),true?[]:void 0,import.meta.url),"../../../data/mobile-detailing/pricing/suvs/addons/trim/service.json": () => __vitePreload(() => import('./service-DFW3ksOf.js'),true?[]:void 0,import.meta.url),"../../../data/mobile-detailing/pricing/suvs/addons/wheels/features.json": () => __vitePreload(() => import('./features-DLMh5PwL.js'),true?[]:void 0,import.meta.url),"../../../data/mobile-detailing/pricing/suvs/addons/wheels/service.json": () => __vitePreload(() => import('./service-CT15kkxn.js'),true?[]:void 0,import.meta.url),"../../../data/mobile-detailing/pricing/suvs/addons/windows/features.json": () => __vitePreload(() => import('./features-DR3z9Yat.js'),true?[]:void 0,import.meta.url),"../../../data/mobile-detailing/pricing/suvs/addons/windows/service.json": () => __vitePreload(() => import('./service-Du4ndQtF.js'),true?[]:void 0,import.meta.url),"../../../data/mobile-detailing/pricing/trucks/addons/engine/features.json": () => __vitePreload(() => import('./features-YLEwsVtC.js'),true?[]:void 0,import.meta.url),"../../../data/mobile-detailing/pricing/trucks/addons/engine/service.json": () => __vitePreload(() => import('./service-g9ErXRIi.js'),true?[]:void 0,import.meta.url),"../../../data/mobile-detailing/pricing/trucks/addons/trim/features.json": () => __vitePreload(() => import('./features-azYXzFfc.js'),true?[]:void 0,import.meta.url),"../../../data/mobile-detailing/pricing/trucks/addons/trim/service.json": () => __vitePreload(() => import('./service-BfYcBDVL.js'),true?[]:void 0,import.meta.url),"../../../data/mobile-detailing/pricing/trucks/addons/wheels/features.json": () => __vitePreload(() => import('./features-DCwu-Jfs.js'),true?[]:void 0,import.meta.url),"../../../data/mobile-detailing/pricing/trucks/addons/wheels/service.json": () => __vitePreload(() => import('./service-CaAmcbK8.js'),true?[]:void 0,import.meta.url),"../../../data/mobile-detailing/pricing/trucks/addons/windows/features.json": () => __vitePreload(() => import('./features-rvX0tStJ.js'),true?[]:void 0,import.meta.url),"../../../data/mobile-detailing/pricing/trucks/addons/windows/service.json": () => __vitePreload(() => import('./service-Ce_J3A95.js'),true?[]:void 0,import.meta.url)})), `../../../data/mobile-detailing/pricing/${folderName}/addons/${category}/${category}.json`, 10);
          return {
            addons: categoryData.default,
            features: {},
            type: "category"
          };
        }
      } catch {
        throw new Error(`No addons available for ${category} in ${vehicleType}`);
      }
    },
    enabled: (() => {
      const folderName = toFolderName(vehicleType);
      const enabled = !!vehicleType && !!category && !!folderName;
      return enabled;
    })(),
    staleTime: 5 * 60 * 1e3,
    // 5 minutes
    cacheTime: 10 * 60 * 1e3
    // 10 minutes
  });
  reactExports.useEffect(() => {
    if (data) {
      let processedAddons = [];
      if (data.type === "service") {
        const serviceData = data;
        processedAddons = Object.entries(serviceData.addons).map(([name, addon]) => {
          const features = addon.features ?? [];
          const featureNames = features.map((featureId) => getFeatureName$1(featureId, serviceData.features));
          const description = getCardDescription(addon, features, serviceData.features);
          return {
            id: name.toLowerCase().replace(/\s+/g, "-"),
            name,
            price: typeof addon.cost === "number" ? addon.cost : 0,
            description,
            features: featureNames,
            featureIds: features,
            popular: addon.popular ?? false
          };
        });
      } else {
        const categoryData = data;
        const features = Object.keys(categoryData.addons);
        processedAddons = features.map((featureKey, index) => {
          const feature = categoryData.addons[featureKey];
          if (!feature) {
            return {
              id: featureKey,
              name: featureKey,
              price: 0,
              description: "",
              features: [],
              featureIds: [featureKey],
              popular: false
            };
          }
          return {
            id: featureKey,
            name: feature.name ?? featureKey,
            price: 0,
            // No pricing in features-only files
            description: feature.description ?? getCardDescription(feature, [featureKey], {}),
            features: feature.name ? [feature.name] : [],
            // Use the feature name as the single feature
            featureIds: [featureKey],
            popular: index === 0
            // Make first item popular
          };
        });
      }
      setAvailableAddons(processedAddons);
    }
  }, [data]);
  return {
    availableAddons,
    isLoading,
    error: error?.message || null
  };
};
const getFeatureName$1 = (featureId, featuresData) => {
  return featuresData[featureId]?.name || featureId;
};

const loadFeaturesData = async (vehicleType, category, itemType = "service") => {
  const vehicleFolderMap = {
    "car": "cars",
    "truck": "trucks",
    "suv": "suvs",
    "boat": "boats",
    "rv": "rvs"
  };
  const folderName = vehicleFolderMap[vehicleType];
  if (!folderName) {
    throw new Error(`No features available for vehicle type: ${vehicleType}`);
  }
  let featuresModule;
  if (itemType === "service") {
    switch (folderName) {
      case "cars":
        featuresModule = await __vitePreload(() => import('./features-DREb8I9X.js'),true?[]:void 0,import.meta.url);
        break;
      case "trucks":
        featuresModule = await __vitePreload(() => import('./features-B2qN41KZ.js'),true?[]:void 0,import.meta.url);
        break;
      case "suvs":
        featuresModule = await __vitePreload(() => import('./features-NZ9xozqc.js'),true?[]:void 0,import.meta.url);
        break;
      case "rvs":
        featuresModule = await __vitePreload(() => import('./features-TiJj5Rgm.js'),true?[]:void 0,import.meta.url);
        break;
      case "boats":
        featuresModule = await __vitePreload(() => import('./features-SknIpfah.js'),true?[]:void 0,import.meta.url);
        break;
    }
  } else {
    switch (folderName) {
      case "cars":
        switch (category) {
          case "windows":
            featuresModule = await __vitePreload(() => import('./features-D8cJNIGE.js'),true?[]:void 0,import.meta.url);
            break;
          case "wheels":
            featuresModule = await __vitePreload(() => import('./features-DOO7wXgF.js'),true?[]:void 0,import.meta.url);
            break;
          case "trim":
            featuresModule = await __vitePreload(() => import('./features-P4yOr9AI.js'),true?[]:void 0,import.meta.url);
            break;
          case "engine":
            featuresModule = await __vitePreload(() => import('./features-CS68DUQ8.js'),true?[]:void 0,import.meta.url);
            break;
        }
        break;
      case "trucks":
        switch (category) {
          case "windows":
            featuresModule = await __vitePreload(() => import('./features-rvX0tStJ.js'),true?[]:void 0,import.meta.url);
            break;
          case "wheels":
            featuresModule = await __vitePreload(() => import('./features-DCwu-Jfs.js'),true?[]:void 0,import.meta.url);
            break;
          case "trim":
            featuresModule = await __vitePreload(() => import('./features-azYXzFfc.js'),true?[]:void 0,import.meta.url);
            break;
          case "engine":
            featuresModule = await __vitePreload(() => import('./features-YLEwsVtC.js'),true?[]:void 0,import.meta.url);
            break;
        }
        break;
      case "suvs":
        switch (category) {
          case "windows":
            featuresModule = await __vitePreload(() => import('./features-DR3z9Yat.js'),true?[]:void 0,import.meta.url);
            break;
          case "wheels":
            featuresModule = await __vitePreload(() => import('./features-DLMh5PwL.js'),true?[]:void 0,import.meta.url);
            break;
          case "trim":
            featuresModule = await __vitePreload(() => import('./features-aPwWVBb4.js'),true?[]:void 0,import.meta.url);
            break;
          case "engine":
            featuresModule = await __vitePreload(() => import('./features-FEf-_h5D.js'),true?[]:void 0,import.meta.url);
            break;
        }
        break;
    }
  }
  if (!featuresModule) {
    throw new Error(`No features data available for ${itemType} ${vehicleType}${category ? ` ${category}` : ""}`);
  }
  return featuresModule.default;
};
const useFeaturesData = ({ isOpen, vehicleType, category, itemType }) => {
  return useQuery({
    queryKey: ["booking", "featuresData", vehicleType, category, itemType],
    queryFn: () => loadFeaturesData(vehicleType, category, itemType),
    enabled: isOpen && !!vehicleType,
    staleTime: 5 * 60 * 1e3,
    // 5 minutes
    cacheTime: 10 * 60 * 1e3
    // 10 minutes
  });
};

const usePaymentData = () => {
  const { bookingData } = useBookingData();
  const { serviceTier } = useBookingService();
  const { addons } = useBookingAddons();
  const { serviceTiers, isLoading: serviceTiersLoading } = useServiceTiers(bookingData.vehicle || "");
  const { availableAddons: windowsAddons } = useAddons(bookingData.vehicle || "", "windows");
  const { availableAddons: wheelsAddons } = useAddons(bookingData.vehicle || "", "wheels");
  const { availableAddons: trimAddons } = useAddons(bookingData.vehicle || "", "trim");
  const { availableAddons: engineAddons } = useAddons(bookingData.vehicle || "", "engine");
  const allAvailableAddons = reactExports.useMemo(
    () => [...windowsAddons, ...wheelsAddons, ...trimAddons, ...engineAddons],
    [windowsAddons, wheelsAddons, trimAddons, engineAddons]
  );
  const selectedService = reactExports.useMemo(
    () => serviceTiers.find((service) => service.id === serviceTier),
    [serviceTiers, serviceTier]
  );
  const selectedAddons = reactExports.useMemo(
    () => allAvailableAddons.filter((addon) => addons.includes(addon.id)),
    [allAvailableAddons, addons]
  );
  const servicePrice = selectedService?.price || 0;
  const addonsPrice = selectedAddons.reduce((total2, addon) => total2 + addon.price, 0);
  const subtotal = servicePrice + addonsPrice;
  const tax = subtotal * 0.08;
  const total = subtotal + tax;
  return {
    // Data
    bookingData,
    serviceTiers,
    allAvailableAddons,
    selectedService,
    selectedAddons,
    // Loading states
    serviceTiersLoading,
    // Calculations
    servicePrice,
    addonsPrice,
    subtotal,
    tax,
    total
  };
};

const usePaymentForm = () => {
  const [paymentMethod, setPaymentMethod] = reactExports.useState("");
  const [cardDetails, setCardDetails] = reactExports.useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: ""
  });
  const [activeTab, setActiveTab] = reactExports.useState("vehicle");
  const [expandedSections, setExpandedSections] = reactExports.useState({
    cardInfo: false,
    contactInfo: false,
    billingAddress: false
  });
  const updateCardDetails = (field, value) => {
    setCardDetails((prev) => ({ ...prev, [field]: value }));
  };
  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  const resetForm = () => {
    setPaymentMethod("");
    setCardDetails({
      cardNumber: "",
      expiryDate: "",
      cvv: "",
      name: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      zip: ""
    });
    setActiveTab("vehicle");
    setExpandedSections({
      cardInfo: false,
      contactInfo: false,
      billingAddress: false
    });
  };
  return {
    // State
    paymentMethod,
    cardDetails,
    activeTab,
    expandedSections,
    // Actions
    setPaymentMethod,
    updateCardDetails,
    setActiveTab,
    toggleSection,
    resetForm
  };
};

const useScheduleOptions = (locationId, serviceId, dateRange) => {
  return useQuery({
    queryKey: ["scheduleOptions", locationId, serviceId, dateRange],
    queryFn: async () => {
      const today = /* @__PURE__ */ new Date();
      const mockScheduleOptions = [];
      for (let i = 0; i < 30; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        const dateStr = date.toISOString().split("T")[0];
        const isAvailable = true;
        mockScheduleOptions.push({
          date: dateStr,
          available: isAvailable,
          timeSlots: [
            { id: `${String(i)}-1`, time: "9:00 AM", available: true },
            { id: `${String(i)}-2`, time: "10:00 AM", available: true },
            { id: `${String(i)}-3`, time: "11:00 AM", available: i % 4 !== 0 },
            // Some unavailable
            { id: `${String(i)}-4`, time: "1:00 PM", available: true },
            { id: `${String(i)}-5`, time: "2:00 PM", available: true },
            { id: `${String(i)}-6`, time: "3:00 PM", available: i % 5 !== 0 }
            // Some unavailable
          ]
        });
      }
      await new Promise((resolve) => setTimeout(resolve, 500));
      return mockScheduleOptions;
    },
    enabled: true,
    staleTime: 2 * 60 * 1e3,
    // 2 minutes
    cacheTime: 5 * 60 * 1e3
    // 5 minutes
  });
};

const useServiceTiers = (vehicleType) => {
  const [serviceTiers, setServiceTiers] = reactExports.useState([]);
  const { data, isLoading, error } = useQuery({
    queryKey: ["booking", "serviceTiers", vehicleType],
    queryFn: async () => {
      const folderName = toFolderName(vehicleType);
      if (!folderName) {
        throw new Error(`No services available for vehicle type: ${vehicleType}`);
      }
      const [servicesModule, featuresModule] = await Promise.all([
        __variableDynamicImportRuntimeHelper((/* #__PURE__ */ Object.assign({"../../../data/mobile-detailing/pricing/boats/service/services.json": () => __vitePreload(() => import('./services-DpA9YOV6.js'),true?[]:void 0,import.meta.url),"../../../data/mobile-detailing/pricing/cars/service/services.json": () => __vitePreload(() => import('./services-CtmKd4YT.js'),true?[]:void 0,import.meta.url),"../../../data/mobile-detailing/pricing/rvs/service/services.json": () => __vitePreload(() => import('./services-BNUTNHUZ.js'),true?[]:void 0,import.meta.url),"../../../data/mobile-detailing/pricing/suvs/service/services.json": () => __vitePreload(() => import('./services-CSKvSUIH.js'),true?[]:void 0,import.meta.url),"../../../data/mobile-detailing/pricing/trucks/service/services.json": () => __vitePreload(() => import('./services-B-mKtEuO.js'),true?[]:void 0,import.meta.url)})), `../../../data/mobile-detailing/pricing/${folderName}/service/services.json`, 9),
        __variableDynamicImportRuntimeHelper((/* #__PURE__ */ Object.assign({"../../../data/mobile-detailing/pricing/boats/service/features.json": () => __vitePreload(() => import('./features-SknIpfah.js'),true?[]:void 0,import.meta.url),"../../../data/mobile-detailing/pricing/cars/service/features.json": () => __vitePreload(() => import('./features-DREb8I9X.js'),true?[]:void 0,import.meta.url),"../../../data/mobile-detailing/pricing/rvs/service/features.json": () => __vitePreload(() => import('./features-TiJj5Rgm.js'),true?[]:void 0,import.meta.url),"../../../data/mobile-detailing/pricing/suvs/service/features.json": () => __vitePreload(() => import('./features-NZ9xozqc.js'),true?[]:void 0,import.meta.url),"../../../data/mobile-detailing/pricing/trucks/service/features.json": () => __vitePreload(() => import('./features-B2qN41KZ.js'),true?[]:void 0,import.meta.url)})), `../../../data/mobile-detailing/pricing/${folderName}/service/features.json`, 9)
      ]);
      return {
        services: servicesModule.default,
        features: featuresModule.default
      };
    },
    enabled: !!vehicleType && !!toFolderName(vehicleType),
    staleTime: 5 * 60 * 1e3,
    // 5 minutes
    cacheTime: 10 * 60 * 1e3
    // 10 minutes
  });
  reactExports.useEffect(() => {
    if (!vehicleType || !toFolderName(vehicleType)) {
      setServiceTiers([]);
    }
  }, [vehicleType]);
  reactExports.useEffect(() => {
    if (data) {
      try {
        const services = data.services;
        const features = data.features;
        const processedServices = Object.entries(services).map(([name, service]) => {
          return {
            id: name.toLowerCase().replace(/\s+/g, "-"),
            name,
            price: service.cost,
            description: getCardDescription(service, service.features, features),
            features: service.features.map((featureId) => getFeatureName(featureId, features)),
            featureIds: service.features,
            popular: service.popular || false
          };
        });
        setServiceTiers(processedServices);
      } catch {
        setServiceTiers([]);
      }
    }
  }, [data]);
  return {
    serviceTiers,
    isLoading,
    error: error?.message || null
  };
};
const getFeatureName = (featureId, featuresData) => {
  return featuresData[featureId]?.name || featureId;
};

const DetailsModal = ({
  item,
  isOpen,
  onClose,
  vehicleType,
  category,
  itemType
}) => {
  const [expandedFeatures, setExpandedFeatures] = reactExports.useState(/* @__PURE__ */ new Set());
  const featuresData = useFeaturesData({ isOpen, vehicleType, category, itemType });
  const toggleFeature = (featureId) => {
    setExpandedFeatures((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(featureId)) {
        newSet.delete(featureId);
      } else {
        newSet.add(featureId);
      }
      return newSet;
    });
  };
  const getFeatureDetails = (featureId) => {
    return generateFeatureDetails(featureId, featuresData);
  };
  if (!isOpen) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-stone-900 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sticky top-0 bg-stone-900 border-b border-stone-700 p-6 rounded-t-xl", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-start", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-3xl font-bold text-white mb-2", children: item.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-4xl font-bold text-orange-500", children: [
          "$",
          item.price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: onClose,
          className: "text-stone-400 hover:text-white transition-colors p-2",
          "aria-label": "Close modal",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-6 w-6" })
        }
      )
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-stone-300 text-lg", children: item.description }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-semibold text-white mb-4", children: "What's Included:" }),
        item.featureIds.map((featureId) => {
          const featureDetails = getFeatureDetails(featureId);
          const isExpanded = expandedFeatures.has(featureId);
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-stone-700 rounded-lg overflow-hidden", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                onClick: () => {
                  toggleFeature(featureId);
                },
                className: "w-full p-4 text-left bg-stone-800 hover:bg-stone-700 transition-colors flex justify-between items-center",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white font-medium", children: featureDetails?.name || featureId }),
                  isExpanded ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { className: "h-5 w-5 text-stone-400" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-5 w-5 text-stone-400" })
                ]
              }
            ),
            isExpanded && featureDetails && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 bg-stone-850 border-t border-stone-700 space-y-4", children: [
              featureDetails.description && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-sm font-semibold text-orange-400 uppercase tracking-wide mb-2", children: "Description:" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-stone-300 text-sm", children: featureDetails.description })
              ] }),
              featureDetails.explanation && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-sm font-semibold text-orange-400 uppercase tracking-wide mb-2", children: "Process:" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-stone-300 text-sm", children: featureDetails.explanation })
              ] }),
              featureDetails.features.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-sm font-semibold text-orange-400 uppercase tracking-wide mb-2", children: "Features:" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-1", children: featureDetails.features.map((feature, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "text-sm text-stone-300 flex items-start", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-orange-500 mr-2", children: "•" }),
                  feature
                ] }, index)) })
              ] }),
              featureDetails.duration && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pt-3 border-t border-stone-700", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm text-orange-400 font-medium", children: [
                "Estimated Duration: ",
                featureDetails.duration,
                " minutes"
              ] }) })
            ] })
          ] }, featureId);
        })
      ] })
    ] })
  ] }) });
};

const Footer = ({
  // Step progress
  currentStep,
  completedSteps = [],
  showStepProgress = true,
  // Trust strip
  averageRating = 4.9,
  totalReviews = 0,
  showTrustStrip = true,
  // Navigation
  onNext,
  onBack,
  onCancel,
  onSkip,
  canGoNext = true,
  canGoBack = false,
  canSkip = false,
  isLoading = false,
  nextLabel = "Continue",
  skipLabel = "Skip",
  showNavigation = true,
  className = ""
}) => {
  const stepOrder = ["vehicle-selection", "location", "service-tier", "addons", "schedule", "payment"];
  const stepLabels = {
    "vehicle-selection": "Vehicle",
    "location": "Location",
    "service-tier": "Service",
    "addons": "Addons",
    "schedule": "Schedule",
    "payment": "Payment"
  };
  const getStepStatus = (step) => {
    if (completedSteps.includes(step)) return "completed";
    if (step === currentStep) return "current";
    if (stepOrder.indexOf(step) < stepOrder.indexOf(currentStep || "")) return "completed";
    return "upcoming";
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `w-full ${className}`, children: [
    showStepProgress && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center space-x-4", children: stepOrder.map((step) => {
      const status = getStepStatus(step);
      return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: `
                      px-4 py-2 rounded-lg transition-all duration-200
                      ${status === "current" ? "ring-2 ring-orange-500 ring-offset-2 ring-offset-stone-900 bg-orange-500/10" : status === "completed" ? "bg-orange-500/5" : "hover:bg-gray-800/30"}
                    `,
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: `
                        text-lg font-medium
                        ${status === "completed" || status === "current" ? "text-orange-500" : "text-gray-400"}
                      `,
              children: stepLabels[step]
            }
          )
        }
      ) }, step);
    }) }) }),
    showNavigation && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-center items-center gap-4 mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: onCancel,
          disabled: isLoading,
          className: "px-6 py-3 border border-gray-600 hover:border-gray-500 text-white rounded-lg transition-colors disabled:opacity-50",
          children: "Exit"
        }
      ),
      canGoBack && onBack && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: onBack,
          disabled: isLoading,
          className: "px-6 py-3 border border-gray-600 hover:border-gray-500 text-white rounded-lg transition-colors disabled:opacity-50",
          children: "Back"
        }
      ),
      canSkip && onSkip && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: onSkip,
          disabled: isLoading,
          className: "px-6 py-3 text-gray-300 hover:text-white transition-colors disabled:opacity-50",
          children: skipLabel
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: onNext,
          disabled: !canGoNext || isLoading,
          className: "px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors disabled:opacity-50",
          children: isLoading ? "Loading..." : nextLabel
        }
      )
    ] }),
    showTrustStrip && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-8 mb-16", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-12 place-items-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center text-white", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "h-5 w-5 text-orange-500 mr-2" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "a",
          {
            href: "https://share.google/dAerqNUgo3WpYeJwP",
            target: "_blank",
            rel: "noopener noreferrer",
            className: "font-semibold hover:text-orange-400 transition-colors duration-200",
            children: [
              averageRating,
              "/5 (",
              totalReviews,
              " reviews)"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center text-white", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "h-5 w-5 text-orange-500 mr-2" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          "Secure checkout via ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "https://stripe.com/", target: "_blank", rel: "noopener noreferrer", className: "text-blue-500 hover:text-blue-400 transition-colors duration-200", children: "Stripe" })
        ] })
      ] })
    ] }) }) })
  ] });
};

const BookingLayout = ({
  children,
  currentStep,
  completedSteps,
  onNext,
  onBack,
  onCancel,
  canGoNext,
  canGoBack,
  canSkip,
  isLoading,
  nextLabel,
  backLabel,
  showNavigation,
  averageRating = 4.9,
  totalReviews = 112,
  showTrustStrip = true,
  className = ""
}) => {
  const { images: galleryImages, isLoading: loading } = useBookingGallery();
  const imageUrls = galleryImages.map((img) => img.src).filter(Boolean);
  const rotation = useImageRotation({
    images: imageUrls,
    autoRotate: true,
    interval: 7e3,
    // 7 seconds to match original
    fadeDuration: 2e3,
    // 2 seconds fade duration
    preloadNext: true});
  const { currentIndex } = rotation;
  const getStepTitle = (step) => {
    const titles = {
      "vehicle-selection": "Vehicle Details",
      "location": "Service Location",
      "service-tier": "Service Selection",
      "addons": "Add-ons",
      "schedule": "Schedule",
      "payment": "Payment"
    };
    return titles[step] || "Booking Step";
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: `relative w-full min-h-screen bg-stone-900 overflow-hidden ${className}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 z-0", children: [
      galleryImages.map((image, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "img",
        {
          src: image.src,
          alt: image.alt || `Booking background image ${String(index + 1)}`,
          className: `absolute inset-0 w-full h-full object-cover ${getImageOpacityClasses(index, currentIndex, 2e3)}`,
          style: getTransitionStyles(2e3),
          decoding: index === 0 ? "sync" : "async",
          loading: index === 0 ? "eager" : "lazy"
        },
        image.id
      )),
      !galleryImages.length && !loading && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-full bg-gradient-to-br from-stone-800 to-stone-900" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-black/40 z-10" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-20 left-0 right-0 z-20", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-4xl sm:text-5xl lg:text-6xl font-bold text-white", children: getStepTitle(currentStep) }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-20 h-screen grid grid-rows-[1fr_auto]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full max-w-2xl", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-8", children }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 sm:px-6 lg:px-8 py-4 pb-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Footer,
        {
          currentStep,
          completedSteps,
          showStepProgress: true,
          averageRating,
          totalReviews,
          showTrustStrip,
          onNext,
          onBack,
          onCancel,
          canGoNext,
          canGoBack,
          canSkip,
          isLoading,
          nextLabel,
          backLabel,
          showNavigation
        }
      ) })
    ] })
  ] });
};

const AddonDetailsModal = ({
  addon,
  isOpen,
  onClose,
  vehicleType,
  category
}) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    DetailsModal,
    {
      item: addon,
      isOpen,
      onClose,
      vehicleType,
      category,
      itemType: "addon"
    }
  );
};

const Tabs$1 = ({ selectedCategory, onCategorySelect }) => {
  const addonCategories = [
    { id: "windows", name: "Windows", icon: Sparkles },
    { id: "wheels", name: "Wheels", icon: Wrench },
    { id: "trim", name: "Interior", icon: Droplets },
    { id: "engine", name: "Engine", icon: Shield }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute left-0 right-0 z-20 py-8", style: { top: "150px" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap justify-center gap-3 max-w-4xl mx-auto", children: addonCategories.map((category) => {
    const IconComponent = category.icon;
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        onClick: () => {
          onCategorySelect(category.id);
        },
        className: `p-2 rounded-lg border-2 transition-all w-24 h-24 ${selectedCategory === category.id ? "border-orange-500 bg-orange-500/20" : "border-gray-600 hover:border-gray-500"}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(IconComponent, { className: "w-8 h-8 text-white mb-2 mx-auto" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-white font-medium", children: category.name })
        ]
      },
      category.id
    );
  }) }) }) });
};

const Addons = ({ onAddonsSelected }) => {
  const [selectedCategory, setSelectedCategory] = reactExports.useState("windows");
  const [modalAddon, setModalAddon] = reactExports.useState(null);
  const { vehicle } = useBookingVehicle();
  const { addons, setAddons } = useBookingAddons();
  const { availableAddons, error } = useAddons(
    vehicle || "",
    selectedCategory
  );
  const handleAddonToggle = reactExports.useCallback((addonId) => {
    const newSelection = addons.includes(addonId) ? [] : [addonId];
    setAddons(newSelection);
    onAddonsSelected?.(newSelection);
  }, [addons, setAddons, onAddonsSelected]);
  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
  };
  const handleCardClick = (addon) => {
    setModalAddon(addon);
  };
  const handleCloseModal = () => {
    setModalAddon(null);
  };
  const renderAddonCard = (addon) => {
    const isAddonSelected = addons.includes(addon.id);
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: `bg-stone-800/80 backdrop-blur-sm rounded-xl p-8 text-center transition-all duration-300 transform cursor-pointer w-[416px] flex-shrink-0 relative ${addon.position === "center" ? `scale-100 z-10 ring-2 ${isAddonSelected ? "ring-green-500" : "ring-orange-500"}` : addon.position === "left" ? "scale-90 -translate-x-4 opacity-70" : "scale-90 translate-x-4 opacity-70"}`,
        onClick: () => {
          handleCardClick(addon);
        },
        role: "button",
        tabIndex: 0,
        onKeyDown: (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleCardClick(addon);
          }
        },
        children: [
          addon.popular && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -top-4 left-1/2 -translate-x-1/2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-orange-500 text-white px-4 py-1.5 rounded-full text-base font-medium", children: "Most Popular" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-3xl font-bold text-white mb-3", children: addon.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-4xl font-bold text-orange-500", children: [
              "$",
              Number(addon.price).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-stone-300 text-base mb-5", children: addon.description }),
            addon.features.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: addon.features.map((feature, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center text-base text-stone-300", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CheckCircle, { className: "h-5 w-5 text-green-500 mr-3 flex-shrink-0" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: feature })
            ] }, index)) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: (e) => {
                e.stopPropagation();
                handleAddonToggle(addon.id);
              },
              className: `mt-8 w-full py-4 px-8 rounded-lg font-semibold text-lg transition-colors flex items-center justify-center gap-3 ${isAddonSelected ? "bg-green-600 hover:bg-green-700 text-white" : "bg-orange-500 hover:bg-orange-600 text-white"}`,
              children: [
                isAddonSelected && /* @__PURE__ */ jsxRuntimeExports.jsx(CheckCircle, { size: 20 }),
                isAddonSelected ? "Selected" : "Select Addon"
              ]
            }
          )
        ]
      }
    );
  };
  if (!vehicle) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full max-w-4xl mx-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white text-lg", children: "Please select a vehicle first." }) }) });
  }
  if (error) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full max-w-4xl mx-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-red-500", children: [
      "Error loading addons: ",
      error
    ] }) }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-6xl mx-auto relative", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Tabs$1,
      {
        selectedCategory,
        onCategorySelect: handleCategorySelect
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Carousel,
      {
        items: availableAddons,
        selectedItem: "",
        onItemSelect: () => {
        },
        renderItem: renderAddonCard,
        onItemClick: handleCardClick,
        emptyMessage: `No add-ons available for ${selectedCategory}`
      }
    ),
    modalAddon && /* @__PURE__ */ jsxRuntimeExports.jsx(
      AddonDetailsModal,
      {
        addon: modalAddon,
        isOpen: !!modalAddon,
        onClose: handleCloseModal,
        vehicleType: vehicle,
        category: selectedCategory
      }
    )
  ] });
};

const StepAddons = ({ onAddonsSelected }) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full max-w-6xl mx-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Addons, { onAddonsSelected }) });
};

const StepLocation = () => {
  const { bookingData, setLocation } = useBookingData();
  const [address, setAddress] = reactExports.useState(bookingData.location.address || "");
  const [city, setCity] = reactExports.useState(bookingData.location.city || "");
  const [state, setState] = reactExports.useState(bookingData.location.state || "");
  const [zip, setZip] = reactExports.useState(bookingData.location.zip || "");
  const [notes, setNotes] = reactExports.useState(bookingData.location.notes || "");
  const [locationTypes, setLocationTypes] = reactExports.useState(bookingData.location.locationType ? bookingData.location.locationType.split(",") : []);
  const handleAddressChange = (e) => {
    setAddress(e.target.value);
    setLocation({ ...bookingData.location, address: e.target.value });
  };
  const handleCityChange = (e) => {
    setCity(e.target.value);
    setLocation({ ...bookingData.location, city: e.target.value });
  };
  const handleStateChange = (e) => {
    setState(e.target.value);
    setLocation({ ...bookingData.location, state: e.target.value });
  };
  const handleZipChange = (e) => {
    setZip(e.target.value);
    setLocation({ ...bookingData.location, zip: e.target.value });
  };
  const handleNotesChange = (e) => {
    setNotes(e.target.value);
    setLocation({ ...bookingData.location, notes: e.target.value });
  };
  const handleLocationTypeChange = (type) => {
    const updatedTypes = locationTypes.includes(type) ? locationTypes.filter((t) => t !== type) : [...locationTypes, type];
    setLocationTypes(updatedTypes);
    setLocation({ ...bookingData.location, locationType: updatedTypes.join(",") });
  };
  const availableLocationTypes = ["Garage", "Driveway", "Business", "Hangar", "Street", "Other"];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-white font-medium text-lg", children: "Please tell us where your vehicle will be serviced" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-3 gap-3", children: availableLocationTypes.map((type) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "label",
        {
          className: `flex items-center space-x-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${locationTypes.includes(type) ? "border-orange-500 bg-orange-500/20" : "border-gray-600 hover:border-gray-500 bg-gray-700"}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "checkbox",
                value: type,
                checked: locationTypes.includes(type),
                onChange: () => {
                  handleLocationTypeChange(type);
                },
                className: "w-4 h-4 text-orange-500 bg-gray-700 border-gray-600 focus:ring-orange-500 focus:ring-2"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white font-medium", children: type })
          ]
        },
        type
      )) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          type: "text",
          placeholder: "Address",
          value: address,
          onChange: handleAddressChange,
          className: "w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none"
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "text",
            placeholder: "City",
            value: city,
            onChange: handleCityChange,
            className: "w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none"
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "text",
            placeholder: "State",
            value: state,
            onChange: handleStateChange,
            className: "w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none"
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "text",
            placeholder: "ZIP Code",
            value: zip,
            onChange: handleZipChange,
            className: "w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none"
          }
        ) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "textarea",
        {
          placeholder: "Special notes (optional)",
          value: notes,
          onChange: handleNotesChange,
          rows: 5,
          className: "w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none resize-none"
        }
      ) })
    ] })
  ] });
};

const CardIcon = (props) => /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { viewBox: "0 0 24 24", fill: "currentColor", ...props, children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zm0 2v2h16V6H4zm0 4v6h16v-6H4z" }) });
const ApplePayIcon = (props) => /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { viewBox: "0 0 24 24", fill: "currentColor", ...props, children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" }) });
const GooglePayIcon = (props) => /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { viewBox: "0 0 24 24", fill: "currentColor", ...props, children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z", fill: "#4285F4" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z", fill: "#34A853" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z", fill: "#FBBC05" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z", fill: "#EA4335" })
] });
const PaymentIcons = {
  card: CardIcon,
  "apple-pay": ApplePayIcon,
  "google-pay": GooglePayIcon
};

const PaymentOption = ({
  id,
  label,
  selected,
  onSelect,
  icon
}) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "button",
    {
      type: "button",
      onClick: () => {
        onSelect(id);
      },
      className: [
        "px-4 py-3 rounded-lg border-2 transition-all flex items-center justify-center gap-3 min-h-[48px] w-full",
        selected ? "border-orange-500 bg-orange-500/20" : "border-stone-600 hover:border-stone-500"
      ].join(" "),
      "aria-pressed": selected,
      "aria-label": label,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `${icon.startsWith("/") ? "h-6 w-6" : "h-5 w-5"} flex items-center justify-center flex-shrink-0`, children: icon.startsWith("/") ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          "img",
          {
            src: icon,
            alt: label,
            className: "h-6 w-auto max-w-full"
          }
        ) : icon in PaymentIcons ? React.createElement(PaymentIcons[icon], {
          className: "h-5 w-5"
        }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg", children: icon }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white text-sm font-medium truncate", children: label })
      ]
    }
  );
};

const PaymentSummary = ({
  servicePrice,
  subtotal,
  tax,
  total,
  selectedService,
  selectedAddons
}) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gray-800 rounded-lg p-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-semibold text-white mb-4", children: "Order Summary" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
      selectedService && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-gray-300", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: selectedService.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          "$",
          servicePrice.toFixed(2)
        ] })
      ] }),
      selectedAddons.map((addon) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-gray-300", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm", children: [
          "+ ",
          addon.name
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          "$",
          addon.price.toFixed(2)
        ] })
      ] }, addon.name)),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-t border-gray-600 pt-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-gray-300", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Subtotal" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          "$",
          subtotal.toFixed(2)
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-gray-300", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Tax (8%)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          "$",
          tax.toFixed(2)
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-t border-gray-600 pt-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-white font-semibold text-lg", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Total" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          "$",
          total.toFixed(2)
        ] })
      ] }) })
    ] })
  ] });
};

const PaymentTabs = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: "vehicle", label: "Vehicle", icon: Car },
    { id: "location", label: "Location", icon: MapPin },
    { id: "summary", label: "Summary", icon: FileText },
    { id: "payment", label: "Payment", icon: CreditCard }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex space-x-1 bg-gray-800 p-1 rounded-lg mb-6", children: tabs.map(({ id, label, icon: Icon }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "button",
    {
      onClick: () => {
        onTabChange(id);
      },
      className: `flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${activeTab === id ? "bg-blue-600 text-white" : "text-gray-300 hover:text-white hover:bg-gray-700"}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "w-4 h-4" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: label })
      ]
    },
    id
  )) });
};

const SummarySection = ({
  bookingData,
  serviceTiers,
  allAvailableAddons,
  totals
}) => {
  const { serviceTier, addons, schedule } = bookingData;
  const { servicePrice, total } = totals;
  const selectedService = Array.isArray(serviceTiers) ? serviceTiers.find((service) => service.id === serviceTier) : null;
  const serviceInfo = selectedService || { name: "No Service Selected"};
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    serviceTier && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold text-white mb-3", children: "Service" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-stone-700/50 rounded-2xl p-4 border border-stone-600/50", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white font-medium", children: serviceInfo.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-2xl font-bold text-orange-400", children: [
          "$",
          servicePrice
        ] })
      ] }) })
    ] }),
    addons.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold text-white mb-3", children: "Add-ons" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: addons.map((addonId, index) => {
        const addon = allAvailableAddons.find((a) => a.id === addonId);
        return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-stone-700/50 rounded-2xl p-4 border border-stone-600/50", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4 text-orange-400" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white/90 text-sm font-medium", children: addon ? addon.name : addonId })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-orange-400 font-semibold", children: [
            "$",
            addon ? addon.price : 0
          ] })
        ] }) }, index);
      }) })
    ] }),
    schedule.dates.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold text-white mb-3", children: "Schedule" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-stone-700/50 rounded-2xl p-4 border border-stone-600/50", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        schedule.dates.map((date, index) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-white font-medium", children: new Date(date).toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric"
        }) }, index)),
        schedule.time && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-gray-400", children: [
          "Time: ",
          schedule.time
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pt-6 border-t border-stone-600/50", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-orange-500/20 rounded-3xl p-6 border border-orange-400/30", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xl font-semibold text-white", children: "Total" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-3xl font-bold text-orange-400", children: [
          "$",
          total
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-gray-400 mt-1", children: "Estimated Total" })
      ] })
    ] }) }) })
  ] });
};

const VehicleSection = ({ bookingData }) => {
  const { vehicle, vehicleDetails } = bookingData;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-2xl font-bold text-white mb-6", children: "Vehicle Information" }) }),
    (vehicleDetails.make || vehicle) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gray-800/50 rounded-lg p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-xl font-semibold text-white mb-4", children: "Selected Vehicle" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4 text-base", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-400", children: "Make:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-white text-lg font-semibold", children: vehicleDetails.make || "N/A" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-400", children: "Model:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-white text-lg font-semibold", children: vehicleDetails.model || "N/A" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-400", children: "Year:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-white text-lg font-semibold", children: vehicleDetails.year || "N/A" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-400", children: vehicleDetails.color ? "Color:" : "Length:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-white text-lg font-semibold", children: vehicleDetails.color ? vehicleDetails.color.charAt(0).toUpperCase() + vehicleDetails.color.slice(1) : vehicleDetails.length || "N/A" })
        ] })
      ] })
    ] }),
    !vehicleDetails.make && !vehicle && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-400", children: "No vehicle information available" }) })
  ] });
};

const StepPayment = ({ onPaymentComplete }) => {
  const paymentData = usePaymentData();
  const paymentForm = usePaymentForm();
  const { setPaymentMethod: setStorePaymentMethod } = useBookingPayment();
  const handlePaymentMethodSelect = (method) => {
    paymentForm.setPaymentMethod(method);
    setStorePaymentMethod(method);
  };
  const handleCompleteBooking = () => {
    onPaymentComplete?.();
  };
  const isFormValid = () => {
    if (paymentForm.paymentMethod === "card") {
      const { cardDetails } = paymentForm;
      return cardDetails.cardNumber && cardDetails.expiryDate && cardDetails.cvv && cardDetails.name && cardDetails.email && cardDetails.phone && cardDetails.address && cardDetails.city && cardDetails.state && cardDetails.zip;
    }
    return paymentForm.paymentMethod !== "";
  };
  if (paymentData.serviceTiersLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl text-gray-300 mb-8", children: "Loading payment options..." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "animate-pulse bg-gray-700 h-32 rounded-lg max-w-2xl mx-auto" })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-6xl mx-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-3xl font-bold text-white mb-2", children: "Complete Your Booking" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-300", children: "Review your order and choose your payment method" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      PaymentTabs,
      {
        activeTab: paymentForm.activeTab,
        onTabChange: paymentForm.setActiveTab
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-2", children: [
        paymentForm.activeTab === "vehicle" && /* @__PURE__ */ jsxRuntimeExports.jsx(VehicleSection, { bookingData: paymentData.bookingData }),
        paymentForm.activeTab === "location" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gray-800 rounded-lg p-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-semibold text-white mb-4", children: "Service Location" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-300", children: paymentData.bookingData.location })
        ] }),
        paymentForm.activeTab === "summary" && /* @__PURE__ */ jsxRuntimeExports.jsx(
          SummarySection,
          {
            selectedService: paymentData.selectedService,
            selectedAddons: paymentData.selectedAddons
          }
        ),
        paymentForm.activeTab === "payment" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            PaymentOption,
            {
              selectedMethod: paymentForm.paymentMethod,
              onMethodSelect: handlePaymentMethodSelect,
              cardDetails: paymentForm.cardDetails,
              onCardInputChange: paymentForm.updateCardDetails,
              expandedSections: paymentForm.expandedSections,
              onToggleSection: paymentForm.toggleSection
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: handleCompleteBooking,
              disabled: !isFormValid(),
              className: `px-8 py-3 rounded-lg font-semibold transition-colors ${isFormValid() ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-gray-600 text-gray-400 cursor-not-allowed"}`,
              children: [
                "Complete Booking - $",
                paymentData.total.toFixed(2)
              ]
            }
          ) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "lg:col-span-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        PaymentSummary,
        {
          servicePrice: paymentData.servicePrice,
          addonsPrice: paymentData.addonsPrice,
          subtotal: paymentData.subtotal,
          tax: paymentData.tax,
          total: paymentData.total,
          selectedService: paymentData.selectedService,
          selectedAddons: paymentData.selectedAddons
        }
      ) })
    ] })
  ] });
};

const StepSchedule = () => {
  const [currentMonth, setCurrentMonth] = reactExports.useState(/* @__PURE__ */ new Date());
  const { schedule, setSchedule } = useBookingSchedule();
  const selectedDates = schedule.dates;
  const selectedTime = schedule.time;
  const { data: scheduleOptions, isPending, error } = useScheduleOptions("mock-location", "mock-service");
  const handleDateSelect = (date) => {
    const newDates = selectedDates.includes(date) ? selectedDates.filter((d) => d !== date) : [...selectedDates, date].sort();
    setSchedule({ dates: newDates, time: selectedTime });
  };
  const navigateMonth = (direction) => {
    setCurrentMonth((prev) => {
      const newMonth = new Date(prev);
      if (direction === "prev") {
        newMonth.setMonth(prev.getMonth() - 1);
      } else {
        newMonth.setMonth(prev.getMonth() + 1);
      }
      return newMonth;
    });
  };
  const canNavigatePrev = () => {
    const today = /* @__PURE__ */ new Date();
    const currentMonthYear = currentMonth.getFullYear() * 12 + currentMonth.getMonth();
    const todayMonthYear = today.getFullYear() * 12 + today.getMonth();
    return currentMonthYear > todayMonthYear;
  };
  if (isPending) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl text-gray-300 mb-8", children: "Loading available times..." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "animate-pulse bg-gray-700 h-32 rounded-lg max-w-4xl mx-auto" })
    ] });
  }
  if (error !== null) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl text-red-400 mb-8", children: "Error loading schedule options" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-red-900/20 border border-red-500 rounded-lg p-6 max-w-2xl mx-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-red-300", children: "Please try again later or contact support." }) })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-4xl mx-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-8 mt-36", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gray-800/90 backdrop-blur-sm rounded-lg p-6 max-w-2xl mx-auto border border-gray-600/50", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => {
              navigateMonth("prev");
            },
            disabled: !canNavigatePrev(),
            className: `p-2 rounded-lg border transition-all ${canNavigatePrev() ? "border-gray-600 hover:border-gray-500 text-white" : "border-gray-700 bg-gray-800/50 text-gray-500 cursor-not-allowed"}`,
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "h-5 w-5" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-semibold text-white", children: currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => {
              navigateMonth("next");
            },
            className: "p-2 rounded-lg border border-gray-600 hover:border-gray-500 text-white transition-all",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-5 w-5" })
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-7 gap-2 mb-4", children: [
        ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center text-sm font-semibold text-gray-300 py-2", children: day }, day)),
        (() => {
          const today = /* @__PURE__ */ new Date();
          const month = currentMonth.getMonth();
          const year = currentMonth.getFullYear();
          const firstDay = new Date(year, month, 1);
          const startDate = new Date(firstDay);
          startDate.setDate(startDate.getDate() - firstDay.getDay());
          const calendarDays = [];
          const currentDate = new Date(startDate);
          for (let week = 0; week < 6; week++) {
            for (let day = 0; day < 7; day++) {
              const dateStr = currentDate.toISOString().split("T")[0];
              const isCurrentMonth = currentDate.getMonth() === month;
              const todayDateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
              const currentDateOnly = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
              const isPast = currentDateOnly < todayDateOnly;
              const options = scheduleOptions;
              const hasScheduleData = options?.some((option) => option.date === dateStr);
              const isAvailableFromSchedule = hasScheduleData ? options?.some((option) => option.date === dateStr && option.available) ?? false : true;
              const isAvailable = isAvailableFromSchedule;
              const isSelected = selectedDates.includes(dateStr);
              calendarDays.push(
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    onClick: () => {
                      if (isAvailable && !isPast) {
                        handleDateSelect(dateStr);
                      }
                    },
                    disabled: !isAvailable || isPast,
                    className: `p-3 rounded-lg border-2 transition-all text-sm ${isSelected ? "border-green-500 bg-green-500/20 text-white" : isAvailable && !isPast ? "border-gray-600 hover:border-gray-500 text-white" : "border-gray-700 bg-gray-800/50 text-gray-500 cursor-not-allowed"} ${!isCurrentMonth ? "opacity-50" : ""}`,
                    children: currentDate.getDate()
                  },
                  dateStr
                )
              );
              currentDate.setDate(currentDate.getDate() + 1);
            }
          }
          return calendarDays;
        })()
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gray-800/90 backdrop-blur-sm rounded-lg p-6 max-w-2xl mx-auto border border-gray-600/50 mt-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold text-white mb-4 text-center", children: "Service Information" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "text-gray-300 space-y-2 text-base md:text-lg", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-orange-400 mr-2", children: "•" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Arrival times are typically between 6am - 9am." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-orange-400 mr-2", children: "•" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "You do not need to be present for vehicle service." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-orange-400 mr-2", children: "•" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "We will contact you to discuss the specifics about your service." })
        ] })
      ] })
    ] })
  ] }) }) });
};

const ServiceCard = ({
  service,
  position,
  isSelected,
  onSelect,
  onCardClick
}) => {
  const getPositionClasses = () => {
    const baseClasses = "bg-stone-800/80 backdrop-blur-sm rounded-xl p-8 text-center transition-all duration-300 transform cursor-pointer w-[416px] flex-shrink-0";
    switch (position) {
      case "center":
        return `${baseClasses} scale-100 z-10 ring-2 ${isSelected ? "ring-green-500 bg-green-800/80" : "ring-orange-500"}`;
      case "left":
        return `${baseClasses} scale-90 -translate-x-4 opacity-70`;
      case "right":
        return `${baseClasses} scale-90 translate-x-4 opacity-70`;
      default:
        return baseClasses;
    }
  };
  const getButtonClasses = () => {
    const baseClasses = "w-full py-4 px-8 rounded-lg font-semibold text-lg transition-colors";
    if (isSelected) {
      return `${baseClasses} bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-3`;
    }
    return `${baseClasses} bg-orange-500 hover:bg-orange-600 text-white`;
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: getPositionClasses(),
      onClick: onCardClick,
      onKeyDown: (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onCardClick();
        }
      },
      role: "button",
      tabIndex: 0,
      children: [
        service.popular && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -top-4 left-1/2 -translate-x-1/2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-orange-500 text-white px-4 py-1.5 rounded-full text-base font-medium", children: "Most Popular" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-3xl font-bold text-white mb-3", children: service.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-4xl font-bold text-orange-500", children: [
            "$",
            service.price.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-stone-300 text-base mb-5", children: service.description }),
          service.features.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: service.features.map((feature, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center text-base text-stone-300", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CheckCircle, { className: "h-5 w-5 text-green-500 mr-3 flex-shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: feature })
          ] }, index)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: (e) => {
              e.stopPropagation();
              onSelect();
            },
            className: getButtonClasses(),
            children: [
              isSelected && /* @__PURE__ */ jsxRuntimeExports.jsx(CheckCircle, { size: 20 }),
              isSelected ? "Selected" : "Choose"
            ]
          }
        )
      ]
    }
  );
};

const ServiceDetailsModal = ({
  service,
  isOpen,
  onClose
}) => {
  const { vehicle } = useBookingVehicle();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    DetailsModal,
    {
      item: service,
      isOpen,
      onClose,
      vehicleType: vehicle,
      itemType: "service"
    }
  );
};

const ServiceCarousel = ({
  services,
  selectedService,
  onServiceSelect
}) => {
  const [modalService, setModalService] = reactExports.useState(null);
  const handleCardClick = (service) => {
    setModalService(service);
  };
  const handleCloseModal = () => {
    setModalService(null);
  };
  const renderServiceCard = (service, isSelected) => /* @__PURE__ */ jsxRuntimeExports.jsx(
    ServiceCard,
    {
      service,
      position: service.position,
      isSelected,
      onSelect: () => {
        if (selectedService === service.id) {
          onServiceSelect("");
        } else {
          onServiceSelect(service.id);
        }
      },
      onCardClick: () => {
        handleCardClick(service);
      }
    }
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Carousel,
      {
        items: services,
        selectedItem: selectedService ?? "",
        onItemSelect: onServiceSelect,
        renderItem: renderServiceCard,
        onItemClick: handleCardClick,
        emptyMessage: "No services available"
      }
    ),
    modalService && /* @__PURE__ */ jsxRuntimeExports.jsx(
      ServiceDetailsModal,
      {
        service: modalService,
        isOpen: !!modalService,
        onClose: handleCloseModal
      }
    )
  ] });
};

const ServiceLoader = ({ vehicle }) => {
  const { serviceTier, setServiceTier } = useBookingService();
  const { serviceTiers, isLoading, error } = useServiceTiers(vehicle);
  const handleServiceSelect = (serviceId) => {
    setServiceTier(serviceId);
  };
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full max-w-4xl mx-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white", children: "Loading services..." }) }) });
  }
  if (error) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full max-w-4xl mx-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-red-500", children: [
      "Error loading services: ",
      error
    ] }) }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full max-w-4xl mx-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    ServiceCarousel,
    {
      services: serviceTiers,
      selectedService: serviceTier,
      onServiceSelect: handleServiceSelect
    }
  ) });
};
const StepService = () => {
  const { vehicle } = useBookingVehicle();
  if (!vehicle) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full max-w-4xl mx-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white text-lg", children: "Please select a vehicle first." }) }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(ServiceLoader, { vehicle });
};

const Tabs = ({ selectedVehicle, onVehicleSelect }) => {
  const vehicleTypes = [
    { id: "car", name: "Car", icon: CarFront },
    { id: "truck", name: "Truck", icon: Truck },
    { id: "suv", name: "SUV", icon: Car },
    // SUV keeps Car icon
    { id: "boat", name: "Boat", icon: Ship },
    { id: "rv", name: "RV", icon: "custom-rv" },
    // Custom RV icon
    { id: "airplane", name: "Airplane", icon: Plane },
    { id: "motorcycle", name: "Motorcycle", icon: Bike },
    { id: "other", name: "Other", icon: MoreHorizontal }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-8 absolute top-[20%] left-1/2 transform -translate-x-1/2 w-full", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-4 grid-rows-2 gap-0 w-fit mx-auto", children: vehicleTypes.map((vehicle) => {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        onClick: () => {
          onVehicleSelect(vehicle.id);
        },
        className: `p-2 rounded-lg border-2 transition-all w-24 h-24 ${selectedVehicle === vehicle.id ? "border-orange-500 bg-orange-500/20" : "border-gray-600 hover:border-gray-500 bg-stone-800/20"}`,
        children: [
          vehicle.icon === "custom-rv" ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: "/icons/rv.png",
              alt: "RV",
              className: "w-8 h-8 mb-2 mx-auto object-contain filter brightness-0 invert"
            }
          ) : React.createElement(vehicle.icon, { className: "w-8 h-8 text-white mb-2 mx-auto" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-white font-medium", children: vehicle.name })
        ]
      },
      vehicle.id
    );
  }) }) });
};

const VehicleSelection = ({ selectedVehicle, vehicleDetails, onVehicleDetailsSelect }) => {
  const data = useDataOptional();
  const phoneNumber = data?.phone ?? "(555) 123-4567";
  const [make, setMake] = reactExports.useState(vehicleDetails.make || "");
  const [model, setModel] = reactExports.useState(vehicleDetails.model || "");
  const [year, setYear] = reactExports.useState(vehicleDetails.year || "");
  const [color, setColor] = reactExports.useState(vehicleDetails.color || "");
  const [length, setLength] = reactExports.useState(vehicleDetails.length || "");
  const lastDetailsRef = reactExports.useRef("");
  const vehicleTypeName = selectedVehicle;
  const availableMakes = getMakesForType(vehicleTypeName);
  const availableModels = make ? getModelsForMake(vehicleTypeName, make) : [];
  const availableYears = getVehicleYears();
  reactExports.useEffect(() => {
    setMake(vehicleDetails.make || "");
    setModel(vehicleDetails.model || "");
    setYear(vehicleDetails.year || "");
    setColor(vehicleDetails.color || "");
    setLength(vehicleDetails.length || "");
  }, [vehicleDetails]);
  const updateVehicleDetails = (newMake, newModel, newYear, newColor, newLength) => {
    const currentMake = newMake !== void 0 ? newMake : make;
    const currentModel = newModel !== void 0 ? newModel : model;
    const currentYear = newYear !== void 0 ? newYear : year;
    const currentColor = newColor !== void 0 ? newColor : color;
    const currentLength = newLength !== void 0 ? newLength : length;
    if (currentMake && currentModel && currentYear) {
      const currentDetails = JSON.stringify({
        make: currentMake,
        model: currentModel,
        year: currentYear,
        color: currentColor || "",
        length: currentLength || ""
      });
      if (currentDetails !== lastDetailsRef.current) {
        lastDetailsRef.current = currentDetails;
        onVehicleDetailsSelect?.({
          make: currentMake,
          model: currentModel,
          year: currentYear,
          color: currentColor || "",
          length: currentLength || ""
        });
      }
    }
  };
  if (selectedVehicle === "airplane") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-8 absolute top-[45%] left-1/2 transform -translate-x-1/2 w-full max-w-xl", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-gray-800 border border-gray-600 rounded-lg p-6 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-white text-lg font-medium mb-2", children: [
      "Please call us at ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-orange-500", children: phoneNumber })
    ] }) }) }) });
  }
  if (selectedVehicle === "other") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-8 absolute top-[45%] left-1/2 transform -translate-x-1/2 w-full max-w-xl", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "additional-details", className: "block text-white font-medium text-sm", children: "Additional Details" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "textarea",
        {
          id: "additional-details",
          value: make,
          onChange: (e) => {
            setMake(e.target.value);
            updateVehicleDetails(e.target.value);
          },
          placeholder: "Please describe your vehicle (e.g., 'Custom motorcycle - Harley Davidson 2020, Black')",
          className: "w-full py-3 px-1.5 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-500 resize-none",
          rows: 4
        }
      )
    ] }) }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-8 absolute top-[45%] left-1/2 transform -translate-x-1/2 w-full max-w-xl", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4 px-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "vehicle-make", className: "block text-white font-medium text-sm", children: "Make" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "select",
        {
          id: "vehicle-make",
          value: make,
          onChange: (e) => {
            setMake(e.target.value);
            updateVehicleDetails(e.target.value);
          },
          className: "w-full py-3 px-1.5 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-500",
          disabled: !selectedVehicle,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Select Make" }),
            availableMakes.map((makeOption) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: makeOption, children: makeOption }, makeOption))
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "vehicle-model", className: "block text-white font-medium text-sm", children: "Model" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "select",
        {
          id: "vehicle-model",
          value: model,
          onChange: (e) => {
            setModel(e.target.value);
            updateVehicleDetails(void 0, e.target.value);
          },
          className: "w-full py-3 px-1.5 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-500",
          disabled: !make,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Select Model" }),
            availableModels.map((modelOption) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: modelOption, children: modelOption }, modelOption))
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "vehicle-year", className: "block text-white font-medium text-sm", children: "Year" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "select",
        {
          id: "vehicle-year",
          value: year,
          onChange: (e) => {
            setYear(e.target.value);
            updateVehicleDetails(void 0, void 0, e.target.value);
          },
          className: "w-full py-3 px-1.5 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-500",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Select Year" }),
            availableYears.map((yearOption) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: yearOption, children: yearOption }, yearOption))
          ]
        }
      )
    ] }),
    selectedVehicle === "boat" || selectedVehicle === "rv" ? (
      /* Length Input for Boat/RV */
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "vehicle-length", className: "block text-white font-medium text-sm", children: "Length (ft)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            id: "vehicle-length",
            type: "number",
            value: length,
            onChange: (e) => {
              setLength(e.target.value);
              updateVehicleDetails(void 0, void 0, void 0, void 0, e.target.value);
            },
            placeholder: "Enter length in feet",
            className: "w-full py-3 px-1.5 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-500",
            min: "1",
            max: "999"
          }
        )
      ] })
    ) : (
      /* Color Dropdown for other vehicles */
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "vehicle-color", className: "block text-white font-medium text-sm", children: "Color" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "select",
          {
            id: "vehicle-color",
            value: color,
            onChange: (e) => {
              setColor(e.target.value);
              updateVehicleDetails(void 0, void 0, void 0, e.target.value);
            },
            className: "w-full py-3 px-1.5 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-500",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Select Color" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "black", children: "Black" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "white", children: "White" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "silver", children: "Silver" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "gray", children: "Gray" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "red", children: "Red" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "blue", children: "Blue" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "green", children: "Green" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "other", children: "Other" })
            ]
          }
        )
      ] })
    )
  ] }) });
};

const StepVehicleSelection = ({ onVehicleSelected, onVehicleDetailsSelected }) => {
  const { vehicle, vehicleDetails, setVehicle, setVehicleDetails } = useBookingVehicle();
  const selectedVehicle = vehicle;
  const handleVehicleSelect = (vehicleId) => {
    setVehicle(vehicleId);
    onVehicleSelected?.(vehicleId);
  };
  const handleVehicleDetailsSelect = (details) => {
    setVehicleDetails(details);
    onVehicleDetailsSelected?.(details);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-4xl mx-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Tabs,
      {
        selectedVehicle,
        onVehicleSelect: handleVehicleSelect
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      VehicleSelection,
      {
        selectedVehicle,
        vehicleDetails,
        onVehicleDetailsSelect: handleVehicleDetailsSelect
      }
    )
  ] });
};

const BookingFlowController = () => {
  const navigate = useNavigate();
  const {
    currentStep,
    nextStep,
    previousStep
  } = useBookingStep();
  const stepOrder = ["vehicle-selection", "location", "service-tier", "addons", "schedule", "payment"];
  const currentStepIndex = stepOrder.indexOf(currentStep);
  const handleNext = reactExports.useCallback(() => {
    nextStep();
  }, [nextStep]);
  const handleBack = reactExports.useCallback(() => {
    previousStep();
  }, [previousStep]);
  const handleCancel = reactExports.useCallback(() => {
    void navigate("/");
  }, [navigate]);
  const renderStepContent = reactExports.useCallback(() => {
    switch (currentStep) {
      case "vehicle-selection":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(StepVehicleSelection, {});
      case "location":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(StepLocation, {});
      case "service-tier":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(StepService, {});
      case "addons":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(StepAddons, {});
      case "schedule":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(StepSchedule, {});
      case "payment":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(
          StepPayment,
          {
            onPaymentComplete: () => {
              void navigate("/");
            }
          }
        );
      default:
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-4xl font-bold text-white mb-4", children: "Unknown Step" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-300", children: "Step not found" })
        ] });
    }
  }, [currentStep, navigate]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    BookingLayout,
    {
      currentStep,
      completedSteps: stepOrder.slice(0, currentStepIndex),
      onNext: handleNext,
      onBack: handleBack,
      onCancel: handleCancel,
      canGoNext: currentStepIndex < stepOrder.length - 1,
      canGoBack: currentStepIndex > 0,
      canSkip: false,
      isLoading: false,
      nextLabel: currentStepIndex === stepOrder.length - 1 ? "Complete" : "Continue",
      backLabel: "Exit",
      showNavigation: true,
      averageRating: 4.9,
      totalReviews: 112,
      showTrustStrip: true,
      children: renderStepContent()
    }
  );
};

const BookingSteps = () => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(BookingFlowController, {});
};

const BookingPage = () => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(BookingSteps, {});
};

const BookingApp = () => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(BookingPage, {});
};

export { BookingApp as default };
//# sourceMappingURL=BookingApp-BmjYVDtP.js.map
