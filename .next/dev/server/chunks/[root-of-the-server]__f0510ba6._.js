module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/lib/logger.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Centralized logging utility
 * Disables console.log in production for better performance
 */ __turbopack_context__.s([
    "logger",
    ()=>logger
]);
class Logger {
    isDevelopment = ("TURBOPACK compile-time value", "development") === 'development';
    isProduction = ("TURBOPACK compile-time value", "development") === 'production';
    shouldLog(level) {
        // Always log errors and warnings
        if (level === 'error' || level === 'warn') {
            return true;
        }
        // Only log other levels in development
        return this.isDevelopment;
    }
    log(...args) {
        if (this.shouldLog('log')) {
            console.log(...args);
        }
    }
    error(...args) {
        console.error(...args);
    }
    warn(...args) {
        console.warn(...args);
    }
    info(...args) {
        if (this.shouldLog('info')) {
            console.info(...args);
        }
    }
    debug(...args) {
        if (this.shouldLog('debug')) {
            console.debug(...args);
        }
    }
    /**
   * Log database query (only in development)
   */ dbQuery(query, params) {
        if (this.isDevelopment) {
            console.log('[DB Query]', query.substring(0, 100), params ? `[${params.length} params]` : '');
        }
    }
    /**
   * Log API request (only in development)
   */ apiRequest(method, path, statusCode) {
        if (this.isDevelopment) {
            console.log(`[API] ${method} ${path}${statusCode ? ` ${statusCode}` : ''}`);
        }
    }
}
const logger = new Logger();
}),
"[project]/lib/api-error-handler.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Centralized Error Handler
 * Provides consistent error handling and logging across the application
 */ __turbopack_context__.s([
    "AppError",
    ()=>AppError,
    "NetworkError",
    ()=>NetworkError,
    "NetworkErrorType",
    ()=>NetworkErrorType,
    "getUserFriendlyMessage",
    ()=>getUserFriendlyMessage,
    "logError",
    ()=>logError,
    "parseError",
    ()=>parseError
]);
/**
 * Import centralized logger
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/logger.ts [app-route] (ecmascript)");
class AppError extends Error {
    status;
    code;
    details;
    constructor(message, status, code, details){
        super(message);
        this.name = "AppError";
        this.status = status;
        this.code = code;
        this.details = details;
        Object.setPrototypeOf(this, AppError.prototype);
    }
}
var NetworkErrorType = /*#__PURE__*/ function(NetworkErrorType) {
    NetworkErrorType["TIMEOUT"] = "TIMEOUT";
    NetworkErrorType["NETWORK"] = "NETWORK";
    NetworkErrorType["ABORTED"] = "ABORTED";
    NetworkErrorType["UNKNOWN"] = "UNKNOWN";
    return NetworkErrorType;
}({});
class NetworkError extends Error {
    type;
    originalError;
    constructor(message, type = "UNKNOWN", originalError){
        super(message);
        this.name = "NetworkError";
        this.type = type;
        this.originalError = originalError;
        Object.setPrototypeOf(this, NetworkError.prototype);
    }
}
;
function parseError(error) {
    if (error instanceof AppError) {
        return {
            message: error.message,
            status: error.status,
            code: error.code,
            details: error.details
        };
    }
    if (error instanceof NetworkError) {
        return {
            message: error.message,
            code: error.type,
            details: error.originalError
        };
    }
    if (error instanceof Error) {
        return {
            message: error.message
        };
    }
    if (typeof error === "string") {
        return {
            message: error
        };
    }
    return {
        message: "خطای نامشخص رخ داد"
    };
}
function getUserFriendlyMessage(error) {
    const parsed = parseError(error);
    // Network errors
    if (parsed.code === "TIMEOUT") {
        return "درخواست شما به دلیل طولانی شدن زمان پاسخ لغو شد. لطفاً دوباره تلاش کنید.";
    }
    if (parsed.code === "NETWORK") {
        return "خطا در ارتباط با سرور. لطفاً اتصال اینترنت خود را بررسی کنید.";
    }
    if (parsed.code === "ABORTED") {
        return "درخواست لغو شد.";
    }
    // HTTP status codes
    if (parsed.status) {
        switch(parsed.status){
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
function logError(error, context) {
    const parsed = parseError(error);
    const contextMsg = context ? `[${context}] ` : "";
    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logger"].error(`${contextMsg}${parsed.message}`, {
        status: parsed.status,
        code: parsed.code,
        details: parsed.details
    });
}
}),
"[project]/lib/api-route-helpers.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * API Route Helpers
 * Provides standardized error handling and response formatting for API routes
 */ __turbopack_context__.s([
    "createErrorResponse",
    ()=>createErrorResponse,
    "createSuccessResponse",
    ()=>createSuccessResponse,
    "validateRequestBody",
    ()=>validateRequestBody,
    "withErrorHandling",
    ()=>withErrorHandling
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$error$2d$handler$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api-error-handler.ts [app-route] (ecmascript)");
;
;
function createErrorResponse(error, defaultStatus = 500) {
    let message = "خطای سرور";
    let status = defaultStatus;
    let code;
    let details;
    // Handle AppError specifically (most common case)
    if (error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$error$2d$handler$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["AppError"]) {
        message = error.message;
        status = error.status || defaultStatus;
        code = error.code;
        details = error.details;
    } else if (error instanceof Error) {
        message = error.message;
        if ("status" in error && typeof error.status === "number") {
            status = error.status;
        }
        if ("code" in error && typeof error.code === "string") {
            code = error.code;
        }
        if ("details" in error) {
            details = error.details;
        }
    } else if (typeof error === "string") {
        message = error;
    } else if (error && typeof error === "object" && "message" in error) {
        message = String(error.message);
        if ("status" in error && typeof error.status === "number") {
            status = error.status;
        }
        if ("code" in error && typeof error.code === "string") {
            code = error.code;
        }
    }
    // Log error in development
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$error$2d$handler$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logError"])(error, "API Route");
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        success: false,
        error: message,
        ...code ? {
            code
        } : {},
        ...("TURBOPACK compile-time value", "development") === "development" && details ? {
            details
        } : {}
    }, {
        status
    });
}
function createSuccessResponse(data, status = 200, pagination) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        success: true,
        data,
        ...pagination && {
            pagination
        }
    }, {
        status
    });
}
function withErrorHandling(handler) {
    return async (request, context)=>{
        try {
            return await handler(request, context);
        } catch (error) {
            return createErrorResponse(error);
        }
    };
}
function validateRequestBody(body, validator) {
    if (!body) {
        throw new Error("Request body is required");
    }
    if (validator && !validator(body)) {
        throw new Error("Invalid request body");
    }
    return body;
}
}),
"[project]/lib/db/index.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Database Wrapper
 * 
 * این فایل یک interface یکپارچه برای استفاده از MySQL فراهم می‌کند
 */ /**
 * Get single row from database
 */ __turbopack_context__.s([
    "getDatabaseType",
    ()=>getDatabaseType,
    "getRow",
    ()=>getRow,
    "getRows",
    ()=>getRows,
    "initializeDatabase",
    ()=>initializeDatabase,
    "runQuery",
    ()=>runQuery,
    "testConnection",
    ()=>testConnection
]);
async function getRow(sql, params = []) {
    try {
        const { queryOne } = await __turbopack_context__.A("[project]/lib/db/mysql.ts [app-route] (ecmascript, async loader)");
        // Convert double-quoted column names to backticks for MySQL
        const mysqlSql = convertToMySQLSQL(sql);
        return await queryOne(mysqlSql, params);
    } catch (error) {
        console.error("Database error in getRow:", {
            sql,
            params,
            error: error?.message,
            code: error?.code
        });
        throw error;
    }
}
async function getRows(sql, params = []) {
    try {
        const { queryAll } = await __turbopack_context__.A("[project]/lib/db/mysql.ts [app-route] (ecmascript, async loader)");
        // Convert double-quoted column names to backticks for MySQL
        const mysqlSql = convertToMySQLSQL(sql);
        return await queryAll(mysqlSql, params);
    } catch (error) {
        console.error("Database error in getRows:", {
            sql,
            params,
            error: error?.message,
            code: error?.code
        });
        throw error;
    }
}
async function runQuery(sql, params = []) {
    const { query } = await __turbopack_context__.A("[project]/lib/db/mysql.ts [app-route] (ecmascript, async loader)");
    const mysqlSql = convertToMySQLSQL(sql);
    const result = await query(mysqlSql, params);
    return {
        changes: result.affectedRows || result.rowCount || 0,
        lastInsertRowid: result.insertId || undefined
    };
}
/**
 * Convert SQL to MySQL SQL
 * - Converts double-quoted column names to backticks
 * - Converts PostgreSQL $1, $2, etc. placeholders to MySQL ? placeholders
 * - Converts ON CONFLICT to ON DUPLICATE KEY UPDATE
 * - MySQL uses ? placeholders (already correct)
 */ function convertToMySQLSQL(sql) {
    let mysqlSql = sql;
    // Convert PostgreSQL $1, $2, etc. placeholders to MySQL ? placeholders
    // First, extract all $N placeholders and their positions
    const placeholderRegex = /\$(\d+)/g;
    const placeholders = [];
    let match;
    while((match = placeholderRegex.exec(sql)) !== null){
        placeholders.push({
            index: parseInt(match[1], 10),
            position: match.index
        });
    }
    // Replace placeholders in reverse order to maintain positions
    if (placeholders.length > 0) {
        // Sort by position in reverse order
        placeholders.sort((a, b)=>b.position - a.position);
        // Replace each $N with ?
        for (const placeholder of placeholders){
            mysqlSql = mysqlSql.substring(0, placeholder.position) + '?' + mysqlSql.substring(placeholder.position + `$${placeholder.index}`.length);
        }
    }
    // Convert double-quoted column names to backticks for MySQL
    // Match "columnName" and replace with `columnName`
    mysqlSql = mysqlSql.replace(/"([^"]+)"/g, '`$1`');
    // Convert PostgreSQL ON CONFLICT to MySQL ON DUPLICATE KEY UPDATE
    mysqlSql = mysqlSql.replace(/ON CONFLICT\s*\(([^)]+)\)\s*DO UPDATE SET\s*(.+)/gi, (match, conflictColumns, updateClause)=>{
        // Convert EXCLUDED.columnName to VALUES(columnName)
        const convertedUpdate = updateClause.replace(/EXCLUDED\.(\w+)/gi, 'VALUES($1)');
        return `ON DUPLICATE KEY UPDATE ${convertedUpdate}`;
    });
    // Remove MySQL-incompatible syntax like ::jsonb (legacy PostgreSQL syntax)
    mysqlSql = mysqlSql.replace(/::jsonb/g, '');
    mysqlSql = mysqlSql.replace(/::json/g, '');
    return mysqlSql;
}
async function initializeDatabase() {
    const { ensureDatabase, initializeTables } = await __turbopack_context__.A("[project]/lib/db/mysql.ts [app-route] (ecmascript, async loader)");
    await ensureDatabase();
    await initializeTables();
}
async function testConnection() {
    try {
        const { testConnection } = await __turbopack_context__.A("[project]/lib/db/mysql.ts [app-route] (ecmascript, async loader)");
        return await testConnection();
    } catch (error) {
        return false;
    }
}
function getDatabaseType() {
    return "mysql";
}
}),
"[project]/app/api/site-settings/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "PUT",
    ()=>PUT
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$route$2d$helpers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api-route-helpers.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$error$2d$handler$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api-error-handler.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/db/index.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/logger.ts [app-route] (ecmascript)");
;
;
;
;
async function GET(request) {
    const startTime = Date.now();
    console.log("=== [GET /api/site-settings] ROUTE HANDLER CALLED ===");
    console.log("Request URL:", request.url);
    console.log("Request method:", request.method);
    console.log("Request headers:", Object.fromEntries(request.headers.entries()));
    try {
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logger"].info("[GET /api/site-settings] Starting request");
        console.log("[GET /api/site-settings] Starting request - DEBUG");
        // Ensure settings table exists
        console.log("[GET /api/site-settings] Creating table if not exists - DEBUG");
        try {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["runQuery"])(`
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
        } catch (dbError) {
            console.error("[GET /api/site-settings] Database error creating table:", dbError);
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logger"].error("[GET /api/site-settings] Database error creating table:", dbError);
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$error$2d$handler$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["AppError"](`خطا در اتصال به دیتابیس: ${dbError.message || "خطای ناشناخته"}`, 500, "DATABASE_ERROR");
        }
        // Get settings from database
        console.log("[GET /api/site-settings] Fetching settings from database");
        let settings;
        try {
            settings = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getRow"])("SELECT * FROM settings WHERE id = 'site_settings' LIMIT 1");
            console.log("[GET /api/site-settings] Settings fetched:", settings ? "found" : "not found");
        } catch (dbError) {
            console.error("[GET /api/site-settings] Database error fetching settings:", dbError);
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logger"].error("[GET /api/site-settings] Database error fetching settings:", dbError);
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$error$2d$handler$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["AppError"](`خطا در خواندن تنظیمات: ${dbError.message || "خطای ناشناخته"}`, 500, "DATABASE_ERROR");
        }
        // If not found, create default settings
        if (!settings) {
            console.log("[GET /api/site-settings] Settings not found, creating default settings");
            try {
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["runQuery"])(`
          INSERT INTO settings (id, \`siteName\`, \`siteDescription\`, \`lowStockThreshold\`, \`itemsPerPage\`)
          VALUES ('site_settings', 'ساد', 'فروشگاه آنلاین قطعات خودرو وارداتی', 10, 10)
        `);
                console.log("[GET /api/site-settings] Default settings created");
                settings = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getRow"])("SELECT * FROM settings WHERE id = 'site_settings' LIMIT 1");
            } catch (dbError) {
                console.error("[GET /api/site-settings] Database error creating default settings:", dbError);
                __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logger"].error("[GET /api/site-settings] Database error creating default settings:", dbError);
                throw new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$error$2d$handler$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["AppError"](`خطا در ایجاد تنظیمات پیش‌فرض: ${dbError.message || "خطای ناشناخته"}`, 500, "DATABASE_ERROR");
            }
        }
        if (!settings) {
            console.error("[GET /api/site-settings] Settings still not found after creation attempt");
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$error$2d$handler$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["AppError"]("خطا در بارگذاری تنظیمات", 500, "SETTINGS_NOT_FOUND");
        }
        const response = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$route$2d$helpers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createSuccessResponse"])({
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
            theme: settings.theme || "system"
        });
        const duration = Date.now() - startTime;
        console.log(`[GET /api/site-settings] Request completed successfully in ${duration}ms`);
        return response;
    } catch (error) {
        const duration = Date.now() - startTime;
        console.error(`[GET /api/site-settings] Error after ${duration}ms:`, error);
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logger"].error("[GET /api/site-settings] Error getting settings:", error);
        // Ensure we return a proper error response
        if (error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$error$2d$handler$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["AppError"]) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$route$2d$helpers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createErrorResponse"])(error);
        }
        // Handle unexpected errors
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$route$2d$helpers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createErrorResponse"])(new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$error$2d$handler$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["AppError"](`خطای سرور: ${error?.message || "خطای ناشناخته"}`, 500, "INTERNAL_ERROR"));
    }
}
async function PUT(request) {
    const startTime = Date.now();
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/6e2493c0-cc8b-4c0b-9456-c04638b7e615', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            location: 'route.ts:175',
            message: 'PUT handler called',
            data: {
                url: request.url,
                method: request.method,
                hasCookieHeader: !!request.headers.get('cookie')
            },
            timestamp: Date.now(),
            sessionId: 'debug-session',
            runId: 'run1',
            hypothesisId: 'A'
        })
    }).catch(()=>{});
    // #endregion
    console.log("=== [PUT /api/site-settings] ROUTE HANDLER CALLED ===");
    console.log("Request URL:", request.url);
    console.log("Request method:", request.method);
    const cookieHeader = request.headers.get('cookie');
    const allHeaders = Object.fromEntries(request.headers.entries());
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/6e2493c0-cc8b-4c0b-9456-c04638b7e615', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            location: 'route.ts:182',
            message: 'Request headers received',
            data: {
                cookieHeader: cookieHeader?.substring(0, 200) || 'null',
                hasCookie: !!cookieHeader,
                headerKeys: Object.keys(allHeaders)
            },
            timestamp: Date.now(),
            sessionId: 'debug-session',
            runId: 'run1',
            hypothesisId: 'B'
        })
    }).catch(()=>{});
    // #endregion
    console.log("Request headers:", allHeaders);
    try {
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logger"].info("[PUT /api/site-settings] Starting request");
        console.log("[PUT /api/site-settings] Starting request - DEBUG");
        // Check authentication
        console.log("[PUT /api/site-settings] Checking authentication");
        let sessionUser;
        try {
            const { getSessionUserFromRequest } = await __turbopack_context__.A("[project]/lib/auth/session.ts [app-route] (ecmascript, async loader)");
            sessionUser = await getSessionUserFromRequest(request);
            // #region agent log
            fetch('http://127.0.0.1:7242/ingest/6e2493c0-cc8b-4c0b-9456-c04638b7e615', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    location: 'route.ts:195',
                    message: 'Session validation result',
                    data: {
                        hasSession: !!sessionUser,
                        userId: sessionUser?.id || null,
                        role: sessionUser?.role || null,
                        enabled: sessionUser?.enabled || null
                    },
                    timestamp: Date.now(),
                    sessionId: 'debug-session',
                    runId: 'run1',
                    hypothesisId: 'C'
                })
            }).catch(()=>{});
            // #endregion
            console.log("[PUT /api/site-settings] Session user:", sessionUser ? {
                id: sessionUser.id,
                role: sessionUser.role,
                enabled: sessionUser.enabled
            } : "null");
        } catch (authError) {
            // #region agent log
            fetch('http://127.0.0.1:7242/ingest/6e2493c0-cc8b-4c0b-9456-c04638b7e615', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    location: 'route.ts:200',
                    message: 'Auth error occurred',
                    data: {
                        error: authError?.message || 'unknown',
                        stack: authError?.stack?.substring(0, 300) || 'none'
                    },
                    timestamp: Date.now(),
                    sessionId: 'debug-session',
                    runId: 'run1',
                    hypothesisId: 'D'
                })
            }).catch(()=>{});
            // #endregion
            console.error("[PUT /api/site-settings] Auth error:", authError);
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logger"].error("[PUT /api/site-settings] Auth error:", authError);
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$error$2d$handler$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["AppError"](`خطا در بررسی احراز هویت: ${authError.message || "خطای ناشناخته"}`, 500, "AUTH_ERROR");
        }
        // Fallback: اگر session پیدا نشد اما userId در header ارسال شده
        // این برای development و همچنین برای اطمینان از کارکرد صحیح در production استفاده می‌شود
        if (!sessionUser) {
            const userIdHeader = request.headers.get('x-user-id');
            if (userIdHeader) {
                console.log('[PUT /api/site-settings] Using userId from header (fallback):', userIdHeader);
                // #region agent log
                fetch('http://127.0.0.1:7242/ingest/6e2493c0-cc8b-4c0b-9456-c04638b7e615', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        location: 'route.ts:215',
                        message: 'Using userId header fallback',
                        data: {
                            userIdHeader
                        },
                        timestamp: Date.now(),
                        sessionId: 'debug-session',
                        runId: 'run1',
                        hypothesisId: 'M'
                    })
                }).catch(()=>{});
                // #endregion
                // Get user from database
                const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getRow"])("SELECT id, name, phone, role, enabled, createdAt FROM users WHERE id = ?", [
                    userIdHeader
                ]);
                if (user && user.enabled) {
                    sessionUser = {
                        id: user.id,
                        name: user.name,
                        phone: user.phone,
                        role: user.role || "user",
                        enabled: Boolean(user.enabled),
                        createdAt: user.createdAt || new Date().toISOString()
                    };
                    console.log('[PUT /api/site-settings] Fallback user found:', sessionUser.id);
                    // #region agent log
                    fetch('http://127.0.0.1:7242/ingest/6e2493c0-cc8b-4c0b-9456-c04638b7e615', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            location: 'route.ts:230',
                            message: 'Fallback user validated',
                            data: {
                                userId: sessionUser.id,
                                role: sessionUser.role,
                                isAdmin: sessionUser.role === 'admin'
                            },
                            timestamp: Date.now(),
                            sessionId: 'debug-session',
                            runId: 'run1',
                            hypothesisId: 'N'
                        })
                    }).catch(()=>{});
                // #endregion
                }
            }
        }
        if (!sessionUser || sessionUser.role !== "admin") {
            // #region agent log
            fetch('http://127.0.0.1:7242/ingest/6e2493c0-cc8b-4c0b-9456-c04638b7e615', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    location: 'route.ts:238',
                    message: 'Unauthorized - throwing 403',
                    data: {
                        hasSession: !!sessionUser,
                        role: sessionUser?.role || null,
                        isAdmin: sessionUser?.role === 'admin'
                    },
                    timestamp: Date.now(),
                    sessionId: 'debug-session',
                    runId: 'run1',
                    hypothesisId: 'E'
                })
            }).catch(()=>{});
            // #endregion
            console.warn("[PUT /api/site-settings] Unauthorized access attempt:", {
                hasSession: !!sessionUser,
                role: sessionUser?.role
            });
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$error$2d$handler$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["AppError"]("دسترسی غیرمجاز - فقط ادمین می‌تواند تنظیمات را تغییر دهد", 403, "UNAUTHORIZED");
        }
        // Parse request body
        console.log("[PUT /api/site-settings] Parsing request body");
        let body;
        try {
            body = await request.json();
            console.log("[PUT /api/site-settings] Request body parsed:", Object.keys(body));
        } catch (jsonError) {
            console.error("[PUT /api/site-settings] JSON parse error:", jsonError);
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$error$2d$handler$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["AppError"]("Invalid JSON in request body", 400, "INVALID_JSON");
        }
        // Ensure settings table exists
        console.log("[PUT /api/site-settings] Ensuring settings table exists");
        try {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["runQuery"])(`
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
        } catch (dbError) {
            console.error("[PUT /api/site-settings] Database error creating table:", dbError);
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logger"].error("[PUT /api/site-settings] Database error creating table:", dbError);
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$error$2d$handler$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["AppError"](`خطا در اتصال به دیتابیس: ${dbError.message || "خطای ناشناخته"}`, 500, "DATABASE_ERROR");
        }
        // Update settings
        console.log("[PUT /api/site-settings] Updating settings");
        try {
            // Build dynamic UPDATE query - only update fields that are provided
            // Note: contactPhone, contactEmail, and address are managed in footer settings
            // so we preserve existing values if not provided
            const updateFields = [];
            const updateValues = [];
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
                throw new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$error$2d$handler$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["AppError"]("هیچ فیلدی برای به‌روزرسانی ارسال نشده است", 400, "NO_FIELDS_TO_UPDATE");
            }
            updateFields.push("`updatedAt` = CURRENT_TIMESTAMP");
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["runQuery"])(`
        UPDATE settings 
        SET ${updateFields.join(", ")}
        WHERE id = 'site_settings'
      `, updateValues);
            console.log("[PUT /api/site-settings] Settings updated successfully");
        } catch (dbError) {
            console.error("[PUT /api/site-settings] Database error updating settings:", dbError);
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logger"].error("[PUT /api/site-settings] Database error updating settings:", dbError);
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$error$2d$handler$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["AppError"](`خطا در ذخیره تنظیمات: ${dbError.message || "خطای ناشناخته"}`, 500, "DATABASE_ERROR");
        }
        // Dispatch event to notify other tabs (client-side only)
        // Note: This won't work in server-side context, but it's harmless
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        const duration = Date.now() - startTime;
        console.log(`[PUT /api/site-settings] Request completed successfully in ${duration}ms`);
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$route$2d$helpers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createSuccessResponse"])({
            message: "تنظیمات با موفقیت ذخیره شد"
        });
    } catch (error) {
        const duration = Date.now() - startTime;
        console.error(`[PUT /api/site-settings] Error after ${duration}ms:`, error);
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logger"].error("[PUT /api/site-settings] Error updating settings:", error);
        // Ensure we return a proper error response
        if (error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$error$2d$handler$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["AppError"]) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$route$2d$helpers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createErrorResponse"])(error);
        }
        // Handle unexpected errors
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$route$2d$helpers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createErrorResponse"])(new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$error$2d$handler$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["AppError"](`خطای سرور: ${error?.message || "خطای ناشناخته"}`, 500, "INTERNAL_ERROR"));
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__f0510ba6._.js.map