/**
 * Production Database Setup Script
 * 
 * این اسکریپت برای راه‌اندازی دیتابیس در محیط production استفاده می‌شود
 * 
 * استفاده:
 * 1. مطمئن شوید که فایل .env.production با اطلاعات دیتابیس تنظیم شده است
 * 2. این اسکریپت را اجرا کنید: node scripts/setup-db-production.js
 * 
 * این اسکریپت:
 * - جداول دیتابیس را ایجاد می‌کند
 * - Index ها را ایجاد می‌کند
 * - در صورت وجود جداول، آن‌ها را به‌روزرسانی می‌کند
 */

require('dotenv').config({ path: '.env.production' });

const { Pool } = require('pg');

// Database configuration from environment variables
const DB_CONFIG = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'saded',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
};

// Validate required environment variables
if (!DB_CONFIG.password) {
  console.error('❌ خطا: DB_PASSWORD در فایل .env.production تنظیم نشده است!');
  console.error('   لطفاً فایل .env.production را بررسی کنید.');
  process.exit(1);
}

console.log('🚀 Production Database Setup Script\n');
console.log('='.repeat(60));
console.log(`📊 Database: ${DB_CONFIG.database}`);
console.log(`🔗 Host: ${DB_CONFIG.host}:${DB_CONFIG.port}`);
console.log(`👤 User: ${DB_CONFIG.user}`);
console.log('='.repeat(60));

// Create connection pool
const pool = new Pool(DB_CONFIG);

// Handle pool errors
pool.on('error', (err) => {
  console.error('❌ Unexpected error on idle PostgreSQL client', err);
  process.exit(1);
});

/**
 * Initialize database tables
 */
async function initializeTables() {
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

    -- Carts table
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

    -- Chat Attachments table
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

    -- Admin Presence table
    CREATE TABLE IF NOT EXISTS admin_presence (
      "adminId" VARCHAR(255) PRIMARY KEY,
      "isOnline" BOOLEAN DEFAULT FALSE,
      "lastSeen" TIMESTAMP NOT NULL DEFAULT NOW(),
      "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `;

  try {
    await pool.query(createTables);
    console.log('✅ جداول دیتابیس ایجاد شدند');
  } catch (error) {
    console.error('❌ خطا در ایجاد جداول:', error.message);
    throw error;
  }
}

/**
 * Create indexes
 */
async function createIndexes() {
  const indexes = `
    -- Products indexes
    CREATE INDEX IF NOT EXISTS idx_products_enabled ON products(enabled);
    CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
    CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand);
    CREATE INDEX IF NOT EXISTS idx_products_enabled_category ON products(enabled, category);
    CREATE INDEX IF NOT EXISTS idx_products_enabled_price ON products(enabled, price);
    CREATE INDEX IF NOT EXISTS idx_products_vin_enabled ON products(vin, "vinEnabled") WHERE "vinEnabled" = TRUE;
    CREATE INDEX IF NOT EXISTS idx_products_enabled_inStock ON products(enabled, "inStock");
    
    -- Orders indexes
    CREATE INDEX IF NOT EXISTS idx_orders_userId ON orders("userId");
    CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
    CREATE INDEX IF NOT EXISTS idx_orders_paymentStatus ON orders("paymentStatus");
    CREATE INDEX IF NOT EXISTS idx_orders_status_paymentStatus ON orders(status, "paymentStatus");
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
    CREATE INDEX IF NOT EXISTS idx_chat_messages_chatId_createdAt ON chat_messages("chatId", "createdAt" DESC);
    CREATE INDEX IF NOT EXISTS idx_chat_attachments_messageId ON chat_attachments("messageId");
    CREATE INDEX IF NOT EXISTS idx_quick_buy_chats_status ON quick_buy_chats(status);
    CREATE INDEX IF NOT EXISTS idx_quick_buy_chats_createdAt ON quick_buy_chats("createdAt" DESC);
    CREATE INDEX IF NOT EXISTS idx_quick_buy_chats_customerPhone ON quick_buy_chats("customerPhone");
    
    -- Admin presence index
    CREATE INDEX IF NOT EXISTS idx_admin_presence_isOnline ON admin_presence("isOnline");
  `;

  try {
    await pool.query(indexes);
    console.log('✅ Index ها ایجاد شدند');
  } catch (error) {
    console.error('❌ خطا در ایجاد Index ها:', error.message);
    throw error;
  }
}

/**
 * Add missing columns to existing tables
 */
async function addMissingColumns() {
  const addColumns = `
    ALTER TABLE products ADD COLUMN IF NOT EXISTS "airShippingCost" BIGINT;
    ALTER TABLE products ADD COLUMN IF NOT EXISTS "seaShippingCost" BIGINT;
  `;

  try {
    await pool.query(addColumns);
    console.log('✅ ستون‌های اضافی بررسی شدند');
  } catch (error) {
    // Ignore if table doesn't exist yet
    if (!error.message.includes('does not exist')) {
      console.warn('⚠️  هشدار در بررسی ستون‌ها:', error.message);
    }
  }
}

/**
 * Test database connection
 */
async function testConnection() {
  try {
    const result = await pool.query('SELECT NOW()');
    console.log('✅ اتصال به دیتابیس موفق بود');
    return true;
  } catch (error) {
    console.error('❌ خطا در اتصال به دیتابیس:', error.message);
    return false;
  }
}

/**
 * Main function
 */
async function main() {
  try {
    // Test connection
    console.log('\n📋 Step 1: Testing database connection...');
    const connected = await testConnection();
    if (!connected) {
      process.exit(1);
    }

    // Add missing columns
    console.log('\n📋 Step 2: Checking for missing columns...');
    await addMissingColumns();

    // Initialize tables
    console.log('\n📋 Step 3: Creating database tables...');
    await initializeTables();

    // Create indexes
    console.log('\n📋 Step 4: Creating indexes...');
    await createIndexes();

    console.log('\n' + '='.repeat(60));
    console.log('✅ راه‌اندازی دیتابیس با موفقیت انجام شد!');
    console.log('='.repeat(60));
  } catch (error) {
    console.error('\n❌ خطا در راه‌اندازی دیتابیس:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run main function
main();

