import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { BookingState, BookingActions, BookingData, BookingStep } from './types';

const initialBookingData: BookingData = {
  vehicle: '',
  serviceTier: '',
  addons: [],
  schedule: { date: '', time: '' },
  paymentMethod: ''
};

const stepOrder: BookingStep[] = ['vehicle-selection', 'service-tier', 'addons', 'schedule', 'payment'];

export const useBookingStore = create<BookingState & BookingActions>()(
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
        
        console.log('🔄 Step changed to:', step);
      },

      updateBookingData: (data) => {
        set((state) => ({
          bookingData: { ...state.bookingData, ...data }
        }));
        
        console.log('📊 Booking data updated:', data);
      },

      setVehicle: (vehicle) => {
        set((state) => ({
          bookingData: { ...state.bookingData, vehicle }
        }));
        
        console.log('🚗 Vehicle selected:', vehicle);
      },

      setServiceTier: (tier) => {
        set((state) => ({
          bookingData: { ...state.bookingData, serviceTier: tier }
        }));
        
        console.log('🎯 Service tier selected:', tier);
      },

      setAddons: (addons) => {
        set((state) => ({
          bookingData: { ...state.bookingData, addons }
        }));
        
        console.log('➕ Addons selected:', addons);
      },

      setSchedule: (schedule) => {
        set((state) => ({
          bookingData: { ...state.bookingData, schedule }
        }));
        
        console.log('📅 Schedule selected:', schedule);
      },

      setPaymentMethod: (method) => {
        set((state) => ({
          bookingData: { ...state.bookingData, paymentMethod: method }
        }));
        
        console.log('💳 Payment method selected:', method);
      },

      nextStep: () => {
        const { currentStep } = get();
        const currentIndex = stepOrder.indexOf(currentStep);
        
        if (currentIndex < stepOrder.length - 1) {
          const nextStep = stepOrder[currentIndex + 1];
          if (nextStep) {
            get().setCurrentStep(nextStep);
            console.log('🔄 Moving to next step:', nextStep);
          }
        } else {
          console.log('🎉 Booking completed!');
        }
      },

      previousStep: () => {
        const { currentStep } = get();
        const currentIndex = stepOrder.indexOf(currentStep);
        
        if (currentIndex > 0) {
          const prevStep = stepOrder[currentIndex - 1];
          if (prevStep) {
            get().setCurrentStep(prevStep);
            console.log('🔄 Moving to previous step:', prevStep);
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
        
        console.log('🔄 Booking reset');
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
);
