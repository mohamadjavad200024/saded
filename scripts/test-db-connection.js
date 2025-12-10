/**
 * Test PostgreSQL Connection
 * این اسکریپت اتصال به PostgreSQL را تست می‌کند
 */

const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

// Read .env file manually
function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env');
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf-8');
    content.split('\n').forEach(line => {
      const match = line.match(/^([^=]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        const value = match[2].trim().replace(/^["']|["']$/g, '');
        process.env[key] = value;
      }
    });
  }
}

loadEnv();

const config = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'saded',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'saded',
  connectionTimeoutMillis: 5000,
};

console.log('🔍 Testing PostgreSQL connection...\n');
console.log('Configuration:');
console.log(`  Host: ${config.host}`);
console.log(`  Port: ${config.port}`);
console.log(`  Database: ${config.database}`);
console.log(`  User: ${config.user}`);
console.log(`  Password: ${config.password ? '***' + config.password.slice(-4) : 'NOT SET'}\n`);

const pool = new Pool(config);

async function test() {
  try {
    console.log('⏳ Connecting...');
    const result = await pool.query('SELECT version(), current_database(), current_user');
    
    console.log('✅ Connection successful!\n');
    console.log('Database Info:');
    console.log(`  Version: ${result.rows[0].version.split(',')[0]}`);
    console.log(`  Database: ${result.rows[0].current_database}`);
    console.log(`  User: ${result.rows[0].current_user}\n`);
    
    // Check if tables exist
    const tablesResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    console.log(`📊 Tables (${tablesResult.rows.length}):`);
    if (tablesResult.rows.length === 0) {
      console.log('  ⚠️  No tables found. Run migration first.');
    } else {
      tablesResult.rows.forEach(row => {
        console.log(`  - ${row.table_name}`);
      });
    }
    
    // Check products count
    try {
      const productsCount = await pool.query('SELECT COUNT(*) as count FROM products');
      console.log(`\n📦 Products in database: ${productsCount.rows[0].count}`);
    } catch (e) {
      console.log('\n⚠️  Products table does not exist');
    }
    
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Connection failed!\n');
    console.error('Error details:');
    console.error(`  Message: ${error.message}`);
    console.error(`  Code: ${error.code || 'N/A'}\n`);
    
    if (error.code === '28P01') {
      console.error('💡 This is a password authentication error.');
      console.error('   Please check your DB_PASSWORD in .env file.');
      console.error('   Or run: pnpm setup-postgres-retry\n');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('💡 PostgreSQL server is not running or not accessible.');
      console.error('   Please make sure PostgreSQL is running.\n');
    } else if (error.code === '3D000') {
      console.error('💡 Database does not exist.');
      console.error('   Please run: pnpm setup-postgres-retry\n');
    }
    
    await pool.end();
    process.exit(1);
  }
}

test();

