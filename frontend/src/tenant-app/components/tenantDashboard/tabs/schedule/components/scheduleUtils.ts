/**
 * Shared utilities for schedule components
 */

type AppointmentStatus = 'confirmed' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'pending';

interface StatusStyles {
  background: string;
  badge: string;
}

/**
 * Get status-based styling for appointments
 */
export function getStatusStyles(status: AppointmentStatus): StatusStyles {
  switch (status) {
    case 'confirmed':
      return {
        background: 'bg-green-900/30 border-green-500',
        badge: 'bg-green-900 text-green-300'
      };
    case 'scheduled':
      return {
        background: 'bg-blue-900/30 border-blue-500',
        badge: 'bg-blue-900 text-blue-300'
      };
    case 'in_progress':
      return {
        background: 'bg-orange-900/30 border-orange-500',
        badge: 'bg-orange-900 text-orange-300'
      };
    case 'completed':
      return {
        background: 'bg-gray-900/30 border-gray-500',
        badge: 'bg-gray-900 text-gray-300'
      };
    case 'cancelled':
      return {
        background: 'bg-red-900/30 border-red-500',
        badge: 'bg-red-900 text-red-300'
      };
    default:
      return {
        background: 'bg-yellow-900/30 border-yellow-500',
        badge: 'bg-yellow-900 text-yellow-300'
      };
  }
}

/**
 * Generate time slots for day view (8 AM to 7 PM)
 */
export function generateTimeSlots(): string[] {
  return Array.from({ length: 12 }, (_, i) => {
    const hour = i + 8;
    return `${hour.toString().padStart(2, '0')}:00`;
  });
}

