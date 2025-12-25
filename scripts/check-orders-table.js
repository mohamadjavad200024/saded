/**
 * Script to check if orders table exists and its structure
 */

const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkOrdersTable() {
  let connection;
  
  try {
    // Create connection
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'saded',
      port: process.env.DB_PORT || 3306,
    });

    console.log('✅ Connected to database\n');

    // Check if orders table exists
    const [tables] = await connection.execute(
      "SHOW TABLES LIKE 'orders'"
    );

    if (tables.length === 0) {
      console.log('❌ Orders table does NOT exist!');
      console.log('\n📋 Available tables:');
      const [allTables] = await connection.execute('SHOW TABLES');
      allTables.forEach(table => {
        const tableName = Object.values(table)[0];
        console.log(`   - ${tableName}`);
      });
      return;
    }

    console.log('✅ Orders table exists\n');

    // Get table structure
    console.log('📋 Orders table structure:');
    const [columns] = await connection.execute('DESCRIBE orders');
    columns.forEach(col => {
      console.log(`   - ${col.Field}: ${col.Type} ${col.Null === 'YES' ? '(nullable)' : '(not null)'} ${col.Key ? `[${col.Key}]` : ''}`);
    });

    // Count orders
    const [countResult] = await connection.execute('SELECT COUNT(*) as count FROM orders');
    const orderCount = countResult[0].count;
    console.log(`\n📦 Total orders in database: ${orderCount}`);

    if (orderCount > 0) {
      // Get recent orders
      const [recentOrders] = await connection.execute(
        'SELECT id, orderNumber, userId, customerName, customerPhone, status, paymentStatus, createdAt FROM orders ORDER BY createdAt DESC LIMIT 5'
      );
      
      console.log('\n📋 Recent orders:');
      recentOrders.forEach((order, idx) => {
        console.log(`\n${idx + 1}. ${order.orderNumber}`);
        console.log(`   ID: ${order.id}`);
        console.log(`   userId: ${order.userId === null ? 'NULL' : order.userId}`);
        console.log(`   Customer: ${order.customerName} (${order.customerPhone})`);
        console.log(`   Status: ${order.status} | Payment: ${order.paymentStatus}`);
        console.log(`   Created: ${order.createdAt}`);
      });
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('\n⚠️  Database access denied. Please check your credentials in .env file.');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('\n⚠️  Cannot connect to database. Is MySQL running?');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.error('\n⚠️  Database does not exist. Please create it first.');
    }
    if (error.stack) {
      console.error('\nStack trace:');
      console.error(error.stack);
    }
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n✅ Connection closed');
    }
  }
}

checkOrdersTable();

