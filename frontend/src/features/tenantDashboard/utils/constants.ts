import { Calendar, Car, Home, MapPin, User, Users, Globe } from 'lucide-react';

import type { TabConfig } from '../types';

export const DASHBOARD_TABS: TabConfig[] = [
  { id: 'overview', name: 'Overview', icon: Home },
  { id: 'website', name: 'Website', icon: Globe },
  { id: 'locations', name: 'Locations', icon: MapPin },
  { id: 'profile', name: 'Profile', icon: User },
  { id: 'schedule', name: 'Schedule', icon: Calendar },
  { id: 'customers', name: 'Customers', icon: Users },
  { id: 'services', name: 'Services', icon: Car },
];

export const BUSINESS_CATEGORIES = [
  'Exterior',
  'Interior', 
  'Protection',
  'Correction',
  'Maintenance'
] as const;

export const APPOINTMENT_STATUSES = [
  'confirmed',
  'pending', 
  'cancelled'
] as const;