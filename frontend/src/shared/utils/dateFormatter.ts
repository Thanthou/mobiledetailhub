/**
 * Date Formatting Utilities
 * Centralized date formatting functions to ensure consistency across the app
 */

/**
 * Get today's date as YYYY-MM-DD string (local timezone)
 */
export function getToday(): string {
  const now = new Date();
  return formatDateToYYYYMMDD(now);
}

/**
 * Parse YYYY-MM-DD string as local date (avoids timezone issues)
 * @param dateString - Date string in YYYY-MM-DD format
 * @returns Date object in local timezone
 */
export function parseLocalDate(dateString: string): Date {
  const [year = 0, month = 1, day = 1] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day);
}

/**
 * Format Date object as YYYY-MM-DD string
 * @param date - Date object
 * @returns Date string in YYYY-MM-DD format
 */
export function formatDateToYYYYMMDD(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Format date for display (e.g., "January 15, 2025")
 * @param date - Date object or YYYY-MM-DD string
 * @param options - Intl.DateTimeFormatOptions
 * @returns Formatted date string
 */
export function formatDateForDisplay(
  date: Date | string,
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }
): string {
  const dateObj = typeof date === 'string' ? parseLocalDate(date) : date;
  return dateObj.toLocaleDateString('en-US', options);
}

/**
 * Format date for short display (e.g., "Jan 15, 2025")
 * @param date - Date object or YYYY-MM-DD string
 * @returns Short formatted date string
 */
export function formatDateShort(date: Date | string): string {
  return formatDateForDisplay(date, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

/**
 * Format date for compact display (e.g., "1/15/25")
 * @param date - Date object or YYYY-MM-DD string
 * @returns Compact formatted date string
 */
export function formatDateCompact(date: Date | string): string {
  return formatDateForDisplay(date, {
    year: '2-digit',
    month: 'numeric',
    day: 'numeric'
  });
}

/**
 * Get month and year display (e.g., "January 2025")
 * @param date - Date object or YYYY-MM-DD string
 * @returns Month and year string
 */
export function formatMonthYear(date: Date | string): string {
  return formatDateForDisplay(date, {
    year: 'numeric',
    month: 'long'
  });
}

/**
 * Get week dates (Monday to Sunday) for a given date
 * @param dateString - Date string in YYYY-MM-DD format
 * @returns Array of 7 date strings (Monday to Sunday)
 */
export function getWeekDates(dateString: string): string[] {
  const parts = dateString.split('-').map(Number);
  const year = parts[0] ?? 0;
  const month = parts[1] ?? 1;
  const day = parts[2] ?? 1;
  
  const selectedDate = new Date(year, month - 1, day);
  const dayOfWeek = selectedDate.getDay();
  
  // Calculate offset to Monday (0=Sunday, 1=Monday, etc.)
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  
  const weekDates: string[] = [];
  for (let i = 0; i < 7; i++) {
    const weekDate = new Date(year, month - 1, day + mondayOffset + i);
    weekDates.push(formatDateToYYYYMMDD(weekDate));
  }
  
  return weekDates;
}

/**
 * Get week range display (e.g., "Jan 15 - Jan 21, 2025")
 * @param dateString - Date string in YYYY-MM-DD format
 * @returns Week range string
 */
export function formatWeekRange(dateString: string): string {
  const weekDates = getWeekDates(dateString);
  
  // getWeekDates always returns 7 dates (Monday-Sunday)
  const firstDate = weekDates[0];
  const lastDate = weekDates[6];
  
  if (!firstDate || !lastDate) {
    return '';
  }
  
  const startDate = parseLocalDate(firstDate);
  const endDate = parseLocalDate(lastDate);
  
  const startFormatted = startDate.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric' 
  });
  
  const endFormatted = endDate.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: 'numeric' 
  });
  
  return `${startFormatted} - ${endFormatted}`;
}

/**
 * Check if a date is today
 * @param date - Date object or YYYY-MM-DD string
 * @returns True if date is today
 */
export function isToday(date: Date | string): boolean {
  const dateString = typeof date === 'string' ? date : formatDateToYYYYMMDD(date);
  return dateString === getToday();
}

/**
 * Check if a date is in the past
 * @param date - Date object or YYYY-MM-DD string
 * @returns True if date is before today
 */
export function isPast(date: Date | string): boolean {
  const dateString = typeof date === 'string' ? date : formatDateToYYYYMMDD(date);
  return dateString < getToday();
}

/**
 * Check if a date is in the future
 * @param date - Date object or YYYY-MM-DD string
 * @returns True if date is after today
 */
export function isFuture(date: Date | string): boolean {
  const dateString = typeof date === 'string' ? date : formatDateToYYYYMMDD(date);
  return dateString > getToday();
}

/**
 * Get the day name from a date (e.g., "Monday")
 * @param date - Date object or YYYY-MM-DD string
 * @returns Day name
 */
export function getDayName(date: Date | string): string {
  const dateObj = typeof date === 'string' ? parseLocalDate(date) : date;
  return dateObj.toLocaleDateString('en-US', { weekday: 'long' });
}

/**
 * Get the short day name from a date (e.g., "Mon")
 * @param date - Date object or YYYY-MM-DD string
 * @returns Short day name
 */
export function getDayNameShort(date: Date | string): string {
  const dateObj = typeof date === 'string' ? parseLocalDate(date) : date;
  return dateObj.toLocaleDateString('en-US', { weekday: 'short' });
}

/**
 * Add days to a date
 * @param date - Date object or YYYY-MM-DD string
 * @param days - Number of days to add (can be negative)
 * @returns New date string in YYYY-MM-DD format
 */
export function addDays(date: Date | string, days: number): string {
  const dateObj = typeof date === 'string' ? parseLocalDate(date) : new Date(date);
  dateObj.setDate(dateObj.getDate() + days);
  return formatDateToYYYYMMDD(dateObj);
}

/**
 * Add months to a date
 * @param date - Date object or YYYY-MM-DD string
 * @param months - Number of months to add (can be negative)
 * @returns New date string in YYYY-MM-DD format
 */
export function addMonths(date: Date | string, months: number): string {
  const dateObj = typeof date === 'string' ? parseLocalDate(date) : new Date(date);
  dateObj.setMonth(dateObj.getMonth() + months);
  return formatDateToYYYYMMDD(dateObj);
}

