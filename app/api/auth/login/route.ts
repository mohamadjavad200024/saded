import { NextRequest } from "next/server";
import { getRow } from "@/lib/db/index";
import { createErrorResponse, createSuccessResponse } from "@/lib/api-route-helpers";
import { AppError } from "@/lib/api-error-handler";
import { logger } from "@/lib/logger";
import bcrypt from "bcryptjs";

/**
 * POST /api/auth/login - Login user
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => {
      throw new AppError("Invalid JSON in request body", 400, "INVALID_JSON");
    });

    const { phone, password } = body;

    // Validation
    if (!phone || typeof phone !== "string" || phone.trim() === "") {
      throw new AppError("شماره تماس الزامی است", 400, "MISSING_PHONE");
    }

    if (!password || typeof password !== "string") {
      throw new AppError("رمز عبور الزامی است", 400, "MISSING_PASSWORD");
    }

    // Get user from database
    const user = await getRow<{
      id: string;
      name: string;
      phone: string;
      password: string;
      role: string;
      enabled: boolean;
      createdAt: string;
    }>(
      "SELECT id, name, phone, password, role, enabled, createdAt FROM users WHERE phone = ?",
      [phone.trim()]
    );

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

    // Return user without password
    return createSuccessResponse({
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        role: user.role,
        createdAt: user.createdAt,
      },
      message: "ورود موفق",
    });
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
