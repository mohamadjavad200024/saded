/**
 * API Route Helpers
 * Provides standardized error handling and response formatting for API routes
 */

import { NextResponse } from "next/server";
import { logError } from "./api-error-handler";

export interface ApiRouteError {
  message: string;
  status?: number;
  code?: string;
  details?: unknown;
}

/**
 * Create standardized error response
 */
export function createErrorResponse(
  error: unknown,
  defaultStatus: number = 500
): NextResponse {
  let message = "خطای سرور";
  let status = defaultStatus;
  let code: string | undefined;
  let details: unknown;

  if (error instanceof Error) {
    message = error.message;
    if ("status" in error && typeof error.status === "number") {
      status = error.status;
    }
    if ("code" in error && typeof error.code === "string") {
      code = error.code;
    }
    if ("details" in error) {
      details = error.details;
    }
  } else if (typeof error === "string") {
    message = error;
  } else if (error && typeof error === "object" && "message" in error) {
    message = String(error.message);
    if ("status" in error && typeof error.status === "number") {
      status = error.status;
    }
  }

  // Log error in development
  logError(error, "API Route");

  return NextResponse.json(
    {
      success: false,
      error: message,
      ...(code ? { code } : {}),
      ...(process.env.NODE_ENV === "development" && details ? { details } : {}),
    },
    { status }
  );
}

/**
 * Create standardized success response
 */
export function createSuccessResponse<T>(
  data: T,
  status: number = 200,
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  }
): NextResponse {
  return NextResponse.json(
    {
      success: true,
      data,
      ...(pagination && { pagination }),
    },
    { status }
  );
}

/**
 * Wrap route handler with error handling
 */
export function withErrorHandling(
  handler: (request: Request, context?: any) => Promise<NextResponse>
) {
  return async (request: Request, context?: any): Promise<NextResponse> => {
    try {
      return await handler(request, context);
    } catch (error) {
      return createErrorResponse(error);
    }
  };
}

/**
 * Validate request body
 */
export function validateRequestBody<T>(
  body: unknown,
  validator?: (data: unknown) => data is T
): T {
  if (!body) {
    throw new Error("Request body is required");
  }

  if (validator && !validator(body)) {
    throw new Error("Invalid request body");
  }

  return body as T;
}

/**
 * Safely parse JSON field from database
 * MySQL JSON fields can be objects, strings, or null
 */
export function safeParseJSON<T = any>(value: unknown, defaultValue: T): T {
  if (value === null || value === undefined) {
    return defaultValue;
  }
  
  if (Array.isArray(value) || (typeof value === 'object' && value !== null && !(value instanceof Date))) {
    return value as T;
  }
  
  if (typeof value === 'string') {
    try {
      return JSON.parse(value) as T;
    } catch {
      return defaultValue;
    }
  }
  
  return defaultValue;
}

/**
 * Safely parse number from database
 */
export function safeParseNumber(value: unknown, defaultValue: number = 0): number {
  if (value === null || value === undefined) {
    return defaultValue;
  }
  
  const num = Number(value);
  return isNaN(num) ? defaultValue : num;
}

/**
 * Safely parse date from database
 */
export function safeParseDate(value: unknown): Date {
  if (value instanceof Date) {
    return value;
  }
  
  if (typeof value === 'string' || typeof value === 'number') {
    const date = new Date(value);
    return isNaN(date.getTime()) ? new Date() : date;
  }
  
  return new Date();
}

