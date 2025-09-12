// Custom error classes for API operations
export class ApiError extends Error {
  public readonly code: string;
  public readonly status?: number;
  public readonly retryAfterSeconds?: number;
  public readonly remainingAttempts?: number;
  public readonly resetTime?: number;

  constructor(
    message: string,
    code: string,
    status?: number,
    retryAfterSeconds?: number,
    remainingAttempts?: number,
    resetTime?: number
  ) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
    this.retryAfterSeconds = retryAfterSeconds;
    this.remainingAttempts = remainingAttempts;
    this.resetTime = resetTime;
  }
}

// Specific error types
export class NetworkError extends ApiError {
  constructor(message: string = 'Network error occurred') {
    super(message, 'NETWORK_ERROR');
    this.name = 'NetworkError';
  }
}

export class TimeoutError extends ApiError {
  constructor(message: string = 'Request timed out') {
    super(message, 'TIMEOUT');
    this.name = 'TimeoutError';
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message: string = 'Unauthorized access') {
    super(message, 'UNAUTHORIZED', 401);
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends ApiError {
  constructor(message: string = 'Access forbidden') {
    super(message, 'FORBIDDEN', 403);
    this.name = 'ForbiddenError';
  }
}

export class NotFoundError extends ApiError {
  constructor(message: string = 'Resource not found') {
    super(message, 'NOT_FOUND', 404);
    this.name = 'NotFoundError';
  }
}

export class ValidationError extends ApiError {
  constructor(message: string = 'Validation failed') {
    super(message, 'VALIDATION_ERROR', 400);
    this.name = 'ValidationError';
  }
}

export class RateLimitError extends ApiError {
  constructor(
    message: string = 'Rate limit exceeded',
    retryAfterSeconds?: number,
    remainingAttempts?: number,
    resetTime?: number
  ) {
    super(message, 'RATE_LIMITED', 429, retryAfterSeconds, remainingAttempts, resetTime);
    this.name = 'RateLimitError';
  }
}

export class ServerError extends ApiError {
  constructor(message: string = 'Internal server error', status: number = 500) {
    super(message, 'SERVER_ERROR', status);
    this.name = 'ServerError';
  }
}

// Error factory function
export const createApiError = (
  error: unknown,
  defaultMessage: string = 'An error occurred'
): ApiError => {
  if (error instanceof ApiError) {
    return error;
  }

  if (error instanceof Error) {
    // Check for specific error patterns
    if (error.name === 'AbortError') {
      return new TimeoutError('Request was aborted');
    }

    if (error.message.includes('fetch')) {
      return new NetworkError('Network request failed');
    }

    if (error.message.includes('timeout')) {
      return new TimeoutError('Request timed out');
    }

    // Check for HTTP status codes in error message
    const statusMatch = error.message.match(/(\d{3})/);
    if (statusMatch) {
      const status = parseInt(statusMatch[1], 10);
      switch (status) {
        case 401:
          return new UnauthorizedError(error.message);
        case 403:
          return new ForbiddenError(error.message);
        case 404:
          return new NotFoundError(error.message);
        case 429:
          return new RateLimitError(error.message);
        case 400:
          return new ValidationError(error.message);
        case 500:
        case 502:
        case 503:
        case 504:
          return new ServerError(error.message, status);
        default:
          return new ApiError(error.message, 'HTTP_ERROR', status);
      }
    }

    return new ApiError(error.message, 'UNKNOWN_ERROR');
  }

  return new ApiError(defaultMessage, 'UNKNOWN_ERROR');
};

// Error handler utility
export const handleApiError = (error: unknown): ApiError => {
  const apiError = createApiError(error);
  
  // Log error for debugging
  console.error('API Error:', {
    name: apiError.name,
    message: apiError.message,
    code: apiError.code,
    status: apiError.status,
    retryAfterSeconds: apiError.retryAfterSeconds,
    remainingAttempts: apiError.remainingAttempts,
    resetTime: apiError.resetTime,
  });

  return apiError;
};

// Error type guards
export const isApiError = (error: unknown): error is ApiError => {
  return error instanceof ApiError;
};

export const isNetworkError = (error: unknown): error is NetworkError => {
  return error instanceof NetworkError;
};

export const isTimeoutError = (error: unknown): error is TimeoutError => {
  return error instanceof TimeoutError;
};

export const isUnauthorizedError = (error: unknown): error is UnauthorizedError => {
  return error instanceof UnauthorizedError;
};

export const isForbiddenError = (error: unknown): error is ForbiddenError => {
  return error instanceof ForbiddenError;
};

export const isNotFoundError = (error: unknown): error is NotFoundError => {
  return error instanceof NotFoundError;
};

export const isValidationError = (error: unknown): error is ValidationError => {
  return error instanceof ValidationError;
};

export const isRateLimitError = (error: unknown): error is RateLimitError => {
  return error instanceof RateLimitError;
};

export const isServerError = (error: unknown): error is ServerError => {
  return error instanceof ServerError;
};
