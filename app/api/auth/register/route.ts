import { NextRequest } from "next/server";
import { getRow, runQuery } from "@/lib/db/index";
import { createErrorResponse, createSuccessResponse } from "@/lib/api-route-helpers";
import { AppError } from "@/lib/api-error-handler";
import { logger } from "@/lib/logger";
import bcrypt from "bcryptjs";
import { registerSchema, normalizePhone, validateStrongPassword } from "@/lib/validations/auth";

/**
 * POST /api/auth/register - Register new user
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => {
      throw new AppError("Invalid JSON in request body", 400, "INVALID_JSON");
    });

    const { name, phone, password } = body;

    // اعتبارسنجی با Zod
    try {
      registerSchema.parse({ name, phone, password });
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

    // اعتبارسنجی رمز عبور قوی
    const passwordValidation = validateStrongPassword(password);
    if (!passwordValidation.valid) {
      throw new AppError(
        passwordValidation.errors.join(". ") || "رمز عبور ضعیف است",
        400,
        "WEAK_PASSWORD",
        passwordValidation.errors
      );
    }

    // نرمال‌سازی شماره تماس
    const normalizedPhone = normalizePhone(phone);

    // Ensure users table exists
    try {
      await runQuery(`
        CREATE TABLE IF NOT EXISTS users (
          id VARCHAR(255) PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          phone VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          role VARCHAR(50) NOT NULL DEFAULT 'user',
          enabled BOOLEAN DEFAULT TRUE,
          createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
      `);
    } catch (createError: any) {
      if (createError?.code !== "ER_TABLE_EXISTS_ERROR" && !createError?.message?.includes("already exists")) {
        logger.error("Error creating users table:", createError);
        throw new AppError("خطا در ایجاد جدول کاربران", 500, "TABLE_CREATION_ERROR");
      }
    }

    // Check if user with this phone already exists
    const existingUser = await getRow<{ id: string }>(
      "SELECT id FROM users WHERE phone = ?",
      [normalizedPhone]
    );

    if (existingUser) {
      throw new AppError("شماره تماس قبلاً ثبت شده است", 400, "DUPLICATE_PHONE");
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Generate user ID
    const id = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date().toISOString().slice(0, 19).replace("T", " ");

    // Insert user
    await runQuery(
      `INSERT INTO users (id, name, phone, password, role, enabled, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, 'user', TRUE, ?, ?)`,
      [id, name.trim(), normalizedPhone, hashedPassword, now, now]
    );

    // Get created user (without password)
    const newUser = await getRow<{
      id: string;
      name: string;
      phone: string;
      role: string;
      createdAt: string;
    }>(
      "SELECT id, name, phone, role, createdAt FROM users WHERE id = ?",
      [id]
    );

    if (!newUser) {
      throw new AppError("خطا در ایجاد کاربر", 500, "USER_CREATION_ERROR");
    }

    logger.info("User registered successfully:", { id, phone: phone.trim() });

    return createSuccessResponse({
      user: {
        id: newUser.id,
        name: newUser.name,
        phone: newUser.phone,
        createdAt: newUser.createdAt,
      },
      message: "ثبت‌نام با موفقیت انجام شد",
    });
  } catch (error: any) {
    logger.error("POST /api/auth/register error:", error);
    
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
    const errorMessage = error?.message || "خطا در ثبت‌نام";
    return createErrorResponse(
      new AppError(errorMessage, 500, "REGISTRATION_ERROR")
    );
  }
}
