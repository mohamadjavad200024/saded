import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AppError } from "./api-error-handler";
import { logger } from "./logger";
import { setSecurityHeaders } from "./security/headers";

/**
 * Enhanced error handler with structured logging
 */
export function handleApiError(
  error: unknown,
  context?: string
): NextResponse {
  const contextMsg = context ? `[${context}] ` : "";

  // Handle AppError
  if (error instanceof AppError) {
    // Log error with context
    logger.error(`${contextMsg}${error.message}`, {
      status: error.status,
      code: error.code,
      details: error.details,
      stack: error.stack,
    });

    const response = NextResponse.json(
      {
        success: false,
        error: error.message,
        code: error.code,
        ...(process.env.NODE_ENV === "development" && error.details
          ? { details: error.details }
          : {}),
      },
      { status: error.status || 500 }
    );

    return setSecurityHeaders(response);
  }

  // Handle generic Error
  if (error instanceof Error) {
    logger.error(`${contextMsg}${error.message}`, {
      name: error.name,
      stack: error.stack,
    });

    const response = NextResponse.json(
      {
        success: false,
        error:
          process.env.NODE_ENV === "production"
            ? "خطای سرور"
            : error.message,
        ...(process.env.NODE_ENV === "development"
          ? { stack: error.stack }
          : {}),
      },
      { status: 500 }
    );

    return setSecurityHeaders(response);
  }

  // Handle unknown error
  logger.error(`${contextMsg}Unknown error`, { error });
  const response = NextResponse.json(
    {
      success: false,
      error: "خطای نامشخص رخ داد",
    },
    { status: 500 }
  );

  return setSecurityHeaders(response);
}

/**
 * Async error wrapper for API routes
 */
export function withErrorHandling<T extends any[]>(
  handler: (...args: T) => Promise<NextResponse>,
  context?: string
) {
  return async (...args: T): Promise<NextResponse> => {
    try {
      return await handler(...args);
    } catch (error) {
      return handleApiError(error, context);
    }
  };
}

