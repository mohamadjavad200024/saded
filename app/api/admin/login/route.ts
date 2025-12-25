import { NextRequest, NextResponse } from "next/server";
import { createErrorResponse, createSuccessResponse } from "@/lib/api-route-helpers";
import { AppError } from "@/lib/api-error-handler";
import { getSessionUserFromRequest, createSession, setSessionCookie } from "@/lib/auth/session";
import { getRow, runQuery } from "@/lib/db/index";
import { logger } from "@/lib/logger";

// #region agent log
fetch('http://127.0.0.1:7242/ingest/6e2493c0-cc8b-4c0b-9456-c04638b7e615',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/api/admin/login/route.ts:13',message:'Route file loaded',data:{timestamp:Date.now()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
// #endregion

const DEFAULT_ADMIN_PASSWORD = "12345678910";

/**
 * POST /api/admin/login - Admin login with password only
 */
export async function POST(request: NextRequest) {
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/6e2493c0-cc8b-4c0b-9456-c04638b7e615',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/api/admin/login/route.ts:17',message:'POST handler called',data:{url:request.url,method:request.method},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
  // #endregion
  try {
    const body = await request.json().catch(() => {
      throw new AppError("Invalid JSON in request body", 400, "INVALID_JSON");
    });

    const { password } = body;

    if (!password) {
      throw new AppError("رمز عبور الزامی است", 400, "MISSING_PASSWORD");
    }

    // Ensure admin_settings table exists
    try {
      await runQuery(`
        CREATE TABLE IF NOT EXISTS admin_settings (
          id VARCHAR(255) PRIMARY KEY DEFAULT 'admin_password',
          \`key\` VARCHAR(255) UNIQUE NOT NULL,
          \`value\` TEXT NOT NULL,
          \`createdAt\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          \`updatedAt\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);
    } catch (error: any) {
      logger.warn("Error ensuring admin_settings table:", error?.message);
    }

    // Get password from database
    let passwordSetting = await getRow<{
      key: string;
      value: string;
    }>(
      "SELECT `key`, `value` FROM admin_settings WHERE `key` = 'admin_password' LIMIT 1"
    );

    // If not found, use default and save it
    const adminPassword = passwordSetting?.value || DEFAULT_ADMIN_PASSWORD;
    if (!passwordSetting) {
      await runQuery(
        `INSERT INTO admin_settings (\`key\`, \`value\`) VALUES ('admin_password', ?)
         ON DUPLICATE KEY UPDATE \`value\` = ?`,
        [DEFAULT_ADMIN_PASSWORD, DEFAULT_ADMIN_PASSWORD]
      );
    }

    // Check password
    if (password !== adminPassword) {
      logger.warn("Admin login attempt with wrong password");
      throw new AppError("رمز عبور اشتباه است", 401, "INVALID_PASSWORD");
    }

    // Find or create admin user
    let adminUser = await getRow<{
      id: string;
      name: string;
      phone: string;
      role: string;
      enabled: any;
    }>(
      `SELECT id, name, phone, role, enabled FROM users WHERE role = 'admin' LIMIT 1`
    );

    if (!adminUser) {
      // Create admin user if doesn't exist
      const adminId = `admin_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const now = new Date().toISOString().slice(0, 19).replace("T", " ");

      await runQuery(
        `INSERT INTO users (id, name, phone, password, role, enabled, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, 'admin', TRUE, ?, ?)`,
        [adminId, "ادمین", "00000000000", "$2a$10$dummy", now, now]
      );

      adminUser = await getRow<{
        id: string;
        name: string;
        phone: string;
        role: string;
        enabled: any;
      }>(
        `SELECT id, name, phone, role, enabled FROM users WHERE id = ?`,
        [adminId]
      );

      if (!adminUser) {
        throw new AppError("خطا در ایجاد کاربر ادمین", 500, "ADMIN_CREATION_ERROR");
      }

      logger.info("Admin user created:", adminId);
    }

    if (!adminUser.enabled) {
      throw new AppError("حساب کاربری ادمین غیرفعال است", 403, "ADMIN_DISABLED");
    }

    // Create session
    const token = await createSession(adminUser.id, request);

    // Create response FIRST, then set cookie on it
    // CRITICAL: Cookie must be set on the same response object that's returned
    const response = NextResponse.json({
      success: true,
      data: {
        user: {
          id: adminUser.id,
          name: adminUser.name,
          phone: adminUser.phone,
          role: adminUser.role,
        },
        message: "ورود موفق",
      },
    });
    
    // Set cookie on the response
    setSessionCookie(response, token, request);
    
    // Verify cookie was set
    const cookieValue = response.cookies.get("saded_session")?.value;
    if (process.env.NODE_ENV === 'development') {
      console.log('[Admin Login] Cookie verification:', {
        cookieSet: !!cookieValue,
        cookieMatches: cookieValue === token,
        tokenLength: token?.length,
        cookieValueLength: cookieValue?.length,
      });
    }

    logger.info("Admin logged in successfully:", adminUser.id);

    return response;
  } catch (error) {
    return createErrorResponse(error);
  }
}

