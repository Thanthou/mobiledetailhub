import { BarChart3, Calendar, Car, Home, MapPin, User,Users } from 'lucide-react';

import type { TabConfig } from '../types';

export const DASHBOARD_TABS: TabConfig[] = [
  { id: 'overview', name: 'Overview', icon: Home },
  { id: 'schedule', name: 'Schedule', icon: Calendar },
  { id: 'customers', name: 'Customers', icon: Users },
  { id: 'performance', name: 'Performance', icon: BarChart3 },
  { id: 'services', name: 'Services', icon: Car },
  { id: 'locations', name: 'Locations', icon: MapPin },
  { id: 'profile', name: 'Profile', icon: User },
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