/**
 * Type-narrowing helpers to reduce @typescript-eslint/no-unnecessary-condition warnings
 * while maintaining runtime safety
 */

/**
 * Type guard to check if a value is present (not null or undefined)
 */
export function isPresent<T>(v: T | null | undefined): v is T {
  return v != null;
}

/**
 * Type guard to check if a string is non-empty
 */
export function isNonEmptyString(s: string | null | undefined): s is string {
  return typeof s === 'string' && s.length > 0;
}

/**
 * Type guard to check if an array is non-empty
 */
export function isNonEmptyArray<T>(arr: T[] | null | undefined): arr is T[] {
  return Array.isArray(arr) && arr.length > 0;
}

/**
 * Exhaustiveness check for switch statements
 * Throws at compile time if not all cases are handled
 */
export function assertNever(x: never, msg = 'Unexpected branch'): never {
  throw new Error(`${msg}: ${String(x)}`);
}

/**
 * Safe property access with type narrowing
 * Returns undefined if the object or property is null/undefined
 */
export function safeGet<T, K extends keyof T>(
  obj: T | null | undefined,
  key: K
): T[K] | undefined {
  return obj?.[key];
}

/**
 * Safe array access with bounds checking
 */
export function safeArrayGet<T>(arr: T[] | null | undefined, index: number): T | undefined {
  return arr?.[index];
}
