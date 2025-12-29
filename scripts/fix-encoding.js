/**
 * Fix Database Encoding Script
 * 
 * این اسکریپت تمام جداول دیتابیس را به utf8mb4_unicode_ci تبدیل می‌کند
 * تا مشکل نمایش کاراکترهای فارسی (????) حل شود
 * 
 * استفاده:
 * npm run fix-encoding
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
  charset: 'utf8mb4', // CRITICAL: Set charset for connection
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
};

console.log('🔧 Database Encoding Fix Script\n');
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
      console.error(`   CREATE DATABASE \`${DB_CONFIG.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
    } else if (error.code === 'ECONNREFUSED') {
      console.error('\n💡 MySQL سرور در حال اجرا نیست. لطفاً MySQL را راه‌اندازی کنید.');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('\n💡 خطا در احراز هویت. لطفاً نام کاربری و رمز عبور را بررسی کنید.');
    }
    return false;
  }
}

/**
 * Fix database encoding
 */
async function fixEncoding() {
  const pool = getPool();
  
  try {
    // First, set database charset
    console.log('\n📝 تنظیم charset دیتابیس...');
    await pool.execute(`ALTER DATABASE \`${DB_CONFIG.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    console.log('✅ charset دیتابیس تنظیم شد');
    
    // Get all tables
    console.log('\n📋 دریافت لیست جداول...');
    const [tables] = await pool.execute(`SHOW TABLES`);
    const tableNames = tables.map((row) => Object.values(row)[0]);
    console.log(`✅ ${tableNames.length} جدول پیدا شد:`, tableNames.join(', '));
    
    // Fix each table
    for (const tableName of tableNames) {
      console.log(`\n🔧 در حال تبدیل جدول: ${tableName}`);
      try {
        // Convert table charset
        await pool.execute(`ALTER TABLE \`${tableName}\` CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
        console.log(`   ✅ جدول ${tableName} تبدیل شد`);
        
        // Get all columns and fix their charset
        const [columns] = await pool.execute(`SHOW COLUMNS FROM \`${tableName}\``);
        for (const column of columns) {
          const columnName = column.Field;
          const columnType = column.Type;
          
          // Only fix TEXT, VARCHAR, CHAR columns
          if (columnType.includes('VARCHAR') || 
              columnType.includes('CHAR') || 
              columnType.includes('TEXT') ||
              columnType.includes('TINYTEXT') ||
              columnType.includes('MEDIUMTEXT') ||
              columnType.includes('LONGTEXT')) {
            try {
              await pool.execute(`ALTER TABLE \`${tableName}\` MODIFY \`${columnName}\` ${columnType} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
              console.log(`   ✅ ستون ${columnName} تبدیل شد`);
            } catch (error) {
              // Ignore errors for columns that can't be modified (e.g., primary keys with constraints)
              if (error.code !== 'ER_CANT_DROP_FIELD_OR_KEY' && 
                  error.code !== 'ER_DUP_FIELDNAME' &&
                  !error.message?.includes('Duplicate')) {
                console.warn(`   ⚠️  خطا در تبدیل ستون ${columnName}:`, error.message);
              }
            }
          }
        }
      } catch (error) {
        console.error(`   ❌ خطا در تبدیل جدول ${tableName}:`, error.message);
      }
    }
    
    console.log('\n✅ تمام جداول با موفقیت تبدیل شدند!');
    console.log('\n💡 اگر هنوز مشکل دارید، لطفاً:');
    console.log('   1. مطمئن شوید که connection charset درست است (utf8mb4)');
    console.log('   2. مطمئن شوید که API responses charset=utf-8 دارند');
    console.log('   3. مطمئن شوید که HTML meta charset درست است');
    
  } catch (error) {
    console.error('❌ خطا در تبدیل encoding:', error.message);
    throw error;
  }
}

/**
 * Main function
 */
async function main() {
  try {
    // Test connection
    const connected = await testConnection();
    if (!connected) {
      process.exit(1);
    }
    
    // Fix encoding
    await fixEncoding();
    
    // Close pool
    if (pool) {
      await pool.end();
    }
    
    console.log('\n✅ اسکریپت با موفقیت اجرا شد!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ خطا در اجرای اسکریپت:', error);
    if (pool) {
      await pool.end();
    }
    process.exit(1);
  }
}

// Run script
main();

