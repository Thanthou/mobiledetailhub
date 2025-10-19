import { useMemo } from 'react';
import { create } from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';

import { BookingActions, BookingData, BookingState, BookingStep } from './types';

const initialBookingData: BookingData = {
  vehicle: '',
  vehicleDetails: {
    make: '',
    model: '',
    year: '',
    color: '',
    length: ''
  },
  location: {
    address: '',
    city: '',
    state: '',
    zip: '',
    notes: '',
    locationType: ''
  },
  serviceTier: '',
  addons: [],
  schedule: { dates: [], time: '' },
  paymentMethod: ''
};

const stepOrder: BookingStep[] = ['vehicle-selection', 'location', 'service-tier', 'addons', 'schedule', 'payment'];

export const useBookingStore = create<BookingState & BookingActions>()(
  subscribeWithSelector(
    devtools(
      (set, get) => ({
      // Initial state
      currentStep: 'vehicle-selection',
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
              errors: [] // Clear errors when changing steps
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
            // Direct state update instead of calling setCurrentStep to avoid circular dependency
                  set(() => {
                    const newIndex = stepOrder.indexOf(nextStep);
                    const completedSteps = stepOrder.slice(0, newIndex);
                    return {
                      currentStep: nextStep,
                      completedSteps,
                      errors: [] // Clear errors when changing steps
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
            // Direct state update instead of calling setCurrentStep to avoid circular dependency
                  set(() => {
                    const newIndex = stepOrder.indexOf(prevStep);
                    const completedSteps = stepOrder.slice(0, newIndex);
                    return {
                      currentStep: prevStep,
                      completedSteps,
                      errors: [] // Clear errors when changing steps
                    };
                  });
                }
        }
      },

      resetBooking: () => {
        set({
          currentStep: 'vehicle-selection',
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
        name: 'booking-store', // Unique name for devtools
      }
    )
  )
);

// Narrow selectors for better performance
export const useBookingStep = () => {
  const currentStep = useBookingStore((state) => state.currentStep);
  const completedSteps = useBookingStore((state) => state.completedSteps);
  const nextStep = useBookingStore((state) => state.nextStep);
  const previousStep = useBookingStore((state) => state.previousStep);
  const setCurrentStep = useBookingStore((state) => state.setCurrentStep);
  
  return useMemo(() => ({
    currentStep,
    completedSteps,
    nextStep,
    previousStep,
    setCurrentStep
  }), [currentStep, completedSteps, nextStep, previousStep, setCurrentStep]);
};

export const useBookingData = () => {
  const bookingData = useBookingStore((state) => state.bookingData);
  const setVehicle = useBookingStore((state) => state.setVehicle);
  const setVehicleDetails = useBookingStore((state) => state.setVehicleDetails);
  const setLocation = useBookingStore((state) => state.setLocation);
  const setServiceTier = useBookingStore((state) => state.setServiceTier);
  const setAddons = useBookingStore((state) => state.setAddons);
  const setSchedule = useBookingStore((state) => state.setSchedule);
  const setPaymentMethod = useBookingStore((state) => state.setPaymentMethod);
  
  return useMemo(() => ({
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

export const useBookingVehicle = () => {
  const vehicle = useBookingStore((state) => state.bookingData.vehicle);
  const vehicleDetails = useBookingStore((state) => state.bookingData.vehicleDetails);
  const setVehicle = useBookingStore((state) => state.setVehicle);
  const setVehicleDetails = useBookingStore((state) => state.setVehicleDetails);
  
  return useMemo(() => ({
    vehicle,
    vehicleDetails,
    setVehicle,
    setVehicleDetails
  }), [vehicle, vehicleDetails, setVehicle, setVehicleDetails]);
};

export const useBookingService = () => {
  const serviceTier = useBookingStore((state) => state.bookingData.serviceTier);
  const setServiceTier = useBookingStore((state) => state.setServiceTier);
  
  return useMemo(() => ({
    serviceTier,
    setServiceTier
  }), [serviceTier, setServiceTier]);
};

export const useBookingAddons = () => {
  const addons = useBookingStore((state) => state.bookingData.addons);
  const setAddons = useBookingStore((state) => state.setAddons);
  
  return useMemo(() => ({
    addons,
    setAddons
  }), [addons, setAddons]);
};

export const useBookingSchedule = () => {
  const schedule = useBookingStore((state) => state.bookingData.schedule);
  const setSchedule = useBookingStore((state) => state.setSchedule);
  
  return useMemo(() => ({
    schedule,
    setSchedule
  }), [schedule, setSchedule]);
};

export const useBookingPayment = () => {
  const paymentMethod = useBookingStore((state) => state.bookingData.paymentMethod);
  const setPaymentMethod = useBookingStore((state) => state.setPaymentMethod);
  
  return useMemo(() => ({
    paymentMethod,
    setPaymentMethod
  }), [paymentMethod, setPaymentMethod]);
};

export const useBookingErrors = () => {
  const errors = useBookingStore((state) => state.errors);
  const isLoading = useBookingStore((state) => state.isLoading);
  const setErrors = useBookingStore((state) => state.setErrors);
  const addError = useBookingStore((state) => state.addError);
  const clearErrors = useBookingStore((state) => state.clearErrors);
  const setLoading = useBookingStore((state) => state.setLoading);
  
  return useMemo(() => ({
    errors,
    isLoading,
    setErrors,
    addError,
    clearErrors,
    setLoading
  }), [errors, isLoading, setErrors, addError, clearErrors, setLoading]);
};
