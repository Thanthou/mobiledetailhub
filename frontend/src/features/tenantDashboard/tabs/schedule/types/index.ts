// Schedule system types

export interface Appointment {
  id: number;
  affiliate_id: number;
  customer_id?: number;
  
  // Appointment details
  title: string;
  description?: string;
  service_type: string;
  service_duration: number; // in minutes
  
  // Scheduling
  start_time: string; // ISO string
  end_time: string; // ISO string
  
  // Customer information (denormalized for performance)
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  
  // Status and pricing
  status: AppointmentStatus;
  price?: number;
  deposit?: number;
  
  // Metadata
  notes?: string;
  internal_notes?: string;
  created_at: string;
  updated_at: string;
  created_by?: number;
  updated_by?: number;
}

export type AppointmentStatus = 
  | 'scheduled' 
  | 'confirmed' 
  | 'in_progress' 
  | 'completed' 
  | 'cancelled' 
  | 'no_show';

export interface TimeBlock {
  id: number;
  affiliate_id: number;
  
  // Block details
  title: string;
  description?: string;
  block_type: TimeBlockType;
  
  // Time range
  start_time: string; // ISO string
  end_time: string; // ISO string
  
  // Recurrence (optional)
  is_recurring: boolean;
  recurrence_pattern?: RecurrencePattern;
  recurrence_end_date?: string; // ISO string
  
  // Metadata
  created_at: string;
  updated_at: string;
  created_by?: number;
}

export type TimeBlockType = 
  | 'unavailable' 
  | 'break' 
  | 'maintenance' 
  | 'personal' 
  | 'other';

export type RecurrencePattern = 'daily' | 'weekly' | 'monthly';

export interface BlockedDay {
  id: number;
  affiliate_id: number;
  blocked_date: string; // YYYY-MM-DD format
  reason?: string;
  is_recurring: boolean;
  recurrence_pattern?: 'yearly' | 'monthly' | 'weekly';
  recurrence_end_date?: string; // YYYY-MM-DD format
  created_at: string;
  updated_at: string;
  created_by?: number;
}

export interface BusinessHours {
  [key: string]: {
    start: string; // HH:MM format
    end: string; // HH:MM format
    enabled: boolean;
  };
}

export interface ScheduleSettings {
  id: number;
  affiliate_id: number;
  
  // Business hours
  business_hours: BusinessHours;
  
  // Scheduling constraints
  default_appointment_duration: number; // in minutes
  buffer_time: number; // buffer between appointments in minutes
  max_appointments_per_day: number;
  advance_booking_days: number;
  same_day_booking_allowed: boolean;
  
  // Time slot configuration
  time_slot_interval: number; // interval between available time slots
  earliest_appointment_time: string; // HH:MM format
  latest_appointment_time: string; // HH:MM format
  
  // Notifications
  send_reminders: boolean;
  reminder_hours_before: number;
  send_confirmation_emails: boolean;
  
  // Metadata
  created_at: string;
  updated_at: string;
  updated_by?: number;
}

// API request/response types
export interface CreateAppointmentRequest {
  title: string;
  description?: string;
  service_type: string;
  service_duration: number;
  start_time: string;
  end_time: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  price?: number;
  deposit?: number;
  notes?: string;
  internal_notes?: string;
}

export interface UpdateAppointmentRequest extends Partial<CreateAppointmentRequest> {
  id: number;
  status?: AppointmentStatus;
}

export interface CreateTimeBlockRequest {
  title: string;
  description?: string;
  block_type: TimeBlockType;
  start_time: string;
  end_time: string;
  is_recurring?: boolean;
  recurrence_pattern?: RecurrencePattern;
  recurrence_end_date?: string;
}

export interface UpdateTimeBlockRequest extends Partial<CreateTimeBlockRequest> {
  id: number;
}

export interface UpdateScheduleSettingsRequest {
  business_hours?: BusinessHours;
  default_appointment_duration?: number;
  buffer_time?: number;
  max_appointments_per_day?: number;
  advance_booking_days?: number;
  same_day_booking_allowed?: boolean;
  time_slot_interval?: number;
  earliest_appointment_time?: string;
  latest_appointment_time?: string;
  send_reminders?: boolean;
  reminder_hours_before?: number;
  send_confirmation_emails?: boolean;
}

// View-specific types
export interface ScheduleViewMode {
  mode: 'day' | 'week' | 'month';
  selectedDate: string; // YYYY-MM-DD format
}

export interface TimeSlot {
  time: string; // HH:MM format
  available: boolean;
  appointment?: Appointment;
  timeBlock?: TimeBlock;
}

export interface ScheduleDay {
  date: string; // YYYY-MM-DD format
  timeSlots: TimeSlot[];
  appointments: Appointment[];
  timeBlocks: TimeBlock[];
}

// Form types
export interface AppointmentFormData {
  title: string;
  description: string;
  service_type: string;
  service_duration: number;
  start_time: string;
  end_time: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  price: number;
  deposit: number;
  notes: string;
  internal_notes: string;
}

export interface TimeBlockFormData {
  title: string;
  description: string;
  block_type: TimeBlockType;
  start_time: string;
  end_time: string;
  is_recurring: boolean;
  recurrence_pattern: RecurrencePattern;
  recurrence_end_date: string;
}
