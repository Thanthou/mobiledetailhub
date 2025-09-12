import type { ComponentType } from 'react';
import { Bike, Car, Ship, Truck } from 'lucide-react';

import RVIcon from '../components/RVIcon';

// Vehicle type definitions
export interface Vehicle {
  id: string;
  name: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
}

export interface VehicleCategory {
  id: string;
  name: string;
  color: string;
  services: unknown[];
}

// Vehicle data
export const vehicles: Vehicle[] = [
  { id: 'car', name: 'Car', description: 'Sedan/Coupe/Compact', icon: Car },
  { id: 'truck', name: 'Truck', description: 'Light duty, work trucks', icon: Truck },
  { id: 'suv', name: 'SUV', description: 'Crossovers & full-size', icon: Car },
  { id: 'boat', name: 'Boat', description: 'Runabout, bass, wake', icon: Ship },
  { id: 'rv', name: 'RV', description: 'Travel trailers & coaches', icon: RVIcon },
  { id: 'motorcycle', name: 'Motorcycle', description: 'Street & sport bikes', icon: Bike },
];

// Categories for each vehicle type
export const categories: { [vehicleId: string]: VehicleCategory[] } = {
  car: [
    { id: 'service-packages', name: 'Service Packages', color: 'bg-green-600', services: [] },
    { id: 'addons', name: 'Addons', color: 'bg-indigo-600', services: [] },
    { id: 'ceramic-coating', name: 'Ceramic Coating', color: 'bg-blue-600', services: [] },
    { id: 'paint-correction', name: 'Paint Correction', color: 'bg-purple-600', services: [] }
  ],
  truck: [
    { id: 'service-packages', name: 'Service Packages', color: 'bg-green-600', services: [] },
    { id: 'addons', name: 'Addons', color: 'bg-indigo-600', services: [] },
    { id: 'ceramic-coating', name: 'Ceramic Coating', color: 'bg-blue-600', services: [] },
    { id: 'paint-correction', name: 'Paint Correction', color: 'bg-purple-600', services: [] }
  ],
  rv: [
    { id: 'service-packages', name: 'Service Packages', color: 'bg-green-600', services: [] },
    { id: 'addons', name: 'Addons', color: 'bg-indigo-600', services: [] }
  ],
  boat: [
    { id: 'service-packages', name: 'Service Packages', color: 'bg-green-600', services: [] },
    { id: 'addons', name: 'Addons', color: 'bg-indigo-600', services: [] }
  ],
  motorcycle: [
    { id: 'service-packages', name: 'Service Packages', color: 'bg-green-600', services: [] },
    { id: 'addons', name: 'Addons', color: 'bg-indigo-600', services: [] }
  ]
};

// Mock vehicle data for makes and models
export const vehicleData = {
  car: [
    { brand: 'Toyota', models: ['Camry', 'Corolla', 'Prius', 'RAV4'] },
    { brand: 'Honda', models: ['Civic', 'Accord', 'CR-V', 'Pilot'] },
    { brand: 'Ford', models: ['F-150', 'Escape', 'Explorer', 'Mustang'] },
    { brand: 'Chevrolet', models: ['Silverado', 'Equinox', 'Malibu', 'Tahoe'] },
    { brand: 'BMW', models: ['3 Series', '5 Series', 'X3', 'X5'] }
  ],
  boat: {
    'Sea Ray': ['Sundancer', 'Sundancer 320', 'Sundancer 350'],
    'Bayliner': ['Element', 'VR5', 'VR6'],
    'Grady-White': ['Freedom', 'Fisherman', 'Canyon'],
    'Boston Whaler': ['Montauk', 'Outrage', 'Vantage']
  },
  rv: {
    'Winnebago': ['Travato', 'Vista', 'Forza'],
    'Thor': ['Ace', 'Chateau', 'Four Winds'],
    'Forest River': ['Berkshire', 'Cherokee', 'Rockwood'],
    'Jayco': ['Eagle', 'Jay Flight', 'Redhawk']
  },
  motorcycle: {
    'Honda': ['CBR600RR', 'CBR1000RR', 'CB650R', 'CRF450L'],
    'Yamaha': ['YZF-R6', 'YZF-R1', 'MT-07', 'MT-09'],
    'Kawasaki': ['Ninja 650', 'Ninja ZX-6R', 'Ninja ZX-10R', 'Versys 650'],
    'Suzuki': ['GSX-R600', 'GSX-R750', 'GSX-R1000', 'SV650']
  }
};