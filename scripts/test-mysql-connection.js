/**
 * Test MySQL Connection
 * این اسکریپت اتصال به MySQL را تست می‌کند
 */

const mysql = require('mysql2/promise');

// Load environment variables from ecosystem.config.js or process.env
const DB_CONFIG = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  database: process.env.DB_NAME || 'shop1111_saded',
  user: process.env.DB_USER || 'shop1111_saded_user',
  password: process.env.DB_PASSWORD || '',
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
};

console.log('🔍 Testing MySQL connection...\n');
console.log('Configuration:');
console.log(`  Host: ${DB_CONFIG.host}`);
console.log(`  Port: ${DB_CONFIG.port}`);
console.log(`  Database: ${DB_CONFIG.database}`);
console.log(`  User: ${DB_CONFIG.user}`);
console.log(`  Password: ${DB_CONFIG.password ? '***' + DB_CONFIG.password.slice(-4) : 'NOT SET'}\n`);

async function test() {
  let connection = null;
  
  try {
    console.log('⏳ Connecting...');
    connection = await mysql.createConnection(DB_CONFIG);
    
    const [rows] = await connection.query('SELECT DATABASE() as db, USER() as user, VERSION() as version, NOW() as time');
    
    console.log('✅ Connection successful!\n');
    console.log('Database Info:');
    console.log(`  Version: ${rows[0].version}`);
    console.log(`  Database: ${rows[0].db}`);
    console.log(`  User: ${rows[0].user}`);
    console.log(`  Time: ${rows[0].time}\n`);
    
    // Check if tables exist
    try {
      const [tables] = await connection.query(`
        SELECT TABLE_NAME 
        FROM INFORMATION_SCHEMA.TABLES 
        WHERE TABLE_SCHEMA = ?
        ORDER BY TABLE_NAME
      `, [DB_CONFIG.database]);
      
      console.log(`📊 Tables (${tables.length}):`);
      if (tables.length === 0) {
        console.log('  ⚠️  No tables found.');
      } else {
        tables.slice(0, 10).forEach(table => {
          console.log(`  - ${table.TABLE_NAME}`);
        });
        if (tables.length > 10) {
          console.log(`  ... and ${tables.length - 10} more`);
        }
      }
    } catch (e) {
      console.log('\n⚠️  Could not list tables:', e.message);
    }
    
    // Test a simple query
    try {
      const [result] = await connection.query('SELECT 1 as test');
      console.log('\n✅ Query test successful');
    } catch (e) {
      console.log('\n⚠️  Query test failed:', e.message);
    }
    
    await connection.end();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Connection failed!\n');
    console.error('Error details:');
    console.error(`  Message: ${error.message}`);
    console.error(`  Code: ${error.code || 'N/A'}\n`);
    
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('💡 This is an access denied error.');
      console.error('   Possible causes:');
      console.error('   1. Wrong password');
      console.error('   2. User does not exist');
      console.error('   3. User does not have permission');
      console.error('   4. Host mismatch (localhost vs %)');
      console.error('');
      console.error('🔧 Solutions:');
      console.error('   1. Check password in ecosystem.config.js');
      console.error('   2. Run: node scripts/fix-mysql-permissions.js');
      console.error('   3. Or manually fix in MySQL:\n');
      console.error(`      GRANT ALL PRIVILEGES ON \`${DB_CONFIG.database}\`.* TO '${DB_CONFIG.user}'@'localhost';`);
      console.error(`      GRANT ALL PRIVILEGES ON \`${DB_CONFIG.database}\`.* TO '${DB_CONFIG.user}'@'%';`);
      console.error('      FLUSH PRIVILEGES;\n');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('💡 MySQL server is not running or not accessible.');
      console.error('   Please make sure MySQL is running.\n');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.error('💡 Database does not exist.');
      console.error(`   Please create database: ${DB_CONFIG.database}\n`);
    }
    
    if (connection) {
      await connection.end();
    }
    process.exit(1);
  }
}

test();

