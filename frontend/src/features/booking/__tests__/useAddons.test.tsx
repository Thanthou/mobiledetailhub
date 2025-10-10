import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useAddons } from '../hooks/useAddons';

// Mock the dynamic imports
vi.mock('@/data/affiliate-services/cars/addons/windows/service.json', () => ({
  default: {
    'Window Tinting': {
      cost: 200,
      features: ['tint1', 'tint2'],
      popular: true,
      description: 'Professional window tinting'
    },
    'Window Cleaning': {
      cost: 50,
      features: ['clean1'],
      popular: false,
      description: 'Deep window cleaning'
    }
  }
}));

vi.mock('@/data/affiliate-services/cars/addons/windows/features.json', () => ({
  default: {
    tint1: { name: 'UV Protection' },
    tint2: { name: 'Privacy Enhancement' },
    clean1: { name: 'Streak-Free Finish' }
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

describe('useAddons', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should load addons for valid vehicle type and category', async () => {
    const { result } = renderHook(() => useAddons('car', 'windows'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.availableAddons).toHaveLength(2);
    expect(result.current.availableAddons[0]).toEqual({
      id: 'window-tinting',
      name: 'Window Tinting',
      price: 200,
      description: 'Professional window tinting',
      features: ['UV Protection', 'Privacy Enhancement'],
      featureIds: ['tint1', 'tint2'],
      popular: true
    });
    expect(result.current.availableAddons[1]).toEqual({
      id: 'window-cleaning',
      name: 'Window Cleaning',
      price: 50,
      description: 'Deep window cleaning',
      features: ['Streak-Free Finish'],
      featureIds: ['clean1'],
      popular: false
    });
    expect(result.current.error).toBeNull();
  });

  it('should return empty array for invalid vehicle type', async () => {
    const { result } = renderHook(() => useAddons('invalid', 'windows'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.availableAddons).toEqual([]);
    expect(result.current.error).toBe('No addons available for vehicle type: invalid');
  });

  it('should handle missing parameters', async () => {
    const { result } = renderHook(() => useAddons('', ''), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.availableAddons).toEqual([]);
    expect(result.current.error).toBe('No addons available for vehicle type: ');
  });
});
