/**
 * MySQL Database Permissions Fix Script
 * 
 * این اسکریپت مشکل دسترسی دیتابیس را به صورت اصولی حل می‌کند
 * 
 * استفاده:
 * node scripts/fix-mysql-permissions.js
 * 
 * این اسکریپت:
 * 1. اتصال به MySQL را با root بررسی می‌کند
 * 2. کاربر را بررسی می‌کند (وجود دارد یا نه)
 * 3. دیتابیس را بررسی می‌کند (وجود دارد یا نه)
 * 4. دسترسی‌های لازم را می‌دهد
 * 5. اتصال را با کاربر جدید تست می‌کند
 */

const mysql = require('mysql2/promise');
const readline = require('readline');

// Create readline interface for password input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

// Load environment variables from ecosystem.config.js or process.env
const DB_CONFIG = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  database: process.env.DB_NAME || 'shop1111_saded',
  user: process.env.DB_USER || 'shop1111_saded_user',
  password: process.env.DB_PASSWORD || '',
  rootPassword: process.env.DB_ROOT_PASSWORD || '',
};

console.log('🔧 MySQL Database Permissions Fix Script\n');
console.log('='.repeat(60));
console.log('Configuration:');
console.log(`  Host: ${DB_CONFIG.host}`);
console.log(`  Port: ${DB_CONFIG.port}`);
console.log(`  Database: ${DB_CONFIG.database}`);
console.log(`  User: ${DB_CONFIG.user}`);
console.log(`  Password: ${DB_CONFIG.password ? '***SET***' : '❌ NOT SET'}`);
console.log('='.repeat(60));
console.log('');

async function main() {
  let rootConnection = null;
  let userConnection = null;

  try {
    // Step 1: Try to connect with root (if root password is provided)
    if (!DB_CONFIG.rootPassword) {
      console.log('⚠️  DB_ROOT_PASSWORD not set. Trying to connect with provided user...');
      console.log('   If this fails, you may need to provide root password.\n');
    } else {
      console.log('1️⃣ Connecting with root user...');
      rootConnection = await mysql.createConnection({
        host: DB_CONFIG.host,
        port: DB_CONFIG.port,
        user: 'root',
        password: DB_CONFIG.rootPassword,
      });
      console.log('   ✅ Connected with root\n');
    }

    // Step 2: Check if database exists
    console.log('2️⃣ Checking database...');
    const connection = rootConnection || await mysql.createConnection({
      host: DB_CONFIG.host,
      port: DB_CONFIG.port,
      user: DB_CONFIG.user,
      password: DB_CONFIG.password,
    });

    try {
      const [databases] = await connection.query(
        `SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = ?`,
        [DB_CONFIG.database]
      );

      if (databases.length === 0) {
        console.log(`   ⚠️  Database '${DB_CONFIG.database}' does not exist.`);
        if (rootConnection) {
          console.log('   🔨 Creating database...');
          await rootConnection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_CONFIG.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
          console.log('   ✅ Database created\n');
        } else {
          console.log('   ❌ Cannot create database without root access.');
          console.log('   💡 Please create the database manually or provide root password.\n');
        }
      } else {
        console.log(`   ✅ Database '${DB_CONFIG.database}' exists\n`);
      }
    } catch (error) {
      console.log(`   ⚠️  Could not check database: ${error.message}\n`);
    }

    await connection.end();

    // Step 3: Check if user exists (only if we have root access)
    if (rootConnection) {
      console.log('3️⃣ Checking user...');
      const [users] = await rootConnection.query(
        `SELECT User, Host FROM mysql.user WHERE User = ?`,
        [DB_CONFIG.user]
      );

      if (users.length === 0) {
        console.log(`   ⚠️  User '${DB_CONFIG.user}' does not exist.`);
        console.log('   🔨 Creating user...');
        
        // Create user with password
        await rootConnection.query(
          `CREATE USER IF NOT EXISTS ?@? IDENTIFIED BY ?`,
          [DB_CONFIG.user, 'localhost', DB_CONFIG.password]
        );
        
        // Also create user for % (any host) if needed
        await rootConnection.query(
          `CREATE USER IF NOT EXISTS ?@? IDENTIFIED BY ?`,
          [DB_CONFIG.user, '%', DB_CONFIG.password]
        );
        
        console.log('   ✅ User created\n');
      } else {
        console.log(`   ✅ User '${DB_CONFIG.user}' exists`);
        console.log('   📋 User hosts:');
        users.forEach(u => {
          console.log(`      - ${u.User}@${u.Host}`);
        });
        console.log('');
      }

      // Step 4: Grant permissions
      console.log('4️⃣ Granting permissions...');
      
      // Grant all privileges on the database
      await rootConnection.query(
        `GRANT ALL PRIVILEGES ON \`${DB_CONFIG.database}\`.* TO ?@?`,
        [DB_CONFIG.user, 'localhost']
      );
      
      await rootConnection.query(
        `GRANT ALL PRIVILEGES ON \`${DB_CONFIG.database}\`.* TO ?@?`,
        [DB_CONFIG.user, '%']
      );
      
      // Flush privileges
      await rootConnection.query('FLUSH PRIVILEGES');
      
      console.log('   ✅ Permissions granted\n');
    }

    // Step 5: Test connection with the user
    console.log('5️⃣ Testing connection with user...');
    
    try {
      userConnection = await mysql.createConnection({
        host: DB_CONFIG.host,
        port: DB_CONFIG.port,
        database: DB_CONFIG.database,
        user: DB_CONFIG.user,
        password: DB_CONFIG.password,
      });

      const [rows] = await userConnection.query('SELECT DATABASE() as db, USER() as user, NOW() as time');
      console.log('   ✅ Connection successful!');
      console.log(`   📊 Database: ${rows[0].db}`);
      console.log(`   👤 User: ${rows[0].user}`);
      console.log(`   ⏰ Time: ${rows[0].time}\n`);

      // Test a simple query
      try {
        await userConnection.query('SELECT 1 as test');
        console.log('   ✅ Query test successful\n');
      } catch (error) {
        console.log(`   ⚠️  Query test failed: ${error.message}\n`);
      }

    } catch (error) {
      console.log(`   ❌ Connection failed: ${error.message}`);
      console.log(`   Code: ${error.code}\n`);
      
      if (error.code === 'ER_ACCESS_DENIED_ERROR') {
        console.log('💡 Access denied error. Possible causes:');
        console.log('   1. Wrong password');
        console.log('   2. User does not have permission');
        console.log('   3. Host mismatch (localhost vs %)');
        console.log('');
        console.log('🔧 Solutions:');
        console.log('   1. Check password in ecosystem.config.js');
        console.log('   2. Run this script with root password:');
        console.log('      DB_ROOT_PASSWORD=your_root_password node scripts/fix-mysql-permissions.js');
        console.log('   3. Or manually grant permissions in MySQL:\n');
        console.log(`      GRANT ALL PRIVILEGES ON \`${DB_CONFIG.database}\`.* TO '${DB_CONFIG.user}'@'localhost';`);
        console.log(`      GRANT ALL PRIVILEGES ON \`${DB_CONFIG.database}\`.* TO '${DB_CONFIG.user}'@'%';`);
        console.log('      FLUSH PRIVILEGES;\n');
      }
    }

    // Step 6: Summary
    console.log('='.repeat(60));
    console.log('📋 Summary:');
    if (userConnection) {
      console.log('   ✅ Database connection is working correctly!');
      console.log('   ✅ All permissions are set correctly!');
    } else {
      console.log('   ⚠️  Database connection failed.');
      console.log('   💡 Please check the error messages above.');
    }
    console.log('='.repeat(60));

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('   Code:', error.code);
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('\n💡 This is an access denied error.');
      console.error('   Please check:');
      console.error('   1. Database credentials in ecosystem.config.js');
      console.error('   2. MySQL user permissions');
      console.error('   3. MySQL root password (if needed)');
    }
    process.exit(1);
  } finally {
    if (rootConnection) {
      await rootConnection.end();
    }
    if (userConnection) {
      await userConnection.end();
    }
    rl.close();
  }
}

main();

