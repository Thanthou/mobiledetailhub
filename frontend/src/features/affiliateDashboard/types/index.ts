import type { ComponentType } from 'react';

export type DashboardTab = 'overview' | 'schedule' | 'customers' | 'performance' | 'services' | 'locations' | 'profile';

export interface DetailerData {
  business_name: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  location: string;
  services: string[];
  memberSince: string;
  bio?: string;
}

export interface TabConfig {
  id: DashboardTab;
  name: string;
  icon: ComponentType<{ className?: string }>;
}

export interface DashboardMetrics {
  dailyRevenue: number;
  weeklyRevenue: number;
  monthlyRevenue: number;
  totalAppointments: number;
  totalCustomers: number;
  averageRating: number;
}

export interface Appointment {
  id: string;
  customer: string;
  service: string;
  time: string;
  date: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  duration: number;
  phone?: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  lastVisit: string;
  totalSpent: number;
  visits: number;
  rating: number;
  status: 'active' | 'inactive';
  favoriteService: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  category: string;
  active: boolean;
  popularity: number;
}