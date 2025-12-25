module.exports = [
"[externals]/events [external] (events, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("events", () => require("events"));

module.exports = mod;
}),
"[externals]/process [external] (process, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("process", () => require("process"));

module.exports = mod;
}),
"[externals]/net [external] (net, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("net", () => require("net"));

module.exports = mod;
}),
"[externals]/tls [external] (tls, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("tls", () => require("tls"));

module.exports = mod;
}),
"[externals]/timers [external] (timers, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("timers", () => require("timers"));

module.exports = mod;
}),
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[externals]/buffer [external] (buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("buffer", () => require("buffer"));

module.exports = mod;
}),
"[externals]/string_decoder [external] (string_decoder, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("string_decoder", () => require("string_decoder"));

module.exports = mod;
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[externals]/zlib [external] (zlib, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("zlib", () => require("zlib"));

module.exports = mod;
}),
"[externals]/util [external] (util, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("util", () => require("util"));

module.exports = mod;
}),
"[externals]/url [external] (url, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("url", () => require("url"));

module.exports = mod;
}),
"[project]/lib/db/mysql.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * MySQL Database Connection
 * 
 * این ماژول اتصال به MySQL را مدیریت می‌کند
 */ __turbopack_context__.s([
    "closePool",
    ()=>closePool,
    "ensureDatabase",
    ()=>ensureDatabase,
    "getPool",
    ()=>getPool,
    "initializeTables",
    ()=>initializeTables,
    "query",
    ()=>query,
    "queryAll",
    ()=>queryAll,
    "queryOne",
    ()=>queryOne,
    "testConnection",
    ()=>testConnection
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$mysql2$2f$promise$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/mysql2/promise.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/logger.ts [app-route] (ecmascript)");
;
;
// Database configuration
// Log configuration in development (without password)
if ("TURBOPACK compile-time truthy", 1) {
    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logger"].log("🔍 Database Config:", {
        host: process.env.DB_HOST || "localhost",
        port: process.env.DB_PORT || "3306",
        database: process.env.DB_NAME || "saded",
        user: process.env.DB_USER || "root",
        password: process.env.DB_PASSWORD ? "***SET***" : "❌ NOT SET"
    });
}
// Note: DB_PASSWORD can be empty for XAMPP MySQL (default installation)
// Only show warning in production or if explicitly needed
if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
const DB_CONFIG = {
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "3306"),
    database: process.env.DB_NAME || "saded",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
    // Connection timeout settings
    connectTimeout: 10000,
    // Note: reconnect option removed - MySQL2 handles reconnection automatically
    ssl: process.env.DB_SSL === 'true' ? {
        rejectUnauthorized: false
    } : undefined
};
// Create connection pool
let pool = null;
function getPool() {
    if (!pool) {
        // Log actual config being used (without password) in development
        if ("TURBOPACK compile-time truthy", 1) {
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logger"].log("🔍 Creating MySQL pool with config:", {
                host: DB_CONFIG.host,
                port: DB_CONFIG.port,
                database: DB_CONFIG.database,
                user: DB_CONFIG.user,
                password: DB_CONFIG.password ? "***SET***" : "❌ EMPTY"
            });
        }
        pool = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$mysql2$2f$promise$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].createPool(DB_CONFIG);
        // Handle pool connection errors
        pool.on("connection", (connection)=>{
            connection.on("error", (err)=>{
                // If connection is closed, destroy the pool and recreate it
                if (err.code === 'ER_VARIABLE_IS_READONLY' || err.message?.includes('closed state')) {
                    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logger"].warn("MySQL connection pool error, will recreate pool:", err.code);
                    // Destroy current pool
                    pool?.end().catch(()=>{});
                    pool = null;
                    return;
                }
                // Don't log ECONNRESET as error - it's expected when connections are idle
                if (err.code !== 'ECONNRESET' && err.code !== 'PROTOCOL_CONNECTION_LOST') {
                    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logger"].error("Unexpected error on MySQL connection", err);
                } else if ("TURBOPACK compile-time truthy", 1) {
                    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logger"].debug("MySQL connection reset (normal for idle connections)", err.code);
                }
            });
        });
    }
    return pool;
}
async function testConnection() {
    try {
        const testPool = getPool();
        const [rows] = await testPool.execute("SELECT NOW() as now");
        return Array.isArray(rows) && rows.length > 0;
    } catch (error) {
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logger"].error("Database connection test failed:", error);
        return false;
    }
}
async function query(text, params, retries = 2) {
    let lastError;
    for(let attempt = 0; attempt <= retries; attempt++){
        let connection = null;
        try {
            // If pool was destroyed due to error, recreate it
            let currentPool = getPool();
            connection = await currentPool.getConnection();
            const [rows, fields] = await connection.execute(text, params);
            // For INSERT/UPDATE/DELETE, rows is a ResultSetHeader with affectedRows
            // For SELECT, rows is an array
            const isResultSetHeader = rows && typeof rows === 'object' && 'affectedRows' in rows;
            if (isResultSetHeader) {
                const result = rows;
                return {
                    rows: [],
                    rowCount: result.affectedRows || 0,
                    affectedRows: result.affectedRows,
                    insertId: result.insertId
                };
            } else {
                return {
                    rows: rows || [],
                    rowCount: Array.isArray(rows) ? rows.length : 0
                };
            }
        } catch (error) {
            lastError = error;
            // Retry on connection errors
            if (attempt < retries && (error.code === 'ECONNRESET' || error.code === 'PROTOCOL_CONNECTION_LOST' || error.code === 'ETIMEDOUT' || error.fatal)) {
                if ("TURBOPACK compile-time truthy", 1) {
                    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logger"].debug(`Database connection error, retrying (${attempt + 1}/${retries})...`, error.code);
                }
                // Wait a bit before retrying
                await new Promise((resolve)=>setTimeout(resolve, 100 * (attempt + 1)));
                continue;
            }
            // Don't log duplicate key/constraint errors as they're expected
            const isDuplicateError = error.code === 'ER_DUP_KEYNAME' || error.code === 'ER_DUP_KEY' || error.code === 'ER_CANT_CREATE_TABLE' && error.message?.includes('Duplicate');
            if (!isDuplicateError) {
                // Log non-retryable errors (except duplicates)
                __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logger"].error("Database query error:", {
                    sql: text.substring(0, 100),
                    error: error instanceof Error ? error.message : String(error),
                    code: error.code
                });
            } else if ("TURBOPACK compile-time truthy", 1) {
                // Only log duplicate errors in development as debug
                __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logger"].debug("Database query skipped (duplicate):", {
                    sql: text.substring(0, 100),
                    code: error.code
                });
            }
            throw error;
        } finally{
            if (connection) {
                connection.release();
            }
        }
    }
    // If we get here, all retries failed
    throw lastError;
}
async function queryOne(text, params) {
    const result = await query(text, params);
    return result.rows.length > 0 ? result.rows[0] : null;
}
async function queryAll(text, params) {
    const result = await query(text, params);
    return result.rows;
}
async function ensureDatabase() {
    // MySQL doesn't need to create database in the same way as PostgreSQL
    // The database should already exist, but we can test the connection
    try {
        await testConnection();
    } catch (error) {
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logger"].error("Database connection failed:", error);
        throw new Error("Failed to connect to database. Please ensure the database exists and credentials are correct.");
    }
}
async function initializeTables() {
    // Table creation is handled by setup-mysql.js script
    // This function is kept for compatibility
    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logger"].log("ℹ️  Table initialization should be done via 'npm run setup-mysql'");
}
async function closePool() {
    if (pool) {
        await pool.end();
        pool = null;
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__d53b1080._.js.map