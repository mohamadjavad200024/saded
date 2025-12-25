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
"[externals]/fs/promises [external] (fs/promises, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs/promises", () => require("fs/promises"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

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
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
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
"[project]/lib/auth/session.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SESSION_COOKIE_NAME",
    ()=>SESSION_COOKIE_NAME,
    "clearSession",
    ()=>clearSession,
    "clearSessionCookie",
    ()=>clearSessionCookie,
    "createSession",
    ()=>createSession,
    "ensureAuthTables",
    ()=>ensureAuthTables,
    "getSessionCookieOptions",
    ()=>getSessionCookieOptions,
    "getSessionUserFromRequest",
    ()=>getSessionUserFromRequest,
    "isHttpsRequest",
    ()=>isHttpsRequest,
    "setSessionCookie",
    ()=>setSessionCookie,
    "sha256Hex",
    ()=>sha256Hex
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/crypto [external] (crypto, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/db/index.ts [app-route] (ecmascript)");
;
;
const SESSION_COOKIE_NAME = "saded_session";
// Session نامحدود - تا زمانی که کاربر logout نکند
// برای امنیت، از maxAge بسیار طولانی استفاده می‌کنیم (10 سال)
const SESSION_MAX_AGE_SECONDS = 10 * 365 * 24 * 60 * 60; // 10 years in seconds
function nowIso() {
    // MySQL friendly datetime (YYYY-MM-DD HH:mm:ss)
    return new Date().toISOString().slice(0, 19).replace("T", " ");
}
function sha256Hex(input) {
    return __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["default"].createHash("sha256").update(input).digest("hex");
}
function isHttpsRequest(request) {
    const proto = request.headers.get("x-forwarded-proto") || request.nextUrl.protocol.replace(":", "");
    return proto === "https";
}
function getSessionCookieOptions(request) {
    // Important: if your site is served over http (Not secure), Secure cookies won't set.
    // In development, we use http, so secure must be false
    const isProduction = ("TURBOPACK compile-time value", "development") === "production";
    const isLocalhost = request.nextUrl.hostname === "localhost" || request.nextUrl.hostname === "127.0.0.1" || request.nextUrl.hostname === "::1";
    // Never use secure on localhost - it prevents cookie from being set
    const secure = isProduction && !isLocalhost && isHttpsRequest(request);
    return {
        httpOnly: true,
        secure: secure,
        sameSite: "lax",
        path: "/",
        maxAge: SESSION_MAX_AGE_SECONDS,
        // Ensure domain is not set (allows cookie to work on localhost)
        // domain is not set by default, which is correct for localhost
        // In development, explicitly set sameSite to 'lax' to ensure cookies work
        ...("TURBOPACK compile-time value", "development") === 'development' && {
            sameSite: "lax"
        }
    };
}
async function ensureAuthTables() {
    // Users table
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["runQuery"])(`
    CREATE TABLE IF NOT EXISTS users (
      id VARCHAR(255) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      phone VARCHAR(32) NOT NULL,
      password VARCHAR(255) NOT NULL,
      role VARCHAR(50) NOT NULL DEFAULT 'user',
      enabled BOOLEAN DEFAULT TRUE,
      createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      UNIQUE KEY uniq_users_phone (phone)
    )
  `);
    // If table already existed with different schema/indexes, normalize it:
    // - Only `phone` should be unique (besides PRIMARY id)
    // - Remove other UNIQUE indexes that can block registration (e.g. old email unique)
    // - Ensure phone is NOT NULL
    try {
        // Remove invalid rows (NULL/empty phone) to avoid ALTER failures
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["runQuery"])(`DELETE FROM users WHERE phone IS NULL OR TRIM(phone) = ''`);
        // Ensure phone column is NOT NULL (keep type small)
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["runQuery"])(`ALTER TABLE users MODIFY phone VARCHAR(32) NOT NULL`);
        // Read indexes
        const indexRows = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getRows"])(`SHOW INDEX FROM users`);
        const uniqueIndexToColumns = new Map();
        for (const r of indexRows){
            const keyName = String(r.Key_name ?? r.key_name ?? r.KEY_NAME ?? "");
            const nonUnique = Number(r.Non_unique ?? r.non_unique ?? r.NON_UNIQUE ?? 1);
            const colName = String(r.Column_name ?? r.column_name ?? r.COLUMN_NAME ?? "");
            if (!keyName || !colName) continue;
            if (nonUnique !== 0) continue;
            const cols = uniqueIndexToColumns.get(keyName) || [];
            cols.push(colName);
            uniqueIndexToColumns.set(keyName, cols);
        }
        // Find which unique index (if any) is exactly on phone
        let phoneUniqueIndexName = null;
        for (const [key, cols] of uniqueIndexToColumns.entries()){
            if (key === "PRIMARY") continue;
            const normalizedCols = cols.map((c)=>c.toLowerCase()).sort();
            if (normalizedCols.length === 1 && normalizedCols[0] === "phone") {
                phoneUniqueIndexName = key;
                break;
            }
        }
        // Ensure we have a unique index on phone with our preferred name
        if (!phoneUniqueIndexName) {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["runQuery"])(`ALTER TABLE users ADD UNIQUE KEY uniq_users_phone (phone)`);
            phoneUniqueIndexName = "uniq_users_phone";
        }
        // Drop any other UNIQUE indexes (only PRIMARY + phone unique should remain)
        for (const key of uniqueIndexToColumns.keys()){
            if (key === "PRIMARY") continue;
            if (key === phoneUniqueIndexName) continue;
            // Drop (might fail if permissions; ignore)
            try {
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["runQuery"])(`ALTER TABLE users DROP INDEX \`${key}\``);
            } catch  {
            // ignore
            }
        }
    } catch  {
    // Best-effort; do not block auth if ALTER is not permitted
    }
    // Sessions table
    // Note: expiresAt is kept for backward compatibility but not enforced (sessions are unlimited)
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["runQuery"])(`
    CREATE TABLE IF NOT EXISTS sessions (
      id VARCHAR(255) PRIMARY KEY,
      userId VARCHAR(255) NOT NULL,
      tokenHash CHAR(64) NOT NULL,
      expiresAt TIMESTAMP NULL DEFAULT NULL,
      createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      lastSeenAt TIMESTAMP NULL DEFAULT NULL,
      userAgent VARCHAR(255) NULL DEFAULT NULL,
      ip VARCHAR(64) NULL DEFAULT NULL,
      UNIQUE KEY uniq_sessions_tokenHash (tokenHash),
      KEY idx_sessions_userId (userId),
      KEY idx_sessions_expiresAt (expiresAt)
    )
  `);
    // Migrate existing sessions: set expiresAt to NULL for unlimited sessions
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["runQuery"])(`UPDATE sessions SET expiresAt = NULL WHERE expiresAt IS NOT NULL`);
    } catch  {
    // Best-effort migration, ignore errors
    }
}
async function createSession(userId, request) {
    await ensureAuthTables();
    const token = __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["default"].randomBytes(32).toString("base64url");
    const tokenHash = sha256Hex(token);
    const sessionId = `sess_${Date.now()}_${__TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["default"].randomBytes(6).toString("hex")}`;
    // Session نامحدود - expiresAt را NULL می‌گذاریم
    const expiresAt = null;
    const ua = request.headers.get("user-agent");
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || null;
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["runQuery"])(`INSERT INTO sessions (id, userId, tokenHash, expiresAt, createdAt, lastSeenAt, userAgent, ip)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, [
        sessionId,
        userId,
        tokenHash,
        expiresAt,
        nowIso(),
        nowIso(),
        ua || null,
        ip
    ]);
    return token;
}
async function getSessionUserFromRequest(request) {
    // Try to get cookie from both cookies.get() and headers
    let token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
    // Fallback: try to parse from cookie header directly
    if (!token) {
        const cookieHeader = request.headers.get('cookie');
        if (cookieHeader) {
            const cookies = cookieHeader.split(';').map((c)=>c.trim());
            for (const cookie of cookies){
                const [name, value] = cookie.split('=');
                if (name === SESSION_COOKIE_NAME && value) {
                    token = decodeURIComponent(value);
                    break;
                }
            }
        }
    }
    if (!token) {
        // Debug: log if cookie is missing - use console.log for visibility
        const allCookies = request.cookies.getAll();
        const cookieNames = allCookies.map((c)=>c.name);
        const cookieHeader = request.headers.get('cookie');
        console.log('[Session] ❌ No session cookie found!');
        console.log('[Session] Available cookies:', cookieNames);
        console.log('[Session] Looking for cookie:', SESSION_COOKIE_NAME);
        console.log('[Session] Request URL:', request.url);
        console.log('[Session] Cookie header:', cookieHeader ? cookieHeader.substring(0, 300) : 'no cookie header');
        console.log('[Session] Request hostname:', request.nextUrl.hostname);
        console.log('[Session] Request protocol:', request.nextUrl.protocol);
        if ("TURBOPACK compile-time truthy", 1) {
            console.debug('[Session] No session cookie found. Available cookies:', cookieNames);
        }
        return null;
    }
    console.log('[Session] ✅ Session token found, length:', token.length);
    // Only touch DB if a session cookie exists (prevents hanging on DB when user is not logged in)
    await ensureAuthTables();
    const tokenHash = sha256Hex(token);
    const row = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getRow"])(`SELECT s.id as sessionId, s.userId, s.expiresAt, u.enabled, u.role, u.name, u.phone, u.createdAt
     FROM sessions s
     JOIN users u ON u.id = s.userId
     WHERE s.tokenHash = ?
     LIMIT 1`, [
        tokenHash
    ]);
    if (!row) return null;
    // Session نامحدود - بررسی expiration را حذف می‌کنیم
    // فقط اگر expiresAt وجود داشته باشد و منقضی شده باشد، آن را حذف می‌کنیم
    // (برای backward compatibility با sessions قدیمی)
    if (row.expiresAt) {
        const expires = new Date(row.expiresAt);
        if (!Number.isNaN(expires.getTime()) && expires.getTime() < Date.now()) {
            // Expired: delete it
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["runQuery"])(`DELETE FROM sessions WHERE tokenHash = ?`, [
                tokenHash
            ]);
            return null;
        }
    }
    // Touch session
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["runQuery"])(`UPDATE sessions SET lastSeenAt = ? WHERE id = ?`, [
        nowIso(),
        row.sessionId
    ]);
    return {
        id: row.userId,
        name: row.name,
        phone: row.phone,
        role: row.role || "user",
        enabled: Boolean(row.enabled),
        createdAt: row.createdAt
    };
}
async function clearSession(request) {
    const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
    if (!token) return;
    await ensureAuthTables();
    const tokenHash = sha256Hex(token);
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["runQuery"])(`DELETE FROM sessions WHERE tokenHash = ?`, [
        tokenHash
    ]);
}
function setSessionCookie(response, token, request) {
    const options = getSessionCookieOptions(request);
    // CRITICAL: In Next.js, we should ONLY use response.cookies.set()
    // Setting headers directly can cause conflicts
    // Make sure all options are explicitly set
    response.cookies.set(SESSION_COOKIE_NAME, token, {
        httpOnly: true,
        secure: options.secure,
        sameSite: options.sameSite,
        path: "/",
        maxAge: options.maxAge
    });
    // Debug in development
    if ("TURBOPACK compile-time truthy", 1) {
        const cookieValue = response.cookies.get(SESSION_COOKIE_NAME)?.value;
        const allCookies = response.cookies.getAll();
        console.log('[Session] Cookie set:', {
            name: SESSION_COOKIE_NAME,
            hasToken: !!token,
            tokenLength: token?.length,
            cookieValueInResponse: !!cookieValue,
            cookieValueMatches: cookieValue === token,
            maxAge: options.maxAge,
            expiresIn: "unlimited (until logout)",
            secure: options.secure,
            sameSite: options.sameSite,
            requestHost: request.nextUrl.hostname,
            requestProtocol: request.nextUrl.protocol,
            allCookiesCount: allCookies.length,
            cookieNames: allCookies.map((c)=>c.name)
        });
    }
}
function clearSessionCookie(response, request) {
    response.cookies.set(SESSION_COOKIE_NAME, "", {
        ...getSessionCookieOptions(request),
        maxAge: 0
    });
}
}),
"[project]/app/api/chat/upload/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$fs$2f$promises__$5b$external$5d$__$28$fs$2f$promises$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/fs/promises [external] (fs/promises, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/fs [external] (fs, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$route$2d$helpers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api-route-helpers.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$error$2d$handler$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api-error-handler.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$session$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/auth/session.ts [app-route] (ecmascript)");
;
;
;
;
;
;
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const UPLOAD_DIR = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["join"])(process.cwd(), "public", "uploads", "chat");
// Ensure upload directory exists
async function ensureUploadDir() {
    if (!(0, __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["existsSync"])(UPLOAD_DIR)) {
        await (0, __TURBOPACK__imported__module__$5b$externals$5d2f$fs$2f$promises__$5b$external$5d$__$28$fs$2f$promises$2c$__cjs$29$__["mkdir"])(UPLOAD_DIR, {
            recursive: true
        });
    }
}
async function POST(request) {
    try {
        // Check if request is from admin panel
        const referer = request.headers.get('referer') || '';
        const origin = request.headers.get('origin') || '';
        const isFromAdmin = referer.includes('/admin') || origin.includes('/admin');
        // Authentication required - only registered users can upload files
        // BUT: If request is from admin panel, skip auth check (admin is already authenticated in admin panel)
        let sessionUser = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$session$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getSessionUserFromRequest"])(request);
        // Log for debugging
        if ("TURBOPACK compile-time truthy", 1) {
            console.log('[POST /api/chat/upload] Auth check:', {
                hasSession: !!sessionUser,
                isFromAdmin,
                referer: referer.substring(0, 100),
                origin: origin.substring(0, 100)
            });
        }
        // Fallback: اگر session پیدا نشد اما userId در header ارسال شده
        // This is a fallback for cases where session cookie exists but session is not found in DB
        const userIdHeader = request.headers.get('x-user-id');
        if (!sessionUser && userIdHeader) {
            const { getRow } = await __turbopack_context__.A("[project]/lib/db/index.ts [app-route] (ecmascript, async loader)");
            const user = await getRow("SELECT id, name, phone, role, enabled, createdAt FROM users WHERE id = ?", [
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
            }
        }
        // Require authentication - no guest users allowed (only for non-admin requests)
        // For admin panel, allow upload even without session (admin is already authenticated)
        // Also allow if userId header is provided (user is authenticated in client-side)
        if (!sessionUser && !isFromAdmin && !userIdHeader) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$error$2d$handler$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["AppError"]("برای آپلود فایل باید وارد حساب کاربری خود شوید", 401, "UNAUTHORIZED");
        }
        await ensureUploadDir();
        const formData = await request.formData();
        const file = formData.get("file");
        const type = formData.get("type"); // "image", "file", "audio"
        if (!file) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$error$2d$handler$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["AppError"]("فایل ارسال نشده است", 400, "MISSING_FILE");
        }
        // Validate file size
        if (file.size > MAX_FILE_SIZE) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$error$2d$handler$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["AppError"](`حجم فایل باید کمتر از ${MAX_FILE_SIZE / (1024 * 1024)} مگابایت باشد`, 400, "FILE_TOO_LARGE");
        }
        // Validate file type
        const allowedImageTypes = [
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/webm",
            "image/gif"
        ];
        const allowedFileTypes = [
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "text/plain"
        ];
        // Accept any audio type for audio files (MediaRecorder can produce various MIME types)
        const allowedAudioTypes = [
            "audio/webm",
            "audio/webm;codecs=opus",
            "audio/ogg",
            "audio/ogg;codecs=opus",
            "audio/mpeg",
            "audio/mp3",
            "audio/wav",
            "audio/wave",
            "audio/x-wav",
            "audio/mp4",
            "audio/aac",
            "audio/flac"
        ];
        if (type === "image") {
            if (!allowedImageTypes.includes(file.type) && !file.type.startsWith("image/")) {
                throw new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$error$2d$handler$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["AppError"](`نوع فایل تصویری مجاز نیست. نوع مجاز: ${allowedImageTypes.join(", ")}`, 400, "INVALID_FILE_TYPE");
            }
        } else if (type === "file") {
            if (!allowedFileTypes.includes(file.type)) {
                throw new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$error$2d$handler$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["AppError"](`نوع فایل مجاز نیست. نوع مجاز: ${allowedFileTypes.join(", ")}`, 400, "INVALID_FILE_TYPE");
            }
        } else if (type === "audio") {
            // For audio, accept any audio MIME type or check file extension
            const fileName = file.name.toLowerCase();
            const audioExtensions = [
                ".webm",
                ".ogg",
                ".mp3",
                ".wav",
                ".m4a",
                ".aac",
                ".flac",
                ".mp4"
            ];
            const hasAudioExtension = audioExtensions.some((ext)=>fileName.endsWith(ext));
            const hasAudioMimeType = file.type.startsWith("audio/") || allowedAudioTypes.includes(file.type);
            // Accept if it has audio MIME type OR audio extension
            if (!hasAudioMimeType && !hasAudioExtension) {
                throw new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$error$2d$handler$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["AppError"](`نوع فایل صوتی مجاز نیست. لطفاً فایل صوتی معتبری ارسال کنید.`, 400, "INVALID_FILE_TYPE");
            }
        }
        // Generate unique filename
        const timestamp = Date.now();
        const randomStr = Math.random().toString(36).substring(2, 9);
        const fileExtension = file.name.split(".").pop() || "";
        const fileName = `${type}-${timestamp}-${randomStr}.${fileExtension}`;
        const filePath = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["join"])(UPLOAD_DIR, fileName);
        // Convert file to buffer and save
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        await (0, __TURBOPACK__imported__module__$5b$externals$5d2f$fs$2f$promises__$5b$external$5d$__$28$fs$2f$promises$2c$__cjs$29$__["writeFile"])(filePath, buffer);
        // Generate URL
        const fileUrl = `/uploads/chat/${fileName}`;
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$route$2d$helpers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createSuccessResponse"])({
            url: fileUrl,
            fileName: file.name,
            fileSize: file.size,
            type
        });
    } catch (error) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$route$2d$helpers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createErrorResponse"])(error);
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__d72365e2._.js.map