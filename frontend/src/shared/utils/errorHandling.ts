/**
 * Safe Error Handling Utilities
 * 
 * TypeScript-safe error message extraction from unknown errors.
 */

/**
 * Safely extract an error message from an unknown error
 * @param error - Unknown error from catch block
 * @returns Safe error message string
 */
export function safeErrorMessage(error: unknown): string {
  if (typeof error === 'string') {
    return error;
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  if (typeof error === 'object' && error !== null) {
    // Check for message property
    const errorObj = error as { message?: unknown };
    if (typeof errorObj.message === 'string') {
      return errorObj.message;
    }
  }
  
  return 'An unexpected error occurred';
}

/**
 * Safely extract the first validation error from a Zod-like error object
 * @param error - Validation error object
 * @returns First error message or default
 */
export function safeValidationMessage(error: unknown): string {
  if (typeof error === 'object' && error !== null) {
    const errorObj = error as { errors?: unknown[] };
    if (Array.isArray(errorObj.errors) && errorObj.errors.length > 0) {
      const firstError = errorObj.errors[0];
      if (typeof firstError === 'object' && firstError !== null) {
        const err = firstError as { message?: unknown };
        if (typeof err.message === 'string') {
          return err.message;
        }
      }
    }
  }
  return safeErrorMessage(error);
}

