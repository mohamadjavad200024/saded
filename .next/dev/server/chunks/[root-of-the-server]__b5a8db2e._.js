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
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
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
var __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/crypto [external] (crypto, cjs)");
;
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
    const candidates = [
        request.headers.get("x-forwarded-for")?.split(",")[0]?.trim(),
        request.headers.get("x-real-ip")?.trim(),
        request.headers.get("cf-connecting-ip")?.trim(),
        request.headers.get("true-client-ip")?.trim(),
        request.headers.get("fastly-client-ip")?.trim(),
        request.headers.get("x-client-ip")?.trim()
    ].filter(Boolean);
    const ip = candidates[0] || "unknown";
    // If we can't detect an IP, avoid collapsing ALL users into the same "unknown" bucket.
    // This is not a security boundary; it's just to reduce false-positive 429s in hosts that don't pass client IP headers.
    if (ip === "unknown") {
        const ua = request.headers.get("user-agent") || "unknown-ua";
        const uaHash = __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["default"].createHash("sha256").update(ua).digest("hex").slice(0, 12);
        return `unknown:${uaHash}`;
    }
    return ip;
}
function rateLimit(maxRequests = 100, windowMs = 60000, keyGenerator) {
    return async (request)=>{
        const key = keyGenerator ? keyGenerator(request) : getClientId(request);
        // IMPORTANT:
        // Include HTTP method in the key so GET polling does NOT consume POST quotas on the same path.
        // Example: /api/chat uses GET polling frequently; without method separation, POST /api/chat would hit 429 unexpectedly.
        const fullKey = `${request.nextUrl.pathname}:${request.method}:${key}`;
        if (rateLimiter.isRateLimited(fullKey, maxRequests, windowMs)) {
            const resetTime = rateLimiter.getResetTime(fullKey);
            const remaining = rateLimiter.getRemaining(fullKey, maxRequests);
            return new Response(JSON.stringify({
                success: false,
                error: "درخواست‌های شما زیاد است. لطفاً کمی بعد دوباره تلاش کنید.",
                code: "RATE_LIMIT_EXCEEDED"
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
    try {
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
    } catch (error) {
        // If database is not available, log but don't throw - allow app to continue
        if (error?.code === 'ECONNRESET' || error?.code === 'PROTOCOL_CONNECTION_LOST' || error?.code === 'ETIMEDOUT' || error?.code === 'ECONNREFUSED' || error?.message?.includes('closed state')) {
            logger.warn("Database connection error in ensureAuthTables, will retry on next request:", error?.code);
            // Don't throw - allow route to continue (it will handle the error)
            return;
        }
        // For other errors, log and rethrow
        logger.error("Error ensuring auth tables:", error);
        throw error;
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
    try {
        await ensureAuthTables();
    } catch (error) {
        // If database is not available, return null (user not authenticated)
        if (error?.code === 'ECONNRESET' || error?.code === 'PROTOCOL_CONNECTION_LOST' || error?.code === 'ETIMEDOUT' || error?.code === 'ECONNREFUSED' || error?.message?.includes('closed state')) {
            logger.warn("Database connection error in getSessionUserFromRequest, returning null:", error?.code);
            return null;
        }
        // For other errors, rethrow
        throw error;
    }
    const tokenHash = sha256Hex(token);
    let row;
    try {
        row = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getRow"])(`SELECT s.id as sessionId, s.userId, s.expiresAt, u.enabled, u.role, u.name, u.phone, u.createdAt
       FROM sessions s
       JOIN users u ON u.id = s.userId
       WHERE s.tokenHash = ?
       LIMIT 1`, [
            tokenHash
        ]);
    } catch (error) {
        // If database is not available, return null (user not authenticated)
        if (error?.code === 'ECONNRESET' || error?.code === 'PROTOCOL_CONNECTION_LOST' || error?.code === 'ETIMEDOUT' || error?.code === 'ECONNREFUSED' || error?.message?.includes('closed state')) {
            logger.warn("Database connection error in getSessionUserFromRequest query, returning null:", error?.code);
            return null;
        }
        // For other errors, rethrow
        throw error;
    }
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
    // Touch session (ignore errors - not critical)
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["runQuery"])(`UPDATE sessions SET lastSeenAt = ? WHERE id = ?`, [
            nowIso(),
            row.sessionId
        ]);
    } catch (error) {
        // Ignore connection errors when touching session - not critical
        if (error?.code === 'ECONNRESET' || error?.code === 'PROTOCOL_CONNECTION_LOST' || error?.code === 'ETIMEDOUT' || error?.code === 'ECONNREFUSED' || error?.message?.includes('closed state')) {
        // Silent ignore - session touch is not critical
        } else {
            // Log other errors but don't fail
            logger.debug("Error touching session (non-critical):", error?.code);
        }
    }
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
"[project]/lib/chat/schema.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ensureChatTables",
    ()=>ensureChatTables,
    "getChatSchemaInfo",
    ()=>getChatSchemaInfo
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/db/index.ts [app-route] (ecmascript)");
;
const CACHE_KEY = "__saded_chat_schema_info";
const TTL_MS = 5 * 60 * 1000;
function getCache() {
    const g = globalThis;
    const v = g[CACHE_KEY];
    if (!v) return null;
    if (typeof v.expiresAt !== "number" || v.expiresAt < Date.now()) return null;
    return v;
}
function setCache(value) {
    const g = globalThis;
    g[CACHE_KEY] = {
        value,
        expiresAt: Date.now() + TTL_MS
    };
}
async function ensureChatTables() {
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["runQuery"])(`
    CREATE TABLE IF NOT EXISTS quick_buy_chats (
      id VARCHAR(255) PRIMARY KEY,
      userId VARCHAR(255) NULL,
      customerName VARCHAR(255) NOT NULL,
      customerPhone VARCHAR(255) NOT NULL,
      customerEmail VARCHAR(255),
      status VARCHAR(50) NOT NULL DEFAULT 'active',
      createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );
  `);
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["runQuery"])(`
    CREATE TABLE IF NOT EXISTS chat_messages (
      id VARCHAR(255) PRIMARY KEY,
      chatId VARCHAR(255) NOT NULL,
      userId VARCHAR(255) NULL,
      text TEXT,
      sender VARCHAR(50) NOT NULL,
      attachments JSON DEFAULT '[]',
      status VARCHAR(50) DEFAULT 'sent',
      createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["runQuery"])(`
    CREATE TABLE IF NOT EXISTS chat_attachments (
      id VARCHAR(255) PRIMARY KEY,
      messageId VARCHAR(255) NOT NULL,
      type VARCHAR(50) NOT NULL,
      filePath VARCHAR(500),
      fileName VARCHAR(255),
      fileSize BIGINT,
      fileUrl VARCHAR(500),
      createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);
    // Best-effort migrations (may fail on limited DB permissions; that's OK)
    try {
        const chatCols = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getRows"])(`SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'quick_buy_chats'`);
        const chatColSet = new Set(chatCols.map((c)=>String(c.COLUMN_NAME)));
        if (!chatColSet.has("userId")) {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["runQuery"])(`ALTER TABLE quick_buy_chats ADD COLUMN userId VARCHAR(255) NULL`);
        }
        try {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["runQuery"])(`CREATE INDEX idx_quick_buy_chats_userId ON quick_buy_chats (userId)`);
        } catch (err) {
            // ignore duplicate key errors (index already exists)
            if (err?.code !== 'ER_DUP_KEYNAME') {
                // Only log non-duplicate errors in development
                if ("TURBOPACK compile-time truthy", 1) {
                    console.debug('Index creation skipped (may already exist):', err?.code);
                }
            }
        }
        try {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["runQuery"])(`CREATE INDEX idx_quick_buy_chats_customerPhone ON quick_buy_chats (customerPhone)`);
        } catch (err) {
            // ignore duplicate key errors (index already exists)
            if (err?.code !== 'ER_DUP_KEYNAME') {
                if ("TURBOPACK compile-time truthy", 1) {
                    console.debug('Index creation skipped (may already exist):', err?.code);
                }
            }
        }
    } catch  {
    // ignore
    }
    try {
        const msgCols = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getRows"])(`SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'chat_messages'`);
        const msgColSet = new Set(msgCols.map((c)=>String(c.COLUMN_NAME)));
        if (!msgColSet.has("userId")) {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["runQuery"])(`ALTER TABLE chat_messages ADD COLUMN userId VARCHAR(255) NULL`);
        }
        try {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["runQuery"])(`CREATE INDEX idx_chat_messages_userId ON chat_messages (userId)`);
        } catch (err) {
            // ignore duplicate key errors (index already exists)
            if (err?.code !== 'ER_DUP_KEYNAME') {
                if ("TURBOPACK compile-time truthy", 1) {
                    console.debug('Index creation skipped (may already exist):', err?.code);
                }
            }
        }
        try {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["runQuery"])(`CREATE INDEX idx_chat_messages_chatId ON chat_messages (chatId)`);
        } catch (err) {
            // ignore duplicate key errors (index already exists)
            if (err?.code !== 'ER_DUP_KEYNAME') {
                if ("TURBOPACK compile-time truthy", 1) {
                    console.debug('Index creation skipped (may already exist):', err?.code);
                }
            }
        }
        if (!msgColSet.has("updatedAt")) {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["runQuery"])(`ALTER TABLE chat_messages ADD COLUMN updatedAt TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP`);
        }
    } catch  {
    // ignore
    }
    // Ensure FK/indexes are present where possible (best-effort)
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["runQuery"])(`ALTER TABLE chat_messages ADD CONSTRAINT fk_chat_messages_chatId FOREIGN KEY (chatId) REFERENCES quick_buy_chats(id) ON DELETE CASCADE`);
    } catch (err) {
        // ignore duplicate constraint errors (constraint already exists)
        if (err?.code !== 'ER_DUP_KEY' && err?.code !== 'ER_CANT_CREATE_TABLE' && err?.code !== 'ER_DUP_ENTRY') {
            if ("TURBOPACK compile-time truthy", 1) {
                console.debug('Foreign key creation skipped (may already exist):', err?.code);
            }
        }
    }
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["runQuery"])(`ALTER TABLE chat_attachments ADD CONSTRAINT fk_chat_attachments_messageId FOREIGN KEY (messageId) REFERENCES chat_messages(id) ON DELETE CASCADE`);
    } catch (err) {
        // ignore duplicate constraint errors (constraint already exists)
        if (err?.code !== 'ER_DUP_KEY' && err?.code !== 'ER_CANT_CREATE_TABLE' && err?.code !== 'ER_DUP_ENTRY') {
            if ("TURBOPACK compile-time truthy", 1) {
                console.debug('Foreign key creation skipped (may already exist):', err?.code);
            }
        }
    }
}
async function getChatSchemaInfo() {
    const cached = getCache();
    if (cached) return cached.value;
    const [chatHasUserId, messageHasUserId] = await Promise.all([
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getRow"])(`SELECT COUNT(*) as cnt
       FROM INFORMATION_SCHEMA.COLUMNS
       WHERE TABLE_SCHEMA = DATABASE()
         AND TABLE_NAME = 'quick_buy_chats'
         AND COLUMN_NAME = 'userId'`).then((r)=>Number(r?.cnt || 0) > 0).catch(()=>false),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getRow"])(`SELECT COUNT(*) as cnt
       FROM INFORMATION_SCHEMA.COLUMNS
       WHERE TABLE_SCHEMA = DATABASE()
         AND TABLE_NAME = 'chat_messages'
         AND COLUMN_NAME = 'userId'`).then((r)=>Number(r?.cnt || 0) > 0).catch(()=>false)
    ]);
    const info = {
        chatHasUserId,
        messageHasUserId
    };
    setCache(info);
    return info;
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
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$session$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/auth/session.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$chat$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/chat/schema.ts [app-route] (ecmascript)");
;
;
;
;
;
;
;
;
async function ensureChatTables() {
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$chat$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ensureChatTables"])();
}
function rateLimitKeyForAuthedUser(request, userId) {
    // Use userId as the primary key for authenticated-only chat endpoints.
    // This prevents false 429s on hosts where client IP is missing (all users become "unknown")
    // and avoids collisions for users behind the same NAT.
    return `user:${userId}`;
}
function createRateLimitResponse(maxRequests, windowMs, fullKey) {
    const resetTime = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$rate$2d$limit$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["rateLimiter"].getResetTime(fullKey);
    const remaining = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$rate$2d$limit$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["rateLimiter"].getRemaining(fullKey, maxRequests);
    return new Response(JSON.stringify({
        success: false,
        error: "درخواست‌های شما زیاد است. لطفاً کمی بعد دوباره تلاش کنید.",
        code: "RATE_LIMIT_EXCEEDED"
    }), {
        status: 429,
        headers: {
            "Content-Type": "application/json",
            "X-RateLimit-Limit": maxRequests.toString(),
            "X-RateLimit-Remaining": remaining.toString(),
            "X-RateLimit-Reset": resetTime?.toString() || "",
            "Retry-After": Math.ceil((resetTime ? resetTime - Date.now() : windowMs) / 1000).toString()
        }
    });
}
async function POST(request) {
    try {
        await ensureChatTables();
        const schema = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$chat$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getChatSchemaInfo"])();
        // Parse body first to check if this is from admin (support)
        const body = await request.json().catch((error)=>{
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logger"].error("[POST /api/chat] JSON parse error:", error);
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$error$2d$handler$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["AppError"]("Invalid JSON in request body", 400, "INVALID_JSON");
        });
        // Check if message is from admin (support)
        const isFromAdmin = body.messages && Array.isArray(body.messages) && body.messages.length > 0 && body.messages[0]?.sender === "support";
        // Authentication required - only registered users can create chats
        // BUT: If message is from admin (support), skip auth check (admin is already authenticated in admin panel)
        let sessionUser = null;
        let isAdmin = false;
        if (!isFromAdmin) {
            // Only check session for non-admin messages
            sessionUser = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$session$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getSessionUserFromRequest"])(request);
            // Fallback: اگر session پیدا نشد اما userId در header ارسال شده (برای development)
            if (!sessionUser && ("TURBOPACK compile-time value", "development") === 'development') {
                const userIdHeader = request.headers.get('x-user-id');
                if (userIdHeader) {
                    console.log('[POST /api/chat] Using userId from header (development fallback):', userIdHeader);
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
                        console.log('[POST /api/chat] Fallback user found:', sessionUser);
                    }
                }
            }
            // Require authentication - no guest users allowed (only for non-admin messages)
            if (!sessionUser) {
                throw new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$error$2d$handler$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["AppError"]("برای ارسال پیام باید وارد حساب کاربری خود شوید", 401, "UNAUTHORIZED");
            }
            isAdmin = sessionUser?.role === "admin";
        } else {
            // For admin messages, try to get session but don't require it
            sessionUser = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$session$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getSessionUserFromRequest"])(request);
            isAdmin = true; // If sender is "support", it's from admin
        }
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logger"].debug("[POST /api/chat] Request from user:", {
            userId: sessionUser?.id,
            phone: sessionUser?.phone,
            role: sessionUser?.role,
            isAdmin,
            isFromAdmin
        });
        // Rate limiting (auth-based): 20 POSTs/min per user (fallback to IP if needed)
        {
            const max = 20;
            const windowMs = 60000;
            const key = sessionUser?.id ? rateLimitKeyForAuthedUser(request, sessionUser.id) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$rate$2d$limit$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getClientId"])(request);
            const fullKey = `${request.nextUrl.pathname}:${request.method}:${key}`;
            if (__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$rate$2d$limit$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["rateLimiter"].isRateLimited(fullKey, max, windowMs)) {
                return createRateLimitResponse(max, windowMs, fullKey);
            }
        }
        // Support both payloads:
        // - { customerInfo: {name, phone, email?}, messages?: [], chatId?: string }
        // - legacy: { customerName, customerPhone, customerEmail } (create chat without messages)
        const providedChatId = body.chatId;
        const customerInfo = body.customerInfo || (body.customerName || body.customerPhone ? {
            name: body.customerName,
            phone: body.customerPhone,
            email: body.customerEmail
        } : null);
        const messages = body.messages;
        const hasMessages = Array.isArray(messages) && messages.length > 0;
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logger"].debug("[POST /api/chat] Request body:", {
            providedChatId,
            hasMessages,
            messageCount: messages?.length || 0,
            hasCustomerInfo: !!customerInfo
        });
        let chatId;
        const now = new Date().toISOString();
        if (providedChatId) {
            // Update existing chat
            chatId = providedChatId;
            const chat = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getRow"])(`SELECT * FROM quick_buy_chats WHERE id = ?`, [
                chatId
            ]);
            if (!chat) {
                // stale chatId: create a new chat for this user
                chatId = `chat-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
                // Use authenticated user info (no guest users allowed)
                // For admin messages, use customerInfo or defaults
                const userName = isFromAdmin ? customerInfo?.name || "کاربر" : sessionUser?.name || customerInfo?.name || "کاربر";
                const userPhone = isFromAdmin ? customerInfo?.phone || "" : sessionUser?.phone || customerInfo?.phone || "";
                const userId = isFromAdmin ? null : sessionUser?.id || null; // For admin, userId can be null
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["runQuery"])(schema.chatHasUserId ? `INSERT INTO quick_buy_chats (id, userId, customerName, customerPhone, customerEmail, status, createdAt, updatedAt)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?)` : `INSERT INTO quick_buy_chats (id, customerName, customerPhone, customerEmail, status, createdAt, updatedAt)
               VALUES (?, ?, ?, ?, ?, ?, ?)`, schema.chatHasUserId ? [
                    chatId,
                    userId,
                    userName,
                    userPhone,
                    customerInfo?.email?.trim() || null,
                    "active",
                    now,
                    now
                ] : [
                    chatId,
                    userName,
                    userPhone,
                    customerInfo?.email?.trim() || null,
                    "active",
                    now,
                    now
                ]);
            } else {
                // Chat exists - verify access
                // For admin: always allow (no need to check, already authenticated)
                // For user: check if they own the chat or claim it
                if (!isAdmin && sessionUser) {
                    const chatUserId = schema.chatHasUserId && chat.userId ? String(chat.userId).trim() : "";
                    // Simple check: if chat has userId, it must match user's id
                    if (schema.chatHasUserId && chatUserId) {
                        if (chatUserId !== sessionUser.id) {
                            throw new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$error$2d$handler$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["AppError"]("شما به این چت دسترسی ندارید", 403, "FORBIDDEN");
                        }
                    } else if (schema.chatHasUserId && !chatUserId) {
                        // Chat has no userId - claim it for the logged-in user
                        try {
                            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["runQuery"])(`UPDATE quick_buy_chats SET userId = ? WHERE id = ?`, [
                                sessionUser.id,
                                chatId
                            ]);
                            chat.userId = sessionUser.id;
                        } catch (updateError) {
                            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logger"].error(`[POST /api/chat] Failed to claim chat ${chatId}:`, updateError);
                        // Continue anyway - allow access for logged-in users
                        }
                    }
                // If schema doesn't have userId, allow access (old schema)
                }
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["runQuery"])(`UPDATE quick_buy_chats 
           SET updatedAt = ? 
           WHERE id = ?`, [
                    now,
                    chatId
                ]);
            }
        } else {
            // Create new chat - only for authenticated users
            chatId = `chat-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            // Use authenticated user info (no guest users allowed)
            // For admin messages, use customerInfo or defaults
            const userName = isFromAdmin ? customerInfo?.name || "کاربر" : sessionUser?.name || customerInfo?.name || "کاربر";
            const userPhone = isFromAdmin ? customerInfo?.phone || "" : sessionUser?.phone || customerInfo?.phone || "";
            const userId = isFromAdmin ? null : sessionUser?.id || null; // For admin, userId can be null
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["runQuery"])(schema.chatHasUserId ? `INSERT INTO quick_buy_chats (id, userId, customerName, customerPhone, customerEmail, status, createdAt, updatedAt)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)` : `INSERT INTO quick_buy_chats (id, customerName, customerPhone, customerEmail, status, createdAt, updatedAt)
             VALUES (?, ?, ?, ?, ?, ?, ?)`, schema.chatHasUserId ? [
                chatId,
                userId,
                userName,
                userPhone,
                customerInfo?.email?.trim() || null,
                "active",
                now,
                now
            ] : [
                chatId,
                userName,
                userPhone,
                customerInfo?.email?.trim() || null,
                "active",
                now,
                now
            ]);
        }
        // Allow "create chat" without messages (used by chat UI step=info)
        if (!hasMessages) {
            // Clear cache so admin polling sees the new chat
            try {
                __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$cache$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cache"].delete(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$cache$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cacheKeys"].chatList());
            } catch  {
            // ignore
            }
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$route$2d$helpers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createSuccessResponse"])({
                id: chatId,
                chatId,
                messages: []
            });
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
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["runQuery"])(schema.messageHasUserId ? `INSERT INTO chat_messages (id, chatId, userId, text, sender, attachments, status, createdAt)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
           text = VALUES(text),
           attachments = VALUES(attachments),
           status = COALESCE(VALUES(status), chat_messages.status)` : `INSERT INTO chat_messages (id, chatId, text, sender, attachments, status, createdAt)
             VALUES (?, ?, ?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE
               text = VALUES(text),
               attachments = VALUES(attachments),
               status = COALESCE(VALUES(status), chat_messages.status)`, schema.messageHasUserId ? [
                messageId,
                chatId,
                message.sender === "user" ? sessionUser?.id || null : null,
                message.text || null,
                message.sender,
                JSON.stringify(validAttachments),
                messageStatus,
                messageCreatedAt
            ] : [
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
                        const attachmentType = attachment.type || (attachmentUrl.includes("image-") ? "image" : attachmentUrl.includes("audio-") ? "audio" : attachmentUrl.includes("maps") || attachmentUrl.includes("location") ? "location" : "file");
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
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logger"].debug("[POST /api/chat] Success:", {
            chatId,
            savedMessageCount: savedMessages.length
        });
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$route$2d$helpers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createSuccessResponse"])({
            chatId,
            messages: savedMessages
        });
    } catch (error) {
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logger"].error("[POST /api/chat] Error:", error);
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$route$2d$helpers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createErrorResponse"])(error);
    }
}
async function GET(request) {
    try {
        await ensureChatTables();
        const schema = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$chat$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getChatSchemaInfo"])();
        // Authentication removed - chat is now open to everyone
        let sessionUser = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$session$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getSessionUserFromRequest"])(request);
        // Fallback: اگر session پیدا نشد اما userId در header ارسال شده (برای development)
        if (!sessionUser && ("TURBOPACK compile-time value", "development") === 'development') {
            const userIdHeader = request.headers.get('x-user-id');
            if (userIdHeader) {
                console.log('[GET /api/chat] Using userId from header (development fallback):', userIdHeader);
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
                    console.log('[GET /api/chat] Fallback user found:', sessionUser);
                }
            }
        }
        const isAdmin = sessionUser?.role === "admin";
        // Use console.log for critical debugging
        console.log("[GET /api/chat] Session check:", {
            hasSession: !!sessionUser,
            userId: sessionUser?.id,
            role: sessionUser?.role,
            isAdmin,
            enabled: sessionUser?.enabled
        });
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logger"].debug("[GET /api/chat] Session check:", {
            hasSession: !!sessionUser,
            userId: sessionUser?.id,
            role: sessionUser?.role,
            isAdmin,
            enabled: sessionUser?.enabled
        });
        // Rate limiting (works for both authenticated and guest users)
        {
            const max = 240;
            const windowMs = 60000;
            const key = sessionUser?.id ? rateLimitKeyForAuthedUser(request, sessionUser.id) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$rate$2d$limit$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getClientId"])(request);
            const fullKey = `${request.nextUrl.pathname}:${request.method}:${key}`;
            if (__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$rate$2d$limit$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["rateLimiter"].isRateLimited(fullKey, max, windowMs)) {
                return createRateLimitResponse(max, windowMs, fullKey);
            }
        }
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
            // Access control: 
            // - Admin: can access all chats
            // - Logged-in users: can access their own chats (by userId or phone)
            // - Guest users: can access chats by chatId (no ownership check)
            if (!isAdmin && sessionUser) {
                // For logged-in users: check if they own the chat
                const chatUserId = schema.chatHasUserId && chat.userId ? String(chat.userId).trim() : "";
                if (schema.chatHasUserId && chatUserId) {
                    // Chat has userId - must match user's id
                    if (chatUserId !== sessionUser.id) {
                        throw new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$error$2d$handler$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["AppError"]("شما به این چت دسترسی ندارید", 403, "FORBIDDEN");
                    }
                } else if (schema.chatHasUserId && !chatUserId) {
                    // Chat has no userId - claim it for the logged-in user
                    try {
                        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["runQuery"])(`UPDATE quick_buy_chats SET userId = ? WHERE id = ?`, [
                            sessionUser.id,
                            chatId
                        ]);
                        chat.userId = sessionUser.id;
                    } catch (updateError) {
                        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logger"].error(`[GET /api/chat] Failed to claim chat ${chatId}:`, updateError);
                    // Continue anyway - allow access for logged-in users
                    }
                }
            // If schema doesn't have userId column, allow access (old schema)
            }
            // For guest users (no sessionUser) or admin: allow access by chatId
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
            // List chats:
            // - admin: all chats
            // - user: only their chats
            try {
                // Try cache first (cache for 10 seconds since chat list changes frequently)
                const cacheKey = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$cache$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cacheKeys"].chatList();
                const cached = isAdmin ? __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$cache$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cache"].get(cacheKey) : null;
                if (cached) return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$route$2d$helpers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createSuccessResponse"])({
                    chats: cached
                });
                // Admin should see ALL chats + all registered users (even without chats)
                // User should see only their own chats (limited to 50 for performance)
                // No guest users - authentication required
                let chats = [];
                // Use console.log for critical debugging
                console.log("[GET /api/chat] Checking admin status for chat list:", {
                    isAdmin,
                    hasSession: !!sessionUser,
                    role: sessionUser?.role
                });
                __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logger"].debug("[GET /api/chat] Checking admin status for chat list:", {
                    isAdmin,
                    hasSession: !!sessionUser,
                    role: sessionUser?.role
                });
                if (isAdmin) {
                    console.log("[GET /api/chat] ✅ Admin detected, loading all chats and users");
                    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logger"].debug("[GET /api/chat] Admin detected, loading all chats and users");
                    // Get all chats - but only for registered users (no guest chats)
                    try {
                        // Only get chats that have a userId (registered users only, no guests)
                        chats = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getRows"])(`
                SELECT c.* 
                FROM quick_buy_chats c
                WHERE c.userId IS NOT NULL AND c.userId != ''
                ORDER BY c.updatedAt DESC, c.createdAt DESC
              `);
                        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logger"].debug(`[GET /api/chat] Found ${chats.length} existing chats (registered users only)`);
                    } catch (error) {
                        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logger"].warn(`[GET /api/chat] Error loading chats (table might not exist):`, error?.message);
                        chats = [];
                    }
                    // Also get all registered users (simplified query - get all users first, then filter)
                    let allUsers = [];
                    try {
                        // First, try to get all users with role='user'
                        // Try multiple ways to check enabled status (MySQL can store it as boolean or int)
                        allUsers = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getRows"])(`
                SELECT 
                  u.id as userId,
                  u.name as customerName,
                  u.phone as customerPhone,
                  u.email as customerEmail,
                  u.createdAt,
                  u.updatedAt,
                  u.enabled
                FROM users u
                WHERE u.role = 'user'
                ORDER BY u.createdAt DESC
              `);
                        console.log(`[GET /api/chat] Found ${allUsers.length} total users with role='user' (before enabled filter)`);
                        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logger"].debug(`[GET /api/chat] Found ${allUsers.length} total users with role='user' (before enabled filter)`);
                        // Filter enabled users in JavaScript (more reliable than SQL)
                        allUsers = allUsers.filter((user)=>{
                            const enabled = user.enabled;
                            // Check various formats: 1, true, '1', 'true', etc.
                            return enabled === 1 || enabled === true || enabled === '1' || enabled === 'true' || String(enabled).toLowerCase() === 'true';
                        });
                        console.log(`[GET /api/chat] Found ${allUsers.length} enabled users with role='user' (after filter)`);
                        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logger"].debug(`[GET /api/chat] Found ${allUsers.length} enabled users with role='user' (after filter)`);
                        // Get existing chat user IDs to filter them out (only registered users, no guests)
                        let existingChatUserIds = new Set();
                        try {
                            const existingChats = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getRows"])(`
                  SELECT DISTINCT userId FROM quick_buy_chats 
                  WHERE userId IS NOT NULL AND userId != ''
                `);
                            existingChatUserIds = new Set(existingChats.map((c)=>String(c.userId)).filter(Boolean));
                            console.log(`[GET /api/chat] Found ${existingChatUserIds.size} registered users with existing chats`);
                            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logger"].debug(`[GET /api/chat] Found ${existingChatUserIds.size} users with existing chats`);
                        } catch (error) {
                            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logger"].warn(`[GET /api/chat] Error getting existing chat user IDs:`, error?.message);
                        }
                        // Filter out users who already have chats
                        allUsers = allUsers.filter((user)=>!existingChatUserIds.has(String(user.userId)));
                        console.log(`[GET /api/chat] After filtering, ${allUsers.length} registered users without chats`);
                        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logger"].debug(`[GET /api/chat] After filtering, ${allUsers.length} users without chats`);
                    } catch (error) {
                        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logger"].error(`[GET /api/chat] Error loading users:`, error?.message);
                        allUsers = [];
                    }
                    // Convert users to chat format for admin
                    const userChats = allUsers.map((user)=>({
                            id: `user-chat-${user.userId}`,
                            userId: user.userId,
                            customerName: user.customerName || 'کاربر بدون نام',
                            customerPhone: user.customerPhone || '',
                            customerEmail: user.customerEmail || null,
                            status: 'active',
                            createdAt: user.createdAt,
                            updatedAt: user.updatedAt,
                            isUserWithoutChat: true
                        }));
                    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logger"].debug(`[GET /api/chat] Converted ${userChats.length} users to chat format`);
                    // Combine chats and users, sort by updatedAt
                    chats = [
                        ...chats,
                        ...userChats
                    ].sort((a, b)=>{
                        const dateA = new Date(a.updatedAt || a.createdAt).getTime();
                        const dateB = new Date(b.updatedAt || b.createdAt).getTime();
                        return dateB - dateA;
                    });
                    console.log(`[GET /api/chat] Total chats after combining: ${chats.length} (${chats.length - userChats.length} existing chats + ${userChats.length} users without chats)`);
                    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logger"].debug(`[GET /api/chat] Total chats after combining: ${chats.length} (${chats.length - userChats.length} existing chats + ${userChats.length} users without chats)`);
                    // Log first few chats for debugging
                    if (chats.length > 0) {
                        console.log(`[GET /api/chat] Sample chats:`, chats.slice(0, 3).map((c)=>({
                                id: c.id,
                                name: c.customerName,
                                phone: c.customerPhone,
                                isUserWithoutChat: c.isUserWithoutChat
                            })));
                        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logger"].debug(`[GET /api/chat] Sample chats:`, chats.slice(0, 3).map((c)=>({
                                id: c.id,
                                name: c.customerName,
                                phone: c.customerPhone,
                                isUserWithoutChat: c.isUserWithoutChat
                            })));
                    } else {
                        console.warn(`[GET /api/chat] ⚠️ No chats or users found! Check if users table has data with role='user'.`);
                        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logger"].warn(`[GET /api/chat] ⚠️ No chats or users found! Check if users table has data with role='user'.`);
                    }
                } else if (sessionUser) {
                    // User: only their own chats
                    if (schema.chatHasUserId && sessionUser.id) {
                        chats = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getRows"])(`SELECT * FROM quick_buy_chats WHERE userId = ? ORDER BY updatedAt DESC, createdAt DESC LIMIT 50`, [
                            sessionUser.id
                        ]);
                    } else if (sessionUser.phone) {
                        chats = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getRows"])(`SELECT * FROM quick_buy_chats WHERE customerPhone = ? ORDER BY updatedAt DESC, createdAt DESC LIMIT 50`, [
                            sessionUser.phone
                        ]);
                    }
                } else {
                    // No guest users - return empty
                    chats = [];
                }
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
                if (isAdmin) {
                    // Cache the result for 10 seconds (admin list only)
                    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$cache$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cache"].set(cacheKey, chatsWithUnreadCount, 10000);
                }
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
    } catch (error) {
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logger"].error("[GET /api/chat] Error:", error);
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$route$2d$helpers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createErrorResponse"])(error);
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__b5a8db2e._.js.map