/**
 * Setup PostgreSQL password
 * This script helps set the password for PostgreSQL user
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
  console.log('🔐 PostgreSQL Password Setup\n');
  console.log('='.repeat(60));
  
  // Try to connect without password first (for fresh installs)
  console.log('\n📋 Step 1: Testing connection...\n');
  
  const passwordsToTry = [
    '', // No password (fresh install)
    'saded', // Our desired password
    'postgres', // Common default
    'admin', // Another common default
  ];
  
  let workingPassword = null;
  let workingConfig = null;
  
  for (const password of passwordsToTry) {
    const config = {
      host: 'localhost',
      port: 5432,
      database: 'postgres',
      user: 'postgres',
      password: password,
      connectionTimeoutMillis: 2000,
    };
    
    const pool = new Pool(config);
    
    try {
      await pool.query('SELECT 1');
      workingPassword = password;
      workingConfig = config;
      console.log(`✅ Connected with ${password ? `password: "${password}"` : 'no password'}`);
      break;
    } catch (error) {
      // Continue trying
    } finally {
      await pool.end();
    }
  }
  
  if (!workingPassword && workingPassword !== '') {
    console.log('❌ Could not connect with common passwords.');
    console.log('\nPlease enter your PostgreSQL password:');
    const password = await question('Password: ');
    workingPassword = password;
    workingConfig = {
      host: 'localhost',
      port: 5432,
      database: 'postgres',
      user: 'postgres',
      password: password,
    };
  }
  
  // If password is not 'saded', ask if user wants to change it
  if (workingPassword !== 'saded') {
    console.log('\n📋 Step 2: Setting password to "saded"...\n');
    
    const pool = new Pool(workingConfig);
    try {
      await pool.query(`ALTER USER postgres PASSWORD 'saded'`);
      console.log('✅ Password changed to "saded" successfully!');
    } catch (error) {
      console.error('❌ Error changing password:', error.message);
      console.log('\nYou can change it manually:');
      console.log('   psql -U postgres');
      console.log('   ALTER USER postgres PASSWORD \'saded\';');
      rl.close();
      process.exit(1);
    } finally {
      await pool.end();
    }
  } else {
    console.log('✅ Password is already "saded"');
  }
  
  // Test connection with new password
  console.log('\n📋 Step 3: Testing new password...\n');
  const testPool = new Pool({
    host: 'localhost',
    port: 5432,
    database: 'postgres',
    user: 'postgres',
    password: 'saded',
  });
  
  try {
    await testPool.query('SELECT 1');
    console.log('✅ Connection with new password successful!');
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    rl.close();
    process.exit(1);
  } finally {
    await testPool.end();
  }
  
  // Create database
  console.log('\n📋 Step 4: Creating database "saded"...\n');
  const createDbPool = new Pool({
    host: 'localhost',
    port: 5432,
    database: 'postgres',
    user: 'postgres',
    password: 'saded',
  });
  
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
  
  console.log('\n' + '='.repeat(60));
  console.log('🎉 PostgreSQL setup completed!');
  console.log('\n📝 Database Information:');
  console.log('   Database: saded');
  console.log('   User: postgres');
  console.log('   Password: saded');
  console.log('   Host: localhost');
  console.log('   Port: 5432');
  console.log('\n✅ You can now run: pnpm migrate-postgres\n');
  
  rl.close();
}

main().catch(error => {
  console.error('Error:', error);
  process.exit(1);
});

