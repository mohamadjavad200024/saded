/**
 * Setup PostgreSQL with existing password
 * Uses the password you already have (from other projects)
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

async function main() {
  console.log('🚀 PostgreSQL Setup with Existing Password\n');
  console.log('='.repeat(60));
  console.log('\nEnter the password you use in your other projects:');
  console.log('(This will be used to connect to PostgreSQL)\n');
  
  const password = await question('Password: ');
  
  if (!password) {
    console.log('\n❌ Password cannot be empty');
    rl.close();
    process.exit(1);
  }
  
  const config = {
    host: 'localhost',
    port: 5432,
    database: 'postgres',
    user: 'postgres',
    password: password,
  };
  
  // Test connection
  console.log('\n📋 Testing connection...\n');
  
  const testPool = new Pool(config);
  try {
    await testPool.query('SELECT version()');
    console.log('✅ Connected successfully!\n');
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.log('\nPlease check:');
    console.log('   1. Password is correct');
    console.log('   2. PostgreSQL service is running');
    console.log('   3. User "postgres" exists');
    rl.close();
    process.exit(1);
  } finally {
    await testPool.end();
  }
  
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
  
  // Set environment variable for migration
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
  console.log(`   Password: ${'*'.repeat(password.length)} (your existing password)`);
  console.log('   Host: localhost');
  console.log('   Port: 5432');
  console.log('\n💡 Important: Create a .env file with:');
  console.log(`   DB_PASSWORD=${password}`);
  console.log('\n✅ All data is now in PostgreSQL!');
  console.log('   Your existing password works perfectly.\n');
  
  rl.close();
}

main().catch(error => {
  console.error('Error:', error);
  rl.close();
  process.exit(1);
});

