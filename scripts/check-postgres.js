/**
 * Check if PostgreSQL is installed and running
 */

const { Pool } = require('pg');

const DB_CONFIG = {
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  database: "postgres", // Connect to default postgres database first
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "saded",
  connectionTimeoutMillis: 2000,
};

console.log('🔍 Checking PostgreSQL...\n');

const pool = new Pool(DB_CONFIG);

pool.query('SELECT version()')
  .then(result => {
    console.log('✅ PostgreSQL is running!');
    console.log(`   Version: ${result.rows[0].version.split(' ')[0]} ${result.rows[0].version.split(' ')[1]}\n`);
    
    // Check if saded database exists
    return pool.query("SELECT 1 FROM pg_database WHERE datname = 'saded'");
  })
  .then(result => {
    if (result.rows.length > 0) {
      console.log('✅ Database "saded" already exists');
    } else {
      console.log('ℹ️  Database "saded" does not exist (will be created)');
    }
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Cannot connect to PostgreSQL!\n');
    console.error('Possible reasons:');
    console.error('   1. PostgreSQL is not installed');
    console.error('   2. PostgreSQL service is not running');
    console.error('   3. Wrong password (default: saded)');
    console.error('   4. PostgreSQL is not listening on port 5432\n');
    console.error('Error:', error.message);
    console.error('\n📥 To install PostgreSQL:');
    console.error('   Windows: https://www.postgresql.org/download/windows/');
    console.error('   Mac: brew install postgresql@16');
    console.error('   Linux: sudo apt-get install postgresql\n');
    process.exit(1);
  })
  .finally(() => {
    pool.end();
  });

