const mysql = require('mysql2/promise');

async function checkUsers() {
  let connection;
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'saded',
    });

    const [users] = await connection.execute(
      'SELECT id, name, phone, role, enabled FROM users WHERE role = "user" AND enabled = 1 LIMIT 5'
    );

    console.log('Users found:', users.length);
    if (users.length > 0) {
      console.log('\nFirst user:');
      console.log(JSON.stringify(users[0], null, 2));
    } else {
      console.log('\nNo users found. You need to register first.');
    }
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    if (connection) await connection.end();
  }
}

checkUsers();

