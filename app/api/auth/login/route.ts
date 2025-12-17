import { NextRequest } from "next/server";
import { getRow } from "@/lib/db/index";
import { createErrorResponse, createSuccessResponse } from "@/lib/api-route-helpers";
import { AppError } from "@/lib/api-error-handler";
import { logger } from "@/lib/logger";
import bcrypt from "bcryptjs";
import { loginSchema, normalizePhone } from "@/lib/validations/auth";
import { createSession, ensureAuthTables, setSessionCookie } from "@/lib/auth/session";

/**
 * POST /api/auth/login - Login user
 */
export async function POST(request: NextRequest) {
  try {
    await ensureAuthTables();
    const body = await request.json().catch(() => {
      throw new AppError("Invalid JSON in request body", 400, "INVALID_JSON");
    });

    const { phone, password } = body;

    // اعتبارسنجی با Zod
    try {
      loginSchema.parse({ phone, password });
    } catch (validationError: any) {
      const errors = validationError.errors || [];
      const firstError = errors[0];
      throw new AppError(
        firstError?.message || "اطلاعات وارد شده معتبر نیست",
        400,
        "VALIDATION_ERROR",
        errors
      );
    }

    // نرمال‌سازی شماره تماس
    let normalizedPhone: string;
    try {
      normalizedPhone = normalizePhone(phone.trim());
      logger.info("Login - Phone normalized:", {
        original: phone,
        normalized: normalizedPhone,
        originalLength: phone.length,
        normalizedLength: normalizedPhone.length
      });
    } catch (error: any) {
      logger.error("Login - Phone normalization error:", { phone, error: error.message });
      throw new AppError(
        error.message || "شماره تماس معتبر نیست. فرمت صحیح: 09123456789",
        400,
        "INVALID_PHONE"
      );
    }

    // Get user from database - استفاده از BINARY برای case-sensitive comparison
    const user = await getRow<{
      id: string;
      name: string;
      phone: string;
      password: string;
      role: string;
      enabled: boolean;
      createdAt: string;
    }>(
      "SELECT id, name, phone, password, role, enabled, createdAt FROM users WHERE BINARY phone = ? AND phone IS NOT NULL AND phone != '' AND LENGTH(phone) = 11",
      [normalizedPhone]
    );

    logger.info("Login - User lookup result:", {
      normalizedPhone,
      found: !!user,
      userId: user?.id,
      userPhone: user?.phone,
      userPhoneLength: user?.phone?.length
    });

    if (!user) {
      throw new AppError("شماره تماس یا رمز عبور اشتباه است", 401, "INVALID_CREDENTIALS");
    }

    // Check if user is enabled
    if (!user.enabled) {
      throw new AppError("حساب کاربری شما غیرفعال است", 403, "USER_DISABLED");
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new AppError("شماره تماس یا رمز عبور اشتباه است", 401, "INVALID_CREDENTIALS");
    }

    logger.info("User logged in successfully:", { id: user.id, phone: user.phone });

    const sessionToken = await createSession(user.id, request);

    // Return user without password
    const res = createSuccessResponse({
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        role: user.role,
        createdAt: user.createdAt,
      },
      message: "ورود موفق",
    });
    setSessionCookie(res, sessionToken, request);
    return res;
  } catch (error: any) {
    logger.error("POST /api/auth/login error:", error);
    
    if (error instanceof AppError) {
      return createErrorResponse(error);
    }

    // Handle database connection errors
    if (
      error?.message?.includes("not available") ||
      error?.code === "DATABASE_NOT_AVAILABLE" ||
      error?.code === "ECONNREFUSED" ||
      error?.code === "ETIMEDOUT" ||
      error?.code === "ECONNRESET" ||
      error?.message?.includes("connect") ||
      error?.message?.includes("timeout")
    ) {
      return createErrorResponse(
        new AppError("دیتابیس در دسترس نیست", 503, "DATABASE_NOT_AVAILABLE")
      );
    }

    // Handle other errors with proper message
    const errorMessage = error?.message || "خطا در ورود";
    return createErrorResponse(
      new AppError(errorMessage, 500, "LOGIN_ERROR")
    );
  }
}
