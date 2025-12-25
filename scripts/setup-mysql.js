/**
 * MySQL Database Setup Script
 * 
 * این اسکریپت برای راه‌اندازی دیتابیس MySQL در محیط لوکال استفاده می‌شود
 * 
 * استفاده:
 * 1. مطمئن شوید که MySQL نصب و در حال اجرا است
 * 2. دیتابیس را ایجاد کنید: CREATE DATABASE saded;
 * 3. فایل .env.local را با اطلاعات دیتابیس تنظیم کنید
 * 4. این اسکریپت را اجرا کنید: npm run setup-mysql
 * 
 * این اسکریپت:
 * - جداول دیتابیس را ایجاد می‌کند
 * - Index ها را ایجاد می‌کند
 * - در صورت وجود جداول، آن‌ها را به‌روزرسانی می‌کند
 */

// Try to load dotenv if available
try {
  require('dotenv').config({ path: '.env.local' });
} catch (e) {
  // Try .env as fallback
  try {
    require('dotenv').config();
  } catch (e2) {
    console.log('Note: dotenv not found, using environment variables directly');
  }
}

const mysql = require('mysql2/promise');

// Database configuration from environment variables
const DB_CONFIG = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  database: process.env.DB_NAME || 'saded',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
};

console.log('🚀 MySQL Database Setup Script\n');
console.log('='.repeat(60));
console.log(`📊 Database: ${DB_CONFIG.database}`);
console.log(`🔗 Host: ${DB_CONFIG.host}:${DB_CONFIG.port}`);
console.log(`👤 User: ${DB_CONFIG.user}`);
console.log('='.repeat(60));

// Create connection pool
let pool = null;

/**
 * Get or create connection pool
 */
function getPool() {
  if (!pool) {
    pool = mysql.createPool({
      ...DB_CONFIG,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
  }
  return pool;
}

/**
 * Test database connection
 */
async function testConnection() {
  try {
    const testPool = getPool();
    const [rows] = await testPool.execute('SELECT NOW() as now, DATABASE() as db, USER() as user');
    console.log('✅ اتصال به دیتابیس موفق بود');
    console.log(`   Database: ${rows[0].db}`);
    console.log(`   User: ${rows[0].user}`);
    console.log(`   Time: ${rows[0].now}`);
    return true;
  } catch (error) {
    console.error('❌ خطا در اتصال به دیتابیس:', error.message);
    if (error.code === 'ER_BAD_DB_ERROR') {
      console.error('\n💡 دیتابیس وجود ندارد. لطفاً ابتدا دیتابیس را ایجاد کنید:');
      console.error(`   CREATE DATABASE \`${DB_CONFIG.database}\`;`);
    } else if (error.code === 'ECONNREFUSED') {
      console.error('\n💡 MySQL سرور در حال اجرا نیست. لطفاً MySQL را راه‌اندازی کنید.');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('\n💡 خطا در احراز هویت. لطفاً نام کاربری و رمز عبور را بررسی کنید.');
    }
    return false;
  }
}

/**
 * Initialize database tables
 * Converted from PostgreSQL to MySQL syntax
 */
async function initializeTables() {
  const createTables = `
    -- Products table
    CREATE TABLE IF NOT EXISTS products (
      id VARCHAR(255) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT NOT NULL,
      price BIGINT NOT NULL,
      \`originalPrice\` BIGINT,
      brand VARCHAR(255) NOT NULL,
      category VARCHAR(255) NOT NULL,
      vin VARCHAR(255),
      \`vinEnabled\` BOOLEAN DEFAULT FALSE,
      \`airShippingEnabled\` BOOLEAN DEFAULT TRUE,
      \`seaShippingEnabled\` BOOLEAN DEFAULT TRUE,
      \`airShippingCost\` BIGINT,
      \`seaShippingCost\` BIGINT,
      \`stockCount\` INTEGER DEFAULT 0,
      \`inStock\` BOOLEAN DEFAULT TRUE,
      enabled BOOLEAN DEFAULT TRUE,
      vehicle VARCHAR(255),
      model VARCHAR(255),
      images JSON NOT NULL DEFAULT ('[]'),
      tags JSON DEFAULT ('[]'),
      specifications JSON DEFAULT ('{}'),
      \`createdAt\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      \`updatedAt\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

    -- Vehicles table
    CREATE TABLE IF NOT EXISTS vehicles (
      id VARCHAR(255) PRIMARY KEY,
      name VARCHAR(255) NOT NULL UNIQUE,
      logo LONGTEXT,
      models JSON DEFAULT ('[]'),
      enabled BOOLEAN DEFAULT TRUE,
      \`createdAt\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      \`updatedAt\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
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
      \`isActive\` BOOLEAN DEFAULT TRUE,
      \`createdAt\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      \`updatedAt\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

    -- Orders table
    CREATE TABLE IF NOT EXISTS orders (
      id VARCHAR(255) PRIMARY KEY,
      \`orderNumber\` VARCHAR(255) UNIQUE NOT NULL,
      \`userId\` VARCHAR(255),
      \`customerName\` VARCHAR(255) NOT NULL,
      \`customerPhone\` VARCHAR(255) NOT NULL,
      \`customerEmail\` VARCHAR(255),
      items JSON NOT NULL DEFAULT ('[]'),
      total BIGINT NOT NULL,
      \`shippingCost\` BIGINT NOT NULL,
      \`shippingMethod\` VARCHAR(50) NOT NULL,
      \`shippingAddress\` JSON NOT NULL DEFAULT ('{}'),
      status VARCHAR(50) NOT NULL DEFAULT 'pending',
      \`paymentStatus\` VARCHAR(50) NOT NULL DEFAULT 'pending',
      notes TEXT,
      \`createdAt\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      \`updatedAt\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

    -- Users table
    CREATE TABLE IF NOT EXISTS users (
      id VARCHAR(255) PRIMARY KEY,
      email VARCHAR(255) UNIQUE,
      password VARCHAR(255) NOT NULL,
      name VARCHAR(255) NOT NULL,
      role VARCHAR(50) NOT NULL DEFAULT 'user',
      phone VARCHAR(255),
      address TEXT,
      enabled BOOLEAN DEFAULT TRUE,
      \`createdAt\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      \`updatedAt\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

    -- Carts table
    CREATE TABLE IF NOT EXISTS carts (
      id VARCHAR(255) PRIMARY KEY,
      \`sessionId\` VARCHAR(255) NOT NULL UNIQUE,
      \`userId\` VARCHAR(255),
      items JSON NOT NULL DEFAULT ('[]'),
      \`shippingMethod\` VARCHAR(50),
      \`createdAt\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      \`updatedAt\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

    -- Quick Buy Chats table
    CREATE TABLE IF NOT EXISTS quick_buy_chats (
      id VARCHAR(255) PRIMARY KEY,
      \`userId\` VARCHAR(255) NULL,
      \`customerName\` VARCHAR(255) NOT NULL,
      \`customerPhone\` VARCHAR(255) NOT NULL,
      \`customerEmail\` VARCHAR(255),
      status VARCHAR(50) NOT NULL DEFAULT 'active',
      \`createdAt\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      \`updatedAt\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

    -- Chat Messages table
    CREATE TABLE IF NOT EXISTS chat_messages (
      id VARCHAR(255) PRIMARY KEY,
      \`chatId\` VARCHAR(255) NOT NULL,
      \`userId\` VARCHAR(255) NULL,
      text TEXT,
      sender VARCHAR(50) NOT NULL,
      attachments JSON DEFAULT ('[]'),
      status VARCHAR(50) DEFAULT 'sent',
      \`createdAt\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      \`updatedAt\` TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (\`chatId\`) REFERENCES quick_buy_chats(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

    -- Chat Attachments table
    CREATE TABLE IF NOT EXISTS chat_attachments (
      id VARCHAR(255) PRIMARY KEY,
      \`messageId\` VARCHAR(255) NOT NULL,
      type VARCHAR(50) NOT NULL,
      \`filePath\` VARCHAR(500),
      \`fileName\` VARCHAR(255),
      \`fileSize\` BIGINT,
      \`fileUrl\` VARCHAR(500),
      \`createdAt\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (\`messageId\`) REFERENCES chat_messages(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

    -- Admin Presence table
    CREATE TABLE IF NOT EXISTS admin_presence (
      \`adminId\` VARCHAR(255) PRIMARY KEY,
      \`isOnline\` BOOLEAN DEFAULT FALSE,
      \`lastSeen\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      \`updatedAt\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

    -- Settings table for site-wide settings
    CREATE TABLE IF NOT EXISTS settings (
      id VARCHAR(255) PRIMARY KEY DEFAULT 'site_settings',
      \`siteName\` VARCHAR(255) NOT NULL DEFAULT 'ساد',
      \`siteDescription\` TEXT,
      \`logoUrl\` LONGTEXT,
      \`contactPhone\` VARCHAR(255),
      \`contactEmail\` VARCHAR(255),
      \`address\` TEXT,
      \`maintenanceMode\` BOOLEAN DEFAULT FALSE,
      \`allowRegistration\` BOOLEAN DEFAULT TRUE,
      \`emailNotifications\` BOOLEAN DEFAULT TRUE,
      \`lowStockThreshold\` INTEGER DEFAULT 10,
      \`itemsPerPage\` INTEGER DEFAULT 10,
      \`showNotifications\` BOOLEAN DEFAULT TRUE,
      \`theme\` VARCHAR(50) DEFAULT 'system',
      \`createdAt\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      \`updatedAt\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

    -- Insert default settings if not exists
    INSERT IGNORE INTO settings (id, \`siteName\`, \`siteDescription\`, \`lowStockThreshold\`, \`itemsPerPage\`)
    VALUES ('site_settings', 'ساد', 'فروشگاه آنلاین قطعات خودرو وارداتی', 10, 10);
  `;

  try {
    const connection = await getPool().getConnection();
    // Split by semicolon and execute each statement
    const statements = createTables.split(';').filter(s => s.trim().length > 0);
    for (const statement of statements) {
      const trimmed = statement.trim();
      if (trimmed.length > 0) {
        await connection.query(trimmed);
      }
    }
    connection.release();
    console.log('✅ جداول دیتابیس ایجاد شدند');
  } catch (error) {
    console.error('❌ خطا در ایجاد جداول:', error.message);
    if (error.code === 'ER_TABLE_EXISTS_ERROR') {
      console.log('ℹ️  برخی جداول از قبل وجود دارند (این طبیعی است)');
    } else {
      throw error;
    }
  }
}

/**
 * Create indexes
 * MySQL doesn't support IF NOT EXISTS for indexes, so we use error handling
 */
async function createIndexes() {
  const indexes = [
    // Products indexes
    { name: 'idx_products_enabled', sql: 'CREATE INDEX idx_products_enabled ON products(enabled)' },
    { name: 'idx_products_category', sql: 'CREATE INDEX idx_products_category ON products(category)' },
    { name: 'idx_products_brand', sql: 'CREATE INDEX idx_products_brand ON products(brand)' },
    { name: 'idx_products_enabled_category', sql: 'CREATE INDEX idx_products_enabled_category ON products(enabled, category)' },
    { name: 'idx_products_enabled_price', sql: 'CREATE INDEX idx_products_enabled_price ON products(enabled, price)' },
    { name: 'idx_products_vin_enabled', sql: 'CREATE INDEX idx_products_vin_enabled ON products(vin, `vinEnabled`)' },
    { name: 'idx_products_enabled_inStock', sql: 'CREATE INDEX idx_products_enabled_inStock ON products(enabled, `inStock`)' },
    
    // Orders indexes
    { name: 'idx_orders_userId', sql: 'CREATE INDEX idx_orders_userId ON orders(`userId`)' },
    { name: 'idx_orders_status', sql: 'CREATE INDEX idx_orders_status ON orders(status)' },
    { name: 'idx_orders_paymentStatus', sql: 'CREATE INDEX idx_orders_paymentStatus ON orders(`paymentStatus`)' },
    { name: 'idx_orders_status_paymentStatus', sql: 'CREATE INDEX idx_orders_status_paymentStatus ON orders(status, `paymentStatus`)' },
    { name: 'idx_orders_createdAt', sql: 'CREATE INDEX idx_orders_createdAt ON orders(`createdAt` DESC)' },
    
    // Categories indexes
    { name: 'idx_categories_enabled', sql: 'CREATE INDEX idx_categories_enabled ON categories(enabled)' },
    { name: 'idx_categories_enabled_active', sql: 'CREATE INDEX idx_categories_enabled_active ON categories(enabled, `isActive`)' },
    
    // Carts indexes
    { name: 'idx_carts_sessionId', sql: 'CREATE INDEX idx_carts_sessionId ON carts(`sessionId`)' },
    { name: 'idx_carts_userId', sql: 'CREATE INDEX idx_carts_userId ON carts(`userId`)' },
    
    // Chat indexes
    { name: 'idx_chat_messages_chatId', sql: 'CREATE INDEX idx_chat_messages_chatId ON chat_messages(`chatId`)' },
    { name: 'idx_chat_messages_createdAt', sql: 'CREATE INDEX idx_chat_messages_createdAt ON chat_messages(`createdAt`)' },
    { name: 'idx_chat_messages_chatId_createdAt', sql: 'CREATE INDEX idx_chat_messages_chatId_createdAt ON chat_messages(`chatId`, `createdAt` DESC)' },
    { name: 'idx_chat_messages_userId', sql: 'CREATE INDEX idx_chat_messages_userId ON chat_messages(`userId`)' },
    { name: 'idx_chat_attachments_messageId', sql: 'CREATE INDEX idx_chat_attachments_messageId ON chat_attachments(`messageId`)' },
    { name: 'idx_quick_buy_chats_status', sql: 'CREATE INDEX idx_quick_buy_chats_status ON quick_buy_chats(status)' },
    { name: 'idx_quick_buy_chats_createdAt', sql: 'CREATE INDEX idx_quick_buy_chats_createdAt ON quick_buy_chats(`createdAt` DESC)' },
    { name: 'idx_quick_buy_chats_customerPhone', sql: 'CREATE INDEX idx_quick_buy_chats_customerPhone ON quick_buy_chats(`customerPhone`)' },
    { name: 'idx_quick_buy_chats_userId', sql: 'CREATE INDEX idx_quick_buy_chats_userId ON quick_buy_chats(`userId`)' },
    
    // Admin presence index
    { name: 'idx_admin_presence_isOnline', sql: 'CREATE INDEX idx_admin_presence_isOnline ON admin_presence(`isOnline`)' },
  ];

  try {
    const connection = await getPool().getConnection();
    let created = 0;
    let skipped = 0;
    
    for (const index of indexes) {
      try {
        await connection.query(index.sql);
        created++;
      } catch (error) {
        // Index already exists
        if (error.code === 'ER_DUP_KEYNAME' || error.message.includes('Duplicate key name')) {
          skipped++;
        } else {
          console.warn(`⚠️  خطا در ایجاد index ${index.name}:`, error.message);
        }
      }
    }
    
    connection.release();
    console.log(`✅ Index ها ایجاد شدند (${created} ایجاد شد، ${skipped} از قبل وجود داشتند)`);
  } catch (error) {
    console.error('❌ خطا در ایجاد Index ها:', error.message);
    throw error;
  }
}

/**
 * Add missing columns to existing tables
 */
async function addMissingColumns() {
  const addColumns = [
    {
      table: 'products',
      column: 'airShippingCost',
      sql: 'ALTER TABLE products ADD COLUMN `airShippingCost` BIGINT'
    },
    {
      table: 'products',
      column: 'seaShippingCost',
      sql: 'ALTER TABLE products ADD COLUMN `seaShippingCost` BIGINT'
    },
    {
      table: 'quick_buy_chats',
      column: 'userId',
      sql: 'ALTER TABLE quick_buy_chats ADD COLUMN `userId` VARCHAR(255) NULL'
    },
    {
      table: 'chat_messages',
      column: 'userId',
      sql: 'ALTER TABLE chat_messages ADD COLUMN `userId` VARCHAR(255) NULL'
    },
    {
      table: 'chat_messages',
      column: 'status',
      sql: 'ALTER TABLE chat_messages ADD COLUMN status VARCHAR(50) DEFAULT \'sent\''
    },
    {
      table: 'chat_messages',
      column: 'updatedAt',
      sql: 'ALTER TABLE chat_messages ADD COLUMN `updatedAt` TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP'
    },
    {
      table: 'products',
      column: 'vehicle',
      sql: 'ALTER TABLE products ADD COLUMN `vehicle` VARCHAR(255) NULL'
    },
    {
      table: 'products',
      column: 'model',
      sql: 'ALTER TABLE products ADD COLUMN `model` VARCHAR(255) NULL'
    },
    {
      table: 'vehicles',
      column: 'logo',
      sql: 'ALTER TABLE vehicles MODIFY COLUMN logo LONGTEXT',
      isModify: true // Flag to indicate this is a MODIFY, not ADD
    },
  ];

  try {
    const connection = await getPool().getConnection();
    let added = 0;
    let skipped = 0;
    
    for (const col of addColumns) {
      try {
        if (col.isModify) {
          // For MODIFY operations, just execute the SQL
          await connection.query(col.sql);
          added++;
          console.log(`✅ Modified column ${col.table}.${col.column}`);
        } else {
          // Check if column exists
          const [columns] = await connection.query(
            `SELECT COLUMN_NAME, DATA_TYPE, CHARACTER_MAXIMUM_LENGTH 
             FROM INFORMATION_SCHEMA.COLUMNS 
             WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? AND COLUMN_NAME = ?`,
            [DB_CONFIG.database, col.table, col.column]
          );
          
          if (Array.isArray(columns) && columns.length === 0) {
            await connection.query(col.sql);
            added++;
          } else if (Array.isArray(columns) && columns.length > 0) {
            // Column exists, check if we need to modify it (for logo column)
            const existingCol = columns[0];
            if (col.column === 'logo' && col.table === 'vehicles' && 
                existingCol.DATA_TYPE === 'varchar' && existingCol.CHARACTER_MAXIMUM_LENGTH <= 500) {
              // Need to modify to LONGTEXT
              await connection.query('ALTER TABLE vehicles MODIFY COLUMN logo LONGTEXT');
              added++;
              console.log(`✅ Modified column ${col.table}.${col.column} to LONGTEXT`);
            } else {
              skipped++;
            }
          } else {
            skipped++;
          }
        }
      } catch (error) {
        if (error.code === 'ER_DUP_FIELDNAME' || error.message.includes('Duplicate column name')) {
          skipped++;
        } else {
          console.warn(`⚠️  خطا در افزودن/تغییر ستون ${col.table}.${col.column}:`, error.message);
        }
      }
    }
    
    connection.release();
    if (added > 0 || skipped > 0) {
      console.log(`✅ ستون‌های اضافی بررسی شدند (${added} افزوده شد، ${skipped} از قبل وجود داشتند)`);
    }
  } catch (error) {
    // Ignore if table doesn't exist yet
    if (!error.message.includes('does not exist')) {
      console.warn('⚠️  هشدار در بررسی ستون‌ها:', error.message);
    }
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
    console.log('✅ راه‌اندازی دیتابیس MySQL با موفقیت انجام شد!');
    console.log('='.repeat(60));
    console.log('\n💡 نکته: می‌توانید با دستور زیر اتصال را تست کنید:');
    console.log('   npm run test-mysql\n');
  } catch (error) {
    console.error('\n❌ خطا در راه‌اندازی دیتابیس:', error);
    process.exit(1);
  } finally {
    if (pool) {
      await pool.end();
    }
  }
}

// Run main function
main();









