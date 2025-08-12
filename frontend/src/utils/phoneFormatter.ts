/**
 * Phone Number Formatter Utility
 * Ensures phone numbers are always in the format (###) ###-####
 */

/**
 * Formats a phone number string to (###) ###-#### format
 * @param input - Raw phone number input (can include spaces, dashes, dots, etc.)
 * @returns Formatted phone number string
 */
export function formatPhoneNumber(input: string): string {
  if (!input) return '';
  
  // Remove all non-digit characters
  const digitsOnly = input.replace(/\D/g, '');
  
  // Remove leading 1 if it exists (country code)
  const withoutCountryCode = digitsOnly.startsWith('1') && digitsOnly.length > 10 
    ? digitsOnly.slice(1) 
    : digitsOnly;
  
  // If we don't have exactly 10 digits, return the cleaned input
  if (withoutCountryCode.length !== 10) {
    return withoutCountryCode;
  }
  
  // Format as (###) ###-####
  const areaCode = withoutCountryCode.slice(0, 3);
  const prefix = withoutCountryCode.slice(3, 6);
  const lineNumber = withoutCountryCode.slice(6, 10);
  
  return `(${areaCode}) ${prefix}-${lineNumber}`;
}

/**
 * Validates if a phone number is complete (has 10 digits)
 * @param input - Phone number string
 * @returns boolean indicating if the number is complete
 */
export function isCompletePhoneNumber(input: string): boolean {
  const digitsOnly = input.replace(/\D/g, '');
  const withoutCountryCode = digitsOnly.startsWith('1') && digitsOnly.length > 10 
    ? digitsOnly.slice(1) 
    : digitsOnly;
  
  return withoutCountryCode.length === 10;
}

/**
 * Gets just the digits from a phone number (useful for storage/API calls)
 * @param input - Phone number string
 * @returns String of digits only
 */
export function getPhoneDigits(input: string): string {
  const digitsOnly = input.replace(/\D/g, '');
  const withoutCountryCode = digitsOnly.startsWith('1') && digitsOnly.length > 10 
    ? digitsOnly.slice(1) 
    : digitsOnly;
  
  return withoutCountryCode;
}

/**
 * Formats phone number as user types (real-time formatting)
 * @param input - Current input value
 * @param cursorPosition - Current cursor position
 * @returns Object with formatted value and new cursor position
 */
export function formatPhoneNumberAsTyped(input: string, cursorPosition: number): {
  value: string;
  cursorPosition: number;
} {
  if (!input) return { value: '', cursorPosition: 0 };
  
  // Get the current digits
  const currentDigits = getPhoneDigits(input);
  
  // If we have 10+ digits, format it
  if (currentDigits.length >= 10) {
    const formatted = formatPhoneNumber(currentDigits);
    
    // Calculate new cursor position
    let newPosition = cursorPosition;
    
    // Adjust cursor position based on formatting characters added
    if (cursorPosition > 0) {
      // Count formatting characters before cursor in original input
      const beforeCursor = input.slice(0, cursorPosition);
      const digitsBeforeCursor = beforeCursor.replace(/\D/g, '').length;
      
      // Find position in formatted string after same number of digits
      let digitCount = 0;
      for (let i = 0; i < formatted.length; i++) {
        if (/\d/.test(formatted[i])) {
          digitCount++;
          if (digitCount === digitsBeforeCursor) {
            newPosition = i + 1;
            break;
          }
        }
      }
    }
    
    return { value: formatted, cursorPosition: newPosition };
  }
  
  // If less than 10 digits, just return cleaned input
  return { value: currentDigits, cursorPosition: cursorPosition };
}
