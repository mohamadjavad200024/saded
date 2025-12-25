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
"[project]/lib/product-utils.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Utility functions for product data normalization
 */ /**
 * Normalize images array from database
 * Handles various formats: string, array, null, undefined
 */ __turbopack_context__.s([
    "normalizeImages",
    ()=>normalizeImages,
    "normalizeSpecifications",
    ()=>normalizeSpecifications,
    "normalizeTags",
    ()=>normalizeTags
]);
function normalizeImages(images) {
    // اگر null یا undefined است
    if (images == null) {
        return [];
    }
    // اگر قبلاً array است
    if (Array.isArray(images)) {
        return images.filter((img)=>img != null && typeof img === 'string' && img.trim() !== '').map((img)=>img.trim());
    }
    // اگر string است، سعی کن parse کن
    if (typeof images === 'string') {
        // اگر string خالی است
        if (images.trim() === '') {
            return [];
        }
        try {
            const parsed = JSON.parse(images);
            if (Array.isArray(parsed)) {
                return parsed.filter((img)=>img != null && typeof img === 'string' && img.trim() !== '').map((img)=>img.trim());
            }
            // اگر یک string واحد است
            if (typeof parsed === 'string' && parsed.trim() !== '') {
                return [
                    parsed.trim()
                ];
            }
        } catch (e) {
            // اگر parse ناموفق بود، خود string را به عنوان یک تصویر در نظر بگیر
            return [
                images.trim()
            ];
        }
    }
    return [];
}
function normalizeTags(tags) {
    if (tags == null) {
        return [];
    }
    if (Array.isArray(tags)) {
        return tags.filter((tag)=>tag != null && typeof tag === 'string' && tag.trim() !== '').map((tag)=>tag.trim());
    }
    if (typeof tags === 'string') {
        if (tags.trim() === '') {
            return [];
        }
        try {
            const parsed = JSON.parse(tags);
            if (Array.isArray(parsed)) {
                return parsed.filter((tag)=>tag != null && typeof tag === 'string' && tag.trim() !== '').map((tag)=>tag.trim());
            }
        } catch (e) {
            return [];
        }
    }
    return [];
}
function normalizeSpecifications(specs) {
    if (specs == null) {
        return {};
    }
    if (typeof specs === 'object' && specs !== null && !Array.isArray(specs)) {
        return specs;
    }
    if (typeof specs === 'string') {
        if (specs.trim() === '') {
            return {};
        }
        try {
            const parsed = JSON.parse(specs);
            if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
                return parsed;
            }
        } catch (e) {
            return {};
        }
    }
    return {};
}
}),
"[project]/app/api/products/[id]/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DELETE",
    ()=>DELETE,
    "GET",
    ()=>GET,
    "PUT",
    ()=>PUT
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/db/index.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$route$2d$helpers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api-route-helpers.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$error$2d$handler$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api-error-handler.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$product$2d$utils$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/product-utils.ts [app-route] (ecmascript)");
;
;
;
;
async function GET(request, { params }) {
    try {
        const { id } = await params;
        const product = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getRow"])("SELECT * FROM products WHERE id = ?", [
            id
        ]);
        if (!product) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$error$2d$handler$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["AppError"]("محصول یافت نشد", 404, "PRODUCT_NOT_FOUND");
        }
        // Parse JSON fields with normalization
        const parsedProduct = {
            ...product,
            images: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$product$2d$utils$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["normalizeImages"])(product.images),
            tags: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$product$2d$utils$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["normalizeTags"])(product.tags),
            specifications: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$product$2d$utils$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["normalizeSpecifications"])(product.specifications),
            price: Number(product.price),
            originalPrice: product.originalPrice ? Number(product.originalPrice) : undefined,
            stockCount: Number(product.stockCount),
            inStock: Boolean(product.inStock),
            enabled: Boolean(product.enabled),
            vinEnabled: Boolean(product.vinEnabled),
            airShippingEnabled: Boolean(product.airShippingEnabled),
            seaShippingEnabled: Boolean(product.seaShippingEnabled),
            airShippingCost: product.airShippingCost !== null && product.airShippingCost !== undefined ? Number(product.airShippingCost) : null,
            seaShippingCost: product.seaShippingCost !== null && product.seaShippingCost !== undefined ? Number(product.seaShippingCost) : null,
            createdAt: product.createdAt instanceof Date ? product.createdAt : new Date(product.createdAt),
            updatedAt: product.updatedAt instanceof Date ? product.updatedAt : new Date(product.updatedAt)
        };
        // #region agent log
        fetch(logEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                location: 'route.ts:47',
                message: 'GET product parsed',
                data: {
                    productId: parsedProduct.id,
                    airShippingEnabledRaw: product.airShippingEnabled,
                    airShippingEnabledType: typeof product.airShippingEnabled,
                    airShippingEnabledParsed: parsedProduct.airShippingEnabled,
                    airShippingEnabledParsedType: typeof parsedProduct.airShippingEnabled,
                    seaShippingEnabledRaw: product.seaShippingEnabled,
                    seaShippingEnabledType: typeof product.seaShippingEnabled,
                    seaShippingEnabledParsed: parsedProduct.seaShippingEnabled,
                    seaShippingEnabledParsedType: typeof parsedProduct.seaShippingEnabled
                },
                timestamp: Date.now(),
                sessionId: 'debug-session',
                runId: 'post-fix',
                hypothesisId: 'C'
            })
        }).catch(()=>{});
        // #endregion
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$route$2d$helpers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createSuccessResponse"])(parsedProduct);
    } catch (error) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$route$2d$helpers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createErrorResponse"])(error);
    }
}
async function PUT(request, { params }) {
    // #region agent log
    const logEndpoint1 = 'http://127.0.0.1:7242/ingest/6e2493c0-cc8b-4c0b-9456-c04638b7e615';
    fetch(logEndpoint1, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            location: 'route.ts:55',
            message: 'PUT handler entry',
            data: {},
            timestamp: Date.now(),
            sessionId: 'debug-session',
            runId: 'run1',
            hypothesisId: 'B'
        })
    }).catch(()=>{});
    // #endregion
    try {
        const { id } = await params;
        // #region agent log
        fetch(logEndpoint1, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                location: 'route.ts:60',
                message: 'Params extracted',
                data: {
                    id
                },
                timestamp: Date.now(),
                sessionId: 'debug-session',
                runId: 'run1',
                hypothesisId: 'B'
            })
        }).catch(()=>{});
        // #endregion
        const body = await request.json().catch(()=>{
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$error$2d$handler$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["AppError"]("Invalid JSON in request body", 400, "INVALID_JSON");
        });
        // #region agent log
        fetch(logEndpoint1, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                location: 'route.ts:65',
                message: 'Request body parsed',
                data: {
                    bodyKeys: Object.keys(body),
                    airShippingCost: body.airShippingCost,
                    seaShippingCost: body.seaShippingCost,
                    airShippingCostType: typeof body.airShippingCost,
                    seaShippingCostType: typeof body.seaShippingCost,
                    specsType: typeof body.specifications,
                    tagsType: typeof body.tags
                },
                timestamp: Date.now(),
                sessionId: 'debug-session',
                runId: 'run1',
                hypothesisId: 'C'
            })
        }).catch(()=>{});
        // #endregion
        const product = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getRow"])("SELECT * FROM products WHERE id = ?", [
            id
        ]);
        if (!product) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$error$2d$handler$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["AppError"]("محصول یافت نشد", 404, "PRODUCT_NOT_FOUND");
        }
        // Define allowed fields that can be updated (exclude id, createdAt, etc.)
        const allowedFields = [
            'name',
            'description',
            'price',
            'originalPrice',
            'brand',
            'category',
            'vehicle',
            'model',
            'vin',
            'vinEnabled',
            'airShippingEnabled',
            'seaShippingEnabled',
            'airShippingCost',
            'seaShippingCost',
            'stockCount',
            'inStock',
            'enabled',
            'images',
            'tags',
            'specifications'
        ];
        // Filter out undefined values and non-updatable fields
        const filteredUpdates = {
            updatedAt: new Date().toISOString()
        };
        // Only include allowed fields that are not undefined
        for (const key of allowedFields){
            if (body[key] !== undefined) {
                filteredUpdates[key] = body[key];
            }
        }
        // Convert arrays/objects to JSON strings
        if (filteredUpdates.images !== undefined) {
            filteredUpdates.images = JSON.stringify(filteredUpdates.images);
        }
        if (filteredUpdates.tags !== undefined) {
            filteredUpdates.tags = JSON.stringify(filteredUpdates.tags);
        }
        if (filteredUpdates.specifications !== undefined) {
            filteredUpdates.specifications = JSON.stringify(filteredUpdates.specifications);
        }
        // Ensure boolean values are properly converted
        if (filteredUpdates.airShippingEnabled !== undefined) {
            filteredUpdates.airShippingEnabled = typeof filteredUpdates.airShippingEnabled === "boolean" ? filteredUpdates.airShippingEnabled : filteredUpdates.airShippingEnabled === true || filteredUpdates.airShippingEnabled === "true" || filteredUpdates.airShippingEnabled === 1;
        }
        if (filteredUpdates.seaShippingEnabled !== undefined) {
            filteredUpdates.seaShippingEnabled = typeof filteredUpdates.seaShippingEnabled === "boolean" ? filteredUpdates.seaShippingEnabled : filteredUpdates.seaShippingEnabled === true || filteredUpdates.seaShippingEnabled === "true" || filteredUpdates.seaShippingEnabled === 1;
        }
        // Ensure shipping cost values are properly converted
        if (filteredUpdates.airShippingCost !== undefined) {
            filteredUpdates.airShippingCost = filteredUpdates.airShippingCost !== null && filteredUpdates.airShippingCost !== undefined ? Math.max(0, Math.round(Number(filteredUpdates.airShippingCost))) : null;
        }
        if (filteredUpdates.seaShippingCost !== undefined) {
            filteredUpdates.seaShippingCost = filteredUpdates.seaShippingCost !== null && filteredUpdates.seaShippingCost !== undefined ? Math.max(0, Math.round(Number(filteredUpdates.seaShippingCost))) : null;
        }
        // Build SQL query only with fields that have values
        const setClause = Object.keys(filteredUpdates).map((key)=>`${key} = ?`).join(", ");
        const values = Object.values(filteredUpdates);
        values.push(id);
        // #region agent log
        fetch(logEndpoint1, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                location: 'route.ts:130',
                message: 'Before database update',
                data: {
                    setClause,
                    valuesCount: values.length,
                    filteredUpdatesKeys: Object.keys(filteredUpdates),
                    airShippingCost: filteredUpdates.airShippingCost,
                    seaShippingCost: filteredUpdates.seaShippingCost
                },
                timestamp: Date.now(),
                sessionId: 'debug-session',
                runId: 'run1',
                hypothesisId: 'E'
            })
        }).catch(()=>{});
        // #endregion
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["runQuery"])(`UPDATE products SET ${setClause} WHERE id = ?`, values);
        // #region agent log
        fetch(logEndpoint1, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                location: 'route.ts:133',
                message: 'Database update completed',
                data: {},
                timestamp: Date.now(),
                sessionId: 'debug-session',
                runId: 'run1',
                hypothesisId: 'E'
            })
        }).catch(()=>{});
        // #endregion
        const updatedProduct = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getRow"])("SELECT * FROM products WHERE id = ?", [
            id
        ]);
        // Parse JSON fields with normalization
        const parsedProduct = {
            ...updatedProduct,
            images: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$product$2d$utils$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["normalizeImages"])(updatedProduct.images),
            tags: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$product$2d$utils$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["normalizeTags"])(updatedProduct.tags),
            specifications: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$product$2d$utils$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["normalizeSpecifications"])(updatedProduct.specifications),
            price: Number(updatedProduct.price),
            originalPrice: updatedProduct.originalPrice ? Number(updatedProduct.originalPrice) : undefined,
            stockCount: Number(updatedProduct.stockCount),
            inStock: Boolean(updatedProduct.inStock),
            enabled: Boolean(updatedProduct.enabled),
            vinEnabled: Boolean(updatedProduct.vinEnabled),
            airShippingEnabled: Boolean(updatedProduct.airShippingEnabled),
            seaShippingEnabled: Boolean(updatedProduct.seaShippingEnabled),
            airShippingCost: updatedProduct.airShippingCost !== null && updatedProduct.airShippingCost !== undefined ? Number(updatedProduct.airShippingCost) : null,
            seaShippingCost: updatedProduct.seaShippingCost !== null && updatedProduct.seaShippingCost !== undefined ? Number(updatedProduct.seaShippingCost) : null,
            createdAt: updatedProduct.createdAt instanceof Date ? updatedProduct.createdAt : new Date(updatedProduct.createdAt),
            updatedAt: updatedProduct.updatedAt instanceof Date ? updatedProduct.updatedAt : new Date(updatedProduct.updatedAt)
        };
        // #region agent log
        fetch(logEndpoint1, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                location: 'route.ts:175',
                message: 'PUT handler success',
                data: {
                    productId: parsedProduct.id
                },
                timestamp: Date.now(),
                sessionId: 'debug-session',
                runId: 'run1',
                hypothesisId: 'B'
            })
        }).catch(()=>{});
        // #endregion
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$route$2d$helpers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createSuccessResponse"])(parsedProduct);
    } catch (error) {
        // #region agent log
        fetch(logEndpoint1, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                location: 'route.ts:177',
                message: 'PUT handler error',
                data: {
                    errorMessage: error instanceof Error ? error.message : String(error),
                    errorType: error?.constructor?.name
                },
                timestamp: Date.now(),
                sessionId: 'debug-session',
                runId: 'run1',
                hypothesisId: 'B'
            })
        }).catch(()=>{});
        // #endregion
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$route$2d$helpers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createErrorResponse"])(error);
    }
}
async function DELETE(request, { params }) {
    try {
        const { id } = await params;
        const product = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getRow"])("SELECT * FROM products WHERE id = ?", [
            id
        ]);
        if (!product) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$error$2d$handler$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["AppError"]("محصول یافت نشد", 404, "PRODUCT_NOT_FOUND");
        }
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["runQuery"])("DELETE FROM products WHERE id = ?", [
            id
        ]);
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$route$2d$helpers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createSuccessResponse"])({
            message: "محصول با موفقیت حذف شد"
        });
    } catch (error) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$route$2d$helpers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createErrorResponse"])(error);
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__92970e06._.js.map