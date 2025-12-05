/**
 * PostgreSQL Setup Script
 * 
 * این اسکریپت به صورت خودکار:
 * 1. بررسی می‌کند که PostgreSQL نصب است یا نه
 * 2. دیتابیس 'saded' را ایجاد می‌کند
 * 3. جداول را ایجاد می‌کند
 * 4. داده‌های JSON را منتقل می‌کند
 * 
 * مزایا:
 * - بدون نیاز به build کردن
 * - سریع و ساده
 * - قابل نگهداری
 */

const { execSync } = require('child_process');
const path = require('path');

console.log('🚀 PostgreSQL Setup Script\n');
console.log('='.repeat(60));

// Step 1: Check if PostgreSQL is installed
console.log('\n📋 Step 1: Checking PostgreSQL installation...');

let psqlPath = null;
const possiblePaths = [
  'psql', // In PATH
  'C:\\Program Files\\PostgreSQL\\16\\bin\\psql.exe',
  'C:\\Program Files\\PostgreSQL\\15\\bin\\psql.exe',
  'C:\\Program Files\\PostgreSQL\\14\\bin\\psql.exe',
  'C:\\Program Files\\PostgreSQL\\13\\bin\\psql.exe',
];

for (const psql of possiblePaths) {
  try {
    execSync(`${psql} --version`, { stdio: 'ignore' });
    psqlPath = psql;
    break;
  } catch (error) {
    // Continue searching
  }
}

if (!psqlPath) {
  console.error('\n❌ PostgreSQL not found!');
  console.error('\n📥 Please install PostgreSQL:');
  console.error('   1. Download: https://www.postgresql.org/download/windows/');
  console.error('   2. Install with default settings');
  console.error('   3. Remember the password you set (or use "saded" as password)');
  console.error('   4. Run this script again: pnpm setup-postgres');
  process.exit(1);
}

try {
  const version = execSync(`${psqlPath} --version`, { encoding: 'utf8' });
  console.log(`✅ Found: ${version.trim()}`);
} catch (error) {
  console.error('❌ Error checking PostgreSQL version');
  process.exit(1);
}

// Step 2: Check connection
console.log('\n📋 Step 2: Testing database connection...');

try {
  // Try to connect with default postgres user
  execSync(
    `${psqlPath} -U postgres -d postgres -c "SELECT 1;"`,
    { 
      stdio: 'ignore',
      env: { ...process.env, PGPASSWORD: 'saded' }
    }
  );
  console.log('✅ Connection successful');
} catch (error) {
  console.error('\n❌ Cannot connect to PostgreSQL!');
  console.error('\nPlease check:');
  console.error('   1. PostgreSQL service is running');
  console.error('   2. Password is correct (default: saded)');
  console.error('   3. User "postgres" exists');
  console.error('\nTo set password:');
  console.error('   psql -U postgres');
  console.error('   ALTER USER postgres PASSWORD \'saded\';');
  process.exit(1);
}

// Step 3: Create database if not exists
console.log('\n📋 Step 3: Creating database "saded"...');

try {
  // Check if database exists
  const dbCheck = execSync(
    `${psqlPath} -U postgres -d postgres -t -c "SELECT 1 FROM pg_database WHERE datname='saded';"`,
    { 
      encoding: 'utf8',
      env: { ...process.env, PGPASSWORD: 'saded' }
    }
  ).trim();

  if (dbCheck === '1') {
    console.log('✅ Database "saded" already exists');
  } else {
    // Create database
    execSync(
      `${psqlPath} -U postgres -d postgres -c "CREATE DATABASE saded;"`,
      { 
        stdio: 'inherit',
        env: { ...process.env, PGPASSWORD: 'saded' }
      }
    );
    console.log('✅ Database "saded" created successfully');
  }
} catch (error) {
  console.error('❌ Error creating database:', error.message);
  process.exit(1);
}

// Step 4: Run migration
console.log('\n📋 Step 4: Running migration...');
console.log('   This will create tables and import data from JSON files...\n');

try {
  execSync('npx tsx scripts/migrate-json-to-postgres.ts', {
    stdio: 'inherit',
    cwd: path.join(__dirname, '..')
  });
} catch (error) {
  console.error('\n❌ Migration failed!');
  console.error('   You can run it manually: pnpm migrate-postgres');
  process.exit(1);
}

console.log('\n' + '='.repeat(60));
console.log('🎉 PostgreSQL setup completed successfully!');
console.log('\n📝 Database Information:');
console.log('   Database: saded');
console.log('   User: postgres');
console.log('   Password: saded');
console.log('   Host: localhost');
console.log('   Port: 5432');
console.log('\n✅ All data is now in PostgreSQL!');
console.log('   New products will be saved directly to PostgreSQL.\n');

