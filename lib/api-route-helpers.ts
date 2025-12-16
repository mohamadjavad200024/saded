/**
 * API Route Helpers
 * Provides standardized error handling and response formatting for API routes
 */

import { NextResponse } from "next/server";
import { logError, AppError } from "./api-error-handler";

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

  // Handle AppError specifically (most common case)
  if (error instanceof AppError) {
    message = error.message;
    status = error.status || defaultStatus;
    code = error.code;
    details = error.details;
  } else if (error instanceof Error) {
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
    if ("code" in error && typeof error.code === "string") {
      code = error.code as string;
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

