/**
 * PostgreSQL Setup with Password Retry
 * 
 * این اسکریپت رمز را از شما می‌پرسد و اگر اشتباه بود، دوباره می‌پرسد
 * تا زمانی که رمز درست باشد یا شما cancel کنید
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
    await pool.query('SELECT version()');
    await pool.end();
    return true;
  } catch (error) {
    await pool.end();
    return false;
  }
}

async function getPassword() {
  let password = null;
  let attempts = 0;
  const maxAttempts = 10; // حداکثر 10 بار تلاش
  
  while (attempts < maxAttempts) {
    if (attempts === 0) {
      console.log('🔐 Please enter your PostgreSQL password:');
      console.log('   (Press Ctrl+C to cancel)\n');
    } else {
      console.log('❌ Password incorrect. Please try again.');
      console.log(`   (Attempt ${attempts + 1}/${maxAttempts})\n`);
    }
    
    const input = await question('Password: ');
    
    // اگر کاربر Enter بزند بدون تایپ کردن
    if (input === null || input === '') {
      console.log('\n⚠️  Password cannot be empty. Please try again.\n');
      attempts++;
      continue;
    }
    
    // تست کردن رمز
    process.stdout.write('   Testing connection... ');
    const isValid = await testConnection(input);
    
    if (isValid) {
      console.log('✅ Correct!\n');
      password = input;
      break;
    } else {
      console.log('❌ Failed\n');
      attempts++;
    }
  }
  
  return password;
}

async function main() {
  console.log('🚀 PostgreSQL Setup\n');
  console.log('='.repeat(60));
  console.log('\nThis script will:');
  console.log('   1. Ask for your PostgreSQL password');
  console.log('   2. Create database "saded"');
  console.log('   3. Create tables');
  console.log('   4. Migrate data from JSON files');
  console.log('\n' + '='.repeat(60));
  
  // Get password with retry
  const password = await getPassword();
  
  if (!password) {
    console.log('\n❌ Too many failed attempts. Please try again later.');
    console.log('   Or check your PostgreSQL password in pgAdmin.');
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
    // Create tables directly using SQL
    const tablesPool = new Pool({
      ...config,
      database: 'saded', // Connect to saded database
    });
    
    const createTablesSQL = `
      -- Products table
      CREATE TABLE IF NOT EXISTS products (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        price BIGINT NOT NULL,
        "originalPrice" BIGINT,
        brand VARCHAR(255) NOT NULL,
        category VARCHAR(255) NOT NULL,
        vin VARCHAR(255),
        "vinEnabled" BOOLEAN DEFAULT FALSE,
        "airShippingEnabled" BOOLEAN DEFAULT TRUE,
        "seaShippingEnabled" BOOLEAN DEFAULT TRUE,
        "airShippingCost" BIGINT,
        "seaShippingCost" BIGINT,
        "stockCount" INTEGER DEFAULT 0,
        "inStock" BOOLEAN DEFAULT TRUE,
        enabled BOOLEAN DEFAULT TRUE,
        images JSONB NOT NULL DEFAULT '[]'::jsonb,
        tags JSONB DEFAULT '[]'::jsonb,
        specifications JSONB DEFAULT '{}'::jsonb,
        "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
      );

      -- Categories table
      CREATE TABLE IF NOT EXISTS categories (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        description TEXT,
        slug VARCHAR(255) UNIQUE,
        image VARCHAR(255),
        icon VARCHAR(255),
        enabled BOOLEAN DEFAULT TRUE,
        "isActive" BOOLEAN DEFAULT TRUE,
        "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
      );

      -- Orders table
      CREATE TABLE IF NOT EXISTS orders (
        id VARCHAR(255) PRIMARY KEY,
        "orderNumber" VARCHAR(255) UNIQUE NOT NULL,
        "userId" VARCHAR(255),
        "customerName" VARCHAR(255) NOT NULL,
        "customerPhone" VARCHAR(255) NOT NULL,
        "customerEmail" VARCHAR(255),
        items JSONB NOT NULL DEFAULT '[]'::jsonb,
        total BIGINT NOT NULL,
        "shippingCost" BIGINT NOT NULL,
        "shippingMethod" VARCHAR(50) NOT NULL,
        "shippingAddress" JSONB NOT NULL DEFAULT '{}'::jsonb,
        status VARCHAR(50) NOT NULL DEFAULT 'pending',
        "paymentStatus" VARCHAR(50) NOT NULL DEFAULT 'pending',
        notes TEXT,
        "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
      );

      -- Users table
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(255) PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL DEFAULT 'user',
        phone VARCHAR(255),
        address TEXT,
        enabled BOOLEAN DEFAULT TRUE,
        "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
      );

      -- Create indexes
      CREATE INDEX IF NOT EXISTS idx_products_enabled ON products(enabled);
      CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
      CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand);
      CREATE INDEX IF NOT EXISTS idx_orders_userId ON orders("userId");
      CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
      CREATE INDEX IF NOT EXISTS idx_categories_enabled ON categories(enabled);
    `;
    
    await tablesPool.query(createTablesSQL);
    await tablesPool.end();
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
    console.log('   Running migration script...\n');
    execSync('npx tsx scripts/migrate-json-to-postgres.ts', {
      stdio: 'inherit',
      env: { ...process.env, DB_PASSWORD: password },
      cwd: process.cwd()
    });
    console.log('\n✅ Migration completed successfully!');
  } catch (error) {
    console.error('\n⚠️  Migration had some issues, but database is set up.');
    console.log('You can run migration manually:');
    console.log(`   DB_PASSWORD=${password} pnpm migrate-postgres`);
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('🎉 PostgreSQL setup completed successfully!\n');
  console.log('📝 Database Information:');
  console.log('   Database: saded');
  console.log('   User: postgres');
  console.log(`   Password: ${'*'.repeat(Math.min(password.length, 20))} (your password)`);
  console.log('   Host: localhost');
  console.log('   Port: 5432');
  console.log('\n💡 Important: Create a .env file with:');
  console.log(`   DB_PASSWORD=${password}`);
  console.log('\n✅ All data is now in PostgreSQL!');
  console.log('   New products will be saved directly to PostgreSQL.\n');
  
  rl.close();
}

// Handle Ctrl+C gracefully
process.on('SIGINT', () => {
  console.log('\n\n⚠️  Setup cancelled by user.');
  rl.close();
  process.exit(0);
});

main().catch(error => {
  console.error('\n❌ Error:', error.message);
  rl.close();
  process.exit(1);
});

