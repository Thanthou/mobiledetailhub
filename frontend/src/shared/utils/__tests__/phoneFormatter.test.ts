/**
 * Phone Formatter Test Examples
 * This file demonstrates how the phone formatter works with various inputs
 */

import { env } from '@/shared/env';

import { formatPhoneNumber, getPhoneDigits, isCompletePhoneNumber } from '../phoneFormatter';

// Test examples - you can run these in the browser console to see how they work
export const testExamples = [
  // Various input formats
  { input: '1234567890', expected: '(123) 456-7890' },
  { input: '123-456-7890', expected: '(123) 456-7890' },
  { input: '123.456.7890', expected: '(123) 456-7890' },
  { input: '123 456 7890', expected: '(123) 456-7890' },
  { input: '(123) 456-7890', expected: '(123) 456-7890' },
  
  // With country code
  { input: '11234567890', expected: '(123) 456-7890' },
  { input: '1-123-456-7890', expected: '(123) 456-7890' },
  
  // Incomplete numbers
  { input: '123', expected: '123' },
  { input: '123456', expected: '123456' },
  { input: '123456789', expected: '123456789' },
  
  // Edge cases
  { input: '', expected: '' },
  { input: 'abc123def456ghi7890', expected: '(123) 456-7890' },
  { input: '1-800-FLOWERS', expected: '1800' }, // Only digits are extracted
];

// Function to run all tests
export function runPhoneFormatterTests() {
  if (env.DEV) {
    // Running Phone Formatter Tests
  }
  
  testExamples.forEach(({ input, expected }, index) => {
    const result = formatPhoneNumber(input);
    const isComplete = isCompletePhoneNumber(input);
    const digits = getPhoneDigits(input);
    
    if (env.DEV) {
      // eslint-disable-next-line no-console -- Debug output for manual test execution
      console.log(`Test ${(index + 1).toString()}:`, {
        input,
        expected,
        result,
        isComplete,
        digits,
        passed: result === expected
      });
    }
  });
  
  if (env.DEV) {
    // Test Complete
  }
}

// Example usage in console:
// import { runPhoneFormatterTests } from './phoneFormatter.test';
// runPhoneFormatterTests();
