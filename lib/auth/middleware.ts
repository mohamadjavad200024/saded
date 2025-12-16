import { NextRequest, NextResponse } from "next/server";
import { AppError } from "@/lib/api-error-handler";

/**
 * استخراج اطلاعات کاربر از header یا body
 * در این سیستم، userId از header 'x-user-id' یا از body استخراج می‌شود
 */
export function getUserIdFromRequest(request: NextRequest): string | null {
  // اول از header تلاش کن
  const userIdFromHeader = request.headers.get("x-user-id");
  if (userIdFromHeader) {
    return userIdFromHeader;
  }
  
  // اگر در body است، از body بخوان (برای POST requests)
  // توجه: این فقط برای API routes است که body را parse می‌کنند
  return null;
}

/**
 * Middleware برای احراز هویت
 * بررسی می‌کند که کاربر لاگین شده است یا نه
 */
export async function requireAuth(request: NextRequest): Promise<{
  userId: string;
  userRole?: string;
}> {
  const userId = getUserIdFromRequest(request);
  
  if (!userId || userId === "guest" || userId.trim() === "") {
    throw new AppError("برای دسترسی به این بخش باید وارد حساب کاربری خود شوید", 401, "UNAUTHORIZED");
  }
  
  // در اینجا می‌توانید بررسی کنید که کاربر در دیتابیس وجود دارد و فعال است
  // برای حال حاضر، فقط userId را برمی‌گردانیم
  
  return {
    userId: userId.trim(),
  };
}

/**
 * Middleware برای بررسی نقش کاربر (Admin)
 */
export async function requireAdmin(request: NextRequest): Promise<{
  userId: string;
  userRole: string;
}> {
  const auth = await requireAuth(request);
  
  // در اینجا باید از دیتابیس نقش کاربر را بررسی کنید
  // برای حال حاضر، فرض می‌کنیم که role در header ارسال می‌شود
  const userRole = request.headers.get("x-user-role") || "user";
  
  if (userRole !== "admin") {
    throw new AppError("شما دسترسی به این بخش را ندارید", 403, "FORBIDDEN");
  }
  
  return {
    userId: auth.userId,
    userRole,
  };
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

