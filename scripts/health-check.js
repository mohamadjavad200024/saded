/**
 * Health Check Script
 * 
 * این اسکریپت سلامت سیستم را بررسی می‌کند
 * می‌تواند به عنوان endpoint برای monitoring استفاده شود
 * 
 * استفاده:
 * node scripts/health-check.js
 */

require('dotenv').config({ path: process.env.NODE_ENV === 'production' ? '.env.production' : '.env.local' });

const { Pool } = require('pg');

const DB_CONFIG = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'saded',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
};

async function checkDatabase() {
  const pool = new Pool(DB_CONFIG);
  try {
    const result = await pool.query('SELECT NOW()');
    await pool.end();
    return { status: 'ok', message: 'Database connection successful' };
  } catch (error) {
    await pool.end();
    return { status: 'error', message: error.message };
  }
}

async function checkEnvironment() {
  const requiredVars = [
    'DB_HOST',
    'DB_NAME',
    'DB_USER',
    'DB_PASSWORD',
    'NEXT_PUBLIC_URL',
  ];
  
  const missing = requiredVars.filter(varName => !process.env[varName]);
  
  if (missing.length > 0) {
    return {
      status: 'error',
      message: `Missing environment variables: ${missing.join(', ')}`,
    };
  }
  
  return { status: 'ok', message: 'All required environment variables are set' };
}

async function main() {
  console.log('🏥 Health Check\n');
  console.log('='.repeat(60));
  
  const results = {
    environment: await checkEnvironment(),
    database: await checkDatabase(),
  };
  
  console.log('\n📋 Results:');
  console.log(`Environment: ${results.environment.status === 'ok' ? '✅' : '❌'} ${results.environment.message}`);
  console.log(`Database: ${results.database.status === 'ok' ? '✅' : '❌'} ${results.database.message}`);
  
  const allOk = Object.values(results).every(r => r.status === 'ok');
  
  console.log('\n' + '='.repeat(60));
  if (allOk) {
    console.log('✅ همه بررسی‌ها موفق بود! سیستم سالم است.');
    process.exit(0);
  } else {
    console.log('❌ برخی بررسی‌ها ناموفق بود.');
    process.exit(1);
  }
}

main();

