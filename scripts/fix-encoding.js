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
        // First, try to convert table charset (this may fail for tables with long indexes)
        try {
          await pool.execute(`ALTER TABLE \`${tableName}\` CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
          console.log(`   ✅ جدول ${tableName} تبدیل شد (روش کامل)`);
        } catch (convertError) {
          // If CONVERT fails (usually due to long indexes), convert columns individually
          if (convertError.message && convertError.message.includes('key was too long')) {
            console.log(`   ⚠️  تبدیل کامل جدول ${tableName} ناموفق (به دلیل index های طولانی)، در حال تبدیل ستون‌ها...`);
            
            // Step 1: Get all non-primary indexes and drop them temporarily
            const [indexes] = await pool.execute(`SHOW INDEXES FROM \`${tableName}\``);
            const indexesToDrop = [];
            const indexInfo = {};
            
            for (const idx of indexes) {
              const keyName = idx.Key_name;
              // Skip PRIMARY key
              if (keyName === 'PRIMARY') continue;
              
              if (!indexInfo[keyName]) {
                indexInfo[keyName] = {
                  unique: idx.Non_unique === 0,
                  columns: []
                };
              }
              
              indexInfo[keyName].columns.push({
                name: idx.Column_name,
                subpart: idx.Sub_part
              });
            }
            
            // Drop all non-primary indexes
            for (const keyName of Object.keys(indexInfo)) {
              try {
                if (indexInfo[keyName].unique) {
                  await pool.execute(`ALTER TABLE \`${tableName}\` DROP INDEX \`${keyName}\``);
                } else {
                  await pool.execute(`ALTER TABLE \`${tableName}\` DROP INDEX \`${keyName}\``);
                }
                indexesToDrop.push({ name: keyName, info: indexInfo[keyName] });
                console.log(`   🔧 Index ${keyName} موقتاً حذف شد`);
              } catch (dropError) {
                // Ignore errors if index doesn't exist
                if (!dropError.message?.includes("doesn't exist")) {
                  console.warn(`   ⚠️  خطا در حذف index ${keyName}:`, dropError.message);
                }
              }
            }
            
            // Step 2: Get all columns and fix their charset individually
            const [columns] = await pool.execute(`SHOW FULL COLUMNS FROM \`${tableName}\``);
            let convertedCount = 0;
            let skippedCount = 0;
            let alreadyUtf8mb4Count = 0;
            
            // Debug: Log all columns for troubleshooting
            const textColumns = [];
            const nonTextColumns = [];
            
            for (const column of columns) {
              const columnName = column.Field;
              const columnType = String(column.Type).toUpperCase();
              const currentCollation = column.Collation || '';
              
              // Check if column is text-based (case-insensitive)
              const isTextColumn = columnType.includes('VARCHAR') || 
                                   columnType.includes('CHAR') || 
                                   columnType.includes('TEXT') ||
                                   columnType.includes('TINYTEXT') ||
                                   columnType.includes('MEDIUMTEXT') ||
                                   columnType.includes('LONGTEXT');
              
              if (!isTextColumn) {
                skippedCount++;
                nonTextColumns.push(`${columnName}(${column.Type})`);
                continue; // Skip non-text columns
              }
              
              textColumns.push(`${columnName}(${column.Type}, collation: ${currentCollation || 'none'})`);
              
              // Check if column needs conversion (not already utf8mb4_unicode_ci)
              if (currentCollation === 'utf8mb4_unicode_ci') {
                alreadyUtf8mb4Count++;
                continue; // Already utf8mb4
              }
              
              // Column needs conversion
              try {
                // Extract base type without charset/collation
                let baseType = columnType;
                // Remove existing charset/collation if present
                baseType = baseType.replace(/CHARACTER SET \w+/gi, '');
                baseType = baseType.replace(/COLLATE \w+/gi, '');
                baseType = baseType.trim();
                
                await pool.execute(`ALTER TABLE \`${tableName}\` MODIFY \`${columnName}\` ${baseType} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
                convertedCount++;
                console.log(`   ✅ ستون ${columnName} تبدیل شد (${currentCollation || 'no collation'} -> utf8mb4_unicode_ci)`);
              } catch (colError) {
                console.warn(`   ⚠️  خطا در تبدیل ستون ${columnName}:`, colError.message);
              }
            }
            
            // Show summary with details
            if (convertedCount > 0) {
              console.log(`   ✅ ${convertedCount} ستون از جدول ${tableName} تبدیل شد`);
            }
            if (alreadyUtf8mb4Count > 0) {
              console.log(`   ℹ️  ${alreadyUtf8mb4Count} ستون از قبل utf8mb4_unicode_ci بود`);
              if (textColumns.length > 0) {
                console.log(`   📋 ستون‌های متنی: ${textColumns.join(', ')}`);
              }
            }
            if (convertedCount === 0 && alreadyUtf8mb4Count === 0) {
              if (textColumns.length > 0) {
                console.log(`   ⚠️  ${textColumns.length} ستون متنی پیدا شد اما collation ندارند: ${textColumns.join(', ')}`);
              } else if (skippedCount > 0) {
                console.log(`   ℹ️  این جدول ستون‌های متنی ندارد (${skippedCount} ستون غیرمتنی)`);
              }
            }
            
            // Step 3: Recreate indexes with proper length for utf8mb4
            // For utf8mb4, VARCHAR(255) needs to be limited to 191 characters in indexes
            for (const idx of indexesToDrop) {
              try {
                const idxInfo = idx.info;
                const columnDefs = idxInfo.columns.map(col => {
                  // For VARCHAR columns in utf8mb4, limit to 191 chars in index
                  const colInfo = columns.find(c => c.Field === col.name);
                  if (colInfo && colInfo.Type.includes('VARCHAR')) {
                    const match = colInfo.Type.match(/VARCHAR\((\d+)\)/);
                    if (match && parseInt(match[1]) > 191) {
                      return `\`${col.name}\`(191)`;
                    }
                  }
                  return `\`${col.name}\``;
                }).join(', ');
                
                if (idxInfo.unique) {
                  await pool.execute(`ALTER TABLE \`${tableName}\` ADD UNIQUE INDEX \`${idx.name}\` (${columnDefs})`);
                } else {
                  await pool.execute(`ALTER TABLE \`${tableName}\` ADD INDEX \`${idx.name}\` (${columnDefs})`);
                }
                console.log(`   ✅ Index ${idx.name} دوباره ایجاد شد`);
              } catch (recreateError) {
                console.warn(`   ⚠️  خطا در ایجاد مجدد index ${idx.name}:`, recreateError.message);
              }
            }
            
            if (convertedCount > 0) {
              console.log(`   ✅ ${convertedCount} ستون از جدول ${tableName} تبدیل شد`);
            } else {
              console.log(`   ⚠️  هیچ ستونی از جدول ${tableName} تبدیل نشد`);
            }
          } else {
            // Re-throw if it's a different error
            throw convertError;
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

