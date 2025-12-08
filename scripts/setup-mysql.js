/**
 * MySQL Database Setup Script
 * 
 * این اسکریپت برای راه‌اندازی دیتابیس MySQL استفاده می‌شود
 * 
 * استفاده:
 * 1. مطمئن شوید که فایل .env با اطلاعات دیتابیس تنظیم شده است
 * 2. این اسکریپت را اجرا کنید: node scripts/setup-mysql.js
 * 
 * این اسکریپت:
 * - دیتابیس را ایجاد می‌کند (اگر وجود نداشته باشد)
 * - جداول دیتابیس را ایجاد می‌کند
 * - Index ها را ایجاد می‌کند
 */

// Try to load dotenv if available
try {
  require('dotenv').config();
} catch (e) {
  // dotenv not available, use environment variables directly
  console.log('Note: dotenv not found, using environment variables directly');
}

const mysql = require('mysql2/promise');

// Database configuration from environment variables
const DB_CONFIG = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  database: process.env.DB_NAME || 'saded',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
};

// Validate required environment variables
if (!DB_CONFIG.password) {
  console.error('❌ خطا: DB_PASSWORD در فایل .env تنظیم نشده است!');
  console.error('   لطفاً فایل .env را بررسی کنید.');
  process.exit(1);
}

console.log('🚀 MySQL Database Setup Script\n');
console.log('='.repeat(60));
console.log(`📊 Database: ${DB_CONFIG.database}`);
console.log(`🔗 Host: ${DB_CONFIG.host}:${DB_CONFIG.port}`);
console.log(`👤 User: ${DB_CONFIG.user}`);
console.log('='.repeat(60));

/**
 * Ensure database exists
 */
async function ensureDatabase() {
  // Connect without database first
  const adminConfig = {
    ...DB_CONFIG,
    database: undefined,
  };

  const connection = await mysql.createConnection(adminConfig);

  try {
    // Check if database exists
    const [rows] = await connection.execute(
      "SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = ?",
      [DB_CONFIG.database]
    );

    if (rows.length === 0) {
      // Create database
      await connection.execute(`CREATE DATABASE IF NOT EXISTS \`${DB_CONFIG.database}\``);
      console.log(`✅ Database '${DB_CONFIG.database}' created successfully`);
    } else {
      console.log(`✅ Database '${DB_CONFIG.database}' already exists`);
    }
  } catch (error) {
    console.error('❌ Error ensuring database:', error.message);
    throw error;
  } finally {
    await connection.end();
  }
}

/**
 * Initialize database tables
 */
async function initializeTables() {
  const pool = mysql.createPool({
    ...DB_CONFIG,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

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

    -- Carts table
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

    -- Chat Attachments table
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

    -- Admin Presence table
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
    const allStatements = createTables
      .split(';')
      .map(s => s.trim());
    
    // Debug: show all statements before filtering
    console.log(`📋 تعداد statements قبل از filter: ${allStatements.length}`);
    
    const statements = allStatements
      .filter(s => {
        // Keep statements that:
        // 1. Have content (length > 0)
        // 2. Don't start with -- (comments)
        // 3. Actually contain CREATE TABLE
        const hasContent = s.length > 0;
        const isComment = s.startsWith('--');
        const isCreateTable = s.toUpperCase().includes('CREATE TABLE');
        
        if (hasContent && !isComment && isCreateTable) {
          return true;
        }
        return false;
      });

    console.log(`📋 تعداد statements پیدا شده (CREATE TABLE): ${statements.length}`);
    
    let createdCount = 0;
    let errorCount = 0;
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.trim()) {
        try {
          // Debug: show first 50 chars of statement
          const isCreateTable = statement.toUpperCase().includes('CREATE TABLE');
          if (isCreateTable) {
            const tableName = statement.match(/CREATE TABLE IF NOT EXISTS\s+(\w+)/i)?.[1];
            console.log(`  🔄 در حال ایجاد جدول: ${tableName || 'نامشخص'}...`);
          }
          
          await pool.execute(statement);
          
          // Check if it's a CREATE TABLE statement
          if (isCreateTable) {
            createdCount++;
            const tableName = statement.match(/CREATE TABLE IF NOT EXISTS\s+(\w+)/i)?.[1];
            if (tableName) {
              console.log(`  ✓ جدول ${tableName} ایجاد شد`);
            }
          }
        } catch (stmtError) {
          errorCount++;
          const tableName = statement.match(/CREATE TABLE IF NOT EXISTS\s+(\w+)/i)?.[1];
          console.error(`❌ خطا در ایجاد جدول ${tableName || 'نامشخص'}:`, stmtError.message);
          console.error(`   کد خطا: ${stmtError.code || 'نامشخص'}`);
          console.error(`   Statement (اول 150 کاراکتر): ${statement.substring(0, 150)}...`);
          // Don't throw, continue with other statements
        }
      }
    }
    console.log(`✅ ${createdCount} جدول ایجاد شدند`);
    if (errorCount > 0) {
      console.log(`⚠️  ${errorCount} خطا در ایجاد جداول`);
    }
  } catch (error) {
    console.error('❌ خطا در ایجاد جداول:', error.message);
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
          await pool.execute(statement);
        } catch (indexError) {
          // Ignore "Duplicate key name" errors
          if (!indexError.message.includes("Duplicate key name")) {
            console.warn('⚠️  هشدار در ایجاد index:', statement.substring(0, 50), indexError.message);
          }
        }
      }
    }
    console.log('✅ Index ها ایجاد شدند');
  } catch (error) {
    console.warn('⚠️  هشدار در ایجاد Index ها:', error.message);
  }

  await pool.end();
}

/**
 * Test database connection
 */
async function testConnection() {
  try {
    const connection = await mysql.createConnection(DB_CONFIG);
    await connection.execute('SELECT NOW() as now');
    await connection.end();
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

    // Ensure database exists
    console.log('\n📋 Step 2: Ensuring database exists...');
    await ensureDatabase();

    // Initialize tables
    console.log('\n📋 Step 3: Creating database tables...');
    await initializeTables();

    console.log('\n' + '='.repeat(60));
    console.log('✅ راه‌اندازی دیتابیس با موفقیت انجام شد!');
    console.log('='.repeat(60));
  } catch (error) {
    console.error('\n❌ خطا در راه‌اندازی دیتابیس:', error);
    process.exit(1);
  }
}

// Run main function
main();

