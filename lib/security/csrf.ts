import { NextRequest, NextResponse } from "next/server";
import { AppError } from "@/lib/api-error-handler";
import crypto from "crypto";

/**
 * CSRF token generation and validation
 */

const CSRF_TOKEN_LENGTH = 32;
const CSRF_TOKEN_EXPIRY = 60 * 60 * 1000; // 1 hour

/**
 * Generate a CSRF token
 */
export function generateCsrfToken(): string {
  return crypto.randomBytes(CSRF_TOKEN_LENGTH).toString("hex");
}

/**
 * Validate CSRF token
 */
export function validateCsrfToken(
  request: NextRequest,
  token?: string
): boolean {
  // Skip CSRF validation for GET, HEAD, OPTIONS requests
  if (["GET", "HEAD", "OPTIONS"].includes(request.method)) {
    return true;
  }

  // Get token from header or body
  const requestToken =
    token ||
    request.headers.get("x-csrf-token") ||
    request.headers.get("csrf-token");

  if (!requestToken) {
    return false;
  }

  // Get token from cookie
  const cookieToken = request.cookies.get("csrf-token")?.value;

  if (!cookieToken) {
    return false;
  }

  // Compare tokens (constant-time comparison to prevent timing attacks)
  return crypto.timingSafeEqual(
    Buffer.from(requestToken),
    Buffer.from(cookieToken)
  );
}

/**
 * Middleware to require CSRF token for state-changing operations
 */
export function requireCsrfToken(request: NextRequest): void {
  if (!validateCsrfToken(request)) {
    throw new AppError(
      "CSRF token validation failed",
      403,
      "CSRF_TOKEN_INVALID"
    );
  }
}

/**
 * Set CSRF token in response cookie
 */
export function setCsrfTokenCookie(response: NextResponse): NextResponse {
  const token = generateCsrfToken();
  response.cookies.set("csrf-token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: CSRF_TOKEN_EXPIRY / 1000,
    path: "/",
  });
  return response;
}

