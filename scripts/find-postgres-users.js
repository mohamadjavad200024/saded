/**
 * Find PostgreSQL users and test connection
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

async function testConnection(user, password) {
  const pool = new Pool({
    host: 'localhost',
    port: 5432,
    database: 'postgres',
    user: user,
    password: password,
    connectionTimeoutMillis: 2000,
  });
  
  try {
    await pool.query('SELECT current_user, version()');
    await pool.end();
    return true;
  } catch (error) {
    await pool.end();
    return false;
  }
}

async function main() {
  console.log('🔍 Finding PostgreSQL Connection\n');
  console.log('='.repeat(60));
  
  // Common usernames
  const users = ['postgres', process.env.USERNAME, process.env.USER];
  
  console.log('\nTrying common usernames...\n');
  
  // Common passwords to try
  const passwords = [
    '', // No password
    'postgres',
    'admin',
    'saded',
    'saded1404',
    '123456',
    'password',
  ];
  
  let found = false;
  
  for (const user of users) {
    if (!user) continue;
    
    console.log(`Trying user: ${user}`);
    
    for (const password of passwords) {
      const pwdDisplay = password || '(no password)';
      process.stdout.write(`  Trying password: ${pwdDisplay}... `);
      
      if (await testConnection(user, password)) {
        console.log('✅ SUCCESS!');
        console.log(`\n✅ Found working credentials:`);
        console.log(`   User: ${user}`);
        console.log(`   Password: ${password || '(no password)'}`);
        console.log(`\nYou can now use these credentials.`);
        console.log(`\nRun: DB_USER=${user} DB_PASSWORD=${password} pnpm migrate-postgres`);
        found = true;
        break;
      } else {
        console.log('❌');
      }
    }
    
    if (found) break;
    console.log('');
  }
  
  if (!found) {
    console.log('\n❌ Could not find working credentials automatically.');
    console.log('\nPlease try:');
    console.log('   1. Open pgAdmin and check your connection settings');
    console.log('   2. Or enter your credentials manually:\n');
    
    const user = await question('PostgreSQL username (default: postgres): ') || 'postgres';
    const password = await question('PostgreSQL password: ');
    
    if (await testConnection(user, password)) {
      console.log('\n✅ Connection successful!');
      console.log(`\nRun: DB_USER=${user} DB_PASSWORD=${password} pnpm migrate-postgres`);
    } else {
      console.log('\n❌ Connection failed. Please check your credentials.');
    }
  }
  
  rl.close();
}

main().catch(error => {
  console.error('Error:', error);
  rl.close();
  process.exit(1);
});

