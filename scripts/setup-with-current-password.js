/**
 * Setup PostgreSQL with current password
 */

const { Pool } = require('pg');

const CURRENT_PASSWORD = 'saded1404'; // Password you entered
const DESIRED_PASSWORD = 'saded';

const config = {
  host: 'localhost',
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: CURRENT_PASSWORD,
};

console.log('🚀 Setting up PostgreSQL...\n');
console.log('='.repeat(60));

async function main() {
  // Step 1: Test connection with current password
  console.log('\n📋 Step 1: Testing connection with current password...\n');
  
  const testPool = new Pool(config);
  let connected = false;
  
  try {
    await testPool.query('SELECT version()');
    console.log('✅ Connected successfully!');
    connected = true;
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    process.exit(1);
  } finally {
    await testPool.end();
  }
  
  if (!connected) {
    process.exit(1);
  }
  
  // Step 2: Try to change password (optional)
  console.log('\n📋 Step 2: Changing password to "saded" (optional)...\n');
  
  const changePasswordPool = new Pool(config);
  try {
    await changePasswordPool.query(`ALTER USER postgres PASSWORD '${DESIRED_PASSWORD}'`);
    console.log('✅ Password changed to "saded"');
    config.password = DESIRED_PASSWORD;
  } catch (error) {
    console.log('⚠️  Could not change password (using current password)');
    console.log('   This is OK - we will use the current password');
  } finally {
    await changePasswordPool.end();
  }
  
  // Step 3: Create database
  console.log('\n📋 Step 3: Creating database "saded"...\n');
  
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
    process.exit(1);
  } finally {
    await createDbPool.end();
  }
  
  // Step 4: Initialize tables
  console.log('\n📋 Step 4: Creating tables...\n');
  
  // Set environment variable for migration
  process.env.DB_PASSWORD = config.password;
  
  try {
    // Import and run migration
    const { ensureDatabase, initializeTables } = require('../lib/db/postgres');
    await ensureDatabase();
    await initializeTables();
    console.log('✅ Tables created successfully');
  } catch (error) {
    console.error('❌ Error creating tables:', error.message);
    process.exit(1);
  }
  
  // Step 5: Run migration
  console.log('\n📋 Step 5: Migrating data from JSON...\n');
  
  try {
    const { execSync } = require('child_process');
    execSync('npx tsx scripts/migrate-json-to-postgres.ts', {
      stdio: 'inherit',
      env: { ...process.env, DB_PASSWORD: config.password }
    });
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.log('\nYou can run migration manually:');
    console.log('   DB_PASSWORD=' + config.password + ' pnpm migrate-postgres');
    process.exit(1);
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('🎉 PostgreSQL setup completed successfully!');
  console.log('\n📝 Database Information:');
  console.log('   Database: saded');
  console.log('   User: postgres');
  console.log(`   Password: ${config.password}`);
  console.log('   Host: localhost');
  console.log('   Port: 5432');
  console.log('\n💡 To use this password in your app, create a .env file:');
  console.log('   DB_PASSWORD=' + config.password);
  console.log('\n✅ All data is now in PostgreSQL!\n');
}

main().catch(error => {
  console.error('Error:', error);
  process.exit(1);
});

