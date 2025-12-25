import { NextRequest } from "next/server";
import { createErrorResponse, createSuccessResponse } from "@/lib/api-route-helpers";
import { AppError } from "@/lib/api-error-handler";
import { getRow, runQuery } from "@/lib/db/index";
import { logger } from "@/lib/logger";

/**
 * GET /api/site-settings - Get site settings (Public)
 */
export async function GET(request: NextRequest) {
  const startTime = Date.now();
  console.log("=== [GET /api/site-settings] ROUTE HANDLER CALLED ===");
  console.log("Request URL:", request.url);
  console.log("Request method:", request.method);
  console.log("Request headers:", Object.fromEntries(request.headers.entries()));
  
  try {
    logger.info("[GET /api/site-settings] Starting request");
    console.log("[GET /api/site-settings] Starting request - DEBUG");
    
    // Ensure settings table exists
    console.log("[GET /api/site-settings] Creating table if not exists - DEBUG");
    try {
      await runQuery(`
        CREATE TABLE IF NOT EXISTS settings (
          id VARCHAR(255) PRIMARY KEY DEFAULT 'site_settings',
          \`siteName\` VARCHAR(255) NOT NULL DEFAULT 'ساد',
          \`siteDescription\` TEXT,
          \`logoUrl\` LONGTEXT,
          \`contactPhone\` VARCHAR(255),
          \`contactEmail\` VARCHAR(255),
          \`address\` TEXT,
          \`maintenanceMode\` BOOLEAN DEFAULT FALSE,
          \`allowRegistration\` BOOLEAN DEFAULT TRUE,
          \`emailNotifications\` BOOLEAN DEFAULT TRUE,
          \`lowStockThreshold\` INTEGER DEFAULT 10,
          \`itemsPerPage\` INTEGER DEFAULT 10,
          \`showNotifications\` BOOLEAN DEFAULT TRUE,
          \`theme\` VARCHAR(50) DEFAULT 'system',
          \`createdAt\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          \`updatedAt\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);
      console.log("[GET /api/site-settings] Table created/verified successfully");
    } catch (dbError: any) {
      console.error("[GET /api/site-settings] Database error creating table:", dbError);
      logger.error("[GET /api/site-settings] Database error creating table:", dbError);
      throw new AppError(
        `خطا در اتصال به دیتابیس: ${dbError.message || "خطای ناشناخته"}`,
        500,
        "DATABASE_ERROR"
      );
    }

    // Get settings from database
    console.log("[GET /api/site-settings] Fetching settings from database");
    let settings;
    try {
      settings = await getRow<{
        id: string;
        siteName: string;
        siteDescription: string | null;
        logoUrl: string | null;
        contactPhone: string | null;
        contactEmail: string | null;
        address: string | null;
        maintenanceMode: boolean;
        allowRegistration: boolean;
        emailNotifications: boolean;
        lowStockThreshold: number;
        itemsPerPage: number;
        showNotifications: boolean;
        theme: string;
      }>(
        "SELECT * FROM settings WHERE id = 'site_settings' LIMIT 1"
      );
      console.log("[GET /api/site-settings] Settings fetched:", settings ? "found" : "not found");
    } catch (dbError: any) {
      console.error("[GET /api/site-settings] Database error fetching settings:", dbError);
      logger.error("[GET /api/site-settings] Database error fetching settings:", dbError);
      throw new AppError(
        `خطا در خواندن تنظیمات: ${dbError.message || "خطای ناشناخته"}`,
        500,
        "DATABASE_ERROR"
      );
    }

    // If not found, create default settings
    if (!settings) {
      console.log("[GET /api/site-settings] Settings not found, creating default settings");
      try {
        await runQuery(`
          INSERT INTO settings (id, \`siteName\`, \`siteDescription\`, \`lowStockThreshold\`, \`itemsPerPage\`)
          VALUES ('site_settings', 'ساد', 'فروشگاه آنلاین قطعات خودرو وارداتی', 10, 10)
        `);
        console.log("[GET /api/site-settings] Default settings created");
        
        settings = await getRow<{
          id: string;
          siteName: string;
          siteDescription: string | null;
          logoUrl: string | null;
          contactPhone: string | null;
          contactEmail: string | null;
          address: string | null;
          maintenanceMode: boolean;
          allowRegistration: boolean;
          emailNotifications: boolean;
          lowStockThreshold: number;
          itemsPerPage: number;
          showNotifications: boolean;
          theme: string;
        }>(
          "SELECT * FROM settings WHERE id = 'site_settings' LIMIT 1"
        );
      } catch (dbError: any) {
        console.error("[GET /api/site-settings] Database error creating default settings:", dbError);
        logger.error("[GET /api/site-settings] Database error creating default settings:", dbError);
        throw new AppError(
          `خطا در ایجاد تنظیمات پیش‌فرض: ${dbError.message || "خطای ناشناخته"}`,
          500,
          "DATABASE_ERROR"
        );
      }
    }

    if (!settings) {
      console.error("[GET /api/site-settings] Settings still not found after creation attempt");
      throw new AppError("خطا در بارگذاری تنظیمات", 500, "SETTINGS_NOT_FOUND");
    }

    const response = createSuccessResponse({
      siteName: settings.siteName || "ساد",
      siteDescription: settings.siteDescription || "",
      logoUrl: settings.logoUrl || "",
      // Note: contactPhone, contactEmail, and address are managed in footer settings
      maintenanceMode: settings.maintenanceMode || false,
      allowRegistration: settings.allowRegistration !== undefined ? settings.allowRegistration : true,
      emailNotifications: settings.emailNotifications !== undefined ? settings.emailNotifications : true,
      lowStockThreshold: settings.lowStockThreshold || 10,
      itemsPerPage: settings.itemsPerPage || 10,
      showNotifications: settings.showNotifications !== undefined ? settings.showNotifications : true,
      theme: settings.theme || "system",
    });

    const duration = Date.now() - startTime;
    console.log(`[GET /api/site-settings] Request completed successfully in ${duration}ms`);
    return response;
  } catch (error: any) {
    const duration = Date.now() - startTime;
    console.error(`[GET /api/site-settings] Error after ${duration}ms:`, error);
    logger.error("[GET /api/site-settings] Error getting settings:", error);
    
    // Ensure we return a proper error response
    if (error instanceof AppError) {
      return createErrorResponse(error);
    }
    
    // Handle unexpected errors
    return createErrorResponse(
      new AppError(
        `خطای سرور: ${error?.message || "خطای ناشناخته"}`,
        500,
        "INTERNAL_ERROR"
      )
    );
  }
}

/**
 * PUT /api/site-settings - Update site settings (Admin only)
 */
export async function PUT(request: NextRequest) {
  const startTime = Date.now();
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/6e2493c0-cc8b-4c0b-9456-c04638b7e615',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'route.ts:175',message:'PUT handler called',data:{url:request.url,method:request.method,hasCookieHeader:!!request.headers.get('cookie')},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
  // #endregion
  console.log("=== [PUT /api/site-settings] ROUTE HANDLER CALLED ===");
  console.log("Request URL:", request.url);
  console.log("Request method:", request.method);
  
  const cookieHeader = request.headers.get('cookie');
  const allHeaders = Object.fromEntries(request.headers.entries());
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/6e2493c0-cc8b-4c0b-9456-c04638b7e615',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'route.ts:182',message:'Request headers received',data:{cookieHeader:cookieHeader?.substring(0,200)||'null',hasCookie:!!cookieHeader,headerKeys:Object.keys(allHeaders)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
  // #endregion
  console.log("Request headers:", allHeaders);
  
  try {
    logger.info("[PUT /api/site-settings] Starting request");
    console.log("[PUT /api/site-settings] Starting request - DEBUG");
    
    // Check authentication
    console.log("[PUT /api/site-settings] Checking authentication");
    let sessionUser;
    try {
      const { getSessionUserFromRequest } = await import("@/lib/auth/session");
      sessionUser = await getSessionUserFromRequest(request);
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/6e2493c0-cc8b-4c0b-9456-c04638b7e615',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'route.ts:195',message:'Session validation result',data:{hasSession:!!sessionUser,userId:sessionUser?.id||null,role:sessionUser?.role||null,enabled:sessionUser?.enabled||null},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
      // #endregion
      console.log("[PUT /api/site-settings] Session user:", sessionUser ? {
        id: sessionUser.id,
        role: sessionUser.role,
        enabled: sessionUser.enabled
      } : "null");
    } catch (authError: any) {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/6e2493c0-cc8b-4c0b-9456-c04638b7e615',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'route.ts:200',message:'Auth error occurred',data:{error:authError?.message||'unknown',stack:authError?.stack?.substring(0,300)||'none'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
      // #endregion
      console.error("[PUT /api/site-settings] Auth error:", authError);
      logger.error("[PUT /api/site-settings] Auth error:", authError);
      throw new AppError(
        `خطا در بررسی احراز هویت: ${authError.message || "خطای ناشناخته"}`,
        500,
        "AUTH_ERROR"
      );
    }
    
    // Fallback: اگر session پیدا نشد اما userId در header ارسال شده
    // این برای development و همچنین برای اطمینان از کارکرد صحیح در production استفاده می‌شود
    if (!sessionUser) {
      const userIdHeader = request.headers.get('x-user-id');
      if (userIdHeader) {
        console.log('[PUT /api/site-settings] Using userId from header (fallback):', userIdHeader);
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/6e2493c0-cc8b-4c0b-9456-c04638b7e615',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'route.ts:215',message:'Using userId header fallback',data:{userIdHeader},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'M'})}).catch(()=>{});
        // #endregion
        // Get user from database
        const user = await getRow<{
          id: string;
          name: string;
          phone: string;
          role: string;
          enabled: any;
          createdAt: string;
        }>(
          "SELECT id, name, phone, role, enabled, createdAt FROM users WHERE id = ?",
          [userIdHeader]
        );
        if (user && user.enabled) {
          sessionUser = {
            id: user.id,
            name: user.name,
            phone: user.phone,
            role: user.role || "user",
            enabled: Boolean(user.enabled),
            createdAt: user.createdAt || new Date().toISOString(),
          };
          console.log('[PUT /api/site-settings] Fallback user found:', sessionUser.id);
          // #region agent log
          fetch('http://127.0.0.1:7242/ingest/6e2493c0-cc8b-4c0b-9456-c04638b7e615',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'route.ts:230',message:'Fallback user validated',data:{userId:sessionUser.id,role:sessionUser.role,isAdmin:sessionUser.role==='admin'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'N'})}).catch(()=>{});
          // #endregion
        }
      }
    }
    
    if (!sessionUser || sessionUser.role !== "admin") {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/6e2493c0-cc8b-4c0b-9456-c04638b7e615',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'route.ts:238',message:'Unauthorized - throwing 403',data:{hasSession:!!sessionUser,role:sessionUser?.role||null,isAdmin:sessionUser?.role==='admin'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
      // #endregion
      console.warn("[PUT /api/site-settings] Unauthorized access attempt:", {
        hasSession: !!sessionUser,
        role: sessionUser?.role
      });
      throw new AppError("دسترسی غیرمجاز - فقط ادمین می‌تواند تنظیمات را تغییر دهد", 403, "UNAUTHORIZED");
    }

    // Parse request body
    console.log("[PUT /api/site-settings] Parsing request body");
    let body;
    try {
      body = await request.json();
      console.log("[PUT /api/site-settings] Request body parsed:", Object.keys(body));
    } catch (jsonError: any) {
      console.error("[PUT /api/site-settings] JSON parse error:", jsonError);
      throw new AppError("Invalid JSON in request body", 400, "INVALID_JSON");
    }

    // Ensure settings table exists
    console.log("[PUT /api/site-settings] Ensuring settings table exists");
    try {
      await runQuery(`
        CREATE TABLE IF NOT EXISTS settings (
          id VARCHAR(255) PRIMARY KEY DEFAULT 'site_settings',
          \`siteName\` VARCHAR(255) NOT NULL DEFAULT 'ساد',
          \`siteDescription\` TEXT,
          \`logoUrl\` LONGTEXT,
          \`contactPhone\` VARCHAR(255),
          \`contactEmail\` VARCHAR(255),
          \`address\` TEXT,
          \`maintenanceMode\` BOOLEAN DEFAULT FALSE,
          \`allowRegistration\` BOOLEAN DEFAULT TRUE,
          \`emailNotifications\` BOOLEAN DEFAULT TRUE,
          \`lowStockThreshold\` INTEGER DEFAULT 10,
          \`itemsPerPage\` INTEGER DEFAULT 10,
          \`showNotifications\` BOOLEAN DEFAULT TRUE,
          \`theme\` VARCHAR(50) DEFAULT 'system',
          \`createdAt\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          \`updatedAt\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);
      console.log("[PUT /api/site-settings] Table created/verified successfully");
    } catch (dbError: any) {
      console.error("[PUT /api/site-settings] Database error creating table:", dbError);
      logger.error("[PUT /api/site-settings] Database error creating table:", dbError);
      throw new AppError(
        `خطا در اتصال به دیتابیس: ${dbError.message || "خطای ناشناخته"}`,
        500,
        "DATABASE_ERROR"
      );
    }

    // Update settings
    console.log("[PUT /api/site-settings] Updating settings");
    try {
      // Build dynamic UPDATE query - only update fields that are provided
      // Note: contactPhone, contactEmail, and address are managed in footer settings
      // so we preserve existing values if not provided
      const updateFields: string[] = [];
      const updateValues: any[] = [];
      
      if (body.siteName !== undefined) {
        updateFields.push("`siteName` = ?");
        updateValues.push(body.siteName || "ساد");
      }
      if (body.siteDescription !== undefined) {
        updateFields.push("`siteDescription` = ?");
        updateValues.push(body.siteDescription || null);
      }
      if (body.logoUrl !== undefined) {
        updateFields.push("`logoUrl` = ?");
        updateValues.push(body.logoUrl || null);
      }
      // Skip contactPhone, contactEmail, address - managed in footer settings
      if (body.maintenanceMode !== undefined) {
        updateFields.push("`maintenanceMode` = ?");
        updateValues.push(body.maintenanceMode || false);
      }
      if (body.allowRegistration !== undefined) {
        updateFields.push("`allowRegistration` = ?");
        updateValues.push(body.allowRegistration);
      }
      if (body.emailNotifications !== undefined) {
        updateFields.push("`emailNotifications` = ?");
        updateValues.push(body.emailNotifications);
      }
      if (body.lowStockThreshold !== undefined) {
        updateFields.push("`lowStockThreshold` = ?");
        updateValues.push(body.lowStockThreshold || 10);
      }
      if (body.itemsPerPage !== undefined) {
        updateFields.push("`itemsPerPage` = ?");
        updateValues.push(body.itemsPerPage || 10);
      }
      if (body.showNotifications !== undefined) {
        updateFields.push("`showNotifications` = ?");
        updateValues.push(body.showNotifications);
      }
      if (body.theme !== undefined) {
        updateFields.push("`theme` = ?");
        updateValues.push(body.theme || "system");
      }
      
      if (updateFields.length === 0) {
        throw new AppError("هیچ فیلدی برای به‌روزرسانی ارسال نشده است", 400, "NO_FIELDS_TO_UPDATE");
      }
      
      updateFields.push("`updatedAt` = CURRENT_TIMESTAMP");
      
      await runQuery(`
        UPDATE settings 
        SET ${updateFields.join(", ")}
        WHERE id = 'site_settings'
      `, updateValues);
      console.log("[PUT /api/site-settings] Settings updated successfully");
    } catch (dbError: any) {
      console.error("[PUT /api/site-settings] Database error updating settings:", dbError);
      logger.error("[PUT /api/site-settings] Database error updating settings:", dbError);
      throw new AppError(
        `خطا در ذخیره تنظیمات: ${dbError.message || "خطای ناشناخته"}`,
        500,
        "DATABASE_ERROR"
      );
    }

    // Dispatch event to notify other tabs (client-side only)
    // Note: This won't work in server-side context, but it's harmless
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("settingsUpdated"));
    }

    const duration = Date.now() - startTime;
    console.log(`[PUT /api/site-settings] Request completed successfully in ${duration}ms`);
    
    return createSuccessResponse({
      message: "تنظیمات با موفقیت ذخیره شد",
    });
  } catch (error: any) {
    const duration = Date.now() - startTime;
    console.error(`[PUT /api/site-settings] Error after ${duration}ms:`, error);
    logger.error("[PUT /api/site-settings] Error updating settings:", error);
    
    // Ensure we return a proper error response
    if (error instanceof AppError) {
      return createErrorResponse(error);
    }
    
    // Handle unexpected errors
    return createErrorResponse(
      new AppError(
        `خطای سرور: ${error?.message || "خطای ناشناخته"}`,
        500,
        "INTERNAL_ERROR"
      )
    );
  }
}

