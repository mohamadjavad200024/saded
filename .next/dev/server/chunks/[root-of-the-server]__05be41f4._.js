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
"[project]/lib/validations/checkout.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "checkoutFormSchema",
    ()=>checkoutFormSchema,
    "sanitizeCheckoutInput",
    ()=>sanitizeCheckoutInput
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$types$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zod/v3/types.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$ZodError$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zod/v3/ZodError.js [app-route] (ecmascript)");
;
const checkoutFormSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$types$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["object"]({
    firstName: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$types$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"]().min(1, "نام الزامی است"),
    lastName: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$types$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"]().optional(),
    phone: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$types$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"]().min(10, "شماره تلفن باید حداقل 10 رقم باشد").regex(/^[0-9]+$/, "شماره تلفن باید فقط عدد باشد"),
    email: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$types$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["union"]([
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$types$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"]().email("ایمیل نامعتبر است"),
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$types$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["literal"]("")
    ]).optional(),
    addressType: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$types$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["enum"]([
        "location",
        "postalCode",
        "address"
    ], {
        required_error: "نوع آدرس را انتخاب کنید"
    }),
    location: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$types$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"]().optional(),
    address: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$types$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"]().optional(),
    city: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$types$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"]().optional(),
    postalCode: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$types$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"]().optional().refine((val)=>!val || val === "" || /^[0-9]{10}$/.test(val), {
        message: "کد پستی باید 10 رقم باشد"
    }),
    province: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$types$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"]().optional(),
    notes: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$types$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"]().max(500, "یادداشت نمی‌تواند بیشتر از 500 کاراکتر باشد").optional()
}).superRefine((data, ctx)=>{
    // اگر نوع آدرس location است، location باید پر باشد
    if (data.addressType === "location") {
        if (!data.location || data.location.trim().length === 0) {
            ctx.addIssue({
                code: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$ZodError$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ZodIssueCode"].custom,
                message: "لطفاً لوکیشن را وارد کنید",
                path: [
                    "location"
                ]
            });
        }
    }
    // اگر نوع آدرس postalCode است، postalCode باید پر باشد
    if (data.addressType === "postalCode") {
        if (!data.postalCode || data.postalCode.trim().length === 0) {
            ctx.addIssue({
                code: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$ZodError$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ZodIssueCode"].custom,
                message: "لطفاً کد پستی را وارد کنید",
                path: [
                    "postalCode"
                ]
            });
        } else if (!/^[0-9]{10}$/.test(data.postalCode)) {
            ctx.addIssue({
                code: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$ZodError$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ZodIssueCode"].custom,
                message: "کد پستی باید 10 رقم باشد",
                path: [
                    "postalCode"
                ]
            });
        }
    }
    // اگر نوع آدرس address است، address باید پر باشد
    if (data.addressType === "address") {
        if (!data.address || data.address.trim().length < 5) {
            ctx.addIssue({
                code: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$ZodError$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ZodIssueCode"].custom,
                message: "آدرس باید حداقل 5 کاراکتر باشد",
                path: [
                    "address"
                ]
            });
        }
    }
});
function sanitizeCheckoutInput(data) {
    return {
        firstName: data.firstName.trim(),
        lastName: data.lastName?.trim() || "",
        phone: data.phone.replace(/\D/g, ""),
        email: data.email?.trim().toLowerCase() || "",
        addressType: data.addressType,
        location: data.location?.trim() || "",
        address: data.address?.trim() || "",
        city: data.city?.trim() || "",
        postalCode: data.postalCode?.replace(/\D/g, "") || "",
        province: data.province?.trim() || "",
        notes: data.notes?.trim() || ""
    };
}
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
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
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
"[project]/app/api/orders/create/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$validations$2f$checkout$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/validations/checkout.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$route$2d$helpers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api-route-helpers.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$error$2d$handler$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api-error-handler.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/db/index.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/logger.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$session$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/auth/session.ts [app-route] (ecmascript)");
;
;
;
;
;
;
/**
 * Sanitize و اعتبارسنجی ورودی‌ها
 */ function sanitizeString(value) {
    if (typeof value !== "string") return "";
    return value.trim();
}
function sanitizeNumber(value) {
    const num = typeof value === "number" ? value : parseFloat(value);
    return isNaN(num) ? 0 : num;
}
async function POST(request) {
    try {
        // Ensure orders table exists
        try {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["runQuery"])(`
        CREATE TABLE IF NOT EXISTS orders (
          id VARCHAR(255) PRIMARY KEY,
          \`orderNumber\` VARCHAR(255) UNIQUE NOT NULL,
          \`userId\` VARCHAR(255),
          \`customerName\` VARCHAR(255) NOT NULL,
          \`customerPhone\` VARCHAR(255) NOT NULL,
          \`customerEmail\` VARCHAR(255),
          items JSON NOT NULL DEFAULT ('[]'),
          total BIGINT NOT NULL,
          \`shippingCost\` BIGINT NOT NULL,
          \`shippingMethod\` VARCHAR(50) NOT NULL,
          \`shippingAddress\` JSON NOT NULL DEFAULT ('{}'),
          status VARCHAR(50) NOT NULL DEFAULT 'pending',
          \`paymentStatus\` VARCHAR(50) NOT NULL DEFAULT 'pending',
          notes TEXT,
          \`createdAt\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          \`updatedAt\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logger"].debug("Orders table ensured");
        } catch (tableError) {
            // Log but don't fail - table might already exist
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logger"].warn("Error ensuring orders table (might already exist):", tableError?.message);
        }
        // Authentication required - no guest orders allowed
        let sessionUser = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$session$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getSessionUserFromRequest"])(request);
        // Log for debugging
        console.log('[POST /api/orders/create] Session check:', {
            hasSessionUser: !!sessionUser,
            userId: sessionUser?.id,
            sessionUserId: sessionUser?.id,
            sessionUserRole: sessionUser?.role
        });
        // Fallback: اگر session پیدا نشد اما userId در header ارسال شده (برای development)
        if (!sessionUser && ("TURBOPACK compile-time value", "development") === 'development') {
            const userIdHeader = request.headers.get('x-user-id');
            if (userIdHeader) {
                console.log('[POST /api/orders/create] Using userId from header (development fallback):', userIdHeader);
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
                    console.log('[POST /api/orders/create] Fallback user found:', sessionUser.id);
                }
            }
        }
        if (!sessionUser || !sessionUser.id) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$error$2d$handler$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["AppError"]("برای ثبت سفارش باید وارد حساب کاربری خود شوید", 401, "UNAUTHORIZED");
        }
        const finalUserId = sessionUser.id;
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logger"].info(`📦 Creating order with userId: ${finalUserId}`);
        const body = await request.json().catch(()=>{
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$error$2d$handler$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["AppError"]("Invalid JSON in request body", 400, "INVALID_JSON");
        });
        const { items, formData, total, shippingCost, shippingMethod } = body;
        // اعتبارسنجی سبد خرید
        if (!items || !Array.isArray(items) || items.length === 0) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$error$2d$handler$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["AppError"]("سبد خرید خالی است", 400, "EMPTY_CART");
        }
        // Log items for debugging
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logger"].debug("Received items for order creation:", items.map((item)=>({
                id: item?.id,
                name: item?.name,
                price: item?.price,
                quantity: item?.quantity,
                hasImage: !!item?.image
            })));
        // بررسی محدودیت تعداد محصولات
        if (items.length > 50) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$error$2d$handler$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["AppError"]("حداکثر 50 محصول در هر سفارش مجاز است", 400, "CART_LIMIT_EXCEEDED");
        }
        // اعتبارسنجی هر آیتم
        for (const item of items){
            // بررسی وجود فیلدهای ضروری
            if (!item || typeof item !== "object") {
                throw new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$error$2d$handler$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["AppError"]("آیتم سفارش نامعتبر است", 400, "INVALID_ITEM");
            }
            if (!item.id || typeof item.id !== "string" || item.id.trim() === "") {
                throw new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$error$2d$handler$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["AppError"](`شناسه محصول نامعتبر است. آیتم: ${JSON.stringify(item)}`, 400, "INVALID_ITEM_ID");
            }
            if (!item.name || typeof item.name !== "string" || item.name.trim() === "") {
                throw new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$error$2d$handler$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["AppError"](`نام محصول نامعتبر است. شناسه: ${item.id}`, 400, "INVALID_ITEM_NAME");
            }
            // بررسی قیمت
            if (item.price === undefined || item.price === null) {
                throw new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$error$2d$handler$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["AppError"](`قیمت محصول "${item.name || item.id}" مشخص نشده است`, 400, "MISSING_PRICE");
            }
            const price = sanitizeNumber(item.price);
            // افزایش محدودیت قیمت به 1 میلیارد تومان برای محصولات گران قیمت
            if (price <= 0 || price > 1000000000) {
                throw new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$error$2d$handler$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["AppError"](`قیمت محصول "${item.name}" نامعتبر است (${price}) - حداکثر قیمت مجاز: 1,000,000,000 تومان`, 400, "INVALID_PRICE");
            }
            // بررسی تعداد
            if (item.quantity === undefined || item.quantity === null) {
                throw new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$error$2d$handler$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["AppError"](`تعداد محصول "${item.name || item.id}" مشخص نشده است`, 400, "MISSING_QUANTITY");
            }
            const quantity = sanitizeNumber(item.quantity);
            if (quantity <= 0 || quantity > 1000) {
                throw new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$error$2d$handler$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["AppError"](`تعداد محصول "${item.name}" نامعتبر است (${quantity}) - باید بین 1 تا 1000 باشد`, 400, "INVALID_QUANTITY");
            }
            // تصویر اختیاری است - اگر وجود نداشته باشد، مقدار پیش‌فرض می‌گذاریم
            if (item.image !== undefined && item.image !== null && typeof item.image !== "string") {
                throw new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$error$2d$handler$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["AppError"](`تصویر محصول "${item.name}" نامعتبر است`, 400, "INVALID_IMAGE");
            }
        }
        // اعتبارسنجی فرم با zod
        try {
            await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$validations$2f$checkout$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["checkoutFormSchema"].parseAsync(formData);
        } catch (validationError) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$error$2d$handler$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["AppError"]("اطلاعات فرم نامعتبر است", 400, "VALIDATION_ERROR", validationError.errors || validationError.message);
        }
        // اعتبارسنجی مبلغ
        const sanitizedTotal = sanitizeNumber(total);
        const sanitizedShippingCost = sanitizeNumber(shippingCost || 0);
        if (sanitizedTotal <= 0 || !isFinite(sanitizedTotal)) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$error$2d$handler$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["AppError"]("مبلغ سفارش نامعتبر است", 400, "INVALID_TOTAL");
        }
        if (sanitizedShippingCost < 0 || !isFinite(sanitizedShippingCost)) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$error$2d$handler$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["AppError"]("هزینه ارسال نامعتبر است", 400, "INVALID_SHIPPING_COST");
        }
        // بررسی محدودیت مبلغ کل
        const maxOrderAmount = 10000000000; // 10 میلیارد تومان (برای سفارشات بزرگ)
        if (sanitizedTotal > maxOrderAmount) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$error$2d$handler$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["AppError"](`مبلغ سفارش نمی‌تواند بیشتر از ${maxOrderAmount.toLocaleString("fa-IR")} تومان باشد`, 400, "ORDER_AMOUNT_EXCEEDED");
        }
        // اعتبارسنجی روش ارسال
        if (shippingMethod && shippingMethod !== "air" && shippingMethod !== "sea") {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$error$2d$handler$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["AppError"]("روش ارسال نامعتبر است", 400, "INVALID_SHIPPING_METHOD");
        }
        // بررسی اینکه روش ارسال انتخاب شده برای تمام محصولات در سفارش معتبر است
        if (shippingMethod) {
            for (const item of items){
                try {
                    const product = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getRow"])("SELECT \"airShippingEnabled\", \"seaShippingEnabled\" FROM products WHERE id = ?", [
                        item.id
                    ]);
                    if (product) {
                        if (shippingMethod === "air" && !product.airShippingEnabled) {
                            throw new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$error$2d$handler$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["AppError"](`روش ارسال هوایی برای محصول "${item.name}" فعال نیست`, 400, "SHIPPING_METHOD_NOT_AVAILABLE");
                        }
                        if (shippingMethod === "sea" && !product.seaShippingEnabled) {
                            throw new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$error$2d$handler$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["AppError"](`روش ارسال دریایی برای محصول "${item.name}" فعال نیست`, 400, "SHIPPING_METHOD_NOT_AVAILABLE");
                        }
                    }
                } catch (error) {
                    // اگر خطای AppError است، آن را throw کن
                    if (error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$error$2d$handler$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["AppError"]) {
                        throw error;
                    }
                    // در غیر این صورت، اگر محصول پیدا نشد، ادامه بده (ممکن است محصول حذف شده باشد)
                    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logger"].warn(`Product ${item.id} not found, skipping shipping method validation`);
                }
            }
        }
        // تولید شماره سفارش
        const generateOrderNumber = ()=>{
            const timestamp = Date.now();
            const random = Math.floor(Math.random() * 1000).toString().padStart(3, "0");
            return `ORD-${timestamp}-${random}`;
        };
        // Sanitize داده‌های فرم
        const sanitizedFormData = {
            firstName: sanitizeString(formData.firstName),
            lastName: sanitizeString(formData.lastName || ""),
            phone: sanitizeString(formData.phone).replace(/\D/g, ""),
            email: formData.email ? sanitizeString(formData.email).toLowerCase() : undefined,
            addressType: formData.addressType || "address",
            location: formData.location ? sanitizeString(formData.location) : undefined,
            address: formData.address ? sanitizeString(formData.address) : undefined,
            city: formData.city ? sanitizeString(formData.city) : undefined,
            postalCode: formData.postalCode ? sanitizeString(formData.postalCode).replace(/\D/g, "") : undefined,
            province: formData.province ? sanitizeString(formData.province) : "",
            notes: formData.notes ? sanitizeString(formData.notes) : undefined
        };
        // ساخت shippingAddress بر اساس addressType
        let shippingAddress = {
            addressType: sanitizedFormData.addressType,
            province: sanitizedFormData.province || undefined
        };
        if (sanitizedFormData.addressType === "location") {
            shippingAddress.location = sanitizedFormData.location;
        } else if (sanitizedFormData.addressType === "postalCode") {
            shippingAddress.postalCode = sanitizedFormData.postalCode;
        } else {
            // address type
            shippingAddress.address = sanitizedFormData.address;
            shippingAddress.city = sanitizedFormData.city;
            if (sanitizedFormData.postalCode) {
                shippingAddress.postalCode = sanitizedFormData.postalCode;
            }
        }
        // ساخت داده‌های سفارش با داده‌های sanitize شده
        const orderData = {
            items: items.map((item)=>({
                    id: sanitizeString(item.id),
                    productId: sanitizeString(item.id),
                    name: sanitizeString(item.name),
                    price: sanitizeNumber(item.price),
                    quantity: Math.floor(sanitizeNumber(item.quantity)),
                    image: item.image ? sanitizeString(item.image) : ""
                })),
            total: Math.round(sanitizedTotal - sanitizedShippingCost),
            shippingCost: Math.round(sanitizedShippingCost),
            shippingMethod: shippingMethod || "air",
            status: "pending",
            paymentStatus: "paid",
            customerName: `${sanitizedFormData.firstName}${sanitizedFormData.lastName ? ` ${sanitizedFormData.lastName}` : ""}`.trim(),
            customerPhone: sanitizedFormData.phone,
            customerEmail: sanitizedFormData.email || undefined,
            shippingAddress,
            notes: sanitizedFormData.notes || undefined,
            userId: finalUserId,
            orderNumber: generateOrderNumber()
        };
        // Save order to database
        const id = `order-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const now = new Date().toISOString();
        // اطمینان از اینکه userId به صورت string ذخیره می‌شود
        const userIdToSave = String(finalUserId);
        // Log before insert
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logger"].info(`📦 Attempting to insert order: ${orderData.orderNumber}`, {
            id,
            userId: userIdToSave,
            customerName: orderData.customerName,
            customerPhone: orderData.customerPhone,
            total: orderData.total,
            itemsCount: orderData.items.length
        });
        try {
            const insertResult = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["runQuery"])(`INSERT INTO orders (id, \`orderNumber\`, \`userId\`, \`customerName\`, \`customerPhone\`, \`customerEmail\`, items, total, \`shippingCost\`, \`shippingMethod\`, \`shippingAddress\`, status, \`paymentStatus\`, notes, \`createdAt\`, \`updatedAt\`)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
                id,
                orderData.orderNumber,
                userIdToSave,
                orderData.customerName,
                orderData.customerPhone,
                orderData.customerEmail || null,
                JSON.stringify(orderData.items),
                orderData.total,
                orderData.shippingCost,
                orderData.shippingMethod,
                JSON.stringify(orderData.shippingAddress),
                orderData.status,
                orderData.paymentStatus,
                orderData.notes || null,
                now,
                now
            ]);
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logger"].info(`✅ Order inserted successfully: ${orderData.orderNumber}`, {
                id,
                affectedRows: insertResult.changes,
                insertId: insertResult.lastInsertRowid
            });
        } catch (insertError) {
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logger"].error(`❌ Error inserting order: ${orderData.orderNumber}`, {
                id,
                error: insertError?.message,
                code: insertError?.code,
                sqlState: insertError?.sqlState,
                errno: insertError?.errno,
                stack: insertError?.stack
            });
            // Re-throw with more context
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$error$2d$handler$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["AppError"](`خطا در ذخیره سفارش در دیتابیس: ${insertError?.message || 'خطای نامشخص'}`, 500, "ORDER_INSERT_ERROR", {
                originalError: insertError?.code,
                orderNumber: orderData.orderNumber
            });
        }
        // Log successful order creation with userId
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logger"].info(`✅ Order created successfully: ${orderData.orderNumber} with userId: ${userIdToSave}`);
        // Fetch the saved order
        let savedOrder;
        try {
            savedOrder = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getRow"])("SELECT * FROM orders WHERE id = ?", [
                id
            ]);
            if (!savedOrder) {
                __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logger"].error(`❌ Order not found after insert: ${id}`, {
                    orderNumber: orderData.orderNumber
                });
                throw new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$error$2d$handler$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["AppError"]("سفارش ثبت شد اما بازیابی نشد", 500, "ORDER_NOT_FOUND_AFTER_INSERT");
            }
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logger"].info(`✅ Order fetched successfully: ${orderData.orderNumber}`, {
                id: savedOrder.id,
                userId: savedOrder.userId
            });
        } catch (fetchError) {
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logger"].error(`❌ Error fetching order after insert: ${id}`, {
                error: fetchError?.message,
                code: fetchError?.code
            });
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$error$2d$handler$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["AppError"](`خطا در بازیابی سفارش: ${fetchError?.message || 'خطای نامشخص'}`, 500, "ORDER_FETCH_ERROR");
        }
        // Parse JSON fields (PostgreSQL JSONB returns objects, not strings)
        const parsedOrder = {
            ...savedOrder,
            items: Array.isArray(savedOrder.items) ? savedOrder.items : typeof savedOrder.items === 'string' ? JSON.parse(savedOrder.items) : [],
            shippingAddress: typeof savedOrder.shippingAddress === 'object' && savedOrder.shippingAddress !== null ? savedOrder.shippingAddress : typeof savedOrder.shippingAddress === 'string' ? JSON.parse(savedOrder.shippingAddress) : {},
            total: Number(savedOrder.total),
            shippingCost: Number(savedOrder.shippingCost),
            createdAt: savedOrder.createdAt instanceof Date ? savedOrder.createdAt : new Date(savedOrder.createdAt),
            updatedAt: savedOrder.updatedAt instanceof Date ? savedOrder.updatedAt : new Date(savedOrder.updatedAt)
        };
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$route$2d$helpers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createSuccessResponse"])({
            order: parsedOrder
        }, 201);
    } catch (error) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$route$2d$helpers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createErrorResponse"])(error);
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__05be41f4._.js.map