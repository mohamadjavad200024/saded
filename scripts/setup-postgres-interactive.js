/**
 * Interactive PostgreSQL Setup
 * Asks for password and sets up everything
 */

const { Pool } = require('pg');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function testConnection(password) {
  const pool = new Pool({
    host: 'localhost',
    port: 5432,
    database: 'postgres',
    user: 'postgres',
    password: password,
    connectionTimeoutMillis: 2000,
  });
  
  try {
    await pool.query('SELECT 1');
    await pool.end();
    return true;
  } catch (error) {
    await pool.end();
    return false;
  }
}

async function main() {
  console.log('🚀 PostgreSQL Setup\n');
  console.log('='.repeat(60));
  console.log('\nPlease enter your PostgreSQL password for user "postgres":');
  console.log('(Press Enter to try common passwords)\n');
  
  let password = await question('Password: ');
  
  // If empty, try common passwords
  if (!password) {
    const commonPasswords = ['saded', 'postgres', 'admin', ''];
    console.log('\nTrying common passwords...\n');
    
    for (const pwd of commonPasswords) {
      console.log(`Trying ${pwd || '(no password)'}...`);
      if (await testConnection(pwd)) {
        password = pwd;
        console.log(`✅ Connected with ${pwd || 'no password'}!\n`);
        break;
      }
    }
    
    if (!password || !(await testConnection(password))) {
      console.log('\n❌ Could not connect with common passwords.');
      console.log('Please run this script again and enter your password manually.');
      rl.close();
      process.exit(1);
    }
  } else {
    // Test the entered password
    if (!(await testConnection(password))) {
      console.log('\n❌ Password incorrect. Please try again.');
      rl.close();
      process.exit(1);
    }
    console.log('✅ Password correct!\n');
  }
  
  const config = {
    host: 'localhost',
    port: 5432,
    database: 'postgres',
    user: 'postgres',
    password: password,
  };
  
  // Step 1: Create database
  console.log('📋 Step 1: Creating database "saded"...\n');
  
  const createDbPool = new Pool(config);
  try {
    const dbCheck = await createDbPool.query(
      "SELECT 1 FROM pg_database WHERE datname = 'saded'"
    );
    
    if (dbCheck.rows.length > 0) {
      console.log('✅ Database "saded" already exists');
    } else {
      await createDbPool.query('CREATE DATABASE saded');
      console.log('✅ Database "saded" created successfully');
    }
  } catch (error) {
    console.error('❌ Error creating database:', error.message);
    rl.close();
    process.exit(1);
  } finally {
    await createDbPool.end();
  }
  
  // Step 2: Initialize tables
  console.log('\n📋 Step 2: Creating tables...\n');
  
  // Set environment variable
  process.env.DB_PASSWORD = password;
  
  try {
    const { ensureDatabase, initializeTables } = require('../lib/db/postgres');
    await ensureDatabase();
    await initializeTables();
    console.log('✅ Tables created successfully');
  } catch (error) {
    console.error('❌ Error creating tables:', error.message);
    rl.close();
    process.exit(1);
  }
  
  // Step 3: Run migration
  console.log('\n📋 Step 3: Migrating data from JSON...\n');
  
  try {
    const { execSync } = require('child_process');
    execSync('npx tsx scripts/migrate-json-to-postgres.ts', {
      stdio: 'inherit',
      env: { ...process.env, DB_PASSWORD: password }
    });
  } catch (error) {
    console.error('\n⚠️  Migration had some issues, but database is set up.');
    console.log('You can run migration manually:');
    console.log(`   DB_PASSWORD=${password} pnpm migrate-postgres`);
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('🎉 PostgreSQL setup completed!\n');
  console.log('📝 Database Information:');
  console.log('   Database: saded');
  console.log('   User: postgres');
  console.log(`   Password: ${password || '(no password)'}`);
  console.log('   Host: localhost');
  console.log('   Port: 5432');
  console.log('\n💡 Create a .env file with:');
  console.log(`   DB_PASSWORD=${password}`);
  console.log('\n✅ All set! Your data is now in PostgreSQL.\n');
  
  rl.close();
}

main().catch(error => {
  console.error('Error:', error);
  rl.close();
  process.exit(1);
});

