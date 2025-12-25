/**
 * MySQL Database Connection
 * 
 * این ماژول اتصال به MySQL را مدیریت می‌کند
 */

import mysql from "mysql2/promise";
import { logger } from "@/lib/logger";

// Database configuration
// Log configuration in development (without password)
if (process.env.NODE_ENV === "development") {
  logger.log("🔍 Database Config:", {
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || "3306",
    database: process.env.DB_NAME || "saded",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD ? "***SET***" : "❌ NOT SET",
  });
}

// Note: DB_PASSWORD can be empty for XAMPP MySQL (default installation)
// Only show warning in production or if explicitly needed
if (!process.env.DB_PASSWORD && process.env.NODE_ENV === 'production') {
  logger.warn("⚠️  WARNING: DB_PASSWORD is not set in environment variables!");
  logger.warn("   For XAMPP MySQL, empty password is normal.");
  logger.warn("   For production, please set DB_PASSWORD in .env.production");
}

const DB_CONFIG = {
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "3306"),
  database: process.env.DB_NAME || "saded",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  waitForConnections: true,
  connectionLimit: 10, // Reduced to avoid too many connections
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  // Connection timeout settings
  connectTimeout: 10000, // 10 seconds
  // Note: reconnect option removed - MySQL2 handles reconnection automatically
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
};

// Create connection pool
let pool: mysql.Pool | null = null;

/**
 * Get or create database connection pool
 */
export function getPool(): mysql.Pool {
  if (!pool) {
    // Log actual config being used (without password) in development
    if (process.env.NODE_ENV === "development") {
      logger.log("🔍 Creating MySQL pool with config:", {
        host: DB_CONFIG.host,
        port: DB_CONFIG.port,
        database: DB_CONFIG.database,
        user: DB_CONFIG.user,
        password: DB_CONFIG.password ? "***SET***" : "❌ EMPTY",
      });
    }

    pool = mysql.createPool(DB_CONFIG);

    // Handle pool connection errors
    pool.on("connection", (connection) => {
      connection.on("error", (err: any) => {
        // If connection is closed, destroy the pool and recreate it
        if (err.code === 'ER_VARIABLE_IS_READONLY' || err.message?.includes('closed state')) {
          logger.warn("MySQL connection pool error, will recreate pool:", err.code);
          // Destroy current pool
          pool?.end().catch(() => {});
          pool = null;
          return;
        }
        // Don't log ECONNRESET as error - it's expected when connections are idle
        if (err.code !== 'ECONNRESET' && err.code !== 'PROTOCOL_CONNECTION_LOST') {
          logger.error("Unexpected error on MySQL connection", err);
        } else if (process.env.NODE_ENV === 'development') {
          logger.debug("MySQL connection reset (normal for idle connections)", err.code);
        }
      });
    });
  }

  return pool;
}

/**
 * Test database connection
 */
export async function testConnection(): Promise<boolean> {
  try {
    const testPool = getPool();
    const [rows] = await testPool.execute("SELECT NOW() as now");
    return Array.isArray(rows) && rows.length > 0;
  } catch (error) {
    logger.error("Database connection test failed:", error);
    return false;
  }
}

/**
 * Execute a query and return results with retry logic for connection errors
 */
export async function query<T = any>(
  text: string,
  params?: any[],
  retries: number = 2
): Promise<{ rows: T[]; rowCount: number; affectedRows?: number; insertId?: number }> {
  let lastError: any;
  
  for (let attempt = 0; attempt <= retries; attempt++) {
    let connection: mysql.PoolConnection | null = null;
    try {
      // If pool was destroyed due to error, recreate it
      let currentPool = getPool();
      connection = await currentPool.getConnection();
      const [rows, fields] = await connection.execute<any[]>(text, params);
      // For INSERT/UPDATE/DELETE, rows is a ResultSetHeader with affectedRows
      // For SELECT, rows is an array
      const isResultSetHeader = rows && typeof rows === 'object' && 'affectedRows' in rows;
      
      if (isResultSetHeader) {
        const result = rows as unknown as mysql.ResultSetHeader;
        return {
          rows: [] as T[],
          rowCount: result.affectedRows || 0,
          affectedRows: result.affectedRows,
          insertId: result.insertId,
        };
      } else {
        return {
          rows: (rows as T[]) || [],
          rowCount: Array.isArray(rows) ? rows.length : 0,
        };
      }
    } catch (error: any) {
      lastError = error;
      
      // Retry on connection errors
      if (
        attempt < retries &&
        (error.code === 'ECONNRESET' ||
         error.code === 'PROTOCOL_CONNECTION_LOST' ||
         error.code === 'ETIMEDOUT' ||
         error.fatal)
      ) {
        if (process.env.NODE_ENV === 'development') {
          logger.debug(`Database connection error, retrying (${attempt + 1}/${retries})...`, error.code);
        }
        // Wait a bit before retrying
        await new Promise(resolve => setTimeout(resolve, 100 * (attempt + 1)));
        continue;
      }
      
      // Don't log duplicate key/constraint errors as they're expected
      const isDuplicateError = 
        error.code === 'ER_DUP_KEYNAME' || 
        error.code === 'ER_DUP_KEY' || 
        error.code === 'ER_CANT_CREATE_TABLE' && error.message?.includes('Duplicate');
      
      if (!isDuplicateError) {
        // Log non-retryable errors (except duplicates)
        logger.error("Database query error:", {
          sql: text.substring(0, 100),
          error: error instanceof Error ? error.message : String(error),
          code: error.code,
        });
      } else if (process.env.NODE_ENV === 'development') {
        // Only log duplicate errors in development as debug
        logger.debug("Database query skipped (duplicate):", {
          sql: text.substring(0, 100),
          code: error.code,
        });
      }
      throw error;
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }
  
  // If we get here, all retries failed
  throw lastError;
}

/**
 * Get one row from database
 */
export async function queryOne<T = any>(
  text: string,
  params?: any[]
): Promise<T | null> {
  const result = await query<T>(text, params);
  return result.rows.length > 0 ? result.rows[0] : null;
}

/**
 * Get all rows from database
 */
export async function queryAll<T = any>(
  text: string,
  params?: any[]
): Promise<T[]> {
  const result = await query<T>(text, params);
  return result.rows;
}

/**
 * Ensure database exists
 */
export async function ensureDatabase(): Promise<void> {
  // MySQL doesn't need to create database in the same way as PostgreSQL
  // The database should already exist, but we can test the connection
  try {
    await testConnection();
  } catch (error) {
    logger.error("Database connection failed:", error);
    throw new Error("Failed to connect to database. Please ensure the database exists and credentials are correct.");
  }
}

/**
 * Initialize database tables
 * This is a placeholder - actual table creation should be done via setup-mysql.js
 */
export async function initializeTables(): Promise<void> {
  // Table creation is handled by setup-mysql.js script
  // This function is kept for compatibility
  logger.log("ℹ️  Table initialization should be done via 'npm run setup-mysql'");
}

/**
 * Close database connection pool
 */
export async function closePool(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
  }
}

