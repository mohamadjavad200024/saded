import { NextRequest, NextResponse } from "next/server";
import { AppError } from "@/lib/api-error-handler";
import { getSessionUserFromRequest } from "@/lib/auth/session";

/**
 * Middleware برای احراز هویت
 * بررسی می‌کند که کاربر لاگین شده است یا نه
 */
export async function requireAuth(request: NextRequest): Promise<{
  userId: string;
  userRole: string;
}> {
  const sessionUser = await getSessionUserFromRequest(request);
  if (sessionUser && sessionUser.enabled) {
    return { userId: sessionUser.id, userRole: sessionUser.role || "user" };
  }

  throw new AppError("برای دسترسی به این بخش باید وارد حساب کاربری خود شوید", 401, "UNAUTHORIZED");
}

/**
 * Middleware برای بررسی نقش کاربر (Admin)
 */
export async function requireAdmin(request: NextRequest): Promise<{
  userId: string;
  userRole: string;
}> {
  const auth = await requireAuth(request);
  if (auth.userRole !== "admin") {
    throw new AppError("شما دسترسی به این بخش را ندارید", 403, "FORBIDDEN");
  }
  return auth;
}

/**
 * Helper برای ایجاد response خطای احراز هویت
 */
export function createUnauthorizedResponse(message?: string): NextResponse {
  return NextResponse.json(
    {
      success: false,
      error: message || "برای دسترسی به این بخش باید وارد حساب کاربری خود شوید",
      code: "UNAUTHORIZED",
    },
    { status: 401 }
  );
}

/**
 * Helper برای ایجاد response خطای دسترسی
 */
export function createForbiddenResponse(message?: string): NextResponse {
  return NextResponse.json(
    {
      success: false,
      error: message || "شما دسترسی به این بخش را ندارید",
      code: "FORBIDDEN",
    },
    { status: 403 }
  );
}

