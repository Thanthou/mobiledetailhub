import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useServiceTiers } from '../hooks/useServiceTiers';

// Mock the dynamic imports
vi.mock('@/data/mobile-detailing/pricing/cars/service/services.json', () => ({
  default: {
    'Basic Wash': {
      cost: 50,
      features: ['feature1', 'feature2'],
      popular: false,
      description: 'Basic car wash service'
    },
    'Premium Detail': {
      cost: 150,
      features: ['feature1', 'feature2', 'feature3'],
      popular: true,
      description: 'Premium detailing service'
    }
  }
}));

vi.mock('@/data/mobile-detailing/pricing/cars/service/features.json', () => ({
  default: {
    feature1: { name: 'Exterior Wash' },
    feature2: { name: 'Tire Cleaning' },
    feature3: { name: 'Wax Application' }
  }
}));

// Mock the vehicle mapping
vi.mock('@/shared/constants', () => ({
  toFolderName: (vehicleType: string) => {
    const map: Record<string, string> = {
      'car': 'cars',
      'truck': 'trucks',
      'suv': 'suvs'
    };
    return map[vehicleType] || null;
  }
}));

const createWrapper = (): React.ComponentType<{ children: React.ReactNode }> => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  return Wrapper;
};

describe('useServiceTiers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should load service tiers for valid vehicle type', async () => {
    const { result } = renderHook(() => useServiceTiers('car'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.serviceTiers).toHaveLength(2);
    expect(result.current.serviceTiers[0]).toEqual({
      id: 'basic-wash',
      name: 'Basic Wash',
      price: 50,
      description: 'Basic car wash service',
      features: ['Exterior Wash', 'Tire Cleaning'],
      featureIds: ['feature1', 'feature2'],
      popular: false
    });
    expect(result.current.serviceTiers[1]).toEqual({
      id: 'premium-detail',
      name: 'Premium Detail',
      price: 150,
      description: 'Premium detailing service',
      features: ['Exterior Wash', 'Tire Cleaning', 'Wax Application'],
      featureIds: ['feature1', 'feature2', 'feature3'],
      popular: true
    });
    expect(result.current.error).toBeNull();
  });

  it('should return empty array for invalid vehicle type', async () => {
    const { result } = renderHook(() => useServiceTiers('invalid'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.serviceTiers).toEqual([]);
    expect(result.current.error).toBe('No services available for vehicle type: invalid');
  });

  it('should handle missing vehicle type', async () => {
    const { result } = renderHook(() => useServiceTiers(''), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.serviceTiers).toEqual([]);
    expect(result.current.error).toBe('No services available for vehicle type: ');
  });
});
