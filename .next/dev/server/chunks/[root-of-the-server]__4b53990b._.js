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
    if (error instanceof Error) {
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
"[project]/lib/cache.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Simple in-memory cache for API responses
 * Used to reduce database queries and improve performance
 */ __turbopack_context__.s([
    "cache",
    ()=>cache,
    "cacheKeys",
    ()=>cacheKeys,
    "withCache",
    ()=>withCache
]);
class SimpleCache {
    cache = new Map();
    maxSize = 1000;
    /**
   * Get value from cache
   */ get(key) {
        const entry = this.cache.get(key);
        if (!entry) {
            return null;
        }
        // Check if entry has expired
        const now = Date.now();
        if (now - entry.timestamp > entry.ttl) {
            this.cache.delete(key);
            return null;
        }
        return entry.data;
    }
    /**
   * Set value in cache
   */ set(key, data, ttl = 60000) {
        // Remove oldest entries if cache is full
        if (this.cache.size >= this.maxSize) {
            const firstKey = this.cache.keys().next().value;
            if (firstKey !== undefined) {
                this.cache.delete(firstKey);
            }
        }
        this.cache.set(key, {
            data,
            timestamp: Date.now(),
            ttl
        });
    }
    /**
   * Delete value from cache
   */ delete(key) {
        this.cache.delete(key);
    }
    /**
   * Clear all cache entries
   */ clear() {
        this.cache.clear();
    }
    /**
   * Clear expired entries
   */ clearExpired() {
        const now = Date.now();
        for (const [key, entry] of this.cache.entries()){
            if (now - entry.timestamp > entry.ttl) {
                this.cache.delete(key);
            }
        }
    }
    /**
   * Get cache size
   */ size() {
        return this.cache.size;
    }
}
const cache = new SimpleCache();
// Clean up expired entries every 5 minutes
if (typeof setInterval !== 'undefined') {
    setInterval(()=>{
        cache.clearExpired();
    }, 5 * 60 * 1000);
}
const cacheKeys = {
    chat: (chatId)=>`chat:${chatId}`,
    chatMessages: (chatId, page, limit)=>`chat:messages:${chatId}:${page || 1}:${limit || 50}`,
    chatList: (page, limit)=>`chat:list:${page || 1}:${limit || 50}`,
    products: (page, limit, filters)=>`products:${page || 1}:${limit || 50}:${filters || ''}`,
    product: (productId)=>`product:${productId}`,
    categories: ()=>`categories:all`,
    category: (categoryId)=>`category:${categoryId}`,
    orders: (filters)=>`orders:${filters || ''}`,
    order: (orderId)=>`order:${orderId}`
};
async function withCache(key, fn, ttl = 60000 // Default 1 minute
) {
    // Try to get from cache first
    const cached = cache.get(key);
    if (cached !== null) {
        return cached;
    }
    // Execute function and cache result
    const result = await fn();
    cache.set(key, result, ttl);
    return result;
}
}),
"[project]/lib/rate-limit.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Simple in-memory rate limiter
 * For production, consider using Redis-based rate limiting
 */ __turbopack_context__.s([
    "getClientId",
    ()=>getClientId,
    "rateLimit",
    ()=>rateLimit,
    "rateLimiter",
    ()=>rateLimiter
]);
class RateLimiter {
    store = new Map();
    cleanupInterval = null;
    /**
   * Check if request should be rate limited
   * @param key - Unique identifier (e.g., IP address, user ID)
   * @param maxRequests - Maximum number of requests
   * @param windowMs - Time window in milliseconds
   * @returns true if rate limited, false otherwise
   */ isRateLimited(key, maxRequests, windowMs) {
        const now = Date.now();
        const entry = this.store.get(key);
        if (!entry || now > entry.resetTime) {
            // Create new entry or reset expired entry
            this.store.set(key, {
                count: 1,
                resetTime: now + windowMs
            });
            return false;
        }
        if (entry.count >= maxRequests) {
            return true; // Rate limited
        }
        // Increment count
        entry.count++;
        return false;
    }
    /**
   * Get remaining requests for a key
   */ getRemaining(key, maxRequests) {
        const entry = this.store.get(key);
        if (!entry) {
            return maxRequests;
        }
        return Math.max(0, maxRequests - entry.count);
    }
    /**
   * Get reset time for a key
   */ getResetTime(key) {
        const entry = this.store.get(key);
        return entry ? entry.resetTime : null;
    }
    /**
   * Clear expired entries
   */ cleanup() {
        const now = Date.now();
        for (const [key, entry] of this.store.entries()){
            if (now > entry.resetTime) {
                this.store.delete(key);
            }
        }
    }
    /**
   * Start automatic cleanup
   */ startCleanup(intervalMs = 60000) {
        if (this.cleanupInterval) {
            return;
        }
        this.cleanupInterval = setInterval(()=>{
            this.cleanup();
        }, intervalMs);
    }
    /**
   * Stop automatic cleanup
   */ stopCleanup() {
        if (this.cleanupInterval) {
            clearInterval(this.cleanupInterval);
            this.cleanupInterval = null;
        }
    }
    /**
   * Clear all entries
   */ clear() {
        this.store.clear();
    }
}
const rateLimiter = new RateLimiter();
// Start automatic cleanup every minute
rateLimiter.startCleanup(60000);
function getClientId(request) {
    // Try to get IP from various headers (for proxies/load balancers)
    const forwarded = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const ip = forwarded?.split(',')[0] || realIp || 'unknown';
    return ip;
}
function rateLimit(maxRequests = 100, windowMs = 60000, keyGenerator) {
    return async (request)=>{
        const key = keyGenerator ? keyGenerator(request) : getClientId(request);
        const fullKey = `${request.nextUrl.pathname}:${key}`;
        if (rateLimiter.isRateLimited(fullKey, maxRequests, windowMs)) {
            const resetTime = rateLimiter.getResetTime(fullKey);
            const remaining = rateLimiter.getRemaining(fullKey, maxRequests);
            return new Response(JSON.stringify({
                success: false,
                error: {
                    message: 'Too many requests. Please try again later.',
                    code: 'RATE_LIMIT_EXCEEDED'
                }
            }), {
                status: 429,
                headers: {
                    'Content-Type': 'application/json',
                    'X-RateLimit-Limit': maxRequests.toString(),
                    'X-RateLimit-Remaining': remaining.toString(),
                    'X-RateLimit-Reset': resetTime?.toString() || '',
                    'Retry-After': Math.ceil((resetTime ? resetTime - Date.now() : windowMs) / 1000).toString()
                }
            });
        }
        return null; // Not rate limited
    };
}
}),
"[project]/app/api/products/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/db/index.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$route$2d$helpers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api-route-helpers.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$error$2d$handler$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api-error-handler.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$cache$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/cache.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$rate$2d$limit$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/rate-limit.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/logger.ts [app-route] (ecmascript)");
;
;
;
;
;
;
async function GET(request) {
    // Rate limiting: 100 requests per minute per IP
    const rateLimitResponse = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$rate$2d$limit$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["rateLimit"])(100, 60000)(request);
    if (rateLimitResponse) {
        return rateLimitResponse;
    }
    try {
        // Parse pagination parameters from query string
        const { searchParams } = new URL(request.url);
        const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
        const limit = Math.min(1000, Math.max(1, parseInt(searchParams.get("limit") || "50", 10)));
        const offset = (page - 1) * limit;
        // Check if we need all products (for admin pages)
        const includeAll = searchParams.get("all") === "true";
        // Get total count first
        let countResult;
        let total = 0;
        let products = [];
        try {
            // Test database connection first
            const { testConnection } = await __turbopack_context__.A("[project]/lib/db/index.ts [app-route] (ecmascript, async loader)");
            const isConnected = await testConnection();
            if (!isConnected) {
                __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logger"].warn("⚠️ Database connection test failed - returning empty products");
                // Return empty response instead of error
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$route$2d$helpers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createSuccessResponse"])([], 200, {
                    page,
                    limit,
                    total: 0,
                    totalPages: 0
                });
            }
        } catch (connectionTestError) {
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logger"].warn("⚠️ Database connection test error - returning empty products:", connectionTestError);
            // Return empty response instead of error
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$route$2d$helpers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createSuccessResponse"])([], 200, {
                page,
                limit,
                total: 0,
                totalPages: 0
            });
        }
        try {
            // Generate cache key
            const cacheKey = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$cache$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cacheKeys"].products(page, limit, includeAll ? 'all' : 'enabled');
            // Try to get from cache first (cache for 30 seconds)
            const cached = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$cache$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cache"].get(cacheKey);
            if (cached) {
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$route$2d$helpers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createSuccessResponse"])(cached.products, 200, {
                    page,
                    limit,
                    total: cached.total,
                    totalPages: Math.ceil(cached.total / limit)
                });
            }
            // If all=true, count all products, otherwise only enabled ones
            const countQuery = includeAll ? `SELECT COUNT(*) as count FROM products` : `SELECT COUNT(*) as count FROM products WHERE enabled = TRUE`;
            countResult = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getRows"])(countQuery);
            total = countResult[0]?.count || 0;
            // If all=true, get all products, otherwise only enabled ones
            const productsQuery = includeAll ? `SELECT * FROM products ORDER BY "createdAt" DESC LIMIT ? OFFSET ?` : `SELECT * FROM products WHERE enabled = TRUE ORDER BY "createdAt" DESC LIMIT ? OFFSET ?`;
            // Get paginated products (wrapper converts ? to $1, $2 for PostgreSQL)
            products = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getRows"])(productsQuery, [
                limit,
                offset
            ]);
            // Cache the result for 5 minutes (increased from 30 seconds for better performance)
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$cache$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cache"].set(cacheKey, {
                products,
                total
            }, 5 * 60 * 1000);
        } catch (dbError) {
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logger"].error("Database error in GET /api/products:", {
                message: dbError?.message,
                code: dbError?.code,
                stack: dbError?.stack
            });
            // Check for specific database connection errors
            const isConnectionError = dbError?.code === "ECONNREFUSED" || dbError?.code === "ETIMEDOUT" || dbError?.code === "ENOTFOUND" || dbError?.message?.includes("connection") || dbError?.message?.includes("timeout");
            if (isConnectionError) {
                throw new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$error$2d$handler$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["AppError"]("خطا در اتصال به دیتابیس. لطفاً مطمئن شوید که دیتابیس در حال اجرا است.", 503, "DATABASE_CONNECTION_ERROR", ("TURBOPACK compile-time truthy", 1) ? dbError : "TURBOPACK unreachable");
            }
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$error$2d$handler$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["AppError"](`خطا در دریافت محصولات: ${dbError?.message || "خطای نامشخص"}`, 500, "DATABASE_ERROR", ("TURBOPACK compile-time truthy", 1) ? dbError : "TURBOPACK unreachable");
        }
        // Parse JSON fields (PostgreSQL JSONB returns objects, not strings)
        const parsedProducts = products.map((p)=>({
                ...p,
                images: Array.isArray(p.images) ? p.images : typeof p.images === 'string' ? JSON.parse(p.images) : [],
                tags: Array.isArray(p.tags) ? p.tags : typeof p.tags === 'string' ? JSON.parse(p.tags) : [],
                specifications: typeof p.specifications === 'object' && p.specifications !== null ? p.specifications : typeof p.specifications === 'string' ? JSON.parse(p.specifications) : {},
                price: Number(p.price),
                originalPrice: p.originalPrice ? Number(p.originalPrice) : undefined,
                stockCount: Number(p.stockCount),
                inStock: Boolean(p.inStock),
                enabled: Boolean(p.enabled),
                vinEnabled: Boolean(p.vinEnabled),
                airShippingEnabled: Boolean(p.airShippingEnabled),
                seaShippingEnabled: Boolean(p.seaShippingEnabled),
                airShippingCost: p.airShippingCost !== null && p.airShippingCost !== undefined ? Number(p.airShippingCost) : null,
                seaShippingCost: p.seaShippingCost !== null && p.seaShippingCost !== undefined ? Number(p.seaShippingCost) : null,
                createdAt: p.createdAt instanceof Date ? p.createdAt : new Date(p.createdAt),
                updatedAt: p.updatedAt instanceof Date ? p.updatedAt : new Date(p.updatedAt)
            }));
        const totalPages = Math.ceil(total / limit);
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$route$2d$helpers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createSuccessResponse"])(parsedProducts, 200, {
            page,
            limit,
            total,
            totalPages
        });
    } catch (error) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$route$2d$helpers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createErrorResponse"])(error);
    }
}
async function POST(request) {
    try {
        const body = await request.json().catch(()=>{
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$error$2d$handler$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["AppError"]("Invalid JSON in request body", 400, "INVALID_JSON");
        });
        // Check if this is a create request (has name and price) or filter request (has filters property)
        if (body.name && body.price !== undefined && !body.filters) {
            // This is a create request
            const { name, description, price, originalPrice, brand, category, vin, vinEnabled, airShippingEnabled, seaShippingEnabled, airShippingCost, seaShippingCost, stockCount, inStock, enabled, images, tags, specifications } = body;
            // Validation
            if (!name || typeof name !== "string" || name.trim() === "") {
                throw new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$error$2d$handler$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["AppError"]("نام محصول الزامی است", 400, "MISSING_NAME");
            }
            if (!description || typeof description !== "string" || description.trim() === "") {
                throw new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$error$2d$handler$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["AppError"]("توضیحات محصول الزامی است", 400, "MISSING_DESCRIPTION");
            }
            if (price === undefined || typeof price !== "number" || price < 0) {
                throw new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$error$2d$handler$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["AppError"]("قیمت محصول الزامی است و باید مثبت باشد", 400, "INVALID_PRICE");
            }
            if (!brand || typeof brand !== "string" || brand.trim() === "") {
                throw new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$error$2d$handler$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["AppError"]("برند محصول الزامی است", 400, "MISSING_BRAND");
            }
            if (!category || typeof category !== "string" || category.trim() === "") {
                throw new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$error$2d$handler$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["AppError"]("دسته‌بندی محصول الزامی است", 400, "MISSING_CATEGORY");
            }
            if (!images || !Array.isArray(images) || images.length === 0) {
                throw new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$error$2d$handler$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["AppError"]("حداقل یک تصویر الزامی است", 400, "MISSING_IMAGES");
            }
            const id = `product-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            const now = new Date().toISOString();
            // Prepare data for database
            const productData = {
                id,
                name: name.trim(),
                description: description.trim(),
                price: Math.round(price),
                originalPrice: originalPrice ? Math.round(originalPrice) : null,
                brand: brand.trim(),
                category: category.trim(),
                vin: vin && vinEnabled ? vin.trim() : null,
                vinEnabled: vinEnabled ? true : false,
                airShippingEnabled: typeof airShippingEnabled === "boolean" ? airShippingEnabled : airShippingEnabled === true || airShippingEnabled === "true" || airShippingEnabled === 1,
                seaShippingEnabled: typeof seaShippingEnabled === "boolean" ? seaShippingEnabled : seaShippingEnabled === true || seaShippingEnabled === "true" || seaShippingEnabled === 1,
                airShippingCost: airShippingCost !== undefined && airShippingCost !== null ? Math.max(0, Math.round(airShippingCost)) : null,
                seaShippingCost: seaShippingCost !== undefined && seaShippingCost !== null ? Math.max(0, Math.round(seaShippingCost)) : null,
                stockCount: Math.max(0, Math.round(stockCount || 0)),
                inStock: inStock !== false,
                enabled: enabled !== false,
                images: images,
                tags: tags && Array.isArray(tags) ? tags : [],
                specifications: specifications && typeof specifications === "object" ? specifications : {},
                createdAt: now,
                updatedAt: now
            };
            // Insert into database (wrapper will convert ? to $1, $2, etc. for PostgreSQL)
            try {
                const insertResult = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["runQuery"])(`INSERT INTO products (id, name, description, price, "originalPrice", brand, category, vin, "vinEnabled", "airShippingEnabled", "seaShippingEnabled", "airShippingCost", "seaShippingCost", "stockCount", "inStock", enabled, images, tags, specifications, "createdAt", "updatedAt")
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?::jsonb, ?::jsonb, ?::jsonb, ?, ?)`, [
                    productData.id,
                    productData.name,
                    productData.description,
                    productData.price,
                    productData.originalPrice,
                    productData.brand,
                    productData.category,
                    productData.vin,
                    productData.vinEnabled,
                    productData.airShippingEnabled,
                    productData.seaShippingEnabled,
                    productData.airShippingCost,
                    productData.seaShippingCost,
                    productData.stockCount,
                    productData.inStock,
                    productData.enabled,
                    JSON.stringify(productData.images),
                    JSON.stringify(productData.tags),
                    JSON.stringify(productData.specifications),
                    productData.createdAt,
                    productData.updatedAt
                ]);
                __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logger"].debug("Product inserted successfully:", {
                    id,
                    changes: insertResult.changes
                });
            } catch (insertError) {
                __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logger"].error("Error inserting product:", insertError);
                throw new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$error$2d$handler$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["AppError"](`خطا در ذخیره محصول: ${insertError?.message || "خطای نامشخص"}`, 500, "INSERT_ERROR", ("TURBOPACK compile-time truthy", 1) ? insertError : "TURBOPACK unreachable");
            }
            // Get the created product
            const newProduct = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getRow"])("SELECT * FROM products WHERE id = ?", [
                id
            ]);
            if (!newProduct) {
                __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logger"].error("Product not found after insert:", id);
                throw new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$error$2d$handler$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["AppError"]("محصول ایجاد شد اما پیدا نشد", 500, "PRODUCT_NOT_FOUND");
            }
            // Parse JSON fields (PostgreSQL JSONB returns objects, not strings)
            const parsedProduct = {
                ...newProduct,
                images: Array.isArray(newProduct.images) ? newProduct.images : typeof newProduct.images === 'string' ? JSON.parse(newProduct.images) : [],
                tags: Array.isArray(newProduct.tags) ? newProduct.tags : typeof newProduct.tags === 'string' ? JSON.parse(newProduct.tags) : [],
                specifications: typeof newProduct.specifications === 'object' && newProduct.specifications !== null ? newProduct.specifications : typeof newProduct.specifications === 'string' ? JSON.parse(newProduct.specifications) : {},
                price: Number(newProduct.price),
                originalPrice: newProduct.originalPrice ? Number(newProduct.originalPrice) : undefined,
                stockCount: Number(newProduct.stockCount),
                inStock: Boolean(newProduct.inStock),
                enabled: Boolean(newProduct.enabled),
                vinEnabled: Boolean(newProduct.vinEnabled),
                airShippingEnabled: Boolean(newProduct.airShippingEnabled),
                seaShippingEnabled: Boolean(newProduct.seaShippingEnabled),
                airShippingCost: newProduct.airShippingCost !== null && newProduct.airShippingCost !== undefined ? Number(newProduct.airShippingCost) : null,
                seaShippingCost: newProduct.seaShippingCost !== null && newProduct.seaShippingCost !== undefined ? Number(newProduct.seaShippingCost) : null,
                createdAt: newProduct.createdAt instanceof Date ? newProduct.createdAt : new Date(newProduct.createdAt),
                updatedAt: newProduct.updatedAt instanceof Date ? newProduct.updatedAt : new Date(newProduct.updatedAt)
            };
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$route$2d$helpers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createSuccessResponse"])(parsedProduct, 201);
        }
        // This is a filter request
        const filters = body.filters || body || {};
        const page = Math.max(1, parseInt(body.page || "1", 10));
        const limit = Math.min(100, Math.max(1, parseInt(body.limit || "50", 10)));
        const offset = (page - 1) * limit;
        // Build WHERE clause for filters
        let whereClause = "WHERE enabled = TRUE";
        const params = [];
        // Apply filters
        if (filters.vin) {
            // VIN search - exact match and case-insensitive
            whereClause += " AND vinEnabled = TRUE AND UPPER(vin) = UPPER(?)";
            params.push(filters.vin.trim());
        } else if (filters.search) {
            // Search in multiple fields - case-insensitive
            const searchTerm = `%${filters.search.trim()}%`;
            whereClause += " AND (UPPER(name) LIKE UPPER(?) OR UPPER(description) LIKE UPPER(?) OR UPPER(brand) LIKE UPPER(?) OR UPPER(category) LIKE UPPER(?) OR UPPER(vin) LIKE UPPER(?))";
            params.push(searchTerm, searchTerm, searchTerm, searchTerm, searchTerm);
        }
        if (filters.minPrice !== undefined) {
            whereClause += " AND price >= ?";
            params.push(filters.minPrice);
        }
        if (filters.maxPrice !== undefined) {
            whereClause += " AND price <= ?";
            params.push(filters.maxPrice);
        }
        if (filters.brands && filters.brands.length > 0) {
            whereClause += ` AND brand IN (${filters.brands.map(()=>"?").join(",")})`;
            params.push(...filters.brands);
        }
        if (filters.categories && filters.categories.length > 0) {
            whereClause += ` AND category IN (${filters.categories.map(()=>"?").join(",")})`;
            params.push(...filters.categories);
        }
        if (filters.inStock !== undefined) {
            whereClause += " AND inStock = ?";
            params.push(filters.inStock ? true : false);
        }
        // Get total count with filters
        const countQuery = `SELECT COUNT(*) as count FROM products ${whereClause}`;
        const countResult = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getRows"])(countQuery, params);
        const total = countResult[0]?.count || 0;
        // Get paginated products (wrapper will convert ? to $1, $2, etc. for PostgreSQL)
        const dataQuery = `SELECT * FROM products ${whereClause} ORDER BY "createdAt" DESC LIMIT ? OFFSET ?`;
        const products = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getRows"])(dataQuery, [
            ...params,
            limit,
            offset
        ]);
        // Parse JSON fields (PostgreSQL JSONB returns objects, not strings)
        const parsedProducts = products.map((p)=>({
                ...p,
                images: Array.isArray(p.images) ? p.images : typeof p.images === 'string' ? JSON.parse(p.images) : [],
                tags: Array.isArray(p.tags) ? p.tags : typeof p.tags === 'string' ? JSON.parse(p.tags) : [],
                specifications: typeof p.specifications === 'object' && p.specifications !== null ? p.specifications : typeof p.specifications === 'string' ? JSON.parse(p.specifications) : {},
                price: Number(p.price),
                originalPrice: p.originalPrice ? Number(p.originalPrice) : undefined,
                stockCount: Number(p.stockCount),
                inStock: Boolean(p.inStock),
                enabled: Boolean(p.enabled),
                vinEnabled: Boolean(p.vinEnabled),
                airShippingEnabled: Boolean(p.airShippingEnabled),
                seaShippingEnabled: Boolean(p.seaShippingEnabled),
                airShippingCost: p.airShippingCost !== null && p.airShippingCost !== undefined ? Number(p.airShippingCost) : null,
                seaShippingCost: p.seaShippingCost !== null && p.seaShippingCost !== undefined ? Number(p.seaShippingCost) : null,
                createdAt: p.createdAt instanceof Date ? p.createdAt : new Date(p.createdAt),
                updatedAt: p.updatedAt instanceof Date ? p.updatedAt : new Date(p.updatedAt)
            }));
        const totalPages = Math.ceil(total / limit);
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$route$2d$helpers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createSuccessResponse"])(parsedProducts, 200, {
            page,
            limit,
            total,
            totalPages
        });
    } catch (error) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$route$2d$helpers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createErrorResponse"])(error);
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__4b53990b._.js.map