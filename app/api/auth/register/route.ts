import { NextRequest } from "next/server";
import { getRow, runQuery, getRows } from "@/lib/db/index";
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
    // Parse request body
    let body: any;
    try {
      body = await request.json();
    } catch (parseError: any) {
      logger.error("JSON parse error:", parseError);
      throw new AppError("فرمت درخواست نامعتبر است", 400, "INVALID_JSON");
    }

    const { name, phone, password } = body || {};

    // بررسی وجود فیلدهای ضروری
    if (!name || typeof name !== "string" || name.trim() === "") {
      throw new AppError("نام الزامی است", 400, "MISSING_NAME");
    }

    if (!phone || typeof phone !== "string" || phone.trim() === "") {
      throw new AppError("شماره تماس الزامی است", 400, "MISSING_PHONE");
    }

    if (!password || typeof password !== "string" || password.trim() === "") {
      throw new AppError("رمز عبور الزامی است", 400, "MISSING_PASSWORD");
    }

    // اعتبارسنجی با Zod
    try {
      registerSchema.parse({ name: name.trim(), phone: phone.trim(), password });
    } catch (validationError: any) {
      const errors = validationError.errors || [];
      const firstError = errors[0];
      logger.warn("Validation error:", { errors, input: { name, phone: "***" } });
      throw new AppError(
        firstError?.message || "اطلاعات وارد شده معتبر نیست",
        400,
        "VALIDATION_ERROR",
        errors
      );
    }

    // اعتبارسنجی رمز عبور (اختیاری - فقط برای هشدار)
    const passwordValidation = validateStrongPassword(password);
    if (!passwordValidation.valid && passwordValidation.errors.length > 0) {
      // فقط هشدار می‌دهیم، اما ثبت‌نام را متوقف نمی‌کنیم
      logger.warn("Weak password detected:", passwordValidation.errors);
    }

    // نرمال‌سازی شماره تماس
    let normalizedPhone: string;
    try {
      normalizedPhone = normalizePhone(phone.trim());
      logger.info("Phone normalized:", { 
        original: phone, 
        normalized: normalizedPhone,
        originalLength: phone.length,
        normalizedLength: normalizedPhone.length
      });
    } catch (error: any) {
      logger.error("Phone normalization error:", { phone, error: error.message });
      throw new AppError(
        error.message || "شماره تماس معتبر نیست. فرمت صحیح: 09123456789",
        400,
        "INVALID_PHONE"
      );
    }

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
      logger.debug("Users table checked/created successfully");
    } catch (createError: any) {
      // Ignore table already exists errors
      if (
        createError?.code !== "ER_TABLE_EXISTS_ERROR" &&
        !createError?.message?.includes("already exists") &&
        !createError?.message?.includes("Duplicate table")
      ) {
        logger.error("Error creating users table:", {
          code: createError?.code,
          message: createError?.message,
          sqlState: createError?.sqlState,
        });
        throw new AppError("خطا در ایجاد جدول کاربران", 500, "TABLE_CREATION_ERROR");
      }
    }

    // Check if user with this phone already exists
    let existingUser: { id: string; phone: string } | null = null;
    try {
      // بررسی دقیق‌تر - فقط شماره‌های معتبر را چک کن
      // استفاده از BINARY برای case-sensitive comparison
      existingUser = await getRow<{ id: string; phone: string }>(
        "SELECT id, phone FROM users WHERE BINARY phone = ? AND phone IS NOT NULL AND phone != '' AND LENGTH(phone) = 11",
        [normalizedPhone]
      );
      
      logger.info("Duplicate check result:", {
        normalizedPhone,
        normalizedPhoneLength: normalizedPhone.length,
        found: !!existingUser,
        existingPhone: existingUser?.phone,
        existingPhoneLength: existingUser?.phone?.length,
        existingId: existingUser?.id
      });

      // اگر پیدا نشد، بررسی کن که آیا شماره‌های مشابه وجود دارد
      if (!existingUser) {
        try {
          const similarUsers = await getRows<{ id: string; phone: string }>(
            "SELECT id, phone FROM users WHERE phone LIKE ? AND phone IS NOT NULL AND phone != '' LIMIT 5",
            [`%${normalizedPhone.slice(-4)}%`]
          );
          
          if (similarUsers && similarUsers.length > 0) {
            logger.info("Similar phones found:", {
              normalizedPhone,
              similarPhones: similarUsers.map(u => u.phone)
            });
          }
        } catch (similarError: any) {
          // Ignore errors in similar phones check
          logger.debug("Error checking similar phones:", similarError.message);
        }
      }
    } catch (dbError: any) {
      logger.error("Error checking existing user:", {
        code: dbError?.code,
        message: dbError?.message,
        phone: normalizedPhone,
        sqlState: dbError?.sqlState,
        errno: dbError?.errno,
      });
      // اگر خطای دیتابیس بود، آن را throw کن
      if (
        dbError?.code === "ECONNREFUSED" ||
        dbError?.code === "ETIMEDOUT" ||
        dbError?.code === "ECONNRESET" ||
        dbError?.message?.includes("connect") ||
        dbError?.message?.includes("timeout")
      ) {
        throw new AppError("دیتابیس در دسترس نیست", 503, "DATABASE_NOT_AVAILABLE");
      }
      throw dbError;
    }

    if (existingUser) {
      logger.warn("Duplicate phone detected:", {
        normalizedPhone,
        existingUserId: existingUser.id,
        existingUserPhone: existingUser.phone,
        phonesMatch: existingUser.phone === normalizedPhone
      });
      throw new AppError("شماره تماس قبلاً ثبت شده است", 400, "DUPLICATE_PHONE");
    }

    // Hash password
    let hashedPassword: string;
    try {
      const saltRounds = 10;
      hashedPassword = await bcrypt.hash(password, saltRounds);
      logger.debug("Password hashed successfully");
    } catch (hashError: any) {
      logger.error("Password hashing error:", hashError);
      throw new AppError("خطا در پردازش رمز عبور", 500, "PASSWORD_HASH_ERROR");
    }

    // Generate user ID
    const id = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date().toISOString().slice(0, 19).replace("T", " ");

    // Insert user
    try {
      await runQuery(
        `INSERT INTO users (id, name, phone, password, role, enabled, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, 'user', TRUE, ?, ?)`,
        [id, name.trim(), normalizedPhone, hashedPassword, now, now]
      );
      logger.debug("User inserted successfully:", { id, phone: normalizedPhone });
    } catch (insertError: any) {
      logger.error("Error inserting user:", {
        code: insertError?.code,
        message: insertError?.message,
        sqlState: insertError?.sqlState,
        errno: insertError?.errno,
      });

      // بررسی خطاهای خاص
      if (insertError?.code === "ER_DUP_ENTRY" || insertError?.errno === 1062) {
        throw new AppError("شماره تماس قبلاً ثبت شده است", 400, "DUPLICATE_PHONE");
      }

      if (
        insertError?.code === "ECONNREFUSED" ||
        insertError?.code === "ETIMEDOUT" ||
        insertError?.code === "ECONNRESET" ||
        insertError?.message?.includes("connect") ||
        insertError?.message?.includes("timeout")
      ) {
        throw new AppError("دیتابیس در دسترس نیست", 503, "DATABASE_NOT_AVAILABLE");
      }

      throw new AppError(
        `خطا در ثبت کاربر: ${insertError?.message || "خطای نامشخص"}`,
        500,
        "USER_INSERT_ERROR"
      );
    }

    // Get created user (without password)
    let newUser: {
      id: string;
      name: string;
      phone: string;
      role: string;
      createdAt: string;
    } | null = null;

    try {
      newUser = await getRow<{
        id: string;
        name: string;
        phone: string;
        role: string;
        createdAt: string;
      }>(
        "SELECT id, name, phone, role, createdAt FROM users WHERE id = ?",
        [id]
      );
    } catch (selectError: any) {
      logger.error("Error selecting created user:", {
        code: selectError?.code,
        message: selectError?.message,
        id,
      });
      // اگر کاربر insert شده اما select نشد، خطا نیست - ممکن است کمی delay داشته باشد
      // اما برای اطمینان، خطا را throw می‌کنیم
      throw new AppError("خطا در دریافت اطلاعات کاربر", 500, "USER_SELECT_ERROR");
    }

    if (!newUser) {
      logger.error("User created but not found:", { id, phone: normalizedPhone });
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
    // Log کامل خطا برای debugging
    logger.error("POST /api/auth/register error:", {
      message: error?.message,
      code: error?.code,
      errno: error?.errno,
      sqlState: error?.sqlState,
      stack: process.env.NODE_ENV === "development" ? error?.stack : undefined,
    });
    
    // اگر AppError است، مستقیماً return کن
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
      error?.code === "PROTOCOL_CONNECTION_LOST" ||
      error?.message?.includes("connect") ||
      error?.message?.includes("timeout") ||
      error?.message?.includes("Connection lost")
    ) {
      return createErrorResponse(
        new AppError("دیتابیس در دسترس نیست. لطفاً دوباره تلاش کنید", 503, "DATABASE_NOT_AVAILABLE")
      );
    }

    // Handle validation errors
    if (error?.name === "ZodError" || error?.issues) {
      const firstError = error?.issues?.[0] || error?.errors?.[0];
      return createErrorResponse(
        new AppError(
          firstError?.message || "اطلاعات وارد شده معتبر نیست",
          400,
          "VALIDATION_ERROR"
        )
      );
    }

    // Handle other errors with proper message
    const errorMessage = error?.message || "خطا در ثبت‌نام. لطفاً دوباره تلاش کنید";
    return createErrorResponse(
      new AppError(
        errorMessage,
        500,
        "REGISTRATION_ERROR",
        process.env.NODE_ENV === "development" ? error : undefined
      )
    );
  }
}
