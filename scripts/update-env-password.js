/**
 * Update DB_PASSWORD in .env file
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function main() {
  const envPath = path.join(__dirname, '..', '.env');
  
  console.log('🔐 Enter your MySQL password:');
  const password = await question('Password: ');
  
  // Read existing .env
  let content = '';
  if (fs.existsSync(envPath)) {
    content = fs.readFileSync(envPath, 'utf-8');
  }
  
  // Remove existing DB_PASSWORD lines
  const lines = content.split('\n').filter(line => {
    return !line.trim().startsWith('DB_PASSWORD=');
  });
  
  // Add new DB_PASSWORD
  lines.push(`DB_PASSWORD=${password}`);
  
  // Write back
  fs.writeFileSync(envPath, lines.join('\n') + '\n', 'utf-8');
  
  console.log('\n✅ .env file updated!');
  console.log('⚠️  Please restart your Next.js server (Ctrl+C then pnpm dev)\n');
  
  rl.close();
}

main();

