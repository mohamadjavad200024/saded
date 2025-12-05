/**
 * PostgreSQL Database Connection
 * 
 * این ماژول اتصال به PostgreSQL را مدیریت می‌کند
 * نام دیتابیس: saded
 * رمز: saded
 */

import { Pool, PoolClient, QueryResult, QueryResultRow } from "pg";
import { logger } from "@/lib/logger";

// Database configuration
// Log configuration in development (without password)
if (process.env.NODE_ENV === "development") {
  logger.log("🔍 Database Config:", {
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || "5432",
    database: process.env.DB_NAME || "saded",
    user: process.env.DB_USER || "postgres",
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
  port: parseInt(process.env.DB_PORT || "5432"),
  database: process.env.DB_NAME || "saded",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "",
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
};

// Create connection pool
let pool: Pool | null = null;

/**
 * Get or create database connection pool
 */
export function getPool(): Pool {
  if (!pool) {
    // Log actual config being used (without password) in development
    if (process.env.NODE_ENV === "development") {
      logger.log("🔍 Creating PostgreSQL pool with config:", {
        host: DB_CONFIG.host,
        port: DB_CONFIG.port,
        database: DB_CONFIG.database,
        user: DB_CONFIG.user,
        password: DB_CONFIG.password ? "***SET***" : "❌ EMPTY",
      });
    }

    pool = new Pool(DB_CONFIG);

    // Handle pool errors
    pool.on("error", (err) => {
      logger.error("Unexpected error on idle PostgreSQL client", err);
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
    const result = await testPool.query("SELECT NOW()");
    return result.rows.length > 0;
  } catch (error) {
    logger.error("Database connection test failed:", error);
    return false;
  }
}

/**
 * Execute a query and return results
 */
export async function query<T extends QueryResultRow = any>(
  text: string,
  params?: any[]
): Promise<QueryResult<T>> {
  const client = await getPool().connect();
  try {
    const result = await client.query<T>(text, params);
    return result;
  } catch (error: any) {
    // Log detailed error (always log errors)
    logger.error("❌ Database query error:", {
      message: error?.message,
      code: error?.code,
      query: text.substring(0, 100),
      hasPassword: !!DB_CONFIG.password,
    });
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Execute a query and return single row
 */
export async function queryOne<T extends QueryResultRow = any>(
  text: string,
  params?: any[]
): Promise<T | null> {
  const result = await query<T>(text, params);
  return result.rows[0] || null;
}

/**
 * Execute a query and return all rows
 */
export async function queryAll<T extends QueryResultRow = any>(
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
  callback: (client: PoolClient) => Promise<T>
): Promise<T> {
  const client = await getPool().connect();
  try {
    await client.query("BEGIN");
    const result = await callback(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
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
  const addColumns = `
    ALTER TABLE products ADD COLUMN IF NOT EXISTS "airShippingCost" BIGINT;
    ALTER TABLE products ADD COLUMN IF NOT EXISTS "seaShippingCost" BIGINT;
  `;

  try {
    await query(addColumns);
    logger.debug("✅ Shipping cost columns added/verified");
  } catch (error: any) {
    // If table doesn't exist yet, that's fine - it will be created with the columns
    if (!error?.message?.includes("does not exist")) {
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
      "originalPrice" BIGINT,
      brand VARCHAR(255) NOT NULL,
      category VARCHAR(255) NOT NULL,
      vin VARCHAR(255),
      "vinEnabled" BOOLEAN DEFAULT FALSE,
      "airShippingEnabled" BOOLEAN DEFAULT TRUE,
      "seaShippingEnabled" BOOLEAN DEFAULT TRUE,
      "airShippingCost" BIGINT,
      "seaShippingCost" BIGINT,
      "stockCount" INTEGER DEFAULT 0,
      "inStock" BOOLEAN DEFAULT TRUE,
      enabled BOOLEAN DEFAULT TRUE,
      images JSONB NOT NULL DEFAULT '[]'::jsonb,
      tags JSONB DEFAULT '[]'::jsonb,
      specifications JSONB DEFAULT '{}'::jsonb,
      "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
      "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
    );

    -- Categories table
    CREATE TABLE IF NOT EXISTS categories (
      id VARCHAR(255) PRIMARY KEY,
      name VARCHAR(255) NOT NULL UNIQUE,
      description TEXT,
      slug VARCHAR(255) UNIQUE,
      image VARCHAR(255),
      icon VARCHAR(255),
      enabled BOOLEAN DEFAULT TRUE,
      "isActive" BOOLEAN DEFAULT TRUE,
      "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
      "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
    );

    -- Orders table
    CREATE TABLE IF NOT EXISTS orders (
      id VARCHAR(255) PRIMARY KEY,
      "orderNumber" VARCHAR(255) UNIQUE NOT NULL,
      "userId" VARCHAR(255),
      "customerName" VARCHAR(255) NOT NULL,
      "customerPhone" VARCHAR(255) NOT NULL,
      "customerEmail" VARCHAR(255),
      items JSONB NOT NULL DEFAULT '[]'::jsonb,
      total BIGINT NOT NULL,
      "shippingCost" BIGINT NOT NULL,
      "shippingMethod" VARCHAR(50) NOT NULL,
      "shippingAddress" JSONB NOT NULL DEFAULT '{}'::jsonb,
      status VARCHAR(50) NOT NULL DEFAULT 'pending',
      "paymentStatus" VARCHAR(50) NOT NULL DEFAULT 'pending',
      notes TEXT,
      "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
      "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
    );

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
      "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
      "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
    );

    -- Carts table (for storing user shopping carts)
    CREATE TABLE IF NOT EXISTS carts (
      id VARCHAR(255) PRIMARY KEY,
      "sessionId" VARCHAR(255) NOT NULL,
      "userId" VARCHAR(255),
      items JSONB NOT NULL DEFAULT '[]'::jsonb,
      "shippingMethod" VARCHAR(50),
      "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
      "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
      UNIQUE("sessionId")
    );

    -- Quick Buy Chats table
    CREATE TABLE IF NOT EXISTS quick_buy_chats (
      id VARCHAR(255) PRIMARY KEY,
      "customerName" VARCHAR(255) NOT NULL,
      "customerPhone" VARCHAR(255) NOT NULL,
      "customerEmail" VARCHAR(255),
      status VARCHAR(50) NOT NULL DEFAULT 'active',
      "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
      "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
    );

    -- Chat Messages table
    CREATE TABLE IF NOT EXISTS chat_messages (
      id VARCHAR(255) PRIMARY KEY,
      "chatId" VARCHAR(255) NOT NULL REFERENCES quick_buy_chats(id) ON DELETE CASCADE,
      text TEXT,
      sender VARCHAR(50) NOT NULL,
      attachments JSONB DEFAULT '[]'::jsonb,
      "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
      FOREIGN KEY ("chatId") REFERENCES quick_buy_chats(id) ON DELETE CASCADE
    );

    -- Chat Attachments table (for storing file metadata)
    CREATE TABLE IF NOT EXISTS chat_attachments (
      id VARCHAR(255) PRIMARY KEY,
      "messageId" VARCHAR(255) NOT NULL REFERENCES chat_messages(id) ON DELETE CASCADE,
      type VARCHAR(50) NOT NULL,
      "filePath" VARCHAR(500),
      "fileName" VARCHAR(255),
      "fileSize" BIGINT,
      "fileUrl" VARCHAR(500),
      "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
      FOREIGN KEY ("messageId") REFERENCES chat_messages(id) ON DELETE CASCADE
    );

    -- Admin Presence table (for tracking admin online/offline status)
    CREATE TABLE IF NOT EXISTS admin_presence (
      "adminId" VARCHAR(255) PRIMARY KEY,
      "isOnline" BOOLEAN DEFAULT FALSE,
      "lastSeen" TIMESTAMP NOT NULL DEFAULT NOW(),
      "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
    );

    -- Create indexes
    
    -- Products indexes
    CREATE INDEX IF NOT EXISTS idx_products_enabled ON products(enabled);
    CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
    CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand);
    -- Composite index for common filter: enabled + category
    CREATE INDEX IF NOT EXISTS idx_products_enabled_category ON products(enabled, category);
    -- Composite index for search queries: enabled + price range
    CREATE INDEX IF NOT EXISTS idx_products_enabled_price ON products(enabled, price);
    -- Index for VIN search
    CREATE INDEX IF NOT EXISTS idx_products_vin_enabled ON products(vin, "vinEnabled") WHERE "vinEnabled" = TRUE;
    -- Index for inStock filter
    CREATE INDEX IF NOT EXISTS idx_products_enabled_inStock ON products(enabled, "inStock");
    
    -- Orders indexes
    CREATE INDEX IF NOT EXISTS idx_orders_userId ON orders("userId");
    CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
    CREATE INDEX IF NOT EXISTS idx_orders_paymentStatus ON orders("paymentStatus");
    -- Composite index for order filtering
    CREATE INDEX IF NOT EXISTS idx_orders_status_paymentStatus ON orders(status, "paymentStatus");
    -- Index for order date queries
    CREATE INDEX IF NOT EXISTS idx_orders_createdAt ON orders("createdAt" DESC);
    
    -- Categories indexes
    CREATE INDEX IF NOT EXISTS idx_categories_enabled ON categories(enabled);
    CREATE INDEX IF NOT EXISTS idx_categories_enabled_active ON categories(enabled, "isActive");
    
    -- Carts indexes
    CREATE INDEX IF NOT EXISTS idx_carts_sessionId ON carts("sessionId");
    CREATE INDEX IF NOT EXISTS idx_carts_userId ON carts("userId");
    
    -- Chat indexes
    CREATE INDEX IF NOT EXISTS idx_chat_messages_chatId ON chat_messages("chatId");
    CREATE INDEX IF NOT EXISTS idx_chat_messages_createdAt ON chat_messages("createdAt");
    -- Composite index for chat messages queries (chatId + createdAt for pagination)
    CREATE INDEX IF NOT EXISTS idx_chat_messages_chatId_createdAt ON chat_messages("chatId", "createdAt" DESC);
    -- Index for unread messages count
    CREATE INDEX IF NOT EXISTS idx_chat_messages_chatId_sender_status ON chat_messages("chatId", sender, status);
    CREATE INDEX IF NOT EXISTS idx_chat_attachments_messageId ON chat_attachments("messageId");
    CREATE INDEX IF NOT EXISTS idx_quick_buy_chats_status ON quick_buy_chats(status);
    CREATE INDEX IF NOT EXISTS idx_quick_buy_chats_createdAt ON quick_buy_chats("createdAt" DESC);
    -- Index for finding chat by customer phone
    CREATE INDEX IF NOT EXISTS idx_quick_buy_chats_customerPhone ON quick_buy_chats("customerPhone");
    
    -- Admin presence index
    CREATE INDEX IF NOT EXISTS idx_admin_presence_isOnline ON admin_presence("isOnline");
  `;

  try {
    await query(createTables);
    logger.debug("✅ Database tables initialized successfully");
  } catch (error) {
    logger.error("❌ Error initializing database tables:", error);
    throw error;
  }
}

/**
 * Check if database exists, if not create it
 */
export async function ensureDatabase(): Promise<void> {
  // First connect to postgres database to check if saded exists
  const adminPool = new Pool({
    ...DB_CONFIG,
    database: "postgres", // Connect to default postgres database
  });

  try {
    // Check if database exists
    const result = await adminPool.query(
      "SELECT 1 FROM pg_database WHERE datname = $1",
      [DB_CONFIG.database]
    );

    if (result.rows.length === 0) {
      // Create database
      await adminPool.query(`CREATE DATABASE ${DB_CONFIG.database}`);
      logger.debug(`✅ Database '${DB_CONFIG.database}' created successfully`);
    } else {
      logger.debug(`✅ Database '${DB_CONFIG.database}' already exists`);
    }
  } catch (error: any) {
    // If error is about database already existing, that's fine
    if (error.code !== "42P04") {
      logger.error("Error ensuring database:", error);
      throw error;
    }
  } finally {
    await adminPool.end();
  }
}

