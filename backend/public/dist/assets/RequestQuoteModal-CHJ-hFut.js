import { r as reactExports, a0 as reactDomExports, j as jsxRuntimeExports, y as User, M as Mail, l as Phone, x as MapPin, ae as Wrench, a8 as MessageSquare, t as Car, C as CheckCircle } from './react-vendor-B9VNSH7T.js';
import { M as cn, N as formatPhoneNumberAsTyped, J as getVehicleYears, z as useDataOptional, B as Button, O as quoteRequestSchema, k as useData, Q as useTenantConfigLoader } from './usePreviewParams-DBlmro9g.js';
import { a as apiService } from './api-BcBw9jk9.js';
import { g as getMakesForType, a as getModelsForMake } from './index-Blp59fFO.js';
import './vendor-Utq0i4S3.js';
import './query-vendor-B2vaS9Wk.js';

function validateTextField(value, fieldName, validation = {}) {
  const errors = [];
  const sanitizedValue = value.trim();
  if (validation.required && !sanitizedValue) {
    errors.push(`${fieldName} is required`);
    return { isValid: false, errors };
  }
  if (!sanitizedValue) {
    return { isValid: true, errors: [], sanitizedValue: "" };
  }
  if (validation.minLength && sanitizedValue.length < validation.minLength) {
    errors.push(`${fieldName} must be at least ${String(validation.minLength)} characters`);
  }
  if (validation.maxLength && sanitizedValue.length > validation.maxLength) {
    errors.push(`${fieldName} must be no more than ${String(validation.maxLength)} characters`);
  }
  if (validation.pattern && !validation.pattern.test(sanitizedValue)) {
    errors.push(`${fieldName} format is invalid`);
  }
  if (validation.custom) {
    const customError = validation.custom(sanitizedValue);
    if (customError) {
      errors.push(customError);
    }
  }
  return errors.length === 0 ? { isValid: true, errors: [], sanitizedValue } : { isValid: false, errors };
}
function validateEmail(email) {
  return validateTextField(email, "Email", {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    custom: (value) => {
      if (value.length > 254) return "Email is too long";
      if (value.includes("..")) return "Email contains invalid consecutive dots";
      if (value.startsWith(".") || value.endsWith(".")) return "Email cannot start or end with a dot";
      return null;
    }
  });
}
function validatePhone(phone) {
  const digitsOnly = phone.replace(/\D/g, "");
  return validateTextField(phone, "Phone number", {
    required: true,
    custom: () => {
      if (digitsOnly.length < 10) return "Phone number must have at least 10 digits";
      if (digitsOnly.length > 15) return "Phone number is too long";
      return null;
    }
  });
}
function validateName(name) {
  return validateTextField(name, "Name", {
    required: true,
    minLength: 2,
    maxLength: 100,
    pattern: /^[a-zA-Z\s\-'.]+$/,
    custom: (value) => {
      if (value.includes("  ")) return "Name cannot contain consecutive spaces";
      if (value.startsWith(" ") || value.endsWith(" ")) return "Name cannot start or end with spaces";
      return null;
    }
  });
}
function validateVehicleField(value, fieldName) {
  return validateTextField(value, fieldName, {
    required: true,
    minLength: 2,
    maxLength: 50,
    pattern: /^[a-zA-Z0-9\s\-'.]+$/,
    custom: (value2) => {
      if (value2.includes("  ")) return `${fieldName} cannot contain consecutive spaces`;
      if (value2.startsWith(" ") || value2.endsWith(" ")) return `${fieldName} cannot start or end with spaces`;
      return null;
    }
  });
}
function validateMessage(message, required = false) {
  return validateTextField(message, "Message", {
    required,
    maxLength: 1e3,
    custom: (value) => {
      if (value.includes("  ")) return "Message cannot contain consecutive spaces";
      return null;
    }
  });
}
function sanitizeText(input) {
  return input.replace(/[<>]/g, "").replace(/javascript:/gi, "").replace(/on\w+=/gi, "").trim();
}

const Modal = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = "md",
  closeOnOverlayClick = true,
  closeOnEscape = true,
  showCloseButton = true,
  className
}) => {
  const modalRef = reactExports.useRef(null);
  const previousActiveElement = reactExports.useRef(null);
  const sizes = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    full: "max-w-full mx-4"
  };
  reactExports.useEffect(() => {
    if (!isOpen || !closeOnEscape) return;
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
      return;
    };
  }, [isOpen, closeOnEscape, onClose]);
  reactExports.useEffect(() => {
    if (!isOpen) return;
    previousActiveElement.current = document.activeElement;
    const focusableElements = modalRef.current?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    firstElement.focus();
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
      previousActiveElement.current?.focus();
    };
  }, [isOpen]);
  const handleOverlayClick = (event) => {
    if (closeOnOverlayClick && event.target === event.currentTarget) {
      onClose();
    }
  };
  if (!isOpen) return null;
  return reactDomExports.createPortal(
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fixed inset-0 z-50 flex items-center justify-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "fixed inset-0 bg-black/50 backdrop-blur-sm",
          onClick: handleOverlayClick,
          onKeyDown: (e) => {
            if (e.key === "Escape" && closeOnEscape) {
              onClose();
            }
          },
          role: "button",
          tabIndex: -1,
          "aria-label": "Close modal"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          ref: modalRef,
          className: cn(
            "relative bg-background rounded-lg shadow-lg w-full",
            sizes[size],
            className
          ),
          role: "dialog",
          "aria-modal": "true",
          "aria-labelledby": title ? "modal-title" : void 0,
          "aria-describedby": description ? "modal-description" : void 0,
          tabIndex: -1,
          children: [
            (title || showCloseButton) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-6 border-b border-border", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                title && /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { id: "modal-title", className: "text-lg font-semibold text-foreground", children: title }),
                description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { id: "modal-description", className: "text-sm text-muted-foreground mt-1", children: description })
              ] }),
              showCloseButton && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: onClose,
                  className: "rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                  "aria-label": "Close modal",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "svg",
                    {
                      className: "h-4 w-4",
                      fill: "none",
                      stroke: "currentColor",
                      viewBox: "0 0 24 24",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "path",
                        {
                          strokeLinecap: "round",
                          strokeLinejoin: "round",
                          strokeWidth: 2,
                          d: "M6 18L18 6M6 6l12 12"
                        }
                      )
                    }
                  )
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-6", children })
          ]
        }
      )
    ] }),
    document.body
  );
};

const vehicleTypes = [
  { id: "cars", name: "Cars" },
  { id: "trucks", name: "Trucks" },
  { id: "suvs", name: "SUVs" },
  { id: "vans", name: "Vans" },
  { id: "motorcycles", name: "Motorcycles" }
];
const vehicleMakes = [
  "Honda",
  "Toyota",
  "Ford",
  "Chevrolet",
  "BMW",
  "Mercedes-Benz",
  "Audi",
  "Nissan",
  "Hyundai",
  "Kia",
  "Mazda",
  "Subaru"
];
const useVehicleData = () => {
  const [selectedVehicleType, setSelectedVehicleType] = reactExports.useState("");
  const getMakes = reactExports.useCallback(() => {
    return vehicleMakes;
  }, []);
  const getModels = reactExports.useCallback(() => {
    const commonModels = ["Sedan", "SUV", "Truck", "Hatchback", "Coupe"];
    return commonModels;
  }, []);
  return {
    vehicleTypes,
    getMakes,
    getModels,
    selectedVehicleType,
    setSelectedVehicleType
  };
};

const ContactSection = ({
  formData,
  fieldErrors,
  isSubmitting,
  onInputChange
}) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-xl font-semibold text-white mb-4 flex items-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "mr-2 text-orange-500", size: 20 }),
      " Contact Information"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "name", className: "block text-sm font-medium text-white mb-1", children: "Full Name" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400", size: 18 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "text",
              id: "name",
              value: formData.name,
              onChange: (e) => {
                onInputChange("name", e.target.value);
              },
              className: `w-full pl-10 pr-3 py-2 bg-stone-700 border rounded-lg text-white placeholder-stone-400 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${fieldErrors.name ? "border-red-500" : "border-stone-600"}`,
              placeholder: "Enter your full name",
              disabled: isSubmitting
            }
          )
        ] }),
        fieldErrors.name && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-red-300", children: fieldErrors.name[0] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "email", className: "block text-sm font-medium text-white mb-1", children: "Email Address" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400", size: 18 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "email",
              id: "email",
              value: formData.email,
              onChange: (e) => {
                onInputChange("email", e.target.value);
              },
              className: `w-full pl-10 pr-3 py-2 bg-stone-700 border rounded-lg text-white placeholder-stone-400 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${fieldErrors.email ? "border-red-500" : "border-stone-600"}`,
              placeholder: "Enter your email",
              disabled: isSubmitting
            }
          )
        ] }),
        fieldErrors.email && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-red-300", children: fieldErrors.email[0] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "phone", className: "block text-sm font-medium text-white mb-1", children: "Phone Number" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400", size: 18 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "tel",
              id: "phone",
              value: formData.phone,
              onChange: (e) => {
                const formatted = formatPhoneNumberAsTyped(e.target.value, e.target.selectionStart || 0);
                onInputChange("phone", formatted.value);
              },
              className: `w-full pl-10 pr-3 py-2 bg-stone-700 border rounded-lg text-white placeholder-stone-400 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${fieldErrors.phone ? "border-red-500" : "border-stone-600"}`,
              placeholder: "(555) 123-4567",
              disabled: isSubmitting
            }
          )
        ] }),
        fieldErrors.phone && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-red-300", children: fieldErrors.phone[0] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-1 md:col-span-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "block text-sm font-medium text-white mb-1", children: "Location" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "city", className: "block text-xs font-medium text-stone-300 mb-1", children: "City" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400", size: 16 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "text",
                  id: "city",
                  value: formData.city || "",
                  onChange: (e) => {
                    onInputChange("city", e.target.value);
                  },
                  className: `w-full pl-9 pr-3 py-2 bg-stone-700 border rounded-lg text-white placeholder-stone-400 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${fieldErrors.city ? "border-red-500" : "border-stone-600"}`,
                  placeholder: "City",
                  disabled: isSubmitting
                }
              )
            ] }),
            fieldErrors.city && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-red-300", children: fieldErrors.city[0] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "state", className: "block text-xs font-medium text-stone-300 mb-1", children: "State" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "text",
                id: "state",
                value: formData.state || "",
                onChange: (e) => {
                  onInputChange("state", e.target.value);
                },
                className: `w-full px-3 py-2 bg-stone-700 border rounded-lg text-white placeholder-stone-400 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${fieldErrors.state ? "border-red-500" : "border-stone-600"}`,
                placeholder: "State",
                maxLength: 2,
                disabled: isSubmitting
              }
            ) }),
            fieldErrors.state && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-red-300", children: fieldErrors.state[0] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "zipCode", className: "block text-xs font-medium text-stone-300 mb-1", children: "Zip Code" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "text",
                id: "zipCode",
                value: formData.zipCode || "",
                onChange: (e) => {
                  onInputChange("zipCode", e.target.value);
                },
                className: `w-full px-3 py-2 bg-stone-700 border rounded-lg text-white placeholder-stone-400 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${fieldErrors.zipCode ? "border-red-500" : "border-stone-600"}`,
                placeholder: "12345",
                maxLength: 5,
                disabled: isSubmitting
              }
            ) }),
            fieldErrors.zipCode && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-red-300", children: fieldErrors.zipCode[0] })
          ] })
        ] })
      ] })
    ] })
  ] });
};

const ServicesSection = ({
  formData,
  fieldErrors,
  isSubmitting,
  onServiceToggle,
  onInputChange
}) => {
  const serviceOptions = [
    { label: "Interior", value: "Interior" },
    { label: "Paint Correction", value: "Paint Correction" },
    { label: "Exterior", value: "Exterior" },
    { label: "Ceramic Coating", value: "Ceramic Coating" },
    { label: "Other", value: "Other" },
    { label: "Paint Protection Film (PPF)", value: "Paint Protection Film (PPF)" }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-xl font-semibold text-white mb-4 flex items-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Wrench, { className: "mr-2 text-orange-500", size: 20 }),
        " Services Needed"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-3", children: serviceOptions.map((service) => /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center space-x-2 cursor-pointer", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "checkbox",
            checked: formData.services.includes(service.value),
            onChange: () => {
              onServiceToggle(service.value);
            },
            className: "h-5 w-5 text-orange-600 rounded focus:ring-orange-500 bg-stone-700 border-stone-600",
            disabled: isSubmitting
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white text-sm", children: service.label })
      ] }, service.value)) }),
      fieldErrors.services && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-red-300", children: fieldErrors.services[0] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-xl font-semibold text-white mb-4 flex items-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { className: "mr-2 text-orange-500", size: 20 }),
        " Additional Message (Optional)"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "textarea",
        {
          id: "message",
          value: formData.message,
          onChange: (e) => {
            onInputChange("message", sanitizeText(e.target.value));
          },
          rows: 4,
          className: `w-full px-3 py-2 bg-stone-700 border rounded-lg text-white placeholder-stone-400 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${fieldErrors.message ? "border-red-500" : "border-stone-600"}`,
          placeholder: "Tell us more about your needs...",
          disabled: isSubmitting
        }
      ),
      fieldErrors.message && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-red-300", children: fieldErrors.message[0] })
    ] })
  ] });
};

const VehicleSection = ({
  formData,
  fieldErrors,
  isSubmitting,
  onInputChange
}) => {
  const availableMakes = reactExports.useMemo(() => {
    return getMakesForType(formData.vehicleType.toLowerCase());
  }, [formData.vehicleType]);
  const availableModels = reactExports.useMemo(() => {
    if (!formData.vehicleMake) return [];
    return getModelsForMake(formData.vehicleType.toLowerCase(), formData.vehicleMake);
  }, [formData.vehicleType, formData.vehicleMake]);
  const vehicleYears = reactExports.useMemo(() => {
    return getVehicleYears();
  }, []);
  const showLength = ["RV", "Boat"].includes(formData.vehicleType);
  const lengthOrColorLabel = showLength ? "Length" : "Color";
  const lengthOrColorField = showLength ? "vehicleLength" : "vehicleColor";
  const lengthOrColorValue = showLength ? formData.vehicleLength || "" : formData.vehicleColor || "";
  const lengthOrColorPlaceholder = showLength ? "e.g., 25 ft, 30 ft" : "e.g., White, Black, Silver";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-xl font-semibold text-white mb-4 flex items-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Car, { className: "mr-2 text-orange-500", size: 20 }),
      " Vehicle Information"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "vehicleType", className: "block text-sm font-medium text-white mb-1", children: "Vehicle Type" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "select",
        {
          id: "vehicleType",
          value: formData.vehicleType,
          onChange: (e) => {
            onInputChange("vehicleType", e.target.value);
          },
          className: `w-full px-3 py-2 bg-stone-700 border rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${fieldErrors.vehicleType ? "border-red-500" : "border-stone-600"}`,
          disabled: isSubmitting,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", className: "bg-stone-700 text-white", children: "Select Type" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Car", className: "bg-stone-700 text-white", children: "Car" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Truck", className: "bg-stone-700 text-white", children: "Truck" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "SUV", className: "bg-stone-700 text-white", children: "SUV" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "RV", className: "bg-stone-700 text-white", children: "RV" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Boat", className: "bg-stone-700 text-white", children: "Boat" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Motorcycle", className: "bg-stone-700 text-white", children: "Motorcycle" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Other", className: "bg-stone-700 text-white", children: "Other" })
          ]
        }
      ),
      fieldErrors.vehicleType && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-red-300", children: fieldErrors.vehicleType[0] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "vehicleMake", className: "block text-sm font-medium text-white mb-1", children: "Vehicle Make" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "select",
          {
            id: "vehicleMake",
            value: formData.vehicleMake,
            onChange: (e) => {
              onInputChange("vehicleMake", e.target.value);
            },
            className: `w-full px-3 py-2 bg-stone-700 border rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${fieldErrors.vehicleMake ? "border-red-500" : "border-stone-600"}`,
            disabled: isSubmitting || !formData.vehicleType,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", className: "bg-stone-700 text-white", children: "Select Make" }),
              availableMakes.map((make) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: make, className: "bg-stone-700 text-white", children: make }, make))
            ]
          }
        ),
        fieldErrors.vehicleMake && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-red-300", children: fieldErrors.vehicleMake[0] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "vehicleModel", className: "block text-sm font-medium text-white mb-1", children: "Vehicle Model" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "select",
          {
            id: "vehicleModel",
            value: formData.vehicleModel,
            onChange: (e) => {
              onInputChange("vehicleModel", e.target.value);
            },
            className: `w-full px-3 py-2 bg-stone-700 border rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${fieldErrors.vehicleModel ? "border-red-500" : "border-stone-600"}`,
            disabled: isSubmitting || !formData.vehicleMake,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", className: "bg-stone-700 text-white", children: "Select Model" }),
              availableModels.map((model) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: model, className: "bg-stone-700 text-white", children: model }, model))
            ]
          }
        ),
        fieldErrors.vehicleModel && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-red-300", children: fieldErrors.vehicleModel[0] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "vehicleYear", className: "block text-sm font-medium text-white mb-1", children: "Vehicle Year" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "select",
          {
            id: "vehicleYear",
            value: formData.vehicleYear,
            onChange: (e) => {
              onInputChange("vehicleYear", e.target.value);
            },
            className: `w-full px-3 py-2 bg-stone-700 border rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${fieldErrors.vehicleYear ? "border-red-500" : "border-stone-600"}`,
            disabled: isSubmitting,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", className: "bg-stone-700 text-white", children: "Select Year" }),
              vehicleYears.map((year) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: year.toString(), className: "bg-stone-700 text-white", children: year }, year))
            ]
          }
        ),
        fieldErrors.vehicleYear && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-red-300", children: fieldErrors.vehicleYear[0] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: lengthOrColorField, className: "block text-sm font-medium text-white mb-1", children: lengthOrColorLabel }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: showLength ? "number" : "text",
            id: lengthOrColorField,
            value: lengthOrColorValue,
            onChange: (e) => {
              onInputChange(lengthOrColorField, e.target.value);
            },
            className: `w-full px-3 py-2 bg-stone-700 border rounded-lg text-white placeholder-stone-400 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${fieldErrors[lengthOrColorField] ? "border-red-500" : "border-stone-600"}`,
            placeholder: lengthOrColorPlaceholder,
            disabled: isSubmitting,
            ...showLength && { min: "1", step: "1" }
          }
        ),
        fieldErrors[lengthOrColorField] && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-red-300", children: fieldErrors[lengthOrColorField][0] })
      ] })
    ] })
  ] });
};

const QuoteForm = ({
  formData,
  fieldErrors,
  isSubmitting,
  error,
  services,
  serviceAreas,
  isAffiliate,
  businessLocation,
  handleInputChange,
  handleServiceToggle,
  handleSubmit
}) => {
  const data = useDataOptional();
  const isPreview = data?.isPreview || false;
  const handleFormSubmit = (e) => {
    if (isPreview) {
      e.preventDefault();
      return;
    }
    handleSubmit(e);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleFormSubmit, className: "space-y-6", children: [
    error && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-red-900 border border-red-600 text-red-300 px-4 py-3 rounded relative", role: "alert", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "font-bold", children: "Error:" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "block sm:inline", children: [
        " ",
        error
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ContactSection,
      {
        formData,
        fieldErrors,
        isSubmitting,
        isAffiliate,
        businessLocation,
        serviceAreas,
        onInputChange: handleInputChange
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      VehicleSection,
      {
        formData,
        fieldErrors,
        isSubmitting,
        onInputChange: handleInputChange
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ServicesSection,
      {
        formData,
        fieldErrors,
        isSubmitting,
        services,
        onServiceToggle: handleServiceToggle,
        onInputChange: handleInputChange
      }
    ),
    isPreview && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-orange-900/30 border border-orange-700 rounded-md p-4 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-orange-200 text-sm", children: [
      "This is a preview. Click ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: '"Get This Site"' }),
      " to activate quote requests."
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Button,
      {
        type: isPreview ? "button" : "submit",
        variant: "primary",
        size: "lg",
        className: `min-w-[150px] ${isPreview ? "bg-gray-600 cursor-not-allowed opacity-60" : "bg-orange-600 hover:bg-orange-700"} text-white border-orange-600`,
        loading: isSubmitting,
        disabled: isSubmitting || isPreview,
        children: isPreview ? "Preview Mode" : "Submit Quote"
      }
    ) })
  ] });
};

const quotesApi = {
  // Submit a quote request
  submitQuoteRequest: async (quoteData) => {
    return await apiService.submitQuoteRequest(quoteData);
  },
  // Get quote by ID
  getQuote: async (quoteId) => {
    const response = await fetch(`/api/quotes/${quoteId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch quote: ${response.statusText}`);
    }
    return await response.json();
  },
  // Update quote status
  updateQuoteStatus: async (quoteId, status) => {
    const response = await fetch(`/api/quotes/${quoteId}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ status })
    });
    if (!response.ok) {
      throw new Error(`Failed to update quote status: ${response.statusText}`);
    }
    return await response.json();
  },
  // Get quotes for a business
  getBusinessQuotes: async (businessSlug, limit = 10, offset = 0) => {
    const response = await fetch(`/api/quotes?business_slug=${businessSlug}&limit=${String(limit)}&offset=${String(offset)}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch business quotes: ${response.statusText}`);
    }
    return await response.json();
  },
  // Get user quotes
  getUserQuotes: async (userId, limit = 10, offset = 0) => {
    const response = await fetch(`/api/quotes?user_id=${userId}&limit=${String(limit)}&offset=${String(offset)}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch user quotes: ${response.statusText}`);
    }
    return await response.json();
  },
  // Cancel quote
  cancelQuote: async (quoteId, reason) => {
    const response = await fetch(`/api/quotes/${quoteId}/cancel`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ reason })
    });
    if (!response.ok) {
      throw new Error(`Failed to cancel quote: ${response.statusText}`);
    }
    return await response.json();
  }
};

const useQuoteFormState = () => {
  const [formData, setFormData] = reactExports.useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    state: "",
    zipCode: "",
    services: [],
    vehicleType: "",
    vehicleMake: "",
    vehicleModel: "",
    vehicleYear: "",
    message: ""
  });
  const [fieldErrors, setFieldErrors] = reactExports.useState({});
  const [isSubmitted, setIsSubmitted] = reactExports.useState(false);
  const [isSubmitting, setIsSubmitting] = reactExports.useState(false);
  const [error, setError] = reactExports.useState("");
  const updateFormData = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };
  const updateFieldErrors = (field, errors) => {
    setFieldErrors((prev) => ({ ...prev, [field]: errors }));
  };
  const clearFieldErrors = (field) => {
    setFieldErrors((prev) => {
      const { [field]: _, ...newErrors } = prev;
      return newErrors;
    });
  };
  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      city: "",
      state: "",
      zipCode: "",
      services: [],
      vehicleType: "",
      vehicleMake: "",
      vehicleModel: "",
      vehicleYear: "",
      message: ""
    });
    setFieldErrors({});
    setIsSubmitted(false);
    setIsSubmitting(false);
    setError("");
  };
  return {
    formData,
    fieldErrors,
    isSubmitted,
    isSubmitting,
    error,
    updateFormData,
    updateFieldErrors,
    clearFieldErrors,
    resetForm,
    setIsSubmitted,
    setIsSubmitting,
    setError
  };
};

const useAnalytics = () => {
  const isGAAvailable = typeof window !== "undefined" && typeof window.gtag === "function";
  const logEvent = reactExports.useCallback((eventName, params = {}) => {
    if (isGAAvailable) {
      try {
        if (window.gtag) {
          window.gtag("event", eventName, params);
        }
        return;
      } catch {
      }
    }
    console.debug("[analytics:event]", eventName, params);
  }, [isGAAvailable]);
  const identify = reactExports.useCallback((userId, params = {}) => {
    if (isGAAvailable) {
      try {
        if (window.gtag) {
          window.gtag("set", { user_id: String(userId), ...params });
        }
        return;
      } catch {
      }
    }
    console.debug("[analytics:identify]", userId, params);
  }, [isGAAvailable]);
  const setUserProperties = reactExports.useCallback((params) => {
    if (isGAAvailable) {
      try {
        if (window.gtag) {
          window.gtag("set", "user_properties", params);
        }
        return;
      } catch {
      }
    }
    console.debug("[analytics:user_properties]", params);
  }, [isGAAvailable]);
  return { logEvent, identify, setUserProperties };
};

const useQuoteSubmission = () => {
  const { logEvent } = useAnalytics();
  const submitQuote = reactExports.useCallback(async (formData, slug, onSuccess, onError) => {
    try {
      const validatedData = quoteRequestSchema.parse({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        services: formData.services,
        vehicleType: formData.vehicleType,
        vehicleMake: formData.vehicleMake,
        vehicleModel: formData.vehicleModel,
        vehicleYear: formData.vehicleYear,
        message: formData.message || void 0
      });
      const apiData = {
        ...validatedData,
        message: validatedData.message ?? "",
        businessSlug: slug ?? void 0
      };
      await quotesApi.submitQuoteRequest(apiData);
      logEvent("quote_submitted", {
        slug: slug || "",
        services_count: validatedData.services.length,
        vehicle_type: validatedData.vehicleType || "",
        city: validatedData.city || ""
      });
      onSuccess();
    } catch (err) {
      console.error("Quote submission error:", err);
      onError("Failed to submit quote. Please try again.");
    }
  }, [logEvent]);
  return {
    submitQuote
  };
};

const useQuoteTenantData = (updateFormData) => {
  const { businessName } = useData();
  const { data: tenantConfig } = useTenantConfigLoader();
  const slug = tenantConfig?.slug;
  const businessLocation = tenantConfig ? `${tenantConfig.contact.baseLocation.city}, ${tenantConfig.contact.baseLocation.state}` : "";
  const serviceAreas = reactExports.useCallback(() => {
    return [];
  }, []);
  reactExports.useEffect(() => {
    if (businessLocation && tenantConfig) {
      updateFormData("city", tenantConfig.contact.baseLocation.city);
      updateFormData("state", tenantConfig.contact.baseLocation.state);
    }
  }, [businessLocation, tenantConfig, updateFormData]);
  return {
    businessName,
    slug,
    businessLocation,
    serviceAreas
  };
};

const useQuoteValidation = () => {
  const validateField = reactExports.useCallback((field, value) => {
    const errors = [];
    switch (field) {
      case "name":
        if (!value.trim()) {
          errors.push("Name is required.");
        } else {
          const nameErrors = validateName(value);
          if (nameErrors.length > 0) {
            errors.push(...nameErrors);
          }
        }
        break;
      case "email":
        if (!value.trim()) {
          errors.push("Email is required.");
        } else {
          const emailErrors = validateEmail(value);
          if (emailErrors.length > 0) {
            errors.push(...emailErrors);
          }
        }
        break;
      case "phone":
        if (!value.trim()) {
          errors.push("Phone number is required.");
        } else {
          const phoneErrors = validatePhone(value);
          if (phoneErrors.length > 0) {
            errors.push(...phoneErrors);
          }
        }
        break;
      case "city":
        if (!value.trim()) {
          errors.push("City is required.");
        }
        break;
      case "state":
        if (!value.trim()) {
          errors.push("State is required.");
        }
        break;
      case "zipCode":
        if (!value.trim()) {
          errors.push("ZIP code is required.");
        }
        break;
      case "vehicleType":
        if (!value.trim()) {
          errors.push("Vehicle type is required.");
        }
        break;
      case "vehicleMake":
        if (!value.trim()) {
          errors.push("Vehicle make is required.");
        }
        break;
      case "vehicleModel":
        if (!value.trim()) {
          errors.push("Vehicle model is required.");
        }
        break;
      case "vehicleYear":
        if (!value.trim()) {
          errors.push("Vehicle year is required.");
        } else {
          const vehicleErrors = validateVehicleField("year", value);
          if (vehicleErrors.length > 0) {
            errors.push(...vehicleErrors);
          }
        }
        break;
      case "message":
        if (value.trim()) {
          const messageErrors = validateMessage(value);
          if (messageErrors.length > 0) {
            errors.push(...messageErrors);
          }
        }
        break;
    }
    return errors;
  }, []);
  const validateAllFields = reactExports.useCallback((formData) => {
    const allErrors = {};
    const fieldsToValidate = [
      "name",
      "email",
      "phone",
      "city",
      "state",
      "zipCode",
      "vehicleType",
      "vehicleMake",
      "vehicleModel",
      "vehicleYear"
    ];
    fieldsToValidate.forEach((field) => {
      const value = formData[field];
      if (typeof value === "string") {
        const errors = validateField(field, value);
        if (errors.length > 0) {
          allErrors[field] = errors;
        }
      }
    });
    if (formData.message) {
      const messageErrors = validateField("message", formData.message);
      if (messageErrors.length > 0) {
        allErrors.message = messageErrors;
      }
    }
    return allErrors;
  }, [validateField]);
  return {
    validateField,
    validateAllFields
  };
};

const useQuoteVehicleData = (formData, updateFormData) => {
  const { vehicleTypes, getMakes, getModels } = useVehicleData();
  const availableMakes = formData.vehicleType ? getMakes(formData.vehicleType) : [];
  const availableModels = formData.vehicleType && formData.vehicleMake ? getModels(formData.vehicleType, formData.vehicleMake) : [];
  reactExports.useEffect(() => {
    if (formData.vehicleType) {
      updateFormData("vehicleMake", "");
      updateFormData("vehicleModel", "");
    }
  }, [formData.vehicleType, updateFormData]);
  reactExports.useEffect(() => {
    if (formData.vehicleMake) {
      updateFormData("vehicleModel", "");
    }
  }, [formData.vehicleMake, updateFormData]);
  return {
    vehicleTypes,
    availableMakes,
    availableModels
  };
};

const useQuoteFormLogic = () => {
  const formState = useQuoteFormState();
  const vehicleData = useQuoteVehicleData(formState.formData, formState.updateFormData);
  const validation = useQuoteValidation();
  const submission = useQuoteSubmission();
  const tenantData = useQuoteTenantData(formState.updateFormData);
  const services = [
    "Interior",
    "Exterior",
    "Interior & Exterior",
    "Paint Correction",
    "Ceramic Coating",
    "Paint Protection Film (PPF)",
    "Other"
  ];
  const handleInputChange = reactExports.useCallback((field, value) => {
    formState.updateFormData(field, value);
    formState.clearFieldErrors(field);
  }, [formState]);
  const handleServiceToggle = reactExports.useCallback((service) => {
    const currentServices = formState.formData.services;
    const updatedServices = currentServices.includes(service) ? currentServices.filter((s) => s !== service) : [...currentServices, service];
    formState.updateFormData("services", updatedServices);
  }, [formState]);
  const handleSubmit = reactExports.useCallback(async (e) => {
    e.preventDefault();
    const allErrors = validation.validateAllFields(formState.formData);
    if (Object.keys(allErrors).length > 0) {
      Object.entries(allErrors).forEach(([field, errors]) => {
        formState.updateFieldErrors(field, errors);
      });
      return;
    }
    formState.setIsSubmitting(true);
    await submission.submitQuote(
      formState.formData,
      tenantData.slug,
      () => {
        formState.setIsSubmitted(true);
        formState.resetForm();
      },
      formState.setError
    );
    formState.setIsSubmitting(false);
  }, [formState, validation, submission, tenantData.slug]);
  const resetForm = reactExports.useCallback(() => {
    formState.resetForm();
  }, [formState]);
  return {
    // Form state
    formData: formState.formData,
    fieldErrors: formState.fieldErrors,
    isSubmitted: formState.isSubmitted,
    isSubmitting: formState.isSubmitting,
    error: formState.error,
    // Vehicle data
    vehicleTypes: vehicleData.vehicleTypes,
    availableMakes: vehicleData.availableMakes,
    availableModels: vehicleData.availableModels,
    // Services and tenant data
    services,
    serviceAreas: tenantData.serviceAreas(),
    businessName: tenantData.businessName || "",
    businessLocation: tenantData.businessLocation,
    businessSlug: tenantData.slug || "",
    isAffiliate: !!tenantData.slug,
    // Handlers
    handleInputChange,
    handleServiceToggle,
    handleSubmit,
    resetForm
  };
};

const useQuoteModal = ({ isOpen, onClose }) => {
  const [isVisible, setIsVisible] = reactExports.useState(false);
  const [isAnimating, setIsAnimating] = reactExports.useState(false);
  const handleClose = reactExports.useCallback(() => {
    onClose();
  }, [onClose]);
  const handleBackdropClick = reactExports.useCallback((e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  }, [handleClose]);
  reactExports.useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsAnimating(true);
      }, 10);
      return () => {
        clearTimeout(timer);
      };
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 300);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [isOpen]);
  reactExports.useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, handleClose]);
  return {
    isVisible,
    isAnimating,
    handleClose,
    handleBackdropClick
  };
};

const SuccessMessage = ({ onClose }) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(CheckCircle, { size: 64, className: "text-orange-500 mx-auto mb-4" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg text-white mb-2", children: "Thank you for your quote request!" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-stone-300", children: "We have received your information and will get back to you shortly." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Button,
      {
        onClick: onClose,
        className: "mt-6 bg-orange-600 hover:bg-orange-700 text-white border-orange-600",
        children: "Close"
      }
    )
  ] });
};

const RequestQuoteModal = ({ isOpen, onClose }) => {
  const {
    formData,
    fieldErrors,
    isSubmitted,
    isSubmitting,
    error,
    services,
    serviceAreas,
    businessName,
    businessLocation,
    isAffiliate,
    handleInputChange,
    handleServiceToggle,
    handleSubmit,
    resetForm
  } = useQuoteFormLogic();
  const { handleClose } = useQuoteModal({ isOpen, onClose });
  const handleCloseWithReset = reactExports.useCallback(() => {
    handleClose();
    resetForm();
  }, [handleClose, resetForm]);
  const modalTitle = isSubmitted ? "Quote Request Sent!" : `Request a Quote ${businessName ? `for ${businessName}` : ""}`;
  const modalDescription = isSubmitted ? "Thank you for your interest! We will get back to you soon." : "Fill out the form below and we'll get back to you with a personalized quote.";
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Modal,
    {
      isOpen,
      onClose: handleCloseWithReset,
      title: modalTitle,
      description: modalDescription,
      size: "xl",
      className: "bg-stone-800 text-white",
      children: isSubmitted ? /* @__PURE__ */ jsxRuntimeExports.jsx(SuccessMessage, { onClose: handleCloseWithReset }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
        QuoteForm,
        {
          formData,
          fieldErrors,
          isSubmitting,
          error: error || void 0,
          services,
          serviceAreas,
          isAffiliate,
          businessLocation,
          handleInputChange,
          handleServiceToggle,
          handleSubmit: () => void handleSubmit()
        }
      )
    }
  );
};

export { RequestQuoteModal as default };
//# sourceMappingURL=RequestQuoteModal-CHJ-hFut.js.map
