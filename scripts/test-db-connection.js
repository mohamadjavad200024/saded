/**
 * Test MySQL Connection
 * این اسکریپت اتصال به MySQL را تست می‌کند
 */

require('dotenv').config();
const mysql = require('mysql2/promise');

const config = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  database: process.env.DB_NAME || 'saded',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  connectTimeout: 5000,
};

console.log('🔍 Testing MySQL connection...\n');
console.log('Configuration:');
console.log(`  Host: ${config.host}`);
console.log(`  Port: ${config.port}`);
console.log(`  Database: ${config.database}`);
console.log(`  User: ${config.user}`);
console.log(`  Password: ${config.password ? '***' + config.password.slice(-4) : 'NOT SET'}\n`);

async function test() {
  let connection;
  try {
    console.log('⏳ Connecting...');
    connection = await mysql.createConnection(config);
    
    const [versionRows] = await connection.execute('SELECT VERSION() as version, DATABASE() as database, USER() as user');
    const version = versionRows[0];
    
    console.log('✅ Connection successful!\n');
    console.log('Database Info:');
    console.log(`  Version: ${version.version.split('-')[0]}`);
    console.log(`  Database: ${version.database || 'None'}`);
    console.log(`  User: ${version.user}\n`);
    
    // Check if tables exist
    const [tablesRows] = await connection.execute(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = ? 
      ORDER BY table_name
    `, [config.database]);
    
    console.log(`📊 Tables (${tablesRows.length}):`);
    if (tablesRows.length === 0) {
      console.log('  ⚠️  No tables found. Run setup-mysql first.');
    } else {
      tablesRows.forEach((row) => {
        console.log(`  - ${row.table_name}`);
      });
    }
    
    // Check products count
    try {
      const [productsRows] = await connection.execute('SELECT COUNT(*) as count FROM products');
      console.log(`\n📦 Products in database: ${productsRows[0].count}`);
    } catch (e) {
      console.log('\n⚠️  Products table does not exist');
    }
    
    await connection.end();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Connection failed!\n');
    console.error('Error details:');
    console.error(`  Message: ${error.message}`);
    console.error(`  Code: ${error.code || 'N/A'}\n`);
    
    if (error.code === 'ER_ACCESS_DENIED_ERROR' || error.code === 1045) {
      console.error('💡 This is a password authentication error.');
      console.error('   Please check your DB_PASSWORD in .env file.');
      console.error('   Or run: pnpm setup-mysql\n');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('💡 MySQL server is not running or not accessible.');
      console.error('   Please make sure MySQL is running.\n');
    } else if (error.code === 'ER_BAD_DB_ERROR' || error.code === 1049) {
      console.error('💡 Database does not exist.');
      console.error('   Please run: pnpm setup-mysql\n');
    }
    
    if (connection) {
      await connection.end();
    }
    process.exit(1);
  }
}

test();
