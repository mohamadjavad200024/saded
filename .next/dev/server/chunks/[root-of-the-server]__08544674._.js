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
"[project]/app/api/chat/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/logger.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$rate$2d$limit$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/rate-limit.ts [app-route] (ecmascript)");
;
;
;
;
;
;
async function POST(request) {
    // Rate limiting: 20 requests per minute per IP
    const rateLimitResponse = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$rate$2d$limit$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["rateLimit"])(20, 60000)(request);
    if (rateLimitResponse) {
        return rateLimitResponse;
    }
    try {
        const body = await request.json().catch(()=>{
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$error$2d$handler$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["AppError"]("Invalid JSON in request body", 400, "INVALID_JSON");
        });
        const { customerInfo, messages } = body;
        if (!customerInfo || !customerInfo.name || !customerInfo.phone) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$error$2d$handler$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["AppError"]("اطلاعات مشتری الزامی است", 400, "MISSING_CUSTOMER_INFO");
        }
        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$error$2d$handler$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["AppError"]("حداقل یک پیام الزامی است", 400, "MISSING_MESSAGES");
        }
        // Ensure tables exist (create in order to handle foreign keys)
        try {
            // Create chats table first
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["runQuery"])(`
        CREATE TABLE IF NOT EXISTS quick_buy_chats (
          id VARCHAR(255) PRIMARY KEY,
          customerName VARCHAR(255) NOT NULL,
          customerPhone VARCHAR(255) NOT NULL,
          customerEmail VARCHAR(255),
          status VARCHAR(50) NOT NULL DEFAULT 'active',
          createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        );
      `);
            // Create messages table (depends on chats)
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["runQuery"])(`
        CREATE TABLE IF NOT EXISTS chat_messages (
          id VARCHAR(255) PRIMARY KEY,
          chatId VARCHAR(255) NOT NULL,
          text TEXT,
          sender VARCHAR(50) NOT NULL,
          attachments JSON DEFAULT '[]',
          status VARCHAR(50) DEFAULT 'sent',
          createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          INDEX idx_chat_messages_chatId (chatId),
          FOREIGN KEY (chatId) REFERENCES quick_buy_chats(id) ON DELETE CASCADE
        );
      `);
            // Create attachments table (depends on messages)
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["runQuery"])(`
        CREATE TABLE IF NOT EXISTS chat_attachments (
          id VARCHAR(255) PRIMARY KEY,
          messageId VARCHAR(255) NOT NULL,
          type VARCHAR(50) NOT NULL,
          filePath VARCHAR(500),
          fileName VARCHAR(255),
          fileSize BIGINT,
          fileUrl VARCHAR(500),
          createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          INDEX idx_chat_attachments_messageId (messageId),
          FOREIGN KEY (messageId) REFERENCES chat_messages(id) ON DELETE CASCADE
        );
      `);
        } catch (createError) {
            if (createError?.code !== "ER_TABLE_EXISTS_ERROR" && !createError?.message?.includes("already exists") && !createError?.message?.includes("Duplicate")) {
                __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logger"].error("Error creating chat tables:", createError);
            }
        }
        // Check if chatId is provided (for updating existing chat)
        const providedChatId = body.chatId;
        let chatId;
        const now = new Date().toISOString();
        if (providedChatId) {
            // Update existing chat
            chatId = providedChatId;
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["runQuery"])(`UPDATE quick_buy_chats 
         SET updatedAt = ? 
         WHERE id = ?`, [
                now,
                chatId
            ]);
        } else {
            // Create new chat
            chatId = `chat-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["runQuery"])(`INSERT INTO quick_buy_chats (id, customerName, customerPhone, customerEmail, status, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?, ?, ?)`, [
                chatId,
                customerInfo.name.trim(),
                customerInfo.phone.trim(),
                customerInfo.email?.trim() || null,
                "active",
                now,
                now
            ]);
        }
        // Get existing message IDs to avoid duplicates
        const existingMessages = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getRows"])(`SELECT id FROM chat_messages WHERE chatId = ?`, [
            chatId
        ]);
        const existingMessageIds = new Set(existingMessages.map((m)=>m.id));
        // Save messages and their attachments
        const savedMessages = [];
        for (const message of messages){
            const messageId = message.id || `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            const messageCreatedAt = message.timestamp ? new Date(message.timestamp).toISOString() : now;
            const isNewMessage = !existingMessageIds.has(messageId);
            // Filter attachments to only include valid URLs (not blob/data URLs)
            const validAttachments = message.attachments && Array.isArray(message.attachments) ? message.attachments.filter((att)=>{
                const url = att.url || att.fileUrl || att.filePath;
                const isValid = url && !url.startsWith('blob:') && !url.startsWith('data:') && (url.startsWith('http') || url.startsWith('/'));
                if (!isValid && url) {
                    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logger"].warn(`Filtered out invalid attachment URL for message ${messageId}:`, {
                        url,
                        attachment: att
                    });
                }
                return isValid;
            }) : [];
            // Log attachments being saved (only in development)
            if (validAttachments.length > 0) {
                __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logger"].debug(`💾 Saving ${validAttachments.length} attachment(s) for message ${messageId}:`, validAttachments.map((att)=>({
                        id: att.id,
                        type: att.type,
                        url: att.url || att.fileUrl,
                        name: att.name
                    })));
            }
            // Get message status from request or default based on sender
            const messageStatus = message.status || (message.sender === "user" ? "sent" : null);
            // Save message using UPSERT to avoid duplicates
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["runQuery"])(`INSERT INTO chat_messages (id, chatId, text, sender, attachments, status, createdAt)
         VALUES (?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
           text = VALUES(text),
           attachments = VALUES(attachments),
           status = COALESCE(VALUES(status), chat_messages.status)`, [
                messageId,
                chatId,
                message.text || null,
                message.sender,
                JSON.stringify(validAttachments),
                messageStatus,
                messageCreatedAt
            ]);
            // ALWAYS save attachments, even if message already exists (important for images)
            if (validAttachments && Array.isArray(validAttachments) && validAttachments.length > 0) {
                for (const attachment of validAttachments){
                    // Ensure we have a valid URL for the attachment
                    const attachmentUrl = attachment.url || attachment.fileUrl || null;
                    if (attachmentUrl && !attachmentUrl.startsWith('blob:') && !attachmentUrl.startsWith('data:')) {
                        // Only save if URL is not a blob URL or data URL (those are temporary)
                        // Ensure we have a valid type
                        const attachmentType = attachment.type || (attachmentUrl.includes("image-") ? "image" : attachmentUrl.includes("audio-") ? "audio" : "file");
                        try {
                            // First, check if attachment with this URL already exists for this message
                            const existingAttachment = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getRow"])(`SELECT id FROM chat_attachments WHERE messageId = ? AND fileUrl = ?`, [
                                messageId,
                                attachmentUrl
                            ]);
                            const attachmentId = existingAttachment?.id || attachment.id || `att-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
                            if (existingAttachment) {
                                // Update existing attachment
                                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["runQuery"])(`UPDATE chat_attachments 
                   SET type = ?, fileName = ?, fileSize = ?, fileUrl = ?
                   WHERE id = ?`, [
                                    attachmentType,
                                    attachment.name || null,
                                    attachment.size || null,
                                    attachmentUrl,
                                    attachmentId
                                ]);
                                __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logger"].debug(`Updated existing attachment ${attachmentId} for message ${messageId}:`, {
                                    type: attachmentType,
                                    url: attachmentUrl,
                                    name: attachment.name
                                });
                            } else {
                                // Insert new attachment
                                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["runQuery"])(`INSERT INTO chat_attachments (id, messageId, type, filePath, fileName, fileSize, fileUrl, createdAt)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, [
                                    attachmentId,
                                    messageId,
                                    attachmentType,
                                    attachmentUrl,
                                    attachment.name || null,
                                    attachment.size || null,
                                    attachmentUrl,
                                    now
                                ]);
                                __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logger"].debug(`Saved new attachment ${attachmentId} for message ${messageId}:`, {
                                    type: attachmentType,
                                    originalType: attachment.type,
                                    url: attachmentUrl,
                                    name: attachment.name
                                });
                            }
                        } catch (error) {
                            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logger"].error(`Error saving attachment for message ${messageId}:`, error);
                        }
                    } else if (!attachmentUrl) {
                        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logger"].warn(`Attachment has no URL, skipping database save:`, attachment);
                    } else {
                        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logger"].warn(`Attachment has temporary URL (blob/data), skipping database save:`, attachmentUrl);
                    }
                }
            }
            // Get the saved message with status from database
            const savedMessage = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getRow"])(`SELECT id, status FROM chat_messages WHERE id = ?`, [
                messageId
            ]);
            savedMessages.push({
                id: messageId,
                chatId,
                text: message.text,
                sender: message.sender,
                attachments: message.attachments || [],
                createdAt: messageCreatedAt,
                status: savedMessage?.status || messageStatus
            });
        }
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$route$2d$helpers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createSuccessResponse"])({
            chatId,
            messages: savedMessages
        });
    } catch (error) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$route$2d$helpers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createErrorResponse"])(error);
    }
}
async function GET(request) {
    // Rate limiting: 120 requests per minute per IP (increased for polling - allows 2 requests per second)
    const rateLimitResponse = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$rate$2d$limit$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["rateLimit"])(120, 60000)(request);
    if (rateLimitResponse) {
        return rateLimitResponse;
    }
    try {
        const { searchParams } = new URL(request.url);
        const chatId = searchParams.get("chatId");
        const lastMessageId = searchParams.get("lastMessageId"); // For polling new messages
        const since = searchParams.get("since"); // ISO timestamp for polling
        if (chatId) {
            // Get single chat with messages
            let chat;
            try {
                chat = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getRow"])(`SELECT * FROM quick_buy_chats WHERE id = ?`, [
                    chatId
                ]);
            } catch (dbError) {
                // If table doesn't exist, return 404
                if (dbError?.code === "ER_NO_SUCH_TABLE" || dbError?.message?.includes("doesn't exist") || dbError?.message?.includes("does not exist")) {
                    throw new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$error$2d$handler$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["AppError"]("چت یافت نشد", 404, "CHAT_NOT_FOUND");
                }
                throw dbError;
            }
            if (!chat) {
                throw new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$error$2d$handler$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["AppError"]("چت یافت نشد", 404, "CHAT_NOT_FOUND");
            }
            // Build query based on polling parameters
            const page = parseInt(searchParams.get("page") || "1", 10);
            const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "50", 10)));
            const offset = (page - 1) * limit;
            let messagesQuery = `SELECT * FROM chat_messages WHERE chatId = ?`;
            const queryParams = [
                chatId
            ];
            if (lastMessageId) {
                // Get messages after the last known message ID (for polling)
                // First get the createdAt of the last message, then get messages after that time
                const lastMessage = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getRow"])(`SELECT createdAt FROM chat_messages WHERE id = ?`, [
                    lastMessageId
                ]);
                if (lastMessage) {
                    messagesQuery += ` AND createdAt > ? ORDER BY createdAt ASC LIMIT ?`;
                    queryParams.push(lastMessage.createdAt, limit);
                } else {
                    // Fallback: use id comparison if createdAt not found
                    messagesQuery += ` AND id != ? ORDER BY createdAt ASC LIMIT ?`;
                    queryParams.push(lastMessageId, limit);
                }
            } else if (since) {
                // Get messages after a specific timestamp (for polling)
                messagesQuery += ` AND createdAt > ? ORDER BY createdAt ASC LIMIT ?`;
                queryParams.push(since, limit);
            } else {
                // Get paginated messages (for initial load)
                messagesQuery += ` ORDER BY createdAt DESC LIMIT ? OFFSET ?`;
                queryParams.push(limit, offset);
            }
            let messages = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getRows"])(messagesQuery, queryParams);
            // If not polling, reverse order to show newest first (but we fetched DESC, so reverse)
            if (!lastMessageId && !since) {
                messages = messages.reverse();
            }
            // Optimize: Get all attachments in one query instead of N+1 queries
            const messageIds = messages.map((m)=>m.id);
            let allDbAttachments = [];
            if (messageIds.length > 0) {
                try {
                    // Use IN clause to get all attachments in one query
                    const placeholders = messageIds.map(()=>'?').join(',');
                    allDbAttachments = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getRows"])(`SELECT * FROM chat_attachments WHERE messageId IN (${placeholders})`, messageIds);
                } catch (error) {
                    // If table doesn't exist, continue with empty attachments
                    if (error?.code === "ER_NO_SUCH_TABLE" || error?.message?.includes("doesn't exist") || error?.message?.includes("does not exist")) {
                        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logger"].warn("Chat attachments table does not exist yet, continuing without attachments");
                        allDbAttachments = [];
                    } else {
                        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logger"].error("Error fetching attachments:", error);
                        allDbAttachments = [];
                    }
                }
            }
            // Group attachments by messageId for O(1) lookup
            const attachmentsByMessageId = new Map();
            allDbAttachments.forEach((att)=>{
                if (!attachmentsByMessageId.has(att.messageId)) {
                    attachmentsByMessageId.set(att.messageId, []);
                }
                attachmentsByMessageId.get(att.messageId).push(att);
            });
            // Process messages and merge attachments
            for (const message of messages){
                // First try to get attachments from JSON field
                let jsonAttachments = [];
                if (message.attachments) {
                    if (Array.isArray(message.attachments)) {
                        // Already an array (MySQL JSON returns as array)
                        jsonAttachments = message.attachments;
                    } else if (typeof message.attachments === 'string') {
                        // Try to parse if it's a string
                        try {
                            const parsed = JSON.parse(message.attachments);
                            jsonAttachments = Array.isArray(parsed) ? parsed : [
                                parsed
                            ];
                        } catch (e) {
                            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logger"].error(`Error parsing attachments JSON for message ${message.id}:`, e);
                            jsonAttachments = [];
                        }
                    } else if (typeof message.attachments === 'object' && message.attachments !== null) {
                        // Single object, convert to array
                        jsonAttachments = Array.isArray(message.attachments) ? message.attachments : [
                            message.attachments
                        ];
                    }
                }
                // Get attachments from database table (already loaded)
                const dbAttachments = attachmentsByMessageId.get(message.id) || [];
                // Merge attachments - prefer database table attachments (they are more reliable)
                const allAttachments = [];
                const addedUrls = new Set();
                // First add database table attachments (these are the source of truth)
                dbAttachments.forEach((att)=>{
                    if (att.fileUrl && !att.fileUrl.startsWith('blob:') && !att.fileUrl.startsWith('data:')) {
                        // Only add if URL exists and is not a temporary blob/data URL
                        // Ensure type is preserved (important for audio, etc.)
                        allAttachments.push({
                            id: att.id,
                            type: att.type || "file",
                            url: att.fileUrl,
                            name: att.fileName,
                            size: att.fileSize
                        });
                        addedUrls.add(att.fileUrl);
                    }
                });
                // Then add JSON attachments if not already in database and not temporary URLs
                if (Array.isArray(jsonAttachments) && jsonAttachments.length > 0) {
                    jsonAttachments.forEach((att)=>{
                        const attachmentUrl = att.url || att.fileUrl || att.filePath;
                        // Skip if URL is temporary or already added
                        if (attachmentUrl && !attachmentUrl.startsWith('blob:') && !attachmentUrl.startsWith('data:') && !addedUrls.has(attachmentUrl)) {
                            // Check if we already have this attachment by URL (even if ID is different)
                            const existingByUrl = allAttachments.find((a)=>a.url === attachmentUrl);
                            if (!existingByUrl) {
                                allAttachments.push({
                                    id: att.id || `att-${Date.now()}-${Math.random()}`,
                                    type: att.type || "file",
                                    url: attachmentUrl,
                                    name: att.name || att.fileName,
                                    size: att.size || att.fileSize,
                                    duration: att.duration
                                });
                                addedUrls.add(attachmentUrl);
                            }
                        }
                    });
                }
                message.attachments = allAttachments;
            }
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$route$2d$helpers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createSuccessResponse"])({
                chat,
                messages
            });
        } else {
            // Check if we should find chat by customer info
            const customerPhone = searchParams.get("customerPhone");
            const customerName = searchParams.get("customerName");
            if (customerPhone) {
                // Find chat by customer phone (and optionally name)
                let chat;
                if (customerName) {
                    chat = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getRow"])(`SELECT * FROM quick_buy_chats 
             WHERE customerPhone = ? AND customerName = ? 
             ORDER BY createdAt DESC LIMIT 1`, [
                        customerPhone,
                        customerName
                    ]);
                } else {
                    chat = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getRow"])(`SELECT * FROM quick_buy_chats 
             WHERE customerPhone = ? 
             ORDER BY createdAt DESC LIMIT 1`, [
                        customerPhone
                    ]);
                }
                if (chat) {
                    // Get messages for this chat
                    const messages = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getRows"])(`SELECT * FROM chat_messages WHERE chatId = ? ORDER BY createdAt ASC`, [
                        chat.id
                    ]);
                    // Optimize: Get all attachments in one query instead of N+1 queries
                    const messageIds = messages.map((m)=>m.id);
                    let allDbAttachments = [];
                    if (messageIds.length > 0) {
                        try {
                            // Use IN clause to get all attachments in one query
                            const placeholders = messageIds.map(()=>'?').join(',');
                            allDbAttachments = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getRows"])(`SELECT * FROM chat_attachments WHERE messageId IN (${placeholders})`, messageIds);
                        } catch (error) {
                            // If table doesn't exist, continue with empty attachments
                            if (error?.code === "ER_NO_SUCH_TABLE" || error?.message?.includes("doesn't exist") || error?.message?.includes("does not exist")) {
                                __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logger"].warn("Chat attachments table does not exist yet, continuing without attachments");
                                allDbAttachments = [];
                            } else {
                                __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logger"].error("Error fetching attachments:", error);
                                allDbAttachments = [];
                            }
                        }
                    }
                    // Group attachments by messageId for O(1) lookup
                    const attachmentsByMessageId = new Map();
                    allDbAttachments.forEach((att)=>{
                        if (!attachmentsByMessageId.has(att.messageId)) {
                            attachmentsByMessageId.set(att.messageId, []);
                        }
                        attachmentsByMessageId.get(att.messageId).push(att);
                    });
                    // Process messages and merge attachments
                    for (const message of messages){
                        // First try to get attachments from JSON field
                        let jsonAttachments = [];
                        if (message.attachments) {
                            if (Array.isArray(message.attachments)) {
                                // MySQL JSON returns as array
                                jsonAttachments = message.attachments;
                            } else if (typeof message.attachments === 'string') {
                                // Try to parse if it's a string
                                try {
                                    const parsed = JSON.parse(message.attachments);
                                    jsonAttachments = Array.isArray(parsed) ? parsed : [
                                        parsed
                                    ];
                                } catch (e) {
                                    // Only log in development
                                    if ("TURBOPACK compile-time truthy", 1) {
                                        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logger"].error(`Error parsing attachments JSON for message ${message.id}:`, e);
                                    }
                                    jsonAttachments = [];
                                }
                            } else if (typeof message.attachments === 'object' && message.attachments !== null) {
                                // Single object, convert to array
                                jsonAttachments = Array.isArray(message.attachments) ? message.attachments : [
                                    message.attachments
                                ];
                            }
                        }
                        // Get attachments from database table (already loaded)
                        const dbAttachments = attachmentsByMessageId.get(message.id) || [];
                        // Merge attachments - prefer database table attachments (they are more reliable)
                        const allAttachments = [];
                        const addedUrls = new Set();
                        // First add database table attachments (these are the source of truth)
                        dbAttachments.forEach((att)=>{
                            if (att.fileUrl && !att.fileUrl.startsWith('blob:') && !att.fileUrl.startsWith('data:')) {
                                // Only add if URL exists and is not a temporary blob/data URL
                                // Ensure type is preserved (important for audio, etc.)
                                allAttachments.push({
                                    id: att.id,
                                    type: att.type || "file",
                                    url: att.fileUrl,
                                    name: att.fileName,
                                    size: att.fileSize
                                });
                                addedUrls.add(att.fileUrl);
                            }
                        });
                        // Then add JSON attachments if not already in database and not temporary URLs
                        if (Array.isArray(jsonAttachments) && jsonAttachments.length > 0) {
                            jsonAttachments.forEach((att)=>{
                                const attachmentUrl = att.url || att.fileUrl || att.filePath;
                                // Skip if URL is temporary or already added
                                if (attachmentUrl && !attachmentUrl.startsWith('blob:') && !attachmentUrl.startsWith('data:') && !addedUrls.has(attachmentUrl)) {
                                    // Check if we already have this attachment by URL (even if ID is different)
                                    const existingByUrl = allAttachments.find((a)=>a.url === attachmentUrl);
                                    if (!existingByUrl) {
                                        allAttachments.push({
                                            id: att.id || `att-${Date.now()}-${Math.random()}`,
                                            type: att.type || "file",
                                            url: attachmentUrl,
                                            name: att.name || att.fileName,
                                            size: att.size || att.fileSize,
                                            duration: att.duration
                                        });
                                        addedUrls.add(attachmentUrl);
                                    }
                                }
                            });
                        }
                        message.attachments = allAttachments;
                    }
                    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$route$2d$helpers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createSuccessResponse"])({
                        chat,
                        messages
                    });
                } else {
                    // No chat found
                    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$route$2d$helpers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createSuccessResponse"])({
                        chat: null,
                        messages: []
                    });
                }
            } else {
                // Get list of chats
                try {
                    // Try cache first (cache for 10 seconds since chat list changes frequently)
                    const cacheKey = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$cache$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cacheKeys"].chatList();
                    const cached = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$cache$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cache"].get(cacheKey);
                    if (cached) {
                        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$route$2d$helpers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createSuccessResponse"])({
                            chats: cached
                        });
                    }
                    const chats = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getRows"])(`SELECT * FROM quick_buy_chats ORDER BY createdAt DESC LIMIT 50`);
                    // Optimize: Get unread counts for all chats in one query using GROUP BY
                    const chatIds = chats.map((c)=>c.id);
                    let unreadCountsMap = new Map();
                    if (chatIds.length > 0) {
                        try {
                            // Use IN clause with GROUP BY to get all unread counts in one query
                            const placeholders = chatIds.map(()=>'?').join(',');
                            const unreadCounts = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getRows"])(`SELECT chatId, COUNT(*) as count 
                 FROM chat_messages 
                 WHERE chatId IN (${placeholders})
                   AND sender = 'user' 
                   AND (status IS NULL OR (status != 'read' AND status IN ('sent', 'delivered', 'sending')))
                 GROUP BY chatId`, chatIds);
                            // Create map for O(1) lookup
                            unreadCounts.forEach((result)=>{
                                unreadCountsMap.set(result.chatId, parseInt(result.count || "0", 10));
                            });
                        } catch (error) {
                            // If table doesn't exist or other error, continue with 0 counts
                            if (error?.code === "ER_NO_SUCH_TABLE" || error?.message?.includes("doesn't exist") || error?.message?.includes("does not exist")) {
                                __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logger"].warn("Chat messages table does not exist yet, using 0 unread counts");
                            } else if ("TURBOPACK compile-time truthy", 1) {
                                __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logger"].error(`Error getting unread counts:`, error);
                            }
                        }
                    }
                    // Map chats with unread counts
                    const chatsWithUnreadCount = chats.map((chat)=>({
                            ...chat,
                            unreadCount: unreadCountsMap.get(chat.id) || 0
                        }));
                    // Cache the result for 10 seconds
                    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$cache$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cache"].set(cacheKey, chatsWithUnreadCount, 10000);
                    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$route$2d$helpers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createSuccessResponse"])({
                        chats: chatsWithUnreadCount
                    });
                } catch (dbError) {
                    // If table doesn't exist, return empty array instead of error
                    if (dbError?.code === "ER_NO_SUCH_TABLE" || dbError?.message?.includes("doesn't exist") || dbError?.message?.includes("does not exist")) {
                        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logger"].warn("Chat table does not exist yet, returning empty chats list");
                        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$route$2d$helpers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createSuccessResponse"])({
                            chats: []
                        });
                    }
                    throw dbError;
                }
            }
        }
    } catch (error) {
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logger"].error("[GET /api/chat] Error:", error);
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$route$2d$helpers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createErrorResponse"])(error);
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__08544674._.js.map