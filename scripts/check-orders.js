/**
 * Script to check orders in database and their userId values
 */

const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkOrders() {
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

    // Get all orders
    const [orders] = await connection.execute(
      'SELECT id, orderNumber, userId, customerName, customerPhone, status, paymentStatus, createdAt FROM orders ORDER BY createdAt DESC LIMIT 20'
    );

    console.log(`📦 Found ${orders.length} orders:\n`);

    if (orders.length === 0) {
      console.log('⚠️  No orders found in database!');
      return;
    }

    // Group by userId
    const ordersByUserId = {};
    const nullUserIdOrders = [];

    orders.forEach(order => {
      const userId = order.userId;
      if (userId === null || userId === undefined) {
        nullUserIdOrders.push(order);
      } else {
        if (!ordersByUserId[userId]) {
          ordersByUserId[userId] = [];
        }
        ordersByUserId[userId].push(order);
      }
    });

    console.log('📊 Orders by userId:');
    console.log(`   - Orders with null userId: ${nullUserIdOrders.length}`);
    Object.keys(ordersByUserId).forEach(userId => {
      console.log(`   - Orders with userId "${userId}": ${ordersByUserId[userId].length}`);
    });

    console.log('\n📋 Recent orders:');
    orders.slice(0, 10).forEach((order, index) => {
      console.log(`\n${index + 1}. Order: ${order.orderNumber}`);
      console.log(`   ID: ${order.id}`);
      console.log(`   userId: ${order.userId === null ? 'NULL' : `"${order.userId}" (type: ${typeof order.userId})`}`);
      console.log(`   Customer: ${order.customerName} - ${order.customerPhone}`);
      console.log(`   Status: ${order.status} | Payment: ${order.paymentStatus}`);
      console.log(`   Created: ${order.createdAt}`);
    });

    // Check users table
    console.log('\n👥 Users in database:');
    const [users] = await connection.execute(
      'SELECT id, name, phone, role FROM users LIMIT 10'
    );
    
    if (users.length === 0) {
      console.log('   ⚠️  No users found!');
    } else {
      users.forEach(user => {
        console.log(`   - ${user.name} (${user.phone}): id="${user.id}" (type: ${typeof user.id}), role=${user.role}`);
      });
    }

    // Check if there are orders with userId that don't match any user
    console.log('\n🔍 Checking for orphaned orders (orders with userId that don\'t match any user):');
    const userIdsInOrders = [...new Set(orders.map(o => o.userId).filter(id => id !== null))];
    
    if (userIdsInOrders.length > 0) {
      const [matchingUsers] = await connection.execute(
        `SELECT id FROM users WHERE id IN (${userIdsInOrders.map(() => '?').join(',')})`,
        userIdsInOrders
      );
      
      const matchingUserIds = new Set(matchingUsers.map(u => String(u.id)));
      const orphanedUserIds = userIdsInOrders.filter(id => !matchingUserIds.has(String(id)));
      
      if (orphanedUserIds.length > 0) {
        console.log(`   ⚠️  Found ${orphanedUserIds.length} orders with userId that don't match any user:`);
        orphanedUserIds.forEach(userId => {
          const ordersWithThisUserId = orders.filter(o => o.userId === userId);
          console.log(`      - userId "${userId}": ${ordersWithThisUserId.length} orders`);
        });
      } else {
        console.log('   ✅ All orders with userId have matching users');
      }
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.stack) {
      console.error(error.stack);
    }
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n✅ Connection closed');
    }
  }
}

checkOrders();

