/**
 * Centralized Error Handler
 * Provides consistent error handling and logging across the application
 */

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
  details?: unknown;
}

export class AppError extends Error {
  status?: number;
  code?: string;
  details?: unknown;

  constructor(message: string, status?: number, code?: string, details?: unknown) {
    super(message);
    this.name = "AppError";
    this.status = status;
    this.code = code;
    this.details = details;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

/**
 * Network error types
 */
export enum NetworkErrorType {
  TIMEOUT = "TIMEOUT",
  NETWORK = "NETWORK",
  ABORTED = "ABORTED",
  UNKNOWN = "UNKNOWN",
}

export class NetworkError extends Error {
  type: NetworkErrorType;
  originalError?: Error;

  constructor(
    message: string,
    type: NetworkErrorType = NetworkErrorType.UNKNOWN,
    originalError?: Error
  ) {
    super(message);
    this.name = "NetworkError";
    this.type = type;
    this.originalError = originalError;
    Object.setPrototypeOf(this, NetworkError.prototype);
  }
}

/**
 * Import centralized logger
 */
import { logger } from "@/lib/logger";

/**
 * Parse error from various sources
 */
export function parseError(error: unknown): ApiError {
  if (error instanceof AppError) {
    return {
      message: error.message,
      status: error.status,
      code: error.code,
      details: error.details,
    };
  }

  if (error instanceof NetworkError) {
    return {
      message: error.message,
      code: error.type,
      details: error.originalError,
    };
  }

  if (error instanceof Error) {
    return {
      message: error.message,
    };
  }

  if (typeof error === "string") {
    return {
      message: error,
    };
  }

  return {
    message: "خطای نامشخص رخ داد",
  };
}

/**
 * Get user-friendly error message
 */
export function getUserFriendlyMessage(error: unknown): string {
  const parsed = parseError(error);

  // Network errors
  if (parsed.code === NetworkErrorType.TIMEOUT) {
    return "درخواست شما به دلیل طولانی شدن زمان پاسخ لغو شد. لطفاً دوباره تلاش کنید.";
  }

  if (parsed.code === NetworkErrorType.NETWORK) {
    return "خطا در ارتباط با سرور. لطفاً اتصال اینترنت خود را بررسی کنید.";
  }

  if (parsed.code === NetworkErrorType.ABORTED) {
    return "درخواست لغو شد.";
  }

  // HTTP status codes
  if (parsed.status) {
    switch (parsed.status) {
      case 400:
        return parsed.message || "درخواست نامعتبر است.";
      case 401:
        return "لطفاً دوباره وارد شوید.";
      case 403:
        return "شما دسترسی به این منبع ندارید.";
      case 404:
        return "منبع مورد نظر یافت نشد.";
      case 429:
        return "تعداد درخواست‌های شما بیش از حد مجاز است. لطفاً کمی صبر کنید.";
      case 500:
        return "خطای سرور. لطفاً بعداً تلاش کنید.";
      case 502:
      case 503:
      case 504:
        return "سرور در دسترس نیست. لطفاً بعداً تلاش کنید.";
      default:
        return parsed.message || "خطایی رخ داد.";
    }
  }

  return parsed.message || "خطای نامشخص رخ داد.";
}

/**
 * Log error (only in development)
 */
export function logError(error: unknown, context?: string): void {
  const parsed = parseError(error);
  const contextMsg = context ? `[${context}] ` : "";
  
  logger.error(`${contextMsg}${parsed.message}`, {
    status: parsed.status,
    code: parsed.code,
    details: parsed.details,
  });
}
