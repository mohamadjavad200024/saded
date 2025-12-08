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

if (!process.env.DB_PASSWORD) {
  logger.error("⚠️  WARNING: DB_PASSWORD is not set in environment variables!");
  logger.error("   Please make sure .env file exists and contains DB_PASSWORD");
  logger.error("   If you just updated .env, restart your Next.js server");
  logger.error("   Current working directory:", process.cwd());
}

const DB_CONFIG = {
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "3306"),
  database: process.env.DB_NAME || "saded",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  waitForConnections: true,
  connectionLimit: 20,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
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

    // Handle pool errors
    pool.on("connection", (connection) => {
      connection.on("error", (err) => {
        logger.error("Unexpected error on MySQL connection", err);
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
 * Execute a query and return results
 */
export async function query<T = any>(
  text: string,
  params?: any[]
): Promise<{ rows: T[]; rowCount: number; affectedRows?: number; insertId?: number }> {
  const connection = await getPool().getConnection();
  try {
    const [rows, fields] = await connection.execute<any[]>(text, params);
    // For INSERT/UPDATE/DELETE, rows is a ResultSetHeader with affectedRows
    // For SELECT, rows is an array
    const isResultSetHeader = !Array.isArray(rows) && (rows as any).affectedRows !== undefined;
    
    if (isResultSetHeader) {
      const header = rows as any as mysql.ResultSetHeader;
      return {
        rows: [],
        rowCount: header.affectedRows || 0,
        affectedRows: header.affectedRows || 0,
        insertId: header.insertId || undefined,
      };
    }
    
    return {
      rows: Array.isArray(rows) ? rows : [],
      rowCount: Array.isArray(rows) ? rows.length : 0,
      affectedRows: undefined,
      insertId: undefined,
    };
  } catch (error: any) {
    // Log detailed error (always log errors)
    logger.error("❌ Database query error:", {
      message: error?.message,
      code: error?.code,
      sqlState: error?.sqlState,
      query: text.substring(0, 100),
      hasPassword: !!DB_CONFIG.password,
    });
    throw error;
  } finally {
    connection.release();
  }
}

/**
 * Execute a query and return single row
 */
export async function queryOne<T = any>(
  text: string,
  params?: any[]
): Promise<T | null> {
  const result = await query<T>(text, params);
  return result.rows[0] || null;
}

/**
 * Execute a query and return all rows
 */
export async function queryAll<T = any>(
  text: string,
  params?: any[]
): Promise<T[]> {
  const result = await query<T>(text, params);
  return result.rows;
}

/**
 * Execute a transaction
 */
export async function transaction<T>(
  callback: (connection: mysql.PoolConnection) => Promise<T>
): Promise<T> {
  const connection = await getPool().getConnection();
  try {
    await connection.beginTransaction();
    const result = await callback(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

/**
 * Close all database connections
 */
export async function closePool(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
  }
}

/**
 * Initialize database tables
 */
export async function initializeTables(): Promise<void> {
  // First, add new columns if they don't exist (for existing databases)
  // MySQL doesn't support IF NOT EXISTS in ALTER TABLE, so we check first
  try {
    const pool = getPool();
    const [columns] = await pool.execute(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = ? 
        AND TABLE_NAME = 'products' 
        AND COLUMN_NAME IN ('airShippingCost', 'seaShippingCost')
    `, [DB_CONFIG.database]);

    const existingColumns = (columns as any[]).map((col: any) => col.COLUMN_NAME);

    if (!existingColumns.includes('airShippingCost')) {
      await query('ALTER TABLE products ADD COLUMN airShippingCost BIGINT');
    }
    if (!existingColumns.includes('seaShippingCost')) {
      await query('ALTER TABLE products ADD COLUMN seaShippingCost BIGINT');
    }

    logger.debug("✅ Shipping cost columns added/verified");
  } catch (error: any) {
    // If table doesn't exist yet, that's fine - it will be created with the columns
    if (!error?.message?.includes("doesn't exist") && !error?.message?.includes("Unknown table")) {
      logger.warn("⚠️ Could not add shipping cost columns (may already exist or table doesn't exist yet):", error?.message);
    }
  }

  const createTables = `
    -- Products table
    CREATE TABLE IF NOT EXISTS products (
      id VARCHAR(255) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT NOT NULL,
      price BIGINT NOT NULL,
      originalPrice BIGINT,
      brand VARCHAR(255) NOT NULL,
      category VARCHAR(255) NOT NULL,
      vin VARCHAR(255),
      vinEnabled BOOLEAN DEFAULT FALSE,
      airShippingEnabled BOOLEAN DEFAULT TRUE,
      seaShippingEnabled BOOLEAN DEFAULT TRUE,
      airShippingCost BIGINT,
      seaShippingCost BIGINT,
      stockCount INTEGER DEFAULT 0,
      inStock BOOLEAN DEFAULT TRUE,
      enabled BOOLEAN DEFAULT TRUE,
      images JSON NOT NULL DEFAULT '[]',
      tags JSON DEFAULT '[]',
      specifications JSON DEFAULT '{}',
      createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

    -- Categories table
    CREATE TABLE IF NOT EXISTS categories (
      id VARCHAR(255) PRIMARY KEY,
      name VARCHAR(255) NOT NULL UNIQUE,
      description TEXT,
      slug VARCHAR(255) UNIQUE,
      image VARCHAR(255),
      icon VARCHAR(255),
      enabled BOOLEAN DEFAULT TRUE,
      isActive BOOLEAN DEFAULT TRUE,
      createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

    -- Orders table
    CREATE TABLE IF NOT EXISTS orders (
      id VARCHAR(255) PRIMARY KEY,
      orderNumber VARCHAR(255) UNIQUE NOT NULL,
      userId VARCHAR(255),
      customerName VARCHAR(255) NOT NULL,
      customerPhone VARCHAR(255) NOT NULL,
      customerEmail VARCHAR(255),
      items JSON NOT NULL DEFAULT '[]',
      total BIGINT NOT NULL,
      shippingCost BIGINT NOT NULL,
      shippingMethod VARCHAR(50) NOT NULL,
      shippingAddress JSON NOT NULL DEFAULT '{}',
      status VARCHAR(50) NOT NULL DEFAULT 'pending',
      paymentStatus VARCHAR(50) NOT NULL DEFAULT 'pending',
      notes TEXT,
      createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

    -- Users table
    CREATE TABLE IF NOT EXISTS users (
      id VARCHAR(255) PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      name VARCHAR(255) NOT NULL,
      role VARCHAR(50) NOT NULL DEFAULT 'user',
      phone VARCHAR(255),
      address TEXT,
      enabled BOOLEAN DEFAULT TRUE,
      createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

    -- Carts table (for storing user shopping carts)
    CREATE TABLE IF NOT EXISTS carts (
      id VARCHAR(255) PRIMARY KEY,
      sessionId VARCHAR(255) NOT NULL UNIQUE,
      userId VARCHAR(255),
      items JSON NOT NULL DEFAULT '[]',
      shippingMethod VARCHAR(50),
      createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

    -- Quick Buy Chats table
    CREATE TABLE IF NOT EXISTS quick_buy_chats (
      id VARCHAR(255) PRIMARY KEY,
      customerName VARCHAR(255) NOT NULL,
      customerPhone VARCHAR(255) NOT NULL,
      customerEmail VARCHAR(255),
      status VARCHAR(50) NOT NULL DEFAULT 'active',
      createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

    -- Chat Messages table
    CREATE TABLE IF NOT EXISTS chat_messages (
      id VARCHAR(255) PRIMARY KEY,
      chatId VARCHAR(255) NOT NULL,
      text TEXT,
      sender VARCHAR(50) NOT NULL,
      attachments JSON DEFAULT '[]',
      status VARCHAR(50) DEFAULT 'sent',
      createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (chatId) REFERENCES quick_buy_chats(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

    -- Chat Attachments table (for storing file metadata)
    CREATE TABLE IF NOT EXISTS chat_attachments (
      id VARCHAR(255) PRIMARY KEY,
      messageId VARCHAR(255) NOT NULL,
      type VARCHAR(50) NOT NULL,
      filePath VARCHAR(500),
      fileName VARCHAR(255),
      fileSize BIGINT,
      fileUrl VARCHAR(500),
      createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (messageId) REFERENCES chat_messages(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

    -- Admin Presence table (for tracking admin online/offline status)
    CREATE TABLE IF NOT EXISTS admin_presence (
      adminId VARCHAR(255) PRIMARY KEY,
      isOnline BOOLEAN DEFAULT FALSE,
      lastSeen TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `;

  try {
    // MySQL doesn't support multiple statements in one query by default
    // Split by semicolon and execute each statement
    const statements = createTables
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    for (const statement of statements) {
      if (statement.trim()) {
        await query(statement);
      }
    }
    logger.debug("✅ Database tables initialized successfully");
  } catch (error) {
    logger.error("❌ Error initializing database tables:", error);
    throw error;
  }

  // Create indexes separately
  const createIndexes = `
    -- Products indexes
    CREATE INDEX IF NOT EXISTS idx_products_enabled ON products(enabled);
    CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
    CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand);
    CREATE INDEX IF NOT EXISTS idx_products_enabled_category ON products(enabled, category);
    CREATE INDEX IF NOT EXISTS idx_products_enabled_price ON products(enabled, price);
    CREATE INDEX IF NOT EXISTS idx_products_vin_enabled ON products(vin, vinEnabled);
    CREATE INDEX IF NOT EXISTS idx_products_enabled_inStock ON products(enabled, inStock);
    
    -- Orders indexes
    CREATE INDEX IF NOT EXISTS idx_orders_userId ON orders(userId);
    CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
    CREATE INDEX IF NOT EXISTS idx_orders_paymentStatus ON orders(paymentStatus);
    CREATE INDEX IF NOT EXISTS idx_orders_status_paymentStatus ON orders(status, paymentStatus);
    CREATE INDEX IF NOT EXISTS idx_orders_createdAt ON orders(createdAt DESC);
    
    -- Categories indexes
    CREATE INDEX IF NOT EXISTS idx_categories_enabled ON categories(enabled);
    CREATE INDEX IF NOT EXISTS idx_categories_enabled_active ON categories(enabled, isActive);
    
    -- Carts indexes
    CREATE INDEX IF NOT EXISTS idx_carts_sessionId ON carts(sessionId);
    CREATE INDEX IF NOT EXISTS idx_carts_userId ON carts(userId);
    
    -- Chat indexes
    CREATE INDEX IF NOT EXISTS idx_chat_messages_chatId ON chat_messages(chatId);
    CREATE INDEX IF NOT EXISTS idx_chat_messages_createdAt ON chat_messages(createdAt);
    CREATE INDEX IF NOT EXISTS idx_chat_messages_chatId_createdAt ON chat_messages(chatId, createdAt DESC);
    CREATE INDEX IF NOT EXISTS idx_chat_attachments_messageId ON chat_attachments(messageId);
    CREATE INDEX IF NOT EXISTS idx_quick_buy_chats_status ON quick_buy_chats(status);
    CREATE INDEX IF NOT EXISTS idx_quick_buy_chats_createdAt ON quick_buy_chats(createdAt DESC);
    CREATE INDEX IF NOT EXISTS idx_quick_buy_chats_customerPhone ON quick_buy_chats(customerPhone);
    
    -- Admin presence index
    CREATE INDEX IF NOT EXISTS idx_admin_presence_isOnline ON admin_presence(isOnline);
  `;

  try {
    const indexStatements = createIndexes
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    for (const statement of indexStatements) {
      if (statement.trim()) {
        try {
          await query(statement);
        } catch (indexError: any) {
          // Ignore "Duplicate key name" errors
          if (!indexError?.message?.includes("Duplicate key name")) {
            logger.warn("⚠️ Could not create index:", statement.substring(0, 50), indexError?.message);
          }
        }
      }
    }
    logger.debug("✅ Database indexes initialized successfully");
  } catch (error) {
    logger.warn("⚠️ Some indexes may already exist:", error);
  }
}

/**
 * Check if database exists, if not create it
 */
export async function ensureDatabase(): Promise<void> {
  // Connect without database first
  const adminConfig = {
    ...DB_CONFIG,
    database: undefined,
  };

  const adminPool = mysql.createPool(adminConfig);

  try {
    // Check if database exists
    const [rows] = await adminPool.execute(
      "SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = ?",
      [DB_CONFIG.database]
    );

    const databases = rows as any[];
    if (databases.length === 0) {
      // Create database
      await adminPool.execute(`CREATE DATABASE IF NOT EXISTS \`${DB_CONFIG.database}\``);
      logger.debug(`✅ Database '${DB_CONFIG.database}' created successfully`);
    } else {
      logger.debug(`✅ Database '${DB_CONFIG.database}' already exists`);
    }
  } catch (error: any) {
    logger.error("Error ensuring database:", error);
    throw error;
  } finally {
    await adminPool.end();
  }
}

