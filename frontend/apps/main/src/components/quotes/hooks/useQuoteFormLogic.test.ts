// Test file to debug the useQuoteFormLogic hook
import { renderHook } from '@testing-library/react';

import { useQuoteFormLogic } from './useQuoteFormLogic';

// Mock the dependencies
jest.mock('@main/components/booking/hooks', () => ({
  useVehicleData: () => ({
    vehicleTypes: [],
    getMakes: jest.fn(),
    getModels: jest.fn()
  })
}));

jest.mock('@/shared/hooks', () => ({
  useLocation: () => ({
    selectedLocation: null
  }),
  useSiteContext: () => ({
    isAffiliate: false
  })
}));

jest.mock('@/shared/utils', () => ({
  validateEmail: jest.fn(),
  validateMessage: jest.fn(),
  validateName: jest.fn(),
  validatePhone: jest.fn(),
  validateVehicleField: jest.fn()
}));

describe('useQuoteFormLogic', () => {
  it('should not throw an error', () => {
    expect(() => {
      renderHook(() => useQuoteFormLogic());
    }).not.toThrow();
  });
});
