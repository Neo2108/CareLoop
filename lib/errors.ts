/**
 * Custom error classes for consistent error handling across the application.
 * Use these to throw errors that can be mapped to appropriate HTTP responses.
 */

export class AppError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode: number = 500
  ) {
    super(message);
    this.name = "AppError";
  }
}

export class ValidationError extends AppError {
  constructor(message: string, public readonly details?: unknown) {
    super(message, "VALIDATION_ERROR", 400);
    this.name = "ValidationError";
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = "Resource not found") {
    super(message, "NOT_FOUND", 404);
    this.name = "NotFoundError";
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = "Unauthorized") {
    super(message, "UNAUTHORIZED", 401);
    this.name = "UnauthorizedError";
  }
}

/**
 * Standard API error response shape.
 */
export interface ApiErrorResponse {
  error: string;
  code?: string;
  details?: unknown;
}

/**
 * Converts an error to a standard API response.
 * Avoids leaking internal details in production.
 */
export function toApiError(error: unknown): ApiErrorResponse {
  if (error instanceof AppError) {
    const response: ApiErrorResponse = {
      error: error.message,
      code: error.code,
    };
    if (error instanceof ValidationError && error.details) {
      response.details = error.details;
    }
    return response;
  }
  if (error instanceof Error) {
    return {
      error: process.env.NODE_ENV === "production" ? "Internal server error" : error.message,
      code: "INTERNAL_ERROR",
    };
  }
  return {
    error: "Internal server error",
    code: "INTERNAL_ERROR",
  };
}
