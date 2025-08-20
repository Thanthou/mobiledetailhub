import { useState } from 'react';
import { Car, Truck, Home, Bot as Boat, Bike, Mountain } from 'lucide-react';
import type { Vehicle } from '../types';

export const useServicesData = () => {
  const [vehicles] = useState<Vehicle[]>([
    {
      id: 'cars',
      name: 'Cars',
      icon: Car,
      categories: [
        {
          id: 'interior',
          name: 'Interior',
          color: 'bg-gray-600',
          services: [
            {
              id: 'clean',
              name: 'Clean',
              tiers: [
                {
                  id: 'basic',
                  name: 'Basic',
                  price: 50.00,
                  duration: 1,
                  features: ['Basic cleaning', 'Standard materials'],
                  enabled: true
                },
                {
                  id: 'premium',
                  name: 'Premium',
                  price: 85.00,
                  duration: 2,
                  features: ['Deep cleaning', 'Premium materials', 'Additional protection'],
                  enabled: true,
                  popular: true
                },
                {
                  id: 'luxury',
                  name: 'Luxury',
                  price: 150.00,
                  duration: 3,
                  features: ['Complete restoration', 'Premium materials', 'Extended protection', 'Quality guarantee'],
                  enabled: true
                }
              ]
            }
          ]
        },
        {
          id: 'exterior',
          name: 'Exterior',
          color: 'bg-blue-600',
          services: []
        },
        {
          id: 'addons',
          name: 'Addons',
          color: 'bg-stone-600',
          services: []
        },
        {
          id: 'packages',
          name: 'Service Packages',
          color: 'bg-stone-600',
          services: []
        }
      ]
    },
    {
      id: 'trucks',
      name: 'Trucks',
      icon: Truck,
      categories: [
        {
          id: 'interior',
          name: 'Interior',
          color: 'bg-gray-600',
          services: []
        },
        {
          id: 'exterior',
          name: 'Exterior',
          color: 'bg-blue-600',
          services: []
        },
        {
          id: 'addons',
          name: 'Addons',
          color: 'bg-stone-600',
          services: []
        },
        {
          id: 'packages',
          name: 'Service Packages',
          color: 'bg-stone-600',
          services: []
        }
      ]
    },
    {
      id: 'rvs',
      name: 'RVs',
      icon: Home,
      categories: []
    },
    {
      id: 'boats',
      name: 'Boats',
      icon: Boat,
      categories: []
    },
    {
      id: 'motorcycles',
      name: 'Motorcycles',
      icon: Bike,
      categories: []
    },
    {
      id: 'offroad',
      name: 'Off-Road',
      icon: Mountain,
      categories: []
    }
  ]);

  const toggleTierEnabled = (tierId: string) => {
    console.log('Toggle tier:', tierId);
    // Implementation for toggling tier enabled/disabled state
  };

  return {
    vehicles,
    toggleTierEnabled
  };
};